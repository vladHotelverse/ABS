import { Calendar as CalendarIcon, X } from 'lucide-react'
import type React from 'react'
import { useState, useMemo } from 'react'
import { UiButton as Button } from '@/components/ui/button'
import {
  UiPopover as Popover,
  UiPopoverContent as PopoverContent,
  UiPopoverTrigger as PopoverTrigger,
} from '@/components/ui/popover'
import {
  UiTooltip as Tooltip,
  UiTooltipContent as TooltipContent,
  TooltipProvider,
  UiTooltipTrigger as TooltipTrigger,
} from '@/components/ui/tooltip'
import type { OfferLabels } from '../types'
import type { AvailableDate } from '../utils/dateFormatting'
import SimpleListPicker from './SimpleListPicker'
import { dateToKey, keyToDate } from '../utils/dateHelpers'

interface EnhancedDateSelectorProps {
  id: string
  label: string
  // Pre-formatted display text for selected dates (no formatting in component)
  formattedSelectedDates: string
  // Pre-calculated available dates (no calculation in component)
  availableDates: AvailableDate[]
  // Selected dates for internal state management
  selectedDates: Date[]
  onChange: (dates: Date[]) => void
  disabled?: boolean
  tooltipText?: string
  className?: string
  multiple?: boolean
  onDoneAndBook?: () => void
  labels: OfferLabels
}

const EnhancedDateSelector: React.FC<EnhancedDateSelectorProps> = ({
  id,
  label,
  formattedSelectedDates,
  availableDates,
  selectedDates,
  onChange,
  disabled = false,
  tooltipText,
  className = '',
  multiple = true,
  onDoneAndBook,
  labels,
}) => {
  /**
   * ✅ UI Layer ONLY - Pure presentation component
   * - Receives pre-formatted dates (no formatting in component)
   * - Receives pre-calculated available dates (no calculation in component)
   * - Manages visual state (popover open/close)
   * - Handles user interactions via callbacks
   * - No data transformation or business logic
   */

  const [open, setOpen] = useState(false)

  // Convert dates to string keys for list picker (UI state management only)
  const selectedDateKeys = useMemo(() => {
    return new Set(selectedDates.map(dateToKey))
  }, [selectedDates])

  const handleListDateToggle = (dateKey: string) => {
    const isAlreadySelected = selectedDateKeys.has(dateKey)

    if (multiple) {
      if (isAlreadySelected) {
        // Remove date
        const newDates = selectedDates.filter((d) => dateToKey(d) !== dateKey)
        onChange(newDates)
      } else {
        // Add date (max dates validation is handled by parent when calculating availableDates)
        const newDate = keyToDate(dateKey)
        const newDates = [...selectedDates, newDate].sort((a, b) => a.getTime() - b.getTime())
        onChange(newDates)
      }
    } else {
      // Single date selection
      const newDate = keyToDate(dateKey)
      onChange([newDate])
    }
  }

  const handleClear = () => {
    onChange([])
  }

  const handleDone = () => {
    setOpen(false)
    // Trigger booking if callback provided and dates are selected
    if (onDoneAndBook && selectedDates.length > 0) {
      onDoneAndBook()
    }
  }

  const handleSelectAll = (dateKeys: string[]) => {
    // Convert date keys back to Date objects
    const allDates = dateKeys.map(keyToDate).sort((a, b) => a.getTime() - b.getTime())
    onChange(allDates)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const dateSelector = (
    <div className={`${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-neutral-700 mb-2 block">
          {label}
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            disabled={disabled}
            className={`${label ? 'w-full justify-start text-left' : 'w-auto justify-center'} font-normal ${
              selectedDates.length === 0 && 'text-muted-foreground'
            }`}
          >
            <CalendarIcon className={`h-4 w-4 ${label && selectedDates.length > 0 ? 'mr-2' : ''}`} />
            {label && formattedSelectedDates}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b">
            <span className="text-sm font-medium">{labels.selectDatesLabel}</span>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="p-1 h-auto"
              aria-label="Close date selector"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* List view only */}
          <SimpleListPicker
            availableDates={availableDates}
            selectedDates={selectedDateKeys}
            onDateToggle={handleListDateToggle}
            onClear={handleClear}
            onSelectAll={handleSelectAll}
            onDone={handleDone}
            multiple={multiple}
            labels={labels}
          />
        </PopoverContent>
      </Popover>
    </div>
  )

  if (tooltipText && !disabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{dateSelector}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return dateSelector
}

export default EnhancedDateSelector
