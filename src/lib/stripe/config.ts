// Stripe configuration
export const STRIPE_CONFIG = {
  // Product Price IDs (update these after creating in Stripe Dashboard)
  PRICES: {
    STARTER: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE || 'price_1234',
    PROFESSIONAL: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRICE || 'price_5678',
    ENTERPRISE: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE || 'price_9012'
  },
  
  // Trial period in days
  TRIAL_DAYS: 14,
  
  // Coupon codes
  COUPONS: {
    FOUNDER50: { percent_off: 50, duration: 'repeating', duration_in_months: 6 },
    LAUNCH30: { percent_off: 30, duration: 'repeating', duration_in_months: 3 },
    BETA100: { percent_off: 100, duration: 'once' }
  }
}

// Plan details for display
export const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 99,
    priceId: STRIPE_CONFIG.PRICES.STARTER,
    features: [
      '10 scans per day',
      'Top 500 stocks coverage',
      'Email alerts only',
      'Basic filters',
      'Standard support'
    ],
    limits: {
      scansPerDay: 10,
      stocksCoverage: 500,
      backtestsPerMonth: 0,
      notifications: ['email']
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 199,
    priceId: STRIPE_CONFIG.PRICES.PROFESSIONAL,
    popular: true,
    features: [
      'Unlimited scans',
      'Full market (1000+ stocks)',
      'Push + email notifications',
      'AI insights & anomaly detection',
      'Historical charts',
      '5 backtests per month',
      'Priority support'
    ],
    limits: {
      scansPerDay: -1, // unlimited
      stocksCoverage: 1000,
      backtestsPerMonth: 5,
      notifications: ['email', 'push', 'in-app']
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 499,
    priceId: STRIPE_CONFIG.PRICES.ENTERPRISE,
    features: [
      'Everything in Professional',
      'Unlimited backtesting',
      'API access',
      'Dedicated support',
      'Custom alert rules',
      'Data export',
      'White-label options'
    ],
    limits: {
      scansPerDay: -1,
      stocksCoverage: -1, // all
      backtestsPerMonth: -1,
      notifications: ['email', 'push', 'in-app', 'webhook']
    }
  }
]