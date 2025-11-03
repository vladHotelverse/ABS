import { Calendar, Info, User, Users } from 'lucide-react'
import type React from 'react'
import { Badge } from '@/components/ui/badge'
import { TooltipProvider, UiTooltip, UiTooltipContent, UiTooltipTrigger } from '@/components/ui/tooltip'
import type { BookingInfoCardProps } from './types'

const BookingInfoCard: React.FC<BookingInfoCardProps> = ({
  checkInDate,
  checkOutDate,
  occupancy,
  firstName,
  lastName,
  statusText,
  statusVariant = 'secondary',
  showDateInfo,
  translations,
}) => {
  if (!showDateInfo) return null

  return (
    <div className="rounded-lg bg-muted p-4 shadow-[var(--shadow-depth-1)] transition-all duration-200">
      <div className="flex flex-col gap-3 text-sm sm:grid sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-2">
          <div>
            <div className="flex gap-2 font-medium">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {translations.stay}
            </div>
            <div className="text-muted-foreground">
              {checkInDate} • {checkOutDate}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <div className="flex gap-2 font-medium">
              <Users className="h-4 w-4 text-muted-foreground" />
              {translations.guests}
            </div>
            <div className="text-muted-foreground">
              {occupancy.adults} adult{occupancy.adults !== 1 ? 's' : ''}
              {occupancy.childs > 0 && `, ${occupancy.childs} child${occupancy.childs !== 1 ? 'ren' : ''}`}
              {occupancy.infants > 0 && `, ${occupancy.infants} infant${occupancy.infants !== 1 ? 's' : ''}`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <div className="flex gap-2 font-medium">
              <User className="h-4 w-4 text-muted-foreground" />
              {translations.guest}
            </div>
            <div className="text-muted-foreground">
              {firstName} {lastName}
            </div>
          </div>
        </div>

        {statusText && (
          <div className="flex items-center gap-2">
            <div className="w-full">
              <section className="flex justify-between">
                <div className="mb-1 flex gap-2 font-medium">
                  <TooltipProvider>
                    <UiTooltip>
                      <UiTooltipTrigger asChild>
                        <div className="flex items-center gap-1.5">
                          <Info className="h-3.5 w-3.5 cursor-pointer text-muted-foreground" />
                        </div>
                      </UiTooltipTrigger>
                      <UiTooltipContent>
                        <p className="max-w-xs text-xs">{statusText}</p>
                      </UiTooltipContent>
                    </UiTooltip>
                  </TooltipProvider>
                  {translations.status}
                </div>
                <div></div>
              </section>
              <div className="flex items-center gap-1.5">
                <Badge variant={statusVariant}>{statusText}</Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingInfoCard
