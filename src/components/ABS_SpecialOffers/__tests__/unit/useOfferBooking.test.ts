import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useOfferBooking } from '../../hooks/useOfferBooking'
import { createMockOfferType } from '../../../../__tests__/helpers'
import type { OfferType, OfferSelection, ReservationInfo } from '../../types'

describe('useOfferBooking', () => {
  let mockOffers: OfferType[]
  let mockSelections: Record<number, OfferSelection>
  let mockBookedOffers: Set<number>
  let mockBookingAttempts: Set<number>
  let mockSetBookedOffers: ReturnType<typeof vi.fn>
  let mockSetBookingAttempts: ReturnType<typeof vi.fn>
  let mockSetSelections: ReturnType<typeof vi.fn>
  let mockOnBookOffer: ReturnType<typeof vi.fn>
  let mockCalculateTotal: ReturnType<typeof vi.fn>
  let mockReservationInfo: ReservationInfo

  beforeEach(() => {
    mockOffers = [
      createMockOfferType({ id: 1, type: 'perStay', price: 100 }),
      createMockOfferType({ id: 2, type: 'perPerson', price: 50 }),
      createMockOfferType({ id: 3, type: 'perNight', price: 25 }),
      createMockOfferType({ id: 4, type: 'perStay', requiresDateSelection: true, price: 75 }),
    ]

    mockSelections = {
      1: { quantity: 2, persons: 1, nights: 1 },
      2: { quantity: 1, persons: 3, nights: 1 },
      3: { quantity: 0, persons: 1, nights: 2, startDate: new Date('2024-01-15'), endDate: new Date('2024-01-17') },
      4: { quantity: 0, persons: 1, nights: 1 },
    }

    mockBookedOffers = new Set()
    mockBookingAttempts = new Set()
    mockSetBookedOffers = vi.fn()
    mockSetBookingAttempts = vi.fn()
    mockSetSelections = vi.fn()
    mockOnBookOffer = vi.fn()
    mockCalculateTotal = vi.fn((offer, selection) => offer.price * selection.quantity)
    mockReservationInfo = { personCount: 2 }
  })

  const renderBookingHook = () =>
    renderHook(() =>
      useOfferBooking({
        offers: mockOffers,
        selections: mockSelections,
        bookedOffers: mockBookedOffers,
        bookingAttempts: mockBookingAttempts,
        setBookedOffers: mockSetBookedOffers,
        setBookingAttempts: mockSetBookingAttempts,
        setSelections: mockSetSelections,
        onBookOffer: mockOnBookOffer,
        calculateTotal: mockCalculateTotal,
        reservationInfo: mockReservationInfo,
      })
    )

  describe('validateBooking', () => {
    it('should validate quantity-based offers correctly', () => {
      const { result } = renderBookingHook()

      // Valid quantity
      expect(result.current.validateBooking(mockOffers[0], mockSelections[1])).toBeNull()

      // Invalid quantity (0)
      expect(result.current.validateBooking(mockOffers[0], { ...mockSelections[1], quantity: 0 })).toBe(
        'Quantity must be greater than 0'
      )
    })

    it('should validate date-based offers correctly', () => {
      const { result } = renderBookingHook()
      const dateBasedOffer = mockOffers[3] // requiresDateSelection: true

      // Missing date
      expect(result.current.validateBooking(dateBasedOffer, mockSelections[4])).toBe('Date selection required')

      // Valid single date
      const validSingleDate = { ...mockSelections[4], selectedDate: new Date('2024-01-15') }
      expect(result.current.validateBooking(dateBasedOffer, validSingleDate)).toBeNull()

      // Valid multiple dates
      const validMultipleDates = {
        ...mockSelections[4],
        selectedDates: [new Date('2024-01-15'), new Date('2024-01-16')],
      }
      expect(result.current.validateBooking(dateBasedOffer, validMultipleDates)).toBeNull()
    })

    it('should validate perNight offers with date ranges', () => {
      const { result } = renderBookingHook()
      const perNightOffer = mockOffers[2] // type: 'perNight'

      // Missing date range
      const missingDateRange = { ...mockSelections[3], startDate: undefined, endDate: undefined }
      expect(result.current.validateBooking(perNightOffer, missingDateRange)).toBe('Date range selection required')

      // Partial date range
      const partialDateRange = { ...mockSelections[3], endDate: undefined }
      expect(result.current.validateBooking(perNightOffer, partialDateRange)).toBe('Date range selection required')

      // Valid date range
      expect(result.current.validateBooking(perNightOffer, mockSelections[3])).toBeNull()
    })
  })

  describe('createOfferData', () => {
    it('should create offer data for quantity-based offers', () => {
      const { result } = renderBookingHook()

      const offerData = result.current.createOfferData(mockOffers[0], mockSelections[1])

      expect(offerData).toEqual({
        id: 1,
        name: mockOffers[0].title,
        price: 200, // calculateTotal returns price * quantity
        quantity: 2,
        type: 'perStay',
      })
    })

    it('should create offer data for perPerson offers', () => {
      const { result } = renderBookingHook()

      const offerData = result.current.createOfferData(mockOffers[1], mockSelections[2])

      expect(offerData).toEqual({
        id: 2,
        name: mockOffers[1].title,
        price: 50, // calculateTotal returns price * quantity (1)
        quantity: 1,
        type: 'perPerson',
        persons: 3,
      })
    })

    it('should create offer data for perNight offers', () => {
      const { result } = renderBookingHook()
      const validPerNightSelection = { ...mockSelections[3], quantity: 2 }

      const offerData = result.current.createOfferData(mockOffers[2], validPerNightSelection)

      expect(offerData).toEqual({
        id: 3,
        name: mockOffers[2].title,
        price: 50, // calculateTotal returns price * quantity (2)
        quantity: 2,
        type: 'perNight',
        nights: 2,
        startDate: mockSelections[3].startDate,
        endDate: mockSelections[3].endDate,
      })
    })

    it('should create offer data for date-based offers with single date', () => {
      const { result } = renderBookingHook()
      const dateBasedSelection = {
        ...mockSelections[4],
        selectedDate: new Date('2024-01-15'),
      }

      const offerData = result.current.createOfferData(mockOffers[3], dateBasedSelection)

      expect(offerData).toEqual({
        id: 4,
        name: mockOffers[3].title,
        price: 0, // calculateTotal returns price * quantity (0)
        quantity: 1, // Set to 1 for single date selection
        type: 'perStay',
        selectedDate: dateBasedSelection.selectedDate,
      })
    })

    it('should create offer data for date-based offers with multiple dates', () => {
      const { result } = renderBookingHook()
      const multipleDatesSelection = {
        ...mockSelections[4],
        selectedDates: [new Date('2024-01-15'), new Date('2024-01-16')],
      }

      const offerData = result.current.createOfferData(mockOffers[3], multipleDatesSelection)

      expect(offerData).toEqual({
        id: 4,
        name: mockOffers[3].title,
        price: 0, // calculateTotal returns price * quantity (0)
        quantity: 2, // Set to number of selected dates
        type: 'perStay',
        selectedDates: multipleDatesSelection.selectedDates,
      })
    })
  })

  describe('bookOffer', () => {
    it('should book a valid offer successfully', () => {
      const { result } = renderBookingHook()

      act(() => {
        result.current.bookOffer(1)
      })

      expect(mockSetBookedOffers).toHaveBeenCalledWith(expect.any(Function))
      expect(mockSetBookingAttempts).toHaveBeenCalledWith(expect.any(Function))
      expect(mockOnBookOffer).toHaveBeenCalledWith({
        id: 1,
        name: mockOffers[0].title,
        price: 200,
        quantity: 2,
        type: 'perStay',
      })
    })

    it('should track booking attempts for invalid offers', () => {
      // Set up invalid selections before rendering hook
      const invalidSelections = { ...mockSelections, 1: { ...mockSelections[1], quantity: 0 } }
      mockSelections = invalidSelections

      const { result } = renderBookingHook()

      act(() => {
        result.current.bookOffer(1)
      })

      expect(mockSetBookingAttempts).toHaveBeenCalledWith(expect.any(Function))
      expect(mockOnBookOffer).not.toHaveBeenCalled()
    })

    it('should not book offer that does not exist', () => {
      const { result } = renderBookingHook()

      act(() => {
        result.current.bookOffer(999) // Non-existent offer ID
      })

      expect(mockOnBookOffer).not.toHaveBeenCalled()
    })
  })

  describe('cancelOffer', () => {
    it('should cancel an offer successfully', () => {
      const { result } = renderBookingHook()

      act(() => {
        result.current.cancelOffer(1)
      })

      expect(mockSetBookedOffers).toHaveBeenCalledWith(expect.any(Function))
      expect(mockSetBookingAttempts).toHaveBeenCalledWith(expect.any(Function))
      expect(mockSetSelections).toHaveBeenCalledWith(expect.any(Function))

      // Should call onBookOffer with quantity 0 to indicate removal
      expect(mockOnBookOffer).toHaveBeenCalledWith({
        id: 1,
        name: mockOffers[0].title,
        price: 0,
        quantity: 0,
        type: 'perStay',
      })
    })

    it('should not cancel offer that does not exist', () => {
      const { result } = renderBookingHook()

      act(() => {
        result.current.cancelOffer(999) // Non-existent offer ID
      })

      expect(mockOnBookOffer).not.toHaveBeenCalled()
    })
  })

  describe('handleBookOrCancel', () => {
    it('should book offer when not currently booked', () => {
      const { result } = renderBookingHook()

      act(() => {
        result.current.handleBookOrCancel(1)
      })

      // Should call setBookedOffers to add the offer
      expect(mockSetBookedOffers).toHaveBeenCalledWith(expect.any(Function))
      // Should call onBookOffer with the booking data
      expect(mockOnBookOffer).toHaveBeenCalledWith({
        id: 1,
        name: mockOffers[0].title,
        price: 200,
        quantity: 2,
        type: 'perStay',
      })
    })

    it('should cancel offer when currently booked', () => {
      mockBookedOffers = new Set([1])

      const { result } = renderBookingHook()

      act(() => {
        result.current.handleBookOrCancel(1)
      })

      // Should call setBookedOffers to remove the offer
      expect(mockSetBookedOffers).toHaveBeenCalledWith(expect.any(Function))
      // Should call setSelections to reset the selection
      expect(mockSetSelections).toHaveBeenCalledWith(expect.any(Function))
      // Should call onBookOffer with quantity 0 to indicate removal
      expect(mockOnBookOffer).toHaveBeenCalledWith({
        id: 1,
        name: mockOffers[0].title,
        price: 0,
        quantity: 0,
        type: 'perStay',
      })
    })
  })
})
