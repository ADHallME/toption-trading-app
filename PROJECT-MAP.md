# 🗺️ TOPTION PROJECT - COMPLETE DIRECTORY MAP & CRITICAL INFO

## 📍 PRIMARY PROJECT LOCATION

### Main Repository:
```
Local Path: /Users/andyhall/virtera/toption-trading-app
```

### Git Repository:
```
GitHub: https://github.com/ADHallME/toption-trading-app
Branch: main
Owner: ADHallME (Andrew Hall)
```

### Deployment:
```
Vercel URL: https://toptiontrade.com
Vercel Project: https://vercel.com/andrew-halls-projects-c98040e4/toption-app
Auto-deploys from: GitHub main branch
```

---

## 🔑 CRITICAL CREDENTIALS & SERVICES

### Environment Variables (Set in Vercel):
```env
# Polygon API (Market Data)
POLYGON_API_KEY=geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp
Plan: Business (Unlimited API calls)

# Resend (Email Alerts)
RESEND_API_KEY=re_dyZgFuk8_Pg5KiaZmARiME6naAJeexbBd
From Email: alerts@toptiontrade.com

# Clerk (Authentication) - CONFIRM THESE ARE SET
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[verify in Vercel]
CLERK_SECRET_KEY=[verify in Vercel]

# Supabase (Database)
NEXT_PUBLIC_SUPABASE_URL=[verify in Vercel]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[verify in Vercel]
SUPABASE_SERVICE_ROLE_KEY=[verify in Vercel]

# Stripe (Payments)
STRIPE_SECRET_KEY=[verify in Vercel]
STRIPE_WEBHOOK_SECRET=[verify in Vercel]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[verify in Vercel]

# Cron Security
CRON_SECRET=[verify in Vercel]
```

### Service Dashboards:
```
Polygon: https://polygon.io/dashboard
Resend: https://resend.com/dashboard
Vercel: https://vercel.com/dashboard
Supabase: https://app.supabase.com
Stripe: https://dashboard.stripe.com
GitHub: https://github.com/ADHallME
```

---

## 📂 PROJECT STRUCTURE

### Root Directory:
```
/Users/andyhall/virtera/toption-trading-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── alerts/
│   │   │   │   ├── criteria/route.ts       ✅ NEW: Alert CRUD
│   │   │   │   └── list/route.ts           ✅ NEW: Alert history
│   │   │   ├── recommendations/route.ts    ✅ NEW: AI engine
│   │   │   ├── opportunities/route.ts      (existing)
│   │   │   ├── social-feed/route.ts        (existing)
│   │   │   ├── cron/                       (existing)
│   │   │   ├── polygon/                    (existing)
│   │   │   └── stripe/                     (existing)
│   │   ├── dashboard/
│   │   │   └── page.tsx                    (main dashboard)
│   │   └── ...
│   ├── components/
│   │   └── dashboard/
│   │       ├── AlertSettings.tsx           ✅ NEW
│   │       ├── AlertNotifications.tsx      ✅ NEW
│   │       ├── AIRecommendations.tsx       ✅ NEW
│   │       ├── OpportunitiesScanner.tsx    (existing)
│   │       └── ... (40+ other components)
│   ├── lib/
│   │   ├── alerts/
│   │   │   └── alertService.ts             ✅ NEW
│   │   ├── ai/
│   │   │   └── recommendation-engine.ts    (enhanced)
│   │   ├── polygon/
│   │   │   ├── properClient.ts             (rate limiting)
│   │   │   └── optionsSnapshot.ts          (existing)
│   │   ├── social/
│   │   │   ├── stocktwits.ts               (existing)
│   │   │   └── reddit.ts                   (existing)
│   │   └── supabase.ts                     (existing)
│   ├── styles/
│   │   └── mobile-responsive.css           ✅ NEW
│   └── types/                              (existing)
├── database/
│   ├── alerts-schema.sql                   ✅ NEW
│   └── user-profiles-schema.sql            ✅ NEW
├── node_modules/                           (installed)
├── package.json
├── vercel.json                             (cron config)
├── DEPLOYMENT-SUMMARY.md                   ✅ NEW
├── QUICK-START.md                          ✅ NEW
├── LAUNCH-STATUS.md                        ✅ NEW
└── FINAL-CHECKLIST.md                      ✅ NEW
```

