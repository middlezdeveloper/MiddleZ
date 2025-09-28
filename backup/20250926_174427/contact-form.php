<?php
// Clean output buffer to prevent any extra characters
ob_clean();

// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors to user, log them instead

// Prevent direct access if not POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Set headers FIRST before any output
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Log function for debugging
function debug_log($message) {
    error_log(date('[Y-m-d H:i:s] ') . $message . PHP_EOL, 3, 'contact_debug.log');
}

debug_log("Contact form submission started");

// Rate limiting (simple file-based approach)
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rate_limit_file = sys_get_temp_dir() . '/contact_form_' . md5($ip) . '.txt';

if (file_exists($rate_limit_file)) {
    $last_submission = (int)file_get_contents($rate_limit_file);
    if (time() - $last_submission < 60) { // 1 minute cooldown
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'error' => 'Please wait before submitting again'
        ]);
        exit;
    }
}

// Update rate limit file
file_put_contents($rate_limit_file, time());

// Get and validate JSON input
$json_input = file_get_contents('php://input');
debug_log("Raw input received: " . substr($json_input, 0, 200) . '...');

if (!$json_input) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'No data received'
    ]);
    exit;
}

$input = json_decode($json_input, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    debug_log("JSON decode error: " . json_last_error_msg());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid JSON data'
    ]);
    exit;
}

debug_log("Input decoded successfully");

// Validate required fields
$required_fields = ['name', 'email', 'challenge'];
$errors = [];

foreach ($required_fields as $field) {
    if (!isset($input[$field]) || trim($input[$field]) === '') {
        $errors[] = ucfirst($field) . ' is required';
    }
}

// Validate field lengths
if (isset($input['name']) && strlen(trim($input['name'])) < 2) {
    $errors[] = 'Name must be at least 2 characters';
}

if (isset($input['challenge']) && strlen(trim($input['challenge'])) < 10) {
    $errors[] = 'Challenge description must be at least 10 characters';
}

// Validate email format
if (isset($input['email']) && !filter_var(trim($input['email']), FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address';
}

// Check for potential spam patterns
$spam_patterns = ['/\b(viagra|cialis|casino|poker)\b/i', '/https?:\/\/[^\s]+/'];
$combined_text = implode(' ', array_values($input));

foreach ($spam_patterns as $pattern) {
    if (preg_match($pattern, $combined_text)) {
        debug_log("Spam detected in submission");
        $errors[] = 'Message contains prohibited content';
        break;
    }
}

// Return validation errors
if (!empty($errors)) {
    debug_log("Validation errors: " . implode(', ', $errors));
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Validation failed',
        'details' => $errors
    ]);
    exit;
}

// Sanitize input data
$name = htmlspecialchars(trim($input['name']), ENT_QUOTES, 'UTF-8');
$email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
$organization = isset($input['organization']) ? htmlspecialchars(trim($input['organization']), ENT_QUOTES, 'UTF-8') : '';
$challenge = htmlspecialchars(trim($input['challenge']), ENT_QUOTES, 'UTF-8');

debug_log("Data sanitized - preparing to send email");

// Check if mail function exists
if (!function_exists('mail')) {
    debug_log("ERROR: mail() function not available");
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Mail service not configured on this server'
    ]);
    exit;
}

// Email configuration
$to = 'hello@middlez.com';
$subject = 'New Contact Form Submission - Middle Z';
$from_domain = $_SERVER['HTTP_HOST'] ?? 'middlez.com';
$from_email = 'noreply@' . str_replace('www.', '', $from_domain);

debug_log("Sending email to: $to from: $from_email");

// Create email body (plain text for better deliverability)
$email_body = "New Contact Form Submission - Middle Z\n\n";
$email_body .= "Name: $name\n";
$email_body .= "Email: $email\n";
if (!empty($organization)) {
    $email_body .= "Organization: $organization\n";
}
$email_body .= "\nChallenge:\n$challenge\n\n";
$email_body .= "Submitted: " . date('F j, Y \a\t g:i A T') . "\n";
$email_body .= "IP Address: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";
$email_body .= "User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'unknown') . "\n";

// Email headers for better deliverability
$headers = [
    'From: Middle Z Contact Form <' . $from_email . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'Return-Path: ' . $from_email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8',
    'X-Priority: 1',
    'X-MSMail-Priority: High'
];

debug_log("Attempting to send email...");

// Attempt to send email
$mail_sent = mail($to, $subject, $email_body, implode("\r\n", $headers));

if ($mail_sent) {
    debug_log("Email sent successfully!");
    
    // Clean success response
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message, ' . $name . '. We will get back to you within 24 hours!'
    ]);
} else {
    $last_error = error_get_last();
    debug_log("Mail sending failed. Error: " . print_r($last_error, true));
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Unable to send your message at this time. Please try again or contact us directly.',
        'debug_info' => [
            'mail_function' => 'available',
            'php_version' => phpversion(),
            'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown'
        ]
    ]);
}

// Ensure no additional output
exit;
?>