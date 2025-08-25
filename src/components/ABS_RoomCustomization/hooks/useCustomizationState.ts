import { useCallback, useState, useMemo, useEffect } from 'react'
import type { 
  CustomizationOption, 
  SelectedCustomizations, 
  ViewOption, 
  ExactViewOption,
  SpecialOfferOption,
  CompatibilityRules
} from '../types'
import { CompatibilityEngine, defaultCompatibilityRules } from '../compatibilityRules'

interface UseCustomizationStateProps {
  initialSelections?: SelectedCustomizations
  sectionOptions: Record<string, CustomizationOption[] | ViewOption[] | ExactViewOption[] | SpecialOfferOption[]>
  onCustomizationChange?: (category: string, optionId: string, optionLabel: string, optionPrice: number) => void
  compatibilityRules?: CompatibilityRules
}

export const useCustomizationState = ({
  initialSelections = {},
  sectionOptions,
  onCustomizationChange,
  compatibilityRules = defaultCompatibilityRules,
}: UseCustomizationStateProps) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedCustomizations>(initialSelections)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(Object.keys(sectionOptions).map((key) => [key, true]))
  )

  // Sync internal state when initialSelections changes (e.g., when removed from pricing panel)
  useEffect(() => {
    setSelectedOptions(initialSelections)
  }, [initialSelections])

  // Initialize compatibility engine
  const compatibilityEngine = useMemo(() => new CompatibilityEngine(compatibilityRules), [compatibilityRules])

  // Calculate disabled options based on current selections
  const disabledOptions = useMemo(() => 
    compatibilityEngine.evaluateDisabledOptions(selectedOptions), 
    [compatibilityEngine, selectedOptions]
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
        return
      }

      // Check if option is disabled
      if (disabledOptions[optionId]?.disabled) {
        console.warn(`Option ${optionId} is disabled: ${disabledOptions[optionId].reason}`)
        return
      }

      // Proceed with selection - disabled options are handled by UI
      selectOption(category, optionId, optionDetails)
    },
    [selectedOptions, sectionOptions, onCustomizationChange, disabledOptions, compatibilityEngine]
  )

  const selectOption = useCallback((category: string, optionId: string, optionDetails: any) => {
    // For special offers, prefer roomTitle over claim
    const optionLabel = category === 'specialOffers' && 'roomTitle' in optionDetails ? optionDetails.roomTitle :
                       'label' in optionDetails ? optionDetails.label : 
                       'name' in optionDetails ? optionDetails.name : 
                       'claim' in optionDetails ? optionDetails.claim : 
                       optionId
    setSelectedOptions((prev) => ({
      ...prev,
      [category]: {
        id: optionId,
        label: optionLabel,
        price: optionDetails.price,
      },
    }))
    onCustomizationChange?.(category, optionId, optionLabel, optionDetails.price)
  }, [onCustomizationChange])


  const isOptionDisabled = useCallback(
    (optionId: string): boolean => {
      return disabledOptions[optionId]?.disabled || false
    },
    [disabledOptions]
  )

  const getDisabledReason = useCallback(
    (optionId: string): string | null => {
      return disabledOptions[optionId]?.reason || null
    },
    [disabledOptions]
  )

  const getConflictingOptions = useCallback(
    (optionId: string): string[] => {
      return disabledOptions[optionId]?.conflictsWith || []
    },
    [disabledOptions]
  )

  return {
    selectedOptions,
    openSections,
    disabledOptions,
    toggleSection,
    handleSelect,
    isOptionDisabled,
    getDisabledReason,
    getConflictingOptions,
  }
}
