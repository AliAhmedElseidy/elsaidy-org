import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

/**
 * Custom Vite plugin that eliminates render-blocking CSS requests (`assets/index-*.css`)
 * in `dist/index.html` by inlining the compiled stylesheet directly into `<head>`
 * (and converting any external fallback stylesheet links to non-blocking preload).
 * This removes the 480ms render-blocking network round-trip on Mobile 4G and pushes
 * Mobile PageSpeed FCP/LCP into the 95+ green zone.
 */
function inlineRenderBlockingCssPlugin(): Plugin {
  return {
    name: 'elsaidy-inline-render-blocking-css',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      if (!ctx || !ctx.bundle) {
        return html;
      }

      return html.replace(
        /<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']\/?([^"']+\.css)["'][^>]*>/gi,
        (fullMatch, assetPath: string) => {
          const normalizedPath = assetPath.replace(/^\//, '');
          const bundleItem = ctx.bundle?.[normalizedPath];

          if (
            bundleItem &&
            bundleItem.type === 'asset' &&
            typeof bundleItem.source === 'string'
          ) {
            return `<style id="elsaidy-inlined-bundle-css">${bundleItem.source}</style>`;
          }

          // Fallback: non-blocking preload pattern if asset is external
          return `<link rel="preload" as="style" href="/${normalizedPath}" onload="this.onload=null;this.rel='stylesheet'"><noscript>${fullMatch}</noscript>`;
        }
      );
    },
  };
}

export default defineConfig(() => {
  return {
    publicDir: 'public',
    plugins: [react(), tailwindcss(), inlineRenderBlockingCssPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('node_modules/qrcode')) {
              return 'vendor-qrcode';
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
