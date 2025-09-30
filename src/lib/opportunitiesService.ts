export interface Opportunity {
  id: string;
  symbol: string;
  strategy: string;
  strike: number;
  expiry: string;
  dte: number;
  premium: number;
  capitalRequired: number;
  roi: number;
  roiPerDay: number;
  pop: number;
  risk: 'low' | 'medium' | 'high';
  ivRank: number;
  aiScore: number;
  category: 'market-movers' | 'high-iv' | 'conservative' | 'earnings';
  volume: number;
  openInterest: number;
}

export class OpportunitiesService {
  private static instance: OpportunitiesService;
  
  static getInstance(): OpportunitiesService {
    if (!OpportunitiesService.instance) {
      OpportunitiesService.instance = new OpportunitiesService();
    }
    return OpportunitiesService.instance;
  }

  async getOpportunities(category?: string, limit: number = 50): Promise<Opportunity[]> {
    const opportunities = await this.generateOpportunities();
    
    // CRITICAL: Sort by ROI per day (HIGHEST FIRST)
    opportunities.sort((a, b) => b.roiPerDay - a.roiPerDay);
    
    if (category) {
      const filtered = opportunities.filter(opp => opp.category === category);
      return filtered.slice(0, limit);
    }
    
    return opportunities.slice(0, limit);
  }

  private async generateOpportunities(): Promise<Opportunity[]> {
    const symbols = [
      'AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMD', 'META', 'GOOGL', 'AMZN', 
      'NFLX', 'SPY', 'QQQ', 'IWM', 'COIN', 'PLTR', 'SQ', 'PYPL',
      'BA', 'DIS', 'V', 'MA', 'JPM', 'GS', 'WMT', 'TGT'
    ];
    
    const opportunities: Opportunity[] = [];
    
    for (const symbol of symbols) {
      // Generate 2-4 opportunities per symbol with varying quality
      const numOpps = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < numOpps; i++) {
        const strike = 50 + Math.random() * 200;
        const dte = Math.floor(Math.random() * 45) + 1;
        
        // Create varying premium levels for realistic ROI distribution
        const premiumBase = Math.random() * 15 + 2;
        const premiumMultiplier = 1 + (Math.random() - 0.5) * 0.5;
        const premium = premiumBase * premiumMultiplier;
        
        const capitalRequired = strike * 100;
        const roi = (premium * 100) / capitalRequired;
        const roiPerDay = roi / dte;
        
        // Categorize based on characteristics
        let category: Opportunity['category'] = 'conservative';
        if (roiPerDay > 1) category = 'market-movers';
        else if (roiPerDay > 0.5 && Math.random() > 0.5) category = 'high-iv';
        else if (Math.random() > 0.8) category = 'earnings';
        
        opportunities.push({
          id: `${symbol}_${i}_${Date.now()}`,
          symbol,
          strategy: this.getStrategy(dte, roiPerDay),
          strike: Math.round(strike),
          expiry: new Date(Date.now() + dte * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
            month: 'numeric', 
            day: 'numeric' 
          }),
          dte,
          premium: parseFloat(premium.toFixed(2)),
          capitalRequired,
          roi: parseFloat((roi / 100).toFixed(4)),
          roiPerDay: parseFloat(roiPerDay.toFixed(4)),
          pop: 60 + Math.random() * 30,
          risk: roiPerDay > 1 ? 'high' : roiPerDay > 0.5 ? 'medium' : 'low',
          ivRank: 20 + Math.random() * 70,
          aiScore: 50 + Math.random() * 45,
          category,
          volume: Math.floor(Math.random() * 50000) + 1000,
          openInterest: Math.floor(Math.random() * 100000) + 5000
        });
      }
    }
    
    return opportunities;
  }

  private getStrategy(dte: number, roiPerDay: number): string {
    if (dte <= 7) return 'Weekly Put';
    if (dte <= 14 && roiPerDay > 0.8) return 'Short Iron Condor';
    if (roiPerDay > 1) return 'High Premium Put';
    if (roiPerDay > 0.5) return 'Put Credit Spread';
    if (roiPerDay > 0.3) return 'Iron Condor';
    return 'Cash Secured Put';
  }
}
