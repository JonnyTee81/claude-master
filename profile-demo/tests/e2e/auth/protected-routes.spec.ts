import { test, expect } from '../../fixtures/auth'

test.describe('Protected Routes (with Auth Fixture)', () => {
  test('authenticated user can view profile', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/profile')
    await expect(authenticatedPage).toHaveURL('/dashboard/profile')
  })

  test('authenticated user can view settings', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard/settings')
    await expect(authenticatedPage).toHaveURL('/dashboard/settings')
  })

  test('authenticated user can access dashboard', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard')
    await expect(authenticatedPage).toHaveURL('/dashboard')
    await expect(authenticatedPage.locator('text=user@example.com')).toBeVisible()
  })
})
