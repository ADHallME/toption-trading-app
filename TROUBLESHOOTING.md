# 🔍 TROUBLESHOOTING GUIDE - "It's Not Working"

## Tell me EXACTLY what's happening:

### ❓ Questions:
1. **Where are you testing?**
   - [ ] Local (localhost:3000)
   - [ ] Production (toptiontrade.com)

2. **Did you deploy the changes?**
   - [ ] Yes, I ran `git push origin main`
   - [ ] No, files only changed locally
   - [ ] Not sure

3. **What exactly do you see?**
   - [ ] Still "No opportunities available"
   - [ ] Dashboard is blank/white screen
   - [ ] Loading forever
   - [ ] Error message (write it below)
   - [ ] Something else

4. **Browser console errors?**
   - Open DevTools (F12)
   - Go to Console tab
   - Copy any red errors here:
   ```
   [PASTE ERRORS HERE]
   ```

5. **Network tab shows?**
   - Go to Network tab in DevTools
   - Refresh dashboard
   - Look for `/api/opportunities` or `/api/opportunities-fast`
   - What status code? (200, 404, 500?)
   - What response body?
   ```
   [PASTE RESPONSE HERE]
   ```

---

## QUICK CHECKS:

### ✅ Check 1: Are changes deployed?
```bash
cd /Users/andyhall/virtera/toption-trading-app

# See if you have uncommitted changes
git status

# If you see modified files, deploy them:
git add .
git commit -m "fix: static tickers and rate limiting"
git push origin main
```

### ✅ Check 2: Test API directly
```bash
# If testing locally:
curl "http://localhost:3000/api/market-scan?market=equity&batch=5"

# If testing production:
curl "https://www.toptiontrade.com/api/market-scan?market=equity&batch=5"

# Should return:
# {"success":true,"message":"Scan started for equity",...}
```

### ✅ Check 3: Check Vercel logs
1. Go to: https://vercel.com/andrew-halls-projects-c98040e4/toption-app/logs
2. Look for:
   - ✅ `[TICKERS] Using static equity universe`
   - ✅ `[BATCH 1] Starting equity scan`
   - ❌ Any 429 errors
   - ❌ Any "Failed to fetch" errors

3. Copy relevant logs here:
```
[PASTE VERCEL LOGS HERE]
```

---

## COMMON ISSUES & FIXES:

### Issue 1: "Changes not deployed"
**Symptom:** Still seeing old behavior  
**Fix:**
```bash
git add .
git commit -m "fix: apply static ticker changes"
git push origin main
# Wait 2 minutes for Vercel deployment
```

### Issue 2: "Scan not triggering"
**Symptom:** No logs, nothing happening  
**Fix:** Manually trigger scan:
```bash
curl "https://www.toptiontrade.com/api/market-scan?market=equity&batch=10"
```

### Issue 3: "Still getting 429 errors"
**Symptom:** Vercel logs show rate limiting  
**Fix:** Need to slow down even more:
1. Edit `src/lib/polygon/properClient.ts`
2. Change to: `callsPerSecond: 0.05` (1 call every 20 seconds)
3. Deploy

### Issue 4: "Dashboard loads but no data"
**Check:** Visit this URL directly:
```
https://www.toptiontrade.com/api/opportunities-fast?marketType=equity
```
**Should return:** JSON with opportunities  
**If returns:** `{"success":false,"scanning":true}` → Wait 5 minutes and refresh

### Issue 5: "Localhost not working"
**Symptom:** `npm run dev` shows errors  
**Fix:**
```bash
# Clear cache and rebuild
rm -rf .next
npm install
npm run dev
```

---

## 🆘 EMERGENCY RESET

If nothing works, try this:

```bash
# 1. Verify files are correct
cat src/lib/polygon/allTickers.ts | grep "EQUITY_UNIVERSE ="

# Should show array of tickers like:
# export const EQUITY_UNIVERSE = [
#   'AAPL', 'MSFT', 'GOOGL', ...

# 2. Verify rate limiting
cat src/lib/polygon/properClient.ts | grep "callsPerSecond"

# Should show:
# callsPerSecond: 0.1,

# 3. Force fresh deployment
git add .
git commit -m "force redeploy with fixes"
git push origin main --force

# 4. Clear Vercel cache
# Go to: https://vercel.com/andrew-halls-projects-c98040e4/toption-app
# Click "Redeploy" button

# 5. Manually trigger scan
curl "https://www.toptiontrade.com/api/market-scan?market=equity&batch=10"

# 6. Wait 5 minutes

# 7. Check dashboard
open https://www.toptiontrade.com/dashboard
```

---

## 📊 WHAT SUCCESS LOOKS LIKE

When it's working, you'll see:

**In Vercel Logs:**
```
[TICKERS] Using static equity universe (200 most liquid)
[BATCH 1] Starting equity scan of 10 tickers
[SCAN] AAPL: Fetching stock price...
[SCAN] AAPL: Fetching options chain...
[SCAN] AAPL: Found 5 opportunities
[BATCH 1] Progress: 1/10
...
[BATCH 1] Complete in 180000ms
```

**In Dashboard:**
- Opportunities cards showing
- Real ticker symbols (AAPL, MSFT, etc.)
- ROI percentages
- DTE values
- Metadata showing: `"source": "polygon-api-real-data"`

**In API Response:**
```json
{
  "success": true,
  "data": {
    "opportunities": [...],
    "metadata": {
      "lastScan": "2025-10-05T...",
      "tickersScanned": 10,
      "totalOpportunities": 45
    }
  }
}
```

---

## 🚨 IF STILL NOT WORKING

Please provide:

1. **Exact error message** (from console or screen)
2. **Response from:** `/api/opportunities?marketType=equity`
3. **Vercel logs** (last 20 lines)
4. **Git status output**
5. **Screenshot** of what you see

With that info, I can give you a precise fix!