---

## 🔧 CRITICAL FILES LOCATIONS

### API Rate Limiting (Core Infrastructure):
```
/Users/andyhall/virtera/toption-trading-app/src/lib/polygon/properClient.ts
- Circuit breaker pattern
- Token bucket rate limiting
- Exponential backoff
- Per-endpoint tracking
```

### Scanner (Market Data):
```
/Users/andyhall/virtera/toption-trading-app/src/lib/server/properScanner.ts
- Scans 3,500+ equities
- Market hours aware
- Parallel batching
- Rate limited calls
```

### Cron Jobs:
```
/Users/andyhall/virtera/toption-trading-app/src/app/api/cron/
├── proper-scan/route.ts           (6am pre-market)
└── market-hours-refresh/route.ts  (hourly during trading)
```

### Alert System (NEW):
```
/Users/andyhall/virtera/toption-trading-app/src/lib/alerts/alertService.ts
/Users/andyhall/virtera/toption-trading-app/src/app/api/alerts/criteria/route.ts
/Users/andyhall/virtera/toption-trading-app/src/app/api/alerts/list/route.ts
/Users/andyhall/virtera/toption-trading-app/src/components/dashboard/AlertSettings.tsx
/Users/andyhall/virtera/toption-trading-app/src/components/dashboard/AlertNotifications.tsx
```

### AI Recommendations (NEW):
```
/Users/andyhall/virtera/toption-trading-app/src/lib/ai/recommendation-engine.ts
/Users/andyhall/virtera/toption-trading-app/src/app/api/recommendations/route.ts
/Users/andyhall/virtera/toption-trading-app/src/components/dashboard/AIRecommendations.tsx
```

---

## 🗄️ DATABASE SCHEMA

### Supabase Tables:
```
Current Tables (verify in Supabase):
- auth.users (Supabase managed)
- user_profiles (run migration)
- alert_criteria (run migration)
- alerts (run migration)
- subscriptions (existing)
- watchlists (existing?)
```

### Migration Files to Run:
```sql
1. /Users/andyhall/virtera/toption-trading-app/database/user-profiles-schema.sql
2. /Users/andyhall/virtera/toption-trading-app/database/alerts-schema.sql
```

**Run in:** https://app.supabase.com → SQL Editor → New Query → Paste → Run

---

## 📦 DEPENDENCIES

### Key Packages Installed:
```json
{
  "next": "latest",
  "react": "latest",
  "typescript": "latest",
  "resend": "^3.0.0",           // ✅ NEW (installed today)
  "@supabase/supabase-js": "^2.x",
  "stripe": "^x.x.x",
  "lucide-react": "^x.x.x"
}
```

### To Install Locally:
```bash
cd /Users/andyhall/virtera/toption-trading-app
npm install
```

---

## 🚀 DEPLOYMENT COMMANDS

### Local Development:
```bash
cd /Users/andyhall/virtera/toption-trading-app
npm run dev
# Opens: http://localhost:3000
```

### Deploy to Production:
```bash
cd /Users/andyhall/virtera/toption-trading-app
git add .
git commit -m "feat: your message"
git push origin main
# Auto-deploys to Vercel (~2 mins)
```

### Check Deployment Status:
```bash
# In Vercel dashboard or:
vercel ls --project toption-app
```

---

## 🎨 FRONTEND INTEGRATION POINTS

### Where to Add New Components:

**Dashboard Header (Alert Bell):**
```tsx
File: /Users/andyhall/virtera/toption-trading-app/src/app/dashboard/layout.tsx

import { AlertNotifications } from '@/components/dashboard/AlertNotifications'

// In header JSX:
<AlertNotifications />
```

