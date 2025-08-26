import type React from 'react'
import { cn } from '@/lib/utils'

export interface LoadingOverlayProps {
  isLoading: boolean
  loadingLabel?: string
  className?: string
  variant?: 'default' | 'subtle' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  loadingLabel = 'Loading...',
  className,
  variant = 'default',
  size = 'md',
  showLabel = true,
}) => {
  if (!isLoading) return null

  const variantClasses = {
    default: 'bg-white bg-opacity-75',
    subtle: 'bg-white bg-opacity-50',
    dark: 'bg-black bg-opacity-50',
  }

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const spinnerClasses = cn(
    'animate-spin border-t-2 border-b-2 border-blue-500 rounded-full',
    sizeClasses[size]
  )

  return (
    <output
      className={cn(
        'absolute inset-0 flex items-center justify-center z-10',
        variantClasses[variant],
        className
      )}
      aria-live="polite"
      aria-label={loadingLabel}
    >
      <div className="flex items-center space-x-2">
        <div className={spinnerClasses} aria-hidden="true" />
        {showLabel && (
          <span className={cn('text-gray-700', textSizeClasses[size])}>
            {loadingLabel}
          </span>
        )}
      </div>
    </output>
  )
}

export { LoadingOverlay }