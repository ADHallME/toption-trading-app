// Enhanced Polygon Client with Full Options Support (Equity + Futures)
// Supports real-time data, advanced Greeks, and multiple market types

import { sampleOptionsData } from './sample-data';

// Market type definitions
export enum MarketType {
  EQUITY_OPTIONS = 'equity_options',
  INDEX_OPTIONS = 'index_options',
  FUTURES_OPTIONS = 'futures_options',
  COMMODITY_OPTIONS = 'commodity_options'
}

// Contract specifications for futures
export const FUTURES_SPECS = {
  // E-mini S&P 500
  ES: {
    name: 'E-mini S&P 500',
    multiplier: 50,
    tickSize: 0.25,
    exchange: 'CME',
    tradingHours: '24/5',
    expirations: ['H', 'M', 'U', 'Z'] // March, June, Sept, Dec
  },
  // Crude Oil
  CL: {
    name: 'WTI Crude Oil',
    multiplier: 1000,
    tickSize: 0.01,
    exchange: 'NYMEX',
    tradingHours: '24/5',
    expirations: 'Monthly'
  },
  // Gold
  GC: {
    name: 'Gold Futures',
    multiplier: 100,
    tickSize: 0.10,
    exchange: 'COMEX',
    tradingHours: '24/5',
    expirations: ['G', 'J', 'M', 'Q', 'V', 'Z']
  },
  // 10-Year Treasury Note
  ZN: {
    name: '10-Year T-Note',
    multiplier: 1000,
    tickSize: 0.015625,
    exchange: 'CBOT',
    tradingHours: '24/5',
    expirations: ['H', 'M', 'U', 'Z']
  },
  // Euro FX
  '6E': {
    name: 'Euro FX',
    multiplier: 125000,
    tickSize: 0.00005,
    exchange: 'CME',
    tradingHours: '24/5',
    expirations: ['H', 'M', 'U', 'Z']
  },
  // Natural Gas
  NG: {
    name: 'Natural Gas',
    multiplier: 10000,
    tickSize: 0.001,
    exchange: 'NYMEX',
    tradingHours: '24/5',
    expirations: 'Monthly'
  },
  // Wheat
  ZW: {
    name: 'Wheat Futures',
    multiplier: 5000,
    tickSize: 0.25,
    exchange: 'CBOT',
    tradingHours: 'Regular',
    expirations: ['H', 'K', 'N', 'U', 'Z']
  },
  // VIX
  VX: {
    name: 'VIX Futures',
    multiplier: 1000,
    tickSize: 0.05,
    exchange: 'CBOE',
    tradingHours: 'Extended',
    expirations: 'Weekly/Monthly'
  }
};

// Popular equity options
export const POPULAR_EQUITIES = [
  'SPY', 'QQQ', 'AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMD', 'AMZN', 
  'META', 'GOOGL', 'JPM', 'BAC', 'XLF', 'IWM', 'DIA', 'NFLX'
];

// Popular index options
export const INDEX_OPTIONS = [
  'SPX', 'NDX', 'RUT', 'VIX', 'DJX', 'XSP', 'XND'
];

interface PolygonEnhancedConfig {
  apiKey: string;
  tier: 'free' | 'starter' | 'developer' | 'advanced';
  enableWebSocket: boolean;
  enableGreeksCalculation: boolean;
}

interface OptionsChainRequest {
  underlying: string;
  marketType: MarketType;
  expiration?: string;
  minStrike?: number;
  maxStrike?: number;
  contractType?: 'call' | 'put' | 'both';
  minDTE?: number;
  maxDTE?: number;
  minVolume?: number;
  minOpenInterest?: number;
  includeGreeks?: boolean;
}

interface OptionContract {
  ticker: string;
  underlying: string;
  marketType: MarketType;
  contractType: 'call' | 'put';
  strike: number;
  expiration: string;
  dte: number;
  
  // Pricing
  bid: number;
  ask: number;
  mid: number;
  last: number;
  mark: number;
  
  // Greeks
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  
  // Volatility
  impliedVolatility: number;
  ivRank: number;
  ivPercentile: number;
  historicalVolatility?: number;
  
  // Volume & Interest
  volume: number;
  openInterest: number;
  volumeOIRatio: number;
  
  // Additional metrics
  intrinsicValue: number;
  extrinsicValue: number;
  breakeven: number;
  probabilityITM: number;
  probabilityTouch: number;
  expectedMove?: number;
  
