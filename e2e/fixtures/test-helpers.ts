import { Page, expect } from '@playwright/test'

/**
 * Common selectors used across tests
 */
export const selectors = {
  // Auth page selectors
  auth: {
    emailInput: 'input[type="email"]',
    passwordInput: 'input[type="password"]',
    signInButton: 'button[type="submit"]',
    forgotPasswordLink: 'a[href*="forgot-password"], a:has-text("Forgot password")',
    signOutButton: 'button:has-text("Sign out"), button:has-text("Log out")',
  },

  // Navigation selectors
  nav: {
    sidebar: '[data-testid="sidebar"], nav',
    menuItems: '[data-testid="menu-item"], nav a',
    homeLink: 'a[href*="/dashboard"], a[href="/home/dashboard"]',
    shiftsLink: 'a[href*="/shifts"]',
    analyticsLink: 'a[href*="/analytics"]',
    goalsLink: 'a[href*="/goals"]',
    accountLink: 'a[href*="/account"]',
  },

  // Dashboard selectors
  dashboard: {
    gamificationWidget: '[data-testid="gamification-widget"], [class*="gamification"]',
    yearlyGoalWidget: '[data-testid="yearly-goal"], [class*="goal"]',
    earningsCard: '[data-testid="earnings-card"], [class*="earnings"]',
    benefitsSection: '[data-testid="benefits"], [class*="benefits"]',
  },

  // Shift entry selectors
  shifts: {
    entryTypeSelect: '[data-testid="entry-type-select"], select[name="entry_type"]',
    dateInput: 'input[type="date"], [data-testid="date-input"]',
    addShiftButton: 'button:has-text("Add"), a[href*="/shifts/add"]',
    submitButton: 'button[type="submit"]',
  },
}

/**
 * Entry types that should be available in the shift entry selector
 */
export const SHIFT_ENTRY_TYPES = [
  'WORKED',
  'LEAVE',
  'VACATION',
  'STANDBY',
  'STAT HOLIDAY',
  'DAY OFF',
] as const

/**
 * Main navigation routes for the app
 */
export const ROUTES = {
  signin: '/signin',
  dashboard: '/home/dashboard',
  shifts: '/shifts',
  addShift: '/shifts/add',
  weekly: '/shifts/weekly',
  monthly: '/shifts/monthly',
  yearly: '/shifts/yearly',
  insights: '/analytics/insights',
  journey: '/analytics/journey',
  goals: '/goals',
  posts: '/home/posts',
  feedback: '/home/feedback',
  account: '/home/account',
} as const

/**
 * Navigation helpers
 */
export async function navigateTo(page: Page, route: string) {
  await page.goto(route)
  await page.waitForLoadState('networkidle')
}

export async function navigateToSignIn(page: Page) {
  await navigateTo(page, ROUTES.signin)
}

export async function navigateToDashboard(page: Page) {
  await navigateTo(page, ROUTES.dashboard)
}

export async function navigateToShifts(page: Page) {
  await navigateTo(page, ROUTES.shifts)
}

export async function navigateToAddShift(page: Page) {
  await navigateTo(page, ROUTES.addShift)
}

/**
 * Wait utilities
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('domcontentloaded')
  await page.waitForLoadState('networkidle')
}

export async function waitForElement(page: Page, selector: string, timeout = 10000) {
  await page.waitForSelector(selector, { timeout })
}

export async function waitForNavigation(page: Page, urlPattern: string | RegExp) {
  await page.waitForURL(urlPattern, { waitUntil: 'networkidle' })
}

/**
 * Assertion helpers
 */
export async function expectPageTitle(page: Page, title: string | RegExp) {
  await expect(page).toHaveTitle(title)
}

export async function expectURL(page: Page, url: string | RegExp) {
  await expect(page).toHaveURL(url)
}

export async function expectElementVisible(page: Page, selector: string) {
  await expect(page.locator(selector).first()).toBeVisible()
}

export async function expectElementHidden(page: Page, selector: string) {
  await expect(page.locator(selector)).toBeHidden()
}

export async function expectElementToContainText(page: Page, selector: string, text: string) {
  await expect(page.locator(selector).first()).toContainText(text)
}

/**
 * Form helpers
 */
export async function fillInput(page: Page, selector: string, value: string) {
  await page.locator(selector).fill(value)
}

export async function clickButton(page: Page, text: string) {
  await page.getByRole('button', { name: text }).click()
}

export async function selectOption(page: Page, selector: string, value: string) {
  await page.locator(selector).selectOption(value)
}

/**
 * Check if element exists on page (doesn't throw if not found)
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  const count = await page.locator(selector).count()
  return count > 0
}

/**
 * Get all text content from a selector
 */
export async function getAllTextContent(page: Page, selector: string): Promise<string[]> {
  return await page.locator(selector).allTextContents()
}

/**
 * Screenshot helper for debugging
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `e2e/screenshots/${name}.png`, fullPage: true })
}
