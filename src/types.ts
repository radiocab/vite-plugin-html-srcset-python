export interface HtmlSrcsetOptions {
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

export interface ResolvedHtmlSrcsetOptions extends Required<HtmlSrcsetOptions> {
  root: string
  publicDir: string
  assetsDir: string
}

export interface SrcsetData {
  srcset: string
  fallback: string
  sources: Array<{
    type: string
    srcset: string
  }>
}