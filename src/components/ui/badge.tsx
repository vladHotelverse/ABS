import { type VariantProps, cva } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border border-neutral-100 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-700 dark:focus:ring-neutral-300',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-neutral-800 text-neutral-50 hover:bg-neutral-800/80 dark:bg-neutral-50 dark:text-neutral-800 dark:hover:bg-neutral-50/80',
        secondary:
          'border-transparent bg-neutral-50 text-neutral-800 hover:bg-neutral-50/80 dark:bg-neutral-700 dark:text-neutral-50 dark:hover:bg-neutral-700/80',
        destructive:
          'border-transparent bg-red-500 text-neutral-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/80',
        outline: 'text-neutral-950 dark:text-neutral-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
