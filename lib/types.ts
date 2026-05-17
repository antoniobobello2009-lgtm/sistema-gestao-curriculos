/**
 * types.ts
 * Definições de tipos TypeScript para o Sistema de Gestão de Currículos
 * 
 * Centralizar os tipos aqui garante consistência em toda a aplicação
 * e facilita a manutenção. Qualquer mudança na estrutura de dados
 * é refletida automaticamente em todos os componentes que usam esses tipos.
 */

/**
 * Representa uma experiência profissional de um candidato
 * Contém as informações necessárias para descrever um emprego anterior
 */
export interface ExperienciaProfissional {
  /** Nome da empresa onde o candidato trabalhou */
  empresa: string;
  /** Cargo ocupado na empresa */
  cargo: string;
  /** Data de início no formato MM/AAAA */
  dataInicio: string;
  /** Data de término no formato MM/AAAA - vazio se for o emprego atual */
  dataFim: string;
  /** Descrição das atividades e responsabilidades exercidas */
  descricao: string;
}

/**
 * Representa uma formação acadêmica do candidato
 * Inclui cursos de graduação, pós-graduação, técnicos, etc.
 */
export interface FormacaoAcademica {
  /** Nome da instituição de ensino */
  instituicao: string;
  /** Nome do curso ou área de estudo */
  curso: string;
  /** Nível da formação (Graduação, Pós-graduação, Técnico, etc.) */
  nivel: string;
  /** Ano de conclusão do curso */
  anoConclusao: string;
}

/**
 * Representa um currículo completo no sistema
 * Esta é a entidade principal da aplicação
 */
export interface Curriculo {
  /** Identificador único do currículo - gerado automaticamente */
  id: string;
  /** Nome completo do candidato */
  nome: string;
  /** Cargo ou função desejada pelo candidato */
  cargoDesejado: string;
  /** Email de contato profissional */
  email: string;
  /** Telefone de contato com máscara aplicada */
  telefone: string;
  /** CPF do candidato com máscara aplicada */
  cpf: string;
  /** Resumo ou objetivo profissional - texto livre */
  resumoProfissional: string;
  /** Lista de experiências profissionais anteriores */
  experienciasProfissionais: ExperienciaProfissional[];
  /** Lista de formações acadêmicas */
  formacoesAcademicas: FormacaoAcademica[];
  /** Lista de habilidades técnicas e comportamentais */
  habilidades: string[];
  /** 
   * Caminho para a foto de perfil do candidato
   * Pode ser um path local (pasta public/) ou URL externa 
   */
  foto: string;
  /** Data de cadastro no formato ISO 8601 */
  dataCadastro: string;
}

/**
 * Dados do formulário de cadastro
 * Similar ao tipo Curriculo mas sem campos gerados automaticamente (id, dataCadastro)
 * Usado para tipagem dos dados do React Hook Form
 */
export interface CurriculoFormData {
  nome: string;
  cargoDesejado: string;
  email: string;
  telefone: string;
  cpf: string;
  resumoProfissional: string;
  experienciasProfissionais: ExperienciaProfissional[];
  formacoesAcademicas: FormacaoAcademica[];
  /** String com habilidades separadas por vírgula - processada ao salvar */
  habilidades: string;
  /** Arquivo de imagem selecionado pelo usuário (upload fake) */
  foto?: FileList;
}

/**
 * Props do componente de card de currículo na listagem
 */
export interface CurriculoCardProps {
  curriculo: Curriculo;
}

/**
 * Parâmetros das rotas dinâmicas do Next.js
 * Usado na página de detalhes /sistema/paginas/curriculos/[id]
 */
export interface PageProps {
  params: {
    id: string;
  };
}
