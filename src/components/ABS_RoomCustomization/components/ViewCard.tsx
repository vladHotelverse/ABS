import clsx from 'clsx'
import { Icon } from '@iconify/react'
import { useState } from 'react'
import { UiTooltip, UiTooltipContent, TooltipProvider, UiTooltipTrigger } from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import type { RoomCustomizationTexts, ExactViewOption } from '../types'
import { UiButton } from '@/components/ui/button'

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
  const [isZoomed, setIsZoomed] = useState(false)

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
        <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
          <DialogTrigger asChild>
            <button
              type="button"
              disabled={isDisabled}
              className={clsx(
                'w-full h-56 block relative',
                !isDisabled && 'cursor-zoom-in'
              )}
              aria-label="View larger image"
            >
              <img
                src={view.imageUrl || fallbackImageUrl}
                alt={`Room view option - ${view.name}`}
                className={clsx(
                  'w-full h-full object-cover',
                  { 'filter grayscale': isDisabled }
                )}
              />
              {/* Zoom icon as visual cue */}
              {!isDisabled && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full">
                  <Icon icon="lucide:expand" className="h-5 w-5" />
                </div>
              )}
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl p-0 z-[101]">
            <img
              src={view.imageUrl || fallbackImageUrl}
              alt={`Enlarged view of ${view.name}`}
              className="w-full h-auto rounded-lg"
            />
          </DialogContent>
        </Dialog>

        {/* Disabled overlay */}
        {isDisabled && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center pointer-events-none">
            <div className="bg-white bg-opacity-90 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700">
              {texts.optionDisabledText}
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-10 right-10 py-2 text-center">
          <UiButton
            onClick={handleClick}
            disabled={isDisabled}
            variant={isSelected ? 'destructive' : 'outline'}
            size="xs"
            className={clsx('mb-4 p-3 shadow transition-all duration-300', {
              'hover:translate-y-[-2px] hover:shadow-md': !isSelected && !isDisabled,
            })}
          >
            {isSelected 
              ? texts.removeText 
              : isDisabled 
                ? texts.optionDisabledText
                : `${texts.addForPriceText} ${view.price.toFixed(2)} EUR`}
          </UiButton>
        </div>

        {/* Selected indicator */}
        {isSelected && !isDisabled && (
          <div className="absolute top-2 left-2 text-white text-xs px-2 py-1 rounded flex items-center gap-1 bg-green-600/90">
            <Icon icon="solar:check-circle-bold" className="h-3 w-3" />
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
