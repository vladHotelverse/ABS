import type { RoomOption, SegmentDiscount } from './types'

// Sample segment discounts
export const sampleSegmentDiscounts: Record<string, SegmentDiscount> = {
  loyalty10: {
    segmentType: 'loyalty',
    discountAmount: 10,
    discountType: 'percentage',
    label: 'Loyalty',
    priority: 1,
    color: 'blue'
  },
  loyalty15: {
    segmentType: 'loyalty', 
    discountAmount: 15,
    discountType: 'percentage',
    label: 'Loyalty',
    priority: 2,
    color: 'blue'
  },
  vip20: {
    segmentType: 'luxury',
    discountAmount: 20,
    discountType: 'percentage', 
    label: 'VIP',
    priority: 3,
    color: 'gold'
  },
  business: {
    segmentType: 'business',
    discountAmount: 25,
    discountType: 'fixed',
    label: 'Corporate',
    priority: 2,
    color: 'blue'
  },
  family: {
    segmentType: 'family',
    discountAmount: 15,
    discountType: 'percentage',
    label: 'Family',
    priority: 1,
    color: 'green'
  }
}

// Sample room data with segment discounts
export const sampleRoomsWithSegments: RoomOption[] = [
  {
    id: '1',
    title: 'Deluxe Ocean View',
    roomType: 'Deluxe Room',
    description: 'Spacious room with panoramic ocean views and modern amenities',
    amenities: ['Ocean View', 'Balcony', 'Free WiFi'],
    price: 150,
    oldPrice: 180,
    images: ['room1.jpg'],
    segmentDiscount: sampleSegmentDiscounts.loyalty10
  },
  {
    id: '2',
    title: 'Premium Suite',
    roomType: 'Suite',
    description: 'Luxury suite with separate living area and premium amenities',
    amenities: ['Living Area', 'Premium Amenities', 'Concierge'],
    price: 300,
    images: ['suite1.jpg'],
    segmentDiscount: sampleSegmentDiscounts.vip20
  },
  {
    id: '3', 
    title: 'Family Suite',
    roomType: 'Family Room',
    description: 'Perfect for families with connecting rooms and kids amenities',
    amenities: ['Connecting Rooms', 'Kids Amenities', 'Free WiFi'],
    price: 200,
    oldPrice: 220,
    images: ['family1.jpg'],
    segmentDiscount: sampleSegmentDiscounts.family
  }
]

// Default segment labels for translation
export const defaultSegmentLabels = {
  business: 'Corporate',
  leisure: 'Leisure',
  luxury: 'VIP',
  budget: 'Saver',
  family: 'Family',
  loyalty: 'Loyalty',
  group: 'Group',
  'extended-stay': 'Extended Stay'
}