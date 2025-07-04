import { useCallback } from 'react'

/**
 * Legacy currency formatter - kept for backward compatibility
 * @deprecated Use the new useCurrencyFormatter function instead
 */
export const useCurrencyFormatterLegacy = (currency = 'EUR', locale?: string) => {
  return useCallback(
    (amount: number): string => {
      // Handle browser environment check
      if (typeof window === 'undefined' && !locale) {
        // Fallback for SSR - basic formatting
        return `${amount.toFixed(2)} ${currency}`
      }

      try {
        return new Intl.NumberFormat(locale ?? navigator.language, {
          style: 'currency',
          currency,
          // Let Intl.NumberFormat handle decimal places based on currency
          minimumFractionDigits: undefined,
          maximumFractionDigits: undefined,
        }).format(amount)
      } catch (error) {
        // Fallback if currency or locale is invalid
        console.warn(`Invalid currency or locale: ${currency}, ${locale}`, error)
        return `${amount.toFixed(2)} ${currency}`
      }
    },
    [currency, locale]
  )
}

/**
 * Simple price formatter for cases where we need basic formatting
 * without full internationalization
 */
export const formatPrice = (amount: number, currencySymbol = '€', decimals = 2): string => {
  // Handle edge cases
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return `${currencySymbol}0.00`
  }

  if (!Number.isFinite(amount)) {
    return `${currencySymbol}0.00`
  }

  // Format with thousands separators for better readability
  const formattedNumber = amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return `${currencySymbol}${formattedNumber}`
}

/**
 * Utility to get currency decimal places for manual formatting
 */
export const getCurrencyDecimals = (currency: string): number => {
  const zeroDecimalCurrencies = ['JPY', 'KRW', 'CLP', 'VND', 'XAF', 'XOF']
  const threeDecimalCurrencies = ['BHD', 'JOD', 'KWD', 'OMR', 'TND']

  if (zeroDecimalCurrencies.includes(currency.toUpperCase())) {
    return 0
  }
  if (threeDecimalCurrencies.includes(currency.toUpperCase())) {
    return 3
  }
  return 2 // Default for most currencies
}

/**
 * Centralized currency formatting utility
 * Provides consistent formatting across all pricing components
 */
export function formatCurrency(
  price: number,
  options: {
    currency?: string
    locale?: string
    euroSuffix?: string
    decimals?: number
  } = {}
): string {
  const { currency, locale, euroSuffix = '€', decimals } = options

  // Use international formatting when currency and locale are provided
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

  // Fallback to simple formatting with proper decimal places and locale-aware thousands separators
  const finalDecimals = decimals ?? (currency ? getCurrencyDecimals(currency) : 2)
  
  // Use locale-aware formatting even for fallback
  try {
    const formattedNumber = price.toLocaleString('en-US', {
      minimumFractionDigits: finalDecimals,
      maximumFractionDigits: finalDecimals,
    })
    return `${euroSuffix}${formattedNumber}`
  } catch (error) {
    // Final fallback
    return formatPrice(price, euroSuffix, finalDecimals)
  }
}

/**
 * Hook for consistent currency formatting in React components
 */
export function useCurrencyFormatter(currency?: string, locale?: string, euroSuffix?: string) {
  return (price: number, decimals?: number) =>
    formatCurrency(price, {
      currency,
      locale,
      euroSuffix,
      decimals,
    })
}
