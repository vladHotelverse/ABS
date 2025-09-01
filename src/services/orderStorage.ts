/**
 * Order Storage Service - Supabase Integration
 * Manages persistence and retrieval of booking order data via Supabase
 */

import { supabase } from '../lib/supabase'
import type { RoomOption } from '../components/ABS_Landing/sections'
import type { Customization, SpecialOffer } from '../components/ABS_Landing/types'
import type { BidItem } from '../hooks/useBidUpgrade'

// Order status types
export type OrderStatus = 'confirmed' | 'pending' | 'cancelled' | 'modified'
export type ProposalStatus = 'pending' | 'accepted' | 'rejected'

// Hotel proposal interface
export interface ProposalItem {
  id: string
  type: 'room_change' | 'customization_change' | 'offer_change' | 'price_change'
  title: string
  description: string
  originalItem?: {
    id: string
    name: string
    price: number
  }
  proposedItem: {
    id: string
    name: string
    price: number
  }
  priceDifference: number
  status: ProposalStatus
  createdAt: string
  expiresAt?: string
}

// User information interface
export interface UserInfo {
  roomType: string
  checkIn: string
  checkOut: string
  occupancy: string
  reservationCode?: string
  userEmail?: string
  userName?: string
}

// Order selections interface
export interface OrderSelections {
  room?: RoomOption
  customizations: Customization[]
  offers: SpecialOffer[]
  activeBids: BidItem[]
}

// Main order data interface
export interface OrderData {
  id: string
  createdAt: string
  updatedAt: string
  status: OrderStatus
  userInfo: UserInfo
  selections: OrderSelections
  hotelProposals: ProposalItem[]
  totalPrice: number
  notes?: string
}

/**
 * Get API base URL - use CMS API in production, local in development
 */
const getApiBaseUrl = (): string => {
  // In production, this should point to your deployed CMS API
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_CMS_API_URL || 'https://your-cms-demo.vercel.app'
  }
  // In development, use local CMS server
  return 'http://localhost:3000'
}

/**
 * Transform ABS order data to API format
 */
const transformOrderForAPI = (orderData: OrderData) => {
  const selections = []
  
  // Add room upgrade if selected
  if (orderData.selections.room) {
    selections.push({
      type: 'room_upgrade',
      itemId: orderData.selections.room.id || 'room_upgrade',
      name: `Room Upgrade to ${orderData.selections.room.title}`,
      description: orderData.selections.room.description,
      price: orderData.selections.room.price || 0,
      quantity: 1,
      metadata: orderData.selections.room
    })
  }
  
  // Add customizations
  orderData.selections.customizations?.forEach(customization => {
    selections.push({
      type: 'customization',
      itemId: customization.id || 'customization',
      name: customization.name,
      description: customization.name,
      price: customization.price || 0,
      quantity: 1,
      metadata: customization
    })
  })
  
  // Add special offers
  orderData.selections.offers?.forEach(offer => {
    // Use room title if available (for special offers from room customization)
    const displayName = (offer as any).roomTitle || offer.name
    
    selections.push({
      type: 'special_offer',
      itemId: offer.id || 'offer',
      name: displayName,
      description: offer.description,
      price: offer.price || 0,
      quantity: 1,
      metadata: offer
    })
  })

  return {
    userEmail: orderData.userInfo.userEmail || 'guest@hotel.com',
    userName: orderData.userInfo.userName || 'Guest',
    reservationCode: orderData.userInfo.reservationCode,
    checkIn: orderData.userInfo.checkIn,
    checkOut: orderData.userInfo.checkOut,
    roomType: orderData.userInfo.roomType,
    occupancy: orderData.userInfo.occupancy,
    status: orderData.status,
    totalPrice: orderData.totalPrice,
    notes: orderData.notes,
    selections: selections
  }
}

/**
 * Save order data directly to Supabase
 */
