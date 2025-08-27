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
      <div className="rounded-lg bg-accent p-3 text-sm text-accent-foreground flex justify-between items-start">
        {infoText}
        <button
          onClick={onClose}
          className="ml-4 p-1 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <Icon icon="solar:close-circle-bold" className="h-4 w-4 text-accent-foreground" />
        </button>
      </div>
    </div>
  )
}

export default InfoPanel