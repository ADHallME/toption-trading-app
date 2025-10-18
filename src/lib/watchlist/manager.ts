// Watchlist Manager
import { WatchlistItem, Alert, AlertThresholds, DEFAULT_ALERT_THRESHOLDS } from './types'

const WATCHLIST_KEY = 'toption_watchlist'
const ALERTS_KEY = 'toption_alerts'

export class WatchlistManager {
  static getAll(): WatchlistItem[] {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(WATCHLIST_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  static add(item: Omit<WatchlistItem, 'id' | 'addedAt'>): WatchlistItem {
    const newItem: WatchlistItem = {
      ...item,
      id: `${Date.now()}-${Math.random()}`,
      addedAt: new Date().toISOString(),
      alertThresholds: { ...DEFAULT_ALERT_THRESHOLDS, ...item.alertThresholds }
    }
    
    const items = this.getAll()
    items.push(newItem)
    this.save(items)
    return newItem
  }

  static remove(id: string): void {
    const items = this.getAll().filter(i => i.id !== id)
    this.save(items)
  }

  static update(id: string, updates: Partial<WatchlistItem>): void {
    const items = this.getAll().map(i => 
      i.id === id ? { ...i, ...updates } : i
    )
    this.save(items)
  }

  private static save(items: WatchlistItem[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items))
  }

  static checkAlerts(items: WatchlistItem[], currentData: any[]): Alert[] {
    const alerts: Alert[] = []
    
    items.forEach(item => {
      const current = currentData.find(d => 
        d.underlying === item.underlying && 
        d.strike === item.strike &&
        d.expiration === item.expiration
      )
      
      if (!current) return
      
      const thresholds = item.alertThresholds
      
      // Premium drop alert
      if (thresholds.premiumDropPercent) {
        const dropPercent = ((item.initialPremium - current.premium) / item.initialPremium) * 100
        if (dropPercent >= thresholds.premiumDropPercent) {
          alerts.push({
            id: `${Date.now()}-drop`,
            watchlistItemId: item.id,
            type: 'premium_drop',
            message: `${item.underlying} premium dropped ${dropPercent.toFixed(1)}% (entry opportunity!)`,
            triggeredAt: new Date().toISOString(),
            read: false,
            data: { dropPercent, oldPremium: item.initialPremium, newPremium: current.premium }
          })
        }
      }
      
      // Volume spike alert
      if (thresholds.volumeSpikeMultiplier && current.avgVolume) {
        if (current.volume >= current.avgVolume * thresholds.volumeSpikeMultiplier) {
          alerts.push({
            id: `${Date.now()}-volume`,
            watchlistItemId: item.id,
            type: 'volume_spike',
            message: `${item.underlying} volume spike: ${(current.volume / current.avgVolume).toFixed(1)}x normal`,
            triggeredAt: new Date().toISOString(),
            read: false,
            data: { volume: current.volume, avgVolume: current.avgVolume }
          })
        }
      }
    })
    
    return alerts
  }

  static getAlerts(): Alert[] {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(ALERTS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  static addAlert(alert: Alert): void {
    const alerts = this.getAlerts()
    alerts.unshift(alert)
    if (typeof window !== 'undefined') {
      localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts.slice(0, 100))) // Keep last 100
    }
  }

  static markAlertRead(id: string): void {
    const alerts = this.getAlerts().map(a => 
      a.id === id ? { ...a, read: true } : a
    )
    if (typeof window !== 'undefined') {
      localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts))
    }
  }
}
