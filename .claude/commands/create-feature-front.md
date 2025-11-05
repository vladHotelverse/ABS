# Create Frontend Feature Command

Generate a comprehensive plan for new frontend features and UI components, then create GitHub issues and implement.

## Usage

**Phase 1 - Planning**: `@create-feature "Description of the new feature or component"`
**Phase 2 - Execution**: After plan approval, create GitHub issue and implement the feature

## Instructions

### Phase 1: Feature Analysis & Planning

When you provide a feature description: **$ARGUMENTS**

1. **Feature Analysis**
   - Analyze the provided description to understand requirements
   - Identify the type of feature (new page, component, interaction, enhancement)
   - Determine user stories and acceptance criteria
   - Assess the scope and complexity of implementation

2. **Technical Research**
   - Search existing codebase for similar patterns and components
   - Identify reusable components from the design system
   - Check for existing contexts, hooks, and utilities to leverage
   - Review relevant Next.js patterns and best practices

3. **Architecture Planning**
   - Design component hierarchy and data flow
   - Plan TypeScript interfaces for props and state
   - Identify integration points with existing systems
   - Consider responsive design and accessibility requirements
   - Plan state management approach (local, context, URL state)

4. **Implementation Strategy**
   - Break down the feature into manageable tasks
   - Identify files and components to create/modify
   - Plan development sequence and dependencies
   - Estimate development time and complexity

### Phase 2: GitHub Issue Creation & Development

After plan approval:

5. **Create GitHub Issues**
   - Use `gh issue create` for the main feature
   - Create subtasks for complex features if needed
   - Add appropriate labels (feature, frontend, ui, enhancement)
   - Assign to project board and set milestones

6. **Development Setup**
   - Create feature branch: `git checkout -b feature/{feature-name}`
   - Set up development environment
   - Review design mockups and specifications

7. **Implementation**
   - Follow the approved plan step by step
   - Create components with proper TypeScript interfaces
   - Implement responsive design with Tailwind CSS
   - Add accessibility features and proper error handling
   - Integrate with existing design system

8. **Quality Assurance**
   - Test functionality across browsers and devices
   - Validate responsive behavior and accessibility
   - Run linting, formatting, and TypeScript checks
   - Create component stories for Storybook if applicable

9. **Documentation & Review**
   - Document component APIs and usage
   - Create PR with feature description and demos
   - Include screenshots/videos of the implementation
   - Request design and code review

## Output Format for Phase 1

```
## Feature Analysis
- Feature type: [page/component/enhancement]
- User stories: [list of user stories]
- Acceptance criteria: [list of criteria]
- Complexity: [low/medium/high]

## Technical Requirements
- Required components: [list]
- Existing patterns to leverage: [list]
- New interfaces needed: [list]
- Integration points: [contexts, APIs, etc.]

## Architecture Design
- Component hierarchy: [structure]
- State management: [approach]
- Data flow: [description]
- Responsive considerations: [breakpoints, behavior]

## Implementation Plan
1. [Task 1 with files involved]
2. [Task 2 with files involved]
...

## Development Sequence
- Phase 1: [foundational work]
- Phase 2: [core functionality]
- Phase 3: [polish and testing]

## Estimated Timeline
- Development: [X days/hours]
- Testing: [X days/hours]
- Review: [X days/hours]

## Dependencies & Risks
- Dependencies: [other features, external factors]
- Potential risks: [technical challenges, blockers]
```

Remember to prioritize user experience, code maintainability, and alignment with the existing design system.