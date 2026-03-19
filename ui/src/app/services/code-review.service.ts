import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CodeIssue, CodeMetrics, Rule } from '../models';

/**
 * Service to communicate with the Code Review Agent
 */
@Injectable({
  providedIn: 'root'
})
export class CodeReviewService {
  private reviewResults$: BehaviorSubject<CodeIssue[]> = new BehaviorSubject<CodeIssue[]>([]);
  private metrics$: BehaviorSubject<CodeMetrics | null> = new BehaviorSubject<CodeMetrics | null>(null);
  private isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private error$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  private mockRules: Rule[] = [
    {
      id: 'no-console',
      name: 'Console Statements',
      description: 'Detects console.log, console.warn, etc. statements'
    },
    {
      id: 'no-unused-vars',
      name: 'Unused Variables',
      description: 'Finds declared but unused variables'
    },
    {
      id: 'high-complexity',
      name: 'Function Complexity',
      description: 'Identifies complex functions with high cyclomatic complexity'
    },
    {
      id: 'naming-convention',
      name: 'Naming Conventions',
      description: 'Checks for proper camelCase variable names'
    },
    {
      id: 'missing-error-handling',
      name: 'Error Handling',
      description: 'Detects async/await without try-catch blocks'
    },
    {
      id: 'comment-quality',
      name: 'Comments',
      description: 'Ensures proper JSDoc documentation'
    }
  ];

  constructor() {}

  /**
   * Get review results as observable
   */
  getReviewResults(): Observable<CodeIssue[]> {
    return this.reviewResults$.asObservable();
  }

  /**
   * Get metrics as observable
   */
  getMetrics(): Observable<CodeMetrics | null> {
    return this.metrics$.asObservable();
  }

  /**
   * Get loading state as observable
   */
  getLoadingState(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  /**
   * Get error state as observable
   */
  getError(): Observable<string | null> {
    return this.error$.asObservable();
  }

  /**
   * Review JavaScript code content
   */
  reviewCode(content: string, filePath: string = 'code.js'): Observable<{
    issues: CodeIssue[];
    metrics: CodeMetrics;
  }> {
    this.isLoading$.next(true);
    this.error$.next(null);

    // Simulate async operation
    return new Observable(observer => {
      setTimeout(() => {
        try {
          const issues = this.analyzeCode(content, filePath);
          const metrics = this.calculateMetrics(issues);

          this.reviewResults$.next(issues);
          this.metrics$.next(metrics);
          this.isLoading$.next(false);

          observer.next({ issues, metrics });
          observer.complete();
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          this.error$.next(errorMsg);
          this.isLoading$.next(false);
          observer.error(error);
        }
      }, 500);
    });
  }

  /**
   * Analyze code for issues
   */
  private analyzeCode(content: string, filePath: string): CodeIssue[] {
    const issues: CodeIssue[] = [];
    const lines = content.split('\n');

    // Check for console statements
    const consolePattern = /console\.(log|warn|error|debug|info)\s*\(/g;
    let match;
    while ((match = consolePattern.exec(content)) !== null) {
      const lineNum = content.substring(0, match.index).split('\n').length;
      issues.push({
        file: filePath,
        line: lineNum,
        severity: 'low',
        type: 'Console Statement',
        message: `Remove console.${match[1]}() statement before production`,
        suggestion: 'Use a logging library instead'
      });
    }

    // Check for unused variables
    const varPattern = /(?:const|let|var)\s+(\w+)\s*=/gm;
    while ((match = varPattern.exec(content)) !== null) {
      const varName = match[1];
      const lineNum = content.substring(0, match.index).split('\n').length;
      const usagePattern = new RegExp(`\\b${varName}\\b`, 'g');
      const usages = (content.match(usagePattern) || []).length;

      if (usages === 1) {
        issues.push({
          file: filePath,
          line: lineNum,
          severity: 'medium',
          type: 'Unused Variable',
          message: `Variable '${varName}' is declared but never used`,
          suggestion: 'Remove the variable or use it in your code'
        });
      }
    }

    // Check for snake_case
    const snakeCasePattern = /(?:const|let|var)\s+([a-z]+_[a-z_\d]+)\s*=/gm;
    while ((match = snakeCasePattern.exec(content)) !== null) {
      const varName = match[1];
      const lineNum = content.substring(0, match.index).split('\n').length;

      issues.push({
        file: filePath,
        line: lineNum,
        severity: 'low',
        type: 'Naming Convention',
        message: `Variable '${varName}' uses snake_case instead of camelCase`,
        suggestion: `Rename to: ${this.snakeToCamel(varName)}`
      });
    }

    // Check for missing error handling
    lines.forEach((line, idx) => {
      if (line.includes('await') && !this.hasErrorHandling(lines, idx)) {
        issues.push({
          file: filePath,
          line: idx + 1,
          severity: 'high',
          type: 'Missing Error Handling',
          message: 'await expression without error handling',
          suggestion: 'Wrap await in try-catch block'
        });
      }
    });

    return issues;
  }

  /**
   * Calculate metrics
   */
  private calculateMetrics(issues: CodeIssue[]): CodeMetrics {
    return {
      totalIssues: issues.length,
      criticalIssues: issues.filter(i => i.severity === 'critical').length,
      highIssues: issues.filter(i => i.severity === 'high').length,
      mediumIssues: issues.filter(i => i.severity === 'medium').length,
      lowIssues: issues.filter(i => i.severity === 'low').length,
      qualityScore: Math.max(0, 100 - (issues.length * 5))
    };
  }

  /**
   * Helper: Check if error handling exists
   */
  private hasErrorHandling(lines: string[], idx: number): boolean {
    const context = lines
      .slice(Math.max(0, idx - 5), Math.min(lines.length, idx + 5))
      .join('\n');
    return context.includes('try') && context.includes('catch');
  }

  /**
   * Helper: Convert snake_case to camelCase
   */
  private snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * Get available rules
   */
  getRules(): Observable<Rule[]> {
    return of(this.mockRules);
  }

  /**
   * Clear results
   */
  clearResults(): void {
    this.reviewResults$.next([]);
    this.metrics$.next(null);
    this.error$.next(null);
  }
}
