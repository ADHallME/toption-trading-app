/**
 * ALERT SERVICE - Email & In-App Notifications
 * Sends alerts when opportunities match user criteria
 */

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface AlertCriteria {
  id: string
  userId: string
  name: string
  enabled: boolean
  
  // Criteria
  strategies?: string[]
  minROI?: number
  maxROI?: number
  minPOP?: number
  tickers?: string[]
  excludeTickers?: string[]
  minVolume?: number
  minOpenInterest?: number
  
  // IV criteria
  minIV?: number
  maxIV?: number
  ivRankMin?: number
  ivRankMax?: number
  
  // Delivery preferences
  emailEnabled: boolean
  inAppEnabled: boolean
  frequency: 'immediate' | 'hourly' | 'daily'
  
  createdAt: string
  lastTriggered?: string
}

export interface Alert {
  id: string
  userId: string
  criteriaId: string
  criteriaName: string
  
  opportunity: {
    ticker: string
    strategy: string
    strike: number
    expiration: string
    premium: number
    roi: number
    pop: number
    iv: number
    volume: number
    openInterest: number
  }
  
  triggeredAt: string
  read: boolean
  emailSent: boolean
}

export class AlertService {
  
  /**
   * Check if opportunity matches alert criteria
   */
  static matchesCriteria(opportunity: any, criteria: AlertCriteria): boolean {
    if (!criteria.enabled) return false
    
    // Strategy filter
    if (criteria.strategies && criteria.strategies.length > 0) {
      if (!criteria.strategies.includes(opportunity.strategy)) return false
    }
    
    // ROI filter
    if (criteria.minROI !== undefined && opportunity.roi < criteria.minROI) return false
    if (criteria.maxROI !== undefined && opportunity.roi > criteria.maxROI) return false
    
    // POP filter
    if (criteria.minPOP !== undefined && opportunity.pop < criteria.minPOP) return false
    
    // Ticker filter
    if (criteria.tickers && criteria.tickers.length > 0) {
      if (!criteria.tickers.includes(opportunity.ticker)) return false
    }
    
    // Exclude tickers
    if (criteria.excludeTickers && criteria.excludeTickers.includes(opportunity.ticker)) {
      return false
    }
    
    // Volume filter
    if (criteria.minVolume !== undefined && opportunity.volume < criteria.minVolume) {
      return false
    }
    
    // Open Interest filter
    if (criteria.minOpenInterest !== undefined && opportunity.openInterest < criteria.minOpenInterest) {
      return false
    }
    
    // IV filters
    if (criteria.minIV !== undefined && opportunity.iv < criteria.minIV) return false
    if (criteria.maxIV !== undefined && opportunity.iv > criteria.maxIV) return false
    
    // IV Rank filters (if available)
    if (opportunity.ivRank !== undefined) {
      if (criteria.ivRankMin !== undefined && opportunity.ivRank < criteria.ivRankMin) return false
      if (criteria.ivRankMax !== undefined && opportunity.ivRank > criteria.ivRankMax) return false
    }
    
    return true
  }
  
