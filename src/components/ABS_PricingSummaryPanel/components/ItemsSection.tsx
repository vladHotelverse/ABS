import type React from 'react'
import { memo } from 'react'
import PricingItemComponent from './PricingItemComponent'
import type { PricingItem } from '../types'

export interface ItemsSectionProps {
  title: string
  items: PricingItem[]
  euroSuffix: string
  emptyMessage?: string
  removingItems?: Set<string>
  // Support both single booking and multi-booking remove handlers
  onRemoveItem?: (item: PricingItem) => void
  onRemoveItemMulti?: (roomId: string, itemId: string | number, itemName: string, itemType: PricingItem['type']) => void
  roomId?: string
}

const ItemsSection: React.FC<ItemsSectionProps> = memo(({
  title,
  items,
  euroSuffix,
  emptyMessage,
  removingItems,
  onRemoveItem,
  onRemoveItemMulti,
  roomId,
}) => {
  // Always return null if no items - don't render empty sections
  // This matches the original single booking behavior
  if (items.length === 0) return null

  return (
    <section aria-labelledby={`${title.toLowerCase().replace(/\s+/g, '-')}-section-title`} className="bg-gray-50 rounded-lg p-3 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 id={`${title.toLowerCase().replace(/\s+/g, '-')}-section-title`} className="text-base font-semibold">
          {title}
        </h3>
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          className={removingItems?.has(String(item.id)) ? 'opacity-50 scale-95 transition-all duration-300' : ''}
        >
          <PricingItemComponent
            item={item}
            euroSuffix={euroSuffix}
            removeLabel={`Remove ${item.name}`}
            onRemove={() => {
              try {
                if (onRemoveItemMulti && roomId) {
                  onRemoveItemMulti(roomId, item.id, item.name, item.type)
                } else if (onRemoveItem) {
                  onRemoveItem(item)
                }
              } catch (error) {
                console.error('Error in remove item callback:', error)
              }
            }}
          />
        </div>
      ))}
    </section>
  )
})

export default ItemsSection