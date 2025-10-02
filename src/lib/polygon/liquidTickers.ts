// Top 100 Most Liquid Options Tickers
// Based on average daily option volume and open interest
// Updated for 2025 market conditions

export const TOP_LIQUID_TICKERS = [
  // Mega-cap Tech (highest volume)
  'AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'META', 'TSLA',
  
  // High Volume Tech
  'AMD', 'NFLX', 'INTC', 'AVGO', 'CRM', 'ORCL', 'ADBE', 'CSCO',
  
  // Major ETFs (extremely liquid)
  'SPY', 'QQQ', 'IWM', 'DIA', 'EEM', 'XLE', 'XLF', 'XLK', 'XLV',
  
  // Financial Giants
  'JPM', 'BAC', 'WFC', 'GS', 'MS', 'C', 'BLK', 'SCHW',
  
  // Communication
  'DIS', 'CMCSA', 'T', 'VZ', 'TMUS',
  
  // Consumer Discretionary
  'AMZN', 'TSLA', 'HD', 'NKE', 'MCD', 'SBUX', 'TGT', 'LOW',
  
  // Healthcare
  'JNJ', 'UNH', 'PFE', 'ABBV', 'TMO', 'ABT', 'MRK', 'LLY',
  
  // Energy
  'XOM', 'CVX', 'COP', 'SLB', 'EOG',
  
  // Industrial
  'BA', 'CAT', 'GE', 'UPS', 'HON', 'RTX',
  
  // Finance/Payments
  'V', 'MA', 'PYPL', 'SQ', 'AXP',
  
  // Retail/Consumer
  'WMT', 'COST', 'PG', 'KO', 'PEP',
  
  // High IV / Meme Stocks (high option volume)
  'GME', 'AMC', 'PLTR', 'RIVN', 'LCID', 'NIO', 'SOFI',
  
  // Semiconductors
  'TSM', 'QCOM', 'AMAT', 'MU', 'ASML',
  
  // Cloud/Software
  'NOW', 'SNOW', 'DDOG', 'PANW', 'ZS',
  
  // EV/Clean Energy
  'TSLA', 'NIO', 'RIVN', 'PLUG', 'ENPH'
]

// Remove duplicates
export const UNIQUE_LIQUID_TICKERS = Array.from(new Set(TOP_LIQUID_TICKERS))

export default UNIQUE_LIQUID_TICKERS
