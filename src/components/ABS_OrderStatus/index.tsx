import type React from 'react'
import { useState, useEffect, useMemo } from 'react'
import clsx from 'clsx'
import { UiButton } from '../ui/button'
import type { OrderData } from '../../services/orderStorage'
import { getOrder } from '../../services/orderStorage'
import { isValidBookingId, formatBookingIdForDisplay } from '../../utils/bookingIdGenerator'
import ProposalWidget from './components/ProposalWidget'

// Import components for reuse in consultation mode
import { ABS_RoomSelectionCarousel } from '../ABS_RoomSelectionCarousel'
import BookingInfoBar from '../ABS_BookingInfoBar'
import { ABS_SpecialOffers } from '../ABS_SpecialOffers'
import { ABS_RoomCustomization } from '../ABS_RoomCustomization'
import PricingSummaryPanel from '../ABS_PricingSummaryPanel'
import type { PricingItem } from '../ABS_PricingSummaryPanel'

// Import data conversion utilities
import {
  convertRoomToPricingItem
} from '../ABS_Landing/utils/dataConversion'

// Import types and data for the components
import { getSectionsConfig, sectionOptions } from '../ABS_Landing/mockData'
import type { SelectedCustomizations } from '../ABS_RoomCustomization/types'

export interface OrderStatusProps {
  orderId?: string
  onOrderNotFound?: () => void
  onBackToHome?: () => void
  className?: string
}

type ViewState = 'loading' | 'not_found' | 'invalid_id' | 'loaded'

