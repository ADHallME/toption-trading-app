// Watchlist Types
export interface WatchlistItem {
  id: string
  userId: string
  underlying: string
  strategy: string
  strike: number
  expiration: string
  type: 'put' | 'call'
  addedAt: string
  initialPremium: number
  currentPremium: number
  alertThresholds: AlertThresholds
  notes: string
  tags: string[]
}

export interface AlertThresholds {
  premiumDropPercent?: number // Alert if premium drops by X%
  premiumRisePercent?: number // Alert if premium rises by X%
  volumeSpikeMultiplier?: number // Alert if volume is X times average
  ivChangePercent?: number // Alert if IV changes by X%
  priceToStrike?: boolean // Alert when price approaches strike
}

export interface Alert {
  id: string
  watchlistItemId: string
  type: 'premium_drop' | 'premium_rise' | 'volume_spike' | 'iv_change' | 'price_alert'
  message: string
  triggeredAt: string
  read: boolean
  data: any
}

export const DEFAULT_ALERT_THRESHOLDS: AlertThresholds = {
  premiumDropPercent: 10,
  premiumRisePercent: 15,
  volumeSpikeMultiplier: 2,
  ivChangePercent: 20,
  priceToStrike: true
}
