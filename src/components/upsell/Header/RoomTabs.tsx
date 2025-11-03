'use client'

import type React from 'react'
import { cn } from '@/lib/utils'

interface RoomTab {
  id: string
  roomName?: string
  roomNumber: number
  guestName?: string
  baseRoomRoomType?: string
}

interface RoomTabsProps {
  roomTabs: RoomTab[]
  activeRoomId: string
  onRoomTabClick: (roomId: string) => void
  isSticky?: boolean
  className?: string
}

export const RoomTabs: React.FC<RoomTabsProps> = ({
  roomTabs,
  activeRoomId,
  onRoomTabClick,
  isSticky = false,
  className,
}) => {
  return (
    <div className={cn('w-full bg-background', isSticky && 'sticky top-0 z-10', className)}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex gap-4 overflow-x-auto">
          {roomTabs.map((room) => (
            <button
              key={room.id}
              onClick={() => onRoomTabClick(room.id)}
              className={cn(
                'flex-shrink-0 rounded-lg px-4 py-2 font-medium text-sm transition-colors',
                activeRoomId === room.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              Room {room.roomNumber}
              {room.guestName && ` - ${room.guestName}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RoomTabs
