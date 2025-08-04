import type { RoomType, CustomizationOption, SpecialOffer, SectionConfig, CompatibilityRule, TranslationMap } from '@/types/supabase'
import type { RoomOption, SpecialOffer as ComponentSpecialOffer } from '@/components/ABS_Landing/sections'
import type { SectionConfig as ComponentSectionConfig, CustomizationOption as ComponentCustomizationOption, ViewOption, ExactViewOption, SpecialOfferOption, CompatibilityRules } from '@/components/ABS_RoomCustomization/types'
import type { Translations } from '@/components/ABS_Landing/ABS_Landing'
import { Bed, Hotel, Waves, Eye, Compass, Home, ArrowUp, Star } from 'lucide-react'

// Convert RoomType to RoomOption
export function convertRoomType(room: RoomType, language: string = 'en'): RoomOption {
  return {
    id: room.room_code,
    title: room.title[language] || room.title.en,
    roomType: room.room_type,
    description: room.description[language] || room.description.en,
    price: room.base_price,
    image: room.main_image,
    images: room.images || [],
    amenities: room.amenities || [],
  }
}

// Convert CustomizationOption to component format
export function convertCustomizationOption(option: CustomizationOption, language: string = 'en'): ComponentCustomizationOption {
  return {
    id: option.option_code,
    label: option.name[language] || option.name.en,
    description: option.description[language] || option.description.en,
    price: option.price,
    icon: option.icon || 'circle',
  }
}

// Convert view options specifically (they might have images)
export function convertViewOption(option: CustomizationOption, language: string = 'en'): ViewOption | ExactViewOption {
  const baseOption = {
    id: option.option_code,
    name: option.name[language] || option.name.en,
    description: option.description[language] || option.description.en,
    price: option.price,
    icon: option.icon || 'eye',
    label: option.label?.[language] || option.label?.en || option.name[language] || option.name.en,
  }

  // If it has an image_url, it's an ExactViewOption
  if (option.image_url) {
    return {
      ...baseOption,
      imageUrl: option.image_url,
    } as ExactViewOption
  }

  return baseOption as ViewOption
}

