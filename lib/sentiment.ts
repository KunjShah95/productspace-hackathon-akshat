export interface SentimentAnalysis {
  score: number;
  label: 'positive' | 'neutral' | 'negative';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}

export function analyzeSentiment(text: string): SentimentAnalysis {
  const lowerText = text.toLowerCase();

  const negativeWords = ['hate', 'terrible', 'awful', 'worst', 'horrible', 'disappointed', 'frustrated', 'angry', 'useless', 'broken', 'failed', 'poor', 'bad'];
  const positiveWords = ['love', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'perfect', 'best', 'awesome', 'outstanding'];
  const urgentWords = ['immediately', 'urgent', 'critical', 'emergency', 'asap', 'serious', 'major'];

  let score = 0;
  let negativeCount = 0;
  let positiveCount = 0;
  let urgentCount = 0;

  negativeWords.forEach(word => {
    const count = (lowerText.match(new RegExp(word, 'g')) || []).length;
    negativeCount += count;
    score -= count * 0.3;
  });

  positiveWords.forEach(word => {
    const count = (lowerText.match(new RegExp(word, 'g')) || []).length;
    positiveCount += count;
    score += count * 0.3;
  });

  urgentWords.forEach(word => {
    if (lowerText.includes(word)) urgentCount++;
  });

  score = Math.max(-1, Math.min(1, score));

  let label: 'positive' | 'neutral' | 'negative';
  if (score < -0.2) label = 'negative';
  else if (score > 0.2) label = 'positive';
  else label = 'neutral';

  let urgency: 'low' | 'medium' | 'high' | 'critical';
  if (label === 'negative') {
    if (urgentCount > 0 || score < -0.7) urgency = 'critical';
    else if (score < -0.5) urgency = 'high';
    else urgency = 'medium';
  } else {
    urgency = 'low';
  }

  const recommendation = generateRecommendation(label, urgency, negativeCount, text);

  return { score, label, urgency, recommendation };
}

function generateRecommendation(
  label: 'positive' | 'neutral' | 'negative',
  urgency: 'low' | 'medium' | 'high' | 'critical',
  negativeCount: number,
  text: string
): string {
  if (label === 'positive') {
    return "Great feedback! Consider thanking the user and encouraging them to share their experience.";
  }

  if (label === 'neutral') {
    return "Monitor this feedback. Follow up to understand their experience better.";
  }

  if (urgency === 'critical') {
    return "🚨 URGENT: Respond immediately. Acknowledge the issue, apologize sincerely, and offer a direct contact (phone/email) for immediate resolution. Escalate to senior management.";
  }

  if (urgency === 'high') {
    return "⚠️ HIGH PRIORITY: Respond within 1 hour. Show empathy, acknowledge the specific concern, and provide a clear action plan with timeline.";
  }

  return "Address within 24 hours. Acknowledge the concern, investigate the issue, and provide a helpful response with next steps.";
}
