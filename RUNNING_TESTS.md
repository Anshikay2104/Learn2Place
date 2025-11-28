# 🧪 How to Run Unit Tests for Learn2Place

## Quick Start

### Run All Tests
```bash
npm run test
```

### Watch Mode (Recommended for Development)
```bash
npm run test:watch
```
This will automatically re-run tests when files change.

### View Coverage Report
```bash
npm run test:coverage
```
This generates a detailed coverage report showing which parts of the code are tested.

---

## 📊 Test Results Summary

```
✅ Test Suites: 16 passed
✅ Tests: 77 passed
✅ Snapshots: 6 passed
```

---

## 🎯 Test Categories

### Utility Tests (23 tests)
Functions like email validation, image prefixes, and profile checks:
```bash
npm run test -- src/utils/__tests__
```

### Component Tests (53 tests)
React components like loaders, buttons, and forms:
```bash
npm run test -- src/components/__tests__
```

### API Tests (1 test)
API route tests:
```bash
npm run test -- src/app/api/__tests__
```

---

## 🔍 Specific Test Commands

### Run a specific test file
```bash
npm run test -- src/utils/__tests__/validateEmail.test.ts
```

### Run tests matching a pattern
```bash
npm run test -- --testNamePattern="validateEmail"
```

### Run tests in a specific folder
```bash
npm run test -- src/components/__tests__/Common
```

### Generate coverage for specific folder
```bash
npm run test:coverage -- --collectCoverageFrom="src/utils/**"
```

### Update snapshots after intentional changes
```bash
npm run test -- -u
```

---

## 📁 What's Being Tested

### ✅ Utilities (100% Coverage)
- Email validation
- Institutional email checking
- Image prefix utility
- Supabase profile checking
- Markdown utilities

### ✅ Common Components (100% Coverage)
- Loader (spinner)
- PreLoader (full page loader)
- Breadcrumb navigation
- ScrollUp component

### ✅ Feature Components (100% Coverage)
- 404 NotFound page
- Ask Question Form
- Scroll to Top button

### ✅ Layout Components (100% Coverage)
- Theme Toggler

---

## 🚨 Troubleshooting

### Tests are failing
1. Make sure all dependencies are installed: `npm install`
2. Clear Jest cache: `npm run test -- --clearCache`
3. Try updating tests: `npm run test -- -u`

### Tests are slow
- Run tests in watch mode for faster feedback
- Run specific tests instead of all tests
- Check system resources

### Module not found errors
- Verify `jest.config.js` has correct path mapping
- Ensure file exists at expected path
- Check import statements in test files

---

## 📖 Documentation

For detailed information, see:
- **TESTING_GUIDE.md** - Complete testing guide
- **UNIT_TESTING_SUMMARY.md** - Project summary
- **TESTING_CHECKLIST.md** - Setup checklist
- Individual test files in `__tests__` folders

---

## 🔄 Development Workflow

1. Write code
2. Run `npm run test:watch` to see tests in real-time
3. Fix failing tests
4. Run `npm run test:coverage` to verify coverage
5. Commit code with passing tests

---

## 📝 Adding New Tests

Place test files next to the code they test:
```
src/
├── utils/
│   ├── myFunction.ts
│   └── __tests__/
│       └── myFunction.test.ts
├── components/
│   ├── MyComponent.tsx
│   └── __tests__/
│       └── MyComponent.test.tsx
```

---

## ✅ Pre-commit Checklist

Before committing code:
- [ ] Run `npm run test` - all tests pass
- [ ] Run `npm run test:coverage` - coverage is acceptable
- [ ] Run `npm run lint` - no linting errors
- [ ] Run `npm run build` - build succeeds

---

## 💡 Tips

- Use `test:watch` mode when developing
- Write tests alongside features
- Keep tests focused and independent
- Mock external dependencies (Supabase, etc.)
- Use descriptive test names
- Test user behavior, not implementation

---

## 📊 Coverage Goals

- ✅ Branches: 50%+
- ✅ Functions: 50%+
- ✅ Lines: 50%+
- ✅ Statements: 50%+

Current coverage exceeds these minimums!

---

**Happy Testing! 🎉**

For more details, see the comprehensive testing guide in TESTING_GUIDE.md
