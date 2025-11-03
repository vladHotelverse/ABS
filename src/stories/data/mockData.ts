// import type { BookingDetailProps } from '../../components/BookingInfoBar/types'
// import type { PricingItem, PricingLabels } from '../../components/PricingSummaryPanel/types'
// import type {
//   CustomizationOption,
//   RoomCustomizationTexts,
//   SectionConfig,
//   SelectedCustomizations,
// } from '../../components/RoomCustomization/types'
// import type { RoomOption, RoomSelectionCarouselTranslations } from '../../components/RoomSelectionCarousel/types'
// import type { OfferLabels, OfferType, ReservationInfo } from '../../components/SpecialOffers/types'

// // Room Data
// export const MOCK_ROOM_DATA: Record<string, RoomOption> = {
//   deluxeKing: {
//     id: 'deluxe-king',
//     roomType: 'Deluxe King Room',
//     description: 'Spacious room with king bed, city view, and modern amenities',
//     price: 180,
//     oldPrice: 220,
//     images: [
//       'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop',
//       'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
//     ],
//     amenities: ['King Bed', 'City View', 'Free WiFi', 'Mini Bar', 'Safe'],
//   },
//   superiorQueen: {
//     id: 'superior-queen',
//     roomType: 'Superior Queen Room',
//     description: 'Comfortable room with queen bed and premium amenities',
//     price: 150,
//     oldPrice: 180,
//     images: [
//       'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
//       'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop',
//     ],
//     amenities: ['Queen Bed', 'Garden View', 'Free WiFi', 'Mini Bar', 'Safe', 'Balcony'],
//   },
//   luxurySuite: {
//     id: 'luxury-suite',
//     roomType: 'Luxury Suite',
//     description: 'Premium suite with panoramic views and luxury amenities',
//     price: 350,
//     oldPrice: 400,
//     images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop'],
//     amenities: ['King Bed', 'Panoramic View', 'Jacuzzi', 'Free WiFi', 'Mini Bar', 'Safe', 'Balcony'],
//   },
// }

// // Booking Data
// export const MOCK_BOOKING_DATA: BookingDetailProps[] = [
//   { label: 'Check-in', value: '15 Dec 2024', icon: 'Calendar' },
//   { label: 'Check-out', value: '18 Dec 2024', icon: 'Calendar' },
//   { label: 'Guests', value: '2 Adults', icon: 'Users' },
//   { label: 'Nights', value: '3 nights', icon: 'Tag' },
// ]

// // Translations
// export const MOCK_TRANSLATIONS = {
//   common: {
//     selectText: 'Select Room',
//     learnMoreText: 'Learn More',
//     selectedText: 'Selected',
//     nightText: 'per night',
//     priceInfoText: 'Price',
//     currencySymbol: '€',
//     makeOfferText: 'Make Offer',
//     availabilityText: 'Available',
//     proposePriceText: 'Propose Price',
//     currencyText: 'EUR',
//     offerMadeText: 'Offer made for {price} EUR per night',
//     bidSubmittedText: 'Bid Submitted',
//     updateBidText: 'Update Bid',
//     cancelBidText: 'Cancel Bid',
//     discountBadgeText: '-{percentage}%',
//     noRoomsAvailableText: 'No rooms available',
//     navigationLabels: {
//       previousRoom: 'Previous room',
//       nextRoom: 'Next room',
//       previousRoomMobile: 'Previous',
//       nextRoomMobile: 'Next',
//       goToRoom: 'Go to room {index}',
//       previousImage: 'Previous image',
//       nextImage: 'Next image',
//       viewImage: 'View image {index}',
//     },
//   },
//   roomSelection: {
//     title: 'Choose Your Room',
//     subtitle: 'Select the perfect room for your stay',
//   },
//   roomCustomization: {
//     title: 'Customize Your Room',
//     subtitle: 'Add special touches to make your stay perfect',
//   },
//   specialOffers: {
//     title: 'Special Offers',
//     subtitle: 'Enhance your stay with these exclusive offers',
//   },
// } satisfies Record<string, any>

// // Room Selection Translations
// export const MOCK_ROOM_SELECTION_TRANSLATIONS: RoomSelectionCarouselTranslations = {
//   ...MOCK_TRANSLATIONS.common,
// }

