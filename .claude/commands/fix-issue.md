# Fix Frontend Issue Command

Generate a comprehensive plan to fix frontend/UI/UX issues, then create GitHub issues and execute the fix.

## Usage

**Phase 1 - Planning**: `@fix-issue "Description of the UI bug or issue"`
**Phase 2 - Execution**: After plan approval, create GitHub issue and implement the fix

## Instructions

### Phase 1: Issue Analysis & Planning

When you provide an issue description: **$ARGUMENTS**

1. **Issue Analysis**
   - Analyze the provided description to understand the frontend problem
   - Identify the type of issue (UI bug, styling issue, component behavior, accessibility, performance)
   - Determine the scope and complexity of the fix
   - Identify potentially affected components, pages, or systems

2. **Root Cause Hypothesis**
   - Search the codebase for relevant React components and files
   - Identify likely causes based on the description
   - Check for common frontend issues (responsive design, state management, styling conflicts)
   - Review related TypeScript errors or console warnings

3. **Solution Planning**
   - Design a fix approach following React best practices
   - Plan the implementation steps and file changes needed
   - Consider responsive design and accessibility implications
   - Estimate the complexity and time required
   - Identify any potential side effects or breaking changes

4. **Create Execution Plan**
   - Provide a detailed step-by-step plan
   - List specific files that need to be modified
   - Include testing strategy and validation steps
   - Suggest commit messages and PR structure

### Phase 2: GitHub Issue Creation & Execution

After plan approval:

5. **Create GitHub Issue**
   - Use `gh issue create` with descriptive title and labels
   - Include the approved plan in the issue description
   - Add appropriate labels (bug, frontend, ui, accessibility, etc.)
   - Assign to project and set priority

6. **Implementation**
   - Create feature branch: `git checkout -b fix/issue-{number}`
   - Follow the approved plan step by step
   - Implement fixes with clean TypeScript/React code
   - Test across browsers and screen sizes
   - Ensure accessibility compliance

7. **Quality Assurance**
   - Run linting and TypeScript checks
   - Test responsive behavior and component states
   - Validate accessibility with screen readers
   - Check for console errors and performance issues

8. **Pull Request**
   - Create PR linking to the GitHub issue
   - Include before/after screenshots
   - Document changes and testing performed
   - Request appropriate reviewers

## Output Format for Phase 1

```
## Issue Analysis
- Issue type: [bug type]
- Affected components: [list]
- Severity: [low/medium/high/critical]

## Root Cause Assessment
- Likely cause: [description]
- Affected files: [file list]
- Related systems: [contexts, hooks, etc.]

## Proposed Solution
- Approach: [description]
- Files to modify: [list]
- Estimated complexity: [low/medium/high]

## Implementation Plan
1. [Step 1]
2. [Step 2]
...

## Testing Strategy
- [Testing approach]
- [Validation steps]

## Potential Risks
- [Any risks or side effects]
```

Remember to focus on user experience, accessibility, and maintainable solutions.