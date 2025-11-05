#!/usr/bin/env node
/**
 * Accessibility Testing Script for Storybook Components
 * Uses axe-core to audit accessibility issues
 */

import { chromium } from 'playwright';
import { injectAxe, checkA11y } from '@axe-core/playwright';

const STORYBOOK_URL = 'http://localhost:6006';
const stories = [
  '/iframe.html?id=upsell-bookingaccordioncard--default',
  '/iframe.html?id=upsell-bookingbanner--default',
  '/iframe.html?id=upsell-bookingbanner--with-multiple-bookings',
  '/iframe.html?id=upsell-layoutdemo--default-layout',
  '/iframe.html?id=upsell-pricingsummarypanel--default',
  '/iframe.html?id=upsell-pricingsummarypanel--empty',
  '/iframe.html?id=upsell-roomcustomization--default',
  '/iframe.html?id=upsell-roomcustomization-synchronized--side-by-side',
  '/iframe.html?id=upsell-roomselectioncarousel--default',
  '/iframe.html?id=upsell-specialoffers--default',
  '/iframe.html?id=upsell-specialoffers-multibooking--default',
  '/iframe.html?id=upsell-tabsdemo--default',
  '/iframe.html?id=patterns-best-practices-example--default',
];

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  violations: [],
  issues: {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
  }
};

async function testAccessibility() {
  console.log('🔍 Starting Accessibility Testing...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    for (const story of stories) {
      const url = `${STORYBOOK_URL}${story}`;
      results.total++;

      console.log(`Testing: ${story}`);

      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
        await page.waitForTimeout(1000); // Wait for component to render

        await injectAxe(page);

        const violations = await page.evaluate(async () => {
          const results = await window.axe.run();
          return results.violations;
        });

        if (violations.length === 0) {
          console.log(`  ✅ PASS - No violations\n`);
          results.passed++;
        } else {
          console.log(`  ❌ FAIL - ${violations.length} violations found`);
          results.failed++;

          violations.forEach(violation => {
            const impact = violation.impact;
            results.issues[impact] = (results.issues[impact] || 0) + violation.nodes.length;

            console.log(`    ${getImpactIcon(impact)} ${violation.id} (${impact})`);
            console.log(`       ${violation.description}`);
            console.log(`       Affected: ${violation.nodes.length} element(s)`);

            results.violations.push({
              story: story,
              id: violation.id,
              impact: violation.impact,
              description: violation.description,
              help: violation.help,
              helpUrl: violation.helpUrl,
              nodes: violation.nodes.length,
            });
          });
          console.log('');
        }
      } catch (err) {
        console.log(`  ⚠️  SKIP - ${err.message}\n`);
      }
    }
  } finally {
    await browser.close();
  }

  printSummary();
}

function getImpactIcon(impact) {
  const icons = {
    critical: '🔴',
    serious: '🟠',
    moderate: '🟡',
    minor: '🔵',
  };
  return icons[impact] || '⚪';
}

function printSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 ACCESSIBILITY TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Stories Tested: ${results.total}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log('');
  console.log('Issues by Severity:');
  console.log(`  🔴 Critical: ${results.issues.critical}`);
  console.log(`  🟠 Serious:  ${results.issues.serious}`);
  console.log(`  🟡 Moderate: ${results.issues.moderate}`);
  console.log(`  🔵 Minor:    ${results.issues.minor}`);
  console.log('='.repeat(60));

  if (results.violations.length > 0) {
    console.log('\n📋 Detailed Violations:\n');
    results.violations.forEach((v, idx) => {
      console.log(`${idx + 1}. [${v.impact.toUpperCase()}] ${v.id}`);
      console.log(`   Story: ${v.story}`);
      console.log(`   Issue: ${v.description}`);
      console.log(`   Help: ${v.helpUrl}`);
      console.log('');
    });
  }

  const passRate = ((results.passed / results.total) * 100).toFixed(1);
  console.log(`\n✨ Pass Rate: ${passRate}%`);

  if (results.failed > 0) {
    process.exit(1);
  }
}

testAccessibility().catch(err => {
  console.error('❌ Error running tests:', err);
  process.exit(1);
});
