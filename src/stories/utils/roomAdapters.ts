import { MediaType, type RoomOption } from '@/components/upsell/RoomSelectionCarousel/types'

export const adaptRoomsForCarousel = (rooms: RoomOption[]): RoomOption[] =>
  rooms.map((room) => ({
    ...room,
    price: typeof room.price === 'number' ? room.price.toFixed(0) : room.price,
    displayAmenities: room.displayAmenities ?? room.amenities?.slice(0, 3),
    multimedia: room.images
      ? {
          images: room.images.map((url) => ({ url })),
          videos: [],
        }
      : room.multimedia,
    mediaItems:
      room.mediaItems && room.mediaItems.length
        ? room.mediaItems
        : room.images?.map((url) => ({ type: MediaType.Image, url })) ??
          room.multimedia?.images?.map(({ url, thumbnailUrl }) => ({
            type: MediaType.Image as const,
            url,
            thumbnailUrl,
          })) ??
          [],
  }))
