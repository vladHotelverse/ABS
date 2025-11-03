'use client'

import { X } from 'lucide-react'
import type React from 'react'
import { UiButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface PricingItemData {
  id: string
  name: string
  formattedPrice: string // Pre-formatted with currency
  concept?: string
}

interface PricingItemComponentProps {
  item: PricingItemData
  removeLabel: string
  onRemove: () => void
  readonly?: boolean
}

/**
 * Pure UI component - displays pre-formatted pricing item
 * No status logic, just displays name and price
 */
const PricingItemComponent: React.FC<PricingItemComponentProps> = ({
  item,
  removeLabel,
  onRemove,
  readonly = false,
}) => {
  return (
    <div className="group -mx-2 mb-3 rounded-md border-border/20 border-b px-2 pb-3 transition-all duration-200 ease-in-out last:mb-0 last:border-b-0 last:pb-0 hover:bg-muted/50">
      <div className={cn('flex items-center justify-between')}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn('line-clamp-2 max-w-[200px] text-foreground text-sm')}>{item.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-medium text-sm">{item.formattedPrice}</span>
          {!readonly && (
            <UiButton
              variant="outline"
              size="icon-xs"
              onClick={onRemove}
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200',
                'hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400'
              )}
              aria-label={removeLabel}
              data-testid="pricing-item-remove-button"
            >
              <X size={12} strokeWidth={2} className="h-3 w-3" />
            </UiButton>
          )}
        </div>
      </div>
    </div>
  )
}

export default PricingItemComponent
