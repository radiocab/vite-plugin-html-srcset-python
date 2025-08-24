import sharp from 'sharp'
import { promises as fs } from 'fs'
import { resolve, extname, basename, join } from 'path'
import { ResolvedHtmlSrcsetOptions, SrcsetData } from './types'

export async function generateSrcSet(
  src: string, 
  options: ResolvedHtmlSrcsetOptions
): Promise<SrcsetData> {
  const inputPath = resolve(options.root, options.publicDir, src.replace(/^\//, ''))
  
  try {
    await fs.access(inputPath)
  } catch {
    throw new Error(`Image not found: ${inputPath}`)
  }

  const image = sharp(inputPath)
  const metadata = await image.metadata()
  
  if (!metadata.width || !metadata.height) {
    throw new Error(`Could not read image dimensions: ${inputPath}`)
  }

  const originalWidth = metadata.width
  const originalHeight = metadata.height
  const aspectRatio = originalWidth / originalHeight
  
  // Filter widths that are smaller than or equal to original
  const validWidths = options.outputWidths.filter(width => width <= originalWidth)
  if (validWidths.length === 0) {
    validWidths.push(originalWidth)
  }

  const formats = Object.entries(options.outputFormats)
    .filter(([, enabled]) => enabled)
    .map(([format]) => format)

  const srcsetEntries: string[] = []
  const sources: Array<{ type: string; srcset: string }> = []
  
  // Generate images for each format and width
  for (const format of formats) {
    const formatSrcset: string[] = []
    
    for (const width of validWidths) {
      const height = Math.round(width / aspectRatio)
      const filename = generateFilename(src, width, format, options.assetNamePrefix)
      const outputPath = resolve(options.root, 'dist', options.assetsDir, filename)
      
      // Create output directory if it doesn't exist
      await fs.mkdir(resolve(options.root, 'dist', options.assetsDir), { recursive: true })
      
      // Generate resized image
      await image
        .clone()
        .resize(width, height)
        .toFormat(format as keyof sharp.FormatEnum, { quality: options.quality })
        .toFile(outputPath)
      
      const publicUrl = `/${options.assetsDir}/${filename}`
      formatSrcset.push(`${publicUrl} ${width}w`)
    }
    
    if (formatSrcset.length > 0) {
      const mimeType = getMimeType(format)
      sources.push({
        type: mimeType,
        srcset: formatSrcset.join(', ')
      })
    }
  }

  // Use the original format for the main srcset
  const originalFormat = getFormatFromExtension(extname(src))
  const mainSrcset = sources.find(s => s.type.includes(originalFormat))?.srcset || sources[0]?.srcset || ''
  
  // Fallback to the smallest image
  const fallbackWidth = Math.min(...validWidths)
  const fallbackFormat = formats.includes(originalFormat) ? originalFormat : formats[0]
  const fallbackFilename = generateFilename(src, fallbackWidth, fallbackFormat, options.assetNamePrefix)
  const fallback = `/${options.assetsDir}/${fallbackFilename}`

  return {
    srcset: mainSrcset,
    fallback,
    sources
  }
}

function generateFilename(
  originalSrc: string, 
  width: number, 
  format: string, 
  prefix: string
): string {
  const name = basename(originalSrc, extname(originalSrc))
  return `${prefix}${name}-${width}w.${format}`
}

function getFormatFromExtension(ext: string): string {
  const format = ext.toLowerCase().replace('.', '')
  switch (format) {
    case 'jpg':
      return 'jpeg'
    default:
      return format
  }
}

function getMimeType(format: string): string {
  switch (format) {
    case 'jpeg':
    case 'jpg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'avif':
      return 'image/avif'
    default:
      return `image/${format}`
  }
}