// Next.js i18n configuration based on Webmap structure
import { resolve } from 'node:path'

export const i18n = {
  localeDetection: false,
  defaultLocale: 'en',
  locales: ['en', 'es'],
  localePath: resolve('./src/i18n/locales'),
}

export default i18n