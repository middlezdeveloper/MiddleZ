# Pre-Deployment Testing Checklist

## Local Testing Steps

### 1. Environment Setup (5 minutes)

```bash
cd survey-app

# Install dependencies (if not done)
npm install

# Create environment file
cp .env.example .env
```

**Edit `.env` with test database:**

For quick local testing, get a **free PostgreSQL database** from:
- **Supabase** (recommended): https://supabase.com
- **Neon**: https://neon.tech
- **Railway**: https://railway.app

```env
# Example with Supabase
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# For local testing, these can be temporary
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="any-random-string-for-testing"

# Email not required for initial testing (skip admin login test)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM="noreply@middlez.com"
```

### 2. Database Setup (2 minutes)

```bash
# Generate Prisma client
npm run db:generate

# Create database tables
npm run db:push

# Load sample data (2 projects + 1 response)
npm run db:seed
```

**Expected output:**
```
✅ Created sample projects: Digital Transformation Strategy, Innovation Workshop Series
✅ Created sample response from: Jane Smith
🎉 Seeding completed successfully!
```

### 3. Start Development Server (1 minute)

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

---

## 🧪 Test Suite (30-45 minutes)

### TEST 1: Home Page ✅

**URL:** http://localhost:3000

**Expected:**
- [ ] Page loads without errors
- [ ] "Middle Z Survey System" header visible
- [ ] Kirkpatrick 4 Levels explanation shown
- [ ] "Go to Dashboard" button works
- [ ] Privacy policy link works
- [ ] Professional styling with gradient background

**Issues to check:**
- Console errors (F12 → Console)
- Missing images
- Broken links

---

### TEST 2: Privacy Policy Page ✅

**URL:** http://localhost:3000/privacy

**Expected:**
- [ ] Complete privacy policy displays
- [ ] All 14 sections present
- [ ] Proper formatting
- [ ] Links to privacy@middlez.com work
- [ ] Back to home link works

---

### TEST 3: Sample Survey (Full Flow) ✅✅✅

**URL:** http://localhost:3000/survey/sample-project-1

This is the **most important test** - complete the entire 9-step survey.

#### Step 1: Welcome & Privacy
- [ ] Project name displays: "Digital Transformation Strategy"
- [ ] Kirkpatrick explanation shown
- [ ] Can enter name, email, organization
- [ ] Anonymous checkbox works (disables fields)
- [ ] Privacy policy link opens
- [ ] Both consent checkboxes required
- [ ] "Next" button disabled until checkboxes checked
- [ ] After checking, "Next" button works

#### Step 2: Level 1 - Reaction
- [ ] 5-star rating is interactive
- [ ] Stars highlight on hover
- [ ] Can select 1-5 stars
- [ ] Text areas accept input
- [ ] "Previous" button works
- [ ] "Next" button works

#### Step 3: Level 2 - Learning
- [ ] 5-star rating works
- [ ] Textarea accepts input
- [ ] Navigation works both ways

#### Step 4: Level 3 - Behaviour
- [ ] 5-star rating works
- [ ] Textarea accepts input
- [ ] Navigation works

#### Step 5: Level 4 - Results
- [ ] 5-star rating works
- [ ] Textarea accepts input
- [ ] Navigation works

#### Step 6: Net Promoter Score
- [ ] 11 buttons (0-10) display correctly
- [ ] Color coding: Red (0-6), Yellow (7-8), Green (9-10)
- [ ] Selected button highlights and scales
- [ ] Shows "Detractor/Passive/Promoter" label
- [ ] Textarea works
- [ ] Navigation works

#### Step 7: Future Reflection
- [ ] Both textareas work
- [ ] One-word field has character limit
- [ ] Navigation works

