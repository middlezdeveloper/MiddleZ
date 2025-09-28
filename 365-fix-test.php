<?php
header('Content-Type: text/plain');

$timestamp = date('Y-m-d H:i:s');
echo "=== MICROSOFT 365 DELIVERY FIX TEST ===\n";
echo "Timestamp: $timestamp\n\n";

// Test with properly configured headers for 365 delivery
$to_365 = 'daniel@mzconsulting.com.au';
$to_gmail = 'middlezdeveloper@gmail.com';

// Proper headers for corporate email delivery
$proper_headers = [
    'From: Middle Z Contact Form <noreply@middlez.com>',
    'Reply-To: Test User <test@example.com>',
    'Return-Path: noreply@middlez.com',
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8',
    'X-Priority: 3 (Normal)',
    'Message-ID: <' . uniqid() . '@middlez.com>',
    'Date: ' . date('r')
];

$message = "Microsoft 365 Delivery Test - $timestamp\n\n";
$message .= "This email tests proper configuration for Microsoft 365 delivery.\n\n";
$message .= "From domain: middlez.com (has proper SPF record)\n";
$message .= "Server IP: 192.250.232.24 (authorized in SPF)\n";
$message .= "Headers: Corporate-standard format\n\n";
$message .= "If this arrives, the configuration is working!\n";

$headers_string = implode("\r\n", $proper_headers);

echo "Test 1: Microsoft 365 with proper headers\n";
$result1 = mail($to_365, "365 Delivery Test - $timestamp", $message, $headers_string);
echo "Result: " . ($result1 ? "SUCCESS" : "FAILED") . "\n\n";

echo "Test 2: Gmail comparison (should work)\n";
$result2 = mail($to_gmail, "365 Delivery Test - $timestamp", $message, $headers_string);
echo "Result: " . ($result2 ? "SUCCESS" : "FAILED") . "\n\n";

// Test with different subject (sometimes subject triggers filters)
echo "Test 3: Different subject line\n";
$business_message = "Contact Form Inquiry - $timestamp\n\n";
$business_message .= "Name: Test User\n";
$business_message .= "Email: test@example.com\n";
$business_message .= "Organization: Test Company\n\n";
$business_message .= "Message: This is a test contact form submission to verify email delivery is working properly.\n\n";
$business_message .= "Submitted: $timestamp\n";

$result3 = mail($to_365, "New Business Inquiry - $timestamp", $business_message, $headers_string);
echo "Result: " . ($result3 ? "SUCCESS" : "FAILED") . "\n\n";

echo "=== INSTRUCTIONS ===\n";
echo "1. Check daniel@mzconsulting.com.au for Test 1 and 3\n";
echo "2. Check middlezdeveloper@gmail.com for Test 2 (comparison)\n";
echo "3. Look for emails with timestamp: $timestamp\n";
echo "4. Check junk/spam folders if not in inbox\n";
echo "5. If Gmail works but 365 doesn't, proceed to safe sender setup\n";

echo "\n=== NEXT STEPS IF STILL BLOCKED ===\n";
echo "1. In Microsoft 365 Admin → Exchange Admin Center\n";
echo "2. Mail flow → Rules → New rule\n";
echo "3. Condition: Sender is 'noreply@middlez.com'\n";
echo "4. Action: Set spam confidence level to -1\n";
echo "5. Or add to organization safe senders list\n";
?>