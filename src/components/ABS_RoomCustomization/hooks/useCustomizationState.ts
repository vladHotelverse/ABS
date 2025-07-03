import { useCallback, useState } from 'react'
import type { CustomizationOption, SelectedCustomizations, ViewOption } from '../types'

interface UseCustomizationStateProps {
  initialSelections?: SelectedCustomizations
  sectionOptions: Record<string, CustomizationOption[] | ViewOption[]>
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
        // Select new option
        setSelectedOptions((prev) => ({
          ...prev,
          [category]: {
            id: optionId,
            label: optionDetails.label,
            price: optionDetails.price,
          },
        }))
        onCustomizationChange?.(category, optionId, optionDetails.label, optionDetails.price)
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
