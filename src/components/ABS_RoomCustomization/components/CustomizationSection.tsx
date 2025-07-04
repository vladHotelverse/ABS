import { InfoIcon, Minus, Plus, X } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import type {
  CustomizationOption,
  RoomCustomizationTexts,
  SectionConfig,
  SelectedCustomizations,
  ViewOption,
  ExactViewOption,
  DisabledOptions,
} from '../types'
import { OptionCard } from './OptionCard'
import { ViewCard } from './ViewCard'

interface CustomizationSectionProps {
  config: SectionConfig
  options: CustomizationOption[] | ViewOption[] | ExactViewOption[]
  selectedOptions: SelectedCustomizations
  disabledOptions: DisabledOptions
  isOpen: boolean
  onToggle: () => void
  onSelect: (optionId: string) => void
  onOpenModal?: () => void
  texts: RoomCustomizationTexts
  fallbackImageUrl?: string
}

const isExactViewOption = (option: CustomizationOption | ViewOption | ExactViewOption): option is ExactViewOption => {
  return 'imageUrl' in option && typeof option.imageUrl === 'string'
}

export const CustomizationSection: React.FC<CustomizationSectionProps> = ({
  config,
  options,
  selectedOptions,
  disabledOptions,
  isOpen,
  onToggle,
  onSelect,
  onOpenModal,
  texts,
  fallbackImageUrl,
}) => {
  const [showInfo, setShowInfo] = useState(false)
  const isExactViewSection = options.length > 0 && isExactViewOption(options[0])

  const handleInfoToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowInfo(!showInfo)
  }

  return (
    <div className="mb-6 bg-white rounded overflow-hidden">
      <div className="flex justify-between items-center py-3 border-b cursor-pointer" onClick={onToggle}>
        <div className="flex items-center">
          <h2 className="text-xl font-semibold">{config.title}</h2>
          {config.infoText && (
            <button onClick={handleInfoToggle} className="ml-2 text-neutral-500 hover:text-neutral-700">
              <InfoIcon className="h-5 w-5" data-testid="info-icon" />
            </button>
          )}
        </div>
        <button className="text-neutral-400">
          {isOpen ? (
            <Minus className="h-6 w-6" data-testid="minus-icon" />
          ) : (
            <Plus className="h-6 w-6" data-testid="plus-icon" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-300 -webkit-overflow-scrolling-touch pt-4">
          {config.infoText && showInfo && (
            <div className="transition-all duration-300 ease-in-out col-span-full pt-4">
              <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700 flex justify-between items-start">
                {config.infoText}
                <button
                  onClick={() => setShowInfo(false)}
                  className="ml-4 p-1 rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <X className="h-4 w-4 text-blue-700" />
                </button>
              </div>
            </div>
          )}

          {options.map((option) => {
            const isSelected = selectedOptions[config.key]?.id === option.id
            const isDisabled = disabledOptions[option.id]?.disabled || false
            const disabledReason = disabledOptions[option.id]?.reason

            if (isExactViewSection && isExactViewOption(option)) {
              return (
                <ViewCard
                  key={option.id}
                  view={option}
                  isSelected={isSelected}
                  isDisabled={isDisabled}
                  disabledReason={disabledReason}
                  onSelect={() => onSelect(option.id)}
                  texts={texts}
                  fallbackImageUrl={fallbackImageUrl}
                />
              )
            }
            if (!isExactViewSection) {
              return (
                <OptionCard
                  key={option.id}
                  option={option as CustomizationOption}
                  isSelected={isSelected}
                  isDisabled={isDisabled}
                  disabledReason={disabledReason}
                  onSelect={() => onSelect(option.id)}
                  texts={texts}
                  fallbackImageUrl={fallbackImageUrl}
                  showFeatures={config.hasFeatures}
                  onShowFeatures={onOpenModal}
                />
              )
            }
            return null
          })}
        </div>
      )}
    </div>
  )
}
