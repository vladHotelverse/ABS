import { UiButton } from '@/components/ui/button'
import { UiTooltip, UiTooltipContent, TooltipProvider, UiTooltipTrigger } from '@/components/ui/tooltip'
import clsx from 'clsx'
import type { CustomizationOption, RoomCustomizationTexts } from '../types'
import { IconRenderer } from './IconRenderer'

interface OptionCardProps {
  option: CustomizationOption
  isSelected: boolean
  isDisabled?: boolean
  disabledReason?: string
  onSelect: () => void
  texts: RoomCustomizationTexts
  fallbackImageUrl?: string
  showFeatures?: boolean
  onShowFeatures?: () => void
}

export const OptionCard: React.FC<OptionCardProps> = ({
  option,
  isSelected,
  isDisabled = false,
  disabledReason,
  onSelect,
  texts,
  fallbackImageUrl,
  showFeatures = false,
  onShowFeatures,
}) => {
  const handleClick = () => {
    if (isDisabled) return
    onSelect()
  }

  const cardContent = (
    <div className={clsx(
      'flex-none sm:w-auto h-full bg-white border border-neutral-300 rounded-lg overflow-hidden snap-center transition-all duration-200',
      {
        'opacity-50 cursor-not-allowed': isDisabled,
        'hover:shadow-md': !isDisabled,
      }
    )}>
      <div className="p-4 flex flex-col h-full">
        <div className="flex flex-col mb-1">
          <div className="flex gap-2.5 items-center w-20">
            <div className={clsx(
              "flex items-center justify-center w-10 h-10",
              {
                'text-neutral-400': isDisabled,
              }
            )}>
              <IconRenderer iconName={option.icon} fallbackImageUrl={fallbackImageUrl} />
            </div>
          </div>
          <h3 className={clsx(
            "font-medium text-sm",
            {
              'text-neutral-400': isDisabled,
            }
          )}>
            {option.label}
          </h3>
        </div>
        {option.description && (
          <p className={clsx(
            "text-xs mb-1",
            {
              'text-neutral-300': isDisabled,
              'text-neutral-500': !isDisabled,
            }
          )}>
            {option.description}
          </p>
        )}
        <p className={clsx(
          "text-sm font-semibold mb-4",
          {
            'text-neutral-400': isDisabled,
          }
        )}>
          {option.price.toFixed(2)} {texts.pricePerNightText}
        </p>

        <div className="flex flex-col space-y-2 mt-auto">
          <UiButton 
            onClick={handleClick} 
            variant={isSelected ? 'link' : 'secondary'} 
            size="sm" 
            className="w-full hover:bg-black hover:text-white transition-all border"
            disabled={isDisabled}
          >
            {isSelected 
              ? texts.removeText 
              : isDisabled 
                ? texts.optionDisabledText
                : `${texts.addForPriceText} ${option.price.toFixed(2)} EUR`}
          </UiButton>

          {showFeatures && onShowFeatures && (
            <UiButton
              onClick={(e) => {
                e.stopPropagation()
                if (!isDisabled) onShowFeatures()
              }}
              variant="link"
              size="sm"
              disabled={isDisabled}
            >
              {texts.featuresText}
            </UiButton>
          )}
        </div>
      </div>
    </div>
  )

  if (isDisabled && disabledReason) {
    return (
      <TooltipProvider>
        <UiTooltip>
          <UiTooltipTrigger asChild>
            {cardContent}
          </UiTooltipTrigger>
          <UiTooltipContent>
            <p>{disabledReason}</p>
          </UiTooltipContent>
        </UiTooltip>
      </TooltipProvider>
    )
  }

  return cardContent
}
