'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase, ApiCredentials } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader as Loader2, Save, Key, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ApiIntegrations() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [credentials, setCredentials] = useState({
    slack_webhook_url: '',
    reddit_client_id: '',
    reddit_client_secret: '',
    twitter_bearer_token: '',
    gemini_api_key: '',
  });

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: 'Not authenticated',
          description: 'Please sign in to manage API integrations.',
          variant: 'destructive',
        });
        return;
      }

      const { data, error } = await supabase
        .from('api_credentials')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCredentials({
          slack_webhook_url: data.slack_webhook_url || '',
          reddit_client_id: data.reddit_client_id || '',
          reddit_client_secret: data.reddit_client_secret || '',
          twitter_bearer_token: data.twitter_bearer_token || '',
          gemini_api_key: data.gemini_api_key || '',
        });
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
      toast({
        title: 'Error',
        description: 'Failed to load API credentials.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: 'Not authenticated',
          description: 'Please sign in to save API integrations.',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('api_credentials')
        .upsert({
          user_id: user.id,
          ...credentials,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'API credentials saved successfully.',
      });
    } catch (error) {
      console.error('Error saving credentials:', error);
      toast({
        title: 'Error',
        description: 'Failed to save API credentials.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert>
        <Key className="h-4 w-4" />
        <AlertDescription>
          Your API keys are securely stored and encrypted. They are only accessible by you and used to connect with external services.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Slack Integration</CardTitle>
          <CardDescription>
            Receive real-time alerts in your Slack workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slack_webhook">Webhook URL</Label>
            <Input
              id="slack_webhook"
              type="password"
              placeholder="https://hooks.slack.com/services/..."
              value={credentials.slack_webhook_url}
              onChange={(e) => setCredentials({ ...credentials, slack_webhook_url: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              <a
                href="https://api.slack.com/messaging/webhooks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                Learn how to create a webhook <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reddit Integration</CardTitle>
          <CardDescription>
            Monitor Reddit posts and comments for brand mentions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reddit_client_id">Client ID</Label>
            <Input
              id="reddit_client_id"
              type="password"
              placeholder="Enter Reddit client ID"
              value={credentials.reddit_client_id}
              onChange={(e) => setCredentials({ ...credentials, reddit_client_id: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reddit_client_secret">Client Secret</Label>
            <Input
              id="reddit_client_secret"
              type="password"
              placeholder="Enter Reddit client secret"
              value={credentials.reddit_client_secret}
              onChange={(e) => setCredentials({ ...credentials, reddit_client_secret: e.target.value })}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            <a
              href="https://www.reddit.com/prefs/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              Create a Reddit app <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Twitter Integration</CardTitle>
          <CardDescription>
            Track tweets and mentions about your brand
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="twitter_bearer">Bearer Token</Label>
            <Input
              id="twitter_bearer"
              type="password"
              placeholder="Enter Twitter bearer token"
              value={credentials.twitter_bearer_token}
              onChange={(e) => setCredentials({ ...credentials, twitter_bearer_token: e.target.value })}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            <a
              href="https://developer.twitter.com/en/portal/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              Get Twitter API access <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gemini AI Integration</CardTitle>
          <CardDescription>
            Enhanced sentiment analysis and response recommendations powered by Google Gemini
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gemini_api_key">API Key</Label>
            <Input
              id="gemini_api_key"
              type="password"
              placeholder="Enter Gemini API key"
              value={credentials.gemini_api_key}
              onChange={(e) => setCredentials({ ...credentials, gemini_api_key: e.target.value })}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              Get a Gemini API key <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save All Credentials
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
