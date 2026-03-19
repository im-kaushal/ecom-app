# Complete Setup Guide

## 🚀 Full Installation & Setup

This guide covers both the CLI backend and the beautiful Angular UI for the JavaScript Code Review Agent.

## 📋 Prerequisites

- Node.js 18+
- npm 9+
- Git

## 🔧 Backend Setup (CLI Tool)

### Step 1: Install Backend Dependencies
```bash
# From root directory
npm install
```

### Step 2: Verify Installation
```bash
npm run review -- rules
```

You should see all 6 available review rules listed.

### Step 3: Test the Backend
```bash
npm run review -- file examples/sample-code.js
```

You should see detected issues in a formatted table.

## 🎨 Frontend Setup (Angular UI)

### Step 1: Navigate to UI Directory
```bash
cd ui
```

### Step 2: Install UI Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm start
```

The app will automatically open at `http://localhost:4200`

## 🎯 Using the CLI

### Review a Single File
```bash
npm run review -- file src/example.js
```

**Options:**
- `-s, --severity <level>`: Filter by severity (critical, high, medium, low, all)
- `-f, --format <type>`: Output format (json, table, html)

**Example:**
```bash
npm run review -- file src/app.js -s high -f json
```

### Review Multiple Files
```bash
npm run review -- directory "src/**/*.js"
```

### Generate HTML Report
```bash
npm run review -- report "src/**/*.js" -o review-report.html
```

### List Available Rules
```bash
npm run review -- rules
```

## 🖥️ Using the Angular UI

### Starting the UI
```bash
cd ui
npm start
```

### Features
1. **Code Editor**
   - Paste or type JavaScript code
   - Line and character counter
   - Load example code
   - Clear functionality

2. **Live Analysis**
   - Click "Review Code" to analyze
   - Instant feedback on quality
   - Real-time metrics

3. **Results Panel**
   - View all detected issues
   - Filter by severity
   - Expand issues for details
   - Copy suggestions

4. **Metrics Dashboard**
   - Quality score (0-100)
   - Issue breakdown by severity
   - Quality level (Excellent/Good/Average/Fair/Needs Work)
   - Visual progress bar

## 📊 Understanding Analysis Results

### Quality Scores
- **90-100**: Excellent ⭐
- **80-89**: Good ✅
- **70-79**: Average ⚠️
- **60-69**: Fair ⚠️
- **Below 60**: Needs Work ❌

### Severity Levels
- **Critical (🔴)**: Must fix immediately
- **High (🟠)**: Significant code smell
- **Medium (🟡)**: Should be addressed
- **Low (🔵)**: Nice to improve

## ️ Example Workflow

### CLI Workflow
```bash
# 1. Create a JavaScript file
cat > test.js << 'EOF'
const user_name = "John";
console.log("User:", user_name);

async function fetch Data() {
  const response = await fetch('/api/data');
  return response.json();
}
EOF

# 2. Review it
npm run review -- file test.js

# 3. Get high-severity issues only
npm run review -- file test.js -s high

# 4. Export as JSON
npm run review -- file test.js -f json > results.json

# 5. Generate HTML report
npm run review -- report "*.js" -o report.html
```

### UI Workflow
1. Open http://localhost:4200
2. Click "Example" to load sample code
3. Click "Review Code"
4. View issues in the list
5. Click severity filters
6. Expand issues to see suggestions
7. Monitor quality score

## 🔌 Integration with Development

### Git Pre-commit Hook
Create `.git/hooks/pre-commit`:
```bash
#!/bin/bash
npm run review -- directory "src/**/*.js" -s high
if [ $? -ne 0 ]; then
  echo "Code review failed. Fix issues before committing."
  exit 1
fi
```

### GitHub Actions
Create `.github/workflows/code-review.yml`:
```yaml
name: Code Review
on: [push, pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run review -- directory "src/**/*.js" -s high
```

## 🛠️ Customization

### Add Custom Analysis Rule
Edit `src/agent.js`:
```javascript
createCustomRule() {
  return {
    id: 'my-rule',
    name: 'Custom Check',
    check: (content, lines, filePath) => {
      const issues = [];
      // Your analysis logic
      return issues;
    }
  };
}

// Add to getDefaultRules()
getDefaultRules() {
  return [
    ...super.getDefaultRules(),
    this.createCustomRule()
  ];
}
```

