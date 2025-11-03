import type React from 'react'
import { memo } from 'react'
import PricingItemComponent from '@/components/upsell/PricingSummaryPanel/components/PricingItemComponent'

export interface PricingItemData {
  id: string
  name: string
  formattedPrice: string
}

export interface ItemsSectionProps {
  title: string
  items: PricingItemData[]
  onRemoveItem: (itemId: string, itemName: string) => void
  readonly?: boolean
}

/**
 * Pure UI component - renders items as-is
 */
const ItemsSection: React.FC<ItemsSectionProps> = memo(({ title, items, onRemoveItem, readonly = false }) => {
  if (items.length === 0) return null

  return (
    <section
      aria-labelledby={`${title.toLowerCase().replace(/\s+/g, '-')}-section-title`}
      className="mb-2 rounded-lg bg-muted p-3"
    >
      <div className="mb-2 flex items-center justify-between">
        <h3
          id={`${title.toLowerCase().replace(/\s+/g, '-')}-section-title`}
          className="font-semibold text-base text-foreground"
        >
          {title}
        </h3>
      </div>
      {items.map((item) => (
        <PricingItemComponent
          key={item.id}
          item={item}
          removeLabel={`Remove ${item.name}`}
          onRemove={() => onRemoveItem(item.id, item.name)}
          readonly={readonly}
        />
      ))}
    </section>
  )
})

ItemsSection.displayName = 'ItemsSection'

export default ItemsSection
