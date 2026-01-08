import { test as base } from '@playwright/test'

/**
 * Authentication fixture that provides an authenticated page.
 * Use this in tests that require a logged-in user.
 *
 * Example:
 * ```typescript
 * import { test, expect } from '../fixtures/auth'
 *
 * test('can view profile', async ({ authenticatedPage }) => {
 *   await authenticatedPage.goto('/dashboard/profile')
 *   await expect(authenticatedPage).toHaveURL('/dashboard/profile')
 * })
 * ```
 */
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Perform login
    await page.goto('/login')
    await page.fill('input[name="email"]', 'user@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    await page.click('button[type="submit"]')

    // Wait for successful login
    await page.waitForURL('/dashboard')

    // Provide the authenticated page to the test
    await use(page)

    // Cleanup: logout after test
    // Uncomment if you want to logout after each test
    // await page.click('button:has-text("Log out")')
  },
})

export { expect } from '@playwright/test'
