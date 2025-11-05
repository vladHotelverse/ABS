# Claude Code Toolkit for React Component Library Development

**Research compiled:** November 5, 2025
**Focus Project:** ABS UI Toolkit (Vite, React 19, TypeScript, Tailwind CSS 4, Radix UI, Storybook 8, Playwright)

---

## Table of Contents

1. [Overview & Key Concepts](#overview--key-concepts)
2. [Built-in Slash Commands](#built-in-slash-commands)
3. [Custom Slash Commands](#custom-slash-commands)
4. [Agent Skills](#agent-skills)
5. [MCP (Model Context Protocol) Integrations](#mcp-model-context-protocol-integrations)
6. [Claude Code Plugins](#claude-code-plugins)
7. [Best Practices for Component Library Development](#best-practices-for-component-library-development)
8. [Recommended Setup for ABS UI Toolkit](#recommended-setup-for-abs-ui-toolkit)
9. [Workflow Examples](#workflow-examples)

---

## Overview & Key Concepts

### The Three Main Extension Types

Claude Code can be extended in three ways:

| Type | Invocation | Use Case | Scope |
|------|-----------|----------|-------|
| **Slash Commands** | Explicit (`/command`) | Quick, frequently-used prompts | Single file |
| **Agent Skills** | Automatic (model-invoked) | Complex workflows with multiple steps | Directory with supporting files |
| **Plugins** | Automatic installation | Packaged extensions with commands + skills + MCP servers | Distributed via marketplaces |

**Key Difference:**
- **Slash commands** = You invoke them explicitly (`/review`, `/fix-issue`)
- **Skills** = Claude decides autonomously when to use them based on context
- **Plugins** = Complete packages that install everything at once

---

## Built-in Slash Commands

### Core Commands for Component Development

| Command | Purpose | Example |
|---------|---------|---------|
| `/review` | Request code review | `/review` (then select aspects) |
| `/init` | Initialize project with CLAUDE.md | `/init` |
| `/memory` | Edit CLAUDE.md memory files | `/memory` |
| `/mcp` | Manage MCP server connections | `/mcp` (list, authenticate, remove) |
| `/model` | Select/change AI model | `/model` (switch to Claude Sonnet) |
| `/cost` | Show token usage statistics | `/cost` |
| `/status` | Show version, model, account info | `/status` |
| `/compact` | Compact conversation history | `/compact` |
| `/rewind` | Rewind conversation/code | `/rewind` |
| `/help` | Get usage help | `/help` |
| `/sandbox` | Enable sandboxed bash execution | `/sandbox` (for safer automation) |
| `/permissions` | Manage tool permissions | `/permissions` |
| `/context` | Monitor token usage | `/context` |

### Specialized Commands

- **`/pr_comments`** - View pull request comments
- **`/agents`** - Manage custom AI subagents for specialized tasks
- **`/add-dir`** - Add additional working directories
- **`/doctor`** - Check Claude Code installation health

---

## Custom Slash Commands

### What They Are

Custom slash commands are Markdown files that define frequently-used prompts. They're stored as:
- **Project-scoped**: `.claude/commands/` (shared via git with team)
- **Personal**: `~/.claude/commands/` (available across all projects)

### Structure

```
# Basic command
.claude/commands/optimize.md
→ Creates `/optimize` command

# Namespaced command
.claude/commands/frontend/component.md
→ Creates `/component` command with "(project:frontend)" label
```

### Features

#### 1. **Simple Command**
```bash
mkdir -p .claude/commands
echo "Analyze this code for performance issues and suggest optimizations:" > .claude/commands/optimize.md
```

Usage: `/optimize`

#### 2. **Command with Arguments**

```markdown
---
argument-hint: [pr-number] [priority] [assignee]
description: Review pull request with priority level
---

Review PR #$1 with priority $2 and assign to $3.
Focus on security, performance, and code style.
```

Usage: `/review-pr 456 high alice`

#### 3. **Command with Frontmatter Metadata**

```markdown
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
argument-hint: [message]
description: Create a git commit with validation
model: claude-3-5-haiku-20241022
---

Create a git commit with message: $ARGUMENTS
```

#### 4. **Command with Bash Execution**

```markdown
---
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(pnpm test:*)
description: Analyze code changes and run tests
---

## Context

Current git status: !`git status`
Current diff: !`git diff HEAD`

## Task

Review the changes and suggest improvements.
```

#### 5. **Command with File References**

```markdown
---
description: Compare two versions of code
---

Review the implementation differences:

Old version: @src/old-version.js
New version: @src/new-version.js

Highlight improvements and potential issues.
```

### Recommended Commands for ABS UI Toolkit

Create these in `.claude/commands/`:

```bash
# Component workflow
.claude/commands/component-story.md
→ "Create Storybook story for this component"

.claude/commands/test-component.md
→ "Write unit tests for this component with Vitest"

.claude/commands/review-component.md
→ "Review component for accessibility, performance, and style consistency"

# Development workflow
.claude/commands/ui/check-ui-primitives.md
→ "Verify this component follows UI primitive constraints"

.claude/commands/ui/style-check.md
→ "Check component styling against Tailwind 4 design tokens"

# Git/PR workflow
.claude/commands/commit-with-context.md
→ "Create commit message based on component changes"

.claude/commands/prepare-pr.md
→ "Prepare pull request description for new components"

# Testing workflow
.claude/commands/test-all.md
→ "Run all tests and coverage for components"

.claude/commands/playwright-test.md
→ "Run Playwright E2E tests and report results"
```

### Creating Commands for Component Development

**Example: Component Story Creator**

File: `.claude/commands/component-story.md`

```markdown
---
argument-hint: [component-name]
description: Create comprehensive Storybook story for a component
allowed-tools: Read, Write, Bash(pnpm storybook:*)
---

# Component Story Creator

## Task

Create a comprehensive Storybook story file for the component: $1

## Requirements

1. **File Location**: `src/stories/$1.stories.tsx`
2. **Story Structure**:
   - Default story showing the component
   - Multiple variants (different props)
   - State variations (hover, focus, disabled)
   - Responsive/mobile variants

3. **Meta Information**:
   - Component title and description
   - Args/props documentation
   - Usage guidelines

4. **Integration**:
   - Use component from @/components/ path
   - Follow project's Storybook setup
   - Enable autodocs with proper JSDoc comments

## Validation

After creation:
- Verify story file has proper TypeScript types
- Check story renders without errors in Storybook
```

**Example: Component Accessibility Review**

File: `.claude/commands/a11y-check.md`

```markdown
---
description: Review component for accessibility compliance (WCAG 2.1 AA)
allowed-tools: Read, Grep
---

# Accessibility Check

Review the component for:

1. **ARIA Attributes**
   - Proper roles (button, checkbox, etc.)
   - aria-labels for icon-only buttons
   - aria-describedby relationships
   - aria-expanded for expandable sections

2. **Keyboard Navigation**
   - All interactive elements focusable (Tab order)
   - Keyboard shortcuts documented
   - Trap focus in modals/dialogs

3. **Semantic HTML**
   - Using Radix UI primitives correctly
   - Proper heading hierarchy
   - Form labels associated with inputs

4. **Color Contrast**
   - Text contrast ratio >= 4.5:1 (AA)
   - Non-text contrast >= 3:1

5. **Testing**
   - Can interact with keyboard only
   - Screen reader announces correctly
   - Works with browser zoom up to 200%
```

---

## Agent Skills

### What They Are

Agent Skills are **model-invoked** capabilities that Claude autonomously discovers based on context. They're:
- Organized in directories with `SKILL.md` + supporting files
- Automatically discovered based on relevance
- Perfect for complex workflows with multiple steps

### Directory Structure

```
~/.claude/skills/
├── component-development/
│   ├── SKILL.md (required)
│   ├── PATTERNS.md (reference)
│   ├── CHECKLIST.md (validation)
│   └── scripts/
│       └── generate-variants.js

├── storybook-enhancement/
│   ├── SKILL.md
│   └── examples.md

└── testing-suite/
    ├── SKILL.md
    ├── COVERAGE.md
    └── scripts/
        └── analyze-coverage.py
```

### Creating a Skill

**File: `~/.claude/skills/component-development/SKILL.md`**

```markdown
---
name: component-development
description: Develop React components following ABS UI Toolkit standards. Use when creating new UI components, building Radix UI based components, setting up Tailwind styling, writing Storybook stories, and testing with Vitest and Playwright. Handles component architecture, accessibility, responsive design, and integration patterns.
---

# Component Development Skill

## When to Use

Use this Skill when:
- Creating new UI primitive components
- Building domain components that compose primitives
- Setting up Storybook documentation
- Implementing accessibility features
- Writing component tests

## Component Architecture

### UI Primitives (src/components/ui/)

Reusable, low-level components built on Radix UI:
- Button, Card, Dialog, Input, Label
- Export through src/index.ts

### Domain Components (src/components/)

High-level components composing UI primitives:
- PricingSummaryPanel, RoomCustomization, BookingBanner
- Located in subdirectories by feature area

### Stories (src/stories/)

Separate from components, named: ComponentName.stories.tsx

## Development Workflow

1. **Plan Component**
   - Props interface
   - Accessibility requirements
   - Responsive behavior
   - State management

2. **Implement Component**
   - Use Radix UI primitives where applicable
   - Apply Tailwind classes from design tokens
   - Use cn() utility for conditional styles
   - Export from src/index.ts for UI primitives

3. **Write Stories**
   - Create comprehensive story file
   - Show all prop variations
   - Document prop types with JSDoc
   - Include responsive variants

4. **Test Component**
   - Unit tests (Vitest)
   - E2E tests (Playwright)
   - Accessibility testing
   - Coverage >= 70%

5. **Review & Document**
   - Component follows coding standards
   - Storybook renders correctly
   - Tests pass with coverage
   - Documentation is clear

## Best Practices

### Styling
- Use Tailwind 4 CSS variables for theming
- Use cn() utility for merging classes
- Define variants with class-variance-authority
- Use design tokens from src/index.css

### Accessibility
- Use Radix UI for accessible primitives
- Include aria-labels for icons
- Test keyboard navigation
- Verify screen reader announcements

### Responsive Design
- Use Tailwind breakpoints (sm, md, lg, xl, 2xl)
- Use custom hooks: useBreakpoint, useMobile, useIsDesktop
- Test on multiple screen sizes
- Document responsive behavior in stories

### Type Safety
- Write strict TypeScript
- Document all props with TSDoc
- Use precise types (avoid `any`)
- Export types from component files

## Scripts

Helper scripts available:
- Generate variant combinations
- Run component tests
- Validate accessibility
- Generate component documentation
```

### Recommended Skills for ABS UI Toolkit

Create in `.claude/skills/`:

**1. Component Development Skill** (example above)

**2. Storybook Enhancement Skill**

```markdown
---
name: storybook-enhancement
description: Create and enhance Storybook stories with comprehensive documentation, interactive controls, and design system integration. Use when working on Storybook stories, documenting component variations, adding story decorators, and integrating with design tokens.
---

# Storybook Enhancement

## Story Structure

Each story file should include:

1. **Meta Information**
   - Component title
   - Description
   - Tags for autodocs
   - Parameters (viewport, layout)

2. **Default Story**
   - Primary use case
   - All required props shown
   - Accessibility features visible

3. **Variants**
   - All prop combinations
   - Size variations
   - Color/theme variations
   - State variations (hover, focus, disabled)

4. **Responsive Stories**
   - Mobile layout
   - Tablet layout
   - Desktop layout

5. **Documentation**
   - JSDoc comments on props
   - Usage examples
   - Best practices
   - Common patterns
```

**3. Testing & Quality Skill**

```markdown
---
name: testing-and-quality
description: Write and run tests for React components with Vitest and Playwright. Use when creating unit tests, E2E tests, writing test coverage analysis, and validating component behavior across different scenarios.
allowed-tools: Bash(pnpm test:*), Bash(pnpm test:run), Read, Write, Glob, Grep
---

# Testing and Quality Assurance

## Test Types

1. **Unit Tests** (Vitest)
   - Component rendering
   - Props validation
   - Event handling
   - State changes

2. **E2E Tests** (Playwright)
   - User interactions
   - Form submissions
   - Navigation flows
   - Cross-browser compatibility

3. **Accessibility Tests**
   - Keyboard navigation
   - Screen reader announcements
   - ARIA attributes
   - Color contrast

## Coverage Requirements

- Minimum 70% coverage
- All critical paths covered
- Error cases handled
- Edge cases tested

## Test Organization

- Unit tests in `src/__tests__/unit/`
- E2E tests in `src/__tests__/e2e/`
- Setup files in `src/__tests__/setup/`
- Mocks in `src/__tests__/mocks/`
```

**4. Design System Alignment Skill**

```markdown
---
name: design-system-alignment
description: Ensure components align with ABS UI design system including Tailwind CSS 4, Radix UI patterns, responsive design, and accessibility standards. Use when validating design consistency, checking responsive behavior, verifying accessibility compliance, and ensuring token usage.
---

# Design System Alignment

## Tailwind CSS 4 Tokens

Components must use design tokens defined in src/index.css:
- Color palette (with CSS variables)
- Typography scales
- Spacing system
- Border radius
- Shadow definitions

## Radix UI Compliance

When using Radix UI primitives:
- Maintain unstyled foundation
- Apply Tailwind classes only
- Respect compound component patterns
- Document aria-related props

## Responsive Design

Required breakpoints:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

## Accessibility Standards

- WCAG 2.1 Level AA compliance
- Semantic HTML structure
- Proper ARIA labeling
- Keyboard navigation support
```

---

## MCP (Model Context Protocol) Integrations

### What is MCP?

MCP is an open standard for connecting AI assistants to external tools, APIs, and data sources. Think of it as "USB-C for AI"—a universal way to integrate services.

### Installing MCP Servers

Syntax: `claude mcp add --transport <TYPE> <NAME> <URL>`

### Recommended MCP Servers for Component Library Development

#### 1. **GitHub** (Development & Code Review)
```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/
```
**Use for:**
- Create/review pull requests
- Manage issues
- Analyze code diffs
- Track project progress

#### 2. **Playwright** (Testing & Visual Validation)
```bash
claude mcp add --transport stdio playwright -- npx -y @executeautomation/mcp-playwright
```
**Use for:**
- Run E2E tests
- Capture screenshots
- Validate responsive layouts
- Test accessibility
- Analyze visual regressions

#### 3. **Figma** (Design System Integration)
```bash
claude mcp add --transport http figma-remote-mcp https://mcp.figma.com/mcp
```
**Use for:**
- Access design tokens
- Generate code from designs
- Verify design consistency
- Extract spacing/typography specs

#### 4. **Sentry** (Production Monitoring)
```bash
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```
**Use for:**
- Monitor component errors in production
- Analyze error patterns
- Debug production issues

#### 5. **Vercel** (Deployment & Analytics)
```bash
claude mcp add --transport http vercel https://mcp.vercel.com/
```
**Use for:**
- Deploy Storybook
- Analyze deployment logs
- Monitor performance
- Manage preview deployments

#### 6. **Linear** (Issue Tracking)
```bash
claude mcp add --transport http linear https://mcp.linear.app/mcp
```
**Use for:**
- Track component development tasks
- Manage component roadmap
- Link code to issues
- Automate issue updates

#### 7. **Notion** (Documentation)
```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
```
**Use for:**
- Document component library
- Maintain design patterns
- Track team conventions
- Share component guidelines

### Recommended Scopes for ABS Project

```bash
# Project-scoped (shared with team, checked in)
claude mcp add --transport http github --scope project https://api.githubcopilot.com/mcp/
claude mcp add --transport http figma-remote-mcp --scope project https://mcp.figma.com/mcp

# Personal-scoped (your development preference)
claude mcp add --transport stdio playwright --scope user -- npx -y @executeautomation/mcp-playwright
claude mcp add --transport http sentry --scope user https://mcp.sentry.dev/mcp
```

### Using MCP in Workflows

**Example: Reference GitHub Issues**
```
@github:issue://456
```

**Example: Run Playwright Tests**
```
Can you test the component responsiveness on mobile and tablet viewports?
```

**Example: Check Figma Design**
```
Compare this component implementation with @figma:design://button-component
```

---

## Claude Code Plugins

### What They Are

Plugins are packaged distributions that can include:
- Multiple slash commands
- Agent Skills
- MCP servers
- Custom workflows

### Available Plugin Marketplaces

| Marketplace | URL |
|------------|-----|
| Official & Community | claudecodemarketplace.com |
| Repomix Guide | repomix.com/guide/claude-code-plugins |
| Multi-server | claudecodeplugins.io (229+ plugins) |
| Dev Plugins | claude-plugins.dev |

### Installing Plugins

```bash
# Install from marketplace
/plugin marketplace add user-or-org/repo-name

# View installed plugins
/plugin list

# Enable/disable plugin
/plugin enable plugin-name
/plugin disable plugin-name
```

### Recommended Plugins for React Component Development

| Plugin | Purpose |
|--------|---------|
| **React 19 Master** | React patterns, hooks, component architecture |
| **TypeScript Advanced** | Type system patterns, utility types |
| **Tailwind CSS 4 Pro** | Design tokens, responsive design patterns |
| **Component Testing** | Vitest patterns, Playwright automation |
| **Storybook Pro** | Story templates, documentation patterns |
| **Code Review Suite** | PR analysis, accessibility checking |

### Creating Custom Plugins

Plugins use this structure:

```
my-plugin/
├── plugin.json
├── .claude/
│   ├── commands/
│   │   └── my-command.md
│   ├── skills/
│   │   └── my-skill/
│   │       └── SKILL.md
│   └── hooks/
│       └── pre-tool-use.js
├── .mcp.json (optional)
└── README.md
```

**Example plugin.json:**
```json
{
  "name": "abs-component-toolkit",
  "version": "1.0.0",
  "description": "ABS UI Toolkit development plugin",
  "author": "ABS Team",
  "commands": [
    {
      "name": "component-story",
      "description": "Create Storybook story"
    }
  ],
  "skills": [
    "component-development",
    "storybook-enhancement"
  ]
}
```

---

## Best Practices for Component Library Development

### 1. Use CLAUDE.md for Project Context

Create `/Users/hotel/Documents/ABS/CLAUDE.md` (already exists - verify content):

```markdown
# ABS UI Toolkit Development Guide

## Tech Stack
- React 19 with TypeScript
- Vite (build & dev server: localhost:5173)
- Tailwind CSS 4 with design tokens
- Radix UI (accessibility primitives)
- Storybook 8 (component docs: localhost:6006)
- Vitest (unit testing)
- Playwright (E2E testing)
- i18next (en, es localization)

## Component Architecture

### UI Primitives (src/components/ui/)
Reusable, low-level components from Radix UI.
Exported through src/index.ts.

### Domain Components (src/components/)
Higher-level components composing UI primitives.
Organized by feature area (upsell, multimedia, etc.).

### Stories (src/stories/)
Storybook documentation separate from components.
Named pattern: ComponentName.stories.tsx

## Development Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Dev server (localhost:5173)
pnpm storybook        # Storybook (localhost:6006)
pnpm build            # Production build
pnpm lint             # Lint code
pnpm test             # Run tests (watch)
pnpm test run         # Run tests once
pnpm test --coverage  # Test coverage report
```

## Coding Standards

- Use TypeScript with strict mode
- Use @/ alias for imports
- Use cn() utility for class merging
- Use design tokens from src/index.css
- All components must be accessible (Radix UI)
- Test coverage >= 70%

## Styling System

- Tailwind 4 with CSS variables
- Design tokens in src/index.css
- Use class-variance-authority for variants
- Component styling applied through Tailwind classes

## Testing Strategy

- Unit tests: src/__tests__/unit/
- E2E tests: src/__tests__/e2e/
- Accessibility testing with Playwright
- Minimum 70% coverage threshold
```

### 2. Organize Commands Strategically

Create clear command categories:

```
.claude/commands/
├── component/
│   ├── create.md
│   ├── story.md
│   ├── test.md
│   └── review.md
├── testing/
│   ├── unit.md
│   ├── e2e.md
│   └── coverage.md
├── storybook/
│   ├── story.md
│   └── document.md
└── git/
    ├── commit.md
    └── prepare-pr.md
```

### 3. Use Skills for Complex Workflows

Create Project Skills (`.claude/skills/`) for:
- Component development standards
- Testing methodologies
- Storybook patterns
- Accessibility compliance
- Design system alignment

**Key:** Skills should be self-contained but can reference external documentation.

### 4. Configure MCP Servers for Team

Set up project-scoped MCP servers (checked into git):

```json
.mcp.json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "figma": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

### 5. Set Clear Tool Permissions

For Skills and Commands, define allowed tools:

```markdown
---
allowed-tools: Read, Write, Bash(pnpm test:*), Bash(pnpm build:*)
---
```

This reduces token usage and prevents unintended actions.

### 6. Implement Pre-commit Hooks

Use Claude Code hooks for validation:

```bash
.claude/hooks/
├── pre-tool-use.js    (validate before tools run)
├── post-tool-use.js   (validate after tools run)
└── stop.js            (final validation before completion)
```

### 7. Document Component Patterns

Use Skills to teach Claude your patterns:

```
~/.claude/skills/component-patterns/
├── SKILL.md
├── PATTERNS.md        (your actual patterns)
├── EXAMPLES.md        (code examples)
└── CHECKLIST.md       (validation checklist)
```

### 8. Leverage Storybook for Visual Verification

Enable automatic Storybook checks:

```markdown
---
description: Create component story and verify in Storybook
allowed-tools: Write, Bash(pnpm storybook:*)
---

After creating the component, create the story file and verify:

1. Story file created: src/stories/ComponentName.stories.tsx
2. Story renders in Storybook without errors
3. All props documented with JSDoc
4. Multiple variants visible
5. Responsive layout verified
```

---

## Recommended Setup for ABS UI Toolkit

### Phase 1: Initialize Infrastructure (Week 1)

#### 1.1 Set up CLAUDE.md
```bash
/init  # Let Claude initialize with CLAUDE.md
```

Verify content includes:
- Tech stack details
- Component architecture
- Development commands
- Coding standards

#### 1.2 Create Core Custom Commands
```bash
mkdir -p .claude/commands/{component,testing,storybook,git}

# Create essential commands
.claude/commands/component/create.md
.claude/commands/component/story.md
.claude/commands/component/test.md
.claude/commands/testing/unit.md
.claude/commands/testing/e2e.md
```

#### 1.3 Create Core Agent Skills
```bash
mkdir -p .claude/skills/{component-development,storybook-enhancement,testing-suite}

# Each with SKILL.md + supporting docs
```

#### 1.4 Set up Project MCP Servers
```bash
# GitHub (project-scoped, shared)
claude mcp add --transport http github --scope project https://api.githubcopilot.com/mcp/

# Figma (project-scoped for design reference)
claude mcp add --transport http figma --scope project https://mcp.figma.com/mcp

# Create .mcp.json in git
git add .mcp.json
git commit -m "Set up project MCP servers"
```

### Phase 2: Development Workflow Setup (Week 2)

#### 2.1 Set up Personal MCP Servers
```bash
# Playwright (personal preference)
claude mcp add --transport stdio playwright --scope user -- npx -y @executeautomation/mcp-playwright

# Sentry (monitoring)
claude mcp add --transport http sentry --scope user https://mcp.sentry.dev/mcp
```

#### 2.2 Create Development Command Suite
Commands for daily use:
```bash
.claude/commands/dev/quick-test.md
.claude/commands/dev/storybook-check.md
.claude/commands/dev/lint-and-check.md
```

#### 2.3 Create Code Review Commands
```bash
.claude/commands/review/component-quality.md
.claude/commands/review/accessibility.md
.claude/commands/review/story-completeness.md
```

### Phase 3: Team Enablement (Week 3)

#### 3.1 Document Workflows
```bash
.claude/docs/
├── COMPONENT_WORKFLOW.md
├── TESTING_GUIDE.md
├── STORYBOOK_PATTERNS.md
└── ACCESSIBILITY_CHECKLIST.md
```

#### 3.2 Create Team Skills Plugin
Package Skills as a plugin for easy sharing:
```bash
abs-toolkit-plugin/
├── plugin.json
├── .claude/
│   ├── commands/ (team commands)
│   ├── skills/   (team skills)
│   └── hooks/    (validation hooks)
└── README.md
```

#### 3.3 Set up Git Workflow
Create commit message command:
```bash
.claude/commands/git/commit-component.md
.claude/commands/git/prepare-story-pr.md
```

### Phase 4: Continuous Improvement (Ongoing)

#### 4.1 Monitor Token Usage
```bash
/cost  # Check token efficiency
/context  # Monitor context size
```

#### 4.2 Refine Commands Based on Usage
Consolidate underused commands, expand useful ones.

#### 4.3 Gather Team Feedback
- Which commands save the most time?
- What new workflows are needed?
- Where does Claude struggle?

---

## Workflow Examples

### Example 1: Create a New UI Component

**Trigger:**
```
I need to create a new Button component based on Radix UI with Tailwind styling
```

**What Claude Should Do:**

1. **Recognize skill**: `component-development` skill activates
2. **Understand context**: Reads design token docs, Radix patterns
3. **Create component**:
   - Writes TypeScript component with Radix UI
   - Applies Tailwind classes
   - Exports from src/index.ts
4. **Create story**: Writes comprehensive Storybook story
5. **Write tests**: Unit tests + accessibility tests
6. **Verify**: Checks Storybook renders, tests pass

### Example 2: Review Component for Accessibility

**Trigger:**
```
/review-component
```

**What Happens:**

1. Claude reads component file
2. Checks against accessibility standards
3. Validates ARIA attributes
4. Tests keyboard navigation
5. Verifies semantic HTML
6. Suggests improvements

### Example 3: Prepare Pull Request

**Trigger:**
```
/prepare-pr
```

**What Claude Does:**

1. Runs tests and coverage
2. Builds component
3. Verifies Storybook
4. Generates PR description
5. Lists breaking changes (if any)
6. Suggests reviewers

### Example 4: Validate Design System Compliance

**Trigger:**
```
Check that this component follows ABS design system
```

**What Claude Does:**

1. **Recognizes skill**: `design-system-alignment` activates
2. **Checks tokens**: Verifies Tailwind token usage
3. **Validates Radix**: Ensures proper primitive usage
4. **Tests responsive**: Checks all breakpoints
5. **Verifies accessibility**: Tests keyboard + screen reader
6. **Reports**: Lists compliance gaps

### Example 5: Run Full Test Suite

**Trigger:**
```
/test-all
```

**What Claude Does:**

1. Runs Vitest with coverage
2. Runs Playwright E2E tests
3. Checks TypeScript compilation
4. Runs linting
5. Generates coverage report
6. Suggests coverage improvements

---

## Token Optimization Tips

### 1. Use Slash Commands for Frequent Tasks
- Reduces repetition in prompting
- Commands cached in context efficiently
- ~20% token reduction reported by users

### 2. Leverage Skills Selectively
- Skills only loaded when relevant
- Progressive disclosure of context
- Reduces unnecessary token usage

### 3. Limit Command Scope
```markdown
---
allowed-tools: Read, Grep  # Only what's needed
---
```

### 4. Use File References Instead of Content
```
@src/components/Button.tsx  # Better than copying file content
```

### 5. Organize Commands in Directories
- Keeps context window clean
- Easier to discover related commands
- Better for team onboarding

### 6. Monitor with /context
```
/context  # Shows token usage breakdown
/cost     # Shows token costs
```

---

## Troubleshooting

### Issue: Skill Not Activating

**Symptoms:** You ask a relevant question but skill doesn't activate

**Check:**
1. Description is specific (not vague)
2. Include both "what" and "when" in description
3. File path is correct (personal vs project)
4. YAML syntax is valid

**Example Fix:**

**Too vague:**
```
description: Helps with testing
```

**Specific:**
```
description: Write unit tests with Vitest and E2E tests with Playwright. Use when creating tests for React components, testing accessibility, validating user interactions.
```

### Issue: Command Not Found

**Symptoms:** `/command` not recognized

**Check:**
1. File exists: `ls .claude/commands/` or `ls ~/.claude/commands/`
2. File extension is `.md`
3. No spaces in filename
4. Use `/help` to list available commands

### Issue: MCP Server Connection Failed

**Symptoms:** MCP tool produces errors

**Check:**
1. Server is running: `claude mcp list`
2. Authentication needed: `/mcp` (authenticate)
3. Network connectivity (for HTTP servers)
4. Timeout: set `MCP_TIMEOUT` environment variable

### Issue: Token Usage Too High

**Symptoms:** Commands using excessive tokens

**Solutions:**
1. Use `/compact` to compress conversation
2. Use `/rewind` to remove unnecessary history
3. Split task into multiple sessions
4. Add `allowed-tools` to limit tool availability

---

## Summary & Quick Reference

### Installation Commands

```bash
# Set up project infrastructure
mkdir -p .claude/{commands,skills,docs,hooks}
mkdir -p ~/.claude/commands
mkdir -p ~/.claude/skills

# Add MCP servers
claude mcp add --transport http github --scope project https://api.githubcopilot.com/mcp/
claude mcp add --transport http figma --scope project https://mcp.figma.com/mcp
claude mcp add --transport stdio playwright --scope user -- npx -y @executeautomation/mcp-playwright

# Verify
claude mcp list
/help  # See all available commands
```

### Essential Files to Create

```
.claude/
├── CLAUDE.md (project context)
├── commands/
│   ├── component/create.md
│   ├── component/story.md
│   ├── testing/unit.md
│   └── git/commit.md
├── skills/
│   ├── component-development/SKILL.md
│   ├── storybook-enhancement/SKILL.md
│   └── testing-suite/SKILL.md
├── hooks/
│   ├── pre-tool-use.js
│   └── post-tool-use.js
└── docs/
    ├── COMPONENT_WORKFLOW.md
    ├── TESTING_GUIDE.md
    └── ACCESSIBILITY_CHECKLIST.md

.mcp.json (shared with team)
```

### Most Valuable Tools for ABS

1. **Playwright MCP** - E2E testing & visual validation
2. **GitHub MCP** - PR management & code review
3. **Figma MCP** - Design system alignment
4. **Custom Component Skill** - Component development standards
5. **Custom Testing Skill** - Testing methodology

### Team Workflow

```
1. Developer asks question or uses /command
2. Claude recognizes applicable Skill
3. Skill provides context + examples
4. Claude executes task with verified approach
5. MCP servers provide real-time feedback (tests, design checks)
6. /prepare-pr generates description & checks
7. PR submitted with comprehensive documentation
```

---

## Resources & Links

### Official Documentation
- **Claude Code Docs**: docs.claude.com/claude-code
- **Slash Commands**: docs.claude.com/claude-code/slash-commands
- **Agent Skills**: docs.claude.com/claude-code/skills
- **MCP Integration**: docs.claude.com/claude-code/mcp
- **Best Practices**: anthropic.com/engineering/claude-code-best-practices

### Community Resources
- **Claude Command Suite**: github.com/qdhenry/Claude-Command-Suite
- **Awesome Claude Code**: github.com/hesreallyhim/awesome-claude-code
- **MCP Servers**: github.com/modelcontextprotocol/servers
- **Claude MCP Community**: claudemcp.com

### Project-Specific
- **ABS Repository**: /Users/hotel/Documents/ABS
- **Tech Stack**: React 19, Vite, Tailwind 4, Radix UI, Storybook 8
- **Package Manager**: pnpm (as per your CLAUDE.md)

---

**Last Updated:** November 5, 2025
**For Questions:** Consult official Claude Code documentation or community resources above