// // Special Offers Data
// export const MOCK_OFFERS: OfferType[] = [
//   {
//     id: 1,
//     title: 'Spa Relaxation Package',
//     description: 'Indulge in a full spa experience with massage and facial treatments',
//     image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
//     price: 120,
//     type: 'perPerson',
//     featured: true,
//     isUnavailable: false,
//   },
//   {
//     id: 2,
//     title: 'Gourmet Dining Experience',
//     description: 'Exclusive dinner at our rooftop restaurant with wine pairing',
//     image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
//     price: 85,
//     type: 'perPerson',
//     featured: false,
//     isUnavailable: false,
//   },
// ]

// // Reservation Info
// export const MOCK_RESERVATION_INFO: ReservationInfo = {
//   personCount: 2,
//   checkInDate: new Date('2024-12-15'),
//   checkOutDate: new Date('2024-12-18'),
// }

// // Special Offers Labels
// export const MOCK_OFFER_LABELS: OfferLabels = {
//   perStay: 'per stay',
//   perPerson: 'per person',
//   perNight: 'per night',
//   total: 'Total:',
//   bookNow: 'Book Now',
//   numberOfPersons: 'Number of persons',
//   numberOfNights: 'Number of nights',
//   addedLabel: 'Added',
//   popularLabel: 'Popular',
//   personsTooltip: 'Select how many people will use this service',
//   personsSingularUnit: 'person',
//   personsPluralUnit: 'persons',
//   nightsTooltip: 'Select the number of nights for this service',
//   nightsSingularUnit: 'night',
//   nightsPluralUnit: 'nights',
//   personSingular: 'person',
//   personPlural: 'persons',
//   nightSingular: 'night',
//   nightPlural: 'nights',
//   removeOfferLabel: 'Remove from List',
//   decreaseQuantityLabel: 'Decrease quantity',
//   increaseQuantityLabel: 'Increase quantity',
//   selectDateLabel: 'Select Date',
//   selectDateTooltip: 'Choose the date for this service',
//   dateRequiredLabel: 'Date selection required',
// }

// // Room Customization Data
// export const MOCK_CUSTOMIZATION_SECTIONS: SectionConfig[] = [
//   {
//     key: 'bedding',
//     title: 'Bedding Preferences',
//     infoText: 'Choose your preferred bedding setup',
//   },
//   {
//     key: 'amenities',
//     title: 'Room Amenities',
//     infoText: 'Enhance your room experience',
//   },
// ]

// export const MOCK_CUSTOMIZATION_OPTIONS: Record<string, CustomizationOption[]> = {
//   bedding: [
//     {
//       id: 'pillows',
//       label: 'Extra Pillows',
//       description: 'Add extra pillows for comfort',
//       price: 5,
//     },
//     {
//       id: 'duvet',
//       label: 'Down Duvet',
//       description: 'Premium down duvet for extra warmth',
//       price: 15,
//     },
//   ],
//   amenities: [
//     {
//       id: 'minibar',
//       label: 'Welcome Minibar',
//       description: 'Stocked minibar upon arrival',
//       price: 25,
//     },
//     {
//       id: 'flowers',
//       label: 'Fresh Flowers',
//       description: 'Beautiful floral arrangement',
//       price: 20,
//     },
//   ],
// }

// export const MOCK_SELECTED_CUSTOMIZATIONS: SelectedCustomizations = {
//   bedding: { id: 'duvet', label: 'Down Duvet', price: 15 },
//   amenities: { id: 'flowers', label: 'Fresh Flowers', price: 20 },
// }

// export const MOCK_CUSTOMIZATION_TEXTS: RoomCustomizationTexts = {
//   improveText: 'Improve',
//   selectedText: 'Selected',
//   selectText: 'Select',
//   pricePerNightText: 'per night',
//   featuresText: 'Features',
//   understood: 'Understood',
//   addForPriceText: 'Add for {price}',
//   availableOptionsText: 'Available Options',
//   removeText: 'Remove',
//   showMoreText: 'Show More',
//   showLessText: 'Show Less',
//   optionDisabledText: 'Option disabled',
//   conflictWithText: 'Conflicts with',
//   keepCurrentText: 'Keep Current',
//   switchToNewText: 'Switch to New',
//   conflictDialogTitle: 'Option Conflict',
//   conflictDialogDescription: 'This option conflicts with your current selection',
// }

