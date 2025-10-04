'use client';

import { useState, useEffect } from 'react';
import { Alert } from '@/lib/types';
import { analyzeSentiment } from '@/lib/sentiment';
import { StatsCard } from '@/components/dashboard/stats-card';
import { AlertCard } from '@/components/dashboard/alert-card';
import { AlertDialogDetail } from '@/components/dashboard/alert-dialog-detail';
import { SourceForm } from '@/components/dashboard/source-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TriangleAlert as AlertTriangle, TrendingUp, Clock, CircleCheck as CheckCircle, Bell, Settings, Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'reviewed' | 'resolved'>('all');
  const [showAddSource, setShowAddSource] = useState(false);

  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: '1',
        source_id: 'src-1',
        user_id: 'user-1',
        content: 'This is absolutely terrible! Your customer service is the worst I have ever experienced. I need this fixed immediately or I want a full refund. This is unacceptable!',
        sentiment_score: -0.85,
        sentiment_label: 'negative',
        urgency: 'critical',
        status: 'new',
        ai_recommendation: '🚨 URGENT: Respond immediately. Acknowledge the issue, apologize sincerely, and offer a direct contact (phone/email) for immediate resolution. Escalate to senior management.',
        metadata: {
          author: 'John Smith',
          platform: 'Twitter',
          url: 'https://twitter.com/example',
        },
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        resolved_at: null,
      },
      {
        id: '2',
        source_id: 'src-2',
        user_id: 'user-1',
        content: 'Really disappointed with the recent update. The app keeps crashing and I lost all my data. Not happy at all.',
        sentiment_score: -0.65,
        sentiment_label: 'negative',
        urgency: 'high',
        status: 'new',
        ai_recommendation: '⚠️ HIGH PRIORITY: Respond within 1 hour. Show empathy, acknowledge the specific concern, and provide a clear action plan with timeline.',
        metadata: {
          author: 'Sarah Johnson',
          platform: 'App Store',
          url: 'https://apps.apple.com/review/123',
        },
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        resolved_at: null,
      },
      {
        id: '3',
        source_id: 'src-1',
        user_id: 'user-1',
        content: 'The service is okay but could be better. Encountered a few issues but nothing major.',
        sentiment_score: -0.15,
        sentiment_label: 'neutral',
        urgency: 'low',
        status: 'reviewed',
        ai_recommendation: 'Monitor this feedback. Follow up to understand their experience better.',
        metadata: {
          author: 'Mike Chen',
          platform: 'Reddit',
          url: 'https://reddit.com/r/example',
        },
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        resolved_at: null,
      },
      {
        id: '4',
        source_id: 'src-3',
        user_id: 'user-1',
        content: 'Love the new features! This is exactly what I needed. Great job team!',
        sentiment_score: 0.75,
        sentiment_label: 'positive',
        urgency: 'low',
        status: 'resolved',
        ai_recommendation: 'Great feedback! Consider thanking the user and encouraging them to share their experience.',
        metadata: {
          author: 'Emily Davis',
          platform: 'Google Reviews',
          url: 'https://google.com/review/456',
        },
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        resolved_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      },
    ];

    setAlerts(mockAlerts);
  }, []);

  const handleResolve = (id: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === id
        ? { ...alert, status: 'resolved' as const, resolved_at: new Date().toISOString() }
        : alert
    ));
  };

  const handleViewAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setDialogOpen(true);
  };

  const handleAddSource = (source: any) => {
    console.log('Adding source:', source);
    setShowAddSource(false);
  };

  const handleSimulateAlert = () => {
    const sampleTexts = [
      'Your product is broken and I want my money back NOW!',
      'Pretty good experience overall, would recommend.',
      'The worst service ever. I am so frustrated and angry!',
      'Not bad, could use some improvements.',
    ];

    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    const analysis = analyzeSentiment(randomText);

    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      source_id: 'src-demo',
      user_id: 'user-1',
      content: randomText,
      sentiment_score: analysis.score,
      sentiment_label: analysis.label,
      urgency: analysis.urgency,
      status: 'new',
      ai_recommendation: analysis.recommendation,
      metadata: {
        author: 'Demo User',
        platform: 'Demo Platform',
      },
      created_at: new Date().toISOString(),
      resolved_at: null,
    };

    setAlerts([newAlert, ...alerts]);
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = searchQuery === '' ||
      alert.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.metadata.author?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: alerts.length,
    critical: alerts.filter(a => a.urgency === 'critical' && a.status !== 'resolved').length,
    unresolved: alerts.filter(a => a.status !== 'resolved').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Pulse AI
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Intelligent Sentiment Monitoring & Alert System
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/settings">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Button size="sm" onClick={() => setShowAddSource(!showAddSource)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Source
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {showAddSource && (
          <div className="mb-6">
            <SourceForm onSubmit={handleAddSource} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Alerts"
            value={stats.total}
            icon={Bell}
            description="All time"
          />
          <StatsCard
            title="Critical"
            value={stats.critical}
            icon={AlertTriangle}
            description="Requires immediate attention"
          />
          <StatsCard
            title="Unresolved"
            value={stats.unresolved}
            icon={Clock}
            description="Pending action"
          />
          <StatsCard
            title="Resolved"
            value={stats.resolved}
            icon={CheckCircle}
            description="Successfully handled"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Live Alerts</h2>
            <Button onClick={handleSimulateAlert} variant="outline" size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Simulate Alert
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-600 mb-1">No alerts found</h3>
              <p className="text-sm text-gray-500">
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : 'All caught up! No alerts to display.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onResolve={handleResolve}
                  onView={handleViewAlert}
                />
              ))}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 p-6">
          <h3 className="font-semibold text-blue-900 mb-2">How Pulse AI Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div>
              <div className="font-medium mb-1">1. Monitor Sources</div>
              <p className="text-blue-700">
                Connect review sites, social media, and forums to track mentions and feedback.
              </p>
            </div>
            <div>
              <div className="font-medium mb-1">2. AI Analysis</div>
              <p className="text-blue-700">
                Advanced sentiment analysis detects negative feedback and assigns urgency levels.
              </p>
            </div>
            <div>
              <div className="font-medium mb-1">3. Smart Alerts</div>
              <p className="text-blue-700">
                Get instant notifications with AI-powered response recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AlertDialogDetail
        alert={selectedAlert}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onResolve={handleResolve}
      />
    </div>
  );
}
