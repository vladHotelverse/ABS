import { useCallback, useState, useMemo, useEffect, useRef } from 'react'
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

  // Performance: Use refs for stable references to avoid unnecessary re-renders
  const sectionOptionsRef = useRef(sectionOptions)
  const onCustomizationChangeRef = useRef(onCustomizationChange)
  
  // Update refs when values change but don't trigger re-renders
  sectionOptionsRef.current = sectionOptions
  onCustomizationChangeRef.current = onCustomizationChange

  // Sync internal state when initialSelections changes (e.g., when removed from pricing panel)
  useEffect(() => {
    setSelectedOptions(initialSelections)
  }, [initialSelections])

  // Performance: Memoize compatibility engine with stable reference
  // Only recreate when compatibilityRules actually change (deep comparison not needed
  // since CompatibilityEngine is immutable after creation)
  const compatibilityEngine = useMemo(() => new CompatibilityEngine(compatibilityRules), [compatibilityRules])

  // Performance: Calculate disabled options based on current selections
  // Only recalculate when selectedOptions or compatibilityEngine changes
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


  // Performance: Optimized handleSelect function with reduced dependencies
  // Split into smaller, focused functions to minimize re-renders
  const handleSelect = useCallback(
    (category: string, optionId: string) => {
      const options = sectionOptionsRef.current[category]
      const optionDetails = options?.find((o) => o.id === optionId)

      if (!optionDetails) return

      // Check current selection using the latest state
      setSelectedOptions((currentSelectedOptions) => {
        const currentSelectedId = currentSelectedOptions[category]?.id

        if (currentSelectedId === optionId) {
          // Deselect if already selected
          const newSelectedOptions = { ...currentSelectedOptions }
          delete newSelectedOptions[category]
          onCustomizationChangeRef.current?.(category, '', '', 0)
          return newSelectedOptions
        }

        // Check if option is disabled using current disabledOptions
        if (disabledOptions[optionId]?.disabled) {
          console.warn(`Option ${optionId} is disabled: ${disabledOptions[optionId].reason}`)
          return currentSelectedOptions // Return unchanged state
        }

        // Proceed with selection
        const optionLabel = category === 'specialOffers' && 'roomTitle' in optionDetails ? optionDetails.roomTitle :
                           'label' in optionDetails ? optionDetails.label : 
                           'name' in optionDetails ? optionDetails.name : 
                           'claim' in optionDetails ? optionDetails.claim : 
                           optionId
        
        // Ensure optionLabel is never undefined
        const finalLabel = optionLabel || optionId
        
        const newSelectedOptions = {
          ...currentSelectedOptions,
          [category]: {
            id: optionId,
            label: finalLabel,
            price: optionDetails.price,
          },
        }
        
        onCustomizationChangeRef.current?.(category, optionId, finalLabel, optionDetails.price)
        return newSelectedOptions
      })
    },
    [disabledOptions] // Only depend on disabledOptions - other values accessed via refs
  )

  // Performance: These functions only depend on disabledOptions
  // They're already optimally memoized since disabledOptions is memoized
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
