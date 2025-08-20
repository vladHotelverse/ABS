import { X } from 'lucide-react'
import type React from 'react'
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
}

const MobilePricingOverlay: React.FC<MobilePricingOverlayProps> = ({
  isOpen,
  onClose,
  containerId,
  overlayTitle = 'Resumen de reserva',
  closeButtonLabel = 'Cerrar',
  ...pricingSummaryProps
}) => {
  return (
    <div className="lg:hidden">
      {/* Only show on mobile/tablet */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={cn(
          'z-[100] w-full h-full max-w-none p-0 bg-neutral-50',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
          'duration-300 ease-in-out'
        )}>
          {/* Header with title and close button */}
          <div className="sticky top-0 z-10 bg-white border-b border-neutral-200 p-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{overlayTitle}</h2>
            <UiButton
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] p-2 rounded-full hover:bg-neutral-100 transition-colors"
              aria-label={closeButtonLabel}
            >
              <X className="w-6 h-6 text-neutral-600" />
            </UiButton>
          </div>
          
          {/* Content area with proper scroll */}
          <div className="flex-1 overflow-y-auto p-4">
            <PricingSummaryPanel 
              {...pricingSummaryProps} 
              className={cn('h-fit border-0 shadow-none bg-transparent')} 
            />
          </div>
          
          {/* Safe area for iPhone bottom gesture indicator */}
          <div className="h-safe-area-inset-bottom bg-white" />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MobilePricingOverlay
