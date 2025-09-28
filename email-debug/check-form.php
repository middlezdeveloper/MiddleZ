<?php
header('Content-Type: text/plain');

echo "=== CONTACT FORM DEBUG INFO ===\n";
echo "Current time: " . date('Y-m-d H:i:s') . "\n";
echo "File location: " . __FILE__ . "\n";
echo "File modified: " . date('Y-m-d H:i:s', filemtime('contact-form.php')) . "\n\n";

echo "=== CURRENT CONFIG IN CONTACT-FORM.PHP ===\n";
$content = file_get_contents('contact-form.php');

// Extract the $to variable
if (preg_match('/\$to = [\'"]([^\'"]+)[\'"];/', $content, $matches)) {
    echo "Recipient email: " . $matches[1] . "\n";
} else {
    echo "Could not find recipient email\n";
}

// Check for our update marker
if (strpos($content, 'EMAIL CONFIG UPDATE v2') !== false) {
    echo "✓ Updated code detected\n";
} else {
    echo "✗ Old code still running\n";
}

// Check for .com.au
if (strpos($content, '.com.au') !== false) {
    echo "✓ .com.au domain found\n";
} else {
    echo "✗ .com.au domain not found\n";
}

echo "\n=== RECENT DEBUG LOG ENTRIES ===\n";
if (file_exists('contact_debug.log')) {
    $log = file_get_contents('contact_debug.log');
    $lines = explode("\n", $log);
    $recent = array_slice($lines, -5);
    foreach ($recent as $line) {
        if (!empty(trim($line))) echo $line . "\n";
    }
} else {
    echo "No debug log found\n";
}
?>