// Convert special offer options (for upgrade packages)
export function convertSpecialOfferOption(option: CustomizationOption, language: string = 'en', currentRoomAmenities: string[] = []): SpecialOfferOption {
  // Import room options from mock data to ensure consistency
  let roomOptions: any[] = []
  
  try {
    // Dynamically import room options to avoid circular dependencies
    roomOptions = [
      {
        id: 'deluxe',
        title: "Live luxury's pinnacle by the sea",
        roomType: 'DELUXE GOLD',
        price: 22,
        amenities: ['24 Hours Room Service', '30 to 35 m2 / 325 to 375 sqft', 'AC', 'Balcony', 'Bathrobe and slippers', 'Bluetooth sound system']
      },
      {
        id: 'deluxe-swim-up',
        title: "Dive in from your private terrace",
        roomType: 'DELUXE SWIM-UP',
        price: 31,
        amenities: ['24 Hours Room Service', '30 to 35 m2 / 325 to 375 sqft', 'AC', 'Afternoon Sun', 'Bathrobe and slippers', 'Bluetooth sound system']
      },
      {
        id: 'rocksuite',
        title: "Supreme luxury with divine views",
        roomType: 'ROCK SUITE',
        price: 89,
        amenities: ['60 to 70 m2 / 645 to 755 sqft', 'AC', 'Balcony', 'Bluetooth sound system', 'Coffee Machine', 'Hydromassage Bathtub']
      },
      {
        id: '80s-suite',
        title: "80s nostalgia unleashed",
        roomType: '80S SUITE',
        price: 120,
        amenities: ['60 to 70 m2 / 645 to 755 sqft', 'AC', 'Balcony', 'Coffee Machine', 'Hydromassage Bathtub', 'King Size Bed']
      },
      {
        id: 'rock-suite-diamond',
        title: "Glam rock with infinite views",
        roomType: 'ROCK SUITE DIAMOND',
        price: 199,
        amenities: ['60 to 70 m2 / 645 to 755 sqft', 'AC', 'Balcony', 'Bluetooth sound system', 'Coffee Machine', 'Hydromassage Bathtub']
      },
      {
        id: 'rock-suite-legend',
        title: "Live the rock legend",
        roomType: 'ROCK SUITE LEGEND',
        price: 300,
        amenities: ['60 to 70 m2 / 645 to 755 sqft', 'AC', 'Balcony', 'Bluetooth sound system', 'Coffee Machine', 'Hydromassage Bathtub']
      }
    ]
  } catch (error) {
    console.warn('Could not load room options for special offer mapping')
  }

  // Parse additional amenities from description or use a predefined list
  const additionalAmenities = getAdditionalAmenitiesForOffer(option.option_code, language)
  
  // Map option code to room ID for consistency
  const roomMapping: Record<string, string> = {
    'deluxe_experience': 'deluxe',
    'deluxe_gold_offer': 'deluxe',
    'swim_up_offer': 'deluxe-swim-up',
    'rock_suite_offer': 'rocksuite',
    'eighties_suite_offer': '80s-suite',
    // Handle old codes for backwards compatibility - map to appropriate rooms
    'premium_business': 'deluxe-swim-up',
    'romantic_getaway': 'rocksuite', 
    'wellness_spa': 'rock-suite-diamond'
  }
  
  const targetRoomId = roomMapping[option.option_code] || option.option_code
  const matchingRoom = roomOptions.find(room => room.id === targetRoomId)
  
  return {
    id: option.option_code,
    claim: option.name[language] || option.name.en,
    price: option.price,
    additionalAmenities,
    targetRoomId,
    currentRoomAmenities,
    // Add room data for consistency
    roomTitle: matchingRoom?.title,
    roomType: matchingRoom?.roomType,
    roomAmenities: matchingRoom?.amenities,
    roomPrice: matchingRoom?.price
  }
}

// Helper function to get additional amenities for special offers
function getAdditionalAmenitiesForOffer(offerCode: string, language: string = 'en'): string[] {
  const amenitiesMap: Record<string, Record<string, string[]>> = {
    'deluxe_experience': {
      'es': ['Vista al mar', 'Jacuzzi', 'Desayuno incluido', 'Acceso al spa'],
      'en': ['Sea View', 'Jacuzzi', 'Breakfast Included', 'Spa Access']
    },
    'premium_business': {
      'es': ['Escritorio de trabajo', 'Cafetera Nespresso', 'Zona de trabajo', 'Servicio de conserjería'],
      'en': ['Work Desk', 'Nespresso Machine', 'Work Area', 'Concierge Service']
    },
    'romantic_getaway': {
      'es': ['Terraza privada', 'Mini bar', 'Servicio de habitación 24h', 'Amenidades de lujo'],
      'en': ['Private Terrace', 'Minibar', '24h Room Service', 'Luxury Amenities']
    },
    'wellness_spa': {
      'es': ['Acceso al spa', 'Acceso al gimnasio', 'Piscina privada', 'Servicio de conserjería'],
      'en': ['Spa Access', 'Gym Access', 'Private Pool', 'Concierge Service']
    },
  }
  
  return amenitiesMap[offerCode]?.[language] || amenitiesMap[offerCode]?.['en'] || []
}

// Convert SpecialOffer to component format
export function convertSpecialOffer(offer: SpecialOffer, language: string = 'en'): ComponentSpecialOffer {
  // Create a simple hash of the offer_code for the numeric ID
  const hashCode = (str: string): number => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  return {
    id: hashCode(offer.offer_code), // Convert offer_code to numeric ID
    title: offer.title[language] || offer.title.en,
    description: offer.description[language] || offer.description.en,
    image: offer.image,
    price: offer.base_price,
    type: offer.price_type,
    requiresDateSelection: offer.requires_date_selection,
    allowsMultipleDates: offer.allows_multiple_dates,
  }
}