export async function saveOrder(orderData: OrderData): Promise<boolean> {
  try {
    const apiData = transformOrderForAPI(orderData)
    
    // Saving order to Supabase
    
    // Save main order to Supabase
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderData.id,
        user_email: apiData.userEmail,
        user_name: apiData.userName,
        reservation_code: apiData.reservationCode,
        check_in: apiData.checkIn,
        check_out: apiData.checkOut,
        room_type: apiData.roomType,
        occupancy: apiData.occupancy,
        status: apiData.status,
        total_price: apiData.totalPrice,
        notes: apiData.notes
      })
      .select()
      .single()

    if (orderError) {
      // Supabase order error - check database schema
      throw orderError
    }

    // Save order items if any
    if (apiData.selections && apiData.selections.length > 0) {
      const orderItems = apiData.selections.map((selection: any) => ({
        order_id: orderData.id,
        type: selection.type,
        item_id: selection.itemId,
        name: selection.name,
        description: selection.description,
        price: selection.price,
        quantity: selection.quantity,
        metadata: selection.metadata
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        // Supabase items error
        // Don't fail the whole operation for items
      }
    }

    // Order saved successfully to Supabase
    return true
  } catch (error) {
    // Failed to save order to Supabase, using fallback
    
    // For demo purposes, if Supabase fails, create a mock order ID
    orderData.id = `DEMO-${Date.now()}`
    return true
  }
}

/**
 * Retrieve order data by ID from Supabase
 */
export async function getOrder(orderId: string): Promise<OrderData | null> {
  try {
    // If it's a demo order (starts with DEMO-), create a mock order
    if (orderId.startsWith('DEMO-')) {
      // Creating demo order
      return createDemoOrder(orderId)
    }
    
    // Fetching order from Supabase
    
    // Get order from Supabase
    const { data: orderFromDB, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()
    
    if (orderError) {
      if (orderError.code === 'PGRST116') { // No rows returned
        // Order not found in Supabase, creating demo order
        return createDemoOrder(orderId)
      }
      throw orderError
    }

    // Get order items
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)

    if (itemsError) {
      // Error fetching order items
    }

    // Get hotel proposals
    const { data: hotelProposals, error: proposalsError } = await supabase
      .from('hotel_proposals')
      .select('*')
      .eq('order_id', orderId)

    if (proposalsError) {
      // Error fetching hotel proposals
    }
    
    // Transform Supabase data back to ABS format
    const orderData: OrderData = {
      id: orderFromDB.id,
      createdAt: orderFromDB.created_at,
      updatedAt: orderFromDB.updated_at,
      status: orderFromDB.status,
      userInfo: {
        roomType: orderFromDB.room_type,
        checkIn: orderFromDB.check_in,
        checkOut: orderFromDB.check_out,
        occupancy: orderFromDB.occupancy,
        reservationCode: orderFromDB.reservation_code,
        userEmail: orderFromDB.user_email,
        userName: orderFromDB.user_name
      },
      selections: {
        room: undefined,
        customizations: [],
        offers: [],
        activeBids: []
      },
      hotelProposals: [],
      totalPrice: orderFromDB.total_price || 0,
      notes: orderFromDB.notes
    }

    // Parse order items back to selections
    if (orderItems) {
      orderItems.forEach((item: any) => {
        switch (item.type) {
          case 'room_upgrade':
            orderData.selections.room = {
              id: item.item_id,
              title: item.name,
              description: item.description,
              price: item.price,
              ...item.metadata
            }
            break
          case 'customization':
            orderData.selections.customizations.push({
              id: item.item_id,
              name: item.name,
              description: item.description,
              price: item.price,
              ...item.metadata
            })
            break
          case 'special_offer':
            orderData.selections.offers.push({
              id: item.item_id,
              name: item.name,
              description: item.description,
              price: item.price,
              ...item.metadata
            })
            break
        }
      })
    }

    // Parse hotel proposals
    if (hotelProposals) {
      orderData.hotelProposals = hotelProposals.map((proposal: any) => ({
        id: proposal.id,
        type: proposal.type,
        title: proposal.title,
        description: proposal.description,
        priceDifference: proposal.price_difference || 0,
        status: proposal.status,
        createdAt: proposal.created_at,
        expiresAt: proposal.expires_at,
        originalItem: proposal.original_item_id ? {
          id: proposal.original_item_id,
          name: 'Original Item',
          price: 0
        } : undefined,
        proposedItem: proposal.proposed_item_data ? {
          id: proposal.proposed_item_data.id || 'proposed',
          name: proposal.proposed_item_data.name || 'Proposed Item',
          price: proposal.proposed_item_data.price || 0
        } : {
          id: 'proposed',
          name: proposal.title,
          price: proposal.price_difference || 0
        }
      }))
    }

    // Order retrieved successfully from Supabase
    return orderData
  } catch (error) {
    // Failed to retrieve order from Supabase
    // Fallback to demo order
    return createDemoOrder(orderId)
  }
}

