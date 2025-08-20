import type React from 'react'
import PricingItemComponent from './PricingItemComponent'
import type { PricingItem } from '../types'

export interface ItemsSectionProps {
  title: string
  items: PricingItem[]
  euroSuffix: string
  removeLabel: string
  onRemoveItem: (item: PricingItem) => void
}

const ItemsSection: React.FC<ItemsSectionProps> = ({
  title,
  items,
  euroSuffix,
  removeLabel,
  onRemoveItem,
}) => {
  if (items.length === 0) return null

  return (
    <section aria-labelledby={`${title.toLowerCase().replace(/\s+/g, '-')}-section-title`} className="bg-gray-50 rounded-lg p-3 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 id={`${title.toLowerCase().replace(/\s+/g, '-')}-section-title`} className="text-base font-semibold">
          {title}
        </h3>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <PricingItemComponent
            key={item.id}
            item={item}
            euroSuffix={euroSuffix}
            removeLabel={`Remove ${item.name}`}
            onRemove={() => {
              try {
                onRemoveItem(item)
              } catch (error) {
                console.error('Error in remove item callback:', error)
              }
            }}
          />
        ))}
      </div>
    </section>
  )
}

export default ItemsSection