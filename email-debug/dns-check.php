<?php
header('Content-Type: text/plain');

echo "=== DNS DIAGNOSTIC FOR EMAIL DELIVERY ===\n\n";

$domains = ['middlez.com', 'middlez.com.au', 'mzconsulting.com.au'];

foreach ($domains as $domain) {
    echo "=== $domain ===\n";

    // Check MX records
    $mx_records = [];
    if (getmxrr($domain, $mx_records)) {
        echo "MX Records:\n";
        foreach ($mx_records as $mx) {
            echo "  - $mx\n";
        }
    } else {
        echo "No MX records found\n";
    }

    // Check SPF records (TXT records)
    $txt_records = dns_get_record($domain, DNS_TXT);
    echo "\nTXT Records (SPF/DKIM):\n";
    if ($txt_records) {
        foreach ($txt_records as $record) {
            if (isset($record['txt'])) {
                echo "  - " . $record['txt'] . "\n";
            }
        }
    } else {
        echo "  No TXT records found\n";
    }

    echo "\n";
}

// Get server IP for SPF record
echo "=== SERVER INFO FOR SPF SETUP ===\n";
echo "Server IP: " . ($_SERVER['SERVER_ADDR'] ?? 'unknown') . "\n";
echo "Server Name: " . ($_SERVER['SERVER_NAME'] ?? 'unknown') . "\n";

// Test what IP emails are sent from
$headers = 'From: test@middlez.com';
$test_sent = mail('middlezdeveloper@gmail.com', 'Server IP Test', 'This email tests what IP the server sends from. Check email headers for originating IP.', $headers);
echo "IP test email sent: " . ($test_sent ? "SUCCESS" : "FAILED") . "\n";

echo "\n=== RECOMMENDED SPF RECORD ===\n";
echo "Add this TXT record to middlez.com DNS:\n";
echo "Name: @ (or middlez.com)\n";
echo "Type: TXT\n";
echo "Value: v=spf1 mx a include:_spf.google.com ~all\n";
echo "\nThis allows:\n";
echo "- MX servers to send email\n";
echo "- A record servers to send email\n";
echo "- Google servers (if using Gmail/Workspace)\n";
echo "- Soft fail (~all) for other servers\n";
?>