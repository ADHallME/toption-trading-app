import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    
    // For now, return a test URL
    // This will be replaced with actual Stripe integration
    const { priceId, couponCode } = await req.json()
    
    // Temporarily redirect to a success page
    const url = `/dashboard?checkout=success&plan=${priceId}&coupon=${couponCode || ''}`
    
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Checkout temporarily unavailable' },
      { status: 500 }
    )
  }
}