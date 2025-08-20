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
        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200 border border-blue-200 hover:border-blue-300"
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