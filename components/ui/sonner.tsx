"use client";

import * as React from "react";
import { Toaster as Sonner } from "sonner";

type Props = React.ComponentProps<typeof Sonner>;

export function Toaster(props: Props) {
  return (
    <Sonner
      richColors
      closeButton
      {...props}
    />
  );
}

