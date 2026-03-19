# JavaScript Code Review Agent

An intelligent AI-powered code review agent that analyzes JavaScript code and provides comprehensive feedback on code quality, best practices, and potential issues.

**Now with a Beautiful Angular UI! 🎨**

## 🎯 Features

### Backend Agent
- **Intelligent Code Analysis**: Automatically detects common JavaScript issues
- **Multiple Review Rules**: Console, variables, complexity, naming, error handling, documentation
- **Multiple Output Formats**: JSON, Table (CLI), and HTML reports
- **Batch File Processing**: Review entire directories or file patterns
- **Quality Metrics**: Calculate code quality scores and issue statistics
- **Extensible Architecture**: Easy to add custom review rules

### Angular UI
- **Beautiful Dark Theme**: Modern cyberpunk-inspired interface
- **Real-time Analysis**: Instant feedback as you code
- **Interactive Dashboard**: Visual metrics and quality insights
- **Issue Management**: Expandable issue details with suggestions
- **Severity Filtering**: Filter issues by severity level
- **Responsive Design**: Works on desktop and mobile
- **Copy Suggestions**: Clipboard integration

## 📋 Available Review Rules

1. **Console Statements** (`no-console`)
   - Detects console.log, console.warn, etc.
   - Helps ensure clean production code

2. **Unused Variables** (`no-unused-vars`)
   - Identifies declared but unused variables
   - Promotes code cleanliness

3. **Function Complexity** (`high-complexity`)
   - Flags functions with high cyclomatic complexity
   - Suggests breaking down complex functions

4. **Naming Conventions** (`naming-convention`)
   - Checks for proper camelCase variable names
   - Detects snake_case usage

5. **Error Handling** (`missing-error-handling`)
   - Detects async/await without try-catch
   - Ensures proper error management

6. **Comments** (`comment-quality`)
   - Checks for missing JSDoc comments
   - Promotes code documentation

## 🚀 Quick Start

### Option 1: Use the Angular UI (Recommended)
```bash
cd ui
npm install
npm start
```
Open http://localhost:4200/ - Start analyzing code visually!

### Option 2: Use CLI
```bash
npm install
npm run review -- file src/example.js
```
Get CLI-based analysis with tables, JSON, or HTML reports.

## 📁 Project Structure

```
ecom-app/
├── src/                      # Backend agent
│   ├── agent.js             # Core analysis engine
│   ├── cli.js               # CLI interface
│   ├── formatter.js         # Report formatting
│   └── index.js             # Entry point
├── ui/                       # Angular web UI
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # Editor, Issues, Metrics
│   │   │   ├── services/    # Code review service
│   │   │   └── models/      # TypeScript types
│   │   ├── main.ts          # Bootstrap
│   │   ├── index.html       # Main page
│   │   └── styles.css       # Global styles
│   ├── angular.json         # Angular config
│   └── package.json         # UI dependencies
├── examples/                # Sample code files
├── package.json             # Backend dependencies
└── README.md
```

## 🖥️ User Interface Tour

### Dashboard
- **Code Editor**: Syntax-aware input area with line counting
- **Metrics Panel**: Real-time quality score and statistics
- **Issues List**: Expandable issue display with suggestions
- **Severity Filters**: Quick filtering by issue severity

### Color Coding
- 🔴 **Critical**: Must fix immediately
- 🟠 **High**: Significant issues
- 🟡 **Medium**: Should fix soon
- 🔵 **Low**: Nice to fix

## 🚀 Installation

### Option 1: Installation
npm install
```

### Global Installation

```bash
npm install -g .
```

## 📖 Usage

### Review a Single File

```bash
npm run review -- file src/example.js
```

**Options:**
- `-s, --severity <level>`: Filter by severity (critical, high, medium, low, all)
- `-f, --format <type>`: Output format (json, table, html)

### Review a Directory

```bash
npm run review -- directory "src/**/*.js"
```

### Generate HTML Report

```bash
npm run review -- report "src/**/*.js" -o review-report.html -f html
```

### List Available Rules

```bash
npm run review -- rules
```

### Watch Files for Changes

```bash
npm run review -- watch "src/**/*.js"
```

## 📊 Output Formats

### Table Format (Default)

```
═════════════════════════════════════════
          CODE REVIEW REPORT
═════════════════════════════════════════

📊 Code Quality Metrics:
   Total Issues: 5
   🔴 Critical: 0
   🟠 High: 1
   🟡 Medium: 2
   🔵 Low: 2
   Quality Score: 75/100

⚠️  Issues Found:

1. Console Statement
   🟠 Severity: HIGH
   📄 File: src/app.js:42
   💬 Remove console.log() statement before production
   → Suggestion: Use a logging library instead
```

### JSON Format

```bash
npm run review -- file src/app.js -f json
```

```json
{
  "file": "src/app.js",
  "issues": [
    {
      "file": "src/app.js",
      "line": 42,
      "severity": "high",
      "type": "Console Statement",
      "message": "Remove console.log() statement before production",
      "suggestion": "Use a logging library instead"
    }
  ],
  "metrics": {
    "totalIssues": 1,
    "criticalIssues": 0,
    "highIssues": 1,
    "mediumIssues": 0,
    "lowIssues": 0,
    "qualityScore": 95
  }
}
```

### HTML Format

```bash
npm run review -- report "src/**/*.js" -o report.html -f html
```

Generates a beautiful, interactive HTML report with:
- Code quality metrics dashboard
- Color-coded issue severity indicators
- File-by-file breakdowns
- Interactive issue details

## 🔧 Configuration

### .eslintrc.json

Configure ESLint rules for the project:

```json
{
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "warn"
  }
}
```

### .prettierrc

Configure code formatting:

```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

## 🛠️ Development

### Build

The agent is written in ES Modules and requires Node.js 14+.

### Test

```bash
npm test
```

### Lint

```bash
npm run lint
```

### Format

```bash
npm run format
```

## 📚 API Usage

You can also use the agent programmatically:

```javascript
import { CodeReviewAgent } from './src/agent.js';

const agent = new CodeReviewAgent({
  severity: 'high',
  rules: agent.getDefaultRules()
});

// Review a single file
const result = await agent.reviewFile('src/app.js');
console.log(result.issues);

// Review multiple files
const results = await agent.reviewFiles('src/**/*.js');

// Get metrics
const report = agent.generateReport();
console.log(report.metrics);
```

## 🚀 Advanced Features

### Custom Rules

Extend the agent with custom rules:

```javascript
const customRule = {
  id: 'custom-rule',
  name: 'Custom Check',
  check: (content, lines, filePath) => {
    const issues = [];
    // Your custom logic here
    return issues;
  }
};

const agent = new CodeReviewAgent({
  rules: [...agent.getDefaultRules(), customRule]
});
```

### Severity Filtering

Filter results by severity:

```bash
npm run review -- file src/app.js -s high
```

Valid severity levels: `critical`, `high`, `medium`, `low`, `all`

## 📈 Quality Score Calculation

Quality Score = 100 - (Total Issues × 5)

- 90-100: Excellent
- 80-89: Good
- 70-79: Average
- 60-69: Fair
- Below 60: Needs Improvement

## 🤝 Contributing

Contributions are welcome! To add new review rules:

1. Create a new rule function in `src/agent.js`
2. Add it to the `getDefaultRules()` method
3. Update this README with the new rule
4. Submit a pull request

## 📄 License

ISC

## 🎓 Learn More

- [ESLint Documentation](https://eslint.org/docs/)
- [JavaScript Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [Code Review Best Practices](https://github.com/features/code-review)

---

**Made with ❤️ by Kaushal**