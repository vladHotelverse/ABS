'use client'

import { Image as ImageIcon, Play, RotateCw } from 'lucide-react'
import type React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MediaTypeFilterProps {
  availableTypes: Array<'image' | 'video' | 'matterport'>
  selectedType: 'image' | 'video' | 'matterport' | null
  onTypeSelect: (type: 'image' | 'video' | 'matterport' | null) => void
}

const getMediaTypeLabel = (type: 'image' | 'video' | 'matterport'): string => {
  switch (type) {
    case 'matterport':
      return '360°'
    case 'video':
      return 'Video'
    case 'image':
      return 'Images'
  }
}

const getMediaTypeIcon = (type: 'image' | 'video' | 'matterport'): React.ReactNode => {
  switch (type) {
    case 'matterport':
      return <RotateCw className="h-4 w-4" />
    case 'video':
      return <Play className="h-4 w-4 fill-current" />
    case 'image':
      return <ImageIcon className="h-4 w-4" />
  }
}

const MediaTypeFilter: React.FC<MediaTypeFilterProps> = ({ availableTypes, selectedType, onTypeSelect }) => {
  // Only show filter if there are multiple media types
  if (availableTypes.length <= 1) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 border-border border-b bg-background/50 px-4 py-3 backdrop-blur-sm">
      {availableTypes.map((type) => (
        <Button
          key={type}
          variant={selectedType === type ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeSelect(selectedType === type ? null : type)}
          className={cn(
            'flex items-center gap-1.5 font-medium text-xs transition-all duration-200',
            selectedType === type
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'border-border/80 hover:border-primary/50 hover:bg-muted/50'
          )}
        >
          {getMediaTypeIcon(type)}
          <span>{getMediaTypeLabel(type)}</span>
        </Button>
      ))}
    </div>
  )
}

export default MediaTypeFilter
