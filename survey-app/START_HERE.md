# START HERE - Local Testing

## ⚡ Test Locally Right Now (10 minutes)

Everything runs on your computer. No deployment needed yet.

---

## Step 1: Get a Free Test Database (3 minutes)

You need PostgreSQL. **Easiest option: Supabase** (100% free, no credit card)

### Option A: Supabase (Recommended)

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Fill in:
   - **Name:** `middlez-test`
   - **Database Password:** Click "Generate password" (save it somewhere)
   - **Region:** Choose closest to you
6. Click "Create new project"
7. **Wait 2 minutes** while it provisions

**Get your connection string:**
1. Go to Project Settings (gear icon) → Database
2. Scroll to "Connection string" section
3. Select **"Connection pooling"** tab (important!)
4. Copy the URI (starts with `postgresql://`)
5. Replace `[YOUR-PASSWORD]` in the string with your actual password

**Your connection string looks like:**
```
postgresql://postgres.abcdefgh:YourPassword@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### Option B: Local PostgreSQL (If you already have it)

If you have PostgreSQL installed locally:
```
postgresql://localhost:5432/middlez_survey
```

---

## Step 2: Configure Environment (1 minute)

```bash
# Navigate to the survey app
cd /Users/danielmiddlemiss/Documents/Vibecode/MiddleZ/survey-app

# Copy environment template
cp .env.example .env
```

**Edit `.env` file:**

Open `.env` in your text editor and add:

```env
# Your Supabase connection string from Step 1
DATABASE_URL="postgresql://postgres.abcdefgh:YourPassword@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# Local testing URLs
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-random-string-for-local-testing-123456"

# Email - Leave empty for now (we'll test admin later)
EMAIL_SERVER_HOST=""
EMAIL_SERVER_PORT=""
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM="noreply@middlez.com"
```

**Save the file!**

---

## Step 3: Install & Setup (2 minutes)

```bash
# Install dependencies (if not already done)
npm install

# Generate Prisma client
npm run db:generate

# Create database tables
npm run db:push

# Load sample data (2 projects + 1 sample response)
npm run db:seed
```

**Expected output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma

🌱 Seeding database...
✅ Created sample projects: {
  project1: 'Digital Transformation Strategy',
  project2: 'Innovation Workshop Series'
}
✅ Created sample response from: Jane Smith
🎉 Seeding completed successfully!
```

**If you see errors:**
- Check `DATABASE_URL` is correct in `.env`
- Make sure you replaced `[YOUR-PASSWORD]` with actual password
- Verify Supabase project is running (green indicator)

---

## Step 4: Start Local Server (30 seconds)

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 15.5.5
- Local:        http://localhost:3000
- Environments: .env

