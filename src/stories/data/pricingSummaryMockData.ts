// Mock data for PricingSummaryPanel stories
import type { Booking } from '../../components/upsell/PricingSummaryPanel/components/BookingInfoSection'
import type { MultiBookingLabels } from '../../components/upsell/PricingSummaryPanel/MultiBookingPricingSummaryPanel'
import type {
  ComponentRoomBooking,
  PricingItem,
  PricingLabels,
} from '../../components/upsell/PricingSummaryPanel/types'

// Sample booking data
export const sampleBookings: Booking[] = [
  {
    bookingKey: 'booking-123',
    checkInDate: '2024-07-15',
    checkOutDate: '2024-07-18',
    firstName: 'Juan',
    lastName: 'Pérez',
    internalRoomTypeCode: 'DELUXE_SUITE',
    occupancy: {
      adults: 2,
      childs: 1,
      infants: 0,
    },
  },
]

export const sampleMultiBookings: Booking[] = [
  {
    bookingKey: 'booking-123',
    checkInDate: '2024-07-15',
    checkOutDate: '2024-07-18',
    firstName: 'Juan',
    lastName: 'Pérez',
    internalRoomTypeCode: 'DELUXE_SUITE',
    occupancy: {
      adults: 2,
      childs: 1,
      infants: 0,
    },
  },
  {
    bookingKey: 'booking-124',
    checkInDate: '2024-07-15',
    checkOutDate: '2024-07-20',
    firstName: 'María',
    lastName: 'García',
    internalRoomTypeCode: 'STANDARD_ROOM',
    occupancy: {
      adults: 2,
      childs: 0,
      infants: 1,
    },
  },
  {
    bookingKey: 'booking-125',
    checkInDate: '2024-07-16',
    checkOutDate: '2024-07-19',
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    internalRoomTypeCode: 'PREMIUM_SUITE',
    occupancy: {
      adults: 1,
      childs: 0,
      infants: 0,
    },
  },
]

// Room types dictionary
export const roomTypesDict = {
  DELUXE_SUITE: { roomTypeName: 'Suite Deluxe con Vista al Mar' },
  STANDARD_ROOM: { roomTypeName: 'Habitación Estándar' },
  PREMIUM_SUITE: { roomTypeName: 'Suite Premium' },
  FAMILY_ROOM: { roomTypeName: 'Habitación Familiar' },
  EXECUTIVE_ROOM: { roomTypeName: 'Habitación Ejecutiva' },
}

// Long text room types for truncation testing
export const longTextRoomTypesDict = {
  DELUXE_SUITE: {
    roomTypeName: 'Suite Deluxe con Vista al Mar y Balcón Privado con Todas las Comodidades y Servicios Premium',
  },
  STANDARD_ROOM: { roomTypeName: 'Habitación Estándar con Vista al Jardín y Todas las Comodidades Básicas Incluidas' },
  PREMIUM_SUITE: { roomTypeName: 'Suite Premium con Vista Panorámica al Mar y Servicios VIP Exclusivos' },
  FAMILY_ROOM: {
    roomTypeName: 'Habitación Familiar Amplia con Espacio para Toda la Familia y Servicios Especiales para Niños',
  },
  EXECUTIVE_ROOM: {
    roomTypeName: 'Habitación Ejecutiva con Área de Trabajo Completa y Servicios Corporativos Premium',
  },
}

