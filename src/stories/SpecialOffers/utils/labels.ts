import type { OfferLabels } from '@/components/upsell/SpecialOffers/types'

/**
 * Default labels for SpecialOffers component
 * These are used in stories and can be overridden per story if needed
 */
export const getDefaultLabels = (): OfferLabels => ({
  perStay: 'per stay',
  perPerson: 'per person',
  perNight: 'per night',
  total: 'Total',
  bookNow: 'Book Now',
  numberOfPersons: 'Number of Persons',
  numberOfNights: 'Number of Nights',
  addedLabel: 'Added',
  popularLabel: 'Popular',
  personsTooltip: 'Select number of persons',
  personsSingularUnit: 'person',
  personsPluralUnit: 'persons',
  nightsTooltip: 'Select number of nights',
  nightsSingularUnit: 'night',
  nightsPluralUnit: 'nights',
  personSingular: 'Person',
  personPlural: 'Persons',
  nightSingular: 'Night',
  nightPlural: 'Nights',
  removeOfferLabel: 'Remove',
  decreaseQuantityLabel: 'Decrease quantity',
  increaseQuantityLabel: 'Increase quantity',
  selectDateLabel: 'Select Date',
  selectDateTooltip: 'Click to select a date',
  dateRequiredLabel: 'Date required',
  selectDatesLabel: 'Select Dates',
  selectDatesTooltip: 'Click to select dates',
  availableDatesLabel: 'Available Dates',
  noAvailableDatesLabel: 'No available dates',
  clearDatesLabel: 'Clear Dates',
  confirmDatesLabel: 'Confirm Dates',
  dateSelectedLabel: 'Date Selected',
  multipleDatesRequiredLabel: 'Multiple dates required',
})
