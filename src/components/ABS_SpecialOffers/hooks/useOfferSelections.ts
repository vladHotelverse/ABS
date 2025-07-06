import { useCallback, useState, useEffect } from 'react'
import type { OfferSelection, OfferType, ReservationInfo } from '../types'

interface UseOfferSelectionsProps {
  offers: OfferType[]
  initialSelections?: Record<number, OfferSelection>
  reservationInfo?: ReservationInfo
}

export const useOfferSelections = ({ offers, initialSelections, reservationInfo }: UseOfferSelectionsProps) => {
  // Initialize selections with lazy initialization
  const [selections, setSelections] = useState<Record<number, OfferSelection>>(() => {
    const defaultSelections: Record<number, OfferSelection> = {}
    offers.forEach((offer) => {
      defaultSelections[offer.id] = {
        quantity: 0,
        persons: offer.type === 'perPerson' ? reservationInfo?.personCount || 1 : 1,
        nights: 1,
        selectedDate: undefined,
        startDate: undefined,
        endDate: undefined,
      }
    })
    return { ...defaultSelections, ...initialSelections }
  })
  const [bookedOffers, setBookedOffers] = useState<Set<number>>(new Set())
  const [bookingAttempts, setBookingAttempts] = useState<Set<number>>(new Set())

  useEffect(() => {
    const defaultSelections: Record<number, OfferSelection> = {}
    offers.forEach((offer) => {
      defaultSelections[offer.id] = {
        quantity: 0,
        persons: offer.type === 'perPerson' ? reservationInfo?.personCount || 1 : 1,
        nights: 1,
        selectedDate: undefined,
        startDate: undefined,
        endDate: undefined,
      }
    })

    const newSelections = { ...defaultSelections, ...initialSelections }
    setSelections(newSelections)

    const newBookedOffers = new Set<number>()
    if (initialSelections) {
      for (const id in initialSelections) {
        if (Object.prototype.hasOwnProperty.call(initialSelections, id)) {
          const selection = initialSelections[id]
          if (selection && selection.quantity > 0) {
            newBookedOffers.add(Number(id))
          }
        }
      }
    }
    setBookedOffers(newBookedOffers)
  }, [initialSelections, offers, reservationInfo])

  // Helper function to clear booked state and booking attempts
  const clearOfferState = useCallback((id: number) => {
    setBookedOffers((prev) => {
      if (prev.has(id)) {
        const newBooked = new Set(prev)
        newBooked.delete(id)
        return newBooked
      }
      return prev
    })
    setBookingAttempts((prev) => {
      if (prev.has(id)) {
        const newAttempts = new Set(prev)
        newAttempts.delete(id)
        return newAttempts
      }
      return prev
    })
  }, [])

  const updateQuantity = useCallback(
    (id: number, change: number): void => {
      setSelections((prev) => {
        const currentSelection = prev[id]
        const newQuantity = Math.max(0, currentSelection.quantity + change)

        return {
          ...prev,
          [id]: {
            ...currentSelection,
            quantity: newQuantity,
          },
        }
      })
      clearOfferState(id)
    },
    [clearOfferState]
  )

  const updateSelectedDate = useCallback(
    (id: number, selectedDate: Date | undefined): void => {
      setSelections((prev) => {
        const offer = offers.find((o) => o.id === id)
        const currentSelection = prev[id]
        const newQuantity = offer?.requiresDateSelection ? (selectedDate ? 1 : 0) : currentSelection.quantity

        return {
          ...prev,
          [id]: {
            ...currentSelection,
            selectedDate,
            quantity: newQuantity,
          },
        }
      })
      clearOfferState(id)
    },
    [offers, clearOfferState]
  )

  const updateSelectedDates = useCallback(
    (id: number, selectedDates: Date[]): void => {
      setSelections((prev) => {
        const offer = offers.find((o) => o.id === id)
        const currentSelection = prev[id]
        const newQuantity = offer?.requiresDateSelection ? selectedDates.length : currentSelection.quantity

        return {
          ...prev,
          [id]: {
            ...currentSelection,
            selectedDates,
            quantity: newQuantity,
          },
        }
      })
      clearOfferState(id)
    },
    [offers, clearOfferState]
  )

  const updatePersons = useCallback((id: number, persons: number): void => {
    setSelections((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        persons,
      },
    }))
    setBookedOffers((prevBooked) => {
      if (prevBooked.has(id)) {
        const newBooked = new Set(prevBooked)
        newBooked.delete(id)
        return newBooked
      }
      return prevBooked
    })
  }, [])

  return {
    selections,
    bookedOffers,
    bookingAttempts,
    updateQuantity,
    updateSelectedDate,
    updateSelectedDates,
    updatePersons,
    setBookedOffers,
    setBookingAttempts,
    setSelections,
  }
}
