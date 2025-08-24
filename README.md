# vite-plugin-html-srcset

A Vite 7 plugin that automatically processes HTML files and transforms `<img>`, `<picture>`, and `<figure>` tags with srcset attributes for responsive images.

## Features

- 🖼️ **Automatic Image Processing**: Transforms images with `?srcset` suffix during build
- 📱 **Responsive Images**: Generates multiple image sizes automatically
- 🎨 **Multiple Formats**: Supports PNG, WebP, AVIF, and JPEG
- ⚡ **Vite 7 Compatible**: Built specifically for Vite 7
- 🔧 **Configurable**: Flexible configuration options
- 📋 **Full Coverage**: Comprehensive test suite with Vitest and V8 coverage
- 🎮 **Playground**: Interactive examples and demos

## Installation

```bash
pnpm add -D vite-plugin-html-srcset
```

## Quick Start

### 1. Configure the plugin

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import htmlSrcsetPlugin from 'vite-plugin-html-srcset'

export default defineConfig({
  plugins: [
    htmlSrcsetPlugin({
      outputWidths: [320, 640, 768, 1024, 1280, 1600],
      outputFormats: {
        webp: true,
        avif: true,
        jpeg: true,
        png: true
      },
      quality: 85
    })
  ]
})
```

### 2. Use in your HTML

Simply add `?srcset` to any image src attribute:

```html
<!-- Basic img tag -->
<img src="/hero-image.jpg?srcset" alt="Hero image" />

<!-- Picture element -->
<picture>
  <source srcset="/modern-image.avif?srcset" type="image/avif">
  <source srcset="/modern-image.webp?srcset" type="image/webp">
  <img src="/modern-image.jpg?srcset" alt="Modern image" />
</picture>

<!-- Figure element -->
<figure>
  <img src="/gallery-image.png?srcset" alt="Gallery image" />
  <figcaption>Image caption</figcaption>
</figure>
```

### 3. Build your project

```bash
pnpm run build
```

The plugin will automatically:
- Generate multiple image sizes
- Create optimized formats (WebP, AVIF, etc.)
- Update HTML with proper `srcset` attributes
- Remove the `?srcset` suffix from URLs

## Configuration Options

```typescript
interface HtmlSrcsetOptions {
  /**
   * Include patterns for HTML files to process
   * @default ['**/*.html']
   */
  include?: string[]

  /**
   * Exclude patterns for HTML files to skip
   * @default []
   */
  exclude?: string[]

  /**
   * Output image formats
   * @default { png: true, webp: true, avif: false, jpeg: true }
   */
  outputFormats?: {
    png?: boolean
    webp?: boolean
    avif?: boolean
    jpeg?: boolean
  }

  /**
   * Output image widths
   * @default [320, 640, 768, 1024, 1280, 1600]
   */
  outputWidths?: number[]

  /**
   * Prefix for generated asset names
   * @default ''
   */
  assetNamePrefix?: string

  /**
   * Image quality (1-100)
   * @default 80
   */
  quality?: number
}
```

## Examples

### Basic Usage
```bash
cd examples/basic
pnpm install
pnpm run dev
```

### Advanced Usage
```bash
cd examples/advanced
pnpm install
pnpm run dev
```

### Playground
```bash
cd playground
pnpm install
pnpm run dev
```

## Development

### Setup
```bash
pnpm install
```

### Build
```bash
pnpm run build
```

### Test
```bash
# Run tests
pnpm run test

# Run tests with coverage
pnpm run test:coverage

# Run tests with UI
pnpm run test:ui
```

### Playground
```bash
pnpm run playground
```

## How It Works

1. **Build Time Processing**: The plugin only runs during the build process (`apply: 'build'`)
2. **HTML Transformation**: Uses the `transformIndexHtml` hook to process HTML files
3. **Image Detection**: Finds all `<img>`, `<picture>`, and `<figure>` tags with `?srcset` suffix
4. **Image Generation**: Uses Sharp to generate multiple sizes and formats
5. **HTML Update**: Replaces original tags with responsive `srcset` attributes

## Supported Image Formats

- **Input**: JPEG, PNG, WebP, AVIF, GIF, SVG
- **Output**: PNG, WebP, AVIF, JPEG (configurable)

## Browser Support

The plugin generates modern image formats with proper fallbacks:
- **AVIF**: Modern browsers with best compression
- **WebP**: Wide browser support with good compression
- **JPEG/PNG**: Universal fallback support

## TypeScript Support

Full TypeScript support with type definitions included.

```typescript
import type { HtmlSrcsetOptions } from 'vite-plugin-html-srcset'
```

## Performance Tips

1. **Use appropriate widths**: Don't generate more sizes than needed
2. **Choose formats wisely**: AVIF for best compression, WebP for compatibility
3. **Optimize quality**: Balance file size and visual quality (80-90 recommended)
4. **Use proper sizes attribute**: Help browsers select the right image

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines and ensure all tests pass.

```bash
# Run tests before contributing
pnpm run test:coverage
```