
# Claude Code Quick Start Guide - ABS UI Toolkit

**Get productive with Claude Code in 15 minutes**

---

## Step 1: Initialize Project (2 minutes)

```bash
cd /Users/hotel/Documents/ABS

# Initialize Claude Code with context
claude /init

# This creates/updates CLAUDE.md with project guidance
```

**What it does:**
- Creates `.claude/` directory structure
- Sets up CLAUDE.md for Claude Code context
- Configures path aliases and settings

---

## Step 2: Set Up 3 Essential Custom Commands (5 minutes)

### Command 1: Component Story Creator

```bash
mkdir -p .claude/commands/component
```

Create file: `.claude/commands/component/story.md`

```markdown
---
argument-hint: [component-name]
description: Generate comprehensive Storybook story for a component
---

# Create Component Story

Generate a Storybook story for component: $1

## Requirements

1. **File**: src/stories/$1.stories.tsx
2. **Include**:
   - Default export story
   - Multiple variants (different props)
   - State variations (disabled, hover, focus)
   - Responsive variants
3. **Document**:
   - JSDoc prop types
   - Usage examples
   - Accessible patterns
4. **Verify**: Story renders in Storybook without errors
```

**Usage:** `/story ButtonComponent`

### Command 2: Quick Component Test

Create file: `.claude/commands/component/test.md`

```markdown
---
description: Write unit tests for a React component with Vitest
allowed-tools: Write, Bash(pnpm test:*)
---

# Write Component Tests

Write comprehensive Vitest tests for the component.

## Coverage Areas

1. **Rendering**: Component renders with required props
2. **Props**: Props are applied correctly
3. **Events**: User interactions trigger handlers
4. **Accessibility**: ARIA attributes present, keyboard navigation works
5. **Edge Cases**: Undefined props, empty states

## File Location

Tests go in: `src/__tests__/unit/[ComponentName].test.tsx`

## Test Pattern

Use happy-dom test environment.
Import component from src/components/ui/ or src/components/
Test coverage minimum: 70%
```

**Usage:** `/test`

### Command 3: Component Review

Create file: `.claude/commands/component/review.md`

```markdown
---
description: Comprehensive component quality review
allowed-tools: Read, Grep
---

# Component Quality Review

Review component for:

## Code Quality
- TypeScript strict mode compliance
- Prop interfaces properly typed
- No `any` types
- Clear variable names

## Accessibility (WCAG 2.1 AA)
- ARIA attributes correct
- Keyboard navigation works
- Screen reader friendly
- Color contrast >= 4.5:1

## Styling
- Uses Tailwind 4 tokens
- Uses cn() for class merging
- Responsive breakpoints correct
- Dark mode support if needed

## Testing
- Unit test coverage >= 70%
- Story file exists and complete
- E2E tests for key interactions

## Documentation
- Props documented with JSDoc
- Component purpose clear
- Usage examples in story
- Breaking changes noted (if any)

Provide specific actionable feedback.
```

**Usage:** `/review`

---

## Step 3: Create 2 Essential Agent Skills (5 minutes)

### Skill 1: Component Development

```bash
mkdir -p .claude/skills/component-dev
```

Create file: `.claude/skills/component-dev/SKILL.md`

```markdown
---
name: component-development
description: Develop React components following ABS standards. Use when building UI components, implementing Radix UI patterns, writing Storybook stories, and testing components. Covers component architecture, accessibility, responsive design, and testing.
---

# Component Development Skill

## When to Use

- Creating new UI primitive components
- Building components that compose primitives
- Setting up Storybook documentation
- Implementing accessibility features
- Writing component tests

## Component Architecture

**UI Primitives** (`src/components/ui/`)
- Low-level reusable components
- Built on Radix UI
- Export through `src/index.ts`
- Examples: Button, Card, Dialog, Input

**Domain Components** (`src/components/`)
- High-level feature components
- Compose UI primitives
- Organized by feature
- Examples: PricingSummaryPanel, RoomCustomization

## Development Checklist

1. **Component File**
   - Export proper TypeScript types
   - Use Radix UI primitives
   - Apply Tailwind classes
   - Add JSDoc comments

2. **Story File** (`src/stories/ComponentName.stories.tsx`)
   - Meta with title and description
   - Default story
   - Prop variants
   - State variations
   - Responsive variants

3. **Test File** (`src/__tests__/unit/ComponentName.test.tsx`)
   - Rendering tests
   - Props tests
   - Event handler tests
   - Accessibility tests
   - Minimum 70% coverage

4. **Verification**
   - TypeScript compiles
   - Story renders in Storybook
   - All tests pass
   - No console errors/warnings
   - Accessibility audit passes

## Styling Guidelines

- Use Tailwind 4 classes
- Use `cn()` utility for conditional classes
- Apply design tokens from `src/index.css`
- Support responsive with breakpoints
- Test on sm, md, lg, xl viewports

## Accessibility Checklist

- ARIA labels on interactive elements
- Keyboard navigation supported
- Focus states visible
- Color contrast >= 4.5:1
- Semantic HTML structure
- Screen reader compatible

## Key Files

- `src/components/ui/` - UI primitives
- `src/components/` - Domain components
- `src/stories/` - Storybook stories
- `src/__tests__/unit/` - Unit tests
- `src/__tests__/e2e/` - E2E tests
- `src/index.css` - Design tokens
- `src/index.ts` - Public exports
```

