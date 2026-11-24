/** Exportação estática: gera a pasta "out" com HTML puro, que pode ir para qualquer alojamento. */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;
