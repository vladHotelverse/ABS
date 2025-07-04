import clsx from 'clsx'
import { Check } from 'lucide-react'
import type { RoomCustomizationTexts, ExactViewOption } from '../types'

interface ViewCardProps {
  view: ExactViewOption
  isSelected: boolean
  onSelect: () => void
  texts: RoomCustomizationTexts
  fallbackImageUrl?: string
}

export const ViewCard: React.FC<ViewCardProps> = ({
  view,
  isSelected,
  onSelect,
  texts,
  fallbackImageUrl = 'https://picsum.photos/600/400',
}) => {
  return (
    <div className="flex-none w-[85vw] sm:w-auto border border-neutral-200 rounded-lg overflow-hidden snap-center mx-2 sm:mx-0">
      <div className="relative">
        <img
          src={view.imageUrl || fallbackImageUrl}
          alt={`Room view option - ${view.name}`}
          className="w-full h-56 object-cover"
        />

        <div className="absolute bottom-0 left-10 right-10 py-2 text-center">
          <button
            onClick={onSelect}
            className={clsx('text-xs font-medium mb-4 p-3 rounded shadow transition-all duration-300', {
              'bg-red-500 text-white hover:bg-red-600': isSelected,
              'bg-white hover:bg-neutral-100 hover:translate-y-[-2px] hover:shadow-md': !isSelected,
            })}
          >
            {isSelected 
              ? texts.removeText 
              : `${texts.addForPriceText} ${view.price.toFixed(2)} EUR`}
          </button>
        </div>

        {/* Removed the label/name display from the image */}
        {isSelected && (
          <div className="absolute top-2 left-2 text-white text-xs px-2 py-1 rounded flex items-center gap-1 bg-green-600/90">
            <Check className="h-3 w-3" />
            Selected
          </div>
        )}
      </div>
    </div>
  )
}
