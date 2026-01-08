---
name: test-everything
description: Write comprehensive tests for Next.js applications using Playwright for E2E and Vitest for unit/integration tests. Use when adding features, fixing bugs, or improving test coverage.
---

# Test Everything - Testing Strategy

You are an expert at writing comprehensive, meaningful tests for Next.js applications.

## Testing Philosophy

- **Test user behavior, not implementation**
- **Write tests that give confidence**
- **Avoid tests that test nothing** (over-mocked tests)
- **Test critical paths first** (auth, payments, data mutations)
- **Make tests readable** - Future you should understand them

## Testing Stack

- **Playwright** - E2E and integration tests
- **Vitest** - Unit tests (optional, for complex logic)
- **Testing Library** - Component testing (if needed)

## Test Structure
```
/tests
  /e2e              # End-to-end tests
    /auth           # Authentication flows
    /features       # Feature-specific tests
  /integration      # Integration tests
  /unit             # Unit tests (rarely needed)
  
/playwright.config.ts
/vitest.config.ts
```

## Playwright Setup
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Critical Test Patterns

### 1. Authentication Flow
```typescript
// tests/e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('user can sign up with email and password', async ({ page }) => {
    await page.goto('/signup')
    
    // Fill in form
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'SecurePass123!')
    await page.fill('input[name="confirmPassword"]', 'SecurePass123!')
    
    // Submit
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    
    // Should show user email
    await expect(page.locator('text=test@example.com')).toBeVisible()
  })
  
  test('user cannot sign up with invalid email', async ({ page }) => {
    await page.goto('/signup')
    
    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('input[name="password"]', 'SecurePass123!')
    
    await page.click('button[type="submit"]')
    
    // Should show error
    await expect(page.locator('text=/invalid email/i')).toBeVisible()
    
    // Should not redirect
    await expect(page).toHaveURL('/signup')
  })
  
  test('user can log in', async ({ page }) => {
    // Assume user already exists
    await page.goto('/login')
    
    await page.fill('input[name="email"]', 'existing@example.com')
    await page.fill('input[name="password"]', 'CorrectPassword123!')
    
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/dashboard')
  })
  
  test('user can log out', async ({ page }) => {
    // Log in first
    await page.goto('/login')
    await page.fill('input[name="email"]', 'existing@example.com')
    await page.fill('input[name="password"]', 'CorrectPassword123!')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
    
    // Log out
    await page.click('button:has-text("Log out")')
    
    // Should redirect to home
    await expect(page).toHaveURL('/')
    
    // Trying to access dashboard should redirect to login
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })
})
```

### 2. Protected Routes
```typescript
// tests/e2e/auth/protected-routes.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Protected Routes', () => {
  test('unauthenticated user cannot access dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Should redirect to login
    await expect(page).toHaveURL('/login')
  })
  
  test('authenticated user can access dashboard', async ({ page }) => {
    // Login helper (consider extracting to fixture)
    await page.goto('/login')
    await page.fill('input[name="email"]', 'user@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button[type="submit"]')
    
    // Now can access dashboard
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/dashboard')
  })
})
```

### 3. CRUD Operations
```typescript
// tests/e2e/features/todos.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Todo Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('input[name="email"]', 'user@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
    
    // Navigate to todos
    await page.click('a[href="/dashboard/todos"]')
  })
  
  test('user can create a todo', async ({ page }) => {
    await page.click('button:has-text("New Todo")')
    
    await page.fill('input[name="title"]', 'Buy groceries')
    await page.fill('textarea[name="description"]', 'Milk, eggs, bread')
    
    await page.click('button:has-text("Create")')
    
    // Should appear in list
    await expect(page.locator('text=Buy groceries')).toBeVisible()
  })
  
  test('user can complete a todo', async ({ page }) => {
    // Assume todo exists
    const todoItem = page.locator('[data-testid="todo-item"]').first()
    
    await todoItem.locator('input[type="checkbox"]').check()
    
    // Should show as completed
    await expect(todoItem).toHaveClass(/completed/)
  })
  
  test('user can delete a todo', async ({ page }) => {
    const todoItem = page.locator('[data-testid="todo-item"]').first()
    const todoText = await todoItem.locator('h3').textContent()
    
    await todoItem.locator('button[aria-label="Delete"]').click()
    
    // Confirm deletion
    await page.click('button:has-text("Confirm")')
    
    // Should be removed
    await expect(page.locator(`text=${todoText}`)).not.toBeVisible()
  })
})
```

