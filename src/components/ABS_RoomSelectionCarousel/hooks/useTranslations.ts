import { useMemo } from 'react'
import type { RoomSelectionCarouselTranslations } from '../types'

interface UseTranslationsParams {
  translations?: RoomSelectionCarouselTranslations
  fallbackProps: {
    learnMoreText?: string
    nightText?: string
    priceInfoText?: string
    makeOfferText?: string
    availabilityText?: string
    selectedText?: string
    selectText?: string
    proposePriceText?: string
    currencyText?: string
    currencySymbol?: string
    offerMadeText?: string
    discountBadgeText?: string
    bidSubmittedText?: string
    updateBidText?: string
    cancelBidText?: string
    upgradeNowText?: string
    removeText?: string
  }
}

export const useTranslations = ({ translations, fallbackProps }: UseTranslationsParams) => {
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
      learnMoreText: getTranslation('learnMoreText', fallbackProps.learnMoreText, 'Descubre más detalles'),
      nightText: getTranslation('nightText', fallbackProps.nightText, '/noche'),
      priceInfoText: getTranslation('priceInfoText', fallbackProps.priceInfoText, 'Información sobre tarifas e impuestos.'),
      makeOfferText: getTranslation('makeOfferText', fallbackProps.makeOfferText, 'Hacer oferta'),
      availabilityText: getTranslation('availabilityText', fallbackProps.availabilityText, 'Sujeto a disponibilidad'),
      selectedText: getTranslation('selectedText', fallbackProps.selectedText, 'SELECCIONADO'),
      selectText: getTranslation('selectText', fallbackProps.selectText, 'SELECCIONAR'),
      proposePriceText: getTranslation('proposePriceText', fallbackProps.proposePriceText, 'Propon tu precio:'),
      currencyText: getTranslation('currencyText', fallbackProps.currencyText, 'EUR'),
      currencySymbol: getTranslation('currencySymbol', fallbackProps.currencySymbol, '€'),
      upgradeNowText: getTranslation('upgradeNowText', fallbackProps.upgradeNowText, 'Upgrade now'),
      removeText: getTranslation('removeText', fallbackProps.removeText, 'Remove'),
      offerMadeText: getTranslation('offerMadeText', fallbackProps.offerMadeText, 'Has propuesto {price} EUR por noche'),
      discountBadgeText: getTranslation('discountBadgeText', fallbackProps.discountBadgeText, '-{percentage}%'),
      noRoomsAvailableText: getTranslation('noRoomsAvailableText', undefined, 'No hay habitaciones disponibles.'),
      bidSubmittedText: getTranslation('bidSubmittedText', fallbackProps.bidSubmittedText, 'Bid submitted'),
      updateBidText: getTranslation('updateBidText', fallbackProps.updateBidText, 'Update bid'),
      cancelBidText: getTranslation('cancelBidText', fallbackProps.cancelBidText, 'Cancel'),
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
  }, [translations, fallbackProps])
}