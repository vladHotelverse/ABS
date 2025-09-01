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
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground cursor-pointer',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        // Additional color variants for compatibility
        white: 'bg-background hover:bg-muted text-foreground shadow-sm',
        black: 'bg-foreground hover:bg-foreground/90 text-background shadow-sm',
        'outline-white':
          'border border-muted-foreground text-background bg-transparent hover:bg-background hover:text-foreground',
        'outline-black':
          'border border-foreground text-foreground bg-transparent hover:bg-foreground hover:text-background',
        'outline-primary':
          'border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground',
        'link-white': 'text-background hover:text-muted-foreground underline-offset-4 hover:underline bg-transparent',
        'link-black': 'text-foreground hover:text-foreground/80 underline-offset-4 hover:underline bg-transparent',
        'link-primary': 'text-primary hover:text-primary/80 underline-offset-4 hover:underline bg-transparent',
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
