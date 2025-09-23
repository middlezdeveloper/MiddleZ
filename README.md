# MiddleZ Website

This repository contains the website files for MiddleZ, connected to cPanel hosting with automatic deployment.

## Repository Setup

This repository is configured to automatically deploy to your cPanel hosting when changes are pushed to the main branch.

## Deployment Setup

To enable automatic deployment to cPanel, you need to configure the following secrets in your GitHub repository:

1. Go to your GitHub repository: https://github.com/middlezdeveloper/MiddleZ
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Add the following repository secrets:

   - `FTP_SERVER`: Your cPanel FTP server (e.g., ftp.yourdomain.com)
   - `FTP_USERNAME`: Your cPanel FTP username
   - `FTP_PASSWORD`: Your cPanel FTP password

## How to Deploy Changes

1. Make changes to your files locally
2. Commit and push changes to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
3. GitHub Actions will automatically deploy your changes to cPanel

## File Structure

- `index.html` - Main website homepage
- `contact-form.php` - Contact form handler
- `.htaccess` - Server configuration
- `images/` - Website images
- `archive/` - Archived files
- `.github/workflows/` - GitHub Actions deployment configuration

## Local Development

To work on this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/middlezdeveloper/MiddleZ.git
   cd MiddleZ
   ```

2. Make your changes
3. Test locally if needed
4. Commit and push to deploy

## Support

For deployment issues, check the GitHub Actions tab in your repository to see deployment logs.