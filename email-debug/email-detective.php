<?php
// Comprehensive email delivery detective
header('Content-Type: text/plain');

$timestamp = date('Y-m-d H:i:s');
echo "=== EMAIL DELIVERY DETECTIVE ===\n";
echo "Timestamp: $timestamp\n\n";

// Test 1: Send to daniel@mzconsulting.com.au (like contact form)
echo "Test 1: Exact contact form simulation\n";
$to1 = 'daniel@mzconsulting.com.au';
$subject1 = "Email Detective Test - $timestamp";
$message1 = "This is Test 1 - simulating exact contact form setup\n\nSent at: $timestamp\nFrom: middlez.com server";
$headers1 = "From: Middle Z Website <noreply@middlez.com>\r\nReply-To: test@example.com\r\nReturn-Path: noreply@middlez.com\r\nContent-Type: text/plain; charset=UTF-8";

$result1 = mail($to1, $subject1, $message1, $headers1);
echo "Result: " . ($result1 ? "SUCCESS" : "FAILED") . "\n\n";

// Test 2: Different sender domain
echo "Test 2: Different sender approach\n";
$headers2 = "From: Website Contact <noreply@mzconsulting.com.au>\r\nContent-Type: text/plain; charset=UTF-8";
$message2 = "This is Test 2 - using mzconsulting.com.au sender\n\nSent at: $timestamp";

$result2 = mail($to1, "Email Detective Test 2 - $timestamp", $message2, $headers2);
echo "Result: " . ($result2 ? "SUCCESS" : "FAILED") . "\n\n";

// Test 3: Multiple recipients to compare
echo "Test 3: Multiple recipients comparison\n";
$recipients = [
    'daniel@mzconsulting.com.au',
    'hello@middlez.com.au', // The forwarding address
    'gmiddlez@gmail.com' // Gmail test to rule out 365 issues
];

foreach ($recipients as $i => $email) {
    $num = $i + 1;
    $result = mail($email, "Multi-Test $num - $timestamp", "Test $num to $email\n\nSent at: $timestamp\n\nIf you receive this at Gmail, it proves the server can send emails successfully!", $headers1);
    echo "To $email: " . ($result ? "SUCCESS" : "FAILED") . "\n";
}

// Test 4: Gmail-specific test with different headers
echo "\nTest 4: Gmail-optimized headers\n";
$gmail_headers = "From: Middle Z Contact Test <noreply@middlez.com>\r\nReply-To: noreply@middlez.com\r\nContent-Type: text/plain; charset=UTF-8\r\nX-Mailer: PHP/" . phpversion();
$gmail_message = "Gmail Delivery Test - $timestamp\n\nThis email tests if the server can successfully deliver to Gmail.\n\nIf you receive this, the server email functionality is working perfectly!\n\nServer: middlez.com\nTime: $timestamp";

$result4 = mail('gmiddlez@gmail.com', "Gmail Delivery Test - $timestamp", $gmail_message, $gmail_headers);
echo "Gmail test result: " . ($result4 ? "SUCCESS" : "FAILED") . "\n";

echo "\n=== SERVER MAIL QUEUE CHECK ===\n";

// Check if there's a mail queue
$queue_commands = [
    'mailq',
    '/usr/bin/mailq',
    'postqueue -p',
    'exim -bp'
];

foreach ($queue_commands as $cmd) {
    if (shell_exec("which " . explode(' ', $cmd)[0] . " 2>/dev/null")) {
        echo "Checking mail queue with: $cmd\n";
        $output = shell_exec($cmd . " 2>&1");
        echo substr($output, 0, 500) . "\n";
        break;
    }
}

echo "\n=== MAIL LOG CHECK ===\n";
$log_files = [
    '/var/log/mail.log',
    '/var/log/maillog',
    '/var/log/exim4/mainlog',
    '/var/log/postfix.log'
];

foreach ($log_files as $log) {
    if (file_exists($log) && is_readable($log)) {
        echo "Checking $log (last 10 lines):\n";
        $output = shell_exec("tail -10 $log 2>&1");
        echo $output . "\n";
        break;
    }
}

echo "\n=== SYSTEM INFO ===\n";
echo "PHP mail function: " . (function_exists('mail') ? "Available" : "Not available") . "\n";
echo "Sendmail path: " . ini_get('sendmail_path') . "\n";
echo "SMTP: " . ini_get('SMTP') . "\n";

// Check DNS for the receiving domain
echo "\n=== DNS CHECK FOR RECEIVING DOMAIN ===\n";
$domain = 'mzconsulting.com.au';
$mx_records = [];
if (getmxrr($domain, $mx_records)) {
    echo "MX Records for $domain:\n";
    foreach ($mx_records as $mx) {
        echo "- $mx\n";
    }
} else {
    echo "No MX records found for $domain\n";
}

echo "\n=== INSTRUCTIONS ===\n";
echo "1. Check daniel@mzconsulting.com.au inbox for Test 1, 2, and 3\n";
echo "2. Check hello@middlez.com.au for Test 3\n";
echo "3. Check gmiddlez@gmail.com for Test 3 and 4 (Gmail delivery test)\n";
echo "4. Look for emails with timestamp: $timestamp\n";
echo "5. Check ALL folders including junk/spam in all accounts\n";
echo "6. If Gmail receives emails but 365 doesn't, it's a Microsoft filtering issue\n";
echo "7. If NO emails arrive anywhere, it's a server configuration issue\n";
?>