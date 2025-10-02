// This endpoint has been removed
// No more fallback data - real data only
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    error: 'Fallback data has been removed. Use real market scanner.',
    message: 'Call /api/market-scan instead'
  }, { status: 410 }) // 410 Gone
}


