import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "default" | "outline" | "filled";
  size?: "sm" | "md" | "lg";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variants = {
      default: "bg-white hover:bg-[var(--surface-2)] text-[var(--text)] ring-1 ring-inset ring-slate-300 hover:ring-slate-200",
      outline: "ring-2 ring-inset ring-slate-300 hover:ring-slate-200",
      filled: "bg-[var(--surface-2)] hover:bg-[var(--surface-2)] text-[var(--text)]",
    };

    const sizes = {
      sm: "h-9 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-11 px-5 text-lg",
    };

    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-[var(--border)] bg-background px-3 py-2 text-base ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-slate-900 sm:text-sm sm:leading-6",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";