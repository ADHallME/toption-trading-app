// AI Recommendation Engine for Options Trading
// Learns from user preferences and behavior to provide personalized recommendations

// Helper functions (previously imported from sample-data)
const getDTE = (expiration: string): number => {
  const exp = new Date(expiration)
  const today = new Date()
  const diff = exp.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const calculateMonthlyReturn = (roi: number, dte: number): number => {
  if (dte <= 0) return 0
  return (roi / dte) * 30
}

const calculateAnnualizedReturn = (roi: number, dte: number): number => {
  if (dte <= 0) return 0
  return (roi / dte) * 365
}

export interface UserProfile {
  // From onboarding
  preferredStrategies: string[];
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  targetMonthlyReturn: number;
  preferredDTE: [number, number]; // [min, max]
  maxPositionSize: number;
  
  // Learned preferences (stored in Supabase)
  favoriteStocks?: string[];
  dismissedStocks?: string[];
  averageDelta?: number;
  successfulTrades?: any[];
}

export interface OptionOpportunity {
  ticker: string;
  strategy: 'wheel' | 'strangle' | 'iron_condor' | 'covered_call';
  strike: number;
  expiration: string;
  dte: number;
  premium: number;
  delta: number;
  theta?: number; // Optional theta value
  iv: number;
  volume: number;
  openInterest: number;
  
  // Calculated metrics
  monthlyReturn: number;
  annualizedReturn: number;
  capitalRequired: number;
  maxLoss: number;
  breakeven: number;
  probabilityOfProfit: number;
}

export interface AIRecommendation {
  opportunity: OptionOpportunity;
  aiScore: number;
  reasons: string[];
  warnings: string[];
  matchedPreferences: string[];
}

class AIRecommendationEngine {
  // Add the missing generateRecommendations method
  async generateRecommendations(userProfile: any, strategyFilter: string = 'all'): Promise<AIRecommendation[]> {
    // Mock data for now - will be replaced with Polygon
    const mockOpportunities: OptionOpportunity[] = [
      {
        ticker: 'SPY',
        strategy: 'wheel',
        strike: 480,
        expiration: '2024-01-19',
        dte: 21,
        premium: 2.85,
        delta: -0.30,
        theta: -0.08,
        iv: 0.18,
        volume: 25000,
        openInterest: 50000,
        monthlyReturn: 2.8,
        annualizedReturn: 33.6,
        capitalRequired: 48000,
        maxLoss: 47715,
        breakeven: 477.15,
        probabilityOfProfit: 70
      },
      {
        ticker: 'QQQ',
        strategy: 'covered_call',
        strike: 405,
        expiration: '2024-01-26',
        dte: 28,
        premium: 3.20,
        delta: 0.35,
        theta: -0.12,
        iv: 0.22,
        volume: 18000,
        openInterest: 35000,
        monthlyReturn: 2.4,
        annualizedReturn: 28.8,
        capitalRequired: 40500,
        maxLoss: 0,
        breakeven: 408.20,
        probabilityOfProfit: 65
      },
      {
        ticker: 'TSLA',
        strategy: 'strangle',
        strike: 250,
        expiration: '2024-02-16',
        dte: 45,
        premium: 8.50,
        delta: -0.25,
        theta: -0.15,
        iv: 0.45,
        volume: 30000,
        openInterest: 60000,
        monthlyReturn: 4.2,
        annualizedReturn: 50.4,
        capitalRequired: 5000,
        maxLoss: 24150,
        breakeven: 241.50,
        probabilityOfProfit: 75
      }
    ];
    
    // Filter by strategy if specified
    let filtered = mockOpportunities;
    if (strategyFilter !== 'all') {
      filtered = mockOpportunities.filter(opp => opp.strategy === strategyFilter);
    }
    
    // Convert to recommendations
    return this.recommend(filtered, userProfile || {}, 6);
  }

  
  // Score an opportunity based on user profile
  scoreOpportunity(opp: OptionOpportunity, profile: UserProfile): number {
    let score = 50; // Base score
    
    // Strategy match (20 points)
    if (profile.preferredStrategies.includes(opp.strategy)) {
      score += 20;
    }
    
    // Risk tolerance match (15 points)
    const deltaMatch = this.matchesRiskTolerance(opp.delta, profile.riskTolerance);
    if (deltaMatch) {
      score += 15;
    }
    
    // Return target match (15 points)
    if (opp.monthlyReturn >= profile.targetMonthlyReturn) {
      score += 15;
    }
    
    // DTE preference match (10 points)
    if (opp.dte >= profile.preferredDTE[0] && opp.dte <= profile.preferredDTE[1]) {
      score += 10;
    }
    
    // Favorite stocks bonus (10 points)
    if (profile.favoriteStocks?.includes(opp.ticker)) {
      score += 10;
    }
    
    // High IV bonus (10 points)
    if (opp.iv > 0.30) {
      score += 10;
    }
    
    // Liquidity bonus (5 points)
    if (opp.volume > 1000 && opp.openInterest > 5000) {
      score += 5;
    }
    
    // Probability of profit bonus (5 points)
    if (opp.probabilityOfProfit > 70) {
      score += 5;
    }
    
    // Penalties
    if (profile.dismissedStocks?.includes(opp.ticker)) {
      score -= 20;
    }
    
    if (opp.capitalRequired > profile.maxPositionSize) {
      score -= 15;
    }
    
    return Math.max(0, Math.min(100, score));
  }
  
  // Generate human-readable reasons
  generateReasons(opp: OptionOpportunity, score: number, profile: UserProfile): string[] {
    const reasons = [];
    
    if (score >= 85) {
      reasons.push('🎯 Near-perfect match for your trading style');
    }
    
    if (opp.monthlyReturn >= profile.targetMonthlyReturn * 1.5) {
      reasons.push(`💰 ${opp.monthlyReturn.toFixed(1)}% monthly exceeds your ${profile.targetMonthlyReturn}% target`);
    }
    
    if (opp.iv > 0.35) {
      reasons.push(`🔥 High IV at ${(opp.iv * 100).toFixed(0)}% - premium seller's market`);
    }
    
    if (opp.probabilityOfProfit > 75) {
      reasons.push(`✅ ${opp.probabilityOfProfit.toFixed(0)}% probability of profit`);
    }
    
    if (profile.favoriteStocks?.includes(opp.ticker)) {
      reasons.push(`⭐ ${opp.ticker} is one of your favorites`);
    }
    
    if (opp.volume > 5000) {
      reasons.push('💧 Excellent liquidity for easy fills');
    }
    
    return reasons;
  }
  
  // Generate warnings if any
  generateWarnings(opp: OptionOpportunity, profile: UserProfile): string[] {
    const warnings = [];
    
    if (opp.capitalRequired > profile.maxPositionSize * 0.8) {
      warnings.push(`⚠️ Requires ${(opp.capitalRequired / 1000).toFixed(1)}k capital (near your limit)`);
    }
    
    if (opp.volume < 100) {
      warnings.push('⚠️ Low volume - may have wide spreads');
    }
    
    if (opp.dte < 21) {
      warnings.push(`⚠️ Only ${opp.dte} days to expiration`);
    }
    
    if (opp.delta < -0.45) {
      warnings.push('⚠️ High delta - increased assignment risk');
    }
    
    return warnings;
  }
  
  // Match risk tolerance to delta
  private matchesRiskTolerance(delta: number, riskTolerance: string): boolean {
    const absDelta = Math.abs(delta);
    
    switch (riskTolerance) {
      case 'conservative':
        return absDelta >= 0.15 && absDelta <= 0.25;
      case 'moderate':
        return absDelta >= 0.25 && absDelta <= 0.35;
      case 'aggressive':
        return absDelta >= 0.35 && absDelta <= 0.50;
      default:
        return true;
    }
  }
  
  // Get matched preferences for display
  getMatchedPreferences(opp: OptionOpportunity, profile: UserProfile): string[] {
    const matched = [];
    
    if (profile.preferredStrategies.includes(opp.strategy)) {
      matched.push(`${opp.strategy} strategy`);
    }
    
    if (opp.dte >= profile.preferredDTE[0] && opp.dte <= profile.preferredDTE[1]) {
      matched.push(`${opp.dte} DTE in your range`);
    }
    
    if (this.matchesRiskTolerance(opp.delta, profile.riskTolerance)) {
      matched.push(`Delta matches ${profile.riskTolerance} risk`);
    }
    
    if (opp.monthlyReturn >= profile.targetMonthlyReturn) {
      matched.push(`Meets return target`);
    }
    
    return matched;
  }
  
  // Main recommendation method
  recommend(
    opportunities: OptionOpportunity[], 
    profile: UserProfile, 
    limit: number = 5
  ): AIRecommendation[] {
    const recommendations = opportunities.map(opp => {
      const aiScore = this.scoreOpportunity(opp, profile);
      
      return {
        opportunity: opp,
        aiScore,
        reasons: this.generateReasons(opp, aiScore, profile),
        warnings: this.generateWarnings(opp, profile),
        matchedPreferences: this.getMatchedPreferences(opp, profile)
      };
    });
    
    // Sort by AI score and return top recommendations
    return recommendations
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, limit);
  }
}

