/**
 * Footer.tsx
 * Componente de Rodapé da Aplicação
 * 
 * Exibe:
 * - Copyright e informações do sistema
 * - Links secundários (sobre, contato, etc.)
 * - Informações do desenvolvedor (assinatura do trabalho)
 * 
 * É um Server Component (sem "use client") pois não precisa
 * de interatividade ou hooks de estado.
 */

import Link from "next/link";
import { FaBriefcase, FaGithub, FaEnvelope } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";

/**
 * Componente Footer
 * Rodapé responsivo com copyright e links secundários
 */
export function Footer() {
  // Ano atual para o copyright (dinâmico)
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Grade responsiva: 1 coluna no mobile, 3 no desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* === COLUNA 1: IDENTIDADE DO SISTEMA === */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-6 w-6 rounded bg-primary">
                <FaBriefcase className="h-3 w-3 text-primary-foreground" aria-hidden="true" />
              </div>
              <span className="font-semibold text-sm">A.Bobello</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Sistema moderno de Gestão de Currículos desenvolvido com Next.js, 
              Tailwind CSS e shadcn/ui.
            </p>
          </div>

          {/* === COLUNA 2: LINKS DE NAVEGAÇÃO === */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Navegação</h3>
            <nav aria-label="Links do rodapé">
              <ul className="flex flex-col gap-1">
                <li>
                  <Link
                    href="/"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Página Inicial
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sistema/paginas/curriculos"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Lista de Currículos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sistema/paginas/curriculos/novo"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cadastrar Currículo
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* === COLUNA 3: INFORMAÇÕES DO PROJETO === */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Sobre o Projeto</h3>
            <p className="text-xs text-muted-foreground">
              Trabalho 2 - Remodelação do Sistema de Gestão de Currículos
            </p>
            {/* Links para o repositório e contato */}
            <div className="flex items-center gap-3 mt-1">
              <a
                href="https://github.com/antoniobobello2009-lgtm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Ver repositório no GitHub"
              >
                <FaGithub className="h-3 w-3" aria-hidden="true" />
                GitHub
              </a>
              <a
                href="mailto:antonio.bobello.2009@gmail.com"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <FaEnvelope className="h-3 w-3" aria-hidden="true" />
                Contato
              </a>
            </div>
          </div>
        </div>

        {/* Linha divisória */}
        <Separator className="my-6" />

        {/* Rodapé com copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {currentYear} A.Bobello - Sistema de Gestão de Currículos. Todos os direitos reservados.
          </p>
          {/* Assinatura do desenvolvedor (GitHub username do trabalho) */}
          <p className="text-xs text-muted-foreground">
            Desenvolvido por{" "}
            <a
              href="https://github.com/antoniobobello2009-lgtm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground transition-colors"
            >
              @antoniobobello2009-lgtm
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
