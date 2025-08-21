// Types for the Pre-Booking Form component

export interface BookingRoom {
  id: string
  roomName: string
  roomNumber: string
  guestName: string
  checkIn: string
  checkOut: string
  guests: number
  nights: number
}

export interface BookingInfo {
  reservationCode: string
  isMultiRoom: boolean
  guestName: string
  guestEmail: string
  checkIn: string
  checkOut: string
  roomType: string
  occupancy: string
  rooms: BookingRoom[]
}

export interface ValidationResult {
  isValid: boolean
  bookingInfo?: BookingInfo
  error?: string
}

export interface BookingLookupService {
  validateReservation: (code: string) => Promise<ValidationResult>
}