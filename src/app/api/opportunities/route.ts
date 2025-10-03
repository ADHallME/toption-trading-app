import { NextRequest, NextResponse } from 'next/server'

// EMERGENCY KILL SWITCH - RETURNS IMMEDIATELY
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    success: false,
    opportunities: [],
    error: 'API temporarily disabled for maintenance' 
  }, { status: 503 })
}