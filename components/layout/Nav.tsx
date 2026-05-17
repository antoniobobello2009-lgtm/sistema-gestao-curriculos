/**
 * Nav.tsx
 * Componente de Navegação Principal do Sistema
 * 
 * Implementa o menu de navegação com ACTIVE STATE visual, conforme exigido
 * na especificação (item 8 - Critérios de Refinamento de UI).
 * 
 * O active state é implementado usando o hook usePathname do Next.js,
 * que retorna o pathname atual da URL, permitindo comparar com cada link
 * e aplicar estilos diferentes para o link ativo.
 * 
 * É um Client Component ("use client") porque usa hooks do React/Next.js
 * (usePathname requer acesso ao estado da navegação no cliente).
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FaHome, FaList, FaUserPlus } from "react-icons/fa";

/**
 * Define os itens do menu de navegação
 * Centralizar aqui facilita adicionar/remover páginas no futuro
 */
const navItems = [
  {
    href: "/",
    label: "Início",
    icon: FaHome,           // Ícone de casinha para a Home
    exact: true,            // Comparação exata de path (evita que "/" match em todas as rotas)
  },
  {
    href: "/sistema/paginas/curriculos",
    label: "Currículos",
    icon: FaList,           // Ícone de lista para a listagem
    exact: false,
  },
  {
    href: "/sistema/paginas/curriculos/novo",
    label: "Novo Currículo",
    icon: FaUserPlus,       // Ícone de adicionar usuário para o cadastro
    exact: true,
  },
];

/**
 * Props do componente Nav
 * Permite que o Nav seja renderizado em modo mobile (fechado/aberto) ou desktop
 */
interface NavProps {
  /** Indica se o menu mobile está aberto (para estilos diferentes) */
  isMobileOpen?: boolean;
  /** Callback para fechar o menu mobile após clicar em um link */
  onLinkClick?: () => void;
}

/**
 * Componente Nav
 * Menu de navegação principal com indicador visual de página ativa
 */
export function Nav({ isMobileOpen, onLinkClick }: NavProps) {
  // usePathname retorna o caminho atual, ex: "/sistema/paginas/curriculos"
  const pathname = usePathname();

  /**
   * Verifica se um link está ativo baseado no pathname atual
   * 
   * @param href - O caminho do link a verificar
   * @param exact - Se true, requer correspondência exata; se false, aceita sub-rotas
   */
  const isActive = (href: string, exact: boolean): boolean => {
    if (exact) {
      // Correspondência exata: "/" só ativa em "/"
      return pathname === href;
    }
    // Correspondência de prefixo: "/curriculos" ativa em "/curriculos" e "/curriculos/123"
    // mas NÃO ativa para "/curriculos/novo" quando temos o link exato para "/curriculos/novo"
    return pathname.startsWith(href) && (pathname === href || pathname.startsWith(href + "/"));
  };

  return (
    <nav
      aria-label="Navegação principal"
      className={cn(
        // No desktop: flex horizontal
        "hidden md:flex items-center gap-1",
        // No mobile: flex vertical, visível apenas quando isMobileOpen=true
        isMobileOpen && "flex flex-col w-full mt-4 gap-1"
      )}
    >
      {navItems.map((item) => {
        // Verifica se este item é o ativo no momento
        const active = isActive(item.href, item.exact);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}  // Fecha menu mobile ao clicar
            aria-current={active ? "page" : undefined}  // Acessibilidade: indica página atual
            className={cn(
              // Estilos base do link de navegação
              "flex items-center gap-2 px-4 py-2 rounded-md",
              "text-sm font-medium",
              "transition-all duration-200",
              // Focus visible para navegação por teclado
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",

              // *** ACTIVE STATE - Critério obrigatório da especificação ***
              // Link ativo: fundo azul, texto branco, com indicador inferior
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : // Link inativo: texto muted com hover suave
                  "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {/* Ícone do item de navegação */}
            <Icon className="h-4 w-4" aria-hidden="true" />
            {/* Texto do link */}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
