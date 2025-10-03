import { NextRequest, NextResponse } from 'next/server'

// EMERGENCY KILL SWITCH - RETURNS IMMEDIATELY
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    error: 'API temporarily disabled for maintenance' 
  }, { status: 503 })
}