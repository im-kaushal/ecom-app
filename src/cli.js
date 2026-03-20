#!/usr/bin/env node

/**
 * CLI Interface for Code Review Agent
 */

import { program } from 'commander';
import chalk from 'chalk';
import { CodeReviewAgent } from './agent.js';
import { ReportFormatter } from './formatter.js';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { exec as execFn } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execFn);

const formatter = new ReportFormatter();

function buildAuthUrl(repoUrl, token) {
  if (!token || !repoUrl.startsWith('https://')) {
    return repoUrl;
  }

  const url = new URL(repoUrl);
  if (url.hostname !== 'github.com') {
    return repoUrl;
  }

  // Avoid leaking token in logs and keep auth valid for private repositories
  url.username = token;
  url.password = '';
  return url.toString();
}

async function cloneRepository(repoUrl, token, branch) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'code-review-repo-'));
  let cloneUrl = repoUrl;

  if (token) {
    cloneUrl = buildAuthUrl(repoUrl, token);
  }

  const branchArg = branch ? `--branch ${branch}` : '';
  const cloneCmd = `git clone --depth 1 ${branchArg} ${cloneUrl} ${tempDir}`;

  await exec(cloneCmd, { env: process.env });
  return tempDir;
}

async function removeDirectory(dirPath) {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
  } catch (err) {
    console.warn(chalk.yellow(`⚠️ Failed to clean up temp dir ${dirPath}: ${err.message}`));
  }
}

async function main() {
  program
    .name('code-review')
    .description('Intelligent JavaScript Code Review Agent')
    .version('1.0.0');

  program
    .command('file <filePath>')
    .description('Review a single JavaScript file')
    .option('-s, --severity <level>', 'Filter by severity (critical, high, medium, low, all)', 'all')
    .option('-f, --format <type>', 'Output format (json, table, html)', 'table')
    .action(async (filePath, options) => {
      try {
        const agent = new CodeReviewAgent({ severity: options.severity });
        const result = await agent.reviewFile(filePath);

        if (result.status === 'error') {
          console.error(chalk.red(`✗ Error reviewing file: ${result.error}`));
          process.exit(1);
        }

        const report = {
          file: result.filePath,
          issues: result.issues,
          metrics: agent.calculateMetrics()
        };

        formatter.printReport(report, options.format);
      } catch (error) {
        console.error(chalk.red(`✗ Error: ${error.message}`));
        process.exit(1);
      }
    });

  program
    .command('directory <pattern>')
    .description('Review JavaScript files matching a pattern')
    .option('-s, --severity <level>', 'Filter by severity', 'all')
    .option('-f, --format <type>', 'Output format (json, table, html)', 'table')
    .action(async (pattern, options) => {
      try {
        const agent = new CodeReviewAgent({ severity: options.severity });
        const results = await agent.reviewFiles(pattern);

        const report = {
          filesReviewed: results.length,
          results: results,
          metrics: agent.calculateMetrics(),
          allIssues: agent.issues
        };

        formatter.printReport(report, options.format);
      } catch (error) {
        console.error(chalk.red(`✗ Error: ${error.message}`));
        process.exit(1);
      }
    });

  program
    .command('github <repoUrl>')
    .description('Clone and review a GitHub repository URL (supports private repo via token)')
    .option('-t, --token <token>', 'GitHub personal access token (or set GITHUB_TOKEN env var)')
    .option('-b, --branch <branch>', 'Repository branch to checkout, default is default branch')
    .option('-s, --severity <level>', 'Filter by severity', 'all')
    .option('-f, --format <type>', 'Output format (json, table, html)', 'table')
    .action(async (repoUrl, options) => {
      const token = options.token || process.env.GITHUB_TOKEN;
      let tempDir;

      try {
        tempDir = await cloneRepository(repoUrl, token, options.branch);

        const agent = new CodeReviewAgent({ severity: options.severity });
        const results = await agent.reviewRepository(tempDir);

        const report = {
          repository: repoUrl,
          branch: options.branch || 'default',
          filesReviewed: results.length,
          results: results,
          metrics: agent.calculateMetrics(),
          allIssues: agent.issues
        };

        formatter.printReport(report, options.format);
      } catch (error) {
        console.error(chalk.red(`✗ Error reviewing repository: ${error.message}`));
        process.exit(1);
      } finally {
        if (tempDir) {
          await removeDirectory(tempDir);
        }
      }
    });

  program
    .command('watch <pattern>')
    .description('Watch files and review on changes')
    .option('-s, --severity <level>', 'Filter by severity', 'all')
    .action(async (pattern, options) => {
      try {
        const agent = new CodeReviewAgent({ severity: options.severity });
        console.log(chalk.blue(`👁 Watching ${pattern} for changes...`));
        console.log(chalk.gray('Press Ctrl+C to stop watching\n'));

        // Note: Full file watching implementation would require chokidar
        const results = await agent.reviewFiles(pattern);
        formatter.printReport({ filesReviewed: results.length, results }, 'table');
      } catch (error) {
        console.error(chalk.red(`✗ Error: ${error.message}`));
        process.exit(1);
      }
    });

  program
    .command('report <pattern>')
    .description('Generate comprehensive code review report')
    .option('-o, --output <file>', 'Output file path')
    .option('-f, --format <type>', 'Output format (json, html)', 'html')
    .action(async (pattern, options) => {
      try {
        const agent = new CodeReviewAgent();
        const results = await agent.reviewFiles(pattern);
        const report = {
          timestamp: new Date().toISOString(),
          analysisPattern: pattern,
          filesReviewed: results.length,
          results: results,
          metrics: agent.calculateMetrics(),
          allIssues: agent.issues
        };

        const output = formatter.formatReport(report, options.format);
        
        if (options.output) {
          await fs.writeFile(options.output, output);
          console.log(chalk.green(`✓ Report saved to ${options.output}`));
        } else {
          console.log(output);
        }
      } catch (error) {
        console.error(chalk.red(`✗ Error: ${error.message}`));
        process.exit(1);
      }
    });

  program
    .command('rules')
    .description('List available review rules')
    .action(() => {
      const agent = new CodeReviewAgent();
      const rules = agent.getDefaultRules();
      
      console.log(chalk.blue('\n📋 Available Code Review Rules:\n'));
      
      rules.forEach((rule, idx) => {
        console.log(chalk.bold(`${idx + 1}. ${rule.name} (${rule.id})`));
        console.log(chalk.gray('   Checks for common JavaScript code issues\n'));
      });
    });

  program.parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
}

main().catch(error => {
  console.error(chalk.red(`✗ Fatal error: ${error.message}`));
  process.exit(1);
});
