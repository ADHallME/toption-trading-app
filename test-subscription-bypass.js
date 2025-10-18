/**
 * TEST SUBSCRIPTION BYPASS SCRIPT
 * 
 * This script sets up dummy subscription data in your browser localStorage
 * to bypass the paywall and see the full UI.
 * 
 * Usage:
 * 1. Open your app in the browser (localhost:3000 or deployed URL)
 * 2. Open browser console (F12)
 * 3. Copy/paste this entire script and press Enter
 * 4. Refresh the page
 */

// Option 1: Mock Clerk user with premium subscription
const mockClerkUser = {
  id: 'test_user_premium',
  emailAddresses: [{
    emailAddress: 'test@premium.com',
    id: 'test_email_1'
  }],
  firstName: 'Test',
  lastName: 'Premium',
  publicMetadata: {
    subscriptionTier: 'premium',
    subscriptionStatus: 'active',
    stripeCustomerId: 'cus_test_premium',
    stripeSubscriptionId: 'sub_test_premium'
  },
  privateMetadata: {}
}

// Option 2: Mock subscription data for localStorage
const mockSubscriptionData = {
  tier: 'premium', // or 'pro' or 'basic'
  status: 'active',
  features: {
    aiOpportunities: true,
    advancedAnalytics: true,
    whaleAlerts: true,
    socialFeed: true,
    unlimitedScans: true,
    historicalData: true,
    customAlerts: true,
    portfolioTracking: true
  },
  stripeCustomerId: 'cus_test_bypass',
  stripeSubscriptionId: 'sub_test_bypass',
  currentPeriodStart: Date.now(),
  currentPeriodEnd: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
  cancelAtPeriodEnd: false
}

// Set in localStorage
console.log('🚀 Setting up test subscription bypass...')
localStorage.setItem('test_subscription', JSON.stringify(mockSubscriptionData))
localStorage.setItem('test_user', JSON.stringify(mockClerkUser))
localStorage.setItem('bypass_paywall', 'true')

console.log('✅ Test subscription data set!')
console.log('📊 Subscription Tier:', mockSubscriptionData.tier)
console.log('✨ All premium features enabled')
console.log('🔄 Refresh the page to see full UI')

// Also set a cookie as backup
document.cookie = `test_premium=true; path=/; max-age=${60 * 60 * 24 * 30}` // 30 days

console.log('\n💡 To remove test data later, run: localStorage.clear()')
