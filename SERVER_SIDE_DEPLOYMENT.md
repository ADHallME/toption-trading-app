# 🚀 SERVER-SIDE SCANNING DEPLOYMENT GUIDE

## What Was Built

### Architecture Change
- **BEFORE:** Client scans 310 tickers on every dashboard load → Rate limits, slow, not scalable
- **AFTER:** Server scans ALL ~3,500 optionable equities every 5 mins → Instant for users, scalable

### New Files Created
1. `/src/lib/server/opportunityScanner.ts` - Server-side scanner service
2. `/src/app/api/opportunities/route.ts` - API endpoint for clients to fetch data
3. `/src/app/api/cron/scan-opportunities/route.ts` - Cron job endpoint
4. Updated `/src/components/dashboard/OpportunitiesFinal.tsx` - Client now fetches from API
5. Updated `/vercel.json` - Added cron job configuration

### How It Works

```
┌─────────────────────────────────────────┐
│  VERCEL CRON JOB (Every 5 minutes)     │
│  GET /api/cron/scan-opportunities       │
│  → Scans ALL 3,500 optionable stocks   │
│  → Takes ~3-4 minutes                   │
│  → Caches results in memory             │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  CLIENT REQUESTS                        │
│  GET /api/opportunities                 │
│  → Returns cached data instantly (<1s)  │
│  → Client refreshes every 30s           │
└─────────────────────────────────────────┘
```

## Deployment Steps

### Step 1: Add Environment Variables to Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these:
- `POLYGON_API_KEY` = Your Polygon API key
- `NEXT_PUBLIC_POLYGON_API_KEY` = Same Polygon API key
- `CRON_SECRET` = Generate a random string (e.g., `openssl rand -hex 32`)

### Step 2: Deploy Code

```bash
cd /Users/andyhall/virtera/toption-trading-app
git add -A
git commit -m "feat: Server-side scanning for ALL optionable equities

- Moved scanning from client to server-side
- Scans ALL ~3,500 optionable US equities every 5 mins
- Client fetches cached results (instant)
- Added Vercel cron job for automated scanning
- No more rate limit issues
- Scalable to unlimited users"
git push origin main
```

### Step 3: Enable Vercel Cron Jobs

1. After deploy completes, go to Vercel Dashboard
2. Navigate to Project → Cron Jobs tab
3. You should see: `/api/cron/scan-opportunities` scheduled for `*/5 * * * *`
4. Click "Enable" if not already enabled

**Note:** Vercel Hobby plan = 2 cron jobs included. Pro plan = unlimited.

### Step 4: Trigger Initial Scan

The first time, cache will be empty. To populate it immediately:

**Option A: Wait for first cron run (up to 5 mins)**

**Option B: Trigger manually**
```bash
curl -X POST https://www.toptiontrade.com/api/opportunities \
  -H "Content-Type: application/json"
```

Or just visit `/api/opportunities` in browser - it will scan on first request.

### Step 5: Verify It's Working

1. **Check Vercel Logs:**
   - Look for `[SERVER SCAN]` messages
   - Should see "Found X optionable equities"
   - Should see "Scan complete in Xs"

2. **Check Dashboard:**
   - Visit https://www.toptiontrade.com/dashboard
   - Should load instantly (no 3-minute wait)
   - Should show "Tickers Scanned: ~3,500"
   - Should show "Last Scan: X mins ago"

3. **Check Footer:**
   - Green dot = Live data
   - Amber dot = Refreshing
   - Red dot = Error

## Testing the Cron Job Manually

You can trigger the cron job manually (useful for testing):

