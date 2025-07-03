import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageSelector } from '@/components/LanguageSelector'
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
  const [currentLanguage, setCurrentLanguage] = useState('en')

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)
    setCurrentLanguage(language)
  }

  // Set English as default on mount
  useEffect(() => {
    i18n.changeLanguage('en')
  }, [])

  // Get the sections configuration and translations for the current language
  const currentLang = (currentLanguage === 'es' ? 'es' : 'en') as 'en' | 'es'
  const sections = getSectionsConfig(currentLang)
  const currentTranslations = translations[currentLang]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">ABS Components Demo</h1>
              <p className="text-muted-foreground">Advanced Booking System Components</p>
            </div>
            <LanguageSelector 
              currentLanguage={currentLanguage}
              onLanguageChange={changeLanguage}
            />
          </div>
        </div>
      </header>
      
      <main>
        <ABSLanding
          roomOptions={roomOptions}
          sections={sections}
          sectionOptions={sectionOptions}
          specialOffers={specialOffers}
          roomSelectionMap={roomSelectionMap}
          translations={currentTranslations}
          language={currentLang}
          checkIn="2024-07-15"
          checkOut="2024-07-20"
          occupancy="2 Adults, 0 Children"
          reservationCode="DEMO-12345"
          onCartClick={() => {
            console.log('Cart clicked')
          }}
          onConfirmBooking={(bookingData) => {
            console.log('Booking confirmed:', bookingData)
            alert('Booking confirmed! Check console for details.')
          }}
        />
      </main>
    </div>
  )
}

export default App
