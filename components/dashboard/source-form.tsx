'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface SourceFormProps {
  onSubmit: (source: {
    name: string;
    type: string;
    url: string;
    keywords: string[];
  }) => void;
}

export function SourceForm({ onSubmit }: SourceFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('social');
  const [url, setUrl] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && url) {
      onSubmit({ name, type, url, keywords });
      setName('');
      setUrl('');
      setKeywords([]);
      setType('social');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Monitoring Source</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Source Name</Label>
              <Input
                id="name"
                placeholder="e.g., Twitter Brand Mentions"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="review">Review Site</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="forum">Forum</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL to Monitor</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/reviews"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (optional)</Label>
            <div className="flex gap-2">
              <Input
                id="keywords"
                placeholder="Add keyword..."
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addKeyword();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addKeyword}>
                Add
              </Button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="pl-2 pr-1">
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Add Source
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
