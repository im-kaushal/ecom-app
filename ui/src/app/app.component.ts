import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
export class AppComponent implements OnInit {
  issues: CodeIssue[] = [];
  metrics: CodeMetrics | null = null;
  isLoading = false;
  error: string | null = null;
  selectedSeverity: string = 'all';
  optimizedCode: string = '';
  copied = false;
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

  constructor(private codeReviewService: CodeReviewService) {}

  ngOnInit(): void {
    this.subscribeToService();
  }

  private subscribeToService(): void {
    this.codeReviewService.getReviewResults().subscribe((issues: CodeIssue[]) => {
      this.issues = this.filterIssuesBySeverity(issues);
    });

    this.codeReviewService.getMetrics().subscribe((metrics: CodeMetrics | null) => {
      this.metrics = metrics;
    });

    this.codeReviewService.getLoadingState().subscribe((loading: boolean) => {
      this.isLoading = loading;
    });

    this.codeReviewService.getError().subscribe((error: string | null) => {
      this.error = error;
    });
  }

  onReview(code: string): void {
    this.codeReviewService.reviewCode(code, 'code.js').subscribe({
      next: (result: any) => {
        console.log('Review completed:', result);
        // Generate optimized code after review
        this.optimizedCode = this.generateOptimizedCode(code, this.issues);
      },
      error: (err: any) => {
        console.error('Review error:', err);
      }
    });
  }

  onSeverityChange(severity: string): void {
    this.selectedSeverity = severity;
    this.codeReviewService.getReviewResults().subscribe((issues: CodeIssue[]) => {
      this.issues = this.filterIssuesBySeverity(issues);
    });
  }

  private filterIssuesBySeverity(issues: CodeIssue[]): CodeIssue[] {
    if (this.selectedSeverity === 'all') {
      return issues;
    }
    return issues.filter(issue => issue.severity === this.selectedSeverity);
  }

  clearReview(): void {
    this.codeReviewService.clearResults();
    this.codeContent = '';
    this.optimizedCode = '';
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
}
