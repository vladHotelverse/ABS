export type BookingBannerProps = {
  className?: string
  hotelImage?: string
  companyLogo?: string
  welcomeText?: {
    salutation: string
  }
  hotelName?: string
  // Optional booking info displayed on the right
  bookingDateRange?: string
  bookingNights?: string
  bookingReference?: string
}
