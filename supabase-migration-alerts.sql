-- ALERT SYSTEM TABLES
-- Run this in Supabase SQL Editor

-- 1. Alert Criteria Table (User's custom alert rules)
CREATE TABLE IF NOT EXISTS alert_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  
  -- Filter criteria
  min_roi NUMERIC,
  max_dte INTEGER,
  min_volume INTEGER,
  strategies TEXT[], -- Array of strategy names
  tickers TEXT[], -- Array of ticker symbols (empty = all)
  min_pop NUMERIC,
  max_risk_score INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Alerts Table (Triggered alerts for users)
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  criteria_id UUID REFERENCES alert_criteria(id) ON DELETE CASCADE,
  criteria_name TEXT NOT NULL,
  
  -- Opportunity details
  ticker TEXT NOT NULL,
  strategy TEXT NOT NULL,
  roi NUMERIC NOT NULL,
  dte INTEGER NOT NULL,
  strike NUMERIC NOT NULL,
  premium NUMERIC NOT NULL,
  pop NUMERIC DEFAULT 0,
  
  -- Alert status
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  viewed BOOLEAN DEFAULT false,
  dismissed BOOLEAN DEFAULT false
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_alert_criteria_user_id ON alert_criteria(user_id);
CREATE INDEX IF NOT EXISTS idx_alert_criteria_enabled ON alert_criteria(enabled);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_viewed ON alerts(viewed);
CREATE INDEX IF NOT EXISTS idx_alerts_dismissed ON alerts(dismissed);
CREATE INDEX IF NOT EXISTS idx_alerts_triggered_at ON alerts(triggered_at DESC);

-- Enable Row Level Security
ALTER TABLE alert_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for alert_criteria
CREATE POLICY "Users can view own criteria"
  ON alert_criteria FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own criteria"
  ON alert_criteria FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own criteria"
  ON alert_criteria FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own criteria"
  ON alert_criteria FOR DELETE
  USING (auth.uid()::text = user_id);

-- RLS Policies for alerts
CREATE POLICY "Users can view own alerts"
  ON alerts FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "System can insert alerts"
  ON alerts FOR INSERT
  WITH CHECK (true); -- Allow system to create alerts

CREATE POLICY "Users can update own alerts"
  ON alerts FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for alert_criteria
CREATE TRIGGER update_alert_criteria_updated_at
  BEFORE UPDATE ON alert_criteria
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON alert_criteria TO authenticated;
GRANT ALL ON alerts TO authenticated;
GRANT ALL ON alert_criteria TO anon;
GRANT ALL ON alerts TO anon;
