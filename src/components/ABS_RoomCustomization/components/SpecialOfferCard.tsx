import { Icon } from '@iconify/react'
import clsx from 'clsx'
import type React from 'react'
import type { SpecialOfferOption, RoomCustomizationTexts } from '../types'
import { AmenityIcon } from '../utils/amenityIcons'

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
        'relative bg-white rounded-lg shadow-sm border-2 transition-all duration-200',
        {
          'border-green-500 bg-green-50': isSelected,
          'border-gray-200 hover:border-gray-300': !isSelected && !isDisabled && mode !== 'consultation',
          'border-gray-100 opacity-60': isDisabled,
          'cursor-pointer': !readonly && !isDisabled && mode !== 'consultation',
          'cursor-not-allowed': isDisabled,
        }
      )}
      onClick={handleClick}
    >
      {/* Special Offer Badge */}
      <div className="absolute -top-3 left-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
        <div className="flex items-center gap-1">
          <Icon icon="solar:star-bold" className="w-3 h-3" />
          <span>{texts.specialOfferText || 'Oferta especial'}</span>
        </div>
      </div>

      <div className="p-4 pt-6">
        {/* Package Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{offer.claim}</h3>

        {/* Additional Benefits */}
        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-600 font-medium">
            {texts.additionalBenefitsText || 'Beneficios adicionales:'}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {offer.additionalAmenities.map((amenity, index) => (
              <div key={`${offer.id}-amenity-${index}`} className="flex items-center gap-2">
                <AmenityIcon amenity={amenity} className="w-5 h-5 text-gray-700 flex-shrink-0" />
                <span className="text-sm text-gray-700">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between border-t pt-3">
          <div>
            <p className="text-xs text-gray-500">{texts.upgradeForText || 'Mejora por'}</p>
            <p className="text-lg font-bold text-gray-900">
              +{offer.price.toFixed(2)}€ <span className="text-sm font-normal text-gray-600">{texts.pricePerNightText}</span>
            </p>
          </div>

          {mode !== 'consultation' && (
            <button
              className={clsx(
                'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200',
                {
                  'bg-green-600 text-white hover:bg-green-700': isSelected && !readonly,
                  'bg-gray-900 text-white hover:bg-gray-800': !isSelected && !isDisabled && !readonly,
                  'bg-gray-300 text-gray-500 cursor-not-allowed': isDisabled,
                  'bg-gray-100 text-gray-400 cursor-default': readonly,
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
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
            <div className="text-center p-4">
              <Icon icon="solar:info-circle-bold" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">{disabledReason}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}