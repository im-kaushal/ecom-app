/**
 * Report Formatter
 * Formats code review results in different output formats
 */

import chalk from 'chalk';

export class ReportFormatter {
  /**
   * Print report to console
   */
  printReport(report, format = 'table') {
    switch (format) {
      case 'json':
        console.log(JSON.stringify(report, null, 2));
        break;
      case 'html':
        console.log(this.formatReportAsHTML(report));
        break;
      case 'table':
      default:
        this.formatReportAsTable(report);
        break;
    }
  }

  /**
   * Format report as table (console output)
   */
  formatReportAsTable(report) {
    console.log(chalk.blue.bold('\n═════════════════════════════════════════'));
    console.log(chalk.blue.bold('          CODE REVIEW REPORT'));
    console.log(chalk.blue.bold('═════════════════════════════════════════\n'));

    if (report.metrics) {
      this.printMetrics(report.metrics);
    }

    if (report.issues && report.issues.length > 0) {
      this.printIssuesTable(report.issues);
    } else if (report.allIssues && report.allIssues.length > 0) {
      this.printIssuesTable(report.allIssues);
    } else {
      console.log(chalk.green('✓ No issues found!\n'));
    }

    if (report.results) {
      this.printFileSummary(report.results);
    }
  }

  /**
   * Print metrics
   */
  printMetrics(metrics) {
    console.log(chalk.bold('📊 Code Quality Metrics:'));
    console.log(`   Total Issues: ${metrics.totalIssues}`);
    console.log(`   ${chalk.red('Critical')}: ${metrics.criticalIssues}`);
    console.log(`   ${chalk.yellow('High')}: ${metrics.highIssues}`);
    console.log(`   ${chalk.blue('Medium')}: ${metrics.mediumIssues}`);
    console.log(`   ${chalk.gray('Low')}: ${metrics.lowIssues}`);
    console.log(`   Quality Score: ${chalk.bold(metrics.qualityScore + '/100')}\n`);
  }

  /**
   * Print issues in table format
   */
  printIssuesTable(issues) {
    if (issues.length === 0) {
      console.log(chalk.green('✓ No issues found!\n'));
      return;
    }

    console.log(chalk.bold('⚠️  Issues Found:\n'));
    
    issues.forEach((issue, idx) => {
      const severityColor = this.getSeverityColor(issue.severity);
      const severityIcon = this.getSeverityIcon(issue.severity);
      
      console.log(chalk.bold(`${idx + 1}. ${issue.type}`));
      console.log(`   ${severityIcon} Severity: ${severityColor(issue.severity.toUpperCase())}`);
      console.log(`   📄 File: ${chalk.cyan(issue.file)}:${chalk.cyan(issue.line)}`);
      console.log(`   💬 ${issue.message}`);
      if (issue.suggestion) {
        console.log(`   ${chalk.green('→')} Suggestion: ${issue.suggestion}`);
      }
      console.log();
    });
  }

  /**
   * Print file summary
   */
  printFileSummary(results) {
    console.log(chalk.bold('📁 Files Reviewed:\n'));
    
    results.forEach(result => {
      const status = result.status === 'success' ? chalk.green('✓') : chalk.red('✗');
      const issueCount = result.issues.length;
      const issueText = issueCount === 0 
        ? chalk.green('No issues')
        : chalk.red(`${issueCount} issue${issueCount !== 1 ? 's' : ''}`);
      
      console.log(`${status} ${chalk.cyan(result.filePath)}: ${issueText}`);
    });
    
    console.log();
  }

