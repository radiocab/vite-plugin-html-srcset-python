import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { generateSrcSet } from '../src/image-processor'
import { ResolvedHtmlSrcsetOptions } from '../src/types'

// Mock sharp
const mockSharp = {
  metadata: vi.fn().mockResolvedValue({ width: 1920, height: 1080 }),
  clone: vi.fn().mockReturnThis(),
  resize: vi.fn().mockReturnThis(),
  toFormat: vi.fn().mockReturnThis(),
  toFile: vi.fn().mockResolvedValue(undefined)
}

vi.mock('sharp', () => ({
  default: vi.fn(() => mockSharp)
}))

// Mock fs
vi.mock('fs', () => ({
  promises: {
    access: vi.fn().mockResolvedValue(undefined),
    mkdir: vi.fn().mockResolvedValue(undefined)
  }
}))

describe('generateSrcSet', () => {
  const mockOptions: ResolvedHtmlSrcsetOptions = {
    include: ['**/*.html'],
    exclude: [],
    outputFormats: { png: true, webp: true, avif: false, jpeg: true },
    outputWidths: [320, 640, 1280],
    assetNamePrefix: '',
    quality: 80,
    root: '/test',
    publicDir: 'public',
    assetsDir: 'assets'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should generate srcset for valid image', async () => {
    const result = await generateSrcSet('/test-image.jpg', mockOptions)

    expect(result).toHaveProperty('srcset')
    expect(result).toHaveProperty('fallback')
    expect(result).toHaveProperty('sources')
    expect(result.srcset).toContain('320w')
    expect(result.srcset).toContain('640w')
    expect(result.srcset).toContain('1280w')
  })

  it('should filter out widths larger than original image', async () => {
    mockSharp.metadata.mockResolvedValueOnce({ width: 800, height: 600 })
    
    const result = await generateSrcSet('/small-image.jpg', mockOptions)
    
    expect(result.srcset).toContain('320w')
    expect(result.srcset).toContain('640w')
    expect(result.srcset).not.toContain('1280w')
  })

  it('should use original width if no valid widths found', async () => {
    mockSharp.metadata.mockResolvedValueOnce({ width: 200, height: 150 })
    
    const result = await generateSrcSet('/tiny-image.jpg', mockOptions)
    
    expect(result.srcset).toContain('200w')
  })

  it('should generate multiple format sources', async () => {
    const result = await generateSrcSet('/test-image.jpg', mockOptions)

    expect(result.sources.length).toBeGreaterThan(1)
    expect(result.sources.some(s => s.type.includes('webp'))).toBe(true)
    expect(result.sources.some(s => s.type.includes('jpeg'))).toBe(true)
  })

  it('should handle different image formats', async () => {
    const pngOptions = {
      ...mockOptions,
      outputFormats: { png: true, webp: false, avif: false, jpeg: false }
    }
    
    const result = await generateSrcSet('/test-image.png', pngOptions)
    
    expect(result.sources[0].type).toContain('png')
  })

  it('should use custom asset name prefix', async () => {
    const prefixOptions = {
      ...mockOptions,
      assetNamePrefix: 'thumb-'
    }
    
    const result = await generateSrcSet('/test-image.jpg', prefixOptions)
    
    expect(result.fallback).toContain('thumb-')
  })

  it('should throw error for non-existent image', async () => {
    const fs = await import('fs')
    vi.mocked(fs.promises.access).mockRejectedValueOnce(new Error('File not found'))

    await expect(generateSrcSet('/non-existent.jpg', mockOptions))
      .rejects.toThrow('Image not found')
  })

  it('should throw error for image without dimensions', async () => {
    mockSharp.metadata.mockResolvedValueOnce({ width: undefined, height: undefined })

    await expect(generateSrcSet('/invalid-image.jpg', mockOptions))
      .rejects.toThrow('Could not read image dimensions')
  })

  it('should create output directory if it does not exist', async () => {
    await generateSrcSet('/test-image.jpg', mockOptions)
    
    const fs = await import('fs')
    expect(fs.promises.mkdir).toHaveBeenCalledWith(
      '/test/dist/assets',
      { recursive: true }
    )
  })

  it('should call sharp with correct parameters', async () => {
    await generateSrcSet('/test-image.jpg', mockOptions)

    expect(mockSharp.resize).toHaveBeenCalledWith(320, 180)
    expect(mockSharp.resize).toHaveBeenCalledWith(640, 360)
    expect(mockSharp.resize).toHaveBeenCalledWith(1280, 720)
    expect(mockSharp.toFormat).toHaveBeenCalledWith('png', { quality: 80 })
    expect(mockSharp.toFormat).toHaveBeenCalledWith('webp', { quality: 80 })
    expect(mockSharp.toFormat).toHaveBeenCalledWith('jpeg', { quality: 80 })
  })
})