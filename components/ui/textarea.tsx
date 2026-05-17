/**
 * textarea.tsx
 * Componente Textarea reutilizável baseado no padrão shadcn/ui
 * 
 * Área de texto multi-linha estilizada. Usado para campos como:
 * - Resumo profissional
 * - Descrição de experiências
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Layout base
          "flex min-h-[80px] w-full rounded-md",
          // Aparência
          "border border-input bg-background px-3 py-2",
          "text-sm",
          "placeholder:text-muted-foreground",
          // Resize apenas vertical para não quebrar layout
          "resize-y",
          // Estados de focus e disabled
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
