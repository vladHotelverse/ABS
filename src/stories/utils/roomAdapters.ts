import type { RoomOption } from '@/components/upsell/RoomSelectionCarousel/types'

export const adaptRoomsForCarousel = (rooms: RoomOption[]): RoomOption[] =>
  rooms.map((room) => ({
    ...room,
    price: typeof room.price === 'number' ? room.price.toFixed(0) : room.price,
    multimedia: room.images
      ? {
          images: room.images.map((url) => ({ url })),
          videos: [],
        }
      : room.multimedia,
  }))
