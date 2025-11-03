import { cn } from '@/lib/utils'
import type {
  ResponsiveContentProps,
  ResponsiveHeaderProps,
  ResponsiveLayoutProps,
  ResponsiveMainProps,
  ResponsiveMobileWidgetProps,
  ResponsiveSidebarProps,
} from './types'

export const ResponsiveLayout = ({ children, className, showMobileWidget = true }: ResponsiveLayoutProps) => {
  return (
    <div className={cn('flex min-h-screen flex-col', className)}>
      {children}

      {/* Add padding bottom for mobile widget if enabled */}
      {showMobileWidget && <div className="max-sm:pb-28" />}
    </div>
  )
}

export const ResponsiveMain = ({ children, className }: ResponsiveMainProps) => {
  return (
    <main
      className={cn(
        'container mx-auto px-3 pb-6 sm:px-4',
        'flex flex-grow flex-col gap-6 sm:gap-7 md:gap-8 lg:flex-row',
        className
      )}
    >
      {children}
    </main>
  )
}

export const ResponsiveContent = ({ children, className }: ResponsiveContentProps) => {
  return <div className={cn('w-full flex-grow space-y-6 xl:max-w-[calc(100%-400px)]', className)}>{children}</div>
}

export const ResponsiveSidebar = ({ children, className }: ResponsiveSidebarProps) => {
  return (
    <aside className={cn('sticky top-4 hidden w-full flex-shrink-0 self-start md:max-w-md lg:block', className)}>
      {children}
    </aside>
  )
}

export const ResponsiveHeader = ({ children, className }: ResponsiveHeaderProps) => {
  return <div className={className}>{children}</div>
}

export const ResponsiveMobileWidget = ({ children, className }: ResponsiveMobileWidgetProps) => {
  return <div className={cn('fixed right-0 bottom-0 left-0 z-50 lg:hidden', className)}>{children}</div>
}
