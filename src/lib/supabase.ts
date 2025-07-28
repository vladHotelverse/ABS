import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface Order {
  id: string
  user_email: string
  user_name?: string
  reservation_code?: string
  check_in: string
  check_out?: string
  room_type: string
  occupancy?: string
  status: 'pending' | 'confirmed' | 'modified' | 'cancelled'
  total_price: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  type: 'room_upgrade' | 'customization' | 'special_offer'
  item_id: string
  name: string
  description?: string
  price: number
  quantity: number
  metadata?: Record<string, any>
  created_at: string
}

export interface HotelProposal {
  id: string
  order_id: string
  type: 'room_change' | 'item_substitution' | 'upgrade_offer' | 'price_change'
  title: string
  description: string
  price_difference: number
  original_item_id?: string
  proposed_item_data?: Record<string, any>
  status: 'pending' | 'accepted' | 'rejected'
  expires_at?: string
  created_at: string
  updated_at: string
}