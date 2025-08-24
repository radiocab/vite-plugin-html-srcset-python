# API Documentation

## Plugin Function

### `htmlSrcsetPlugin(options?: HtmlSrcsetOptions): HtmlSrcsetPlugin`

Creates a new instance of the HTML srcset plugin.

**Parameters:**
- `options` (optional): Configuration options for the plugin

**Returns:** A Vite plugin object

## Configuration Options

### `HtmlSrcsetOptions`

```typescript
interface HtmlSrcsetOptions {
  include?: string[]
  exclude?: string[]
  outputFormats?: {
    png?: boolean
    webp?: boolean
    avif?: boolean
    jpeg?: boolean
  }
  outputWidths?: number[]
  assetNamePrefix?: string
  quality?: number
}
```

#### `include`
- **Type:** `string[]`
- **Default:** `['**/*.html']`
- **Description:** Array of glob patterns for HTML files to process

#### `exclude`
- **Type:** `string[]`
- **Default:** `[]`
- **Description:** Array of glob patterns for HTML files to exclude

#### `outputFormats`
- **Type:** `object`
- **Default:** `{ png: true, webp: true, avif: false, jpeg: true }`
- **Description:** Object specifying which image formats to generate

#### `outputWidths`
- **Type:** `number[]`
- **Default:** `[320, 640, 768, 1024, 1280, 1600]`
- **Description:** Array of image widths to generate

#### `assetNamePrefix`
- **Type:** `string`
- **Default:** `''`
- **Description:** Prefix to add to generated asset filenames

#### `quality`
- **Type:** `number`
- **Default:** `80`
- **Description:** Image quality (1-100)

## Generated Types

### `SrcsetData`

```typescript
interface SrcsetData {
  srcset: string
  fallback: string
  sources: Array<{
    type: string
    srcset: string
  }>
}
```

Represents the generated srcset data for an image.

### `ResolvedHtmlSrcsetOptions`

```typescript
interface ResolvedHtmlSrcsetOptions extends Required<HtmlSrcsetOptions> {
  root: string
  publicDir: string
  assetsDir: string
}
```

Internal resolved options with additional Vite-specific properties.

## Image Processing

The plugin uses Sharp for image processing. Images are:

1. **Analyzed** for dimensions and format
2. **Resized** to specified widths (filtered by original size)
3. **Converted** to specified formats
4. **Optimized** with specified quality settings
5. **Saved** to the assets directory

## HTML Processing

The plugin processes these HTML elements:

- `<img src="image.jpg?srcset">`
- `<picture><source srcset="image.jpg?srcset"></picture>`
- `<figure><img src="image.jpg?srcset"></figure>`

### Transformation Example

**Before:**
```html
<img src="/hero.jpg?srcset" alt="Hero image">
```

**After:**
```html
<img 
  src="/assets/hero-320w.jpg" 
  srcset="/assets/hero-320w.jpg 320w, /assets/hero-640w.jpg 640w, /assets/hero-1024w.jpg 1024w"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="Hero image"
>
```

## Error Handling

The plugin handles errors gracefully:

- **Missing images**: Logs warning, continues build
- **Invalid images**: Logs warning, skips processing
- **HTML parse errors**: Returns original HTML
- **Sharp errors**: Logs error, continues with next image

## Development Mode

The plugin only runs during build (`apply: 'build'`). In development mode:
- Images are served as-is
- No processing occurs
- Faster development experience