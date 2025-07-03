import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useCustomizationState } from '../../hooks/useCustomizationState'
import type { CustomizationOption, ViewOption } from '../../types'

describe('useCustomizationState', () => {
  let mockOnCustomizationChange: ReturnType<typeof vi.fn>
  let mockSectionOptions: Record<string, CustomizationOption[] | ViewOption[]>

  beforeEach(() => {
    mockOnCustomizationChange = vi.fn()
    mockSectionOptions = {
      beds: [
        { id: 'twin', label: 'Twin Beds', price: 25, icon: 'bed' },
        { id: 'king', label: 'King Bed', price: 50, icon: 'bed' },
      ],
      view: [
        { id: 'garden', label: 'Garden View', price: 30, imageUrl: 'garden.jpg' },
        { id: 'ocean', label: 'Ocean View', price: 75, imageUrl: 'ocean.jpg' },
      ],
    }
  })

  describe('Initialization', () => {
    it('should initialize with empty selections when no initial selections provided', () => {
      const { result } = renderHook(() =>
        useCustomizationState({
          sectionOptions: mockSectionOptions,
          onCustomizationChange: mockOnCustomizationChange,
        })
      )

      expect(result.current.selectedOptions).toEqual({})
    })

    it('should initialize with provided initial selections', () => {
      const initialSelections = {
        beds: { id: 'king', label: 'King Bed', price: 50 },
      }

      const { result } = renderHook(() =>
        useCustomizationState({
          initialSelections,
          sectionOptions: mockSectionOptions,
          onCustomizationChange: mockOnCustomizationChange,
        })
      )

      expect(result.current.selectedOptions).toEqual(initialSelections)
    })

    it('should initialize all sections as open by default', () => {
      const { result } = renderHook(() =>
        useCustomizationState({
          sectionOptions: mockSectionOptions,
          onCustomizationChange: mockOnCustomizationChange,
        })
      )

      expect(result.current.openSections).toEqual({
        beds: true,
        view: true,
      })
    })
  })

  describe('Section toggle functionality', () => {
    it('should toggle section open/closed state', () => {
      const { result } = renderHook(() =>
        useCustomizationState({
          sectionOptions: mockSectionOptions,
          onCustomizationChange: mockOnCustomizationChange,
        })
      )

      // Initially all sections should be open
      expect(result.current.openSections.beds).toBe(true)

      // Toggle beds section closed
      act(() => {
        result.current.toggleSection('beds')
      })

      expect(result.current.openSections.beds).toBe(false)
      expect(result.current.openSections.view).toBe(true) // Other sections unaffected

      // Toggle beds section open again
      act(() => {
        result.current.toggleSection('beds')
      })

      expect(result.current.openSections.beds).toBe(true)
    })

    it('should handle toggling non-existent sections', () => {
      const { result } = renderHook(() =>
        useCustomizationState({
          sectionOptions: mockSectionOptions,
          onCustomizationChange: mockOnCustomizationChange,
        })
      )

      // Should not crash when toggling non-existent section
      act(() => {
        result.current.toggleSection('nonexistent')
      })

      expect(result.current.openSections.nonexistent).toBe(true) // New sections default to open
    })
  })

  describe('Option selection functionality', () => {
    it('should select an option when none is currently selected', () => {
      const { result } = renderHook(() =>
        useCustomizationState({
          sectionOptions: mockSectionOptions,
          onCustomizationChange: mockOnCustomizationChange,
        })
      )

      act(() => {
        result.current.handleSelect('beds', 'king')
      })

      expect(result.current.selectedOptions.beds).toEqual({
        id: 'king',
        label: 'King Bed',
        price: 50,
      })

      expect(mockOnCustomizationChange).toHaveBeenCalledWith('beds', 'king', 'King Bed', 50)
    })

    it('should deselect an option when it is already selected', () => {
      const initialSelections = {
        beds: { id: 'king', label: 'King Bed', price: 50 },
      }

      const { result } = renderHook(() =>
        useCustomizationState({
          initialSelections,
          sectionOptions: mockSectionOptions,
          onCustomizationChange: mockOnCustomizationChange,
        })
      )

      // Select the already selected option (should deselect)
      act(() => {
        result.current.handleSelect('beds', 'king')
      })

      expect(result.current.selectedOptions.beds).toBeUndefined()
      expect(mockOnCustomizationChange).toHaveBeenCalledWith('beds', '', '', 0)
    })

    it('should replace selection when selecting different option in same category', () => {
      const initialSelections = {
        beds: { id: 'twin', label: 'Twin Beds', price: 25 },
      }

      const { result } = renderHook(() =>
        useCustomizationState({
          initialSelections,
          sectionOptions: mockSectionOptions,
          onCustomizationChange: mockOnCustomizationChange,
        })
      )

      // Select different option in same category
      act(() => {
        result.current.handleSelect('beds', 'king')
      })

      expect(result.current.selectedOptions.beds).toEqual({
        id: 'king',
        label: 'King Bed',
        price: 50,
      })

      expect(mockOnCustomizationChange).toHaveBeenCalledWith('beds', 'king', 'King Bed', 50)
    })

    it('should handle selections in multiple categories independently', () => {
      const { result } = renderHook(() =>
        useCustomizationState({
          sectionOptions: mockSectionOptions,
          onCustomizationChange: mockOnCustomizationChange,
        })
      )

      // Select option in first category
      act(() => {
        result.current.handleSelect('beds', 'king')
      })

      // Select option in second category
      act(() => {
        result.current.handleSelect('view', 'ocean')
      })

      expect(result.current.selectedOptions.beds).toEqual({
        id: 'king',
        label: 'King Bed',
        price: 50,
      })

      expect(result.current.selectedOptions.view).toEqual({
        id: 'ocean',
        label: 'Ocean View',
        price: 75,
      })

      expect(mockOnCustomizationChange).toHaveBeenCalledTimes(2)
    })

    it('should handle selecting non-existent option gracefully', () => {
      const { result } = renderHook(() =>
        useCustomizationState({
          sectionOptions: mockSectionOptions,
          onCustomizationChange: mockOnCustomizationChange,
        })
      )

      // Try to select non-existent option
      act(() => {
        result.current.handleSelect('beds', 'nonexistent')
      })

      // Should not change state or call callback
      expect(result.current.selectedOptions.beds).toBeUndefined()
      expect(mockOnCustomizationChange).not.toHaveBeenCalled()
    })

    it('should handle selecting from non-existent category gracefully', () => {
      const { result } = renderHook(() =>
        useCustomizationState({
          sectionOptions: mockSectionOptions,
          onCustomizationChange: mockOnCustomizationChange,
        })
      )

      // Try to select from non-existent category
      act(() => {
        result.current.handleSelect('nonexistent', 'some-id')
      })

      // Should not change state or call callback
      expect(result.current.selectedOptions.nonexistent).toBeUndefined()
      expect(mockOnCustomizationChange).not.toHaveBeenCalled()
    })
  })

  describe('Callback handling', () => {
    it('should work without onCustomizationChange callback', () => {
      const { result } = renderHook(() =>
        useCustomizationState({
          sectionOptions: mockSectionOptions,
        })
      )

      // Should not crash when callback is not provided
      act(() => {
        result.current.handleSelect('beds', 'king')
      })

      expect(result.current.selectedOptions.beds).toEqual({
        id: 'king',
        label: 'King Bed',
        price: 50,
      })
    })

    it('should call onCustomizationChange with correct parameters for selection', () => {
      const { result } = renderHook(() =>
        useCustomizationState({
          sectionOptions: mockSectionOptions,
          onCustomizationChange: mockOnCustomizationChange,
        })
      )

      act(() => {
        result.current.handleSelect('view', 'garden')
      })

      expect(mockOnCustomizationChange).toHaveBeenCalledWith('view', 'garden', 'Garden View', 30)
      expect(mockOnCustomizationChange).toHaveBeenCalledTimes(1)
    })

    it('should call onCustomizationChange with empty parameters for deselection', () => {
      const initialSelections = {
        view: { id: 'ocean', label: 'Ocean View', price: 75 },
      }

      const { result } = renderHook(() =>
        useCustomizationState({
          initialSelections,
          sectionOptions: mockSectionOptions,
          onCustomizationChange: mockOnCustomizationChange,
        })
      )

      // Deselect by clicking the same option
      act(() => {
        result.current.handleSelect('view', 'ocean')
      })

      expect(mockOnCustomizationChange).toHaveBeenCalledWith('view', '', '', 0)
    })
  })

  describe('State persistence', () => {
    it('should maintain state across multiple operations', () => {
      const { result } = renderHook(() =>
        useCustomizationState({
          sectionOptions: mockSectionOptions,
          onCustomizationChange: mockOnCustomizationChange,
        })
      )

      // Perform multiple operations
      act(() => {
        result.current.handleSelect('beds', 'king')
      })

      act(() => {
        result.current.toggleSection('view')
      })

      act(() => {
        result.current.handleSelect('view', 'ocean')
      })

      act(() => {
        result.current.toggleSection('beds')
      })

      // Check final state
      expect(result.current.selectedOptions).toEqual({
        beds: { id: 'king', label: 'King Bed', price: 50 },
        view: { id: 'ocean', label: 'Ocean View', price: 75 },
      })

      expect(result.current.openSections).toEqual({
        beds: false,
        view: false,
      })
    })

    it('should handle rapid state changes correctly', () => {
      const { result } = renderHook(() =>
        useCustomizationState({
          sectionOptions: mockSectionOptions,
          onCustomizationChange: mockOnCustomizationChange,
        })
      )

      // Rapidly select and deselect
      act(() => {
        result.current.handleSelect('beds', 'twin')
        result.current.handleSelect('beds', 'king')
        result.current.handleSelect('beds', 'king') // Deselect
        result.current.handleSelect('beds', 'twin')
      })

      expect(result.current.selectedOptions.beds).toEqual({
        id: 'twin',
        label: 'Twin Beds',
        price: 25,
      })

      expect(mockOnCustomizationChange).toHaveBeenCalledTimes(4)
    })
  })

  describe('Edge cases', () => {
    it('should handle empty sectionOptions', () => {
      const { result } = renderHook(() =>
        useCustomizationState({
          sectionOptions: {},
          onCustomizationChange: mockOnCustomizationChange,
        })
      )

      expect(result.current.selectedOptions).toEqual({})
      expect(result.current.openSections).toEqual({})

      // Should handle operations on empty state gracefully
      act(() => {
        result.current.toggleSection('nonexistent')
        result.current.handleSelect('nonexistent', 'option')
      })

      expect(result.current.openSections.nonexistent).toBe(true)
      expect(result.current.selectedOptions.nonexistent).toBeUndefined()
    })

    it('should handle sections with empty options arrays', () => {
      const emptySectionOptions = {
        beds: [],
        view: mockSectionOptions.view,
      }

      const { result } = renderHook(() =>
        useCustomizationState({
          sectionOptions: emptySectionOptions,
          onCustomizationChange: mockOnCustomizationChange,
        })
      )

      // Should initialize normally
      expect(result.current.openSections.beds).toBe(true)

      // Should handle selection attempts gracefully
      act(() => {
        result.current.handleSelect('beds', 'any-id')
      })

      expect(result.current.selectedOptions.beds).toBeUndefined()
      expect(mockOnCustomizationChange).not.toHaveBeenCalled()
    })

    it('should handle options with special characters in IDs and labels', () => {
      const specialSectionOptions = {
        special: [
          { id: 'special-id/with@symbols', label: 'Special & Unique Option!', price: 100, icon: 'star' },
          { id: 'unicode-αβγ', label: 'Unicode Ωption ñ', price: 150, icon: 'star' },
        ],
      }

      const { result } = renderHook(() =>
        useCustomizationState({
          sectionOptions: specialSectionOptions,
          onCustomizationChange: mockOnCustomizationChange,
        })
      )

      act(() => {
        result.current.handleSelect('special', 'unicode-αβγ')
      })

      expect(result.current.selectedOptions.special).toEqual({
        id: 'unicode-αβγ',
        label: 'Unicode Ωption ñ',
        price: 150,
      })

      expect(mockOnCustomizationChange).toHaveBeenCalledWith('special', 'unicode-αβγ', 'Unicode Ωption ñ', 150)
    })

    it('should handle options with zero or negative prices', () => {
      const priceSectionOptions = {
        pricing: [
          { id: 'free', label: 'Free Option', price: 0, icon: 'gift' },
          { id: 'discount', label: 'Discount Option', price: -25, icon: 'discount' },
        ],
      }

      const { result } = renderHook(() =>
        useCustomizationState({
          sectionOptions: priceSectionOptions,
          onCustomizationChange: mockOnCustomizationChange,
        })
      )

      // Select free option
      act(() => {
        result.current.handleSelect('pricing', 'free')
      })

      expect(mockOnCustomizationChange).toHaveBeenCalledWith('pricing', 'free', 'Free Option', 0)

      // Select discount option
      act(() => {
        result.current.handleSelect('pricing', 'discount')
      })

      expect(mockOnCustomizationChange).toHaveBeenCalledWith('pricing', 'discount', 'Discount Option', -25)
    })
  })
})
