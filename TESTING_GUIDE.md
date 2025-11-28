# Complete Unit Testing Guide for Learn2Place

## Overview

This document provides a comprehensive guide to unit testing in the Learn2Place project using Jest and React Testing Library.

## Table of Contents

1. [Setup](#setup)
2. [Running Tests](#running-tests)
3. [Test Structure](#test-structure)
4. [Test Files](#test-files)
5. [Writing Tests](#writing-tests)
6. [Mocking Patterns](#mocking-patterns)
7. [Best Practices](#best-practices)
8. [Coverage Reports](#coverage-reports)

## Setup

### Prerequisites

All required dependencies have been installed:

```json
{
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/react": "^16.3.0",
  "@testing-library/user-event": "^14.6.1",
  "@types/jest": "^30.0.0",
  "jest": "^30.2.0",
  "jest-environment-jsdom": "^30.2.0",
  "ts-node": "^10.9.2"
}
```

### Configuration Files

- **jest.config.js**: Main Jest configuration
- **jest.setup.js**: Global test setup and mocks

## Running Tests

### All Tests (Once)

```bash
npm run test
```

### Watch Mode (Re-run on file changes)

```bash
npm run test:watch
```

### Coverage Report

```bash
npm run test:coverage
```

### Specific Test File

```bash
npm run test -- --testPathPattern="validateEmail"
```

### Specific Test Suite

```bash
npm run test -- --testNamePattern="validateEmail"
```

### Coverage for Specific Folder

```bash
npm run test -- --coverage --collectCoverageFrom="src/utils/**"
```

## Test Structure

### Directory Organization

```
src/
├── utils/
│   ├── __tests__/
│   │   ├── validateEmail.test.ts
│   │   ├── util.test.ts
│   │   ├── checkStudentInstitutionalEmail.test.ts
│   │   ├── checkProfileExists.test.ts
│   │   ├── emailValidation.integration.test.ts
│   │   └── markdown.test.ts
│   ├── validateEmail.ts
│   ├── util.ts
│   └── ...
├── components/
│   ├── __tests__/
│   │   ├── Common/
│   │   │   ├── Loader.test.tsx
│   │   │   ├── PreLoader.test.tsx
│   │   │   ├── Breadcrumb.test.tsx
│   │   │   └── ScrollUp.test.tsx
│   │   ├── NotFound/
│   │   │   └── NotFound.test.tsx
│   │   ├── Forum/
│   │   │   └── AskQuestionForm.test.tsx
│   │   ├── ScrollToTop/
│   │   │   └── ScrollToTop.test.tsx
│   │   ├── Layout/
│   │   │   └── ThemeToggler.test.tsx
│   │   └── README.md
│   └── ...
└── app/
    └── api/
        └── __tests__/
            └── questions.test.ts
```

## Test Files

### Utility Tests

#### 1. validateEmail.test.ts
Tests email validation logic:
- Valid email formats
- Invalid email formats
- Case insensitivity
- Edge cases (empty strings, spaces)

#### 2. util.test.ts
Tests utility functions:
- getImagePrefix() behavior in different environments (production, development, test)

#### 3. checkStudentInstitutionalEmail.test.ts
Tests institutional email validation:
- Modyuniversity email recognition
- Non-institutional email rejection
- Case insensitivity

#### 4. checkProfileExists.test.ts
Tests Supabase profile checking:
- Profile existence validation
- Email lowercasing
- Database error handling
- Null profile handling

#### 5. emailValidation.integration.test.ts
Integration tests for email validators working together

#### 6. markdown.test.ts
Tests markdown processing:
- Slug extraction
- Post sorting
- Field filtering

### Component Tests

#### Common Components

**Loader.test.tsx**
- Renders without crashing
- Has correct CSS classes
- Animation classes present

**PreLoader.test.tsx**
- Full screen coverage
- Centered positioning
- Spinner animation

**Breadcrumb.test.tsx**
- Displays page name and description
- Renders home link
- Shows breadcrumb separator

**ScrollUp.test.tsx**
- Scrolls to top on mount
- Uses scrollingElement correctly

#### Layout Components

**ThemeToggler.test.tsx**
- Renders theme toggle button
- Has accessibility attributes
- Renders SVG icon

#### Feature Components

**AskQuestionForm.test.tsx**
- Shows loading state initially
- Displays sign-in message for unauthenticated users
- Enables form for authenticated users
- Handles form submission
- Shows error messages on failure

**ScrollToTop.test.tsx**
- Hides on initial render
- Shows after scrolling past 300px
- Hides when scrolling back up
- Smoothly scrolls to top
- Cleans up event listeners

**NotFound.test.tsx**
- Displays 404 message
- Shows helpful description
- Renders home link
- Shows 404 image

## Writing Tests

### Basic Test Structure

```typescript
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('should render without crashing', () => {
    const { container } = render(<MyComponent />)
    expect(container).toBeInTheDocument()
  })

  it('should display title', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Title')).toBeInTheDocument()
  })
})
```

### Testing User Interactions

```typescript
import userEvent from '@testing-library/user-event'

it('should update input on type', async () => {
  const user = userEvent.setup()
  render(<MyComponent />)
  
  const input = screen.getByPlaceholderText('Enter text')
  await user.type(input, 'test text')
  
  expect(input).toHaveValue('test text')
})
```

### Testing Async Operations

```typescript
import { waitFor } from '@testing-library/react'

it('should load data', async () => {
  render(<MyComponent />)
  
  await waitFor(() => {
    expect(screen.getByText('Loaded Data')).toBeInTheDocument()
  })
})
```

## Mocking Patterns

### Mocking Supabase

```typescript
jest.mock('@/utils/supabase/client', () => ({
  createSupabaseBrowserClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  })),
}))
```

### Mocking Next.js Router

```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))
```

### Mocking Next.js Image

```typescript
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}))
```

### Mocking Next.js Link

```typescript
jest.mock('next/link', () => {
  return ({ children, href }) => (
    <a href={href}>{children}</a>
  )
})
```

## Best Practices

### 1. Test Naming
- Use descriptive names that explain what is being tested
- Use "should" in test names for clarity
- Group related tests with `describe` blocks

```typescript
describe('validateEmail', () => {
  it('should validate correct email addresses', () => {
    // test code
  })
})
```

### 2. Isolation
- Each test should be independent
- Use `beforeEach` and `afterEach` for setup/cleanup
- Don't rely on test execution order

```typescript
beforeEach(() => {
  jest.clearAllMocks()
})

afterEach(() => {
  jest.restoreAllMocks()
})
```

### 3. User-Centric Testing
- Prefer `screen.getByRole()` and `screen.getByText()`
- Avoid testing implementation details
- Test what users see and do

```typescript
// Good
const button = screen.getByRole('button', { name: /submit/i })

// Avoid
const button = container.querySelector('button.submit-btn')
```

### 4. Arrange-Act-Assert Pattern
- Arrange: Set up test data and conditions
- Act: Perform the action
- Assert: Verify the result

```typescript
it('should submit form', async () => {
  // Arrange
  const user = userEvent.setup()
  render(<Form />)
  
  // Act
  const input = screen.getByPlaceholderText('Name')
  await user.type(input, 'John')
  await user.click(screen.getByRole('button'))
  
  // Assert
  expect(screen.getByText('Success')).toBeInTheDocument()
})
```

### 5. Avoid Common Mistakes
- Don't test implementation details
- Don't use `act()` with waitFor
- Don't test library code
- Use `data-testid` sparingly

## Coverage Reports

### View Coverage
```bash
npm run test:coverage
```

### Generate HTML Report
```bash
npm run test:coverage -- --collectCoverageFrom="src/**" --verbose
```

### Coverage Thresholds

The project has the following coverage thresholds:
- Branches: 50%
- Functions: 50%
- Lines: 50%
- Statements: 50%

To view coverage by file:
```bash
npm run test:coverage -- --collectCoverageFrom="src/utils/**"
```

## Tips & Tricks

### Debug Tests
```typescript
import { screen, debug } from '@testing-library/react'

it('should render', () => {
  render(<MyComponent />)
  debug() // Prints DOM
})
```

### Test One File
```bash
npm run test -- src/utils/__tests__/validateEmail.test.ts
```

### Update Snapshots
```bash
npm run test -- -u
```

### Skip Tests
```typescript
describe.skip('Skipped suite', () => {
  it.skip('should skip this test', () => {})
})
```

### Focus on One Test
```typescript
it.only('should run only this test', () => {})
```

## Next Steps

1. **Add more component tests** for Home, Documentation, and Profile components
2. **Add E2E tests** using Cypress or Playwright
3. **Increase coverage** to 80%+
4. **Add snapshot tests** for UI components
5. **Set up CI/CD** to run tests automatically

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library Docs](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Supabase Testing](https://supabase.com/docs)

## Troubleshooting

### Tests timeout
- Increase timeout: `jest.setTimeout(10000)`
- Check async/await usage

### Mock not working
- Ensure mock is before import
- Check mock path matches actual import

### Component not rendering
- Check for error boundaries
- Verify mocks are set up correctly
- Check console for errors

---

**Last Updated**: November 2025
**Coverage**: All major utilities and components
**Status**: Ready for development
