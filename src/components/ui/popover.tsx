import * as PopoverPrimitive from '@radix-ui/react-popover'
import * as React from 'react'

import { cn } from '../../lib/utils'

const UiPopover = PopoverPrimitive.Root

const UiPopoverTrigger = PopoverPrimitive.Trigger

const UiPopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    portalClassName?: string
    hasPortal?: boolean
    portalContainer?: HTMLElement
  }
>(
  (
    { className, portalClassName, align = 'center', sideOffset = 4, hasPortal = true, portalContainer, ...props },
    ref
  ) => {
    const content = (
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-101 w-72 rounded border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          className
        )}
        {...props}
      />
    )

    if (!hasPortal) {
      return content
    }

    return (
      <PopoverPrimitive.Portal container={portalContainer}>
        <div className={cn(portalClassName)}>{content}</div>
      </PopoverPrimitive.Portal>
    )
  }
)
UiPopoverContent.displayName = PopoverPrimitive.Content.displayName

export { UiPopover, UiPopoverTrigger, UiPopoverContent }
