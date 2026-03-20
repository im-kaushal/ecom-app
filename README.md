# JavaScript Code Review Agent

A complete, standalone JavaScript code review solution with a CLI backend and an optional Angular UI. This single file is now the canonical documentation for setup, usage, architecture, and development.

---

## 🚀 What it is
- CLI-powered code review agent: `npm run review` supports file, directory, report, rule list, severity filters.
- Optional Angular dashboard (`ui/`) for real-time issues and quality metrics.
- Rule-based analysis: `no-console`, `no-unused-vars`, complexity, naming, error handling, comments, etc.
- Output formats: Table (CLI), JSON, HTML report.

---

## 🧩 Use cases
1. Local pre-commit code quality checks in development
2. CI/CD code review step for JavaScript repos
3. IDE tooling augmentation via batch reports
4. Teaching and enforcement of coding standards
5. Exporting shareable HTML reports for audit

---

## ⚙️ Prerequisites
- Node.js 18+ (recommended)
- npm
- Optional: modern browser for Angular UI

---

## 📦 Repository structure
```
 ecom-app/
  ├── src/                # Backend code review engine
  │   ├── agent.js
  │   ├── cli.js
  │   ├── formatter.js
  │   └── index.js
  ├── ui/                 # Optional Angular UI
  │   ├── angular.json
  │   ├── package.json
  │   └── src/app/...     # components, services, models
  ├── examples/           # sample code used by quickstart
  ├── tests/              # unit tests for agent logic
  ├── package.json        # backend dependencies & scripts
  ├── README.md           # this file
  ├── COMPLETE_SETUP.md   # (removed, content merged)
  ├── ...                # other markdown files removed
```

---

## 🛠️ Installation
### Backend CLI
```bash
npm install
```

### Optional Angular UI
```bash
cd ui
npm install
```

### Free deployment (GitHub Pages)
1. Push `main` to GitHub.
2. This workflow file triggers build + deploy: `.github/workflows/deploy-ui.yml`.
3. The UI output path is `ui/dist/js-code-review-ui`.
4. In repo Settings > Pages, set source to `gh-pages` (root).
5. Visit the published URL like `https://<username>.github.io/<repo>`.

> The Angular UI has the full analysis logic in-browser (`CodeReviewService`), so this is a complete free website deploy with service behavior.

---

## ▶️ Running the agent
### Start CLI (prints commands)
```bash
npm start
```

### Review a single file
```bash
npm run review -- file examples/sample-code.js
```

### Review a directory pattern
```bash
npm run review -- directory "src/**/*.js"
```

### Generate HTML report
```bash
npm run review -- report "src/**/*.js" -o report.html -f html
```

### List rules
```bash
npm run review -- rules
```

### Review a GitHub repository URL
```bash
# Public repo
npm run review -- github https://github.com/<owner>/<repo>.git

# Private repo (PAT from env)
GITHUB_TOKEN=<your_token> npm run review -- github https://github.com/<owner>/<repo>.git

# Private repo (explicit token)
npm run review -- github https://github.com/<owner>/<repo>.git -t <your_token>
```

### Watch files (if supported)
```bash
npm run review -- watch "src/**/*.js"
```

---

## 🧪 Output options
- `-f table` (default): readable terminal table
- `-f json`: machine-readable JSON
- `-f html`: browser-friendly report
- `-s <critical|high|medium|low|all>`: severity filter

### Example command
```bash
npm run review -- file src/index.js -f json -s high
```

---

## 🧭 Common violations checked
- `no-console` (e.g., `console.log` in production code)
- `no-unused-vars` (declared but unused identifiers)
- `high-complexity` (cyclomatic complexity threshold)
- `naming-convention` (camelCase / snake_case rules)
- `missing-error-handling` (`await` without `try/catch`)
- `comment-quality` (missing JSDoc-style comments)

---

## 🧩 Angular UI (Optional)
1. `cd ui`
2. `npm start`
3. Open `http://localhost:4200`

### UI features
- Code editor panel
- Real-time analysis and metrics
- Issues summary and filters
- Copy suggestions / clipboard actions

---

## 🗺️ Diagram (architecture)
```text
[User] -> [CLI: src/cli.js] -> [Agent: src/agent.js] -> [Rules Engine]
                                            \-> [formatter.js] -> [table/json/html]

[User] -> [Browser UI: ui/src/app] -> [CodeReviewService] -> [CLI/results API]
```

---

## 🔧 Scripts
- `npm start`: start agent greeting + usage
- `npm run review`: run code review CLI
- `npm test`: run tests (`node --test tests/**/*.test.js`)
- `npm run lint`: run ESLint
- `npm run format`: run Prettier

---

## 🧹 Maintenance
- Run `npm test` regularly
- Use `npm run lint` and `npm run format`
- Add rules in `src/agent.js` as required

---

## 🪝 Integration examples
1. Pre-commit hook (Husky): `npm run review -- directory "src/**/*.js" -s high`
2. GitHub Actions step:
```yaml
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
  with: node-version: '18'
- run: npm install
- run: npm run review -- directory "src/**/*.js" -f json > code-review.json
```

---

## 🐞 Troubleshooting
- `npm run review` missing: run `npm install`
- no issues found unexpectedly: verify glob pattern and file extensions
- HTML file not generated: verify `-o output.html` is provided

---

## 📌 Note
This document is now the single source of truth. All previous markdown files were removed to avoid duplication.