const ABS_OrderStatus: React.FC<OrderStatusProps> = ({
  orderId,
  onOrderNotFound,
  onBackToHome,
  className,
}) => {
  const [viewState, setViewState] = useState<ViewState>('loading')
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [inputOrderId, setInputOrderId] = useState('')

  // Load order data when orderId changes
  useEffect(() => {
    if (orderId) {
      loadOrderData(orderId)
    } else {
      setViewState('loaded')
    }
  }, [orderId])

  const loadOrderData = async (id: string) => {
    setViewState('loading')
    
    // Validate ID format
    if (!isValidBookingId(id)) {
      setViewState('invalid_id')
      return
    }

    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      const data = getOrder(id)
      if (data) {
        setOrderData(data)
        setViewState('loaded')
      } else {
        setViewState('not_found')
        onOrderNotFound?.()
      }
    } catch (error) {
      console.error('Error loading order:', error)
      setViewState('not_found')
      onOrderNotFound?.()
    }
  }

  const handleOrderIdSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputOrderId.trim()) {
      loadOrderData(inputOrderId.trim())
    }
  }

  // Convert order data to pricing items for display
  const pricingItems = useMemo((): PricingItem[] => {
    if (!orderData) return []
    
    const items: PricingItem[] = []
    
    // Add room
    if (orderData.selections.room) {
      items.push(convertRoomToPricingItem(orderData.selections.room))
    }
    
    // Add customizations
    if (orderData.selections.customizations.length > 0) {
      const customizationItems: PricingItem[] = orderData.selections.customizations.map(c => ({
        id: c.id,
        name: c.name,
        price: c.price || 0,
        type: 'customization' as const,
        concept: 'customize-your-room' as const,
        roomId: orderData.selections.room?.id || 'default',
        nightCount: 1,
        quantity: 1
      }))
      items.push(...customizationItems)
    }
    
    // Add offers
    if (orderData.selections.offers.length > 0) {
      const offerItems: PricingItem[] = orderData.selections.offers.map(o => ({
        id: o.id.toString(),
        name: o.title,
        price: o.price || 0,
        type: 'offer' as const,
        concept: 'enhance-your-stay' as const,
        nightCount: 1,
        quantity: (o as any).quantity || 1,
        personCount: o.type === 'perPerson' ? parseInt(orderData.userInfo.occupancy.match(/\d+/)?.[0] || '1', 10) : undefined
      }))
      items.push(...offerItems)
    }
    
    return items.filter(Boolean)
  }, [orderData])

  // Calculate pricing
  const pricing = useMemo(() => {
    if (!orderData) return { subtotal: 0, total: 0 }
    
    const total = pricingItems.reduce((sum, item) => sum + (item?.price || 0), 0)
    
    return {
      subtotal: Number(total.toFixed(2)),
      total: Number(total.toFixed(2))
    }
  }, [pricingItems])

  // Render order ID input form
  const renderOrderIdInput = () => (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Your Order</h2>
          <p className="text-gray-600">Enter your booking ID to view your order status</p>
        </div>
        
        <form onSubmit={handleOrderIdSubmit} className="space-y-4">
          <div>
            <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
              Booking ID
            </label>
            <input
              type="text"
              id="orderId"
              value={inputOrderId}
              onChange={(e) => setInputOrderId(e.target.value.toUpperCase())}
              placeholder="ABS-20250723-A1B2C3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={17}
            />
          </div>
          
          <UiButton 
            type="submit" 
            className="w-full"
            disabled={!inputOrderId.trim()}
          >
            View Order Status
          </UiButton>
        </form>
        
        {onBackToHome && (
          <div className="mt-4 text-center">
            <button
              onClick={onBackToHome}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  )

  // Render loading state
  const renderLoading = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your order...</p>
      </div>
    </div>
  )

  // Render error states
  const renderError = () => {
    const isInvalidId = viewState === 'invalid_id'
    
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {isInvalidId ? 'Invalid Booking ID' : 'Order Not Found'}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {isInvalidId 
              ? 'Please check your booking ID format. It should look like: ABS-20250723-A1B2C3'
              : 'We couldn\'t find an order with this booking ID. Please check your ID and try again.'
            }
          </p>
          
          <div className="space-y-3">
            <UiButton 
              onClick={() => {
                setViewState('loaded')
                setOrderData(null)
                setInputOrderId('')
              }}
              className="w-full"
            >
              Try Another ID
            </UiButton>
            
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="w-full text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Back to Home
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Render order status header
  const renderOrderHeader = () => {
    if (!orderData) return null
    
    const statusColors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      modified: 'bg-blue-100 text-blue-800',
    }
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Order #{formatBookingIdForDisplay(orderData.id)}
            </h1>
            <p className="text-gray-600">
              Created on {new Date(orderData.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className={clsx(
            'px-3 py-1 rounded-full text-sm font-medium',
            statusColors[orderData.status]
          )}>
            {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
          </div>
        </div>
        
        {/* Booking Info Bar */}
        <BookingInfoBar
          items={[
            {
              icon: 'Calendar',
              label: 'Check-in',
              value: orderData.userInfo.checkIn
            },
            {
              icon: 'Calendar', 
              label: 'Check-out',
              value: orderData.userInfo.checkOut
            },
            {
              icon: 'Home',
              label: 'Room Type',
              value: orderData.userInfo.roomType
            },
            {
              icon: 'Users',
              label: 'Occupancy',
              value: orderData.userInfo.occupancy
            },
            ...(orderData.userInfo.reservationCode ? [{
              icon: 'Tag' as const,
              label: 'Reservation Code',
              value: orderData.userInfo.reservationCode
            }] : [])
          ]}
        />
      </div>
    )
  }

  // Main render logic
  if (viewState === 'loading') {
    return renderLoading()
  }

  if (viewState === 'invalid_id' || viewState === 'not_found') {
    return (
      <div className={clsx('min-h-screen bg-gray-50 py-12 px-4', className)}>
        {renderError()}
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className={clsx('min-h-screen bg-gray-50 py-12 px-4', className)}>
        {renderOrderIdInput()}
      </div>
    )
  }

  // Main order status view
  return (
    <div className={clsx('min-h-screen bg-gray-50', className)}>
      <div className="container mx-auto px-4 py-8">
        {renderOrderHeader()}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Room Selection (Read-only) */}
            {orderData.selections.room && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Selected Room</h2>
                <div className="order-consultation-mode [&_button]:hidden [&_.room-select-button]:hidden [&_.make-offer-button]:hidden [&_.bid-controls]:hidden [&_[role=button]]:pointer-events-none">
                  <ABS_RoomSelectionCarousel
                  roomOptions={[{
                    ...orderData.selections.room,
                    images: orderData.selections.room.images || [orderData.selections.room.image]
                  }]}
                  initialSelectedRoom={{
                    ...orderData.selections.room,
                    images: orderData.selections.room.images || [orderData.selections.room.image]
                  }}
                  showPriceSlider={false}
                  currentRoomType={orderData.userInfo.roomType}
                  mode="consultation"
                  readonly={true}
                  onRoomSelected={() => {}} // Disabled in consultation mode
                  translations={{
                    learnMoreText: 'Learn More',
                    nightText: '/night',
                    priceInfoText: 'Price includes all taxes and fees',
                    selectedText: 'SELECTED',
                    selectText: 'SELECTED',
                    currencySymbol: '€',
                    discountBadgeText: '-{percentage}%',
                    noRoomsAvailableText: 'No rooms available',
                    makeOfferText: 'Make Offer',
                    availabilityText: 'Subject to availability',
                    proposePriceText: 'Propose your price:',
                    currencyText: 'EUR',
                    offerMadeText: 'You have proposed {price} EUR per night',
                    bidSubmittedText: 'Bid submitted',
                    updateBidText: 'Update bid',
                    cancelBidText: 'Cancel',
                    navigationLabels: {
                      previousRoom: 'Previous room',
                      nextRoom: 'Next room',
                      previousRoomMobile: 'Previous room (mobile)',
                      nextRoomMobile: 'Next room (mobile)',
                      goToRoom: 'Go to room {index}',
                      previousImage: 'Previous image',
                      nextImage: 'Next image',
                      viewImage: 'View image {index}',
                    }
                  }}
                  />
                </div>
              </div>
            )}
            
            {/* Customizations (Read-only) */}
            {orderData.selections.customizations.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Room Customizations</h2>
                <div className="order-consultation-mode">
                  <ABS_RoomCustomization
                    title="Room Customizations"
                    subtitle="Selected customizations for your room"
                    sections={getSectionsConfig('en')}
                    sectionOptions={sectionOptions}
                    initialSelections={(() => {
                      const converted: SelectedCustomizations = {}
                      orderData.selections.customizations.forEach((customization) => {
                        if (customization.category) {
                          converted[customization.category] = {
                            id: customization.id,
                            label: customization.name,
                            price: customization.price,
                          }
                        }
                      })
                      return converted
                    })()}
                    onCustomizationChange={() => {}} // Disabled in consultation mode
                    mode="consultation"
                    readonly={true}
                    texts={{
                      improveText: 'Upgrade',
                      selectedText: 'Selected',
                      selectText: 'Select',
                      pricePerNightText: 'EUR/night',
                      featuresText: 'Features and benefits',
                      understood: 'Got it',
                      addForPriceText: 'Add for',
                      availableOptionsText: 'Available Options:',
                      removeText: 'Remove',
                      showMoreText: 'Show More',
                      showLessText: 'Show Less',
                      optionDisabledText: 'Not Available',
                      conflictWithText: 'Conflicts with',
                      keepCurrentText: 'Keep Current Selection',
                      switchToNewText: 'Switch to New Option',
                      conflictDialogTitle: 'Option Conflict',
                      conflictDialogDescription: 'These options cannot be selected together.',
                    }}
                  />
                </div>
              </div>
            )}
            
            {/* Special Offers (Read-only) */}
            {orderData.selections.offers.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Special Offers</h2>
                <div className="order-consultation-mode [&_button]:hidden [&_.booking-button]:hidden [&_[data-testid*=book]]:hidden [&_[data-testid*=quantity]]:hidden [&_.quantity-controls]:hidden">
                  <ABS_SpecialOffers
                    offers={orderData.selections.offers.map(offer => {
                      // For stored orders, we need to calculate the base price from the total
                      const storedQuantity = (offer as any).quantity || 1
                      const personCount = parseInt(orderData.userInfo.occupancy.match(/\d+/)?.[0] || '1', 10)
                      
                      // Calculate base price based on offer type
                      let basePrice = offer.price || 0
                      const isAllInclusive = offer.title.toLowerCase().includes('all inclusive')
                      
                      if (isAllInclusive && offer.type === 'perPerson') {
                        // For All Inclusive, the stored price is the total for entire stay
                        // We need to calculate the per-person per-night price
                        const checkIn = new Date(orderData.userInfo.checkIn)
                        const checkOut = new Date(orderData.userInfo.checkOut)
                        const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))
                        basePrice = basePrice / (personCount * nights)
                      } else if (offer.type === 'perPerson' && storedQuantity > 0) {
                        // The stored price is the total, so divide by quantity and persons to get base price
                        basePrice = basePrice / (storedQuantity * personCount)
                      } else if (offer.type === 'perNight' && storedQuantity > 0) {
                        // For per night offers, divide by quantity
                        basePrice = basePrice / storedQuantity
                      }
                      // For perStay offers, the price is already the base price per stay
                      
                      return {
                        ...offer,
                        id: Number(offer.id),
                        title: offer.title,
                        description: offer.description || '',
                        image: offer.image || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
                        price: basePrice,
                        type: (offer.type as 'perStay' | 'perPerson' | 'perNight') || 'perStay',
                      }
                    })}
                    initialSelections={Object.fromEntries(
                      orderData.selections.offers.map(offer => {
                        const checkIn = new Date(orderData.userInfo.checkIn)
                        const checkOut = new Date(orderData.userInfo.checkOut)
                        const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))
                        const isAllInclusive = offer.title.toLowerCase().includes('all inclusive')
                        
                        return [
                          Number(offer.id),
                          {
                            quantity: (offer as any).quantity || 1,
                            selectedDate: (offer as any).selectedDate,
                            selectedDates: (offer as any).selectedDates || [],
                            persons: parseInt(orderData.userInfo.occupancy.match(/\d+/)?.[0] || '1', 10),
                            nights: isAllInclusive ? nights : 1,
                          }
                        ]
                      })
                    )}
                    onBookOffer={() => {}} // Disabled in consultation mode
                    currencySymbol="€"
                    reservationInfo={{
                      checkInDate: new Date(orderData.userInfo.checkIn),
                      checkOutDate: new Date(orderData.userInfo.checkOut),
                      personCount: parseInt(orderData.userInfo.occupancy.match(/\d+/)?.[0] || '1', 10)
                    }}
                    labels={{
                      perStay: 'per stay',
                      perPerson: 'per person', 
                      perNight: 'per night',
                      total: 'Total',
                      bookNow: 'Added',
                      numberOfPersons: 'Number of persons',
                      numberOfNights: 'Number of nights',
                      addedLabel: 'Added',
                      popularLabel: 'Popular',
                      personsTooltip: 'Select number of persons',
                      personsSingularUnit: 'person',
                      personsPluralUnit: 'persons',
                      nightsTooltip: 'Select number of nights',
                      nightsSingularUnit: 'night',
                      nightsPluralUnit: 'nights',
                      personSingular: 'person',
                      personPlural: 'persons',
                      nightSingular: 'night',
                      nightPlural: 'nights',
                      removeOfferLabel: 'Remove',
                      decreaseQuantityLabel: 'Decrease',
                      increaseQuantityLabel: 'Increase',
                      selectDateLabel: 'Select date',
                      selectDateTooltip: 'Choose your preferred date',
                      dateRequiredLabel: 'Date required',
                      selectDatesLabel: 'Select dates',
                      selectDatesTooltip: 'Choose dates',
                      availableDatesLabel: 'Available dates',
                      noAvailableDatesLabel: 'No available dates',
                      clearDatesLabel: 'Clear',
                      confirmDatesLabel: 'Confirm',
                      dateSelectedLabel: 'selected',
                      multipleDatesRequiredLabel: 'Multiple dates required',
                    }}
                  />
                </div>
              </div>
            )}
            
            {/* Hotel Proposals */}
            {orderData.hotelProposals.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Hotel Proposals</h2>
                <p className="text-gray-600 mb-6">
                  The hotel has made some proposals for your booking. Review and respond to each one below.
                </p>
                <div className="space-y-4">
                  {orderData.hotelProposals.map((proposal) => (
                    <ProposalWidget
                      key={proposal.id}
                      orderId={orderData.id}
                      proposal={proposal}
                      onProposalUpdate={(proposalId, status) => {
                        console.log('Proposal updated:', proposalId, status)
                        // Reload order data to reflect changes
                        loadOrderData(orderData.id)
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Pricing Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="[&_button]:hidden [&_.payment-info]:hidden">
                <PricingSummaryPanel
                  items={pricingItems}
                  pricing={{ subtotal: pricing.total }}
                  isLoading={false}
                  currency="EUR"
                  locale="en-US"
                  labels={{
                    selectedRoomLabel: 'Selected Room',
                    upgradesLabel: 'Room Customizations',
                    specialOffersLabel: 'Special Offers',
                    chooseYourSuperiorRoomLabel: 'Superior Room Selection',
                    customizeYourRoomLabel: 'Room Customization',
                    enhanceYourStayLabel: 'Stay Enhancement',
                    chooseYourRoomLabel: 'Choose Your Room',
                    subtotalLabel: 'Subtotal',
                    taxesLabel: 'Taxes',
                    totalLabel: 'Total',
                    payAtHotelLabel: 'Pay at hotel',
                    viewTermsLabel: 'View terms',
                    confirmButtonLabel: 'Confirm Booking',
                    noUpgradesSelectedLabel: 'No upgrades selected',
                    noOffersSelectedLabel: 'No offers selected',
                    emptyCartMessage: 'Your cart is empty',
                    editLabel: 'Edit',
                    roomRemovedMessage: 'Room removed',
                    offerRemovedMessagePrefix: 'Offer removed:',
                    customizationRemovedMessagePrefix: 'Customization removed:',
                    addedMessagePrefix: 'Added:',
                    euroSuffix: '€',
                    loadingLabel: 'Loading...',
                    roomImageAltText: 'Room image',
                    removeRoomUpgradeLabel: 'Remove',
                    exploreLabel: 'Explore',
                    fromLabel: 'from',
                    customizeStayTitle: 'Customize your stay',
                    chooseOptionsSubtitle: 'Choose from our options',
                    missingLabelsError: 'Missing labels',
                    invalidPricingError: 'Invalid pricing',
                    currencyFormatError: 'Currency format error',
                    performanceWarning: 'Performance warning',
                    notificationsLabel: 'Notifications',
                    closeNotificationLabel: 'Close notification',
                    pricingSummaryLabel: 'Pricing summary',
                    processingLabel: 'Processing',
                    bidForUpgradeLabel: 'Bid for Upgrade',
                  }}
                  onRemoveItem={() => {}} // Disabled in consultation mode
                  onConfirm={() => {}} // Disabled in consultation mode
                />
              </div>
            </div>
          </div>
        </div>
        
        {onBackToHome && (
          <div className="mt-8 text-center">
            <UiButton onClick={onBackToHome} variant="outline">
              Back to Home
            </UiButton>
          </div>
        )}
      </div>
    </div>
  )
}

export default ABS_OrderStatus
export { ABS_OrderStatus }