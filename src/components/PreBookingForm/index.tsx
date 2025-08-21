import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import { AlertCircle, Mail, Search } from 'lucide-react'
import type { BookingInfo } from './types'

interface PreBookingFormProps {
  onBookingValidated?: (bookingInfo: BookingInfo) => void
}

const PreBookingForm: React.FC<PreBookingFormProps> = ({ onBookingValidated }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { reservationCode: urlReservationCode } = useParams<{ reservationCode: string }>()
  
  const [reservationCode, setReservationCode] = useState(urlReservationCode || '')
  const [isValidating, setIsValidating] = useState(false)
  const [error, setError] = useState<string>('')
  const [showManualEntry, setShowManualEntry] = useState(!urlReservationCode)

  // Auto-validate if reservation code is in URL
  useEffect(() => {
    if (urlReservationCode && urlReservationCode.trim()) {
      validateReservation(urlReservationCode)
    }
  }, [urlReservationCode])

  const validateReservation = async (code: string) => {
    if (!code.trim()) {
      setError('Please enter your reservation code')
      return
    }

    setIsValidating(true)
    setError('')

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const bookingInfo = await mockBookingLookup(code.trim().toUpperCase())
      
      if (!bookingInfo) {
        setError('Reservation not found. Please check your reservation code and try again.')
        setShowManualEntry(true)
        return
      }

      // Notify parent component if callback provided
      if (onBookingValidated) {
        onBookingValidated(bookingInfo)
      }

      // Navigate to appropriate booking interface
      if (bookingInfo.isMultiRoom) {
        navigate('/multi-booking', { 
          state: { bookingInfo },
          replace: true
        })
      } else {
        navigate('/', { 
          state: { bookingInfo },
          replace: true
        })
      }

    } catch (err) {
      console.error('Booking validation error:', err)
      setError('There was an error validating your reservation. Please try again.')
      setShowManualEntry(true)
    } finally {
      setIsValidating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    validateReservation(reservationCode)
  }

  const handleManualEntry = () => {
    setShowManualEntry(true)
    setError('')
  }

  const handleRetry = () => {
    setError('')
    setReservationCode('')
    setShowManualEntry(true)
  }

  // Loading state for URL-based validation
  if (urlReservationCode && isValidating && !showManualEntry) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Validating Your Reservation</CardTitle>
            <CardDescription>
              Please wait while we load your booking details...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-2">
                Reservation Code: <span className="font-mono">{urlReservationCode}</span>
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle>Customize Your Stay</CardTitle>
          <CardDescription>
            Enter your reservation code to personalize your upcoming stay
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Validation Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reservationCode" className="block text-sm font-medium text-gray-700 mb-2">
                Reservation Code
              </label>
              <Input
                id="reservationCode"
                type="text"
                placeholder="e.g., 1003066AU"
                value={reservationCode}
                onChange={(e) => setReservationCode(e.target.value.toUpperCase())}
                className="text-center font-mono text-lg"
                disabled={isValidating}
                maxLength={20}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                You can find this code in your booking confirmation email
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isValidating || !reservationCode.trim()}
            >
              {isValidating ? (
                <>
                  <Search className="w-4 h-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Find My Reservation
                </>
              )}
            </Button>
          </form>

          {error && (
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={handleRetry} size="sm">
                Try Different Code
              </Button>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              Having trouble? Contact our support team for assistance
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Mock booking lookup function - replace with actual API call
const mockBookingLookup = async (code: string): Promise<BookingInfo | null> => {
  // Sample booking data - in production, this would be fetched from API
  const sampleBookings: Record<string, BookingInfo> = {
    '1003066AU': {
      reservationCode: '1003066AU',
      isMultiRoom: false,
      guestName: 'Demo Guest',
      guestEmail: 'guest@hotel.com',
      checkIn: '2025-10-10',
      checkOut: '2025-10-15',
      roomType: 'DELUXE SILVER',
      occupancy: '2 Adults, 0 Children',
      rooms: [
        {
          id: 'room-1',
          roomName: 'Deluxe Silver Room',
          roomNumber: '201',
          guestName: 'Demo Guest',
          checkIn: '2025-10-10',
          checkOut: '2025-10-15',
          guests: 2,
          nights: 5
        }
      ]
    },
    'MULTI123': {
      reservationCode: 'MULTI123',
      isMultiRoom: true,
      guestName: 'John Smith',
      guestEmail: 'john.smith@email.com',
      checkIn: '2025-10-10',
      checkOut: '2025-10-15',
      roomType: 'Multiple Rooms',
      occupancy: '6 Adults, 2 Children',
      rooms: [
        {
          id: 'booking-1',
          roomName: 'Deluxe Room',
          roomNumber: '201',
          guestName: 'John Smith',
          checkIn: '2025-10-10',
          checkOut: '2025-10-15',
          guests: 2,
          nights: 5
        },
        {
          id: 'booking-2',
          roomName: 'Premium Room',
          roomNumber: '305',
          guestName: 'Sarah Johnson',
          checkIn: '2025-10-10',
          checkOut: '2025-10-15',
          guests: 3,
          nights: 5
        },
        {
          id: 'booking-3',
          roomName: 'Executive Suite',
          roomNumber: '501',
          guestName: 'Michael Davis',
          checkIn: '2025-10-10',
          checkOut: '2025-10-15',
          guests: 2,
          nights: 5
        }
      ]
    },
    'GROUP456': {
      reservationCode: 'GROUP456',
      isMultiRoom: true,
      guestName: 'Emily Wilson',
      guestEmail: 'emily.wilson@email.com',
      checkIn: '2025-10-12',
      checkOut: '2025-10-16',
      roomType: 'Multiple Rooms',
      occupancy: '4 Adults',
      rooms: [
        {
          id: 'booking-4',
          roomName: 'Rock Suite',
          roomNumber: '401',
          guestName: 'Emily Wilson',
          checkIn: '2025-10-12',
          checkOut: '2025-10-16',
          guests: 2,
          nights: 4
        },
        {
          id: 'booking-5',
          roomName: 'Rock Suite',
          roomNumber: '402',
          guestName: 'David Brown',
          checkIn: '2025-10-12',
          checkOut: '2025-10-16',
          guests: 2,
          nights: 4
        }
      ]
    }
  }

  return sampleBookings[code] || null
}

export default PreBookingForm
export type { PreBookingFormProps }