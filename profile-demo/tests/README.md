# E2E Testing Guide

This directory contains end-to-end tests for the application using Playwright.

## Running Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all tests
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Run tests in debug mode
npm run test:e2e:debug

# Run specific test file
npx playwright test tests/e2e/auth/login.spec.ts

# Run tests in a specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Structure

```
tests/
├── e2e/
│   └── auth/
│       ├── login.spec.ts              # Login flow tests
│       └── protected-routes.spec.ts   # Protected route tests
├── fixtures/
│   └── auth.ts                        # Authentication helper fixture
└── README.md                          # This file
```

## Test Coverage

### Login Flow (`tests/e2e/auth/login.spec.ts`)

Tests cover:
- ✅ Successful login with valid credentials
- ✅ Session persistence after refresh
- ✅ Session sharing across tabs
- ✅ Error handling (invalid credentials, non-existent user, network errors)
- ✅ Form validation (required fields, email format)
- ✅ Loading states
- ✅ Protected route redirects
- ✅ Return to intended page after login
- ✅ Logout flow
- ✅ Already logged-in user redirects
- ✅ Navigation (password reset, signup links)
- ✅ Security (password field type, rate limiting)

### Protected Routes (`tests/e2e/auth/protected-routes.spec.ts`)

Tests using authentication fixture:
- ✅ Authenticated access to profile
- ✅ Authenticated access to settings
- ✅ Authenticated access to dashboard

## Using the Auth Fixture

The `auth.ts` fixture provides a pre-authenticated page for tests that require a logged-in user:

```typescript
import { test, expect } from '../../fixtures/auth'

test('can view profile', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/dashboard/profile')
  await expect(authenticatedPage).toHaveURL('/dashboard/profile')
})
```

This saves you from manually logging in at the start of every test.

## Writing New Tests

### 1. Create a new test file

```typescript
// tests/e2e/features/todos.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Todo Management', () => {
  test('user can create a todo', async ({ page }) => {
    // Your test here
  })
})
```

### 2. Use descriptive test names

✅ Good:
```typescript
test('user can create a todo with title and description', async ({ page }) => {
```

❌ Bad:
```typescript
test('create todo', async ({ page }) => {
```

### 3. Test user behavior, not implementation

✅ Good:
```typescript
await page.click('button:has-text("Delete")')
await expect(page.locator('text=Todo deleted')).toBeVisible()
```

❌ Bad:
```typescript
// Don't test internal state or implementation details
expect(component.state.todos.length).toBe(0)
```

### 4. Use data-testid for complex selectors

```html
<button data-testid="submit-button">Submit</button>
```

```typescript
await page.click('[data-testid="submit-button"]')
```

## Test Best Practices

1. **Independent tests** - Each test should work in isolation
2. **Clean state** - Don't rely on data from previous tests
3. **Realistic data** - Use real-looking test data
4. **Wait for elements** - Use Playwright's auto-waiting features
5. **Meaningful assertions** - Assert on user-visible outcomes

## Debugging Failed Tests

```bash
# Run with headed browser to see what's happening
npx playwright test --headed

# Run with debug mode
npm run test:e2e:debug

# Run specific test with trace
npx playwright test --trace on tests/e2e/auth/login.spec.ts

# View test report
npx playwright show-report
```

## CI/CD Integration

Tests run automatically on:
- Push to `main` branch
- Pull requests to `main` branch

See `.github/workflows/test.yml` for CI configuration.

## Environment Variables

For Supabase-connected tests, you may need:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Add these to:
- `.env.local` for local development
- GitHub Secrets for CI/CD

## Common Issues

### Tests fail with "Target closed"
- Increase timeout in `playwright.config.ts`
- Check if dev server is running

### Tests fail with "locator.click: Timeout"
- Element might not be visible
- Use `await page.waitForSelector()` if needed
- Check selector is correct

### Tests pass locally but fail in CI
- Different viewport sizes
- Timing issues (add proper waits)
- Missing environment variables

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Tests](https://playwright.dev/docs/debug)
