import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  FileText,
  Award,
  Users,
  CloudUpload,
  Plus,
  Trash2,
  Edit3,
  Printer,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
  Save,
  Download,
  ArrowRight,
  Eye,
  Sparkles,
} from 'lucide-react';
import {
  PageRoute,
  DiwanArticle,
  IssuedCertificateRecord,
} from '../data/familyData';
import { CertificateDocumentView } from '../components/CertificateDocumentView';

interface AdminCmsPageProps {
  onNavigate: (page: PageRoute) => void;
  visitorCount: number;
  onUpdateVisitorCount: (newCount: number) => void;
  articles: DiwanArticle[];
  onUpdateArticles: (newArticles: DiwanArticle[]) => void;
  issuedCertificates: IssuedCertificateRecord[];
  onUpdateCertificates: (newCerts: IssuedCertificateRecord[]) => void;
  customNames: string[];
  onUpdateCustomNames: (newNames: string[]) => void;
}

const ADMIN_SESSION_KEY = 'elsaidy_cms_admin_unlocked_v1';
const GITHUB_CONFIG_STORAGE_KEY = 'elsaidy_cms_github_config_v1';

interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

const encodeUtf8ToBase64 = (str: string): string => {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const AdminCmsPage: React.FC<AdminCmsPageProps> = ({
  onNavigate,
  visitorCount,
  onUpdateVisitorCount,
  articles,
  onUpdateArticles,
  issuedCertificates,
  onUpdateCertificates,
  customNames,
  onUpdateCustomNames,
}) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<
    'posts' | 'certificates' | 'names' | 'github'
  >('posts');

  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // --- MODULE 1: POSTS CMS STATE ---
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [postForm, setPostForm] = useState<{
    title: string;
    category: 'heritage' | 'research' | 'documents' | 'news';
    author: string;
    authorTitle: string;
    publishDate: string;
    hijriDate: string;
    readTime: string;
    excerpt: string;
    coverImage: string;
    sectionHeading: string;
    sectionBody: string;
  }>({
    title: '',
    category: 'heritage',
    author: 'لجنة التوثيق التاريخي والأنساب',
    authorTitle: 'الأمانة العامة للموقع الرسمي لعائلات الصعيدي (elsaidy.org)',
    publishDate: '٢٢ أكتوبر ٢٠٢٦ م',
    hijriDate: '١١ ربيع الآخر ١٤٤٨ هـ',
    readTime: '٦ دقائق للقراءة',
    excerpt: '',
    coverImage: '',
    sectionHeading: 'المتن التوثيقي والتاريخي',
    sectionBody: '',
  });
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // --- MODULE 2: CERTIFICATE STUDIO STATE ---
  const [certForm, setCertForm] = useState<{
    serialNumber: string;
    arabicName: string;
    englishName: string;
    country: string;
    countryCode: string;
    regionBranch: string;
    lineageNarrative: string;
    documentType: 'a4-certificate' | 'vip-id';
    issueDateGregorian: string;
    issueDateHijri: string;
    includeFamilyTreeStamp: boolean;
  }>({
    serialNumber: `ELS-2026-EG-${String(issuedCertificates.length + 10).padStart(3, '0')}`,
    arabicName: 'علي أحمد علي الصعيدي',
    englishName: 'Ali Ahmed Ali Elsaidy',
    country: 'جمهورية مصر العربية',
    countryCode: 'EG',
    regionBranch: 'محافظة الغربية - مدينة طنطا / صعيد مصر / القاهرة',
    lineageNarrative:
      'ينتسب إلى الذرية الموثقة لعائلات الصعيدي (آل الصعيدي — Elsaidy / Elseidy) ذات الجذور العربية الأصيلة المتصلة بقبيلة جهينة القضاعية من ينبع النخل والامتداد الحجازي والصعيدي العريق في الديار المصرية (صعيد مصر ومحافظة الغربية وطنطا والدلتا والقاهرة).',
    documentType: 'a4-certificate',
    issueDateGregorian: new Date().toISOString().slice(0, 10),
    issueDateHijri: '١١ ربيع الآخر ١٤٤٨ هـ',
    includeFamilyTreeStamp: true,
  });

  // --- MODULE 3: SEO NAMES & BRANCHES STATE ---
  const [newNameInput, setNewNameInput] = useState<string>('');

  // --- MODULE 4: VISITOR COUNTER & GITHUB API STATE ---
  const [manualVisitorInput, setManualVisitorInput] = useState<string>(
    String(visitorCount)
  );
  const [githubConfig, setGithubConfig] = useState<GitHubConfig>(() => {
    try {
      const saved = localStorage.getItem(GITHUB_CONFIG_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      token: '',
      owner: '',
      repo: '',
      branch: 'main',
    };
  });
  const [isSyncingGitHub, setIsSyncingGitHub] = useState<boolean>(false);

  const categoryLabels: Record<string, string> = {
    heritage: 'تحقيق الأنساب والتاريخ',
    research: 'الدراسات التاريخية والمصادر',
    documents: 'المراجع والوثائق المعتمدة',
    news: 'أخبار وبيانات الديوان والبراند',
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = passwordInput.trim();
    if (cleaned === 'ELSAIDY2026' || cleaned === 'elsaidy2026') {
      setIsUnlocked(true);
      setAuthError('');
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } catch {
        // ignore
      }
    } else {
      setAuthError(
        'رمز المرور غير صحيح. هذه البوابة مخصصة حصرياً للأمانة العامة وإدارة الموقع.'
      );
    }
  };

  const handleLockSession = () => {
    setIsUnlocked(false);
    setPasswordInput('');
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      // ignore
    }
  };

  // --- MODULE 1 HANDLERS ---
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.excerpt.trim() || !postForm.sectionBody.trim()) {
      setStatusBanner({
        type: 'error',
        message: 'يرجى تعبئة عنوان المقال والملخص والنص التفصيلي قبل الحفظ.',
      });
      return;
    }

    if (editingArticleId) {
      const updated = articles.map((art) =>
        art.id === editingArticleId
          ? {
              ...art,
              title: postForm.title.trim(),
              category: postForm.category,
              categoryLabel: categoryLabels[postForm.category],
              author: postForm.author.trim(),
              authorTitle: postForm.authorTitle.trim(),
              publishDate: postForm.publishDate.trim(),
              hijriDate: postForm.hijriDate.trim(),
              readTime: postForm.readTime.trim(),
              excerpt: postForm.excerpt.trim(),
              coverImage: postForm.coverImage.trim() || undefined,
              sections: [
                {
                  heading: postForm.sectionHeading.trim() || 'المتن التوثيقي والتاريخي',
                  body: postForm.sectionBody.trim(),
                },
              ],
            }
          : art
      );
      onUpdateArticles(updated);
      setEditingArticleId(null);
      setStatusBanner({
        type: 'success',
        message: 'تم تحديث المقال بنجاح في قاعدة بيانات الديوان.',
      });
    } else {
      const newArticle: DiwanArticle = {
        id: `diwan-cms-${Date.now()}`,
        index: String(articles.length + 1).padStart(2, '0'),
        title: postForm.title.trim(),
        category: postForm.category,
        categoryLabel: categoryLabels[postForm.category],
        publishDate: postForm.publishDate.trim(),
        hijriDate: postForm.hijriDate.trim(),
        readTime: postForm.readTime.trim(),
        author: postForm.author.trim(),
        authorTitle: postForm.authorTitle.trim(),
        excerpt: postForm.excerpt.trim(),
        coverImage: postForm.coverImage.trim() || undefined,
        sections: [
          {
            heading: postForm.sectionHeading.trim() || 'المتن التوثيقي والتاريخي',
            body: postForm.sectionBody.trim(),
          },
        ],
      };
      onUpdateArticles([newArticle, ...articles]);
      setStatusBanner({
        type: 'success',
        message: 'تم نشر المقال الجديد وإضافته إلى ديوان عائلة الصعيدي بنجاح.',
      });
    }

    setPostForm({
      title: '',
      category: 'heritage',
      author: 'لجنة التوثيق التاريخي والأنساب',
      authorTitle: 'الأمانة العامة للموقع الرسمي لعائلات الصعيدي (elsaidy.org)',
      publishDate: '٢٢ أكتوبر ٢٠٢٦ م',
      hijriDate: '١١ ربيع الآخر ١٤٤٨ هـ',
      readTime: '٦ دقائق للقراءة',
      excerpt: '',
      coverImage: '',
      sectionHeading: 'المتن التوثيقي والتاريخي',
      sectionBody: '',
    });
  };

  const handleEditArticleClick = (art: DiwanArticle) => {
    setEditingArticleId(art.id);
    setPostForm({
      title: art.title,
      category: art.category,
      author: art.author,
      authorTitle: art.authorTitle,
      publishDate: art.publishDate,
      hijriDate: art.hijriDate,
      readTime: art.readTime,
      excerpt: art.excerpt,
      coverImage: art.coverImage || '',
      sectionHeading: art.sections[0]?.heading || 'المتن التوثيقي والتاريخي',
      sectionBody: art.sections.map((s) => s.body).join('\n\n'),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteArticle = (id: string) => {
    const filtered = articles.filter((a) => a.id !== id);
    onUpdateArticles(filtered);
    setStatusBanner({
      type: 'info',
      message: 'تم حذف المقال من الديوان.',
    });
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        // If GitHub config is filled, attempt to upload to public/uploads/ in repo
        if (githubConfig.token && githubConfig.owner && githubConfig.repo) {
          try {
            const base64Content = dataUrl.split(',')[1];
            const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
            const path = `public/uploads/${safeName}`;
            const apiUrl = `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${path}`;
            const res = await fetch(apiUrl, {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${githubConfig.token}`,
                Accept: 'application/vnd.github+json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message: `Upload article image ${safeName} via ELSAIDY CMS`,
                content: base64Content,
                branch: githubConfig.branch || 'main',
              }),
            });
            if (res.ok) {
              setPostForm((prev) => ({ ...prev, coverImage: `/uploads/${safeName}` }));
              setStatusBanner({
                type: 'success',
                message: `تم رفع الصورة مباشرة إلى مستودع GitHub في المسار /uploads/${safeName}`,
              });
              setUploadingImage(false);
              return;
            }
          } catch {
            // fallback to inline dataUrl
          }
        }
        setPostForm((prev) => ({ ...prev, coverImage: dataUrl }));
        setStatusBanner({
          type: 'success',
          message: 'تم إرفاق الصورة بنجاح للمقال.',
        });
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadingImage(false);
    }
  };

  // --- MODULE 2 HANDLERS ---
  const handleGenerateNewSerial = (countryCode = certForm.countryCode) => {
    const rand = Math.floor(100 + Math.random() * 899);
    const nextSerial = `ELS-2026-${countryCode}-${rand}`;
    setCertForm((prev) => ({ ...prev, serialNumber: nextSerial }));
  };

  const handleSaveCertificate = () => {
    if (!certForm.arabicName.trim() || !certForm.serialNumber.trim()) {
      setStatusBanner({
        type: 'error',
        message: 'يرجى إدخال الاسم الكامل والرقم المرجعي للوثيقة.',
      });
      return;
    }

    const record: IssuedCertificateRecord = {
      serialNumber: certForm.serialNumber.trim().toUpperCase(),
      arabicName: certForm.arabicName.trim(),
      englishName: certForm.englishName.trim(),
      country: certForm.country,
      countryCode: certForm.countryCode,
      regionBranch: certForm.regionBranch.trim(),
      lineageNarrative: certForm.lineageNarrative.trim(),
      documentType: certForm.documentType,
      issueDateGregorian: certForm.issueDateGregorian,
      issueDateHijri: certForm.issueDateHijri,
      status: 'وثيقة نسب معتمدة ومطابقة للسجل العام',
    };

    const filtered = issuedCertificates.filter(
      (c) => c.serialNumber.toUpperCase() !== record.serialNumber
    );
    onUpdateCertificates([record, ...filtered]);
    setStatusBanner({
      type: 'success',
      message: `تم حفظ واعتماد الوثيقة رقم (${record.serialNumber}) في السجل العام للتحقق الفوري.`,
    });
  };

  const handleDeleteCertificate = (serial: string) => {
    const filtered = issuedCertificates.filter(
      (c) => c.serialNumber.toUpperCase() !== serial.toUpperCase()
    );
    onUpdateCertificates(filtered);
    setStatusBanner({
      type: 'info',
      message: `تم حذف الوثيقة (${serial}) من السجل المخصص.`,
    });
  };

  // --- MODULE 3 HANDLERS ---
  const handleAddCompoundName = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newNameInput.trim();
    if (!cleaned) return;
    if (!customNames.includes(cleaned)) {
      onUpdateCustomNames([cleaned, ...customNames]);
      setStatusBanner({
        type: 'success',
        message: `تمت إضافة "${cleaned}" إلى موسوعة الأسماء ومحركات البحث (SEO).`,
      });
    }
    setNewNameInput('');
  };

  const handleRemoveCompoundName = (nameToRemove: string) => {
    onUpdateCustomNames(customNames.filter((n) => n !== nameToRemove));
  };

  // --- MODULE 4 HANDLERS ---
  const handleSaveGitHubConfig = () => {
    try {
      localStorage.setItem(GITHUB_CONFIG_STORAGE_KEY, JSON.stringify(githubConfig));
      setStatusBanner({
        type: 'success',
        message: 'تم حفظ إعدادات الربط السحابي مع GitHub محلياً بنجاح.',
      });
    } catch {
      // ignore
    }
  };

  const handleSyncToGitHub = async () => {
    if (!githubConfig.token.trim() || !githubConfig.owner.trim() || !githubConfig.repo.trim()) {
      setStatusBanner({
        type: 'error',
        message:
          'يرجى إدخال رمز الوصول الشخصي (GitHub Personal Access Token) واسم المالك (Owner) واسم المستودع (Repository) أولاً.',
      });
      return;
    }

    setIsSyncingGitHub(true);
    setStatusBanner({
      type: 'info',
      message: 'جاري الاتصال بواجهة GitHub API ومزامنة قاعدة البيانات (public/data/cms-db.json)...',
    });

    try {
      localStorage.setItem(GITHUB_CONFIG_STORAGE_KEY, JSON.stringify(githubConfig));

      const dbPayload = {
        visitorCount,
        lastUpdated: new Date().toISOString(),
        customNames,
        certificates: issuedCertificates,
        articles,
      };

      const filePath = 'public/data/cms-db.json';
      const branch = githubConfig.branch.trim() || 'main';
      const apiUrl = `https://api.github.com/repos/${githubConfig.owner.trim()}/${githubConfig.repo.trim()}/contents/${filePath}`;

      // 1. Check if file already exists to retrieve its SHA
      let existingSha: string | undefined;
      const getRes = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, {
        headers: {
          Authorization: `Bearer ${githubConfig.token.trim()}`,
          Accept: 'application/vnd.github+json',
        },
      });

      if (getRes.ok) {
        const fileData = await getRes.json();
        existingSha = fileData.sha;
      }

      // 2. Commit updated JSON file to GitHub
      const encodedContent = encodeUtf8ToBase64(JSON.stringify(dbPayload, null, 2));
      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${githubConfig.token.trim()}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `chore(cms): sync cms-db.json via ELSAIDY Cloud CMS (${new Date().toISOString()})`,
          content: encodedContent,
          branch,
          ...(existingSha ? { sha: existingSha } : {}),
        }),
      });

      if (!putRes.ok) {
        const errBody = await putRes.json().catch(() => ({}));
        throw new Error(errBody.message || `HTTP ${putRes.status}`);
      }

      setStatusBanner({
        type: 'success',
        message:
          'تمت المزامنة والحفظ الدائم على GitHub بنجاح! سيقوم Cloudflare Pages بتحديث الموقع المباشر خلال لحظات.',
      });
    } catch (err: any) {
      setStatusBanner({
        type: 'error',
        message: `تعذر إتمام المزامنة مع GitHub: ${err?.message || 'تأكد من صلاحيات الـ Token واسم المستودع.'}`,
      });
    } finally {
      setIsSyncingGitHub(false);
    }
  };

  const handleExportJsonFile = () => {
    const dbPayload = {
      visitorCount,
      lastUpdated: new Date().toISOString(),
      customNames,
      certificates: issuedCertificates,
      articles,
    };
    const blob = new Blob([JSON.stringify(dbPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cms-db.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- LOCKED LOGIN VIEW ---
  if (!isUnlocked) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-xl bg-gradient-to-b from-[#0A141D] to-[#0F291E] text-white rounded-2xl border-2 border-[#D4AF37]/50 p-8 sm:p-10 shadow-2xl">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/10">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase block">
                ELSAIDY CLOUD CMS — RESTRICTED ACCESS
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                بوابة القيادة والإدارة المركزية | ELSAIDY Cloud CMS
              </h1>
            </div>
          </div>

          <p className="text-sm text-[#E6DFD3] leading-relaxed mb-6">
            هذه اللوحة السحابية مخصصة حصرياً للأمانة العامة وإدارة الموقع الرسمي لعائلات
            الصعيدي ومجموعة الصعيدي لإدارة المقالات، إصدار الشهادات والبطاقات الرسمية،
            تحديث موسوعة الأسماء، والمزامنة المباشرة مع مستودع GitHub.
          </p>

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="cms-master-password"
                className="block text-xs font-bold text-[#D4AF37] mb-2"
              >
                رمز التصريح الإداري المعتمد (Master Password):
              </label>
              <input
                id="cms-master-password"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="أدخل رمز التصريح الإداري..."
                dir="ltr"
                className="w-full px-4 py-3.5 rounded-xl bg-black/35 border border-white/20 text-white font-mono text-sm focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-xs font-bold text-[#FCA5A5] bg-[#7F1D1D]/40 border border-[#EF4444]/40 rounded-lg px-3.5 py-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="px-4 py-3 rounded-xl border border-white/20 text-xs font-bold text-[#E6DFD3] hover:text-white cursor-pointer"
              >
                العودة للصفحة الرئيسية
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#e3be42] text-[#0A141D] font-extrabold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>فتح لوحة القيادة المركزية</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- UNLOCKED FULL BLOGGER-STYLE ADMIN CMS ---
  return (
    <div className="py-8 lg:py-12 space-y-8">
      {/* Top Admin Header (Hidden when printing certificate) */}
      <header className="no-print bg-gradient-to-r from-[#0A141D] via-[#0F291E] to-[#0A141D] text-white rounded-2xl border border-[#D4AF37]/40 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider">
                ELSAIDY CLOUD CMS &amp; GITHUB SYNC ENGINE
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                بوابة القيادة والإدارة المركزية | ELSAIDY Cloud CMS
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>معاينة الموقع العام</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('github')}
              className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#e2be46] text-[#0A141D] text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
            >
              <CloudUpload className="w-4 h-4" />
              <span>مزامنة مع GitHub الآن</span>
            </button>
            <button
              type="button"
              onClick={handleLockSession}
              className="px-3.5 py-2 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-bold text-[#E6DFD3] cursor-pointer"
            >
              قفل اللوحة
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              id: 'posts',
              label: '١. إدارة الديوان والمقالات',
              sub: `Posts CMS (${articles.length} مقال)`,
              icon: FileText,
            },
            {
              id: 'certificates',
              label: '٢. استوديو إصدار الشهادات والبطاقات',
              sub: `Certificate & VIP Studio (${issuedCertificates.length})`,
              icon: Award,
            },
            {
              id: 'names',
              label: '٣. موسوعة الأسماء والفروع (SEO)',
              sub: `SEO Names Manager (${customNames.length})`,
              icon: Users,
            },
            {
              id: 'github',
              label: '٤. عداد الزوار والربط السحابي GitHub',
              sub: `العداد: ${visitorCount.toLocaleString('en-US')}`,
              icon: CloudUpload,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`p-4 rounded-xl border text-right transition-all cursor-pointer flex items-start gap-3 ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#0A141D] border-[#D4AF37] shadow-lg'
                    : 'bg-white/5 text-white border-white/15 hover:bg-white/10'
                }`}
              >
                <Icon
                  className={`w-5 h-5 mt-0.5 shrink-0 ${
                    isActive ? 'text-[#0A141D]' : 'text-[#D4AF37]'
                  }`}
                />
                <div>
                  <div className="text-xs sm:text-sm font-extrabold">{tab.label}</div>
                  <div
                    className={`text-[11px] font-mono mt-0.5 ${
                      isActive ? 'text-[#0A141D]/80 font-bold' : 'text-[#E6DFD3]'
                    }`}
                  >
                    {tab.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </header>

      {/* Status Notification Banner */}
      {statusBanner && (
        <div
          className={`no-print p-4 rounded-xl border flex items-center justify-between gap-4 ${
            statusBanner.type === 'success'
              ? 'bg-[#F0FDF4] border-[#166534] text-[#14532D]'
              : statusBanner.type === 'error'
              ? 'bg-[#FEF2F2] border-[#991B1B] text-[#7F1D1D]'
              : 'bg-[#F7F6F2] border-[#695022] text-[#141413]'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{statusBanner.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusBanner(null)}
            className="text-xs font-bold underline cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* ===================================================================
          MODULE 1: POSTS CMS (إدارة الديوان والمقالات)
      =================================================================== */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left/Main Column: Blogger-style Editor */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E6E2D8] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E6E2D8]">
              <div>
                <span className="text-xs font-bold text-[#695022] block">
                  محرر الديوان والمقالات الرسمي (Blogger-Style Post Editor)
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#141413]">
                  {editingArticleId ? 'تعديل مقال منشور' : 'إضافة مقال أو بيان تاريخي جديد'}
                </h2>
              </div>
              {editingArticleId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingArticleId(null);
                    setPostForm({
                      title: '',
                      category: 'heritage',
                      author: 'لجنة التوثيق التاريخي والأنساب',
                      authorTitle:
                        'الأمانة العامة للموقع الرسمي لعائلات الصعيدي (elsaidy.org)',
                      publishDate: '٢٢ أكتوبر ٢٠٢٦ م',
                      hijriDate: '١١ ربيع الآخر ١٤٤٨ هـ',
                      readTime: '٦ دقائق للقراءة',
                      excerpt: '',
                      coverImage: '',
                      sectionHeading: 'المتن التوثيقي والتاريخي',
                      sectionBody: '',
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg border border-[#E6E2D8] text-xs font-bold text-zinc-700 cursor-pointer"
                >
                  إلغاء التعديل
                </button>
              )}
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1.5">
                  عنوان المقال أو البحث التوثيقي:
                </label>
                <input
                  type="text"
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  placeholder="مثال: دراسة توثيقية في تاريخ عائلات الصعيدي والامتداد الحجازي..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] text-sm font-bold text-[#141413]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1.5">
                    التصنيف الموضوعي:
                  </label>
                  <select
                    value={postForm.category}
                    onChange={(e) =>
                      setPostForm({
                        ...postForm,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] text-sm font-bold text-[#141413]"
                  >
                    <option value="heritage">تحقيق الأنساب والتاريخ</option>
                    <option value="research">الدراسات التاريخية والمصادر</option>
                    <option value="documents">المراجع والوثائق المعتمدة</option>
                    <option value="news">أخبار وبيانات الديوان والبراند</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1.5">
                    اسم الكاتب / الجهة المصدرة:
                  </label>
                  <input
                    type="text"
                    value={postForm.author}
                    onChange={(e) =>
                      setPostForm({ ...postForm, author: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] text-sm font-bold text-[#141413]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1.5">
                    التاريخ الميلادي:
                  </label>
                  <input
                    type="text"
                    value={postForm.publishDate}
                    onChange={(e) =>
                      setPostForm({ ...postForm, publishDate: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] text-xs font-bold text-[#141413]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1.5">
                    التاريخ الهجري:
                  </label>
                  <input
                    type="text"
                    value={postForm.hijriDate}
                    onChange={(e) =>
                      setPostForm({ ...postForm, hijriDate: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] text-xs font-bold text-[#141413]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1.5">
                    مدة القراءة:
                  </label>
                  <input
                    type="text"
                    value={postForm.readTime}
                    onChange={(e) =>
                      setPostForm({ ...postForm, readTime: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] text-xs font-bold text-[#141413]"
                  />
                </div>
              </div>

              {/* Image URL or File Upload */}
              <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] space-y-3">
                <label className="block text-xs font-bold text-[#0F291E]">
                  صورة المقال أو الوثيقة (رابط مباشر أو رفع صورة من جهازك):
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={postForm.coverImage}
                    onChange={(e) =>
                      setPostForm({ ...postForm, coverImage: e.target.value })
                    }
                    placeholder="https://... أو ارفع صورة من الزر المجاور"
                    dir="ltr"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#D5D0C5] text-xs font-mono text-[#141413]"
                  />
                  <label className="px-4 py-2 rounded-xl bg-[#0F291E] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shrink-0">
                    <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                    <span>{uploadingImage ? 'جاري الرفع...' : 'رفع صورة من الجهاز'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1.5">
                  ملخص المقال (مقدمة تظهر في البطاقة الرئيسية):
                </label>
                <textarea
                  rows={2}
                  value={postForm.excerpt}
                  onChange={(e) =>
                    setPostForm({ ...postForm, excerpt: e.target.value })
                  }
                  placeholder="ملخص موجز للمقال أو البيان..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] text-sm text-[#141413]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1.5">
                  عنوان الفصل الداخلي:
                </label>
                <input
                  type="text"
                  value={postForm.sectionHeading}
                  onChange={(e) =>
                    setPostForm({ ...postForm, sectionHeading: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] text-xs font-bold text-[#141413]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1.5">
                  النص الكامل للمقال أو الوثيقة:
                </label>
                <textarea
                  rows={6}
                  value={postForm.sectionBody}
                  onChange={(e) =>
                    setPostForm({ ...postForm, sectionBody: e.target.value })
                  }
                  placeholder="اكتب النص التفصيلي الكامل للمقال أو الدراسة..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] text-sm text-[#141413] leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#0F291E] hover:bg-[#163d2c] text-white text-xs font-extrabold flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#D4AF37]" />
                  <span>
                    {editingArticleId
                      ? 'حفظ التعديلات على المقال'
                      : 'نشر المقال في الديوان الآن'}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Existing Articles List */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E6E2D8] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E6E2D8]">
              <div>
                <span className="text-xs font-bold text-[#695022] block">
                  إدارة المحتوى المنشور
                </span>
                <h3 className="font-serif text-xl font-bold text-[#141413]">
                  قائمة مقالات الديوان ({articles.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('diwan')}
                className="text-xs font-bold text-[#0F291E] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>فتح صفحة الديوان</span>
              </button>
            </div>

            <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#695022] font-bold mb-1">
                      <span>{art.categoryLabel}</span>
                      <span>{art.publishDate}</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-[#141413] leading-snug">
                      {art.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E6E2D8]">
                    <button
                      type="button"
                      onClick={() => handleEditArticleClick(art)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#D5D0C5] hover:border-[#0F291E] text-xs font-bold text-[#0F291E] flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteArticle(art.id)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#FCA5A5] hover:bg-[#FEF2F2] text-xs font-bold text-[#991B1B] flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODULE 2: CERTIFICATE & VIP ID STUDIO (استوديو إصدار الشهادات)
      =================================================================== */}
      {activeTab === 'certificates' && (
        <div className="space-y-10">
          <div className="no-print grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E6E2D8] p-6 sm:p-8 shadow-sm">
              <div className="pb-4 mb-6 border-b border-[#E6E2D8] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-[#695022] block">
                    إصدار وتخصيص الوثائق الملكية وبطاقات العضوية
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#141413]">
                    استوديو إصدار شهادات النسب والبطاقات الرسمية
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCertForm({ ...certForm, documentType: 'a4-certificate' })
                    }
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                      certForm.documentType === 'a4-certificate'
                        ? 'bg-[#0F291E] text-white border-[#0F291E]'
                        : 'bg-[#F7F6F2] text-[#141413] border-[#D5D0C5]'
                    }`}
                  >
                    شهادة نسب ملكية (A4)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCertForm({ ...certForm, documentType: 'vip-id' })
                    }
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                      certForm.documentType === 'vip-id'
                        ? 'bg-[#0F291E] text-white border-[#0F291E]'
                        : 'bg-[#F7F6F2] text-[#141413] border-[#D5D0C5]'
                    }`}
                  >
                    بطاقة عضوية (VIP ID)
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#141413] mb-1.5">
                      الاسم الكامل بالعربية (رباعي أو خماسي):
                    </label>
                    <input
                      type="text"
                      value={certForm.arabicName}
                      onChange={(e) =>
                        setCertForm({ ...certForm, arabicName: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] text-sm font-bold text-[#141413]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#141413] mb-1.5">
                      الاسم بالإنجليزية (English Full Name):
                    </label>
                    <input
                      type="text"
                      value={certForm.englishName}
                      onChange={(e) =>
                        setCertForm({ ...certForm, englishName: e.target.value })
                      }
                      dir="ltr"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] text-sm font-bold text-[#141413]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#141413] mb-1.5">
                      الدولة / الإقليم:
                    </label>
                    <select
                      value={certForm.countryCode}
                      onChange={(e) => {
                        const code = e.target.value;
                        const map: Record<string, string> = {
                          EG: 'جمهورية مصر العربية',
                          SA: 'المملكة العربية السعودية',
                          LEV: 'بلاد الشام والعراق',
                          AE: 'دول الخليج العربي (الإمارات / عُمان)',
                          MGH: 'المغرب العربي والسودان',
                        };
                        setCertForm({
                          ...certForm,
                          countryCode: code,
                          country: map[code] || 'جمهورية مصر العربية',
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] text-xs font-bold text-[#141413]"
                    >
                      <option value="EG">جمهورية مصر العربية (EG)</option>
                      <option value="SA">المملكة العربية السعودية (SA)</option>
                      <option value="LEV">بلاد الشام والعراق (LEV)</option>
                      <option value="AE">دول الخليج العربي (AE)</option>
                      <option value="MGH">المغرب العربي والسودان (MGH)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#141413] mb-1.5">
                      الفرع الجغرافي والحاضرة:
                    </label>
                    <input
                      type="text"
                      value={certForm.regionBranch}
                      onChange={(e) =>
                        setCertForm({ ...certForm, regionBranch: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] text-xs font-bold text-[#141413]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#141413] mb-1.5">
                      الرقم المرجعي (Serial No.):
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={certForm.serialNumber}
                        onChange={(e) =>
                          setCertForm({ ...certForm, serialNumber: e.target.value })
                        }
                        dir="ltr"
                        className="w-full px-3 py-2 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] text-xs font-mono font-bold text-[#141413]"
                      />
                      <button
                        type="button"
                        onClick={() => handleGenerateNewSerial()}
                        title="توليد رقم مرجعي جديد"
                        className="px-2.5 py-2 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] hover:border-[#0F291E] text-[#0F291E] cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#141413] mb-1.5">
                      تاريخ الإصدار الميلادي:
                    </label>
                    <input
                      type="text"
                      value={certForm.issueDateGregorian}
                      onChange={(e) =>
                        setCertForm({
                          ...certForm,
                          issueDateGregorian: e.target.value,
                        })
                      }
                      dir="ltr"
                      className="w-full px-3 py-2 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] text-xs font-mono font-bold text-[#141413]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#141413] mb-1.5">
                      التاريخ الهجري:
                    </label>
                    <input
                      type="text"
                      value={certForm.issueDateHijri}
                      onChange={(e) =>
                        setCertForm({ ...certForm, issueDateHijri: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] text-xs font-bold text-[#141413]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1.5">
                    نص وصياغة عمود النسب الموثق في الشهادة:
                  </label>
                  <textarea
                    rows={3}
                    value={certForm.lineageNarrative}
                    onChange={(e) =>
                      setCertForm({ ...certForm, lineageNarrative: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] text-sm text-[#141413]"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E6E2D8]">
                  <button
                    type="button"
                    onClick={handleSaveCertificate}
                    className="px-5 py-3 rounded-xl bg-[#0F291E] hover:bg-[#163d2c] text-white text-xs font-extrabold flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-[#D4AF37]" />
                    <span>حفظ واعتماد في السجل العام (/verify)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-5 py-3 rounded-xl bg-[#695022] hover:bg-[#523e1a] text-white text-xs font-extrabold flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة / تصدير PDF بحجم كامل (A4)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Issued Certificates Registry List */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E6E2D8] p-6 sm:p-8 shadow-sm">
              <div className="pb-4 mb-4 border-b border-[#E6E2D8]">
                <span className="text-xs font-bold text-[#695022] block">
                  السجل العام للشهادات المصدرة
                </span>
                <h3 className="font-serif text-xl font-bold text-[#141413]">
                  الوثائق المسجلة ({issuedCertificates.length})
                </h3>
              </div>

              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {issuedCertificates.map((cert) => (
                  <div
                    key={cert.serialNumber}
                    className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] flex items-center justify-between gap-3"
                  >
                    <div>
                      <div
                        className="text-xs font-mono font-bold text-[#695022]"
                        dir="ltr"
                      >
                        {cert.serialNumber}
                      </div>
                      <div className="text-sm font-extrabold text-[#141413]">
                        {cert.arabicName}
                      </div>
                      <div className="text-[11px] text-zinc-600">
                        {cert.country} · {cert.regionBranch}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setCertForm({
                            ...certForm,
                            serialNumber: cert.serialNumber,
                            arabicName: cert.arabicName,
                            englishName: cert.englishName,
                            country: cert.country,
                            countryCode: cert.countryCode,
                            regionBranch: cert.regionBranch,
                            lineageNarrative: cert.lineageNarrative,
                            documentType: cert.documentType,
                            issueDateGregorian: cert.issueDateGregorian,
                            issueDateHijri: cert.issueDateHijri,
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-[#D5D0C5] text-xs font-bold text-[#0F291E] cursor-pointer"
                      >
                        عرض
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCertificate(cert.serialNumber)}
                        className="p-1.5 rounded-lg bg-white border border-[#FCA5A5] text-[#991B1B] cursor-pointer"
                        aria-label="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Printable Preview */}
          <div>
            <div className="no-print flex items-center justify-between mb-4">
              <h3 className="font-serif text-2xl font-bold text-[#141413]">
                المعاينة الحية للوثيقة الرسمية (تُطبع بحجم كامل بدون القوائم)
              </h3>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-[#0F291E] text-[#D4AF37] text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الوثيقة الآن</span>
              </button>
            </div>

            <CertificateDocumentView
              serialNumber={certForm.serialNumber}
              arabicName={certForm.arabicName}
              englishName={certForm.englishName}
              country={certForm.country}
              regionBranch={certForm.regionBranch}
              lineageNarrative={certForm.lineageNarrative}
              documentType={certForm.documentType}
              issueDateGregorian={certForm.issueDateGregorian}
              issueDateHijri={certForm.issueDateHijri}
              includeFamilyTreeStamp={certForm.includeFamilyTreeStamp}
            />
          </div>
        </div>
      )}

      {/* ===================================================================
          MODULE 3: SEO NAMES & BRANCHES MANAGER (إدارة موسوعة الأسماء)
      =================================================================== */}
      {activeTab === 'names' && (
        <div className="bg-white rounded-2xl border border-[#E6E2D8] p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-[#E6E2D8] pb-5">
            <span className="text-xs font-bold text-[#695022] block mb-1">
              موسوعة الأسماء المركبة والفروع ومحركات البحث (SEO Names &amp; Lineage Index)
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#141413]">
              إدارة الأسماء والألقاب الموثقة (الصعيدي · حجازي · حجاج · الصعيد)
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1">
              أي اسم مركب أو فرع تضيفه هنا يظهر تلقائياً في صفحة «شجرة وموسوعة العائلة»
              ويتم حقنه مباشرة في وسوم محركات البحث (Google Schema.org JSON-LD &amp; Meta Keywords).
            </p>
          </div>

          <form onSubmit={handleAddCompoundName} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newNameInput}
              onChange={(e) => setNewNameInput(e.target.value)}
              placeholder="أدخل اسماً مركباً أو فرعاً جديداً (مثال: مرسي حجاج الصعيدي / أحمد حجازي الصعيدي)..."
              className="flex-1 px-4 py-3 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] text-sm font-bold text-[#141413]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#0F291E] hover:bg-[#163d2c] text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>إضافة إلى الموسوعة و SEO</span>
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {customNames.map((nameItem) => (
              <div
                key={nameItem}
                className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] flex items-center justify-between gap-2"
              >
                <span className="text-xs sm:text-sm font-bold text-[#141413]">
                  {nameItem}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveCompoundName(nameItem)}
                  className="p-1.5 rounded-lg text-[#991B1B] hover:bg-[#FEF2F2] cursor-pointer"
                  aria-label={`حذف ${nameItem}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================
          MODULE 4: VISITOR COUNTER & GITHUB API CLOUD SYNC
      =================================================================== */}
      {activeTab === 'github' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Visitor Counter Control Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E6E2D8] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#E6E2D8] pb-4">
              <span className="text-xs font-bold text-[#695022] block mb-1">
                نظام الإحصاء المضاعف (2x Double-Increment Visitor Engine)
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#141413]">
                التحكم في عداد زوار البوابة الرسمي
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-[#0F291E] text-white border border-[#D4AF37]/40">
              <div className="text-xs text-[#D4AF37] font-bold mb-1">
                إجمالي الزيارات المسجلة حالياً (يزداد +2 مع كل زيارة أو تنقل):
              </div>
              <div
                className="font-mono text-3xl sm:text-4xl font-extrabold text-white"
                dir="ltr"
              >
                {visitorCount.toLocaleString('en-US')}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#141413]">
                تعديل الرقم الأساسي للعداد يدوياً:
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={manualVisitorInput}
                  onChange={(e) => setManualVisitorInput(e.target.value)}
                  dir="ltr"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] font-mono text-sm font-bold text-[#141413]"
                />
                <button
                  type="button"
                  onClick={() => {
                    const parsed = parseInt(manualVisitorInput, 10);
                    if (!isNaN(parsed) && parsed > 0) {
                      onUpdateVisitorCount(parsed);
                      setStatusBanner({
                        type: 'success',
                        message: `تم تحديث عداد الزوار إلى ${parsed.toLocaleString('en-US')} بنجاح.`,
                      });
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#0F291E] text-white text-xs font-bold cursor-pointer"
                >
                  تطبيق الرقم
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { label: '+2 زيارة (محاكاة فورية)', delta: 2 },
                  { label: '+100 زيارة', delta: 100 },
                  { label: '+1,000 زيارة', delta: 1000 },
                ].map((btn) => (
                  <button
                    key={btn.delta}
                    type="button"
                    onClick={() => {
                      const nextVal = visitorCount + btn.delta;
                      onUpdateVisitorCount(nextVal);
                      setManualVisitorInput(String(nextVal));
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] hover:border-[#695022] text-xs font-bold text-[#141413] cursor-pointer"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* GitHub Cloud Sync Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E6E2D8] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#E6E2D8] pb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#695022] block mb-1">
                  مزامنة وحفظ دائم عبر GitHub REST API (Serverless Cloud CMS)
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#141413]">
                  الربط السحابي المباشر مع مستودع GitHub و Cloudflare Pages
                </h2>
              </div>

              <button
                type="button"
                onClick={handleExportJsonFile}
                className="px-3.5 py-2 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] text-xs font-bold text-[#141413] flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#695022]" />
                <span>تحميل cms-db.json</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
              عند الضغط على <strong>«حفظ ومزامنة قاعدة البيانات على GitHub الآن»</strong>،
              تقوم اللوحة بإرسال كافة التحديثات (المقالات، الشهادات، الأسماء المركبة،
              وعداد الزوار) مباشرة إلى ملف{' '}
              <code className="font-mono bg-[#F7F6F2] px-1.5 py-0.5 rounded">
                public/data/cms-db.json
              </code>{' '}
              في مستودع GitHub الخاص بك، ليقوم Cloudflare Pages بنشرها تلقائياً لجميع
              الزوار.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#141413] mb-1.5">
                  رمز الوصول الشخصي (GitHub Personal Access Token - Fine-Grained or Classic):
                </label>
                <input
                  type="password"
                  value={githubConfig.token}
                  onChange={(e) =>
                    setGithubConfig({ ...githubConfig, token: e.target.value })
                  }
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx أو github_pat_..."
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] font-mono text-xs text-[#141413]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1.5">
                  اسم مالك المستودع (Repository Owner / Username):
                </label>
                <input
                  type="text"
                  value={githubConfig.owner}
                  onChange={(e) =>
                    setGithubConfig({ ...githubConfig, owner: e.target.value })
                  }
                  placeholder="مثال: elsaidy-org"
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] font-mono text-xs font-bold text-[#141413]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1.5">
                  اسم المستودع (Repository Name):
                </label>
                <input
                  type="text"
                  value={githubConfig.repo}
                  onChange={(e) =>
                    setGithubConfig({ ...githubConfig, repo: e.target.value })
                  }
                  placeholder="مثال: elsaidy.org"
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] font-mono text-xs font-bold text-[#141413]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1.5">
                  الفرع المعتمد (Branch):
                </label>
                <input
                  type="text"
                  value={githubConfig.branch}
                  onChange={(e) =>
                    setGithubConfig({ ...githubConfig, branch: e.target.value })
                  }
                  placeholder="main"
                  dir="ltr"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#D5D0C5] font-mono text-xs font-bold text-[#141413]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E6E2D8] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleSaveGitHubConfig}
                className="px-4 py-2.5 rounded-xl border border-[#D5D0C5] hover:border-[#0F291E] text-xs font-bold text-[#141413] cursor-pointer"
              >
                حفظ بيانات المستودع في المتصفح
              </button>

              <button
                type="button"
                disabled={isSyncingGitHub}
                onClick={handleSyncToGitHub}
                className="px-6 py-3 rounded-xl bg-[#0F291E] hover:bg-[#163d2c] disabled:opacity-60 text-[#D4AF37] text-xs font-extrabold flex items-center gap-2 shadow-md cursor-pointer"
              >
                <CloudUpload className="w-4 h-4" />
                <span>
                  {isSyncingGitHub
                    ? 'جاري الحفظ والمزامنة مع GitHub...'
                    : 'حفظ ومزامنة قاعدة البيانات على GitHub الآن (Publish to Live Site)'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
