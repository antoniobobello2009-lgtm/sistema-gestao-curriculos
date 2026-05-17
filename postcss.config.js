// Configuração do PostCSS - processador de CSS
// Tailwind CSS usa PostCSS para gerar as classes utilitárias
module.exports = {
  plugins: {
    tailwindcss: {},  // Plugin principal do Tailwind
    autoprefixer: {}, // Adiciona prefixos CSS para compatibilidade entre browsers
  },
};
