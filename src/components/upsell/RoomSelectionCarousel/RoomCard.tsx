'use client'

import type React from 'react'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import ImageModal from './components/ImageModal'
import RoomCardDetailModal from './components/RoomCardDetailModal'
import RoomImageSection from './components/RoomImageSection'
import RoomInfoSection from './components/RoomInfoSection'
import { useImageModal } from './hooks/useImageModal'
import type { RoomCardProps } from './types'
import { flattenMultimedia } from './utils/multimedia'

const RoomCard: React.FC<RoomCardProps> = ({ room, translations, handlers, config = {}, state }) => {
  const { dynamicAmenities, enableHoverZoom = true } = config
  const { selectedRoom } = state

  // Custom hook manages both card detail modal and image gallery modal
  const {
    isCardDetailModalOpen,
    handleCardImageClick,
    handleCloseCardDetailModal,
    isImageModalOpen,
    currentImageIndex,
    handleImageClick,
    handleCloseModal,
  } = useImageModal(0)

  // Flatten multimedia for modal - component receives pre-selected URLs
  const mediaItems = useMemo(() => {
    return flattenMultimedia(room.multimedia, room.images)
  }, [room.multimedia, room.images])

  // Handler for image click in detail modal - opens gallery and closes detail
  const handleDetailImageClick = () => {
    handleImageClick()
    handleCloseCardDetailModal()
  }

  return (
    <>
      {/* Main Card */}
      <div
        className={cn(
          'cq-container relative ml-0.5 w-full max-w-md overflow-visible rounded-lg bg-card pb-2 shadow-depth-2 transition-all duration-300 hover:shadow-depth-3',
          {
            'ring-2 ring-emerald-500': selectedRoom?.id === room.id,
          }
        )}
      >
        {/* Room Image Section - Opens detail modal on click */}
        <RoomImageSection
          room={room}
          translations={translations}
          state={state}
          dynamicAmenities={dynamicAmenities}
          onImageClick={handleCardImageClick}
          enableHoverZoom={enableHoverZoom}
        />

        {/* Room Info Section */}
        <RoomInfoSection
          room={room}
          translations={translations}
          handlers={handlers || {}}
          config={config}
          state={state}
        />
      </div>

      {/* Card Detail Modal - Shows bigger card with image click opening gallery */}
      <RoomCardDetailModal
        room={room}
        translations={translations}
        handlers={handlers}
        config={config}
        state={state}
        isOpen={isCardDetailModalOpen}
        onClose={handleCloseCardDetailModal}
        onImageClick={handleDetailImageClick}
      />

      {/* Multimedia Modal - rendered at root level to persist when detail modal closes */}
      <ImageModal
        mediaItems={mediaItems}
        isOpen={isImageModalOpen}
        initialImageIndex={currentImageIndex}
        onClose={handleCloseModal}
        roomTitle={room.title || room.roomType}
      />
    </>
  )
}

export default RoomCard
