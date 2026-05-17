/**
 * page.tsx (Detalhes do Currículo)
 * Rota: /sistema/paginas/curriculos/[id]
 * 
 * Exibe todas as informações de um currículo específico e oferece
 * ações de gestão (editar, deletar, voltar).
 * 
 * É uma rota dinâmica do Next.js: o [id] na URL é extraído dos
 * params e usado para buscar o currículo no localStorage.
 * 
 * É um Client Component porque:
 * - Precisa de useEffect para carregar dados do localStorage
 * - Precisa de useState para gerenciar o currículo e estado de loading
 * - Usa router.push() para navegação programática após deletar
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Curriculo } from "@/lib/types";
import { getCurriculoPorId, deletarCurriculo } from "@/lib/storage";
import { formatarData } from "@/lib/utils";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaBriefcase,
  FaGraduationCap,
  FaTools,
  FaBuilding,
  FaCalendarAlt,
  FaSpinner,
  FaExclamationTriangle,
  FaUser,
} from "react-icons/fa";

/**
 * Props da página de detalhes (parâmetros dinâmicos do Next.js)
 */
interface PageProps {
  params: { id: string };
}

/**
 * Página de Detalhes do Currículo
 * Exibe informações completas do candidato com ações de gestão
 */
export default function CurriculoDetalhesPage({ params }: PageProps) {
  // Dados do currículo carregado do localStorage
  const [curriculo, setCurriculo] = useState<Curriculo | null>(null);

  // Estado de carregamento
  const [isLoading, setIsLoading] = useState(true);

  // Estado de confirmação de exclusão (controla o diálogo de confirmação)
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

  // Estado de processamento durante a exclusão
  const [excluindo, setExcluindo] = useState(false);

  // Router do Next.js para navegação programática
  const router = useRouter();

  /**
   * Carrega o currículo pelo ID dos params quando o componente monta
   */
  useEffect(() => {
    const dados = getCurriculoPorId(params.id);
    setCurriculo(dados);
    setIsLoading(false);
  }, [params.id]); // Recarrega se o ID mudar

  /**
   * Inicia o processo de exclusão do currículo
   * Primeiro pede confirmação ao usuário
   */
  const iniciarExclusao = () => {
    setConfirmandoExclusao(true);
  };

  /**
   * Cancela a confirmação de exclusão
   */
  const cancelarExclusao = () => {
    setConfirmandoExclusao(false);
  };

  /**
   * Confirma e executa a exclusão do currículo
   * Exibe toast de sucesso ou erro via Sonner
   */
  const confirmarExclusao = async () => {
    if (!curriculo) return;

    setExcluindo(true);

    try {
      // Tenta deletar o currículo do localStorage
      const sucesso = deletarCurriculo(curriculo.id);

      if (sucesso) {
        // Toast de sucesso com mensagem descritiva (exigido pela especificação)
        toast.success("Currículo excluído com sucesso!", {
          description: `O currículo de ${curriculo.nome} foi removido do sistema.`,
        });

        // Redireciona para a lista após exclusão bem-sucedida
        router.push("/sistema/paginas/curriculos");
      } else {
        // Toast de erro se não encontrou o currículo
        toast.error("Erro ao excluir currículo", {
          description: "O currículo não foi encontrado no sistema. Tente recarregar a página.",
        });
        setExcluindo(false);
        setConfirmandoExclusao(false);
      }
    } catch (error) {
      // Toast de erro para exceções inesperadas
      toast.error("Erro inesperado ao excluir", {
        description: "Ocorreu um erro interno. Tente novamente mais tarde.",
      });
      setExcluindo(false);
      setConfirmandoExclusao(false);
    }
  };

  // === ESTADOS DE RENDERIZAÇÃO ===

  // Estado: carregando dados
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <FaSpinner className="h-8 w-8 animate-spin" aria-label="Carregando" />
          <p>Carregando currículo...</p>
        </div>
      </div>
    );
  }

  // Estado: currículo não encontrado
  if (!curriculo) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <FaExclamationTriangle className="h-7 w-7 text-destructive" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Currículo não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            O currículo com ID "{params.id}" não existe ou foi removido.
          </p>
          <Button asChild>
            <Link href="/sistema/paginas/curriculos">
              <FaArrowLeft className="h-4 w-4" aria-hidden="true" />
              Voltar para a lista
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Estado: currículo carregado - renderiza as informações completas
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">

      {/* === BARRA DE AÇÕES SUPERIOR === */}
      <div className="flex items-center justify-between mb-6">
        {/* Botão de voltar para a lista */}
        <Button asChild variant="ghost" size="sm">
          <Link href="/sistema/paginas/curriculos">
            <FaArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar para a lista
          </Link>
        </Button>

        {/* Ações de gestão: Editar e Deletar */}
        <div className="flex items-center gap-2">
          {/* Botão de editar (redireciona para o formulário em modo de edição) */}
          <Button asChild variant="outline" size="sm">
            <Link href={`/sistema/paginas/curriculos/novo?edit=${curriculo.id}`}>
              <FaEdit className="h-4 w-4" aria-hidden="true" />
              Editar
            </Link>
          </Button>

          {/* Botão de excluir */}
          {!confirmandoExclusao ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={iniciarExclusao}
            >
              <FaTrash className="h-4 w-4" aria-hidden="true" />
              Excluir
            </Button>
          ) : (
            /* === CONFIRMAÇÃO DE EXCLUSÃO === */
            /* Aparece inline ao invés de um modal para simplificar */
            <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-md px-3 py-1.5">
              <span className="text-xs text-destructive font-medium">Confirmar exclusão?</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={confirmarExclusao}
                disabled={excluindo}
                className="h-7 text-xs"
              >
                {excluindo ? (
                  <FaSpinner className="h-3 w-3 animate-spin" aria-label="Excluindo" />
                ) : (
                  "Sim, excluir"
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelarExclusao}
                disabled={excluindo}
                className="h-7 text-xs"
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* === CARD PRINCIPAL: PERFIL DO CANDIDATO === */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Foto de perfil grande */}
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-primary/20 flex-shrink-0 mx-auto sm:mx-0">
              <Image
                src={curriculo.foto}
                alt={`Foto de ${curriculo.nome}`}
                fill
                className="object-cover"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(curriculo.nome)}&background=1e3a5f&color=fff&size=96`;
                }}
              />
            </div>

            {/* Informações básicas do candidato */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-1">{curriculo.nome}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                <FaBriefcase className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className="text-lg text-primary font-medium">{curriculo.cargoDesejado}</span>
              </div>

              {/* Informações de contato em linha */}
              <div className="flex flex-col sm:flex-row gap-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <FaEnvelope className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{curriculo.email}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <FaPhone className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{curriculo.telefone}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <FaIdCard className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>CPF: {curriculo.cpf}</span>
                </div>
              </div>

              {/* Data de cadastro */}
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-muted-foreground mt-2">
                <FaCalendarAlt className="h-3 w-3" aria-hidden="true" />
                <span>Cadastrado em {formatarData(curriculo.dataCadastro)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* === RESUMO PROFISSIONAL === */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FaUser className="h-4 w-4 text-primary" aria-hidden="true" />
            Resumo Profissional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {curriculo.resumoProfissional}
          </p>
        </CardContent>
      </Card>

      {/* === HABILIDADES === */}
      {curriculo.habilidades.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FaTools className="h-4 w-4 text-primary" aria-hidden="true" />
              Habilidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Exibe todas as habilidades como badges */}
            <div className="flex flex-wrap gap-2">
              {curriculo.habilidades.map((habilidade) => (
                <Badge key={habilidade} variant="info" className="text-sm">
                  {habilidade}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* === EXPERIÊNCIAS PROFISSIONAIS === */}
      {curriculo.experienciasProfissionais.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FaBriefcase className="h-4 w-4 text-primary" aria-hidden="true" />
              Experiências Profissionais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {curriculo.experienciasProfissionais.map((exp, index) => (
              <div key={index}>
                {/* Separador entre experiências (não adiciona antes da primeira) */}
                {index > 0 && <Separator className="mb-4" />}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                  <div>
                    <h3 className="font-semibold">{exp.cargo}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-primary">
                      <FaBuilding className="h-3 w-3" aria-hidden="true" />
                      <span>{exp.empresa}</span>
                    </div>
                  </div>
                  {/* Período da experiência */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <FaCalendarAlt className="h-3 w-3" aria-hidden="true" />
                    <span>
                      {exp.dataInicio} — {exp.dataFim || "Atual"}
                    </span>
                  </div>
                </div>
                {exp.descricao && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {exp.descricao}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* === FORMAÇÕES ACADÊMICAS === */}
      {curriculo.formacoesAcademicas.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FaGraduationCap className="h-4 w-4 text-primary" aria-hidden="true" />
              Formações Acadêmicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {curriculo.formacoesAcademicas.map((form, index) => (
              <div key={index}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                  <div>
                    <h3 className="font-semibold">{form.curso}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-primary">
                      <FaBuilding className="h-3 w-3" aria-hidden="true" />
                      <span>{form.instituicao}</span>
                    </div>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {form.nivel}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <FaCalendarAlt className="h-3 w-3" aria-hidden="true" />
                    <span>Conclusão: {form.anoConclusao}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
