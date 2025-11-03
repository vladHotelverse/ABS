import { Calendar, Hash } from 'lucide-react'
import type React from 'react'
import { HotelBanner } from './components'
import type { BookingBannerProps } from './types'

const BookingBanner: React.FC<BookingBannerProps> = ({
  className,
  hotelImage,
  companyLogo,
  welcomeText,
  hotelName,
  bookingDateRange,
  bookingNights,
  bookingReference,
}) => {
  const hasBookingInfo = Boolean(bookingDateRange || bookingReference)
  const renderBookingInfo = (alignment: 'start' | 'end') => {
    const rowAlignmentClasses = alignment === 'end' ? 'md:justify-end md:min-w-[14rem]' : ''
    const textAlignmentClasses = alignment === 'end' ? 'md:text-right' : ''

    const infoRows = [
      bookingDateRange && {
        key: 'date',
        Icon: Calendar,
        content: (
          <span className={`whitespace-nowrap text-foreground text-sm ${textAlignmentClasses}`}>
            {bookingDateRange}
            {bookingNights && <span className="ml-1 text-muted-foreground md:ml-0 md:pl-1">{bookingNights}</span>}
          </span>
        ),
      },
      bookingReference && {
        key: 'reference',
        Icon: Hash,
        content: <span className={`text-foreground text-sm ${textAlignmentClasses}`}>{bookingReference}</span>,
      },
    ].filter(Boolean) as Array<{ key: string; Icon: typeof Calendar; content: React.ReactNode }>

    return infoRows.map(({ key, Icon, content }) => (
      <div key={key} className={`flex items-center gap-2 ${rowAlignmentClasses}`}>
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        {content}
      </div>
    ))
  }

  return (
    <div className={`${className ? className : ''} container relative mx-auto w-full px-3 py-6 sm:px-4 sm:py-8`}>
      {/* Hotel Image Banner */}
      <HotelBanner hotelImage={hotelImage} welcomeText={welcomeText} />

      {/* Company Logo & Hotel Name - Enhanced Floating Card Design */}
      {companyLogo && (
        <img
          src={companyLogo}
          alt="Company logo"
          className="-translate-y-1/2 absolute top-2/3 left-8 z-10 hidden h-24 w-24 rounded-xl border-2 border-border bg-background object-contain shadow-depth-2 md:block"
        />
      )}
      {hotelName && (
        <div className="relative flex flex-col gap-4 rounded-xl bg-background p-4 shadow-xl transition-all duration-300 md:flex-row md:items-center md:justify-between md:px-5 md:py-6">
          <div className={`flex w-full flex-col gap-3 ${companyLogo ? 'md:pl-28' : ''}`}>
            <div className="flex items-start gap-3 md:block">
              {companyLogo && (
                <img
                  src={companyLogo}
                  alt="Company logo"
                  className="h-16 w-16 rounded-xl border-2 border-border bg-background object-contain shadow-depth-2 md:hidden"
                />
              )}
              <div>
                <div className="font-semibold text-foreground text-lg leading-tight md:text-xl">{hotelName}</div>
                {welcomeText && (
                  <div className="text-muted-foreground text-xs md:text-sm">{welcomeText.salutation || 'Welcome'}</div>
                )}
              </div>
            </div>
            {hasBookingInfo && (
              <div className="flex flex-col gap-2 text-left md:hidden">{renderBookingInfo('start')}</div>
            )}
          </div>
          {hasBookingInfo && (
            <div className="hidden flex-col items-end gap-2 pr-2 text-right md:flex md:w-auto">
              {renderBookingInfo('end')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export { BookingBanner }
export default BookingBanner