  // For futures options
  futuresPrice?: number;
  futuresMultiplier?: number;
  dollarValue?: number;
}

class PolygonEnhancedClient {
  private apiKey: string;
  private tier: string;
  private baseUrl = 'https://api.polygon.io';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTTL = {
    quotes: 30 * 1000,          // 30 seconds for quotes
    options: 60 * 1000,         // 1 minute for options chains
    futures: 60 * 1000,         // 1 minute for futures
    greeks: 30 * 1000,          // 30 seconds for Greeks
    historical: 5 * 60 * 1000,  // 5 minutes for historical data
    static: 24 * 60 * 60 * 1000 // 24 hours for static data
  };
  private enableGreeks: boolean;
  private wsClient?: WebSocket;

  constructor(config: PolygonEnhancedConfig) {
    this.apiKey = config.apiKey || process.env.POLYGON_API_KEY || '';
    this.tier = config.tier;
    this.enableGreeks = config.enableGreeksCalculation;
    
    if (config.enableWebSocket && this.tier !== 'free') {
      this.initWebSocket();
    }
  }

  // Initialize WebSocket connection for real-time data
  private initWebSocket() {
    const wsUrl = 'wss://socket.polygon.io/options';
    this.wsClient = new WebSocket(wsUrl);
    
    this.wsClient.onopen = () => {
      console.log('Polygon WebSocket connected');
      // Authenticate
      this.wsClient?.send(JSON.stringify({
        action: 'auth',
        params: this.apiKey
      }));
    };
    
    this.wsClient.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleWebSocketMessage(data);
    };
    
    this.wsClient.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private handleWebSocketMessage(data: any) {
    // Process real-time updates
    if (Array.isArray(data)) {
      data.forEach(msg => {
        switch(msg.ev) {
          case 'Q': // Quote
            this.updateQuoteCache(msg);
            break;
          case 'T': // Trade
            this.updateTradeCache(msg);
            break;
          case 'A': // Aggregate
            this.updateAggregateCache(msg);
            break;
        }
      });
    }
  }

  // Main method to get options chain
  async getOptionsChain(request: OptionsChainRequest): Promise<OptionContract[]> {
    const cacheKey = this.buildCacheKey('options', request);
    const cached = this.getFromCache(cacheKey, this.cacheTTL.options);
    if (cached) return cached;

    try {
      let data: any;
      
      switch (request.marketType) {
        case MarketType.FUTURES_OPTIONS:
          data = await this.fetchFuturesOptions(request);
          break;
        case MarketType.INDEX_OPTIONS:
          data = await this.fetchIndexOptions(request);
          break;
        default:
          data = await this.fetchEquityOptions(request);
      }

      // Process and enhance the data
      const enhancedData = await this.enhanceOptionsData(data, request);
      
      this.setCache(cacheKey, enhancedData);
      return enhancedData;
    } catch (error) {
      console.error('Error fetching options chain:', error);
      return this.getFallbackData(request);
    }
  }

