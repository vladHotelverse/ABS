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
  SpecialOfferOption,
} from '../types'

// Import subcomponents
import SectionHeader from './SectionHeader'
import InfoPanel from './InfoPanel'
import OptionsGrid from './OptionsGrid'
import ShowMoreButton from './ShowMoreButton'

interface CustomizationSectionProps {
  config: SectionConfig
  options: CustomizationOption[] | ViewOption[] | ExactViewOption[] | SpecialOfferOption[]
  selectedOptions: SelectedCustomizations
  disabledOptions: DisabledOptions
  isOpen: boolean
  onToggle: () => void
  onSelect: (optionId: string) => void
  onOpenModal?: () => void
  texts: RoomCustomizationTexts
  fallbackImageUrl?: string
  mode?: 'interactive' | 'consultation'
  readonly?: boolean
}

// Type guard functions moved to OptionsGrid component

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
  mode = 'interactive',
  readonly = false,
}) => {
  const [showInfo, setShowInfo] = useState(false)
  const [showAllOptions, setShowAllOptions] = useState(false)
  
  // Filter options based on mode
  const filteredOptions = mode === 'consultation' 
    ? selectedOptions[config.key] 
      ? options.filter(option => option.id === selectedOptions[config.key]?.id)
      : []
    : options.filter(option => !disabledOptions[option.id]?.disabled)
  const INITIAL_ITEMS_COUNT = 3
  const shouldShowMoreButton = mode !== 'consultation' && filteredOptions.length > INITIAL_ITEMS_COUNT
  const displayOptions = (mode === 'consultation' || showAllOptions) ? filteredOptions : filteredOptions.slice(0, INITIAL_ITEMS_COUNT)

  const handleInfoToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowInfo(!showInfo)
  }

  const handleShowMoreToggle = () => {
    setShowAllOptions(!showAllOptions)
  }

  return (
    <div className="mb-6 bg-white rounded overflow-hidden">
      <SectionHeader
        config={config}
        isOpen={isOpen}
        mode={mode}
        onToggle={onToggle}
        onInfoToggle={handleInfoToggle}
      />

      {(isOpen || mode === 'consultation') && (
        <div>
          {config.infoText && (
            <InfoPanel
              infoText={config.infoText}
              showInfo={showInfo}
              onClose={() => setShowInfo(false)}
            />
          )}

          <OptionsGrid
            config={config}
            options={displayOptions}
            selectedOptions={selectedOptions}
            disabledOptions={disabledOptions}
            onSelect={onSelect}
            onOpenModal={onOpenModal}
            texts={texts}
            fallbackImageUrl={fallbackImageUrl}
            mode={mode}
            readonly={readonly}
          />
          
          {/* Show More/Less Button */}
          {shouldShowMoreButton && (
            <ShowMoreButton
              showAllOptions={showAllOptions}
              totalOptionsCount={filteredOptions.length}
              initialItemsCount={INITIAL_ITEMS_COUNT}
              onToggle={handleShowMoreToggle}
              texts={texts}
            />
          )}
        </div>
      )}
    </div>
  )
}
