<?php
// Simple email test script
header('Content-Type: text/plain');

$to = 'hello@middlez.com.au';
$subject = 'Test Email from Middle Z';
$message = 'This is a test email to verify email functionality.';
$headers = 'From: noreply@middlez.com.au';

echo "Testing email to: $to\n";
echo "From: noreply@middlez.com.au\n";
echo "Subject: $subject\n\n";

if (function_exists('mail')) {
    echo "PHP mail() function is available.\n";

    $result = mail($to, $subject, $message, $headers);

    if ($result) {
        echo "SUCCESS: Email sent successfully!\n";
    } else {
        echo "ERROR: Failed to send email.\n";
        $error = error_get_last();
        echo "Last error: " . print_r($error, true) . "\n";
    }
} else {
    echo "ERROR: PHP mail() function is not available.\n";
}

echo "\nServer info:\n";
echo "PHP Version: " . phpversion() . "\n";
echo "Server: " . ($_SERVER['SERVER_SOFTWARE'] ?? 'unknown') . "\n";
echo "Host: " . ($_SERVER['HTTP_HOST'] ?? 'unknown') . "\n";
?>