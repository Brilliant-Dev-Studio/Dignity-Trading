"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  inputClassName?: string;
};

export default function PasswordField({
  className,
  inputClassName,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className={cn("relative", className)}>
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={cn("pr-11", inputClassName)}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className={cn(
          "absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2",
          "text-zinc-600 hover:text-zinc-950",
        )}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
}

