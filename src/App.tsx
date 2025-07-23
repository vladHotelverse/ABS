import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom'
// import { LanguageSelector } from '@/components/LanguageSelector'
import { ABSLanding } from '@/components/ABS_Landing/ABS_Landing'
import { ABS_OrderStatus } from '@/components/ABS_OrderStatus'
import { createOrder, createSampleOrder, convertBookingDataToOrder } from '@/utils/orderGenerator'
import { initializeDemoData } from '@/utils/createSampleData'
import type { UserInfo } from '@/services/orderStorage'
import { 
  roomOptions, 
  specialOffers, 
  roomSelectionMap,
  translations,
  getSectionsConfig,
  sectionOptions
} from '@/components/ABS_Landing/mockData'

// Home component (main booking flow)
function Home() {
  const { i18n } = useTranslation()
  const [currentLanguage] = useState('en')
  const navigate = useNavigate()

  // Set English as default on mount and initialize demo data
  useEffect(() => {
    i18n.changeLanguage('en')
    initializeDemoData()
  }, [])

  // Get the sections configuration and translations for the current language
  const currentLang = (currentLanguage === 'es' ? 'es' : 'en') as 'en' | 'es'
  const sections = getSectionsConfig(currentLang)
  const currentTranslations = translations[currentLang]

  const handleConfirmBooking = (bookingData: any) => {
    console.log('Booking confirmed:', bookingData)
    
    // Create user info from current session
    const userInfo: UserInfo = {
      roomType: 'DELUXE SILVER',
      checkIn: '2025-10-10',
      checkOut: '2025-10-15',
      occupancy: '2 Adults, 0 Children',
      reservationCode: '1003066AU'
    }
    
    // Try to convert booking data to order
    const orderParams = convertBookingDataToOrder(bookingData, userInfo)
    
    let orderId: string | null = null
    
    if (orderParams) {
      // Create real order from booking data
      orderId = createOrder(orderParams)
    } else {
      // Fallback to sample order for demo
      orderId = createSampleOrder()
    }
    
    if (orderId) {
      console.log('Order created with ID:', orderId)
      navigate(`/order/${orderId}`)
    } else {
      // Fallback if order creation fails
      console.error('Failed to create order, using sample ID')
      navigate('/order/ABS-20250723-DEMO01')
    }
  }

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
        checkIn="2025-10-10"
        checkOut="2025-10-15"
        roomType="DELUXE SILVER"
        occupancy="2 Adults, 0 Children"
        reservationCode="1003066AU"
        onCartClick={() => {
          console.log('Cart clicked')
        }}
        onConfirmBooking={handleConfirmBooking}
      />
    </main>
  )
}

// Order Status component wrapper
function OrderStatusPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  return (
    <ABS_OrderStatus
      orderId={orderId}
      onOrderNotFound={() => {
        console.log('Order not found:', orderId)
      }}
      onBackToHome={() => {
        navigate('/')
      }}
    />
  )
}

// Main App component with routing
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order/:orderId" element={<OrderStatusPage />} />
        <Route path="/order" element={<ABS_OrderStatus onBackToHome={() => window.location.href = '/'} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
