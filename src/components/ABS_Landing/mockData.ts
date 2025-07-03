import { Bed, Building2, Hotel, Waves } from 'lucide-react'

// Mock data for ABS_Landing stories
export const roomOptions = [
  {
    id: 'deluxe',
    name: 'Deluxe Room',
    description: 'Our standard room with all the essentials for a comfortable stay.',
    price: 129.99,
    perNight: true,
    image:
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    ],
    amenities: ['Free Wi-Fi', 'Flat-screen TV', 'Air conditioning', 'Private bathroom'],
  },
  {
    id: 'premium',
    name: 'Premium Room',
    description: 'Upgraded room with additional space and premium amenities.',
    price: 199.99,
    oldPrice: 249.99,
    perNight: true,
    image:
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    images: [
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    ],
    amenities: ['Free Wi-Fi', 'Flat-screen TV', 'Air conditioning', 'Private bathroom', 'City view', 'Mini bar'],
  },
  {
    id: 'suite',
    name: 'Executive Suite',
    description: 'Spacious suite with separate living area and exclusive benefits.',
    price: 299.99,
    oldPrice: 379.99,
    perNight: true,
    image:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    ],
    amenities: [
      'Free Wi-Fi',
      'Flat-screen TV',
      'Air conditioning',
      'Private bathroom',
      'Ocean view',
      'Mini bar',
      'Living room',
      'Butler service',
    ],
  },
]

export const bedsOptions = [
  {
    id: 'twin',
    name: 'Twin Beds',
    description: 'Two separate single beds',
    price: 0,
    icon: 'bed',
    label: 'Twin Beds',
  },
  {
    id: 'queen',
    name: 'Queen Bed',
    description: 'One large queen-sized bed',
    price: 15,
    icon: 'bed',
    label: 'Queen Bed',
  },
  {
    id: 'king',
    name: 'King Bed',
    description: 'One extra-large king-sized bed',
    price: 30,
    icon: 'bed',
    label: 'King Bed',
  },
]

export const locationOptions = [
  {
    id: 'standard',
    name: 'Standard View',
    description: 'Basic room with no specific view',
    price: 0,
    icon: 'building',
    label: 'Standard View',
  },
  {
    id: 'poolside',
    name: 'Poolside',
    description: 'Room near the swimming pool',
    price: 25,
    icon: 'waves',
    label: 'Poolside',
  },
  {
    id: 'oceanview',
    name: 'Ocean View',
    description: 'Room with a beautiful ocean view',
    price: 50,
    icon: 'corner-up-right',
    label: 'Ocean View',
  },
]

export const floorOptions = [
  {
    id: 'ground',
    name: 'Ground Floor',
    description: 'Easy access, no stairs or elevator needed',
    price: 0,
    icon: 'home',
    label: 'Ground Floor',
  },
  {
    id: 'mid',
    name: 'Middle Floors (2-4)',
    description: 'Balance between view and accessibility',
    price: 15,
    icon: 'layout',
    label: 'Middle Floors (2-4)',
  },
  {
    id: 'high',
    name: 'High Floor (5+)',
    description: 'Best views but requires elevator',
    price: 30,
    icon: 'layers',
    label: 'High Floor (5+)',
  },
]

export const viewOptions = [
  {
    id: 'interior',
    name: 'Interior',
    description: 'Room facing the interior courtyard',
    price: 0,
    icon: 'arrow-up',
    label: 'Interior View',
    imageUrl:
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
  },
  {
    id: 'street',
    name: 'Street View',
    description: 'Room with a view of the street',
    price: 10,
    icon: 'corner-up-right',
    label: 'Street View',
    imageUrl:
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
  },
  {
    id: 'ocean',
    name: 'Ocean View',
    description: 'Room with ocean view',
    price: 45,
    icon: 'waves',
    label: 'Ocean View',
    imageUrl:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80',
  },
]

