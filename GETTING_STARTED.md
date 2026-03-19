# JavaScript Code Review Agent - Getting Started

## 🎉 Welcome!

You now have a fully functional JavaScript code review agent that can analyze your code and provide intelligent feedback. This document will help you get started quickly.

## 📦 What's Included

```
js-code-review-agent/
├── src/
│   ├── agent.js          # Core code review logic with 6 built-in rules
│   ├── cli.js            # Command-line interface
│   ├── formatter.js      # Report formatting (table, JSON, HTML)
│   └── index.js          # Main entry point
├── examples/
│   ├── sample-code.js    # Example file with code issues
│   └── report.html       # Example HTML report output
├── tests/
│   └── agent.test.js     # Unit tests
├── config/               # Configuration files
├── rules/                # Custom rules directory (extensible)
├── package.json          # Project dependencies
├── .eslintrc.json        # ESLint configuration
├── .prettierrc            # Prettier configuration
└── README.md             # Full documentation

```

## 👨‍💻 Key Components

### 1. **CodeReviewAgent** (src/agent.js)
The core engine that analyzes JavaScript code with multiple rules:
- `no-console` - Detects console statements
- `no-unused-vars` - Finds unused variables
- `high-complexity` - Identifies complex functions
- `naming-convention` - Checks variable naming
- `missing-error-handling` - Detects unsafe async code
- `comment-quality` - Ensures documentation

### 2. **CLI Interface** (src/cli.js)
Command-line tools for running reviews:
- `file` - Review single files
- `directory` - Review all matching files
- `report` - Generate comprehensive reports
- `rules` - List available rules
- `watch` - Monitor files (extensible)

### 3. **Report Formatter** (src/formatter.js)
Multiple output formats:
- **Table** - Colorful console output (default)
- **JSON** - Machine-readable format
- **HTML** - Beautiful interactive reports

## 🚀 Quick Start Examples

### Example 1: Review a Single File

```bash
npm run review -- file examples/sample-code.js
```

**Output:**
```
═════════════════════════════════════════
          CODE REVIEW REPORT
═════════════════════════════════════════

📊 Code Quality Metrics:
   Total Issues: 21
   Critical: 0
   High: 2
   Medium: 5
   Low: 14
   Quality Score: 79/100

⚠️  Issues Found:
...
```

### Example 2: Review All JavaScript Files

```bash
npm run review -- directory "src/**/*.js"
```

### Example 3: Generate HTML Report

```bash
npm run review -- report "examples/**/*.js" -o review.html
```

Then open `review.html` in your browser to see a professional report.

### Example 4: Filter by Severity

```bash
npm run review -- file src/app.js -s high
```

Only shows Critical and High severity issues.

### Example 5: Export as JSON

```bash
npm run review -- file src/app.js -f json > results.json
```

## 🔍 Understanding the Issues

### Issue Categories

1. **Console Statements** (Low Priority)
   - Detects: `console.log()`, `console.warn()`, etc.
   - Why: Keeps production code clean
   - Fix: Remove or use a logging library

2. **Unused Variables** (Medium Priority)
   - Detects: Declared but never used variables
   - Why: Reduces code clutter and confusion
   - Fix: Remove or implement usage

3. **Function Complexity** (Medium Priority)
   - Detects: Functions with too many conditionals
   - Why: Complex functions are hard to test and maintain
   - Fix: Break into smaller functions

4. **Naming Conventions** (Low Priority)
   - Detects: snake_case when camelCase expected
   - Why: Consistency with JavaScript standards
   - Fix: Rename variables

5. **Missing Error Handling** (High Priority)
   - Detects: await without try-catch
   - Why: Prevents uncaught promise rejections
   - Fix: Wrap in try-catch blocks

6. **Missing Documentation** (Low Priority)
   - Detects: Functions without JSDoc comments
   - Why: Improves code maintainability
   - Fix: Add JSDoc comments

## 💡 Common Patterns

### Pattern 1: Review Before Commit

```bash
# Create pre-commit hook
npm run review -- directory "src/**/*.js" -s high || exit 1
```

### Pattern 2: Generate Weekly Reports

```bash
# Generate HTML report with timestamp
npm run review -- report "src/**/*.js" -o "reports/review-$(date +%Y%m%d).html"
```

### Pattern 3: Check Specific Directory

```bash
# Review only new features
npm run review -- directory "src/features/**/*.js"
```

### Pattern 4: Programmatic Usage

```javascript
import { CodeReviewAgent } from './src/agent.js';

const agent = new CodeReviewAgent({
  severity: 'high'
});

const result = await agent.reviewFile('src/app.js');
console.log(result.issues);

const report = agent.generateReport();
console.log(report.metrics);
```

## 🎯 Integration Ideas

### 1. GitHub Actions
```yaml
- name: Code Review
  run: npm run review -- directory "src/**/*.js" -s high
```

### 2. Pre-commit Hook
```bash
#!/bin/bash
npm run review -- directory "src/**/*.js" -s high
```

### 3. Git Workflow
```bash
# Review changes before committing
git diff --name-only | xargs npm run review -- file
```

### 4. CI/CD Pipeline
```bash
# Fail if critical issues found
npm run review -- report "src/**/*.js" --fail-on critical
```

## 🛠️ Customization

### Add a Custom Rule

Edit `src/agent.js` and add to `getDefaultRules()`:

```javascript
createMyCustomRule() {
  return {
    id: 'my-rule',
    name: 'My Custom Rule',
    check: (content, lines, filePath) => {
      const issues = [];
      // Your logic here
      return issues;
    }
  };
}
```

### Modify Severity Levels

Edit rules to change severity:
```javascript
message: '...',
severity: 'critical' // Change from 'low' to 'critical'
```

### Extend for TypeScript

Update patterns to recognize `.ts` and `.tsx` files (already in code).

## 📊 Quality Score Formula

Quality Score = 100 - (Total Issues × 5)

- **90-100** ✅ Excellent
- **80-89** ✅ Good
- **70-79** ⚠️ Average
- **60-69** ⚠️ Fair
- **Below 60** ❌ Needs Improvement

## 🐛 Troubleshooting

**Q: "Command not found: npm run review"**
A: Run `npm install` first

**Q: "No issues found" but I expect some**
A: Check file extension (.js, .jsx, .ts, .tsx) and verify the pattern

**Q: HTML report looks broken**
A: Use absolute path: `npm run review -- report "$(pwd)/src/**/*.js" -o report.html`

## 📚 Next Steps

1. ✅ Review your own code: `npm run review -- directory "src/**/*.js"`
2. ✅ Generate a report: `npm run review -- report "src/**/*.js" -o report.html`
3. ✅ Customize rules for your project
4. ✅ Integrate with your CI/CD pipeline
5. ✅ Share reports with your team

## 🎓 Learn More

- [Full README](README.md) - Complete documentation
- [Quick Start](QUICKSTART.md) - Fast setup guide
- [ESLint Rules](https://eslint.org/docs/rules/) - Coding standards
- [JavaScript Patterns](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) - Best practices

## 🤝 Support & Contributing

Found a bug? Want to add a feature? The codebase is well-documented and ready for contributions!

Key files:
- `src/agent.js` - Add new review rules
- `src/formatter.js` - Add new output formats
- `src/cli.js` - Add new commands
- `tests/agent.test.js` - Add test cases

---

**Happy coding! Your code just got smarter.** 🚀
