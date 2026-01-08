import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {
  test.describe('Happy Path', () => {
    test('user can log in with valid credentials', async ({ page }) => {
      await page.goto('/login')

      await page.fill('input[name="email"]', 'user@example.com')
      await page.fill('input[name="password"]', 'CorrectPassword123!')

      await page.click('button[type="submit"]')

      // Should redirect to dashboard
      await expect(page).toHaveURL('/dashboard')

      // Should show user-specific content
      await expect(page.locator('text=user@example.com')).toBeVisible()
    })

    test('session persists after page refresh', async ({ page }) => {
      // Log in
      await page.goto('/login')
      await page.fill('input[name="email"]', 'user@example.com')
      await page.fill('input[name="password"]', 'Password123!')
      await page.click('button[type="submit"]')
      await expect(page).toHaveURL('/dashboard')

      // Refresh page
      await page.reload()

      // Should still be logged in
      await expect(page).toHaveURL('/dashboard')
      await expect(page.locator('text=user@example.com')).toBeVisible()
    })

    test('session persists in new tab', async ({ context, page }) => {
      // Log in
      await page.goto('/login')
      await page.fill('input[name="email"]', 'user@example.com')
      await page.fill('input[name="password"]', 'Password123!')
      await page.click('button[type="submit"]')
      await expect(page).toHaveURL('/dashboard')

      // Open new tab
      const newPage = await context.newPage()
      await newPage.goto('/dashboard')

      // Should be logged in automatically
      await expect(newPage).toHaveURL('/dashboard')
    })
  })

  test.describe('Error Handling', () => {
    test('shows error for invalid password', async ({ page }) => {
      await page.goto('/login')

      await page.fill('input[name="email"]', 'user@example.com')
      await page.fill('input[name="password"]', 'WrongPassword!')

      await page.click('button[type="submit"]')

      // Should show error message
      await expect(page.locator('text=/invalid credentials|incorrect password/i')).toBeVisible()

      // Should NOT redirect
      await expect(page).toHaveURL('/login')

      // Should keep email filled (UX best practice)
      await expect(page.locator('input[name="email"]')).toHaveValue('user@example.com')
    })

    test('shows error for non-existent user', async ({ page }) => {
      await page.goto('/login')

      await page.fill('input[name="email"]', 'nonexistent@example.com')
      await page.fill('input[name="password"]', 'SomePassword123!')

      await page.click('button[type="submit"]')

      await expect(page.locator('text=/invalid credentials|user not found/i')).toBeVisible()
    })

    test('handles network error gracefully', async ({ page, context }) => {
      // Mock API failure
      await context.route('**/api/auth/**', route => {
        route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) })
      })

      await page.goto('/login')
      await page.fill('input[name="email"]', 'user@example.com')
      await page.fill('input[name="password"]', 'Password123!')
      await page.click('button[type="submit"]')

      await expect(page.locator('text=/network error|something went wrong/i')).toBeVisible()
    })
  })

  test.describe('Form Validation', () => {
    test('validates required fields', async ({ page }) => {
      await page.goto('/login')

      // Try to submit empty form
      await page.click('button[type="submit"]')

      await expect(page.locator('text=/email is required/i')).toBeVisible()
      await expect(page.locator('text=/password is required/i')).toBeVisible()
    })

    test('validates email format', async ({ page }) => {
      await page.goto('/login')

      await page.fill('input[name="email"]', 'not-an-email')
      await page.fill('input[name="password"]', 'Password123!')

      await page.click('button[type="submit"]')

      await expect(page.locator('text=/invalid email/i')).toBeVisible()
    })

    test('shows loading state during login', async ({ page }) => {
      await page.goto('/login')

      await page.fill('input[name="email"]', 'user@example.com')
      await page.fill('input[name="password"]', 'Password123!')

      // Click submit and immediately check for loading state
      const submitButton = page.locator('button[type="submit"]')
      await submitButton.click()

      // Should show loading (disabled button or spinner)
      await expect(submitButton).toBeDisabled()
    })
  })

  test.describe('Protected Routes', () => {
    test('redirects unauthenticated users to login', async ({ page }) => {
      await page.goto('/dashboard')

      // Should redirect to login
      await expect(page).toHaveURL('/login')
    })

    test('returns to intended page after login', async ({ page }) => {
      // Try to access protected page
      await page.goto('/dashboard/profile')

      // Redirects to login
      await expect(page).toHaveURL(/\/login/)

      // Log in
      await page.fill('input[name="email"]', 'user@example.com')
      await page.fill('input[name="password"]', 'Password123!')
      await page.click('button[type="submit"]')

      // Should redirect back to originally requested page
      await expect(page).toHaveURL('/dashboard/profile')
    })

    test('authenticated user can access dashboard', async ({ page }) => {
      // Login first
      await page.goto('/login')
      await page.fill('input[name="email"]', 'user@example.com')
      await page.fill('input[name="password"]', 'Password123!')
      await page.click('button[type="submit"]')

      // Now can access dashboard
      await page.goto('/dashboard')
      await expect(page).toHaveURL('/dashboard')
    })
  })

  test.describe('Logout Flow', () => {
    test('user can log out', async ({ page }) => {
      // Log in first
      await page.goto('/login')
      await page.fill('input[name="email"]', 'user@example.com')
      await page.fill('input[name="password"]', 'Password123!')
      await page.click('button[type="submit"]')
      await expect(page).toHaveURL('/dashboard')

      // Log out
      await page.click('button:has-text("Log out")')

      // Should redirect to home or login
      await expect(page).toHaveURL(/\/|\/login/)

      // Trying to access dashboard should redirect to login
      await page.goto('/dashboard')
      await expect(page).toHaveURL('/login')
    })

    test('logout clears session completely', async ({ page }) => {
      // Log in
      await page.goto('/login')
      await page.fill('input[name="email"]', 'user@example.com')
      await page.fill('input[name="password"]', 'Password123!')
      await page.click('button[type="submit"]')
      await expect(page).toHaveURL('/dashboard')

      // Log out
      await page.click('button:has-text("Log out")')

      // Refresh page
      await page.reload()

      // Should still be logged out
      await page.goto('/dashboard')
      await expect(page).toHaveURL('/login')
    })
  })

  test.describe('User Experience', () => {
    test('already logged-in users redirected from login page', async ({ page }) => {
      // Log in first
      await page.goto('/login')
      await page.fill('input[name="email"]', 'user@example.com')
      await page.fill('input[name="password"]', 'Password123!')
      await page.click('button[type="submit"]')
      await expect(page).toHaveURL('/dashboard')

      // Try to go back to login
      await page.goto('/login')

      // Should redirect to dashboard (already logged in)
      await expect(page).toHaveURL('/dashboard')
    })

    test('password reset link is visible', async ({ page }) => {
      await page.goto('/login')

      await expect(page.locator('a[href="/forgot-password"]')).toBeVisible()
    })

    test('can navigate to signup page', async ({ page }) => {
      await page.goto('/login')

      await page.click('a:has-text("Sign up")')

      await expect(page).toHaveURL('/signup')
    })
  })

  test.describe('Security', () => {
    test.skip('blocks login after too many failed attempts', async ({ page }) => {
      // Note: This test is skipped by default as it requires rate limiting to be implemented
      await page.goto('/login')

      // Try logging in 5 times with wrong password
      for (let i = 0; i < 5; i++) {
        await page.fill('input[name="email"]', 'user@example.com')
        await page.fill('input[name="password"]', 'WrongPassword!')
        await page.click('button[type="submit"]')
        await page.waitForTimeout(500)
      }

      // Next attempt should show rate limit error
      await page.fill('input[name="email"]', 'user@example.com')
      await page.fill('input[name="password"]', 'WrongPassword!')
      await page.click('button[type="submit"]')

      await expect(page.locator('text=/too many attempts|rate limit/i')).toBeVisible()
    })

    test('password field is type=password', async ({ page }) => {
      await page.goto('/login')

      const passwordInput = page.locator('input[name="password"]')
      await expect(passwordInput).toHaveAttribute('type', 'password')
    })
  })
})
