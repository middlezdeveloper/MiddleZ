# Survey App Incident Report - October 20, 2025

## Summary
The survey application at https://survey.middlez.com stopped working, showing "No projects" in the admin panel and returning 500 errors on survey pages. The issue was resolved by adding the missing `NEXTAUTH_SECRET` environment variable in Vercel.

---

## Timeline

### When It Broke
- **Last Working:** 3 days ago (October 17, 2025) - Deployment `12d7192`
- **First Noticed:** October 20, 2025 - Admin panel showed no projects, survey links returned 500 errors

### Symptoms
1. Admin login page worked fine ✅
2. After login, dashboard showed "No projects yet" ❌
3. Survey URLs (e.g., `/survey/mzc-26-008-1`) returned:
   ```
   500: INTERNAL_SERVER_ERROR
   Code: INTERNAL_FUNCTION_INVOCATION_FAILED
   ```
4. Database connection from local machine worked fine ✅
5. Supabase dashboard showed database as "Healthy" ✅

---

## Root Cause

The **`NEXTAUTH_SECRET` environment variable was missing** from Vercel's production environment.

### Why This Broke Everything

Even though the admin panel uses a simple password-based authentication (not NextAuth), the application imports NextAuth configuration files at build time. NextAuth **requires** the `NEXTAUTH_SECRET` environment variable to initialize properly.

When this variable is missing:
- API routes fail to initialize correctly
- Prisma client connections may fail
- Serverless functions throw 500 errors

### Why It Worked Before

The `NEXTAUTH_SECRET` must have been deleted or never properly set in Vercel's environment variables. It's unclear exactly when this happened, but the variable was definitely missing when we checked on October 20.

---

## The Fix

### What Was Done

1. **Generated a new secure secret:**
   ```bash
   openssl rand -base64 32
   # Result: gH1L9HVUWqsKkHu6RCZutnf0MbPsVAXVKBvknAcpRkE=
   ```

2. **Added to Vercel Environment Variables:**
   - Name: `NEXTAUTH_SECRET`
   - Value: `gH1L9HVUWqsKkHu6RCZutnf0MbPsVAXVKBvknAcpRkE=`
   - Environments: Production, Preview, Development (all three)

3. **Result:** Site immediately started working with existing deployment (no code changes needed)

---

## Required Environment Variables (For Reference)

The survey app requires these environment variables in Vercel:

### 1. DATABASE_URL
```
postgresql://postgres.bxqqolegcppdujmetlki:.Ve6n3c%3FEyr9NZ8@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1
```
**Important:** Must include `?pgbouncer=true&connection_limit=1` for Vercel serverless functions

### 2. NEXTAUTH_URL
```
https://survey.middlez.com
```

### 3. NEXTAUTH_SECRET (Was Missing!)
```
gH1L9HVUWqsKkHu6RCZutnf0MbPsVAXVKBvknAcpRkE=
```
**Important:** Required even though we don't actively use NextAuth for admin authentication

---

## What We Initially Thought Was Wrong (But Wasn't)

### ❌ Prisma Schema Changes
- We suspected `prisma db pull` corrupted the schema
- **Reality:** Schema was fine, this was a red herring

### ❌ Supabase Database Paused
- We thought the database auto-paused after 7 days of inactivity
- **Reality:** Database was healthy and responding to local connections

### ❌ Code Deployment Issues
- We reverted code to the last known working version
- **Reality:** The code was never the problem

### ❌ Database Connection String
- We checked if pooling parameters were missing
- **Reality:** `DATABASE_URL` was correctly configured

---

## Key Learnings

1. **Environment variables are critical:** Missing env vars can break working code
2. **NextAuth is always active:** Even if you're not using it for authentication, it still initializes
3. **Database connectivity ≠ app working:** Just because you can connect locally doesn't mean Vercel can execute API routes
4. **Check Vercel env vars first:** When a previously working deployment breaks, check environment variables before code

---

## Prevention

### Going Forward

1. **Document all required environment variables** in a `.env.example` file
2. **Set up monitoring/alerts** for API route failures
3. **Regular backups** of Vercel environment variables
4. **Test environment variables** after any Vercel configuration changes

---

## Database Verification

During troubleshooting, we confirmed the database had the correct data:

**SurveyProject Table:**
- `mzc-26-008-1` - "Moodle Strategic Financial Planning" (MZC-26-008-1)
- `testsow` - "Test" (testsow)

**SurveyResponse Table:**
- 2 responses present

This proved the issue was not data loss, but a connection/environment issue.

---

## Resolution Confirmed

✅ Admin panel now displays both projects
✅ Survey links work correctly
✅ No code changes were needed
✅ Current production deployment: `12d7192` (the original working version)

**Fix Duration:** ~1 hour of troubleshooting + immediate resolution after adding `NEXTAUTH_SECRET`

---

*Report generated: October 20, 2025*
