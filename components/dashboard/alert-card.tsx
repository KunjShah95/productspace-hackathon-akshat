'use client';

import { Alert } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CircleCheck as CheckCircle2, ExternalLink, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AlertCardProps {
  alert: Alert;
  onResolve: (id: string) => void;
  onView: (alert: Alert) => void;
}

export function AlertCard({ alert, onResolve, onView }: AlertCardProps) {
  const urgencyColors = {
    low: 'bg-blue-100 text-blue-800 border-blue-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    critical: 'bg-red-100 text-red-800 border-red-200',
  };

  const sentimentColors = {
    positive: 'text-green-600',
    neutral: 'text-gray-600',
    negative: 'text-red-600',
  };

  return (
    <Card className={`border-l-4 ${urgencyColors[alert.urgency]}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className={urgencyColors[alert.urgency]}>
                {alert.urgency.toUpperCase()}
              </Badge>
              <Badge variant="secondary" className={sentimentColors[alert.sentiment_label]}>
                {alert.sentiment_label}
              </Badge>
              <Badge variant="outline">{alert.status}</Badge>
            </div>
            <CardTitle className="text-sm font-medium mt-2">
              {alert.metadata.platform && `${alert.metadata.platform} • `}
              {alert.metadata.author || 'Anonymous'}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 mb-3 line-clamp-3">{alert.content}</p>

        {alert.ai_recommendation && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
            <p className="text-xs font-semibold text-blue-900 mb-1">AI Recommendation</p>
            <p className="text-xs text-blue-800">{alert.ai_recommendation}</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(alert)}
            className="flex-1"
          >
            View Details
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
          {alert.status !== 'resolved' && (
            <Button
              size="sm"
              onClick={() => onResolve(alert.id)}
              className="flex-1"
            >
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Resolve
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
