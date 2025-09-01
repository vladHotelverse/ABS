import type React from 'react'
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
import { OptionCard } from './OptionCard'
import { ViewCard } from './ViewCard'
import { SpecialOfferCard } from './SpecialOfferCard'

export interface OptionsGridProps {
  config: SectionConfig
  options: (CustomizationOption | ViewOption | ExactViewOption | SpecialOfferOption)[]
  selectedOptions: SelectedCustomizations
  disabledOptions: DisabledOptions
  onSelect: (optionId: string) => void
  onOpenModal?: () => void
  texts: RoomCustomizationTexts
  fallbackImageUrl?: string
  mode: 'interactive' | 'consultation'
  readonly: boolean
}

// Type guards
const isExactViewOption = (option: CustomizationOption | ViewOption | ExactViewOption | SpecialOfferOption): option is ExactViewOption => {
  return 'imageUrl' in option && typeof option.imageUrl === 'string' && 'name' in option
}

const isSpecialOfferOption = (option: CustomizationOption | ViewOption | ExactViewOption | SpecialOfferOption): option is SpecialOfferOption => {
  if (!option) return false
  return 'claim' in option && 'additionalAmenities' in option
}

const OptionsGrid: React.FC<OptionsGridProps> = ({
  config,
  options,
  selectedOptions,
  disabledOptions,
  onSelect,
  onOpenModal,
  texts,
  fallbackImageUrl,
  mode,
  readonly,
}) => {
  // Add defensive checks
  if (!options || !Array.isArray(options)) {
    return <div className="text-center text-muted-foreground py-4">No options available</div>
  }

  if (!config) {
    return <div className="text-center text-muted-foreground py-4">Section configuration missing</div>
  }

  const isExactViewSection = options.length > 0 && isExactViewOption(options[0])
  const isSpecialOfferSection = options.length > 0 && isSpecialOfferOption(options[0])

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3 transition-all duration-300 -webkit-overflow-scrolling-touch pt-4">
      {options.map((option) => {
        if (!option || !option.id) {
          return null
        }
        const isSelected = selectedOptions && selectedOptions[config.key]?.id === option.id
        const isDisabled = (disabledOptions && disabledOptions[option.id]?.disabled) || false
        const disabledReason = disabledOptions && disabledOptions[option.id]?.reason

        if (isExactViewSection && isExactViewOption(option)) {
          return (
            <ViewCard
              key={option.id}
              view={option}
              isSelected={isSelected}
              isDisabled={isDisabled}
              disabledReason={disabledReason}
              onSelect={readonly ? () => {} : () => onSelect(option.id)}
              texts={texts}
              fallbackImageUrl={fallbackImageUrl}
              mode={mode}
              readonly={readonly}
            />
          )
        }
        
        if (isSpecialOfferSection && isSpecialOfferOption(option)) {
          return (
            <SpecialOfferCard
              key={option.id}
              offer={option}
              isSelected={isSelected}
              isDisabled={isDisabled}
              disabledReason={disabledReason}
              onSelect={readonly ? () => {} : () => onSelect(option.id)}
              texts={texts}
              mode={mode}
              readonly={readonly}
            />
          )
        }
        
        if (!isExactViewSection && !isSpecialOfferSection) {
          return (
            <OptionCard
              key={option.id}
              option={option as CustomizationOption}
              isSelected={isSelected}
              isDisabled={isDisabled}
              disabledReason={disabledReason}
              onSelect={readonly ? () => {} : () => onSelect(option.id)}
              texts={texts}
              fallbackImageUrl={fallbackImageUrl}
              showFeatures={config.hasFeatures}
              onShowFeatures={readonly ? undefined : onOpenModal}
              mode={mode}
              readonly={readonly}
            />
          )
        }
        
        return null
      })}
    </div>
  )
}

export default OptionsGrid