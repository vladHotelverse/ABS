import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '../../../../__tests__/helpers'
import BookingInfoItem from '../../components/BookingInfoItem'
import type { BookingInfoItemProps } from '../../components/BookingInfoItem'
import { Calendar, Tag, Users, Home } from 'lucide-react'

// Test-specific helper for creating consistent props
const createBookingInfoItemProps = (overrides: Partial<BookingInfoItemProps> = {}): BookingInfoItemProps => ({
  icon: <Tag className="h-4 w-4 text-neutral-400" />,
  label: 'Test Label',
  value: 'Test Value',
  ...overrides,
})

describe('BookingInfoItem', () => {
  const defaultProps = createBookingInfoItemProps()

  describe('Basic functionality', () => {
    it('should render icon, label, and value correctly', () => {
      render(<BookingInfoItem {...defaultProps} />)

      expect(screen.getByText('Test Label')).toBeInTheDocument()
      expect(screen.getByText('Test Value')).toBeInTheDocument()

      // Icon should be rendered (as SVG)
      const svg = document.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render with different icons', () => {
      const calendarProps = createBookingInfoItemProps({
        icon: <Calendar className="h-4 w-4 text-neutral-400" />,
        label: 'Dates',
        value: '01/01/2025 - 05/01/2025',
      })

      render(<BookingInfoItem {...calendarProps} />)

      expect(screen.getByText('Dates')).toBeInTheDocument()
      expect(screen.getByText('01/01/2025 - 05/01/2025')).toBeInTheDocument()
    })

    it('should handle ReactNode as value', () => {
      const nodeValue = <strong>Bold Value</strong>
      const propsWithNode = createBookingInfoItemProps({
        value: nodeValue,
      })

      render(<BookingInfoItem {...propsWithNode} />)

      const boldElement = screen.getByText('Bold Value')
      expect(boldElement).toBeInTheDocument()
      expect(boldElement.tagName).toBe('STRONG')
    })

    it('should handle empty/null values gracefully', () => {
      const propsWithEmptyValue = createBookingInfoItemProps({
        value: '',
      })

      expect(() => render(<BookingInfoItem {...propsWithEmptyValue} />)).not.toThrow()
      expect(screen.getByText('Test Label')).toBeInTheDocument()
    })
  })

  describe('Layout and styling', () => {
    it('should have correct CSS classes for layout', () => {
      const { container } = render(<BookingInfoItem {...defaultProps} />)

      const bookingInfoItem = container.querySelector('.flex.flex-col')
      expect(bookingInfoItem).toBeInTheDocument()

      const labelContainer = bookingInfoItem?.querySelector('.flex.items-center.gap-2')
      expect(labelContainer).toBeInTheDocument()

      const valueContainer = bookingInfoItem?.querySelector('.text-black.font-semibold.mt-1')
      expect(valueContainer).toBeInTheDocument()
    })

    it('should apply font styling correctly', () => {
      render(<BookingInfoItem {...defaultProps} />)

      const label = screen.getByText('Test Label')
      expect(label).toHaveClass('text-sm', 'font-medium')

      const value = screen.getByText('Test Value')
      expect(value).toHaveClass('text-black', 'font-semibold', 'mt-1')
    })

    it('should maintain icon and label alignment', () => {
      render(<BookingInfoItem {...defaultProps} />)

      const iconLabelContainer = document.querySelector('.flex.items-center.gap-2')
      expect(iconLabelContainer).toBeInTheDocument()
      expect(iconLabelContainer).toContainElement(screen.getByText('Test Label'))
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(<BookingInfoItem {...defaultProps} />)

      // Should have a container div with flex layout
      const container = document.querySelector('.flex.flex-col')
      expect(container).toBeInTheDocument()

      // Label should be in a span for proper screen reader support
      const label = screen.getByText('Test Label')
      expect(label.tagName).toBe('SPAN')
    })

    it('should handle complex values with proper structure', () => {
      const complexValue = (
        <div>
          <span>Primary info</span>
          <small>Secondary info</small>
        </div>
      )

      const propsWithComplexValue = createBookingInfoItemProps({
        value: complexValue,
      })

      render(<BookingInfoItem {...propsWithComplexValue} />)

      expect(screen.getByText('Primary info')).toBeInTheDocument()
      expect(screen.getByText('Secondary info')).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('should handle missing icon gracefully', () => {
      const propsWithoutIcon = createBookingInfoItemProps({
        icon: null,
      })

      expect(() => render(<BookingInfoItem {...propsWithoutIcon} />)).not.toThrow()
      expect(screen.getByText('Test Label')).toBeInTheDocument()
      expect(screen.getByText('Test Value')).toBeInTheDocument()
    })

    it('should handle very long labels', () => {
      const propsWithLongLabel = createBookingInfoItemProps({
        label: 'This is a very long label that might wrap to multiple lines on smaller screens',
      })

      expect(() => render(<BookingInfoItem {...propsWithLongLabel} />)).not.toThrow()
      expect(screen.getByText(/This is a very long label/)).toBeInTheDocument()
    })

    it('should handle very long values', () => {
      const propsWithLongValue = createBookingInfoItemProps({
        value: 'This is a very long value that should be displayed properly even if it spans multiple lines',
      })

      expect(() => render(<BookingInfoItem {...propsWithLongValue} />)).not.toThrow()
      expect(screen.getByText(/This is a very long value/)).toBeInTheDocument()
    })

    it('should handle numeric values', () => {
      const propsWithNumericValue = createBookingInfoItemProps({
        value: '42',
      })

      render(<BookingInfoItem {...propsWithNumericValue} />)
      expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('should handle special characters in label and value', () => {
      const propsWithSpecialChars = createBookingInfoItemProps({
        label: 'Test & Label <special>',
        value: 'Value with "quotes" & <brackets>',
      })

      render(<BookingInfoItem {...propsWithSpecialChars} />)
      expect(screen.getByText('Test & Label <special>')).toBeInTheDocument()
      expect(screen.getByText('Value with "quotes" & <brackets>')).toBeInTheDocument()
    })
  })

  describe('Different icon types', () => {
    it('should work with Users icon', () => {
      const usersProps = createBookingInfoItemProps({
        icon: <Users className="h-4 w-4 text-neutral-400" />,
        label: 'Ocupación',
        value: '2 Adultos, 1 Niño',
      })

      render(<BookingInfoItem {...usersProps} />)
      expect(screen.getByText('Ocupación')).toBeInTheDocument()
      expect(screen.getByText('2 Adultos, 1 Niño')).toBeInTheDocument()
    })

    it('should work with Home icon', () => {
      const homeProps = createBookingInfoItemProps({
        icon: <Home className="h-4 w-4 text-neutral-400" />,
        label: 'Tipo de habitación',
        value: 'Deluxe Double Room',
      })

      render(<BookingInfoItem {...homeProps} />)
      expect(screen.getByText('Tipo de habitación')).toBeInTheDocument()
      expect(screen.getByText('Deluxe Double Room')).toBeInTheDocument()
    })
  })
})
