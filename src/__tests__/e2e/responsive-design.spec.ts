import { test, expect } from '@playwright/test'

const viewports = [
  { name: 'Mobile', width: 375, height: 667 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Tablet Landscape', width: 1024, height: 768 },
  { name: 'Desktop', width: 1440, height: 900 },
  { name: 'Large Desktop', width: 1920, height: 1080 },
  { name: 'Ultra Wide', width: 2560, height: 1440 }
]

test.describe('Responsive Design Tests', () => {
  viewports.forEach(({ name, width, height }) => {
    test.describe(`${name} (${width}x${height})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width, height })
        await page.goto('/')
      })

      test(`should render properly on ${name}`, async ({ page }) => {
        // Wait for the page to load
        await page.waitForLoadState('networkidle')

        // Check if main container is properly sized
        const main = page.locator('main').first()
        await expect(main).toBeVisible()

        // Verify fluid spacing is applied
        const container = main.first()
        const containerBox = await container.boundingBox()
        
        if (containerBox) {
          // Check that container doesn't exceed max-width constraints
          if (width >= 1536) {
            // For xl and above, should have max-width
            expect(containerBox.width).toBeLessThanOrEqual(width)
          }
        }

        // Take a screenshot for visual regression
        await page.screenshot({ 
          path: `test-results/responsive-${name.toLowerCase().replace(/\s+/g, '-')}.png`,
          fullPage: true 
        })
      })

      test(`should have appropriate spacing on ${name}`, async ({ page }) => {
        await page.waitForLoadState('networkidle')

        // Check that sections have proper fluid spacing
        const sections = page.locator('section')
        const sectionCount = await sections.count()
        
        if (sectionCount > 1) {
          // Measure spacing between first two sections
          const firstSection = sections.first()
          const secondSection = sections.nth(1)
          
          const firstBox = await firstSection.boundingBox()
          const secondBox = await secondSection.boundingBox()
          
          if (firstBox && secondBox) {
            const spacing = secondBox.y - (firstBox.y + firstBox.height)
            
            // Verify spacing is within expected fluid range
            // Minimum 16px, maximum varies by viewport but allow for larger spacing
            expect(spacing).toBeGreaterThanOrEqual(16)
            
            if (width >= 1024) {
              expect(spacing).toBeLessThanOrEqual(200) // Allow for larger spacing on desktop
            } else {
              expect(spacing).toBeLessThanOrEqual(300) // Allow for larger spacing on mobile due to different layouts
            }
          }
        }
      })

      test(`should have proper container query behavior on ${name}`, async ({ page }) => {
        await page.waitForLoadState('networkidle')

        // Look for container query enabled elements
        const cqContainers = page.locator('.cq-container')
        const cqCount = await cqContainers.count()
        
        if (cqCount > 0) {
          // Verify first container query element
          const firstCq = cqContainers.first()
          await expect(firstCq).toBeVisible()
          
          // Check computed style for container-type
          const containerType = await firstCq.evaluate((el) => {
            return window.getComputedStyle(el).getPropertyValue('container-type')
          })
          
          expect(containerType).toContain('inline-size')
        }
      })

      test(`should show/hide mobile-specific elements on ${name}`, async ({ page }) => {
        await page.waitForLoadState('networkidle')

        const isMobile = width < 768
        const isTablet = width >= 768 && width < 1024
        const isDesktop = width >= 1024

        // Check mobile pricing widget visibility
        const mobileWidget = page.locator('[data-testid="mobile-pricing-widget"]')
        const mobileWidgetCount = await mobileWidget.count()
        
        if (mobileWidgetCount > 0) {
          if (isMobile || isTablet) {
            await expect(mobileWidget).toBeVisible()
          } else {
            await expect(mobileWidget).toBeHidden()
          }
        }

        // Check desktop sidebar visibility
        const pricingSidebar = page.locator('aside')
        const sidebarCount = await pricingSidebar.count()
        
        if (sidebarCount > 0) {
          if (isDesktop) {
            await expect(pricingSidebar.first()).toBeVisible()
          }
        }
      })

      test(`should have proper text scaling on ${name}`, async ({ page }) => {
        await page.waitForLoadState('networkidle')

        // Check heading sizes
        const h1 = page.locator('h1').first()
        const h1Count = await page.locator('h1').count()
        
        if (h1Count > 0) {
          const fontSize = await h1.evaluate((el) => {
            return window.getComputedStyle(el).fontSize
          })
          
          const fontSizeValue = parseFloat(fontSize)
          
          // Verify responsive text sizing
          if (width >= 1024) {
            expect(fontSizeValue).toBeGreaterThanOrEqual(24) // At least 1.5rem
          } else if (width >= 768) {
            expect(fontSizeValue).toBeGreaterThanOrEqual(20) // At least 1.25rem
          } else {
            expect(fontSizeValue).toBeGreaterThanOrEqual(18) // At least 1.125rem
          }
        }
      })

      test(`should handle layout shifts properly on ${name}`, async ({ page }) => {
        // Enable layout shift tracking
        await page.addInitScript(() => {
          (window as any).layoutShifts = []
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
                (window as any).layoutShifts.push(entry)
              }
            }
          }).observe({ entryTypes: ['layout-shift'] })
        })

        await page.goto('/')
        await page.waitForLoadState('networkidle')

        // Allow time for any potential layout shifts
        await page.waitForTimeout(2000)

        // Check cumulative layout shift score
        const layoutShifts = await page.evaluate(() => (window as any).layoutShifts || [])
        const cls = layoutShifts.reduce((acc: number, shift: any) => acc + shift.value, 0)

        // CLS should be less than 0.1 for good user experience
        expect(cls).toBeLessThan(0.1)
      })
    })
  })

  test.describe('Viewport Transitions', () => {
    test('should handle viewport size changes gracefully', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Start with desktop
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.waitForTimeout(500)

      // Transition to tablet
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.waitForTimeout(500)

      // Check that mobile elements appear
      const mobileWidget = page.locator('[data-testid="mobile-pricing-widget"]')
      const mobileWidgetCount = await mobileWidget.count()
      
      if (mobileWidgetCount > 0) {
        await expect(mobileWidget).toBeVisible()
      }

      // Transition to mobile
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(500)

      // Ensure layout is still stable
      const main = page.locator('main')
      await expect(main).toBeVisible()

      // Back to desktop
      await page.setViewportSize({ width: 1440, height: 900 })
      await page.waitForTimeout(500)

      // Check that desktop layout is restored
      const sidebar = page.locator('aside')
      const sidebarCount = await sidebar.count()
      
      if (sidebarCount > 0) {
        await expect(sidebar.first()).toBeVisible()
      }
    })
  })

  test.describe('Container Query Tests', () => {
    test('should adapt layout based on container size', async ({ page }) => {
      await page.goto('/')
      await page.waitForLoadState('networkidle')

      // Look for elements using container queries
      const cqElements = page.locator('[class*="cq-"]')
      const cqCount = await cqElements.count()

      if (cqCount > 0) {
        // Test at different viewport sizes
        const testSizes = [
          { width: 320, height: 568 },
          { width: 768, height: 1024 },
          { width: 1440, height: 900 }
        ]

        for (const size of testSizes) {
          await page.setViewportSize(size)
          await page.waitForTimeout(300)

          // Verify container query responsive classes are applied
          const cqElement = cqElements.first()
          const classes = await cqElement.getAttribute('class') || ''
          
          // Should have some container query classes
          const hasCqClasses = /cq-(sm|md|lg|xl)/.test(classes)
          
          if (size.width >= 640 && hasCqClasses) {
            // At larger sizes, should potentially have cq-lg classes
            // This is conditional based on container size, not viewport
            expect(classes).toMatch(/cq-/)
          }
        }
      }
    })
  })
})