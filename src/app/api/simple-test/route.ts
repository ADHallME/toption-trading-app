import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: "API is working!",
    timestamp: new Date().toISOString(),
    env: {
      nodeEnv: process.env.NODE_ENV,
      hasPolygonKey: !!process.env.POLYGON_API_KEY,
      polygonKeyLength: process.env.POLYGON_API_KEY?.length || 0
    }
  })
}