import type React from 'react'
import { cn } from '@/lib/utils'

export interface MatterportProps {
  url: string
  className?: string
  aspectRatio?: '16/9' | '4/3' | null
  mobileAspectRatio?: '16/9' | '4/3' | null
}

const Matterport: React.FC<MatterportProps> = ({
  url,
  className = '',
  aspectRatio = '16/9',
  mobileAspectRatio = aspectRatio,
}) => {
  const aspectRatioClass = {
    '16/9': 'md:aspect-video',
    '4/3': 'md:aspect-4/3',
  }

  const mobileAspectRatioClass = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-4/3',
  }

  return (
    <div
      className={cn(
        'relative',
        aspectRatio && aspectRatioClass[aspectRatio],
        mobileAspectRatio && mobileAspectRatioClass[mobileAspectRatio],
        className
      )}
    >
      <iframe
        title="Matterport 360° View"
        className={cn('h-full w-full', aspectRatio && 'absolute top-0 right-0 bottom-0 left-0')}
        src={url}
        frameBorder={0}
        allow="fullscreen; xr-spatial-tracking"
        allowFullScreen
      />
    </div>
  )
}

export default Matterport
