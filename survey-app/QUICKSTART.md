# Quick Start Guide - Middle Z Survey System

## 5-Minute Local Setup

```bash
# 1. Navigate to project
cd survey-app

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env

# 4. Edit .env with your database URL
# For quick testing, use a free PostgreSQL database from:
# - Supabase (https://supabase.com) - Recommended
# - Neon (https://neon.tech)
# - Railway (https://railway.app)

# 5. Set up database
npm run db:generate
npm run db:push
npm run db:seed

# 6. Run development server
npm run dev
```

**Visit:**
- Home: http://localhost:3000
- Sample Survey: http://localhost:3000/survey/sample-project-1
- Admin Dashboard: http://localhost:3000/admin

## Quick Deploy to Vercel (15 minutes)

### 1. Prepare Repository
```bash
cd survey-app
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo at github.com/new
git remote add origin https://github.com/YOUR-USERNAME/middlez-survey.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. **Important**: Set "Root Directory" to `survey-app`
5. Click "Deploy" (will fail - that's expected)

### 3. Add Database

**Vercel Postgres (Easiest):**
1. In your Vercel project → Storage tab
2. Click "Create Database"
3. Select "Postgres"
4. Click "Create"
5. Connection string auto-added to environment variables

**OR Supabase (Free forever tier):**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy the connection string
4. In Vercel → Settings → Environment Variables
5. Add: `DATABASE_URL` = `your-connection-string`

### 4. Add Other Environment Variables

In Vercel → Settings → Environment Variables:

```bash
# Generate secret
NEXTAUTH_SECRET=paste-output-of-openssl-rand-base64-32

# Your deployed URL
NEXTAUTH_URL=https://your-project.vercel.app

# Email (for admin login)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-gmail-app-password
EMAIL_FROM=noreply@middlez.com
```

**Gmail App Password:**
1. Google Account → Security
2. Enable 2-Step Verification
3. Search "App passwords"
4. Generate for "Mail"
5. Copy the 16-character password

### 5. Redeploy

Click "Deployments" → Three dots on latest deployment → "Redeploy"

### 6. Set Up Database

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Pull environment variables
vercel env pull

# Set up database
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 7. Configure Custom Domain

**DNS Provider (where middlez.com is hosted):**
```
Type: CNAME
Name: survey
Value: cname.vercel-dns.com
```

**Vercel:**
1. Settings → Domains
2. Add `survey.middlez.com`
3. Wait 5-10 minutes for DNS
4. Update `NEXTAUTH_URL` to `https://survey.middlez.com`
5. Redeploy

## Creating Your First Survey

### Method 1: Using Supabase UI
1. Open Supabase → Table Editor
2. Select `survey_projects` table
3. Insert new row:
   - `id`: my-first-project
   - `projectName`: My First Engagement
   - `isActive`: true

### Method 2: Using SQL
```sql
INSERT INTO survey_projects (id, "projectName", "clientName", "engagementType", "isActive")
VALUES (
  'digital-strategy-2024',
  'Digital Strategy Engagement',
  'Acme Corporation',
  'Strategic Consulting',
  true
);
```

**Survey URL:** `https://survey.middlez.com/survey/digital-strategy-2024`

## Accessing Admin Dashboard

1. Visit `/admin`
2. Enter your email
3. Check email for magic link
4. Click link to sign in
5. View analytics and responses

## Testing the Flow

1. **Open survey link** (e.g., /survey/sample-project-1)
2. **Fill out form** (takes ~5 minutes)
3. **Submit**
4. **Check admin dashboard** to see results
5. **View analytics** - NPS, Kirkpatrick levels, charts

## Common Issues

### Can't connect to database
- Check `DATABASE_URL` is correct
- Ensure database allows external connections
- Try `npx prisma db push --skip-generate`

### Email not sending
- Use Gmail App Password, not regular password
- Check spam folder
- Verify `EMAIL_SERVER_*` variables

### Build fails
```bash
rm -rf .next node_modules
npm install
npm run build
```

## File Locations

- **Environment config**: `.env` (local) or Vercel dashboard (production)
- **Database schema**: `prisma/schema.prisma`
- **Survey form**: `app/survey/[projectId]/page.tsx`
- **Admin dashboard**: `app/admin/page.tsx`
- **Privacy policy**: `app/privacy/page.tsx`

## What Next?

1. ✅ Customize branding (colors, logo)
2. ✅ Create real survey projects
3. ✅ Share survey links with clients
4. ✅ Monitor responses in admin dashboard
5. ✅ Use testimonials with proper consent

## Support

- **Full Documentation**: See `README.md`
- **Deployment Guide**: See `DEPLOYMENT.md`
- **Email**: privacy@middlez.com

---

**Total Time:** 15-20 minutes from zero to production! 🚀
