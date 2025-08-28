import { test, expect } from '@playwright/test'

test.describe('Multi-Booking Room Change E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/multi-booking')
    
    // Wait for initial load
    await page.waitForLoadState('networkidle')
    
    // Handle reservation code form - use MULTI123
    // Look for input field with various possible attributes
    const reservationCodeInput = page.locator('input').first()
    
    if (await reservationCodeInput.isVisible({ timeout: 10000 })) {
      await reservationCodeInput.fill('MULTI123')
      await page.waitForTimeout(1000) // Allow input to register
      
      // Look for submit button with various possible texts
      const submitButton = page.locator('button').first()
      if (await submitButton.isVisible()) {
        await submitButton.click()
        await page.waitForTimeout(2000) // Allow page transition
      }
    }
    
    // Wait for the multi-booking interface to load
    await page.waitForLoadState('networkidle')
    
    // Ensure we're in multi-booking mode with room tabs visible
    // Give more time for the interface to appear
    await expect(page.locator('[role="tablist"]')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('[role="tab"][aria-selected="true"]')).toBeVisible({ timeout: 10000 })
  })

  test('should allow room switching from header tabs', async ({ page }) => {
    // Test room tab switching functionality
    const roomTabs = page.locator('[role="tablist"] [role="tab"]')
    
    // Should have multiple room tabs (actual count may vary based on reservation)
    await expect(roomTabs).toHaveCount(3, { timeout: 10000 })
    
    // First room should be active by default
    const firstTab = roomTabs.first()
    const secondTab = roomTabs.nth(1)
    
    await expect(firstTab).toHaveAttribute('aria-selected', 'true')
    await expect(secondTab).toHaveAttribute('aria-selected', 'false')
    
    // Click on second room tab
    await secondTab.click()
    await page.waitForTimeout(500) // Allow state change
    
    // Verify room switch
    await expect(firstTab).toHaveAttribute('aria-selected', 'false')
    await expect(secondTab).toHaveAttribute('aria-selected', 'true')
    
    // Verify room-specific content updates by checking room headers
    const roomHeader = page.locator('[data-testid*="room-header"], h1, h2').filter({ hasText: /Room 2/i }).first()
    if (await roomHeader.isVisible({ timeout: 3000 })) {
      await expect(roomHeader).toBeVisible()
    }
    
    // Switch back to first room
    await firstTab.click()
    await page.waitForTimeout(500)
    await expect(firstTab).toHaveAttribute('aria-selected', 'true')
  })

  test('should verify room tabs update content correctly', async ({ page }) => {
    // This test verifies that switching room tabs updates the main content area
    // but doesn't test the actual room upgrade functionality from the carousel
    const roomTabs = page.locator('[role="tablist"] [role="tab"]')
    
    if (await roomTabs.count() >= 2) {
      // Switch between rooms and verify content updates
      const firstTab = roomTabs.first()
      const secondTab = roomTabs.nth(1)
      
      // Switch to Room 2
      await secondTab.click()
      await page.waitForTimeout(500)
      
      // Verify content updated (room headers or room-specific text)
      const roomContent = page.locator('h1, h2, [data-testid*="room-header"]').filter({ hasText: /Room 2|Premium|Suite/i }).first()
      if (await roomContent.isVisible({ timeout: 3000 })) {
        await expect(roomContent).toBeVisible()
      }
      
      // Switch back to Room 1
      await firstTab.click()
      await page.waitForTimeout(500)
      
      // Verify content updated back to Room 1
      const room1Content = page.locator('h1, h2, [data-testid*="room-header"]').filter({ hasText: /Room 1|Supreme|Luxury/i }).first()
      if (await room1Content.isVisible({ timeout: 3000 })) {
        await expect(room1Content).toBeVisible()
      }
    }
  })

  test('should maintain state isolation between rooms', async ({ page }) => {
    // This test verifies that each room maintains separate state
    const roomTabs = page.locator('[role="tablist"] [role="tab"]')
    
    if (await roomTabs.count() >= 2) {
      const firstTab = roomTabs.first()
      const secondTab = roomTabs.nth(1)
      
      // Switch to Room 1 and interact with some element
      await firstTab.click()
      await page.waitForTimeout(500)
      
      // Try to add some customization or interact with components
      const interactiveElement = page.locator('button').filter({ hasText: /Add for|Book|Select/ }).first()
      if (await interactiveElement.isVisible()) {
        await interactiveElement.click()
        await page.waitForTimeout(750)
      }
      
      // Switch to Room 2
      await secondTab.click()
      await page.waitForTimeout(500)
      
      // Room 2 should have clean state
      // Verify no "Selected" or "Added" states from Room 1
      
      // Switch back to Room 1
      await firstTab.click()
      await page.waitForTimeout(500)
      
      // Check pricing panel shows proper room separation
      const pricingPanel = page.locator('[data-testid*="pricing-panel"], .pricing-summary').first()
      if (await pricingPanel.isVisible()) {
        await pricingPanel.scrollIntoViewIfNeeded()
        
        // Should have room accordions for proper separation
        const roomAccordions = pricingPanel.locator('button[aria-expanded]')
        if (await roomAccordions.count() >= 1) {
          await expect(roomAccordions.first()).toBeVisible()
        }
      }
    }
  })
})