import { GoogleGenAI, Type } from '@google/genai';

interface Env {
  GEMINI_API_KEY?: string;
}

interface ScanIdRequestBody {
  imageBase64?: string;
  mimeType?: string;
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
5. centerOrVillage: اسم المركز أو المدينة أو القرية أو الحي السكني (مثال: "طنطا" أو "مركز السنطة - قرية ..." أو "حي الزبارة").
6. idHash: بصمة منع التكرار الفريدة المكونة من (سنة الميلاد من 4 أرقام) متبوعة بشرطة (-) ثم (آخر 4 أرقام من الرقم القومي أو رقم الهوية من اليمين)، مثال: "1990-4821". بالنسبة للرقم القومي المصري المكون من 14 رقماً: الرقم الأول 2 يعني مواليد 1900+ والرقم 3 يعني مواليد 2000+ يليه سنتان للشهر واليوم، استخرج سنة الميلاد بدقة مع آخر 4 أرقام في أقصى اليمين.
7. birthYear: سنة الميلاد المستخرجة (مثال: "1990").`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
