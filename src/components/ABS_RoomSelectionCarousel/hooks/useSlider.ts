import { useState, useEffect, useCallback, useMemo } from 'react'
import type { RoomOption } from '../types'

export interface UseSliderProps {
  roomOptions: RoomOption[]
  activeIndex: number
  minPrice: number
  onMakeOffer?: (price: number, room: RoomOption) => void
  offerMadeText?: string
  activeBid?: {
    roomId: string
    bidAmount: number
    status: 'pending' | 'submitted' | 'accepted' | 'rejected'
  }
}

export interface UseSliderReturn {
  proposedPrice: number
  setProposedPrice: (price: number) => void
  makeOffer: () => void
  maxPrice: number
  bidStatus: 'idle' | 'submitted'
  submittedPrice: number | null
  resetBid: () => void
}

export const useSlider = ({
  roomOptions,
  activeIndex,
  minPrice,
  onMakeOffer,
  offerMadeText = 'Has propuesto {price} EUR por noche',
  activeBid,
}: UseSliderProps): UseSliderReturn => {
  // Calculate max price based on active room
  const maxPrice = useMemo(() => roomOptions[activeIndex]?.price || 20, [roomOptions, activeIndex])

  // Calculate initial proposed price
  const initialProposedPrice = useMemo(() => Math.round((minPrice + maxPrice) / 2), [minPrice, maxPrice])

  const currentRoom = roomOptions[activeIndex]
  const hasActiveBid = activeBid && currentRoom && activeBid.roomId === currentRoom.id

  const [proposedPrice, setProposedPrice] = useState(
    hasActiveBid ? activeBid.bidAmount : initialProposedPrice
  )
  const [bidStatus, setBidStatus] = useState<'idle' | 'submitted'>(
    hasActiveBid && activeBid.status === 'submitted' ? 'submitted' : 'idle'
  )
  const [submittedPrice, setSubmittedPrice] = useState<number | null>(
    hasActiveBid ? activeBid.bidAmount : null
  )

  // Update proposed price when active room changes
  useEffect(() => {
    if (roomOptions[activeIndex]) {
      const currentRoom = roomOptions[activeIndex]
      const hasActiveBid = activeBid && activeBid.roomId === currentRoom.id
      
      if (hasActiveBid) {
        // If there's an active bid for this room, show it
        setProposedPrice(activeBid.bidAmount)
        setBidStatus(activeBid.status === 'submitted' ? 'submitted' : 'idle')
        setSubmittedPrice(activeBid.bidAmount)
      } else {
        // Otherwise, reset to default
        const newPrice = Math.round((minPrice + currentRoom.price) / 2)
        setProposedPrice(newPrice)
        setBidStatus('idle')
        setSubmittedPrice(null)
      }
    }
  }, [activeIndex, minPrice, roomOptions, activeBid])

  // Handle making an offer
  const makeOffer = useCallback(() => {
    if (onMakeOffer && roomOptions[activeIndex]) {
      onMakeOffer(proposedPrice, roomOptions[activeIndex])
      setBidStatus('submitted')
      setSubmittedPrice(proposedPrice)
    } else {
      alert(offerMadeText.replace('{price}', proposedPrice.toString()))
    }
  }, [onMakeOffer, roomOptions, activeIndex, proposedPrice, offerMadeText])

  // Reset bid status
  const resetBid = useCallback(() => {
    setBidStatus('idle')
    setSubmittedPrice(null)
    setProposedPrice(initialProposedPrice)
  }, [initialProposedPrice])

  return {
    proposedPrice,
    setProposedPrice,
    makeOffer,
    maxPrice,
    bidStatus,
    submittedPrice,
    resetBid,
  }
}
