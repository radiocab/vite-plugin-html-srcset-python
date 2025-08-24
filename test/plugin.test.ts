import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { htmlSrcsetPlugin } from '../src/plugin'
import { parseHTML } from 'linkedom'

// Mock sharp and fs
vi.mock('sharp', () => ({
  default: vi.fn().mockImplementation(() => ({
    metadata: vi.fn().mockResolvedValue({ width: 1920, height: 1080 }),
    clone: vi.fn().mockReturnThis(),
    resize: vi.fn().mockReturnThis(),
    toFormat: vi.fn().mockReturnThis(),
    toFile: vi.fn().mockResolvedValue(undefined)
  }))
}))

vi.mock('fs', () => ({
  promises: {
    access: vi.fn().mockResolvedValue(undefined),
    mkdir: vi.fn().mockResolvedValue(undefined)
  }
}))

describe('htmlSrcsetPlugin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should create plugin with default options', () => {
    const plugin = htmlSrcsetPlugin()
    expect(plugin.name).toBe('vite-plugin-html-srcset')
    expect(plugin.apply).toBe('build')
  })

  it('should create plugin with custom options', () => {
    const options = {
      outputWidths: [640, 1280],
      quality: 90,
      outputFormats: { webp: true, avif: true }
    }
    const plugin = htmlSrcsetPlugin(options)
    expect(plugin.name).toBe('vite-plugin-html-srcset')
  })

  it('should have transformIndexHtml hook', () => {
    const plugin = htmlSrcsetPlugin()
    expect(plugin.transformIndexHtml).toBeDefined()
    expect(plugin.transformIndexHtml.order).toBe('pre')
  })

  describe('HTML transformation', () => {
    it('should process img tags with ?srcset suffix', async () => {
      const plugin = htmlSrcsetPlugin({
        outputWidths: [320, 640]
      })

      // Mock configResolved
      plugin.configResolved?.({
        root: '/test',
        publicDir: 'public',
        build: { assetsDir: 'assets' }
      } as any)

      const html = '<img src="/image.jpg?srcset" alt="Test image">'
      const ctx = { path: 'index.html' }

      const result = await plugin.transformIndexHtml.handler(html, ctx)
      expect(result).toContain('srcset=')
      expect(result).not.toContain('?srcset')
    })

    it('should not process img tags without ?srcset suffix', async () => {
      const plugin = htmlSrcsetPlugin()
      
      plugin.configResolved?.({
        root: '/test',
        publicDir: 'public',
        build: { assetsDir: 'assets' }
      } as any)

      const html = '<img src="/image.jpg" alt="Test image">'
      const ctx = { path: 'index.html' }

      const result = await plugin.transformIndexHtml.handler(html, ctx)
      expect(result).toBe(html)
    })

    it('should process picture tags with ?srcset suffix', async () => {
      const plugin = htmlSrcsetPlugin()
      
      plugin.configResolved?.({
        root: '/test',
        publicDir: 'public',
        build: { assetsDir: 'assets' }
      } as any)

      const html = `
        <picture>
          <source srcset="/image.webp?srcset" type="image/webp">
          <img src="/image.jpg?srcset" alt="Test image">
        </picture>
      `
      const ctx = { path: 'index.html' }

      const result = await plugin.transformIndexHtml.handler(html, ctx)
      expect(result).toContain('srcset=')
      expect(result).not.toContain('?srcset')
    })

    it('should process figure tags containing img with ?srcset', async () => {
      const plugin = htmlSrcsetPlugin()
      
      plugin.configResolved?.({
        root: '/test',
        publicDir: 'public',
        build: { assetsDir: 'assets' }
      } as any)

      const html = `
        <figure>
          <img src="/image.jpg?srcset" alt="Test image">
          <figcaption>A test image</figcaption>
        </figure>
      `
      const ctx = { path: 'index.html' }

      const result = await plugin.transformIndexHtml.handler(html, ctx)
      expect(result).toContain('srcset=')
      expect(result).toContain('figcaption')
    })

    it('should add sizes attribute if not present', async () => {
      const plugin = htmlSrcsetPlugin()
      
      plugin.configResolved?.({
        root: '/test',
        publicDir: 'public',
        build: { assetsDir: 'assets' }
      } as any)

      const html = '<img src="/image.jpg?srcset" alt="Test image">'
      const ctx = { path: 'index.html' }

      const result = await plugin.transformIndexHtml.handler(html, ctx)
      expect(result).toContain('sizes=')
    })

    it('should preserve existing sizes attribute', async () => {
      const plugin = htmlSrcsetPlugin()
      
      plugin.configResolved?.({
        root: '/test',
        publicDir: 'public',
        build: { assetsDir: 'assets' }
      } as any)

      const html = '<img src="/image.jpg?srcset" alt="Test image" sizes="100vw">'
      const ctx = { path: 'index.html' }

      const result = await plugin.transformIndexHtml.handler(html, ctx)
      expect(result).toContain('sizes="100vw"')
    })
  })

  describe('Include/exclude patterns', () => {
    it('should process files matching include pattern', async () => {
      const plugin = htmlSrcsetPlugin({
        include: ['**/*.html']
      })
      
      plugin.configResolved?.({
        root: '/test',
        publicDir: 'public',
        build: { assetsDir: 'assets' }
      } as any)

      const html = '<img src="/image.jpg?srcset" alt="Test image">'
      const ctx = { path: 'index.html' }

      const result = await plugin.transformIndexHtml.handler(html, ctx)
      expect(result).not.toBe(html)
    })

    it('should skip files matching exclude pattern', async () => {
      const plugin = htmlSrcsetPlugin({
        exclude: ['admin/*.html']
      })
      
      plugin.configResolved?.({
        root: '/test',
        publicDir: 'public',
        build: { assetsDir: 'assets' }
      } as any)

      const html = '<img src="/image.jpg?srcset" alt="Test image">'
      const ctx = { path: 'admin/dashboard.html' }

      const result = await plugin.transformIndexHtml.handler(html, ctx)
      expect(result).toBe(html)
    })
  })

  describe('Error handling', () => {
    it('should handle HTML parsing errors gracefully', async () => {
      const plugin = htmlSrcsetPlugin()
      
      plugin.configResolved?.({
        root: '/test',
        publicDir: 'public',
        build: { assetsDir: 'assets' }
      } as any)

      const malformedHtml = '<img src="/image.jpg?srcset" alt="Test image"'
      const ctx = { path: 'index.html' }

      // Should not throw
      const result = await plugin.transformIndexHtml.handler(malformedHtml, ctx)
      expect(typeof result).toBe('string')
    })
  })
})