/**
 * Order Generator Utility
 * Creates order data from booking selections and saves to storage
 */

import { generateBookingId } from './bookingIdGenerator'
import { saveOrder } from '../services/orderStorage'
import type { OrderData, OrderSelections, UserInfo } from '../services/orderStorage'
import type { RoomOption } from '../components/ABS_Landing/sections'
import type { Customization, SpecialOffer } from '../components/ABS_Landing/types'

export interface CreateOrderParams {
  userInfo: UserInfo
  selections: OrderSelections
  totalPrice: number
  notes?: string
}

/**
 * Create and save a new order
 */
export async function createOrder(params: CreateOrderParams): Promise<string | null> {
  try {
    const orderId = generateBookingId()
    const now = new Date().toISOString()
    
    const orderData: OrderData = {
      id: orderId,
      createdAt: now,
      updatedAt: now,
      status: 'confirmed',
      userInfo: params.userInfo,
      selections: params.selections,
      hotelProposals: [],
      totalPrice: params.totalPrice,
      notes: params.notes
    }
    
    const success = await saveOrder(orderData)
    
    if (success) {
      // Return the actual ID from the database (might be different from generated one)
      return orderData.id
    } else {
      console.error('Failed to save order')
      return null
    }
  } catch (error) {
    console.error('Error creating order:', error)
    return null
  }
}

/**
 * Create sample order data for demo purposes
 */
export async function createSampleOrder(): Promise<string | null> {
  const sampleUserInfo: UserInfo = {
    roomType: 'DELUXE SILVER',
    checkIn: '2025-10-10',
    checkOut: '2025-10-15',
    occupancy: '2 Adults, 0 Children',
    reservationCode: '1003066AU'
  }
  
  // Sample room selection (from mockData)
  const sampleRoom: RoomOption = {
    id: 'deluxe',
    title: "Live luxury's pinnacle by the sea",
    roomType: 'DELUXE GOLD',
    description: 'True rock stars look down from above. A space covering 33 square metres with spectacular sea views, a private furnished terrace and elegant décor for a superior experience from the fifth floor upwards.',
    price: 22,
    image: 'https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt633/49a54c09-0945-4a87-893d-8d28d79e0f5b/image.webp',
    images: [
      'https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimagesrt633/49a54c09-0945-4a87-893d-8d28d79e0f5b/image.webp',
      'https://hvdatauatstgweu.blob.core.windows.net/roomtypehotelimages/h83/rt633/9d29265c-3fc9-4c70-b953-7e3335f200aa/image.webp'
    ],
    amenities: [
      'Landmark View',
      'Balcony', 
      '24 Hours Room Service'
    ]
  }
  
  // Sample customizations
  const sampleCustomizations: Customization[] = [
    {
      id: 'king-bed',
      name: 'King Size Bed',
      category: 'Beds',
      price: 5
    },
    {
      id: 'pool-view',
      name: 'Pool View',
      category: 'View',
      price: 5
    }
  ]
  
  // Sample offers
  const sampleOffers: SpecialOffer[] = [
    {
      id: 2,
      name: 'Spa Access',
      title: 'Spa Access',
      description: 'Enjoy a day of relaxation at our luxury spa - select your preferred date.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      price: 50,
      type: 'perPerson' as const,
      requiresDateSelection: true,
      allowsMultipleDates: true,
    }
  ]
  
  const sampleSelections: OrderSelections = {
    room: sampleRoom,
    customizations: sampleCustomizations,
    offers: sampleOffers,
    activeBids: []
  }
  
  // Calculate total price
  const roomPrice = sampleRoom.price * 5 // 5 nights
  const customizationPrice = sampleCustomizations.reduce((sum, c) => sum + c.price, 0) * 5
  const offerPrice = sampleOffers.reduce((sum, o) => sum + o.price, 0) * 2 // 2 persons
  const totalPrice = roomPrice + customizationPrice + offerPrice
  
  return await createOrder({
    userInfo: sampleUserInfo,
    selections: sampleSelections,
    totalPrice,
    notes: 'Sample order for demonstration purposes'
  })
}

/**
 * Convert unified room booking data to order format
 */
export function convertBookingDataToOrder(
  rooms: Array<{
    id: string
    roomName: string
    nights: number
    items: Array<{
      type: 'room' | 'customization' | 'offer' | 'bid'
      name: string
      price: number
    }>
  }>,
  userInfo: UserInfo
): CreateOrderParams | null {
  try {
    // For single booking mode, use the first room or create empty selections
    const primaryRoom = rooms[0]
    
    if (!primaryRoom) {
      return {
        userInfo,
        selections: {
          room: undefined,
          customizations: [],
          offers: [],
          activeBids: []
        },
        totalPrice: 0,
        notes: 'Order created from booking flow'
      }
    }
    
    // Extract room item (should be first room-type item)
    const roomItem = primaryRoom.items.find(item => item.type === 'room')
    const room = roomItem ? {
      id: roomItem.name,
      roomType: roomItem.name,
      title: roomItem.name,
      description: 'Room from unified booking system',
      image: '',
      amenities: [],
      price: roomItem.price,
      perNight: true
    } : undefined
    
    // Extract customizations
    const customizations = primaryRoom.items
      .filter(item => item.type === 'customization')
      .map(item => ({
        id: item.name,
        name: item.name,
        price: item.price
      }))
    
    // Extract offers
    const offers = primaryRoom.items
      .filter(item => item.type === 'offer')
      .map(item => ({
        id: item.name,
        name: item.name,
        title: item.name,
        description: 'Offer from unified booking system',
        image: '',
        price: item.price
      }))
    
    // Extract bids
    const activeBids = primaryRoom.items
      .filter(item => item.type === 'bid')
      .map(item => ({
        id: item.name,
        roomId: primaryRoom.id,
        roomName: primaryRoom.roomName,
        bidAmount: item.price,
        status: 'pending' as const
      }))
    
    const selections: OrderSelections = {
      room,
      customizations,
      offers,
      activeBids
    }
    
    // Calculate total price
    let totalPrice = 0
    const nights = primaryRoom.nights || 1
    
    // Add all item prices with night calculations
    primaryRoom.items.forEach(item => {
      if (item.type === 'room' || item.type === 'customization' || item.type === 'bid') {
        totalPrice += item.price * nights
      } else {
        totalPrice += item.price
      }
    })
    
    return {
      userInfo,
      selections,
      totalPrice,
      notes: 'Order created from unified booking system'
    }
  } catch (error) {
    console.error('Error converting booking data to order:', error)
    return null
  }
}