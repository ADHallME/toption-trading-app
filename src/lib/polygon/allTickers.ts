/**
 * STATIC TICKER UNIVERSES
 * No API calls required - instant access
 * Updated: Oct 2025
 */

// TOP 200 MOST LIQUID EQUITY OPTIONS (Static List - No API Call)
// This eliminates the failing API call that was causing 429 errors
export const EQUITY_UNIVERSE = [
  // Mega-cap Tech (Highest Volume)
  'AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'NVDA', 'META', 'TSLA', 'AVGO', 'NFLX',
  
  // Large Tech
  'AMD', 'INTC', 'CSCO', 'ORCL', 'CRM', 'ADBE', 'QCOM', 'TXN', 'INTU', 'AMAT',
  'LRCX', 'KLAC', 'SNPS', 'CDNS', 'MRVL', 'PANW', 'PLTR', 'SNOW', 'CRWD', 'NET',
  
  // Financial Services
  'JPM', 'BAC', 'WFC', 'GS', 'MS', 'C', 'SCHW', 'BLK', 'AXP', 'SPGI',
  'USB', 'PNC', 'TFC', 'BK', 'STT', 'V', 'MA', 'PYPL', 'SQ', 'COIN',
  
  // Healthcare & Pharma
  'UNH', 'JNJ', 'LLY', 'ABBV', 'MRK', 'TMO', 'ABT', 'PFE', 'DHR', 'BMY',
  'AMGN', 'GILD', 'VRTX', 'REGN', 'ISRG', 'CVS', 'CI', 'HUM', 'BSX', 'MDT',
  
  // Consumer Discretionary
  'AMZN', 'TSLA', 'HD', 'MCD', 'NKE', 'SBUX', 'LOW', 'TJX', 'BKNG', 'MAR',
  'CMG', 'ORLY', 'AZO', 'ROST', 'DG', 'DLTR', 'YUM', 'DPZ', 'ULTA', 'RCL',
  
  // Consumer Staples
  'WMT', 'COST', 'PG', 'KO', 'PEP', 'PM', 'MO', 'MDLZ', 'CL', 'KMB',
  'GIS', 'K', 'HSY', 'STZ', 'TAP', 'CPB', 'CAG', 'SJM', 'HRL', 'TSN',
  
  // Energy
  'XOM', 'CVX', 'COP', 'SLB', 'EOG', 'MPC', 'PSX', 'VLO', 'OXY', 'HAL',
  'DVN', 'FANG', 'HES', 'MRO', 'APA', 'CTRA', 'BKR', 'NOV', 'FTI', 'RIG',
  
  // Industrials
  'BA', 'CAT', 'GE', 'HON', 'UPS', 'RTX', 'LMT', 'DE', 'MMM', 'UNP',
  'GD', 'NOC', 'ETN', 'EMR', 'ITW', 'PH', 'FDX', 'CSX', 'NSC', 'WM',
  
  // Communication Services
  'DIS', 'CMCSA', 'T', 'VZ', 'TMUS', 'CHTR', 'EA', 'TTWO', 'NTES', 'MTCH',
  
  // Materials
  'LIN', 'APD', 'ECL', 'SHW', 'FCX', 'NEM', 'GOLD', 'NUE', 'VMC', 'MLM',
  
  // Real Estate
  'AMT', 'PLD', 'CCI', 'EQIX', 'PSA', 'DLR', 'O', 'WELL', 'AVB', 'EQR',
  
  // Utilities
  'NEE', 'DUK', 'SO', 'D', 'AEP', 'EXC', 'SRE', 'XEL', 'WEC', 'ES',
  
  // High IV / Popular Trading Stocks
  'GME', 'AMC', 'RIVN', 'LCID', 'NIO', 'SOFI', 'HOOD', 'RBLX', 'MSTR', 'SMCI',
  
  // Cloud/SaaS
  'NOW', 'DDOG', 'ZS', 'OKTA', 'MDB', 'TEAM', 'WDAY', 'ZM', 'DOCU', 'TWLO',
  
  // Semiconductors (Additional)
  'TSM', 'ASML', 'MU', 'NXPI', 'ADI', 'MCHP', 'ON', 'MPWR', 'SWKS', 'QRVO',
  
  // Biotech
  'MRNA', 'BNTX', 'NVAX', 'CRSP', 'EDIT', 'NTLA', 'BEAM', 'BLUE', 'FOLD', 'ARWR',
]

// ALL INDEXES WITH OPTIONS
export const INDEX_UNIVERSE = [
  // Major Indexes
  'SPX', 'NDX', 'RUT', 'DJX', 'VIX', 'VVIX',
  
  // Index ETFs (Most Liquid)
  'SPY', 'QQQ', 'IWM', 'DIA', 'VTI', 'VOO', 'VEA', 'VWO', 'EEM', 'EFA',
  
  // Sector ETFs
  'XLK', 'XLF', 'XLE', 'XLV', 'XLI', 'XLY', 'XLP', 'XLU', 'XLC', 'XLRE', 'XLB',
  
  // Factor ETFs
  'IVV', 'IVW', 'IVE', 'IJH', 'IJR', 'VTV', 'VUG', 'VBR', 'VB'
]

// ALL FUTURES WITH OPTIONS
export const FUTURES_UNIVERSE = [
  // Equity Futures
  '/ES', '/NQ', '/YM', '/RTY',
  
  // Energy Futures
  '/CL', '/NG', '/RB', '/HO',
  
  // Metals Futures
  '/GC', '/SI', '/HG', '/PL',
  
  // Agricultural Futures
  '/ZC', '/ZS', '/ZW', '/ZL', '/ZM', '/KC', '/CC', '/SB', '/CT',
  
  // Currency Futures
  '/6E', '/6B', '/6J', '/6A', '/6C', '/6S',
  
  // Interest Rate Futures
  '/ZB', '/ZN', '/ZF', '/ZT',
  
  // Other
  '/VX', '/BTC', '/ETH'
]

/**
 * Get all optionable equities (STATIC - NO API CALL)
 * This replaces the failing Polygon API call with a curated static list
 */
export async function fetchAllOptionableEquities(apiKey: string): Promise<string[]> {
  console.log('[TICKERS] Using static equity universe (200 most liquid)')
  
  // Return immediately - no API call, no rate limiting, no 429 errors
  return EQUITY_UNIVERSE
}

// Keep this for backward compatibility but it's no longer used as a fallback
export const FALLBACK_EQUITY_LIST = EQUITY_UNIVERSE
