import { useCallback, useMemo } from 'react'

interface UseCurrencyFormatterProps {
  currency?: string
  locale?: string
  euroSuffix: string
}

export const useCurrencyFormatter = ({ currency, locale, euroSuffix }: UseCurrencyFormatterProps) => {
  const formatter = useMemo(() => {
    if (currency && locale) {
      try {
        // Check if currency is a valid 3-letter code and locale is valid
        if (!/^[A-Z]{3}$/.test(currency)) {
          console.warn(`Invalid currency format: ${currency}`)
          return null
        }

        // Validate by creating and testing formatter
        const testFormatter = new Intl.NumberFormat(locale, {
          style: 'currency',
          currency,
        })
        testFormatter.format(0) // Test with 0 to validate

        return testFormatter
      } catch (error) {
        console.warn(`Invalid currency or locale: ${currency}, ${locale}`, error)
        return null
      }
    }
    return null
  }, [currency, locale])

  const formatCurrency = useCallback(
    (price: number): string => {
      if (formatter) {
        return formatter.format(price)
      }
      return `${euroSuffix}${price.toFixed(2)}`
    },
    [formatter, euroSuffix]
  )

  return formatCurrency
}
