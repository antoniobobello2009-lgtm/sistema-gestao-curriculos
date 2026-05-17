/**
 * input.tsx
 * Componente Input reutilizável baseado no padrão shadcn/ui
 * 
 * Campo de texto estilizado com estados visuais consistentes:
 * - Normal: borda sutil com fundo branco
 * - Focus: borda destaque com anel de foco para acessibilidade
 * - Disabled: opacidade reduzida para indicar inatividade
 * - Error: borda vermelha (quando usado com FormField em erro)
 */

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Props do Input - extende todas as props HTML de um input
 * Nenhuma propriedade extra é necessária; a estilização vem das classes
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Componente Input
 * Campo de texto estilizado com Tailwind CSS
 * 
 * Usa React.forwardRef para permitir que componentes pai acessem o DOM input
 * (necessário para integração com React Hook Form via register())
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Layout e tamanho
          "flex h-10 w-full rounded-md",
          // Aparência normal
          "border border-input bg-background px-3 py-2",
          // Tipografia
          "text-sm",
          // Placeholder com cor mais suave
          "placeholder:text-muted-foreground",
          // Focus: anel de foco para acessibilidade por teclado
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          // Disabled: cursor de proibido e opacidade reduzida
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Transição suave para mudanças de estado
          "transition-colors duration-200",
          // Permite sobrescrever com classes customizadas
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
