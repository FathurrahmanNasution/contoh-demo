export type SummaryMode = 'Quick Bullet Points' | 'Technical Deep Dive' | 'Action Items Only';

export interface SummaryResult {
  mode: SummaryMode;
  content: string;
  timeSaved: string;
}
