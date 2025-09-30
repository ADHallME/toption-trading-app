import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
}) : null

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }
  
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // For now, we'll need to get the customer ID from your database
    // This is a placeholder - you'll need to store the Stripe customer ID
    // when a user first subscribes
    
    // TODO: Get customer ID from your database
    // const { customerId } = await getUserStripeCustomerId(userId)
    
    // For testing, return a message
    return NextResponse.json({ 
      message: 'Customer portal will be available after first subscription',
      needsSetup: true 
    })
    
    // When you have customer IDs stored, use this:
    /*
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })
    
    return NextResponse.json({ url: session.url })
    */
    
  } catch (error) {
    console.error('Portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}