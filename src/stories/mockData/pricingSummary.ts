import type { MultiBookingPricingSummaryPanelProps } from '@/components/upsell/PricingSummaryPanel/MultiBookingPricingSummaryPanel'
import { SectionType, type UILabels } from '@/components/upsell/PricingSummaryPanel/types'

export const pricingSummaryLabels: UILabels = {
  subtotalLabel: 'Subtotal',
  totalLabel: 'Total',
  payAtHotelLabel: 'Pay at hotel',
  viewTermsLabel: 'View terms',
  confirmButtonLabel: 'Confirm selection',
  loadingLabel: 'Updating cart...',
  emptyCartMessage: 'No extras selected yet.',
  removeLabel: 'Remove item',
  roomsCountLabel: 'Rooms',
  singleRoomLabel: 'Room',
  roomTotalLabel: 'Room total',
  exploreLabel: 'Explore options',
  fromLabel: 'from',
  customizeStayTitle: 'Booking summary',
  chooseOptionsSubtitle: 'Review the add-ons attached to each stay.',
  currencySymbol: '€',
  pricingSummaryLabel: 'Pricing summary',
  processingLabel: 'Processing...',
  guestsLabel: 'guests',
  guestLabel: 'guest',
  nightsLabel: 'nights',
  nightLabel: 'night',
  subjectToAvailability: 'Subject to availability',
}

export const layoutPricingLabels: UILabels = {
  ...pricingSummaryLabels,
  subtotalLabel: 'Choose your superior room',
  emptyCartMessage: 'No selections made for this room yet.\nAdd upgrades or customizations to see them here.',
  pricingSummaryLabel: 'Booking summary',
}

export const multiRoomSummary: MultiBookingPricingSummaryPanelProps['rooms'] = [
  {
    id: 'bcn-suite',
    displayName: 'Skyline Suite',
    guestName: 'Sarah Johnson',
    formattedNights: '3 nights',
    formattedTotal: '€1,095.00',
    sections: [
      {
        title: 'Choose your superior room',
        type: SectionType.Upgrade,
        items: [
          { id: 'upgrade-skyline', name: 'Skyline Suite Upgrade', formattedPrice: '€420.00' },
          { id: 'late-checkout', name: 'Late checkout 3 PM', formattedPrice: '€45.00' },
        ],
      },
      {
        title: 'Customize your room',
        type: SectionType.Customization,
        items: [
          { id: 'pillow-menu', name: 'Premium pillow menu', formattedPrice: '€60.00' },
          { id: 'welcome-kit', name: 'Wellness welcome kit', formattedPrice: '€30.00' },
        ],
      },
      {
        title: 'Stay Enhancement',
        type: SectionType.Offer,
        items: [
          { id: 'spa-package', name: 'Spa Package', formattedPrice: '€180.00' },
          { id: 'breakfast-buffet', name: 'Breakfast Buffet', formattedPrice: '€90.00' },
        ],
      },
    ],
    guestCount: 2,
  },
  {
    id: 'bcn-deluxe',
    displayName: 'Deluxe King Room',
    guestName: 'Miguel Torres',
    formattedNights: '2 nights',
    formattedTotal: '€633.00',
    sections: [
      {
        title: 'Customize your room',
        type: SectionType.Customization,
        items: [
          { id: 'balcony-set', name: 'Balcony breakfast set', formattedPrice: '€48.00' },
          { id: 'crib', name: 'Crib & kids amenities', formattedPrice: '€35.00' },
        ],
      },
      {
        title: 'Stay Enhancement',
        type: SectionType.Offer,
        items: [
          { id: 'late-checkout-2', name: 'Late Checkout', formattedPrice: '€30.00' },
          { id: 'airport-transfer', name: 'Airport Transfer', formattedPrice: '€70.00' },
          { id: 'city-tour', name: 'City Tour Experience', formattedPrice: '€90.00' },
        ],
      },
    ],
    guestCount: 3,
  },
]