// // Pricing Data
// export const MOCK_PRICING_ITEMS: PricingItem[] = [
//   {
//     id: 'room-deluxe-king',
//     name: 'Deluxe King Room',
//     price: 180,
//     type: 'room',
//     concept: 'choose-your-room',
//   },
//   {
//     id: 'custom-duvet',
//     name: 'Down Duvet',
//     price: 15,
//     type: 'customization',
//     concept: 'customize-your-room',
//   },
//   {
//     id: 'custom-flowers',
//     name: 'Fresh Flowers',
//     price: 20,
//     type: 'customization',
//     concept: 'customize-your-room',
//   },
//   {
//     id: 'offer-spa',
//     name: 'Spa Relaxation Package',
//     price: 120,
//     type: 'offer',
//     concept: 'enhance-your-stay',
//   },
// ]

// export const MOCK_PRICING_LABELS: PricingLabels = {
//   selectedRoomLabel: 'Selected Room',
//   upgradesLabel: 'Upgrades',
//   specialOffersLabel: 'Special Offers',
//   chooseYourSuperiorRoomLabel: 'Choose Your Superior Room',
//   customizeYourRoomLabel: 'Customize Your Room',
//   enhanceYourStayLabel: 'Enhance Your Stay',
//   chooseYourRoomLabel: 'Choose Your Room',
//   subtotalLabel: 'Subtotal',
//   taxesLabel: 'Taxes',
//   totalLabel: 'Total',
//   payAtHotelLabel: 'Pay at hotel',
//   viewTermsLabel: 'View terms',
//   confirmButtonLabel: 'Confirm Booking',
//   noUpgradesSelectedLabel: 'No upgrades selected',
//   noOffersSelectedLabel: 'No offers selected',
//   emptyCartMessage: 'Your cart is empty',
//   editLabel: 'Edit',
//   roomRemovedMessage: 'Room removed from selection',
//   offerRemovedMessagePrefix: 'Offer removed:',
//   customizationRemovedMessagePrefix: 'Customization removed:',
//   addedMessagePrefix: 'Added:',
//   euroSuffix: '€',
//   loadingLabel: 'Loading...',
//   roomImageAltText: 'Selected room',
//   removeRoomUpgradeLabel: 'Remove upgrade',
//   exploreLabel: 'Explore options',
//   fromLabel: 'from',
//   customizeStayTitle: 'Customize Your Stay',
//   chooseOptionsSubtitle: 'Choose from our available options',
//   missingLabelsError: 'Missing required labels',
//   invalidPricingError: 'Invalid pricing data',
//   currencyFormatError: 'Currency format error',
//   performanceWarning: 'Performance warning',
//   notificationsLabel: 'Notifications',
//   closeNotificationLabel: 'Close notification',
//   pricingSummaryLabel: 'Booking Summary',
//   processingLabel: 'Processing...',
//   bidForUpgradeLabel: 'Bid for upgrade',
// }

// // Utility functions for data manipulation
// export const getRoomOptions = (roomIds: string[]): RoomOption[] => {
//   return roomIds.map((id) => MOCK_ROOM_DATA[id]).filter(Boolean)
// }

// export const getDefaultRoomOptions = (): RoomOption[] => {
//   return [MOCK_ROOM_DATA.deluxeKing, MOCK_ROOM_DATA.superiorQueen]
// }

// export const getLuxuryRoomOptions = (): RoomOption[] => {
//   return [MOCK_ROOM_DATA.luxurySuite]
// }

// export const getBudgetRoomOptions = (): RoomOption[] => {
//   return [
//     {
//       ...MOCK_ROOM_DATA.deluxeKing,
//       price: 80,
//       roomType: 'Standard Single Room',
//       description: 'Comfortable single room perfect for solo travelers',
//       amenities: ['Single Bed', 'Free WiFi', 'TV', 'Safe'],
//     },
//     {
//       ...MOCK_ROOM_DATA.superiorQueen,
//       price: 100,
//       roomType: 'Standard Double Room',
//       description: 'Spacious room for two with essential amenities',
//       amenities: ['Double Bed', 'Free WiFi', 'TV', 'Mini Bar', 'Safe'],
//     },
//   ]
// }
