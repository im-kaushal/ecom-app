/**
 * Main entry point for Code Review Agent
 */

export { CodeReviewAgent } from './agent.js';
export { ReportFormatter } from './formatter.js';

// Example usage
import { CodeReviewAgent } from './agent.js';
import { ReportFormatter } from './formatter.js';

async function example() {
  console.log('Code Review Agent initialized. Use the CLI for code review:\n');
  console.log('  npx code-review file <filePath>');
  console.log('  npx code-review directory <pattern>');
  console.log('  npx code-review report <pattern>');
  console.log('  npx code-review rules\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  example();
}
