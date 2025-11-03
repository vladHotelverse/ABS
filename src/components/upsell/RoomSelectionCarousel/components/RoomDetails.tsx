import * as React from 'react'
import { HtmlToTextParser } from '@/components/upsell/HtmlToTextParser'
import { TruncatedTooltip } from '@/components/upsell/truncated-tooltip'
import { cn } from '@/lib/utils'

export interface RoomDetailsProps {
  title?: string
  roomType: string
  description: string | React.ReactNode
  showFullDescription?: boolean
}

const RoomDetails: React.FC<RoomDetailsProps> = ({ title, roomType, description, showFullDescription = false }) => {
  // Parse HTML description once to avoid re-parsing in both branches
  // If description is already parsed React nodes, use as-is; if string, parse it
  const parsedDescription = React.useMemo(() => {
    if (typeof description === 'string') {
      return <HtmlToTextParser htmlContent={description} />
    }
    return description
  }, [description])

  return (
    <div className="px-4 pt-2">
      {title && (
        <h3
          className="mb-1 font-bold leading-tight"
          style={{
            fontSize: 'clamp(1rem, 4vw, 1.25rem)',
            lineHeight: '1.2',
          }}
        >
          {title}
        </h3>
      )}
      {roomType && title !== roomType && (
        <h4
          className={cn('mb-1 font-medium text-muted-foreground', {
            'text-base': !title,
            'text-sm': title,
          })}
        >
          {roomType}
        </h4>
      )}
      <div className="mb-2">
        {showFullDescription ? (
          <div className="text-sm">{parsedDescription}</div>
        ) : (
          <TruncatedTooltip htmlContent={parsedDescription} triggerClassName="line-clamp-2 min-h-10 text-sm" />
        )}
      </div>
    </div>
  )
}

export default RoomDetails
