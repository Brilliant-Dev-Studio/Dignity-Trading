import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
};

const variants = {
  default:
    "bg-[var(--brand-700)] text-white shadow-sm hover:bg-[var(--brand-600)] focus-visible:outline-[color:var(--brand-700)]",
  secondary:
    "bg-zinc-100 text-zinc-950 shadow-sm hover:bg-zinc-200 focus-visible:outline-[color:var(--brand-700)]",
  destructive:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:outline-[color:rgb(220,38,38)]",
  outline:
    "border border-zinc-200 bg-white text-zinc-950 shadow-sm hover:bg-zinc-50 focus-visible:outline-[color:var(--brand-700)]",
  ghost: "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950",
} satisfies Record<NonNullable<ButtonProps["variant"]>, string>;

const sizes = {
  default: "h-10 px-4",
  sm: "h-9 rounded-md px-3 text-sm",
  lg: "h-11 rounded-md px-8 text-base",
  icon: "h-9 w-9 rounded-md p-0",
} satisfies Record<NonNullable<ButtonProps["size"]>, string>;

export function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
