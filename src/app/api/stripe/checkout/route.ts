import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
}) : null

// Product price IDs - you'll need to create these in Stripe Dashboard
const PRICE_IDS = {
  starter: process.env.STRIPE_STARTER_PRICE_ID || 'price_1QRwGxLLY2starter',
  professional: process.env.STRIPE_PROFESSIONAL_PRICE_ID || 'price_1QRwGxLLY2professional',
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_1QRwGxLLY2enterprise',
}

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }
  
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }
    
    const { priceId, planType, couponCode } = await req.json()
    
    // Get the actual price ID
    const stripePriceId = PRICE_IDS[planType as keyof typeof PRICE_IDS] || priceId
    
    // Create Stripe checkout session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://toption-app.vercel.app'}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://toption-app.vercel.app'}/pricing?cancelled=true`,
      client_reference_id: userId,
      subscription_data: {
        trial_period_days: 14, // 14-day free trial
        metadata: {
          userId,
          planType: planType || 'unknown'
        },
      },
      metadata: {
        userId,
      },
      allow_promotion_codes: true, // Allow Stripe promotion codes
    }
    
    // Apply coupon if provided
    if (couponCode) {
      try {
        // Try to retrieve or create the coupon
        let coupon: Stripe.Coupon
        
        try {
          // Check if coupon exists
          coupon = await stripe.coupons.retrieve(couponCode)
        } catch {
          // Create coupon if it doesn't exist (for our launch codes)
          if (couponCode === 'FOUNDER50') {
            coupon = await stripe.coupons.create({
              id: 'FOUNDER50',
              percent_off: 50,
              duration: 'repeating',
              duration_in_months: 6,
            })
          } else if (couponCode === 'LAUNCH30') {
            coupon = await stripe.coupons.create({
              id: 'LAUNCH30',
              percent_off: 30,
              duration: 'repeating',
              duration_in_months: 3,
            })
          } else {
            // Invalid coupon code, continue without it
            console.log(`Invalid coupon code: ${couponCode}`)
          }
        }
        
        // Apply the coupon if we have one
        if (coupon!) {
          sessionConfig.discounts = [
            {
              coupon: coupon.id,
            },
          ]
        }
      } catch (error) {
        console.error('Coupon error:', error)
        // Continue without coupon if there's an error
      }
    }
    
    // Create the session
    const session = await stripe.checkout.sessions.create(sessionConfig)
    
    // Return the checkout URL
    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id 
    })
    
  } catch (error) {
    console.error('Stripe checkout error:', error)
    
    // Better error messages
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Stripe error: ${error.message}` },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again.' },
      { status: 500 }
    )
  }
}