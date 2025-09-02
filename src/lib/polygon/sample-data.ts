// Sample data matching Polygon.io structure for development
// This allows seamless transition when switching to paid tier

export const sampleQuotes = {
  'SPY': {
    status: 'OK',
    results: [{
      T: 'SPY',
      c: 485.67,  // close
      h: 487.23,  // high
      l: 484.12,  // low
      o: 486.45,  // open
      v: 75432189, // volume
      vw: 485.89,  // VWAP
      t: Date.now() - 86400000 // yesterday
    }]
  },
  'QQQ': {
    status: 'OK',
    results: [{
      T: 'QQQ',
      c: 425.34,
      h: 427.89,
      l: 424.01,
      o: 426.12,
      v: 45321789,
      vw: 425.67,
      t: Date.now() - 86400000
    }]
  },
  'AAPL': {
    status: 'OK',
    results: [{
      T: 'AAPL',
      c: 184.25,
      h: 185.67,
      l: 183.12,
      o: 184.89,
      v: 52341234,
      vw: 184.45,
      t: Date.now() - 86400000
    }]
  },
  'TSLA': {
    status: 'OK',
    results: [{
      T: 'TSLA',
      c: 248.73,
      h: 251.45,
      l: 246.89,
      o: 249.12,
      v: 98765432,
      vw: 249.23,
      t: Date.now() - 86400000
    }]
  },
  'MSFT': {
    status: 'OK',
    results: [{
      T: 'MSFT',
      c: 378.85,
      h: 380.23,
      l: 377.45,
      o: 379.12,
      v: 23456789,
      vw: 378.95,
      t: Date.now() - 86400000
    }]
  },
  'NVDA': {
    status: 'OK',
    results: [{
      T: 'NVDA',
      c: 875.32,
      h: 882.45,
      l: 871.23,
      o: 878.90,
      v: 42345678,
      vw: 876.45,
      t: Date.now() - 86400000
    }]
  }
};

export const sampleOptionsData = {
  'SPY': {
    status: 'OK',
    results: [
      // 30 DTE Puts for Wheel Strategy
      {
        ticker: 'O:SPY251219P00470000',
        underlying_ticker: 'SPY',
        expiration_date: '2025-12-19',
        strike_price: 470,
        contract_type: 'put',
        shares_per_contract: 100,
        exercise_style: 'american',
        primary_exchange: 'CBOE',
        bid: 2.45,
        ask: 2.48,
        last: 2.46,
        volume: 15234,
        open_interest: 48392,
        implied_volatility: 0.285,
        delta: -0.32,
        gamma: 0.015,
        theta: -0.08,
        vega: 0.25
      },
      {
        ticker: 'O:SPY251219P00475000',
        underlying_ticker: 'SPY',
        expiration_date: '2025-12-19',
        strike_price: 475,
        contract_type: 'put',
        shares_per_contract: 100,
        exercise_style: 'american',
        primary_exchange: 'CBOE',
        bid: 3.15,
        ask: 3.18,
        last: 3.16,
        volume: 22145,
        open_interest: 65234,
        implied_volatility: 0.278,
        delta: -0.38,
        gamma: 0.018,
        theta: -0.09,
        vega: 0.28
      },
      {
        ticker: 'O:SPY251219P00480000',
        underlying_ticker: 'SPY',
        expiration_date: '2025-12-19',
        strike_price: 480,
        contract_type: 'put',
        shares_per_contract: 100,
        exercise_style: 'american',
        primary_exchange: 'CBOE',
        bid: 4.25,
        ask: 4.28,
        last: 4.26,
        volume: 31456,
        open_interest: 87654,
        implied_volatility: 0.272,
        delta: -0.45,
        gamma: 0.020,
        theta: -0.11,
        vega: 0.32
      }
    ]
  },
  'AAPL': {
    status: 'OK',
    results: [
      {
        ticker: 'O:AAPL251219P00175000',
        underlying_ticker: 'AAPL',
        expiration_date: '2025-12-19',
        strike_price: 175,
        contract_type: 'put',
        shares_per_contract: 100,
        exercise_style: 'american',
        primary_exchange: 'CBOE',
        bid: 1.85,
        ask: 1.88,
        last: 1.86,
        volume: 8234,
        open_interest: 24567,
        implied_volatility: 0.312,
        delta: -0.28,
        gamma: 0.012,
        theta: -0.06,
        vega: 0.18
      },
      {
        ticker: 'O:AAPL251219P00180000',
        underlying_ticker: 'AAPL',
        expiration_date: '2025-12-19',
        strike_price: 180,
        contract_type: 'put',
        shares_per_contract: 100,
        exercise_style: 'american',
        primary_exchange: 'CBOE',
        bid: 2.95,
        ask: 2.98,
        last: 2.96,
        volume: 12456,
        open_interest: 35678,
        implied_volatility: 0.298,
        delta: -0.35,
        gamma: 0.015,
        theta: -0.08,
        vega: 0.22
      }
    ]
  },
  'TSLA': {
    status: 'OK',
    results: [
      {
        ticker: 'O:TSLA251219P00240000',
        underlying_ticker: 'TSLA',
        expiration_date: '2025-12-19',
        strike_price: 240,
        contract_type: 'put',
        shares_per_contract: 100,
        exercise_style: 'american',
        primary_exchange: 'CBOE',
        bid: 4.15,
        ask: 4.20,
        last: 4.17,
        volume: 18765,
        open_interest: 42345,
        implied_volatility: 0.425,
        delta: -0.30,
        gamma: 0.008,
        theta: -0.12,
        vega: 0.35
      },
      {
        ticker: 'O:TSLA251219P00245000',
        underlying_ticker: 'TSLA',
        expiration_date: '2025-12-19',
        strike_price: 245,
        contract_type: 'put',
        shares_per_contract: 100,
        exercise_style: 'american',
        primary_exchange: 'CBOE',
        bid: 5.25,
        ask: 5.30,
        last: 5.27,
        volume: 24567,
        open_interest: 56789,
        implied_volatility: 0.415,
        delta: -0.36,
        gamma: 0.010,
        theta: -0.14,
        vega: 0.38
      }
    ]
  }
};

// Helper to calculate days to expiration
export function getDTE(expirationDate: string): number {
  const expiry = new Date(expirationDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Helper to calculate monthly return
export function calculateMonthlyReturn(premium: number, strike: number, dte: number): number {
  const returnPct = (premium / strike) * 100;
  const monthlyReturn = (returnPct / dte) * 30;
  return monthlyReturn;
}

// Helper to calculate annualized return
export function calculateAnnualizedReturn(monthlyReturn: number): number {
  return monthlyReturn * 12;
}

// Helper to format expiration date
function getExpirationDate(daysToExpiration: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysToExpiration);
  return date.toISOString().split('T')[0];
}