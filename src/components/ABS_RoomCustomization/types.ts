export interface CustomizationOption {
  id: string
  icon?: string
  label: string
  description?: string
  price: number
}

export interface ViewOption {
  id: string
  label: string
  description?: string
  price: number
  imageUrl?: string
}

export interface SelectedCustomizations {
  [key: string]: { id: string; label: string; price: number } | undefined
}

export interface SectionConfig {
  key: string
  title: string
  icon?: React.ComponentType<{ className?: string }>
  infoText?: string
  hasModal?: boolean
  hasFeatures?: boolean
}

export interface RoomCustomizationTexts {
  improveText: string
  selectedText: string
  selectText: string
  pricePerNightText: string
  featuresText: string
  understood: string
  addForPriceText: string
  availableOptionsText: string
  removeText: string
}

export interface RoomCustomizationProps {
  className?: string
  id?: string
  title: string
  subtitle: string
  sections: SectionConfig[]
  sectionOptions: Record<string, CustomizationOption[] | ViewOption[]>
  initialSelections?: SelectedCustomizations
  onCustomizationChange?: (category: string, optionId: string, optionLabel: string, optionPrice: number) => void
  texts: RoomCustomizationTexts
  fallbackImageUrl?: string
}
