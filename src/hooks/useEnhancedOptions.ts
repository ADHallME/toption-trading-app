import { useState, useEffect, useCallback, useRef } from 'react';

// Market type enum (moved from deleted enhanced-client)
export enum MarketType {
  EQUITY_OPTIONS = 'equity_options',
  INDEX_OPTIONS = 'index_options',
  FUTURES_OPTIONS = 'futures_options'
}

interface OptionContract {
  ticker: string;
  underlying: string;
  marketType: MarketType;
  contractType: 'call' | 'put';
  strike: number;
  expiration: string;
  dte: number;
  
  bid: number;
  ask: number;
  mid: number;
  last: number;
  mark: number;
  
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
  
  impliedVolatility: number;
  ivRank: number;
  ivPercentile: number;
  
  volume: number;
  openInterest: number;
  volumeOIRatio: number;
  
  intrinsicValue: number;
  extrinsicValue: number;
  breakeven: number;
  probabilityITM: number;
  probabilityTouch: number;
}

interface UseEnhancedOptionsParams {
  underlying: string;
  marketType: MarketType;
  expiration?: string;
  minStrike?: number;
  maxStrike?: number;
  contractType?: 'call' | 'put' | 'both';
  minDTE?: number;
  maxDTE?: number;
  minVolume?: number;
  minOpenInterest?: number;
  includeGreeks?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseEnhancedOptionsReturn {
  data: OptionContract[];
  loading: boolean;
  error: string | null;
  marketType: MarketType;
  refresh: () => void;
  setMarketType: (type: MarketType) => void;
  lastUpdated: Date | null;
}

export function useEnhancedOptions(params: UseEnhancedOptionsParams): UseEnhancedOptionsReturn {
  const [data, setData] = useState<OptionContract[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [marketType, setMarketType] = useState(params.marketType);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const fetchOptions = useCallback(async () => {
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('underlying', params.underlying);
      queryParams.append('marketType', marketType);
      
      if (params.expiration) queryParams.append('expiration', params.expiration);
      if (params.minStrike) queryParams.append('minStrike', params.minStrike.toString());
      if (params.maxStrike) queryParams.append('maxStrike', params.maxStrike.toString());
      if (params.contractType) queryParams.append('contractType', params.contractType);
      if (params.minDTE) queryParams.append('minDTE', params.minDTE.toString());
      if (params.maxDTE) queryParams.append('maxDTE', params.maxDTE.toString());
      if (params.minVolume) queryParams.append('minVolume', params.minVolume.toString());
      if (params.minOpenInterest) queryParams.append('minOpenInterest', params.minOpenInterest.toString());
      if (params.includeGreeks !== undefined) queryParams.append('includeGreeks', params.includeGreeks.toString());
      
      const response = await fetch(`/api/options/enhanced?${queryParams}`, {
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const result = await response.json();
      setData(result.results || []);
      setLastUpdated(new Date());
      
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching enhanced options:', err);
        setError(err.message || 'Failed to fetch options data');
      }
    } finally {
      setLoading(false);
    }
  }, [params, marketType]);
  
  // Initial fetch and whenever params change
  useEffect(() => {
    if (!params.underlying) return;
    
    fetchOptions();
    
    // Setup auto-refresh if enabled
    if (params.autoRefresh && params.refreshInterval) {
      refreshTimerRef.current = setInterval(fetchOptions, params.refreshInterval);
    }
    
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchOptions, params.autoRefresh, params.refreshInterval]);
  
  const handleSetMarketType = useCallback((type: MarketType) => {
    setMarketType(type);
  }, []);
  
  return {
    data,
    loading,
    error,
    marketType,
    refresh: fetchOptions,
    setMarketType: handleSetMarketType,
    lastUpdated
  };
}

// Hook for bulk options analysis
interface UseBulkOptionsAnalysisParams {
  underlyings: string[];
  marketType?: MarketType;
  criteria?: any;
}

interface OptionsOpportunity {
  highIV: any[];
  highVolume: any[];
  unusualActivity: any[];
  cheapPremium: any[];
  expensivePremium: any[];
}

interface UseBulkOptionsAnalysisReturn {
  opportunities: OptionsOpportunity | null;
  loading: boolean;
  error: string | null;
  analyze: () => void;
}

export function useBulkOptionsAnalysis(params: UseBulkOptionsAnalysisParams): UseBulkOptionsAnalysisReturn {
  const [opportunities, setOpportunities] = useState<OptionsOpportunity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const analyze = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/options/enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          underlyings: params.underlyings,
          marketType: params.marketType || MarketType.EQUITY_OPTIONS,
          criteria: params.criteria || {}
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      setOpportunities(result.opportunities);
      
    } catch (err: any) {
      console.error('Error analyzing options:', err);
      setError(err.message || 'Failed to analyze options');
    } finally {
      setLoading(false);
    }
  }, [params]);
  
  useEffect(() => {
    if (params.underlyings.length > 0) {
      analyze();
    }
  }, [params.underlyings]);
  
  return { opportunities, loading, error, analyze };
}

// Hook for real-time option quotes via WebSocket
interface UseRealtimeOptionParams {
  ticker: string;
  enabled?: boolean;
}

interface RealtimeQuote {
  symbol: string;
  bid: number;
  ask: number;
  last: number;
  volume: number;
  timestamp: number;
}

export function useRealtimeOption(params: UseRealtimeOptionParams) {
  const [quote, setQuote] = useState<RealtimeQuote | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    if (!params.enabled || !params.ticker) return;
    
    // For now, we'll poll the API
    // In production, this would connect to WebSocket
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/options/quote?ticker=${params.ticker}`);
        if (response.ok) {
          const data = await response.json();
          setQuote(data);
          setConnected(true);
        }
      } catch (err) {
        console.error('Quote fetch error:', err);
        setConnected(false);
      }
    }, 5000); // Poll every 5 seconds
    
    return () => {
      clearInterval(pollInterval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [params.ticker, params.enabled]);
  
  return { quote, connected };
}

// Hook for fetching IV rank and percentile
interface UseIVMetricsParams {
  underlying: string;
  period?: number; // days
}

interface IVMetrics {
  current: number;
  rank: number;
  percentile: number;
  high: number;
  low: number;
  mean: number;
}

export function useIVMetrics(params: UseIVMetricsParams) {
  const [metrics, setMetrics] = useState<IVMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchIVMetrics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `/api/options/iv-metrics?underlying=${params.underlying}&period=${params.period || 30}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch IV metrics');
        }
        
        const data = await response.json();
        setMetrics(data);
      } catch (err: any) {
        console.error('Error fetching IV metrics:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (params.underlying) {
      fetchIVMetrics();
    }
  }, [params.underlying, params.period]);
  
  return { metrics, loading, error };
}

// MarketType already exported at top of file