export interface Source {
  id: string;
  user_id: string;
  name: string;
  type: 'review' | 'social' | 'forum' | 'other';
  url: string;
  keywords: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  source_id: string;
  user_id: string;
  content: string;
  sentiment_score: number;
  sentiment_label: 'positive' | 'neutral' | 'negative';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'reviewed' | 'resolved';
  ai_recommendation: string | null;
  metadata: {
    author?: string;
    platform?: string;
    url?: string;
    [key: string]: any;
  };
  created_at: string;
  resolved_at: string | null;
}

export interface NotificationSettings {
  id: string;
  user_id: string;
  email_enabled: boolean;
  email_address: string | null;
  slack_enabled: boolean;
  slack_webhook_url: string | null;
  urgency_threshold: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
}
