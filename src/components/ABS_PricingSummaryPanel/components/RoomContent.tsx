import type React from 'react'
import { memo } from 'react'
import type { MultiBookingLabels, RoomBooking } from '../MultiBookingPricingSummaryPanel'
import type { PricingItem } from '../types'
import ItemSection from './ItemSection'
import PriceChangeIndicator from './PriceChangeIndicator'

interface RoomContentProps {
  room: RoomBooking
  labels: MultiBookingLabels
  removingItems: Set<string>
  formatCurrency: (price: number) => string
  onRemoveItem: (roomId: string, itemId: string | number, itemName: string, itemType: PricingItem['type']) => void
}

const RoomContent: React.FC<RoomContentProps> = memo(
  ({ room, labels, removingItems, formatCurrency, onRemoveItem }) => {
    const roomItems = room.items.filter((item) => item.type === 'room')
    const upgradeItems = room.items.filter((item) => item.type === 'customization')
    const offerItems = room.items.filter((item) => item.type === 'offer')
    const total = room.items.reduce((sum, item) => sum + item.price, 0)

    return (
      <div className="border-t border-gray-100 bg-white">
        {/* Room image */}
        <div className="w-full h-40 overflow-hidden">
          <img
            src={room.roomImage || '/hotel-room.png'}
            alt={labels.roomImageAltText}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Selected Room Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">{labels.selectedRoomLabel}</h3>
            </div>
            {roomItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-900">{item.name}</span>
                <PriceChangeIndicator price={item.price} euroSuffix={labels.euroSuffix} />
              </div>
            ))}
          </div>

          {/* Upgrades Section */}
          <ItemSection
            title={labels.upgradesLabel}
            items={upgradeItems}
            emptyMessage={labels.noUpgradesSelectedLabel}
            removingItems={removingItems}
            labels={labels}
            roomId={room.id}
            onRemoveItem={onRemoveItem}
          />

          {/* Special Offers Section */}
          <ItemSection
            title={labels.specialOffersLabel}
            items={offerItems}
            emptyMessage={labels.noOffersSelectedLabel}
            removingItems={removingItems}
            labels={labels}
            roomId={room.id}
            onRemoveItem={onRemoveItem}
          />

          {/* Room Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">{labels.roomTotalLabel}</span>
              <span className="text-base font-bold text-gray-900">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

RoomContent.displayName = 'RoomContent'

export default RoomContent
