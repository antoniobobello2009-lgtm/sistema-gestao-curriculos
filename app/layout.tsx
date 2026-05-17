/**
 * layout.tsx (Root Layout)
 * Layout raiz da aplicação Next.js App Router
 * 
 * Este é o componente de layout mais externo da aplicação.
 * Ele envolve TODAS as páginas e é renderizado apenas uma vez.
 * 
 * Responsabilidades:
 * - Define o HTML base (<html>, <body>)
 * - Importa estilos globais
 * - Configura metadados SEO globais
 * - Renderiza Header e Footer em todas as páginas
 * - Configura o Toaster do Sonner para notificações globais
 * 
 * É um Server Component por padrão no App Router
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

/**
 * Configura a fonte Inter do Google Fonts
 * Inter é uma tipografia moderna e altamente legível, ideal para interfaces de sistema
 * subsets: ['latin'] carrega apenas o subconjunto latino (economiza bandwidth)
 */
const inter = Inter({ subsets: ["latin"] });

/**
 * Metadados SEO da aplicação
 * Estes metadados aparecem na aba do browser e em compartilhamentos sociais
 */
export const metadata: Metadata = {
  title: {
    // Template: "%s" é substituído pelo título de cada página
    template: "%s | A.Bobello",
    // Título padrão quando nenhuma página define o seu
    default: "A.Bobello - Sistema de Gestão de Currículos",
  },
  description:
    "Sistema moderno de Gestão de Currículos desenvolvido com Next.js, Tailwind CSS e shadcn/ui. Cadastre, visualize e gerencie currículos de forma eficiente.",
  keywords: ["currículos", "gestão", "RH", "recursos humanos", "Next.js"],
  authors: [{ name: "antoniobobello2009-lgtm" }],
};

/**
 * RootLayout - Componente de Layout Raiz
 * 
 * @param children - Conteúdo da página atual (injetado pelo App Router)
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      {/*
       * lang="pt-BR": Define o idioma da página para o browser e screen readers
       * Importante para acessibilidade e SEO
       */}
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/*
         * flex flex-col + min-h-screen: garante que o Footer fica sempre no final
         * mesmo quando o conteúdo é menor que a altura da tela
         */}

        {/* Header global: aparece em todas as páginas */}
        <Header />

        {/*
         * Main: área principal de conteúdo
         * flex-1: ocupa todo o espaço disponível entre Header e Footer
         * (junto com flex flex-col no body, isso mantém o Footer sempre no fundo)
         */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer global: aparece em todas as páginas */}
        <Footer />

        {/*
         * Toaster do Sonner: componente de notificações toast
         * Deve ser renderizado uma vez no layout raiz para estar disponível globalmente
         * 
         * Configurações:
         * - richColors: cores diferentes para success, error, warning, info
         * - position: "top-right" - posição padrão dos toasts
         * - duration: 4000ms - tempo que o toast fica visível
         * - closeButton: botão X para fechar manualmente
         */}
        <Toaster
          richColors
          position="top-right"
          duration={4000}
          closeButton
        />
      </body>
    </html>
  );
}