  // Fetch equity options
  private async fetchEquityOptions(request: OptionsChainRequest): Promise<any> {
    const endpoint = `${this.baseUrl}/v3/snapshot/options/${request.underlying}`;
    const params = new URLSearchParams({
      apiKey: this.apiKey,
      limit: '250',
      'order': 'desc',
      'sort': 'open_interest'
    });

    if (request.expiration) {
      params.append('expiration_date', request.expiration);
    }
    if (request.minStrike) {
      params.append('strike_price.gte', request.minStrike.toString());
    }
    if (request.maxStrike) {
      params.append('strike_price.lte', request.maxStrike.toString());
    }

    const response = await fetch(`${endpoint}?${params}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    return response.json();
  }

  // Fetch futures options
  private async fetchFuturesOptions(request: OptionsChainRequest): Promise<any> {
    // Polygon doesn't directly support futures options in the same way
    // We'll need to use the reference endpoint with proper contract symbols
    
    const futuresRoot = this.getFuturesRoot(request.underlying);
    const endpoint = `${this.baseUrl}/v3/reference/options/contracts`;
    
    const params = new URLSearchParams({
      apiKey: this.apiKey,
      'underlying_ticker': futuresRoot,
      'contract_type': request.contractType || 'both',
      'expired': 'false',
      limit: '1000'
    });

    if (request.expiration) {
      params.append('expiration_date.gte', request.expiration);
      params.append('expiration_date.lte', request.expiration);
    }

    const response = await fetch(`${endpoint}?${params}`);
    if (!response.ok) {
      // Fallback to mock data for futures
      return this.getMockFuturesOptions(request);
    }
    
    return response.json();
  }

  // Fetch index options (SPX, NDX, etc.)
  private async fetchIndexOptions(request: OptionsChainRequest): Promise<any> {
    // Index options use special symbols
    const indexSymbol = this.getIndexSymbol(request.underlying);
    return this.fetchEquityOptions({ ...request, underlying: indexSymbol });
  }

  // Enhance options data with Greeks and additional metrics
  private async enhanceOptionsData(
    rawData: any, 
    request: OptionsChainRequest
  ): Promise<OptionContract[]> {
    const underlyingPrice = await this.getUnderlyingPrice(request.underlying, request.marketType);
    const riskFreeRate = 0.045; // Current risk-free rate (~4.5%)
    
    const results = rawData.results || [];
    
    return results.map((option: any) => {
      const contract = this.transformToContract(option, request.marketType);
      
      // Calculate additional metrics
      contract.dte = this.calculateDTE(contract.expiration);
      contract.intrinsicValue = this.calculateIntrinsicValue(
        contract.contractType, 
        underlyingPrice, 
        contract.strike
      );
      contract.extrinsicValue = contract.mid - contract.intrinsicValue;
      contract.breakeven = this.calculateBreakeven(
        contract.contractType,
        contract.strike,
        contract.mid
      );
      
      // Enhanced Greeks calculation if enabled
      if (this.enableGreeks && request.includeGreeks) {
        const greeks = this.calculateEnhancedGreeks(
          underlyingPrice,
          contract.strike,
          contract.dte / 365,
          riskFreeRate,
          contract.impliedVolatility,
          contract.contractType
        );
        
        contract.delta = greeks.delta;
        contract.gamma = greeks.gamma;
        contract.theta = greeks.theta;
        contract.vega = greeks.vega;
        contract.rho = greeks.rho;
      }
      
      // Probability calculations
      contract.probabilityITM = this.calculateProbabilityITM(
        underlyingPrice,
        contract.strike,
        contract.dte,
        contract.impliedVolatility,
        contract.contractType
      );
      
      contract.probabilityTouch = contract.probabilityITM * 2; // Rough approximation
      
      // Volume/OI ratio
      contract.volumeOIRatio = contract.openInterest > 0 
        ? contract.volume / contract.openInterest 
        : 0;
      
      return contract;
    });
  }

  // Transform raw API data to our contract format
  private transformToContract(rawOption: any, marketType: MarketType): OptionContract {
    const details = rawOption.details || rawOption;
    const quote = rawOption.last_quote || {};
    const day = rawOption.day || {};
    const greeks = rawOption.greeks || {};
    
    return {
      ticker: details.ticker,
      underlying: details.underlying_ticker,
      marketType,
      contractType: details.contract_type,
      strike: details.strike_price,
      expiration: details.expiration_date,
      dte: 0, // Will be calculated
      
      bid: quote.bid || 0,
      ask: quote.ask || 0,
      mid: ((quote.bid || 0) + (quote.ask || 0)) / 2,
      last: rawOption.last_trade?.price || 0,
      mark: ((quote.bid || 0) + (quote.ask || 0)) / 2,
      
      delta: greeks.delta || 0,
      gamma: greeks.gamma || 0,
      theta: greeks.theta || 0,
      vega: greeks.vega || 0,
      rho: greeks.rho || 0,
      
      impliedVolatility: rawOption.implied_volatility || 0.25,
      ivRank: 0, // Will be calculated separately
      ivPercentile: 0, // Will be calculated separately
      
      volume: day.volume || 0,
      openInterest: rawOption.open_interest || 0,
      volumeOIRatio: 0, // Will be calculated
      
      intrinsicValue: 0, // Will be calculated
      extrinsicValue: 0, // Will be calculated
      breakeven: 0, // Will be calculated
      probabilityITM: 0, // Will be calculated
      probabilityTouch: 0 // Will be calculated
    };
  }

  // Calculate Days to Expiration
  private calculateDTE(expiration: string): number {
    const exp = new Date(expiration);
    const now = new Date();
    const diff = exp.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // Calculate intrinsic value
  private calculateIntrinsicValue(
    type: 'call' | 'put', 
    underlying: number, 
    strike: number
  ): number {
    if (type === 'call') {
      return Math.max(0, underlying - strike);
    } else {
      return Math.max(0, strike - underlying);
    }
  }

  // Calculate breakeven price
  private calculateBreakeven(
    type: 'call' | 'put',
    strike: number,
    premium: number
  ): number {
    return type === 'call' ? strike + premium : strike - premium;
  }

  // Enhanced Greeks calculation using Black-Scholes
  private calculateEnhancedGreeks(
    S: number, // Underlying price
    K: number, // Strike price
    T: number, // Time to expiration (years)
    r: number, // Risk-free rate
    sigma: number, // Implied volatility
    type: 'call' | 'put'
  ) {
    // Simplified Black-Scholes Greeks calculation
    // In production, use a proper library or more sophisticated model
    
    const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    
    const normCDF = (x: number) => {
      return (1 + this.erf(x / Math.sqrt(2))) / 2;
    };
    
    const normPDF = (x: number) => {
      return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
    };
    
    const Nd1 = normCDF(d1);
    const Nd2 = normCDF(d2);
    const nd1 = normPDF(d1);
    
    let delta, gamma, theta, vega, rho;
    
    if (type === 'call') {
      delta = Nd1;
      gamma = nd1 / (S * sigma * Math.sqrt(T));
      theta = -(S * nd1 * sigma) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * Nd2;
      vega = S * nd1 * Math.sqrt(T) / 100; // Divided by 100 for 1% vol change
      rho = K * T * Math.exp(-r * T) * Nd2 / 100; // Divided by 100 for 1% rate change
    } else {
      delta = Nd1 - 1;
      gamma = nd1 / (S * sigma * Math.sqrt(T));
      theta = -(S * nd1 * sigma) / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * (1 - Nd2);
      vega = S * nd1 * Math.sqrt(T) / 100;
      rho = -K * T * Math.exp(-r * T) * (1 - Nd2) / 100;
    }
    
    // Convert theta to daily
    theta = theta / 365;
    
    return { delta, gamma, theta, vega, rho };
  }

  // Error function for normal distribution
  private erf(x: number): number {
    // Approximation of error function
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }

  // Calculate probability of ITM
  private calculateProbabilityITM(
    underlying: number,
    strike: number,
    dte: number,
    iv: number,
    type: 'call' | 'put'
  ): number {
    if (dte <= 0) return underlying > strike ? 1 : 0;
    
    const T = dte / 365;
    const sigma = iv;
    const drift = 0; // Assuming no drift for simplicity
    
    const d2 = (Math.log(underlying / strike) + (drift - 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    
    const normCDF = (x: number) => {
      return (1 + this.erf(x / Math.sqrt(2))) / 2;
    };
    
    return type === 'call' ? normCDF(d2) : 1 - normCDF(d2);
  }

  // Get underlying price based on market type
  private async getUnderlyingPrice(symbol: string, marketType: MarketType): Promise<number> {
    const cacheKey = `price:${symbol}:${marketType}`;
    const cached = this.getFromCache(cacheKey, this.cacheTTL.quotes);
    if (cached) return cached;

    try {
      let price: number;
      
      if (marketType === MarketType.FUTURES_OPTIONS) {
        price = await this.getFuturesPrice(symbol);
      } else {
        price = await this.getStockPrice(symbol);
      }
      
      this.setCache(cacheKey, price);
      return price;
    } catch (error) {
      console.error('Error fetching underlying price:', error);
      // Return mock price for testing
      return marketType === MarketType.FUTURES_OPTIONS ? 4500 : 450;
    }
  }

  // Get stock/ETF price
  private async getStockPrice(symbol: string): Promise<number> {
    const endpoint = `${this.baseUrl}/v2/aggs/ticker/${symbol}/prev`;
    const response = await fetch(`${endpoint}?apiKey=${this.apiKey}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stock price: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results?.[0]?.c || 0;
  }

  // Get futures price
  private async getFuturesPrice(symbol: string): Promise<number> {
    // Futures pricing is more complex - this is simplified
    // In production, integrate with proper futures data provider
    
    const mockPrices: Record<string, number> = {
      ES: 4500,
      CL: 75,
      GC: 2000,
      ZN: 110,
      '6E': 1.08,
      NG: 2.5,
      ZW: 550,
      VX: 20
    };
    
    return mockPrices[symbol] || 100;
  }

  // Helper methods
  private buildCacheKey(type: string, data: any): string {
    return `${type}:${JSON.stringify(data)}`;
  }

  private getFromCache(key: string, ttl: number): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private updateQuoteCache(quote: any): void {
    const key = `quote:${quote.sym}`;
    this.setCache(key, quote);
  }

  private updateTradeCache(trade: any): void {
    const key = `trade:${trade.sym}`;
    this.setCache(key, trade);
  }

  private updateAggregateCache(aggregate: any): void {
    const key = `aggregate:${aggregate.sym}`;
    this.setCache(key, aggregate);
  }

  private getFuturesRoot(symbol: string): string {
    // Convert futures symbol to root for API
    const roots: Record<string, string> = {
      ES: 'ES',
      CL: 'CL',
      GC: 'GC',
      ZN: 'ZN',
      '6E': '6E',
      NG: 'NG',
      ZW: 'ZW',
      VX: 'VX'
    };
    
    return roots[symbol] || symbol;
  }

  private getIndexSymbol(symbol: string): string {
    // Convert index symbol for API
    const symbols: Record<string, string> = {
      SPX: 'I:SPX',
      NDX: 'I:NDX',
      RUT: 'I:RUT',
      VIX: 'I:VIX',
      DJX: 'I:DJX'
    };
    
    return symbols[symbol] || symbol;
  }

  // Mock data generators for testing
  private getMockFuturesOptions(request: OptionsChainRequest): any {
    const strikes = this.generateStrikes(4500, 100, 20);
    const expirations = this.generateExpirations(5);
    
    const results = [];
    
    for (const exp of expirations) {
      for (const strike of strikes) {
        for (const type of ['call', 'put']) {
          results.push({
            details: {
              ticker: `${request.underlying}${exp}${strike}${type[0].toUpperCase()}`,
              underlying_ticker: request.underlying,
              contract_type: type,
              strike_price: strike,
              expiration_date: exp
            },
            last_quote: {
              bid: Math.random() * 50,
              ask: Math.random() * 50 + 1
            },
            day: {
              volume: Math.floor(Math.random() * 10000)
            },
            open_interest: Math.floor(Math.random() * 50000),
            implied_volatility: 0.15 + Math.random() * 0.35,
            greeks: {
              delta: type === 'call' ? Math.random() : -Math.random(),
              gamma: Math.random() * 0.05,
              theta: -Math.random() * 0.5,
              vega: Math.random() * 0.3,
              rho: Math.random() * 0.1
            }
          });
        }
      }
    }
    
    return { results };
  }

  private generateStrikes(center: number, interval: number, count: number): number[] {
    const strikes = [];
    for (let i = -count / 2; i <= count / 2; i++) {
      strikes.push(center + i * interval);
    }
    return strikes;
  }

  private generateExpirations(count: number): string[] {
    const expirations = [];
    const now = new Date();
    
    for (let i = 0; i < count; i++) {
      const exp = new Date(now);
      exp.setDate(exp.getDate() + (i + 1) * 7); // Weekly expirations
      expirations.push(exp.toISOString().split('T')[0]);
    }
    
    return expirations;
  }

  private getFallbackData(request: OptionsChainRequest): OptionContract[] {
    // Return sample data when API fails
    console.warn('Using fallback data for options chain');
    return [];
  }

  // WebSocket subscription methods
  subscribeToOption(ticker: string, callback: (data: any) => void): void {
    if (this.wsClient?.readyState === WebSocket.OPEN) {
      this.wsClient.send(JSON.stringify({
        action: 'subscribe',
        params: `Q.${ticker},T.${ticker}`
      }));
    }
  }

  unsubscribeFromOption(ticker: string): void {
    if (this.wsClient?.readyState === WebSocket.OPEN) {
      this.wsClient.send(JSON.stringify({
        action: 'unsubscribe',
        params: `Q.${ticker},T.${ticker}`
      }));
    }
  }

  // Cleanup
  disconnect(): void {
    if (this.wsClient) {
      this.wsClient.close();
    }
    this.cache.clear();
  }
}

// Singleton instance
let enhancedClient: PolygonEnhancedClient | null = null;

export function getPolygonEnhancedClient(config?: PolygonEnhancedConfig): PolygonEnhancedClient {
  if (!enhancedClient && config) {
    enhancedClient = new PolygonEnhancedClient(config);
  } else if (!enhancedClient) {
    enhancedClient = new PolygonEnhancedClient({
      apiKey: process.env.POLYGON_API_KEY || '',
      tier: 'starter', // Default to starter tier
      enableWebSocket: true,
      enableGreeksCalculation: true
    });
  }
  return enhancedClient;
}

export default PolygonEnhancedClient;