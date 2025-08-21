import clsx from 'clsx'
import type React from 'react'
import { RoomCard } from '../components'

interface SingleRoomLayoutProps {
  title?: string
  subtitle?: string
  className?: string
  roomCardPropsArray: any[]
}

export const SingleRoomLayout: React.FC<SingleRoomLayoutProps> = ({
  title,
  subtitle,
  className,
  roomCardPropsArray,
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

      <div className="flex justify-center">
        <RoomCard {...roomCardPropsArray[0]} />
      </div>
    </div>
  )
}