import type { Meta } from '@storybook/react'
import React from 'react'
import { StoryWrapper } from './StoryWrapper'

// Simplified template for creating component stories
export function createComponentMeta(
  title: string,
  component: React.ComponentType<any>,
  description?: string,
  defaultArgs?: Record<string, any>
): Meta<typeof component> {
  return {
    title,
    component,
    parameters: {
      layout: 'fullscreen',
      docs: {
        description: {
          component: description,
        },
      },
    },
    tags: ['autodocs'],
    args: defaultArgs,
  }
}

// Utility function to create a simple story
export function createSimpleStory(component: React.ComponentType<any>, args: Record<string, any>, title: string) {
  return {
    args,
    render: (storyArgs: Record<string, any>) => (
      <StoryWrapper title={title}>{React.createElement(component, { ...args, ...storyArgs })}</StoryWrapper>
    ),
  }
}

// Utility function to create a story with wrapper
export function createWrappedStory(
  component: React.ComponentType<any>,
  args: Record<string, any>,
  wrapperTitle: string,
  layout: 'fullscreen' | 'padded' | 'centered' = 'fullscreen'
) {
  return {
    args,
    render: (storyArgs: Record<string, any>) => (
      <StoryWrapper title={wrapperTitle} layout={layout}>
        {React.createElement(component, { ...args, ...storyArgs })}
      </StoryWrapper>
    ),
  }
}
