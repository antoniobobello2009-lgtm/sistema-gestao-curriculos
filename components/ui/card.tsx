/**
 * card.tsx
 * Componente Card reutilizável baseado no padrão shadcn/ui
 * 
 * O Card é um container visual que agrupa informações relacionadas.
 * É composto por sub-componentes para máxima flexibilidade:
 * - Card: container externo
 * - CardHeader: cabeçalho com título e descrição
 * - CardTitle: título principal do card
 * - CardDescription: texto descritivo secundário
 * - CardContent: corpo principal do card
 * - CardFooter: rodapé com ações ou informações adicionais
 */

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Card - Container principal
 * Aplica borda, sombra e fundo branco com bordas arredondadas
 */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

/**
 * CardHeader - Cabeçalho do card
 * Seção superior com padding e espaçamento vertical para título e descrição
 */
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

/**
 * CardTitle - Título do card
 * Texto de destaque com fonte semibold e tamanho adequado
 */
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

/**
 * CardDescription - Texto descritivo do card
 * Texto secundário com cor mais suave para informações complementares
 */
const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

/**
 * CardContent - Corpo principal do card
 * Área de conteúdo com padding horizontal e inferior (sem padding superior)
 */
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

/**
 * CardFooter - Rodapé do card
 * Área inferior com flexbox para alinhar botões e informações de rodapé
 */
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
