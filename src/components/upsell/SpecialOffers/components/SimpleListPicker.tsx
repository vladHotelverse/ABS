import type React from 'react'
import { UiButton as Button } from '@/components/ui/button'
import type { OfferLabels } from '../types'
import type { AvailableDate } from '../utils/dateFormatting'

interface SimpleListPickerProps {
  // Pre-calculated available dates (no calculation in component)
  availableDates: AvailableDate[]

  // User interactions
  selectedDates: Set<string>
  onDateToggle: (dateKey: string) => void
  onClear: () => void
  onSelectAll?: (dates: string[]) => void
  onDone: () => void

  // Configuration
  multiple?: boolean

  // Labels for all UI text
  labels: OfferLabels
}

const SimpleListPicker: React.FC<SimpleListPickerProps> = ({
  availableDates,
  selectedDates,
  onDateToggle,
  onClear,
  onSelectAll,
  onDone,
  multiple = true,
  labels,
}) => {
  /**
   * ✅ UI Layer ONLY - Pure presentation component
   * - Receives pre-calculated availableDates (all business logic moved to parent)
   * - Renders date list with user-provided labels
   * - Handles user interactions via callbacks
   * - No data transformation, calculation, or filtering
   */

  return (
    <div className="w-72">
      {/* Date list */}
      <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
        {multiple && availableDates.length > 3 && onSelectAll && (
            <Button
              onClick={() => onSelectAll(availableDates.map((d) => d.key))}
              variant="ghost"
              className="text-xs text-muted-foreground hover:text-foreground px-3 py-1 h-7"
              aria-label={labels.selectAllDatesLabel}
            >
              {labels.selectAllDatesLabel}
            </Button>
          )}
        {availableDates.length > 0 ? (
          availableDates.map((date) => (
            <div
              key={date.key}
              className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
              onClick={() => onDateToggle(date.key)}
            >
              <label
                htmlFor={`date-selector-${date.key}`}
                className="flex-1 font-medium cursor-pointer"
              >
                {date.label}
              </label>
              {multiple ? (
                // Checkboxes for multiple selection
                <input
                  id={`date-selector-${date.key}`}
                  type="checkbox"
                  checked={selectedDates.has(date.key)}
                  onChange={(e) => {
                    e.stopPropagation()
                    onDateToggle(date.key)
                  }}
                  className="w-4 h-4 cursor-pointer"
                  aria-label={`Select ${date.label}`}
                />
              ) : (
                // Radio buttons for single selection
                <input
                  id={`date-selector-${date.key}`}
                  type="radio"
                  name="date-selection"
                  checked={selectedDates.has(date.key)}
                  onChange={(e) => {
                    e.stopPropagation()
                    onDateToggle(date.key)
                  }}
                  className="w-4 h-4 cursor-pointer"
                  aria-label={`Select ${date.label}`}
                />
              )}
            </div>
          ))
        ) : (
          <div className="p-2 text-center text-muted-foreground">{labels.noAvailableDatesLabel}</div>
        )}
      </div>

      {/* Bottom actions - CLEAR, SELECT ALL (if applicable), and DONE */}
      <div className="flex items-center justify-between p-3 border-t bg-muted/30">
        <div className="flex gap-2">
          <Button
            onClick={onClear}
            variant="ghost"
            className="text-xs text-muted-foreground hover:text-foreground px-3 py-1 h-7"
            aria-label={labels.clearDatesLabel}
          >
            {labels.clearDatesLabel}
          </Button>
        </div>
        <Button
          onClick={onDone}
          className="bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-medium h-7"
          aria-label={labels.confirmDatesLabel}
        >
          {labels.confirmDatesLabel}
        </Button>
      </div>
    </div>
  )
}

export default SimpleListPicker
