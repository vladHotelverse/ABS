import clsx from 'clsx'
import { CreditCard } from 'lucide-react'
import type React from 'react'
import { useCurrencyFormatter } from '../../../hooks/useCurrencyFormatter'
import { UiButton } from '../../ui/button'
import LoadingSkeleton from './LoadingSkeleton'

interface PriceBreakdownLabels {
  subtotalLabel: string
  totalLabel: string
  payAtHotelLabel: string
  viewTermsLabel: string
  confirmButtonLabel: string
  loadingLabel: string
  euroSuffix: string
}

interface PriceBreakdownProps {
  subtotal: number
  isLoading: boolean
  disabled?: boolean
  labels: PriceBreakdownLabels
  currency?: string
  locale?: string
  onConfirm?: () => void
}

const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  subtotal,
  isLoading,
  disabled = false,
  labels,
  currency,
  locale,
  onConfirm,
}) => {
  // Use centralized currency formatting hook
  const { format: formatPrice } = useCurrencyFormatter({ currency, locale, euroSuffix: labels.euroSuffix })

  return (
    <>
      {/* Separator before pricing */}
      <div className="space-y-3">
        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-bold text-foreground">{labels.totalLabel}</span>
          {isLoading ? (
            <LoadingSkeleton width="w-20" height="h-6" />
          ) : (
            <span className={clsx('text-lg font-bold text-foreground', 'transition-all duration-500 ease-in-out', 'whitespace-nowrap')}>
              {formatPrice(subtotal)}
            </span>
          )}
        </div>
      </div>

      {/* Payment information */}
      <div className="payment-info">
        <div className="flex items-center mb-3">
          <CreditCard size={20} strokeWidth={2} className="h-5 w-5 text-muted-foreground mr-2" />
          <span className="text-sm text-foreground">{labels.payAtHotelLabel}</span>
        </div>

        <UiButton
          type="button"
          variant="link"
          size="sm"
          className="pl-0 text-sm text-muted-foreground font-medium underline bg-transparent border-none cursor-pointer hover:text-foreground transition-colors"
        >
          {labels.viewTermsLabel}
        </UiButton>
      </div>

      {/* Confirm Button */}
      <UiButton
        onClick={onConfirm}
        disabled={isLoading || disabled}
        variant="black"
        className="inline-flex w-full items-center justify-center py-3 transition-all duration-200 hover:shadow-md disabled:hover:shadow-none cursor-pointer"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-t-2 border-b-2 border-current rounded-full" />
            <span>{labels.loadingLabel}</span>
          </div>
        ) : (
          labels.confirmButtonLabel
        )}
      </UiButton>
    </>
  )
}

export default PriceBreakdown
export type { PriceBreakdownLabels }
