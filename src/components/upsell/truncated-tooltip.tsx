'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { Info } from 'lucide-react'
import * as React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TooltipProvider, UiTooltip, UiTooltipContent, UiTooltipTrigger } from '@/components/ui/tooltip'
import { useIsDesktop } from '@/hooks/useIsDesktop'
import { cn } from '@/lib/utils'

interface TruncatedTooltipProps {
  children?: React.ReactNode
  htmlContent?: string | React.ReactNode // Can be HTML string or pre-parsed React content
  triggerClassName?: string
  tooltipClassName?: string
}

const TruncatedTooltip = React.forwardRef<HTMLDivElement, TruncatedTooltipProps>(
  ({ children, htmlContent, triggerClassName, tooltipClassName }, ref) => {
    const contentRef = React.useRef<HTMLDivElement>(null)
    const [isTruncated, setIsTruncated] = React.useState(false)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const isDesktop = useIsDesktop()

    // Expose contentRef via ref prop
    React.useImperativeHandle(ref, () => contentRef.current as HTMLDivElement, [])

    // Use htmlContent (already parsed) or children
    const content = htmlContent || children

    React.useEffect(() => {
      const element = contentRef.current
      if (!element) return

      const checkTruncation = () => {
        const isOverflowing = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth
        setIsTruncated(isOverflowing)
      }

      checkTruncation()

      const resizeObserver = new ResizeObserver(checkTruncation)
      resizeObserver.observe(element)

      return () => {
        resizeObserver.disconnect()
      }
    }, [htmlContent, children])

    const triggerContent = (
      <div
        ref={contentRef}
        className={cn(
          'line-clamp-2 min-h-10 overflow-hidden text-start text-sm',
          isTruncated && 'cursor-pointer',
          triggerClassName
        )}
      >
        {content}
      </div>
    )

    const tooltipContent = <div className="text-foreground text-sm">{content}</div>

    // Mobile tap indicator (icon + text hint)
    const mobileTapIndicator = !isDesktop && isTruncated && (
      <div className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
        <Info className="h-3 w-3" />
        <span>(Tap to read more)</span>
      </div>
    )

    // Desktop: use tooltip on hover
    if (isDesktop) {
      return (
        <TooltipProvider>
          <UiTooltip>
            <UiTooltipTrigger>{triggerContent}</UiTooltipTrigger>
            {isTruncated && (
              <TooltipPrimitive.Portal>
                <UiTooltipContent className={cn('max-w-xs', tooltipClassName)}>{tooltipContent}</UiTooltipContent>
              </TooltipPrimitive.Portal>
            )}
          </UiTooltip>
        </TooltipProvider>
      )
    }

    // Mobile: use dialog on tap
    return (
      <>
        <button
          onClick={() => {
            if (isTruncated) {
              setIsDialogOpen(true)
            }
          }}
          className={cn('w-full', isTruncated && 'cursor-pointer')}
          type="button"
        >
          {triggerContent}
          {mobileTapIndicator}
        </button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className={cn('z-[101] max-w-xs rounded px-2', tooltipClassName)}>
            <DialogHeader>
              <DialogTitle className="sr-only">Full Content</DialogTitle>
              <DialogDescription asChild>
                <div className="text-start text-foreground text-sm">{content}</div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>
    )
  }
)

TruncatedTooltip.displayName = 'TruncatedTooltip'

export { TruncatedTooltip }
