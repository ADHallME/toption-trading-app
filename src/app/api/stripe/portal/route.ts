import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import Stripe from 'stripe'

// Lazy-load Stripe to avoid build-time instantiation errors
function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-08-27.basil'
  })
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe()
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's Stripe customer ID
    const user = await clerkClient.users.getUser(userId)
    const customerId = user.publicMetadata?.stripeCustomerId as string
    
    if (!customerId) {
      return NextResponse.json(
        { error: 'No active subscription' },
        { status: 400 }
      )
    }
    
    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile`,
    })
    
    return NextResponse.json({ url: session.url })
    
  } catch (error) {
    console.error('Portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}