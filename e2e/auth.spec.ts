import { test, expect } from '@playwright/test'
import { selectors, ROUTES, waitForPageLoad, navigateToSignIn } from './fixtures/test-helpers'

test.describe('Authentication', () => {
  test.describe('Sign In Page', () => {
    test('should load sign in page', async ({ page }) => {
      await navigateToSignIn(page)
      
      await expect(page).toHaveURL(/signin/)
    })

    test('should display email input', async ({ page }) => {
      await navigateToSignIn(page)
      
      const emailInput = page.locator(selectors.auth.emailInput)
      await expect(emailInput).toBeVisible()
    })

    test('should display password input', async ({ page }) => {
      await navigateToSignIn(page)
      
      const passwordInput = page.locator(selectors.auth.passwordInput)
      await expect(passwordInput).toBeVisible()
    })

    test('should display sign in button', async ({ page }) => {
      await navigateToSignIn(page)
      
      const signInButton = page.locator(selectors.auth.signInButton)
      await expect(signInButton).toBeVisible()
    })

    test('should show validation error for empty email', async ({ page }) => {
      await navigateToSignIn(page)
      
      const signInButton = page.locator(selectors.auth.signInButton)
      await signInButton.click()
      
      const emailInput = page.locator(selectors.auth.emailInput)
      await expect(emailInput).toHaveAttribute('required', '')
    })

    test('should show validation error for invalid email format', async ({ page }) => {
      await navigateToSignIn(page)
      
      const emailInput = page.locator(selectors.auth.emailInput)
      await emailInput.fill('invalid-email')
      
      const signInButton = page.locator(selectors.auth.signInButton)
      await signInButton.click()
      
      const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid)
      expect(isInvalid).toBe(true)
    })

    test('should show validation error for empty password', async ({ page }) => {
      await navigateToSignIn(page)
      
      const emailInput = page.locator(selectors.auth.emailInput)
      await emailInput.fill('test@example.com')
      
      const signInButton = page.locator(selectors.auth.signInButton)
      await signInButton.click()
      
      const passwordInput = page.locator(selectors.auth.passwordInput)
      await expect(passwordInput).toHaveAttribute('required', '')
    })
  })

  test.describe('Password Reset', () => {
    test('should display forgot password link', async ({ page }) => {
      await navigateToSignIn(page)
      
      const forgotPasswordLink = page.locator(selectors.auth.forgotPasswordLink)
      await expect(forgotPasswordLink).toBeVisible()
    })

    test('should navigate to password reset page when forgot password clicked', async ({ page }) => {
      await navigateToSignIn(page)
      
      const forgotPasswordLink = page.locator(selectors.auth.forgotPasswordLink)
      await forgotPasswordLink.click()
      
      await waitForPageLoad(page)
      
      await expect(page).toHaveURL(/forgot-password|reset/)
    })
  })

  test.describe('Sign Out', () => {
    test('unauthenticated user navigating to protected route should redirect to sign in', async ({ page }) => {
      await page.goto(ROUTES.dashboard)
      await waitForPageLoad(page)
      
      await expect(page).toHaveURL(/signin/)
    })
  })
})
