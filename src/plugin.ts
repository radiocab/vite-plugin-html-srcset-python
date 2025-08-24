import { Plugin } from 'vite'
import { parseHTML } from 'linkedom'
import { generateSrcSet } from './image-processor'
import { HtmlSrcsetOptions, ResolvedHtmlSrcsetOptions } from './types'
import { minimatch } from 'minimatch'

export interface HtmlSrcsetPlugin extends Plugin {
  name: 'vite-plugin-html-srcset'
}

export function htmlSrcsetPlugin(options: HtmlSrcsetOptions = {}): HtmlSrcsetPlugin {
  const resolvedOptions = resolveOptions(options)
  
  return {
    name: 'vite-plugin-html-srcset',
    apply: 'build', // Only apply during build
    configResolved(config) {
      // Ensure we have access to the build config
      resolvedOptions.root = config.root
      resolvedOptions.publicDir = config.publicDir
      resolvedOptions.assetsDir = config.build.assetsDir || 'assets'
    },
    transformIndexHtml: {
      order: 'pre',
      async handler(html: string, ctx) {
        if (!shouldProcessHtml(ctx.path || '', resolvedOptions)) {
          return html
        }

        try {
          const dom = parseHTML(html)
          const document = dom.document

          // Find all img, picture, and figure tags
          const imgTags = Array.from(document.querySelectorAll('img'))
          const pictureTags = Array.from(document.querySelectorAll('picture'))
          const figureTags = Array.from(document.querySelectorAll('figure'))

          // Process img tags
          for (const img of imgTags) {
            await processImgTag(img, resolvedOptions)
          }

          // Process picture tags
          for (const picture of pictureTags) {
            await processPictureTag(picture, resolvedOptions)
          }

          // Process figure tags
          for (const figure of figureTags) {
            await processFigureTag(figure, resolvedOptions)
          }

          return document.toString()
        } catch (error) {
          console.error('vite-plugin-html-srcset: Error processing HTML:', error)
          return html
        }
      }
    }
  }
}

function resolveOptions(options: HtmlSrcsetOptions): ResolvedHtmlSrcsetOptions {
  return {
    include: options.include || ['**/*.html'],
    exclude: options.exclude || [],
    outputFormats: {
      png: true,
      webp: true,
      avif: false,
      jpeg: true,
      ...options.outputFormats
    },
    outputWidths: options.outputWidths || [320, 640, 768, 1024, 1280, 1600],
    assetNamePrefix: options.assetNamePrefix || '',
    quality: options.quality || 80,
    root: '',
    publicDir: '',
    assetsDir: ''
  }
}

function shouldProcessHtml(filePath: string, options: ResolvedHtmlSrcsetOptions): boolean {
  // Check include patterns
  const shouldInclude = options.include.some(pattern => minimatch(filePath, pattern))
  if (!shouldInclude) return false
  
  // Check exclude patterns
  const shouldExclude = options.exclude.some(pattern => minimatch(filePath, pattern))
  return !shouldExclude
}

async function processImgTag(img: Element, options: ResolvedHtmlSrcsetOptions) {
  const src = img.getAttribute('src')
  if (!src || !src.endsWith('?srcset')) return

  const actualSrc = src.replace('?srcset', '')
  const alt = img.getAttribute('alt') || ''
  
  try {
    const srcsetData = await generateSrcSet(actualSrc, options)
    
    // Update img tag
    img.setAttribute('src', srcsetData.fallback)
    img.setAttribute('srcset', srcsetData.srcset)
    
    // Add sizes attribute if not present
    if (!img.getAttribute('sizes')) {
      img.setAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw')
    }
  } catch (error) {
    console.warn(`Failed to process image: ${actualSrc}`, error)
  }
}

async function processPictureTag(picture: Element, options: ResolvedHtmlSrcsetOptions) {
  const sources = Array.from(picture.querySelectorAll('source'))
  const img = picture.querySelector('img')
  
  for (const source of sources) {
    const srcset = source.getAttribute('srcset')
    if (srcset && srcset.endsWith('?srcset')) {
      const actualSrc = srcset.replace('?srcset', '')
      try {
        const srcsetData = await generateSrcSet(actualSrc, options)
        source.setAttribute('srcset', srcsetData.srcset)
      } catch (error) {
        console.warn(`Failed to process picture source: ${actualSrc}`, error)
      }
    }
  }
  
  if (img) {
    await processImgTag(img, options)
  }
}

async function processFigureTag(figure: Element, options: ResolvedHtmlSrcsetOptions) {
  const img = figure.querySelector('img')
  if (img) {
    await processImgTag(img, options)
  }
}

export default htmlSrcsetPlugin
export * from './types'