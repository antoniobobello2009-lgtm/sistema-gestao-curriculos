import type { Config } from "tailwindcss";

// Configuração do Tailwind CSS
// Define os caminhos dos arquivos que usam classes do Tailwind
// e customizações do tema do projeto
const config: Config = {
  // Habilita o modo dark baseado em classe CSS (útil para temas)
  darkMode: ["class"],

  // Caminhos onde o Tailwind deve procurar classes para gerar o CSS
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],

  theme: {
    // Configurações do container responsivo
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Paleta de cores do sistema - tons de azul profissional (análogos/tom sobre tom)
      colors: {
        // Cor de borda padrão dos componentes
        border: "hsl(var(--border))",
        // Cor de fundo para inputs e campos
        input: "hsl(var(--input))",
        // Cor do anel de foco (focus ring)
        ring: "hsl(var(--ring))",
        // Cor de fundo principal
        background: "hsl(var(--background))",
        // Cor do texto principal
        foreground: "hsl(var(--foreground))",
        // Cores primárias (azul escuro profissional)
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Cores secundárias (cinza suave)
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // Cores para elementos destrutivos (delete, erros críticos)
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        // Cores suavizadas para fundos de seção
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        // Cores de destaque (accent)
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        // Cores para popovers e tooltips
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        // Cores para cards
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      // Raios de borda personalizados para consistência visual
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Animações para abertura/fechamento de modais e accordions
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Animação de entrada suave para cards e elementos
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  // Nenhum plugin externo necessário: as animações usadas no projeto
  // (fade-in, accordion-down, accordion-up) já estão definidas diretamente
  // nos keyframes acima, dispensando o tailwindcss-animate como dependência.
  plugins: [],
};

export default config;
