# Deployment Guide - Middle Z Survey System

## Quick Start Deployment to Vercel

### 1. Prerequisites

- GitHub account
- Vercel account (free tier works)
- SMTP email credentials (Gmail recommended)

### 2. Push to GitHub

```bash
cd /path/to/survey-app
git init
git add .
git commit -m "Initial survey system setup"
git remote add origin https://github.com/YOUR-USERNAME/middlez-survey.git
git push -u origin main
```

### 3. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. **Important**: Set root directory to `survey-app`
5. Click "Deploy"

### 4. Set Up Database

**Option A: Vercel Postgres (Recommended)**

1. In Vercel dashboard → Storage → Create Database
2. Select "Postgres"
3. Click "Create"
4. Copy connection string
5. Go to Settings → Environment Variables
6. Add `DATABASE_URL` with the connection string

**Option B: Supabase (Free Alternative)**

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database → Connection String
4. Copy the connection pooler string
5. Add to Vercel environment variables

### 5. Configure Environment Variables

In Vercel → Settings → Environment Variables, add:

```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=run-openssl-rand-base64-32
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-gmail@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@middlez.com
```

**For Gmail App Password:**
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Search "App passwords"
4. Generate password for "Mail"
5. Use this password in `EMAIL_SERVER_PASSWORD`

### 6. Run Database Setup

After deployment, set up the database:

```bash
# Install Vercel CLI
npm install -g vercel

# Link to project
vercel link

# Run Prisma commands
vercel env pull .env.local
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 7. Custom Domain Setup (survey.middlez.com)

**In your DNS provider (where middlez.com is hosted):**

Add CNAME record:
```
Type: CNAME
Name: survey
Value: cname.vercel-dns.com
TTL: 3600
```

**In Vercel:**
1. Go to Settings → Domains
2. Add domain: `survey.middlez.com`
3. Wait for DNS propagation (5-10 minutes)
4. Update `NEXTAUTH_URL` environment variable to `https://survey.middlez.com`
5. Redeploy

### 8. Create Your First Survey

**Via Database UI (Recommended - Supabase):**
1. Open Supabase project → Table Editor
2. Open `survey_projects` table
3. Insert new row:
   - id: `my-first-project`
   - projectName: `Digital Transformation Engagement`
   - clientName: `Test Client`
   - engagementType: `Consulting`
   - isActive: `true`

**Via SQL:**
```sql
INSERT INTO survey_projects (id, "projectName", "clientName", "engagementType", "isActive")
VALUES ('test-project-2024', 'Test Engagement', 'Sample Client', 'Consulting', true);
```

Survey URL will be: `https://survey.middlez.com/survey/test-project-2024`

### 9. Create Admin User

First person to sign in at `/admin` becomes an admin.

To add more admins:
```sql
INSERT INTO users (email, "emailVerified")
VALUES ('daniel@middlez.com', NOW());
```

## Testing Locally

```bash
# Setup
cp .env.example .env
# Edit .env with your credentials

# Install dependencies
npm install

# Database setup
npm run db:generate
npm run db:push
npm run db:seed

# Run dev server
npm run dev
```

Visit:
- Home: http://localhost:3000
- Sample survey: http://localhost:3000/survey/sample-project-1
- Admin: http://localhost:3000/admin
- Privacy: http://localhost:3000/privacy

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
npx prisma db push --skip-generate

# Reset database (development only!)
npx prisma migrate reset
```

### Email Issues

- Gmail: Use App Password, not regular password
- Verify `EMAIL_FROM` matches a domain you control
- Check spam folder for magic link emails

### Build Failures

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working

- Redeploy after changing env vars in Vercel
- Ensure no typos in variable names
- Check that `DATABASE_URL` includes `?schema=public`

## Production Checklist

- [ ] Database set up and accessible
- [ ] All environment variables configured
- [ ] Custom domain configured (survey.middlez.com)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Database seeded with sample data
- [ ] Admin user created
- [ ] Test survey link working
- [ ] Email authentication working
- [ ] Privacy policy reviewed

## Monitoring & Maintenance

### View Logs
```bash
vercel logs
```

### Database Backups
- Vercel Postgres: Automatic daily backups
- Supabase: Automatic backups on paid plans

### Updates
```bash
# Pull latest changes
git pull origin main

# Deploy
git push origin main  # Auto-deploys via Vercel GitHub integration
```

## Support

For deployment issues:
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://prisma.io/docs
- NextAuth Docs: https://next-auth.js.org

Contact: privacy@middlez.com
