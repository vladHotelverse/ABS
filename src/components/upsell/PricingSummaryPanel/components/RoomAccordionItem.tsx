'use client'

import { ChevronDown, ChevronRight, Users } from 'lucide-react'
import type React from 'react'
import { memo } from 'react'
import { UiButton } from '@/components/ui/button'
import RoomContent from '@/components/upsell/PricingSummaryPanel/components/RoomContent'
import { cn } from '@/lib/utils'
import type { CartSection } from '../types'

interface RoomAccordionItemProps {
  displayName: string
  guestName: string
  formattedTotal: string
  formattedNights: string
  sections: CartSection[] // Pre-built sections from app layer
  isActive: boolean
  labels: {
    roomTotalLabel: string
  }
  onToggle: () => void
  onRemoveItem: (itemId: string, itemName: string) => void
  readonly?: boolean
  guestCount?: number // Total number of guests for this room
}

/**
 * Pure UI component - displays pre-formatted cart data
 * No formatting or business logic - just presentation
 */
const RoomAccordionItem: React.FC<RoomAccordionItemProps> = memo(
  ({
    displayName,
    formattedTotal,
    sections,
    isActive,
    labels,
    onToggle,
    onRemoveItem,
    readonly = false,
    guestCount,
  }) => {
    // Check if there are any items selected
    const hasItems = sections.some((section) => section.items.length > 0)

    const handleToggle = () => {
      // Only allow toggle if there are items
      if (hasItems) {
        onToggle()
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (hasItems && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        onToggle()
      }
    }

    return (
      <div className="mb-px last:mb-0">
        <UiButton
          variant="ghost"
          disabled={!hasItems}
          className={cn(
            'sticky top-0 z-10 h-auto w-full cursor-pointer justify-start rounded-none bg-card p-4 text-left shadow-depth-1 transition-all duration-200',
            isActive && 'shadow-depth-2',
            !hasItems && 'cursor-not-allowed opacity-60'
          )}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isActive}
          aria-label={`${displayName} - ${isActive ? 'Collapse' : 'Expand'} details`}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex w-full items-center gap-2">
              {isActive ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              )}
              <div className="w-full min-w-0 flex-1">
                <div className="flex w-full items-center justify-between">
                  <h3 className="line-clamp-1 flex max-w-[70%] gap-2 truncate font-semibold text-card-foreground text-sm">
                    {guestCount && guestCount > 0 && (
                      <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground text-xs">
                        <Users size={12} aria-hidden="true" />
                        <span>{guestCount}</span>
                      </div>
                    )}
                    {displayName}
                  </h3>
                  <div className="flex items-center gap-2">
                    {hasItems ? (
                      <div className="font-semibold text-card-foreground text-sm">{formattedTotal}</div>
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-muted-foreground" aria-hidden="true" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UiButton>

        {/* Accordion Content - with smooth height transition */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 ease-out',
            isActive ? 'max-h-[2000px]' : 'max-h-0'
          )}
        >
          <RoomContent
            sections={sections}
            formattedTotal={formattedTotal}
            labels={labels}
            onRemoveItem={onRemoveItem}
            readonly={readonly}
          />
        </div>
      </div>
    )
  }
)

RoomAccordionItem.displayName = 'RoomAccordionItem'

export default RoomAccordionItem
