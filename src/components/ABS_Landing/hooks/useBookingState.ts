import { useState, useMemo } from 'react'
import type { RoomOption, Customization, SpecialOffer, BookingState } from '../types'
import { useBidUpgrade } from '../../../hooks/useBidUpgrade'
import type { BidItem } from '../../../hooks/useBidUpgrade'

export const useBookingState = (initialState: BookingState) => {
  const [state, setState] = useState(initialState)
  const [showMobilePricing, setShowMobilePricing] = useState(false)
  const [bookingStatus, setBookingStatus] = useState<'normal' | 'loading' | 'error' | 'confirmation'>('normal')
  
  const bidUpgradeState = useBidUpgrade({
    onBidSubmit: (bid: BidItem) => {
      console.log('Bid submitted:', bid)
    },
    onBidRemove: (bidId: string) => {
      console.log('Bid removed:', bidId)
    },
  })

  // Memoize texts to prevent unnecessary re-renders if they are passed as props
  const texts = useMemo(() => state.texts, [state.texts])

  const selectRoom = (room: RoomOption | null) => {
    setState((prevState) => ({
      ...prevState,
      selectedRoom: room,
      activeBid: null, // Clear active bid when a room is selected
    }))
  }

  const makeOffer = (price: number, room: RoomOption) => {
    setState((prevState) => ({
      ...prevState,
      selectedRoom: null, // Clear selected room when a bid is made
      activeBid: {
        id: room.id, // Use room id as the bid's base id
        roomId: room.id,
        bidAmount: price,
        status: 'submitted',
        roomName: room.title || room.roomType,
      },
    }))
  }

  const cancelBid = (_roomId: string) => {
    setState((prevState) => ({
      ...prevState,
      activeBid: null, // Clear active bid
    }))
  }

  const addCustomization = (customization: Customization, roomId: string) => {
    setState((prevState) => {
      const newCustomizations = { ...prevState.customizations }
      if (!newCustomizations[roomId]) {
        newCustomizations[roomId] = []
      }
      
      // Remove any existing customization for the same category
      newCustomizations[roomId] = newCustomizations[roomId].filter(
        (c) => c.category !== customization.category
      )
      
      // Add the new customization
      newCustomizations[roomId].push(customization)
      
      return { ...prevState, customizations: newCustomizations }
    })
  }

  const removeCustomization = (customizationId: string, roomId: string) => {
    setState((prevState) => {
      const newCustomizations = { ...prevState.customizations }
      if (newCustomizations[roomId]) {
        newCustomizations[roomId] = newCustomizations[roomId].filter((c) => c.id !== customizationId)
      }
      return { ...prevState, customizations: newCustomizations }
    })
  }

  const addSpecialOffer = (offer: SpecialOffer) => {
    setState((prevState) => ({
      ...prevState,
      specialOffers: [...prevState.specialOffers, offer],
    }))
  }

  const removeSpecialOffer = (offerId: string) => {
    setState((prevState) => ({
      ...prevState,
      specialOffers: prevState.specialOffers.filter((o) => o.id.toString() !== offerId),
    }))
  }

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    // This is a placeholder. In a real app, you'd use a toast library.
    console.log(`Toast: [${type}] ${message}`)
  }

  const confirmBooking = () => {
    setBookingStatus('confirmation')
  }

  const resetState = () => {
    setBookingStatus('normal')
    setState(initialState)
    setShowMobilePricing(false)
  }

  return {
    state,
    texts,
    showMobilePricing,
    bookingStatus,
    actions: {
      selectRoom,
      addCustomization,
      removeCustomization,
      addSpecialOffer,
      removeSpecialOffer,
      addBid: bidUpgradeState.addBid,
      removeBid: bidUpgradeState.removeBid,
      makeOffer,
      cancelBid,
      showToast,
      setShowMobilePricing,
      confirmBooking,
      resetState,
    },
  }
}
