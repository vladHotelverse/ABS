import { useCallback, useState } from 'react'
import type { CustomizationOption, SelectedCustomizations, ViewOption, ExactViewOption } from '../types'

interface UseCustomizationStateProps {
  initialSelections?: SelectedCustomizations
  sectionOptions: Record<string, CustomizationOption[] | ViewOption[] | ExactViewOption[]>
  onCustomizationChange?: (category: string, optionId: string, optionLabel: string, optionPrice: number) => void
}

export const useCustomizationState = ({
  initialSelections = {},
  sectionOptions,
  onCustomizationChange,
}: UseCustomizationStateProps) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedCustomizations>(initialSelections)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(Object.keys(sectionOptions).map((key) => [key, true]))
  )

  const toggleSection = useCallback((sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }, [])

  const handleSelect = useCallback(
    (category: string, optionId: string) => {
      const options = sectionOptions[category]
      const optionDetails = options?.find((o) => o.id === optionId)

      if (!optionDetails) return

      const currentSelectedId = selectedOptions[category]?.id

      if (currentSelectedId === optionId) {
        // Deselect if already selected
        const newSelectedOptions = { ...selectedOptions }
        delete newSelectedOptions[category]
        setSelectedOptions(newSelectedOptions)
        onCustomizationChange?.(category, '', '', 0)
      } else {
        // Select new option - get label from either 'label' property (ViewOption/CustomizationOption) or 'name' property (ExactViewOption)
        const optionLabel = 'label' in optionDetails ? optionDetails.label : optionDetails.name
        setSelectedOptions((prev) => ({
          ...prev,
          [category]: {
            id: optionId,
            label: optionLabel,
            price: optionDetails.price,
          },
        }))
        onCustomizationChange?.(category, optionId, optionLabel, optionDetails.price)
      }
    },
    [selectedOptions, sectionOptions, onCustomizationChange]
  )

  return {
    selectedOptions,
    openSections,
    toggleSection,
    handleSelect,
  }
}
