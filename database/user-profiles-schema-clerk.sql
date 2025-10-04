-- User Profiles for AI Recommendations (CLERK-COMPATIBLE VERSION)
-- Updated to work with Clerk authentication instead of Supabase auth

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE, -- Changed from UUID to TEXT for Clerk user IDs (e.g., "user_abc123")
  
  -- Trading Preferences (from onboarding)
  preferred_strategies TEXT[] DEFAULT ARRAY['wheel', 'covered_call'],
  risk_tolerance TEXT DEFAULT 'moderate' CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive')),
  target_monthly_return DECIMAL(5,2) DEFAULT 3.0,
  preferred_dte_min INTEGER DEFAULT 21,
  preferred_dte_max INTEGER DEFAULT 45,
  max_position_size DECIMAL(12,2) DEFAULT 50000,
  
  -- Learned Preferences
  favorite_tickers TEXT[] DEFAULT ARRAY[]::TEXT[],
  dismissed_tickers TEXT[] DEFAULT ARRAY[]::TEXT[],
  average_delta DECIMAL(4,3),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_trade_at TIMESTAMP WITH TIME ZONE,
  
  -- Stats
  total_trades INTEGER DEFAULT 0,
  successful_trades INTEGER DEFAULT 0,
  total_pnl DECIMAL(12,2) DEFAULT 0
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_risk_tolerance ON user_profiles(risk_tolerance);

-- RLS Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- IMPORTANT: These policies assume you've configured Supabase to accept Clerk JWTs
-- The JWT should include the user_id claim from Clerk

CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Auto-update updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- NOTE: We don't create the auto-profile trigger since Clerk handles user creation
-- You'll need to create profiles manually when users complete onboarding

-- CLERK + SUPABASE INTEGRATION SETUP:
-- 
-- 1. In Clerk Dashboard:
--    - Go to JWT Templates
--    - Create a new template called "supabase"
--    - Add custom claim: "sub" = "{{user.id}}"
--    - Copy the JWKS URL
--
-- 2. In Supabase Dashboard:
--    - Go to Authentication > Settings
--    - Under "JWT Settings", add Clerk's JWKS URL
--    - Enable "Use custom JWT"
--
-- 3. When making Supabase requests from your app:
--    - Get Clerk session token: await getToken({ template: 'supabase' })
--    - Pass it to Supabase client
--
-- Example code:
-- ```typescript
-- import { useAuth } from '@clerk/nextjs'
-- import { createClient } from '@supabase/supabase-js'
-- 
-- const { getToken } = useAuth()
-- const supabaseToken = await getToken({ template: 'supabase' })
-- 
-- const supabase = createClient(
--   process.env.NEXT_PUBLIC_SUPABASE_URL!,
--   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
--   {
--     global: {
--       headers: {
--         Authorization: `Bearer ${supabaseToken}`
--       }
--     }
--   }
-- )
-- ```
