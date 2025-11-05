#!/usr/bin/env node
/**
 * Static HTML Analyzer for Built Storybook
 * Analyzes accessibility without requiring a browser
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const STORYBOOK_DIR = './storybook-static';

const checks = {
  missingAlt: 0,
  missingLabels: 0,
  missingLang: 0,
  missingDoctype: 0,
  emptyButtons: 0,
  emptyLinks: 0,
  inlineStyles: 0,
  semanticIssues: [],
  ariaIssues: [],
};

function analyzeHTML(content, filename) {
  const issues = [];

  // Check for missing alt attributes on images
  const imgNoAlt = content.match(/<img(?![^>]*alt=)/g);
  if (imgNoAlt) {
    checks.missingAlt += imgNoAlt.length;
    issues.push(`Missing alt on ${imgNoAlt.length} images`);
  }

  // Check for missing lang attribute
  if (content.includes('<html') && !content.match(/<html[^>]*lang=/)) {
    checks.missingLang++;
    issues.push('Missing lang attribute on <html>');
  }

  // Check for missing DOCTYPE
  if (!content.match(/<!DOCTYPE html>/i)) {
    checks.missingDoctype++;
    issues.push('Missing DOCTYPE declaration');
  }

  // Check for empty buttons
  const emptyButtons = content.match(/<button[^>]*>\s*<\/button>/g);
  if (emptyButtons) {
    checks.emptyButtons += emptyButtons.length;
    issues.push(`${emptyButtons.length} empty buttons`);
  }

  // Check for empty links
  const emptyLinks = content.match(/<a[^>]*href[^>]*>\s*<\/a>/g);
  if (emptyLinks) {
    checks.emptyLinks += emptyLinks.length;
    issues.push(`${emptyLinks.length} empty links`);
  }

  // Check for form inputs without labels
  const inputs = content.match(/<input(?![^>]*aria-label)(?![^>]*id=)/g);
  if (inputs) {
    checks.missingLabels += inputs.length;
    issues.push(`${inputs.length} inputs without labels or aria-label`);
  }

  // Check for excessive inline styles (anti-pattern)
  const inlineStyles = content.match(/style="/g);
  if (inlineStyles && inlineStyles.length > 50) {
    checks.inlineStyles++;
    issues.push(`Excessive inline styles (${inlineStyles.length})`);
  }

  // Check for proper heading hierarchy
  const headings = [...content.matchAll(/<h([1-6])[^>]*>/g)].map(m => parseInt(m[1]));
  if (headings.length > 0) {
    let prevLevel = 0;
    headings.forEach((level, idx) => {
      if (idx === 0 && level !== 1) {
        checks.semanticIssues.push({
          file: filename,
          issue: `First heading is <h${level}>, should be <h1>`,
        });
      } else if (level - prevLevel > 1) {
        checks.semanticIssues.push({
          file: filename,
          issue: `Heading level skipped from <h${prevLevel}> to <h${level}>`,
        });
      }
      prevLevel = level;
    });
  }

  // Check for ARIA issues
  if (content.includes('aria-hidden="true"') && content.match(/<button[^>]*aria-hidden="true"/)) {
    checks.ariaIssues.push({
      file: filename,
      issue: 'Interactive element with aria-hidden="true"',
    });
  }

  return issues;
}

function findHTMLFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findHTMLFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function analyzeStorybook() {
  console.log('📄 Analyzing Built Storybook HTML...\n');

  if (!fs.existsSync(STORYBOOK_DIR)) {
    console.error(`❌ Storybook build directory not found: ${STORYBOOK_DIR}`);
    console.log('Please run: pnpm build-storybook\n');
    process.exit(1);
  }

  // Find all HTML files
  const htmlFiles = findHTMLFiles(STORYBOOK_DIR);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  const fileResults = [];

  htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const filename = path.basename(file);
    const issues = analyzeHTML(content, filename);

    if (issues.length > 0) {
      fileResults.push({ filename, issues });
      console.log(`📄 ${filename}`);
      issues.forEach(issue => {
        console.log(`   ⚠️  ${issue}`);
      });
      console.log('');
    }
  });

  printHTMLSummary(fileResults, htmlFiles.length);
}

function printHTMLSummary(fileResults, totalFiles) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 STATIC HTML ANALYSIS SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Files Analyzed: ${totalFiles}`);
  console.log(`Files with Issues: ${fileResults.length}`);
  console.log('');
  console.log('Common Accessibility Issues:');
  console.log(`  🖼️  Missing alt attributes: ${checks.missingAlt}`);
  console.log(`  🏷️  Missing labels: ${checks.missingLabels}`);
  console.log(`  🌐 Missing lang attribute: ${checks.missingLang}`);
  console.log(`  📄 Missing DOCTYPE: ${checks.missingDoctype}`);
  console.log(`  🔘 Empty buttons: ${checks.emptyButtons}`);
  console.log(`  🔗 Empty links: ${checks.emptyLinks}`);
  console.log(`  📝 Semantic issues: ${checks.semanticIssues.length}`);
  console.log(`  ♿ ARIA issues: ${checks.ariaIssues.length}`);
  console.log('='.repeat(60));

  if (checks.semanticIssues.length > 0) {
    console.log('\n⚠️  Semantic Issues:');
    checks.semanticIssues.slice(0, 10).forEach((item, idx) => {
      console.log(`  ${idx + 1}. ${item.issue} (${item.file})`);
    });
    if (checks.semanticIssues.length > 10) {
      console.log(`  ... and ${checks.semanticIssues.length - 10} more`);
    }
  }

  if (checks.ariaIssues.length > 0) {
    console.log('\n♿ ARIA Issues:');
    checks.ariaIssues.forEach((item, idx) => {
      console.log(`  ${idx + 1}. ${item.issue} (${item.file})`);
    });
  }

  const issueCount = checks.missingAlt + checks.missingLabels + checks.emptyButtons +
                     checks.emptyLinks + checks.semanticIssues.length + checks.ariaIssues.length;

  if (issueCount === 0) {
    console.log('\n✅ No major accessibility issues found!');
  } else {
    console.log(`\n⚠️  Total Issues Found: ${issueCount}`);
  }

  console.log('\n💡 Note: This is a static analysis. Run full a11y tests for comprehensive results.\n');
}

analyzeStorybook();