export const multiBookingSummary: MultiBookingPricingSummaryPanelProps['formattedBookings'] = [
  {
    id: 'bcn-suite',
    displayName: 'Skyline Suite',
    bookingKey: 'bcn-suite',
    formattedDateRange: '12 Aug - 15 Aug',
    formattedNights: '3 nights',
    formattedGuests: '2 guests',
  },
  {
    id: 'bcn-deluxe',
    displayName: 'Deluxe King Room',
    bookingKey: 'bcn-deluxe',
    formattedDateRange: '12 Aug - 14 Aug',
    formattedNights: '2 nights',
    formattedGuests: '3 guests',
  },
]

// Mock data with only Stay Enhancement offers
export const stayEnhancementOnlyRooms: MultiBookingPricingSummaryPanelProps['rooms'] = [
  {
    id: 'enhance-suite',
    displayName: 'Premium Suite',
    guestName: 'Julia Martinez',
    formattedNights: '4 nights',
    formattedTotal: '€1,680.00',
    sections: [
      {
        title: 'Stay Enhancement',
        type: SectionType.Offer,
        items: [
          { id: 'all-inclusive', name: 'All Inclusive Package', formattedPrice: '€1,200.00' },
          { id: 'wine-tasting', name: 'Wine Tasting Experience', formattedPrice: '€180.00' },
          { id: 'morning-yoga', name: 'Morning Yoga Classes', formattedPrice: '€80.00' },
        ],
      },
    ],
    guestCount: 2,
  },
  {
    id: 'enhance-deluxe',
    displayName: 'Deluxe Room',
    guestName: 'Thomas Anderson',
    formattedNights: '3 nights',
    formattedTotal: '€525.00',
    sections: [
      {
        title: 'Stay Enhancement',
        type: SectionType.Offer,
        items: [
          { id: 'valet-parking', name: 'Valet Parking Service', formattedPrice: '€75.00' },
          { id: 'online-checkin', name: 'Online Check-in Express', formattedPrice: '€10.00' },
          { id: 'late-checkout-3', name: 'Late Checkout 4 PM', formattedPrice: '€45.00' },
        ],
      },
    ],
    guestCount: 1,
  },
]

export const stayEnhancementOnlyBookings: MultiBookingPricingSummaryPanelProps['formattedBookings'] = [
  {
    id: 'enhance-suite',
    displayName: 'Premium Suite',
    bookingKey: 'enhance-suite',
    formattedDateRange: '20 Oct - 24 Oct',
    formattedNights: '4 nights',
    formattedGuests: '2 guests',
  },
  {
    id: 'enhance-deluxe',
    displayName: 'Deluxe Room',
    bookingKey: 'enhance-deluxe',
    formattedDateRange: '20 Oct - 23 Oct',
    formattedNights: '3 nights',
    formattedGuests: '1 guest',
  },
]

// Mock data with all three types: Upgrade, Customization, and Stay Enhancement
export const completeOptionsRooms: MultiBookingPricingSummaryPanelProps['rooms'] = [
  {
    id: 'complete-suite',
    displayName: 'Grand Penthouse',
    guestName: 'Rebecca Williams',
    formattedNights: '5 nights',
    formattedTotal: '€2,945.00',
    sections: [
      {
        title: 'Choose your superior room',
        type: SectionType.Upgrade,
        items: [
          { id: 'suite-upgrade', name: 'Upgrade to Grand Penthouse', formattedPrice: '€1,200.00' },
          { id: 'early-checkin', name: 'Early check-in 11 AM', formattedPrice: '€60.00' },
        ],
      },
      {
        title: 'Customize your room',
        type: SectionType.Customization,
        items: [
          { id: 'custom-amenities', name: 'Custom welcome kit', formattedPrice: '€85.00' },
          { id: 'room-decoration', name: 'Special room decoration', formattedPrice: '€150.00' },
        ],
      },
      {
        title: 'Stay Enhancement',
        type: SectionType.Offer,
        items: [
          { id: 'spa-experience', name: 'Full Spa Experience', formattedPrice: '€400.00' },
          { id: 'gourmet-dining', name: 'Gourmet Dining Package', formattedPrice: '€350.00' },
          { id: 'concierge', name: 'Premium Concierge Service', formattedPrice: '€205.00' },
        ],
      },
    ],
    guestCount: 3,
  },
]

