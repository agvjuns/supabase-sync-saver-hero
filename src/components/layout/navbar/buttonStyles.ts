
import { cva } from "class-variance-authority";

export const navButtonStyles = cva(
  "transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
        outline: "border border-white/20 text-white hover:bg-white/10 hover:text-white hover:border-white/40",
        ghost: "hover:bg-primary/10 text-white",
        link: "text-white hover:underline underline-offset-4"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 py-1 text-sm",
        lg: "h-11 px-6 py-2.5"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default"
    }
  }
);

export const buttonEffects = {
  glow: "btn-glow",
  noGlow: "",
  bordered: "border border-white/20",
  noBorder: ""
};
