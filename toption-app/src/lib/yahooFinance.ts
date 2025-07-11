export interface StockQuote {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketVolume: number;
  shortName: string;
  longName: string;
}

class YahooFinanceAPI {
  private corsProxy = 'https://api.allorigins.win/raw?url=';
  private quotesUrl = 'https://query1.finance.yahoo.com/v7/finance/quote';

  async getQuote(symbol: string): Promise<StockQuote | null> {
    try {
      const url = `${this.corsProxy}${encodeURIComponent(`${this.quotesUrl}?symbols=${symbol}`)}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.quoteResponse?.result?.[0]) {
        const quote = data.quoteResponse.result[0];
        return {
          symbol: quote.symbol,
          regularMarketPrice: quote.regularMarketPrice || 0,
          regularMarketChange: quote.regularMarketChange || 0,
          regularMarketChangePercent: quote.regularMarketChangePercent || 0,
          regularMarketVolume: quote.regularMarketVolume || 0,
          shortName: quote.shortName || quote.symbol,
          longName: quote.longName || quote.shortName || quote.symbol,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching quote:', error);
      return null;
    }
  }

  async getBatchQuotes(symbols: string[]): Promise<StockQuote[]> {
    try {
      const symbolString = symbols.join(',');
      const url = `${this.corsProxy}${encodeURIComponent(`${this.quotesUrl}?symbols=${symbolString}`)}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.quoteResponse?.result) {
        return data.quoteResponse.result.map((quote: any) => ({
          symbol: quote.symbol,
          regularMarketPrice: quote.regularMarketPrice || 0,
          regularMarketChange: quote.regularMarketChange || 0,
          regularMarketChangePercent: quote.regularMarketChangePercent || 0,
          regularMarketVolume: quote.regularMarketVolume || 0,
          shortName: quote.shortName || quote.symbol,
          longName: quote.longName || quote.shortName || quote.symbol,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching batch quotes:', error);
      return [];
    }
  }

  async getSampleOptionsData(symbol: string) {
    // Mock options data for demonstration
    return {
      symbol,
      currentPrice: 150.25,
      options: [
        {
          strike: 140,
          expiration: '2024-01-19',
          calls: { bid: 12.50, ask: 12.75, volume: 150, openInterest: 1200 },
          puts: { bid: 2.25, ask: 2.50, volume: 75, openInterest: 800 }
        },
        {
          strike: 150,
          expiration: '2024-01-19',
          calls: { bid: 5.25, ask: 5.50, volume: 300, openInterest: 2500 },
          puts: { bid: 5.00, ask: 5.25, volume: 200, openInterest: 1800 }
        },
        {
          strike: 160,
          expiration: '2024-01-19',
          calls: { bid: 1.25, ask: 1.50, volume: 500, openInterest: 3500 },
          puts: { bid: 10.75, ask: 11.00, volume: 125, openInterest: 950 }
        }
      ]
    };
  }
}

export default new YahooFinanceAPI(); 