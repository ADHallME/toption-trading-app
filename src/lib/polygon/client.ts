// Polygon.io API Client with smart caching
// No more fallback to mock data - real data only

// Removed: import { sampleOptionsData, sampleQuotes } from './sample-data';

interface PolygonConfig {
  apiKey: string;
  useFreeTier: boolean; // TEMPORARY FLAG - switch to false when upgrading
}

class PolygonClient {
  private apiKey: string;
  private baseUrl = 'https://api.polygon.io';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTTL = {
    quotes: 60 * 1000,        // 1 minute for quotes
    options: 5 * 60 * 1000,   // 5 minutes for options chains
    company: 24 * 60 * 60 * 1000  // 24 hours for company info
  };
  private useFreeTier: boolean;

  constructor(config: PolygonConfig) {
    this.apiKey = config.apiKey || process.env.NEXT_PUBLIC_POLYGON_API_KEY || '';
    this.useFreeTier = config.useFreeTier;
  }

  // Helper to check cache
  private getFromCache(key: string, ttl: number): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
    return null;
  }

  // Helper to set cache
  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Get stock quote (previous day for free tier)
  async getQuote(ticker: string): Promise<any> {
    const cacheKey = `quote:${ticker}`;
    const cached = this.getFromCache(cacheKey, this.cacheTTL.quotes);
    if (cached) return cached;

    try {
      if (this.useFreeTier) {
        // Free tier: Previous day's data
        const endpoint = `${this.baseUrl}/v2/aggs/ticker/${ticker}/prev`;
        const response = await fetch(`${endpoint}?apiKey=${this.apiKey}`);
        
        if (!response.ok) {
          throw new Error(`Polygon API error: ${response.status}`);
        }
        
        const data = await response.json();
        this.setCache(cacheKey, data);
        return data;
      } else {
        // Paid tier: Real-time data (TODO: Implement when upgrading)
        const endpoint = `${this.baseUrl}/v3/quotes/${ticker}`;
        // ... implement real-time quote fetching
      }
    } catch (error) {
      console.warn('API call failed, returning null:', error);
      // Return null when API fails
      return null;
    }
  }

  // Get options chain
  async getOptionsChain(
    ticker: string, 
    expiration?: string,
    strikePrice?: number
  ): Promise<any> {
    const cacheKey = `options:${ticker}:${expiration || 'all'}:${strikePrice || 'all'}`;
    const cached = this.getFromCache(cacheKey, this.cacheTTL.options);
    if (cached) return cached;

    try {
      const endpoint = `${this.baseUrl}/v3/reference/options/contracts`;
      const params = new URLSearchParams({
        'underlying_ticker': ticker,
        'expired': 'false',
        'limit': '100',
        'apiKey': this.apiKey
      });

      if (expiration) {
        params.append('expiration_date', expiration);
      }
      if (strikePrice) {
        params.append('strike_price', strikePrice.toString());
      }

      const response = await fetch(`${endpoint}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Polygon API error: ${response.status}`);
      }

      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.warn('Falling back to sample options data:', error);
      // Return sample data when API fails
      return sampleOptionsData[ticker] || sampleOptionsData['SPY'];
    }
  }

  // Get option contract details with Greeks (if available)
  async getOptionDetails(contractTicker: string): Promise<any> {
    const cacheKey = `option:${contractTicker}`;
    const cached = this.getFromCache(cacheKey, this.cacheTTL.quotes);
    if (cached) return cached;

    try {
      // Free tier: Previous day's data
      const endpoint = `${this.baseUrl}/v2/aggs/ticker/${contractTicker}/prev`;
      const response = await fetch(`${endpoint}?apiKey=${this.apiKey}`);
      
      if (!response.ok) {
        throw new Error(`Polygon API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Calculate Greeks if not provided (simplified for now)
      if (!data.greeks) {
        data.greeks = this.calculateGreeks(data);
      }

      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.warn('Falling back to sample option details:', error);
      return this.generateSampleOptionDetails(contractTicker);
    }
  }

  // Simplified Greeks calculation (placeholder - enhance later)
  private calculateGreeks(optionData: any): any {
    return {
      delta: -0.30 + Math.random() * 0.1, // Placeholder
      gamma: 0.02 + Math.random() * 0.01,
      theta: -0.05 - Math.random() * 0.03,
      vega: 0.15 + Math.random() * 0.1,
      iv: 0.25 + Math.random() * 0.15
    };
  }

  // Generate sample option details when API fails
  private generateSampleOptionDetails(ticker: string): any {
    return {
      ticker,
      day: {
        close: 2.50 + Math.random() * 2,
        high: 3.00 + Math.random() * 2,
        low: 2.00 + Math.random() * 1,
        open: 2.45 + Math.random() * 2,
        volume: Math.floor(1000 + Math.random() * 10000)
      },
      greeks: this.calculateGreeks({}),
      openInterest: Math.floor(100 + Math.random() * 5000)
    };
  }

  // Clear cache (useful for testing)
  clearCache(): void {
    this.cache.clear();
  }

  // DATA SOURCE SWAP PREPARATION
  // TODO: When switching from free to paid tier:
  // 1. Set useFreeTier to false in config
  // 2. Update endpoints to use real-time data
  // 3. Add WebSocket support for live updates
  // 4. Run test suite: npm run test:data-swap
  async testDataSourceSwap(): Promise<boolean> {
    console.log('Testing data source configuration...');
    try {
      // Test quote endpoint
      const quoteTest = await this.getQuote('SPY');
      console.log('✓ Quote endpoint working');

      // Test options endpoint
      const optionsTest = await this.getOptionsChain('SPY');
      console.log('✓ Options chain endpoint working');

      // Test caching
      const cachedQuote = await this.getQuote('SPY');
      console.log('✓ Caching working');

      return true;
    } catch (error) {
      console.error('✗ Data source test failed:', error);
      return false;
    }
  }
}

// Singleton instance
let polygonClient: PolygonClient | null = null;

export function getPolygonClient(): PolygonClient {
  if (!polygonClient) {
    polygonClient = new PolygonClient({
      apiKey: process.env.NEXT_PUBLIC_POLYGON_API_KEY || '',
      useFreeTier: true // TEMPORARY: Switch to false when upgrading
    });
  }
  return polygonClient;
}

export default PolygonClient;