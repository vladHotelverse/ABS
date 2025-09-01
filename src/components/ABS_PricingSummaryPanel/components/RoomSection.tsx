import type React from 'react'
import { memo } from 'react'
import PricingItemComponent from './PricingItemComponent'
import type { PricingItem } from '../types'

export interface RoomSectionProps {
  chooseYourRoomItems: PricingItem[]
  chooseYourSuperiorRoomItems: PricingItem[]
  euroSuffix: string
  removeRoomUpgradeLabel: string
  onRemoveItem: (item: PricingItem) => void
}

const RoomSection: React.FC<RoomSectionProps> = memo(({
  chooseYourRoomItems,
  chooseYourSuperiorRoomItems,
  euroSuffix,
  removeRoomUpgradeLabel,
  onRemoveItem
}) => {
  const allRoomItems = [...chooseYourRoomItems, ...chooseYourSuperiorRoomItems]
  
  // Don't render if no room items
  if (allRoomItems.length === 0) return null

  const sectionTitle = chooseYourSuperiorRoomItems.length > 0 
    ? 'Superior Room Selection' 
    : 'Room Selection'

  return (
    <section aria-labelledby="room-section-title" className="bg-muted/50 rounded-lg p-3 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 id="room-section-title" className="text-base font-semibold text-foreground">
          {sectionTitle}
        </h3>
      </div>
      {allRoomItems.map((item) => (
        <PricingItemComponent
          key={item.id}
          item={item}
          euroSuffix={euroSuffix}
          removeLabel={removeRoomUpgradeLabel}
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

RoomSection.displayName = 'RoomSection'

export default RoomSection