✓ Ready in 2.3s
```

**Server is now running!** Keep this terminal open.

---

## Step 5: Test in Browser (5 minutes)

### Test 1: Home Page

Open: **http://localhost:3000**

**Check:**
- [ ] Page loads (no errors)
- [ ] See "Middle Z Survey System"
- [ ] Professional design with gradient background
- [ ] "Go to Dashboard" button visible

---

### Test 2: Complete a Survey (MOST IMPORTANT)

Open: **http://localhost:3000/survey/sample-project-1**

**You should see:** "Digital Transformation Strategy" project

**Go through all 9 steps:**

#### Step 1: Welcome
- Enter name: "Test User 1"
- Enter email: "test1@example.com"
- Organization: "Test Corp"
- ✅ Check "I have read and agree to the Privacy Policy"
- ✅ Check "I consent to providing feedback"
- Click **"Next"**

#### Step 2: Reaction
- Click 4 or 5 stars for satisfaction
- Type anything in text boxes (optional)
- Click **"Next"**

#### Step 3: Learning
- Click 4 stars
- Type: "Learned about strategic planning" (optional)
- Click **"Next"**

#### Step 4: Behaviour
- Click 3 stars
- Type something (optional)
- Click **"Next"**

#### Step 5: Results
- Click 4 stars
- Type something (optional)
- Click **"Next"**

#### Step 6: Net Promoter Score (NPS)
- Click **"9"** (should turn green and say "Promoter")
- Type: "Very helpful engagement"
- Click **"Next"**

#### Step 7: Future Reflection
- Type: "More workshops would be great"
- One word: "Excellent"
- Click **"Next"**

#### Step 8: Testimonial Consent
- ✅ Check "May we use your feedback as a testimonial?"
- Select radio button: **"Full attribution (Name, Role, Company)"**
- ✅ Check a few permissions: "Use on website", "Use in proposals"
- ✅ Check "I accept the testimonial release"
- Click **"Submit Survey"**

#### Step 9: Thank You
- Should see: **"🙏 Thank You!"**
- "Your feedback has been successfully submitted"

**✅ SUCCESS if you see the thank you page with no errors!**

---

### Test 3: Verify Data Saved

**Option A: View in Supabase (Easy)**

1. Go to Supabase Dashboard
2. Click **"Table Editor"** in left menu
3. Click **`survey_responses`** table
4. You should see **2 rows**:
   - Jane Smith (from seed data)
   - Test User 1 (your submission just now)

**Option B: View in Prisma Studio**

```bash
# Open new terminal (keep dev server running)
npx prisma studio
```

- Opens at http://localhost:5555
- Click **`SurveyResponse`** model
- See both responses with all data

**✅ SUCCESS if your response is in the database!**

---

### Test 4: Multiple Responses (YOUR USE CASE)

**Go back to the survey:**
http://localhost:3000/survey/sample-project-1

**Fill it out again with different data:**
- Name: "Test User 2"
- Email: "test2@example.com"
- Different star ratings
- Different NPS (try 7 - should say "Passive")
- Complete all steps and submit

**Check database again:**
- Should now see **3 responses** total
- 2 of them have `projectId` = "sample-project-1"
- Each has unique `id`

**✅ SUCCESS! This proves multiple people can respond to same project!**

---

### Test 5: Privacy Policy

Open: **http://localhost:3000/privacy**

**Check:**
- [ ] Full privacy policy displays
- [ ] All 14 sections visible
- [ ] No errors
- [ ] Looks professional

---

### Test 6: Invalid Survey Link

Open: **http://localhost:3000/survey/fake-project**

**Should see:**
- "Survey Not Found" message
- Professional error page
- No crashes

---

## ✅ Success Checklist

You're ready to proceed if:

- [x] Home page loads
- [x] Survey completes all 9 steps without errors
- [x] Submission shows thank you page
- [x] Data appears in database (Supabase or Prisma Studio)
- [x] Can submit multiple responses to same project
- [x] Privacy policy displays
- [x] Invalid links show error gracefully

---

## 🐛 Troubleshooting

### "Database connection error"

**Check:**
1. Is your Supabase project running? (green status in dashboard)
2. Did you replace `[YOUR-PASSWORD]` in connection string?
3. Did you use "Connection pooling" string (not "Session")?

**Fix:**
```bash
# Test connection
npx prisma db push
```

Should say: "Your database is now in sync with your Prisma schema."

---

### "npm run dev" won't start

```bash
# Clear and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

---

### Survey won't submit

**Open browser console (F12) and look for errors**

Common issues:
- Forgot to check privacy consent checkboxes (step 1)
- If testimonial = yes, must check release agreement box
- Network error (check database connection)

---

### "npm command not found"

You need Node.js installed:
1. Go to https://nodejs.org
2. Download LTS version
3. Install
4. Restart terminal
5. Try again

---

## 🎯 What's Being Tested Locally

**Everything runs on your computer:**
- ✅ Next.js dev server (localhost:3000)
- ✅ Database on Supabase (cloud, but free tier)
- ✅ All survey functionality
- ✅ Form validation
- ✅ Data persistence
- ✅ Multiple responses per project

**NOT tested yet (requires deployment):**
- ❌ Admin login (needs email server)
- ❌ Admin dashboard (needs authentication)
- ❌ Project creation UI (needs admin access)
- ❌ Custom domain (survey.middlez.com)

Those will be tested after deployment!

---

## 🚀 After Local Testing Succeeds

**If all tests pass:**

1. **Run production build test:**
   ```bash
   npm run build
   ```
   Should complete with ✓ symbols, no errors

2. **Then you're ready to deploy!**
   - See `DEPLOYMENT.md` for Vercel deployment
   - Or see `QUICKSTART.md` for fast deploy guide

---

## 📊 What You Should See in Database

After testing, your Supabase should have:

**`survey_projects` table (2 rows):**
- sample-project-1 | Digital Transformation Strategy
- sample-project-2 | Innovation Workshop Series

**`survey_responses` table (3+ rows):**
- Response from Jane Smith (seed)
- Response from Test User 1 (you)
- Response from Test User 2 (you again)

**All responses should have:**
- ✓ Valid `projectId`
- ✓ Scores (satisfaction, learning, application, results)
- ✓ NPS score (0-10)
- ✓ Timestamps
- ✓ IP address
- ✓ Consent flags

---

**Time needed:** 10-15 minutes
**Cost:** $0 (Supabase free tier)
**Difficulty:** Easy

**Questions? Issues? Check the troubleshooting section above!**
