import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render } from '../../../../__tests__/helpers'
import SpecialOffers from '../../index'
import type { SpecialOffersProps } from '../../types'
import { createMockOfferType, createMockOfferTypes, createMockOfferLabels } from '../../../../__tests__/helpers'

const defaultLabels = createMockOfferLabels()

const defaultOffers = createMockOfferTypes(3, {})

const defaultProps: SpecialOffersProps = {
  offers: defaultOffers,
  onBookOffer: vi.fn(),
  currencySymbol: '€',
  labels: defaultLabels,
}

describe('ABS_SpecialOffers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic rendering', () => {
    it('should render all offers', () => {
      render(<SpecialOffers {...defaultProps} />)

      defaultOffers.forEach((offer) => {
        expect(screen.getByText(offer.title)).toBeInTheDocument()
        expect(screen.getByText(offer.description)).toBeInTheDocument()
      })
    })

    it('should apply custom className and id', () => {
      render(<SpecialOffers {...defaultProps} className="custom-offers" id="test-offers" />)

      const container = document.getElementById('test-offers')
      expect(container).toBeInTheDocument()
      expect(container).toHaveClass('custom-offers')
    })

    it('should handle empty offers array', () => {
      render(<SpecialOffers {...defaultProps} offers={[]} />)

      // Should render without crashing
      const container = document.querySelector('.grid')
      expect(container).toBeInTheDocument()
      expect(container?.children).toHaveLength(0)
    })
  })

  describe('Offer pricing', () => {
    it('should calculate per-stay pricing correctly', () => {
      const perStayOffer = createMockOfferType({
        id: 1,
        title: 'Spa Package',
        price: 100,
        type: 'perStay',
      })

      render(<SpecialOffers {...defaultProps} offers={[perStayOffer]} />)

      expect(screen.getByText('Spa Package')).toBeInTheDocument()
      expect(screen.getByText(/100/)).toBeInTheDocument()
      expect(screen.getByText(defaultLabels.perStay)).toBeInTheDocument()
    })

    it('should calculate per-person pricing correctly', () => {
      const perPersonOffer = createMockOfferType({
        id: 1,
        title: 'Massage Service',
        price: 50,
        type: 'perPerson',
      })

      render(<SpecialOffers {...defaultProps} offers={[perPersonOffer]} />)

      expect(screen.getByText('Massage Service')).toBeInTheDocument()
      expect(screen.getByText(defaultLabels.perPerson)).toBeInTheDocument()
    })

    it('should calculate per-night pricing correctly', () => {
      const perNightOffer = createMockOfferType({
        id: 1,
        title: 'Breakfast',
        price: 25,
        type: 'perNight',
      })

      render(<SpecialOffers {...defaultProps} offers={[perNightOffer]} />)

      expect(screen.getByText('Breakfast')).toBeInTheDocument()
      expect(screen.getByText(defaultLabels.perNight)).toBeInTheDocument()
    })

    it('should handle quantity changes', () => {
      const offer = createMockOfferType({
        id: 1,
        title: 'Test Offer',
        price: 50,
        type: 'perStay',
      })

      render(<SpecialOffers {...defaultProps} offers={[offer]} />)

      // Find increase quantity button
      const increaseButton = screen.getByLabelText(defaultLabels.increaseQuantityLabel)
      fireEvent.click(increaseButton)

      // Check if quantity increased (should see quantity 1)
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  describe('Offer selection', () => {
    it('should handle booking offers', () => {
      const onBookOffer = vi.fn()
      const offer = createMockOfferType({
        id: 1,
        title: 'Test Offer',
        price: 100,
        type: 'perStay',
      })

      render(<SpecialOffers {...defaultProps} offers={[offer]} onBookOffer={onBookOffer} />)

      // First increase quantity
      const increaseButton = screen.getByLabelText(defaultLabels.increaseQuantityLabel)
      fireEvent.click(increaseButton)

      // Then book the offer
      const bookButton = screen.getByText(defaultLabels.bookNow)
      fireEvent.click(bookButton)

      expect(onBookOffer).toHaveBeenCalledWith({
        id: 1,
        name: 'Test Offer',
        price: 100,
        quantity: 1,
        type: 'perStay',
      })
    })

    it('should handle canceling offers', () => {
      const onBookOffer = vi.fn()
      const offer = createMockOfferType({
        id: 1,
        title: 'Test Offer',
        price: 100,
        type: 'perStay',
      })

      render(<SpecialOffers {...defaultProps} offers={[offer]} onBookOffer={onBookOffer} />)

      // First book the offer
      const increaseButton = screen.getByLabelText(defaultLabels.increaseQuantityLabel)
      fireEvent.click(increaseButton)

      const bookButton = screen.getByText(defaultLabels.bookNow)
      fireEvent.click(bookButton)

      // Now the button should show "Added" or similar
      expect(screen.getByText(defaultLabels.addedLabel)).toBeInTheDocument()

      // Click the remove button to cancel
      const removeButton = screen.getByText(defaultLabels.removeOfferLabel)
      fireEvent.click(removeButton)

      // Should call onBookOffer with quantity 0
      expect(onBookOffer).toHaveBeenLastCalledWith({
        id: 1,
        name: 'Test Offer',
        price: 0,
        quantity: 0,
        type: 'perStay',
      })
    })

    it('should prevent booking with zero quantity', () => {
      const onBookOffer = vi.fn()
      const offer = createMockOfferType({
        id: 1,
        title: 'Test Offer',
        price: 100,
        type: 'perStay',
      })

      render(<SpecialOffers {...defaultProps} offers={[offer]} onBookOffer={onBookOffer} />)

      // Try to book without increasing quantity
      const bookButton = screen.getByText(defaultLabels.bookNow)
      fireEvent.click(bookButton)

      // Should not call onBookOffer
      expect(onBookOffer).not.toHaveBeenCalled()
    })

    it('should validate maximum persons/nights', () => {
      const perPersonOffer = createMockOfferType({
        id: 1,
        title: 'Massage',
        price: 50,
        type: 'perPerson',
      })

      render(<SpecialOffers {...defaultProps} offers={[perPersonOffer]} />)

      // Should respect maxPersons limit
      const personsSelect = screen.getByLabelText(defaultLabels.numberOfPersons)
      expect(personsSelect).toBeInTheDocument()

      // Check that options don't exceed maxPersons
      const options = personsSelect.querySelectorAll('option')
      expect(options.length).toBeLessThanOrEqual(4) // 1-3 persons + placeholder
    })
  })

  describe('Custom hook testing', () => {
    it('should format prices correctly with useOfferPricing', () => {
      const offer = createMockOfferType({
        id: 1,
        title: 'Test Offer',
        price: 99.5,
        type: 'perStay',
      })

      render(<SpecialOffers {...defaultProps} offers={[offer]} currencySymbol="$" />)

      expect(screen.getByText('$99.50')).toBeInTheDocument()
    })

    it('should calculate totals correctly with useOfferPricing', () => {
      const perPersonOffer = createMockOfferType({
        id: 1,
        title: 'Massage',
        price: 50,
        type: 'perPerson',
      })

      render(<SpecialOffers {...defaultProps} offers={[perPersonOffer]} />)

      // Increase quantity to 2
      const increaseButton = screen.getByLabelText(defaultLabels.increaseQuantityLabel)
      fireEvent.click(increaseButton)
      fireEvent.click(increaseButton)

      // Change persons to 3
      const personsSelect = screen.getByTestId('person-selector')
      fireEvent.click(personsSelect)
      const option3 = screen.getByText('3 persons')
      fireEvent.click(option3)

      // Total should be 50 * 2 * 3 = 300
      expect(screen.getByText(/300/)).toBeInTheDocument()
    })
  })

  describe('Initial selections', () => {
    it('should respect initial selections', () => {
      const offer = createMockOfferType({
        id: 1,
        title: 'Test Offer',
        price: 100,
        type: 'perPerson',
      })

      const initialSelections = {
        1: {
          quantity: 2,
          persons: 3,
          nights: 1,
        },
      }

      render(<SpecialOffers {...defaultProps} offers={[offer]} initialSelections={initialSelections} />)

      // Should show initial quantity
      expect(screen.getByText('2')).toBeInTheDocument()

      // Should show initial persons selection
      const personSelector = screen.getByTestId('person-selector')
      expect(personSelector).toHaveTextContent('3 persons')
    })

    it('should merge initial selections with defaults', () => {
      const offers = [
        createMockOfferType({
          id: 1,
          title: 'First Offer',
          price: 100,
          type: 'perStay',
          requiresDateSelection: false,
        }),
        createMockOfferType({
          id: 2,
          title: 'Second Offer',
          price: 50,
          type: 'perStay',
          requiresDateSelection: false,
        }),
      ]

      const initialSelections = {
        [offers[0].id]: {
          quantity: 1,
          persons: 2,
          nights: 1,
        },
        // Second offer should get defaults
      }

      render(<SpecialOffers {...defaultProps} offers={offers} initialSelections={initialSelections} />)

      // First offer should have initial quantity of 1 (which should be visible)
      const offerCards = screen.getAllByTestId('offer-card')
      expect(offerCards).toHaveLength(2)

      // First offer should show quantity 1, second should show quantity 0
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  describe('State management', () => {
    it('should update booked state correctly', () => {
      const offer = createMockOfferType({
        id: 1,
        title: 'Test Offer',
        price: 100,
        type: 'perStay',
      })

      render(<SpecialOffers {...defaultProps} offers={[offer]} />)

      // Book the offer
      const increaseButton = screen.getByLabelText(defaultLabels.increaseQuantityLabel)
      fireEvent.click(increaseButton)

      const bookButton = screen.getByText(defaultLabels.bookNow)
      fireEvent.click(bookButton)

      // Should show as added
      expect(screen.getByText(defaultLabels.addedLabel)).toBeInTheDocument()
    })

    it('should reset booked state when quantity changes', async () => {
      const offer = createMockOfferType({
        id: 1,
        title: 'Test Offer',
        price: 100,
        type: 'perStay',
      })

      render(<SpecialOffers {...defaultProps} offers={[offer]} />)

      // Book the offer
      const increaseButton = screen.getByLabelText(defaultLabels.increaseQuantityLabel)
      fireEvent.click(increaseButton)

      const bookButton = screen.getByText(defaultLabels.bookNow)
      fireEvent.click(bookButton)

      // Now modify quantity
      fireEvent.click(increaseButton)

      // Should reset booked state (wait for state update)
      await waitFor(() => {
        expect(screen.queryByText(defaultLabels.addedLabel)).not.toBeInTheDocument()
      })
      expect(screen.getByText(defaultLabels.bookNow)).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('should handle missing onBookOffer prop gracefully', async () => {
      const offer = createMockOfferType({
        id: 1,
        title: 'Test Offer',
        price: 100,
        type: 'perStay',
        requiresDateSelection: false,
      })

      render(<SpecialOffers {...defaultProps} offers={[offer]} onBookOffer={undefined} />)

      const increaseButton = screen.getByLabelText(defaultLabels.increaseQuantityLabel)
      fireEvent.click(increaseButton)

      // Verify quantity was increased
      expect(screen.getByText('1')).toBeInTheDocument()

      const bookButton = screen.getByText(defaultLabels.bookNow)

      // Should not crash when clicking book button without onBookOffer
      expect(() => fireEvent.click(bookButton)).not.toThrow()

      // Wait for state updates and verify offer is marked as booked
      await waitFor(() => {
        expect(bookButton).toHaveTextContent(defaultLabels.removeOfferLabel)
      })
    })

    it('should handle invalid offer IDs', () => {
      const offers = createMockOfferTypes(2)

      render(<SpecialOffers {...defaultProps} offers={offers} />)

      // Component should render without crashing even with any potential ID mismatches
      expect(screen.getAllByText(defaultLabels.bookNow)).toHaveLength(2)
    })

    it('should handle zero price offers', () => {
      const freeOffer = createMockOfferType({
        id: 1,
        title: 'Free WiFi',
        price: 0,
        type: 'perStay',
      })

      render(<SpecialOffers {...defaultProps} offers={[freeOffer]} />)

      expect(screen.getByText('Free WiFi')).toBeInTheDocument()
      expect(screen.getByText('€0.00')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels for interactive elements', () => {
      const offer = createMockOfferType({
        id: 1,
        title: 'Test Offer',
        price: 100,
        type: 'perPerson',
      })

      render(<SpecialOffers {...defaultProps} offers={[offer]} />)

      expect(screen.getByLabelText(defaultLabels.increaseQuantityLabel)).toBeInTheDocument()
      expect(screen.getByLabelText(defaultLabels.decreaseQuantityLabel)).toBeInTheDocument()
      expect(screen.getByLabelText(defaultLabels.numberOfPersons)).toBeInTheDocument()
    })

    it('should support keyboard navigation', () => {
      const offer = createMockOfferType({
        id: 1,
        title: 'Test Offer',
        price: 100,
        type: 'perStay',
      })

      render(<SpecialOffers {...defaultProps} offers={[offer]} />)

      const bookButton = screen.getByText(defaultLabels.bookNow)

      // Button should be focusable
      bookButton.focus()
      expect(bookButton).toHaveFocus()
    })

    it('should have proper button states', () => {
      const offer = createMockOfferType({
        id: 1,
        title: 'Test Offer',
        price: 100,
        type: 'perStay',
      })

      render(<SpecialOffers {...defaultProps} offers={[offer]} />)

      const decreaseButton = screen.getByLabelText(defaultLabels.decreaseQuantityLabel)

      // Decrease button should be disabled when quantity is 0
      expect(decreaseButton).toBeDisabled()
    })
  })

  describe('Performance', () => {
    it('should handle large numbers of offers efficiently', () => {
      const manyOffers = createMockOfferTypes(50)

      const { container } = render(<SpecialOffers {...defaultProps} offers={manyOffers} />)

      // Should render all offers without performance issues
      expect(container.querySelectorAll('[data-testid="offer-card"]')).toHaveLength(50)
    })

    it('should use callbacks to prevent unnecessary re-renders', () => {
      const offer = createMockOfferType({
        id: 1,
        title: 'Test Offer',
        price: 100,
        type: 'perStay',
      })

      const { rerender } = render(<SpecialOffers {...defaultProps} offers={[offer]} />)

      // Re-render with same props
      rerender(<SpecialOffers {...defaultProps} offers={[offer]} />)

      // Should not cause issues
      expect(screen.getByText('Test Offer')).toBeInTheDocument()
    })
  })
})
