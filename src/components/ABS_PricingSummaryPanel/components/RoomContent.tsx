import type React from 'react'
import { memo } from 'react'
import type { MultiBookingLabels, RoomBooking } from '../MultiBookingPricingSummaryPanel'
import type { PricingItem } from '../types'
import ItemSection from './ItemSection'
// import PriceChangeIndicator from './PriceChangeIndicator'

interface RoomContentProps {
  room: RoomBooking
  labels: MultiBookingLabels
  removingItems: Set<string>
  formatCurrency: (price: number) => string
  onRemoveItem: (roomId: string, itemId: string | number, itemName: string, itemType: PricingItem['type']) => void
}

const RoomContent: React.FC<RoomContentProps> = memo(
  ({ room, labels, removingItems, formatCurrency, onRemoveItem }) => {
    // Group items by concept instead of type
    const chooseYourRoomItems = room.items.filter((item) => item.concept === 'choose-your-room')
    const chooseYourSuperiorRoomItems = room.items.filter((item) => item.concept === 'choose-your-superior-room')
    const customizeYourRoomItems = room.items.filter((item) => item.concept === 'customize-your-room')
    const enhanceYourStayItems = room.items.filter((item) => item.concept === 'enhance-your-stay')
    const bidForUpgradeItems = room.items.filter((item) => item.concept === 'bid-for-upgrade')
    const total = room.items.reduce((sum, item) => sum + item.price, 0)

    return (
      <div className="border-t border-gray-100 bg-white">
        {/* Room image */}
        {/* <div className="w-full h-40 overflow-hidden relative">
          <img
            src={room.roomImage || '/hotel-room.png'}
            alt={labels.roomImageAltText}
            className="w-full h-full object-cover"
          />
          {room.items.some((item: any) => item.isUpgraded) && (
            <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Upgraded
            </div>
          )}
        </div> */}

        {/* Content */}
        <div className="p-4 space-y-4">
          {total === 0 ? (
            /* Empty State */
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No selections made for this room yet.</p>
              <p className="text-xs mt-1">Add upgrades or customizations to see them here.</p>
            </div>
          ) : (
            <>
              {/* Choose Your Room Section */}
              {chooseYourRoomItems.length > 0 && (
                <ItemSection
                  title="Room Selection"
                  items={chooseYourRoomItems}
                  emptyMessage="No room selected"
                  removingItems={removingItems}
                  labels={labels}
                  roomId={room.id}
                  onRemoveItem={onRemoveItem}
                />
              )}

              {/* Choose Your Superior Room Section */}
              {chooseYourSuperiorRoomItems.length > 0 && (
                <ItemSection
                  title={chooseYourSuperiorRoomItems.some((item: any) => item.isUpgraded) ? "Room Upgrade" : "Superior Room Selection"}
                  items={chooseYourSuperiorRoomItems}
                  emptyMessage="No superior room selected"
                  removingItems={removingItems}
                  labels={labels}
                  roomId={room.id}
                  onRemoveItem={onRemoveItem}
                />
              )}

              {/* Customize Your Room Section */}
              {customizeYourRoomItems.length > 0 && (
                <ItemSection
                  title="Room Customization"
                  items={customizeYourRoomItems}
                  emptyMessage="No customizations selected"
                  removingItems={removingItems}
                  labels={labels}
                  roomId={room.id}
                  onRemoveItem={onRemoveItem}
                />
              )}

              {/* Enhance Your Stay Section */}
              {enhanceYourStayItems.length > 0 && (
                <ItemSection
                  title="Stay Enhancement"
                  items={enhanceYourStayItems}
                  emptyMessage="No enhancements selected"
                  removingItems={removingItems}
                  labels={labels}
                  roomId={room.id}
                  onRemoveItem={onRemoveItem}
                />
              )}

              {/* Bid for Upgrade Section */}
              {bidForUpgradeItems.length > 0 && (
                <ItemSection
                  title="Bid for Upgrade"
                  items={bidForUpgradeItems}
                  emptyMessage="No bids submitted"
                  removingItems={removingItems}
                  labels={labels}
                  roomId={room.id}
                  onRemoveItem={onRemoveItem}
                />
              )}

              {/* Room Total - Only show when there are selections */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">{labels.roomTotalLabel}</span>
                  <span className="text-base font-bold text-gray-900">{formatCurrency(total)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }
)

RoomContent.displayName = 'RoomContent'

export default RoomContent
