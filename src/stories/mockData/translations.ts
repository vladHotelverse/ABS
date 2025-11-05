import type { RoomUpgradeCarouselTranslations } from '@/components/upsell/RoomSelectionCarousel/types'

export const upgradeCarouselTranslations: RoomUpgradeCarouselTranslations = {
  currencySymbol: '€',
  nightText: 'night',
  learnMoreText: 'View details',
  priceInfoText: 'Per night, taxes included',
  selectedText: 'Selected',
  selectText: 'Select room',
  removeText: 'Remove',
  previousImageLabel: 'Previous image',
  nextImageLabel: 'Next image',
  viewImageLabel: (index: number) => `View image ${index}`,
  instantConfirmationText: 'Instant confirmation',
}

export const layoutUpgradeTranslations: RoomUpgradeCarouselTranslations = {
  ...upgradeCarouselTranslations,
  selectText: 'UPGRADE NOW',
  removeText: 'REMOVE',
}

export const bookingViewTranslations: Record<string, string> = {
  'booking.view.upgradeCost': 'Upgrade Cost',
  'booking.view.upgraded': 'Upgraded',
  'booking.view.priceBreakdown': 'Price Breakdown',
  'booking.view.upgrades': 'Upgrades',
  'booking.view.specialOffers': 'Special Offers',
  'booking.view.customizations': 'Customizations',
  'booking.view.grandTotal': 'Grand Total',
  'booking.view.noPriceBreakdown': 'No price breakdown available',
  'booking.view.andMore': 'and {{count}} more...',
  'booking.cancelRequest': 'Cancel request',
}

export const bookingAccordionTranslations: Record<string, string> = {
  'booking.view.upgradeCost': 'Superior Room Selection',
  'booking.view.upgraded': 'Upgraded',
  'booking.view.priceBreakdown': 'Price Breakdown',
  'booking.view.upgrades': 'Upgrades',
  'booking.view.specialOffers': 'Special Offers',
  'booking.view.customizations': 'Customizations',
  'booking.view.grandTotal': 'Grand Total',
  'booking.view.noPriceBreakdown': 'No price breakdown available',
  'booking.view.andMore': 'and {{count}} more...',
  'booking.cancelRequest': 'Cancel request',
}
