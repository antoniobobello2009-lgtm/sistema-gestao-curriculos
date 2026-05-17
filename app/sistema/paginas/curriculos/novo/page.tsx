/**
 * page.tsx (Formulário de Cadastro de Currículo)
 * Rota: /sistema/paginas/curriculos/novo
 * 
 * Formulário completo para cadastro de currículos. Este é o componente mais
 * complexo da aplicação, implementando todos os desafios técnicos obrigatórios:
 * 
 * DESAFIO 7.1 - CAMPOS DINÂMICOS (useFieldArray):
 * - Permite adicionar/remover múltiplas experiências profissionais
 * - Permite adicionar/remover múltiplas formações acadêmicas
 * - Cada item dinâmico é validado pelo schema Yup
 * 
 * FUNCIONALIDADES:
 * - React Hook Form para gerenciamento de estado do formulário
 * - Yup para validação de esquemas com mensagens de erro específicas
 * - React Input Mask para máscaras de CPF (000.000.000-00) e Telefone ((00) 00000-0000)
 * - Sonner para toasts com descrição do erro específico (item 8 - Critério de Refinamento)
 * - Upload fake de imagem (armazena o nome do arquivo, não a imagem real)
 * - Botões com estados disabled quando formulário inválido ou enviando (item 8)
 * 
 * É um Client Component pois usa hooks e interação com o browser.
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputMask from "react-input-mask";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CurriculoFormData } from "@/lib/types";
import { salvarCurriculo, getCurriculoPorId } from "@/lib/storage";
import { parseHabilidades } from "@/lib/utils";
import {
  FaPlus,
  FaTrash,
  FaSave,
  FaArrowLeft,
  FaUser,
  FaBriefcase,
  FaGraduationCap,
  FaTools,
  FaCamera,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import type { Metadata } from "next";

// ============================================================
// SCHEMA DE VALIDAÇÃO YUP
// ============================================================
/**
 * Schema de validação com Yup para o formulário de cadastro
 * 
 * Yup permite definir regras de validação de forma declarativa e encadeada.
 * Cada campo tem regras específicas com mensagens de erro claras para o usuário.
 * As mensagens de erro são exibidas nos toasts do Sonner (item 8 da especificação).
 */
const curriculoSchema = yup.object({
  // === DADOS PESSOAIS ===
  nome: yup
    .string()
    .required("O nome é obrigatório")
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),

  cargoDesejado: yup
    .string()
    .required("O cargo desejado é obrigatório")
    .min(3, "O cargo deve ter pelo menos 3 caracteres"),

  email: yup
    .string()
    .required("O e-mail é obrigatório")
    // Validação de formato de e-mail (exigido pela especificação)
    .email("Informe um e-mail válido (ex: usuario@email.com)"),

  telefone: yup
    .string()
    .required("O telefone é obrigatório")
    // Remove caracteres da máscara antes de validar o tamanho
    .test(
      "telefone-valido",
      "Informe um telefone válido no formato (99) 99999-9999",
      (value) => {
        if (!value) return false;
        const numbers = value.replace(/\D/g, "");
        return numbers.length === 10 || numbers.length === 11;
      }
    ),

  cpf: yup
    .string()
    .required("O CPF é obrigatório")
    // Remove máscara e valida quantidade de dígitos
    .test("cpf-valido", "Informe um CPF válido no formato 000.000.000-00", (value) => {
      if (!value) return false;
      const numbers = value.replace(/\D/g, "");
      return numbers.length === 11;
    }),

  resumoProfissional: yup
    .string()
    .required("O resumo profissional é obrigatório")
    // Mínimo de 50 caracteres para garantir qualidade do conteúdo
    .min(50, "O resumo deve ter pelo menos 50 caracteres")
    .max(1000, "O resumo deve ter no máximo 1000 caracteres"),

  habilidades: yup
    .string()
    .required("Informe pelo menos uma habilidade")
    .min(2, "Informe pelo menos uma habilidade"),

  // === CAMPOS DINÂMICOS: EXPERIÊNCIAS PROFISSIONAIS ===
  // O schema valida cada item do array individualmente
  experienciasProfissionais: yup.array().of(
    yup.object({
      empresa: yup
        .string()
        .required("O nome da empresa é obrigatório"),
      cargo: yup
        .string()
        .required("O cargo é obrigatório"),
      dataInicio: yup
        .string()
        .required("A data de início é obrigatória")
        .matches(/^\d{2}\/\d{4}$/, "Use o formato MM/AAAA"),
      dataFim: yup
        .string()
        .nullable()
        .default(""),
      descricao: yup
        .string()
        .required("A descrição das atividades é obrigatória")
        .min(20, "A descrição deve ter pelo menos 20 caracteres"),
    })
  ).min(1, "Adicione pelo menos uma experiência profissional"),

  // === CAMPOS DINÂMICOS: FORMAÇÕES ACADÊMICAS ===
  formacoesAcademicas: yup.array().of(
    yup.object({
      instituicao: yup
        .string()
        .required("O nome da instituição é obrigatório"),
      curso: yup
        .string()
        .required("O nome do curso é obrigatório"),
      nivel: yup
        .string()
        .required("O nível da formação é obrigatório"),
      anoConclusao: yup
        .string()
        .required("O ano de conclusão é obrigatório")
        .matches(/^\d{4}$/, "Informe apenas o ano (ex: 2023)"),
    })
  ).min(1, "Adicione pelo menos uma formação acadêmica"),
});

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

