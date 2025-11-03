'use client'

import clsx from 'clsx'
import { CreditCard } from 'lucide-react'
import type React from 'react'
import { Button } from '@/components/ui/button'
import LoadingSkeleton from '@/components/upsell/PricingSummaryPanel/components/LoadingSkeleton'

interface PriceBreakdownProps {
  formattedTotal: string // Pre-formatted with currency
  isLoading: boolean
  disabled?: boolean
  labels: {
    totalLabel: string
    payAtHotelLabel: string
    viewTermsLabel: string
    confirmButtonLabel: string
    loadingLabel: string
    subjectToAvailability?: string
  }
  onConfirm?: () => void
}

/**
 * Pure UI component - displays pre-formatted pricing
 * No currency formatting or calculations
 */
const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  formattedTotal,
  isLoading,
  disabled = false,
  labels,
  onConfirm,
}) => {
  return (
    <>
      {/* Separator before pricing */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground text-lg">{labels.totalLabel}</span>
          {isLoading ? (
            <LoadingSkeleton width="w-20" height="h-6" />
          ) : (
            <span
              className={clsx(
                'font-bold text-foreground text-lg',
                'transition-all duration-500 ease-in-out',
                'whitespace-nowrap'
              )}
            >
              {formattedTotal}
            </span>
          )}
        </div>

        {/* Payment information */}
        <div className="payment-info">
          <section className="flex w-full justify-between">
            <div className="flex items-center gap-1">
              <CreditCard size={20} strokeWidth={2} className="mr-2 h-5 w-5 text-muted-foreground" />
              <span className="text-foreground text-sm">{labels.payAtHotelLabel}</span>
            </div>
            {labels.subjectToAvailability && (
              <span className="text-muted-foreground text-xs italic">{labels.subjectToAvailability}</span>
            )}
          </section>
          {/* <Button
          type="button"
          variant="link"
          size="sm"
          className="cursor-pointer border-none bg-transparent pl-0 font-medium text-muted-foreground text-sm underline transition-colors hover:text-foreground"
        >
          {labels.viewTermsLabel}
        </Button> */}
        </div>

        {/* Confirm Button */}
        <Button
          onClick={onConfirm}
          disabled={isLoading || disabled}
          variant="default"
          className="inline-flex w-full cursor-pointer items-center justify-center py-3 transition-all duration-200 hover:shadow-md disabled:hover:shadow-none"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-current border-t-2 border-b-2" />
              <span>{labels.loadingLabel}</span>
            </div>
          ) : (
            labels.confirmButtonLabel
          )}
        </Button>
      </div>
    </>
  )
}

export default PriceBreakdown