// Pricing items for different scenarios
export const pricingItems = {
  roomUpgrade: {
    id: 'suite-deluxe',
    name: 'Suite Deluxe',
    price: 50.0,
    type: 'room' as const,
    concept: 'choose-your-superior-room' as const,
  },
  premiumUpgrade: {
    id: 'premium-suite',
    name: 'Premium Suite with Ocean View',
    price: 120.0,
    type: 'room' as const,
    concept: 'choose-your-superior-room' as const,
  },
  customizations: [
    {
      id: 'king-bed',
      name: 'Cama tamaño king',
      price: 9.0,
      type: 'customization' as const,
      category: 'camas',
      concept: 'customize-your-room' as const,
    },
    {
      id: 'ocean-view',
      name: 'Vista al océano',
      price: 15.0,
      type: 'customization' as const,
      category: 'vista',
      concept: 'customize-your-room' as const,
    },
    {
      id: 'high-floor',
      name: 'Pisos superiores',
      price: 6.0,
      type: 'customization' as const,
      category: 'piso',
      concept: 'customize-your-room' as const,
    },
    {
      id: 'late-checkout',
      name: 'Check-out tardío',
      price: 25.0,
      type: 'customization' as const,
      category: 'servicios',
      concept: 'customize-your-room' as const,
    },
  ],
  specialOffers: [
    {
      id: 'spa-bath',
      name: 'Spa Bath: Relax in Style',
      price: 59.99,
      type: 'offer' as const,
      concept: 'enhance-your-stay' as const,
    },
    {
      id: 'gourmet-dining',
      name: 'Gourmet Dining Package',
      price: 79.5,
      type: 'offer' as const,
      concept: 'enhance-your-stay' as const,
    },
    {
      id: 'airport-transfer',
      name: 'Airport Transfer Service',
      price: 45.0,
      type: 'offer' as const,
      concept: 'enhance-your-stay' as const,
    },
    {
      id: 'romantic-dinner',
      name: 'Romantic Dinner for Two',
      price: 95.0,
      type: 'offer' as const,
      concept: 'enhance-your-stay' as const,
    },
  ],
}

// Default labels configuration
export const defaultLabels: PricingLabels = {
  selectedRoomLabel: 'Habitación seleccionada',
  upgradesLabel: 'Información de mejora',
  specialOffersLabel: 'Ofertas especiales',
  subtotalLabel: 'Subtotal',
  taxesLabel: 'Impuestos',
  totalLabel: 'Precio total',
  payAtHotelLabel: 'Pago en el hotel',
  viewTermsLabel: 'Ver términos',
  confirmButtonLabel: 'Confirmar reserva',
  noUpgradesSelectedLabel: 'No hay mejoras seleccionadas',
  noOffersSelectedLabel: 'No hay ofertas especiales seleccionadas',
  editLabel: 'Editar',
  roomRemovedMessage: 'Se ha eliminado la mejora de habitación',
  offerRemovedMessagePrefix: 'Eliminado:',
  customizationRemovedMessagePrefix: 'Eliminado:',
  addedMessagePrefix: 'Añadido:',
  euroSuffix: 'EUR',
  loadingLabel: 'Cargando...',
  emptyCartMessage: 'Tu selección está vacía',
  exploreLabel: 'Explorar',
  fromLabel: 'Desde',
  removeRoomUpgradeLabel: 'Eliminar mejora',
  customizeStayTitle: 'Personaliza Tu Estancia',
  chooseOptionsSubtitle: 'Elige las opciones que prefieras',
  roomImageAltText: 'Imagen de la habitación',

  // Error messages (i18n)
  missingLabelsError: 'Faltan las etiquetas de configuración requeridas',
  invalidPricingError: 'Objeto de precios no válido, usando predeterminados',
  currencyFormatError: 'Moneda o configuración regional no válida',
  performanceWarning: 'Un número elevado de elementos puede afectar el rendimiento',

  // Accessibility labels (i18n)
  notificationsLabel: 'Notificaciones',
  closeNotificationLabel: 'Cerrar notificación',
  pricingSummaryLabel: 'Resumen de precios',
  processingLabel: 'Procesando...',
  bidForUpgradeLabel: 'Pujar por mejora',
  chooseYourSuperiorRoomLabel: 'Elige tu habitación superior',
  customizeYourRoomLabel: 'Personaliza tu habitación',
  enhanceYourStayLabel: 'Mejora tu estancia',
  chooseYourRoomLabel: 'Elige tu habitación',

  // Booking info labels
  guestsLabel: 'huéspedes',
  guestLabel: 'huésped',
  nightsLabel: 'noches',
  nightLabel: 'noche',
  roomsCountLabel: 'Habitaciones',
  singleRoomLabel: 'Habitación',
  multiRoomBookingTitle: 'Reserva Multi-Habitación',
  totalNightsLabel: 'total',
  totalGuestsLabel: 'total',
  defaultRoomTypeLabel: 'Habitación',
}

