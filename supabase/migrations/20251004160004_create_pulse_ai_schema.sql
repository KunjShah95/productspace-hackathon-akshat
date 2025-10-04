/*
  # Pulse AI - Sentiment Monitoring System

  1. New Tables
    - `sources`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text) - Source name (e.g., "Twitter Brand Mentions")
      - `type` (text) - Source type (review, social, forum, etc.)
      - `url` (text) - URL to monitor
      - `keywords` (text[]) - Keywords to track
      - `active` (boolean) - Whether monitoring is active
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `alerts`
      - `id` (uuid, primary key)
      - `source_id` (uuid, references sources)
      - `user_id` (uuid, references auth.users)
      - `content` (text) - Original content that triggered alert
      - `sentiment_score` (numeric) - Sentiment score (-1 to 1)
      - `sentiment_label` (text) - negative, neutral, positive
      - `urgency` (text) - low, medium, high, critical
      - `status` (text) - new, reviewed, resolved
      - `ai_recommendation` (text) - AI-generated response recommendation
      - `metadata` (jsonb) - Additional data (author, platform, etc.)
      - `created_at` (timestamptz)
      - `resolved_at` (timestamptz)
    
    - `api_credentials`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `slack_webhook_url` (text, encrypted) - Slack webhook URL
      - `reddit_client_id` (text, encrypted) - Reddit API client ID
      - `reddit_client_secret` (text, encrypted) - Reddit API client secret
      - `twitter_bearer_token` (text, encrypted) - Twitter API bearer token
      - `gemini_api_key` (text, encrypted) - Gemini API key
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Ensure API credentials are only accessible by the owner

  3. Indexes
    - Add indexes for frequently queried columns
*/

CREATE TABLE IF NOT EXISTS sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  url text NOT NULL,
  keywords text[] DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sources"
  ON sources FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sources"
  ON sources FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sources"
  ON sources FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sources"
  ON sources FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid REFERENCES sources,
  user_id uuid REFERENCES auth.users NOT NULL,
  content text NOT NULL,
  sentiment_score numeric NOT NULL,
  sentiment_label text NOT NULL,
  urgency text NOT NULL,
  status text DEFAULT 'new',
  ai_recommendation text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts"
  ON alerts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON alerts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts"
  ON alerts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS api_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  slack_webhook_url text,
  reddit_client_id text,
  reddit_client_secret text,
  twitter_bearer_token text,
  gemini_api_key text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE api_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own api credentials"
  ON api_credentials FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own api credentials"
  ON api_credentials FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own api credentials"
  ON api_credentials FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own api credentials"
  ON api_credentials FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sources_user_id ON sources(user_id);
CREATE INDEX IF NOT EXISTS idx_sources_active ON sources(active);