**Dashboard Main (AI Recommendations):**
```tsx
File: /Users/andyhall/virtera/toption-trading-app/src/app/dashboard/page.tsx

import { AIRecommendations } from '@/components/dashboard/AIRecommendations'

// As a section or tab:
<AIRecommendations />
```

**Settings Page (Alert Settings):**
```tsx
File: /Users/andyhall/virtera/toption-trading-app/src/app/dashboard/settings/page.tsx
(or create: /src/app/dashboard/settings/alerts/page.tsx)

import { AlertSettings } from '@/components/dashboard/AlertSettings'

export default function AlertsPage() {
  return <AlertSettings />
}
```

---

## 🔍 HOW TO FIND THINGS

### Find Git Repository:
```bash
# If lost, search for .git directory:
find /Users/andyhall -name ".git" -type d 2>/dev/null | grep toption

# Expected result:
# (Should find the git repo, but may be missing - needs git init if so)
```

### Find Project Files:
```bash
# Main project:
ls -la /Users/andyhall/virtera/toption-trading-app

# Check if it's a git repo:
cd /Users/andyhall/virtera/toption-trading-app
git status
# If error "not a git repository", need to initialize
```

### If Git Not Initialized:
```bash
cd /Users/andyhall/virtera/toption-trading-app
git init
git remote add origin https://github.com/ADHallME/toption-trading-app.git
git fetch origin
git reset --hard origin/main
# Then can push normally
```

---

## 📊 MONITORING & LOGS

### Where to Check Logs:

**Vercel Deployment:**
```
https://vercel.com/andrew-halls-projects-c98040e4/toption-app/deployments
Click latest deployment → Logs tab
```

**Supabase Database:**
```
https://app.supabase.com → Logs → Select table
```

**Resend Email Delivery:**
```
https://resend.com/dashboard → Emails → Check delivery status
```

**Stripe Webhooks:**
```
https://dashboard.stripe.com/webhooks
```

**Polygon API Usage:**
```
https://polygon.io/dashboard → API Calls
```

---

## 🏗️ PROJECT ARCHITECTURE

### Data Flow:
```
1. Cron Job (Vercel) 
   → 2. properScanner.ts (scan tickers)
   → 3. properClient.ts (rate-limited Polygon calls)
   → 4. Supabase (cache opportunities)
   → 5. Alert Service (check matches)
   → 6. Resend (send emails)
   → 7. Dashboard (display to users)
```

### User Flow:
```
1. User signs up (Clerk/Supabase auth)
   → 2. Creates alert criteria (POST /api/alerts/criteria)
   → 3. System scans market hourly
   → 4. Matches found → Alert Service triggered
   → 5. Email sent + in-app notification
   → 6. User clicks → Views opportunity
   → 7. AI scores opportunity (GET /api/recommendations)
   → 8. User decides to trade
```

---

## 🎯 SUBSCRIPTION TIERS

### Configured in Code:
```typescript
File: /Users/andyhall/virtera/toption-trading-app/src/lib/subscription/tierAccess.ts

Solo Trader: $99/mo
- 500 top equities
- SPY index
- 3 futures (CL, NG, GC)

Professional: $249/mo
- ALL 3,500+ equities
- All indexes
- All futures

Institutional: $499/mo
- Everything from Pro+
- API access
- White label
```

---

## 📧 EMAIL TEMPLATES

### Alert Email Template:
```
Location: /Users/andyhall/virtera/toption-trading-app/src/lib/alerts/alertService.ts
Function: sendEmailAlert()
From: alerts@toptiontrade.com
```

**Email Includes:**
- Opportunity details (ticker, strategy, strike, expiration)
- Key metrics (ROI, PoP, Premium, IV)
- Direct link to view in dashboard
- Unsubscribe link

---

## 🧪 TESTING ENDPOINTS