// English version labels
export const englishLabels: PricingLabels = {
  selectedRoomLabel: 'Selected Room',
  upgradesLabel: 'Upgrade Information',
  specialOffersLabel: 'Special Offers',
  subtotalLabel: 'Subtotal',
  taxesLabel: 'Taxes',
  totalLabel: 'Total Price',
  payAtHotelLabel: 'Pay at the hotel',
  viewTermsLabel: 'View terms',
  confirmButtonLabel: 'Confirm Booking',
  noUpgradesSelectedLabel: 'No upgrades selected',
  noOffersSelectedLabel: 'No special offers selected',
  editLabel: 'Edit',
  roomRemovedMessage: 'Room upgrade has been removed',
  offerRemovedMessagePrefix: 'Removed:',
  customizationRemovedMessagePrefix: 'Removed:',
  addedMessagePrefix: 'Added:',
  euroSuffix: 'EUR',
  loadingLabel: 'Loading...',
  emptyCartMessage: 'Your selection is empty',
  exploreLabel: 'Explore',
  fromLabel: 'From',
  removeRoomUpgradeLabel: 'Remove upgrade',
  customizeStayTitle: 'Customize Your Stay',
  chooseOptionsSubtitle: 'Choose your preferred options',
  roomImageAltText: 'Room image',

  // Error messages (i18n)
  missingLabelsError: 'Missing required labels configuration',
  invalidPricingError: 'Invalid pricing object, using defaults',
  currencyFormatError: 'Invalid currency or locale',
  performanceWarning: 'Large item count may impact performance',

  // Accessibility labels (i18n)
  notificationsLabel: 'Notifications',
  closeNotificationLabel: 'Close notification',
  pricingSummaryLabel: 'Pricing summary',
  processingLabel: 'Processing...',
  bidForUpgradeLabel: 'Bid for upgrade',
  chooseYourSuperiorRoomLabel: 'Choose your superior room',
  customizeYourRoomLabel: 'Customize your room',
  enhanceYourStayLabel: 'Enhance your stay',
  chooseYourRoomLabel: 'Choose your room',

  // Booking info labels
  guestsLabel: 'guests',
  guestLabel: 'guest',
  nightsLabel: 'nights',
  nightLabel: 'night',
  roomsCountLabel: 'Rooms',
  singleRoomLabel: 'Room',
  multiRoomBookingTitle: 'Multi-Room Booking',
  totalNightsLabel: 'total',
  totalGuestsLabel: 'total',
  defaultRoomTypeLabel: 'Room',
}