export const completeOptionsBookings: MultiBookingPricingSummaryPanelProps['formattedBookings'] = [
  {
    id: 'complete-suite',
    displayName: 'Grand Penthouse',
    bookingKey: 'complete-suite',
    formattedDateRange: '01 Dec - 06 Dec',
    formattedNights: '5 nights',
    formattedGuests: '3 guests',
  },
]

export const singleRoomSummary: MultiBookingPricingSummaryPanelProps['rooms'] = [
  {
    id: 'ibz-suite',
    displayName: 'Mediterranean Suite',
    guestName: 'Alex Rivera',
    formattedNights: '4 nights',
    formattedTotal: '€1,120.00',
    sections: [
      {
        title: 'Customize your room',
        type: SectionType.Customization,
        items: [
          { id: 'spa-daily', name: 'Daily spa circuit', formattedPrice: '€160.00' },
          { id: 'private-transfer', name: 'Private transfer', formattedPrice: '€200.00' },
        ],
      },
    ],
    guestCount: 2,
  },
]

export const singleBookingSummary: MultiBookingPricingSummaryPanelProps['formattedBookings'] = [
  {
    id: 'ibz-suite',
    displayName: 'Mediterranean Suite',
    bookingKey: 'ibz-suite',
    formattedDateRange: '05 Sep - 09 Sep',
    formattedNights: '4 nights',
    formattedGuests: '2 guests',
  },
]

export const layoutPricingRooms: MultiBookingPricingSummaryPanelProps['rooms'] = [
  {
    id: 'room-1',
    displayName: 'Skyline Suite',
    guestName: 'Alex Johnson',
    formattedNights: '8 nights',
    formattedTotal: '€685.00',
    sections: [
      {
        title: 'Choose your superior room',
        type: SectionType.Upgrade,
        items: [{ id: 'skyline-upgrade', name: 'Skyline Suite Upgrade', formattedPrice: '€420.00' }],
      },
    ],
    guestCount: 2,
  },
  {
    id: 'room-2',
    displayName: 'Deluxe King Room',
    guestName: 'Maria Garcia',
    formattedNights: '8 nights',
    formattedTotal: '€360.00',
    sections: [],
    guestCount: 3,
  },
]

export const layoutPricingBookings: MultiBookingPricingSummaryPanelProps['formattedBookings'] = [
  {
    id: 'room-1',
    displayName: 'Room 1',
    bookingKey: 'room-1',
    formattedDateRange: '2026-03-02 - 2026-03-10',
    formattedNights: '8 nights',
    formattedGuests: '2 guests',
  },
  {
    id: 'room-2',
    displayName: 'Room 2',
    bookingKey: 'room-2',
    formattedDateRange: '2026-03-02 - 2026-03-10',
    formattedNights: '8 nights',
    formattedGuests: '3 guests',
  },
]

