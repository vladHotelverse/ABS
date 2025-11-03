'use client'

import { ArrowLeft } from 'lucide-react'
import React, { useCallback, useEffect, useId, useRef } from 'react'
import { UiButton } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { MultiBookingPricingSummaryPanelProps } from '../MultiBookingPricingSummaryPanel'
import MultiBookingPricingSummaryPanel from '../MultiBookingPricingSummaryPanel'
import type { UILabels } from '../types'
import PriceBreakdown from './PriceBreakdown'

export interface MobilePricingOverlayProps {
  isOpen: boolean
  onClose: () => void
  containerId?: string
  readonly?: boolean
  closeButtonLabel?: string
  testId?: string

  // Multibooking support - pre-formatted props
  isMultiBooking?: boolean
  rooms?: MultiBookingPricingSummaryPanelProps['rooms']
  formattedBookings?: MultiBookingPricingSummaryPanelProps['formattedBookings']
  formattedOverallTotal?: string
  activeRooms?: string[]
  onActiveRoomsChange?: (roomIds: string[]) => void
  multiBookingLabels?: UILabels
  onMultiBookingRemoveItem?: (roomId: string, itemId: string) => void
  onMultiBookingConfirm?: () => void

  // Pre-calculated values from parent
  isConfirmDisabled?: boolean

  // Accordion behavior
  exclusiveAccordion?: boolean // Only one room accordion open at a time (default: true for mobile)
}

const MobilePricingOverlay: React.FC<MobilePricingOverlayProps> = ({
  isOpen,
  onClose,
  containerId,
  readonly = false,
  closeButtonLabel = 'Cerrar',
  testId = 'mobile-pricing-overlay',

  // Multibooking props
  isMultiBooking = false,
  rooms,
  formattedBookings,
  formattedOverallTotal,
  activeRooms,
  onActiveRoomsChange,
  multiBookingLabels,
  onMultiBookingRemoveItem,
  onMultiBookingConfirm,

  // Pre-calculated values
  isConfirmDisabled = false,

  // Accordion behavior
  exclusiveAccordion = true, // Default true for better mobile UX
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const contentId = useId()

  // Focus trap functionality
  const getFocusableElements = useCallback(() => {
    if (!contentRef.current) return []

    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ')

    return Array.from(contentRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[]
  }, [])

  const _trapFocus = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return

      const focusableElements = getFocusableElements()
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    },
    [isOpen, getFocusableElements]
  )

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
      _trapFocus(e)
    }

    const previousOverflow = document.body.style.overflow
    const previousActiveElement = document.activeElement as HTMLElement

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    // Focus the close button when overlay opens
    if (closeButtonRef.current) {
      closeButtonRef.current.focus()
    }

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)

      // Restore focus to the element that was focused before opening
      if (previousActiveElement?.focus) {
        previousActiveElement.focus()
      }
    }
  }, [isOpen, handleClose, _trapFocus])

  return (
    <div className="lg:hidden" data-testid={testId}>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          ref={contentRef}
          className={cn(
            'z-[300] w-full max-w-none border-none bg-background p-0',
            'data-[state=closed]:animate-out data-[state=open]:animate-in',
            'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
            'duration-300 ease-in-out',
            'flex h-full min-h-[100svh] flex-col pb-48',
            'touch-manipulation' // Optimize touch interactions
          )}
          containerId={containerId}
          hideClose={true}
          aria-labelledby={`pricing-overlay-title-${contentId}`}
          aria-describedby={`pricing-overlay-content-${contentId}`}
          role="dialog"
          aria-modal="true"
        >
          {/* Hidden title for screen readers */}
          <DialogTitle className="sr-only">Pricing Summary Details</DialogTitle>
          <DialogDescription className="sr-only">
            View detailed pricing breakdown for your booking selections. Review room costs and additional charges before
            confirming.
          </DialogDescription>

          {/* Close button positioned in top right corner with safe area support */}
          <UiButton
            ref={closeButtonRef}
            variant="secondary"
            size="icon"
            onClick={handleClose}
            className="absolute top-1 left-2 z-20 touch-manipulation bg-background/80 p-2 shadow-sm backdrop-blur-sm transition-colors hover:bg-muted"
            aria-label={closeButtonLabel}
          >
            <ArrowLeft className="h-5 w-5 text-foreground" aria-hidden="true" />
          </UiButton>

          {/* Scrollable content area with safe area support */}
          <div
            id={`pricing-overlay-content-${contentId}`}
            className="flex-1 overflow-y-auto px-[env(safe-area-inset-left)] pt-12 pr-[env(safe-area-inset-right)]"
          >
            {isMultiBooking && rooms && formattedBookings && formattedOverallTotal && multiBookingLabels ? (
              <MultiBookingPricingSummaryPanel
                rooms={rooms}
                formattedBookings={formattedBookings}
                formattedOverallTotal={formattedOverallTotal}
                labels={multiBookingLabels}
                loading={false}
                activeRooms={activeRooms}
                onActiveRoomsChange={onActiveRoomsChange}
                onRemoveItem={onMultiBookingRemoveItem || (() => {})}
                onConfirm={onMultiBookingConfirm || (() => {})}
                hideFooter={true}
                isSticky={false}
                isConfirmDisabled={isConfirmDisabled}
                className={cn('rounded-none border-0 bg-transparent shadow-none')}
                readonly={readonly}
                exclusiveAccordion={exclusiveAccordion}
              />
            ) : (
              <div className="p-4 text-center text-muted-foreground">Single booking mode not implemented</div>
            )}
          </div>

          {/* Sticky footer with pricing summary and safe area support */}
          {isMultiBooking && formattedOverallTotal && multiBookingLabels && (
            <div className="fixed bottom-0 w-full border-border border-t bg-card p-4 pr-[calc(1rem+env(safe-area-inset-right))] pb-[calc(1rem+env(safe-area-inset-bottom))] pl-[calc(1rem+env(safe-area-inset-left))] shadow-lg">
              <PriceBreakdown
                formattedTotal={formattedOverallTotal}
                isLoading={false}
                disabled={isConfirmDisabled}
                labels={{
                  totalLabel: multiBookingLabels.totalLabel,
                  payAtHotelLabel: multiBookingLabels.payAtHotelLabel,
                  viewTermsLabel: multiBookingLabels.viewTermsLabel,
                  confirmButtonLabel: multiBookingLabels.confirmButtonLabel,
                  loadingLabel: multiBookingLabels.loadingLabel,
                }}
                onConfirm={onMultiBookingConfirm}
              />
            </div>
          )}

          {/* Safe area for devices with home indicator */}
          <div className="h-[env(safe-area-inset-bottom)] bg-card" />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default React.memo(MobilePricingOverlay)
