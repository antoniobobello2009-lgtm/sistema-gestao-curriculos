/**
 * storage.ts
 * Camada de abstração para persistência de dados no localStorage
 * 
 * Esta camada simula um banco de dados utilizando o localStorage do browser.
 * Em produção, estas funções seriam substituídas por chamadas a uma API REST.
 * 
 * O localStorage é um mecanismo de armazenamento do browser que:
 * - Persiste dados mesmo após fechar e reabrir o browser
 * - Tem capacidade de ~5MB por domínio
 * - Armazena dados como strings (usamos JSON.stringify/parse)
 * - É síncrono e acessível apenas no lado do cliente (client-side)
 * 
 * IMPORTANTE: Por isso, todas as funções aqui devem ser chamadas apenas em
 * Client Components (com "use client") ou dentro de useEffect
 */

"use client";

import { Curriculo } from "./types";
import { CURRICULOS_MOCK, STORAGE_KEY } from "./mock-data";
import { generateId } from "./utils";

/**
 * Inicializa o storage com dados mockados se estiver vazio
 * Deve ser chamado na primeira renderização da aplicação
 * 
 * @returns void
 */
export function inicializarStorage(): void {
  // Verifica se já existem dados salvos no localStorage
  const dadosSalvos = localStorage.getItem(STORAGE_KEY);

  // Se não existem dados, popula com os dados mockados iniciais
  if (!dadosSalvos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(CURRICULOS_MOCK));
    console.log("Storage inicializado com dados mockados:", CURRICULOS_MOCK.length, "currículos");
  }
}

/**
 * Recupera todos os currículos do localStorage
 * 
 * @returns Array com todos os currículos cadastrados, ordenados por data de cadastro (mais recente primeiro)
 */
export function getCurriculos(): Curriculo[] {
  const dadosSalvos = localStorage.getItem(STORAGE_KEY);

  // Se não há dados, retorna os dados mockados e inicializa o storage
  if (!dadosSalvos) {
    inicializarStorage();
    return CURRICULOS_MOCK;
  }

  // Faz o parse do JSON e garante a ordenação por data de cadastro
  const curriculos: Curriculo[] = JSON.parse(dadosSalvos);
  return curriculos.sort(
    (a, b) => new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime()
  );
}

/**
 * Recupera um currículo específico pelo seu ID
 * 
 * @param id - ID único do currículo a ser buscado
 * @returns O currículo encontrado ou null se não existir
 */
export function getCurriculoPorId(id: string): Curriculo | null {
  const curriculos = getCurriculos();
  // Array.find retorna o primeiro elemento que satisfaz a condição, ou undefined
  return curriculos.find((c) => c.id === id) || null;
}

/**
 * Salva um novo currículo no localStorage
 * Gera automaticamente o ID e a data de cadastro
 * 
 * @param dados - Dados do currículo sem ID e data de cadastro
 * @returns O currículo recém-criado com ID e data gerados
 */
export function salvarCurriculo(dados: Omit<Curriculo, "id" | "dataCadastro">): Curriculo {
  const curriculos = getCurriculos();

  // Cria o novo currículo com ID único e data de cadastro atual
  const novoCurriculo: Curriculo = {
    ...dados,
    id: generateId(),          // Gera ID único com timestamp + número aleatório
    dataCadastro: new Date().toISOString(), // Data e hora atual em formato padrão
  };

  // Adiciona ao início do array para aparecer primeiro na listagem
  const curriculosAtualizados = [novoCurriculo, ...curriculos];

  // Persiste no localStorage como string JSON
  localStorage.setItem(STORAGE_KEY, JSON.stringify(curriculosAtualizados));

  console.log("Currículo salvo com sucesso! ID:", novoCurriculo.id);
  return novoCurriculo;
}

/**
 * Atualiza um currículo existente no localStorage
 * 
 * @param id - ID do currículo a ser atualizado
 * @param dados - Novos dados (parciais ou completos)
 * @returns O currículo atualizado ou null se não encontrado
 */
export function atualizarCurriculo(id: string, dados: Partial<Curriculo>): Curriculo | null {
  const curriculos = getCurriculos();

  // Encontra o índice do currículo no array
  const index = curriculos.findIndex((c) => c.id === id);

  // Retorna null se não encontrar
  if (index === -1) {
    console.error("Currículo não encontrado para atualização. ID:", id);
    return null;
  }

  // Mescla os dados existentes com os novos dados (spread operator)
  const curriculoAtualizado = { ...curriculos[index], ...dados };
  curriculos[index] = curriculoAtualizado;

  // Persiste a lista atualizada
  localStorage.setItem(STORAGE_KEY, JSON.stringify(curriculos));

  console.log("Currículo atualizado com sucesso! ID:", id);
  return curriculoAtualizado;
}

/**
 * Remove um currículo do localStorage
 * 
 * @param id - ID do currículo a ser removido
 * @returns true se removido com sucesso, false se não encontrado
 */
export function deletarCurriculo(id: string): boolean {
  const curriculos = getCurriculos();

  // Filtra o array removendo o currículo com o ID especificado
  const curriculosFiltrados = curriculos.filter((c) => c.id !== id);

  // Se o tamanho não mudou, o currículo não foi encontrado
  if (curriculosFiltrados.length === curriculos.length) {
    console.error("Currículo não encontrado para exclusão. ID:", id);
    return false;
  }

  // Persiste a lista sem o currículo deletado
  localStorage.setItem(STORAGE_KEY, JSON.stringify(curriculosFiltrados));

  console.log("Currículo deletado com sucesso! ID:", id);
  return true;
}
