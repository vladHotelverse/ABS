'use client'

import clsx from 'clsx'
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import BookingInfoSection from '@/components/upsell/PricingSummaryPanel/components/BookingInfoSection'
import PriceBreakdown from '@/components/upsell/PricingSummaryPanel/components/PriceBreakdown'
import RoomAccordionItem from '@/components/upsell/PricingSummaryPanel/components/RoomAccordionItem'
import SingleRoomDisplay from '@/components/upsell/PricingSummaryPanel/components/SingleRoomDisplay'
import type { CartSection, UILabels } from '@/components/upsell/PricingSummaryPanel/types'
import { useDynamicMaxHeight } from '@/hooks/useDynamicMaxHeight'
import { useIsDesktop } from '@/hooks/useIsDesktop'

// Cart-based props interface - accepts pre-formatted display data
export interface MultiBookingPricingSummaryPanelProps {
  className?: string

  // Pre-formatted rooms for display
  rooms: Array<{
    id: string
    displayName: string
    guestName: string
    formattedNights: string
    formattedTotal: string
    sections: CartSection[] // Pre-built sections from app layer
    guestCount?: number // Total number of guests for this room
  }>

  // Pre-formatted bookings info
  formattedBookings: Array<{
    id: string
    displayName: string
    bookingKey: string
    formattedDateRange: string
    formattedNights: string
    formattedGuests: string
  }>

  // Pre-formatted totals
  formattedOverallTotal: string

  labels: UILabels
  loading?: boolean
  activeRooms?: string[]
  onActiveRoomsChange?: (roomIds: string[]) => void
  onRemoveItem?: (bookingKey: string, itemId: string) => void
  onConfirm?: () => void
  hideFooter?: boolean
  isConfirmDisabled?: boolean
  readonly?: boolean
  isSticky?: boolean
  exclusiveAccordion?: boolean // Only one room accordion open at a time (default: false)
}

/**
 * Pure UI component for multi-booking pricing summary
 * Accepts pre-formatted display data - no business logic
 */
const MultiBookingPricingSummaryPanel: React.FC<MultiBookingPricingSummaryPanelProps> = ({
  className,
  rooms,
  formattedBookings,
  formattedOverallTotal,
  labels,
  loading = false,
  activeRooms,
  onActiveRoomsChange,
  onRemoveItem,
  onConfirm,
  hideFooter = false,
  isConfirmDisabled = false,
  readonly = false,
  isSticky = true,
  exclusiveAccordion = false,
}) => {
  const isMultiBooking = rooms.length > 1
  const singleRoom = !isMultiBooking ? rooms[0] : undefined

  // Detect if desktop viewport (>= 768px) - only run height hooks on desktop for performance
  const isDesktop = useIsDesktop()

  // Dynamic height calculation with optimized performance and smooth transitions
  // Only runs on desktop (>= 768px) for better mobile performance
  const {
    containerRef,
    maxHeight: dynamicMaxHeight,
    isScrolling,
  } = useDynamicMaxHeight<HTMLDivElement>({
    minHeight: 300,
    bottomPadding: 32,
    throttleMs: 100,
    debounceMs: 200,
    disabled: !isDesktop || !isSticky,
  })

  // Simple accordion state management (if no external control provided)
  const [internalActiveRooms, setInternalActiveRooms] = React.useState<string[]>(() => {
    // Only open rooms that have items selected
    const roomsWithItems = rooms.filter((room) => room.sections.some((section) => section.items.length > 0))

    if (exclusiveAccordion) {
      // Start with first room that has items (exclusive mode)
      return roomsWithItems.length > 0 ? [roomsWithItems[0].id] : []
    }
    // Start with all rooms that have items (default mode)
    return roomsWithItems.map((r) => r.id)
  })

  // Safety check for required props
  if (!labels) {
    console.error('PureMultiBookingPricingSummaryPanel: labels prop is required')
    return (
      <div className="rounded-lg border border-destructive bg-destructive/5 p-4 text-destructive">
        <h3 className="mb-2 font-semibold">Configuration Error</h3>
        <p>Missing required labels configuration. Please provide all required labels.</p>
      </div>
    )
  }

  const currentActiveRooms = activeRooms ?? internalActiveRooms

  const handleAccordionToggle = (roomId: string) => {
    let newActiveRooms: string[]

    if (exclusiveAccordion) {
      // Exclusive mode: only one room can be open at a time
      newActiveRooms = currentActiveRooms.includes(roomId) ? [] : [roomId]
    } else {
      // Default mode: multiple rooms can be open
      newActiveRooms = currentActiveRooms.includes(roomId)
        ? currentActiveRooms.filter((id) => id !== roomId)
        : [...currentActiveRooms, roomId]
    }

    if (onActiveRoomsChange) {
      onActiveRoomsChange(newActiveRooms)
    } else {
      setInternalActiveRooms(newActiveRooms)
    }
  }

  const isRoomActive = (roomId: string) => currentActiveRooms.includes(roomId)

  return (
    <div
      className={clsx(isSticky ? 'sticky w-full md:top-28' : 'relative w-full', className)}
      data-testid="multi-booking-pricing-panel"
    >
      <div
        ref={containerRef}
        className={clsx(
          'flex max-h-full min-w-[350px] flex-col overflow-hidden rounded-lg shadow-depth-2',
          'transition-all duration-300 ease-out',
          isScrolling && 'duration-100'
        )}
        style={{
          maxHeight: isSticky && dynamicMaxHeight > 0 ? `${dynamicMaxHeight}px` : undefined,
        }}
      >
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-6 w-6 animate-spin rounded-full" />
              <span className="text-muted-foreground text-sm">{labels.loadingLabel}</span>
            </div>
          </div>
        )}

        {formattedBookings.length > 0 && !readonly && (
          <div className="flex-shrink-0">
            <BookingInfoSection
              roomCount={formattedBookings.length}
              sectionTitle={labels.customizeStayTitle}
              labels={{ roomsCountLabel: labels.roomsCountLabel }}
            />
          </div>
        )}

        <div className={clsx('min-h-0 flex-1 bg-muted', isSticky && 'overflow-y-auto')}>
          {isMultiBooking ? (
            rooms.map((room) => (
              <RoomAccordionItem
                key={room.id}
                displayName={room.displayName}
                guestName={room.guestName}
                formattedTotal={room.formattedTotal}
                formattedNights={room.formattedNights}
                sections={room.sections}
                isActive={isRoomActive(room.id)}
                labels={labels}
                onToggle={() => handleAccordionToggle(room.id)}
                onRemoveItem={(itemId) => (onRemoveItem ? onRemoveItem(room.id, itemId) : null)}
                readonly={readonly}
                guestCount={room.guestCount}
              />
            ))
          ) : singleRoom ? (
            <SingleRoomDisplay
              id={singleRoom.id}
              displayName={singleRoom.displayName}
              formattedNights={singleRoom.formattedNights}
              formattedTotal={singleRoom.formattedTotal}
              sections={singleRoom.sections}
              guestCount={singleRoom.guestCount}
              labels={labels}
              onRemoveItem={(itemId) => onRemoveItem?.(singleRoom.id, itemId)}
              readonly={readonly}
            />
          ) : null}
        </div>

        {!hideFooter && (
          <div className="flex-shrink-0 bg-muted p-4">
            <PriceBreakdown
              formattedTotal={formattedOverallTotal}
              isLoading={loading}
              labels={labels}
              disabled={isConfirmDisabled}
              onConfirm={onConfirm}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default MultiBookingPricingSummaryPanel
