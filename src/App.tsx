import { useState, useEffect, Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter, Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom'

// Lazy load heavy components
const ABSLanding = lazy(() => import('@/components/ABS_Landing/ABS_Landing').then(m => ({ default: m.ABSLanding })))
const ABS_OrderStatus = lazy(() => import('@/components/ABS_OrderStatus').then(m => ({ default: m.ABS_OrderStatus })))
const PreBookingForm = lazy(() => import('@/components/PreBookingForm'))
import { createOrder, createSampleOrder, convertBookingDataToOrder } from '@/utils/orderGenerator'
import { initializeDemoData } from '@/utils/createSampleData'
import { useAuth } from '@/hooks/useAuth'
import OrderAccessForm from '@/components/OrderAccessForm'
import type { UserInfo } from '@/services/orderStorage'
import { useLandingPageContent } from '@/hooks/useSupabaseContent'
import {
  convertRoomType,
  convertCustomizationOption,
  convertViewOption,
  convertSpecialOfferOption,
  convertSpecialOffer,
  convertSectionConfig,
  convertCompatibilityRules,
  convertTranslations,
  groupCustomizationOptions,
} from '@/utils/supabaseDataConverter'
import { getSectionsConfig, mockSectionOptions, roomOptions as mockRoomOptions, specialOffers as mockSpecialOffers, translations as mockTranslations } from '@/components/ABS_Landing/mockData'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import type { SectionConfig } from '@/components/ABS_RoomCustomization/types'

// Home component (main booking flow)
function Home() {
  const { i18n } = useTranslation()
  const [currentLanguage] = useState('en')
  const navigate = useNavigate()
  const location = useLocation()

  // Set English as default on mount and initialize demo data
  useEffect(() => {
    i18n.changeLanguage('en')
    initializeDemoData()
  }, [])

  const currentLang = (currentLanguage === 'es' ? 'es' : 'en') as 'en' | 'es'

  // Fetch all content from Supabase
  const {
    translations,
    roomTypes,
    customizationOptions,
    specialOffers,
    sections,
    compatibilityRules,
    loading,
    error,
  } = useLandingPageContent(currentLang)

  // State for processed data
  const [processedData, setProcessedData] = useState<{
    roomOptions: any[]
    sections: SectionConfig[]
    sectionOptions: Record<string, any[]>
    specialOffers: any[]
    translations: any
    compatibilityRules: any
  } | null>(null)

  // Process the data when it's loaded
  useEffect(() => {
    if (!loading) {
      // Use mock data if Supabase data is not available or has errors
      const useMockData = error || !translations || roomTypes.length === 0
      
      if (useMockData) {
        // Use mock data
        const mockSections = getSectionsConfig(currentLang)
        const mockTranslationsWithSpecialOffer = {
          ...mockTranslations[currentLang],
          specialOfferText: currentLang === 'es' ? 'Oferta especial' : 'Special Offer',
          additionalBenefitsText: currentLang === 'es' ? 'Beneficios adicionales:' : 'Additional benefits:',
          upgradeForText: currentLang === 'es' ? 'Mejora por' : 'Upgrade for',
        }
        
        
        setProcessedData({
          roomOptions: mockRoomOptions,
          sections: mockSections,
          sectionOptions: mockSectionOptions,
          specialOffers: mockSpecialOffers,
          translations: mockTranslationsWithSpecialOffer,
          compatibilityRules: { mutuallyExclusive: [], conflicts: [] },
        })
      } else {
        // Use Supabase data
        const roomOptions = roomTypes.map(room => convertRoomType(room, currentLang))
        const sectionsData = sections.map(section => convertSectionConfig(section))
        
        // Group and convert customization options
        const groupedOptions = groupCustomizationOptions(customizationOptions)
        const sectionOptions: Record<string, any[]> = {}

        Object.entries(groupedOptions).forEach(([category, options]) => {
          if (category === 'view' || category === 'exactView') {
            const convertedOptions = options.map(opt => convertViewOption(opt, currentLang))
            sectionOptions[category] = convertedOptions
          } else if (category === 'specialOffers') {
            const convertedOptions = options.map(opt => convertSpecialOfferOption(opt, currentLang))
            sectionOptions[category] = convertedOptions
          } else {
            const convertedOptions = options.map(opt => convertCustomizationOption(opt, currentLang))
            sectionOptions[category] = convertedOptions
          }
        })

        // Convert special offers
        const offersData = specialOffers.map(offer => convertSpecialOffer(offer, currentLang))

        // Convert compatibility rules
        const rulesData = convertCompatibilityRules(compatibilityRules)

        // Convert translations
        const translationsData = {
          ...convertTranslations(translations),
          specialOfferText: currentLang === 'es' ? 'Oferta especial' : 'Special Offer',
          additionalBenefitsText: currentLang === 'es' ? 'Beneficios adicionales:' : 'Additional benefits:',
          upgradeForText: currentLang === 'es' ? 'Mejora por' : 'Upgrade for',
        }

        setProcessedData({
          roomOptions,
          sections: sectionsData,
          sectionOptions,
          specialOffers: offersData,
          translations: translationsData,
          compatibilityRules: rulesData,
        })
      }
    }
  }, [loading, error, translations, roomTypes, customizationOptions, specialOffers, sections, compatibilityRules, currentLang])

  const handleConfirmBooking = async (bookingData: any) => {
    // Booking confirmed
    
    // Create user info from current session
    const userInfo: UserInfo = {
      roomType: 'DELUXE SILVER',
      checkIn: '2025-10-10',
      checkOut: '2025-10-15',
      occupancy: '2 Adults, 0 Children',
      reservationCode: '1003066AU',
      userEmail: 'guest@hotel.com',
      userName: 'Demo Guest'
    }
    
    // Try to convert booking data to order
    const orderParams = convertBookingDataToOrder(bookingData, userInfo)
    
    let orderId: string | null = null
    
    try {
      if (orderParams) {
        // Create real order from booking data
        orderId = await createOrder(orderParams)
      } else {
        // Fallback to sample order for demo
        orderId = await createSampleOrder()
      }
      
      if (orderId) {
        // Order created successfully
        navigate(`/new-order/${orderId}`)
      } else {
        // Fallback if order creation fails
        // Failed to create order, using sample ID
        navigate('/new-order/ABS-20250723-DEMO01')
      }
    } catch (error) {
      // Error creating order
      navigate('/new-order/ABS-20250723-DEMO01')
    }
  }

  // Show loading state
  if (loading || !processedData) {
    return (
      <main className="min-h-screen bg-background p-8">
        <div className="container mx-auto space-y-8">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Show error state
  if (error) {
    return (
      <main className="min-h-screen bg-background p-8">
        <div className="container mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading content</AlertTitle>
            <AlertDescription>
              There was an error loading the booking content from our servers. Please check your Supabase configuration and try refreshing the page.
              {error.message && <div className="mt-2 text-sm">{error.message}</div>}
            </AlertDescription>
          </Alert>
        </div>
      </main>
    )
  }

  // Static room selection map configuration (this could also come from Supabase)
  const roomSelectionMap = {
    id: 'room-selection',
    title: 'Choose your Room Number!',
    description: 'Select the exact room you want to stay in',
    url: 'https://map-uat.hotelverse.tech/Webmap/en/ChooseYourRoom?config=eyJjbGllbnRJZCI6MSwiaG90ZWxJZCI6ODMsImN1cnJlbmN5IjoiRVVSIiwiYWNjZXNzVG9rZW5IViI6ImV5SnphV2R1WVhSMWNtVWlPaUk0TWpSbU5EUmtaakZqWXpneFlXUTBOelkxT1dWaVpEUTJNbVJpTXpsbVlUTTBNRFprTUdZelpHSTJNVFkwWTJZMVpqRmhNVGRrWWpZNE16Y3paVFl4WkRRM1pXVmtNekUwTXpreVpHWm1ZbVU1WXpKa00yRTFPRGsxTkRBNE1tTXhNMkk1Wm1ZM056SXpaVEE1WWpjMVpXSmhZakl6Tm1FMU1EUTVPV1k0TkNJc0luUnBiV1Z6ZEdGdGNDSTZNVGMxTVRVME9UYzFOalUwTUgwPSIsImhpZGRlbkVsZW1lbnRzIjpbXSwic291cmNlIjpudWxsfQ%3D%3D&devMode=true&language=en&booking=eyJ0eXBlIjoidXNlci1pbnB1dCIsImxvY2F0b3IiOiJ0ZXN0IiwiZXh0ZXJuYWxDaGFubmVsSWQiOjAsInBsYXRmb3JtIjoiT3Ryb3MiLCJib29raW5nRGF0YSI6eyJmaXJzdE5hbWUiOiJURVNUIiwibGFzdE5hbWUiOiJURVNUIiwiZW1haWwiOiJmcmFuY2lzY28uY29zdGlsbG9AaG90ZWx2ZXJzZS50ZWNoIiwiY2hlY2tJbiI6IjIwMjUtMTAtMTAiLCJjaGVja091dCI6IjIwMjUtMTAtMTUiLCJodlJvb21UeXBlIjo2MzIsIm9jY3VwYW5jeSI6eyJhZHVsdHMiOjIsImNoaWxkcmVuIjowLCJjaGlsZEFnZXMiOltdLCJpbmZhbnRzIjowLCJjdXJyZW5jeSI6IiJ9LCJleHRlcm5hbENoYW5uZWxJZCI6MCwiaXNPd25Ib3RlbCI6ZmFsc2V9fQ%3D%3D&noFS=true',
    type: 'iframe' as const,
    iframe: {
      width: '100%',
      height: '800px',
      frameBorder: 0,
      allowFullScreen: true,
      title: 'Choose your room number - Interactive Hotel Map',
    },
  }

  // Get booking info from navigation state (if coming from pre-booking form)
  const bookingInfo = location.state?.bookingInfo
  const isMultiBookingMode = bookingInfo?.isMultiRoom || false

  // Use booking info if available, otherwise use defaults
  const checkIn = bookingInfo?.checkIn || "2025-10-10"
  const checkOut = bookingInfo?.checkOut || "2025-10-15"
  const roomType = bookingInfo?.roomType || "DELUXE SILVER"
  const occupancy = bookingInfo?.occupancy || "2 Adults, 0 Children"
  const reservationCode = bookingInfo?.reservationCode || "1003066AU"
  // const guestName = bookingInfo?.guestName || "Demo Guest"

  return (
    <main className="min-h-screen bg-background">
      <ABSLanding
        roomOptions={processedData.roomOptions}
        sections={processedData.sections}
        sectionOptions={processedData.sectionOptions}
        specialOffers={processedData.specialOffers}
        roomSelectionMap={roomSelectionMap}
        translations={processedData.translations}
        language={currentLang}
        checkIn={checkIn}
        checkOut={checkOut}
        roomType={roomType}
        occupancy={occupancy}
        reservationCode={reservationCode}
        onConfirmBooking={handleConfirmBooking}
        compatibilityRules={processedData.compatibilityRules}
        // Multi-booking support
        isMultiBooking={isMultiBookingMode}
        initialRoomBookings={bookingInfo?.rooms?.map((room: any) => {
          return {
            id: room.id,
            roomName: room.roomName,
            roomNumber: room.roomNumber,
            guestName: room.guestName,
            checkIn: room.checkIn,
            checkOut: room.checkOut,
            guests: room.guests,
            nights: room.nights,
            payAtHotel: true,
            roomImage: room.roomImage,
            items: []
          }
        }) || []}
      />
    </main>
  )
}

// Order Status component wrapper - for newly created orders (no auth required)
function NewOrderStatusPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-background">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Home
          </button>
          <div className="text-sm text-green-600 font-medium">
            ✅ Order Confirmed
          </div>
        </div>
      </div>
      <ABS_OrderStatus
        orderId={orderId}
        onOrderNotFound={() => {
          // Order not found
        }}
        onBackToHome={() => {
          navigate('/')
        }}
      />
    </main>
  )
}

// Order Status component wrapper with auth - for accessing existing orders
function OrderStatusPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const auth = useAuth()
  const [authError, setAuthError] = useState<string>('')
  const [authLoading, setAuthLoading] = useState(false)

  const handleOrderAccess = async (email: string, reservationCode: string) => {
    setAuthLoading(true)
    setAuthError('')
    
    // Simple validation - in production this would verify against backend
    const success = auth.login(email, reservationCode)
    
    if (!success) {
      setAuthError('Please enter a valid email address and reservation code')
      setAuthLoading(false)
      return
    }
    
    setAuthLoading(false)
  }

  // If not authenticated, show login form
  if (!auth.isAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <OrderAccessForm
          onAccess={handleOrderAccess}
          loading={authLoading}
          error={authError}
        />
      </main>
    )
  }

  // If authenticated, show order status
  return (
    <main className="min-h-screen bg-background">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Home
          </button>
          <button
            onClick={auth.logout}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Sign Out ({auth.userEmail})
          </button>
        </div>
      </div>
      <ABS_OrderStatus
        orderId={orderId}
        onOrderNotFound={() => {
          // Order not found
        }}
        onBackToHome={() => {
          navigate('/')
        }}
      />
    </main>
  )
}

// Pre-Booking Form component wrapper
function PreBookingFormPage() {
  return <PreBookingForm />
}

// Multi-booking route - same as Home but explicitly multi-booking
function MultiBookingPage() {
  const location = useLocation()
  const bookingInfo = location.state?.bookingInfo

  // If no booking info, redirect to pre-booking form
  if (!bookingInfo) {
    return <PreBookingForm />
  }

  // Force multi-booking mode
  return <Home />
}

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
)

// Main App component with routing
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking/:reservationCode" element={<PreBookingFormPage />} />
          <Route path="/booking" element={<PreBookingFormPage />} />
          <Route path="/multi-booking" element={<MultiBookingPage />} />
          <Route path="/new-order/:orderId" element={<NewOrderStatusPage />} />
          <Route path="/order/:orderId" element={<OrderStatusPage />} />
          <Route path="/order" element={<ABS_OrderStatus onBackToHome={() => window.location.href = '/'} />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
