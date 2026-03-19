# Quick Start Guide

## Installation

```bash
npm install
```

## Basic Usage

### 1. Review a Single File

```bash
npm run review -- file examples/sample-code.js
```

### 2. Review Multiple Files

```bash
npm run review -- directory "examples/**/*.js"
```

### 3. Generate an HTML Report

```bash
npm run review -- report "examples/**/*.js" -o report.html
```

Then open `report.html` in your browser to see the formatted report.

### 4. View Available Rules

```bash
npm run review -- rules
```

### 5. Filter by Severity

```bash
npm run review -- file examples/sample-code.js -s high
```

## Expected Output

When you run a review on the sample-code.js file, you should see issues like:

- ✗ Unused variables (snake_case naming)
- ✗ Console statements
- ✗ Missing error handling (await without try-catch)
- ✗ High complexity functions
- ✗ Missing JSDoc comments
- ✗ Naming convention violations

## Next Steps

1. **Customize Rules**: Edit `src/agent.js` to modify or add review rules
2. **Integrate with CI/CD**: Use the CLI in your GitHub Actions or other CI systems
3. **Extend Functionality**: Add new rules as needed for your project
4. **API Usage**: Import and use the agent in your own code

## Example API Usage

```javascript
import { CodeReviewAgent } from './src/agent.js';

const agent = new CodeReviewAgent();
const result = await agent.reviewFile('examples/sample-code.js');
console.log(result.issues);
```

## Troubleshooting

### Command not found: npm run review

Make sure you've installed dependencies:
```bash
npm install
```

### No issues found when expected

Check that:
1. The file path is correct
2. Files use .js, .jsx, .ts, or .tsx extension
3. Your code actually has the issues being checked for

### HTML report not generated

Ensure the `-o` flag is provided:
```bash
npm run review -- report "src/**/*.js" -o output.html
```

## Support

For issues or questions, check the main README.md file for detailed documentation.
