import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
}) : null

// Webhook secret from Stripe Dashboard
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }
  
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')!
    
    let event: Stripe.Event
    
    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }
    
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('✅ Checkout completed:', session.id)
        
        // Handle successful checkout
        const userId = session.client_reference_id || session.metadata?.userId
        
        if (userId) {
          // TODO: Update user's subscription status in your database
          console.log(`User ${userId} subscribed successfully`)
          
          // You can integrate with Supabase or your database here
          // Example:
          // await updateUserSubscription(userId, {
          //   subscriptionId: session.subscription,
          //   status: 'active',
          //   customerId: session.customer,
          // })
        }
        break
      }
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('📝 Subscription updated:', subscription.id)
        
        // Handle subscription updates
        const userId = subscription.metadata?.userId
        if (userId) {
          const status = subscription.status
          const currentPeriodEnd = new Date((subscription as any).current_period_end * 1000)
          
          console.log(`User ${userId} subscription status: ${status}`)
          // TODO: Update in database
        }
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('❌ Subscription cancelled:', subscription.id)
        
        // Handle cancellation
        const userId = subscription.metadata?.userId
        if (userId) {
          console.log(`User ${userId} cancelled subscription`)
          // TODO: Update in database
        }
        break
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('💰 Payment succeeded:', invoice.id)
        break
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.error('💳 Payment failed:', invoice.id)
        
        // Handle failed payment
        // You might want to send an email to the customer
        break
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
    
    // Return success response
    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}