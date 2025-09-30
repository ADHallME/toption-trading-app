import { NextRequest, NextResponse } from 'next/server';

const companyData: Record<string, any> = {
  'AAPL': {
    name: 'Apple Inc.',
    marketCap: '$3.45T',
    pe: 32.5,
    eps: 6.13,
    website: 'https://apple.com',
    ceo: 'Tim Cook',
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
    sector: 'Technology',
    industry: 'Consumer Electronics'
  },
  'MSFT': {
    name: 'Microsoft Corporation',
    marketCap: '$2.95T',
    pe: 35.2,
    eps: 11.23,
    website: 'https://microsoft.com',
    ceo: 'Satya Nadella',
    description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
    sector: 'Technology',
    industry: 'Software'
  },
  'NVDA': {
    name: 'NVIDIA Corporation',
    marketCap: '$1.35T',
    pe: 65.8,
    eps: 14.52,
    website: 'https://nvidia.com',
    ceo: 'Jensen Huang',
    description: 'NVIDIA Corporation provides graphics, computing and networking solutions worldwide.',
    sector: 'Technology',
    industry: 'Semiconductors'
  },
  'TSLA': {
    name: 'Tesla, Inc.',
    marketCap: '$785B',
    pe: 72.3,
    eps: 3.45,
    website: 'https://tesla.com',
    ceo: 'Elon Musk',
    description: 'Tesla, Inc. designs, develops, manufactures, and sells electric vehicles and energy storage systems.',
    sector: 'Consumer Cyclical',
    industry: 'Auto Manufacturers'
  },
  'AMD': {
    name: 'Advanced Micro Devices',
    marketCap: '$235B',
    pe: 45.2,
    eps: 3.21,
    website: 'https://amd.com',
    ceo: 'Lisa Su',
    description: 'AMD is a global semiconductor company offering CPUs, GPUs, and other computing solutions.',
    sector: 'Technology',
    industry: 'Semiconductors'
  },
  'META': {
    name: 'Meta Platforms Inc.',
    marketCap: '$1.25T',
    pe: 28.9,
    eps: 14.87,
    website: 'https://meta.com',
    ceo: 'Mark Zuckerberg',
    description: 'Meta builds technologies that help people connect, find communities, and grow businesses.',
    sector: 'Technology',
    industry: 'Internet Content'
  },
  'GOOGL': {
    name: 'Alphabet Inc.',
    marketCap: '$1.75T',
    pe: 26.5,
    eps: 5.84,
    website: 'https://abc.xyz',
    ceo: 'Sundar Pichai',
    description: 'Alphabet is the parent company of Google and several other businesses.',
    sector: 'Technology',
    industry: 'Internet Content'
  },
  'AMZN': {
    name: 'Amazon.com Inc.',
    marketCap: '$1.58T',
    pe: 42.3,
    eps: 3.24,
    website: 'https://amazon.com',
    ceo: 'Andy Jassy',
    description: 'Amazon is a multinational technology company focusing on e-commerce, cloud computing, and AI.',
    sector: 'Technology',
    industry: 'Internet Retail'
  },
  'SPY': {
    name: 'SPDR S&P 500 ETF',
    marketCap: '$485B AUM',
    pe: 22.5,
    eps: 19.45,
    website: 'https://www.ssga.com/us/en/intermediary/etfs/funds/spdr-sp-500-etf-trust-spy',
    ceo: 'N/A',
    description: 'The SPDR S&P 500 ETF tracks the S&P 500 Index.',
    sector: 'ETF',
    industry: 'Index Fund'
  },
  'QQQ': {
    name: 'Invesco QQQ Trust',
    marketCap: '$235B AUM',
    pe: 28.3,
    eps: 14.21,
    website: 'https://www.invesco.com/qqq-etf',
    ceo: 'N/A',
    description: 'QQQ tracks the Nasdaq-100 Index of the 100 largest non-financial companies on Nasdaq.',
    sector: 'ETF',
    industry: 'Index Fund'
  }
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol')?.toUpperCase();
  
  if (!symbol) {
    return NextResponse.json({ error: 'Symbol required' }, { status: 400 });
  }
  
  if (companyData[symbol]) {
    return NextResponse.json(companyData[symbol]);
  }
  
  // Default for unknown symbols
  return NextResponse.json({
    name: symbol,
    marketCap: 'N/A',
    pe: 0,
    eps: 0,
    website: `https://finance.yahoo.com/quote/${symbol}`,
    ceo: 'N/A',
    description: `Information for ${symbol}`,
    sector: 'N/A',
    industry: 'N/A'
  });
}
