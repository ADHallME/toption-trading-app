// Application Configuration
// Central place for all app settings

export const APP_CONFIG = {
  // Trial Configuration
  TRIAL_DAYS: 14, // Changed from 7 to 14 based on conversion analysis
  TRIAL_FEATURES: {
    maxScansPerDay: -1, // Unlimited during trial
    maxWatchlistItems: 50,
    maxBacktests: 5,
    realTimeData: true,
    aiInsights: true,
    historicalCharts: true,
    notifications: true
  },
  
  // Subscription Tiers (Monthly Pricing)
  PRICING: {
    BASIC: {
      price: 99,
      name: 'Basic',
      features: {
        maxScansPerDay: 5,
        maxWatchlistItems: 10,
        maxBacktests: 0,
        realTimeData: false,
        aiInsights: false,
        historicalCharts: false,
        notifications: 'email'
      }
    },
    PROFESSIONAL: {
      price: 249,
      name: 'Professional',
      features: {
        maxScansPerDay: -1, // Unlimited
        maxWatchlistItems: 50,
        maxBacktests: 5,
        realTimeData: true,
        aiInsights: true,
        historicalCharts: true,
        notifications: 'push'
      }
    },
    PREMIUM: {
      price: 499,
      name: 'Premium',
      features: {
        maxScansPerDay: -1, // Unlimited
        maxWatchlistItems: -1, // Unlimited
        maxBacktests: -1, // Unlimited
        realTimeData: true,
        aiInsights: true,
        historicalCharts: true,
        notifications: 'all',
        marketScanning: true,
        anomalyDetection: true,
        apiAccess: true,
        prioritySupport: true
      }
    }
  },
  
  // Backtest Credits Pricing
  CREDIT_PRICING: {
    PACK_10: { credits: 10, price: 9.99 },
    PACK_25: { credits: 25, price: 19.99 }, // 20% discount
    PACK_100: { credits: 100, price: 49.99 } // 50% discount
  },
  
  // Notification Settings
  NOTIFICATIONS: {
    WEBHOOK_URL: process.env.NOTIFICATION_WEBHOOK_URL,
    PUSH_VAPID_KEY: process.env.NEXT_PUBLIC_VAPID_KEY,
    EMAIL_FROM: 'alerts@toptiontrade.com',
    SMS_ENABLED: false // Future feature
  },
  
  // API Limits
  API_LIMITS: {
    POLYGON_RATE_LIMIT: 100, // requests per minute
    CACHE_TTL: 60 * 1000, // 1 minute
    MAX_BATCH_SIZE: 10
  },
  
  // Feature Flags
  FEATURES: {
    BACKTESTING: true,
    PAPER_TRADING: false, // Coming soon
    BROKER_INTEGRATION: false, // Not implementing
    SOCIAL_FEATURES: false, // Future
    EDUCATION_TAB: true,
    HISTORICAL_CHARTS: true
  },
  
  // Marketing
  MARKETING: {
    LAUNCH_DISCOUNT: 0.5, // 50% off first 3 months
    REFERRAL_BONUS: 30, // days free
    EARLY_BIRD_COUPON: 'LAUNCH50'
  }
}

export default APP_CONFIG
