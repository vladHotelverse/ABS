import type { ResolvedTranslations, RoomUpgradeCarouselTranslations } from '../types'

/**
 * Converts RoomUpgradeCarouselTranslations to ResolvedTranslations format
 * for use with shared hooks like useRoomCardProps
 */
export const adaptUpgradeTranslations = (
  upgradeTranslations: RoomUpgradeCarouselTranslations
): ResolvedTranslations => {
  // Handle undefined translations gracefully
  if (!upgradeTranslations) {
    return {
      learnMoreText: 'Learn More',
      selectedText: 'Selected',
      selectText: 'Select Room',
      nightText: '/night',
      priceInfoText: 'Prices include taxes and fees',
      currencySymbol: '€',
      navigationLabels: {
        previousRoom: 'Previous Room',
        nextRoom: 'Next Room',
        previousRoomMobile: 'Previous',
        nextRoomMobile: 'Next',
        goToRoom: 'Go to room {index}',
        previousImage: 'Previous Image',
        nextImage: 'Next Image',
        viewImage: 'View image {index}',
      },
      upgradeNowText: 'Select Room',
      removeText: 'Remove',
      noRoomsAvailableText: 'No rooms available',
      segmentLabels: {
        business: 'Business',
        leisure: 'Leisure',
        luxury: 'Luxury',
        budget: 'Budget',
        family: 'Family',
        loyalty: 'Loyalty',
        group: 'Group',
        'extended-stay': 'Extended Stay',
      },
    }
  }

  return {
    // Core translations
    learnMoreText: upgradeTranslations.learnMoreText,
    selectedText: upgradeTranslations.selectedText,
    selectText: upgradeTranslations.selectText,
    nightText: upgradeTranslations.nightText,
    priceInfoText: upgradeTranslations.priceInfoText,
    currencySymbol: upgradeTranslations.currencySymbol,

    // Navigation labels
    navigationLabels: {
      previousRoom: 'Previous Room',
      nextRoom: 'Next Room',
      previousRoomMobile: 'Previous',
      nextRoomMobile: 'Next',
      goToRoom: 'Go to room {index}',
      previousImage: upgradeTranslations.previousImageLabel,
      nextImage: upgradeTranslations.nextImageLabel,
      viewImage:
        typeof upgradeTranslations.viewImageLabel === 'function'
          ? upgradeTranslations.viewImageLabel(1).replace('1', '{index}')
          : 'View image {index}',
    },

    // Optional fields with defaults
    upgradeNowText: upgradeTranslations.selectText,
    removeText: upgradeTranslations.removeText,
    noRoomsAvailableText: 'No rooms available',

    // Segment labels (empty for upgrade carousel)
    segmentLabels: {
      business: 'Business',
      leisure: 'Leisure',
      luxury: 'Luxury',
      budget: 'Budget',
      family: 'Family',
      loyalty: 'Loyalty',
      group: 'Group',
      'extended-stay': 'Extended Stay',
    },
  }
}

/**
 * Creates a simple dynamic amenities map for upgrade scenarios
 * (just uses first 3 amenities for each room)
 */
export const createSimpleAmenitiesMap = (roomOptions: any[]): Map<string, string[]> => {
  const map = new Map<string, string[]>()
  roomOptions.forEach((room) => {
    map.set(room.id, room.amenities.slice(0, 3))
  })
  return map
}