```bash
# Replace YOUR_CRON_SECRET with the value from Vercel env vars
curl https://www.toptiontrade.com/api/cron/scan-opportunities \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Expected response:
```json
{
  "success": true,
  "message": "Scan complete",
  "metadata": {
    "lastScan": "2025-10-02T18:30:00.000Z",
    "tickersScanned": 3542,
    "totalOpportunities": 15847,
    "scanDurationMs": 186234
  },
  "duration": "186.2s"
}
```

## Monitoring

### What to Watch in Vercel Logs

**Good Signs:**
```
[SERVER SCAN] Starting complete market scan...
[SERVER SCAN] Found 3542 optionable equities
[SERVER SCAN] Processing batch 1/178 (20 tickers)
[SERVER SCAN] Batch 1 complete: 47 opportunities found
...
[SERVER SCAN] Complete! Scanned 3542 tickers in 186.2s
[SERVER SCAN] Breakdown:
  - Market Movers: 2,341
  - High IV: 4,823
  - Conservative: 6,891
  - Earnings: 1,792
```

**Bad Signs:**
```
[SERVER SCAN] Error during scan: ...
[API] Background scan failed: ...
```

### Polygon API Usage

With server-side scanning:
- **Requests per scan:** ~3,500 (one per ticker)
- **Scans per day:** 288 (every 5 mins)
- **Total daily requests:** ~1,008,000

**Polygon Plans:**
- Free tier: 5 API calls/minute → Not enough
- Starter ($29/mo): 100,000 calls/month → Not enough
- **Developer ($99/mo): Unlimited calls** → Required for this scale

**Recommendation:** Upgrade to Developer plan or increase scan interval to 30 mins.

## Adjusting Scan Frequency

Edit `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/scan-opportunities",
      "schedule": "*/30 * * * *"  // Every 30 mins instead of 5
    }
  ]
}
```

Common intervals:
- `*/5 * * * *` = Every 5 minutes (current)
- `*/15 * * * *` = Every 15 minutes
- `*/30 * * * *` = Every 30 minutes
- `0 * * * *` = Every hour (on the hour)

## Benefits of This Approach

✅ **Instant Load Times** - Dashboard loads in <1 second  
✅ **Complete Market Coverage** - All 3,500+ optionable stocks  
✅ **Scalable** - 1,000 users = same server load  
✅ **No Rate Limits for Users** - Only server hits Polygon  
✅ **Fresh Data** - Auto-updates every 5 minutes  
✅ **User Can Adjust Refresh** - We can lower interval later if needed  

## Next Steps After Deploy

1. **Monitor first few scans** in Vercel logs
2. **Verify Polygon usage** doesn't hit limits
3. **Check dashboard loads** properly
4. **Test with multiple users** simultaneously
5. **Adjust scan frequency** if needed

## Troubleshooting

### "No cache available" on first load
- **Expected** - Takes 3-4 mins for first scan
- Trigger manual scan with POST to `/api/opportunities`

### Cron job not running
- Check Vercel → Cron Jobs tab → Ensure enabled
- Check environment variable `CRON_SECRET` is set
- Check logs for authorization errors

### 0 opportunities found
- Check Polygon API key is correct
- Check `NEXT_PUBLIC_POLYGON_API_KEY` vs `POLYGON_API_KEY` both set
- Check Polygon dashboard for rate limit issues

### Still seeing old client-side scanning
- Hard refresh (Cmd+Shift+R)
- Clear browser cache
- Verify latest deploy is active in Vercel

## Future Improvements

- **Redis caching** - Replace in-memory cache with Redis for multi-server
- **Incremental scanning** - Scan high-volume tickers more frequently
- **Smart refresh** - Only re-scan tickers that changed
- **User preferences** - Let users choose scan frequency
- **Webhook triggers** - Scan on market events (earnings, splits, etc.)

---

## 🎯 ONE COMMAND TO DEPLOY

```bash
cd /Users/andyhall/virtera/toption-trading-app && git add -A && git commit -m "feat: Server-side scanning for ALL optionable equities" && git push origin main
```

After push, wait 2-3 minutes for Vercel deploy, then check logs for `[SERVER SCAN]` messages.