export const specialOffers = [
  {
    id: 1,
    title: 'All inclusive package',
    description: 'Enjoy unlimited access to all amenities, meals and beverages.',
    image:
      'https://images.unsplash.com/photo-1533089860892-a9b969df67d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    price: 50,
    type: 'perPerson' as const,
  },
  {
    id: 2,
    title: 'Spa Access',
    description: 'Enjoy a day of relaxation at our luxury spa - select your preferred date.',
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    price: 50,
    type: 'perPerson' as const,
    requiresDateSelection: true,
  },
  {
    id: 3,
    title: 'Airport Transfer',
    description: 'Convenient transportation to and from the airport (uses reservation person count).',
    image:
      'https://images.unsplash.com/photo-1464219789935-c2d9d9aefd57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    price: 35,
    type: 'perPerson' as const,
  },
  {
    id: 4,
    title: 'Gourmet Dinner',
    description: 'Exquisite dinner at our award-winning restaurant - choose your dining date.',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    price: 60,
    type: 'perPerson' as const,
    requiresDateSelection: true,
  },
  {
    id: 5,
    title: 'VIP Balinese bed',
    description: 'Luxurious traditional Balinese bed setup with premium bedding and aromatherapy.',
    image:
      'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    price: 100,
    type: 'perNight' as const,
  },
  {
    id: 6,
    title: 'Wellness Classes',
    description: 'Join our daily wellness activities - select multiple class dates.',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    price: 25,
    type: 'perPerson' as const,
    requiresDateSelection: true,
    allowsMultipleDates: true,
  },
]

