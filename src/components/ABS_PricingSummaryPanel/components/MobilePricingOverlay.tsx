import { X } from 'lucide-react'
import React, { useCallback, useEffect, useRef } from 'react'
import PricingSummaryPanel from '../index'
import type { PricingSummaryPanelProps } from '../types'
import { cn } from '../../../lib/utils'
import { UiButton } from '../../ui/button'
import { Dialog, DialogContent } from '../../ui/dialog'

export interface MobilePricingOverlayProps extends PricingSummaryPanelProps {
  isOpen: boolean
  onClose: () => void
  containerId?: string
  overlayTitle?: string
  closeButtonLabel?: string
  testId?: string
}

const MobilePricingOverlay: React.FC<MobilePricingOverlayProps> = ({
  isOpen,
  onClose,
  containerId,
  overlayTitle = 'Resumen de reserva',
  closeButtonLabel = 'Cerrar',
  testId = 'mobile-pricing-overlay',
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
  return (
    <div className="lg:hidden" data-testid={testId}>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent 
          className={cn(
            'z-[101] w-full h-full overflow-y-auto max-w-none p-0 bg-neutral-50 border-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
            'duration-300 ease-in-out'
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
            className="absolute top-4 right-4 z-10 min-h-[44px] min-w-[44px] p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm transition-colors"
            aria-label={closeButtonLabel}
          >
            <X className="w-6 h-6 text-neutral-600" aria-hidden="true" />
          </UiButton>
          
          <div 
            id="pricing-overlay-content"
            className="flex-1"
          >
            <PricingSummaryPanel 
              {...pricingSummaryProps} 
              className={cn('h-fit border-0 shadow-none bg-transparent rounded-none')} 
            />
          </div>
          
          <div className="h-[env(safe-area-inset-bottom)] bg-white" />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default React.memo(MobilePricingOverlay)
