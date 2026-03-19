/**
 * Example test file for the Code Review Agent
 */

import { CodeReviewAgent } from '../src/agent.js';
import { ReportFormatter } from '../src/formatter.js';
import assert from 'assert';

// Test: Agent Creation
export function testAgentCreation() {
  const agent = new CodeReviewAgent();
  assert(agent !== null, 'Agent should be created');
  assert(agent.getDefaultRules().length > 0, 'Agent should have default rules');
  console.log('✓ Agent creation test passed');
}

// Test: Console Detection
export function testConsoleDetection() {
  const agent = new CodeReviewAgent();
  const code = `
    function test() {
      console.log('test');
    }
  `;
  const issues = agent.analyzeContent(code, 'test.js');
  assert(issues.some(i => i.type === 'Console Statement'), 'Should detect console statements');
  console.log('✓ Console detection test passed');
}

// Test: Report Generation
export function testReportGeneration() {
  const agent = new CodeReviewAgent();
  const code = `
    const test_var = 'unused';
  `;
  agent.analyzeContent(code, 'test.js');
  const report = agent.generateReport();
  assert(report.totalIssues >= 0, 'Report should have metrics');
  assert(report.metrics.qualityScore >= 0, 'Quality score should be calculated');
  console.log('✓ Report generation test passed');
}

// Run tests
console.log('Running Code Review Agent Tests...\n');
testAgentCreation();
testConsoleDetection();
testReportGeneration();
console.log('\nAll tests passed! ✓');
