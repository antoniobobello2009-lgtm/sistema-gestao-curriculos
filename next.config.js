/** @type {import('next').NextConfig} */
// Configuração principal do Next.js
// Aqui podemos adicionar opções como redirecionamentos, variáveis de ambiente, etc.
const nextConfig = {
  // Permite renderização de imagens de qualquer domínio (útil para avatares externos)
  images: {
    domains: ['randomuser.me', 'ui-avatars.com'],
  },
};

module.exports = nextConfig;
