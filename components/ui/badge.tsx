/**
 * badge.tsx
 * Componente Badge reutilizável baseado no padrão shadcn/ui
 * 
 * Badge é um elemento visual pequeno usado para exibir tags, labels,
 * status e categorias. No sistema, é usado principalmente para
 * exibir as habilidades dos candidatos.
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Variantes visuais do Badge usando CVA
 */
const badgeVariants = cva(
  // Classes base para todos os badges
  [
    "inline-flex items-center rounded-full",
    "border px-2.5 py-0.5",
    "text-xs font-semibold",
    "transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  ].join(" "),
  {
    variants: {
      variant: {
        // Default: fundo escuro (cor primária) para destaque
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        // Secondary: fundo cinza suave para informações secundárias
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // Destructive: vermelho para status de erro ou atenção
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        // Outline: apenas borda, sem preenchimento
        outline: "text-foreground",
        // Success: verde para status positivo
        success:
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        // Info: azul claro para habilidades técnicas
        info:
          "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Componente Badge
 * Pill/tag visual para categorias, habilidades e status
 * 
 * @example
 * <Badge variant="info">React</Badge>
 * <Badge variant="success">Disponível</Badge>
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
