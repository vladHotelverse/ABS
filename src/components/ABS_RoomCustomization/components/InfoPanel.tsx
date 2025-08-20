import type React from 'react'
import { Icon } from '@iconify/react'

export interface InfoPanelProps {
  infoText: string
  showInfo: boolean
  onClose: () => void
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  infoText,
  showInfo,
  onClose,
}) => {
  if (!showInfo) return null

  return (
    <div className="transition-all duration-300 ease-in-out col-span-full pt-4">
      <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700 flex justify-between items-start">
        {infoText}
        <button
          onClick={onClose}
          className="ml-4 p-1 rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Icon icon="solar:close-circle-bold" className="h-4 w-4 text-blue-700" />
        </button>
      </div>
    </div>
  )
}

export default InfoPanel