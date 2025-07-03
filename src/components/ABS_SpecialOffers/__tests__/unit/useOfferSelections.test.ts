import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useOfferSelections } from '../../hooks/useOfferSelections'
import { createMockOfferType } from '../../../../__tests__/helpers'
import type { OfferType, ReservationInfo } from '../../types'

describe('useOfferSelections', () => {
  let mockOffers: OfferType[]
  let mockReservationInfo: ReservationInfo

  beforeEach(() => {
    mockOffers = [
      createMockOfferType({ id: 1, type: 'perStay' }),
      createMockOfferType({ id: 2, type: 'perPerson' }),
      createMockOfferType({ id: 3, type: 'perNight' }),
    ]
    mockReservationInfo = { personCount: 2 }
  })

  it('should initialize selections with default values', () => {
    const { result } = renderHook(() =>
      useOfferSelections({
        offers: mockOffers,
        reservationInfo: mockReservationInfo,
      })
    )

    expect(result.current.selections).toEqual({
      1: {
        quantity: 0,
        persons: 1, // perStay uses 1
        nights: 1,
        selectedDate: undefined,
        startDate: undefined,
        endDate: undefined,
      },
      2: {
        quantity: 0,
        persons: 2, // perPerson uses reservationInfo.personCount
        nights: 1,
        selectedDate: undefined,
        startDate: undefined,
        endDate: undefined,
      },
      3: {
        quantity: 0,
        persons: 1, // perNight uses 1
        nights: 1,
        selectedDate: undefined,
        startDate: undefined,
        endDate: undefined,
      },
    })
  })

  it('should merge initial selections with defaults', () => {
    const initialSelections = {
      1: {
        quantity: 2,
        persons: 3,
        nights: 1,
        selectedDate: undefined,
        startDate: undefined,
        endDate: undefined,
      },
    }

    const { result } = renderHook(() =>
      useOfferSelections({
        offers: mockOffers,
        initialSelections,
        reservationInfo: mockReservationInfo,
      })
    )

    expect(result.current.selections[1]).toEqual(initialSelections[1])
    expect(result.current.selections[2].persons).toBe(2) // Default from reservationInfo
    expect(result.current.selections[3].persons).toBe(1) // Default for perNight
  })

  it('should update quantity correctly', () => {
    const { result } = renderHook(() =>
      useOfferSelections({
        offers: mockOffers,
        reservationInfo: mockReservationInfo,
      })
    )

    act(() => {
      result.current.updateQuantity(1, 2)
    })

    expect(result.current.selections[1].quantity).toBe(2)

    act(() => {
      result.current.updateQuantity(1, -1)
    })

    expect(result.current.selections[1].quantity).toBe(1)

    // Test minimum boundary
    act(() => {
      result.current.updateQuantity(1, -2)
    })

    expect(result.current.selections[1].quantity).toBe(0)
  })

  it('should update selected date correctly for date-based offers', () => {
    const dateBasedOffer = createMockOfferType({ id: 4, type: 'perStay', requiresDateSelection: true })
    const offers = [...mockOffers, dateBasedOffer]
    const testDate = new Date('2024-01-15')

    const { result } = renderHook(() =>
      useOfferSelections({
        offers,
        reservationInfo: mockReservationInfo,
      })
    )

    act(() => {
      result.current.updateSelectedDate(4, testDate)
    })

    expect(result.current.selections[4].selectedDate).toBe(testDate)
    expect(result.current.selections[4].quantity).toBe(1) // Should set quantity to 1 when date selected

    act(() => {
      result.current.updateSelectedDate(4, undefined)
    })

    expect(result.current.selections[4].selectedDate).toBeUndefined()
    expect(result.current.selections[4].quantity).toBe(0) // Should reset quantity when date cleared
  })

  it('should update selected dates correctly for multi-date offers', () => {
    const multiDateOffer = createMockOfferType({
      id: 4,
      type: 'perStay',
      requiresDateSelection: true,
      allowsMultipleDates: true,
    })
    const offers = [...mockOffers, multiDateOffer]
    const testDates = [new Date('2024-01-15'), new Date('2024-01-16')]

    const { result } = renderHook(() =>
      useOfferSelections({
        offers,
        reservationInfo: mockReservationInfo,
      })
    )

    act(() => {
      result.current.updateSelectedDates(4, testDates)
    })

    expect(result.current.selections[4].selectedDates).toEqual(testDates)
    expect(result.current.selections[4].quantity).toBe(2) // Should set quantity to number of dates
  })

  it('should update persons correctly', () => {
    const { result } = renderHook(() =>
      useOfferSelections({
        offers: mockOffers,
        reservationInfo: mockReservationInfo,
      })
    )

    act(() => {
      result.current.updatePersons(2, 4)
    })

    expect(result.current.selections[2].persons).toBe(4)
  })

  it('should clear booked state when quantity changes', () => {
    const { result } = renderHook(() =>
      useOfferSelections({
        offers: mockOffers,
        reservationInfo: mockReservationInfo,
      })
    )

    // First, mark offer as booked
    act(() => {
      result.current.setBookedOffers((prev) => new Set([...prev, 1]))
    })

    expect(result.current.bookedOffers.has(1)).toBe(true)

    // Now update quantity - should clear booked state
    act(() => {
      result.current.updateQuantity(1, 1)
    })

    expect(result.current.bookedOffers.has(1)).toBe(false)
  })

  it('should clear booked state when date changes', () => {
    const dateBasedOffer = createMockOfferType({ id: 4, type: 'perStay', requiresDateSelection: true })
    const offers = [...mockOffers, dateBasedOffer]

    const { result } = renderHook(() =>
      useOfferSelections({
        offers,
        reservationInfo: mockReservationInfo,
      })
    )

    // Mark offer as booked
    act(() => {
      result.current.setBookedOffers((prev) => new Set([...prev, 4]))
    })

    expect(result.current.bookedOffers.has(4)).toBe(true)

    // Update date - should clear booked state
    act(() => {
      result.current.updateSelectedDate(4, new Date('2024-01-15'))
    })

    expect(result.current.bookedOffers.has(4)).toBe(false)
  })

  it('should clear booked state when persons change', () => {
    const { result } = renderHook(() =>
      useOfferSelections({
        offers: mockOffers,
        reservationInfo: mockReservationInfo,
      })
    )

    // Mark offer as booked
    act(() => {
      result.current.setBookedOffers((prev) => new Set([...prev, 2]))
    })

    expect(result.current.bookedOffers.has(2)).toBe(true)

    // Update persons - should clear booked state
    act(() => {
      result.current.updatePersons(2, 3)
    })

    expect(result.current.bookedOffers.has(2)).toBe(false)
  })
})
