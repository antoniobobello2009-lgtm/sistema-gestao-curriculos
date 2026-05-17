/**
 * page.tsx (Home / Landing Page)
 * Rota: /
 * 
 * Landing page apresentando os benefícios do Sistema de Gestão de Currículos.
 * Utiliza amplamente os componentes shadcn/ui (Card, Button, Badge) e ícones
 * do React Icons para criar uma interface moderna e interativa.
 * 
 * Estrutura da página:
 * 1. Hero Section: título principal com chamada para ação
 * 2. Features Section: cards com benefícios e funcionalidades
 * 3. Stats Section: números e estatísticas do sistema
 * 4. CTA Section: chamada para ação final
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FaUsers,
  FaSearch,
  FaClipboardList,
  FaCheckCircle,
  FaRocket,
  FaShieldAlt,
  FaMobileAlt,
  FaChartBar,
  FaArrowRight,
  FaUserTie,
} from "react-icons/fa";
import type { Metadata } from "next";

/**
 * Metadados SEO específicos desta página
 */
export const metadata: Metadata = {
  title: "Início",
  description: "Sistema moderno de Gestão de Currículos - gerencie candidatos de forma eficiente",
};

/**
 * Dados dos cards de funcionalidades
 * Extraídos para fora do componente para manter o JSX limpo
 */
const features = [
  {
    icon: FaUsers,
    title: "Gestão Centralizada",
    description:
      "Centralize todos os currículos em um único sistema. Acesse e gerencie candidatos de qualquer dispositivo.",
    badge: "Essencial",
    badgeVariant: "info" as const,
  },
  {
    icon: FaSearch,
    title: "Busca Inteligente",
    description:
      "Filtre currículos em tempo real por nome ou cargo desejado. Encontre o candidato ideal rapidamente.",
    badge: "Destaque",
    badgeVariant: "success" as const,
  },
  {
    icon: FaClipboardList,
    title: "Cadastro Completo",
    description:
      "Formulário completo com experiências profissionais, formações acadêmicas e habilidades. Campos dinâmicos para múltiplas entradas.",
    badge: "Completo",
    badgeVariant: "default" as const,
  },
  {
    icon: FaCheckCircle,
    title: "Validação Rigorosa",
    description:
      "Validação de formulários com React Hook Form e Yup. Máscaras automáticas para CPF e telefone.",
    badge: "Confiável",
    badgeVariant: "secondary" as const,
  },
  {
    icon: FaMobileAlt,
    title: "Design Responsivo",
    description:
      "Interface adaptada para todos os dispositivos: desktop, tablet e smartphone. Experiência consistente em qualquer tela.",
    badge: "Acessível",
    badgeVariant: "info" as const,
  },
  {
    icon: FaShieldAlt,
    title: "Dados Seguros",
    description:
      "Armazenamento local com localStorage. Dados persistentes entre sessões sem necessidade de servidor.",
    badge: "Seguro",
    badgeVariant: "success" as const,
  },
];

/**
 * Dados para a seção de estatísticas
 */
const stats = [
  { value: "5+", label: "Currículos mockados", icon: FaUserTie },
  { value: "100%", label: "Responsivo", icon: FaMobileAlt },
  { value: "0s", label: "Tempo de busca", icon: FaRocket },
  { value: "∞", label: "Cadastros possíveis", icon: FaChartBar },
];

/**
 * Página Home (Landing Page)
 * Server Component - não precisa de interatividade client-side
 */
export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* ================================================================
          SEÇÃO 1: HERO
          Apresentação principal do sistema com chamada para ação (CTA)
          ================================================================ */}
      <section className="hero-gradient text-white py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          {/* Badge de status acima do título */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full border border-white/30">
              <FaRocket className="h-4 w-4" aria-hidden="true" />
              Sistema moderno com Next.js 14
            </span>
          </div>

          {/* Título principal */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Gestão de Currículos
            <br />
            <span className="text-blue-200">simplificada</span>
          </h1>

          {/* Subtítulo descritivo */}
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Sistema completo para cadastrar, visualizar e gerenciar currículos
            de candidatos. Desenvolvido com Next.js, Tailwind CSS e shadcn/ui.
          </p>

          {/* Botões de chamada para ação */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* CTA principal: ir para a lista de currículos */}
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-blue-50 font-semibold text-base px-8"
            >
              <Link href="/sistema/paginas/curriculos">
                <FaUsers className="h-5 w-5" aria-hidden="true" />
                Ver Currículos
              </Link>
            </Button>

            {/* CTA secundário: cadastrar novo currículo */}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white bg-transparent hover:bg-white/10 hover:text-white font-semibold text-base px-8"
            >
              <Link href="/sistema/paginas/curriculos/novo">
                Cadastrar Currículo
                <FaArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ================================================================
          SEÇÃO 2: ESTATÍSTICAS
          Números rápidos que reforçam a proposta de valor
          ================================================================ */}
      <section className="py-12 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-4"
                >
                  <Icon className="h-8 w-8 text-primary mb-2" aria-hidden="true" />
                  <span className="text-3xl font-bold text-primary">{stat.value}</span>
                  <span className="text-sm text-muted-foreground mt-1">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          SEÇÃO 3: FUNCIONALIDADES
          Cards detalhando os principais recursos do sistema
          ================================================================ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Cabeçalho da seção */}
          <div className="text-center mb-12">
            <Badge variant="info" className="mb-4">Funcionalidades</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Tudo que você precisa
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Um sistema completo com todas as funcionalidades necessárias para
              uma gestão eficiente de candidatos e currículos.
            </p>
          </div>

          {/* Grade de cards de funcionalidades */}
          {/* Responsivo: 1 coluna no mobile, 2 no tablet, 3 no desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="card-hover border-2 hover:border-primary/20"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      {/* Ícone em container colorido */}
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                      </div>
                      {/* Badge de categoria */}
                      <Badge variant={feature.badgeVariant}>{feature.badge}</Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          SEÇÃO 4: STACK TECNOLÓGICO
          Tecnologias utilizadas no projeto
          ================================================================ */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Stack Tecnológico</h2>
          <p className="text-muted-foreground mb-8">
            Desenvolvido com as melhores tecnologias do ecossistema React/Next.js
          </p>
          {/* Lista de badges com tecnologias */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Next.js 14",
              "React 18",
              "TypeScript",
              "Tailwind CSS",
              "shadcn/ui",
              "React Hook Form",
              "Yup",
              "Sonner",
              "React Icons",
              "localStorage",
            ].map((tech) => (
              <Badge key={tech} variant="outline" className="text-sm px-4 py-2">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          SEÇÃO 5: CALL TO ACTION FINAL
          Última chamada para o usuário começar a usar o sistema
          ================================================================ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Acesse a lista de currículos cadastrados ou adicione um novo candidato agora mesmo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/sistema/paginas/curriculos">
                <FaUsers className="h-5 w-5" aria-hidden="true" />
                Explorar Currículos
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/sistema/paginas/curriculos/novo">
                Cadastrar Agora
                <FaArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
