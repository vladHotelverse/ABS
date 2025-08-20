import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import EmptyState from '../EmptyState'
import type { AvailableSection } from '../../types'

// Mock SectionCard component
vi.mock('../SectionCard', () => {
  return {
    default: ({ section, exploreLabel, fromLabel, euroSuffix }: any) => (
      <div data-testid="section-card">
        <span>{section.label}</span>
        <span>{fromLabel} {section.startingPrice} {euroSuffix}</span>
        <span>{exploreLabel}</span>
      </div>
    )
  }
})

describe('EmptyState Component', () => {
  const mockProps = {
    emptyCartMessage: 'Your cart is empty',
    exploreLabel: 'Explore',
    fromLabel: 'from',
    euroSuffix: '€',
    customizeStayTitle: 'Customize Your Stay',
    chooseOptionsSubtitle: 'Choose from available options below'
  }

  const mockSingleSection: AvailableSection = {
    type: 'room' as const,
    label: 'Rooms',
    startingPrice: 100,
    isAvailable: true
  }

  const mockMultipleSections: AvailableSection[] = [
    {
      type: 'room' as const,
      label: 'Rooms',
      startingPrice: 100,
      isAvailable: true
    },
    {
      type: 'offer' as const,
      label: 'Special Offers',
      startingPrice: 25,
      isAvailable: true
    }
  ]

  it('should render single section layout with icon', () => {
    render(
      <EmptyState
        {...mockProps}
        availableActiveSections={[mockSingleSection]}
      />
    )

    // Should show the icon for single section
    expect(screen.getByText('Customize Your Stay')).toBeInTheDocument()
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
    
    // Should have the icon container with proper classes
    const iconContainer = document.querySelector('.w-16.h-16.bg-neutral-100.rounded-full')
    expect(iconContainer).toBeInTheDocument()
    expect(iconContainer).toHaveClass('w-16', 'h-16', 'bg-neutral-100', 'rounded-full')
  })

  it('should render multiple sections layout with cards', () => {
    render(
      <EmptyState
        {...mockProps}
        availableActiveSections={mockMultipleSections}
      />
    )

    // Should show multiple section layout
    expect(screen.getByText('Customize Your Stay')).toBeInTheDocument()
    expect(screen.getByText('Choose from available options below')).toBeInTheDocument()
    
    // Should render grid container for section cards
    const gridContainer = document.querySelector('.grid')
    expect(gridContainer).toHaveClass('grid', 'gap-3', 'grid-cols-1')
    
    // Should render mocked section cards
    expect(screen.getAllByTestId('section-card')).toHaveLength(2)
    expect(screen.getByText('Rooms')).toBeInTheDocument()
    expect(screen.getByText('Special Offers')).toBeInTheDocument()
  })

  it('should handle empty sections array', () => {
    render(
      <EmptyState
        {...mockProps}
        availableActiveSections={[]}
      />
    )

    // Should default to multiple sections layout even with empty array
    expect(screen.getByText('Customize Your Stay')).toBeInTheDocument()
    expect(screen.getByText('Choose from available options below')).toBeInTheDocument()
  })

  it('should display correct titles and messages', () => {
    const customProps = {
      ...mockProps,
      customizeStayTitle: 'Custom Title',
      emptyCartMessage: 'Custom empty message',
      chooseOptionsSubtitle: 'Custom subtitle'
    }

    render(
      <EmptyState
        {...customProps}
        availableActiveSections={[mockSingleSection]}
      />
    )

    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom empty message')).toBeInTheDocument()
    
    // Test multiple sections layout with custom text
    render(
      <EmptyState
        {...customProps}
        availableActiveSections={mockMultipleSections}
      />
    )
    
    expect(screen.getByText('Custom subtitle')).toBeInTheDocument()
  })

  it('should have proper styling classes', () => {
    render(
      <EmptyState
        {...mockProps}
        availableActiveSections={[mockSingleSection]}
      />
    )

    // Check for proper text styling
    const title = screen.getByText('Customize Your Stay')
    expect(title).toHaveClass('text-base', 'font-medium', 'text-neutral-900')
    
    const message = screen.getByText('Your cart is empty')
    expect(message).toHaveClass('text-sm', 'text-neutral-500', 'max-w-sm', 'mx-auto')
  })

  it('should render accessibility-friendly structure', () => {
    render(
      <EmptyState
        {...mockProps}
        availableActiveSections={[mockSingleSection]}
      />
    )

    // Title should be in h3 for proper heading hierarchy
    const title = screen.getByRole('heading', { level: 3 })
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent('Customize Your Stay')
  })
})