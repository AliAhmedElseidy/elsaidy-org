import { GoogleGenAI, Type } from '@google/genai';

interface Env {
  GEMINI_API_KEY?: string;
}

interface ScanIdRequestBody {
  imageBase64?: string;
  mimeType?: string;
  model?: string;
}

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const { request, env } = context;
  const apiKey = env.GEMINI_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        ok: false,
        error:
          'لم يتم العثور على مفتاح GEMINI_API_KEY في بيئة الخادم. يرجى التأكد من إعداده في Secrets.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    );
  }

  try {
    const body = (await request.json()) as ScanIdRequestBody;
    const rawBase64 = (body.imageBase64 || '').replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
    const mimeType = body.mimeType || 'image/jpeg';
    const requestedModel = (body.model || 'gemini-2.5-flash').trim() || 'gemini-2.5-flash';

    if (!rawBase64) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'لم يتم إرسال بيانات الصورة لاستخراج النص منها.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        }
      );
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
1. arabicName: الاسم الرباعي أو الكامل بالعربية كما هو مكتوب في البطاقة (وإذا لم ينتهِ بلقب "الصعيدي" أضف "الصعيدي" في نهاية الاسم فقط إن كان السياق عائلياً أو اترك الاسم الرباعي/الخماسي واضحاً).
2. englishName: ترجمة الاسم الكامل إلى الإنجليزية بدقة واحترافية (مثال: Ali Ahmed Ali Elsaidy).
3. countryCode: رمز الدولة من بين القيم التالية فقط: "EG" (إذا كانت بطاقة رقم قومي مصرية أو عنوان في مصر)، "SA" (إذا كانت هوية وطنية سعودية أو عنوان في السعودية)، "LV" (الشام والعراق)، "GF" (الخليج العربي)، "MG" (المغرب العربي والسودان).
4. governorateOrRegion: اسم المحافظة أو المنطقة المستخرجة من العنوان أو كود المحافظة في الرقم القومي (مثال: "محافظة الغربية" أو "منطقة حائل" أو "محافظة سوهاج").
5. centerOrVillage: اسم المركز أو المدينة أو القرية أو الحي السكني (مثال: "طنطا" أو "مركز السنطة" أو "حي الزبارة") لتفعيل الربط التلقائي بالجذور التاريخية.
6. idHash: بصمة منع التكرار الفريدة بصيغة (سنة الميلاد من 4 أرقام)-(4 أرقام مميزة)، مثال: "1990-4821":
   - الوضع الأساسي: استخرج (سنة الميلاد من 4 أرقام) متبوعة بشرطة (-) ثم (آخر 4 أرقام من الرقم القومي المكون من 14 رقماً في أقصى اليمين).
   - البديل الذكي عند طمس أو تغطية الرقم القومي: إذا كان الرقم القومي (14 رقماً) مشطوباً أو مغطى أو غير واضح في الصورة، استخرج سنة الميلاد من تاريخ الميلاد أو أعلى البطاقة، ثم خذ (آخر 4 أرقام من الكود المطبوع أسفل الصورة الشخصية مباشرة على يسار البطاقة، مثل الكود IS9427026 فتأخذ 7026)، بحيث لا تفشل عملية استخراج idHash أبداً.
7. birthYear: سنة الميلاد المستخرجة من 4 أرقام (مثال: "1990").`;

    const generateWithModel = async (modelName: string) =>
      ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: rawBase64,
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

    let response;
    try {
      response = await generateWithModel(requestedModel);
    } catch (firstErr) {
      // Automatic fallback if a preview/lite alias like gemini-3.5-flash-lite is not yet enabled on the key
      if (requestedModel !== 'gemini-2.5-flash') {
        response = await generateWithModel('gemini-2.5-flash');
      } else {
        throw firstErr;
      }
    }

    const parsed = JSON.parse(response.text || '{}');

    return new Response(
      JSON.stringify({
        ok: true,
        extracted: parsed,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'تعذر تحليل البطاقة عبر الذكاء الاصطناعي';
    return new Response(
      JSON.stringify({
        ok: false,
        error: message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    );
  }
};
