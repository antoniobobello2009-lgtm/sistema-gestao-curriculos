/**
 * utils.ts
 * Funções utilitárias usadas em toda a aplicação
 * 
 * Centralizar as funções de utilidade evita duplicação de código
 * e facilita testes e manutenção
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes CSS do Tailwind de forma inteligente
 * 
 * Esta função é o padrão shadcn/ui para combinar classes CSS.
 * - clsx: permite condicionais e arrays de classes
 * - twMerge: resolve conflitos entre classes Tailwind (ex: "p-4 p-8" vira "p-8")
 * 
 * @param inputs - Classes CSS a serem combinadas (strings, objetos ou arrays)
 * @returns String de classes CSS combinadas e sem conflitos
 * 
 * @example
 * cn("p-4 text-red-500", isActive && "bg-blue-500")
 * // Retorna: "p-4 text-red-500 bg-blue-500" (apenas se isActive for true)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Gera um ID único para novos currículos
 * Combina timestamp atual com número aleatório para garantir unicidade
 * 
 * @returns String de ID único no formato "curr_<timestamp>_<random>"
 * 
 * @example
 * generateId() // "curr_1699876543210_4829"
 */
export function generateId(): string {
  return `curr_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

/**
 * Formata uma data ISO para o formato brasileiro DD/MM/AAAA
 * 
 * @param isoDate - Data no formato ISO 8601 (ex: "2024-01-15T10:30:00.000Z")
 * @returns Data formatada em português (ex: "15/01/2024")
 */
export function formatarData(isoDate: string): string {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return date.toLocaleDateString("pt-BR");
}

/**
 * Remove a máscara de campos formatados (CPF, telefone)
 * Mantém apenas números e letras do texto
 * 
 * @param value - String com máscara (ex: "123.456.789-00")
 * @returns String sem caracteres de máscara (ex: "12345678900")
 */
export function removeMask(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "");
}

/**
 * Valida se um CPF é matematicamente válido
 * Implementa o algoritmo oficial de validação de CPF da Receita Federal
 * 
 * @param cpf - CPF a ser validado (pode conter máscara)
 * @returns true se o CPF for válido, false caso contrário
 */
export function validarCPF(cpf: string): boolean {
  // Remove todos os caracteres que não são dígitos
  const cleanCPF = cpf.replace(/[^\d]/g, "");

  // CPF deve ter exatamente 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // CPFs com todos os dígitos iguais são inválidos (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Valida o primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;

  // Valida o segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
}

/**
 * Trunca um texto longo adicionando reticências no final
 * Útil para exibir resumos em cards sem quebrar o layout
 * 
 * @param text - Texto a ser truncado
 * @param maxLength - Número máximo de caracteres (padrão: 150)
 * @returns Texto truncado com "..." se necessário
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

/**
 * Converte uma string de habilidades separadas por vírgula em array
 * Remove espaços extras e entradas vazias
 * 
 * @param habilidadesStr - String com habilidades (ex: "React, TypeScript, Node.js")
 * @returns Array de strings com as habilidades limpas
 */
export function parseHabilidades(habilidadesStr: string): string[] {
  return habilidadesStr
    .split(",")
    .map((h) => h.trim())
    .filter((h) => h.length > 0);
}
