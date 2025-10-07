/**
 * Create Sample Data for Demo
 * Creates sample orders for testing the order consultation system
 */

import { saveOrder } from '../services/orderStorage'
import type { OrderData } from '../services/orderStorage'

/**
 * Create sample orders for demo purposes
 */
export function initializeSampleOrders(): void {
  // Sample Order 1: Basic confirmed order
  const sampleOrder1: OrderData = {
    id: 'ABS-20250723-DEMO01',
    createdAt: '2025-07-23T08:00:00.000Z',
    updatedAt: '2025-07-23T08:00:00.000Z',
    status: 'confirmed',
    userInfo: {
      roomType: 'DELUXE SILVER',
      checkIn: '2026-05-10',
      checkOut: '2026-05-15',
      occupancy: '2 Adults, 0 Children',
      reservationCode: '1003066AU'
    },
    selections: {
      room: {
        id: 'deluxe',
        title: "Live luxury's pinnacle by the sea",
        roomType: 'DELUXE GOLD',
        description: 'True rock stars look down from above. A space covering 33 square metres with spectacular sea views, a private furnished terrace and elegant décor for a superior experience from the fifth floor upwards.',
        price: 22,
        image: 'https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt633/49a54c09-0945-4a87-893d-8d28d79e0f5b/image.webp',
        images: [
          'https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt633/49a54c09-0945-4a87-893d-8d28d79e0f5b/image.webp'
        ],
        amenities: ['Landmark View', 'Balcony', '24 Hours Room Service']
      },
      customizations: [
        {
          id: 'king-bed',
          name: 'King Size Bed',
          category: 'Beds',
          price: 5
        }
      ],
      offers: [
        {
          id: 2,
          name: 'Spa Access',
          title: 'Spa Access',
          description: 'Enjoy a day of relaxation at our luxury spa',
          image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef',
          price: 50,
          type: 'perPerson' as const,
        }
      ],
      activeBids: []
    },
    hotelProposals: [],
    totalPrice: 235, // (22*5) + (5*5) + (50*2)
    notes: 'Sample confirmed order'
  }

  // Sample Order 2: Order with hotel proposals
  const sampleOrder2: OrderData = {
    id: 'ABS-20250723-DEMO02',
    createdAt: '2025-07-22T10:30:00.000Z',
    updatedAt: '2025-07-23T09:15:00.000Z',
    status: 'modified',
    userInfo: {
      roomType: 'DELUXE SILVER',
      checkIn: '2026-05-08',
      checkOut: '2026-05-12',
      occupancy: '2 Adults, 1 Child',
      reservationCode: '1003067AU'
    },
    selections: {
      room: {
        id: 'rocksuite',
        roomType: 'ROCK SUITE',
        title: "Supreme luxury with divine views",
        description: 'Our contemporary Hard Rock Ibiza Suites perfectly capture the authenticity and irreverence of rock \'n\' roll with the sensuality and sophistication of Ibiza Island.',
        price: 89,
        image: 'https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt640/3e7e2260-63e3-4934-9358-ebf08bb6d96a/image.webp',
        images: [
          'https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt640/3e7e2260-63e3-4934-9358-ebf08bb6d96a/image.webp'
        ],
        amenities: ['Hydromassage Bathtub', 'Living Room', 'Coffee Machine']
      },
      customizations: [],
      offers: [
        {
          id: 1,
          name: 'All inclusive package',
          title: 'All inclusive package',
          description: 'Enjoy unlimited access to all amenities, meals and beverages.',
          image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
          price: 50,
          type: 'perPerson' as const,
        }
      ],
      activeBids: []
    },
    hotelProposals: [
      {
        id: 'prop-001',
        type: 'offer_change',
        title: 'Airport Transfer',
        description: 'We\'d like to offer you complimentary airport transfer instead of the current spa access.',
        proposedItem: {
          id: 'airport-transfer',
          name: 'Airport Transfer',
          price: 35
        },
        originalItem: {
          id: '1',
          name: 'All inclusive package',
          price: 50
        },
        priceDifference: -15,
        status: 'accepted',
        createdAt: '2025-07-23T09:00:00.000Z',
        expiresAt: '2025-07-25T09:00:00.000Z'
      }
    ],
    totalPrice: 506, // (89*4) + (35*3) = 356 + 105 + 45 for extras
    notes: 'Order with accepted hotel proposals'
  }

  // Save sample orders
  saveOrder(sampleOrder1)
  saveOrder(sampleOrder2)
  
  // Sample orders created
}

/**
 * Initialize sample data on app load
 */
export function initializeDemoData(): void {
  // Only initialize if no orders exist yet
  const existingOrders = localStorage.getItem('abs_orders')
  if (!existingOrders || existingOrders === '[]') {
    initializeSampleOrders()
  }
}