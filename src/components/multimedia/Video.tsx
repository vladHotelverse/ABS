import type React from 'react'
import { cn } from '@/lib/utils'

export interface VideoProps {
  url: string
  className?: string
  aspectRatio?: '16/9' | '4/3' | null
  mobileAspectRatio?: '16/9' | '4/3' | null
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
}

const Video: React.FC<VideoProps> = ({
  url,
  className = '',
  aspectRatio = '16/9',
  mobileAspectRatio = aspectRatio,
  autoplay = false,
  muted = true,
  loop = false,
  controls = true,
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
      <video
        className={cn(
          'h-full w-full',
          aspectRatio ? 'absolute top-0 right-0 bottom-0 left-0 object-cover' : 'object-contain'
        )}
        src={url}
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline
      >
        <track kind="captions" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default Video
