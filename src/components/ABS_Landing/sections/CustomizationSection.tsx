import type React from 'react'
import RoomCustomization from '../../ABS_RoomCustomization'
import type {
  CustomizationOption,
  RoomCustomizationTexts,
  SectionConfig,
  SelectedCustomizations,
  ViewOption,
  ExactViewOption,
} from '../../ABS_RoomCustomization/types'

export interface CustomizationTexts extends RoomCustomizationTexts {
  customizeTitle: string
  customizeSubtitle: string
}

export interface CustomizationSectionProps {
  sections: SectionConfig[]
  sectionOptions: Record<string, CustomizationOption[] | ViewOption[] | ExactViewOption[]>
  selectedCustomizations: SelectedCustomizations
  onCustomizationChange: (category: string, optionId: string, optionLabel: string, optionPrice: number) => void
  texts: CustomizationTexts
  fallbackImageUrl?: string
  className?: string
  isVisible?: boolean
}

export const CustomizationSection: React.FC<CustomizationSectionProps> = ({
  sections,
  sectionOptions,
  selectedCustomizations,
  onCustomizationChange,
  texts,
  fallbackImageUrl,
  className = '',
  isVisible = true,
}) => {
  if (!isVisible || sections.length === 0) {
    return null
  }

  return (
    <section className={`bg-white p-4 md:p-6 rounded-lg shadow border border-neutral-300 ${className}`}>
      <h2 className="text-2xl font-bold mb-4">{texts.customizeTitle}</h2>
      <p className="mb-6">{texts.customizeSubtitle}</p>
      <RoomCustomization
        title={texts.customizeTitle}
        subtitle={texts.customizeSubtitle}
        sections={sections}
        sectionOptions={sectionOptions}
        initialSelections={selectedCustomizations}
        onCustomizationChange={onCustomizationChange}
        texts={texts}
        fallbackImageUrl={fallbackImageUrl}
      />
    </section>
  )
}

export default CustomizationSection
