import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
// import { LanguageSelector } from '@/components/LanguageSelector'
import { ABSLanding } from '@/components/ABS_Landing/ABS_Landing'
import { 
  roomOptions, 
  specialOffers, 
  roomSelectionMap,
  translations,
  getSectionsConfig,
  sectionOptions
} from '@/components/ABS_Landing/mockData'

function App() {
  const { i18n } = useTranslation()
  const [currentLanguage] = useState('en')

  // const changeLanguage = (language: string) => {
  //   i18n.changeLanguage(language)
  //   setCurrentLanguage(language)
  // }

  // Set English as default on mount
  useEffect(() => {
    i18n.changeLanguage('en')
  }, [])

  // Get the sections configuration and translations for the current language
  const currentLang = (currentLanguage === 'es' ? 'es' : 'en') as 'en' | 'es'
  const sections = getSectionsConfig(currentLang)
  const currentTranslations = translations[currentLang]

  return (
      <main className="min-h-screen bg-background">
        <ABSLanding
          roomOptions={roomOptions}
          sections={sections}
          sectionOptions={sectionOptions}
          specialOffers={specialOffers}
          roomSelectionMap={roomSelectionMap}
          translations={currentTranslations}
          language={currentLang}
          checkIn="10/10/2025"
          checkOut="15/10/2025"
          roomType="DELUXE SILVER"
          occupancy="2 Adults, 0 Children"
          reservationCode="1003066AU"
          onCartClick={() => {
            console.log('Cart clicked')
          }}
          onConfirmBooking={(bookingData) => {
            console.log('Booking confirmed:', bookingData)
            alert('Booking confirmed! Check console for details.')
          }}
        />
      </main>
  )
}

export default App
