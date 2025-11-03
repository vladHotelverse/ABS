import * as React from 'react'

import { cn } from '@/lib/utils'

interface EnhancedFormContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  children: React.ReactNode
}

const EnhancedFormContainer = React.forwardRef<HTMLDivElement, EnhancedFormContainerProps>(
  ({ title, description, children, className, ...props }, ref) => (
    <div className="container relative mx-auto w-full px-3 py-4 md:px-4">
      <div
        ref={ref}
        className={cn(
          'max-w-lg rounded-lg border bg-white p-4 shadow-xl ring-primary-foreground md:p-6 lg:p-8',
          className
        )}
        {...props}
      >
        <div className="fade-in slide-in-from-bottom-3 animation-delay-100 mb-6 animate-in space-y-3 border-border border-b pb-4 duration-500 ease-out">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-bold text-2xl text-foreground leading-tight sm:text-2xl">{title}</h1>
          </div>
          {description && <p className="text-base text-muted-foreground leading-relaxed">{description}</p>}
        </div>
        <div className="animation-delay-150 fade-in slide-in-from-bottom-2 animate-in duration-500 ease-out">
          {children}
        </div>
      </div>
    </div>
  )
)

export { EnhancedFormContainer }
