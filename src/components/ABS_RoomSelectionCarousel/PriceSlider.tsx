import clsx from 'clsx'
import type React from 'react'
import './slider-styles.css'

export interface PriceSliderProps {
  className?: string
  proposedPrice: number
  minPrice: number
  maxPrice: number
  nightText?: string
  makeOfferText?: string
  availabilityText?: string
  proposePriceText?: string
  currencyText?: string
  bidStatus?: 'idle' | 'submitted'
  submittedPrice?: number | null
  bidSubmittedText?: string
  updateBidText?: string
  cancelBidText?: string
  roomName?: string
  onPriceChange: (price: number) => void
  onMakeOffer: () => void
  onCancelBid?: () => void
}

const PriceSlider: React.FC<PriceSliderProps> = ({
  className,
  proposedPrice,
  minPrice,
  maxPrice,
  nightText = '/noche',
  makeOfferText = 'Place a bid',
  availabilityText = 'Sujeto a disponibilidad',
  proposePriceText = 'Propon tu precio:',
  currencyText = 'EUR',
  bidStatus = 'idle',
  submittedPrice = null,
  bidSubmittedText = 'Bid submitted',
  updateBidText = 'Update bid',
  cancelBidText = 'Cancel',
  roomName,
  onPriceChange,
  onMakeOffer,
  onCancelBid,
}) => {
  // Calculate slider percentage
  const sliderPercentage = ((proposedPrice - minPrice) / (maxPrice - minPrice)) * 100

  // Generate dynamic propose text
  const dynamicProposeText = roomName 
    ? `${proposePriceText.replace(':', '')} for ${roomName}:`
    : proposePriceText

  return (
    <div className={clsx('w-full', className)}>
      {bidStatus === 'submitted' && submittedPrice ? (
        // Submitted bid view
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">{bidSubmittedText}</span>
              <span className="text-lg font-bold text-blue-900">
                {`${submittedPrice} ${currencyText}/${nightText}`}
              </span>
            </div>
            <p className="text-xs text-blue-600">{availabilityText}</p>
          </div>
          
          <div className="flex gap-2">
            <button
              className="flex-1 py-2 bg-black hover:bg-neutral-900 text-white rounded-md transition duration-200"
              onClick={() => {
                // Reset to allow updating the bid
                onCancelBid?.()
              }}
            >
              {updateBidText}
            </button>
            <button
              className="py-2 px-4 border border-neutral-300 hover:bg-neutral-50 rounded-md transition duration-200"
              onClick={() => {
                onCancelBid?.()
              }}
            >
              {cancelBidText}
            </button>
          </div>
        </div>
      ) : (
        // Normal slider view
        <>
          <div className="text-sm font-medium mb-2 flex justify-between items-center">
            <span>{dynamicProposeText}</span>
            <span className="text-black font-bold">{`${proposedPrice} ${currencyText}/${nightText}`}</span>
          </div>
          <div className="relative w-full">
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              step={1}
              value={proposedPrice}
              onChange={(e) => onPriceChange(Number.parseInt(e.target.value))}
              className="w-full price-slider"
              style={{
                background: `linear-gradient(to right, black 0%, black ${sliderPercentage}%, #e5e7eb ${sliderPercentage}%, #e5e7eb 100%)`,
              }}
            />
            <div className="w-full flex justify-between text-xs text-neutral-500 mt-2">
              <span>{`${minPrice} ${currencyText}/${nightText}`}</span>
              <span>{`${maxPrice} ${currencyText}/${nightText}`}</span>
            </div>
          </div>
          <button
            className="w-full mt-3 py-2 bg-black hover:bg-neutral-900 text-white rounded-md transition duration-200"
            onClick={onMakeOffer}
          >
            {makeOfferText}
          </button>
          <p className="text-xs text-neutral-500 mt-1 text-center">{availabilityText}</p>
        </>
      )}
    </div>
  )
}

export default PriceSlider