// Convert SectionConfig to component format
export function convertSectionConfig(section: SectionConfig): ComponentSectionConfig {
  // Map icon names to Lucide React components
  const iconMap: Record<string, any> = {
    'Bed': Bed,
    'Hotel': Hotel,
    'Waves': Waves,
    'Eye': Eye,
    'Compass': Compass,
    'Home': Home,
    'ArrowUp': ArrowUp,
    'Star': Star,
  }

  return {
    key: section.section_code, // Use section_code as the key
    title: section.title,
    icon: iconMap[section.icon || 'Hotel'] || Hotel,
    infoText: section.info_text,
    isSpecialOffer: section.section_code === 'specialOffers',
  }
}

// Convert compatibility rules to component format
export function convertCompatibilityRules(rules: CompatibilityRule[]): CompatibilityRules {
  // Default empty compatibility rules if no rules provided
  if (!rules || rules.length === 0) {
    return {
      mutuallyExclusive: [],
      conflicts: [],
    }
  }

  const compatibilityRules: CompatibilityRules = {
    mutuallyExclusive: [],
    conflicts: [],
  }

  // Group incompatible rules by option pairs to create mutually exclusive groups
  const incompatibleGroups = new Map<string, Set<string>>()
  const conflictRules: Array<{ option: string; disables: string; reason?: string }> = []

  rules.forEach((rule) => {
    const option1 = rule.option1_code
    const option2 = rule.option2_code

    if (rule.rule_type === 'incompatible') {
      // Add to mutually exclusive groups
      if (!incompatibleGroups.has(option1)) {
        incompatibleGroups.set(option1, new Set([option1]))
      }
      if (!incompatibleGroups.has(option2)) {
        incompatibleGroups.set(option2, new Set([option2]))
      }
      
      // Merge the groups
      const group1 = incompatibleGroups.get(option1)!
      const group2 = incompatibleGroups.get(option2)!
      
      const mergedGroup = new Set([...group1, ...group2])
      mergedGroup.forEach(opt => incompatibleGroups.set(opt, mergedGroup))
    } else if (rule.rule_type === 'requires') {
      // Convert "requires" to a conflict rule (if option1 is selected, option2 must be available)
      conflictRules.push({
        option: option1,
        disables: option2,
        reason: `${option1} requires ${option2}`
      })
    }
  })

  // Convert incompatible groups to mutually exclusive format
  const processedGroups = new Set<Set<string>>()
  incompatibleGroups.forEach((group) => {
    if (!processedGroups.has(group) && group.size > 1) {
      compatibilityRules.mutuallyExclusive.push({
        options: Array.from(group),
        reason: 'These options cannot be selected together'
      })
      processedGroups.add(group)
    }
  })

  // Add conflict rules
  conflictRules.forEach(rule => {
    compatibilityRules.conflicts.push({
      option: rule.option,
      disables: [rule.disables],
      reason: rule.reason
    })
  })

  return compatibilityRules
}

