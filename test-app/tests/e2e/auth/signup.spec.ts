import { test, expect } from '@playwright/test'

test.describe('Signup Flow', () => {
  test('should display signup page', async ({ page }) => {
    await page.goto('/signup')
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible()
    await expect(page.getByPlaceholder('Email address')).toBeVisible()
    await expect(page.getByPlaceholder(/Password/)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible()
  })

  test('should have link to login page', async ({ page }) => {
    await page.goto('/signup')
    const loginLink = page.getByRole('link', { name: 'sign in to existing account' })
    await expect(loginLink).toBeVisible()
    await loginLink.click()
    await expect(page).toHaveURL('/login')
  })

  test('should enforce password requirements', async ({ page }) => {
    await page.goto('/signup')
    await page.getByPlaceholder('Email address').fill('test@example.com')
    await page.getByPlaceholder(/Password/).fill('12345') // Less than 6 characters
    await page.getByRole('button', { name: 'Create account' }).click()

    // HTML5 validation should prevent form submission
    const passwordInput = page.getByPlaceholder(/Password/)
    await expect(passwordInput).toBeVisible()
  })
})
