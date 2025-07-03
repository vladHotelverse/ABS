import type { BookingInfoProps, RoomBookingInfo, BookingInfoBarItemProps } from '../types'

// Test-specific mock data factory functions
export const createTestBookingItems = (overrides: Partial<BookingInfoBarItemProps>[] = []) => [
  {
    icon: 'Tag' as const,
    label: 'Código de reserva',
    value: '1003066AU',
  },
  {
    icon: 'Calendar' as const,
    label: 'Fechas de estancia',
    value: '01/01/2025 - 01/01/2025',
  },
  {
    icon: 'Home' as const,
    label: 'Tipo de habitación',
    value: 'Deluxe Double Room with Balcony and Ocean View',
  },
  {
    icon: 'Users' as const,
    label: 'Ocupación',
    value: '2 Adultos, 1 Niño',
  },
  ...overrides,
]

export const createTestRoomBookings = (count = 2): RoomBookingInfo[] =>
  [
    {
      id: 'room-1',
      roomName: 'Deluxe Double Room with Ocean View',
      guestName: 'María García',
      roomImage: 'https://example.com/room1.jpg',
      items: [
        {
          icon: 'Tag',
          label: 'Código de reserva',
          value: '1003066AU',
        },
        {
          icon: 'Calendar',
          label: 'Fechas de estancia',
          value: '01/01/2025 - 05/01/2025',
        },
      ],
    },
    {
      id: 'room-2',
      roomName: 'Standard Twin Room',
      guestName: 'Carlos Rodríguez',
      items: [
        {
          icon: 'Home',
          label: 'Tipo de habitación',
          value: 'Standard Twin Room',
        },
      ],
    },
  ].slice(0, count)

export const createTestLabels = () => ({
  multiRoomBookingsTitle: 'Reservas múltiples',
  roomsCountLabel: 'habitaciones',
  singleRoomLabel: 'habitación',
  clickToExpandLabel: 'Haz clic para expandir',
  roomLabel: 'Habitación',
  guestLabel: 'Huésped',
  selectionLabel: 'Selected',
})

export const createSingleBookingProps = (overrides: Partial<BookingInfoProps> = {}): BookingInfoProps =>
  ({
    showBanner: true,
    title: 'Información de tu reserva',
    items: createTestBookingItems(),
    ...overrides,
  }) as BookingInfoProps

export const createMultiBookingProps = (overrides: Partial<BookingInfoProps> = {}): BookingInfoProps =>
  ({
    showBanner: true,
    title: 'Información de tus reservas',
    roomBookings: createTestRoomBookings(),
    labels: createTestLabels(),
    ...overrides,
  }) as BookingInfoProps

// Viewport mocking utilities
export const mockViewport = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
}

export const VIEWPORT_SIZES = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
  xl: 1400,
} as const
