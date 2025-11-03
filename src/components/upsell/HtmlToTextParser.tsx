'use client'

import parse from 'html-react-parser'
import * as React from 'react'

interface HtmlToTextParserProps {
  htmlContent: string
}

/**
 * HtmlToTextParser Component
 * Parses HTML string content into React nodes after hydration to avoid SSR mismatches.
 *
 * The component defers parsing until after the client hydrates to ensure server and
 * client render the same HTML during hydration. After hydration, the parsed HTML is
 * displayed with proper React element structure.
 *
 * @param htmlContent - HTML string to parse
 * @returns Parsed React nodes or original string if parsing fails
 */
const HtmlToTextParser = React.forwardRef<HTMLDivElement, HtmlToTextParserProps>(({ htmlContent }, ref) => {
  // Track whether component has mounted (hydration complete)
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // During SSR and initial hydration: render as plain text string
  // After hydration: render parsed HTML
  const parsedContent = React.useMemo(() => {
    if (!isMounted) {
      return htmlContent
    }

    try {
      return parse(htmlContent)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error parsing HTML content:', error)
      }
      return htmlContent
    }
  }, [htmlContent, isMounted])

  return <div ref={ref}>{parsedContent}</div>
})

HtmlToTextParser.displayName = 'HtmlToTextParser'

export { HtmlToTextParser }
