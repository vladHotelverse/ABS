#!/usr/bin/env node
/**
 * Visual Testing Script for Storybook Components
 * Checks for common visual issues and takes screenshots
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const STORYBOOK_URL = 'http://localhost:6006';
const SCREENSHOT_DIR = './visual-test-results';

const stories = [
  { id: 'upsell-bookingbanner--default', name: 'BookingBanner-Default' },
  { id: 'upsell-pricingsummarypanel--default', name: 'PricingSummaryPanel-Default' },
  { id: 'upsell-specialoffers--default', name: 'SpecialOffers-Default' },
  { id: 'upsell-roomcustomization--default', name: 'RoomCustomization-Default' },
  { id: 'upsell-roomselectioncarousel--default', name: 'RoomCarousel-Default' },
];

const viewports = [
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 667 },
];

async function runVisualTests() {
  console.log('🎨 Starting Visual Testing...\n');

  // Create screenshot directory
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const results = {
    total: 0,
    captured: 0,
    errors: [],
    consoleErrors: [],
    layoutIssues: [],
  };

  try {
    for (const story of stories) {
      for (const viewport of viewports) {
        results.total++;
        const testName = `${story.name}-${viewport.name}`;
        console.log(`Testing: ${testName}`);

        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
        });
        const page = await context.newPage();

        // Capture console errors
        page.on('console', msg => {
          if (msg.type() === 'error') {
            results.consoleErrors.push({
              story: story.name,
              viewport: viewport.name,
              message: msg.text(),
            });
          }
        });

        // Capture page errors
        page.on('pageerror', error => {
          results.errors.push({
            story: story.name,
            viewport: viewport.name,
            message: error.message,
          });
        });

        try {
          const url = `${STORYBOOK_URL}/iframe.html?id=${story.id}`;
          await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
          await page.waitForTimeout(1000);

          // Check for layout issues
          const layoutCheck = await page.evaluate(() => {
            const issues = [];

            // Check for horizontal overflow
            if (document.documentElement.scrollWidth > window.innerWidth) {
              issues.push('horizontal-overflow');
            }

            // Check for invisible text (color contrast)
            const elements = document.querySelectorAll('*');
            let invisibleCount = 0;
            elements.forEach(el => {
              const style = window.getComputedStyle(el);
              if (style.color === style.backgroundColor && style.color !== 'rgba(0, 0, 0, 0)') {
                invisibleCount++;
              }
            });

            if (invisibleCount > 0) {
              issues.push(`invisible-text: ${invisibleCount} elements`);
            }

            // Check for overlapping elements
            const buttons = document.querySelectorAll('button, a');
            let overlaps = 0;
            buttons.forEach((btn, i) => {
              const rect1 = btn.getBoundingClientRect();
              buttons.forEach((other, j) => {
                if (i !== j) {
                  const rect2 = other.getBoundingClientRect();
                  if (!(rect1.right < rect2.left ||
                        rect1.left > rect2.right ||
                        rect1.bottom < rect2.top ||
                        rect1.top > rect2.bottom)) {
                    overlaps++;
                  }
                }
              });
            });

            if (overlaps > 0) {
              issues.push(`overlapping-elements: ${overlaps}`);
            }

            return issues;
          });

          if (layoutCheck.length > 0) {
            results.layoutIssues.push({
              story: story.name,
              viewport: viewport.name,
              issues: layoutCheck,
            });
            console.log(`  ⚠️  Layout issues: ${layoutCheck.join(', ')}`);
          }

          // Take screenshot
          const screenshotPath = path.join(SCREENSHOT_DIR, `${testName}.png`);
          await page.screenshot({ path: screenshotPath, fullPage: true });
          results.captured++;
          console.log(`  ✅ Screenshot saved: ${screenshotPath}`);

        } catch (err) {
          console.log(`  ❌ Error: ${err.message}`);
          results.errors.push({
            story: story.name,
            viewport: viewport.name,
            message: err.message,
          });
        } finally {
          await context.close();
        }

        console.log('');
      }
    }
  } finally {
    await browser.close();
  }

  printVisualSummary(results);
}

function printVisualSummary(results) {
  console.log('\n' + '='.repeat(60));
  console.log('🎨 VISUAL TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${results.total}`);
  console.log(`Screenshots Captured: ${results.captured}`);
  console.log(`Console Errors: ${results.consoleErrors.length}`);
  console.log(`Page Errors: ${results.errors.length}`);
  console.log(`Layout Issues: ${results.layoutIssues.length}`);
  console.log('='.repeat(60));

  if (results.consoleErrors.length > 0) {
    console.log('\n🐛 Console Errors:');
    results.consoleErrors.forEach((err, idx) => {
      console.log(`  ${idx + 1}. [${err.story} @ ${err.viewport}]`);
      console.log(`     ${err.message}`);
    });
  }

  if (results.layoutIssues.length > 0) {
    console.log('\n⚠️  Layout Issues:');
    results.layoutIssues.forEach((issue, idx) => {
      console.log(`  ${idx + 1}. [${issue.story} @ ${issue.viewport}]`);
      console.log(`     ${issue.issues.join(', ')}`);
    });
  }

  console.log(`\n📁 Screenshots saved to: ${SCREENSHOT_DIR}/\n`);
}

runVisualTests().catch(err => {
  console.error('❌ Error running visual tests:', err);
  process.exit(1);
});
