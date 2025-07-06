import { useEffect, useState } from 'react'
import type { SelectedCustomizations } from '../../ABS_RoomCustomization/types'
import type { RoomOption } from '../sections/RoomSelectionSection'
import type { SelectedOffer } from '../sections/SpecialOffersSection'
import type { BookingState } from '../sections/BookingStateSection'
import { calculateTotalPrice } from '../utils/dataConversion'
import { useBidUpgrade } from '../../../hooks/useBidUpgrade'
import type { BidItem } from '../../../hooks/useBidUpgrade'

export interface UseBookingStateProps {
  initialSelectedRoom?: RoomOption
  initialState?: BookingState
  initialSubtotal?: number
  initialTax?: number
  onConfirmBooking?: (bookingData: any) => void
  nights?: number
}

export const useBookingState = ({
  initialSelectedRoom,
  initialState = 'normal',
  initialSubtotal = 0,
  initialTax = 0,
  onConfirmBooking,
  nights = 1,
}: UseBookingStateProps) => {
  // State management
  const [selectedRoom, setSelectedRoom] = useState<RoomOption | undefined>(initialSelectedRoom)
  const [selectedCustomizations, setSelectedCustomizations] = useState<SelectedCustomizations>({})
  const [selectedOffers, setSelectedOffers] = useState<SelectedOffer[]>([])
  const [subtotal, setSubtotal] = useState<number>(initialSubtotal)
  const [tax, setTax] = useState<number>(initialTax)
  const [state, setState] = useState<BookingState>(initialState)
  const [isPriceCalculating, setIsPriceCalculating] = useState<boolean>(false)
  const [showMobilePricing, setShowMobilePricing] = useState<boolean>(false)

  // Bid upgrade management
  const bidUpgradeState = useBidUpgrade({
    onBidSubmit: (bid) => {
      console.log('Bid submitted:', bid)
      showToast(`Bid of €${bid.bidAmount} submitted for ${bid.roomName}`, 'success')
      
      // When a bid is accepted, it should replace the room selection
      if (bid.status === 'accepted' && bid.targetRoom) {
        setSelectedRoom({
          id: bid.targetRoom.id,
          roomType: bid.targetRoom.roomType,
          description: '',
          price: bid.bidAmount,
          perNight: true,
          image: '',
          amenities: [],
        })
      }
    },
    onBidRemove: (bidId) => {
      console.log('Bid removed:', bidId)
    },
  })

  // Update pricing when selections change
  useEffect(() => {
    setIsPriceCalculating(true)
    const timer = setTimeout(() => {
      const pricing = calculateTotalPrice(selectedRoom, selectedCustomizations, selectedOffers, 0.1, nights)
      // Add total bid amount to subtotal
      const totalWithBids = pricing.subtotal + bidUpgradeState.totalBidAmount
      setSubtotal(totalWithBids)
      setTax(pricing.tax)
      setIsPriceCalculating(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [selectedRoom, selectedCustomizations, selectedOffers, nights, bidUpgradeState.totalBidAmount])

  // Actions
  const selectRoom = (room: RoomOption) => {
    setSelectedRoom(room)
    // Clear any active bids when selecting a room
    if (bidUpgradeState.activeBid) {
      bidUpgradeState.removeBid(bidUpgradeState.activeBid.id)
    }
  }

  const updateCustomization = (category: string, optionId: string, optionLabel: string, optionPrice: number) => {
    setSelectedCustomizations((prev) => {
      const updated = { ...prev }
      if (!optionId) {
        delete updated[category]
      } else {
        updated[category] = { id: optionId, label: optionLabel, price: optionPrice }
      }
      return updated
    })
  }

  const updateOffer = (offer: SelectedOffer) => {
    setSelectedOffers((prev) => {
      const existing = prev.find((o) => o.id === offer.id)
      if (existing) {
        return prev.map((o) => (o.id === offer.id ? offer : o))
      }
      return [...prev, offer]
    })
  }

  const removeRoom = () => {
    setSelectedRoom(undefined)
    setSelectedCustomizations({})
  }

  const removeCustomization = (category: string) => {
    setSelectedCustomizations((prev) => {
      const updated = { ...prev }
      delete updated[category]
      return updated
    })
  }

  const removeOffer = (offerId: string | number) => {
    setSelectedOffers((prev) => prev.filter((o) => o.id !== offerId))
  }

  const confirmBooking = () => {
    setState('confirmation')
    setShowMobilePricing(false)
    if (onConfirmBooking) {
      onConfirmBooking({
        room: selectedRoom,
        customizations: selectedCustomizations,
        offers: selectedOffers,
        bids: bidUpgradeState.bids.filter(bid => bid.status === 'submitted'),
        totalPrice: subtotal + tax,
      })
    }
  }

  const resetState = () => setState('normal')

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    // This is a placeholder. In a real app, you'd use a toast library.
    console.log(`Toast: [${type}] ${message}`)
  }

  return {
    // State
    selectedRoom,
    selectedCustomizations,
    selectedOffers,
    subtotal,
    tax,
    total: subtotal + tax,
    state,
    isPriceCalculating,
    showMobilePricing,
    bids: bidUpgradeState.bids,

    // Actions
    actions: {
      selectRoom,
      updateCustomization,
      updateOffer,
      removeRoom,
      removeCustomization,
      removeOffer,
      confirmBooking,
      resetState,
      showToast,
      setShowMobilePricing,
      // Bid actions
      addBid: bidUpgradeState.addBid,
      removeBid: bidUpgradeState.removeBid,
    },
  }
}
