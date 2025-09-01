import clsx from 'clsx'
import type React from 'react'
import type { RoomBookingInfo, MultiBookingInfoLabels } from '../types'
interface RoomHeaderProps {
  room: RoomBookingInfo
  isSelected: boolean
  labels?: MultiBookingInfoLabels
  isMobile?: boolean
  testId?: string
}

export const RoomHeader: React.FC<RoomHeaderProps> = ({
  room,
  isSelected,
  labels,
  isMobile = false,
}) => {
  const imageClassName = isMobile
    ? 'w-8 h-8 rounded-lg object-cover flex-shrink-0'
    : 'w-10 h-10 rounded-lg object-cover flex-shrink-0'
  const badgeClassName = isMobile
    ? 'inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary flex-shrink-0'
    : 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary flex-shrink-0 ml-2'

  return (
    <section className='flex items-start justify-between'>
      <div className="flex items-center gap-3 min-w-0 w-full">
        {room.roomImage && <img src={room.roomImage} alt={`${room.roomName} room`} className={imageClassName} />}
        <div className="flex-1 min-w-0 overflow-hidden">
          <h5 className={clsx('font-bold text-card-foreground truncate flex-1 min-w-0', isMobile ? 'text-sm' : 'text-base')}>
            {room.roomName}
          </h5>
          <div className={clsx('text-muted-foreground truncate', isMobile ? 'text-xs' : 'text-sm')}>{room.guestName}</div>
        </div>
      </div>
      {isSelected && <span className={badgeClassName}>{labels?.selectionLabel || 'Selected'}</span>}
    </section>

  )
}
