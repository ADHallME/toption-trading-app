import { NextRequest, NextResponse } from 'next/server';

const POLYGON_API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY || 'geKtXXWPX3aHDqmrcYhYbouXkfhXsaVp';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json(
      { error: 'Symbol parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch from Polygon Ticker Details API
    const response = await fetch(
      `https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${POLYGON_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.results;

    // Format response
    return NextResponse.json({
      success: true,
      name: result?.name || symbol,
      logo: result?.branding?.logo_url ? `${result.branding.logo_url}?apiKey=${POLYGON_API_KEY}` : null,
      marketCap: result?.market_cap ? formatMarketCap(result.market_cap) : 'N/A',
      pe: result?.share_class_shares_outstanding && result?.weighted_shares_outstanding 
        ? (result.market_cap / result.total_employees).toFixed(2) 
        : null,
      eps: null, // Polygon doesn't provide EPS in ticker details
      website: result?.homepage_url || `https://finance.yahoo.com/quote/${symbol}`,
      ceo: null, // Polygon doesn't provide CEO in basic tier
      description: result?.description || `${symbol} is a publicly traded company.`,
      sector: result?.sic_description || 'N/A',
      industry: result?.type || 'N/A',
      employees: result?.total_employees || null,
      exchange: result?.primary_exchange || 'N/A'
    });

  } catch (error) {
    console.error('Error fetching company info:', error);
    
    // Fallback data
    return NextResponse.json({
      success: false,
      name: `${symbol} Corporation`,
      logo: null,
      marketCap: 'N/A',
      pe: null,
      eps: null,
      website: `https://finance.yahoo.com/quote/${symbol}`,
      ceo: 'N/A',
      description: `${symbol} is a publicly traded company. Detailed information is currently unavailable.`,
      sector: 'N/A',
      industry: 'N/A',
      employees: null,
      exchange: 'N/A'
    });
  }
}

function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  } else {
    return `$${marketCap.toLocaleString()}`;
  }
}
