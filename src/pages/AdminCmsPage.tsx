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
  Palette,
  Megaphone,
  Building2,
  GitBranch,
  ArrowUp,
  ArrowDown,
  RotateCcw,
} from 'lucide-react';
import {
  PageRoute,
  DiwanArticle,
  IssuedCertificateRecord,
  SiteConfig,
  WhiteLabeledPortal,
  DEFAULT_SITE_CONFIG,
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
  siteConfig: SiteConfig;
  onUpdateSiteConfig: (newConfig: SiteConfig) => void;
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
  siteConfig,
  onUpdateSiteConfig,
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
    'brand' | 'hero' | 'portals' | 'posts' | 'certificates' | 'github'
  >('brand');

  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // GitHub Config State (Used across asset uploaders and Module 6)
  const [githubConfig, setGithubConfig] = useState<GitHubConfig>(() => {
    try {
      const saved = localStorage.getItem(GITHUB_CONFIG_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      token: '',
      owner: 'AliAhmedElseidy',
      repo: 'elsaidy-org',
      branch: 'main',
    };
  });
  const [isSyncingGitHub, setIsSyncingGitHub] = useState<boolean>(false);
  const [uploadingAssetKey, setUploadingAssetKey] = useState<string | null>(null);

  // --- MODULE 3: DIGITAL PORTALS MANAGER STATE ---
  const [editingPortalId, setEditingPortalId] = useState<string | null>(null);
  const [portalForm, setPortalForm] = useState<{
    officialName: string;
    portalSubTitle: string;
    domain: string;
    url: string;
    accessClassification: string;
    summary: string;
    departmentsText: string;
  }>({
    officialName: '',
    portalSubTitle: '',
    domain: 'elsaidy.org',
    url: 'https://elsaidy.org',
    accessClassification: 'بوابة مؤسسية معتمدة',
    summary: '',
    departmentsText: '',
  });

  // --- MODULE 4: POSTS CMS STATE ---
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

  // --- MODULE 5: CERTIFICATE STUDIO STATE ---
  const [certForm, setCertForm] = useState<{
    serialNumber: string;
    arabicName: string;
    englishName: string;
    familyTitle: string;
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
    familyTitle: 'الصعيدي',
    country: 'جمهورية مصر العربية',
    countryCode: 'EG',
    regionBranch: 'محافظة الغربية - مدينة طنطا / صعيد مصر / القاهرة',
    lineageNarrative:
      'ينتسب إلى الذرية الموثقة لعائلات الصعيدي (آل الصعيدي — Elsaidy / Elseidy) ذات الجذور العربية الأصيلة المتصلة بقبيلة جهينة القضاعية من ينبع النخل وامتدادها التاريخي العريق في الديار المصرية (صعيد مصر ومحافظة الغربية وطنطا والدلتا والقاهرة).',
    documentType: 'a4-certificate',
    issueDateGregorian: new Date().toISOString().slice(0, 10),
    issueDateHijri: '١١ ربيع الآخر ١٤٤٨ هـ',
    includeFamilyTreeStamp: true,
  });

  // --- MODULE 6: SEO NAMES & VISITOR COUNTER ---
  const [newNameInput, setNewNameInput] = useState<string>('');
  const [manualVisitorInput, setManualVisitorInput] = useState<string>(String(visitorCount));

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

  // Generic helper to upload an image file (Logo, Seal, Tree, or Post image) to GitHub or Base64
  const uploadAssetFile = (
    file: File,
    preferredFileName: string,
    onDone: (finalUrl: string) => void
  ) => {
    setUploadingAssetKey(preferredFileName);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      if (githubConfig.token.trim() && githubConfig.owner.trim() && githubConfig.repo.trim()) {
        try {
          const base64Content = dataUrl.split(',')[1];
          const ext = file.name.split('.').pop() || 'png';
          const safeName = `${preferredFileName}-${Date.now()}.${ext.replace(/[^a-zA-Z0-9]/g, '')}`;
          const path = `public/uploads/${safeName}`;
          const branch = githubConfig.branch.trim() || 'main';
          const apiUrl = `https://api.github.com/repos/${githubConfig.owner.trim()}/${githubConfig.repo.trim()}/contents/${path}`;

          const res = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${githubConfig.token.trim()}`,
              Accept: 'application/vnd.github+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: `Upload ${safeName} via ELSAIDY Site Customizer`,
              content: base64Content,
              branch,
            }),
          });
          if (res.ok) {
            onDone(`/uploads/${safeName}`);
            setStatusBanner({
              type: 'success',
              message: `تم رفع الملف مباشرة إلى GitHub في المسار (/uploads/${safeName}) وتفعيله في الموقع.`,
            });
            setUploadingAssetKey(null);
            return;
          }
        } catch {
          // fallback to dataUrl
        }
      }
      onDone(dataUrl);
      setStatusBanner({
        type: 'success',
        message: 'تم إرفاق الصورة وتفعيلها في الموقع فوراً.',
      });
      setUploadingAssetKey(null);
    };
    reader.readAsDataURL(file);
  };

  // --- MODULE 3 HANDLERS: DIGITAL PORTALS ---
  const handleSavePortal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalForm.officialName.trim() || !portalForm.summary.trim()) {
      setStatusBanner({
        type: 'error',
        message: 'يرجى إدخال الاسم الرسمي للبوابة والوصف المختصر.',
      });
      return;
    }

    const departments = portalForm.departmentsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const currentPortals = siteConfig.digitalPortals || [];

    if (editingPortalId) {
      const updated = currentPortals.map((p) =>
        p.id === editingPortalId
          ? {
              ...p,
              officialName: portalForm.officialName.trim(),
              portalSubTitle: portalForm.portalSubTitle.trim(),
              domain: portalForm.domain.trim(),
              url: portalForm.url.trim(),
              accessClassification: portalForm.accessClassification.trim(),
              summary: portalForm.summary.trim(),
              departments: departments.length > 0 ? departments : p.departments,
            }
          : p
      );
      onUpdateSiteConfig({ ...siteConfig, digitalPortals: updated });
      setEditingPortalId(null);
      setStatusBanner({
        type: 'success',
        message: 'تم تحديث البوابة الرقمية بنجاح.',
      });
    } else {
      const nextIdx = String(currentPortals.length + 1).padStart(2, '0');
      const newPortal: WhiteLabeledPortal = {
        id: `portal-custom-${Date.now()}`,
        index: nextIdx,
        officialName: portalForm.officialName.trim(),
        portalSubTitle: portalForm.portalSubTitle.trim() || 'منظومة رقمية معتمدة — ELSAIDY Portal',
        domain: portalForm.domain.trim() || 'elsaidy.org',
        url: portalForm.url.trim() || 'https://elsaidy.org',
        accessClassification: portalForm.accessClassification.trim() || 'بوابة مؤسسية معتمدة',
        summary: portalForm.summary.trim(),
        departments:
          departments.length > 0
            ? departments
            : ['إدارة العمليات الرقمية والخدمات المؤسسية المعتمدة'],
        operationalGuidelines: [
          { label: 'النطاق المعتمد', value: portalForm.domain.trim() || 'elsaidy.org' },
          { label: 'حالة المنظومة', value: 'مفعّلة ومربوطة بالبوابة الرسمية' },
        ],
      };
      onUpdateSiteConfig({
        ...siteConfig,
        digitalPortals: [...currentPortals, newPortal],
      });
      setStatusBanner({
        type: 'success',
        message: 'تمت إضافة البوابة الرقمية الجديدة بنجاح.',
      });
    }

    setPortalForm({
      officialName: '',
      portalSubTitle: '',
      domain: 'elsaidy.org',
      url: 'https://elsaidy.org',
      accessClassification: 'بوابة مؤسسية معتمدة',
      summary: '',
      departmentsText: '',
    });
  };

  const handleEditPortalClick = (portal: WhiteLabeledPortal) => {
    setEditingPortalId(portal.id);
    setPortalForm({
      officialName: portal.officialName,
      portalSubTitle: portal.portalSubTitle,
      domain: portal.domain,
      url: portal.url,
      accessClassification: portal.accessClassification,
      summary: portal.summary,
      departmentsText: (portal.departments || []).join('\n'),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePortal = (id: string) => {
    const filtered = (siteConfig.digitalPortals || [])
      .filter((p) => p.id !== id)
      .map((p, idx) => ({ ...p, index: String(idx + 1).padStart(2, '0') }));
    onUpdateSiteConfig({ ...siteConfig, digitalPortals: filtered });
    setStatusBanner({
      type: 'info',
      message: 'تم حذف البوابة من قائمة الأنظمة الرقمية.',
    });
  };

  const handleMovePortal = (index: number, direction: 'up' | 'down') => {
    const list = [...(siteConfig.digitalPortals || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    const reindexed = list.map((p, idx) => ({
      ...p,
      index: String(idx + 1).padStart(2, '0'),
    }));
    onUpdateSiteConfig({ ...siteConfig, digitalPortals: reindexed });
  };

  // --- MODULE 4 HANDLERS: POSTS ---
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

  // --- MODULE 5 HANDLERS: CERTIFICATES ---
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
      familyTitle: certForm.familyTitle.trim() || 'الصعيدي',
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
      message: `تم حفظ واعتماد الوثيقة رقم (${record.serialNumber}) في السجل العام للتحقق الفوري عبر الرابط (https://elsaidy.org/verify/${record.serialNumber}).`,
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

  // --- MODULE 6 HANDLERS: SEO NAMES & GITHUB SYNC ---
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
      message: 'جاري الاتصال بواجهة GitHub API ومزامنة قاعدة البيانات الشاملة (public/data/cms-db.json)...',
    });

    try {
      localStorage.setItem(GITHUB_CONFIG_STORAGE_KEY, JSON.stringify(githubConfig));

      const dbPayload = {
        visitorCount,
        lastUpdated: new Date().toISOString(),
        siteConfig,
        customNames,
        certificates: issuedCertificates,
        articles,
      };

      const filePath = 'public/data/cms-db.json';
      const branch = githubConfig.branch.trim() || 'main';
      const apiUrl = `https://api.github.com/repos/${githubConfig.owner.trim()}/${githubConfig.repo.trim()}/contents/${filePath}`;

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

      const jsonString = JSON.stringify(dbPayload, null, 2);
      const base64Content = encodeUtf8ToBase64(jsonString);

      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${githubConfig.token.trim()}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Sync ELSAIDY Site Config & CMS DB (${new Date().toISOString().slice(0, 10)})`,
          content: base64Content,
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
          'تمت المزامنة السحابية بنجاح! تم تحديث ملف (public/data/cms-db.json) شاملاً الهوية واللوجو والبانر والبوابات والمقالات والشهادات في GitHub.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطأ غير معروف';
      setStatusBanner({
        type: 'error',
        message: `تعذرت المزامنة مع GitHub API: ${msg}. تأكد من صلاحية الـ Token (repo scope) واسم المستودع.`,
      });
    } finally {
      setIsSyncingGitHub(false);
    }
  };

  const handleDownloadJsonBackup = () => {
    const dbPayload = {
      visitorCount,
      lastUpdated: new Date().toISOString(),
      siteConfig,
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

  // --- LOCKED GATEWAY VIEW ---
  if (!isUnlocked) {
    return (
      <div className="py-12 lg:py-20 max-w-xl mx-auto">
        <div className="bg-white rounded-2xl border-2 border-[#695022] p-6 sm:p-10 shadow-xl">
          <div className="flex items-center justify-between gap-3 pb-5 mb-6 border-b border-[#E6E2D8]">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-xl bg-[#0F291E] text-[#D4AF37] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#695022]">
                  بوابة الإدارة والتحكم الشامل بالموقع · ELSAIDY SITE CUSTOMIZER & CMS
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#141413]">
                  لوحة تحكم الأمانة العامة (/admin-elsaidy)
                </h1>
              </div>
            </div>
          </div>

          <p className="text-sm text-zinc-700 leading-relaxed mb-6">
            هذه اللوحة مخصصة حصرياً للأمانة العامة للموقع الرسمي لعائلات الصعيدي (
            <span className="font-mono font-bold text-[#0F291E]">elsaidy.org</span>) للتحكم الكامل
            في الشعار (Logo)، الهوية اللونية، البانر الرئيسي، شريط الأخبار، الأنظمة الرقمية،
            المقالات، الشهادات، وشجرة العائلة مع المزامنة المباشرة عبر GitHub API.
          </p>

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="cms-master-pass"
                className="block text-xs font-bold text-[#141413] mb-2"
              >
                رمز المرور المعتمد للأمانة العامة:
              </label>
              <input
                id="cms-master-pass"
                type="password"
                dir="ltr"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 text-sm font-mono text-center rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#0F291E]"
              />
            </div>

            {authError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="px-4 py-3 rounded-xl border border-[#E6E2D8] text-xs font-bold text-zinc-700 hover:border-[#695022] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>العودة للرئيسية</span>
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#0F291E] text-white text-xs font-extrabold hover:bg-[#141E28] transition-colors flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Unlock className="w-4 h-4 text-[#D4AF37]" />
                <span>فتح استوديو التحكم الشامل</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8 lg:py-12 space-y-8">
      {/* Top Executive CMS Header */}
      <section className="no-print bg-gradient-to-br from-[#0F291E] via-[#112323] to-[#141E28] text-white rounded-2xl border-2 border-[#D4AF37]/50 p-5 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#D4AF37]">
                ELSAIDY 100% DYNAMIC SITE CUSTOMIZER & GITHUB CMS
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">
                لوحة التحكم الشاملة وبناء الهوية الرقمية (elsaidy.org)
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleSyncToGitHub}
              disabled={isSyncingGitHub}
              className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#0D131A] text-xs font-extrabold hover:bg-[#e3be42] transition-colors flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
            >
              <CloudUpload className="w-4 h-4" />
              <span>{isSyncingGitHub ? 'جاري النشر لـ GitHub...' : 'نشر التعديلات إلى GitHub'}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>معاينة الموقع</span>
            </button>

            <button
              type="button"
              onClick={handleLockSession}
              className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 text-xs font-bold text-red-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>إغلاق الجلسة</span>
            </button>
          </div>
        </div>

        {/* 6-Module Navigation Tabs (Horizontally Scrollable Pill Bar on Mobile) */}
        <div className="flex overflow-x-auto pb-2 gap-2.5 no-scrollbar">
          {[
            {
              id: 'brand' as const,
              label: '١. الهوية واللوجو والمظهر',
              sub: 'Logo, Seal & Theme Studio',
              icon: Palette,
            },
            {
              id: 'hero' as const,
              label: '٢. شريط الأخبار والبانر الرئيسي',
              sub: 'Ticker & Hero Editor',
              icon: Megaphone,
            },
            {
              id: 'portals' as const,
              label: `٣. البوابات الرقمية (${(siteConfig.digitalPortals || []).length})`,
              sub: 'Portals & Links Manager',
              icon: Building2,
            },
            {
              id: 'posts' as const,
              label: `٤. الديوان والمقالات (${articles.length})`,
              sub: 'Blogger-Style Posts CMS',
              icon: FileText,
            },
            {
              id: 'certificates' as const,
              label: `٥. شهادات النسب والعضوية (${issuedCertificates.length})`,
              sub: 'A4 Certificate & VIP ID',
              icon: Award,
            },
            {
              id: 'github' as const,
              label: '٦. الشجرة والأسماء ومزامنة GitHub',
              sub: `${visitorCount.toLocaleString('en-US')} زيارة · GitHub API`,
              icon: GitBranch,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setStatusBanner(null);
                }}
                className={`p-3.5 rounded-xl border text-right transition-all flex items-start gap-2.5 cursor-pointer shrink-0 min-w-[210px] sm:min-w-[225px] ${
                  active
                    ? 'bg-[#D4AF37] text-[#0D131A] border-[#D4AF37] shadow-lg font-extrabold'
                    : 'bg-white/5 text-white border-white/15 hover:bg-white/10'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${active ? 'text-[#0D131A]' : 'text-[#D4AF37]'}`} />
                <div>
                  <div className="text-xs font-extrabold">{tab.label}</div>
                  <div className={`text-[11px] mt-0.5 ${active ? 'text-[#0D131A]/80 font-bold' : 'text-zinc-300'}`}>
                    {tab.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Global Status Banner */}
      {statusBanner && (
        <div
          className={`no-print p-4 rounded-xl border text-xs font-bold flex items-center justify-between gap-3 ${
            statusBanner.type === 'success'
              ? 'bg-[#0F291E]/10 border-[#0F291E] text-[#0F291E]'
              : statusBanner.type === 'error'
              ? 'bg-red-50 border-red-300 text-red-900'
              : 'bg-[#F7F6F2] border-[#695022] text-[#141413]'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusBanner.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusBanner(null)}
            className="text-xs underline cursor-pointer shrink-0"
          >
            إخفاء
          </button>
        </div>
      )}

      {/* ====================================================================
          MODULE 1: BRAND, LOGO & THEME STUDIO
      ==================================================================== */}
      {activeTab === 'brand' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#E6E2D8] pb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-xs font-bold text-[#695022]">
                  MODULE 01 · BRAND, LOGO, SEAL & THEME STUDIO
                </div>
                <h2 className="text-xl font-extrabold text-[#141413] mt-1">
                  إعدادات الهوية البصرية واللوجو والختم والتذييل
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  onUpdateSiteConfig({
                    ...siteConfig,
                    branding: DEFAULT_SITE_CONFIG.branding,
                    contactAndFooter: DEFAULT_SITE_CONFIG.contactAndFooter,
                  });
                  setStatusBanner({
                    type: 'info',
                    message: 'تمت استعادة إعدادات الهوية والشعار الافتراضية.',
                  });
                }}
                className="px-3 py-1.5 rounded-lg border border-[#E6E2D8] text-xs font-bold text-zinc-700 hover:border-[#695022] flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>استعادة الافتراضي</span>
              </button>
            </div>

            {/* Site Title & Subtitle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1.5">
                  اسم الموقع الرسمي (في الهيدر والفوتر والشهادات):
                </label>
                <input
                  type="text"
                  value={siteConfig.branding.siteTitle}
                  onChange={(e) =>
                    onUpdateSiteConfig({
                      ...siteConfig,
                      branding: { ...siteConfig.branding, siteTitle: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#0F291E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1.5">
                  العنوان الفرعي الإنجليزي (Subtitle):
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={siteConfig.branding.siteSubtitle}
                  onChange={(e) =>
                    onUpdateSiteConfig({
                      ...siteConfig,
                      branding: { ...siteConfig.branding, siteSubtitle: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#0F291E]"
                />
              </div>
            </div>

            {/* Live Logo Uploader */}
            <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-extrabold text-[#0F291E]">
                  شعار الموقع الرسمي (Logo Image — يظهر في الهيدر والفوتر وشهادات النسب):
                </label>
                {siteConfig.branding.logoUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateSiteConfig({
                        ...siteConfig,
                        branding: { ...siteConfig.branding, logoUrl: '' },
                      })
                    }
                    className="text-xs font-bold text-red-700 hover:underline cursor-pointer"
                  >
                    استعادة الشعار الملكي الافتراضي (Reset Crest)
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="text"
                  dir="ltr"
                  value={siteConfig.branding.logoUrl}
                  onChange={(e) =>
                    onUpdateSiteConfig({
                      ...siteConfig,
                      branding: { ...siteConfig.branding, logoUrl: e.target.value },
                    })
                  }
                  placeholder="https://... أو اتركه فارغاً للشعار الهندسي الملكي"
                  className="flex-1 px-3.5 py-2 text-xs font-mono rounded-lg bg-white border border-[#E6E2D8] text-[#141413] outline-none"
                />
                <label className="px-4 py-2 rounded-lg bg-[#0F291E] text-white text-xs font-bold hover:bg-[#141E28] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
                  <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{uploadingAssetKey === 'logo' ? 'جاري الرفع...' : 'رفع ملف لوجو'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        uploadAssetFile(file, 'logo', (url) =>
                          onUpdateSiteConfig({
                            ...siteConfig,
                            branding: { ...siteConfig.branding, logoUrl: url },
                          })
                        );
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Seal / Stamp Image Uploader & Favicon URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-[#0F291E]">
                    صورة ختم مخصص للشهادات (Seal Image):
                  </label>
                  {siteConfig.branding.sealImageUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateSiteConfig({
                          ...siteConfig,
                          branding: { ...siteConfig.branding, sealImageUrl: '' },
                        })
                      }
                      className="text-[11px] text-red-700 font-bold hover:underline cursor-pointer"
                    >
                      استعادة ختم SVG
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  dir="ltr"
                  value={siteConfig.branding.sealImageUrl}
                  onChange={(e) =>
                    onUpdateSiteConfig({
                      ...siteConfig,
                      branding: { ...siteConfig.branding, sealImageUrl: e.target.value },
                    })
                  }
                  placeholder="رابط صورة الختم أو اتركه للختم الذهبي"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-white border border-[#E6E2D8]"
                />
                <label className="w-full py-2 px-3 rounded-lg bg-[#695022] text-white text-xs font-bold hover:bg-[#533f1b] transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{uploadingAssetKey === 'seal' ? 'جاري الرفع...' : 'رفع صورة الختم'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        uploadAssetFile(file, 'seal', (url) =>
                          onUpdateSiteConfig({
                            ...siteConfig,
                            branding: { ...siteConfig.branding, sealImageUrl: url },
                          })
                        );
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] space-y-2.5">
                <label className="block text-xs font-extrabold text-[#0F291E]">
                  أيقونة المتصفح (Favicon URL):
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={siteConfig.branding.faviconUrl}
                  onChange={(e) =>
                    onUpdateSiteConfig({
                      ...siteConfig,
                      branding: { ...siteConfig.branding, faviconUrl: e.target.value },
                    })
                  }
                  placeholder="https://elsaidy.org/favicon.png"
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-white border border-[#E6E2D8]"
                />
                <label className="w-full py-2 px-3 rounded-lg bg-[#0F291E] text-white text-xs font-bold hover:bg-[#141E28] transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                  <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{uploadingAssetKey === 'favicon' ? 'جاري الرفع...' : 'رفع أيقونة Favicon'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        uploadAssetFile(file, 'favicon', (url) =>
                          onUpdateSiteConfig({
                            ...siteConfig,
                            branding: { ...siteConfig.branding, faviconUrl: url },
                          })
                        );
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Theme Accent Presets */}
            <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] space-y-3">
              <div className="text-xs font-extrabold text-[#0F291E]">
                السمة اللونية المعتمدة للمنصة (Royal Theme Presets):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    label: 'الأخضر الملكي والذهبي',
                    primary: '#0F291E',
                    gold: '#695022',
                  },
                  {
                    label: 'الكحلي الإمبراطوري والذهبي',
                    primary: '#141E28',
                    gold: '#8C6D32',
                  },
                  {
                    label: 'البرونزي الوثائقي الكلاسيكي',
                    primary: '#241C11',
                    gold: '#7C5D28',
                  },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      onUpdateSiteConfig({
                        ...siteConfig,
                        branding: {
                          ...siteConfig.branding,
                          primaryColor: preset.primary,
                          accentGold: preset.gold,
                        },
                      })
                    }
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex items-center gap-2.5 ${
                      siteConfig.branding.primaryColor === preset.primary
                        ? 'bg-white border-[#0F291E] shadow-sm font-extrabold'
                        : 'bg-white/60 border-[#E6E2D8]'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-[#D4AF37] shrink-0"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <span className="text-xs text-[#141413]">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact & Footer Settings */}
            <div className="space-y-4 pt-2 border-t border-[#E6E2D8]">
              <div className="text-xs font-extrabold text-[#695022]">
                بيانات التواصل الرسمي وحقوق التذييل (Footer & Contact):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1">
                    البريد الرسمي المعتمد:
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={siteConfig.contactAndFooter.officialEmail}
                    onChange={(e) =>
                      onUpdateSiteConfig({
                        ...siteConfig,
                        contactAndFooter: {
                          ...siteConfig.contactAndFooter,
                          officialEmail: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1">
                    جهة الاتصال / واتساب أو هاتف:
                  </label>
                  <input
                    type="text"
                    value={siteConfig.contactAndFooter.whatsappOrPhone}
                    onChange={(e) =>
                      onUpdateSiteConfig({
                        ...siteConfig,
                        contactAndFooter: {
                          ...siteConfig.contactAndFooter,
                          whatsappOrPhone: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1">
                  نص حقوق الملكية في أسفل الموقع (Footer Copyright):
                </label>
                <input
                  type="text"
                  value={siteConfig.contactAndFooter.copyrightText}
                  onChange={(e) =>
                    onUpdateSiteConfig({
                      ...siteConfig,
                      contactAndFooter: {
                        ...siteConfig.contactAndFooter,
                        copyrightText: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                />
              </div>
            </div>
          </div>

          {/* Live Brand Preview Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E6E2D8] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#E6E2D8] pb-4">
              <div className="text-xs font-bold text-[#695022]">معاينة حية للهوية والشعار</div>
              <h3 className="text-lg font-extrabold text-[#141413] mt-0.5">
                شكل الهيدر والشعار المعتمد حالياً
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F6F2] border border-[#E6E2D8] flex items-center gap-3.5">
              {siteConfig.branding.logoUrl ? (
                <img
                  src={siteConfig.branding.logoUrl}
                  alt={siteConfig.branding.siteTitle}
                  className="w-14 h-14 rounded-xl object-contain bg-white border-2 border-[#D4AF37] p-1 shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0F291E] to-[#141E28] border-2 border-[#D4AF37] flex flex-col items-center justify-center text-white shrink-0">
                  <span className="font-mono text-[9px] font-bold tracking-widest text-[#D4AF37] leading-none">
                    ELSAIDY
                  </span>
                  <span className="font-display text-sm font-bold text-white leading-tight mt-0.5">
                    الصعيدي
                  </span>
                </div>
              )}
              <div>
                <div className="text-base font-extrabold text-[#141413]">
                  {siteConfig.branding.siteTitle}
                </div>
                <div className="text-xs font-mono font-bold text-[#695022] mt-0.5">
                  {siteConfig.branding.siteSubtitle}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D131A] text-white space-y-2 text-xs">
              <div className="text-[#D4AF37] font-bold">معاينة الفوتر وبيانات التواصل:</div>
              <div>البريد الرسمي: {siteConfig.contactAndFooter.officialEmail}</div>
              <div>التواصل المباشر: {siteConfig.contactAndFooter.whatsappOrPhone}</div>
              <div className="pt-2 border-t border-white/10 text-zinc-300 text-[11px]">
                © {new Date().getFullYear()} {siteConfig.contactAndFooter.copyrightText}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODULE 2: ANNOUNCEMENT TICKER & HERO EDITOR
      ==================================================================== */}
      {activeTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Announcement Bar Control */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#0F291E] p-6 sm:p-8 shadow-sm space-y-5">
            <div className="border-b border-[#E6E2D8] pb-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#695022]">TOP ANNOUNCEMENT BAR</div>
                <h2 className="text-lg font-extrabold text-[#141413] mt-0.5">
                  شريط الأخبار والإعلانات العاجلة أعلى الموقع
                </h2>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={siteConfig.announcementBar.enabled}
                  onChange={(e) =>
                    onUpdateSiteConfig({
                      ...siteConfig,
                      announcementBar: {
                        ...siteConfig.announcementBar,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 accent-[#0F291E]"
                />
                <span className="text-xs font-extrabold text-[#0F291E]">تفعيل الشريط</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#141413] mb-1">
                شارة التنبيه (Badge Text):
              </label>
              <input
                type="text"
                value={siteConfig.announcementBar.badgeText}
                onChange={(e) =>
                  onUpdateSiteConfig({
                    ...siteConfig,
                    announcementBar: {
                      ...siteConfig.announcementBar,
                      badgeText: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#141413] mb-1">
                نص الإعلان أو الخبر في الشريط العلوي:
              </label>
              <textarea
                rows={3}
                value={siteConfig.announcementBar.message}
                onChange={(e) =>
                  onUpdateSiteConfig({
                    ...siteConfig,
                    announcementBar: {
                      ...siteConfig.announcementBar,
                      message: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1">
                  نص زر الرابط:
                </label>
                <input
                  type="text"
                  value={siteConfig.announcementBar.linkText}
                  onChange={(e) =>
                    onUpdateSiteConfig({
                      ...siteConfig,
                      announcementBar: {
                        ...siteConfig.announcementBar,
                        linkText: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1">
                  الرابط أو القسم (/verify أو /tree):
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={siteConfig.announcementBar.linkUrl}
                  onChange={(e) =>
                    onUpdateSiteConfig({
                      ...siteConfig,
                      announcementBar: {
                        ...siteConfig.announcementBar,
                        linkUrl: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                />
              </div>
            </div>
          </div>

          {/* Hero Section Editor */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-8 shadow-sm space-y-5">
            <div className="border-b border-[#E6E2D8] pb-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#695022]">HERO SECTION CUSTOMIZER</div>
                <h2 className="text-lg font-extrabold text-[#141413] mt-0.5">
                  تخصيص البانر الرئيسي (Hero) والإحصائيات الأربع في الصفحة الرئيسية
                </h2>
              </div>
              <button
                type="button"
                onClick={() =>
                  onUpdateSiteConfig({
                    ...siteConfig,
                    heroSection: DEFAULT_SITE_CONFIG.heroSection,
                  })
                }
                className="px-3 py-1.5 rounded-lg border border-[#E6E2D8] text-xs font-bold text-zinc-700 hover:border-[#695022] cursor-pointer"
              >
                استعادة الافتراضي
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#141413] mb-1">
                الشارة العلوية (Top Badge):
              </label>
              <input
                type="text"
                value={siteConfig.heroSection.topBadge}
                onChange={(e) =>
                  onUpdateSiteConfig({
                    ...siteConfig,
                    heroSection: { ...siteConfig.heroSection, topBadge: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#141413] mb-1">
                العنوان الرئيسي الكبير (H1 Main Heading):
              </label>
              <input
                type="text"
                value={siteConfig.heroSection.mainHeading}
                onChange={(e) =>
                  onUpdateSiteConfig({
                    ...siteConfig,
                    heroSection: { ...siteConfig.heroSection, mainHeading: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm font-bold rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#141413] mb-1">
                العنوان التراثي الفرعي بالذهبي (Sub-Heading):
              </label>
              <input
                type="text"
                value={siteConfig.heroSection.subHeading}
                onChange={(e) =>
                  onUpdateSiteConfig({
                    ...siteConfig,
                    heroSection: { ...siteConfig.heroSection, subHeading: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#141413] mb-1">
                الفقرة التعريفية الشاملة (Lead Paragraph):
              </label>
              <textarea
                rows={4}
                value={siteConfig.heroSection.leadParagraph}
                onChange={(e) =>
                  onUpdateSiteConfig({
                    ...siteConfig,
                    heroSection: { ...siteConfig.heroSection, leadParagraph: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs leading-relaxed rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#141413] mb-1">
                الاقتباس التاريخي الموثق داخل الإطار الذهبي (Quote Text):
              </label>
              <textarea
                rows={3}
                value={siteConfig.heroSection.quoteText}
                onChange={(e) =>
                  onUpdateSiteConfig({
                    ...siteConfig,
                    heroSection: { ...siteConfig.heroSection, quoteText: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs leading-relaxed rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1">
                  نص الزر الرئيسي الأول:
                </label>
                <input
                  type="text"
                  value={siteConfig.heroSection.primaryBtnText}
                  onChange={(e) =>
                    onUpdateSiteConfig({
                      ...siteConfig,
                      heroSection: { ...siteConfig.heroSection, primaryBtnText: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1">
                  نص الزر الرئيسي الثاني:
                </label>
                <input
                  type="text"
                  value={siteConfig.heroSection.secondaryBtnText}
                  onChange={(e) =>
                    onUpdateSiteConfig({
                      ...siteConfig,
                      heroSection: { ...siteConfig.heroSection, secondaryBtnText: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                />
              </div>
            </div>

            {/* 4 Hero Executive Statistics Counters */}
            <div className="pt-3 border-t border-[#E6E2D8] space-y-3">
              <div className="text-xs font-extrabold text-[#0F291E]">
                العدادات الإحصائية الأربعة في البانر الرئيسي (4 Hero Stats):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(siteConfig.heroSection.stats || []).map((st, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] grid grid-cols-2 gap-2"
                  >
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-600 mb-0.5">
                        القيمة ({idx + 1}):
                      </label>
                      <input
                        type="text"
                        value={st.value}
                        onChange={(e) => {
                          const nextStats = [...(siteConfig.heroSection.stats || [])];
                          nextStats[idx] = { ...nextStats[idx], value: e.target.value };
                          onUpdateSiteConfig({
                            ...siteConfig,
                            heroSection: { ...siteConfig.heroSection, stats: nextStats },
                          });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg bg-white border border-[#E6E2D8]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-600 mb-0.5">
                        العنوان التوضيحي:
                      </label>
                      <input
                        type="text"
                        value={st.label}
                        onChange={(e) => {
                          const nextStats = [...(siteConfig.heroSection.stats || [])];
                          nextStats[idx] = { ...nextStats[idx], label: e.target.value };
                          onUpdateSiteConfig({
                            ...siteConfig,
                            heroSection: { ...siteConfig.heroSection, stats: nextStats },
                          });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white border border-[#E6E2D8]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODULE 3: DIGITAL PORTALS & LINKS MANAGER
      ==================================================================== */}
      {activeTab === 'portals' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add / Edit Portal Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-8 shadow-sm">
            <div className="border-b border-[#E6E2D8] pb-4 mb-5">
              <div className="text-xs font-bold text-[#695022]">
                {editingPortalId ? 'تعديل بوابة رقمية قائمة' : 'إضافة بوابة أو مشروع جديد'}
              </div>
              <h2 className="text-lg font-extrabold text-[#141413] mt-0.5">
                إدارة الأنظمة الرقمية ومشاريع الصعيدي (/portals)
              </h2>
            </div>

            <form onSubmit={handleSavePortal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1">
                  الاسم الرسمي للمنظومة أو المشروع:
                </label>
                <input
                  type="text"
                  value={portalForm.officialName}
                  onChange={(e) => setPortalForm({ ...portalForm, officialName: e.target.value })}
                  placeholder="مثال: منظومة الصعيدي للإدارة المركزية"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1">
                  العنوان الفرعي الإنجليزي / التخصصي:
                </label>
                <input
                  type="text"
                  value={portalForm.portalSubTitle}
                  onChange={(e) => setPortalForm({ ...portalForm, portalSubTitle: e.target.value })}
                  placeholder="مثال: ELSAIDY Core Enterprise System"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1">
                    النطاق المعروض (Domain):
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={portalForm.domain}
                    onChange={(e) => setPortalForm({ ...portalForm, domain: e.target.value })}
                    placeholder="core.elsaidy.org"
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1">
                    الرابط المباشر (Redirect URL):
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={portalForm.url}
                    onChange={(e) => setPortalForm({ ...portalForm, url: e.target.value })}
                    placeholder="https://core.elsaidy.org"
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1">
                  تصنيف الوصول (Access Classification):
                </label>
                <input
                  type="text"
                  value={portalForm.accessClassification}
                  onChange={(e) =>
                    setPortalForm({ ...portalForm, accessClassification: e.target.value })
                  }
                  placeholder="دخول الأعضاء المعتمدين (SSO)"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1">
                  الوصف التفصيلي للمنظومة:
                </label>
                <textarea
                  rows={3}
                  value={portalForm.summary}
                  onChange={(e) => setPortalForm({ ...portalForm, summary: e.target.value })}
                  placeholder="اشرح مهام وخدمات هذه المنظومة..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1">
                  الوحدات التابعة (سطر لكل وحدة):
                </label>
                <textarea
                  rows={3}
                  value={portalForm.departmentsText}
                  onChange={(e) =>
                    setPortalForm({ ...portalForm, departmentsText: e.target.value })
                  }
                  placeholder="وحدة إدارة المشروعات&#10;وحدة الأرشفة الرقمية"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                {editingPortalId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPortalId(null);
                      setPortalForm({
                        officialName: '',
                        portalSubTitle: '',
                        domain: 'elsaidy.org',
                        url: 'https://elsaidy.org',
                        accessClassification: 'بوابة مؤسسية معتمدة',
                        summary: '',
                        departmentsText: '',
                      });
                    }}
                    className="px-4 py-2.5 rounded-xl border border-[#E6E2D8] text-xs font-bold text-zinc-700 cursor-pointer"
                  >
                    إلغاء
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0F291E] text-white text-xs font-extrabold hover:bg-[#141E28] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#D4AF37]" />
                  <span>{editingPortalId ? 'حفظ تعديلات البوابة' : 'إضافة البوابة'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Existing Portals List & Reordering */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E6E2D8] p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E6E2D8]">
              <div>
                <div className="text-xs font-bold text-[#695022]">
                  الركائز والمنظومات المعتمدة حالياً ({(siteConfig.digitalPortals || []).length})
                </div>
                <h3 className="text-lg font-extrabold text-[#141413]">
                  ترتيب وتعديل وحذف البوابات الرقمية
                </h3>
              </div>
              <button
                type="button"
                onClick={() =>
                  onUpdateSiteConfig({
                    ...siteConfig,
                    digitalPortals: DEFAULT_SITE_CONFIG.digitalPortals,
                  })
                }
                className="px-3 py-1.5 rounded-lg border border-[#E6E2D8] text-xs font-bold text-zinc-700 hover:border-[#695022] cursor-pointer"
              >
                استعادة البوابات الخمس الافتراضية
              </button>
            </div>

            <div className="space-y-3">
              {(siteConfig.digitalPortals || []).map((p, idx) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#695022]">
                      <span>الركيزة {p.index}</span>
                      <span>·</span>
                      <span className="font-mono text-[#0F291E]">{p.domain}</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-[#141413]">{p.officialName}</h4>
                    <div className="text-[11px] font-mono text-zinc-600" dir="ltr">
                      {p.url}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMovePortal(idx, 'up')}
                      disabled={idx === 0}
                      title="تحريك لأعلى"
                      className="p-2 rounded-lg bg-white border border-[#E6E2D8] hover:border-[#0F291E] disabled:opacity-40 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMovePortal(idx, 'down')}
                      disabled={idx === (siteConfig.digitalPortals || []).length - 1}
                      title="تحريك لأسفل"
                      className="p-2 rounded-lg bg-white border border-[#E6E2D8] hover:border-[#0F291E] disabled:opacity-40 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditPortalClick(p)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#E6E2D8] text-xs font-bold text-[#0F291E] hover:border-[#695022] flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePortal(p.id)}
                      className="p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 cursor-pointer"
                      title="حذف البوابة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODULE 4: BLOGGER-STYLE POSTS & ARTICLES CMS
      ==================================================================== */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Post Editor Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between gap-2 pb-4 mb-6 border-b border-[#E6E2D8]">
              <div>
                <div className="text-xs font-bold text-[#695022]">
                  {editingArticleId ? 'تعديل مقال قائم في الديوان' : 'إضافة مقال أو دراسة جديدة'}
                </div>
                <h2 className="text-xl font-extrabold text-[#141413]">
                  محرر مقالات ودراسات ديوان عائلة الصعيدي
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
                      authorTitle: 'الأمانة العامة للموقع الرسمي لعائلات الصعيدي (elsaidy.org)',
                      publishDate: '٢٢ أكتوبر ٢٠٢٦ م',
                      hijriDate: '١١ ربيع الآخر ١٤٤٨ هـ',
                      readTime: '٦ دقائق للقراءة',
                      excerpt: '',
                      coverImage: '',
                      sectionHeading: 'المتن التوثيقي والتاريخي',
                      sectionBody: '',
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg border border-[#E6E2D8] text-xs font-bold text-zinc-600 cursor-pointer"
                >
                  إلغاء التعديل
                </button>
              )}
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1.5">
                  عنوان المقال أو الدراسة التاريخية:
                </label>
                <input
                  type="text"
                  value={postForm.title}
                  onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                  placeholder="مثال: تاريخ بطون عائلات الصعيدي في صعيد مصر ومحافظة الغربية والحجاز..."
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#0F291E]"
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
                        category: e.target.value as
                          | 'heritage'
                          | 'research'
                          | 'documents'
                          | 'news',
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#0F291E]"
                  >
                    <option value="heritage">تحقيق الأنساب والتاريخ</option>
                    <option value="research">الدراسات التاريخية والمصادر</option>
                    <option value="documents">المراجع والوثائق المعتمدة</option>
                    <option value="news">أخبار وبيانات الديوان والبراند</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1.5">
                    جهة الإصدار / الكاتب:
                  </label>
                  <input
                    type="text"
                    value={postForm.author}
                    onChange={(e) => setPostForm({ ...postForm, author: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#0F291E]"
                  />
                </div>
              </div>

              {/* Image Attachment / Upload */}
              <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] space-y-3">
                <label className="block text-xs font-bold text-[#141413]">
                  صورة بارزة للمقال أو وثيقة تاريخية مرفقة (اختياري):
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    dir="ltr"
                    value={postForm.coverImage}
                    onChange={(e) => setPostForm({ ...postForm, coverImage: e.target.value })}
                    placeholder="https://... أو ارفع صورة من جهازك"
                    className="flex-1 min-w-[200px] px-3.5 py-2 text-xs font-mono rounded-lg bg-white border border-[#E6E2D8] text-[#141413] outline-none"
                  />
                  <label className="px-4 py-2 rounded-lg bg-[#0F291E] text-white text-xs font-bold hover:bg-[#141E28] transition-colors flex items-center gap-1.5 cursor-pointer">
                    <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{uploadingAssetKey === 'article-img' ? 'جاري الرفع...' : 'رفع صورة'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          uploadAssetFile(file, 'article-img', (url) =>
                            setPostForm((prev) => ({ ...prev, coverImage: url }))
                          );
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1.5">
                  الملخص التنفيذي للمقال (Excerpt):
                </label>
                <textarea
                  rows={2}
                  value={postForm.excerpt}
                  onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                  placeholder="اكتب خلاصة مركزة تظهر في بطاقة المقال..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#0F291E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1.5">
                  النص الكامل للمقال أو الدراسة الوثائقية:
                </label>
                <textarea
                  rows={7}
                  value={postForm.sectionBody}
                  onChange={(e) => setPostForm({ ...postForm, sectionBody: e.target.value })}
                  placeholder="اكتب النص التاريخي أو الوثائقي الكامل هنا..."
                  className="w-full px-4 py-3 text-sm rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#0F291E] leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#0F291E] text-white text-xs font-extrabold hover:bg-[#141E28] transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4 text-[#D4AF37]" />
                  <span>{editingArticleId ? 'حفظ التعديلات' : 'نشر المقال في الديوان'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Articles List */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E6E2D8] p-6 sm:p-8 shadow-sm space-y-4">
            <div className="pb-4 border-b border-[#E6E2D8]">
              <div className="text-xs font-bold text-[#695022]">
                قاعدة بيانات الديوان ({articles.length} مقالات)
              </div>
              <h3 className="text-lg font-extrabold text-[#141413]">
                المقالات والدراسات المنشورة حالياً
              </h3>
            </div>

            <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] hover:border-[#695022] transition-all space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-[#695022]">
                    <span>{art.categoryLabel}</span>
                    <span>{art.publishDate}</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-[#141413] leading-snug">
                    {art.title}
                  </h4>
                  <p className="text-xs text-zinc-600 line-clamp-2">{art.excerpt}</p>
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E6E2D8]">
                    <button
                      type="button"
                      onClick={() => handleEditArticleClick(art)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#E6E2D8] text-xs font-bold text-[#0F291E] hover:border-[#695022] flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>تحرير</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteArticle(art.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-xs font-bold text-red-800 hover:bg-red-100 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODULE 5: CERTIFICATE & VIP ID STUDIO
      ==================================================================== */}
      {activeTab === 'certificates' && (
        <div className="space-y-10">
          <div className="no-print grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E6E2D8]">
                <div>
                  <div className="text-xs font-bold text-[#695022]">
                    ELSAIDY LINEAGE CERTIFICATE & VIP ID STUDIO
                  </div>
                  <h2 className="text-xl font-extrabold text-[#141413]">
                    إصدار وتخصيص شهادة النسب الملكية وبطاقة العضوية
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 bg-[#F7F6F2] p-1 rounded-xl border border-[#E6E2D8]">
                  <button
                    type="button"
                    onClick={() => setCertForm({ ...certForm, documentType: 'a4-certificate' })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      certForm.documentType === 'a4-certificate'
                        ? 'bg-[#0F291E] text-white'
                        : 'text-zinc-700'
                    }`}
                  >
                    شهادة نسب (A4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCertForm({ ...certForm, documentType: 'vip-id' })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      certForm.documentType === 'vip-id'
                        ? 'bg-[#0F291E] text-white'
                        : 'text-zinc-700'
                    }`}
                  >
                    بطاقة عضوية (VIP ID)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1.5">
                    الاسم الرباعي أو الكامل بالعربية:
                  </label>
                  <input
                    type="text"
                    value={certForm.arabicName}
                    onChange={(e) => setCertForm({ ...certForm, arabicName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1.5">
                    الاسم بالإنجليزية (English Name):
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={certForm.englishName}
                    onChange={(e) => setCertForm({ ...certForm, englishName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1.5">
                    القطر / الدولة:
                  </label>
                  <select
                    value={certForm.countryCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      const map: Record<string, string> = {
                        EG: 'جمهورية مصر العربية',
                        SA: 'المملكة العربية السعودية',
                        LV: 'بلاد الشام والعراق',
                        GF: 'دول الخليج العربي',
                        MG: 'المغرب العربي والسودان',
                      };
                      setCertForm({
                        ...certForm,
                        countryCode: code,
                        country: map[code] || 'جمهورية مصر العربية',
                      });
                      handleGenerateNewSerial(code);
                    }}
                    className="w-full px-3 py-2.5 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                  >
                    <option value="EG">مصر (EG)</option>
                    <option value="SA">السعودية (SA)</option>
                    <option value="LV">الشام والعراق (LV)</option>
                    <option value="GF">الخليج العربي (GF)</option>
                    <option value="MG">المغرب العربي والسودان (MG)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#141413] mb-1.5">
                    الرقم المرجعي للوثيقة (Serial Number):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      dir="ltr"
                      value={certForm.serialNumber}
                      onChange={(e) => setCertForm({ ...certForm, serialNumber: e.target.value })}
                      className="flex-1 px-3.5 py-2.5 text-sm font-mono font-bold rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateNewSerial()}
                      className="px-3 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] hover:border-[#695022] text-xs font-bold cursor-pointer"
                    >
                      توليد رقم
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1.5">
                    اللقب / العائلة المعتمدة في الشهادة (الافتراضي: الصعيدي):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={certForm.familyTitle}
                      onChange={(e) => setCertForm({ ...certForm, familyTitle: e.target.value })}
                      placeholder="الصعيدي"
                      className="flex-1 px-3.5 py-2.5 text-sm font-bold text-[#0F291E] rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                    />
                    {certForm.familyTitle !== 'الصعيدي' && (
                      <button
                        type="button"
                        onClick={() => setCertForm({ ...certForm, familyTitle: 'الصعيدي' })}
                        className="px-2.5 py-2 rounded-xl bg-[#0F291E] text-[#D4AF37] text-xs font-bold cursor-pointer shrink-0"
                      >
                        الصعيدي (الافتراضي)
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1.5">
                    المحافظة / الحاضرة / الفرع العائلي:
                  </label>
                  <input
                    type="text"
                    value={certForm.regionBranch}
                    onChange={(e) => setCertForm({ ...certForm, regionBranch: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1.5">
                  ديباجة عمود النسب والتوثيق التاريخي:
                </label>
                <textarea
                  rows={3}
                  value={certForm.lineageNarrative}
                  onChange={(e) => setCertForm({ ...certForm, lineageNarrative: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E6E2D8]">
                <label className="inline-flex items-center gap-2 text-xs font-bold text-[#0F291E] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={certForm.includeFamilyTreeStamp}
                    onChange={(e) =>
                      setCertForm({ ...certForm, includeFamilyTreeStamp: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#0F291E]"
                  />
                  <span>إدراج ختم مصغر لوثيقة شجرة العائلة في الشهادة</span>
                </label>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleSaveCertificate}
                    className="px-5 py-2.5 rounded-xl bg-[#0F291E] text-white text-xs font-extrabold hover:bg-[#141E28] flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Save className="w-4 h-4 text-[#D4AF37]" />
                    <span>اعتماد وحفظ في السجل العام</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-5 py-2.5 rounded-xl bg-[#695022] text-white text-xs font-extrabold hover:bg-[#533f1b] flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة / تصدير PDF</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Saved Certificates Registry */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E6E2D8] p-6 sm:p-8 shadow-sm space-y-4">
              <div className="pb-4 border-b border-[#E6E2D8]">
                <div className="text-xs font-bold text-[#695022]">
                  السجل العام للوثائق الصادرة ({issuedCertificates.length})
                </div>
                <h3 className="text-lg font-extrabold text-[#141413]">
                  الشهادات المعتمدة للتحقق الفوري (/verify/:serial)
                </h3>
              </div>

              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {issuedCertificates.map((c) => (
                  <div
                    key={c.serialNumber}
                    className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="font-mono text-xs font-extrabold text-[#0F291E] flex items-center gap-2">
                        <span>{c.serialNumber}</span>
                        <span className="px-2 py-0.5 rounded bg-[#0F291E]/10 text-[10px] font-sans font-bold text-[#0F291E]">
                          آل {c.familyTitle || 'الصعيدي'}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-[#141413] truncate">{c.arabicName}</div>
                      <div className="text-[10px] font-mono text-[#695022] truncate" dir="ltr">
                        elsaidy.org/verify/{c.serialNumber}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setCertForm({
                            serialNumber: c.serialNumber,
                            arabicName: c.arabicName,
                            englishName: c.englishName,
                            familyTitle: c.familyTitle || 'الصعيدي',
                            country: c.country,
                            countryCode: c.countryCode,
                            regionBranch: c.regionBranch,
                            lineageNarrative: c.lineageNarrative,
                            documentType: c.documentType,
                            issueDateGregorian: c.issueDateGregorian,
                            issueDateHijri: c.issueDateHijri,
                            includeFamilyTreeStamp: true,
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E6E2D8] text-xs font-bold text-[#0F291E] cursor-pointer"
                      >
                        عرض
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCertificate(c.serialNumber)}
                        className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 cursor-pointer"
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
          <div className="bg-white rounded-2xl border border-[#E6E2D8] p-4 sm:p-8 shadow-sm">
            <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-[#695022]">
                معاينة حية للوثيقة الجاهزة للطباعة (الرابط داخل رمز QR:{' '}
                <span className="font-mono text-[#0F291E]" dir="ltr">
                  https://elsaidy.org/verify/{certForm.serialNumber}
                </span>
                ):
              </span>
            </div>
            <CertificateDocumentView
              record={{
                serialNumber: certForm.serialNumber,
                arabicName: certForm.arabicName,
                englishName: certForm.englishName,
                familyTitle: certForm.familyTitle || 'الصعيدي',
                country: certForm.country,
                countryCode: certForm.countryCode,
                regionBranch: certForm.regionBranch,
                lineageNarrative: certForm.lineageNarrative,
                documentType: certForm.documentType,
                issueDateGregorian: certForm.issueDateGregorian,
                issueDateHijri: certForm.issueDateHijri,
                status: 'وثيقة نسب معتمدة ومطابقة للسجل العام',
              }}
              familyTitle={certForm.familyTitle || 'الصعيدي'}
              includeFamilyTreeStamp={certForm.includeFamilyTreeStamp}
              customLogoUrl={siteConfig.branding.logoUrl}
              customSealImageUrl={siteConfig.branding.sealImageUrl}
              customTreeImageUrl={siteConfig.familyTreeConfig.treeImageUrl}
              siteTitle={siteConfig.branding.siteTitle}
            />
          </div>
        </div>
      )}

      {/* ====================================================================
          MODULE 6: TREE IMAGE, SEO NAMES, 2X COUNTER & GITHUB API SYNC
      ==================================================================== */}
      {activeTab === 'github' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Family Tree Customizer + SEO Names + Visitor Counter */}
          <div className="lg:col-span-6 space-y-6">
            {/* Family Tree Image Customizer */}
            <div className="bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#0F291E] p-6 sm:p-8 shadow-sm space-y-4">
              <div className="border-b border-[#E6E2D8] pb-3">
                <div className="text-xs font-bold text-[#695022]">FAMILY TREE ARCHIVE CONFIG</div>
                <h2 className="text-lg font-extrabold text-[#141413]">
                  تحديث صورة وبيانات شجرة العائلة (/tree)
                </h2>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1">
                  عنوان وثيقة الشجرة:
                </label>
                <input
                  type="text"
                  value={siteConfig.familyTreeConfig.documentTitle}
                  onChange={(e) =>
                    onUpdateSiteConfig({
                      ...siteConfig,
                      familyTreeConfig: {
                        ...siteConfig.familyTreeConfig,
                        documentTitle: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1">
                    الرمز المرجعي للوثيقة:
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={siteConfig.familyTreeConfig.documentCode}
                    onChange={(e) =>
                      onUpdateSiteConfig({
                        ...siteConfig,
                        familyTreeConfig: {
                          ...siteConfig.familyTreeConfig,
                          documentCode: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1">
                    مسار صورة الشجرة:
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={siteConfig.familyTreeConfig.treeImageUrl}
                    onChange={(e) =>
                      onUpdateSiteConfig({
                        ...siteConfig,
                        familyTreeConfig: {
                          ...siteConfig.familyTreeConfig,
                          treeImageUrl: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <label className="px-4 py-2 rounded-xl bg-[#0F291E] text-white text-xs font-bold hover:bg-[#141E28] transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>
                    {uploadingAssetKey === 'family-tree'
                      ? 'جاري رفع الشجرة...'
                      : 'رفع صورة شجرة عائلة جديدة عالية الدقة'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        uploadAssetFile(file, 'family-tree', (url) =>
                          onUpdateSiteConfig({
                            ...siteConfig,
                            familyTreeConfig: {
                              ...siteConfig.familyTreeConfig,
                              treeImageUrl: url,
                            },
                          })
                        );
                      }
                    }}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() =>
                    onUpdateSiteConfig({
                      ...siteConfig,
                      familyTreeConfig: DEFAULT_SITE_CONFIG.familyTreeConfig,
                    })
                  }
                  className="text-xs font-bold text-zinc-600 hover:text-[#0F291E] underline cursor-pointer"
                >
                  استعادة صورة الشجرة الأصلية (/family-tree.png)
                </button>
              </div>
            </div>

            {/* SEO Compound Names Manager */}
            <div className="bg-white rounded-2xl border border-[#E6E2D8] p-6 sm:p-8 shadow-sm space-y-4">
              <div className="border-b border-[#E6E2D8] pb-3">
                <div className="text-xs font-bold text-[#695022]">
                  SEO COMPOUND NAMES & LINEAGE INDEX ({customNames.length})
                </div>
                <h3 className="text-lg font-extrabold text-[#141413]">
                  موسوعة الأسماء المركبة والفروع لمحركات البحث (Google SEO)
                </h3>
              </div>

              <form onSubmit={handleAddCompoundName} className="flex gap-2">
                <input
                  type="text"
                  value={newNameInput}
                  onChange={(e) => setNewNameInput(e.target.value)}
                  placeholder="أضف اسماً مركباً أو فرعاً (مثال: أحمد حجازي الصعيدي)..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0F291E] text-white text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>إضافة</span>
                </button>
              </form>

              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                {customNames.map((name, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-[#F7F6F2] border border-[#E6E2D8] text-xs font-bold text-[#141413] flex items-center gap-2"
                  >
                    <span>{name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCompoundName(name)}
                      className="text-red-700 hover:text-red-900 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 2x Visitor Counter Control */}
            <div className="bg-white rounded-2xl border border-[#E6E2D8] p-6 sm:p-8 shadow-sm space-y-4">
              <div className="border-b border-[#E6E2D8] pb-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#695022]">
                    2X DOUBLE-INCREMENT VISITOR TELEMETRY
                  </div>
                  <h3 className="text-lg font-extrabold text-[#141413]">
                    إدارة عداد الزوار المباشر (حساب الزائر بـ 2 نشط)
                  </h3>
                </div>
                <Users className="w-5 h-5 text-[#0F291E]" />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="number"
                  dir="ltr"
                  value={manualVisitorInput}
                  onChange={(e) => setManualVisitorInput(e.target.value)}
                  className="w-44 px-3.5 py-2 text-sm font-mono font-extrabold rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                />
                <button
                  type="button"
                  onClick={() => {
                    const parsed = parseInt(manualVisitorInput, 10);
                    if (!isNaN(parsed) && parsed >= 148923) {
                      onUpdateVisitorCount(parsed);
                      setStatusBanner({
                        type: 'success',
                        message: `تم تحديث عداد زيارات البوابة إلى ${parsed.toLocaleString('en-US')}.`,
                      });
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#0F291E] text-white text-xs font-bold cursor-pointer"
                >
                  تحديث الرقم الأساسي
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = visitorCount + 100;
                    onUpdateVisitorCount(next);
                    setManualVisitorInput(String(next));
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-xs font-bold text-[#695022] cursor-pointer"
                >
                  +100 زيارة
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: GitHub Direct API Sync */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-8 shadow-sm space-y-5">
            <div className="border-b border-[#E6E2D8] pb-4">
              <div className="text-xs font-bold text-[#695022]">
                SERVERLESS GITHUB API CMS ENGINE
              </div>
              <h2 className="text-xl font-extrabold text-[#141413] mt-0.5">
                المزامنة السحابية المباشرة مع مستودع GitHub (Cloudflare Pages)
              </h2>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                عند الضغط على «مزامنة ونشر التحديثات إلى GitHub»، يقوم النظام بتحديث ملف{' '}
                <span className="font-mono font-bold text-[#0F291E]">public/data/cms-db.json</span>{' '}
                مباشرةً في مستودعك، مما يحفظ الشعار والهوية والبانر والبوابات والمقالات والشهادات
                بشكل دائم.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1">
                  رمز الوصول الشخصي (GitHub Personal Access Token — بصلاحية repo):
                </label>
                <input
                  type="password"
                  dir="ltr"
                  value={githubConfig.token}
                  onChange={(e) => setGithubConfig({ ...githubConfig, token: e.target.value })}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1">
                    المالك (Owner):
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={githubConfig.owner}
                    onChange={(e) => setGithubConfig({ ...githubConfig, owner: e.target.value })}
                    placeholder="AliAhmedElseidy"
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1">
                    المستودع (Repo):
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={githubConfig.repo}
                    onChange={(e) => setGithubConfig({ ...githubConfig, repo: e.target.value })}
                    placeholder="elsaidy-org"
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1">
                    الفرع (Branch):
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={githubConfig.branch}
                    onChange={(e) => setGithubConfig({ ...githubConfig, branch: e.target.value })}
                    placeholder="main"
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#E6E2D8]">
                <button
                  type="button"
                  onClick={handleSyncToGitHub}
                  disabled={isSyncingGitHub}
                  className="px-6 py-3 rounded-xl bg-[#0F291E] text-white text-xs font-extrabold hover:bg-[#141E28] transition-colors flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 text-[#D4AF37] ${isSyncingGitHub ? 'animate-spin' : ''}`} />
                  <span>
                    {isSyncingGitHub
                      ? 'جاري رفع البيانات إلى GitHub...'
                      : 'مزامنة ونشر كافة تعديلات الموقع إلى GitHub الآن'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveGitHubConfig}
                  className="px-4 py-3 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-xs font-bold text-[#141413] hover:border-[#695022] cursor-pointer"
                >
                  حفظ بيانات الربط محلياً
                </button>

                <button
                  type="button"
                  onClick={handleDownloadJsonBackup}
                  className="px-4 py-3 rounded-xl bg-white border border-[#E6E2D8] text-xs font-bold text-[#695022] hover:border-[#695022] flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تنزيل نسخة احتياطية (cms-db.json)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