#### Step 8: Testimonial Consent
- [ ] Main consent checkbox works
- [ ] When checked, shows attribution options
- [ ] 8 radio button options display
- [ ] Can select one attribution preference
- [ ] 7 usage permission checkboxes work
- [ ] Can select multiple permissions
- [ ] Commercially sensitive textarea works
- [ ] Testimonial release checkbox required
- [ ] "Submit Survey" button enabled
- [ ] "Previous" button still works

#### Step 9: Submit & Thank You
- [ ] Click "Submit Survey"
- [ ] Loading spinner shows
- [ ] Thank you message displays
- [ ] No errors in console
- [ ] Survey can't be resubmitted (step 9 final)

**Test auto-save:**
- [ ] Fill out steps 1-4
- [ ] Refresh browser (F5)
- [ ] Data is still there (loaded from localStorage)

---

### TEST 4: Invalid Survey Link ✅

**URL:** http://localhost:3000/survey/nonexistent-project

**Expected:**
- [ ] Shows "Survey Not Found" message
- [ ] Professional error display
- [ ] No console errors

---

### TEST 5: Admin Dashboard (Without Auth) ✅

**URL:** http://localhost:3000/admin

**Expected:**
- [ ] "Admin Login Required" message
- [ ] "Sign In" button displays
- [ ] Doesn't crash
- [ ] Professional styling

**Note:** Full admin testing requires email setup (skip for now, test after deployment)

---

### TEST 6: Project Management Page ✅

**URL:** http://localhost:3000/admin/projects

**Expected:**
- [ ] Redirects to login or shows "sign in required"
- [ ] No errors

---

### TEST 7: Database Verification ✅

Check that survey submission saved correctly.

**Option A: Using Supabase UI**
1. Open Supabase dashboard → Table Editor
2. Open `survey_responses` table
3. Should see 2 responses (1 from seed + 1 from your test)

**Option B: Using Prisma Studio**
```bash
npx prisma studio
```
- Opens at http://localhost:5555
- Click `SurveyResponse`
- Should see your test response
- Verify all fields saved correctly

**Check:**
- [ ] Response exists
- [ ] `projectId` = "sample-project-1"
- [ ] All Kirkpatrick scores (1-5)
- [ ] NPS score (0-10)
- [ ] Text responses saved
- [ ] Testimonial consent saved
- [ ] IP address recorded
- [ ] Timestamp present

---

### TEST 8: Multiple Responses to Same Project ✅✅

**Critical test for your use case!**

1. Complete survey again: http://localhost:3000/survey/sample-project-1
2. Use different respondent name
3. Use different scores
4. Submit

**Verify in database:**
- [ ] Now shows 3 responses total
- [ ] Both have same `projectId`
- [ ] Different response IDs
- [ ] Different data

---

### TEST 9: API Endpoints ✅

Test the APIs work (use browser or Postman).

**Get project info:**
```
http://localhost:3000/api/survey/project/sample-project-1
```

**Expected response:**
```json
{
  "id": "sample-project-1",
  "projectName": "Digital Transformation Strategy",
  "clientName": "Sample Organization",
  "engagementType": "Strategic Consulting",
  "isActive": true
}
```

**Check:**
- [ ] Returns 200 status
- [ ] JSON is valid
- [ ] All fields present

---

### TEST 10: Mobile Responsiveness ✅

**Test on different screen sizes:**

1. **Desktop** (already tested above)

2. **Tablet** (Chrome DevTools)
   - Press F12 → Toggle device toolbar
   - Select "iPad"
   - Navigate through survey
   - [ ] Layout looks good
   - [ ] All buttons clickable
   - [ ] No horizontal scroll
   - [ ] Text readable

3. **Mobile** (Chrome DevTools)
   - Select "iPhone 12 Pro"
   - Navigate through survey
   - [ ] Single column layout
   - [ ] Star rating usable
   - [ ] NPS buttons fit on screen
   - [ ] Text inputs full width
   - [ ] Navigation buttons accessible

---

### TEST 11: Browser Compatibility ✅

Test in multiple browsers (if available):

