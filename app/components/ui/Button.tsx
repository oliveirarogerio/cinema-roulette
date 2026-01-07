"use client";

import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { forwardRef } from "react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "primary", isLoading = false, disabled, onClick, type = "button" }, ref) => {
    const baseStyles = "relative px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
      primary: "bg-rose-600 text-zinc-50 hover:bg-rose-700 shadow-lg shadow-rose-900/20",
      secondary: "bg-zinc-800 text-zinc-50 hover:bg-zinc-700 border border-zinc-700",
      ghost: "bg-transparent text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900",
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        className={cn(baseStyles, variantStyles[variant], className)}
        disabled={disabled || isLoading}
        onClick={onClick}
        whileHover={disabled || isLoading ? {} : { scale: 1.02 }}
        whileTap={disabled || isLoading ? {} : { scale: 0.98 }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span
              className="h-4 w-4 border-2 border-zinc-50 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            {children}
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };

