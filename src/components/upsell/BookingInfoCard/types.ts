export interface BookingInfoCardProps {
  checkInDate: string
  checkOutDate: string
  occupancy: {
    adults: number
    childs: number
    infants: number
  }
  firstName: string
  lastName: string
  statusText?: string
  statusVariant?: 'default' | 'secondary' | 'destructive' | 'outline'
  showDateInfo: boolean
  translations: {
    stay: string
    guests: string
    guest: string
    status: string
  }
}
