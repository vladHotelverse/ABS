import type React from 'react'
import clsx from 'clsx'
import { RoomCard } from '../components'
import type { RoomCardProps } from '../types'

export interface SingleRoomLayoutProps {
  className?: string
  title?: string
  subtitle?: string
  roomCardProps: RoomCardProps
}

const SingleRoomLayout: React.FC<SingleRoomLayoutProps> = ({
  className,
  title,
  subtitle,
  roomCardProps,
}) => {
  return (
    <div className={clsx(className)}>
      {/* Title and Subtitle */}
      {(title || subtitle) && (
        <div className="mb-6 text-center">
          {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
          {subtitle && <p className="text-neutral-600">{subtitle}</p>}
        </div>
      )}

      <div className="w-full max-w-md">
        <RoomCard {...roomCardProps} />
      </div>
    </div>
  )
}

export default SingleRoomLayout