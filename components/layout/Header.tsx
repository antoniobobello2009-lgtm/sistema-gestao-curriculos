/**
 * Header.tsx
 * Componente de Cabeçalho Principal da Aplicação
 * 
 * Exibe:
 * - Logo/identidade do sistema
 * - Menu de navegação principal (via componente Nav)
 * - Menu hambúrguer para mobile (responsividade)
 * 
 * É um Client Component porque gerencia o estado do menu mobile (useState)
 * e usa o componente Nav que também é client-side (usePathname).
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "./Nav";
import { Button } from "@/components/ui/button";
import { FaBriefcase, FaBars, FaTimes } from "react-icons/fa";

/**
 * Componente Header
 * Cabeçalho responsivo com logo, navegação e menu mobile
 */
export function Header() {
  // Estado que controla se o menu mobile está aberto ou fechado
  // false = fechado (padrão), true = aberto
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Alterna o estado do menu mobile (toggle)
   * Chamado ao clicar no botão hambúrguer
   */
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  /**
   * Fecha o menu mobile após navegar para um link
   * Garante boa UX no mobile: o menu fecha automaticamente após a navegação
   */
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    // Header fixo no topo com sombra suave e z-index alto para ficar sobre o conteúdo
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Barra principal do header */}
        <div className="flex h-16 items-center justify-between">

          {/* === LOGO E IDENTIDADE DO SISTEMA === */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label="Sistema de Gestão de Currículos - Ir para página inicial"
          >
            {/* Ícone de maleta representa o contexto profissional */}
            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary">
              <FaBriefcase className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
            </div>
            {/* Nome do sistema - oculto em telas muito pequenas */}
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none">A.Bobello</span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                Sistema de Gestão de Currículos
              </span>
            </div>
          </Link>

          {/* === NAVEGAÇÃO DESKTOP === */}
          {/* O componente Nav renderiza como horizontal no desktop via classes CSS */}
          <Nav onLinkClick={closeMobileMenu} />

          {/* === BOTÃO HAMBÚRGUER (apenas mobile) === */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"  // Visível apenas em telas menores que md (768px)
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {/* Alterna entre ícone de hambúrguer e X */}
            {mobileMenuOpen ? (
              <FaTimes className="h-5 w-5" aria-hidden="true" />
            ) : (
              <FaBars className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
        </div>

        {/* === MENU MOBILE === */}
        {/* Visível apenas quando mobileMenuOpen=true e em telas mobile */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t py-4 animate-fade-in"
          >
            {/* Nav em modo mobile: flex vertical com links em largura total */}
            <Nav isMobileOpen={true} onLinkClick={closeMobileMenu} />
          </div>
        )}
      </div>
    </header>
  );
}