// Multi-booking labels
export const multiBookingLabels: MultiBookingLabels = {
  multiRoomBookingsTitle: 'Reservas Multi-Habitación',
  roomsCountLabel: 'habitaciones',
  singleRoomLabel: 'habitación',
  clickToExpandLabel: 'Clic para expandir',
  selectedRoomLabel: 'Habitación Seleccionada',
  upgradesLabel: 'Mejoras',
  specialOffersLabel: 'Ofertas Especiales',
  chooseYourSuperiorRoomLabel: 'Habitación Superior',
  customizeYourRoomLabel: 'Personalizaciones',
  enhanceYourStayLabel: 'Mejoras de Estancia',
  chooseYourRoomLabel: 'Selección de Habitación',
  roomTotalLabel: 'Total Habitación',
  subtotalLabel: 'Subtotal',
  totalLabel: 'Total',
  payAtHotelLabel: 'Pagar en Hotel',
  viewTermsLabel: 'Términos y Condiciones',
  confirmAllButtonLabel: 'Confirmar Todas las Reservas',
  confirmingAllLabel: 'Confirmando...',
  editLabel: 'Editar',
  addLabel: 'Añadir',
  addUpgradeTitle: 'Añadir Mejora',
  noUpgradesSelectedLabel: 'No hay mejoras seleccionadas',
  noOffersSelectedLabel: 'No hay ofertas seleccionadas',
  noMoreUpgradesLabel: 'No hay más mejoras disponibles',
  noMoreOffersLabel: 'No hay más ofertas disponibles',
  euroSuffix: 'EUR',
  nightsLabel: 'noches',
  nightLabel: 'noche',
  guestsLabel: 'huéspedes',
  guestLabel: 'huésped',
  roomImageAltText: 'Vista de la habitación',
  removedSuccessfully: 'eliminado exitosamente',
  addedSuccessfully: 'añadido exitosamente',
  cannotRemoveRoom: 'No se puede eliminar la habitación base',
  itemAlreadyAdded: 'El elemento ya está añadido',
  roomRemovedMessage: 'Elemento de habitación eliminado',
  offerRemovedMessagePrefix: 'Oferta eliminada:',
  customizationRemovedMessagePrefix: 'Personalización eliminada:',
  addedMessagePrefix: 'Añadido:',
  loadingLabel: 'Cargando...',
  removeRoomUpgradeLabel: 'Eliminar',
  notificationsLabel: 'Notificaciones',
  closeNotificationLabel: 'Cerrar notificación',
  multiRoomBookingTitle: 'Reserva Multi-Habitación',
  totalNightsLabel: 'total',
  totalGuestsLabel: 'total',
  defaultRoomTypeLabel: 'Habitación',
  adultsLabel: 'adultos',
  adultLabel: 'adulto',
  childrenLabel: 'niños',
  childLabel: 'niño',
  infantsLabel: 'bebés',
  infantLabel: 'bebé',
}