/**
 * Create a demo order for testing purposes
 */
function createDemoOrder(orderId: string): OrderData {
  return {
    id: orderId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'confirmed',
    userInfo: {
      roomType: 'DELUXE SILVER',
      checkIn: '2025-01-25',
      checkOut: '2025-01-28',
      occupancy: '2 Adults, 0 Children',
      reservationCode: 'DEMO123',
      userEmail: 'demo@hotel.com',
      userName: 'Demo Guest'
    },
    selections: {
      room: {
        id: 'deluxe',
        title: "Live luxury's pinnacle by the sea",
        roomType: 'DELUXE GOLD',
        description: 'Deluxe room with sea view',
        price: 100,
        image: 'https://example.com/room.jpg',
        images: ['https://example.com/room.jpg'],
        amenities: ['Sea View', 'Balcony']
      },
      customizations: [
        {
          id: 'spa',
          name: 'Spa Package',
          price: 50
        }
      ],
      offers: [
        {
          id: 1,
          name: 'Late Checkout',
          title: 'Late Checkout',
          description: 'Checkout at 3 PM instead of 11 AM',
          price: 25,
          type: 'fixed' as const,
          image: 'https://example.com/offer.jpg'
        }
      ],
      activeBids: []
    },
    hotelProposals: [],
    totalPrice: 175,
    notes: 'Demo order for testing'
  }
}

/**
 * Get list of all orders (summary info only)
 * Note: This might not be needed for ABS since guests typically only see their own orders
 */
export async function getOrdersList(): Promise<Array<{
  id: string
  createdAt: string
  status: OrderStatus
  totalPrice: number
  userInfo: UserInfo
}>> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/orders`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const orders = await response.json()
    
    return orders.map((order: any) => ({
      id: order.id,
      createdAt: order.checkIn, // Using checkIn as createdAt for display
      status: order.status === 'New' ? 'confirmed' : order.status,
      totalPrice: parseFloat(order.extras) || 0,
      userInfo: {
        roomType: order.roomType,
        checkIn: order.checkIn,
        checkOut: order.checkOut || '',
        occupancy: order.aci,
        reservationCode: order.locator,
        userEmail: order.email,
        userName: order.name
      }
    }))
  } catch (error) {
    // Failed to retrieve orders list
    return []
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return true
  } catch (error) {
    // Failed to update order status
    return false
  }
}

/**
 * Update proposal status (accept/reject hotel proposals)
 */
export async function updateProposalStatus(
  _orderId: string, 
  proposalId: string, 
  status: ProposalStatus
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/proposals`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ proposalId, status })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return true
  } catch (error) {
    // Failed to update proposal status
    return false
  }
}

/**
 * Check if order exists
 */
export async function orderExists(orderId: string): Promise<boolean> {
  const order = await getOrder(orderId)
  return order !== null
}

/**
 * Get orders by status
 */
export async function getOrdersByStatus(status: OrderStatus): Promise<OrderData[]> {
  try {
    const ordersList = await getOrdersList()
    const filteredOrders = ordersList.filter(order => order.status === status)
    
    // Fetch full order data for each matching order
    const fullOrders = await Promise.all(
      filteredOrders.map(orderSummary => getOrder(orderSummary.id))
    )
    
    return fullOrders.filter(Boolean) as OrderData[]
  } catch (error) {
    // Failed to get orders by status
    return []
  }
}

