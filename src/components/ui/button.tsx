import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 touch-manipulation box-border",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl active:scale-[0.97]",
        destructive: "bg-destructive text-white hover:bg-destructive/90 active:scale-[0.97]",
        outline: "border-2 border-border bg-transparent hover:bg-accent hover:text-accent-foreground active:scale-[0.97]",
        secondary: "bg-secondary text-white hover:bg-secondary/90 active:scale-[0.97]",
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-[0.97]",
        link: "text-primary underline-offset-4 hover:underline",
        neon: "bg-primary/10 text-primary border-2 border-primary hover:bg-primary/20 active:scale-[0.97]",
        neonOrange: "bg-secondary/10 text-secondary border-2 border-secondary hover:bg-secondary/20 active:scale-[0.97]",
        gaming: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-xl active:scale-[0.97]",
      },
      size: {
        default: "h-11 min-h-[44px] px-5 py-2 text-sm [&_svg]:w-4 [&_svg]:h-4",
        sm: "h-10 min-h-[40px] px-4 py-2 text-xs [&_svg]:w-3.5 [&_svg]:h-3.5",
        lg: "h-14 min-h-[48px] px-8 py-3 text-base [&_svg]:w-5 [&_svg]:h-5",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px] [&_svg]:w-5 [&_svg]:h-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
