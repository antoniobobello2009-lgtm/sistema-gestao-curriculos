# GestCurr - Sistema de Gestão de Currículos

> **Trabalho 2: Remodelar o Sistema de Gestão de Currículos**  
> Desenvolvido por: [@antoniobobello2009-lgtm](https://github.com/antoniobobello2009-lgtm)

## Sobre o Projeto

Sistema web moderno para cadastro e gestão de currículos profissionais, desenvolvido com **Next.js 14 App Router**, **Tailwind CSS** e **shadcn/ui**.

## Stack Tecnológico

| Tecnologia | Uso |
|---|---|
| **Next.js 14** | Framework principal com App Router |
| **React 18** | Biblioteca de UI |
| **TypeScript** | Tipagem estática |
| **Tailwind CSS** | Estilização utilitária e responsividade |
| **shadcn/ui** | Componentes de UI (Button, Card, Badge, etc.) |
| **React Hook Form** | Gerenciamento de estado do formulário |
| **Yup** | Validação de esquemas |
| **React Input Mask** | Máscaras para CPF e Telefone |
| **Sonner** | Notificações toast |
| **React Icons** | Biblioteca de ícones |
| **localStorage** | Persistência de dados mockada |

## Estrutura do Projeto

```
sistema-gestao-curriculos/
├── app/
│   ├── layout.tsx                    # Layout raiz (Header, Footer, Toaster)
│   ├── page.tsx                      # Home / Landing Page (/)
│   ├── globals.css                   # Estilos globais e variáveis CSS
│   └── sistema/paginas/
│       └── curriculos/
│           ├── page.tsx              # Lista de Currículos (/sistema/paginas/curriculos)
│           ├── [id]/page.tsx         # Detalhes (/sistema/paginas/curriculos/[id])
│           └── novo/page.tsx         # Cadastro (/sistema/paginas/curriculos/novo)
├── components/
│   ├── layout/
│   │   ├── Header.tsx               # Cabeçalho com menu responsivo
│   │   ├── Footer.tsx               # Rodapé com links e copyright
│   │   └── Nav.tsx                  # Navegação com active state
│   ├── curriculos/
│   │   └── CurriculoCard.tsx        # Card resumido na listagem
│   └── ui/                          # Componentes shadcn/ui
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       ├── label.tsx
│       ├── badge.tsx
│       └── separator.tsx
├── lib/
│   ├── types.ts                     # Tipos TypeScript
│   ├── utils.ts                     # Funções utilitárias
│   ├── mock-data.ts                 # Dados mockados iniciais
│   └── storage.ts                   # CRUD no localStorage
└── public/
    └── avatars/                     # Imagens de perfil dos candidatos
```

## Funcionalidades

### Páginas
- **Home (/)**: Landing page com benefícios e stack tecnológico
- **Lista (/sistema/paginas/curriculos)**: Grid de cards com busca em tempo real
- **Detalhes (/sistema/paginas/curriculos/[id])**: Perfil completo com ações de gestão
- **Cadastro (/sistema/paginas/curriculos/novo)**: Formulário completo com validação

### Desafios Técnicos Implementados
- ✅ **Campos Dinâmicos** (useFieldArray): adicionar/remover experiências e formações
- ✅ **Filtro em Tempo Real** com Debounce de 300ms por nome e cargo
- ✅ **Estados de botões**: hover, focus-visible, disabled
- ✅ **Active state** na navegação (link ativo destacado visualmente)
- ✅ **Toast com erro específico** do Yup no Sonner

## Como Executar

```bash
# 1. Clone o repositório
git clone https://github.com/antoniobobello2009-lgtm/sistema-gestao-curriculos.git
cd sistema-gestao-curriculos

# 2. Instale as dependências
npm install

# 3. Execute em modo de desenvolvimento
npm run dev

# 4. Acesse no browser
# http://localhost:3000
```

## Design

- **Paleta de cores**: Tons de azul profissional (análogos/tom sobre tom)
- **Responsividade**: Mobile-first com breakpoints sm (640px), md (768px), lg (1024px)
- **Ícones**: React Icons (FaBriefcase, FaUsers, etc.)
- **Animações**: fade-in suave nos cards e transições nos botões

---

Desenvolvido por [@antoniobobello2009-lgtm](https://github.com/antoniobobello2009-lgtm) — Trabalho 2 — 2024
