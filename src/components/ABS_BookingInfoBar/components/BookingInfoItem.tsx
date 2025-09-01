import clsx from 'clsx'
import type React from 'react'

export interface BookingInfoItemProps {
  icon: React.ReactNode
  label: string
  value: string | React.ReactNode
  className?: string
}

const BookingInfoItem: React.FC<BookingInfoItemProps> = ({ icon, label, value, className }) => {
  return (
    <div className={clsx('flex flex-col min-w-0 gap-1', className)}>
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex-shrink-0">{icon}</div>
        <span className="text-sm font-medium text-muted-foreground truncate">{label}</span>
      </div>
      <div className={clsx(
        'text-card-foreground font-semibold text-sm sm:text-base',
        'break-words min-h-[1.25rem] leading-tight',
        // Better mobile text handling - allow wrapping instead of truncating
        'hyphens-auto'
      )}>
        {value}
      </div>
    </div>
  )
}

export default BookingInfoItem
