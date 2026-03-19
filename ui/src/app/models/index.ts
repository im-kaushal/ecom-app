/**
 * Models for Code Review Agent
 */

export interface CodeIssue {
  file: string;
  line: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  message: string;
  suggestion?: string;
}

export interface ReviewResult {
  file: string;
  issues: CodeIssue[];
  status: 'success' | 'error';
  error?: string;
}

export interface CodeMetrics {
  totalIssues: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  qualityScore: number;
}

export interface CodeReport {
  totalIssues: number;
  issueBySeverity: {
    critical: CodeIssue[];
    high: CodeIssue[];
    medium: CodeIssue[];
    low: CodeIssue[];
  };
  metrics: CodeMetrics;
}

export interface ReviewRequest {
  filePath: string;
  fileContent?: string;
  pattern?: string;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
}
