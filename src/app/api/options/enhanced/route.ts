import { NextRequest, NextResponse } from 'next/server';
import { getPolygonEnhancedClient } from '@/lib/polygon/enhanced-client';
import { MarketType } from '@/hooks/useEnhancedOptions';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Parse query parameters
  const underlying = searchParams.get('underlying') || 'SPY';
  const marketType = (searchParams.get('marketType') as MarketType) || MarketType.EQUITY_OPTIONS;
  const expiration = searchParams.get('expiration') || undefined; // Changed from null to undefined
  const minStrike = searchParams.get('minStrike') ? parseFloat(searchParams.get('minStrike')!) : undefined;
  const maxStrike = searchParams.get('maxStrike') ? parseFloat(searchParams.get('maxStrike')!) : undefined;
  const contractType = searchParams.get('contractType') as 'call' | 'put' | 'both' || 'both';
  const minVolume = searchParams.get('minVolume') ? parseInt(searchParams.get('minVolume')!) : undefined;
  const minOpenInterest = searchParams.get('minOpenInterest') ? parseInt(searchParams.get('minOpenInterest')!) : undefined;
  const minDTE = searchParams.get('minDTE') ? parseInt(searchParams.get('minDTE')!) : 0;
  const maxDTE = searchParams.get('maxDTE') ? parseInt(searchParams.get('maxDTE')!) : 60;
  const includeGreeks = searchParams.get('includeGreeks') === 'true';

  try {
    const client = getPolygonEnhancedClient();
    
    const optionsRequest = {
      underlying,
      marketType,
      expiration, // Now properly undefined instead of null
      minStrike,
      maxStrike,
      contractType,
      minVolume,
      minOpenInterest,
      minDTE,
      maxDTE,
      includeGreeks
    };
    
    // Fetch options chain
    const optionsChain = await client.getOptionsChain(optionsRequest);
    
    // Apply additional filters if needed
    let filteredChain = optionsChain;
    
    // Sort by volume or other criteria if needed
    if (searchParams.get('sortBy')) {
      const sortBy = searchParams.get('sortBy');
      if (sortBy === 'volume') {
        filteredChain = [...optionsChain].sort((a: any, b: any) => (b.volume || 0) - (a.volume || 0));
      } else if (sortBy === 'openInterest') {
        filteredChain = [...optionsChain].sort((a: any, b: any) => (b.openInterest || 0) - (a.openInterest || 0));
      }
    }
    
    return NextResponse.json({
      success: true,
      data: filteredChain,
      count: filteredChain.length,
      request: optionsRequest
    });
  } catch (error) {
    console.error('Error fetching enhanced options:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch options data' 
      },
      { status: 500 }
    );
  }
}