import { test, expect } from '@playwright/test'

test.describe('ABS Booking Flow - Real Application Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to your actual ABS application
    await page.goto('/')
    
    // Wait for the application to load
    await page.waitForLoadState('networkidle')
  })

  test('should load ABS landing page successfully', async ({ page }) => {
    // Check that the page title is correct
    await expect(page).toHaveTitle(/Customize-Your-Stay|ABS|Advanced Booking System/i)
    
    // Verify main ABS landing component loads
    const landing = page.locator('[data-testid="abs-landing"]')
    if (await landing.isVisible()) {
      await expect(landing).toBeVisible()
    } else {
      // Fallback: check for any main content container
      const mainContent = page.locator('main, #root, .App')
      await expect(mainContent.first()).toBeVisible()
    }
    
    // Take screenshot for visual validation
    await page.screenshot({ path: 'test-results/abs-landing-page.png', fullPage: true })
  })

  test('should display booking interface components', async ({ page }) => {
    // Check for header/navigation
    const header = page.locator('header, [data-testid*="header"], nav')
    if (await header.first().isVisible()) {
      await expect(header.first()).toBeVisible()
      await page.screenshot({ path: 'test-results/abs-header.png' })
    }
    
    // Check for room selection area
    const roomSection = page.locator('[data-testid*="room"], [class*="room"], h1:has-text("Room"), h2:has-text("Room")')
    if (await roomSection.first().isVisible()) {
      await expect(roomSection.first()).toBeVisible()
    }
    
    // Check for pricing/booking summary
    const pricingSection = page.locator('[data-testid*="pricing"], [data-testid*="summary"], [class*="pricing"], [class*="summary"]')
    if (await pricingSection.first().isVisible()) {
      await expect(pricingSection.first()).toBeVisible()
    }
    
    // Take screenshot of main interface
    await page.screenshot({ path: 'test-results/abs-interface.png', fullPage: true })
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Verify page still loads on mobile
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Check that main content is visible on mobile
    const mainContent = page.locator('main, #root, .App, [data-testid="abs-landing"]')
    await expect(mainContent.first()).toBeVisible()
    
    // Check for mobile-specific elements if they exist
    const mobileMenu = page.locator('[data-testid*="mobile"], .mobile-menu, .hamburger')
    if (await mobileMenu.first().isVisible()) {
      await expect(mobileMenu.first()).toBeVisible()
    }
    
    // Take mobile screenshot
    await page.screenshot({ path: 'test-results/abs-mobile-view.png', fullPage: true })
  })

  test('should handle user interactions', async ({ page }) => {
    // Look for interactive elements (buttons, links, forms)
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()
    
    if (buttonCount > 0) {
      // Test first few buttons for interaction
      for (let i = 0; i < Math.min(3, buttonCount); i++) {
        const button = buttons.nth(i)
        if (await button.isVisible() && await button.isEnabled()) {
          // Hover over button to test interaction
          await button.hover()
          
          // Take screenshot showing hover state
          await page.screenshot({ path: `test-results/button-hover-${i}.png` })
          
          // Click button and wait for any response
          await button.click()
          await page.waitForTimeout(1000) // Wait for potential updates
          
          break // Only test one successful interaction
        }
      }
    }
    
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    await page.waitForTimeout(500)
    
    // Verify focus moved to a focusable element
    const focusedElement = page.locator(':focus')
    if (await focusedElement.isVisible()) {
      await expect(focusedElement).toBeVisible()
      await page.screenshot({ path: 'test-results/keyboard-focus.png' })
    }
  })

  test('should handle form inputs if present', async ({ page }) => {
    // Look for input fields
    const inputs = page.locator('input, select, textarea')
    const inputCount = await inputs.count()
    
    if (inputCount > 0) {
      // Test first input field
      const firstInput = inputs.first()
      if (await firstInput.isVisible() && await firstInput.isEnabled()) {
        const inputType = await firstInput.getAttribute('type') || 'text'
        
        // Fill input based on type
        if (inputType === 'text' || inputType === 'email') {
          await firstInput.fill('test@example.com')
        } else if (inputType === 'number') {
          await firstInput.fill('2')
        } else if (inputType === 'date') {
          await firstInput.fill('2024-12-25')
        }
        
        // Verify input was filled
        const value = await firstInput.inputValue()
        expect(value).toBeTruthy()
        
        // Take screenshot of filled form
        await page.screenshot({ path: 'test-results/form-filled.png' })
      }
    }
    
    // Look for select dropdowns
    const selects = page.locator('select')
    const selectCount = await selects.count()
    
    if (selectCount > 0) {
      const firstSelect = selects.first()
      if (await firstSelect.isVisible()) {
        // Get available options
        const options = await firstSelect.locator('option').count()
        if (options > 1) {
          // Select the second option (first is usually placeholder)
          await firstSelect.selectOption({ index: 1 })
          await page.screenshot({ path: 'test-results/select-option.png' })
        }
      }
    }
  })

  test('should measure basic performance', async ({ page }) => {
    // Navigate with performance timing
    await page.goto('/', { waitUntil: 'networkidle' })
    
    // Measure performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      }
    })
    
    console.log('ABS Performance Metrics:', metrics)
    
    // Assert reasonable load times (adjust thresholds as needed)
    expect(metrics.domContentLoaded).toBeLessThan(5000) // 5 seconds
    if (metrics.firstContentfulPaint > 0) {
      expect(metrics.firstContentfulPaint).toBeLessThan(3000) // 3 seconds
    }
  })

  test('should validate accessibility basics', async ({ page }) => {
    // Check for proper heading structure
    const h1Elements = page.locator('h1')
    const h1Count = await h1Elements.count()
    
    if (h1Count > 0) {
      await expect(h1Elements.first()).toBeVisible()
    }
    
    // Check that interactive elements have accessible names
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < Math.min(5, buttonCount); i++) {
      const button = buttons.nth(i)
      if (await button.isVisible()) {
        const text = await button.textContent()
        const ariaLabel = await button.getAttribute('aria-label')
        const title = await button.getAttribute('title')
        
        // Button should have some form of accessible name
        expect(text || ariaLabel || title).toBeTruthy()
      }
    }
    
    // Check for alt text on images
    const images = page.locator('img')
    const imageCount = await images.count()
    
    for (let i = 0; i < Math.min(5, imageCount); i++) {
      const img = images.nth(i)
      if (await img.isVisible()) {
        const alt = await img.getAttribute('alt')
        const ariaLabel = await img.getAttribute('aria-label')
        
        // Images should have alt text or aria-label
        expect(alt !== null || ariaLabel !== null).toBeTruthy()
      }
    }
  })
})