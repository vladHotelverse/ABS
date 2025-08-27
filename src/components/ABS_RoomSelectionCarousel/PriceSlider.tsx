import clsx from 'clsx'
import type React from 'react'
import { Slider } from '@/components/ui/slider'

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
  nights?: number
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
  nights: _nights = 1,
  onPriceChange,
  onMakeOffer,
  onCancelBid,
}) => {
  // Temporarily removed @use-gesture implementation to fix infinite loop
  // Will re-implement once core functionality is stable

  // Generate dynamic propose text
  const dynamicProposeText = roomName
    ? `${proposePriceText.replace(':', '')} for ${roomName}:`
    : proposePriceText

  const handlePointerEvent = (e: React.PointerEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  const handleTouchEvent = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  // Use capture phase to intercept events before they reach carousel
  const handleCaptureTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    e.nativeEvent.stopPropagation()
  }

  return (
    <div 
      className={clsx('w-full select-none', className)}
      onPointerDown={handlePointerEvent}
      onMouseDown={handlePointerEvent}
      onTouchStart={handleTouchEvent}
      onTouchStartCapture={handleCaptureTouch}
      onTouchMove={handleTouchEvent}
      onTouchMoveCapture={handleCaptureTouch}
      onTouchEnd={handleTouchEvent}
      onTouchEndCapture={handleCaptureTouch}
      onDragStart={(e) => e.preventDefault()}
      data-carousel-drag-disabled="true"
      style={{ touchAction: 'manipulation', userSelect: 'none' }}
    >
      {bidStatus === 'submitted' && submittedPrice ? (
        // Submitted bid view
        <div className="space-y-3">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm font-medium text-primary">{bidSubmittedText}</span>
              <div className="text-right">
                <div className="text-xl font-bold text-foreground">{`${submittedPrice} ${currencyText} ${nightText}`}</div>
                {/* <div className="text-xs text-blue-600 mt-1">Total: {(submittedPrice || 0) * 5} {currencyText}</div> */}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{availabilityText}</p>
          </div>
          
          <div className="flex gap-2">
            <button
              className="flex-1 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition duration-200"
              onClick={() => {
                // Reset to allow updating the bid
                onCancelBid?.()
              }}
            >
              {updateBidText}
            </button>
            <button
              className="py-2 px-4 border border-border hover:bg-muted text-foreground rounded-md transition duration-200"
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
          <div className="text-sm font-medium mb-2 flex justify-between items-start">
            <span>{dynamicProposeText}</span>
            <div className="text-right">
              <div className="text-lg md:text-xl font-bold text-foreground">{`${proposedPrice} ${currencyText} ${nightText}`}</div>
              {/* <div className="text-xs text-neutral-500 mt-1">Total: {proposedPrice * 5} {currencyText}</div> */}
            </div>
          </div>
          <div 
            className="relative w-full py-2"
            onPointerDown={handlePointerEvent}
            onMouseDown={handlePointerEvent}
            onTouchStart={handleTouchEvent}
            onTouchMove={handleTouchEvent}
            onTouchEnd={handleTouchEvent}
            onPointerMove={(e) => e.stopPropagation()}
            data-carousel-drag-disabled="true"
            style={{ touchAction: 'manipulation' }}
          >
            <Slider
              min={minPrice}
              max={maxPrice}
              step={1}
              value={[proposedPrice]}
              onValueChange={(value) => onPriceChange(value[0])}
              className="w-full transition-all"
              data-carousel-drag-disabled
            />
            <div className="w-full flex justify-between text-xs text-muted-foreground mt-2">
              <span>{`${minPrice} ${currencyText}/${nightText}`}</span>
              <span>{`${maxPrice} ${currencyText}/${nightText}`}</span>
            </div>
          </div>
          <button
            className="w-full mt-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition duration-200"
            onClick={onMakeOffer}
          >
            {makeOfferText}
          </button>
          <p className="text-xs text-muted-foreground mt-2 text-center">{availabilityText}</p>
        </>
      )}
    </div>
  )
}

export default PriceSlider
