import type React from 'react'
import { useState, useEffect } from 'react'
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
  const [initialItemsCount, setInitialItemsCount] = useState(3)
  
  // Responsive logic for initial items count
  useEffect(() => {
    const updateItemsCount = () => {
      const width = window.innerWidth
      // Show 2 items on screens between 1024px and 1535px (lg to before 2xl)
      // Show 3 items on very large screens (2xl+)
      if (width >= 1536) {
        setInitialItemsCount(3) // 2xl and above
      } else if (width >= 640) {
        setInitialItemsCount(2) // sm to xl (including 1024px)
      } else {
        setInitialItemsCount(1) // mobile
      }
    }

    updateItemsCount()
    window.addEventListener('resize', updateItemsCount)
    return () => window.removeEventListener('resize', updateItemsCount)
  }, [])
  
  // Filter options based on mode with defensive checks
  const filteredOptions = mode === 'consultation' 
    ? (selectedOptions && selectedOptions[config.key]) 
      ? (options || []).filter(option => option && option.id === selectedOptions[config.key]?.id)
      : []
    : (options || [])
  const shouldShowMoreButton = mode !== 'consultation' && filteredOptions.length > initialItemsCount
  const displayOptions = (mode === 'consultation' || showAllOptions) ? filteredOptions : filteredOptions.slice(0, initialItemsCount)

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
              initialItemsCount={initialItemsCount}
              onToggle={handleShowMoreToggle}
              texts={texts}
            />
          )}
        </div>
      )}
    </div>
  )
}
