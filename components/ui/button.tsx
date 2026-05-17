/**
 * button.tsx
 * Componente Button reutilizável baseado no padrão shadcn/ui
 * 
 * Implementa diferentes variantes visuais e tamanhos usando
 * class-variance-authority (cva) para composição de classes Tailwind.
 * 
 * Suporta os estados obrigatórios pela especificação:
 * - hover: escurece/clareia o botão ao passar o mouse
 * - focus-visible: anel de foco visível para acessibilidade (Tab navigation)
 * - disabled: aparência esmaecida e cursor de proibido quando inativo
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Define todas as variações visuais do botão usando CVA (class-variance-authority)
 * CVA permite combinar variants de forma type-safe com TypeScript
 */
const buttonVariants = cva(
  // Classes base aplicadas em TODAS as variantes
  // Inclui os estados de hover, focus e disabled exigidos pela especificação
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-md text-sm font-medium",
    "ring-offset-background",
    "transition-all duration-200",              // Transição suave para hover
    // Estado focus-visible: anel de foco visível apenas para navegação por teclado
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    // Estado disabled: opacidade reduzida e cursor de proibido
    "disabled:pointer-events-none disabled:opacity-50",
    "whitespace-nowrap",
  ].join(" "),
  {
    variants: {
      // Variante define a aparência/estilo do botão
      variant: {
        // Default: fundo escuro com texto branco - ação principal
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        // Destructive: vermelho para ações perigosas (deletar, cancelar)
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // Outline: borda visível, fundo transparente - ação secundária
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        // Secondary: fundo cinza suave - ação de apoio
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // Ghost: sem fundo nem borda - ação sutil (links internos, ícones)
        ghost: "hover:bg-accent hover:text-accent-foreground",
        // Link: aparência de link HTML com sublinhado
        link: "text-primary underline-offset-4 hover:underline",
      },
      // Size define o tamanho (padding e altura) do botão
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",  // Botão quadrado para ícones
      },
    },
    // Variante e tamanho padrão quando não especificados
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Props do componente Button
 * Extende as props padrão de um botão HTML e adiciona as variantes do CVA
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Quando true, o botão renderiza como filho (Slot) ao invés de <button>
   * Útil para usar o estilo do botão em Links e outros componentes (asChild pattern)
   * 
   * @example
   * <Button asChild>
   *   <Link href="/novo">Novo Currículo</Link>
   * </Button>
   */
  asChild?: boolean;
}

/**
 * Componente Button
 * Botão reutilizável com múltiplas variantes e tamanhos
 * 
 * @example
 * <Button variant="destructive" size="sm" disabled={isLoading}>
 *   Deletar
 * </Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Se asChild=true, usa Slot do Radix (passa props para o elemento filho)
    // Se asChild=false, usa button HTML padrão
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

// displayName ajuda o React DevTools a identificar o componente
Button.displayName = "Button";

export { Button, buttonVariants };
