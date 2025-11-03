'use client'

import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TooltipProvider, UiTooltip, UiTooltipContent, UiTooltipTrigger } from '@/components/ui/tooltip'
import { TruncatedTooltip } from '@/components/upsell/truncated-tooltip'
import { cn } from '@/lib/utils'

interface AttributeCardProps {
  attribute: {
    id: number
    name: string
    description?: string
    icon: string
    amount?: number
  }
  isSelected: boolean
  disabled: boolean
  onToggle?: () => void
  originalPrice: number
  displayCurrency: string
  readonly?: boolean
}

const AttributeCard: React.FC<AttributeCardProps> = ({
  attribute,
  isSelected,
  disabled,
  onToggle,
  originalPrice,
  displayCurrency,
  readonly = false,
}) => {
  const [imageError, setImageError] = useState(false)

  const cardContent = (
    <li
      key={attribute.id}
      className={cn(
        'relative space-y-3 rounded-lg bg-white p-3 shadow-sm ring-1 ring-border/40 transition-all duration-200 sm:p-4',
        disabled && !readonly && 'cursor-not-allowed opacity-50',
        isSelected && 'ring-2 ring-emerald-500',
        !disabled && !readonly && 'hover:shadow-md'
      )}
    >
      {/* Selected badge */}
      {isSelected && !disabled && !readonly && (
        <div className="-top-4 absolute left-4 z-10 flex items-center gap-1 rounded-xl bg-emerald-600 px-2 py-1 text-white text-xs shadow">
          <Icon icon="solar:check-circle-bold" className="h-3 w-3" />
          Selected
        </div>
      )}

      {/* Icon, Title and Button */}
      <section className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/20 sm:h-14 sm:w-14 dark:bg-white/75">
            {imageError ? (
              <Icon icon="solar:check-circle" className="h-10 w-10 text-primary sm:h-12 sm:w-12" />
            ) : (
              <img
                width={56}
                height={56}
                src={attribute.icon}
                alt={attribute.name}
                className="h-10 w-10 object-contain sm:h-12 sm:w-12"
                onError={() => setImageError(true)}
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="line-clamp-2 font-semibold text-card-foreground text-sm leading-tight sm:text-base">
              {attribute.name}
            </h5>
            {attribute.description && (
              <TruncatedTooltip triggerClassName="mt-1 line-clamp-2 text-muted-foreground text-xs min-h-0">
                {attribute.description.length > 55 ? `${attribute.description.slice(0, 55)}…` : attribute.description}
              </TruncatedTooltip>
            )}
          </div>
        </div>
        {!readonly && (
          <Button
            disabled={disabled}
            onClick={onToggle}
            className={clsx('h-7 flex-shrink-0 px-3 text-xs transition-all', {
              'hover:bg-primary hover:text-primary-foreground': !isSelected && !disabled,
            })}
            variant={isSelected ? 'destructive' : 'default'}
            size="sm"
          >
            {isSelected ? 'Remove' : disabled ? 'N/A' : 'Add'}
          </Button>
        )}
      </section>

      {/* Enhanced price display */}
      <div className={clsx('flex justify-between gap-3', { 'text-muted-foreground': disabled })}>
        <div className="flex flex-1 flex-wrap items-baseline gap-2">
          <span className="font-bold text-card-foreground text-lg sm:text-xl">{originalPrice.toFixed(2)}</span>
          <span className="text-muted-foreground text-xs sm:text-sm">{displayCurrency}/night</span>
        </div>
      </div>
    </li>
  )

  // Wrap with tooltip if disabled
  if (disabled) {
    return (
      <TooltipProvider>
        <UiTooltip>
          <UiTooltipTrigger asChild>{cardContent}</UiTooltipTrigger>
          <UiTooltipContent>
            <p>This attribute is currently unavailable</p>
          </UiTooltipContent>
        </UiTooltip>
      </TooltipProvider>
    )
  }

  return cardContent
}

export default AttributeCard
