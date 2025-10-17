import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { clerkClient } from '@clerk/nextjs/server'

// Lazy-load Stripe to avoid build-time instantiation errors
function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-08-27.basil'
  })
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  const stripe = getStripe()
  const body = await request.text()
  const signature = headers().get('stripe-signature') || ''
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
  
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId || session.client_reference_id
        
        if (!userId) {
          console.error('No user ID in session metadata')
          break
        }
        
        // Get the subscription
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )
        
        // Determine tier based on price ID
        const priceId = subscription.items.data[0].price.id
        let tier: 'basic' | 'professional' | 'premium' = 'basic'
        
        if (priceId === process.env.NEXT_PUBLIC_STRIPE_SOLOTRADER_PRICE_ID) {
          tier = 'basic'
        } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRICE_ID) {
          tier = 'professional'
        } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_INSTITUTIONAL_PRICE_ID) {
          tier = 'premium'
        }
        
        // Update user metadata in Clerk
        await clerkClient.users.updateUserMetadata(userId, {
          publicMetadata: {
            subscriptionTier: tier,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: subscription.status
          }
        })
        
        console.log(`User ${userId} subscribed to ${tier} tier`)
        break
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        
        // Find user by Stripe customer ID
        const users = await clerkClient.users.getUserList({
          limit: 100
        })
        
        const user = users.data.find(u => 
          u.publicMetadata?.stripeCustomerId === customerId
        )
        
        if (!user) {
          console.error('User not found for customer:', customerId)
          break
        }
        
        // Update subscription status
        await clerkClient.users.updateUserMetadata(user.id, {
          publicMetadata: {
            ...user.publicMetadata,
            subscriptionStatus: subscription.status
          }
        })
        
        console.log(`Subscription updated for user ${user.id}: ${subscription.status}`)
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        
        // Find user by Stripe customer ID
        const users = await clerkClient.users.getUserList({
          limit: 100
        })
        
        const user = users.data.find(u => 
          u.publicMetadata?.stripeCustomerId === customerId
        )
        
        if (!user) {
          console.error('User not found for customer:', customerId)
          break
        }
        
        // Downgrade to free tier
        await clerkClient.users.updateUserMetadata(user.id, {
          publicMetadata: {
            ...user.publicMetadata,
            subscriptionTier: 'free',
            subscriptionStatus: 'canceled'
          }
        })
        
        console.log(`Subscription canceled for user ${user.id}`)
        break
      }
    }
    
    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}