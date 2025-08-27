import { ChevronDown, ChevronRight } from 'lucide-react'
import type React from 'react'
import { memo } from 'react'
import { cn } from '../../../lib/utils'
import { UiButton } from '../../ui/button'
import type { MultiBookingLabels, RoomBooking } from '../MultiBookingPricingSummaryPanel'
import type { PricingItem } from '../types'
import RoomContent from './RoomContent'

interface RoomAccordionItemProps {
  room: RoomBooking
  labels: MultiBookingLabels
  isActive: boolean
  removingItems: Set<string>
  formatCurrency: (price: number) => string
  onToggle: (roomId: string) => void
  onRemoveItem: (roomId: string, itemId: string | number, itemName: string, itemType: PricingItem['type']) => void
}

const RoomAccordionItem: React.FC<RoomAccordionItemProps> = memo(
  ({ room, labels, isActive, removingItems, formatCurrency, onToggle, onRemoveItem }) => {
    const total = room.items.reduce((sum, item) => sum + item.price, 0)

    return (
      <div className="border-b border-border last:border-b-0">
        {/* Accordion Trigger */}
        <UiButton
          variant="ghost"
          className={cn(
            'w-full h-auto p-4 text-left justify-start transition-all duration-200 hover:bg-muted/50 rounded-none',
            isActive && 'bg-primary/10'
          )}
          onClick={() => onToggle(room.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onToggle(room.id)
            }
          }}
          aria-expanded={isActive}
          aria-label={`${room.roomName} - ${isActive ? 'Collapse' : 'Expand'} details`}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {isActive ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-card-foreground text-sm">{room.roomName}</h3>
                  {room.items.some((item: any) => item.isUpgraded) && (
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-1.5 py-0.5 rounded text-xs font-medium">
                      Upgraded
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {room.guestName}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-card-foreground">{formatCurrency(total)}</div>
              <div className="text-xs text-muted-foreground">
                {room.nights} {room.nights > 1 ? labels.nightsLabel : labels.nightLabel}
              </div>
            </div>
          </div>
        </UiButton>

        {/* Accordion Content */}
        {isActive && (
          <RoomContent
            room={room}
            labels={labels}
            removingItems={removingItems}
            formatCurrency={formatCurrency}
            onRemoveItem={onRemoveItem}
          />
        )}
      </div>
    )
  }
)

RoomAccordionItem.displayName = 'RoomAccordionItem'

export default RoomAccordionItem
