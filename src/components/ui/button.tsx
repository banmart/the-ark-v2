import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-display text-sm tracking-widest uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-ark-gold text-ark-obsidian shadow-brutal-sm hover:shadow-brutal-gold hover:translate-x-0.5 hover:-translate-y-0.5",
        destructive: "bg-ark-blood text-ark-ivory shadow-brutal-sm hover:shadow-brutal hover:translate-x-0.5 hover:-translate-y-0.5",
        outline: "border-2 border-ark-stone/30 bg-transparent text-ark-ivory hover:border-ark-gold hover:text-ark-gold",
        secondary: "bg-ark-charcoal text-ark-ivory border-l-4 border-ark-gold hover:bg-ark-charcoal/80",
        ghost: "text-ark-ivory hover:text-ark-gold hover:bg-ark-charcoal/50",
        link: "text-ark-gold underline-offset-4 hover:underline",
        brutal: "bg-ark-gold text-ark-obsidian shadow-brutal hover:shadow-brutal-gold hover:translate-x-1 hover:-translate-y-1",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 px-4",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