  /**
   * Format report as HTML
   */
  formatReportAsHTML(report) {
    const timestamp = report.timestamp || new Date().toISOString();
    const metrics = report.metrics || {};
    const issues = report.allIssues || report.issues || [];

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Review Report</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 30px;
        }
        header {
            border-bottom: 3px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        h1 {
            color: #333;
            margin: 0 0 10px 0;
        }
        .timestamp {
            color: #666;
            font-size: 14px;
        }
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .metric-card {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 6px;
            border-left: 4px solid #007bff;
            text-align: center;
        }
        .metric-value {
            font-size: 32px;
            font-weight: bold;
            color: #007bff;
        }
        .metric-label {
            color: #666;
            margin-top: 8px;
            font-size: 14px;
        }
        .quality-score {
            border-left-color: #28a745 !important;
        }
        .quality-score .metric-value {
            color: #28a745;
        }
        .issues-section {
            margin-top: 30px;
        }
        .issue {
            background: #f9f9f9;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #ff6b6b;
            border-radius: 4px;
        }
        .issue.high {
            border-left-color: #ff6b6b;
        }
        .issue.medium {
            border-left-color: #ffc107;
        }
        .issue.low {
            border-left-color: #17a2b8;
        }
        .issue-severity {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .severity-critical {
            background: #f8d7da;
            color: #721c24;
        }
        .severity-high {
            background: #f8d7da;
            color: #721c24;
        }
        .severity-medium {
            background: #fff3cd;
            color: #856404;
        }
        .severity-low {
            background: #d1ecf1;
            color: #0c5460;
        }
        .issue-title {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        .issue-details {
            font-size: 13px;
            color: #666;
        }
        .issue-file {
            color: #007bff;
            font-family: monospace;
        }
        .suggestion {
            margin-top: 10px;
            padding: 8px;
            background: #e8f4f8;
            border-radius: 3px;
            font-size: 13px;
            color: #004085;
        }
        .no-issues {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 15px;
            border-radius: 4px;
            text-align: center;
        }
        footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #999;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>📊 JavaScript Code Review Report</h1>
            <p class="timestamp">Generated on ${new Date(timestamp).toLocaleString()}</p>
        </header>

        <div class="metrics">
            <div class="metric-card">
                <div class="metric-value">${metrics.totalIssues || 0}</div>
                <div class="metric-label">Total Issues</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${metrics.criticalIssues || 0}</div>
                <div class="metric-label">Critical</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${metrics.highIssues || 0}</div>
                <div class="metric-label">High</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${metrics.mediumIssues || 0}</div>
                <div class="metric-label">Medium</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${metrics.lowIssues || 0}</div>
                <div class="metric-label">Low</div>
            </div>
            <div class="metric-card quality-score">
                <div class="metric-value">${metrics.qualityScore || 0}</div>
                <div class="metric-label">Quality Score</div>
            </div>
        </div>

        <div class="issues-section">
            <h2>Issues</h2>
            ${issues.length === 0 
              ? '<div class="no-issues">✓ No issues found! Your code looks great.</div>' 
              : issues.map(issue => `
                <div class="issue ${issue.severity}">
                    <span class="issue-severity severity-${issue.severity}">${issue.severity.toUpperCase()}</span>
                    <div class="issue-title">${issue.type}</div>
                    <div class="issue-details">
                        <strong>File:</strong> <span class="issue-file">${issue.file}:${issue.line}</span><br>
                        <strong>Message:</strong> ${issue.message}
                    </div>
                    ${issue.suggestion ? `<div class="suggestion"><strong>Suggestion:</strong> ${issue.suggestion}</div>` : ''}
                </div>
            `).join('')}
        </div>

        <footer>
            <p>Generated by JS Code Review Agent v1.0.0</p>
        </footer>
    </div>
</body>
</html>
    `;
  }

  /**
   * Format report as JSON
   */
  formatReport(report, format = 'json') {
    if (format === 'html') {
      return this.formatReportAsHTML(report);
    } else if (format === 'json') {
      return JSON.stringify(report, null, 2);
    }
    return JSON.stringify(report, null, 2);
  }

  /**
   * Get severity color
   */
  getSeverityColor(severity) {
    switch (severity) {
      case 'critical':
      case 'high':
        return chalk.red;
      case 'medium':
        return chalk.yellow;
      case 'low':
        return chalk.blue;
      default:
        return chalk.gray;
    }
  }

  /**
   * Get severity icon
   */
  getSeverityIcon(severity) {
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

export default ReportFormatter;
