/// <reference types="vite/client" />

declare module "virtual:html-srcset-config" {
  const config: import('./dist/types').ResolvedHtmlSrcsetOptions
  export default config
}