-- Alert System Database Schema

-- Alert Criteria Table
CREATE TABLE IF NOT EXISTS alert_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  
  -- Filter criteria (JSONB for flexibility)
  strategies TEXT[],
  min_roi DECIMAL(5,2),
  max_roi DECIMAL(5,2),
  min_pop DECIMAL(5,2),
  tickers TEXT[],
  exclude_tickers TEXT[],
  min_volume INTEGER,
  min_open_interest INTEGER,
  min_iv DECIMAL(5,2),
  max_iv DECIMAL(5,2),
  iv_rank_min DECIMAL(5,2),
  iv_rank_max DECIMAL(5,2),
  
  -- Delivery preferences
  email_enabled BOOLEAN DEFAULT true,
  in_app_enabled BOOLEAN DEFAULT true,
  frequency TEXT DEFAULT 'immediate' CHECK (frequency IN ('immediate', 'hourly', 'daily')),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_triggered TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_roi_range CHECK (min_roi IS NULL OR max_roi IS NULL OR min_roi <= max_roi),
  CONSTRAINT valid_iv_range CHECK (min_iv IS NULL OR max_iv IS NULL OR min_iv <= max_iv)
);

-- Alerts Table (triggered alerts)
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  criteria_id UUID NOT NULL REFERENCES alert_criteria(id) ON DELETE CASCADE,
  criteria_name TEXT NOT NULL,
  
  -- Opportunity snapshot
  opportunity JSONB NOT NULL,
  
  -- Status
  triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT false,
  email_sent BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT opportunity_required CHECK (jsonb_typeof(opportunity) = 'object')
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_alert_criteria_user_id ON alert_criteria(user_id);
CREATE INDEX IF NOT EXISTS idx_alert_criteria_enabled ON alert_criteria(enabled) WHERE enabled = true;
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_read ON alerts(read) WHERE read = false;
CREATE INDEX IF NOT EXISTS idx_alerts_triggered_at ON alerts(triggered_at DESC);

-- RLS Policies
ALTER TABLE alert_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own alert criteria
CREATE POLICY "Users can view their own alert criteria"
  ON alert_criteria FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own alert criteria"
  ON alert_criteria FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alert criteria"
  ON alert_criteria FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alert criteria"
  ON alert_criteria FOR DELETE
  USING (auth.uid() = user_id);

-- Users can only see their own alerts
CREATE POLICY "Users can view their own alerts"
  ON alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create alerts"
  ON alerts FOR INSERT
  WITH CHECK (true); -- Allows cron jobs to create alerts

CREATE POLICY "Users can update their own alerts"
  ON alerts FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_alert_criteria_updated_at
  BEFORE UPDATE ON alert_criteria
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