### Skill 2: Testing Suite

```bash
mkdir -p .claude/skills/testing
```

Create file: `.claude/skills/testing/SKILL.md`

```markdown
---
name: testing-suite
description: Write and run tests for components with Vitest and Playwright. Use when creating unit tests, E2E tests, analyzing coverage, and validating component behavior.
allowed-tools: Write, Bash(pnpm test:*), Bash(pnpm test run), Read, Glob
---

# Testing Suite Skill

## Test Types

### Unit Tests (Vitest)
- Component rendering
- Props validation
- Event handlers
- State management
- Conditional rendering

### E2E Tests (Playwright)
- User interactions
- Form submissions
- Navigation flows
- Mobile responsiveness
- Accessibility features

### Accessibility Tests
- Keyboard navigation
- Screen reader output
- ARIA attributes
- Color contrast
- Focus management

## Test Structure

```
src/__tests__/
├── unit/
│   └── ComponentName.test.tsx
├── e2e/
│   └── component-interactions.spec.ts
├── setup/
│   └── vitest.setup.ts
└── mocks/
    └── mock-data.ts
```

## Commands

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test run

# Coverage report
pnpm test --coverage

# Run Playwright tests
pnpm playwright test

# Debug Playwright
pnpm playwright test --debug
```

## Coverage Requirements

- Minimum 70% coverage overall
- All critical user paths covered
- Error cases tested
- Edge cases handled

## Best Practices

1. **Test behavior, not implementation**
2. **Use semantic queries** (getByRole, getByLabelText)
3. **Avoid implementation details**
4. **Test accessibility alongside functionality**
5. **Keep tests focused** (one concept per test)
6. **Use descriptive test names**
```

---

## Step 4: Set Up MCP Servers (3 minutes)

### Essential MCP Setup

```bash
# GitHub for PR management (project-scoped - shared with team)
claude mcp add --transport http github --scope project https://api.githubcopilot.com/mcp/

# Figma for design reference (project-scoped)
claude mcp add --transport http figma --scope project https://mcp.figma.com/mcp

# Playwright for testing (user-scoped - your preference)
claude mcp add --transport stdio playwright --scope user -- npx -y @executeautomation/mcp-playwright

# Verify setup
claude mcp list
```

**What you can now do:**

```
# GitHub: "Create a PR for this component with description"
# Figma: "Compare this with the Figma design at @figma:link"
# Playwright: "Test this component on mobile viewport"
```

---

## Step 5: Test It Out (First Run)

### Test Your Setup

```bash
# See your commands
/help

# Test a command
/story MyNewComponent

# Test a skill activation
# (Just ask Claude to create a component - skill should activate)

# Check MCP servers
/mcp
```

### Verify Everything Works

```bash
# Check project health
claude /doctor

# Monitor token usage
/context
```

---

## Quick Reference: Your New Superpowers

### Creating Components

```
You: "Create a Button component with Tailwind styling and story"

Claude:
1. Recognizes component-development skill
2. Creates Component → Story → Tests
3. Verifies Storybook renders
4. Reports test coverage
```

### Testing Components

```
You: "/test" (while reviewing a component)

Claude:
1. Writes comprehensive Vitest suite
2. Includes accessibility tests
3. Runs tests and reports coverage
4. Suggests gaps in coverage
```

### Code Review

```
You: "/review" (while looking at component)

Claude:
1. Checks accessibility (WCAG 2.1 AA)
2. Verifies TypeScript
3. Reviews Tailwind usage
4. Checks test coverage
5. Provides actionable feedback
```

### Creating Stories

```
You: "/story Button"

Claude:
1. Creates comprehensive story file
2. Includes all prop variants
3. Documents responsive behavior
4. Verifies in Storybook
5. Notes documentation gaps
```

### Managing PRs

```
You: "Create a PR for this component"

