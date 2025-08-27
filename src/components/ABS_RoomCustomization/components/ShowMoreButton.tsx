import type React from 'react'
import type { RoomCustomizationTexts } from '../types'

export interface ShowMoreButtonProps {
  showAllOptions: boolean
  totalOptionsCount: number
  initialItemsCount: number
  onToggle: () => void
  texts: RoomCustomizationTexts
}

const ShowMoreButton: React.FC<ShowMoreButtonProps> = ({
  showAllOptions,
  totalOptionsCount,
  initialItemsCount,
  onToggle,
  texts,
}) => {
  const remainingCount = totalOptionsCount - initialItemsCount

  return (
    <div className="col-span-full flex justify-center pt-4">
      <button
        onClick={onToggle}
        className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 hover:bg-accent rounded-lg transition-colors duration-200 border border-border hover:border-ring"
      >
        {showAllOptions 
          ? texts.showLessText
          : `${texts.showMoreText} (${remainingCount} more)`
        }
      </button>
    </div>
  )
}

export default ShowMoreButton