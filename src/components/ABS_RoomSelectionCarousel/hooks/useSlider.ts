import { useState, useEffect, useCallback, useMemo } from 'react'
import type { RoomOption } from '../types'

export interface UseSliderProps {
  roomOptions: RoomOption[]
  activeIndex: number
  minPrice: number
  onMakeOffer?: (price: number, room: RoomOption) => void
  offerMadeText?: string
}

export interface UseSliderReturn {
  proposedPrice: number
  setProposedPrice: (price: number) => void
  makeOffer: () => void
  maxPrice: number
}

export const useSlider = ({
  roomOptions,
  activeIndex,
  minPrice,
  onMakeOffer,
  offerMadeText = 'Has propuesto {price} EUR por noche',
}: UseSliderProps): UseSliderReturn => {
  // Calculate max price based on active room
  const maxPrice = useMemo(() => roomOptions[activeIndex]?.price || 20, [roomOptions, activeIndex])

  // Calculate initial proposed price
  const initialProposedPrice = useMemo(() => Math.round((minPrice + maxPrice) / 2), [minPrice, maxPrice])

  const [proposedPrice, setProposedPrice] = useState(initialProposedPrice)

  // Update proposed price when active room changes
  useEffect(() => {
    if (roomOptions[activeIndex]) {
      const newPrice = Math.round((minPrice + roomOptions[activeIndex].price) / 2)
      setProposedPrice(newPrice)
    }
  }, [activeIndex, minPrice, roomOptions])

  // Handle making an offer
  const makeOffer = useCallback(() => {
    if (onMakeOffer && roomOptions[activeIndex]) {
      onMakeOffer(proposedPrice, roomOptions[activeIndex])
    } else {
      alert(offerMadeText.replace('{price}', proposedPrice.toString()))
    }
  }, [onMakeOffer, roomOptions, activeIndex, proposedPrice, offerMadeText])

  return {
    proposedPrice,
    setProposedPrice,
    makeOffer,
    maxPrice,
  }
}
