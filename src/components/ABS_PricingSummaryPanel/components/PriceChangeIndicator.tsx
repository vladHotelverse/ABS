import { ArrowUpCircle } from 'lucide-react'
import type React from 'react'
import { formatPrice, getCurrencyDecimals } from '../../../lib/currency'

interface PriceChangeIndicatorProps {
  price: number
  euroSuffix: string
  currency?: string
  locale?: string
}

const PriceChangeIndicator: React.FC<PriceChangeIndicatorProps> = ({ price, euroSuffix, currency, locale }) => {

  // Use new currency utility for consistent formatting
  const formatCurrency = (price: number): string => {
    if (currency && locale) {
      try {
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency,
        }).format(price)
      } catch (error) {
        console.warn(`Invalid currency or locale: ${currency}, ${locale}`, error)
      }
    }

    // Fallback to simple formatting with proper decimal places
    const decimals = currency ? getCurrencyDecimals(currency) : 2
    return formatPrice(price, euroSuffix, decimals)
  }

  return (
    <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
      <ArrowUpCircle className="w-3 h-3 mr-1" />+{formatCurrency(price)}
    </div>
  )
}

export default PriceChangeIndicator
