'use client'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface PriceSummaryItem {
  id: string
  name: string
  price: string
}

interface BookingsSummarySectionProps {
  upgrades: PriceSummaryItem[]
  extras: PriceSummaryItem[]
  totalAmountFormatted: string
  t: (key: string, values?: Record<string, string | number>) => string
}

const BookingsSummarySection = ({ upgrades, extras, totalAmountFormatted, t }: BookingsSummarySectionProps) => {
  const hasBreakdown = upgrades.length > 0 || extras.length > 0

  return (
    <div className="space-y-6">
      <Separator />
      <Card className="border-none pt-6 shadow-none">
        <CardContent className="space-y-4">
          {hasBreakdown ? (
            <div className="rounded-lg border border-border/60 bg-muted/20">
              <div className="flex items-center justify-between px-4 py-3">
                <p className="font-medium text-foreground text-sm">{t('booking.view.priceBreakdown')}</p>
              </div>
              <Separator className="bg-border/60" />
              <div className="divide-y divide-border/60">
                {upgrades.length > 0 && (
                  <div className="space-y-3 px-4 py-3">
                    <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      {t('booking.view.upgrades')}
                    </p>
                    <div className="space-y-2">
                      {upgrades.map((upgrade) => (
                        <div key={upgrade.id} className="flex items-center justify-between text-sm">
                          <span className="text-foreground">{upgrade.name}</span>
                          <span className="font-medium text-emerald-600">{upgrade.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {extras.length > 0 && (
                  <div className="space-y-3 px-4 py-3">
                    <p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                      {t('booking.view.customizations')}
                    </p>
                    <div className="space-y-2">
                      {extras.slice(0, 5).map((extra) => (
                        <div key={extra.id} className="flex items-center justify-between text-sm">
                          <span className="text-foreground">{extra.name}</span>
                          <span className="font-medium text-emerald-600">{extra.price}</span>
                        </div>
                      ))}
                    </div>
                    {extras.length > 5 && (
                      <p className="text-muted-foreground text-xs">
                        {t('booking.view.andMore', { count: extras.length - 5 })}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">{t('booking.view.noPriceBreakdown')}</p>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-4 border-border/60 border-t pt-6">
          <div className="flex w-full items-center justify-between">
            <span className="font-semibold text-foreground">{t('booking.view.grandTotal')}</span>
            <span className="font-bold text-2xl">{totalAmountFormatted}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default BookingsSummarySection