Claude (with GitHub MCP):
1. Stages changes
2. Creates PR title & description
3. Links to related issues
4. Requests reviewers
5. Runs validation checks
```

---

## Recommended Daily Workflow

### Morning: Start Task

```
You: "What's next for ABS components?"

Claude:
1. Reads CLAUDE.md for context
2. Checks current branch
3. Lists pending components
4. Activates appropriate skills
5. Provides next steps
```

### Development: Build Component

```
You: "Create [ComponentName] component"

Claude:
1. Component development skill activates
2. Creates component file
3. Creates story file
4. Writes tests
5. Verifies everything compiles
```

### Testing: Validate Work

```
You: "/test"

Claude:
1. Generates comprehensive tests
2. Runs Vitest
3. Generates coverage report
4. Suggests improvements
```

### Review: Quality Gate

```
You: "/review"

Claude:
1. Reviews for accessibility
2. Checks TypeScript compliance
3. Validates story documentation
4. Tests coverage
5. Provides improvement suggestions
```

### Submit: Create PR

```
You: "/prepare-pr"

Claude (with GitHub MCP):
1. Runs full test suite
2. Builds component
3. Generates PR description
4. Links related issues
5. Suggests reviewers
```

---

## Troubleshooting Common Issues

### "Command not found"

**Problem:** `/story` not working
**Solution:**
```bash
ls .claude/commands/  # Verify file exists
/help  # Check if listed
```

### "Skill not activating"

**Problem:** You ask about components but skill doesn't activate
**Solution:**
1. Check description is specific (not vague)
2. Describe what Skill does AND when to use it
3. Include keywords: "component", "create", "Radix UI"

Example:
```
# Bad:
description: Helps with components

# Good:
description: Build React UI components with Radix UI and Tailwind. Use when creating buttons, cards, inputs, and other reusable UI primitives.
```

### "Token usage too high"

**Problem:** Commands using too many tokens
**Solutions:**
```bash
/context  # See breakdown
/compact  # Compress conversation
/rewind   # Remove unnecessary history

# Or add allowed-tools to skills:
allowed-tools: Read, Write, Bash(pnpm test:*)
```

### "MCP server not connecting"

**Problem:** GitHub/Figma MCP gives error
**Solution:**
```bash
/mcp  # Check connection
# May need to authenticate in browser
# For Playwright: verify Node.js installed
```

---

## Next Steps (Optional Enhancements)

### After Setup Works (Week 2)

1. **Create more specific commands** for your workflows
2. **Add team-specific skills** to `.claude/skills/`
3. **Set up pre-commit hooks** for validation
4. **Create documentation** about your component patterns

### For Advanced Usage (Week 3+)

1. **Build custom Claude Code plugin** for your team
2. **Integrate with Linear/Jira** for issue tracking
3. **Set up Sentry MCP** for production monitoring
4. **Create skill for design system validation**

---

## Success Metrics

After setup, you should:

- [ ] Create components 2-3x faster with CLI assistance
- [ ] Storybook stories auto-generated with comprehensive examples
- [ ] Tests written and passing for all components
- [ ] 70%+ test coverage maintained automatically
- [ ] Code reviews accelerated with accessibility checks
- [ ] PR descriptions generated automatically
- [ ] Fewer back-and-forth revisions on components
- [ ] Clear documentation for team workflows

---

## File Checklist

Verify you have created:

```
.claude/
├── commands/
│   └── component/
│       ├── story.md ✓
│       ├── test.md ✓
│       └── review.md ✓
├── skills/
│   ├── component-dev/
│   │   └── SKILL.md ✓
│   └── testing/
│       └── SKILL.md ✓
└── CLAUDE.md (already exists)

.mcp.json (created by: claude mcp add)
```

Once these exist:
- [ ] Run `/help` - see your commands listed
- [ ] Run `/story Button` - command works
- [ ] Ask Claude to "create a component" - skill activates
- [ ] Run `/mcp` - see connected servers

---

## Need Help?

### Check Documentation
- Full guide: `/Users/hotel/Documents/ABS/CLAUDE_CODE_TOOLKIT.md`
- Official docs: docs.claude.com/claude-code
- Best practices: anthropic.com/engineering/claude-code-best-practices

### Get Support
```bash
/help           # Built-in help
/status         # Check installation
claude /doctor  # Health check
```

### Report Issues
```bash
/bug  # Report to Anthropic
```

---

**You're ready to start! Pick a component and try: "Create a [ComponentName] component"**

The rest happens automatically with your new tools.
