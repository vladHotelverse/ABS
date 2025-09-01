import type React from 'react'
import { toast } from 'sonner'
import { cn } from '../../lib/utils'
import PriceBreakdown from './components/PriceBreakdown'
import RoomAccordionItem from './components/RoomAccordionItem'
import type { ExtendedPricingItem, ComponentRoomBooking } from '../../types/shared'
import { useAccordionState } from './hooks/useAccordionState'
import { useConfirmAll } from './hooks/useConfirmAll'
import { useCurrencyFormatter } from '../../hooks/useCurrencyFormatter'
import { useItemManagement } from './hooks/useItemManagement'
import { useRoomCalculations } from './hooks/useRoomCalculations'

// Available item interface for upgrades and offers
export interface AvailableItem {
  id: string
  name: string
  price: number
  category: string
}

// Extended interface for room booking data
// Using ComponentRoomBooking for type safety in UI components
export interface RoomBooking extends ComponentRoomBooking {
  // This interface now inherits from ComponentRoomBooking
  // All fields are already defined in the parent interface
}

// Type alias for backward compatibility
export type { ComponentRoomBooking as SafeRoomBooking }

// Multi-booking labels interface
export interface MultiBookingLabels {
  multiRoomBookingsTitle: string
  roomsCountLabel: string
  singleRoomLabel: string
  clickToExpandLabel: string
  selectedRoomLabel: string
  upgradesLabel: string
  specialOffersLabel: string
  chooseYourSuperiorRoomLabel: string
  customizeYourRoomLabel: string
  enhanceYourStayLabel: string
  chooseYourRoomLabel: string
  roomTotalLabel: string
  subtotalLabel: string
  totalLabel: string
  payAtHotelLabel: string
  viewTermsLabel: string
  confirmAllButtonLabel: string
  confirmingAllLabel: string
  editLabel: string
  addLabel: string
  addUpgradeTitle: string
  noUpgradesSelectedLabel: string
  noOffersSelectedLabel: string
  noMoreUpgradesLabel: string
  noMoreOffersLabel: string
  euroSuffix: string
  nightsLabel: string
  nightLabel: string
  guestsLabel: string
  guestLabel: string
  roomImageAltText: string
  removedSuccessfully: string
  addedSuccessfully: string
  cannotRemoveRoom: string
  itemAlreadyAdded: string

  // Accessibility labels for toast
  notificationsLabel: string
  closeNotificationLabel: string
}

export interface MultiBookingPricingSummaryPanelProps {
  className?: string
  roomBookings: RoomBooking[]
  labels: MultiBookingLabels
  currency?: string
  locale?: string
  isLoading?: boolean
  activeRooms?: string[]
  onActiveRoomsChange?: (roomIds: string[]) => void
  onRemoveItem: (roomId: string, itemId: string | number, itemName: string, itemType: ExtendedPricingItem['type']) => void
  onEditSection: (roomId: string, sectionType: 'room' | 'customizations' | 'offers') => void
  onConfirmAll: () => Promise<void>
  hideFooter?: boolean
  maxHeight?: string | false
}

const MultiBookingPricingSummaryPanel: React.FC<MultiBookingPricingSummaryPanelProps> = ({
  className,
  roomBookings,
  labels,
  currency,
  locale,
  isLoading = false,
  activeRooms,
  onActiveRoomsChange,
  onRemoveItem,
  onConfirmAll,
  hideFooter = false,
  maxHeight = 'max-h-[600px]',
}) => {
  // Custom hooks
  const { handleAccordionToggle, isRoomActive } = useAccordionState(
    roomBookings.map(room => room.id), // Pass all room IDs
    activeRooms, // Can be undefined - accordion will manage its own state
    onActiveRoomsChange, // Can be undefined - accordion will manage its own state
    true // Enable multiple open accordions
  )
  const { overallTotal, totalItemsCount } = useRoomCalculations(roomBookings)
  const { format: formatCurrency } = useCurrencyFormatter({ currency, locale, euroSuffix: labels.euroSuffix })
  const { removingItems, handleRemoveItem } = useItemManagement({
    roomBookings,
    labels,
    onRemoveItem,
    showToast: (message: string, type?: 'success' | 'error' | 'info') => {
      switch (type) {
        case 'success':
          toast.success(message)
          break
        case 'error':
          toast.error(message)
          break
        default:
          toast.info(message)
      }
    },
  })
  const { confirmingAll, handleConfirmAll } = useConfirmAll({
    roomCount: roomBookings.length,
    labels,
    onConfirmAll,
    showToast: (message: string, type?: 'success' | 'error' | 'info') => {
      switch (type) {
        case 'success':
          toast.success(message)
          break
        case 'error':
          toast.error(message)
          break
        default:
          toast.info(message)
      }
    },
  })

  return (
    <div className={cn('sticky md:top-28 w-full', className)} data-testid="multi-booking-pricing-panel">
      <div className="min-w-[350px] w-full bg-card border border-border rounded-lg overflow-hidden shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-border bg-muted">
          <h2 className="text-lg font-semibold text-card-foreground">{labels.multiRoomBookingsTitle}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {roomBookings.length} {roomBookings.length === 1 ? 'room' : labels.roomsCountLabel} •{' '}
            {labels.clickToExpandLabel}
          </p>
        </div>

        {/* Accordion Sections */}
        <div className={cn('overflow-y-auto', maxHeight && maxHeight)}>
          {roomBookings.map((room) => (
            <RoomAccordionItem
              key={room.id}
              room={room}
              labels={labels}
              isActive={isRoomActive(room.id)}
              removingItems={removingItems}
              formatCurrency={formatCurrency}
              onToggle={handleAccordionToggle}
              onRemoveItem={handleRemoveItem}
            />
          ))}
        </div>

        {/* Consolidated Summary Footer */}
        {!hideFooter && (
          <div className="border-t border-border bg-muted p-4">
            <PriceBreakdown
              subtotal={overallTotal}
              isLoading={confirmingAll || isLoading}
              labels={{
                subtotalLabel: labels.subtotalLabel,
                totalLabel: labels.totalLabel,
                payAtHotelLabel: labels.payAtHotelLabel,
                viewTermsLabel: labels.viewTermsLabel,
                confirmButtonLabel: confirmingAll
                  ? labels.confirmingAllLabel
                  : `Confirm Selection`,
                loadingLabel: labels.confirmingAllLabel,
                euroSuffix: labels.euroSuffix,
              }}
              currency={currency}
              locale={locale}
              disabled={totalItemsCount === 0}
              onConfirm={handleConfirmAll}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default MultiBookingPricingSummaryPanel
