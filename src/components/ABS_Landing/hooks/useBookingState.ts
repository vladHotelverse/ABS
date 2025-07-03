import { useEffect, useState } from 'react'
import type { SelectedCustomizations } from '../../ABS_RoomCustomization/types'
import type { RoomOption } from '../sections/RoomSelectionSection'
import type { SelectedOffer } from '../sections/SpecialOffersSection'
import type { BookingState } from '../sections/BookingStateSection'
import { calculateTotalPrice } from '../utils/dataConversion'

export interface UseBookingStateProps {
  initialSelectedRoom?: RoomOption
  initialState?: BookingState
  initialSubtotal?: number
  initialTax?: number
  onConfirmBooking?: (bookingData: any) => void
  nights?: number
}

export interface UseBookingStateReturn {
  // State
  selectedRoom: RoomOption | undefined
  selectedCustomizations: SelectedCustomizations
  selectedOffers: SelectedOffer[]
  subtotal: number
  tax: number
  total: number
  state: BookingState
  isPriceCalculating: boolean
  isMobilePricingOverlayOpen: boolean

  // Actions
  setSelectedRoom: (room: RoomOption | undefined) => void
  setSelectedCustomizations: (
    customizations: SelectedCustomizations | ((prev: SelectedCustomizations) => SelectedCustomizations)
  ) => void
  setSelectedOffers: (offers: SelectedOffer[] | ((prev: SelectedOffer[]) => SelectedOffer[])) => void
  setState: (state: BookingState) => void
  setIsMobilePricingOverlayOpen: (open: boolean) => void

  // Handlers
  handleConfirmBooking: () => void
  handleRetry: () => void
  handleBackToNormal: () => void
}

export const useBookingState = ({
  initialSelectedRoom,
  initialState = 'normal',
  initialSubtotal = 0,
  initialTax = 0,
  onConfirmBooking,
  nights = 1,
}: UseBookingStateProps): UseBookingStateReturn => {
  // State management
  const [selectedRoom, setSelectedRoom] = useState<RoomOption | undefined>(initialSelectedRoom)
  const [selectedCustomizations, setSelectedCustomizations] = useState<SelectedCustomizations>({})
  const [selectedOffers, setSelectedOffers] = useState<SelectedOffer[]>([])
  const [subtotal, setSubtotal] = useState<number>(initialSubtotal)
  const [tax, setTax] = useState<number>(initialTax)
  const [state, setState] = useState<BookingState>(initialState)
  const [isPriceCalculating, setIsPriceCalculating] = useState<boolean>(false)
  const [isMobilePricingOverlayOpen, setIsMobilePricingOverlayOpen] = useState<boolean>(false)

  // Update pricing when selections change
  useEffect(() => {
    setIsPriceCalculating(true)

    // Simulate price calculation delay for better UX
    const calculatePrices = setTimeout(() => {
      const pricing = calculateTotalPrice(selectedRoom, selectedCustomizations, selectedOffers, 0.1, nights)
      setSubtotal(pricing.subtotal)
      setTax(pricing.tax)
      setIsPriceCalculating(false)
    }, 300)

    return () => clearTimeout(calculatePrices)
  }, [selectedRoom, selectedCustomizations, selectedOffers, nights])

  // Handlers
  const handleConfirmBooking = () => {
    setState('confirmation')
    setIsMobilePricingOverlayOpen(false)
    if (onConfirmBooking) {
      onConfirmBooking({
        room: selectedRoom,
        customizations: selectedCustomizations,
        offers: selectedOffers,
        totalPrice: subtotal + tax,
      })
    }
  }

  const handleRetry = () => {
    setState('normal')
  }

  const handleBackToNormal = () => {
    setState('normal')
  }

  const total = subtotal + tax

  return {
    // State
    selectedRoom,
    selectedCustomizations,
    selectedOffers,
    subtotal,
    tax,
    total,
    state,
    isPriceCalculating,
    isMobilePricingOverlayOpen,

    // Actions
    setSelectedRoom,
    setSelectedCustomizations,
    setSelectedOffers,
    setState,
    setIsMobilePricingOverlayOpen,

    // Handlers
    handleConfirmBooking,
    handleRetry,
    handleBackToNormal,
  }
}
