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
    minQuantity: 1,
    maxQuantity: 2,
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
    allowsMultipleDates: true,
    availableDates: [
      new Date('2025-12-16'),
      new Date('2025-12-17'),
      new Date('2025-12-18'),
      new Date('2025-12-19'),
    ],
    featured: true,
  },
  {
    id: 5,
    title: 'Airport Transfer',
    description: 'Comfortable transportation from airport to hotel',
    price: 35,
    type: 'perStay',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop',
    minQuantity: 0,
    maxQuantity: 5,
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
    availableDates: [
      new Date('2025-12-15'),
      new Date('2025-12-16'),
      new Date('2025-12-17'),
      new Date('2025-12-18'),
      new Date('2025-12-19'),
      new Date('2025-12-20'),
    ],
  },
  {
    id: 10,
    title: 'Chef\'s Dinner Experience',
    description: 'Enjoy a curated three-course dinner each night of your stay',
    price: 55,
    type: 'perNight',
    image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=400&h=300&fit=crop',
  },
  {
    id: 11,
    title: 'Valet Parking',
    description: 'Overnight valet parking with unlimited in-and-out privileges',
    price: 25,
    type: 'perNight',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&h=300&fit=crop',
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
 * Focused offer groups for targeted scenarios
 */
export const mockPerStayOffer: OfferType[] = [mockOffers[1]]
export const mockPerPersonOffer: OfferType[] = [mockOffers[0]]
export const mockPerNightOffer: OfferType[] = mockOffers.filter((offer) => offer.type === 'perNight')
export const mockPerRoomOffer: OfferType[] = [
  {
    id: 201,
    title: 'Connected Room Package',
    description:
      'Guarantee adjacent rooms with shared lounge access. Adjust the quantity to match the number of rooms in the reservation.',
    price: 45,
    type: 'perStay',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop',
  },
  {
    id: 202,
    title: 'Daily Turndown Service',
    description:
      'Evening turndown with pillow menu and chocolates, charged per room so multi-room stays scale correctly.',
    price: 30,
    type: 'perStay',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
  },
]
export const mockSingleDateOffer: OfferType[] = mockOffers
  .filter((offer) => offer.requiresDateSelection && !offer.allowsMultipleDates)
  .slice(0, 1)
export const mockMultipleDatesOffer: OfferType[] = mockOffers
  .filter((offer) => offer.requiresDateSelection && offer.allowsMultipleDates)
  .slice(0, 1)

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
