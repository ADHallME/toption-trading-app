# 🚨 SUNDAY NIGHT EMERGENCY LAUNCH PLAN
**Time: 9PM Sunday** | **Goal: Working app by midnight**

## PHASE 1: DEPLOY FIXES (10 minutes)

### Step 1: Deploy (5 min)
```bash
cd ~/virtera/toption-trading-app
chmod +x DEPLOY-NOW.sh
./DEPLOY-NOW.sh
```

**Expected output:**
- ✅ Git push successful
- ✅ Vercel deployment triggered
- ✅ Scan endpoint returns: `{"success":true,"message":"Scan started"...}`

### Step 2: Wait (2 min)
- Scan is running (3 tickers × 2 API calls × 15 seconds = ~90 seconds)
- Watch Vercel logs: https://vercel.com/andrew-halls-projects-c98040e4/toption-app/logs

### Step 3: Test (3 min)
```bash
chmod +x test-api.sh
./test-api.sh
```

**Expected output:**
```json
{
  "success": true,
  "data": {
    "opportunities": [
      {
        "symbol": "AAPL",
        "strike": 175,
        "premium": 2.50,
        ...
      }
    ]
  }
}
```

---

## PHASE 2: VERIFY DASHBOARD (5 minutes)

### Step 1: Open Dashboard
```bash
open https://www.toptiontrade.com/dashboard
```

### Step 2: Check for:
- ✅ Opportunities visible (not "No opportunities available")
- ✅ Real ticker symbols (AAPL, MSFT, etc.)
- ✅ ROI percentages showing
- ✅ No console errors (F12)

### Step 3: If Working:
Trigger larger batch:
```bash
curl "https://www.toptiontrade.com/api/market-scan?market=equity&batch=10"
```
Wait 5 minutes, refresh dashboard.

---

## PHASE 3: IF NOT WORKING (Troubleshooting)

### Scenario A: "Scan started" but no data after 3 minutes

**Check Vercel logs for:**
```
[POLYGON] Fetching price for AAPL
[POLYGON] AAPL price: $XXX
[SCANNER] AAPL: Found X opportunities
```

**If you see errors:**
- 429 errors → Rate limit hit (shouldn't happen with 15s delays)
- "Circuit breaker" → Old code still deployed
- "Failed to fetch" → Polygon API key issue

**Fix:**
```bash
# Re-deploy to force refresh
git commit --allow-empty -m "force redeploy"
git push origin main
```

### Scenario B: Dashboard shows old "No opportunities" message

**Reasons:**
1. Browser cache
2. Scan hasn't completed
3. API returning empty data

**Fix:**
```bash
# Hard refresh browser
# Cmd+Shift+R (Mac) or Ctrl+F5 (Windows)

# Or test API directly:
curl "https://www.toptiontrade.com/api/opportunities-fast?marketType=equity"
```

### Scenario C: Still getting 404 errors

**Check:**
```bash
# Verify files are deployed
curl https://www.toptiontrade.com/api/market-scan

# Should NOT be 404
```

**If 404:**
```bash
# Check Vercel build logs
# https://vercel.com/andrew-halls-projects-c98040e4/toption-app

# Look for build errors
# Fix and redeploy
```

---

## PHASE 4: SCALE UP (if Phase 1-2 worked)

### 10:00 PM - Small Batch
```bash
curl "https://www.toptiontrade.com/api/market-scan?market=equity&batch=10"
# Wait 5 minutes
# Verify dashboard
```

### 10:15 PM - Medium Batch
```bash
curl "https://www.toptiontrade.com/api/market-scan?market=equity&batch=20"
# Wait 10 minutes
# Verify dashboard
```

### 10:30 PM - Large Batch
```bash
curl "https://www.toptiontrade.com/api/market-scan?market=equity&batch=50"
# Wait 25 minutes
# Go do something else, check at 11:00 PM
```

---

## PHASE 5: LAUNCH PREP (if working)

### Index & Futures Markets
```bash
# Trigger Index scan
curl "https://www.toptiontrade.com/api/market-scan?market=index&batch=10"

# Trigger Futures scan
curl "https://www.toptiontrade.com/api/market-scan?market=futures&batch=10"
```

### Enable Cron Jobs (Optional - if you want auto-refresh)
1. Go to Vercel Dashboard
2. Enable cron jobs in vercel.json
3. Redeploy

### Final Checks
- [ ] All 3 tabs work (Equity/Index/Futures)
- [ ] Opportunities display correctly
- [ ] No console errors
- [ ] Loading states work
- [ ] Mobile responsive
- [ ] Performance acceptable

---

## EMERGENCY CONTACTS (if you get stuck)

### Option 1: Run diagnostics and send me results
```bash
./test-api.sh > api-test-results.txt
cat api-test-results.txt
```
Paste results and I'll tell you exact fix.

### Option 2: Quick contractor
- **Upwork**: Search "Next.js emergency" - $100-200 for 2 hours
- **Fiverr Pro**: "Next.js API debugging" - $150-300
- Post on Twitter: "Need Next.js contractor for 2 hours TONIGHT, $200"

### Option 3: Simplify and launch
If technical issues persist:
1. Deploy with just 5 tickers hardcoded
2. Launch with limited features
3. Fix properly tomorrow

---

## SUCCESS CRITERIA

**Minimum to launch tonight:**
- ✅ Dashboard loads without errors
- ✅ At least 10-20 opportunities showing
- ✅ Real Polygon data (not sample)
- ✅ Equity tab works
- ✅ No rate limit errors

**Nice to have:**
- Index/Futures tabs working
- 50+ opportunities
- Auto-refresh via cron
- All features enabled

---

## TIMELINE

**9:00 PM** - Deploy fixes (you are here)
**9:10 PM** - Verify working with 3 tickers
**9:20 PM** - Scale to 10 tickers
**9:40 PM** - Scale to 20 tickers
**10:00 PM** - Scale to 50 tickers
**10:30 PM** - Enable other markets
**11:00 PM** - Final testing
**11:30 PM** - Launch decision

**By midnight:** Working app OR decision to simplify/postpone

---

## MY COMMITMENT

I'll be here monitoring. If you run into issues:
1. Run `./test-api.sh`
2. Paste the output
3. I'll give you exact fix within 5 minutes

**Let's get this working in the next hour. Deploy now!** 🚀