// Convert TranslationMap to Translations interface
export function convertTranslations(translationMap: TranslationMap): Translations {
  // Start with a base translations object with all required fields
  const translations: Translations = {
    // Room section
    roomTitle: translationMap.roomTitle || 'Choose your Superior Room!',
    roomSubtitle: translationMap.roomSubtitle || 'Choose from our selection of premium rooms and suites',
    selectText: translationMap.selectText || 'Select',
    selectedText: translationMap.selectedText || 'Selected',
    nightText: translationMap.nightText || 'night',
    learnMoreText: translationMap.learnMoreText || 'Learn More',
    priceInfoText: translationMap.priceInfoText || 'Price includes all taxes and fees',
    makeOfferText: translationMap.makeOfferText || 'Make Offer',
    proposePriceText: translationMap.proposePriceText || 'Propose your price:',
    availabilityText: translationMap.availabilityText || 'Subject to availability',
    offerMadeText: translationMap.offerMadeText || 'You have proposed ${price} EUR per night',
    bidSubmittedText: translationMap.bidSubmittedText || 'Bid submitted',
    updateBidText: translationMap.updateBidText || 'Update bid',
    cancelBidText: translationMap.cancelBidText || 'Cancel',

    // Customization section
    customizeTitle: translationMap.customizeTitle || 'Customize Your Stay',
    customizeSubtitle: translationMap.customizeSubtitle || 'Personalize your room for the perfect experience',
    bedsTitle: translationMap.bedsTitle || 'Beds',
    locationTitle: translationMap.locationTitle || 'Location',
    floorTitle: translationMap.floorTitle || 'Floor',
    viewTitle: translationMap.viewTitle || 'View',

    // Special offers section
    offersTitle: translationMap.offersTitle || 'Enhance your stay',
    offersSubtitle: translationMap.offersSubtitle || 'Enhance your stay with these exclusive offers',
    specialOffersLabels: {
      perStay: translationMap['specialOffersLabels.perStay'] || 'per stay',
      perPerson: translationMap['specialOffersLabels.perPerson'] || 'per person',
      perNight: translationMap['specialOffersLabels.perNight'] || 'per night',
      total: translationMap['specialOffersLabels.total'] || 'Total',
      bookNow: translationMap['specialOffersLabels.bookNow'] || 'Book Now',
      numberOfPersons: translationMap['specialOffersLabels.numberOfPersons'] || 'Number of Persons',
      numberOfNights: translationMap['specialOffersLabels.numberOfNights'] || 'Number of Nights',
      addedLabel: translationMap['specialOffersLabels.addedLabel'] || 'Added',
      popularLabel: translationMap['specialOffersLabels.popularLabel'] || 'Popular',
      personsTooltip: translationMap['specialOffersLabels.personsTooltip'] || 'Number of persons for this offer',
      personsSingularUnit: translationMap['specialOffersLabels.personsSingularUnit'] || 'person',
      personsPluralUnit: translationMap['specialOffersLabels.personsPluralUnit'] || 'persons',
      nightsTooltip: translationMap['specialOffersLabels.nightsTooltip'] || 'Number of nights for this offer',
      nightsSingularUnit: translationMap['specialOffersLabels.nightsSingularUnit'] || 'night',
      nightsPluralUnit: translationMap['specialOffersLabels.nightsPluralUnit'] || 'nights',
      personSingular: translationMap['specialOffersLabels.personSingular'] || 'person',
      personPlural: translationMap['specialOffersLabels.personPlural'] || 'people',
      nightSingular: translationMap['specialOffersLabels.nightSingular'] || 'night',
      nightPlural: translationMap['specialOffersLabels.nightPlural'] || 'nights',
      removeOfferLabel: translationMap['specialOffersLabels.removeOfferLabel'] || 'Remove Offer',
      decreaseQuantityLabel: translationMap['specialOffersLabels.decreaseQuantityLabel'] || 'Decrease Quantity',
      increaseQuantityLabel: translationMap['specialOffersLabels.increaseQuantityLabel'] || 'Increase Quantity',
      selectDateLabel: translationMap['specialOffersLabels.selectDateLabel'] || 'Select Date',
      selectDateTooltip: translationMap['specialOffersLabels.selectDateTooltip'] || 'Choose a date for this offer',
      dateRequiredLabel: translationMap['specialOffersLabels.dateRequiredLabel'] || 'Date required',
    },

    // Booking state section
    loadingLabel: translationMap.loadingLabel || 'Loading...',
    errorTitle: translationMap.errorTitle || 'Oops! Something went wrong',
    errorMessage: translationMap.errorMessage || 'Sorry, there was an error loading the booking information. Please try again later.',
    tryAgainLabel: translationMap.tryAgainLabel || 'Try Again',
    bookingConfirmedTitle: translationMap.bookingConfirmedTitle || 'Booking Confirmed!',
    confirmationMessage: translationMap.confirmationMessage || 'Your room customization has been saved successfully. Thank you for personalizing your stay!',
    backToHomeLabel: translationMap.backToHomeLabel || 'Back to Home',

    // Pricing and cart
    emptyCartMessage: translationMap.emptyCartMessage || 'Select a room and customize your stay to see your booking summary here.',
    totalLabel: translationMap.totalLabel || 'Total',
    currencySymbol: translationMap.currencySymbol || '€',
    selectedRoomLabel: translationMap.selectedRoomLabel || 'Selected Room',
    upgradesLabel: translationMap.upgradesLabel || 'Upgrades',
    specialOffersLabel: translationMap.specialOffersLabel || 'Special Offers',
    chooseYourSuperiorRoomLabel: translationMap.chooseYourSuperiorRoomLabel || 'Choose Your Superior Room',
    customizeYourRoomLabel: translationMap.customizeYourRoomLabel || 'Customize Your Room',
    enhanceYourStayLabel: translationMap.enhanceYourStayLabel || 'Enhance Your Stay',
    chooseYourRoomLabel: translationMap.chooseYourRoomLabel || 'Choose Your Room',
    subtotalLabel: translationMap.subtotalLabel || 'Subtotal',
    taxesLabel: translationMap.taxesLabel || 'Taxes',
    payAtHotelLabel: translationMap.payAtHotelLabel || 'Pay at Hotel',
    viewTermsLabel: translationMap.viewTermsLabel || 'View Terms',
    confirmButtonLabel: translationMap.confirmButtonLabel || 'Confirm Booking',
    noUpgradesSelectedLabel: translationMap.noUpgradesSelectedLabel || 'No upgrades selected',
    noOffersSelectedLabel: translationMap.noOffersSelectedLabel || 'No offers selected',
    editLabel: translationMap.editLabel || 'Edit',
    roomRemovedMessage: translationMap.roomRemovedMessage || 'Room removed',
    offerRemovedMessagePrefix: translationMap.offerRemovedMessagePrefix || 'Offer removed: ',
    customizationRemovedMessagePrefix: translationMap.customizationRemovedMessagePrefix || 'Customization removed: ',
    addedMessagePrefix: translationMap.addedMessagePrefix || 'Added: ',
    euroSuffix: translationMap.euroSuffix || 'EUR',

    // Booking info
    checkInLabel: translationMap.checkInLabel || 'Check-in',
    checkOutLabel: translationMap.checkOutLabel || 'Check-out',
    occupancyLabel: translationMap.occupancyLabel || 'Occupancy',
    reservationCodeLabel: translationMap.reservationCodeLabel || 'Reservation Code',

    // UI text
    summaryButtonLabel: translationMap.summaryButtonLabel || 'View Summary',
    removeRoomUpgradeLabel: translationMap.removeRoomUpgradeLabel || 'Remove Room Upgrade',
    exploreLabel: translationMap.exploreLabel || 'Explore',
    roomImageAltText: translationMap.roomImageAltText || 'Room image',
    fromLabel: translationMap.fromLabel || 'from',
    customizeStayTitle: translationMap.customizeStayTitle || 'Customize Your Stay',
    chooseOptionsSubtitle: translationMap.chooseOptionsSubtitle || 'Choose your preferred options',

    // Multi-booking support
    multiBookingLabels: {
      multiRoomBookingsTitle: translationMap.multiRoomBookingsTitle || 'Multi-Room Bookings',
      roomsCountLabel: translationMap.roomsCountLabel || 'rooms',
      singleRoomLabel: translationMap.singleRoomLabel || 'room',
      clickToExpandLabel: translationMap.clickToExpandLabel || 'Click to expand',
      selectedRoomLabel: translationMap.selectedRoomLabel || 'Selected Room',
      upgradesLabel: translationMap.upgradesLabel || 'Upgrades',
      specialOffersLabel: translationMap.specialOffersLabel || 'Special Offers',
      chooseYourSuperiorRoomLabel: translationMap.chooseYourSuperiorRoomLabel || 'Choose Your Superior Room',
      customizeYourRoomLabel: translationMap.customizeYourRoomLabel || 'Customize Your Room',
      enhanceYourStayLabel: translationMap.enhanceYourStayLabel || 'Enhance Your Stay',
      chooseYourRoomLabel: translationMap.chooseYourRoomLabel || 'Choose Your Room',
      roomTotalLabel: translationMap.roomTotalLabel || 'Room Total',
      subtotalLabel: translationMap.subtotalLabel || 'Subtotal',
      totalLabel: translationMap.totalLabel || 'Total',
      payAtHotelLabel: translationMap.payAtHotelLabel || 'Pay at Hotel',
      viewTermsLabel: translationMap.viewTermsLabel || 'View Terms',
      confirmAllButtonLabel: translationMap.confirmAllButtonLabel || 'Confirm All Bookings',
      confirmingAllLabel: translationMap.confirmingAllLabel || 'Confirming All...',
      editLabel: translationMap.editLabel || 'Edit',
      addLabel: translationMap.addLabel || 'Add',
      addUpgradeTitle: translationMap.addUpgradeTitle || 'Add Upgrade',
      noUpgradesSelectedLabel: translationMap.noUpgradesSelectedLabel || 'No upgrades selected',
      noOffersSelectedLabel: translationMap.noOffersSelectedLabel || 'No offers selected',
      noMoreUpgradesLabel: translationMap.noMoreUpgradesLabel || 'No more upgrades available',
      noMoreOffersLabel: translationMap.noMoreOffersLabel || 'No more offers available',
      euroSuffix: translationMap.euroSuffix || 'EUR',
      nightsLabel: translationMap.nightsLabel || 'nights',
      nightLabel: translationMap.nightLabel || 'night',
      guestsLabel: translationMap.guestsLabel || 'guests',
      guestLabel: translationMap.guestLabel || 'guest',
      roomImageAltText: translationMap.roomImageAltText || 'Room image',
      removedSuccessfully: translationMap.removedSuccessfully || 'Removed successfully',
      addedSuccessfully: translationMap.addedSuccessfully || 'Added successfully',
      cannotRemoveRoom: translationMap.cannotRemoveRoom || 'Cannot remove room',
      itemAlreadyAdded: translationMap.itemAlreadyAdded || 'Item already added',
      notificationsLabel: translationMap.notificationsLabel || 'Notifications',
      closeNotificationLabel: translationMap.closeNotificationLabel || 'Close notification',
    },

    // RoomCustomization texts
    improveText: translationMap.improveText || 'Upgrade',
    pricePerNightText: translationMap.pricePerNightText || 'EUR/night',
    featuresText: translationMap.featuresText || 'Features and benefits',
    understood: translationMap.understood || 'Got it',
    addForPriceText: translationMap.addForPriceText || 'Add for',
    availableOptionsText: translationMap.availableOptionsText || 'Available Options:',
    removeText: translationMap.removeText || 'Remove',
    showMoreText: translationMap.showMoreText || 'Show More',
    showLessText: translationMap.showLessText || 'Show Less',
    optionDisabledText: translationMap.optionDisabledText || 'Not Available',
    conflictWithText: translationMap.conflictWithText || 'Conflicts with',
    keepCurrentText: translationMap.keepCurrentText || 'Keep Current Selection',
    switchToNewText: translationMap.switchToNewText || 'Switch to New Option',
    conflictDialogTitle: translationMap.conflictDialogTitle || 'Option Conflict',
    conflictDialogDescription: translationMap.conflictDialogDescription || 'These options cannot be selected together. Please choose which one to keep.',

  }

  return translations
}

// Group customization options by category
export function groupCustomizationOptions(options: CustomizationOption[]): Record<string, CustomizationOption[]> {
  const grouped: Record<string, CustomizationOption[]> = {}
  
  options.forEach((option) => {
    if (!grouped[option.category]) {
      grouped[option.category] = []
    }
    grouped[option.category].push(option)
  })

  return grouped
}