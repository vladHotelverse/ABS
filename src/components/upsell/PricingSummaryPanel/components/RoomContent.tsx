import type React from 'react'
import { memo } from 'react'
import ItemsSection from '@/components/upsell/PricingSummaryPanel/components/ItemsSection'
import type { CartSection } from '../types'

interface RoomContentProps {
  sections: CartSection[]
  formattedTotal: string
  labels: {
    roomTotalLabel: string
    payAtHotel?: string
    noSelectionsTitle?: string
    noSelectionsDescription?: string
  }
  onRemoveItem: (itemId: string, itemName: string) => void
  readonly?: boolean
}

/**
 * Pure UI component - displays pre-organized sections
 * No data filtering or transformation
 */
const RoomContent: React.FC<RoomContentProps> = memo(({ sections, labels, onRemoveItem, readonly = false }) => {
  const hasItems = sections.some((section) => section.items.length > 0)

  return (
    <div className="border-border border-t bg-card">
      <div className="space-y-4 p-4">
        {!hasItems ? (
          <div className="py-8 text-center text-muted-foreground">
            <p className="text-sm">{labels.noSelectionsTitle || 'No selections made for this room yet.'}</p>
            <p className="mt-1 text-xs">
              {labels.noSelectionsDescription || 'Add upgrades or customizations to see them here.'}
            </p>
          </div>
        ) : (
          sections.map((section) => (
            <ItemsSection
              key={section.title}
              title={section.title}
              items={section.items}
              onRemoveItem={onRemoveItem}
              readonly={readonly}
            />
          ))
        )}
      </div>
    </div>
  )
})

RoomContent.displayName = 'RoomContent'

export default RoomContent
