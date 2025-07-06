import { useState, useMemo, useEffect } from 'react'
import type { RoomOption } from '../types'

export interface UseSliderProps {
  room: RoomOption
  minPrice: number
  onMakeOffer?: (price: number, room: RoomOption) => void
  offerMadeText?: string
  activeBid?: {
    roomId: string | number
    bidAmount: number
    status: 'pending' | 'submitted' | 'accepted' | 'rejected'
  }
}

export interface UseSliderReturn {
  proposedPrice: number
  setProposedPrice: (price: number) => void
  maxPrice: number
  makeOffer: () => void
  resetBid: () => void
  formattedOfferText: string
  bidStatus: 'idle' | 'submitted'
  submittedPrice: number | null
}

export const useSlider = ({
  room,
  minPrice,
  onMakeOffer,
  offerMadeText = 'You offered {price}',
  activeBid,
}: UseSliderProps): UseSliderReturn => {
  const [maxPrice, setMaxPrice] = useState(room.price || 20)
  const hasActiveBid = activeBid?.roomId === room.id
  const [proposedPrice, setProposedPrice] = useState<number>(hasActiveBid ? activeBid.bidAmount : minPrice)
  const [submittedPrice, setSubmittedPrice] = useState<number | null>(hasActiveBid ? activeBid.bidAmount : null)
  const [bidStatus, setBidStatus] = useState<'idle' | 'submitted'>(hasActiveBid ? 'submitted' : 'idle')

  // Effect to recalculate prices when the active room changes
  useEffect(() => {
    setMaxPrice(room.price)
    // Reset proposed price to the minimum when room changes, unless there is an active bid
    if (!hasActiveBid) {
      setProposedPrice(minPrice)
    }
  }, [room, minPrice, hasActiveBid])

  // Memoize the offer text to avoid re-creating it on every render
  const formattedOfferText = useMemo(() => {
    if (bidStatus === 'submitted' && submittedPrice) {
      return offerMadeText.replace('{price}', submittedPrice.toString())
    }
    return ''
  }, [bidStatus, submittedPrice, offerMadeText])

  const makeOffer = () => {
    setSubmittedPrice(proposedPrice)
    setBidStatus('submitted')
    if (onMakeOffer) {
      onMakeOffer(proposedPrice, room)
    }
  }

  const resetBid = () => {
    setSubmittedPrice(null)
    setBidStatus('idle')
    setProposedPrice(minPrice)
  }

  return {
    proposedPrice,
    setProposedPrice,
    maxPrice,
    makeOffer,
    resetBid,
    formattedOfferText,
    bidStatus,
    submittedPrice,
  }
}
