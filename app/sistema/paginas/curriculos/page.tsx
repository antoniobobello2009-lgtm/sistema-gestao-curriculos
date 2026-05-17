/**
 * page.tsx (Lista de Currículos)
 * Rota: /sistema/paginas/curriculos
 * 
 * Exibe todos os currículos cadastrados em formato de grid de cards.
 * Implementa filtro em tempo real por nome ou cargo (Desafio Técnico 7.2)
 * com debounce para otimizar performance.
 * 
 * É um Client Component ("use client") porque:
 * - Precisa de useState para o campo de busca e lista filtrada
 * - Precisa de useEffect para carregar dados do localStorage
 * - Precisa de useCallback para o debounce da busca
 * 
 * O localStorage só é acessível no client-side (browser), nunca no servidor.
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { CurriculoCard } from "@/components/curriculos/CurriculoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Curriculo } from "@/lib/types";
import { getCurriculos, inicializarStorage } from "@/lib/storage";
import {
  FaUserPlus,
  FaSearch,
  FaFilter,
  FaUsers,
  FaSpinner,
} from "react-icons/fa";

/**
 * Página de Lista de Currículos
 * Filtro em tempo real com debounce de 300ms conforme especificação
 */
export default function CurriculosPage() {
  // Estado da lista completa de currículos (dados do localStorage)
  const [curriculos, setCurriculos] = useState<Curriculo[]>([]);

  // Estado da lista filtrada (exibida na tela)
  const [curriculosFiltrados, setCurriculosFiltrados] = useState<Curriculo[]>([]);

  // Estado do campo de busca (texto digitado pelo usuário)
  const [busca, setBusca] = useState("");

  // Estado de carregamento inicial (enquanto lê o localStorage)
  const [isLoading, setIsLoading] = useState(true);

  // Ref para o timer do debounce (evita criar novo timer a cada tecla pressionada)
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  /**
   * Efeito de inicialização
   * Carrega os currículos do localStorage quando o componente monta
   * 
   * Usa setTimeout(0) para garantir que o código rode no browser
   * (após a hidratação do React) e não no servidor
   */
  useEffect(() => {
    // Inicializa o storage com dados mockados se estiver vazio
    inicializarStorage();

    // Carrega os currículos
    const dados = getCurriculos();
    setCurriculos(dados);
    setCurriculosFiltrados(dados);
    setIsLoading(false);
  }, []); // [] = executa apenas uma vez, na montagem do componente

  /**
   * Função de filtro com Debounce
   * 
   * Debounce: técnica que atrasa a execução de uma função até que o usuário
   * pare de digitar por um período (aqui 300ms). Isso evita filtrar a lista
   * a cada tecla pressionada, melhorando performance com listas grandes.
   * 
   * useCallback memoriza a função para evitar re-criações desnecessárias
   */
  const filtrarComDebounce = useCallback(
    (termoBusca: string) => {
      // Cancela o timer anterior se o usuário ainda está digitando
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Cria novo timer de 300ms
      debounceTimerRef.current = setTimeout(() => {
        const termo = termoBusca.toLowerCase().trim();

        if (!termo) {
          // Se o campo está vazio, mostra todos os currículos
          setCurriculosFiltrados(curriculos);
          return;
        }

        // Filtra por nome OU cargo desejado (case-insensitive)
        const filtrados = curriculos.filter(
          (curriculo) =>
            curriculo.nome.toLowerCase().includes(termo) ||
            curriculo.cargoDesejado.toLowerCase().includes(termo)
        );

        setCurriculosFiltrados(filtrados);
      }, 300); // 300ms de debounce
    },
    [curriculos] // Recria a função apenas quando a lista base mudar
  );

  /**
   * Handler do campo de busca
   * Chamado a cada tecla pressionada no input de busca
   */
  const handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setBusca(valor);              // Atualiza o valor do input imediatamente
    filtrarComDebounce(valor);    // Filtra com debounce
  };

  /**
   * Limpa o filtro de busca
   */
  const limparFiltro = () => {
    setBusca("");
    setCurriculosFiltrados(curriculos);
  };

  // Enquanto carrega os dados, exibe um spinner
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <FaSpinner className="h-8 w-8 animate-spin" aria-label="Carregando" />
          <p>Carregando currículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">

      {/* === CABEÇALHO DA PÁGINA === */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FaUsers className="h-6 w-6 text-primary" aria-hidden="true" />
            <h1 className="text-2xl md:text-3xl font-bold">Currículos</h1>
          </div>
          <p className="text-muted-foreground">
            {/* Mostra contagem de resultados filtrados vs total */}
            {busca
              ? `${curriculosFiltrados.length} de ${curriculos.length} currículos encontrados`
              : `${curriculos.length} currículos cadastrados`}
          </p>
        </div>

        {/* Botão para cadastrar novo currículo */}
        <Button asChild>
          <Link href="/sistema/paginas/curriculos/novo">
            <FaUserPlus className="h-4 w-4" aria-hidden="true" />
            Novo Currículo
          </Link>
        </Button>
      </div>

      {/* === BARRA DE BUSCA E FILTROS === */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Campo de busca com ícone */}
        <div className="relative flex-1">
          <FaSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Buscar por nome ou cargo..."
            value={busca}
            onChange={handleBuscaChange}
            className="pl-9"  // Padding esquerdo para não sobrepor o ícone
            aria-label="Buscar currículos por nome ou cargo"
          />
        </div>

        {/* Indicador de filtro ativo + botão para limpar */}
        {busca && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <FaFilter className="h-3 w-3" aria-hidden="true" />
              Filtro ativo
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={limparFiltro}
              aria-label="Limpar filtro de busca"
            >
              Limpar
            </Button>
          </div>
        )}
      </div>

      {/* === GRID DE CARDS DE CURRÍCULOS === */}
      {curriculosFiltrados.length > 0 ? (
        // Grade responsiva: 1 coluna mobile, 2 tablet, 3 desktop
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {curriculosFiltrados.map((curriculo) => (
            // Cada card tem animação de entrada escalonada
            <div key={curriculo.id} className="animate-fade-in">
              <CurriculoCard curriculo={curriculo} />
            </div>
          ))}
        </div>
      ) : (
        /* === ESTADO VAZIO: nenhum resultado encontrado === */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <FaSearch className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {busca ? "Nenhum currículo encontrado" : "Nenhum currículo cadastrado"}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            {busca
              ? `Não encontramos currículos para "${busca}". Tente buscar por outro nome ou cargo.`
              : "Ainda não há currículos cadastrados. Comece adicionando o primeiro!"}
          </p>
          {busca ? (
            <Button variant="outline" onClick={limparFiltro}>
              Limpar busca
            </Button>
          ) : (
            <Button asChild>
              <Link href="/sistema/paginas/curriculos/novo">
                <FaUserPlus className="h-4 w-4" aria-hidden="true" />
                Cadastrar primeiro currículo
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
