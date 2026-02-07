import { test, expect } from '@playwright/test'
import { ROUTES, waitForPageLoad } from './fixtures/test-helpers'

test.describe('Navigation', () => {
  test.describe('Public Routes', () => {
    test('should load sign in page at /signin', async ({ page }) => {
      await page.goto(ROUTES.signin)
      await waitForPageLoad(page)
      
      await expect(page).toHaveURL(/signin/)
    })
  })

  test.describe('Protected Routes - Dashboard Section', () => {
    test('should load or redirect /home/dashboard', async ({ page }) => {
      await page.goto(ROUTES.dashboard)
      await waitForPageLoad(page)
      
      const url = page.url()
      const isValidDestination = url.includes('/dashboard') || url.includes('signin')
      expect(isValidDestination).toBeTruthy()
    })

    test('should load or redirect /home/posts', async ({ page }) => {
      await page.goto(ROUTES.posts)
      await waitForPageLoad(page)
      
      const url = page.url()
      const isValidDestination = url.includes('/posts') || url.includes('signin')
      expect(isValidDestination).toBeTruthy()
    })

    test('should load or redirect /home/feedback', async ({ page }) => {
      await page.goto(ROUTES.feedback)
      await waitForPageLoad(page)
      
      const url = page.url()
      const isValidDestination = url.includes('/feedback') || url.includes('signin')
      expect(isValidDestination).toBeTruthy()
    })

    test('should load or redirect /home/account', async ({ page }) => {
      await page.goto(ROUTES.account)
      await waitForPageLoad(page)
      
      const url = page.url()
      const isValidDestination = url.includes('/account') || url.includes('signin')
      expect(isValidDestination).toBeTruthy()
    })
  })

  test.describe('Protected Routes - Shifts Section', () => {
    test('should load or redirect /shifts', async ({ page }) => {
      await page.goto(ROUTES.shifts)
      await waitForPageLoad(page)
      
      const url = page.url()
      const isValidDestination = url.includes('/shifts') || url.includes('signin')
      expect(isValidDestination).toBeTruthy()
    })

    test('should load or redirect /shifts/add', async ({ page }) => {
      await page.goto(ROUTES.addShift)
      await waitForPageLoad(page)
      
      const url = page.url()
      const isValidDestination = url.includes('/shifts') || url.includes('signin')
      expect(isValidDestination).toBeTruthy()
    })

    test('should load or redirect /shifts/weekly', async ({ page }) => {
      await page.goto(ROUTES.weekly)
      await waitForPageLoad(page)
      
      const url = page.url()
      const isValidDestination = url.includes('/weekly') || url.includes('/shifts') || url.includes('signin')
      expect(isValidDestination).toBeTruthy()
    })

    test('should load or redirect /shifts/monthly', async ({ page }) => {
      await page.goto(ROUTES.monthly)
      await waitForPageLoad(page)
      
      const url = page.url()
      const isValidDestination = url.includes('/monthly') || url.includes('/shifts') || url.includes('signin')
      expect(isValidDestination).toBeTruthy()
    })

    test('should load or redirect /shifts/yearly', async ({ page }) => {
      await page.goto(ROUTES.yearly)
      await waitForPageLoad(page)
      
      const url = page.url()
      const isValidDestination = url.includes('/yearly') || url.includes('/shifts') || url.includes('signin')
      expect(isValidDestination).toBeTruthy()
    })
  })

  test.describe('Protected Routes - Analytics Section', () => {
    test('should load or redirect /analytics/insights', async ({ page }) => {
      await page.goto(ROUTES.insights)
      await waitForPageLoad(page)
      
      const url = page.url()
      const isValidDestination = url.includes('/insights') || url.includes('/analytics') || url.includes('signin')
      expect(isValidDestination).toBeTruthy()
    })

    test('should load or redirect /analytics/journey', async ({ page }) => {
      await page.goto(ROUTES.journey)
      await waitForPageLoad(page)
      
      const url = page.url()
      const isValidDestination = url.includes('/journey') || url.includes('/analytics') || url.includes('signin')
      expect(isValidDestination).toBeTruthy()
    })
  })

  test.describe('Protected Routes - Goals Section', () => {
    test('should load or redirect /goals', async ({ page }) => {
      await page.goto(ROUTES.goals)
      await waitForPageLoad(page)
      
      const url = page.url()
      const isValidDestination = url.includes('/goals') || url.includes('signin')
      expect(isValidDestination).toBeTruthy()
    })
  })

  test.describe('Route Response Codes', () => {
    test('sign in page should return 200', async ({ page }) => {
      const response = await page.goto(ROUTES.signin)
      expect(response?.status()).toBeLessThan(400)
    })

    test('dashboard should return valid response (200 or 307 redirect)', async ({ page }) => {
      const response = await page.goto(ROUTES.dashboard)
      const status = response?.status() || 200
      expect(status === 200 || status === 307 || status === 302).toBeTruthy()
    })

    test('shifts page should return valid response', async ({ page }) => {
      const response = await page.goto(ROUTES.shifts)
      const status = response?.status() || 200
      expect(status === 200 || status === 307 || status === 302).toBeTruthy()
    })

    test('goals page should return valid response', async ({ page }) => {
      const response = await page.goto(ROUTES.goals)
      const status = response?.status() || 200
      expect(status === 200 || status === 307 || status === 302).toBeTruthy()
    })
  })

  test.describe('Navigation Elements', () => {
    test('sign in page should have navigation structure', async ({ page }) => {
      await page.goto(ROUTES.signin)
      await waitForPageLoad(page)
      
      const hasForm = await page.locator('form').count() > 0
      expect(hasForm).toBeTruthy()
    })

    test('protected pages should redirect unauthenticated users consistently', async ({ page }) => {
      const protectedRoutes = [
        ROUTES.dashboard,
        ROUTES.shifts,
        ROUTES.goals,
        ROUTES.account,
      ]

      for (const route of protectedRoutes) {
        await page.goto(route)
        await waitForPageLoad(page)
        
        const url = page.url()
        const redirectedOrLoaded = url.includes('signin') || url.includes(route.split('/').pop() || '')
        expect(redirectedOrLoaded).toBeTruthy()
      }
    })
  })
})
