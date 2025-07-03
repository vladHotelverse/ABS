// Next.js internationalization request configuration
// Based on Webmap structure but adapted for the ABS demo app

import { getRequestConfig } from 'next-intl/server'
import { headers } from 'next/headers'

export default getRequestConfig(async () => {
  // Check for language preference in headers, localStorage will be handled client-side
  const headersList = headers()
  const locale = headersList.get('X-lang') || headersList.get('Accept-Language')?.split(',')[0] || 'en'

  // Normalize locale to supported languages
  const supportedLocales = ['en', 'es']
  const normalizedLocale = supportedLocales.includes(locale) ? locale : 'en'

  return {
    locale: normalizedLocale,
    messages: (await import(`./locales/${normalizedLocale}.json`)).default,
  }
})