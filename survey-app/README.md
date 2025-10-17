# Middle Z Survey System

A human-centered survey application for consulting engagement assessment using the Kirkpatrick 4 Levels framework and Net Promoter Score.

## 🚀 Features

- **9-Step Survey Flow**: Thoughtfully designed multi-step form
- **Kirkpatrick 4 Levels Framework**:
  - Level 1: Reaction (satisfaction)
  - Level 2: Learning (insights gained)
  - Level 3: Behaviour (application)
  - Level 4: Results (tangible outcomes)
- **Net Promoter Score (NPS)**: Interactive 0-10 scale with categorization
- **Testimonial Management**: Granular consent with attribution preferences
- **Privacy-First**: GDPR & APP compliant with full consent tracking
- **Anonymous Submissions**: Optional respondent information
- **Admin Dashboard**: Real-time analytics, charts, and response management
- **Auto-save**: Form progress saved to localStorage
- **Responsive Design**: Mobile-first with beautiful UI (Tailwind CSS + shadcn/ui)

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Form Validation**: React Hook Form + Zod
- **Charts**: Recharts
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- SMTP email server (for authentication)

## 🔧 Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database - Use Vercel Postgres, Supabase, or your own PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="https://survey.middlez.com"  # or http://localhost:3000 for local
NEXTAUTH_SECRET="generate-a-random-secret-key-here"

# Email Server for NextAuth Magic Links
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@middlez.com"
```

**Generate NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 🚢 Deployment to Vercel

### Step 1: Create Vercel Project

```bash
npm install -g vercel
vercel login
```

### Step 2: Configure Database

**Option A: Vercel Postgres** (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to "Storage" → "Create Database"
3. Select "Postgres"
4. Copy the `DATABASE_URL` to your environment variables

**Option B: Supabase**

1. Create project at [supabase.com](https://supabase.com)
2. Go to Settings → Database
3. Copy the connection string

### Step 3: Configure Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://survey.middlez.com
NEXTAUTH_SECRET=your-secret-here
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@middlez.com
```

### Step 4: Deploy

```bash
vercel --prod
```

### Step 5: Run Database Migrations

After first deployment:

```bash
# Connect to your production database
npx prisma db push

# Seed data (optional)
npx prisma db seed
```

## 🌐 DNS Configuration

Add a CNAME record in your DNS provider:

```
Type: CNAME
Name: survey
Value: cname.vercel-dns.com
```

Then in Vercel:
1. Go to Settings → Domains
2. Add domain: `survey.middlez.com`
3. Verify DNS configuration

## 📊 Usage

### Creating Survey Links

1. **Via Database**:
   ```sql
   INSERT INTO survey_projects (id, "projectName", "clientName", "engagementType", "isActive")
   VALUES ('my-project-2024', 'Digital Strategy', 'Acme Corp', 'Consulting', true);
   ```

2. **Survey URL**:
   ```
   https://survey.middlez.com/survey/my-project-2024
   ```

### Admin Access

1. Navigate to `/admin`
2. Sign in with email (magic link sent)
3. View analytics, responses, and testimonials

### Creating Admin Users

First user to sign in becomes an admin. To add more:

```sql
INSERT INTO users (email, "emailVerified")
VALUES ('admin@middlez.com', NOW());
```

## 📁 Project Structure

```
survey-app/
├── app/
│   ├── api/
│   │   ├── admin/          # Admin API routes
│   │   ├── auth/           # NextAuth routes
│   │   └── survey/         # Public survey routes
│   ├── admin/              # Admin dashboard pages
│   ├── privacy/            # Privacy policy page
│   └── survey/[projectId]  # Survey page
├── components/
│   ├── survey/             # Survey-specific components
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── prisma.ts           # Prisma client
│   ├── auth.ts             # NextAuth config
│   ├── utils.ts            # Utilities
│   └── validations/        # Zod schemas
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data
└── public/                 # Static assets
```

## 🔒 Security & Compliance

- **GDPR Compliant**: Full consent tracking, data export, deletion
- **Australian Privacy Principles**: APP compliant
- **Secure Authentication**: NextAuth.js with email verification
- **Data Encryption**: HTTPS/TLS in transit
- **IP Logging**: Consent verification
- **Testimonial Consent**: Granular permissions with withdrawal option

## 🎨 Customization

### Branding

Update logo and colors in:
- `app/globals.css`
- `components.json` (shadcn theme)

### Survey Steps

Modify steps in:
- `app/survey/[projectId]/page.tsx`
- `lib/validations/survey.ts`
- `prisma/schema.prisma`

## 📈 Analytics Features

- **NPS Calculation**: Automated promoter/passive/detractor categorization
- **Kirkpatrick Averages**: All 4 levels tracked
- **Word Cloud**: One-word reflections visualization
- **Trend Analysis**: NPS over time
- **Testimonial Consent Rate**: Track consent statistics
- **Response Export**: CSV/Excel export (coming soon)

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test connection
npx prisma db push --skip-generate
```

### Email Not Sending
- Check SMTP credentials
- For Gmail: Use App Password, not regular password
- Verify `EMAIL_FROM` domain matches

### Build Errors
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

## 📝 Future Enhancements

- [ ] PDF report generation
- [ ] Automated email notifications
- [ ] Advanced filtering and search
- [ ] Sentiment analysis
- [ ] Multi-language support
- [ ] Testimonial approval workflow
- [ ] API for integrations

## 🤝 Support

For issues or questions:
- Email: privacy@middlez.com
- Documentation: https://middlez.com

## 📄 License

Proprietary - Middle Z Consulting

---

Built with ❤️ by Middle Z
