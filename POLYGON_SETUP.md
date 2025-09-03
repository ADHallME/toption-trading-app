# POLYGON SETUP INSTRUCTIONS

## ⚠️ URGENT SECURITY ACTIONS

1. **GO TO POLYGON.IO NOW** and change your password (you shared it publicly)
2. **REGENERATE YOUR API KEY** after changing password
3. **NEVER share API keys in messages**

## Setting Up Environment Variables

1. Create a file called `.env.local` in the root directory
2. Add your Polygon API key (after regenerating it):

```
POLYGON_API_KEY=your_new_api_key_here
```

3. Add to Vercel for production:
   - Go to Vercel Dashboard > Settings > Environment Variables
   - Add `POLYGON_API_KEY` with your new key
   - Redeploy

## Testing the Integration

1. Start your dev server:
```bash
npm run dev
```

2. Test the API endpoint:
```
http://localhost:3000/api/polygon/options?ticker=SPY
```

3. You should see real Polygon data returned

## Using Real Data in Components

Replace sample data imports with the hook:

```typescript
import { usePolygonOptions } from '@/hooks/usePolygon'

function MyComponent() {
  const { data, loading, error } = usePolygonOptions({
    ticker: 'SPY',
    minStrike: 450,
    maxStrike: 500
  })
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  // Use real data
  return (
    <div>
      {data.map(option => (
        <div key={option.ticker}>
          {option.strike_price} - ${option.bid}
        </div>
      ))}
    </div>
  )
}
```

## WebSocket Setup (for real-time)

The WebSocket client is ready but needs frontend integration.
We'll add this after basic API is working.

## Rate Limits

Check your Polygon plan limits:
- API calls per minute
- WebSocket connections
- Historical data access

## Next Steps

1. **CHANGE YOUR PASSWORD AND REGENERATE API KEY**
2. Set up .env.local with new key
3. Test the API endpoint
4. Deploy to Vercel with environment variable
5. Replace sample data with real API calls