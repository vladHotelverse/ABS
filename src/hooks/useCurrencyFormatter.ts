import { useCallback, useMemo } from 'react'

export interface CurrencyFormatterOptions {
  currency?: string
  locale?: string
  euroSuffix?: string
  decimals?: number
  fallbackSymbol?: string
}

export interface UseCurrencyFormatterProps {
  currency?: string
  locale?: string
  euroSuffix?: string
  fallbackSymbol?: string
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
 * Enhanced hook for consistent currency formatting across the application
 * Provides robust error handling and flexible formatting options
 */
export const useCurrencyFormatter = ({
  currency,
  locale,
  euroSuffix = '€',
  fallbackSymbol = '€',
}: UseCurrencyFormatterProps = {}) => {
  // Memoized Intl.NumberFormat instance for performance
  const formatter = useMemo(() => {
    if (currency && locale) {
      try {
        // Validate currency format (3-letter ISO code)
        if (!/^[A-Z]{3}$/.test(currency)) {
          console.warn(`Invalid currency format: ${currency}. Expected 3-letter ISO code.`)
          return null
        }

        // Create and validate formatter
        const testFormatter = new Intl.NumberFormat(locale, {
          style: 'currency',
          currency,
        })
        
        // Test with 0 to validate configuration
        testFormatter.format(0)
        return testFormatter
      } catch (error) {
        console.warn(`Invalid currency or locale: ${currency}, ${locale}`, error)
        return null
      }
    }
    return null
  }, [currency, locale])

  // Main formatting function
  const formatCurrency = useCallback(
    (price: number, options: CurrencyFormatterOptions = {}): string => {
      const {
        currency: optionCurrency,
        locale: optionLocale,
        euroSuffix: optionEuroSuffix = euroSuffix,
        decimals,
        fallbackSymbol: optionFallbackSymbol = fallbackSymbol,
      } = options

      // Handle invalid numbers
      if (typeof price !== 'number' || !Number.isFinite(price)) {
        return `${optionFallbackSymbol}0.00`
      }

      // Use provided options or fallback to hook configuration
      const finalCurrency = optionCurrency || currency
      const finalLocale = optionLocale || locale

      // Try to use Intl.NumberFormat if available
      if (formatter && !optionCurrency && !optionLocale) {
        return formatter.format(price)
      }

      // Create new formatter if options provided
      if (finalCurrency && finalLocale) {
        try {
          const customFormatter = new Intl.NumberFormat(finalLocale, {
            style: 'currency',
            currency: finalCurrency,
          })
          return customFormatter.format(price)
        } catch (error) {
          console.warn(`Failed to format with custom options: ${finalCurrency}, ${finalLocale}`, error)
        }
      }

      // Fallback formatting with proper decimal places
      const finalDecimals = decimals ?? (finalCurrency ? getCurrencyDecimals(finalCurrency) : 2)
      
      try {
        const formattedNumber = price.toLocaleString('en-US', {
          minimumFractionDigits: finalDecimals,
          maximumFractionDigits: finalDecimals,
        })
        return `${optionEuroSuffix}${formattedNumber}`
      } catch (error) {
        // Final fallback
        return `${optionFallbackSymbol}${price.toFixed(finalDecimals)}`
      }
    },
    [formatter, euroSuffix, fallbackSymbol, currency, locale]
  )

  // Simplified format function for common use cases
  const format = useCallback(
    (price: number): string => formatCurrency(price),
    [formatCurrency]
  )

  // Utility functions
  const formatWithDecimals = useCallback(
    (price: number, decimals: number): string => 
      formatCurrency(price, { decimals }),
    [formatCurrency]
  )

  const formatWithSymbol = useCallback(
    (price: number, symbol: string): string => 
      formatCurrency(price, { euroSuffix: symbol, fallbackSymbol: symbol }),
    [formatCurrency]
  )

  return {
    formatCurrency,
    format,
    formatWithDecimals,
    formatWithSymbol,
    isValidConfiguration: !!formatter || (!currency && !locale),
    currencyDecimals: currency ? getCurrencyDecimals(currency) : 2,
  }
}

/**
 * Simple utility function for one-off currency formatting
 * without hook dependencies
 */
export const formatCurrency = (
  price: number,
  options: CurrencyFormatterOptions = {}
): string => {
  const {
    currency,
    locale,
    euroSuffix = '€',
    decimals,
    fallbackSymbol = '€',
  } = options

  // Handle invalid numbers
  if (typeof price !== 'number' || !Number.isFinite(price)) {
    return `${fallbackSymbol}0.00`
  }

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

  // Fallback formatting
  const finalDecimals = decimals ?? (currency ? getCurrencyDecimals(currency) : 2)
  
  try {
    const formattedNumber = price.toLocaleString('en-US', {
      minimumFractionDigits: finalDecimals,
      maximumFractionDigits: finalDecimals,
    })
    return `${euroSuffix}${formattedNumber}`
  } catch (error) {
    return `${fallbackSymbol}${price.toFixed(finalDecimals)}`
  }
}