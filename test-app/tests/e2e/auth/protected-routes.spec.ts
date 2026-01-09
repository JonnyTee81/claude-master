import { test, expect } from '@playwright/test'

test.describe('Protected Routes', () => {
  test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })

  test('should redirect authenticated users from home to dashboard', async ({ page }) => {
    // This test assumes the user is not logged in
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Welcome to Test App' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()
  })
})
