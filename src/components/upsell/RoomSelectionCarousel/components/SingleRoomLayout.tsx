import type React from 'react'
import RoomCard from '@/components/upsell/RoomSelectionCarousel/RoomCard'
import { cn } from '@/lib/utils'

interface SingleRoomLayoutProps {
  className?: string
  roomCardPropsArray: any[]
}

export const SingleRoomLayout: React.FC<SingleRoomLayoutProps> = ({ className, roomCardPropsArray }) => {
  return (
    <div className={cn(className)}>
      <RoomCard {...roomCardPropsArray[0]} />
    </div>
  )
}
