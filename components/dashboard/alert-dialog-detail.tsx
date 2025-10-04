'use client';

import { Alert } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, CircleCheck as CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface AlertDialogDetailProps {
  alert: Alert | null;
  open: boolean;
  onClose: () => void;
  onResolve: (id: string) => void;
}

export function AlertDialogDetail({ alert, open, onClose, onResolve }: AlertDialogDetailProps) {
  const [copied, setCopied] = useState(false);

  if (!alert) return null;

  const urgencyColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(alert.ai_recommendation || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={urgencyColors[alert.urgency]}>
              {alert.urgency.toUpperCase()}
            </Badge>
            <Badge variant="secondary">{alert.sentiment_label}</Badge>
            <Badge variant="outline">{alert.status}</Badge>
          </div>
          <DialogTitle>Alert Details</DialogTitle>
          <DialogDescription>
            {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <h4 className="text-sm font-semibold mb-1">Source Information</h4>
            <div className="bg-gray-50 rounded-md p-3 text-sm space-y-1">
              {alert.metadata.platform && (
                <p><span className="font-medium">Platform:</span> {alert.metadata.platform}</p>
              )}
              {alert.metadata.author && (
                <p><span className="font-medium">Author:</span> {alert.metadata.author}</p>
              )}
              {alert.metadata.url && (
                <p className="flex items-center gap-1">
                  <span className="font-medium">URL:</span>
                  <a
                    href={alert.metadata.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    View Source <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-1">Content</h4>
            <div className="bg-gray-50 rounded-md p-3 text-sm">
              <p className="whitespace-pre-wrap">{alert.content}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-1">Sentiment Analysis</h4>
            <div className="bg-gray-50 rounded-md p-3 text-sm">
              <p>
                <span className="font-medium">Score:</span>{' '}
                {alert.sentiment_score.toFixed(2)} ({alert.sentiment_label})
              </p>
            </div>
          </div>

          {alert.ai_recommendation && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold">AI Recommendation</h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopy}
                  className="h-7"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm">
                <p className="whitespace-pre-wrap text-blue-900">{alert.ai_recommendation}</p>
              </div>
            </div>
          )}

          {alert.status !== 'resolved' && (
            <Button
              onClick={() => {
                onResolve(alert.id);
                onClose();
              }}
              className="w-full"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark as Resolved
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
