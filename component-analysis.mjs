#!/usr/bin/env node
/**
 * Component Source Code Analysis for Accessibility & Visual Patterns
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const COMPONENTS_DIR = './src/components/upsell';
const STORIES_DIR = './src/stories';

const analysis = {
  components: [],
  accessibility: {
    hasAriaLabels: [],
    hasRoles: [],
    hasSemanticHTML: [],
    hasKeyboardSupport: [],
    hasAltText: [],
    missing: [],
  },
  visual: {
    responsive: [],
    animations: [],
    darkMode: [],
    themes: [],
  },
  patterns: {
    stateManagement: [],
    errorHandling: [],
    loading: [],
  }
};

function analyzeComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const componentName = path.basename(filePath, path.extname(filePath));
  const relativePath = path.relative(process.cwd(), filePath);

  const result = {
    name: componentName,
    path: relativePath,
    lines: content.split('\n').length,
    accessibility: {
      ariaLabels: (content.match(/aria-label/g) || []).length,
      ariaDescribedBy: (content.match(/aria-describedby/g) || []).length,
      ariaLive: (content.match(/aria-live/g) || []).length,
      roles: (content.match(/role=/g) || []).length,
      tabIndex: (content.match(/tabIndex/g) || []).length,
      alt: (content.match(/alt=/g) || []).length,
      semanticHTML: {
        header: content.includes('<header'),
        nav: content.includes('<nav'),
        main: content.includes('<main'),
        section: content.includes('<section'),
        article: content.includes('<article'),
        button: content.includes('<button') || content.includes('Button'),
      }
    },
    visual: {
      tailwind: content.includes('className') && (content.match(/className[^>]*=/g) || []).length,
      responsive: (content.match(/md:|lg:|xl:|sm:/g) || []).length,
      animations: (content.match(/transition|animate|motion|framer/g) || []).length,
      darkMode: (content.match(/dark:/g) || []).length,
    },
    patterns: {
      useState: (content.match(/useState/g) || []).length,
      useEffect: (content.match(/useEffect/g) || []).length,
      errorBoundary: content.includes('ErrorBoundary'),
      loading: content.includes('loading') || content.includes('Loading'),
      skeleton: content.includes('Skeleton'),
    },
    keyboard: {
      onKeyDown: content.includes('onKeyDown'),
      onKeyUp: content.includes('onKeyUp'),
      onKeyPress: content.includes('onKeyPress'),
      keyboardNavigation: content.includes('handleKeyDown') || content.includes('keyHandler'),
    }
  };

  analysis.components.push(result);

  // Track patterns
  if (result.accessibility.ariaLabels > 0) analysis.accessibility.hasAriaLabels.push(componentName);
  if (result.accessibility.roles > 0) analysis.accessibility.hasRoles.push(componentName);
  if (Object.values(result.accessibility.semanticHTML).some(v => v)) {
    analysis.accessibility.hasSemanticHTML.push(componentName);
  }
  if (result.keyboard.onKeyDown || result.keyboard.keyboardNavigation) {
    analysis.accessibility.hasKeyboardSupport.push(componentName);
  }
  if (result.accessibility.alt > 0) analysis.accessibility.hasAltText.push(componentName);

  if (result.visual.responsive > 0) analysis.visual.responsive.push(componentName);
  if (result.visual.animations > 0) analysis.visual.animations.push(componentName);
  if (result.visual.darkMode > 0) analysis.visual.darkMode.push(componentName);

  if (result.patterns.errorBoundary) analysis.patterns.errorHandling.push(componentName);
  if (result.patterns.loading || result.patterns.skeleton) analysis.patterns.loading.push(componentName);

  return result;
}

function findTSXFiles(dir, fileList = []) {
  try {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        findTSXFiles(filePath, fileList);
      } else if (file.endsWith('.tsx') && !file.endsWith('.test.tsx') && !file.endsWith('.stories.tsx')) {
        fileList.push(filePath);
      }
    });
  } catch (err) {
    // Skip directories we can't read
  }

  return fileList;
}

function analyzeAll() {
  console.log('🔍 Analyzing Component Source Code for Accessibility & Visual Patterns...\n');

  // Find all component files
  const componentFiles = findTSXFiles(COMPONENTS_DIR);
  console.log(`Found ${componentFiles.length} component files\n`);

  componentFiles.forEach(file => {
    analyzeComponent(file);
  });

  printReport();
}

function printReport() {
  console.log('\n' + '='.repeat(70));
  console.log('♿ ACCESSIBILITY ANALYSIS');
  console.log('='.repeat(70));

  console.log(`\n✅ Components with ARIA Labels: ${analysis.accessibility.hasAriaLabels.length}`);
  console.log(`   ${analysis.accessibility.hasAriaLabels.slice(0, 5).join(', ')}${analysis.accessibility.hasAriaLabels.length > 5 ? '...' : ''}`);

  console.log(`\n✅ Components with ARIA Roles: ${analysis.accessibility.hasRoles.length}`);
  console.log(`   ${analysis.accessibility.hasRoles.slice(0, 5).join(', ')}${analysis.accessibility.hasRoles.length > 5 ? '...' : ''}`);

  console.log(`\n✅ Components with Semantic HTML: ${analysis.accessibility.hasSemanticHTML.length}`);
  console.log(`   ${analysis.accessibility.hasSemanticHTML.slice(0, 5).join(', ')}${analysis.accessibility.hasSemanticHTML.length > 5 ? '...' : ''}`);

  console.log(`\n⌨️  Components with Keyboard Support: ${analysis.accessibility.hasKeyboardSupport.length}`);
  console.log(`   ${analysis.accessibility.hasKeyboardSupport.slice(0, 5).join(', ')}${analysis.accessibility.hasKeyboardSupport.length > 5 ? '...' : ''}`);

  console.log(`\n🖼️  Components with Alt Text: ${analysis.accessibility.hasAltText.length}`);
  console.log(`   ${analysis.accessibility.hasAltText.slice(0, 5).join(', ')}${analysis.accessibility.hasAltText.length > 5 ? '...' : ''}`);

  console.log('\n' + '='.repeat(70));
  console.log('🎨 VISUAL & RESPONSIVE DESIGN ANALYSIS');
  console.log('='.repeat(70));

  console.log(`\n📱 Responsive Components (Tailwind breakpoints): ${analysis.visual.responsive.length}`);
  console.log(`   ${analysis.visual.responsive.slice(0, 5).join(', ')}${analysis.visual.responsive.length > 5 ? '...' : ''}`);

  console.log(`\n✨ Components with Animations: ${analysis.visual.animations.length}`);
  console.log(`   ${analysis.visual.animations.slice(0, 5).join(', ')}${analysis.visual.animations.length > 5 ? '...' : ''}`);

  console.log(`\n🌙 Components with Dark Mode: ${analysis.visual.darkMode.length}`);
  console.log(`   ${analysis.visual.darkMode.slice(0, 5).join(', ')}${analysis.visual.darkMode.length > 5 ? '...' : ''}`);

  console.log('\n' + '='.repeat(70));
  console.log('🛡️  DESIGN PATTERNS ANALYSIS');
  console.log('='.repeat(70));

  console.log(`\n🔄 Components with Error Handling: ${analysis.patterns.errorHandling.length}`);
  console.log(`   ${analysis.patterns.errorHandling.slice(0, 5).join(', ')}${analysis.patterns.errorHandling.length > 5 ? '...' : ''}`);

  console.log(`\n⏳ Components with Loading States: ${analysis.patterns.loading.length}`);
  console.log(`   ${analysis.patterns.loading.slice(0, 5).join(', ')}${analysis.patterns.loading.length > 5 ? '...' : ''}`);

  console.log('\n' + '='.repeat(70));
  console.log('📊 TOP ACCESSIBLE COMPONENTS (by score)');
  console.log('='.repeat(70));

  const scored = analysis.components.map(c => {
    const score =
      (c.accessibility.ariaLabels > 0 ? 2 : 0) +
      (c.accessibility.roles > 0 ? 2 : 0) +
      (c.accessibility.alt > 0 ? 2 : 0) +
      (c.keyboard.onKeyDown || c.keyboard.keyboardNavigation ? 3 : 0) +
      (Object.values(c.accessibility.semanticHTML).filter(v => v).length);

    return { ...c, score };
  }).sort((a, b) => b.score - a.score);

  console.log('');
  scored.slice(0, 10).forEach((c, idx) => {
    console.log(`${idx + 1}. ${c.name} (score: ${c.score})`);
    console.log(`   📁 ${c.path}`);
    console.log(`   ♿ ARIA: ${c.accessibility.ariaLabels} labels, ${c.accessibility.roles} roles`);
    console.log(`   ⌨️  Keyboard: ${c.keyboard.onKeyDown ? '✅' : '❌'}`);
    console.log(`   🎨 Responsive: ${c.visual.responsive > 0 ? '✅' : '❌'}`);
    console.log('');
  });

  console.log('='.repeat(70));
  console.log('📈 OVERALL METRICS');
  console.log('='.repeat(70));

  const totalComponents = analysis.components.length;
  const a11yRate = ((analysis.accessibility.hasAriaLabels.length / totalComponents) * 100).toFixed(1);
  const keyboardRate = ((analysis.accessibility.hasKeyboardSupport.length / totalComponents) * 100).toFixed(1);
  const responsiveRate = ((analysis.visual.responsive.length / totalComponents) * 100).toFixed(1);

  console.log(`\nTotal Components Analyzed: ${totalComponents}`);
  console.log(`Accessibility Coverage: ${a11yRate}%`);
  console.log(`Keyboard Support Coverage: ${keyboardRate}%`);
  console.log(`Responsive Design Coverage: ${responsiveRate}%`);

  console.log('\n✅ RECOMMENDATIONS:');
  if (parseFloat(a11yRate) < 80) {
    console.log('  • Add more ARIA labels to interactive components');
  }
  if (parseFloat(keyboardRate) < 60) {
    console.log('  • Implement keyboard navigation for more components');
  }
  if (parseFloat(responsiveRate) < 80) {
    console.log('  • Add responsive breakpoints to more components');
  }
  if (analysis.visual.darkMode.length === 0) {
    console.log('  • Consider adding dark mode support');
  }

  console.log('\n💡 Note: This is source code analysis. Complement with runtime accessibility audits.\n');
}

analyzeAll();
