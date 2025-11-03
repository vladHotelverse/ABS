import type { ReactNode } from 'react'

export interface ResponsiveLayoutProps {
  children: ReactNode
  className?: string
  showMobileWidget?: boolean
}

export interface ResponsiveMainProps {
  children: ReactNode
  className?: string
}

export interface ResponsiveContentProps {
  children: ReactNode
  className?: string
}

export interface ResponsiveSidebarProps {
  children: ReactNode
  className?: string
}

export interface ResponsiveHeaderProps {
  children: ReactNode
  className?: string
}

export interface ResponsiveMobileWidgetProps {
  children: ReactNode
  className?: string
}
