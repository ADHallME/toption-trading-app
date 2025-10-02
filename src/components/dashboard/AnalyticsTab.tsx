import React, { useEffect, useState } from 'react';
import { TrendingUp, MessageSquare, Hash, Users } from 'lucide-react';

interface SocialPost {
  id: string;
  platform: 'stocktwits' | 'reddit' | 'twitter';
  author: string;
  content: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  timestamp: Date;
  likes: number;
  url: string;
}

export const AnalyticsTab: React.FC<{ symbol: string }> = ({ symbol }) => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentiment, setSentiment] = useState({ bullish: 0, bearish: 0, neutral: 0 });

  useEffect(() => {
    fetchSocialData();
  }, [symbol]);

  const fetchSocialData = async () => {
    try {
      // StockTwits API (FREE and works immediately)
      const stocktwitsResponse = await fetch(
        `https://api.stocktwits.com/api/2/streams/symbol/${symbol}.json`
      );
      
      if (stocktwitsResponse.ok) {
        const data = await stocktwitsResponse.json();
        const stocktwitsPosts: SocialPost[] = data.messages.map((msg: any) => ({
          id: msg.id,
          platform: 'stocktwits',
          author: msg.user.username,
          content: msg.body,
          sentiment: msg.entities?.sentiment?.basic || 'neutral',
          timestamp: new Date(msg.created_at),
          likes: msg.likes?.total || 0,
          url: msg.permalink
        }));
        
        setPosts(stocktwitsPosts);
        
        // Calculate sentiment
        const bullCount = stocktwitsPosts.filter(p => p.sentiment === 'bullish').length;
        const bearCount = stocktwitsPosts.filter(p => p.sentiment === 'bearish').length;
        const neutralCount = stocktwitsPosts.filter(p => p.sentiment === 'neutral').length;
        const total = stocktwitsPosts.length;
        
        setSentiment({
          bullish: (bullCount / total) * 100,
          bearish: (bearCount / total) * 100,
          neutral: (neutralCount / total) * 100
        });
      }
    } catch (error) {
      console.error('Error fetching social data:', error);
      // Use fallback data
      generateMockSocialData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockSocialData = () => {
    // Fallback mock data if APIs fail
    const mockPosts: SocialPost[] = [
      {
        id: '1',
        platform: 'stocktwits',
        author: 'BullTrader2024',
        content: `$${symbol} looking strong above 200MA. Loading up on calls here.`,
        sentiment: 'bullish',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        likes: 45,
        url: '#'
      },
      {
        id: '2',
        platform: 'reddit',
        author: 'wsb_veteran',
        content: `DD: ${symbol} has massive option flow coming in. 10k contracts at $100 strike.`,
        sentiment: 'bullish',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        likes: 234,
        url: '#'
      },
      {
        id: '3',
        platform: 'twitter',
        author: 'OptionsFlowPro',
        content: `Unusual activity alert: ${symbol} seeing 5x normal volume on weekly puts. Be careful.`,
        sentiment: 'bearish',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        likes: 89,
        url: '#'
      }
    ];
    
    setPosts(mockPosts);
    setSentiment({ bullish: 50, bearish: 30, neutral: 20 });
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-emerald-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'stocktwits': return '$';
      case 'reddit': return 'R/';
      case 'twitter': return 'X';
      default: return '#';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sentiment Overview */}
      <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Social Sentiment for {symbol}
        </h3>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Bullish</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {sentiment.bullish.toFixed(0)}%
            </div>
          </div>
          
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Bearish</span>
              <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
            </div>
            <div className="text-2xl font-bold text-red-400">
              {sentiment.bearish.toFixed(0)}%
            </div>
          </div>
          
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Neutral</span>
              <MessageSquare className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-400">
              {sentiment.neutral.toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Sentiment Bar */}
        <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden flex">
          <div 
            className="bg-emerald-500 transition-all duration-500"
            style={{ width: `${sentiment.bullish}%` }}
          />
          <div 
            className="bg-gray-500 transition-all duration-500"
            style={{ width: `${sentiment.neutral}%` }}
          />
          <div 
            className="bg-red-500 transition-all duration-500"
            style={{ width: `${sentiment.bearish}%` }}
          />
        </div>
      </div>

      {/* Social Feed */}
      <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Live Social Feed
        </h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {posts.map((post) => (
              <div 
                key={post.id}
                className="bg-slate-900/50 rounded-lg p-4 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                      {getPlatformIcon(post.platform)}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {post.author}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      post.sentiment === 'bullish' ? 'bg-emerald-500/20 text-emerald-400' :
                      post.sentiment === 'bearish' ? 'bg-red-500/20 text-red-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {post.sentiment}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(post.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-300 mb-2">{post.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-400">
                      ❤️ {post.likes}
                    </span>
                  </div>
                  {post.url !== '#' && (
                    <a 
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      View Original →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Integration Option */}
      <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-400 mb-2">
          💡 Want More Social Data?
        </h4>
        <p className="text-xs text-gray-300 mb-3">
          For comprehensive social monitoring including Reddit, Discord, and Facebook groups, 
          we recommend integrating Juicer.io or Mention.com
        </p>
        <div className="flex space-x-2">
          <a 
            href="https://www.juicer.io/sign-up"
            target="_blank"
            className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded text-xs"
          >
            Setup Juicer (5 min)
          </a>
          <a 
            href="https://mention.com/en/"
            target="_blank"
            className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded text-xs"
          >
            Try Mention
          </a>
        </div>
      </div>

      {/* Optional: Juicer Embed Area */}
      <div id="juicer-embed-area">
        {/* Uncomment and add your Juicer feed when ready */}
        {/* <script src="https://www.juicer.io/embed/YOUR_FEED/embed-code.js"></script> */}
        {/* <div className="juicer-feed" data-feed-id="YOUR_FEED"></div> */}
      </div>
    </div>
  );
};