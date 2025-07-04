import clsx from 'clsx'
import { Check } from 'lucide-react'
import { UiTooltip, UiTooltipContent, TooltipProvider, UiTooltipTrigger } from '@/components/ui/tooltip'
import type { RoomCustomizationTexts, ExactViewOption } from '../types'

interface ViewCardProps {
  view: ExactViewOption
  isSelected: boolean
  isDisabled?: boolean
  disabledReason?: string
  onSelect: () => void
  texts: RoomCustomizationTexts
  fallbackImageUrl?: string
}

export const ViewCard: React.FC<ViewCardProps> = ({
  view,
  isSelected,
  isDisabled = false,
  disabledReason,
  onSelect,
  texts,
  fallbackImageUrl = 'https://picsum.photos/600/400',
}) => {
  const handleClick = () => {
    if (isDisabled) return
    onSelect()
  }

  const cardContent = (
    <div className={clsx(
      'flex-none w-[85vw] sm:w-auto border border-neutral-200 rounded-lg overflow-hidden snap-center mx-2 sm:mx-0 transition-all duration-200',
      {
        'opacity-50 cursor-not-allowed': isDisabled,
        'hover:shadow-md': !isDisabled,
      }
    )}>
      <div className="relative">
        <img
          src={view.imageUrl || fallbackImageUrl}
          alt={`Room view option - ${view.name}`}
          className={clsx(
            'w-full h-56 object-cover',
            {
              'filter grayscale': isDisabled,
            }
          )}
        />

        {/* Disabled overlay */}
        {isDisabled && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white bg-opacity-90 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700">
              {texts.optionDisabledText}
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-10 right-10 py-2 text-center">
          <button
            onClick={handleClick}
            disabled={isDisabled}
            className={clsx('text-xs font-medium mb-4 p-3 rounded shadow transition-all duration-300', {
              'bg-red-500 text-white hover:bg-red-600': isSelected && !isDisabled,
              'bg-white hover:bg-neutral-100 hover:translate-y-[-2px] hover:shadow-md': !isSelected && !isDisabled,
              'bg-neutral-300 text-neutral-500 cursor-not-allowed': isDisabled,
            })}
          >
            {isSelected 
              ? texts.removeText 
              : isDisabled 
                ? texts.optionDisabledText
                : `${texts.addForPriceText} ${view.price.toFixed(2)} EUR`}
          </button>
        </div>

        {/* Selected indicator */}
        {isSelected && !isDisabled && (
          <div className="absolute top-2 left-2 text-white text-xs px-2 py-1 rounded flex items-center gap-1 bg-green-600/90">
            <Check className="h-3 w-3" />
            Selected
          </div>
        )}
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
