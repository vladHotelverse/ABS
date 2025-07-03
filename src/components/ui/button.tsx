import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 dark:focus-visible:ring-neutral-300',
  {
    variants: {
      variant: {
        default:
          'bg-primary-700 text-actionPrimaryForeground shadow hover:bg-primary-700/90 dark:bg-neutral-50 dark:text-neutral-800 dark:hover:bg-neutral-50/90',
        destructive:
          'bg-red-500 text-neutral-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90',
        outline:
          'border border-neutral-100 bg-white shadow-sm hover:bg-neutral-50 cursor-pointer dark:border-neutral-700 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:text-neutral-50',
        secondary:
          'bg-neutral-50 text-neutral-950 shadow-sm hover:bg-neutral-50/80 dark:bg-neutral-700 dark:text-neutral-50 dark:hover:bg-neutral-700',
        ghost: 'hover:bg-neutral-50 hover:text-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
        link: 'text-neutral-800 underline-offset-4 hover:underline dark:text-neutral-50',
        // Additional color variants for compatibility
        white: 'bg-neutral-50 hover:bg-neutral-100 text-neutral-950 shadow-sm',
        black: 'bg-neutral-950 hover:bg-neutral-950 text-neutral-50 shadow-sm',
        'outline-white':
          'border border-neutral-400 text-neutral-50 bg-transparent hover:bg-neutral-50 hover:text-neutral-950',
        'outline-black':
          'border border-neutral-950 text-neutral-950 bg-transparent hover:bg-neutral-950 hover:text-neutral-50',
        'outline-primary':
          'border border-primary-700 text-primary-700 bg-transparent hover:bg-primary-700 hover:text-white',
        'link-white': 'text-neutral-50 hover:text-neutral-100 underline-offset-4 hover:underline bg-transparent',
        'link-black': 'text-neutral-950 hover:text-neutral-950 underline-offset-4 hover:underline bg-transparent',
        'link-primary': 'text-primary-700 hover:text-primary-800 underline-offset-4 hover:underline bg-transparent',
      },
      size: {
        xs: 'h-8 px-3 py-1.5 text-xs',
        sm: 'h-9 px-3.5 py-2 text-sm',
        default: 'h-10 px-4 py-2',
        md: 'h-10 px-3.5 py-2 text-md',
        lg: 'h-11 px-4 py-2.5 text-lg',
        icon: 'h-10 w-10',
        'icon-xs': 'h-8 w-8 px-2.5 py-2.5',
        'icon-sm': 'h-9 w-9 px-2.5 py-2.5',
        'icon-lg': 'h-11 w-11 px-2.5 py-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export { Button, Button as UiButton, buttonVariants }