// Language translations
export const translations = {
  en: {
    roomTitle: 'Room',
    roomSubtitle: 'Choose from our selection of premium rooms and suites',
    customizeTitle: 'Customize Your Stay',
    customizeSubtitle: 'Personalize your room for the perfect experience',
    offersTitle: 'Enhance your stay',
    offersSubtitle: 'Enhance your stay with these exclusive offers',
    emptyCartMessage: 'Select a room and customize your stay to see your booking summary here.',
    errorMessage: 'Sorry, there was an error loading the booking information. Please try again later.',
    confirmationMessage: 'Thank you for your booking! A confirmation email will be sent shortly.',
    totalLabel: 'Total',
    currencySymbol: '€',
    selectText: 'Select',
    selectedText: 'Selected',
    nightText: 'night',
    learnMoreText: 'Learn More',
    priceInfoText: 'Price includes all taxes and fees',

    // New texts for RoomCustomization
    improveText: 'Upgrade',
    pricePerNightText: 'EUR/night',
    featuresText: 'Features and benefits',
    understood: 'Got it',
    addForPriceText: 'Add for',
    availableOptionsText: 'Available Options:',
    removeText: 'Remove',

    // Section info texts
    bedsInfoText:
      'Choose the type of bed you prefer for your stay. Each option offers different levels of comfort and space according to your needs. King-size beds are ideal for couples who want more space, while twin beds are perfect for friends or family.',
    locationInfoText:
      'The location of your room can significantly affect your experience. Corner rooms offer more privacy, while suites with sea views provide impressive ocean panoramas. Choose the location that best suits your preferences.',
    viewInfoText:
      "Select the exact view from your room. Each option offers a unique perspective of the hotel's surroundings, from panoramic city views to impressive sunrises over the sea.",
    floorInfoText:
      'The floor where your room is located can influence the view, noise level, and accessibility. Upper floors offer better views and less noise, while lower floors provide quicker access to hotel facilities.',
    bedsTitle: 'Beds',
    locationTitle: 'Location',
    floorTitle: 'Floor',
    viewTitle: 'View',

    // Updated translation props for SpecialOffers (using new labels structure)
    specialOffersLabels: {
      perStay: 'per stay',
      perPerson: 'per person',
      perNight: 'per night',
      total: 'Total',
      bookNow: 'Book Now',
      numberOfPersons: 'Number of Persons',
      numberOfNights: 'Number of Nights',
      addedLabel: 'Added',
      popularLabel: 'Popular',
      personsTooltip: 'Number of persons for this offer',
      personsSingularUnit: 'person',
      personsPluralUnit: 'persons',
      nightsTooltip: 'Number of nights for this offer',
      nightsSingularUnit: 'night',
      nightsPluralUnit: 'nights',
      personSingular: 'person',
      personPlural: 'people',
      nightSingular: 'night',
      nightPlural: 'nights',
      removeOfferLabel: 'Remove Offer',
      decreaseQuantityLabel: 'Decrease Quantity',
      increaseQuantityLabel: 'Increase Quantity',
      selectDateLabel: 'Select Date',
      selectDateTooltip: 'Choose a date for this offer',
      dateRequiredLabel: 'Date required',
    },

    // PricingSummaryPanel labels
    selectedRoomLabel: 'Selected Room',
    upgradesLabel: 'Upgrades',
    specialOffersLabel: 'Special Offers',
    subtotalLabel: 'Subtotal',
    taxesLabel: 'Taxes',
    payAtHotelLabel: 'Pay at Hotel',
    viewTermsLabel: 'View Terms & Conditions',
    confirmButtonLabel: 'Confirm Booking',
    noUpgradesSelectedLabel: 'No upgrades selected',
    noOffersSelectedLabel: 'No offers selected',
    editLabel: 'Edit',
    roomRemovedMessage: 'Room removed from your booking',
    offerRemovedMessagePrefix: 'Offer ',
    customizationRemovedMessagePrefix: 'Customization ',
    addedMessagePrefix: 'Added: ',
    euroSuffix: ' EUR',
    loadingLabel: 'Loading...',
    checkInLabel: 'Check-in',
    checkOutLabel: 'Check-out',
    occupancyLabel: 'Occupancy',
    reservationCodeLabel: 'Reservation Code',

    // UI text
    backToHomeLabel: 'Back to Home',
    tryAgainLabel: 'Try Again',
    bookingConfirmedTitle: 'Booking Confirmed!',
    errorTitle: 'Error',
    summaryButtonLabel: 'Summary',
    removeRoomUpgradeLabel: 'Remove Room Upgrade',
    exploreLabel: 'Explore',
    roomImageAltText: 'Room image',
    fromLabel: 'From',
    customizeStayTitle: 'Customize Your Stay',
    chooseOptionsSubtitle: 'Choose your preferred options',

    // Multi-booking labels
    multiBookingLabels: {
      multiRoomBookingsTitle: 'Multi-Room Bookings',
      roomsCountLabel: 'rooms',
      singleRoomLabel: 'room',
      clickToExpandLabel: 'Click to expand/collapse',
      selectedRoomLabel: 'Selected Room',
      upgradesLabel: 'Upgrades',
      specialOffersLabel: 'Special Offers',
      roomTotalLabel: 'Room Total',
      subtotalLabel: 'Subtotal',
      taxesLabel: 'Taxes (10%)',
      totalLabel: 'Total',
      payAtHotelLabel: 'Payment will be made at the hotel',
      viewTermsLabel: 'View Terms & Conditions',
      confirmAllButtonLabel: 'Confirm All Bookings',
      confirmingAllLabel: 'Confirming...',
      editLabel: 'Edit',
      addLabel: 'Add',
      addUpgradeTitle: 'Add Room Upgrade',
      addSpecialOfferTitle: 'Add Special Offer',
      noUpgradesSelectedLabel: 'No upgrades selected',
      noOffersSelectedLabel: 'No special offers selected',
      noMoreUpgradesLabel: 'No more upgrades available',
      noMoreOffersLabel: 'No more offers available',
      euroSuffix: ' EUR',
      nightsLabel: 'nights',
      nightLabel: 'night',
      guestsLabel: 'guests',
      guestLabel: 'guest',
      roomImageAltText: 'Room image',
      removedSuccessfully: 'removed successfully',
      addedSuccessfully: 'added successfully',
      cannotRemoveRoom: 'Cannot remove room booking',
      itemAlreadyAdded: 'This item has already been added',
      notificationsLabel: 'Notifications',
      closeNotificationLabel: 'Close notification',
    },
  },
  es: {
    roomTitle: 'Habitación',
    roomSubtitle: 'Elige entre nuestra selección de habitaciones y suites premium',
    customizeTitle: 'Personaliza Tu Estancia',
    customizeSubtitle: 'Personaliza tu habitación para una experiencia perfecta',
    offersTitle: 'Mejora tu estancia',
    offersSubtitle: 'Mejora tu estancia con estas ofertas exclusivas',
    emptyCartMessage: 'Selecciona una habitación y personaliza tu estancia para ver el resumen de tu reserva aquí.',
    errorMessage:
      'Lo sentimos, hubo un error al cargar la información de la reserva. Por favor, inténtalo de nuevo más tarde.',
    confirmationMessage: '¡Gracias por tu reserva! Se enviará un correo de confirmación en breve.',
    totalLabel: 'Total',
    currencySymbol: '€',
    selectText: 'Seleccionar',
    selectedText: 'Seleccionado',
    nightText: 'noche',
    learnMoreText: 'Saber Más',
    priceInfoText: 'El precio incluye todos los impuestos y tarifas',

    // New texts for RoomCustomization
    improveText: 'Mejorar',
    pricePerNightText: 'EUR/noche',
    featuresText: 'Características y ventajas',
    understood: 'Entendido',
    addForPriceText: 'Añadir por',
    availableOptionsText: 'Opciones Disponibles:',
    removeText: 'Quitar',

    // Section info texts
    bedsInfoText:
      'Elige el tipo de cama que prefieras para tu estancia. Cada opción ofrece diferentes niveles de comodidad y espacio según tus necesidades. Las camas king-size son ideales para parejas que desean más espacio, mientras que las camas individuales son perfectas para amigos o familiares.',
    locationInfoText:
      'La ubicación de tu habitación puede afectar significativamente tu experiencia. Las habitaciones en esquina ofrecen más privacidad, mientras que las suites con vista al mar te brindan panoramas impresionantes del océano. Elige la ubicación que mejor se adapte a tus preferencias.',
    viewInfoText:
      'Selecciona la vista exacta desde tu habitación. Cada opción ofrece una perspectiva única del entorno del hotel, desde vistas panorámicas de la ciudad hasta impresionantes amaneceres sobre el mar.',
    floorInfoText:
      'El piso en el que se encuentra tu habitación puede influir en la vista, el ruido y la accesibilidad. Los pisos superiores ofrecen mejores vistas y menos ruido, mientras que los pisos inferiores proporcionan un acceso más rápido a las instalaciones del hotel.',
    bedsTitle: 'Camas',
    locationTitle: 'Ubicación',
    floorTitle: 'Piso',
    viewTitle: 'Vista',

    // Updated translation props for SpecialOffers (using new labels structure)
    specialOffersLabels: {
      perStay: 'por estancia',
      perPerson: 'por persona',
      perNight: 'por noche',
      total: 'Total',
      bookNow: 'Reservar Ahora',
      numberOfPersons: 'Número de Personas',
      numberOfNights: 'Número de Noches',
      addedLabel: 'Añadido',
      popularLabel: 'Popular',
      personsTooltip: 'Número de personas para esta oferta',
      personsSingularUnit: 'persona',
      personsPluralUnit: 'personas',
      nightsTooltip: 'Número de noches para esta oferta',
      nightsSingularUnit: 'noche',
      nightsPluralUnit: 'noches',
      personSingular: 'persona',
      personPlural: 'personas',
      nightSingular: 'noche',
      nightPlural: 'noches',
      removeOfferLabel: 'Eliminar Oferta',
      decreaseQuantityLabel: 'Disminuir Cantidad',
      increaseQuantityLabel: 'Aumentar Cantidad',
      selectDateLabel: 'Seleccionar Fecha',
      selectDateTooltip: 'Elige una fecha para esta oferta',
      dateRequiredLabel: 'Fecha requerida',
    },

    // PricingSummaryPanel labels
    selectedRoomLabel: 'Habitación Seleccionada',
    upgradesLabel: 'Mejoras',
    specialOffersLabel: 'Ofertas Especiales',
    subtotalLabel: 'Subtotal',
    taxesLabel: 'Impuestos',
    payAtHotelLabel: 'Pagar en el Hotel',
    viewTermsLabel: 'Ver Términos y Condiciones',
    confirmButtonLabel: 'Confirmar Reserva',
    noUpgradesSelectedLabel: 'No hay mejoras seleccionadas',
    noOffersSelectedLabel: 'No hay ofertas seleccionadas',
    editLabel: 'Editar',
    roomRemovedMessage: 'Habitación eliminada de tu reserva',
    offerRemovedMessagePrefix: 'Oferta ',
    customizationRemovedMessagePrefix: 'Personalización ',
    addedMessagePrefix: 'Añadido: ',
    euroSuffix: ' EUR',
    loadingLabel: 'Cargando...',
    checkInLabel: 'Fecha de Entrada',
    checkOutLabel: 'Fecha de Salida',
    occupancyLabel: 'Ocupación',
    reservationCodeLabel: 'Código de Reserva',

    // UI text
    backToHomeLabel: 'Volver a Inicio',
    tryAgainLabel: 'Intentar de Nuevo',
    bookingConfirmedTitle: '¡Reserva Confirmada!',
    errorTitle: 'Error',
    summaryButtonLabel: 'Resumen',
    removeRoomUpgradeLabel: 'Eliminar Mejora de Habitación',
    exploreLabel: 'Explorar',
    roomImageAltText: 'Imagen de habitación',
    fromLabel: 'Desde',
    customizeStayTitle: 'Personaliza Tu Estancia',
    chooseOptionsSubtitle: 'Elige las opciones que prefieras',

    // Multi-booking labels
    multiBookingLabels: {
      multiRoomBookingsTitle: 'Reservas de Múltiples Habitaciones',
      roomsCountLabel: 'habitaciones',
      singleRoomLabel: 'habitación',
      clickToExpandLabel: 'Haz clic para expandir/colapsar',
      selectedRoomLabel: 'Habitación Seleccionada',
      upgradesLabel: 'Mejoras',
      specialOffersLabel: 'Ofertas Especiales',
      roomTotalLabel: 'Total de la Habitación',
      subtotalLabel: 'Subtotal',
      taxesLabel: 'Impuestos (10%)',
      totalLabel: 'Total',
      payAtHotelLabel: 'El pago se realizará en el hotel',
      viewTermsLabel: 'Ver Términos y Condiciones',
      confirmAllButtonLabel: 'Confirmar Todas las Reservas',
      confirmingAllLabel: 'Confirmando...',
      editLabel: 'Editar',
      addLabel: 'Añadir',
      addUpgradeTitle: 'Añadir Mejora de Habitación',
      addSpecialOfferTitle: 'Añadir Oferta Especial',
      noUpgradesSelectedLabel: 'No hay mejoras seleccionadas',
      noOffersSelectedLabel: 'No hay ofertas especiales seleccionadas',
      noMoreUpgradesLabel: 'No hay más mejoras disponibles',
      noMoreOffersLabel: 'No hay más ofertas disponibles',
      euroSuffix: ' EUR',
      nightsLabel: 'noches',
      nightLabel: 'noche',
      guestsLabel: 'huéspedes',
      guestLabel: 'huésped',
      roomImageAltText: 'Imagen de habitación',
      removedSuccessfully: 'eliminado exitosamente',
      addedSuccessfully: 'añadido exitosamente',
      cannotRemoveRoom: 'No se puede eliminar la reserva de habitación',
      itemAlreadyAdded: 'Este elemento ya ha sido añadido',
      notificationsLabel: 'Notificaciones',
      closeNotificationLabel: 'Cerrar notificación',
    },
  },
}

