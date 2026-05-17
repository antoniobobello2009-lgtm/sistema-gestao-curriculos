/**
 * separator.tsx
 * Componente Separator (divisor visual) baseado no padrão shadcn/ui
 * Usa @radix-ui/react-separator para semântica acessível (role="separator")
 */

"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      // Estilo base: linha fina na cor de borda
      "shrink-0 bg-border",
      // Orientação horizontal: linha full-width com altura de 1px
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
    {...props}
  />
));

Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
