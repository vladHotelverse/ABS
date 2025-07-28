/**
 * Supabase Real-time utilities for ABS
 * Handles real-time subscriptions for guest order updates
 */

import { supabase } from './supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface ProposalNotification {
  orderId: string
  proposal: {
    id: string
    type: string
    title: string
    description: string
    price_difference: number
    status: string
  }
}

let proposalsChannel: RealtimeChannel | null = null
let orderChannel: RealtimeChannel | null = null

/**
 * Subscribe to hotel proposals for a specific order
 */
export function subscribeToOrderProposals(
  orderId: string, 
  onProposal: (notification: ProposalNotification) => void
) {
  // Clean up existing subscription
  if (proposalsChannel) {
    supabase.removeChannel(proposalsChannel)
  }
  
  proposalsChannel = supabase
    .channel(`order-${orderId}`)
    .on('broadcast', { event: 'new_proposal' }, (payload) => {
      console.log('New proposal received:', payload)
      onProposal(payload.payload as ProposalNotification)
    })
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'hotel_proposals',
        filter: `order_id=eq.${orderId}`
      },
      (payload) => {
        console.log('Proposal database change:', payload)
        if (payload.eventType === 'INSERT' && payload.new) {
          onProposal({
            orderId: orderId,
            proposal: payload.new as any
          })
        }
      }
    )
    .subscribe((status) => {
      console.log('Proposals subscription status:', status)
    })
  
  return proposalsChannel
}

/**
 * Subscribe to order status changes
 */
export function subscribeToOrderUpdates(
  orderId: string,
  onOrderUpdate: (order: any) => void
) {
  // Clean up existing subscription
  if (orderChannel) {
    supabase.removeChannel(orderChannel)
  }
  
  orderChannel = supabase
    .channel(`order-updates-${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`
      },
      (payload) => {
        console.log('Order update received:', payload)
        if (payload.new) {
          onOrderUpdate(payload.new)
        }
      }
    )
    .subscribe((status) => {
      console.log('Order updates subscription status:', status)
    })
  
  return orderChannel
}

/**
 * Send proposal response back to hotel
 */
export function sendProposalResponse(orderId: string, proposalId: string, status: 'accepted' | 'rejected') {
  const channel = supabase.channel(`hotel-notifications`)
  
  channel
    .send({
      type: 'broadcast',
      event: 'proposal_response',
      payload: { orderId, proposalId, status }
    })
    .then(() => {
      console.log('Proposal response sent to hotel')
    })
    .catch((error) => {
      console.error('Failed to send proposal response:', error)
    })
}

/**
 * Clean up all subscriptions
 */
export function unsubscribeAll() {
  if (proposalsChannel) {
    supabase.removeChannel(proposalsChannel)
    proposalsChannel = null
  }
  
  if (orderChannel) {
    supabase.removeChannel(orderChannel)
    orderChannel = null
  }
}

/**
 * Show notification to user
 */
export function showNotification(title: string, message: string, type: 'info' | 'success' | 'warning' = 'info') {
  // You could integrate with a toast library here
  console.log(`${type.toUpperCase()}: ${title} - ${message}`)
  
  // Simple browser notification (requires permission)
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: '/h-logo.png'
    })
  }
}

/**
 * Request notification permission
 */
export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}