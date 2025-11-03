'use client'

import type React from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { RoomCardProps } from '../types'
import RoomImageSection from './RoomImageSection'
import RoomInfoSection from './RoomInfoSection'

interface RoomCardDetailModalProps extends Omit<RoomCardProps, 'handlers'> {
  isOpen: boolean
  onClose: () => void
  onImageClick: () => void
  handlers?: RoomCardProps['handlers']
}

const RoomCardDetailModal: React.FC<RoomCardDetailModalProps> = ({
  room,
  translations,
  handlers,
  config = {},
  state,
  isOpen,
  onClose,
  onImageClick,
}) => {
  const { selectedRoom } = state

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="z-[102] max-h-[90vh] max-w-2xl overflow-y-auto border border-border bg-card p-0">
        <DialogTitle className="sr-only">{room.title || room.roomType}</DialogTitle>
        <div
          className={cn(
            'relative w-full overflow-visible rounded-lg bg-card shadow-depth-2 transition-all duration-300',
            {
              'ring-2 ring-emerald-500': selectedRoom?.id === room.id,
            }
          )}
        >
          {/* Room Image Section */}
          <RoomImageSection room={room} translations={translations} state={state} onImageClick={onImageClick} />

          {/* Room Info Section */}
          <div className="pb-2">
            <RoomInfoSection
              room={room}
              translations={translations}
              handlers={handlers || {}}
              config={config}
              state={state}
              showFullDescription={true}
              onSelectComplete={onClose}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RoomCardDetailModal
