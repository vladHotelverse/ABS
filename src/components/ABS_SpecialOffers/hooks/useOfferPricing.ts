import { useCallback } from 'react'
import type { OfferLabels, OfferSelection, OfferType } from '../types'

export const useOfferPricing = (currencySymbol: string) => {
  const formatPrice = useCallback(
    (price: number): string => {
      return `${currencySymbol}${price.toFixed(2)}`
    },
    [currencySymbol]
  )

  const calculateTotal = useCallback((offer: OfferType, selection: OfferSelection): number => {
    if (selection.quantity === 0) return 0

    switch (offer.type) {
      case 'perPerson':
        return offer.price * selection.quantity * (selection.persons || 1)
      case 'perNight':
        return offer.price * selection.quantity * (selection.nights || 1)
      default: // perStay
        return offer.price * selection.quantity
    }
  }, [])

  const getUnitLabel = useCallback((type: OfferType['type'], labels: OfferLabels): string => {
    switch (type) {
      case 'perStay':
        return labels.perStay || 'per stay'
      case 'perPerson':
        return labels.perPerson || 'per person'
      case 'perNight':
        return labels.perNight || 'per night'
      default:
        return ''
    }
  }, [])

  return { formatPrice, calculateTotal, getUnitLabel }
}
