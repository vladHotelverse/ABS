import { UiButton } from '@/components/ui/button'
import type { CustomizationOption, RoomCustomizationTexts } from '../types'
import { IconRenderer } from './IconRenderer'

interface OptionCardProps {
  option: CustomizationOption
  isSelected: boolean
  onSelect: () => void
  texts: RoomCustomizationTexts
  fallbackImageUrl?: string
  showFeatures?: boolean
  onShowFeatures?: () => void
}

export const OptionCard: React.FC<OptionCardProps> = ({
  option,
  isSelected,
  onSelect,
  texts,
  fallbackImageUrl,
  showFeatures = false,
  onShowFeatures,
}) => {
  return (
    <div className="flex-none sm:w-auto h-full bg-white border border-neutral-300 rounded-lg overflow-hidden snap-center ">
      <div className="p-4 flex flex-col h-full">
        <div className="flex flex-col mb-1">
          <div className="flex gap-2.5 items-center w-20">
            <div className="flex items-center justify-center w-10 h-10">
              <IconRenderer iconName={option.icon} fallbackImageUrl={fallbackImageUrl} />
            </div>
          </div>
          <h3 className="font-medium text-sm">{option.label}</h3>
        </div>
        {option.description && <p className="text-xs text-neutral-500 mb-1">{option.description}</p>}
        <p className="text-sm font-semibold mb-4">
          {option.price.toFixed(2)} {texts.pricePerNightText}
        </p>

        <div className="flex flex-col space-y-2 mt-auto">
          <UiButton onClick={onSelect} variant={isSelected ? 'link' : 'secondary'} size="sm" className="w-full">
            {isSelected ? texts.removeText : texts.improveText}
          </UiButton>

          {showFeatures && onShowFeatures && (
            <UiButton
              onClick={(e) => {
                e.stopPropagation()
                onShowFeatures()
              }}
              variant="link"
              size="sm"
            >
              {texts.featuresText}
            </UiButton>
          )}
        </div>
      </div>
    </div>
  )
}
