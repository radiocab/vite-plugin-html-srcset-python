import { defineConfig } from 'vite'
import htmlSrcsetPlugin from 'vite-plugin-html-srcset'

export default defineConfig({
  plugins: [
    htmlSrcsetPlugin({
      // Basic configuration
      outputWidths: [480, 768, 1024],
      outputFormats: {
        webp: true,
        jpeg: true
      },
      quality: 80
    })
  ]
})