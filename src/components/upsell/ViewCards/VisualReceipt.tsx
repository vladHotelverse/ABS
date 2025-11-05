'use client'

import { Separator } from '@/components/ui/separator'

export interface ReceiptLineItem {
  id: string
  label: string
  price: string
  included?: boolean
  highlight?: boolean
}

export interface VisualReceiptProps {
  items: ReceiptLineItem[]
  totalLabel: string
  totalAmount: string
  className?: string
  showSavings?: boolean
  savingsAmount?: string
}

export const VisualReceipt = ({
  items,
  totalLabel,
  totalAmount,
  className = '',
  showSavings = false,
  savingsAmount,
}: VisualReceiptProps) => {
  return (
    <div className={`rounded-lg border border-gray-200 bg-gradient-to-b from-white to-gray-50/50 p-4 ${className}`}>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-foreground text-sm">Price Breakdown</h3>
        {showSavings && savingsAmount && (
          <span className="font-medium text-emerald-600 text-xs">Saved {savingsAmount}</span>
        )}
      </div>

      <Separator className="mb-3" />

      {/* Line Items */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-start justify-between text-sm ${
              item.highlight ? 'font-medium text-foreground' : 'text-muted-foreground'
            }`}
          >
            <span className="flex-1 pr-2">{item.label}</span>
            <span className={`font-semibold ${item.included ? 'text-emerald-600' : 'text-foreground'}`}>
              {item.included ? 'Included' : item.price}
            </span>
          </div>
        ))}
      </div>

      <Separator className="my-3" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-foreground">{totalLabel}</span>
        <span className="font-bold text-xl text-foreground">{totalAmount}</span>
      </div>
    </div>
  )
}