// Section configurations for RoomCustomization
export const getSectionsConfig = (lang: 'en' | 'es') => {
  const texts = translations[lang]
  return [
    {
      key: 'camas',
      title: texts.bedsTitle || 'Camas',
      icon: Bed,
      hasModal: true,
      hasFeatures: false,
      infoText: texts.bedsInfoText,
    },
    {
      key: 'ubicacion',
      title: texts.locationTitle || 'Ubicación',
      icon: Hotel,
      hasModal: true,
      hasFeatures: false,
      infoText: texts.locationInfoText,
    },
    {
      key: 'piso',
      title: texts.floorTitle || 'Piso',
      icon: Building2,
      hasModal: true,
      hasFeatures: true,
      infoText: texts.floorInfoText,
    },
    {
      key: 'vista',
      title: texts.viewTitle || 'Vista exacta',
      icon: Waves,
      hasModal: false,
      hasFeatures: false,
      infoText: texts.viewInfoText,
    },
  ]
}

// Mock data for multi-booking scenarios
export const mockRoomBookings = [
  {
    id: 'booking-1',
    roomName: 'Deluxe Room',
    roomNumber: '201',
    guestName: 'John Smith',
    checkIn: '01/01/2025',
    checkOut: '05/01/2025',
    guests: 2,
    nights: 4,
    payAtHotel: true,
    roomImage:
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    items: [
      { id: 'room-1', name: 'Deluxe Room', price: 129.99, type: 'room' as const },
      { id: 'breakfast-1', name: 'Breakfast Package', price: 15.0, type: 'offer' as const },
      { id: 'ocean-view-1', name: 'Ocean View', price: 45.0, type: 'customization' as const },
    ],
  },
  {
    id: 'booking-2',
    roomName: 'Premium Room',
    roomNumber: '305',
    guestName: 'Sarah Johnson',
    checkIn: '01/01/2025',
    checkOut: '05/01/2025',
    guests: 3,
    nights: 4,
    payAtHotel: false,
    roomImage:
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    items: [
      { id: 'room-2', name: 'Premium Room', price: 199.99, type: 'room' as const },
      { id: 'spa-2', name: 'Spa Access', price: 50.0, type: 'offer' as const },
      { id: 'king-bed-2', name: 'King Bed', price: 30.0, type: 'customization' as const },
      { id: 'poolside-2', name: 'Poolside', price: 25.0, type: 'customization' as const },
    ],
  },
  {
    id: 'booking-3',
    roomName: 'Executive Suite',
    roomNumber: '501',
    guestName: 'Michael Davis',
    checkIn: '01/01/2025',
    checkOut: '05/01/2025',
    guests: 2,
    nights: 4,
    payAtHotel: true,
    roomImage:
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    items: [
      { id: 'room-3', name: 'Executive Suite', price: 299.99, type: 'room' as const },
      { id: 'dinner-3', name: 'Gourmet Dinner', price: 60.0, type: 'offer' as const },
      { id: 'transfer-3', name: 'Airport Transfer', price: 35.0, type: 'offer' as const },
      { id: 'high-floor-3', name: 'High Floor (5+)', price: 30.0, type: 'customization' as const },
    ],
  },
]

// Available items for adding to rooms
export const mockAvailableUpgrades = [
  { id: 'king-bed', name: 'King Bed', price: 30, category: 'Beds' },
  { id: 'ocean-view', name: 'Ocean View', price: 45, category: 'View' },
  { id: 'poolside', name: 'Poolside', price: 25, category: 'Location' },
  { id: 'high-floor', name: 'High Floor (5+)', price: 30, category: 'Floor' },
]

export const mockAvailableOffers = [
  { id: 'breakfast', name: 'Breakfast Package', price: 15, category: 'Dining' },
  { id: 'spa', name: 'Spa Access', price: 50, category: 'Wellness' },
  { id: 'transfer', name: 'Airport Transfer', price: 35, category: 'Transport' },
  { id: 'dinner', name: 'Gourmet Dinner', price: 60, category: 'Dining' },
  { id: 'laundry', name: 'Laundry Service', price: 20, category: 'Services' },
]

// Section options for RoomCustomization
export const sectionOptions = {
  camas: bedsOptions,
  ubicacion: locationOptions,
  piso: floorOptions,
  vista: viewOptions,
}
