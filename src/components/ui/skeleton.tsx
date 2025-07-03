import type React from 'react'
import { cn } from '../../lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded bg-neutral-50 dark:bg-neutral-700', className)} {...props} />
}

export { Skeleton }
