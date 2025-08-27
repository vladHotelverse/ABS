import { Icon } from '@iconify/react'
import clsx from 'clsx'
import type React from 'react'
import { useMemo } from 'react'
import type { SpecialOfferOption, RoomCustomizationTexts } from '../types'
import { AmenityIcon } from '../utils/amenityIcons'
import { selectBestAmenities, getCurrentRoomAmenities } from '../../ABS_RoomSelectionCarousel/utils/amenitiesSelector'

interface SpecialOfferCardProps {
  offer: SpecialOfferOption
  isSelected: boolean
  isDisabled: boolean
  disabledReason?: string
  onSelect: (offerId: string) => void
  texts: RoomCustomizationTexts
  mode?: 'interactive' | 'consultation'
  readonly?: boolean
}

export const SpecialOfferCard: React.FC<SpecialOfferCardProps> = ({
  offer,
  isSelected,
  isDisabled,
  disabledReason,
  onSelect,
  texts,
  mode = 'interactive',
  readonly = false,
}) => {
  // Calculate the best 3 amenities using the same logic as room carousel
  const dynamicAmenities = useMemo(() => {
    if (!offer.roomAmenities || !offer.roomType) {
      return (offer.roomAmenities || offer.additionalAmenities).slice(0, 3)
    }

    // Create a room-like object for the amenity selector
    const roomForSelection = {
      id: offer.targetRoomId || offer.id,
      roomType: offer.roomType,
      amenities: offer.roomAmenities,
      title: offer.roomTitle,
      price: offer.roomPrice || offer.price,
      description: '',
      images: []
    }

    // Get current room amenities (assuming DELUXE SILVER as base)
    const currentRoomAmenities = getCurrentRoomAmenities('DELUXE SILVER', [roomForSelection])
    
    // Select the best 3 amenities using the same logic as room carousel
    return selectBestAmenities(
      roomForSelection,
      'DELUXE SILVER',
      currentRoomAmenities
    )
  }, [offer])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!readonly && !isDisabled && mode !== 'consultation') {
      onSelect(offer.id)
    }
  }

  return (
    <div
      className={clsx(
        'relative bg-card rounded-lg shadow-sm border-2 transition-all duration-200',
        {
          'border-primary bg-primary/10': isSelected,
          'border-border hover:border-ring': !isSelected && !isDisabled && mode !== 'consultation',
          'border-muted opacity-60': isDisabled,
          'cursor-pointer': !readonly && !isDisabled && mode !== 'consultation',
          'cursor-not-allowed': isDisabled,
        }
      )}
      onClick={handleClick}
    >
      {/* Special Offer Badge */}
      <div className="absolute -top-3 left-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-md">
        <div className="flex items-center gap-1">
          <Icon icon="solar:star-bold" className="w-3 h-3" />
          <span>{texts.specialOfferText || 'Oferta especial'}</span>
        </div>
      </div>

      <div className="p-4 pt-6">
        {/* Room Title Only */}
        <div className="mb-3">
          {offer.roomTitle && (
            <h3 className="text-lg font-semibold text-card-foreground mb-3">{offer.roomTitle}</h3>
          )}
        </div>

        {/* Room Amenities - Top 3 Most Relevant */}
        <div className="space-y-2 mb-4">
          <p className="text-sm text-muted-foreground font-medium">
            {texts.additionalBenefitsText || 'Amenidades incluidas:'}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {dynamicAmenities.map((amenity, index) => (
              <div key={`${offer.id}-amenity-${index}`} className="flex items-center gap-2">
                <AmenityIcon amenity={amenity} className="w-5 h-5 text-card-foreground flex-shrink-0" />
                <span className="text-sm text-card-foreground">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between border-t pt-3">
          <div>
            <p className="text-xs text-muted-foreground">{texts.upgradeForText || 'Mejora por'}</p>
            <p className="text-lg font-bold text-card-foreground">
              +{(offer.roomPrice || offer.price).toFixed(2)}€ <span className="text-sm font-normal text-muted-foreground">{texts.pricePerNightText}</span>
            </p>
          </div>

          {mode !== 'consultation' && (
            <button
              className={clsx(
                'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200',
                {
                  'bg-primary text-primary-foreground hover:bg-primary/90': (isSelected || (!isSelected && !isDisabled)) && !readonly,
                  'bg-muted text-muted-foreground cursor-not-allowed': isDisabled,
                  'bg-muted text-muted-foreground cursor-default': readonly,
                }
              )}
              disabled={isDisabled || readonly}
              onClick={handleClick}
            >
              {isSelected ? texts.selectedText : texts.selectText}
            </button>
          )}
        </div>

        {/* Disabled Reason Tooltip */}
        {isDisabled && disabledReason && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/90 backdrop-blur rounded-lg">
            <div className="text-center p-4">
              <Icon icon="solar:info-circle-bold" className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{disabledReason}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}