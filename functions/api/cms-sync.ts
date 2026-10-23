interface Env {
  GITHUB_PAT?: string;
  GITHUB_OWNER?: string;
  GITHUB_REPO?: string;
  GITHUB_BRANCH?: string;
  ADMIN_SYNC_SECRET?: string;
}

interface SyncRequestBody {
  filePath?: string;
  contentBase64?: string;
  commitMessage?: string;
  dbPayload?: unknown;
  owner?: string;
  repo?: string;
  branch?: string;
}

function encodeUtf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const { request, env } = context;

  const cfAccessJwt = request.headers.get('Cf-Access-Jwt-Assertion');
  const adminHeaderSecret = request.headers.get('X-Elsaidy-Admin-Secret');

  if (env.ADMIN_SYNC_SECRET && adminHeaderSecret !== env.ADMIN_SYNC_SECRET && !cfAccessJwt) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'غير مصرح بالمزامنة: يرجى التحقق من صلاحية الدخول عبر Cloudflare Access أو رمز الخادم.',
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    );
  }

  const token = env.GITHUB_PAT;
  if (!token) {
    return new Response(
      JSON.stringify({
        ok: false,
        needsInMemoryToken: true,
        error:
          'لم يتم ضبط متغير البيئة السحابي (GITHUB_PAT) في إعدادات Cloudflare Pages بعد. يمكنك استخدام خيار الرمز المؤقت في الذاكرة (In-Memory Session Token) أو تصدير ملف cms-db.json.',
      }),
      {
        status: 501,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    );
  }

  try {
    const body = (await request.json()) as SyncRequestBody;
    const owner = (env.GITHUB_OWNER || body.owner || 'AliAhmedElseidy').trim();
    const repo = (env.GITHUB_REPO || body.repo || 'elsaidy-org').trim();
    const branch = (env.GITHUB_BRANCH || body.branch || 'main').trim();
    const filePath = (body.filePath || 'public/data/cms-db.json').replace(/^\/+/, '');

    const contentBase64 =
      body.contentBase64 ||
      encodeUtf8ToBase64(JSON.stringify(body.dbPayload ?? {}, null, 2));

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    let existingSha: string | undefined;
    const getRes = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'ELSAIDY-Cloudflare-Pages-CMS',
      },
    });

    if (getRes.ok) {
      const fileData = (await getRes.json()) as { sha?: string };
      existingSha = fileData.sha;
    }

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'ELSAIDY-Cloudflare-Pages-CMS',
      },
      body: JSON.stringify({
        message:
          body.commitMessage ||
          `Sync ELSAIDY CMS Database (${new Date().toISOString().slice(0, 10)})`,
        content: contentBase64,
        branch,
        ...(existingSha ? { sha: existingSha } : {}),
      }),
    });

    if (!putRes.ok) {
      const errData = (await putRes.json().catch(() => ({}))) as { message?: string };
      return new Response(
        JSON.stringify({
          ok: false,
          error: errData.message || `GitHub API HTTP ${putRes.status}`,
        }),
        {
          status: putRes.status,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        filePath,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected server error';
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
};
