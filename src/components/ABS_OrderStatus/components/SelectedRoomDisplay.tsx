import type React from 'react'
import { ABS_RoomSelectionCarousel } from '../../ABS_RoomSelectionCarousel'
import type { OrderData } from '../../../services/orderStorage'

export interface SelectedRoomDisplayProps {
  orderData: OrderData
}

export const SelectedRoomDisplay: React.FC<SelectedRoomDisplayProps> = ({ orderData }) => {
  if (!orderData.selections.room) {
    return null
  }

  const roomWithImages = {
    ...orderData.selections.room,
    images: orderData.selections.room.images || [orderData.selections.room.image]
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Selected Room</h2>
      <div className="order-consultation-mode [&_button]:hidden [&_.room-select-button]:hidden [&_.make-offer-button]:hidden [&_.bid-controls]:hidden [&_[role=button]]:pointer-events-none">
        <ABS_RoomSelectionCarousel
          roomOptions={[roomWithImages]}
          initialSelectedRoom={roomWithImages}
          showPriceSlider={false}
          currentRoomType={orderData.userInfo.roomType}
          mode="consultation"
          readonly={true}
          onRoomSelected={() => {}} // Disabled in consultation mode
          translations={{
            learnMoreText: 'Learn More',
            nightText: '/night',
            priceInfoText: 'Price includes all taxes and fees',
            selectedText: 'SELECTED',
            selectText: 'SELECTED',
            currencySymbol: '€',
            discountBadgeText: '-{percentage}%',
            noRoomsAvailableText: 'No rooms available',
            makeOfferText: 'Make Offer',
            availabilityText: 'Subject to availability',
            proposePriceText: 'Propose your price:',
            currencyText: 'EUR',
            offerMadeText: 'You have proposed {price} EUR per night',
            bidSubmittedText: 'Bid submitted',
            updateBidText: 'Update bid',
            cancelBidText: 'Cancel',
            navigationLabels: {
              previousRoom: 'Previous room',
              nextRoom: 'Next room',
              previousRoomMobile: 'Previous room (mobile)',
              nextRoomMobile: 'Next room (mobile)',
              goToRoom: 'Go to room {index}',
              previousImage: 'Previous image',
              nextImage: 'Next image',
              viewImage: 'View image {index}',
            }
          }}
        />
      </div>
    </div>
  )
}