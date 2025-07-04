import { cva } from 'class-variance-authority'

export const defaultDatePickerTranslations: DatePickerTranslations = {
  day: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  month: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  dayPeriod: ['AM', 'PM'],
  ofString: 'of',
}

export const HEIGHT_SIZES = {
  MICRO: 'md:h-10 lg:h-10',
  MINI: 'md:h-14 lg:h-14',
  SMALL: 'md:h-21 lg:h-21',
  MEDIUM: 'md:h-24 lg:h-24',
  MID_LARGE: 'md:h-28 lg:h-28',
  LARGE: 'md:h-32 lg:h-32',
  EXTRA_LARGE: 'md:h-36 lg:h-36',
} as const

export const SIZES = {
  MICRO: '24',
  MINI: '32',
  SMALL: '48',
  MEDIUM: '64',
  MIDLARGE: '72',
  LARGE: '96',
} as const

export type DatePickerTranslations = {
  day: string[]
  month: string[]
  dayPeriod: string[]
  ofString: string
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined
}

export type OccupancyTexts = {
  peopleText?: string
  adultsText?: string
  childrenText?: string
  childAgesText?: string
  roomsText?: string
  ageText?: string
  yearsText?: string
  buttonText?: string
  adultsAgeText?: string
}

export interface Occupancy {
  adults: number
  children: number
  infants: number
  rooms: number
  childAges?: number[]
}

export const defaultO: Occupancy = {
  adults: 2,
  children: 2,
  rooms: 1,
  infants: 0,
  childAges: [1, 2],
}
export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300',
  {
    variants: {
      variant: {
        default:
          'bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90',
        destructive:
          'bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90',
        outline:
          'border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50',
        secondary:
          'bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80',
        ghost: 'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50',
        link: 'text-slate-900 underline-offset-4 hover:underline dark:text-slate-50',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded px-3',
        lg: 'h-11 rounded px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export type DatePickerDisabledDates = {
  before: Date
  after?: Date
}
