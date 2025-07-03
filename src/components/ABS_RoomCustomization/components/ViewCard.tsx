import clsx from 'clsx'
import type { RoomCustomizationTexts, ViewOption } from '../types'

interface ViewCardProps {
  view: ViewOption
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
          alt={`Room view option - ${view.label}`}
          className="w-full h-56 object-cover"
        />

        <div className="absolute bottom-0 left-10 right-10 py-2 text-center">
          <button
            onClick={onSelect}
            className={clsx('text-xs font-medium mb-4 p-3 rounded shadow transition-all duration-300', {
              'bg-white/90 ring-2 ring-neutral-400/10 ring-offset-2': isSelected,
              'bg-white hover:bg-neutral-100 hover:translate-y-[-2px] hover:shadow-md': !isSelected,
            })}
          >
            {isSelected ? texts.selectedText : texts.improveText}
          </button>
        </div>

        <div className="absolute top-2 left-2 bg-neutral-800/70 text-white text-xs px-2 py-1 rounded">{view.label}</div>
      </div>
    </div>
  )
}
