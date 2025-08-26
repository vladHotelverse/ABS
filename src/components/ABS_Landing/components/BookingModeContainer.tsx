/**
 * Booking Mode Container
 * Handles the rendering logic for single vs multi-booking modes
 * Extracted from ABS_Landing.tsx to reduce complexity
 */

import React, { memo } from 'react'
import clsx from 'clsx'
import { useOptimizedBooking } from '../../../hooks/useOptimizedBooking'
import { RoomTabs } from '../../ABS_Header'
import BookingInfoBar from '../../ABS_BookingInfoBar'
import PricingSummaryPanel from '../../ABS_PricingSummaryPanel'
import MultiBookingPricingSummaryPanel from '../../ABS_PricingSummaryPanel/MultiBookingPricingSummaryPanel'
import MobilePricingWidget from '../../ABS_PricingSummaryPanel/components/MobilePricingWidget'
import MobilePricingOverlay from '../../ABS_PricingSummaryPanel/components/MobilePricingOverlay'
import type { Translations } from '../ABS_Landing'
import type { AvailableSection, PricingItem } from '../../ABS_PricingSummaryPanel'

interface BookingModeContainerProps {
  translations: Translations
  language?: 'en' | 'es'
  reservationCode?: string
  checkIn?: string
  checkOut?: string
  roomType?: string
  occupancy?: string
  fallbackImageUrl?: string
  availableSections?: AvailableSection[]
  pricingItems: PricingItem[]
  subtotal: number
  tax: number
  total: number
  onConfirm: () => void
  onEditSection: (section: 'room' | 'customizations' | 'offers') => void
  onRemoveItem: (
    itemId: string | number,
    itemName: string,
    itemType: PricingItem['type'],
    roomId?: string
  ) => void
  children: React.ReactNode
}

