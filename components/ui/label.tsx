/**
 * label.tsx
 * Componente Label reutilizável baseado no padrão shadcn/ui
 * 
 * Label semântico para campos de formulário. 
 * Usa o componente primitivo @radix-ui/react-label para 
 * garantir acessibilidade (associação correta com o input via htmlFor)
 */

"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Variantes do label usando CVA
 * Label com erro fica vermelho para indicar campo inválido
 */
const labelVariants = cva(
  // Classes base: texto pequeno, semibold, com comportamento adequado para peers
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

/**
 * Componente Label
 * Rótulo acessível para campos de formulário
 * 
 * @example
 * <Label htmlFor="nome">Nome completo</Label>
 * <Input id="nome" {...register("nome")} />
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
