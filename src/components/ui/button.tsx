import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-white shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-none',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        add: 'bg-[#7C3AED] hover:bg-white hover:border-[#7539ff] hover:shadow-[inset_0_50px_0_0_#fff] hover:text-[#7539ff] transition-all duration-500 text-white font-medium',
        'reverse-add': 'bg-white text-[#7539ff] border border-[#7539ff] hover:bg-[#7C3AED] hover:text-white hover:border-transparent hover:shadow-[inset_0_50px_0_0_#7C3AED] transition-all duration-500 font-medium',
        delete: 'bg-[#7C3AED] hover:bg-white hover:border-[#7539ff] hover:shadow-[inset_0_50px_0_0_#fff] hover:text-[#7539ff] transition-all duration-500 text-white font-medium',
        close: 'border border-gray-200 bg-white text-[0px] rounded-full hover:text-gray-900 hover:border-gray-200 focus:border-gray-200 active:border-gray-200',
        flat: 'border border-input bg-white shadow-sm text-gray-600 hover:text-gray-900',
      },
      size: {
        default: 'h-9 px-4 py-2 text-sm',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8 text-base',
        icon: 'h-9',
        responsive: 'h-9 md:h-10 px-3 md:px-4 text-sm md:text-sm max-w-[120px] md:max-w-none [&>svg]:h-5 [&>svg]:w-5 md:[&>svg]:h-4 md:[&>svg]:w-4',
        mobile: 'h-8 px-2 max-w-[100px] text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
