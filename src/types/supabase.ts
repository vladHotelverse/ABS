// Supabase database types
export interface Translation {
  id: string
  key: string
  language: string
  value: string
  category?: string
  description?: string
  created_at: string
  updated_at: string
}

export interface RoomType {
  id: string
  room_code: string
  title: Record<string, string> // { en: "...", es: "..." }
  room_type: string
  description: Record<string, string>
  base_price: number
  main_image: string
  images?: string[]
  amenities?: string[]
  capacity?: number
  size_sqm?: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface CustomizationOption {
  id: string
  category: string
  option_code: string
  name: Record<string, string>
  description: Record<string, string>
  price: number
  icon?: string
  label?: Record<string, string>
  image_url?: string
  active: boolean
  sort_order?: number
  created_at: string
  updated_at: string
}

export interface SpecialOffer {
  id: string
  offer_code: string
  title: Record<string, string>
  description: Record<string, string>
  image: string
  base_price: number
  price_type: 'perPerson' | 'perNight' | 'perStay'
  requires_date_selection?: boolean
  allows_multiple_dates?: boolean
  max_quantity?: number
  active: boolean
  valid_from?: string
  valid_until?: string
  sort_order?: number
  created_at: string
  updated_at: string
}

export interface SectionConfig {
  id: string
  section_code: string
  language: string
  title: string
  description?: string
  info_text?: string
  icon?: string
  active: boolean
  sort_order?: number
  created_at: string
  updated_at: string
}

export interface CompatibilityRule {
  id: string
  option1_category: string
  option1_code: string
  option2_category: string
  option2_code: string
  rule_type: 'incompatible' | 'requires' | 'recommended'
  created_at: string
}

// Helper type for multilingual content
export type MultilingualContent<T> = {
  [K in keyof T]: T[K] extends string ? Record<string, string> : T[K]
}

// Database function return types
export interface TranslationMap {
  [key: string]: string
}

// Supabase query types
export type TranslationQuery = {
  language?: string
  category?: string
}

export type RoomTypeQuery = {
  active?: boolean
  room_code?: string
}

export type CustomizationQuery = {
  category?: string
  active?: boolean
}

export type SpecialOfferQuery = {
  active?: boolean
  valid_date?: string // to check if offer is valid for a specific date
}