### 4. Form Validation
```typescript
// tests/e2e/forms/validation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Form Validation', () => {
  test('shows error for required fields', async ({ page }) => {
    await page.goto('/signup')
    
    // Submit without filling
    await page.click('button[type="submit"]')
    
    // Should show errors
    await expect(page.locator('text=/email is required/i')).toBeVisible()
    await expect(page.locator('text=/password is required/i')).toBeVisible()
  })
  
  test('shows error for password mismatch', async ({ page }) => {
    await page.goto('/signup')
    
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.fill('input[name="confirmPassword"]', 'DifferentPassword!')
    
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=/passwords must match/i')).toBeVisible()
  })
})
```

### 5. Error Handling
```typescript
// tests/e2e/errors/error-handling.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Error Handling', () => {
  test('shows error message when API fails', async ({ page, context }) => {
    // Mock API failure
    await context.route('**/api/todos', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' })
      })
    })
    
    await page.goto('/dashboard/todos')
    
    await expect(page.locator('text=/error loading todos/i')).toBeVisible()
  })
  
  test('shows 404 page for non-existent routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist')
    
    await expect(page.locator('text=/404/i')).toBeVisible()
    await expect(page.locator('text=/page not found/i')).toBeVisible()
  })
})
```

## Test Helpers

### Authentication Fixture
```typescript
// tests/fixtures/auth.ts
import { test as base } from '@playwright/test'

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Login
    await page.goto('/login')
    await page.fill('input[name="email"]', 'user@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
    
    await use(page)
  },
})

export { expect } from '@playwright/test'
```

Usage:
```typescript
import { test, expect } from '../fixtures/auth'

test('authenticated user can view profile', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/dashboard/profile')
  await expect(authenticatedPage).toHaveURL('/dashboard/profile')
})
```

## Testing Server Actions
```typescript
// tests/e2e/actions/profile-update.spec.ts
import { test, expect } from '@playwright/test'

test('user can update profile', async ({ page }) => {
  // Login first
  await page.goto('/login')
  await page.fill('input[name="email"]', 'user@example.com')
  await page.fill('input[name="password"]', 'Password123!')
  await page.click('button[type="submit"]')
  
  // Go to profile
  await page.goto('/dashboard/profile')
  
  // Update username
  await page.fill('input[name="username"]', 'newusername')
  await page.click('button:has-text("Save")')
  
  // Should show success message
  await expect(page.locator('text=/profile updated/i')).toBeVisible()
  
  // Refresh and verify
  await page.reload()
  await expect(page.locator('input[name="username"]')).toHaveValue('newusername')
})
```

## Running Tests
```json
// package.json scripts
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:headed": "playwright test --headed"
  }
}
```

## CI/CD Integration
```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

## Test Coverage Goals

Focus on:
1. ✅ **Critical paths** (80%+ coverage)
   - Authentication flows
   - Payment flows (if applicable)
   - Data mutations
   
2. ✅ **User journeys** (most common paths)
   - Signup → Onboarding → First action
   - Login → Dashboard → Create item
   
3. ✅ **Edge cases** (error scenarios)
   - Invalid inputs
   - Network failures
   - Permission issues

Don't test:
- ❌ Third-party libraries (they have their own tests)
- ❌ Framework internals (Next.js, React)
- ❌ Styling/visual appearance (use visual regression testing tools for this)

## Best Practices

✅ **Do**:
- Use `data-testid` for complex selectors
- Write descriptive test names
- Test one thing per test
- Use `beforeEach` for common setup
- Clean up test data after tests
- Make tests independent (can run in any order)
- Test with realistic data

❌ **Don't**:
- Over-mock (test real behavior)
- Write tests that always pass
- Test implementation details
- Use brittle selectors (`.css-abc123`)
- Forget to test mobile views
- Skip error cases

## When to Write Tests

**Always**:
- Authentication flows
- Payment/checkout flows
- Data deletion operations
- Permission checks
- Critical business logic

**Usually**:
- CRUD operations
- Form submissions
- Search/filter functionality
- Navigation flows

**Sometimes**:
- UI components (if complex interaction)
- Utility functions (if complex logic)

**Rarely**:
- Simple presentational components
- Configuration files
- Type definitions

Remember: Tests should give you confidence to deploy, not just check boxes.