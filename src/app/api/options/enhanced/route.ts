import { NextRequest, NextResponse } from 'next/server';
import { getPolygonEnhancedClient, MarketType } from '@/lib/polygon/enhanced-client';

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse parameters
    const underlying = searchParams.get('underlying') || searchParams.get('ticker');
    const marketTypeParam = searchParams.get('marketType') || 'equity_options';
    const expiration = searchParams.get('expiration');
    const minStrike = searchParams.get('minStrike');
    const maxStrike = searchParams.get('maxStrike');
    const contractType = searchParams.get('contractType') as 'call' | 'put' | 'both' | undefined;
    const minDTE = searchParams.get('minDTE');
    const maxDTE = searchParams.get('maxDTE');
    const minVolume = searchParams.get('minVolume');
    const minOpenInterest = searchParams.get('minOpenInterest');
    const includeGreeks = searchParams.get('includeGreeks') !== 'false';
    
    if (!underlying) {
      return NextResponse.json({ error: 'Underlying/ticker required' }, { status: 400 });
    }
    
    // Map market type
    const marketType = marketTypeParam as MarketType;
    
    // Get enhanced client
    const client = getPolygonEnhancedClient({
      apiKey: POLYGON_API_KEY || '',
      tier: 'starter',
      enableWebSocket: false, // WebSocket in API route not needed
      enableGreeksCalculation: true
    });
    
    // Build request
    const optionsRequest = {
      underlying: underlying.toUpperCase(),
      marketType,
      expiration,
      minStrike: minStrike ? parseFloat(minStrike) : undefined,
      maxStrike: maxStrike ? parseFloat(maxStrike) : undefined,
      contractType: contractType || 'both',
      minDTE: minDTE ? parseInt(minDTE) : undefined,
      maxDTE: maxDTE ? parseInt(maxDTE) : undefined,
      minVolume: minVolume ? parseInt(minVolume) : undefined,
      minOpenInterest: minOpenInterest ? parseInt(minOpenInterest) : undefined,
      includeGreeks
    };
    
    // Fetch options chain
    const optionsChain = await client.getOptionsChain(optionsRequest);
    
    // Apply additional filters if needed
    let filteredChain = optionsChain;
    
    if (minDTE) {
      const minDays = parseInt(minDTE);
      filteredChain = filteredChain.filter(opt => opt.dte >= minDays);
    }
    
    if (maxDTE) {
      const maxDays = parseInt(maxDTE);
      filteredChain = filteredChain.filter(opt => opt.dte <= maxDays);
    }
    
    if (minVolume) {
      const minVol = parseInt(minVolume);
      filteredChain = filteredChain.filter(opt => opt.volume >= minVol);
    }
    
    if (minOpenInterest) {
      const minOI = parseInt(minOpenInterest);
      filteredChain = filteredChain.filter(opt => opt.openInterest >= minOI);
    }
    
    if (contractType && contractType !== 'both') {
      filteredChain = filteredChain.filter(opt => opt.contractType === contractType);
    }
    
    // Sort by open interest and volume
    filteredChain.sort((a, b) => {
      const scoreA = a.openInterest + a.volume * 0.5;
      const scoreB = b.openInterest + b.volume * 0.5;
      return scoreB - scoreA;
    });
    
    // Return response
    return NextResponse.json({
      status: 'success',
      marketType,
      underlying: underlying.toUpperCase(),
      count: filteredChain.length,
      results: filteredChain
    });
    
  } catch (error) {
    console.error('Enhanced options API error:', error);
    
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        error: 'Failed to fetch options data',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// POST endpoint for bulk options analysis
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { underlyings, marketType, criteria } = body;
    
    if (!underlyings || !Array.isArray(underlyings)) {
      return NextResponse.json({ error: 'Underlyings array required' }, { status: 400 });
    }
    
    const client = getPolygonEnhancedClient({
      apiKey: POLYGON_API_KEY || '',
      tier: 'starter',
      enableWebSocket: false,
      enableGreeksCalculation: true
    });
    
    // Fetch options for multiple underlyings in parallel
    const promises = underlyings.map(async (underlying: string) => {
      const optionsRequest = {
        underlying: underlying.toUpperCase(),
        marketType: marketType || MarketType.EQUITY_OPTIONS,
        includeGreeks: true,
        ...criteria
      };
      
      try {
        const chain = await client.getOptionsChain(optionsRequest);
        return { underlying, success: true, data: chain };
      } catch (error) {
        return { underlying, success: false, error: error instanceof Error ? error.message : 'Failed' };
      }
    });
    
    const results = await Promise.all(promises);
    
    // Analyze results for opportunities
    const opportunities = analyzeOptionsOpportunities(results.filter(r => r.success));
    
    return NextResponse.json({
      status: 'success',
      results,
      opportunities,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Bulk options API error:', error);
    return NextResponse.json(
      { error: 'Failed to process bulk request' },
      { status: 500 }
    );
  }
}

// Analyze options for opportunities
function analyzeOptionsOpportunities(results: any[]) {
  const opportunities: any = {
    highIV: [],
    highVolume: [],
    unusualActivity: [],
    cheapPremium: [],
    expensivePremium: []
  };
  
  results.forEach(({ underlying, data }) => {
    data.forEach((option: any) => {
      // High IV opportunities (>50%)
      if (option.impliedVolatility > 0.5) {
        opportunities.highIV.push({
          underlying,
          ticker: option.ticker,
          iv: option.impliedVolatility,
          strike: option.strike,
          type: option.contractType
        });
      }
      
      // High volume
      if (option.volume > 1000) {
        opportunities.highVolume.push({
          underlying,
          ticker: option.ticker,
          volume: option.volume,
          strike: option.strike,
          type: option.contractType
        });
      }
      
      // Unusual activity (volume > 2x OI)
      if (option.volumeOIRatio > 2) {
        opportunities.unusualActivity.push({
          underlying,
          ticker: option.ticker,
          ratio: option.volumeOIRatio,
          volume: option.volume,
          oi: option.openInterest
        });
      }
      
      // Cheap premium (<$0.50 with decent volume)
      if (option.mid < 0.5 && option.volume > 100) {
        opportunities.cheapPremium.push({
          underlying,
          ticker: option.ticker,
          premium: option.mid,
          volume: option.volume
        });
      }
      
      // Expensive premium (>$5 with high IV)
      if (option.mid > 5 && option.impliedVolatility > 0.3) {
        opportunities.expensivePremium.push({
          underlying,
          ticker: option.ticker,
          premium: option.mid,
          iv: option.impliedVolatility
        });
      }
    });
  });
  
  // Sort and limit each category
  Object.keys(opportunities).forEach(key => {
    opportunities[key] = opportunities[key]
      .sort((a: any, b: any) => {
        if (key === 'highIV') return b.iv - a.iv;
        if (key === 'highVolume') return b.volume - a.volume;
        if (key === 'unusualActivity') return b.ratio - a.ratio;
        return 0;
      })
      .slice(0, 10); // Top 10 for each category
  });
  
  return opportunities;
}