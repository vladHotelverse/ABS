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
  onPriceChange: (price: number) => void
  onMakeOffer: () => void
}

const PriceSlider: React.FC<PriceSliderProps> = ({
  className,
  proposedPrice,
  minPrice,
  maxPrice,
  nightText = '/noche',
  makeOfferText = 'Hacer oferta',
  availabilityText = 'Sujeto a disponibilidad',
  proposePriceText = 'Propon tu precio:',
  currencyText = 'EUR',
  onPriceChange,
  onMakeOffer,
}) => {
  // Calculate slider percentage
  const sliderPercentage = ((proposedPrice - minPrice) / (maxPrice - minPrice)) * 100

  return (
    <div className={clsx('mt-1 mb-6 w-full sm:max-w-[500px] mx-auto border rounded-lg p-4', className)}>
      <div className="text-sm font-medium mb-2 flex justify-between items-center">
        <span>{proposePriceText}</span>
        <span className="text-black font-bold">{`${proposedPrice} ${currencyText}${nightText}`}</span>
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
          <span>{`${minPrice} ${currencyText}${nightText}`}</span>
          <span>{`${maxPrice} ${currencyText}${nightText}`}</span>
        </div>
      </div>
      <button
        className="w-full mt-3 py-2 bg-black hover:bg-neutral-900 text-white rounded-md transition duration-200"
        onClick={onMakeOffer}
      >
        {makeOfferText}
      </button>
      <p className="text-xs text-neutral-500 mt-1 text-center">{availabilityText}</p>
    </div>
  )
}

export default PriceSlider
