import type { OfferType, ReservationInfo } from '@/components/upsell/SpecialOffers/types'

/**
 * Mock offer data for Storybook stories
 */

export const mockOffers: OfferType[] = [
  {
    id: 1,
    title: 'All Inclusive',
    description: 'Enjoy unlimited food and drinks throughout your stay',
    price: 75,
    type: 'perPerson',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    featured: true,
  },
  {
    id: 2,
    title: 'Late Checkout',
    description: 'Extend your checkout time until 6 PM',
    price: 50,
    type: 'perStay',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    title: 'Online Check-in',
    description: 'Skip the queue with our convenient online check-in',
    price: 10,
    type: 'perStay',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    title: 'Spa Package',
    description: 'Relax with our premium spa treatments and wellness services',
    price: 120,
    type: 'perPerson',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
    requiresDateSelection: true,
    featured: true,
  },
  {
    id: 5,
    title: 'Airport Transfer',
    description: 'Comfortable transportation from airport to hotel',
    price: 35,
    type: 'perStay',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop',
  },
  {
    id: 6,
    title: 'Breakfast Buffet',
    description: 'Start your day with our delicious breakfast buffet',
    price: 15,
    type: 'perPerson',
    image: 'https://images.unsplash.com/photo-1533777324565-a040eb52facd?w=400&h=300&fit=crop',
  },
  {
    id: 7,
    title: 'City Tour',
    description: 'Guided tour of the city\'s most famous attractions',
    price: 45,
    type: 'perPerson',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop',
    requiresDateSelection: true,
    allowsMultipleDates: true,
  },
  {
    id: 8,
    title: 'Wine Tasting Experience',
    description: 'Sample local wines with our sommelier',
    price: 60,
    type: 'perPerson',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
    requiresDateSelection: true,
  },
  {
    id: 9,
    title: 'Room Upgrade',
    description: 'Upgrade to our premium suite with ocean view',
    price: 80,
    type: 'perNight',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
  },
]

/**
 * Featured offers only (for smaller grids)
 */
export const mockFeaturedOffers: OfferType[] = mockOffers.filter((offer) => offer.featured)

/**
 * Single offer (for testing single-item layout)
 */
export const mockSingleOffer: OfferType[] = [mockOffers[0]]

/**
 * Special offer types for testing specific logic
 */
export const mockAllInclusiveOffer: OfferType = mockOffers[0]
export const mockLateCheckoutOffer: OfferType = mockOffers[1]
export const mockOnlineCheckinOffer: OfferType = mockOffers[2]

/**
 * Offers requiring date selection
 */
export const mockDateSelectionOffers: OfferType[] = mockOffers.filter((offer) => offer.requiresDateSelection)

/**
 * Mock reservation info
 */
export const mockReservationInfo: ReservationInfo = {
  personCount: 2,
  checkInDate: new Date('2025-12-15'),
  checkOutDate: new Date('2025-12-20'),
}

/**
 * Alternative reservation info (longer stay)
 */
export const mockLongStayReservationInfo: ReservationInfo = {
  personCount: 4,
  checkInDate: new Date('2025-12-10'),
  checkOutDate: new Date('2025-12-25'),
}

/**
 * Short stay reservation
 */
export const mockShortStayReservationInfo: ReservationInfo = {
  personCount: 1,
  checkInDate: new Date('2025-12-18'),
  checkOutDate: new Date('2025-12-19'),
}
