import type React from 'react'
import type {
  RoomCardConfig,
  RoomCardHandlers,
  RoomCardState,
  RoomCardTranslations,
  RoomOption,
} from '@/components/upsell/RoomSelectionCarousel/types'
import RoomDetails from './RoomDetails'
import RoomPricing from './RoomPricing'

export interface RoomInfoSectionProps {
  room: RoomOption
  translations: RoomCardTranslations
  handlers: RoomCardHandlers
  config: RoomCardConfig
  state: RoomCardState
  showFullDescription?: boolean
  onSelectComplete?: () => void
}

const RoomInfoSection: React.FC<RoomInfoSectionProps> = ({
  room,
  translations,
  handlers,
  config,
  state,
  showFullDescription,
  onSelectComplete,
}) => {
  const { onSelectRoom } = handlers || {}
  const { currencySymbol = '€' } = config
  const { selectedRoom } = state

  const { nightText, priceInfoText, selectText, removeText, instantConfirmationText = '' } = translations

  const handleSelectRoom = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (!onSelectRoom) return
    // If the room is already selected, deselect it; otherwise, select it
    const isCurrentlySelected = selectedRoom?.id === room.id
    onSelectRoom(isCurrentlySelected ? null : room)
    // Close modal after selection
    onSelectComplete?.()
  }

  return (
    <>
      {/* Room Details */}
      <RoomDetails
        title={room.title}
        roomType={room.roomType}
        description={room.description}
        showFullDescription={showFullDescription}
      />

      {/* Room Pricing */}
      <RoomPricing
        price={room.price}
        oldPrice={room.oldPrice}
        currencySymbol={currencySymbol}
        nightText={nightText}
        isSelected={selectedRoom?.id === room.id}
        selectText={selectText}
        removeText={removeText}
        instantConfirmationText={instantConfirmationText}
        readonly={config.readonly || false}
        onSelect={handleSelectRoom}
      />

      {/* Additional Info */}
      <div className="mt-2 px-4">
        <p className="text-muted-foreground text-xs">{priceInfoText}</p>
      </div>
    </>
  )
}

export default RoomInfoSection
