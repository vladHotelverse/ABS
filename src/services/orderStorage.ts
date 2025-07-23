/**
 * Order Storage Service
 * Manages persistence and retrieval of booking order data
 */

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

// Storage key constants
const STORAGE_KEYS = {
  ORDERS: 'abs_orders',
  ORDER_PREFIX: 'abs_order_'
} as const

/**
 * Save order data to storage
 */
export function saveOrder(orderData: OrderData): boolean {
  try {
    // Save individual order
    const orderKey = `${STORAGE_KEYS.ORDER_PREFIX}${orderData.id}`
    localStorage.setItem(orderKey, JSON.stringify(orderData))
    
    // Update orders index
    const existingOrders = getOrdersList()
    const updatedOrders = existingOrders.filter(order => order.id !== orderData.id)
    updatedOrders.push({
      id: orderData.id,
      createdAt: orderData.createdAt,
      status: orderData.status,
      totalPrice: orderData.totalPrice,
      userInfo: orderData.userInfo
    })
    
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders))
    return true
  } catch (error) {
    console.error('Failed to save order:', error)
    return false
  }
}

/**
 * Retrieve order data by ID
 */
export function getOrder(orderId: string): OrderData | null {
  try {
    const orderKey = `${STORAGE_KEYS.ORDER_PREFIX}${orderId}`
    const orderDataStr = localStorage.getItem(orderKey)
    
    if (!orderDataStr) {
      return null
    }
    
    return JSON.parse(orderDataStr) as OrderData
  } catch (error) {
    console.error('Failed to retrieve order:', error)
    return null
  }
}

/**
 * Get list of all orders (summary info only)
 */
export function getOrdersList(): Array<{
  id: string
  createdAt: string
  status: OrderStatus
  totalPrice: number
  userInfo: UserInfo
}> {
  try {
    const ordersStr = localStorage.getItem(STORAGE_KEYS.ORDERS)
    if (!ordersStr) {
      return []
    }
    
    return JSON.parse(ordersStr)
  } catch (error) {
    console.error('Failed to retrieve orders list:', error)
    return []
  }
}

/**
 * Update order status
 */
export function updateOrderStatus(orderId: string, status: OrderStatus): boolean {
  try {
    const order = getOrder(orderId)
    if (!order) {
      return false
    }
    
    order.status = status
    order.updatedAt = new Date().toISOString()
    
    return saveOrder(order)
  } catch (error) {
    console.error('Failed to update order status:', error)
    return false
  }
}

/**
 * Add hotel proposal to order
 */
export function addProposalToOrder(orderId: string, proposal: ProposalItem): boolean {
  try {
    const order = getOrder(orderId)
    if (!order) {
      return false
    }
    
    order.hotelProposals.push(proposal)
    order.updatedAt = new Date().toISOString()
    
    return saveOrder(order)
  } catch (error) {
    console.error('Failed to add proposal to order:', error)
    return false
  }
}

/**
 * Update proposal status
 */
export function updateProposalStatus(
  orderId: string, 
  proposalId: string, 
  status: ProposalStatus
): boolean {
  try {
    const order = getOrder(orderId)
    if (!order) {
      return false
    }
    
    const proposal = order.hotelProposals.find(p => p.id === proposalId)
    if (!proposal) {
      return false
    }
    
    proposal.status = status
    order.updatedAt = new Date().toISOString()
    
    // If proposal is accepted, update order status
    if (status === 'accepted') {
      order.status = 'modified'
    }
    
    return saveOrder(order)
  } catch (error) {
    console.error('Failed to update proposal status:', error)
    return false
  }
}

/**
 * Delete order from storage
 */
export function deleteOrder(orderId: string): boolean {
  try {
    // Remove individual order
    const orderKey = `${STORAGE_KEYS.ORDER_PREFIX}${orderId}`
    localStorage.removeItem(orderKey)
    
    // Update orders index
    const existingOrders = getOrdersList()
    const updatedOrders = existingOrders.filter(order => order.id !== orderId)
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders))
    
    return true
  } catch (error) {
    console.error('Failed to delete order:', error)
    return false
  }
}

/**
 * Clear all orders from storage (for development/testing)
 */
export function clearAllOrders(): boolean {
  try {
    const orders = getOrdersList()
    orders.forEach(order => {
      const orderKey = `${STORAGE_KEYS.ORDER_PREFIX}${order.id}`
      localStorage.removeItem(orderKey)
    })
    
    localStorage.removeItem(STORAGE_KEYS.ORDERS)
    return true
  } catch (error) {
    console.error('Failed to clear all orders:', error)
    return false
  }
}

/**
 * Check if order exists
 */
export function orderExists(orderId: string): boolean {
  return getOrder(orderId) !== null
}

/**
 * Get orders by status
 */
export function getOrdersByStatus(status: OrderStatus): OrderData[] {
  try {
    const ordersList = getOrdersList()
    const filteredOrders = ordersList.filter(order => order.status === status)
    
    return filteredOrders.map(orderSummary => getOrder(orderSummary.id)).filter(Boolean) as OrderData[]
  } catch (error) {
    console.error('Failed to get orders by status:', error)
    return []
  }
}