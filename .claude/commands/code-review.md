# Frontend Code Review Command

Perform comprehensive frontend code review and generate improvement plans, then create GitHub issues for implementation.

## Usage

**Phase 1 - Review & Planning**: `@code-review [file-path or component-name]`
**Phase 2 - Execution**: After review approval, create GitHub issues for improvements

## Instructions

### Phase 1: Code Review & Analysis

When you provide a file path or component name:

1. **Code Analysis**
   - Review the specified files or components
   - Analyze React patterns, TypeScript usage, and component structure
   - Check Next.js best practices and performance considerations
   - Assess UI/UX implementation and accessibility compliance

2. **Issue Identification**
   - Categorize findings by severity and type
   - Identify performance bottlenecks and optimization opportunities
   - Check for accessibility violations and UX improvements
   - Find TypeScript type safety issues and code quality concerns

3. **Improvement Planning**
   - Prioritize issues by impact and effort required
   - Group related issues into logical improvement tasks
   - Plan implementation approach for each improvement
   - Estimate effort and complexity for each task

4. **Recommendation Generation**
   - Provide specific, actionable recommendations
   - Include code examples and best practices
   - Suggest modern React patterns and optimizations
   - Reference design system and project conventions

### Phase 2: GitHub Issue Creation & Implementation

After review approval:

5. **Create Improvement Issues**
   - Use `gh issue create` for each major improvement area
   - Create separate issues for different categories (performance, accessibility, etc.)
   - Add appropriate labels (improvement, refactor, accessibility, performance)
   - Assign to project board with proper priority

6. **Implementation Planning**
   - Create feature branches for each improvement
   - Follow the planned approach from the review
   - Implement changes incrementally to avoid breaking functionality
   - Test thoroughly after each change

7. **Quality Validation**
   - Verify improvements meet the intended goals
   - Test for regressions and side effects
   - Validate accessibility improvements
   - Measure performance gains where applicable

## Review Focus Areas

1. **React & TypeScript Quality**
   - Component patterns and hooks usage
   - TypeScript type safety and interfaces
   - Performance and re-rendering optimization
   - Error handling and edge cases

2. **UI/UX & Accessibility**
   - Design system compliance
   - Responsive design implementation
   - WCAG accessibility guidelines
   - User interaction patterns

3. **Next.js & Performance**
   - Server vs Client Components usage
   - Bundle size and optimization
   - Core Web Vitals metrics
   - SEO and metadata implementation

4. **Code Organization**
   - File structure and naming conventions
   - Component composition and reusability
   - Import organization and dependencies
   - Documentation and comments

## Output Format for Phase 1

```
## Code Review Summary
- Files reviewed: [list]
- Overall code quality: [excellent/good/needs improvement]
- Major findings: [count by category]

## Critical Issues (Must Fix)
### Issue 1: [Title]
- **File**: [file path]
- **Lines**: [line numbers]
- **Problem**: [description]
- **Impact**: [user/performance/maintainability impact]
- **Solution**: [specific recommendation]
- **Effort**: [low/medium/high]

## Performance Improvements
### Issue 1: [Title]
- **File**: [file path]
- **Problem**: [description]
- **Recommendation**: [solution]
- **Expected Impact**: [performance gain]

## Accessibility Issues
### Issue 1: [Title]
- **File**: [file path]
- **WCAG Level**: [A/AA/AAA]
- **Problem**: [description]
- **Solution**: [accessibility fix]

## Code Quality Improvements
### Issue 1: [Title]
- **File**: [file path]
- **Category**: [TypeScript/React/Architecture]
- **Recommendation**: [improvement]
- **Benefits**: [maintainability/readability]

## UI/UX Improvements
### Issue 1: [Title]
- **Component**: [component name]
- **Issue**: [UX problem]
- **Suggestion**: [design improvement]

## Implementation Plan
1. **Priority 1 (Critical)**: [issues to fix first]
2. **Priority 2 (Important)**: [issues to fix next]
3. **Priority 3 (Nice to have)**: [future improvements]

## Estimated Effort
- Total estimated time: [X hours/days]
- Critical fixes: [X hours]
- Performance improvements: [X hours]
- Code quality: [X hours]
```

Remember to provide specific file paths, line numbers, and actionable recommendations for each identified issue.
