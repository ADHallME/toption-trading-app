// Complete universe of optionable tickers
// Categorized by asset class for proper filtering

// ALL US EQUITIES WITH OPTIONS (~3000+ tickers)
// This will be populated dynamically from Polygon API
export const EQUITY_UNIVERSE = [
  // Will be fetched from Polygon /v3/reference/options/contracts
  // For now, placeholder - need to fetch on app startup
]

// ALL INDEXES WITH OPTIONS
export const INDEX_UNIVERSE = [
  // Major Indexes
  'SPX', 'NDX', 'RUT', 'DJX', 'VIX', 'VVIX',
  
  // Index ETFs
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
 * Fetch ALL optionable equities from Polygon
 * This should be called once on app startup and cached
 */
export async function fetchAllOptionableEquities(apiKey: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://api.polygon.io/v3/reference/options/contracts?underlying_ticker.gte=A&underlying_ticker.lte=ZZZZ&limit=50000&apiKey=${apiKey}`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch optionable tickers')
    }
    
    const data = await response.json()
    
    // Extract unique underlying tickers
    const tickers = new Set<string>()
    data.results?.forEach((contract: any) => {
      if (contract.underlying_ticker) {
        tickers.add(contract.underlying_ticker)
      }
    })
    
    return Array.from(tickers).sort()
  } catch (error) {
    console.error('Error fetching optionable equities:', error)
    // Fallback to a basic list if API fails
    return FALLBACK_EQUITY_LIST
  }
}

// Fallback list of top ~1000 liquid equities if API fails
const FALLBACK_EQUITY_LIST = [
  // Mega-cap
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'BRK.B', 'V', 'UNH',
  'XOM', 'JNJ', 'WMT', 'JPM', 'MA', 'PG', 'LLY', 'CVX', 'HD', 'MRK',
  
  // Large-cap Tech
  'AMD', 'NFLX', 'INTC', 'CSCO', 'AVGO', 'ORCL', 'CRM', 'ADBE', 'QCOM', 'TXN',
  'INTU', 'AMAT', 'LRCX', 'KLAC', 'SNPS', 'CDNS', 'MRVL', 'PANW', 'PLTR', 'SNOW',
  
  // Financial
  'BAC', 'WFC', 'GS', 'MS', 'SCHW', 'BLK', 'C', 'AXP', 'SPGI', 'ICE',
  'CME', 'USB', 'PNC', 'TFC', 'BK', 'STT', 'FITB', 'RF', 'KEY', 'CFG',
  
  // Healthcare
  'UNH', 'JNJ', 'PFE', 'ABBV', 'TMO', 'ABT', 'MRK', 'LLY', 'DHR', 'BMY',
  'AMGN', 'GILD', 'CVS', 'CI', 'HUM', 'REGN', 'VRTX', 'ISRG', 'SYK', 'BSX',
  
  // Consumer
  'WMT', 'COST', 'HD', 'PG', 'KO', 'PEP', 'MCD', 'NKE', 'SBUX', 'TGT',
  'LOW', 'TJX', 'DG', 'ROST', 'DLTR', 'YUM', 'CMG', 'ORLY', 'AZO', 'BBY',
  
  // Energy
  'XOM', 'CVX', 'COP', 'SLB', 'EOG', 'MPC', 'PSX', 'VLO', 'OXY', 'HAL',
  'BKR', 'DVN', 'HES', 'FANG', 'MRO', 'APA', 'CTRA', 'OVV', 'PR', 'RIG',
  
  // Industrial
  'BA', 'CAT', 'GE', 'HON', 'UPS', 'RTX', 'LMT', 'UNP', 'DE', 'MMM',
  'GD', 'NOC', 'ETN', 'EMR', 'ITW', 'PH', 'FDX', 'NSC', 'CSX', 'WM',
  
  // Communication
  'DIS', 'CMCSA', 'T', 'VZ', 'TMUS', 'CHTR', 'NFLX', 'EA', 'ATVI', 'TTWO',
  
  // Retail/E-commerce
  'AMZN', 'WMT', 'COST', 'HD', 'TGT', 'LOW', 'EBAY', 'ETSY', 'W', 'CHWY',
  
  // High IV / Meme
  'GME', 'AMC', 'PLTR', 'RIVN', 'LCID', 'NIO', 'SOFI', 'HOOD', 'COIN', 'RBLX',
  'AI', 'SMCI', 'MSTR', 'BBBY', 'BYND', 'TLRY', 'SNDL', 'WKHS', 'RIDE', 'NKLA',
  
  // Cloud/SaaS
  'NOW', 'SNOW', 'DDOG', 'PANW', 'ZS', 'CRWD', 'OKTA', 'NET', 'ESTC', 'MDB',
  'TEAM', 'WDAY', 'ZM', 'DOCU', 'TWLO', 'GTLB', 'S', 'DBX', 'BOX', 'RNG',
  
  // EV/Clean Energy
  'TSLA', 'NIO', 'RIVN', 'LCID', 'FSR', 'PLUG', 'ENPH', 'SEDG', 'BE', 'NOVA',
  'BLNK', 'CHPT', 'QS', 'LAZR', 'VLDR', 'OUST', 'GOEV', 'RIDE', 'ARVL', 'NKLA',
  
  // Semiconductors
  'NVDA', 'AMD', 'INTC', 'TSM', 'QCOM', 'AVGO', 'TXN', 'AMAT', 'LRCX', 'KLAC',
  'ASML', 'MU', 'MRVL', 'NXPI', 'ADI', 'MCHP', 'ON', 'MPWR', 'SWKS', 'QRVO',
  
  // Biotech
  'GILD', 'AMGN', 'REGN', 'VRTX', 'BIIB', 'ILMN', 'ALXN', 'INCY', 'BMRN', 'SGEN',
  'MRNA', 'BNTX', 'NVAX', 'CRSP', 'EDIT', 'NTLA', 'BEAM', 'BLUE', 'FOLD', 'ARWR',
  
  // REITs
  'PLD', 'AMT', 'CCI', 'EQIX', 'PSA', 'DLR', 'O', 'WELL', 'AVB', 'EQR',
  'SPG', 'VTR', 'ARE', 'PEAK', 'MAA', 'INVH', 'UDR', 'ESS', 'CPT', 'HST',
  
  // Banks (Regional)
  'USB', 'PNC', 'TFC', 'BK', 'STT', 'FITB', 'RF', 'KEY', 'CFG', 'HBAN',
  'ZION', 'MTB', 'FHN', 'SIVB', 'SBNY', 'CMA', 'WBS', 'EWBC', 'FCNCA', 'WTFC',
  
  // Insurance
  'BRK.B', 'PGR', 'TRV', 'ALL', 'CB', 'AIG', 'MET', 'PRU', 'AFL', 'HIG',
  
  // More sectors... (would continue to ~1000+ tickers)
]

export { FALLBACK_EQUITY_LIST }