### Change UI Theme
Edit `ui/src/styles.css`:
```css
:root {
  --primary-color: #00d4ff;
  --secondary-color: #0099ff;
  --danger-color: #ff4444;
}
```

## 🚨 Troubleshooting

### Port 4200 Already in Use (UI)
```bash
cd ui
ng serve --port 4300
```

### CLI Commands Not Found
```bash
# Make sure you're in root directory
cd /path/to/ecom-app

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### UI Not Starting
```bash
cd ui
rm -rf node_modules package-lock.json
npm install
npm start
```

### Analysis Not Working
- Check that code syntax is valid JavaScript
- Look for error messages in console
- Verify file paths are correct

## 📈 Performance Tips

### For Large Codebases
```bash
# Review specific pattern
npm run review -- directory "src/components/**/*.js"

# Review only high severity
npm run review -- directory "src/**/*.js" -s high
```

### For UI Performance
- Keep code snippets under 5000 lines
- Review sections of large files separately
- Use severity filters to reduce visual clutter

## 📚 Directory Structure

```
ecom-app/
├── Backend
│   ├── src/
│   │   ├── agent.js         # Core analysis engine
│   │   ├── cli.js           # CLI interface
│   │   ├── formatter.js     # Report formatting
│   │   ├── index.js         # Entry point
│   ├── examples/            # Sample code
│   ├── tests/               # Test files
│   ├── package.json         # Backend deps
│   ├── README.md            # Backend docs
│   └── QUICKSTART.md        # Backend quick start
│
├── Frontend (UI)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── editor/        # Code input
│   │   │   │   ├── issues-list/   # Issue display
│   │   │   │   └── metrics/       # Metrics panel
│   │   │   ├── services/
│   │   │   │   └── code-review.service.ts
│   │   │   └── models/
│   │   │       └── index.ts
│   │   ├── main.ts          # Bootstrap
│   │   ├── styles.css       # Global styles
│   │   └── index.html       # HTML template
│   ├── angular.json         # Angular config
│   ├── tsconfig.json        # TypeScript config
│   ├── package.json         # Frontend deps
│   ├── README.md            # Frontend docs
│   └── QUICKSTART.md        # UI quick start
│
├── package.json             # Root deps
├── README.md                # Main docs
└── COMPLETE_SETUP.md        # This file
```

## 🎓 Use Cases

### 1. Code Quality Monitoring
```bash
# Regular code reviews
npm run review -- directory "src/**/*.js"

# Generate reports
npm run review -- report "src/**/*.js" -o weekly-review.html
```

### 2. Team Collaboration
- Share HTML reports via email
- Use UI to demonstrate issues
- Provide specific suggestions

### 3. CI/CD Integration
- Block PRs with critical issues
- Generate quality trends
- Track improvements over time

### 4. Learning Tool
- Understand code patterns
- Get suggestions for improvements
- Practice best practices

## 🔍 Advanced Configuration

### Custom Configuration File
Create `review.config.js`:
```javascript
module.exports = {
  severity: 'high',
  rules: ['no-console', 'no-unused-vars'],
  ignorePatterns: ['node_modules/', 'dist/'],
  reportFormat: 'html',
  outputPath: './reports/'
};
```

### Environment Setup
Create `.env`:
```
REVIEW_SEVERITY=high
REVIEW_FORMAT=json
API_URL=http://localhost:3000/api
```

## 📞 Support

### Getting Help
- Check README files in each directory
- Review QUICKSTART guides
- Check example code in `examples/` folder
- Review test files in `tests/` folder

### Reporting Issues
1. Check existing documentation
2. Run with verbose output if available
3. Check browser console for UI errors
4. Verify all dependencies are installed

## 🎉 You're All Set!

You now have both:
1. ✅ **CLI Tool** for command-line analysis
2. ✅ **Angular UI** for visual analysis

Start with the UI or CLI based on your preference!

```bash
# Quick Start Options:

# Option 1: UI (Recommended for beginners)
cd ui && npm install && npm start

# Option 2: CLI (Recommended for automation)
npm install && npm run review -- file examples/sample-code.js

# Option 3: Both!
# Terminal 1: Backend development
npm run review -- watch "src/**/*.js"

# Terminal 2: UI development
cd ui && npm start
```

Try it out now! 🚀
