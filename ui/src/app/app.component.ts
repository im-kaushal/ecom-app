import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CodeIssue, CodeMetrics } from './models';
import { CodeReviewService } from './services/code-review.service';
import { EditorComponent } from './components/editor/editor.component';
import { IssuesListComponent } from './components/issues-list/issues-list.component';
import { MetricsComponent } from './components/metrics/metrics.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EditorComponent,
    IssuesListComponent,
    MetricsComponent
  ],
  providers: [CodeReviewService]
})
export class AppComponent implements OnInit, OnDestroy {
  issues: CodeIssue[] = [];
  allIssues: CodeIssue[] = [];
  metrics: CodeMetrics | null = null;
  isLoading = false;
  error: string | null = null;
  selectedSeverity: string = 'all';
  optimizedCode: string = '';
  copied = false;
  lastReviewedCode: string = '';
  codeContent = `// Example JavaScript Code
function calculatePrice(quantity, unitPrice) {
  console.log('Calculating...');
  const total_amount = quantity * unitPrice;
  
  if (quantity > 10) {
    if (unitPrice < 100) {
      if (total_amount > 1000) {
        console.warn('High total');
      }
    }
  }
  
  return total_amount;
}`;

  private destroy$ = new Subject<void>();

  constructor(private codeReviewService: CodeReviewService) {}

  ngOnInit(): void {
    this.subscribeToService();
  }

  private subscribeToService(): void {
    this.codeReviewService.getReviewResults()
      .pipe(takeUntil(this.destroy$))
      .subscribe((issues: CodeIssue[]) => {
        this.allIssues = issues;
        this.issues = this.filterIssuesBySeverity(issues);
        // Generate optimized code when issues are updated
        if (this.lastReviewedCode && issues.length > 0) {
          const optimized = this.generateOptimizedCode(this.lastReviewedCode, issues);
          if (optimized !== this.lastReviewedCode.trim()) {
            this.optimizedCode = optimized;
          } else {
            this.optimizedCode = '';
          }
        } else {
          this.optimizedCode = '';
        }
      });

    this.codeReviewService.getMetrics()
      .pipe(takeUntil(this.destroy$))
      .subscribe((metrics: CodeMetrics | null) => {
        this.metrics = metrics;
      });

    this.codeReviewService.getLoadingState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading: boolean) => {
        this.isLoading = loading;
      });

    this.codeReviewService.getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: string | null) => {
        this.error = error;
      });
  }

  onReview(code: string): void {
    this.lastReviewedCode = code;
    this.codeReviewService.reviewCode(code, 'code.js').subscribe({
      next: (result: any) => {
        console.log('Review completed:', result);
        // Optimized code will be generated when issues are updated via subscription
      },
      error: (err: any) => {
        console.error('Review error:', err);
      }
    });
  }

  onSeverityChange(severity: string): void {
    this.selectedSeverity = severity;
    this.issues = this.filterIssuesBySeverity(this.allIssues);
  }

  private filterIssuesBySeverity(allIssues: CodeIssue[]): CodeIssue[] {
    if (this.selectedSeverity === 'all') {
      return allIssues;
    }
    return allIssues.filter(issue => issue.severity === this.selectedSeverity);
  }

  clearReview(): void {
    this.codeReviewService.clearResults();
    this.codeContent = '';
    this.optimizedCode = '';
    this.lastReviewedCode = '';
  }

  copyOptimizedCode(): void {
    navigator.clipboard.writeText(this.optimizedCode).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    });
  }

  private generateOptimizedCode(originalCode: string, issues: CodeIssue[]): string {
    let optimized = originalCode;

    // Apply optimizations based on detected issues
    const hasConsoleIssues = issues.some(issue => issue.type === 'Console Statement');
    const hasNamingIssues = issues.some(issue => issue.type === 'Naming Convention');
    const hasErrorHandlingIssues = issues.some(issue => issue.type === 'Missing Error Handling');

    // Remove console statements if console issues were detected
    if (hasConsoleIssues) {
      optimized = optimized.replace(/console\.(log|warn|error|debug|info)\s*\([^)]*\);?\s*/g, '');
    }

    // Convert snake_case to camelCase if naming issues were detected
    if (hasNamingIssues) {
      const snakeCaseMatches = optimized.match(/(?:const|let|var)\s+([a-z]+_[a-z_\d]+)\s*=/g);
      if (snakeCaseMatches) {
        snakeCaseMatches.forEach(match => {
          const varName = match.match(/([a-z]+_[a-z_\d]+)/)?.[1];
          if (varName) {
            const camelCase = varName.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            optimized = optimized.replace(new RegExp(`\\b${varName}\\b`, 'g'), camelCase);
          }
        });
      }
    }

    // Add error handling to async functions if error handling issues were detected
    if (hasErrorHandlingIssues) {
      const asyncFunctions = optimized.match(/async\s+function\s+\w+\s*\([^)]*\)\s*{[^}]*}/g);
      if (asyncFunctions) {
        asyncFunctions.forEach(func => {
          if (!func.includes('try') && func.includes('await')) {
            const wrapped = func.replace(/{([^}]*)}/, (_, body) => {
              return `{\n  try {\n    ${body.trim()}\n  } catch (error) {\n    console.error('Error:', error);\n    throw error;\n  }\n}`;
            });
            optimized = optimized.replace(func, wrapped);
          }
        });
      }
    }

    // Clean up extra whitespace and empty lines
    optimized = optimized.replace(/\n\s*\n\s*\n/g, '\n\n');
    optimized = optimized.trim();

    return optimized;
  }

  getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'critical':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      case 'low':
        return '🔵';
      default:
        return '⭕';
    }
  }

  getCriticalCount(): number {
    return this.allIssues.filter(issue => issue.severity === 'critical').length;
  }

  getHighCount(): number {
    return this.allIssues.filter(issue => issue.severity === 'high').length;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
