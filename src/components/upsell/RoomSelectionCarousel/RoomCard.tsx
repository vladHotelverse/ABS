'use client'

import type React from 'react'
import { cn } from '@/lib/utils'
import ImageModal from './components/ImageModal'
import RoomCardDetailModal from './components/RoomCardDetailModal'
import RoomImageSection from './components/RoomImageSection'
import RoomInfoSection from './components/RoomInfoSection'
import { useModalStateMachine } from './hooks/useModalStateMachine'
import type { RoomCardProps } from './types'

const RoomCard: React.FC<RoomCardProps> = ({ room, translations, handlers, config = {}, state }) => {
  const { selectedRoom } = state

  // State machine for managing modal interactions
  const {
    isDetailModalOpen,
    isGalleryModalOpen,
    currentImageIndex,
    openDetailModal,
    closeDetailModal,
    openGalleryModal,
    closeGalleryModal,
  } = useModalStateMachine()

  // Use pre-flattened mediaItems from room data
  const mediaItems = room.mediaItems || []

  // Handler for image click in detail modal - opens gallery modal
  const handleDetailImageClick = () => {
    openGalleryModal(currentImageIndex)
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
        <RoomImageSection room={room} translations={translations} state={state} onImageClick={openDetailModal} />

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
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        onImageClick={handleDetailImageClick}
      />

      {/* Multimedia Modal - rendered at root level to persist when detail modal closes */}
      <ImageModal
        mediaItems={mediaItems}
        isOpen={isGalleryModalOpen}
        initialImageIndex={currentImageIndex}
        onClose={closeGalleryModal}
        roomTitle={room.title || room.roomType}
      />
    </>
  )
}

export default RoomCard
