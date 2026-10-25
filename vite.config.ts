import { GoogleGenAI, Type } from '@google/genai';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

/**
 * Server-side middleware for POST /api/scan-id using @google/genai (gemini-2.5-flash).
 * Processes ID card images strictly in memory and returns extracted structured fields.
 */
function elsaidyIdScannerApiPlugin(): Plugin {
  return {
    name: 'elsaidy-id-scanner-api',
    configureServer(server) {
      server.middlewares.use('/api/scan-id', async (req, res, next) => {
        if (req.method !== 'POST') {
          next();
          return;
        }

        let rawBody = '';
        req.on('data', (chunk) => {
          rawBody += chunk.toString();
        });

        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          const apiKey = process.env.GEMINI_API_KEY;
          if (!apiKey) {
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                ok: false,
                error:
                  'لم يتم العثور على مفتاح GEMINI_API_KEY في بيئة الخادم. يرجى التأكد من إعداده في لوحة Secrets.',
              })
            );
            return;
          }

          try {
            const parsedBody = JSON.parse(rawBody || '{}') as {
              imageBase64?: string;
              mimeType?: string;
            };
            const cleanBase64 = (parsedBody.imageBase64 || '').replace(
              /^data:image\/[a-zA-Z0-9+.-]+;base64,/,
              ''
            );
            const mimeType = parsedBody.mimeType || 'image/jpeg';

            if (!cleanBase64) {
              res.statusCode = 400;
              res.end(
                JSON.stringify({
                  ok: false,
                  error: 'لم يتم إرسال بيانات الصورة لاستخراج النص منها.',
                })
              );
              return;
            }

            const ai = new GoogleGenAI({
              apiKey,
              httpOptions: {
                headers: {
                  'User-Agent': 'aistudio-build',
                },
              },
            });

            const promptText = `أنت خبير أرشفة وتوثيق هويات في السجل العام لعائلات الصعيدي.
قم بقراءة صورة بطاقة الهوية أو الوثيقة المرفقة واستخرج البيانات التالية بدقة عالية:
1. arabicName: الاسم الرباعي أو الكامل بالعربية كما هو مكتوب في البطاقة.
2. englishName: ترجمة الاسم الكامل إلى الإنجليزية بدقة واحترافية (مثال: Ali Ahmed Ali Elsaidy).
3. countryCode: رمز الدولة من بين القيم التالية فقط: "EG" (إذا كانت بطاقة رقم قومي مصرية أو عنوان في مصر)، "SA" (إذا كانت هوية وطنية سعودية أو عنوان في السعودية)، "LV" (الشام والعراق)، "GF" (الخليج العربي)، "MG" (المغرب العربي والسودان).
4. governorateOrRegion: اسم المحافظة أو المنطقة المستخرجة من العنوان أو كود المحافظة في الرقم القومي (مثال: "محافظة الغربية" أو "منطقة حائل" أو "محافظة سوهاج").
5. centerOrVillage: اسم المركز أو المدينة أو القرية أو الحي السكني (مثال: "طنطا" أو "مركز السنطة" أو "حي الزبارة").
6. idHash: بصمة منع التكرار الفريدة المكونة من (سنة الميلاد من 4 أرقام) متبوعة بشرطة (-) ثم (آخر 4 أرقام من الرقم القومي أو رقم الهوية من اليمين)، مثال: "1990-4821".
7. birthYear: سنة الميلاد المستخرجة (مثال: "1990").`;

            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: {
                parts: [
                  {
                    inlineData: {
                      mimeType,
                      data: cleanBase64,
                    },
                  },
                  {
                    text: promptText,
                  },
                ],
              },
              config: {
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    arabicName: { type: Type.STRING },
                    englishName: { type: Type.STRING },
                    countryCode: { type: Type.STRING },
                    governorateOrRegion: { type: Type.STRING },
                    centerOrVillage: { type: Type.STRING },
                    idHash: { type: Type.STRING },
                    birthYear: { type: Type.STRING },
                  },
                  required: [
                    'arabicName',
                    'englishName',
                    'countryCode',
                    'governorateOrRegion',
                    'centerOrVillage',
                    'idHash',
                  ],
                },
              },
            });

            const extracted = JSON.parse(response.text || '{}');
            res.statusCode = 200;
            res.end(JSON.stringify({ ok: true, extracted }));
          } catch (err: unknown) {
            const message =
              err instanceof Error ? err.message : 'تعذر تحليل البطاقة عبر الذكاء الاصطناعي';
            res.statusCode = 500;
            res.end(JSON.stringify({ ok: false, error: message }));
          }
        });
      });
    },
  };
}

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
    plugins: [react(), tailwindcss(), elsaidyIdScannerApiPlugin(), inlineRenderBlockingCssPlugin()],
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