// Multi-booking room data with various scenarios
export const multiBookingRoomScenarios = {
  // Scenario 1: Rooms with different combinations of items
  mixedItems: [
    {
      id: 'room1',
      roomName: 'Suite Deluxe con Vista al Mar',
      roomNumber: '101',
      guestName: 'Juan Pérez',
      nights: 3,
      payAtHotel: false,
      isActive: true,
      items: [
        pricingItems.roomUpgrade,
        pricingItems.customizations[0], // king-bed
        pricingItems.specialOffers[0], // spa-bath
      ],
    },
    {
      id: 'room2',
      roomName: 'Habitación Estándar',
      roomNumber: '205',
      guestName: 'María García',
      nights: 2,
      payAtHotel: true,
      isActive: false,
      items: [
        pricingItems.customizations[1], // ocean-view
        pricingItems.customizations[2], // high-floor
      ],
    },
    {
      id: 'room3',
      roomName: 'Suite Premium',
      roomNumber: '301',
      guestName: 'Carlos Rodriguez',
      nights: 4,
      payAtHotel: false,
      isActive: true,
      items: [
        pricingItems.premiumUpgrade,
        ...pricingItems.customizations.slice(0, 3),
        ...pricingItems.specialOffers.slice(0, 2),
      ],
    },
  ] as ComponentRoomBooking[],

  // Scenario 2: Empty rooms (no items)
  emptyRooms: [
    {
      id: 'room1',
      roomName: 'Suite Deluxe con Vista al Mar',
      roomNumber: '101',
      guestName: 'Juan Pérez',
      nights: 3,
      payAtHotel: false,
      isActive: true,
      items: [],
    },
    {
      id: 'room2',
      roomName: 'Habitación Estándar',
      roomNumber: '205',
      guestName: 'María García',
      nights: 2,
      payAtHotel: true,
      isActive: false,
      items: [],
    },
  ] as ComponentRoomBooking[],

  // Scenario 3: Only room upgrades
  roomUpgradesOnly: [
    {
      id: 'room1',
      roomName: 'Suite Deluxe con Vista al Mar',
      roomNumber: '101',
      guestName: 'Juan Pérez',
      nights: 3,
      payAtHotel: false,
      isActive: true,
      items: [pricingItems.roomUpgrade],
    },
    {
      id: 'room2',
      roomName: 'Suite Premium',
      roomNumber: '301',
      guestName: 'Carlos Rodriguez',
      nights: 4,
      payAtHotel: false,
      isActive: true,
      items: [pricingItems.premiumUpgrade],
    },
  ] as ComponentRoomBooking[],

  // Scenario 4: Only customizations
  customizationsOnly: [
    {
      id: 'room1',
      roomName: 'Habitación Estándar',
      roomNumber: '205',
      guestName: 'María García',
      nights: 2,
      payAtHotel: true,
      isActive: false,
      items: pricingItems.customizations.slice(0, 2),
    },
    {
      id: 'room2',
      roomName: 'Suite Deluxe con Vista al Mar',
      roomNumber: '101',
      guestName: 'Juan Pérez',
      nights: 3,
      payAtHotel: false,
      isActive: true,
      items: pricingItems.customizations.slice(1, 4),
    },
  ] as ComponentRoomBooking[],

  // Scenario 5: Only special offers
  offersOnly: [
    {
      id: 'room1',
      roomName: 'Suite Premium',
      roomNumber: '301',
      guestName: 'Carlos Rodriguez',
      nights: 4,
      payAtHotel: false,
      isActive: true,
      items: pricingItems.specialOffers.slice(0, 2),
    },
    {
      id: 'room2',
      roomName: 'Habitación Ejecutiva',
      roomNumber: '401',
      guestName: 'Ana López',
      nights: 2,
      payAtHotel: true,
      isActive: false,
      items: pricingItems.specialOffers.slice(2, 4),
    },
  ] as ComponentRoomBooking[],

  // Scenario 6: Single room with many items
  fullyLoaded: [
    {
      id: 'room1',
      roomName: 'Suite Deluxe con Vista al Mar',
      roomNumber: '101',
      guestName: 'Juan Pérez',
      nights: 3,
      payAtHotel: false,
      isActive: true,
      items: [pricingItems.premiumUpgrade, ...pricingItems.customizations, ...pricingItems.specialOffers],
    },
  ] as ComponentRoomBooking[],

  // Scenario 7: Large booking with many rooms
  largeBooking: [
    {
      id: 'room1',
      roomName: 'Suite Deluxe con Vista al Mar',
      roomNumber: '101',
      guestName: 'Juan Pérez',
      nights: 3,
      payAtHotel: false,
      isActive: true,
      items: [pricingItems.roomUpgrade, pricingItems.customizations[0]],
    },
    {
      id: 'room2',
      roomName: 'Habitación Estándar',
      roomNumber: '205',
      guestName: 'María García',
      nights: 2,
      payAtHotel: true,
      isActive: false,
      items: [pricingItems.customizations[1]],
    },
    {
      id: 'room3',
      roomName: 'Suite Premium',
      roomNumber: '301',
      guestName: 'Carlos Rodriguez',
      nights: 4,
      payAtHotel: false,
      isActive: true,
      items: [pricingItems.premiumUpgrade, pricingItems.specialOffers[0]],
    },
    {
      id: 'room4',
      roomName: 'Habitación Familiar',
      roomNumber: '102',
      guestName: 'Ana López',
      nights: 5,
      payAtHotel: false,
      isActive: false,
      items: pricingItems.customizations.slice(0, 2),
    },
    {
      id: 'room5',
      roomName: 'Habitación Ejecutiva',
      roomNumber: '401',
      guestName: 'Pedro Sánchez',
      nights: 2,
      payAtHotel: true,
      isActive: true,
      items: pricingItems.specialOffers.slice(1, 3),
    },
  ] as ComponentRoomBooking[],
}

// Utility functions for generating test data
export const generateRoomWithItems = (
  id: string,
  roomName: string,
  guestName: string,
  items: PricingItem[],
  nights: number = 3,
  payAtHotel: boolean = false
): ComponentRoomBooking => ({
  id,
  roomName,
  roomNumber: id.replace('room', ''),
  guestName,
  nights,
  payAtHotel,
  isActive: true,
  items,
})

export const generateEmptyRoom = (
  id: string,
  roomName: string,
  guestName: string,
  nights: number = 3
): ComponentRoomBooking => generateRoomWithItems(id, roomName, guestName, [], nights)
