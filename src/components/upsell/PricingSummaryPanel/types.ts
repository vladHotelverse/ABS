// Section type enum for type-safe section identification
export enum SectionType {
  Upgrade = 'upgrade',
  Customization = 'customization',
}

// Shared type for formatted cart items (removes duplication)
export interface FormattedCartItem {
  id: string
  name: string
  formattedPrice: string
}

// Cart section with title and items (built in app layer)
export interface CartSection {
  title: string
  type: SectionType
  items: FormattedCartItem[]
}

// Pure display interfaces for UI components
export interface BookingDisplay {
  id?: string
  bookingKey?: string
  checkInDate?: string
  checkOutDate?: string
  guestName?: string
  roomTypeName?: string
  nights?: number
  totalGuests?: number
}

export interface UILabels {
  // Core UI labels
  subtotalLabel: string
  totalLabel: string
  payAtHotelLabel: string
  viewTermsLabel: string
  confirmButtonLabel: string
  loadingLabel: string
  emptyCartMessage: string
  removeLabel: string

  // Booking info labels
  guestsLabel?: string
  guestLabel?: string
  nightsLabel?: string
  nightLabel?: string
  roomsCountLabel: string
  singleRoomLabel: string
  roomTotalLabel: string

  // Empty state labels
  exploreLabel: string
  fromLabel: string
  customizeStayTitle: string
  chooseOptionsSubtitle: string

  // Currency
  currencySymbol: string

  // Accessibility labels
  pricingSummaryLabel: string
  processingLabel: string

  // Availability labels
  subjectToAvailability?: string
}
