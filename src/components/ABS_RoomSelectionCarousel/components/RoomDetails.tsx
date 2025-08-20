import type React from 'react'
import clsx from 'clsx'
import { useState, useRef, useEffect } from 'react'
import { UiTooltip, UiTooltipContent, UiTooltipTrigger, TooltipProvider } from '../../ui/tooltip'

export interface RoomDetailsProps {
  title?: string
  roomType: string
  description: string
}

const RoomDetails: React.FC<RoomDetailsProps> = ({
  title,
  roomType,
  description,
}) => {
  const [isDescriptionTruncated, setIsDescriptionTruncated] = useState(false)
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  // Check if description needs truncation
  useEffect(() => {
    if (descriptionRef.current) {
      const element = descriptionRef.current
      setIsDescriptionTruncated(element.scrollHeight > element.clientHeight)
    }
  }, [description])

  return (
    <div className="p-4">
      {title && (
        <h3 className="text-xl font-bold mb-1">{title}</h3>
      )}
      <h4 className={clsx('font-medium mb-1 text-neutral-600', {
        'text-base': !title,
        'text-sm': title
      })}>
        {roomType}
      </h4>
      <div className="mb-2">
        <TooltipProvider>
          <UiTooltip>
            <UiTooltipTrigger asChild>
              <p
                ref={descriptionRef}
                className="text-sm min-h-10 overflow-hidden line-clamp-2 cursor-help"
                style={{ maxHeight: '2.5rem' }}
              >
                {description}
              </p>
            </UiTooltipTrigger>
            {isDescriptionTruncated && (
              <UiTooltipContent className="max-w-xs">
                <p className="text-sm">{description}</p>
              </UiTooltipContent>
            )}
          </UiTooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

export default RoomDetails