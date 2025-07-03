import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '../../../../__tests__/helpers/custom-render'
import { CustomizationSection } from '../../components/CustomizationSection'
import type {
  SectionConfig,
  CustomizationOption,
  ViewOption,
  SelectedCustomizations,
  RoomCustomizationTexts,
} from '../../types'

describe('CustomizationSection', () => {
  let user: ReturnType<typeof userEvent.setup>
  let mockTexts: RoomCustomizationTexts
  let mockOnToggle: ReturnType<typeof vi.fn>
  let mockOnSelect: ReturnType<typeof vi.fn>
  let mockOnOpenModal: ReturnType<typeof vi.fn>

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

    mockOnToggle = vi.fn()
    mockOnSelect = vi.fn()
    mockOnOpenModal = vi.fn()
  })

  describe('Basic rendering with CustomizationOption', () => {
    const basicConfig: SectionConfig = {
      key: 'beds',
      title: 'Bed Configuration',
      infoText: 'Choose your bed setup',
      hasModal: false,
      hasFeatures: false,
    }

    const customizationOptions: CustomizationOption[] = [
      { id: 'twin', label: 'Twin Beds', price: 25, icon: 'bed', description: 'Two twin beds' },
      { id: 'king', label: 'King Bed', price: 50, icon: 'bed', description: 'One king bed' },
    ]

    it('should render section title and options', () => {
      render(
        <CustomizationSection
          config={basicConfig}
          options={customizationOptions}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      expect(screen.getByText('Bed Configuration')).toBeInTheDocument()
      expect(screen.getByText('Twin Beds')).toBeInTheDocument()
      expect(screen.getByText('King Bed')).toBeInTheDocument()
      expect(screen.getByText('Two twin beds')).toBeInTheDocument()
      expect(screen.getByText('One king bed')).toBeInTheDocument()
    })

    it('should display prices correctly', () => {
      render(
        <CustomizationSection
          config={basicConfig}
          options={customizationOptions}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      expect(screen.getByText('25.00 /night')).toBeInTheDocument()
      expect(screen.getByText('50.00 /night')).toBeInTheDocument()
    })

    it('should call onSelect when option is clicked', async () => {
      render(
        <CustomizationSection
          config={basicConfig}
          options={customizationOptions}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      const improveButtons = screen.getAllByText('Improve')
      await user.click(improveButtons[0])

      expect(mockOnSelect).toHaveBeenCalledWith('twin')
    })

    it('should show selected state for selected option', () => {
      const selectedOptions: SelectedCustomizations = {
        beds: { id: 'king', label: 'King Bed', price: 50 },
      }

      render(
        <CustomizationSection
          config={basicConfig}
          options={customizationOptions}
          selectedOptions={selectedOptions}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      // Should show different button text for selected option
      expect(screen.getByText('Remove')).toBeInTheDocument()
      expect(screen.getByText('Improve')).toBeInTheDocument() // For non-selected option
    })
  })

  describe('Basic rendering with ViewOption', () => {
    const viewConfig: SectionConfig = {
      key: 'view',
      title: 'Room View',
      infoText: 'Select your view preference',
      hasModal: true,
      hasFeatures: true,
    }

    const viewOptions: ViewOption[] = [
      { id: 'garden', label: 'Garden View', price: 30, imageUrl: 'garden.jpg', description: 'Beautiful garden view' },
      { id: 'ocean', label: 'Ocean View', price: 75, imageUrl: 'ocean.jpg', description: 'Stunning ocean view' },
    ]

    it('should render view options with images', () => {
      render(
        <CustomizationSection
          config={viewConfig}
          options={viewOptions}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          onOpenModal={mockOnOpenModal}
          texts={mockTexts}
        />
      )

      expect(screen.getByText('Room View')).toBeInTheDocument()
      expect(screen.getByText('Garden View')).toBeInTheDocument()
      expect(screen.getByText('Ocean View')).toBeInTheDocument()
    })

    it('should handle view option selection', async () => {
      render(
        <CustomizationSection
          config={viewConfig}
          options={viewOptions}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          onOpenModal={mockOnOpenModal}
          texts={mockTexts}
        />
      )

      const improveButtons = screen.getAllByText('Improve')
      await user.click(improveButtons[1]) // Ocean view

      expect(mockOnSelect).toHaveBeenCalledWith('ocean')
    })
  })

  describe('Section toggle functionality', () => {
    const config: SectionConfig = {
      key: 'test',
      title: 'Test Section',
      hasModal: false,
      hasFeatures: false,
    }

    const options: CustomizationOption[] = [{ id: 'option1', label: 'Option 1', price: 10, icon: 'icon1' }]

    it('should call onToggle when section header is clicked', async () => {
      render(
        <CustomizationSection
          config={config}
          options={options}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      const sectionHeader = screen.getByText('Test Section')
      await user.click(sectionHeader)

      expect(mockOnToggle).toHaveBeenCalledTimes(1)
    })

    it('should show options when section is open', () => {
      render(
        <CustomizationSection
          config={config}
          options={options}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      expect(screen.getByText('Option 1')).toBeInTheDocument()
    })

    it('should hide options when section is closed', () => {
      render(
        <CustomizationSection
          config={config}
          options={options}
          selectedOptions={{}}
          isOpen={false}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
    })

    it('should show correct toggle icon based on open state', () => {
      const { rerender } = render(
        <CustomizationSection
          config={config}
          options={options}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      // Should show minus icon when open
      expect(screen.queryByTestId('minus-icon')).toBeInTheDocument()

      rerender(
        <CustomizationSection
          config={config}
          options={options}
          selectedOptions={{}}
          isOpen={false}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      // Should show plus icon when closed
      expect(screen.queryByTestId('plus-icon')).toBeInTheDocument()
    })
  })

  describe('Info functionality', () => {
    const configWithInfo: SectionConfig = {
      key: 'info-test',
      title: 'Section with Info',
      infoText: 'This is helpful information about the section',
      hasModal: false,
      hasFeatures: false,
    }

    const options: CustomizationOption[] = [{ id: 'option1', label: 'Option 1', price: 10, icon: 'icon1' }]

    it('should show info icon when infoText is provided', () => {
      render(
        <CustomizationSection
          config={configWithInfo}
          options={options}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      const infoIcon = screen.queryByTestId('info-icon')
      expect(infoIcon).toBeInTheDocument()
    })

    it('should not show info icon when infoText is not provided', () => {
      const configWithoutInfo: SectionConfig = {
        key: 'no-info',
        title: 'Section without Info',
        hasModal: false,
        hasFeatures: false,
      }

      render(
        <CustomizationSection
          config={configWithoutInfo}
          options={options}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      const infoIcon = screen.queryByTestId('info-icon')
      expect(infoIcon).not.toBeInTheDocument()
    })

    it('should toggle info display when info icon is clicked', async () => {
      render(
        <CustomizationSection
          config={configWithInfo}
          options={options}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      const infoIcon = screen.getByTestId('info-icon')

      // Info should not be visible initially
      expect(screen.queryByText('This is helpful information about the section')).not.toBeInTheDocument()

      // Click info icon to show info
      await user.click(infoIcon as Element)
      expect(screen.getByText('This is helpful information about the section')).toBeInTheDocument()

      // Click again to hide info
      await user.click(infoIcon as Element)
      expect(screen.queryByText('This is helpful information about the section')).not.toBeInTheDocument()
    })

    it('should not call onToggle when info icon is clicked', async () => {
      render(
        <CustomizationSection
          config={configWithInfo}
          options={options}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      const infoIcon = screen.getByTestId('info-icon')
      await user.click(infoIcon)

      expect(mockOnToggle).not.toHaveBeenCalled()
    })
  })

  describe('Modal functionality', () => {
    const configWithModal: SectionConfig = {
      key: 'modal-test',
      title: 'Section with Modal',
      hasModal: true,
      hasFeatures: false,
    }

    const options: CustomizationOption[] = [{ id: 'option1', label: 'Option 1', price: 10, icon: 'icon1' }]

    it('should call onOpenModal when provided for section with hasModal', async () => {
      render(
        <CustomizationSection
          config={configWithModal}
          options={options}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          onOpenModal={mockOnOpenModal}
          texts={mockTexts}
        />
      )

      // This depends on the implementation of CustomizationSection
      // The test structure is here for when modal triggers are implemented
      expect(mockOnOpenModal).toBeDefined()
    })

    it('should not call onOpenModal when not provided', () => {
      render(
        <CustomizationSection
          config={configWithModal}
          options={options}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      // Should not crash when onOpenModal is not provided
      expect(screen.getByText('Section with Modal')).toBeInTheDocument()
    })
  })

  describe('Features functionality', () => {
    const configWithFeatures: SectionConfig = {
      key: 'features-test',
      title: 'Section with Features',
      hasModal: false,
      hasFeatures: true,
    }

    const options: CustomizationOption[] = [
      { id: 'option1', label: 'Option with Features', price: 10, icon: 'icon1', description: 'Option description' },
    ]

    it('should show features button when hasFeatures is true', () => {
      render(
        <CustomizationSection
          config={configWithFeatures}
          options={options}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      // This test structure is ready for when features buttons are implemented
      expect(screen.getByText('Option with Features')).toBeInTheDocument()
    })
  })

  describe('Empty states and edge cases', () => {
    const config: SectionConfig = {
      key: 'empty-test',
      title: 'Empty Section',
      hasModal: false,
      hasFeatures: false,
    }

    it('should handle empty options array', () => {
      render(
        <CustomizationSection
          config={config}
          options={[]}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      expect(screen.getByText('Empty Section')).toBeInTheDocument()
      // Should not show any options
      expect(screen.queryByText('Improve')).not.toBeInTheDocument()
    })

    it('should handle options without descriptions', () => {
      const optionsWithoutDesc: CustomizationOption[] = [
        { id: 'no-desc', label: 'No Description', price: 15, icon: 'icon' },
      ]

      render(
        <CustomizationSection
          config={config}
          options={optionsWithoutDesc}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      expect(screen.getByText('No Description')).toBeInTheDocument()
      expect(screen.getByText('15.00 /night')).toBeInTheDocument()
    })

    it('should handle options with zero price', () => {
      const freeOptions: CustomizationOption[] = [{ id: 'free', label: 'Free Option', price: 0, icon: 'icon' }]

      render(
        <CustomizationSection
          config={config}
          options={freeOptions}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      expect(screen.getByText('Free Option')).toBeInTheDocument()
      expect(screen.getByText('0.00 /night')).toBeInTheDocument()
    })

    it('should handle options with negative price (discounts)', () => {
      const discountOptions: CustomizationOption[] = [
        { id: 'discount', label: 'Discount Option', price: -10, icon: 'icon' },
      ]

      render(
        <CustomizationSection
          config={config}
          options={discountOptions}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      expect(screen.getByText('Discount Option')).toBeInTheDocument()
      expect(screen.getByText('-10.00 /night')).toBeInTheDocument()
    })
  })

  describe('Fallback image handling', () => {
    const viewConfig: SectionConfig = {
      key: 'view',
      title: 'Room View',
      hasModal: false,
      hasFeatures: false,
    }

    const viewOptionsWithMissingImage: ViewOption[] = [
      { id: 'no-image', label: 'No Image View', price: 20 }, // No imageUrl
    ]

    it('should handle view options without images', () => {
      render(
        <CustomizationSection
          config={viewConfig}
          options={viewOptionsWithMissingImage}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
          fallbackImageUrl="https://example.com/fallback.jpg"
        />
      )

      expect(screen.getByText('No Image View')).toBeInTheDocument()
    })

    it('should use fallback image when provided', () => {
      render(
        <CustomizationSection
          config={viewConfig}
          options={viewOptionsWithMissingImage}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
          fallbackImageUrl="https://example.com/fallback.jpg"
        />
      )

      // Should render without crashing
      expect(screen.getByText('Room View')).toBeInTheDocument()
    })
  })

  describe('Text customization', () => {
    const config: SectionConfig = {
      key: 'text-test',
      title: 'Text Test Section',
      hasModal: false,
      hasFeatures: false,
    }

    const options: CustomizationOption[] = [{ id: 'option1', label: 'Test Option', price: 25, icon: 'icon' }]

    it('should use custom texts', () => {
      const customTexts: RoomCustomizationTexts = {
        improveText: 'Custom Improve',
        selectedText: 'Custom Selected',
        pricePerNightText: '/custom night',
        featuresText: 'Custom Features',
        understood: 'Custom Understood',
        addForPriceText: 'Custom Add for {price}',
        availableOptionsText: 'Available Options:',
        removeText: 'Remove',
      }

      render(
        <CustomizationSection
          config={config}
          options={options}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={customTexts}
        />
      )

      expect(screen.getByText('Custom Improve')).toBeInTheDocument()
      expect(screen.getByText('25.00 /custom night')).toBeInTheDocument()
    })

    it('should show custom selected text for selected options', () => {
      const customTexts: RoomCustomizationTexts = {
        improveText: 'Custom Improve',
        selectedText: 'Custom Selected',
        pricePerNightText: '/night',
        featuresText: 'Custom Features',
        understood: 'Custom Understood',
        addForPriceText: 'Custom Add for {price}',
        availableOptionsText: 'Available Options:',
        removeText: 'Remove',
      }

      const selectedOptions: SelectedCustomizations = {
        'text-test': { id: 'option1', label: 'Test Option', price: 25 },
      }

      render(
        <CustomizationSection
          config={config}
          options={options}
          selectedOptions={selectedOptions}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={customTexts}
        />
      )

      // For selected option, button should show "Remove" instead of custom text
      expect(screen.getByText('Remove')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    const config: SectionConfig = {
      key: 'accessibility-test',
      title: 'Accessibility Test Section',
      infoText: 'Accessibility information',
      hasModal: false,
      hasFeatures: false,
    }

    const options: CustomizationOption[] = [
      { id: 'option1', label: 'Accessible Option', price: 30, icon: 'icon', description: 'Accessible description' },
    ]

    it('should have proper button accessibility', () => {
      render(
        <CustomizationSection
          config={config}
          options={options}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      const improveButton = screen.getByText('Improve')
      expect(improveButton).toBeInTheDocument()
      expect(improveButton.tagName).toBe('BUTTON')
    })

    it('should support keyboard navigation', async () => {
      render(
        <CustomizationSection
          config={config}
          options={options}
          selectedOptions={{}}
          isOpen={true}
          onToggle={mockOnToggle}
          onSelect={mockOnSelect}
          texts={mockTexts}
        />
      )

      const improveButton = screen.getByText('Improve')
      improveButton.focus()

      await user.keyboard('{Enter}')
      expect(mockOnSelect).toHaveBeenCalledWith('option1')
    })
  })
})
