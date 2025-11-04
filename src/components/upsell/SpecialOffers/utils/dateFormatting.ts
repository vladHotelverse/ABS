import { dateToKey } from './dateHelpers'

/**
 * Represents a single available date with all pre-calculated display information
 * This is UI-ready data that requires no further calculation
 */
export interface AvailableDate {
  key: string
  label: string
  date: Date
}

/**
 * Calculates available dates for date selection UI
 * All business logic (date ranges, filtering) happens here, NOT in the component
 *
 * @param options Configuration for date calculation
 * @returns Array of pre-formatted available dates ready for UI display
 */
export const calculateAvailableDates = (options: {
  reservationStartDate?: Date
  reservationEndDate?: Date
  maxDates?: number
}): AvailableDate[] => {
  const { reservationStartDate, reservationEndDate, maxDates = 10 } = options

  const dates: AvailableDate[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Normalize to start of day

  // Use reservation dates as the date range if provided, otherwise use today + maxDates
  let startDate: Date
  let endDate: Date

  if (reservationStartDate && reservationEndDate) {
    // Use the reservation period
    startDate = new Date(reservationStartDate)
    startDate.setHours(0, 0, 0, 0)
    endDate = new Date(reservationEndDate)
    endDate.setHours(0, 0, 0, 0)
  } else {
    // Fallback to today + maxDates days
    startDate = new Date(today)
    endDate = new Date(today)
    endDate.setDate(today.getDate() + Math.max(maxDates, 10))
  }

  // Generate dates within the range
  const current = new Date(startDate)
  while (current <= endDate) {
    // If we have reservation dates, include all dates in the reservation period
    // Otherwise, only include dates that are today or in the future
    const shouldIncludeDate = (reservationStartDate && reservationEndDate) || current >= today

    if (shouldIncludeDate) {
      const dateKey = dateToKey(current)
      const dayName = current.toLocaleDateString('en-US', { weekday: 'short' })
      const day = current.getDate()
      const monthName = current.toLocaleDateString('en-US', { month: 'short' })

      dates.push({
        key: dateKey,
        label: `${dayName} ${day}, ${monthName}`,
        date: new Date(current),
      })
    }

    current.setDate(current.getDate() + 1)
  }

  return dates
}

/**
 * Formats selected dates for display in the trigger button
 * All formatting logic happens here, NOT in the component
 *
 * @param selectedDates Array of selected Date objects
 * @returns Human-readable string for display
 */
export const formatSelectedDates = (selectedDates: Date[]): string => {
  if (selectedDates.length === 0) {
    return 'Select dates'
  }

  if (selectedDates.length === 1) {
    return selectedDates[0].toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  if (selectedDates.length <= 2) {
    return selectedDates
      .map((date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
      .join(', ')
  }

  return `${selectedDates.length} dates selected`
}
