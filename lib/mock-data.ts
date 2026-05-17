/**
 * mock-data.ts
 * Dados mockados (simulados) para o Sistema de Gestão de Currículos
 * 
 * IMPORTANTE: Em uma aplicação real, esses dados viriam de uma API/banco de dados.
 * Para o propósito deste trabalho, os dados são armazenados em constantes e
 * persistidos no localStorage do browser para simular um backend.
 * 
 * Os dados mockados iniciais servem como "seed" (semente) para popular
 * o sistema com exemplos realistas antes de qualquer cadastro.
 */

import { Curriculo } from "./types";

/**
 * Dados iniciais mockados de currículos
 * Contém 5 candidatos com perfis variados para demonstrar todas as funcionalidades
 */
export const CURRICULOS_MOCK: Curriculo[] = [
  {
    id: "curr_001",
    nome: "Ana Carolina Silva",
    cargoDesejado: "Desenvolvedora Frontend Senior",
    email: "ana.silva@email.com",
    telefone: "(11) 98765-4321",
    cpf: "123.456.789-00",
    resumoProfissional:
      "Desenvolvedora Frontend com 6 anos de experiência em React, Next.js e TypeScript. Apaixonada por criar interfaces modernas e acessíveis. Experiência com times ágeis e metodologia Scrum.",
    experienciasProfissionais: [
      {
        empresa: "TechCorp Brasil",
        cargo: "Desenvolvedora Frontend Senior",
        dataInicio: "01/2022",
        dataFim: "",
        descricao:
          "Liderança técnica de um time de 4 desenvolvedores. Arquitetura de componentes com React e TypeScript. Implementação de design system com Storybook.",
      },
      {
        empresa: "Startup Inovação",
        cargo: "Desenvolvedora Frontend Pleno",
        dataInicio: "03/2019",
        dataFim: "12/2021",
        descricao:
          "Desenvolvimento de aplicações SPA com React e Redux. Integração com APIs REST e GraphQL. Otimização de performance (Lighthouse score > 90).",
      },
    ],
    formacoesAcademicas: [
      {
        instituicao: "Universidade de São Paulo (USP)",
        curso: "Ciência da Computação",
        nivel: "Graduação",
        anoConclusao: "2018",
      },
      {
        instituicao: "Alura",
        curso: "React e TypeScript - Formação Completa",
        nivel: "Curso Livre",
        anoConclusao: "2020",
      },
    ],
    habilidades: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GraphQL", "Git", "Docker"],
    foto: "/avatars/avatar1.png",
    dataCadastro: new Date("2024-01-15").toISOString(),
  },
  {
    id: "curr_002",
    nome: "Bruno Ferreira Santos",
    cargoDesejado: "Engenheiro de Software Backend",
    email: "bruno.santos@email.com",
    telefone: "(21) 97654-3210",
    cpf: "987.654.321-00",
    resumoProfissional:
      "Engenheiro de Software com foco em backend e arquitetura de sistemas. 8 anos de experiência com Java, Spring Boot e microsserviços. Especialista em sistemas de alta disponibilidade.",
    experienciasProfissionais: [
      {
        empresa: "Banco Digital XYZ",
        cargo: "Engenheiro de Software Senior",
        dataInicio: "06/2020",
        dataFim: "",
        descricao:
          "Desenvolvimento de microsserviços com Spring Boot e Kubernetes. Processamento de transações financeiras em alta escala. Implementação de filas com Apache Kafka.",
      },
      {
        empresa: "Empresa ABC Tecnologia",
        cargo: "Desenvolvedor Java Pleno",
        dataInicio: "01/2017",
        dataFim: "05/2020",
        descricao:
          "Manutenção e evolução de sistemas legados em Java EE. Migração de monolito para microsserviços.",
      },
    ],
    formacoesAcademicas: [
      {
        instituicao: "PUC-Rio",
        curso: "Engenharia da Computação",
        nivel: "Graduação",
        anoConclusao: "2016",
      },
      {
        instituicao: "Coursera / Stanford",
        curso: "Machine Learning Specialization",
        nivel: "Especialização Online",
        anoConclusao: "2022",
      },
    ],
    habilidades: ["Java", "Spring Boot", "Kubernetes", "Apache Kafka", "PostgreSQL", "MongoDB", "AWS"],
    foto: "/avatars/avatar2.png",
    dataCadastro: new Date("2024-02-20").toISOString(),
  },
  {
    id: "curr_003",
    nome: "Carla Mendes Oliveira",
    cargoDesejado: "UX/UI Designer",
    email: "carla.mendes@email.com",
    telefone: "(31) 96543-2109",
    cpf: "456.789.123-00",
    resumoProfissional:
      "Designer de UX/UI com 5 anos de experiência criando experiências digitais centradas no usuário. Domínio de Figma, pesquisa com usuários e prototipagem de alta fidelidade.",
    experienciasProfissionais: [
      {
        empresa: "Agência Criativa Design",
        cargo: "UX/UI Designer Senior",
        dataInicio: "08/2021",
        dataFim: "",
        descricao:
          "Criação de design systems para clientes de grande porte. Condução de pesquisas com usuários e testes de usabilidade. Prototipagem interativa com Figma e Protopie.",
      },
      {
        empresa: "App Saúde Brasil",
        cargo: "Designer UX",
        dataInicio: "04/2019",
        dataFim: "07/2021",
        descricao:
          "Design de interfaces para aplicativo de saúde com 500k usuários ativos. Colaboração estreita com times de desenvolvimento e produto.",
      },
    ],
    formacoesAcademicas: [
      {
        instituicao: "ESPM São Paulo",
        curso: "Design Gráfico",
        nivel: "Graduação",
        anoConclusao: "2018",
      },
      {
        instituicao: "Interaction Design Foundation",
        curso: "UX Design - Certificação Internacional",
        nivel: "Certificação",
        anoConclusao: "2020",
      },
    ],
    habilidades: ["Figma", "Adobe XD", "Protopie", "Pesquisa com Usuários", "Design System", "CSS", "Acessibilidade"],
    foto: "/avatars/avatar3.png",
    dataCadastro: new Date("2024-03-10").toISOString(),
  },
  {
    id: "curr_004",
    nome: "Daniel Costa Pereira",
    cargoDesejado: "Analista de Dados / Data Scientist",
    email: "daniel.pereira@email.com",
    telefone: "(41) 95432-1098",
    cpf: "321.654.987-00",
    resumoProfissional:
      "Analista de Dados com 4 anos de experiência em análise estatística, machine learning e visualização de dados. Experiência em Python, SQL e ferramentas de BI como Power BI e Tableau.",
    experienciasProfissionais: [
      {
        empresa: "Varejo Nacional S.A.",
        cargo: "Analista de Dados Senior",
        dataInicio: "03/2022",
        dataFim: "",
        descricao:
          "Análise de comportamento de compra de 2M+ clientes. Criação de modelos de machine learning para previsão de demanda. Desenvolvimento de dashboards executivos no Power BI.",
      },
      {
        empresa: "Consultoria Analytics XP",
        cargo: "Analista de Dados Júnior",
        dataInicio: "07/2020",
        dataFim: "02/2022",
        descricao:
          "Extração e transformação de dados com Python e SQL. Criação de relatórios automatizados. Suporte a tomada de decisão baseada em dados.",
      },
    ],
    formacoesAcademicas: [
      {
        instituicao: "UFPR",
        curso: "Estatística",
        nivel: "Graduação",
        anoConclusao: "2020",
      },
      {
        instituicao: "Udemy / DataCamp",
        curso: "Data Science com Python",
        nivel: "Curso Especializado",
        anoConclusao: "2021",
      },
    ],
    habilidades: ["Python", "SQL", "Power BI", "Tableau", "Machine Learning", "Pandas", "Scikit-learn"],
    foto: "/avatars/avatar4.png",
    dataCadastro: new Date("2024-04-05").toISOString(),
  },
  {
    id: "curr_005",
    nome: "Fernanda Lima Rodrigues",
    cargoDesejado: "Gerente de Projetos de TI",
    email: "fernanda.rodrigues@email.com",
    telefone: "(51) 94321-0987",
    cpf: "654.321.098-00",
    resumoProfissional:
      "Gerente de Projetos com certificação PMP e 10 anos de experiência liderando equipes multidisciplinares em projetos de tecnologia. Especialista em metodologias ágeis (Scrum e SAFe).",
    experienciasProfissionais: [
      {
        empresa: "Multinacional Tech Corp",
        cargo: "Gerente de Projetos Senior",
        dataInicio: "01/2019",
        dataFim: "",
        descricao:
          "Gestão de portfólio de projetos com budget de R$ 5M. Coordenação de equipes de até 30 pessoas. Implementação de metodologia SAFe em 3 tribos de produto.",
      },
      {
        empresa: "TI Solutions Brasil",
        cargo: "Analista de Projetos",
        dataInicio: "03/2014",
        dataFim: "12/2018",
        descricao:
          "Apoio na gestão de projetos de transformação digital. Elaboração de cronogramas e controle de riscos. Facilitação de cerimônias Scrum.",
      },
    ],
    formacoesAcademicas: [
      {
        instituicao: "FGV",
        curso: "Administração de Empresas",
        nivel: "Graduação",
        anoConclusao: "2013",
      },
      {
        instituicao: "PMI",
        curso: "Project Management Professional (PMP)",
        nivel: "Certificação Internacional",
        anoConclusao: "2017",
      },
      {
        instituicao: "FGV Online",
        curso: "MBA em Gestão de TI",
        nivel: "Pós-Graduação",
        anoConclusao: "2019",
      },
    ],
    habilidades: ["Scrum", "SAFe", "PMP", "Gestão de Riscos", "MS Project", "Jira", "Liderança"],
    foto: "/avatars/avatar5.png",
    dataCadastro: new Date("2024-05-20").toISOString(),
  },
];

/**
 * Chave usada no localStorage para armazenar os dados dos currículos
 * Definir como constante evita erros de digitação em múltiplos locais
 */
export const STORAGE_KEY = "sistema_curriculos_data";
