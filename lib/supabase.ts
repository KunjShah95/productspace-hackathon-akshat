import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ApiCredentials {
  id: string;
  user_id: string;
  slack_webhook_url: string | null;
  reddit_client_id: string | null;
  reddit_client_secret: string | null;
  twitter_bearer_token: string | null;
  gemini_api_key: string | null;
  created_at: string;
  updated_at: string;
}
