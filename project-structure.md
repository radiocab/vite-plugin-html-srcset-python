# Vite Plugin HTML Srcset - Complete Project Structure

## Overview

This project creates a comprehensive Vite 7 plugin that processes HTML files and transforms `<img>`, `<picture>`, and `<figure>` tags with srcset attributes for responsive images. Based on the original vite-plugin-srcset-7, this plugin extends functionality to work directly with HTML files rather than imports.

## Project Architecture

### Core Plugin (`/src`)

**`plugin.ts`** - Main plugin implementation
- Implements Vite's `transformIndexHtml` hook
- Processes HTML during build time only (`apply: 'build'`)
- Uses LinkedOM for HTML parsing and manipulation
- Handles `img`, `picture`, and `figure` tags with `?srcset` suffix
- Integrates with image processor for asset generation

**`image-processor.ts`** - Image processing utilities
- Uses Sharp for high-performance image processing
- Generates multiple image sizes based on configuration
- Supports PNG, WebP, AVIF, and JPEG formats
- Handles aspect ratio preservation
- Creates optimized output with configurable quality

**`types.ts`** - TypeScript type definitions
- `HtmlSrcsetOptions` - User configuration interface
- `ResolvedHtmlSrcsetOptions` - Internal resolved options
- `SrcsetData` - Generated srcset information structure

**`index.ts`** - Main export file
- Exports plugin function and types
- Provides clean public API

### Testing Suite (`/test`)

**`plugin.test.ts`** - Core plugin functionality tests
- Tests plugin creation and configuration
- HTML transformation logic
- Include/exclude pattern matching
- Error handling scenarios
- Mocks external dependencies (Sharp, fs)

**`image-processor.test.ts`** - Image processing tests
- Srcset generation logic
- Multiple format support
- Size filtering and aspect ratio handling
- Sharp integration testing
- File system operations

**`types.test.ts`** - Type validation tests
- Interface compliance testing
- Type safety verification

**`integration.test.ts`** - End-to-end testing
- Real Vite build integration
- Complete plugin workflow
- Error scenario handling

### Configuration Files

**`package.json`** - Main package configuration
- pnpm as package manager
- TypeScript and build dependencies
- Comprehensive scripts for development and testing
- Proper peer dependencies for Vite 7

**`tsup.config.ts`** - Build configuration
- Dual format output (CJS/ESM)
- TypeScript declaration generation
- External dependency handling

**`vitest.config.ts`** - Test configuration
- V8 coverage provider
- Coverage thresholds (80% minimum)
- Node environment setup
- Proper exclusions for coverage

**`tsconfig.json`** - TypeScript configuration
- ES2020 target
- Strict mode enabled
- Proper module resolution

**`pnpm-workspace.yaml`** - Monorepo configuration
- Workspace definition for examples and playground
- Enables shared dependency management

### Documentation (`/docs`)

**`api.md`** - Complete API documentation
- Detailed interface descriptions
- Configuration options
- Usage examples
- Type definitions

**`contributing.md`** - Contributor guidelines
- Development setup instructions
- Testing requirements
- PR process
- Code style guidelines

### Interactive Playground (`/playground`)

**Multi-page demonstration application:**
- **`index.html`** - Main page with hero section and features
- **`gallery.html`** - Image gallery showcase
- **`blog.html`** - Blog-style layout with inline images
- **`style.css`** - Modern CSS with responsive design
- **`vite.config.js`** - Advanced plugin configuration
- **`package.json`** - Playground dependencies

**Features:**
- Various image formats (AVIF, WebP, PNG, JPEG)
- Different HTML structures (img, picture, figure)
- Responsive image examples
- Modern CSS Grid and Flexbox layouts
- Interactive navigation

### Examples

#### Basic Example (`/examples/basic`)
- Simple plugin setup
- Basic HTML with `?srcset` images
- Minimal configuration
- Clear usage demonstration

#### Advanced Example (`/examples/advanced`)
- Complex multi-page application
- Advanced plugin configuration
- Multiple image formats
- Picture element usage
- Figure elements with captions
- Modern CSS styling
- Product catalog layout

## Key Features Implemented

### 1. HTML Processing Engine
- Uses LinkedOM for server-side DOM manipulation
- Processes `img`, `picture`, and `figure` tags
- Detects `?srcset` suffix in src attributes
- Automatically adds `sizes` attribute if missing
- Preserves existing HTML structure and attributes

### 2. Image Generation Pipeline
- Sharp-based image processing
- Multiple format output (PNG, WebP, AVIF, JPEG)
- Configurable image widths
- Quality optimization
- Automatic aspect ratio preservation
- Intelligent size filtering (no upscaling)

### 3. Configuration System
- Flexible include/exclude patterns using minimatch
- Format-specific toggles
- Custom width arrays
- Quality settings
- Asset name prefixing
- Sensible defaults

### 4. Build Integration
- Vite 7 compatible plugin architecture
- Build-time only processing (`apply: 'build'`)
- Asset directory integration
- Proper file naming and organization

### 5. Error Handling
- Graceful handling of missing images
- Invalid image format protection
- HTML parsing error recovery
- Comprehensive logging and warnings

### 6. Testing Infrastructure
- Unit tests with 80%+ coverage requirement
- Integration tests with real Vite builds
- Mocked dependencies for reliable testing
- V8 coverage reporting
- Vitest UI support

### 7. TypeScript Support
- Full type definitions
- Strict type checking
- Exported interfaces for configuration
- Client type definitions

### 8. Development Experience
- Hot module replacement in examples
- Interactive playground
- Comprehensive documentation
- Multiple usage examples
- Clear error messages

## Usage Workflow

1. **Installation**: `pnpm add -D vite-plugin-html-srcset`

2. **Configuration**: Add to `vite.config.ts`
```typescript
import htmlSrcsetPlugin from 'vite-plugin-html-srcset'

export default defineConfig({
  plugins: [
    htmlSrcsetPlugin({
      outputWidths: [320, 640, 768, 1024, 1280, 1600],
      outputFormats: { webp: true, avif: true, jpeg: true },
      quality: 85
    })
  ]
})
```

3. **HTML Usage**: Add `?srcset` to image sources
```html
<img src="/hero.jpg?srcset" alt="Hero image" />
<picture>
  <source srcset="/modern.avif?srcset" type="image/avif">
  <img src="/modern.jpg?srcset" alt="Modern image" />
</picture>
```

4. **Build**: `pnpm run build`
   - Plugin processes HTML files
   - Generates multiple image sizes and formats  
   - Updates HTML with proper srcset attributes
   - Removes `?srcset` suffix from URLs

## Technical Specifications

- **Node.js**: >=18.0.0
- **Vite**: ^7.0.0
- **Package Manager**: pnpm
- **Language**: TypeScript
- **Image Processing**: Sharp
- **HTML Parsing**: LinkedOM
- **Testing**: Vitest with V8 coverage
- **Build Tool**: tsup
- **Output Formats**: CJS/ESM dual package

## File Statistics

- **Total Files**: 82
- **TypeScript Files**: 11
- **Test Files**: 4
- **HTML Examples**: 7
- **Documentation**: 3
- **Configuration Files**: 8
- **Image Assets**: 49 (dummy images for examples)

This creates a production-ready, well-tested, and thoroughly documented Vite plugin that can be immediately published to npm and used in real projects.