// Convert Polygon option data to our opportunity format
export function polygonToOpportunity(
  optionData: any,
  underlyingPrice: number,
  strategy: string = 'wheel'
): OptionOpportunity {
  const dte = getDTE(optionData.expiration_date);
  const premium = optionData.bid || optionData.last || 2.50;
  const strike = optionData.strike_price;
  
  return {
    ticker: optionData.underlying_ticker,
    strategy: strategy as any,
    strike,
    expiration: optionData.expiration_date,
    dte,
    premium,
    delta: optionData.delta || -0.30,
    theta: optionData.theta || -0.05, // Add theta here
    iv: optionData.implied_volatility || 0.25,
    volume: optionData.volume || 1000,
    openInterest: optionData.open_interest || 5000,
    
    // Calculate metrics
    monthlyReturn: calculateMonthlyReturn((premium / strike) * 100, dte),
    annualizedReturn: calculateAnnualizedReturn((premium / strike) * 100, dte),
    capitalRequired: strike * 100, // For cash-secured put
    maxLoss: strike * 100 - premium * 100,
    breakeven: strike - premium,
    probabilityOfProfit: calculateProbabilityOfProfit(optionData.delta)
  };
}

// Simple probability of profit calculation
function calculateProbabilityOfProfit(delta: number): number {
  // For puts, POP ≈ 1 + delta (simplified)
  return Math.round((1 + delta) * 100);
}

// Export singleton instance
export const aiEngine = new AIRecommendationEngine();
export default AIRecommendationEngine;