const BookingModeContainer: React.FC<BookingModeContainerProps> = memo(({
  translations,
  language = 'en',
  reservationCode,
  checkIn,
  checkOut,
  roomType,
  occupancy,
  fallbackImageUrl,
  availableSections,
  pricingItems,
  subtotal,
  tax,
  total,
  onConfirm,
  onEditSection,
  onRemoveItem,
  children,
}) => {
  const {
    rooms,
    activeRoomId,
    selectedRoom,
    shouldShowMultiBooking,
    totalPrice,
    itemCount,
    showMobilePricing,
    switchRoom,
    setShowMobilePricing,
  } = useOptimizedBooking()

  // Create combined stay dates display
  const stayDates = checkIn && checkOut ? `From ${checkIn} to ${checkOut}` : 'N/A'

  // Create room tabs data from room bookings
  const roomTabs = rooms.map((booking) => ({
    id: booking.id,
    roomName: booking.roomName,
    roomNumber: booking.roomNumber,
    guestName: booking.guestName,
  }))

  const handleMobilePricingToggle = (show: boolean) => {
    setShowMobilePricing(show)
  }

  const handleMultiBookingRemoveItem = (
    roomId: string,
    itemId: string | number,
    itemName: string,
    itemType: PricingItem['type']
  ) => {
    onRemoveItem(itemId, itemName, itemType, roomId)
  }

  const handleMultiBookingEditSection = (roomId: string, sectionType: 'room' | 'customizations' | 'offers') => {
    // Switch to the room first
    switchRoom(roomId)
    // Then trigger edit section
    onEditSection(sectionType)
  }

  const handleMultiBookingConfirmAll = async () => {
    // Implementation for confirming all room bookings
    console.log('Confirming all room bookings:', rooms)
    onConfirm()
  }

  return (
    <div className="min-h-screen bg-neutral-50/30 flex flex-col">
      {/* Header with Total Price */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Customize Your Stay
              </h1>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                {translations.currencySymbol}{shouldShowMultiBooking ? totalPrice : total}
              </div>
              <div className="text-sm text-gray-500">
                {translations.totalLabel}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Room Tabs - conditionally rendered for multi-booking */}
      {shouldShowMultiBooking && (
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-3 sm:px-4">
            <RoomTabs
              roomTabs={roomTabs}
              activeRoomId={activeRoomId ?? undefined}
              onRoomTabClick={switchRoom}
            />
          </div>
        </div>
      )}

      {/* Booking Info Bar */}
      <BookingInfoBar
        {...(shouldShowMultiBooking
          ? {
              roomBookings: rooms.map((booking) => ({
                id: booking.id,
                roomName: booking.roomName,
                roomNumber: booking.roomNumber,
                guestName: booking.guestName,
                roomImage: booking.baseRoom?.image || fallbackImageUrl,
                items: [
                  { label: translations.reservationCodeLabel || 'Reservation Code', value: reservationCode || 'N/A', icon: 'Tag' },
                  { label: 'Stay Dates', value: stayDates, icon: 'Calendar' },
                  { label: 'Room Type', value: roomType || 'N/A', icon: 'Home' },
                  { label: translations.occupancyLabel || 'Occupancy', value: occupancy || 'N/A', icon: 'Users' },
                ],
              })),
              activeRoom: activeRoomId,
              onRoomActiveChange: switchRoom,
              labels: {
                multiRoomBookingsTitle: translations.multiBookingLabels.multiRoomBookingsTitle,
                roomsCountLabel: translations.multiBookingLabels.roomsCountLabel,
                singleRoomLabel: translations.multiBookingLabels.singleRoomLabel || 'habitación',
                clickToExpandLabel: translations.multiBookingLabels.clickToExpandLabel,
                roomLabel: 'Habitación',
                guestLabel: 'Huésped',
                selectionLabel: translations.selectedText || 'Selected',
              },
            }
          : {
              items: [
                { label: translations.reservationCodeLabel || 'Reservation Code', value: reservationCode || 'N/A', icon: 'Tag' },
                { label: 'Stay Dates', value: stayDates, icon: 'Calendar' },
                { label: 'Room Type', value: roomType || 'N/A', icon: 'Home' },
                { label: translations.occupancyLabel || 'Occupancy', value: occupancy || 'N/A', icon: 'Users' },
              ],
            })}
      />

      {/* Main Content Area */}
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 sm:gap-8 flex-grow pb-20 lg:pb-8">
        {/* Content Sections */}
        <div className="flex-grow space-y-6 sm:space-y-8 w-full xl:max-w-[calc(100%-480px)]">
          {children}
        </div>

        {/* Pricing Summary Panel */}
        <aside className="flex-shrink-0 md:max-w-md sticky top-24 self-start w-full">
          {shouldShowMultiBooking ? (
            <MultiBookingPricingSummaryPanel
              roomBookings={rooms.map(room => ({
                ...room,
                payAtHotel: room.payAtHotel ?? false
              }))}
              labels={translations.multiBookingLabels}
              currency="EUR"
              locale={language === 'en' ? 'en-US' : 'es-ES'}
              isLoading={false}
              activeRooms={activeRoomId ? [activeRoomId] : []}
              onActiveRoomsChange={(roomIds) => roomIds[0] && switchRoom(roomIds[0])}
              onRemoveItem={handleMultiBookingRemoveItem}
              onEditSection={handleMultiBookingEditSection}
              onConfirmAll={handleMultiBookingConfirmAll}
            />
          ) : (
            <div className={clsx('transition-opacity duration-300', 'opacity-100')}>
              <PricingSummaryPanel
                roomImage={selectedRoom?.image || fallbackImageUrl}
                items={pricingItems}
                pricing={{ subtotal, taxes: tax }}
                isLoading={false}
                availableSections={availableSections}
                labels={{
                  selectedRoomLabel: translations.selectedRoomLabel,
                  upgradesLabel: translations.upgradesLabel,
                  specialOffersLabel: translations.specialOffersLabel,
                  chooseYourSuperiorRoomLabel: translations.chooseYourSuperiorRoomLabel,
                  customizeYourRoomLabel: translations.customizeYourRoomLabel,
                  enhanceYourStayLabel: translations.enhanceYourStayLabel,
                  chooseYourRoomLabel: translations.chooseYourRoomLabel,
                  subtotalLabel: translations.subtotalLabel,
                  taxesLabel: translations.taxesLabel,
                  totalLabel: translations.totalLabel,
                  payAtHotelLabel: translations.payAtHotelLabel,
                  viewTermsLabel: translations.viewTermsLabel,
                  confirmButtonLabel: translations.confirmButtonLabel,
                  noUpgradesSelectedLabel: translations.noUpgradesSelectedLabel,
                  noOffersSelectedLabel: translations.noOffersSelectedLabel,
                  emptyCartMessage: translations.emptyCartMessage,
                  editLabel: translations.editLabel,
                  roomRemovedMessage: translations.roomRemovedMessage,
                  offerRemovedMessagePrefix: translations.offerRemovedMessagePrefix,
                  customizationRemovedMessagePrefix: translations.customizationRemovedMessagePrefix,
                  addedMessagePrefix: translations.addedMessagePrefix,
                  euroSuffix: translations.euroSuffix,
                  loadingLabel: translations.loadingLabel,
                  roomImageAltText: translations.roomImageAltText,
                  removeRoomUpgradeLabel: translations.removeRoomUpgradeLabel,
                  exploreLabel: translations.exploreLabel,
                  fromLabel: translations.fromLabel,
                  customizeStayTitle: translations.customizeTitle || 'Customize Your Stay',
                  chooseOptionsSubtitle: translations.customizeSubtitle || 'Choose your preferred options',
                  missingLabelsError: 'Missing labels error',
                  invalidPricingError: 'Invalid pricing error',
                  currencyFormatError: 'Currency format error',
                  performanceWarning: 'Performance warning',
                  notificationsLabel: 'Notifications',
                  closeNotificationLabel: 'Close notification',
                  pricingSummaryLabel: 'Pricing summary',
                  processingLabel: 'Processing',
                  bidForUpgradeLabel: 'Bid for Upgrade',
                }}
                currency="EUR"
                locale={language === 'en' ? 'en-US' : 'es-ES'}
                onRemoveItem={(id, name, type) => onRemoveItem(id, name, type)}
                onConfirm={onConfirm}
                onEditSection={(section) => {
                  if (section === 'room') onEditSection('room')
                  else if (section === 'customizations') onEditSection('customizations')
                  else if (section === 'offers') onEditSection('offers')
                }}
              />
            </div>
          )}
        </aside>
      </main>

      {/* Mobile Pricing Widget */}
      <MobilePricingWidget
        total={shouldShowMultiBooking ? totalPrice : total}
        currencySymbol={translations.currencySymbol}
        itemCount={shouldShowMultiBooking ? itemCount : itemCount}
        onShowPricing={() => handleMobilePricingToggle(true)}
        isLoading={false}
        summaryButtonLabel={translations.summaryButtonLabel}
        isMultiBooking={shouldShowMultiBooking}
        roomCount={shouldShowMultiBooking ? rooms.length : undefined}
        roomsLabel={shouldShowMultiBooking ? "rooms" : undefined}
      />

      {/* Mobile Pricing Overlay */}
      <MobilePricingOverlay
        isOpen={showMobilePricing}
        onClose={() => handleMobilePricingToggle(false)}
        {...(shouldShowMultiBooking ? {
          // Multibooking props
          isMultiBooking: true,
          roomBookings: rooms.map(room => ({
            ...room,
            payAtHotel: room.payAtHotel ?? false
          })),
          activeRoom: activeRoomId,
          onActiveRoomChange: switchRoom,
          multiBookingLabels: translations.multiBookingLabels,
          onMultiBookingRemoveItem: handleMultiBookingRemoveItem,
          onMultiBookingEditSection: handleMultiBookingEditSection,
          onMultiBookingConfirmAll: handleMultiBookingConfirmAll,
          multiBookingCurrency: "EUR",
          multiBookingLocale: language === 'en' ? 'en-US' : 'es-ES',
          // Required base props (placeholder)
          roomImage: fallbackImageUrl,
          items: [],
          pricing: { subtotal: 0 },
          labels: {} as any, // Will be properly typed
          onRemoveItem: () => {},
          onConfirm: () => {}
        } : {
          // Single booking props
          roomImage: selectedRoom?.image || fallbackImageUrl,
          items: pricingItems,
          pricing: { subtotal, taxes: tax },
          isLoading: false,
          availableSections: availableSections,
          labels: {
            selectedRoomLabel: translations.selectedRoomLabel,
            upgradesLabel: translations.upgradesLabel,
            specialOffersLabel: translations.specialOffersLabel,
            chooseYourSuperiorRoomLabel: translations.chooseYourSuperiorRoomLabel,
            customizeYourRoomLabel: translations.customizeYourRoomLabel,
            enhanceYourStayLabel: translations.enhanceYourStayLabel,
            chooseYourRoomLabel: translations.chooseYourRoomLabel,
            subtotalLabel: translations.subtotalLabel,
            taxesLabel: translations.taxesLabel,
            totalLabel: translations.totalLabel,
            payAtHotelLabel: translations.payAtHotelLabel,
            viewTermsLabel: translations.viewTermsLabel,
            confirmButtonLabel: translations.confirmButtonLabel,
            noUpgradesSelectedLabel: translations.noUpgradesSelectedLabel,
            noOffersSelectedLabel: translations.noOffersSelectedLabel,
            emptyCartMessage: translations.emptyCartMessage,
            editLabel: translations.editLabel,
            roomRemovedMessage: translations.roomRemovedMessage,
            offerRemovedMessagePrefix: translations.offerRemovedMessagePrefix,
            customizationRemovedMessagePrefix: translations.customizationRemovedMessagePrefix,
            addedMessagePrefix: translations.addedMessagePrefix,
            euroSuffix: translations.euroSuffix,
            loadingLabel: translations.loadingLabel,
            roomImageAltText: translations.roomImageAltText,
            removeRoomUpgradeLabel: translations.removeRoomUpgradeLabel,
            exploreLabel: translations.exploreLabel,
            fromLabel: translations.fromLabel,
            customizeStayTitle: translations.customizeTitle || 'Customize Your Stay',
            chooseOptionsSubtitle: translations.customizeSubtitle || 'Choose your preferred options',
            missingLabelsError: 'Missing labels error',
            invalidPricingError: 'Invalid pricing error',
            currencyFormatError: 'Currency format error',
            performanceWarning: 'Performance warning',
            notificationsLabel: 'Notifications',
            closeNotificationLabel: 'Close notification',
            pricingSummaryLabel: 'Pricing summary',
            processingLabel: 'Processing',
            bidForUpgradeLabel: 'Bid for Upgrade',
          },
          currency: "EUR",
          locale: language === 'en' ? 'en-US' : 'es-ES',
          onRemoveItem: (id: string | number, name: string, type: PricingItem['type']) => {
            onRemoveItem(id, name, type)
          },
          onConfirm: onConfirm,
          onEditSection: (section: 'room' | 'customizations' | 'offers') => {
            if (section === 'room') onEditSection('room')
            else if (section === 'customizations') onEditSection('customizations')
            else if (section === 'offers') onEditSection('offers')
          }
        })}
      />
    </div>
  )
})

BookingModeContainer.displayName = 'BookingModeContainer'

export default BookingModeContainer