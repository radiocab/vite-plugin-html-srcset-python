import { defineConfig } from 'vite'
import htmlSrcsetPlugin from 'vite-plugin-html-srcset'

export default defineConfig({
  plugins: [
    htmlSrcsetPlugin({
      // Advanced configuration
      include: ['**/*.html'],
      exclude: ['admin/**/*.html'],
      outputWidths: [320, 640, 768, 1024, 1280, 1920],
      outputFormats: {
        png: true,
        webp: true,
        avif: true,
        jpeg: true
      },
      quality: 85,
      assetNamePrefix: 'optimized-'
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        about: 'about.html',
        products: 'products.html'
      }
    }
  }
})