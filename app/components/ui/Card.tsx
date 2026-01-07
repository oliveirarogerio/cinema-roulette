"use client";

import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function Card({ children, className, animate = true }: CardProps) {
  const CardComponent = animate ? motion.div : "div";

  return (
    <CardComponent
      className={cn(
        "bg-zinc-900 border border-zinc-800 rounded-xl p-6",
        className
      )}
      {...(animate && {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
      })}
    >
      {children}
    </CardComponent>
  );
}

