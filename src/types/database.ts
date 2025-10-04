export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          subscription_tier: string
          daily_screener_runs: number
          subscription_expires_at?: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id: string
          email: string
          subscription_tier?: string
          daily_screener_runs?: number
          subscription_expires_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          subscription_tier?: string
          daily_screener_runs?: number
          subscription_expires_at?: string
          updated_at?: string
        }
      }
      watchlists: {
        Row: {
          id: string
          user_id: string
          symbol: string
          notes?: string
          created_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          symbol: string
          notes?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          symbol?: string
          notes?: string
        }
      }
      trades: {
        Row: {
          id: string
          user_id: string
          symbol: string
          strategy: string
          contracts: number
          entry_price?: number
          exit_price?: number
          strike_price?: number
          expiration_date?: string
          status: string
          profit_loss?: number
          notes?: string
          opened_at?: string
          closed_at?: string
          created_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          symbol: string
          strategy: string
          contracts?: number
          entry_price?: number
          exit_price?: number
          strike_price?: number
          expiration_date?: string
          status?: string
          profit_loss?: number
          notes?: string
          opened_at?: string
          closed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          symbol?: string
          strategy?: string
          contracts?: number
          entry_price?: number
          exit_price?: number
          strike_price?: number
          expiration_date?: string
          status?: string
          profit_loss?: number
          notes?: string
          closed_at?: string
        }
      }
      subscription_tiers: {
        Row: {
          tier: string
          name: string
          price_monthly: number
          price_yearly: number
          features: any
          limits: any
          created_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          user_id: string
          symbol: string
          alert_type: string
          criteria: any
          is_active: boolean
          triggered_at?: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          symbol: string
          alert_type: string
          criteria: any
          is_active?: boolean
          triggered_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          symbol?: string
          alert_type?: string
          criteria?: any
          is_active?: boolean
          triggered_at?: string
          updated_at?: string
        }
      }
      alert_criteria: {
        Row: {
          id: string
          user_id: string
          name: string
          enabled: boolean
          strategies: any
          min_roi: number
          max_roi: number
          min_pop: number
          tickers: any
          exclude_tickers: any
          min_volume: number
          min_open_interest: number
          min_iv: number
          max_iv: number
          min_dte: number
          max_dte: number
          frequency: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          enabled?: boolean
          strategies?: any
          min_roi?: number
          max_roi?: number
          min_pop?: number
          tickers?: any
          exclude_tickers?: any
          min_volume?: number
          min_open_interest?: number
          min_iv?: number
          max_iv?: number
          min_dte?: number
          max_dte?: number
          frequency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          enabled?: boolean
          strategies?: any
          min_roi?: number
          max_roi?: number
          min_pop?: number
          tickers?: any
          exclude_tickers?: any
          min_volume?: number
          min_open_interest?: number
          min_iv?: number
          max_iv?: number
          min_dte?: number
          max_dte?: number
          frequency?: string
          updated_at?: string
        }
      }
    }
  }
} 