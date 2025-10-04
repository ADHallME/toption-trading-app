# 🗄️ DATABASE SETUP GUIDE - CLERK + SUPABASE

## **Your Current Architecture:**

```
┌─────────────────┐
│  CLERK AUTH     │  ← Handles user login/signup
│  (clerk.com)    │     User IDs like: "user_2abc123def"
└────────┬────────┘
         │
         │ JWT Token with user_id
         │
         ▼
┌─────────────────┐
│ SUPABASE DB     │  ← Stores all data
│ (Postgres)      │     - user_profiles
└─────────────────┘     - alert_criteria
                        - alerts
                        - watchlist
```

---

## ✅ **What You Have:**

1. **Clerk** - User authentication (login/signup)
2. **Supabase** - Postgres database for data storage
3. **Vercel** - Hosting/deployment

---

## 🚨 **THE PROBLEM I JUST FIXED:**

The SQL schemas I created earlier referenced `auth.users` (Supabase auth), but you're using **Clerk auth**!

**OLD (Wrong):**
```sql
user_id UUID NOT NULL REFERENCES auth.users(id)
```

**NEW (Correct):**
```sql
user_id TEXT NOT NULL  -- Clerk user IDs are strings like "user_abc123"
```

---

## 📋 **DEPLOYMENT STEPS - CORRECTED:**

### **Step 1: Deploy Code** (Same as before)

```bash
cd /Users/andyhall/virtera/toption-trading-app
git add .
git commit -m "feat: Alert System + AI Recommendations (Clerk-compatible)"
git push origin main
```

### **Step 2: Configure Clerk + Supabase Integration**

#### **A. In Clerk Dashboard:**

1. Go to https://dashboard.clerk.com
2. Select your app
3. Go to **JWT Templates** (left sidebar)
4. Click **"New template"**
5. Choose **"Supabase"** from templates
6. It will auto-create a template with:
   ```json
   {
     "sub": "{{user.id}}",
     "email": "{{user.primary_email_address}}"
   }
   ```
7. **Copy the JWKS URL** (looks like: `https://your-app.clerk.accounts.dev/.well-known/jwks.json`)
8. Click **Save**

#### **B. In Supabase Dashboard:**

1. Go to https://app.supabase.com
2. Select your project
3. Go to **Settings** → **Authentication**
4. Scroll to **"JWT Verification"**
5. Click **"Add new JWKS URL"**
6. Paste the Clerk JWKS URL from above
7. Click **Save**

### **Step 3: Run Database Migrations** (Use NEW files!)

1. Go to Supabase SQL Editor
2. **First:** Run `database/user-profiles-schema-clerk.sql`
3. **Second:** Run `database/alerts-schema-clerk.sql`
4. Verify tables created

### **Step 4: Verify Environment Variables in Vercel**

Make sure these are set:

**Clerk:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

**Supabase:**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**Polygon:**
```
POLYGON_API_KEY=geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp
```

**Resend (for emails):**
```
RESEND_API_KEY=re_dyZgFuk8_...
```

---

## 🔧 **HOW THE INTEGRATION WORKS:**

### **In Your Code:**

```typescript
// 1. Get Clerk user ID
import { auth } from '@clerk/nextjs'

const { userId } = auth()
// userId is like: "user_2abc123def"

// 2. Get Supabase token from Clerk
import { useAuth } from '@clerk/nextjs'

const { getToken } = useAuth()
const supabaseToken = await getToken({ template: 'supabase' })

// 3. Create Supabase client with Clerk token
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      headers: {
        Authorization: `Bearer ${supabaseToken}`
      }
    }
  }
)

// 4. Now RLS policies work! Queries are scoped to the logged-in user
const { data } = await supabase
  .from('alert_criteria')
  .select('*')
// Returns only alerts for the logged-in Clerk user
```

---

## 🧪 **TESTING THE INTEGRATION:**

After deployment, test these:

### **1. Create Alert Test:**
```typescript
// In your API route or component
const { userId } = auth()

const { data, error } = await supabase
  .from('alert_criteria')
  .insert({
    user_id: userId, // Clerk user ID
    name: 'Test Alert',
    strategies: ['wheel'],
    min_roi: 5.0,
    enabled: true
  })
```

### **2. Fetch User Profile Test:**
```typescript
const { userId } = auth()

const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', userId)
  .single()
```

### **3. Create User Profile (First Login):**
```typescript
const { userId } = auth()

const { data, error } = await supabase
  .from('user_profiles')
  .upsert({
    user_id: userId,
    preferred_strategies: ['wheel', 'covered_call'],
    risk_tolerance: 'moderate',
    target_monthly_return: 3.0
  })
```

---

## 📊 **WHERE IS YOUR DATA?**

### **Clerk (clerk.com):**
- User accounts
- Email addresses
- Login sessions
- OAuth connections

### **Supabase (app.supabase.com):**
- user_profiles (trading preferences)
- alert_criteria (custom alerts)
- alerts (triggered notifications)
- watchlist (tracked tickers)
- Any other app data

### **localStorage (Browser):**
- Temporary data (cached opportunities, etc.)
- NOT persisted across devices
- Will be replaced with Supabase eventually

---

## ⚠️ **IMPORTANT NOTES:**

1. **Clerk user IDs are STRINGS**, not UUIDs
   - Format: `"user_2abc123def"`
   - NOT: `"550e8400-e29b-41d4-a716-446655440000"`

2. **RLS policies require Clerk JWT integration**
   - Without it, database queries will fail
   - Follow the Clerk + Supabase setup above

3. **User profiles must be created manually**
   - Supabase won't auto-create profiles
   - Add profile creation to your onboarding flow

4. **Test locally first:**
   - Use Clerk's test keys
   - Test database operations
   - Then deploy to production

---

## 🚨 **QUICK FIX IF BREAKING:**

If the Clerk + Supabase integration doesn't work immediately, you can temporarily disable RLS:

```sql
-- TEMPORARY - Disable RLS for testing
ALTER TABLE alert_criteria DISABLE ROW LEVEL SECURITY;
ALTER TABLE alerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- REMEMBER TO RE-ENABLE AFTER FIXING!
```

But **DO NOT DEPLOY TO PRODUCTION** with RLS disabled!

---

## ✅ **CORRECT MIGRATION ORDER:**

1. ✅ Deploy code (git push)
2. ✅ Configure Clerk JWT template
3. ✅ Configure Supabase JWKS
4. ✅ Run `user-profiles-schema-clerk.sql`
5. ✅ Run `alerts-schema-clerk.sql`
6. ✅ Test alert creation
7. ✅ Test user profile
8. ✅ Verify RLS policies work

---

## 🎯 **BOTTOM LINE:**

**Database Location:** Supabase Postgres (app.supabase.com)
**Auth Provider:** Clerk (dashboard.clerk.com)
**How They Connect:** Clerk JWT → Supabase validates → RLS policies enforce user isolation

**Files to Use:**
- ✅ `database/user-profiles-schema-clerk.sql` (NEW - Clerk-compatible)
- ✅ `database/alerts-schema-clerk.sql` (NEW - Clerk-compatible)
- ❌ ~~`database/user-profiles-schema.sql`~~ (OLD - Supabase auth)
- ❌ ~~`database/alerts-schema.sql`~~ (OLD - Supabase auth)

---

**Ready to deploy now with the CORRECT schemas!** 🚀

