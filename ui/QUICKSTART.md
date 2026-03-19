# Angular UI - Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Install Dependencies
```bash
cd ui
npm install
```

### Step 2: Start Development Server
```bash
npm start
```

### Step 3: Open in Browser
Navigate to: `http://localhost:4200/`

## ✨ What You'll See

- **Left Side**: Code Editor with example JavaScript code
- **Right Side**: 
  - Quality Metrics Dashboard
  - Severity Filters
  - Issues List

## 💡 Try It Out

1. **Review Example Code**
   - The editor comes with sample code containing various issues
   - Click "Review Code" button
   - Issues will appear on the right side

2. **Load New Example**
   - Click "Example" button to load different sample code
   - See different types of issues

3. **Clear and Test**
   - Click "Clear" to remove code
   - Paste your own JavaScript code
   - Click "Review Code"

## 📊 Understanding Results

### Quality Score
- **90-100**: Excellent  ⭐
- **80-89**: Good ✅
- **70-79**: Average ⚠️
- **60-69**: Fair ⚠️
- **Below 60**: Needs Work ❌

### Severity Levels
- 🔴 **Critical**: Must fix immediately
- 🟠 **High**: Significant issues
- 🟡 **Medium**: Should fix soon
- 🔵 **Low**: Nice to fix

## 🎮 Features to Explore

1. **Expand Issues**
   - Click on any issue to see details
   - View file location and line number
   - Read suggestions for fixes
   - Copy suggestions to clipboard

2. **Filter Issues**
   - Click severity buttons to filter
   - "All" shows all issues
   - Specific severity shows only those

3. **Monitor Metrics**
   - Watch quality score update
   - See issue breakdown by severity
   - Get recommendations

## 🛠️ Useful Commands

```bash
# Development server
npm start

# Production build
npm run build

# Run tests
npm test

# Check linting
npm run lint
```

## 📁 Project Structure

```
ui/
├── src/
│   ├── app/
│   │   ├── components/    # UI components
│   │   ├── services/      # Code review logic
│   │   ├── models/        # TypeScript types
│   │   └── app.component  # Root component
│   ├── styles.css         # Global styles
│   ├── main.ts            # Bootstrap
│   └── index.html         # Main page
├── ng serve will be running on: http://localhost:4200
```

## 🎨 What's Included

- ✅ Beautiful dark theme UI
- ✅ Real-time code analysis
- ✅ Interactive issue list
- ✅ Quality metrics dashboard
- ✅ Severity filtering
- ✅ Responsive design
- ✅ Copy-to-clipboard functionality
- ✅ Loading states
- ✅ Error handling

## 🔍 Example Workflow

1. **Open the app** → `http://localhost:4200/`
2. **Click "Example"** → Load sample code
3. **Click "Review Code"** → Analyze the code
4. **View Issues** → See all detected problems
5. **Check Metrics** → View quality score
6. **Filter** → Try different severity filters
7. **Expand Issues** → Click to see details
8. **Copy Suggestion** → Click clipboard icon

## 🚨 Common Issues

### Port 4200 Already in Use
```bash
ng serve --port 4300
# Then open http://localhost:4300/
```

### Dependencies Not Installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### Changes Not Showing
The app auto-reloads. If not:
```bash
# Stop the server with Ctrl+C
# Start again
npm start
```

## 📝 Sample Code Issues Detected

The example code includes:
- ✓ Console statements
- ✓ Unused variables
- ✓ Snake_case naming
- ✓ Missing error handling
- ✓ Complex functions
- ✓ Missing documentation

## 🎯 Next Steps

1. **Customize Colors**: Edit `src/styles.css`
2. **Add Rules**: Modify `CodeReviewService`
3. **Connect Backend**: Update API URL in `services/`
4. **Deploy**: Run `npm run build`

## 📖 Full Documentation

See `README.md` for comprehensive documentation, API reference, and advanced features.

## ❓ Need Help?

- Check the browser console for errors (F12)
- Ensure Node.js 18+ is installed
- Verify npm packages installed correctly
- Check internet connection

---

**Enjoy your beautiful code review UI! 🎉**