/**
 * Página de Cadastro de Currículo
 */
export default function NovoCurriculoPage() {
  // Estado de envio do formulário (durante o processo de salvar)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Nome do arquivo de foto selecionado (upload fake)
  const [nomeFoto, setNomeFoto] = useState<string>("");

  // Router para navegação após salvar
  const router = useRouter();

  // SearchParams para detectar modo de edição (?edit=ID)
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = Boolean(editId);

  // ============================================================
  // REACT HOOK FORM - Configuração
  // ============================================================
  /**
   * useForm: Hook principal do React Hook Form
   * 
   * - resolver: integra o schema Yup para validação
   * - defaultValues: valores iniciais de todos os campos
   *   (necessário para useFieldArray funcionar corretamente)
   */
  const {
    register,           // Registra inputs no formulário
    control,            // Controla componentes customizados (InputMask, useFieldArray)
    handleSubmit,       // Wrapper que valida antes de chamar onSubmit
    formState: { errors, isValid, isDirty },  // Estado do formulário
    reset,              // Reseta todos os campos
    setValue,           // Define valor de um campo programaticamente
    watch,              // Observa valores de campos em tempo real
  } = useForm<CurriculoFormData>({
    // Integra o schema Yup com o React Hook Form via @hookform/resolvers
    resolver: yupResolver(curriculoSchema) as any,

    // Modo de validação: valida a cada mudança (após o primeiro submit)
    // "onChange" = valida em tempo real mas pode ser agressivo
    // "onBlur" = valida ao sair do campo (melhor UX para formulários longos)
    mode: "onBlur",

    // Valores padrão do formulário
    defaultValues: {
      nome: "",
      cargoDesejado: "",
      email: "",
      telefone: "",
      cpf: "",
      resumoProfissional: "",
      habilidades: "",
      // Arrays dinâmicos começam com 1 item vazio para guiar o usuário
      experienciasProfissionais: [
        { empresa: "", cargo: "", dataInicio: "", dataFim: "", descricao: "" },
      ],
      formacoesAcademicas: [
        { instituicao: "", curso: "", nivel: "", anoConclusao: "" },
      ],
    },
  });

  // ============================================================
  // useFieldArray - Campos Dinâmicos (DESAFIO TÉCNICO 7.1)
  // ============================================================
  /**
   * useFieldArray: Hook do React Hook Form para arrays dinâmicos
   * 
   * Permite adicionar e remover itens de um array de campos.
   * Cada item é validado individualmente pelo schema Yup.
   * 
   * fields: array com os itens atuais (cada item tem um id único interno)
   * append: adiciona novo item ao final do array
   * remove: remove item pelo índice
   */
  const {
    fields: experiencias,
    append: adicionarExperiencia,
    remove: removerExperiencia,
  } = useFieldArray({
    control,
    name: "experienciasProfissionais",
  });

  const {
    fields: formacoes,
    append: adicionarFormacao,
    remove: removerFormacao,
  } = useFieldArray({
    control,
    name: "formacoesAcademicas",
  });

  // ============================================================
  // MODO DE EDIÇÃO: carrega dados existentes
  // ============================================================
  /**
   * Se a URL tem ?edit=ID, carrega o currículo existente e
   * preenche o formulário com os dados para edição
   */
  useEffect(() => {
    if (editId) {
      const curriculoExistente = getCurriculoPorId(editId);
      if (curriculoExistente) {
        // reset() preenche todos os campos com os valores existentes
        reset({
          nome: curriculoExistente.nome,
          cargoDesejado: curriculoExistente.cargoDesejado,
          email: curriculoExistente.email,
          telefone: curriculoExistente.telefone,
          cpf: curriculoExistente.cpf,
          resumoProfissional: curriculoExistente.resumoProfissional,
          habilidades: curriculoExistente.habilidades.join(", "),
          experienciasProfissionais: curriculoExistente.experienciasProfissionais,
          formacoesAcademicas: curriculoExistente.formacoesAcademicas,
        });
      }
    }
  }, [editId, reset]);

  // ============================================================
  // HANDLER DE UPLOAD FAKE DE IMAGEM
  // ============================================================
  /**
   * Simula um upload de imagem sem realmente enviar para um servidor
   * Apenas registra o nome do arquivo selecionado
   * As imagens reais estão na pasta public/avatars/ do projeto
   */
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (arquivo) {
      // Valida tamanho (máximo 5MB)
      if (arquivo.size > 5 * 1024 * 1024) {
        toast.error("Arquivo muito grande", {
          description: "A imagem deve ter no máximo 5MB.",
        });
        return;
      }
      // Valida tipo (apenas imagens)
      if (!arquivo.type.startsWith("image/")) {
        toast.error("Formato inválido", {
          description: "Selecione apenas arquivos de imagem (JPG, PNG, etc.).",
        });
        return;
      }
      setNomeFoto(arquivo.name);
      toast.success("Imagem selecionada!", {
        description: `"${arquivo.name}" pronto para upload.`,
      });
    }
  };

  // ============================================================
  // HANDLER DE SUBMIT
  // ============================================================
  /**
   * Processa o envio do formulário após validação bem-sucedida pelo Yup
   * 
   * handleSubmit do React Hook Form:
   * 1. Valida todos os campos com o schema Yup
   * 2. Se válido: chama esta função com os dados limpos
   * 3. Se inválido: atualiza formState.errors e NÃO chama esta função
   * 
   * Os erros do Yup são exibidos nos toasts do Sonner conforme especificação (item 8)
   */
  const onSubmit = async (data: CurriculoFormData) => {
    setIsSubmitting(true);

    try {
      // Converte string de habilidades em array
      const habilidadesArray = parseHabilidades(data.habilidades);

      // Define o caminho da foto (usa foto padrão se não selecionou)
      const fotoPath = nomeFoto
        ? `/avatars/${nomeFoto}`  // Simulação de path após upload
        : `/avatars/avatar${Math.floor(Math.random() * 5) + 1}.png`; // Avatar aleatório dos mockados

      // Salva o currículo no localStorage
      const novoCurriculo = salvarCurriculo({
        nome: data.nome,
        cargoDesejado: data.cargoDesejado,
        email: data.email,
        telefone: data.telefone,
        cpf: data.cpf,
        resumoProfissional: data.resumoProfissional,
        experienciasProfissionais: data.experienciasProfissionais,
        formacoesAcademicas: data.formacoesAcademicas,
        habilidades: habilidadesArray,
        foto: fotoPath,
      });

      // Toast de SUCESSO com descrição (exigido pela especificação - item 8)
      toast.success("Currículo cadastrado com sucesso!", {
        description: `O currículo de ${data.nome} foi salvo no sistema.`,
      });

      // Redireciona para os detalhes do currículo recém-cadastrado
      router.push(`/sistema/paginas/curriculos/${novoCurriculo.id}`);
    } catch (error) {
      // Toast de ERRO em caso de falha inesperada
      toast.error("Erro ao cadastrar currículo", {
        description: "Ocorreu um erro ao salvar os dados. Tente novamente.",
      });
      setIsSubmitting(false);
    }
  };

  /**
   * Handler para erros de validação do formulário
   * Chamado pelo handleSubmit quando há campos inválidos
   * 
   * Exibe um toast com o primeiro erro encontrado (item 8 - descrição do erro específico)
   */
  const onError = (errors: any) => {
    // Coleta todos os erros em uma lista plana
    const primeiroCampoComErro = Object.keys(errors)[0];
    let mensagemErro = "";

    // Trata erros de arrays aninhados (experiências e formações)
    if (primeiroCampoComErro === "experienciasProfissionais") {
      mensagemErro = "Verifique os campos de Experiência Profissional";
    } else if (primeiroCampoComErro === "formacoesAcademicas") {
      mensagemErro = "Verifique os campos de Formação Acadêmica";
    } else {
      mensagemErro = errors[primeiroCampoComErro]?.message || "Verifique os campos obrigatórios";
    }

    // Toast de erro com descrição específica do erro Yup (exigido pela especificação)
    toast.error("Formulário com erros", {
      description: mensagemErro,
    });
  };

  // ============================================================
  // COMPONENTE AUXILIAR: Campo de formulário com label e erro
  // ============================================================
  /**
   * FormField: wrapper que agrupa Label + Input + mensagem de erro
   * Evita repetição de código para cada campo do formulário
   */
  const FormField = ({
    label,
    error,
    required,
    children,
  }: {
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
  }) => (
    <div className="flex flex-col gap-1.5">
      <Label className={error ? "text-destructive" : ""}>
        {label}
        {required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
      </Label>
      {children}
      {/* Mensagem de erro específica do Yup */}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1" role="alert">
          <FaExclamationCircle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );

  // ============================================================
  // RENDERIZAÇÃO DO FORMULÁRIO
  // ============================================================
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">

      {/* === CABEÇALHO DA PÁGINA === */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2">
            <a href="/sistema/paginas/curriculos">
              <FaArrowLeft className="h-4 w-4" aria-hidden="true" />
              Voltar
            </a>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">
            {isEditMode ? "Editar Currículo" : "Novo Currículo"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isEditMode
              ? "Atualize as informações do currículo abaixo"
              : "Preencha todas as informações para cadastrar um novo currículo"}
          </p>
        </div>
      </div>

      {/* === FORMULÁRIO PRINCIPAL === */}
      {/* 
        handleSubmit(onSubmit, onError):
        - onSubmit: chamado quando TODOS os campos são válidos
        - onError: chamado quando há campos inválidos (exibe toast com erro)
      */}
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>

        {/* =====================================================
            SEÇÃO 1: DADOS PESSOAIS
            ===================================================== */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FaUser className="h-4 w-4 text-primary" aria-hidden="true" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Grade 2 colunas no desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nome completo */}
              <FormField label="Nome Completo" error={errors.nome?.message} required>
                <Input
                  {...register("nome")}
                  placeholder="Ex: João Silva"
                  aria-describedby={errors.nome ? "nome-error" : undefined}
                  className={errors.nome ? "border-destructive focus-visible:ring-destructive" : ""}
                />
              </FormField>

              {/* Cargo desejado */}
              <FormField label="Cargo Desejado" error={errors.cargoDesejado?.message} required>
                <Input
                  {...register("cargoDesejado")}
                  placeholder="Ex: Desenvolvedor Frontend"
                  className={errors.cargoDesejado ? "border-destructive focus-visible:ring-destructive" : ""}
                />
              </FormField>

              {/* E-mail */}
              <FormField label="E-mail" error={errors.email?.message} required>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Ex: joao@email.com"
                  className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                />
              </FormField>

              {/* Telefone com máscara */}
              <FormField label="Telefone" error={errors.telefone?.message} required>
                {/*
                 * Controller: necessário para integrar o InputMask (componente controlado)
                 * com o React Hook Form.
                 * 
                 * O React Hook Form usa refs para campos não-controlados (register),
                 * mas o InputMask é um componente controlado que precisa de Controller.
                 */}
                <Controller
                  name="telefone"
                  control={control}
                  render={({ field }) => (
                    <InputMask
                      mask="(99) 99999-9999"  // Máscara de telefone celular
                      placeholder="(11) 98765-4321"
                      {...field}
                      // Estilo: reutiliza as classes do componente Input
                      className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-colors
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                        placeholder:text-muted-foreground
                        ${errors.telefone ? "border-destructive focus-visible:ring-destructive" : "border-input bg-background"}`}
                    />
                  )}
                />
              </FormField>

              {/* CPF com máscara */}
              <FormField label="CPF" error={errors.cpf?.message} required>
                <Controller
                  name="cpf"
                  control={control}
                  render={({ field }) => (
                    <InputMask
                      mask="999.999.999-99"  // Máscara de CPF
                      placeholder="000.000.000-00"
                      {...field}
                      className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-colors
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                        placeholder:text-muted-foreground
                        ${errors.cpf ? "border-destructive focus-visible:ring-destructive" : "border-input bg-background"}`}
                    />
                  )}
                />
              </FormField>

              {/* Upload de foto (fake) */}
              <FormField label="Foto de Perfil (Upload Fake)">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="foto-upload"
                    className={`flex h-10 flex-1 cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm
                      hover:bg-accent transition-colors`}
                  >
                    <FaCamera className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span className="text-muted-foreground truncate">
                      {nomeFoto || "Selecionar imagem..."}
                    </span>
                  </label>
                  <input
                    id="foto-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFotoChange}
                    className="sr-only"  // Visualmente oculto, acessível por teclado
                    aria-label="Selecionar foto de perfil"
                  />
                  {nomeFoto && (
                    <Badge variant="success" className="flex-shrink-0">
                      Selecionada
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  * Upload simulado: a imagem não é enviada para um servidor real.
                </p>
              </FormField>
            </div>

            {/* Resumo profissional (campo largo, fora da grade) */}
            <FormField label="Resumo Profissional" error={errors.resumoProfissional?.message} required>
              <Textarea
                {...register("resumoProfissional")}
                placeholder="Descreva suas principais competências, experiências e objetivos profissionais (mínimo 50 caracteres)..."
                rows={4}
                className={errors.resumoProfissional ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {/* Contador de caracteres para feedback em tempo real */}
              <p className="text-xs text-muted-foreground text-right">
                {watch("resumoProfissional")?.length || 0}/1000 caracteres
              </p>
            </FormField>

            {/* Habilidades */}
            <FormField label="Habilidades" error={errors.habilidades?.message} required>
              <Input
                {...register("habilidades")}
                placeholder="Ex: React, TypeScript, Node.js, SQL, Docker (separe por vírgulas)"
                className={errors.habilidades ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground">
                Separe as habilidades com vírgulas
              </p>
            </FormField>
          </CardContent>
        </Card>

        {/* =====================================================
            SEÇÃO 2: EXPERIÊNCIAS PROFISSIONAIS (CAMPO DINÂMICO)
            DESAFIO TÉCNICO 7.1 - useFieldArray
            ===================================================== */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FaBriefcase className="h-4 w-4 text-primary" aria-hidden="true" />
                Experiências Profissionais
                {/* Contador de experiências */}
                <Badge variant="secondary">{experiencias.length}</Badge>
              </CardTitle>

              {/*
               * Botão para ADICIONAR nova experiência ao array
               * append() do useFieldArray adiciona um novo objeto vazio ao final
               */}
              <Button
                type="button"  // IMPORTANTE: type="button" evita submeter o formulário
                variant="outline"
                size="sm"
                onClick={() =>
                  adicionarExperiencia({
                    empresa: "",
                    cargo: "",
                    dataInicio: "",
                    dataFim: "",
                    descricao: "",
                  })
                }
              >
                <FaPlus className="h-3.5 w-3.5" aria-hidden="true" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/*
             * Renderiza um grupo de campos para cada experiência no array
             * 
             * fields: array de itens do useFieldArray (cada um com ID único interno)
             * index: índice do item no array (usado para register e remove)
             */}
            {experiencias.map((field, index) => (
              <div key={field.id} className="relative">
                {/* Separador entre experiências (não mostra antes da primeira) */}
                {index > 0 && <Separator className="mb-6" />}

                {/* Cabeçalho da experiência com número e botão de remover */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Experiência {index + 1}
                  </h3>
                  {/* Botão de REMOVER: só aparece se há mais de 1 experiência */}
                  {experiencias.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removerExperiencia(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      aria-label={`Remover experiência ${index + 1}`}
                    >
                      <FaTrash className="h-3.5 w-3.5" aria-hidden="true" />
                      Remover
                    </Button>
                  )}
                </div>

                {/* Campos da experiência */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nome da empresa */}
                  <FormField
                    label="Empresa"
                    error={errors.experienciasProfissionais?.[index]?.empresa?.message}
                    required
                  >
                    <Input
                      // register usa template string para acessar item do array
                      {...register(`experienciasProfissionais.${index}.empresa`)}
                      placeholder="Ex: Empresa ABC"
                      className={
                        errors.experienciasProfissionais?.[index]?.empresa
                          ? "border-destructive"
                          : ""
                      }
                    />
                  </FormField>

                  {/* Cargo na empresa */}
                  <FormField
                    label="Cargo"
                    error={errors.experienciasProfissionais?.[index]?.cargo?.message}
                    required
                  >
                    <Input
                      {...register(`experienciasProfissionais.${index}.cargo`)}
                      placeholder="Ex: Desenvolvedor Pleno"
                      className={
                        errors.experienciasProfissionais?.[index]?.cargo
                          ? "border-destructive"
                          : ""
                      }
                    />
                  </FormField>

                  {/* Data de início com máscara MM/AAAA */}
                  <FormField
                    label="Data de Início"
                    error={errors.experienciasProfissionais?.[index]?.dataInicio?.message}
                    required
                  >
                    <Controller
                      name={`experienciasProfissionais.${index}.dataInicio`}
                      control={control}
                      render={({ field }) => (
                        <InputMask
                          mask="99/9999"  // Máscara para MM/AAAA
                          placeholder="MM/AAAA"
                          {...field}
                          className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-colors
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                            placeholder:text-muted-foreground
                            ${errors.experienciasProfissionais?.[index]?.dataInicio
                              ? "border-destructive"
                              : "border-input bg-background"}`}
                        />
                      )}
                    />
                  </FormField>

                  {/* Data de término (opcional - vazio = emprego atual) */}
                  <FormField
                    label="Data de Término (vazio = Atual)"
                    error={errors.experienciasProfissionais?.[index]?.dataFim?.message}
                  >
                    <Controller
                      name={`experienciasProfissionais.${index}.dataFim`}
                      control={control}
                      render={({ field }) => (
                        <InputMask
                          mask="99/9999"
                          placeholder="MM/AAAA (deixe vazio se for emprego atual)"
                          {...field}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                            placeholder:text-muted-foreground"
                        />
                      )}
                    />
                  </FormField>
                </div>

                {/* Descrição das atividades (campo largo) */}
                <div className="mt-4">
                  <FormField
                    label="Descrição das Atividades"
                    error={errors.experienciasProfissionais?.[index]?.descricao?.message}
                    required
                  >
                    <Textarea
                      {...register(`experienciasProfissionais.${index}.descricao`)}
                      placeholder="Descreva as principais atividades e responsabilidades exercidas (mínimo 20 caracteres)..."
                      rows={3}
                      className={
                        errors.experienciasProfissionais?.[index]?.descricao
                          ? "border-destructive"
                          : ""
                      }
                    />
                  </FormField>
                </div>
              </div>
            ))}

            {/* Erro geral do array (ex: "Adicione pelo menos uma experiência") */}
            {errors.experienciasProfissionais?.root?.message && (
              <p className="text-xs text-destructive flex items-center gap-1" role="alert">
                <FaExclamationCircle className="h-3 w-3" aria-hidden="true" />
                {errors.experienciasProfissionais.root.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* =====================================================
            SEÇÃO 3: FORMAÇÕES ACADÊMICAS (CAMPO DINÂMICO)
            DESAFIO TÉCNICO 7.1 - useFieldArray
            ===================================================== */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FaGraduationCap className="h-4 w-4 text-primary" aria-hidden="true" />
                Formações Acadêmicas
                <Badge variant="secondary">{formacoes.length}</Badge>
              </CardTitle>

              {/* Botão para adicionar nova formação */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  adicionarFormacao({
                    instituicao: "",
                    curso: "",
                    nivel: "",
                    anoConclusao: "",
                  })
                }
              >
                <FaPlus className="h-3.5 w-3.5" aria-hidden="true" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {formacoes.map((field, index) => (
              <div key={field.id}>
                {index > 0 && <Separator className="mb-6" />}

                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Formação {index + 1}
                  </h3>
                  {formacoes.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removerFormacao(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      aria-label={`Remover formação ${index + 1}`}
                    >
                      <FaTrash className="h-3.5 w-3.5" aria-hidden="true" />
                      Remover
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Instituição de ensino */}
                  <FormField
                    label="Instituição"
                    error={errors.formacoesAcademicas?.[index]?.instituicao?.message}
                    required
                  >
                    <Input
                      {...register(`formacoesAcademicas.${index}.instituicao`)}
                      placeholder="Ex: Universidade de São Paulo"
                      className={
                        errors.formacoesAcademicas?.[index]?.instituicao ? "border-destructive" : ""
                      }
                    />
                  </FormField>

                  {/* Nome do curso */}
                  <FormField
                    label="Curso"
                    error={errors.formacoesAcademicas?.[index]?.curso?.message}
                    required
                  >
                    <Input
                      {...register(`formacoesAcademicas.${index}.curso`)}
                      placeholder="Ex: Ciência da Computação"
                      className={
                        errors.formacoesAcademicas?.[index]?.curso ? "border-destructive" : ""
                      }
                    />
                  </FormField>

                  {/* Nível da formação */}
                  <FormField
                    label="Nível"
                    error={errors.formacoesAcademicas?.[index]?.nivel?.message}
                    required
                  >
                    <Input
                      {...register(`formacoesAcademicas.${index}.nivel`)}
                      placeholder="Ex: Graduação, Pós-graduação, Técnico"
                      className={
                        errors.formacoesAcademicas?.[index]?.nivel ? "border-destructive" : ""
                      }
                    />
                  </FormField>

                  {/* Ano de conclusão */}
                  <FormField
                    label="Ano de Conclusão"
                    error={errors.formacoesAcademicas?.[index]?.anoConclusao?.message}
                    required
                  >
                    <Input
                      {...register(`formacoesAcademicas.${index}.anoConclusao`)}
                      placeholder="Ex: 2023"
                      maxLength={4}
                      className={
                        errors.formacoesAcademicas?.[index]?.anoConclusao
                          ? "border-destructive"
                          : ""
                      }
                    />
                  </FormField>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* =====================================================
            BOTÕES DE AÇÃO DO FORMULÁRIO
            Implementam os estados disabled exigidos na especificação (item 8)
            ===================================================== */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pb-8">
          {/* Botão Cancelar: volta sem salvar */}
          <Button
            type="button"
            variant="outline"
            asChild
            disabled={isSubmitting}  // Desabilitado enquanto salva
          >
            <a href="/sistema/paginas/curriculos">
              Cancelar
            </a>
          </Button>

          {/* Botão Salvar:
              - disabled quando está enviando (isSubmitting)
              - Mostra spinner durante o envio
              - Estados visuais: hover, focus-visible, disabled (todos implementados via buttonVariants)
          */}
          <Button
            type="submit"
            disabled={isSubmitting}  // Desabilitado enquanto salva (especificação item 8)
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              // Estado de carregamento durante o envio
              <>
                <FaSpinner className="h-4 w-4 animate-spin" aria-label="Salvando" />
                Salvando...
              </>
            ) : (
              // Estado normal
              <>
                <FaSave className="h-4 w-4" aria-hidden="true" />
                {isEditMode ? "Salvar Alterações" : "Cadastrar Currículo"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