// Four rooms mock data for DynamicHeightTest story
export const fourRoomsSummary: MultiBookingPricingSummaryPanelProps['rooms'] = [
  {
    id: 'room-1',
    displayName: 'Skyline Suite',
    guestName: 'Sarah Johnson',
    formattedNights: '5 nights',
    formattedTotal: '€1,285.00',
    sections: [
      {
        title: 'Choose your superior room',
        type: SectionType.Upgrade,
        items: [
          { id: 'upgrade-skyline-1', name: 'Skyline Suite Upgrade', formattedPrice: '€520.00' },
          { id: 'late-checkout-1', name: 'Late checkout 3 PM', formattedPrice: '€55.00' },
          { id: 'early-checkin-1', name: 'Early check-in 10 AM', formattedPrice: '€50.00' },
        ],
      },
      {
        title: 'Customize your room',
        type: SectionType.Customization,
        items: [
          { id: 'pillow-menu-1', name: 'Premium pillow menu', formattedPrice: '€70.00' },
          { id: 'welcome-kit-1', name: 'Wellness welcome kit', formattedPrice: '€40.00' },
          { id: 'minibar-premium-1', name: 'Premium minibar package', formattedPrice: '€85.00' },
        ],
      },
    ],
    guestCount: 2,
  },
  {
    id: 'room-2',
    displayName: 'Deluxe King Room',
    guestName: 'Miguel Torres',
    formattedNights: '4 nights',
    formattedTotal: '€960.00',
    sections: [
      {
        title: 'Choose your superior room',
        type: SectionType.Upgrade,
        items: [{ id: 'upgrade-deluxe-2', name: 'Deluxe King Upgrade', formattedPrice: '€380.00' }],
      },
      {
        title: 'Customize your room',
        type: SectionType.Customization,
        items: [
          { id: 'balcony-set-2', name: 'Balcony breakfast set', formattedPrice: '€58.00' },
          { id: 'crib-2', name: 'Crib & kids amenities', formattedPrice: '€45.00' },
          { id: 'spa-access-2', name: 'Daily spa circuit access', formattedPrice: '€120.00' },
          { id: 'parking-2', name: 'Underground parking', formattedPrice: '€80.00' },
        ],
      },
    ],
    guestCount: 3,
  },
  {
    id: 'room-3',
    displayName: 'Ocean View Suite',
    guestName: 'Emma Chen',
    formattedNights: '6 nights',
    formattedTotal: '€1,540.00',
    sections: [
      {
        title: 'Choose your superior room',
        type: SectionType.Upgrade,
        items: [
          { id: 'upgrade-ocean-3', name: 'Ocean View Suite Upgrade', formattedPrice: '€720.00' },
          { id: 'late-checkout-3', name: 'Late checkout 4 PM', formattedPrice: '€65.00' },
        ],
      },
      {
        title: 'Customize your room',
        type: SectionType.Customization,
        items: [
          { id: 'champagne-3', name: 'Welcome champagne & chocolates', formattedPrice: '€95.00' },
          { id: 'massage-3', name: 'In-room couples massage', formattedPrice: '€280.00' },
          { id: 'flowers-3', name: 'Fresh flower arrangement', formattedPrice: '€60.00' },
        ],
      },
    ],
    guestCount: 2,
  },
  {
    id: 'room-4',
    displayName: 'Garden Villa',
    guestName: 'James Anderson',
    formattedNights: '7 nights',
    formattedTotal: '€2,180.00',
    sections: [
      {
        title: 'Choose your superior room',
        type: SectionType.Upgrade,
        items: [
          { id: 'upgrade-villa-4', name: 'Garden Villa Upgrade', formattedPrice: '€980.00' },
          { id: 'private-pool-4', name: 'Private pool access', formattedPrice: '€350.00' },
        ],
      },
      {
        title: 'Customize your room',
        type: SectionType.Customization,
        items: [
          { id: 'butler-4', name: 'Personal butler service', formattedPrice: '€420.00' },
          { id: 'wine-4', name: 'Premium wine selection', formattedPrice: '€180.00' },
          { id: 'transfer-4', name: 'Airport luxury transfer', formattedPrice: '€250.00' },
          { id: 'chef-4', name: 'Private chef dinner experience', formattedPrice: '€380.00' },
        ],
      },
    ],
    guestCount: 4,
  },
]

export const fourRoomsBookings: MultiBookingPricingSummaryPanelProps['formattedBookings'] = [
  {
    id: 'room-1',
    displayName: 'Skyline Suite',
    bookingKey: 'room-1',
    formattedDateRange: '15 Nov - 20 Nov',
    formattedNights: '5 nights',
    formattedGuests: '2 guests',
  },
  {
    id: 'room-2',
    displayName: 'Deluxe King Room',
    bookingKey: 'room-2',
    formattedDateRange: '15 Nov - 19 Nov',
    formattedNights: '4 nights',
    formattedGuests: '3 guests',
  },
  {
    id: 'room-3',
    displayName: 'Ocean View Suite',
    bookingKey: 'room-3',
    formattedDateRange: '15 Nov - 21 Nov',
    formattedNights: '6 nights',
    formattedGuests: '2 guests',
  },
  {
    id: 'room-4',
    displayName: 'Garden Villa',
    bookingKey: 'room-4',
    formattedDateRange: '15 Nov - 22 Nov',
    formattedNights: '7 nights',
    formattedGuests: '4 guests',
  },
]
