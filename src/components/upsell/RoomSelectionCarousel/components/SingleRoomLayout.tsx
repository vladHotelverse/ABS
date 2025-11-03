import type React from 'react'
import RoomCard from '@/components/upsell/RoomSelectionCarousel/RoomCard'
import { cn } from '@/lib/utils'
import type { RoomCardProps } from '../types'

interface SingleRoomLayoutProps {
  className?: string
  roomCardPropsArray: RoomCardProps[]
}

export const SingleRoomLayout: React.FC<SingleRoomLayoutProps> = ({ className, roomCardPropsArray }) => {
  return (
    <div className={cn(className)}>
      <RoomCard {...roomCardPropsArray[0]} />
    </div>
  )
}
