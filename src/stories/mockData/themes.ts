import type { CSSProperties } from 'react'

export const brandDefaults = {
  primary: '#000',
  primaryForeground: '#ffffff',
} as const

export const createBrandTheme = (
  primary: string = brandDefaults.primary,
  primaryForeground: string = brandDefaults.primaryForeground
): CSSProperties => ({
  '--primary': primary,
  '--primary-foreground': primaryForeground,
})

export const goldThemeOverride: CSSProperties = createBrandTheme()
export const tabsDemoTheme: CSSProperties = createBrandTheme()
