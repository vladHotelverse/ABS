import type React from 'react'
import { cn } from '../../lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'text' | 'avatar' | 'card' | 'button'
  className?: string
}

function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  const variantClasses = {
    default: 'rounded bg-neutral-50 dark:bg-neutral-700',
    text: 'rounded bg-neutral-50 dark:bg-neutral-700 h-4',
    avatar: 'rounded-full bg-neutral-50 dark:bg-neutral-700 w-10 h-10',
    card: 'rounded-lg bg-neutral-50 dark:bg-neutral-700',
    button: 'rounded-md bg-neutral-50 dark:bg-neutral-700 h-10',
  }

  return (
    <div 
      className={cn('animate-pulse', variantClasses[variant], className)} 
      {...props} 
    />
  )
}

// Skeleton composition components for common patterns
const SkeletonText = ({ lines = 1, className, ...props }: { lines?: number } & SkeletonProps) => (
  <div className={cn('space-y-2', className)} {...props}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} variant="text" className={cn(i === lines - 1 ? 'w-3/4' : 'w-full')} />
    ))}
  </div>
)

const SkeletonCard = ({ className, ...props }: SkeletonProps) => (
  <div className={cn('space-y-3', className)} {...props}>
    <Skeleton variant="card" className="h-48" />
    <div className="space-y-2">
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
  </div>
)

const SkeletonAvatar = ({ className, ...props }: SkeletonProps) => (
  <div className={cn('flex items-center space-x-3', className)} {...props}>
    <Skeleton variant="avatar" />
    <div className="space-y-2">
      <Skeleton variant="text" className="w-24" />
      <Skeleton variant="text" className="w-16" />
    </div>
  </div>
)

export { Skeleton, SkeletonText, SkeletonCard, SkeletonAvatar }
