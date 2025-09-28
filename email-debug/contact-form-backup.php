<?php
// Alternative contact form using direct SMTP (backup solution)
ob_clean();
error_reporting(E_ALL);
ini_set('display_errors', 0);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

function debug_log($message) {
    error_log(date('[Y-m-d H:i:s] ') . "BACKUP: " . $message . PHP_EOL, 3, 'contact_debug.log');
}

debug_log("Backup contact form submission started");

$json_input = file_get_contents('php://input');
if (!$json_input) {
    echo json_encode(['success' => false, 'error' => 'No data received']);
    exit;
}

$input = json_decode($json_input, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
    exit;
}

// Basic validation
$name = htmlspecialchars(trim($input['name'] ?? ''), ENT_QUOTES, 'UTF-8');
$email = filter_var(trim($input['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$organization = htmlspecialchars(trim($input['organization'] ?? ''), ENT_QUOTES, 'UTF-8');
$challenge = htmlspecialchars(trim($input['challenge'] ?? ''), ENT_QUOTES, 'UTF-8');

if (empty($name) || empty($email) || empty($challenge)) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

// Try multiple delivery methods
$to = 'hello@middlez.com.au';
$subject = 'Contact Form Submission - Middle Z';
$timestamp = date('F j, Y \a\t g:i A T');

$email_body = "New Contact Form Submission\n\n";
$email_body .= "Name: $name\n";
$email_body .= "Email: $email\n";
if (!empty($organization)) {
    $email_body .= "Organization: $organization\n";
}
$email_body .= "\nChallenge:\n$challenge\n\n";
$email_body .= "Submitted: $timestamp\n";
$email_body .= "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n";

debug_log("Attempting backup delivery to: $to");

// Method 1: User's email as sender
$headers1 = "From: $name <$email>\r\nReply-To: $email\r\nReturn-Path: noreply@middlez.com\r\nContent-Type: text/plain; charset=UTF-8";
$result1 = mail($to, $subject, $email_body, $headers1);

debug_log("Method 1 (user sender): " . ($result1 ? "SUCCESS" : "FAILED"));

// Method 2: System sender with user in reply-to
$headers2 = "From: Middle Z Contact <noreply@middlez.com>\r\nReply-To: $name <$email>\r\nContent-Type: text/plain; charset=UTF-8";
$result2 = mail($to, $subject, $email_body, $headers2);

debug_log("Method 2 (system sender): " . ($result2 ? "SUCCESS" : "FAILED"));

// Method 3: Send to backup email as well
$backup_result = mail('daniel@mzconsulting.com.au', $subject . ' (Backup)', $email_body, $headers2);
debug_log("Backup email: " . ($backup_result ? "SUCCESS" : "FAILED"));

if ($result1 || $result2) {
    debug_log("Email delivery successful via backup form");
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message, ' . $name . '. We will get back to you within 24 hours!'
    ]);
} else {
    debug_log("All backup delivery methods failed");
    echo json_encode([
        'success' => false,
        'error' => 'Unable to send your message. Please email us directly at hello@middlez.com.au'
    ]);
}
?>