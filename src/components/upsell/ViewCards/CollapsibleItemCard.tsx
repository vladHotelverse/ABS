'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface ItemDetail {
  label: string
  value: string
}

export interface CollapsibleItemCardProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  price: string
  priceColor?: 'green' | 'blue' | 'gray'
  badge?: string
  badgeVariant?: 'default' | 'success' | 'info'
  details?: ItemDetail[]
  chips?: string[]
  included?: boolean
  defaultExpanded?: boolean
}

const priceColorClasses = {
  green: 'text-emerald-600',
  blue: 'text-blue-600',
  gray: 'text-muted-foreground',
}

export const CollapsibleItemCard = ({
  icon,
  title,
  subtitle,
  price,
  priceColor = 'green',
  badge,
  badgeVariant = 'default',
  details = [],
  chips = [],
  included = false,
  defaultExpanded = false,
}: CollapsibleItemCardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const hasExpandableContent = details.length > 0 || chips.length > 0

  return (
    <div className="rounded-lg border border-gray-200 bg-white transition-all hover:border-gray-300">
      {/* Collapsed Summary Line */}
      <button
        onClick={() => hasExpandableContent && setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 text-left transition-colors hover:bg-gray-50/50"
        disabled={!hasExpandableContent}
        type="button"
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
            {icon}
          </div>

          {/* Title & Subtitle */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground text-sm">{title}</span>
              {badge && (
                <Badge
                  variant={badgeVariant === 'success' ? 'default' : 'outline'}
                  className={`text-xs ${
                    badgeVariant === 'info'
                      ? 'border-blue-300 bg-blue-50 text-blue-700'
                      : badgeVariant === 'success'
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                        : ''
                  }`}
                >
                  {badge}
                </Badge>
              )}
            </div>
            {subtitle && <p className="text-muted-foreground text-xs">{subtitle}</p>}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className={`font-semibold text-sm ${priceColorClasses[priceColor]}`}>
              {included ? 'Included' : price}
            </span>
            {hasExpandableContent && (
              <div className="text-gray-400">
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            )}
          </div>
        </div>
      </button>

      {/* Expanded Details */}
      {isExpanded && hasExpandableContent && (
        <div className="border-gray-100 border-t bg-gray-50/30 px-4 pb-3 pt-3">
          {/* 2-Column Spec Table */}
          {details.length > 0 && (
            <div className="mb-3 grid grid-cols-[120px_1fr] gap-x-4 gap-y-2 text-sm">
              {details.map((detail, index) => (
                <div key={index} className="contents">
                  <span className="font-medium text-muted-foreground">{detail.label}</span>
                  <span className="text-foreground">{detail.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Chips/Tags */}
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {chips.map((chip, index) => (
                <Badge key={index} variant="outline" className="rounded-full text-xs">
                  {chip}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
