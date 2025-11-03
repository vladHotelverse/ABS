'use client'

import type React from 'react'

interface BottomBarProps {
  text: {
    copyrightText?: string
    privacyPolicy?: string
    termsConditions?: string
    cancellationPolicy?: string
  }
  hotelName?: string
  actions?: {
    onPrivacyPolicy?: () => void
    onTermsConditions?: () => void
    onCancellationPolicy?: () => void
  }
}

const BottomBar: React.FC<BottomBarProps> = ({ text, hotelName }) => {
  const copyrightText =
    text.copyrightText || `© ${new Date().getFullYear()} ${hotelName || 'Hotel Name'}. All rights reserved.`

  return <p className="text-muted-foreground text-sm">{copyrightText}</p>
}

export { BottomBar }
