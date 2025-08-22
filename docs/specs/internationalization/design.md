# Internationalization System - Design

## Architecture Overview

```typescript
// i18n configuration with React i18next
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: englishTranslations },
      es: { translation: spanishTranslations }
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  })
```

## Translation Management

### Static Translations
```json
// src/i18n/locales/en.json
{
  "booking": {
    "selectRoom": "Select Room",
    "customize": "Customize Your Stay",
    "specialOffers": "Special Offers",
    "totalPrice": "Total Price: {{price}} {{currency}}"
  },
  "validation": {
    "required": "This field is required",
    "invalidEmail": "Please enter a valid email"
  }
}
```

### Dynamic Translations (Supabase)
```typescript
// Database-driven content translations
interface Translation {
  key: string
  translations: {
    en: string
    es: string
    [language: string]: string
  }
  context: string
}
```

## Component Integration

```typescript
// Using translations in components
const RoomCard = () => {
  const { t, i18n } = useTranslation()
  
  return (
    <div className="room-card">
      <h3>{t('booking.selectRoom')}</h3>
      <p>{t('booking.totalPrice', { 
        price: formatCurrency(room.price), 
        currency: room.currency 
      })}</p>
    </div>
  )
}
```

## Localization Features

### Currency and Number Formatting
- Locale-based number formatting (1,234.56 vs 1.234,56)
- Currency symbol positioning and formatting
- Percentage and decimal display conventions

### Date and Time Localization  
- Regional date format preferences (MM/DD/YYYY vs DD/MM/YYYY)
- Time format conventions (12h vs 24h)
- Calendar localization for date pickers

### Cultural Adaptations
- Address format variations by country
- Phone number formatting standards  
- Name field conventions (given/family vs first/last)
- Cultural color and imagery preferences