import type { SegmentDiscount } from '../ABS_RoomSelectionCarousel/types'
import type { ExtendedPricingItem } from '../../types/shared'

// Unified pricing item interface to reduce conversion complexity
// Now extends ExtendedPricingItem for full compatibility
export interface PricingItem extends ExtendedPricingItem {
  // This interface now inherits all fields from ExtendedPricingItem
  // Maintaining backward compatibility while ensuring type safety
}

// Legacy PricingItem for components that haven't been migrated yet
export interface LegacyPricingItem {
  id: string | number
  name: string
  price: number
  type: 'room' | 'customization' | 'offer' | 'bid'
  category?: string
  concept?: 'choose-your-superior-room' | 'customize-your-room' | 'enhance-your-stay' | 'choose-your-room' | 'bid-for-upgrade'
  bidStatus?: 'pending' | 'submitted' | 'accepted' | 'rejected' | 'expired'
  itemStatus?: 'sent_to_hotel' | 'accepted_by_hotel' | 'rejected_by_hotel'
  statusDescription?: string
  segmentDiscount?: SegmentDiscount
  // For customizations: store original option ID to match with UI selection state
  originalOptionId?: string
}

// Available section interface
export interface AvailableSection {
  type: 'room' | 'customization' | 'offer'
  label: string
  description?: string
  startingPrice?: number
  isAvailable: boolean
  onClick?: () => void
  concept?: 'choose-your-superior-room' | 'customize-your-room' | 'enhance-your-stay' | 'choose-your-room'
}

// Consolidated translation labels interface
export interface PricingLabels {
  selectedRoomLabel: string
  upgradesLabel: string
  specialOffersLabel: string
  chooseYourSuperiorRoomLabel: string
  customizeYourRoomLabel: string
  enhanceYourStayLabel: string
  chooseYourRoomLabel: string
  subtotalLabel: string
  taxesLabel: string
  totalLabel: string
  payAtHotelLabel: string
  viewTermsLabel: string
  confirmButtonLabel: string
  noUpgradesSelectedLabel: string
  noOffersSelectedLabel: string
  emptyCartMessage: string
  editLabel: string
  roomRemovedMessage: string
  offerRemovedMessagePrefix: string
  customizationRemovedMessagePrefix: string
  addedMessagePrefix: string
  euroSuffix: string
  loadingLabel: string
  roomImageAltText: string
  removeRoomUpgradeLabel: string
  exploreLabel: string
  fromLabel: string
  customizeStayTitle: string
  chooseOptionsSubtitle: string

  // Error messages (i18n)
  missingLabelsError: string
  invalidPricingError: string
  currencyFormatError: string
  performanceWarning: string

  // Accessibility labels (i18n)
  notificationsLabel: string
  closeNotificationLabel: string
  pricingSummaryLabel: string
  processingLabel: string
  bidForUpgradeLabel: string
}

// Main props interface
export interface PricingSummaryPanelProps {
  className?: string
  roomImage?: string
  items?: PricingItem[]
  pricing?: {
    subtotal: number
    taxes?: number
  }
  isLoading?: boolean
  availableSections?: AvailableSection[]
  labels: PricingLabels
  currency?: string
  locale?: string
  onRemoveItem: (itemId: string | number, itemName: string, itemType: PricingItem['type']) => void
  onConfirm?: () => void
  onEditSection?: (section: 'room' | 'customizations' | 'offers') => void
}

// Re-export Toast interface from hooks for external consumers
export type { Toast } from './hooks/useToasts'
