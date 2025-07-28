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
 * Convert booking data from ABS_Landing format to order format
 */
export function convertBookingDataToOrder(
  bookingData: any,
  userInfo: UserInfo
): CreateOrderParams | null {
  try {
    // Extract selections from booking data
    const selections: OrderSelections = {
      room: bookingData.selectedRoom || undefined,
      customizations: bookingData.customizations || [],
      offers: bookingData.selectedOffers || [],
      activeBids: bookingData.activeBids || []
    }
    
    // Calculate total price (this would be more sophisticated in real implementation)
    let totalPrice = 0
    
    if (selections.room) {
      // Calculate nights
      const checkIn = new Date(userInfo.checkIn)
      const checkOut = new Date(userInfo.checkOut)
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      
      totalPrice += selections.room.price * nights
    }
    
    // Add customization prices
    totalPrice += selections.customizations.reduce((sum, c) => sum + (c.price || 0), 0)
    
    // Add offer prices
    totalPrice += selections.offers.reduce((sum, o) => sum + (o.price || 0), 0)
    
    return {
      userInfo,
      selections,
      totalPrice,
      notes: 'Order created from booking flow'
    }
  } catch (error) {
    console.error('Error converting booking data to order:', error)
    return null
  }
}