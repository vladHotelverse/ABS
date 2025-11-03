import type React from 'react'
import { cn } from '@/lib/utils'

interface StoryWrapperProps {
  title: string
  children: React.ReactNode
  layout?: 'fullscreen' | 'padded' | 'centered'
  className?: string
  background?: 'default' | 'muted' | 'card'
}

export const StoryWrapper: React.FC<StoryWrapperProps> = ({
  title,
  children,
  layout = 'fullscreen',
  className,
  background = 'default',
}) => {
  const layoutClasses = {
    fullscreen: 'w-full h-full',
    padded: 'p-4 sm:p-6 lg:p-8',
    centered: 'flex items-center justify-center min-h-screen p-4',
  }

  const backgroundClasses = {
    default: 'bg-background',
    muted: 'bg-muted/20',
    card: 'bg-card',
  }

  return (
    <div
      className={cn('relative', layoutClasses[layout], backgroundClasses[background], className)}
      data-testid={`story-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {layout === 'centered' ? <div className="mx-auto w-full max-w-4xl">{children}</div> : children}
    </div>
  )
}
