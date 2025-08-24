import { describe, it, expect } from 'vitest'
import type { HtmlSrcsetOptions, ResolvedHtmlSrcsetOptions, SrcsetData } from '../src/types'

describe('Types', () => {
  it('should have correct HtmlSrcsetOptions interface', () => {
    const options: HtmlSrcsetOptions = {
      include: ['**/*.html'],
      exclude: ['admin/**'],
      outputFormats: {
        png: true,
        webp: true,
        avif: false,
        jpeg: true
      },
      outputWidths: [320, 640, 1280],
      assetNamePrefix: 'thumb-',
      quality: 85
    }

    expect(options.include).toEqual(['**/*.html'])
    expect(options.quality).toBe(85)
  })

  it('should have correct ResolvedHtmlSrcsetOptions interface', () => {
    const resolved: ResolvedHtmlSrcsetOptions = {
      include: ['**/*.html'],
      exclude: [],
      outputFormats: {
        png: true,
        webp: true,
        avif: false,
        jpeg: true
      },
      outputWidths: [320, 640, 1280],
      assetNamePrefix: '',
      quality: 80,
      root: '/project',
      publicDir: 'public',
      assetsDir: 'assets'
    }

    expect(resolved.root).toBe('/project')
    expect(resolved.publicDir).toBe('public')
    expect(resolved.assetsDir).toBe('assets')
  })

  it('should have correct SrcsetData interface', () => {
    const srcsetData: SrcsetData = {
      srcset: '/assets/image-320w.jpg 320w, /assets/image-640w.jpg 640w',
      fallback: '/assets/image-320w.jpg',
      sources: [
        {
          type: 'image/jpeg',
          srcset: '/assets/image-320w.jpg 320w, /assets/image-640w.jpg 640w'
        },
        {
          type: 'image/webp',
          srcset: '/assets/image-320w.webp 320w, /assets/image-640w.webp 640w'
        }
      ]
    }

    expect(srcsetData.sources).toHaveLength(2)
    expect(srcsetData.sources[0].type).toBe('image/jpeg')
  })
})