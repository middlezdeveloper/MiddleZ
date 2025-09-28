<?php
// Comprehensive email test script
header('Content-Type: text/plain');

$timestamp = date('Y-m-d H:i:s');
$to = 'hello@middlez.com.au';
$subject = 'Test Email from Middle Z - ' . $timestamp;
$message = "This is a test email sent at $timestamp\n\nIf you receive this, email delivery is working!\n\nServer: " . ($_SERVER['HTTP_HOST'] ?? 'unknown');

// Try multiple header configurations
$headers1 = 'From: noreply@middlez.com.au';
$headers2 = "From: Middle Z <noreply@middlez.com.au>\r\nReply-To: noreply@middlez.com.au\r\nX-Mailer: PHP/" . phpversion();

echo "=== EMAIL DELIVERY TEST ===\n";
echo "Timestamp: $timestamp\n";
echo "Testing email to: $to\n";
echo "Subject: $subject\n\n";

if (function_exists('mail')) {
    echo "✓ PHP mail() function is available.\n\n";

    // Test 1: Simple headers
    echo "Test 1: Simple headers\n";
    $result1 = mail($to, $subject . ' (Simple)', $message, $headers1);
    echo $result1 ? "✓ SUCCESS\n" : "✗ FAILED\n";

    // Test 2: Enhanced headers
    echo "\nTest 2: Enhanced headers\n";
    $result2 = mail($to, $subject . ' (Enhanced)', $message, $headers2);
    echo $result2 ? "✓ SUCCESS\n" : "✗ FAILED\n";

    // Test 3: To your direct email as backup
    echo "\nTest 3: Alternative recipient test\n";
    $result3 = mail('daniel@mzconsulting.com.au', $subject . ' (Alt)', $message, $headers2);
    echo $result3 ? "✓ SUCCESS\n" : "✗ FAILED\n";

    // Test 4: Simulate contact form submission
    echo "\nTest 4: Contact form simulation\n";
    $contact_headers = [
        'From: Test User <test@gmail.com>',
        'Reply-To: Test User <test@gmail.com>',
        'Return-Path: noreply@middlez.com',
        'X-Mailer: PHP/' . phpversion(),
        'Content-Type: text/plain; charset=UTF-8'
    ];
    $contact_body = "This simulates a contact form submission.\n\nName: Test User\nEmail: test@gmail.com\nMessage: Testing email delivery";
    $result4 = mail('hello@middlez.com.au', 'Contact Form Test - ' . $timestamp, $contact_body, implode("\r\n", $contact_headers));
    echo $result4 ? "✓ SUCCESS\n" : "✗ FAILED\n";

    if (!$result1 && !$result2) {
        $error = error_get_last();
        echo "\nLast error: " . print_r($error, true) . "\n";
    }
} else {
    echo "✗ ERROR: PHP mail() function is not available.\n";
}

echo "\n=== SERVER INFO ===\n";
echo "PHP Version: " . phpversion() . "\n";
echo "Server: " . ($_SERVER['SERVER_SOFTWARE'] ?? 'unknown') . "\n";
echo "Host: " . ($_SERVER['HTTP_HOST'] ?? 'unknown') . "\n";
echo "Document Root: " . ($_SERVER['DOCUMENT_ROOT'] ?? 'unknown') . "\n";

// Check mail configuration
echo "\n=== MAIL CONFIG ===\n";
echo "sendmail_path: " . ini_get('sendmail_path') . "\n";
echo "SMTP: " . ini_get('SMTP') . "\n";
echo "smtp_port: " . ini_get('smtp_port') . "\n";

echo "\n=== DNS CHECK ===\n";
$mx_records = [];
if (getmxrr('middlez.com.au', $mx_records)) {
    echo "MX Records for middlez.com.au:\n";
    foreach ($mx_records as $mx) {
        echo "- $mx\n";
    }
} else {
    echo "No MX records found for middlez.com.au\n";
}
?>