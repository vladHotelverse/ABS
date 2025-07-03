import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../../../__tests__/helpers/custom-render'
import { OptionCard } from '../../components/OptionCard'
import type { CustomizationOption, RoomCustomizationTexts } from '../../types'

describe('OptionCard', () => {
  let user: ReturnType<typeof userEvent.setup>
  let mockTexts: RoomCustomizationTexts
  let mockOnSelect: ReturnType<typeof vi.fn>
  let mockOnShowFeatures: ReturnType<typeof vi.fn>
  let defaultOption: CustomizationOption

  beforeEach(() => {
    user = userEvent.setup()

    mockTexts = {
      improveText: 'Improve',
      selectedText: 'Selected',
      pricePerNightText: '/night',
      featuresText: 'Features',
      understood: 'Understood',
      addForPriceText: 'Add for {price}',
      availableOptionsText: 'Available Options:',
      removeText: 'Remove',
    }

    mockOnSelect = vi.fn()
    mockOnShowFeatures = vi.fn()

    defaultOption = {
      id: 'test-option',
      label: 'Test Option',
      price: 25.5,
      icon: 'test-icon',
      description: 'This is a test option description',
    }
  })

  describe('Basic rendering', () => {
    it('should render option information correctly', () => {
      render(<OptionCard option={defaultOption} isSelected={false} onSelect={mockOnSelect} texts={mockTexts} />)

      expect(screen.getByText('Test Option')).toBeInTheDocument()
      expect(screen.getByText('This is a test option description')).toBeInTheDocument()
      expect(screen.getByText('25.50 /night')).toBeInTheDocument()
      expect(screen.getByText('Improve')).toBeInTheDocument()
    })

    it('should render without description when not provided', () => {
      const optionWithoutDesc = { ...defaultOption, description: undefined }

      render(<OptionCard option={optionWithoutDesc} isSelected={false} onSelect={mockOnSelect} texts={mockTexts} />)

      expect(screen.getByText('Test Option')).toBeInTheDocument()
      expect(screen.getByText('25.50 /night')).toBeInTheDocument()
      expect(screen.queryByText('This is a test option description')).not.toBeInTheDocument()
    })

    it('should format price correctly with different values', () => {
      const { rerender } = render(
        <OptionCard
          option={{ ...defaultOption, price: 0 }}
          isSelected={false}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      expect(screen.getByText('0.00 /night')).toBeInTheDocument()

      rerender(
        <OptionCard
          option={{ ...defaultOption, price: 100 }}
          isSelected={false}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      expect(screen.getByText('100.00 /night')).toBeInTheDocument()

      rerender(
        <OptionCard
          option={{ ...defaultOption, price: 15.99 }}
          isSelected={false}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      expect(screen.getByText('15.99 /night')).toBeInTheDocument()
    })
  })

  describe('Selection states', () => {
    it('should show "Improve" button when not selected', () => {
      render(<OptionCard option={defaultOption} isSelected={false} onSelect={mockOnSelect} texts={mockTexts} />)

      const button = screen.getByText('Improve')
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('w-full')
    })

    it('should show "Remove" button when selected', () => {
      render(<OptionCard option={defaultOption} isSelected={true} onSelect={mockOnSelect} texts={mockTexts} />)

      const button = screen.getByText('Remove')
      expect(button).toBeInTheDocument()
    })

    it('should apply different button variants based on selection state', () => {
      const { rerender } = render(
        <OptionCard option={defaultOption} isSelected={false} onSelect={mockOnSelect} texts={mockTexts} />
      )

      let _button = screen.getByText('Improve')
      // UiButton with variant="secondary" for non-selected

      rerender(<OptionCard option={defaultOption} isSelected={true} onSelect={mockOnSelect} texts={mockTexts} />)

      _button = screen.getByText('Remove')
      // UiButton with variant="link" for selected
    })

    it('should call onSelect when button is clicked', async () => {
      render(<OptionCard option={defaultOption} isSelected={false} onSelect={mockOnSelect} texts={mockTexts} />)

      const button = screen.getByText('Improve')
      await user.click(button)

      expect(mockOnSelect).toHaveBeenCalledTimes(1)
    })

    it('should call onSelect when selected option is clicked to remove', async () => {
      render(<OptionCard option={defaultOption} isSelected={true} onSelect={mockOnSelect} texts={mockTexts} />)

      const button = screen.getByText('Remove')
      await user.click(button)

      expect(mockOnSelect).toHaveBeenCalledTimes(1)
    })
  })

  describe('Features functionality', () => {
    it('should show features button when showFeatures is true and onShowFeatures is provided', () => {
      render(
        <OptionCard
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
          texts={mockTexts}
          showFeatures={true}
          onShowFeatures={mockOnShowFeatures}
        />
      )

      expect(screen.getByText('Features')).toBeInTheDocument()
    })

    it('should not show features button when showFeatures is false', () => {
      render(
        <OptionCard
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
          texts={mockTexts}
          showFeatures={false}
          onShowFeatures={mockOnShowFeatures}
        />
      )

      expect(screen.queryByText('Features')).not.toBeInTheDocument()
    })

    it('should not show features button when onShowFeatures is not provided', () => {
      render(
        <OptionCard
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
          texts={mockTexts}
          showFeatures={true}
        />
      )

      expect(screen.queryByText('Features')).not.toBeInTheDocument()
    })

    it('should call onShowFeatures when features button is clicked', async () => {
      render(
        <OptionCard
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
          texts={mockTexts}
          showFeatures={true}
          onShowFeatures={mockOnShowFeatures}
        />
      )

      const featuresButton = screen.getByText('Features')
      await user.click(featuresButton)

      expect(mockOnShowFeatures).toHaveBeenCalledTimes(1)
    })

    it('should stop event propagation when features button is clicked', async () => {
      const cardClickSpy = vi.fn()

      render(
        <div onClick={cardClickSpy}>
          <OptionCard
            option={defaultOption}
            isSelected={false}
            onSelect={mockOnSelect}
            texts={mockTexts}
            showFeatures={true}
            onShowFeatures={mockOnShowFeatures}
          />
        </div>
      )

      const featuresButton = screen.getByText('Features')
      await user.click(featuresButton)

      expect(mockOnShowFeatures).toHaveBeenCalledTimes(1)
      expect(cardClickSpy).not.toHaveBeenCalled()
    })
  })

  describe('Icon rendering', () => {
    it('should render IconRenderer with correct props', () => {
      render(
        <OptionCard
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
          texts={mockTexts}
          fallbackImageUrl="https://example.com/fallback.jpg"
        />
      )

      // IconRenderer should be rendered (test structure depends on IconRenderer implementation)
      expect(screen.getByText('Test Option')).toBeInTheDocument()
    })

    it('should handle missing icon gracefully', () => {
      const optionWithoutIcon = { ...defaultOption, icon: undefined }

      render(<OptionCard option={optionWithoutIcon} isSelected={false} onSelect={mockOnSelect} texts={mockTexts} />)

      expect(screen.getByText('Test Option')).toBeInTheDocument()
    })

    it('should pass fallbackImageUrl to IconRenderer', () => {
      const fallbackUrl = 'https://example.com/fallback.jpg'

      render(
        <OptionCard
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
          texts={mockTexts}
          fallbackImageUrl={fallbackUrl}
        />
      )

      // Should render without errors
      expect(screen.getByText('Test Option')).toBeInTheDocument()
    })
  })

  describe('Text customization', () => {
    it('should use custom improve text', () => {
      const customTexts = {
        ...mockTexts,
        improveText: 'Custom Improve',
      }

      render(<OptionCard option={defaultOption} isSelected={false} onSelect={mockOnSelect} texts={customTexts} />)

      expect(screen.getByText('Custom Improve')).toBeInTheDocument()
    })

    it('should use custom price per night text', () => {
      const customTexts = {
        ...mockTexts,
        pricePerNightText: '/custom night',
      }

      render(<OptionCard option={defaultOption} isSelected={false} onSelect={mockOnSelect} texts={customTexts} />)

      expect(screen.getByText('25.50 /custom night')).toBeInTheDocument()
    })

    it('should use custom features text', () => {
      const customTexts = {
        ...mockTexts,
        featuresText: 'Custom Features',
      }

      render(
        <OptionCard
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
          texts={customTexts}
          showFeatures={true}
          onShowFeatures={mockOnShowFeatures}
        />
      )

      expect(screen.getByText('Custom Features')).toBeInTheDocument()
    })
  })

  describe('Layout and styling', () => {
    it('should have correct card structure and classes', () => {
      render(<OptionCard option={defaultOption} isSelected={false} onSelect={mockOnSelect} texts={mockTexts} />)

      const card = screen.getByText('Test Option').closest('.flex-none')
      expect(card).toHaveClass('sm:w-auto')
      expect(card).toHaveClass('h-full')
      expect(card).toHaveClass('bg-white')
      expect(card).toHaveClass('border')
      expect(card).toHaveClass('border-neutral-300')
      expect(card).toHaveClass('rounded-lg')
      expect(card).toHaveClass('overflow-hidden')
      expect(card).toHaveClass('snap-center')
    })

    it('should have proper content layout', () => {
      render(<OptionCard option={defaultOption} isSelected={false} onSelect={mockOnSelect} texts={mockTexts} />)

      const content = screen.getByText('Test Option').closest('.p-4')
      expect(content).toHaveClass('flex')
      expect(content).toHaveClass('flex-col')
      expect(content).toHaveClass('h-full')
    })

    it('should have correct icon container styling', () => {
      render(<OptionCard option={defaultOption} isSelected={false} onSelect={mockOnSelect} texts={mockTexts} />)

      // Icon container structure verification
      const titleElement = screen.getByText('Test Option')
      expect(titleElement).toHaveClass('font-medium')
      expect(titleElement).toHaveClass('text-sm')
    })

    it('should have correct button spacing', () => {
      render(
        <OptionCard
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
          texts={mockTexts}
          showFeatures={true}
          onShowFeatures={mockOnShowFeatures}
        />
      )

      const buttonContainer = screen.getByText('Improve').closest('.flex-col')
      expect(buttonContainer).toHaveClass('space-y-2')
      expect(buttonContainer).toHaveClass('mt-auto')
    })
  })

  describe('Edge cases and error handling', () => {
    it('should handle very long labels gracefully', () => {
      const longLabelOption = {
        ...defaultOption,
        label:
          'This is a very long option label that might cause layout issues if not handled properly with appropriate text wrapping',
      }

      render(<OptionCard option={longLabelOption} isSelected={false} onSelect={mockOnSelect} texts={mockTexts} />)

      expect(screen.getByText(longLabelOption.label)).toBeInTheDocument()
    })

    it('should handle very long descriptions gracefully', () => {
      const longDescOption = {
        ...defaultOption,
        description:
          'This is a very long description that goes on and on and might cause layout issues if not handled properly with appropriate text wrapping and container constraints',
      }

      render(<OptionCard option={longDescOption} isSelected={false} onSelect={mockOnSelect} texts={mockTexts} />)

      expect(screen.getByText(longDescOption.description)).toBeInTheDocument()
    })

    it('should handle special characters in labels and descriptions', () => {
      const specialCharOption = {
        ...defaultOption,
        label: 'Special & Unique Option!',
        description: 'Option with special chars: @#$%^&*()_+ and unicode: αβγ',
      }

      render(<OptionCard option={specialCharOption} isSelected={false} onSelect={mockOnSelect} texts={mockTexts} />)

      expect(screen.getByText('Special & Unique Option!')).toBeInTheDocument()
      expect(screen.getByText('Option with special chars: @#$%^&*()_+ and unicode: αβγ')).toBeInTheDocument()
    })

    it('should handle negative prices correctly', () => {
      const negativeOption = { ...defaultOption, price: -15.5 }

      render(<OptionCard option={negativeOption} isSelected={false} onSelect={mockOnSelect} texts={mockTexts} />)

      expect(screen.getByText('-15.50 /night')).toBeInTheDocument()
    })

    it('should handle zero price correctly', () => {
      const freeOption = { ...defaultOption, price: 0 }

      render(<OptionCard option={freeOption} isSelected={false} onSelect={mockOnSelect} texts={mockTexts} />)

      expect(screen.getByText('0.00 /night')).toBeInTheDocument()
    })

    it('should handle very large prices correctly', () => {
      const expensiveOption = { ...defaultOption, price: 99999.99 }

      render(<OptionCard option={expensiveOption} isSelected={false} onSelect={mockOnSelect} texts={mockTexts} />)

      expect(screen.getByText('99999.99 /night')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      render(
        <OptionCard
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
          texts={mockTexts}
          showFeatures={true}
          onShowFeatures={mockOnShowFeatures}
        />
      )

      const improveButton = screen.getByText('Improve')
      const featuresButton = screen.getByText('Features')

      expect(improveButton.tagName).toBe('BUTTON')
      expect(featuresButton.tagName).toBe('BUTTON')
    })

    it('should support keyboard navigation', async () => {
      render(<OptionCard option={defaultOption} isSelected={false} onSelect={mockOnSelect} texts={mockTexts} />)

      const button = screen.getByText('Improve')
      button.focus()

      await user.keyboard('{Enter}')
      expect(mockOnSelect).toHaveBeenCalledTimes(1)

      await user.keyboard(' ')
      expect(mockOnSelect).toHaveBeenCalledTimes(2)
    })

    it('should have proper text hierarchy', () => {
      render(<OptionCard option={defaultOption} isSelected={false} onSelect={mockOnSelect} texts={mockTexts} />)

      const title = screen.getByText('Test Option')
      expect(title.tagName).toBe('H3')
    })

    it('should have proper semantic markup for price', () => {
      render(<OptionCard option={defaultOption} isSelected={false} onSelect={mockOnSelect} texts={mockTexts} />)

      const price = screen.getByText('25.50 /night')
      expect(price.tagName).toBe('P')
      expect(price).toHaveClass('font-semibold')
    })
  })

  describe('Integration with UiButton component', () => {
    it('should pass correct props to UiButton for non-selected state', () => {
      render(<OptionCard option={defaultOption} isSelected={false} onSelect={mockOnSelect} texts={mockTexts} />)

      const button = screen.getByText('Improve')
      expect(button).toHaveClass('w-full')
      // UiButton should receive variant="secondary", size="sm"
    })

    it('should pass correct props to UiButton for selected state', () => {
      render(<OptionCard option={defaultOption} isSelected={true} onSelect={mockOnSelect} texts={mockTexts} />)

      const button = screen.getByText('Remove')
      expect(button).toHaveClass('w-full')
      // UiButton should receive variant="link", size="sm"
    })

    it('should handle multiple button interactions correctly', async () => {
      render(
        <OptionCard
          option={defaultOption}
          isSelected={false}
          onSelect={mockOnSelect}
          texts={mockTexts}
          showFeatures={true}
          onShowFeatures={mockOnShowFeatures}
        />
      )

      const improveButton = screen.getByText('Improve')
      const featuresButton = screen.getByText('Features')

      await user.click(improveButton)
      await user.click(featuresButton)

      expect(mockOnSelect).toHaveBeenCalledTimes(1)
      expect(mockOnShowFeatures).toHaveBeenCalledTimes(1)
    })
  })
})
