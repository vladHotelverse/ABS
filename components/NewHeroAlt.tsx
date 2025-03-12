import Image from "next/image"
import { CheckCircle, MapPin, Tag, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface BookingDetailsProps {
  hotelName: string
  bookingCode: string
  checkInDate: string
  checkOutDate: string
  roomType: string
  guestCount: number
  status: "confirmed" | "pending" | "cancelled"
  totalPrice: number
  currency: string
  hotelImage: string
}

export default function BookingHeroAlt({
  hotelName = "Hotel Marina",
  bookingCode = "1003066AU",
  checkInDate = "01/01/2025",
  checkOutDate = "01/01/2025",
  roomType = "Deluxe Double Room",
  guestCount = 2,
  status = "confirmed",
  totalPrice = 328.9,
  currency = "€",
  hotelImage = "/placeholder.svg?height=500&width=1000",
}: Partial<BookingDetailsProps>) {
  // Calculate number of nights
  const nights = 1 // In a real app, calculate from dates

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      {/* Top status bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Booking {status}</span>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">Ref: {bookingCode}</div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Hotel name and price summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              {hotelName}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Thank you for choosing us for your stay</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 min-w-[200px]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-500 dark:text-slate-400">Total</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {currency}
                {totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex justify-between">
              <span>Payment status</span>
              <span className="font-medium text-green-600 dark:text-green-400">Paid in full</span>
            </div>
          </div>
        </div>

        {/* Main booking content - side by side layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column - Room image and details */}
          <div className="lg:col-span-3 space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md">
              <div className="aspect-[16/9] relative">
                <Image src={hotelImage || "/placeholder.svg"} alt={roomType} fill className="object-cover" priority />
                <div className="absolute top-4 left-4 bg-white dark:bg-slate-800 rounded-full px-4 py-1 text-sm font-medium shadow-lg flex items-center gap-1">
                  <Users className="h-4 w-4 text-primary" />
                  {guestCount} {guestCount === 1 ? "Guest" : "Guests"}
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-slate-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{roomType}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="text-sm text-slate-500 dark:text-slate-400">Room #214, Ocean View</span>
                    </div>
                  </div>
                  {status === "confirmed" && (
                    <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Confirmed
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Check-in</div>
                    <div className="font-medium text-slate-900 dark:text-white">{checkInDate}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">From 15:00</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-slate-500 dark:text-slate-400">Check-out</div>
                    <div className="font-medium text-slate-900 dark:text-white">{checkOutDate}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Until 11:00</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Room Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["King Bed", "Sea View", "Air Conditioning", "Free WiFi", "Mini Bar", "Room Service"].map(
                  (feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Right column - Booking enhancement */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/20 p-6 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full"></div>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/10 rounded-full"></div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Enhance Your Experience</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Customize your stay with premium upgrades and exclusive amenities.
              </p>

              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <svg
                          className="h-5 w-5 text-primary"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 10V7C20 5.34315 18.6569 4 17 4H7C5.34315 4 4 5.34315 4 7V10M20 10V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V10M20 10H4M8 2V4M16 2V4M9 16H15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">Room Upgrade</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Upgrade to a premium room</p>
                      </div>
                    </div>
                    <div className="text-primary group-hover:translate-x-1 transition-transform">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M9 6L15 12L9 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <svg
                          className="h-5 w-5 text-primary"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">Add Amenities</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Personalize with extras</p>
                      </div>
                    </div>
                    <div className="text-primary group-hover:translate-x-1 transition-transform">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M9 6L15 12L9 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <svg
                          className="h-5 w-5 text-primary"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2.67 18.95L7.6 15.64C8.39 15.11 9.53 15.17 10.24 15.78L10.57 16.07C11.35 16.74 12.61 16.74 13.39 16.07L17.55 12.5C18.33 11.83 19.59 11.83 20.37 12.5L22 13.9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white">Experiences</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Add local activities</p>
                      </div>
                    </div>
                    <div className="text-primary group-hover:translate-x-1 transition-transform">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M9 6L15 12L9 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-white">Continue to Customize</Button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Need Assistance?</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Our concierge team is available 24/7 to help with any requests.
              </p>
              <Button variant="outline" className="w-full">
                Contact Concierge
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

