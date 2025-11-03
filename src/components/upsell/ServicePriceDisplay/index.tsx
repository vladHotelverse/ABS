import type React from 'react'

interface ServicePriceDisplayProps {
  servicePrice: {
    amount: number
    amountFormatted: string
  }
  translationKey?: string
}

const ServicePriceDisplay: React.FC<ServicePriceDisplayProps> = ({
  servicePrice,
  translationKey = 'booking.view.servicePrice',
}) => {
  if (servicePrice.amount <= 0) return null

  return (
    <div className="flex items-center justify-between rounded-lg bg-gradient-to-br from-accent/50 to-accent/30 p-4 text-sm shadow-[var(--shadow-depth-2)] transition-all duration-200 hover:shadow-[var(--shadow-depth-3)]">
      <span className="font-medium text-foreground">{translationKey}</span>
      <span className="font-semibold text-foreground">{servicePrice.amountFormatted}</span>
    </div>
  )
}

export default ServicePriceDisplay
