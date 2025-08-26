import { X } from 'lucide-react'
import React, { useCallback, useEffect, useRef } from 'react'
import PricingSummaryPanel from '../index'
import MultiBookingPricingSummaryPanel from '../MultiBookingPricingSummaryPanel'
import PriceBreakdown from './PriceBreakdown'
import type { PricingSummaryPanelProps } from '../types'
import type { RoomBooking, MultiBookingLabels } from '../MultiBookingPricingSummaryPanel'
import type { PricingItem } from '../types'
import { cn } from '../../../lib/utils'
import { UiButton } from '../../ui/button'
import { Dialog, DialogContent } from '../../ui/dialog'
import { useRoomCalculations } from '../hooks/useRoomCalculations'
import { useCurrencyFormatter } from '../hooks/useCurrencyFormatter'

export interface MobilePricingOverlayProps extends PricingSummaryPanelProps {
  isOpen: boolean
  onClose: () => void
  containerId?: string
  overlayTitle?: string
  closeButtonLabel?: string
  testId?: string
  
  // Multibooking support
  isMultiBooking?: boolean
  roomBookings?: RoomBooking[]
  activeRooms?: string[]
  onActiveRoomsChange?: (roomIds: string[]) => void
  multiBookingLabels?: MultiBookingLabels
  onMultiBookingRemoveItem?: (roomId: string, itemId: string | number, itemName: string, itemType: PricingItem['type']) => void
  onMultiBookingEditSection?: (roomId: string, sectionType: 'room' | 'customizations' | 'offers') => void
  onMultiBookingConfirmAll?: () => Promise<void>
  multiBookingCurrency?: string
  multiBookingLocale?: string
}

const MobilePricingOverlay: React.FC<MobilePricingOverlayProps> = ({
  isOpen,
  onClose,
  containerId,
  overlayTitle = 'Resumen de reserva',
  closeButtonLabel = 'Cerrar',
  testId = 'mobile-pricing-overlay',
  
  // Multibooking props
  isMultiBooking = false,
  roomBookings,
  activeRooms,
  onActiveRoomsChange,
  multiBookingLabels,
  onMultiBookingRemoveItem,
  onMultiBookingEditSection,
  onMultiBookingConfirmAll,
  multiBookingCurrency = 'EUR',
  multiBookingLocale = 'en-US',
  
  ...pricingSummaryProps
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEscape)

    if (closeButtonRef.current) {
      closeButtonRef.current.focus()
    }

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, handleClose])
  // Calculate totals for multi-booking footer
  const { overallTotal, totalItemsCount } = useRoomCalculations(roomBookings || [])
  const formatCurrency = useCurrencyFormatter({ 
    currency: multiBookingCurrency, 
    locale: multiBookingLocale, 
    euroSuffix: multiBookingLabels?.euroSuffix || ''
  })

  // Determine if confirm button should be enabled
  const hasSelections = isMultiBooking ? totalItemsCount > 0 : false

  return (
    <div className="lg:hidden" data-testid={testId}>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent 
          className={cn(
            'z-[300] w-full max-w-none p-0 bg-neutral-50 border-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
            'duration-300 ease-in-out',
            'min-h-[100svh] h-full flex flex-col pb-48'
          )}
          containerId={containerId}
          hideClose={true}
          aria-labelledby="pricing-overlay-title"
          aria-describedby="pricing-overlay-content"
        >
          {/* Close button positioned in top right corner */}
          <UiButton
            ref={closeButtonRef}
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 min-h-[44px] min-w-[44px] p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm transition-colors"
            aria-label={closeButtonLabel}
          >
            <X className="w-6 h-6 text-neutral-600" aria-hidden="true" />
          </UiButton>
          
          {/* Scrollable content area */}
          <div 
            id="pricing-overlay-content"
            className="flex-1 overflow-y-auto"
          >
            {isMultiBooking && roomBookings && multiBookingLabels ? (
              <MultiBookingPricingSummaryPanel
                roomBookings={roomBookings}
                labels={multiBookingLabels}
                currency={multiBookingCurrency}
                locale={multiBookingLocale}
                isLoading={false}
                activeRooms={activeRooms}
                onActiveRoomsChange={onActiveRoomsChange}
                onRemoveItem={onMultiBookingRemoveItem!}
                onEditSection={onMultiBookingEditSection!}
                onConfirmAll={onMultiBookingConfirmAll!}
                hideFooter={true}
                maxHeight={false}
                className={cn('border-0 shadow-none bg-transparent rounded-none')}
              />
            ) : (
              <PricingSummaryPanel 
                {...pricingSummaryProps} 
                className={cn('h-fit border-0 shadow-none bg-transparent rounded-none')} 
              />
            )}
          </div>
          
          {/* Sticky footer with pricing summary */}
          {isMultiBooking && roomBookings && multiBookingLabels && (
            <div className="fixed w-full bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
              <PriceBreakdown
                subtotal={overallTotal}
                isLoading={false}
                disabled={!hasSelections}
                labels={{
                  subtotalLabel: multiBookingLabels.subtotalLabel,
                  totalLabel: multiBookingLabels.totalLabel,
                  payAtHotelLabel: multiBookingLabels.payAtHotelLabel,
                  viewTermsLabel: multiBookingLabels.viewTermsLabel,
                  confirmButtonLabel: hasSelections 
                    ? `${multiBookingLabels.confirmAllButtonLabel} ${totalItemsCount} Selections`
                    : multiBookingLabels.confirmAllButtonLabel,
                  loadingLabel: multiBookingLabels.confirmingAllLabel,
                  euroSuffix: multiBookingLabels.euroSuffix,
                }}
                currency={multiBookingCurrency}
                locale={multiBookingLocale}
                onConfirm={onMultiBookingConfirmAll}
              />
            </div>
          )}
          
          {/* Safe area for devices with home indicator */}
          <div className="h-[env(safe-area-inset-bottom)] bg-white" />
        </DialogContent>
      </Dialog>
    </div>
  )
}


export default React.memo(MobilePricingOverlay)
