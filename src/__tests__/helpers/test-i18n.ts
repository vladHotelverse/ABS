import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Test translations
const resources = {
  en: {
    translation: {
      // Common translations for tests
      'booking.title': 'Book Your Stay',
      'room.selection': 'Room Selection',
      'special.offers': 'Special Offers',
      'pricing.summary': 'Pricing Summary',
      'total': 'Total',
      'subtotal': 'Subtotal',
      'taxes': 'Taxes',
      'currency.eur': '€',
      'currency.usd': '$',
      'adults': 'Adults',
      'children': 'Children',
      'rooms': 'Rooms',
      'nights': 'nights',
      'per.night': 'per night',
      'add.to.cart': 'Add to Cart',
      'remove': 'Remove',
      'confirm': 'Confirm',
      'cancel': 'Cancel',
      'loading': 'Loading...',
      'error.generic': 'An error occurred',
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n