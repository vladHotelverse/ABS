import type React from 'react'
import { memo } from 'react'
import PricingItemComponent from './PricingItemComponent'
import type { PricingItem } from '../types'

export interface BidUpgradesSectionProps {
  bidForUpgradeItems: PricingItem[]
  euroSuffix: string
  onRemoveItem: (item: PricingItem) => void
}

const BidUpgradesSection: React.FC<BidUpgradesSectionProps> = memo(({
  bidForUpgradeItems,
  euroSuffix,
  onRemoveItem
}) => {
  // Don't render if no bid items
  if (bidForUpgradeItems.length === 0) return null

  return (
    <section aria-labelledby="bid-section-title" className="bg-gray-50 rounded-lg p-3 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 id="bid-section-title" className="text-base font-semibold">
          Bid for Upgrades
        </h3>
      </div>
      {bidForUpgradeItems.map((item) => (
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
    </section>
  )
})

BidUpgradesSection.displayName = 'BidUpgradesSection'

export default BidUpgradesSection