  /**
   * Send email alert via Resend
   */
  static async sendEmailAlert(
    userEmail: string, 
    alert: Alert,
    unsubscribeUrl: string
  ): Promise<boolean> {
    try {
      const opp = alert.opportunity
      
      const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
    .opportunity { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .metric { display: inline-block; margin: 10px 20px 10px 0; }
    .metric-label { font-size: 12px; color: #666; text-transform: uppercase; }
    .metric-value { font-size: 24px; font-weight: bold; color: #667eea; }
    .cta { background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 New Options Opportunity Alert</h1>
      <p>Your alert "${alert.criteriaName}" has been triggered!</p>
    </div>
    
    <div class="content">
      <div class="opportunity">
        <h2>${opp.ticker} - ${opp.strategy}</h2>
        
        <div class="metric">
          <div class="metric-label">ROI</div>
          <div class="metric-value">${opp.roi.toFixed(1)}%</div>
        </div>
        
        <div class="metric">
          <div class="metric-label">PoP</div>
          <div class="metric-value">${opp.pop.toFixed(0)}%</div>
        </div>
        
        <div class="metric">
          <div class="metric-label">Premium</div>
          <div class="metric-value">$${opp.premium.toFixed(2)}</div>
        </div>
        
        <div class="metric">
          <div class="metric-label">IV</div>
          <div class="metric-value">${opp.iv.toFixed(0)}%</div>
        </div>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        
        <p><strong>Strike:</strong> $${opp.strike}</p>
        <p><strong>Expiration:</strong> ${new Date(opp.expiration).toLocaleDateString()}</p>
        <p><strong>Volume:</strong> ${opp.volume.toLocaleString()}</p>
        <p><strong>Open Interest:</strong> ${opp.openInterest.toLocaleString()}</p>
      </div>
      
      <a href="https://toptiontrade.com/dashboard?ticker=${opp.ticker}" class="cta">
        View Full Analysis →
      </a>
      
      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        This alert was triggered because it matches your criteria for ${alert.criteriaName}.
        You can manage your alerts in your dashboard settings.
      </p>
    </div>
    
    <div class="footer">
      <p>Toption - Options Trading Intelligence</p>
      <p><a href="${unsubscribeUrl}" style="color: #666;">Unsubscribe from this alert</a></p>
    </div>
  </div>
</body>
</html>
      `
      
      await resend.emails.send({
        from: 'Toption Alerts <alerts@toptiontrade.com>',
        to: userEmail,
        subject: `🎯 ${opp.ticker} ${opp.strategy} - ${opp.roi.toFixed(1)}% ROI`,
        html
      })
      
      return true
      
    } catch (error) {
      console.error('[ALERT] Failed to send email:', error)
      return false
    }
  }
  
  /**
   * Process opportunities and trigger matching alerts
   */
  static async processOpportunities(
    opportunities: any[],
    userCriteria: AlertCriteria[],
    userEmail: string
  ): Promise<Alert[]> {
    const triggeredAlerts: Alert[] = []
    
    for (const criteria of userCriteria) {
      // Check frequency throttling
      if (criteria.lastTriggered) {
        const lastTrigger = new Date(criteria.lastTriggered)
        const now = new Date()
        const hoursSinceLastTrigger = (now.getTime() - lastTrigger.getTime()) / (1000 * 60 * 60)
        
        if (criteria.frequency === 'hourly' && hoursSinceLastTrigger < 1) continue
        if (criteria.frequency === 'daily' && hoursSinceLastTrigger < 24) continue
      }
      
      // Find matching opportunities
      const matches = opportunities.filter(opp => 
        this.matchesCriteria(opp, criteria)
      )
      
      // Create alerts for matches
      for (const opportunity of matches) {
        const alert: Alert = {
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: criteria.userId,
          criteriaId: criteria.id,
          criteriaName: criteria.name,
          opportunity: {
            ticker: opportunity.ticker,
            strategy: opportunity.strategy,
            strike: opportunity.strike,
            expiration: opportunity.expiration,
            premium: opportunity.premium,
            roi: opportunity.roi,
            pop: opportunity.pop,
            iv: opportunity.iv,
            volume: opportunity.volume,
            openInterest: opportunity.openInterest
          },
          triggeredAt: new Date().toISOString(),
          read: false,
          emailSent: false
        }
        
        triggeredAlerts.push(alert)
        
        // Send email if enabled
        if (criteria.emailEnabled) {
          const unsubscribeUrl = `https://toptiontrade.com/settings/alerts?unsubscribe=${criteria.id}`
          const sent = await this.sendEmailAlert(userEmail, alert, unsubscribeUrl)
          alert.emailSent = sent
        }
      }
    }
    
    return triggeredAlerts
  }
}

// Export singleton instance
export const alertService = new AlertService()