- [ ] **Chrome** - Full test suite
- [ ] **Safari** - Survey flow
- [ ] **Firefox** - Survey flow
- [ ] **Edge** - Survey flow

**Critical checks:**
- Star ratings work
- NPS scale works
- Form submission works
- No console errors

---

### TEST 12: Build Test ✅

Test that production build works:

```bash
npm run build
```

**Expected:**
- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] No build warnings (or only minor ones)
- [ ] Shows route list

**Expected output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    ...      ...
├ ○ /admin                               ...      ...
├ ○ /privacy                             ...      ...
└ ○ /survey/[projectId]                  ...      ...
```

**Run production build locally:**
```bash
npm run build
npm run start
```

- [ ] Access http://localhost:3000
- [ ] Test survey flow again
- [ ] No errors

---

## 🔥 Critical Issues to Watch For

### High Priority Bugs

1. **Survey submission fails**
   - Check database connection
   - Check validation errors in console
   - Verify all required fields filled

2. **Progress not saving**
   - Check localStorage in DevTools (Application tab)
   - Should see key: `survey_sample-project-1`

3. **Navigation doesn't work**
   - Check for form validation errors
   - Look in console for JavaScript errors

4. **Testimonial consent section broken**
   - Verify checkboxes toggle visibility
   - Ensure all 8 radio options render

5. **Analytics don't aggregate**
   - Verify multiple responses have same `projectId`
   - Check API returns combined data

---

## 📊 Test Data Validation

After completing tests, verify in database:

### survey_projects table
- [ ] 2 projects exist (from seed)
- [ ] Projects have IDs, names, dates

### survey_responses table
- [ ] At least 3 responses (1 seed + 2 test)
- [ ] All fields populated correctly
- [ ] No null values in required fields
- [ ] Consent flags are boolean
- [ ] Timestamps are valid dates
- [ ] IP addresses recorded

### Data integrity
- [ ] All responses link to valid projects
- [ ] No orphaned responses
- [ ] JSON fields (usagePermissions) are valid JSON arrays

---

## ✅ Sign-off Checklist

Before deployment, confirm:

- [ ] All 12 tests passed
- [ ] No critical console errors
- [ ] Survey submits successfully
- [ ] Multiple responses to same project works
- [ ] Database properly stores data
- [ ] Mobile responsive
- [ ] Production build works
- [ ] Privacy policy complete and accurate

---

## 🚨 Known Limitations (Expected)

These are OK and expected for initial deployment:

1. **Admin dashboard requires email setup** - Will test after deployment with real SMTP
2. **No CSV export UI yet** - API exists, UI is future enhancement
3. **Project activation toggle** - Must use database for now
4. **Individual response detail view** - Coming in future update

---

## 📝 Test Results Log

Use this to track your testing:

```
Test Date: ___________
Tester: ___________

| Test # | Test Name              | Status | Notes |
|--------|------------------------|--------|-------|
| 1      | Home Page              | ☐      |       |
| 2      | Privacy Policy         | ☐      |       |
| 3      | Sample Survey          | ☐      |       |
| 4      | Invalid Link           | ☐      |       |
| 5      | Admin (No Auth)        | ☐      |       |
| 6      | Projects Page          | ☐      |       |
| 7      | Database Verify        | ☐      |       |
| 8      | Multiple Responses     | ☐      |       |
| 9      | API Endpoints          | ☐      |       |
| 10     | Mobile Responsive      | ☐      |       |
| 11     | Browser Compatibility  | ☐      |       |
| 12     | Build Test             | ☐      |       |

Critical bugs found: ___________
Ready for deployment: YES / NO
```

---

## Next: Deployment Testing

After deploying to Vercel, repeat these key tests:

1. Survey submission on production URL
2. Admin login with real email (magic link)
3. Create project via admin UI
4. Share link and get real responses
5. View aggregated analytics

See `DEPLOYMENT.md` for deployment steps.