### Test Locally:
```bash
# Start dev server:
npm run dev

# Test API endpoints:
curl http://localhost:3000/api/alerts/criteria
curl http://localhost:3000/api/recommendations?strategy=wheel
```

### Test Production:
```bash
# After deployment:
curl https://toptiontrade.com/api/alerts/criteria
curl https://toptiontrade.com/api/recommendations?strategy=wheel
```

---

## ⚠️ KNOWN ISSUES & STATUS

### Currently Working ✅:
- Rate limiting with circuit breaker
- Market hours scheduling
- 6am pre-market scan
- Hourly market refresh
- Polygon API integration
- Subscription tiers
- Stripe payments

### Newly Built (Need Testing) ⚡:
- Alert system (all endpoints)
- Email delivery (Resend)
- AI recommendations API
- Risk level calculation
- User profiles integration

### Still Todo Before Launch ⏳:
- Database migrations (5 mins)
- Mobile responsive polish (2 hrs)
- Legal docs (1 hr)
- Integration testing (1 hr)
- Marketing materials (2 hrs)

---

## 💡 QUICK COMMANDS REFERENCE

```bash
# Navigate to project:
cd /Users/andyhall/virtera/toption-trading-app

# Install dependencies:
npm install

# Run locally:
npm run dev

# Build for production:
npm run build

# Check for errors:
npm run lint

# Deploy:
git add .
git commit -m "your message"
git push origin main

# Check git status:
git status

# View remote:
git remote -v

# View branches:
git branch -a

# Pull latest:
git pull origin main
```

---

## 🆘 EMERGENCY CONTACTS & TROUBLESHOOTING

### If Deployment Fails:
1. Check Vercel logs: https://vercel.com/dashboard
2. Check build errors in Vercel UI
3. Verify env vars are set
4. Try deploying from Vercel UI manually

### If Database Issues:
1. Check Supabase: https://app.supabase.com
2. Verify migrations ran successfully
3. Check RLS policies
4. Look at SQL logs

### If Emails Don't Send:
1. Check Resend: https://resend.com/dashboard
2. Verify API key in Vercel env vars
3. Check spam folder
4. Look at Resend logs for errors

### If API Rate Limits Hit:
1. Check Polygon dashboard: https://polygon.io/dashboard
2. Verify properClient.ts circuit breaker working
3. Check Vercel cron logs
4. May need to increase delays

---

## 📝 IMPORTANT NOTES FOR NEXT SESSION

### START HERE:
1. **Project Location:** `/Users/andyhall/virtera/toption-trading-app`
2. **Git Repo:** `https://github.com/ADHallME/toption-trading-app`
3. **Deployment:** `https://toptiontrade.com` (auto-deploys from main)

### FIRST THING TO DO:
1. Verify git status: `cd /Users/andyhall/virtera/toption-trading-app && git status`
2. Check if changes committed: `git log --oneline -5`
3. Review files created: `ls -la src/lib/alerts/ src/app/api/alerts/`

### FILES THAT MUST BE DEPLOYED:
- All files in `src/lib/alerts/`
- All files in `src/app/api/alerts/`
- All files in `src/app/api/recommendations/`
- Components in `src/components/dashboard/Alert*.tsx` and `AIRecommendations.tsx`
- Database schemas in `database/`
- Documentation in root

### NEXT STEPS:
1. Run database migrations (5 mins)
2. Commit & push code (5 mins)
3. Test alert system (15 mins)
4. Test AI recommendations (15 mins)
5. Mobile responsive (2 hrs)
6. Legal docs (1 hr)
7. Launch Sunday 11:59 PM! 🚀

---

## 🎉 YOU HAVE EVERYTHING YOU NEED

This document contains:
- ✅ All directory paths
- ✅ Git repository info
- ✅ Service credentials
- ✅ File locations
- ✅ Deployment commands
- ✅ Testing instructions
- ✅ Troubleshooting steps

**No more searching. Everything is here.** 📍

Save this document. Reference it. Execute the plan. Launch Sunday! 🚀
