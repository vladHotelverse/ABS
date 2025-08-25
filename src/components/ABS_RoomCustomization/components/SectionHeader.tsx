import type React from 'react'
import clsx from 'clsx'
import { Icon } from '@iconify/react'
import type { SectionConfig } from '../types'

export interface SectionHeaderProps {
  config: SectionConfig
  isOpen: boolean
  mode: 'interactive' | 'consultation'
  onToggle: () => void
  onInfoToggle: (e: React.MouseEvent) => void
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  config,
  isOpen,
  mode,
  onToggle,
  onInfoToggle,
}) => {
  return (
    <div 
      className={clsx(
        "flex justify-between items-center py-3 border-b-2 border-neutral-200",
        mode !== 'consultation' && "cursor-pointer"
      )} 
      onClick={mode !== 'consultation' ? onToggle : undefined}
    >
      <div className="flex items-center">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-medium sm:font-semibold">{config.title}</h2>
        {config.infoText && mode !== 'consultation' && (
          <button onClick={onInfoToggle} className="ml-2 text-neutral-500 hover:text-neutral-700">
            <Icon icon="solar:info-circle-bold" className="h-5 w-5" data-testid="info-icon" />
          </button>
        )}
      </div>
      {mode !== 'consultation' && (
        <button className="text-neutral-400">
          {isOpen ? (
            <Icon icon="solar:alt-arrow-up-bold" className="h-6 w-6" data-testid="minus-icon" />
          ) : (
            <Icon icon="solar:alt-arrow-down-bold" className="h-6 w-6" data-testid="plus-icon" />
          )}
        </button>
      )}
    </div>
  )
}

export default SectionHeader