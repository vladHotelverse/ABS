import type React from 'react'
import { Icon } from '@iconify/react'
import { AmenityIcon } from '../../ABS_RoomCustomization/utils/amenityIcons'
import type { OrderData } from '../../../services/orderStorage'

export interface SpecialOffersDisplayProps {
  orderData: OrderData
}

export const SpecialOffersDisplay: React.FC<SpecialOffersDisplayProps> = ({ orderData }) => {
  if (orderData.selections.offers.length === 0) {
    return null
  }

  // Get room amenities based on the room type
  const getRoomAmenities = (title: string): string[] => {
    switch (title) {
      case "Live luxury's pinnacle by the sea":
        return ['24 Hours Room Service', '30 to 35 m2 / 325 to 375 sqft', 'AC']
      case "Dive in from your private terrace":
        return ['24 Hours Room Service', '30 to 35 m2 / 325 to 375 sqft', 'Afternoon Sun']
      case "Supreme luxury with divine views":
        return ['60 to 70 m2 / 645 to 755 sqft', 'AC', 'Hydromassage Bathtub']
      case "Glam rock with infinite views":
        return ['60 to 70 m2 / 645 to 755 sqft', 'Coffee Machine', 'Hydromassage Bathtub']
      default:
        return ['Premium amenities included']
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Special Offers</h2>
      <div className="space-y-4">
        {orderData.selections.offers.map(offer => {
          // Use room title if available (for room-based special offers)
          let displayTitle = offer.title || offer.name
          
          // Map old package names to room titles for existing orders
          const titleMapping: Record<string, string> = {
            'Deluxe Experience Package': "Live luxury's pinnacle by the sea",
            'Premium Business Package': "Dive in from your private terrace", 
            'Romantic Getaway Package': "Supreme luxury with divine views",
            'Wellness & Spa Package': "Glam rock with infinite views"
          }
          
          if (titleMapping[displayTitle]) {
            displayTitle = titleMapping[displayTitle]
          }

          const roomAmenities = getRoomAmenities(displayTitle)

          return (
            <div key={offer.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Special Offer Badge */}
              <div className="bg-gray-800 text-white px-3 py-1 flex items-center gap-1.5">
                <Icon icon="solar:star-bold" className="w-4 h-4" />
                <span className="text-xs font-medium">Special Offer</span>
              </div>
              
              <div className="p-4">
                {/* Room Title */}
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{displayTitle}</h3>
                </div>

                {/* Room Amenities - Top 3 Most Relevant */}
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600 font-medium">Amenidades incluidas:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {roomAmenities.slice(0, 3).map((amenity, index) => (
                      <div key={`${offer.id}-amenity-${index}`} className="flex items-center gap-2">
                        <AmenityIcon amenity={amenity} className="w-5 h-5 text-gray-700 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price and Status */}
                <div className="flex items-center justify-between border-t pt-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Selected
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      +{offer.price.toFixed(2)}€ <span className="text-sm font-normal text-gray-600">per night</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}