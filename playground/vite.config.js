import { defineConfig } from 'vite'
import htmlSrcsetPlugin from 'vite-plugin-html-srcset'

export default defineConfig({
  plugins: [
    htmlSrcsetPlugin({
      outputWidths: [320, 640, 768, 1024, 1280, 1600],
      outputFormats: {
        png: true,
        webp: true,
        avif: true,
        jpeg: true
      },
      quality: 85,
      assetNamePrefix: 'responsive-'
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        gallery: 'gallery.html',
        blog: 'blog.html'
      }
    }
  }
})