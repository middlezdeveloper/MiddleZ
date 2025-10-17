# Quick Start Testing - Do This Now!

## ⚡ 10-Minute Essential Test

Follow these steps to verify everything works before deployment.

### Step 1: Get a Free Database (3 minutes)

**Recommended: Supabase (easiest)**

1. Go to https://supabase.com
2. Click "Start your project" (sign in with GitHub)
3. Click "New Project"
4. Enter:
   - Name: `middlez-survey-test`
   - Database Password: (generate strong password)
   - Region: Choose closest to you
5. Wait 2 minutes for database to provision
6. Go to Settings → Database → Connection String
7. Copy the **Connection Pooling** string (starts with `postgresql://`)

### Step 2: Configure Environment (1 minute)

```bash
cd survey-app
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="paste-your-supabase-connection-string-here"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="test-secret-change-in-production"

# Email - leave blank for now (skip admin testing)
EMAIL_SERVER_HOST=""
EMAIL_SERVER_PORT=""
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM="noreply@middlez.com"
```

### Step 3: Setup Database & Start Server (2 minutes)

```bash
# Install dependencies (if not done)
npm install

# Setup database
npm run db:generate
npm run db:push
npm run db:seed

# Start server
npm run dev
```

**Expected:**
```
✅ Created sample projects
✅ Created sample response from: Jane Smith
🎉 Seeding completed successfully!

▲ Next.js 15.5.5
- Local: http://localhost:3000
✓ Ready in 2.3s
```

### Step 4: Test Survey Flow (4 minutes)

**Open:** http://localhost:3000/survey/sample-project-1

**Do this:**

1. **Step 1:**
   - Enter your name: "Test User"
   - Enter email: "test@example.com"
   - Check both consent boxes
   - Click "Next"

2. **Step 2-5:**
   - Give random star ratings (3-5 stars)
   - Type something in text boxes (optional)
   - Click "Next" through all steps

3. **Step 6 (NPS):**
   - Click a score (try "9" - should show "Promoter")
   - Type: "Great engagement, very helpful"
   - Click "Next"

4. **Step 7:**
   - Type: "More follow-up sessions would be great"
   - One word: "Excellent"
   - Click "Next"

5. **Step 8 (Testimonial):**
   - Check "May we use your feedback"
   - Select "Full attribution"
   - Check a few usage permissions
   - Check "I accept the testimonial release"
   - Click "Submit Survey"

6. **Step 9:**
   - Should see "Thank You!" message
   - No errors in console (press F12)

**✅ Success if:** Survey submits without errors!

---

## 🔍 Verify Data Saved

### Option 1: Supabase (Easiest)

1. Go to Supabase Dashboard → Table Editor
2. Click `survey_responses` table
3. Should see 2 rows:
   - Jane Smith (from seed)
   - Test User (your submission)
4. Click on your response - all data should be there

### Option 2: Prisma Studio

```bash
npx prisma studio
```

- Opens http://localhost:5555
- Click `SurveyResponse`
- See your test response with all data

**✅ Success if:** Your response is in the database with all fields populated!

---

## 🎯 Critical Test: Multiple Responses

**Do this to test your use case:**

1. Go back to: http://localhost:3000/survey/sample-project-1
2. Fill out again with different name: "Second User"
3. Use different scores
4. Submit

**Verify in Supabase/Prisma Studio:**
- Should now see 3 responses
- 2 have `projectId` = "sample-project-1"
- Different `id` for each response

**✅ Success if:** Both responses link to same project!

---

## 🚀 Test Production Build

```bash
# Stop dev server (Ctrl+C)

# Build for production
npm run build
```

**Expected:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
```

**✅ Success if:** Build completes with no errors!

If build succeeds, you can test production mode:
```bash
npm run start
```

Visit http://localhost:3000 and test survey again.

---

## ✅ You're Ready to Deploy If:

- [x] Survey loads and looks good
- [x] Can complete all 9 steps
- [x] Survey submits successfully
- [x] Data appears in database
- [x] Multiple responses to same project works
- [x] Production build succeeds

**Next step:** See `DEPLOYMENT.md` to deploy to Vercel!

---

## 🐛 Troubleshooting

### "Can't connect to database"

**Check:**
```bash
npx prisma db push
```

If fails:
- Verify `DATABASE_URL` in `.env` is correct
- Check Supabase project is running
- Make sure you used "Connection Pooling" string, not "Session" string

### "npm run dev" fails

```bash
# Clear and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

### Survey won't submit

**Check browser console (F12):**
- Look for red error messages
- Most common: Missing required field

**Make sure:**
- Both consent checkboxes checked (step 1)
- All star ratings set (defaults to 3, but check)
- If testimonial consent = yes, must check release agreement

### Database queries return nothing

```bash
# Re-seed
npm run db:seed
```

---

## 📊 Quick Stats Check

After testing, your database should have:

```
survey_projects: 2 projects
  - sample-project-1 (Digital Transformation Strategy)
  - sample-project-2 (Innovation Workshop Series)

survey_responses: 3+ responses
  - 1 from seed (Jane Smith)
  - 2+ from your testing

All responses should have:
  ✓ projectId linking to a project
  ✓ Satisfaction, learning, application, results scores (1-5)
  ✓ NPS score (0-10)
  ✓ Timestamps
  ✓ Consent flags
```

---

## Next Steps

1. **If all tests pass:** Proceed to deployment → See `DEPLOYMENT.md`
2. **If issues found:** Check `TESTING_CHECKLIST.md` for detailed debugging
3. **Need help:** Check console errors, database connection, or review logs

---

**Time to complete:** 10-15 minutes
**Difficulty:** Easy
**Required:** Database (free from Supabase)
