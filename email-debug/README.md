# Email Debug Tools

This folder contains diagnostic and testing scripts used to troubleshoot email delivery issues with the Middle Z contact form.

## Files:

### **365-fix-test.php**
- Tests Microsoft 365 email delivery with proper headers
- Sends test emails to both Microsoft 365 and Gmail for comparison
- Used to verify safe sender rules

### **check-form.php**
- Diagnostic script to check live contact form configuration
- Shows current email recipient, code version, and recent logs
- Verifies if updates are properly deployed

### **contact-form-backup.php**
- Alternative contact form with multiple delivery methods
- Tests different sender configurations
- Backup solution during troubleshooting

### **dns-check.php**
- Analyzes DNS records for email delivery
- Checks SPF records, MX records, and server configuration
- Provides SPF setup recommendations

### **email-detective.php**
- Comprehensive email delivery testing suite
- Tests multiple recipients and configurations
- Includes server diagnostics and mail queue analysis

### **test-email.php**
- Simple email functionality testing
- Tests basic SMTP configuration
- Includes server information and DNS checks

## Issue Resolution Summary:

**Problem:** Microsoft 365 was silently blocking emails from the contact form despite proper SPF records and safe sender rules.

**Solution:** Implemented dual delivery system - contact form now sends to both Microsoft 365 (primary) and Gmail (backup) to ensure reliable delivery.

**Current Status:** Contact form working reliably with Gmail delivery guaranteed.

---

*These tools can be used for future email troubleshooting or removed if no longer needed.*