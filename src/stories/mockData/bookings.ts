import type { BookingAccordionCardProps } from '@/components/upsell/ViewCards/BookingAccordionCard'

export const bookingViewCards = [
  {
    bookingKey: 'room-1',
    internalLocator: 'room-1',
    roomType: 'TRIPLE DELUXE GOLF VIEW',
    checkInDate: '2025-12-12',
    checkOutDate: '2025-12-20',
    occupancy: { adults: 1, childs: 0, infants: 0 },
    roomImage: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=640&h=360&fit=crop&auto=format',
    amenities: ['Golf View', 'Balcony', 'King Size Bed'],
    hasUpgrade: true,
    hasExtras: true,
    statusText: 'Confirmed',
    isCancelled: false,
    formattedTotalPrice: '€720.00',
    attributesBreakdown: [
      { attributeName: 'Upgrade to DELUXE SUITE WITH GOLF VIEW', attributeId: 1, amountFormatted: '€720.00' },
      { attributeName: 'Close to Pool', attributeId: 2, amountFormatted: 'Included' },
    ],
  },
  {
    bookingKey: 'room-2',
    internalLocator: 'room-2',
    roomType: 'TRIPLE DELUXE GOLF VIEW',
    checkInDate: '2025-12-12',
    checkOutDate: '2025-12-20',
    occupancy: { adults: 4, childs: 0, infants: 0 },
    roomImage: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=640&h=360&fit=crop&auto=format',
    amenities: ['Golf View', 'Balcony', 'King Size Bed'],
    hasUpgrade: true,
    hasExtras: true,
    statusText: 'Confirmed',
    isCancelled: false,
    formattedTotalPrice: '€720.00',
    attributesBreakdown: [
      { attributeName: 'Upgrade to DELUXE SUITE WITH GOLF VIEW', attributeId: 3, amountFormatted: '€720.00' },
      { attributeName: 'Close to Pool', attributeId: 4, amountFormatted: 'Included' },
    ],
  },
] as const

export const bookingAccordionCardArgs: BookingAccordionCardProps = {
  roomType: 'TRIPLE DELUXE GOLF VIEW',
  checkInDate: '2025-12-12',
  checkOutDate: '2025-12-20',
  occupancy: { adults: 1, childs: 0, infants: 0 },
  roomImage: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=640&h=360&fit=crop&auto=format',
  amenities: ['Golf View', 'Balcony', 'King Size Bed'],
  hasUpgrade: true,
  hasExtras: true,
  statusText: 'Confirmed',
  isCancelled: false,
  formattedTotalPrice: '€480.00',
  bookingKey: 'ABC123',
  internalLocator: 'ABC123',
  attributesBreakdown: [
    { attributeName: 'Upgrade to DELUXE SUITE WITH GOLF VIEW', attributeId: 1, amountFormatted: '€720.00' },
    { attributeName: 'Close to Pool', attributeId: 2, amountFormatted: '€440.00' },
  ],
}
