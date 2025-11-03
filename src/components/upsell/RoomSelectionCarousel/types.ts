import type { ReactNode } from 'react'

export enum MediaType {
  Unknown = 0,
  Image = 1,
  Video = 2,
  Image180 = 3,
  Image360 = 4,
}

export type SegmentType =
  | 'business'
  | 'leisure'
  | 'luxury'
  | 'budget'
  | 'family'
  | 'loyalty'
  | 'group'
  | 'extended-stay'

export interface SegmentDiscount {
  segmentType: SegmentType
  discountAmount: number
  discountType: 'percentage' | 'fixed'
  label: string
  priority: number // Higher number = higher priority for display
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gold'
}

/**
 * Image object with main URL and optional thumbnail
 * - url: The full-resolution image URL for display
 * - thumbnailUrl: Optional lower-resolution URL for thumbnails/previews
 */
export interface MultimediaImage {
  url: string // Full-resolution image URL
  thumbnailUrl?: string // Optional thumbnail URL for previews
}

/**
 * Simplified Multimedia structure - images are pre-processed at the data layer
 * Each image has both display URL and optional thumbnail URL
 */
export interface Multimedia {
  images: MultimediaImage[] // Images with optional thumbnails
  videos: string[] // Video URLs
  matterport?: string // Matterport URL
}

/**
 * Media type for UI layer - mirrors the backend enum to keep compatibility
 */

/**
 * MediaItem represents a single media asset (image, video, or immersive tour)
 * Used for rendering in carousels and galleries
 */
export interface MediaItem {
  type: MediaType
  url: string // URL to display
  thumbnailUrl?: string // Optional thumbnail URL for images
}

export interface RoomOption {
  id: string
  title?: string
  roomType: string
  description: string | ReactNode // Pre-parsed HTML from data layer
  amenities?: string[] // Full amenities list (may be used by app layer for various purposes)
  displayAmenities?: string[] // Pre-selected amenities for display (e.g., top 3)
  price: string
  oldPrice?: number
  images?: string[] // Deprecated: use multimedia.images instead
  multimedia?: Multimedia
  mediaItems?: MediaItem[] // Pre-flattened media items for display (preferred over multimedia)
  segmentDiscount?: SegmentDiscount
}

export interface RoomSelectionCarouselTranslations {
  // Room actions
  learnMoreText: string
  selectedText: string
  selectText: string

  // Price and currency
  nightText: string
  priceInfoText: string
  currencySymbol: string

  // Segment badges
  segmentLabels?: {
    business: string
    leisure: string
    luxury: string
    budget: string
    family: string
    loyalty: string
    group: string
    'extended-stay': string
  }

  // Empty state
  noRoomsAvailableText: string

  // Navigation labels (for accessibility)
  navigationLabels: {
    previousRoom: string
    nextRoom: string
    previousRoomMobile: string
    nextRoomMobile: string
    goToRoom: string // Template: 'Go to room {index}'
    previousImage: string
    nextImage: string
    viewImage: string // Template: 'View image {index}'
  }

  upgradeNowText?: string
  removeText?: string
}

// Carousel state types (simplified since we removed the old hook)
export interface CarouselState {
  activeIndex: number
  activeImageIndices: Record<number, number>
  selectedRoom: RoomOption | null
}

// RoomCard specific interfaces
export interface RoomCardTranslations {
  nightText: string
  learnMoreText: string
  priceInfoText: string
  selectedText: string
  selectText: string
  removeText: string
  instantConfirmationText?: string
  previousImageLabel?: string
  nextImageLabel?: string
  viewImageLabel?: string | ((index: number) => string) // Template: 'View image {index}' or function
  totalPriceText?: string
}

export interface RoomCardHandlers {
  onSelectRoom?: (room: RoomOption | null) => void
  onImageChange?: (newImageIndex: number) => void
  onLearnMore?: (room: RoomOption) => void
}

export interface RoomCardConfig {
  currencySymbol?: string
  isActive?: boolean
  roomIndex?: number
  enableHoverZoom?: boolean
  readonly?: boolean
}

export interface RoomCardState {
  selectedRoom: RoomOption | null
  activeImageIndex: number
}

export interface RoomCardProps {
  room: RoomOption
  translations: RoomCardTranslations
  handlers?: RoomCardHandlers
  config?: RoomCardConfig
  state: RoomCardState
}

// RoomUpgradeCarousel specific interface - uses subset of main translations
export interface RoomUpgradeCarouselTranslations {
  currencySymbol: string
  nightText: string
  learnMoreText: string
  priceInfoText: string
  selectedText: string
  selectText: string
  removeText: string
  previousImageLabel: string
  nextImageLabel: string
  viewImageLabel: (index: number) => string
  instantConfirmationText?: string
}

export interface RoomUpgradeCarouselProps {
  roomOptions: RoomOption[]
  initialSelectedRoom: RoomOption | null
  onRoomSelected?: (room: RoomOption | null) => void
  translations: RoomUpgradeCarouselTranslations
  className?: string
  enableHoverZoom?: boolean
}
