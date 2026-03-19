import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeIssue } from '../../models';

@Component({
  selector: 'app-issues-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class IssuesListComponent {
  @Input() issues: CodeIssue[] = [];
  @Input() isLoading = false;
  @Input() error: string | null = null;
  expandedIssueId: number | null = null;

  getSeverityClass(severity: string): string {
    return `severity-${severity}`;
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

  toggleExpand(id: number): void {
    this.expandedIssueId = this.expandedIssueId === id ? null : id;
  }

  isExpanded(id: number): boolean {
    return this.expandedIssueId === id;
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard');
    });
  }
}
