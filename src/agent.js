/**
 * Core Code Review Agent
 * Analyzes JavaScript files and provides intelligent code review feedback
 */

import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

export class CodeReviewAgent {
  constructor(options = {}) {
    this.options = {
      severity: options.severity || 'all', // 'critical', 'high', 'medium', 'low', 'all'
      rules: options.rules || this.getDefaultRules(),
      reportStyle: options.reportStyle || 'detailed',
      ...options
    };
    this.issues = [];
    this.metrics = {};
  }

  /**
   * Review a single file
   */
  async reviewFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const issues = this.analyzeContent(content, filePath);
      return { filePath, issues, status: 'success' };
    } catch (error) {
      return { filePath, issues: [], status: 'error', error: error.message };
    }
  }

  /**
   * Review multiple files
   */
  async reviewFiles(pattern) {
    const files = await glob(pattern, { ignore: ['node_modules/**', 'dist/**', '.git/**'] });
    const results = [];

    for (const file of files) {
      if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
        const result = await this.reviewFile(file);
        results.push(result);
        this.issues.push(...result.issues);
      }
    }

    return results;
  }

  /**
   * Analyze content for code issues using custom rules
   */
  analyzeContent(content, filePath) {
    const issues = [];
    const lines = content.split('\n');

    // Load and run custom rules
    for (const rule of this.options.rules) {
      const ruleIssues = rule.check(content, lines, filePath);
      issues.push(...ruleIssues);
    }

    return issues;
  }

  /**
   * Get default review rules
   */
  getDefaultRules() {
    return [
      this.createConsoleRule(),
      this.createUnusedVarsRule(),
      this.createComplexityRule(),
      this.createNamingConventionRule(),
      this.createErrorHandlingRule(),
      this.createCommentRule()
    ];
  }

  /**
   * Rule: Console statements detection
   */
  createConsoleRule() {
    return {
      id: 'no-console',
      name: 'Console Statements',
      check: (content, lines, filePath) => {
        const issues = [];
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

        return issues;
      }
    };
  }

  /**
   * Rule: Unused variables detection
   */
  createUnusedVarsRule() {
    return {
      id: 'no-unused-vars',
      name: 'Unused Variables',
      check: (content, lines, filePath) => {
        const issues = [];
        const varPattern = /(?:const|let|var)\s+(\w+)\s*=/gm;
        const declarations = new Map();

        let match;
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

        return issues;
      }
    };
  }

  /**
   * Rule: Function complexity detection
   */
  createComplexityRule() {
    return {
      id: 'high-complexity',
      name: 'Function Complexity',
      check: (content, lines, filePath) => {
        const issues = [];
        const functionPattern = /function\s+(\w+)[^{]*\{|(?:const|let)\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/gm;

        let match;
        while ((match = functionPattern.exec(content)) !== null) {
          const functionName = match[1] || match[2];
          const lineNum = content.substring(0, match.index).split('\n').length;
          
          // Simple complexity heuristic: count conditionals
          const startIdx = match.index + match[0].length;
          const endIdx = this.findMatchingBrace(content, startIdx);
          const funcBody = content.substring(startIdx, endIdx);
          const conditionCount = (funcBody.match(/if|else|switch|case|for|while|catch/g) || []).length;

          if (conditionCount > 5) {
            issues.push({
              file: filePath,
              line: lineNum,
              severity: 'medium',
              type: 'High Complexity',
              message: `Function '${functionName}' has high cyclomatic complexity (${conditionCount})`,
              suggestion: 'Break function into smaller, more focused functions'
            });
          }
        }

        return issues;
      }
    };
  }

  /**
   * Rule: Naming convention detection
   */
  createNamingConventionRule() {
    return {
      id: 'naming-convention',
      name: 'Naming Conventions',
      check: (content, lines, filePath) => {
        const issues = [];
        
        // Check for snake_case variable names (should be camelCase)
        const snakeCasePattern = /(?:const|let|var)\s+([a-z]+_[a-z_\d]+)\s*=/gm;
        let match;

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

        return issues;
      }
    };
  }

  /**
   * Rule: Error handling detection
   */
  createErrorHandlingRule() {
    return {
      id: 'missing-error-handling',
      name: 'Error Handling',
      check: (content, lines, filePath) => {
        const issues = [];

        // Check for async/await without try-catch
        const asyncPattern = /async\s+\w+[^{]*\{[^]*?await/gm;
        let match;

        // Simple check: if there's await without try-catch in nearby context
        lines.forEach((line, idx) => {
          if (line.includes('await') && !this.hasErrorHandling(lines, idx)) {
            issues.push({
              file: filePath,
              line: idx + 1,
              severity: 'high',
              type: 'Missing Error Handling',
              message: `await expression without error handling`,
              suggestion: 'Wrap await in try-catch block'
            });
          }
        });

        return issues;
      }
    };
  }

  /**
   * Rule: Comment quality detection
   */
  createCommentRule() {
    return {
      id: 'comment-quality',
      name: 'Comments',
      check: (content, lines, filePath) => {
        const issues = [];

        // Check for functions without JSDoc
        const functionPattern = /function\s+(\w+)|(?:const|let)\s+(\w+)\s*=\s*(?:async\s*)?\(/gm;
        let match;

        while ((match = functionPattern.exec(content)) !== null) {
          const functionName = match[1] || match[2];
          const lineNum = content.substring(0, match.index).split('\n').length;
          
          // Check if previous line has JSDoc
          if (lineNum > 1 && !lines[lineNum - 2].includes('/**')) {
            issues.push({
              file: filePath,
              line: lineNum,
              severity: 'low',
              type: 'Missing Documentation',
              message: `Function '${functionName}' lacks JSDoc comment`,
              suggestion: 'Add JSDoc comment describing parameters and return value'
            });
          }
        }

        return issues;
      }
    };
  }

  /**
   * Helper: Find matching brace
   */
  findMatchingBrace(content, startIdx) {
    let count = 1;
    let idx = startIdx + 1;

    while (idx < content.length && count > 0) {
      if (content[idx] === '{') count++;
      else if (content[idx] === '}') count--;
      idx++;
    }

    return idx;
  }

  /**
   * Helper: Check if error handling exists
   */
  hasErrorHandling(lines, idx) {
    const context = lines.slice(Math.max(0, idx - 5), Math.min(lines.length, idx + 5)).join('\n');
    return context.includes('try') && context.includes('catch');
  }

  /**
   * Helper: Convert snake_case to camelCase
   */
  snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
  }

  /**
   * Generate report
   */
  generateReport() {
    const bySeverity = { critical: [], high: [], medium: [], low: [] };
    
    this.issues.forEach(issue => {
      if (bySeverity[issue.severity]) {
        bySeverity[issue.severity].push(issue);
      }
    });

    return {
      totalIssues: this.issues.length,
      issueBySeverity: bySeverity,
      metrics: this.calculateMetrics()
    };
  }

  /**
   * Calculate code metrics
   */
  calculateMetrics() {
    return {
      totalIssues: this.issues.length,
      criticalIssues: this.issues.filter(i => i.severity === 'critical').length,
      highIssues: this.issues.filter(i => i.severity === 'high').length,
      mediumIssues: this.issues.filter(i => i.severity === 'medium').length,
      lowIssues: this.issues.filter(i => i.severity === 'low').length,
      qualityScore: Math.max(0, 100 - (this.issues.length * 5))
    };
  }

  /**
   * Reset issues
   */
  reset() {
    this.issues = [];
    this.metrics = {};
  }
}

export default CodeReviewAgent;
