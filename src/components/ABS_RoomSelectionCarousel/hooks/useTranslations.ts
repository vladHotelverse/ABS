import { useMemo } from 'react'
import type { RoomSelectionCarouselTranslations } from '../types'

interface UseTranslationsParams {
  translations?: RoomSelectionCarouselTranslations
  fallbackProps?: Record<string, never> // Keep for backward compatibility but unused
}

export const useTranslations = ({ translations }: UseTranslationsParams) => {
  return useMemo(() => {
    // Helper function to resolve text values (new translations object takes precedence)
    const getTranslation = (
      key: keyof Omit<RoomSelectionCarouselTranslations, 'navigationLabels'>,
      fallbackValue?: string,
      defaultValue = ''
    ): string => {
      if (translations?.[key]) {
        return translations[key] as string
      }
      return fallbackValue || defaultValue
    }

    // Helper function to get navigation labels
    const getNavigationLabel = (
      key: keyof RoomSelectionCarouselTranslations['navigationLabels'],
      fallbackValue?: string,
      defaultValue = ''
    ): string => {
      if (translations?.navigationLabels?.[key]) {
        return translations.navigationLabels[key]
      }
      return fallbackValue || defaultValue
    }

    return {
      learnMoreText: getTranslation('learnMoreText', undefined, 'Descubre más detalles'),
      nightText: getTranslation('nightText', undefined, '/noche'),
      priceInfoText: getTranslation('priceInfoText', undefined, 'Información sobre tarifas e impuestos.'),
      makeOfferText: getTranslation('makeOfferText', undefined, 'Hacer oferta'),
      availabilityText: getTranslation('availabilityText', undefined, 'Sujeto a disponibilidad'),
      selectedText: getTranslation('selectedText', undefined, 'SELECCIONADO'),
      selectText: getTranslation('selectText', undefined, 'SELECCIONAR'),
      proposePriceText: getTranslation('proposePriceText', undefined, 'Propon tu precio:'),
      currencyText: getTranslation('currencyText', undefined, 'EUR'),
      currencySymbol: getTranslation('currencySymbol', undefined, '€'),
      upgradeNowText: getTranslation('upgradeNowText', undefined, 'Upgrade now'),
      removeText: getTranslation('removeText', undefined, 'Remove'),
      offerMadeText: getTranslation('offerMadeText', undefined, 'Has propuesto {price} EUR por noche'),
      discountBadgeText: getTranslation('discountBadgeText', undefined, '-{percentage}%'),
      noRoomsAvailableText: getTranslation('noRoomsAvailableText', undefined, 'No hay habitaciones disponibles.'),
      bidSubmittedText: getTranslation('bidSubmittedText', undefined, 'Bid submitted'),
      updateBidText: getTranslation('updateBidText', undefined, 'Update bid'),
      cancelBidText: getTranslation('cancelBidText', undefined, 'Cancel'),
      // Navigation labels
      previousRoom: getNavigationLabel('previousRoom', undefined, 'Previous room'),
      nextRoom: getNavigationLabel('nextRoom', undefined, 'Next room'),
      previousRoomMobile: getNavigationLabel('previousRoomMobile', undefined, 'Previous room (mobile)'),
      nextRoomMobile: getNavigationLabel('nextRoomMobile', undefined, 'Next room (mobile)'),
      goToRoom: getNavigationLabel('goToRoom', undefined, 'Go to room {index}'),
      previousImage: getNavigationLabel('previousImage', undefined, 'Previous image'),
      nextImage: getNavigationLabel('nextImage', undefined, 'Next image'),
      viewImage: getNavigationLabel('viewImage', undefined, 'View image {index}'),
    }
  }, [translations])
}