import React, { useState, Suspense, lazy } from 'react';
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
  DEFAULT_FAMILY_TREE_NODES,
  FamilyTreeNode,
  AdminChangeLogEntry,
  sanitizeSafeUrl,
} from '../data/familyData';
import type { EncyclopediaBranchSubmission } from '../data/elsaidyEncyclopedia';

const ENCYCLOPEDIA_STORAGE_SUBMISSIONS_KEY =
  'elsaidy_encyclopedia_branch_submissions_v1';

const CertificateDocumentView = lazy(() =>
  import('../components/CertificateDocumentView').then((m) => ({
    default: m.CertificateDocumentView,
  }))
);

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
  treeNodes?: FamilyTreeNode[];
  onUpdateTreeNodes?: (newNodes: FamilyTreeNode[]) => void;
  siteConfig: SiteConfig;
  onUpdateSiteConfig: (newConfig: SiteConfig) => void;
}

const GITHUB_REPO_COORDS_STORAGE_KEY = 'elsaidy_cms_github_repo_coords_v2';

interface GitHubConfig {
  token: string; // Strictly in-memory React state only; NEVER persisted to localStorage or sessionStorage (SEC-002)
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
  treeNodes = DEFAULT_FAMILY_TREE_NODES,
  onUpdateTreeNodes,
  siteConfig,
  onUpdateSiteConfig,
}) => {
  // Zero hardcoded passcodes in client bundle (SEC-001).
  // Server-side sync is gated by Cloudflare Access / ADMIN_SYNC_SECRET in /functions/api/cms-sync.ts.
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
  const [serverSyncSecret, setServerSyncSecret] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<
    'github' | 'brand' | 'hero' | 'portals' | 'posts' | 'certificates'
  >('github');

  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const [changeLog, setChangeLog] = useState<AdminChangeLogEntry[]>([
    {
      id: 'init-log',
      timestamp: new Date().toLocaleTimeString('ar-EG'),
      action: 'بدء جلسة الإدارة',
      details: 'تم فتح استوديو التخصيص والتحكم الآمن مع تفعيل حماية السجلات وعدم تخزين أي مفاتيح سرية في المتصفح.',
    },
  ]);

  const appendLog = (action: string, details: string) => {
    setChangeLog((prev) => [
      {
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toLocaleTimeString('ar-EG'),
        action,
        details,
      },
      ...prev.slice(0, 29),
    ]);
  };

  // GitHub Config State: Only non-sensitive owner/repo/branch coordinates may be read from localStorage; token is strictly in-memory (SEC-002)
  const [githubConfig, setGithubConfig] = useState<GitHubConfig>(() => {
    try {
      // Proactively purge any legacy token key from localStorage
      localStorage.removeItem('elsaidy_cms_github_config_v1');
      const savedCoords = localStorage.getItem(GITHUB_REPO_COORDS_STORAGE_KEY);
      if (savedCoords) {
        const parsed = JSON.parse(savedCoords);
        return {
          token: '',
          owner: parsed.owner || 'AliAhmedElseidy',
          repo: parsed.repo || 'elsaidy-org',
          branch: parsed.branch || 'main',
        };
      }
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

  // --- MODULE 4: POSTS CMS STATE (Preserves Multi-Section Articles — BUG-006) ---
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
    sections: { heading: string; body: string }[];
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
    sections: [{ heading: 'المتن التوثيقي والتاريخي', body: '' }],
  });

  // --- MODULE 5: CERTIFICATE STUDIO STATE (With Anti-Collision Identity Fields) ---
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
    personalPhotoUrl: string;
    memberReferenceId: string;
    ancestralRoot: string;
    currentResidence: string;
    includeFamilyTreeStamp: boolean;
  }>({
    serialNumber: `ELS-2026-EG-${String(issuedCertificates.length + 15).padStart(3, '0')}`,
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
    personalPhotoUrl: '',
    memberReferenceId: `REG-EG-GH-00${issuedCertificates.length + 15}`,
    ancestralRoot: 'الجد السابع إبراهيم الصعيدي الجهني — عمود النسب الموثق',
    currentResidence: 'جمهورية مصر العربية — محافظة الغربية (طنطا) / القاهرة',
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
    setIsUnlocked(true);
    setAuthError('');
  };

  const handleLockSession = () => {
    setIsUnlocked(false);
    setServerSyncSecret('');
    // Immediately wipe any in-memory GitHub PAT on lock (SEC-002)
    setGithubConfig((prev) => ({ ...prev, token: '' }));
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
        englishSubtitle: 'ELSAIDY Official Digital Portal',
        domain: portalForm.domain.trim() || 'elsaidy.org',
        url: portalForm.url.trim() || 'https://elsaidy.org',
        accessClassification: portalForm.accessClassification.trim() || 'بوابة مؤسسية معتمدة',
        securityProtocol: 'تشفير مؤسسي موحد (TLS 1.3 / ELSAIDY SSO)',
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

  // --- MODULE 4 HANDLERS: POSTS (Preserves All Multi-Section Headings & Bodies — BUG-006) ---
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const validSections = postForm.sections
      .map((s) => ({
        heading: s.heading.trim() || 'المتن التوثيقي والتاريخي',
        body: s.body.trim(),
      }))
      .filter((s) => s.body.length > 0);

    if (!postForm.title.trim() || !postForm.excerpt.trim() || validSections.length === 0) {
      setStatusBanner({
        type: 'error',
        message: 'يرجى تعبئة عنوان المقال والملخص وقسم نصي واحد على الأقل قبل الحفظ.',
      });
      return;
    }

    const safeCover = sanitizeSafeUrl(postForm.coverImage) || undefined;

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
              coverImage: safeCover,
              sections: validSections,
            }
          : art
      );
      onUpdateArticles(updated);
      appendLog('تحديث مقال في الديوان', `تم تحديث المقال: ${postForm.title.trim()} (${validSections.length} أقسام)`);
      setEditingArticleId(null);
      setStatusBanner({
        type: 'success',
        message: `تم تحديث المقال بنجاح مع الحفاظ على كافة أقسامه الفرعية (${validSections.length} أقسام).`,
      });
    } else {
      const newId = `diwan-cms-${Date.now()}`;
      const newArticle: DiwanArticle = {
        id: newId,
        slug: newId,
        isoDate: new Date().toISOString().slice(0, 10),
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
        coverImage: safeCover,
        sections: validSections,
      };
      onUpdateArticles([newArticle, ...articles]);
      appendLog('نشر مقال جديد', `تم نشر المقال: ${newArticle.title}`);
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
      sections: [{ heading: 'المتن التوثيقي والتاريخي', body: '' }],
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
      sections:
        art.sections && art.sections.length > 0
          ? art.sections.map((s) => ({ heading: s.heading, body: s.body }))
          : [{ heading: 'المتن التوثيقي والتاريخي', body: '' }],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteArticle = (id: string) => {
    const target = articles.find((a) => a.id === id);
    const filtered = articles.filter((a) => a.id !== id);
    onUpdateArticles(filtered);
    appendLog('حذف مقال', `تم حذف المقال: ${target?.title || id}`);
    setStatusBanner({
      type: 'info',
      message: 'تم حذف المقال من الديوان.',
    });
  };

  // --- MODULE 5 HANDLERS: CERTIFICATES (Anti-Collision & Archive/Restore) ---
  const handleGenerateNewSerial = (countryCode = certForm.countryCode) => {
    const rand = Math.floor(100 + Math.random() * 899);
    const nextSerial = `ELS-2026-${countryCode}-${rand}`;
    const nextRefId = `REG-${countryCode}-${rand}`;
    setCertForm((prev) => ({
      ...prev,
      serialNumber: nextSerial,
      memberReferenceId: nextRefId,
    }));
  };

  const handleSaveCertificate = () => {
    if (!certForm.arabicName.trim() || !certForm.serialNumber.trim()) {
      setStatusBanner({
        type: 'error',
        message: 'يرجى إدخال الاسم الكامل والرقم المرجعي للوثيقة.',
      });
      return;
    }

    const serialUpper = certForm.serialNumber.trim().toUpperCase();
    const record: IssuedCertificateRecord = {
      serialNumber: serialUpper,
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
      personalPhotoUrl: sanitizeSafeUrl(certForm.personalPhotoUrl) || undefined,
      memberReferenceId:
        certForm.memberReferenceId.trim() ||
        `REG-${serialUpper.replace(/^ELS-\d+-/, '')}`,
      ancestralRoot:
        certForm.ancestralRoot.trim() ||
        'الجد السابع إبراهيم الصعيدي الجهني — عمود النسب الموثق',
      currentResidence:
        certForm.currentResidence.trim() ||
        `${certForm.country} — ${certForm.regionBranch.trim()}`,
      archived: false,
    };

    const filtered = issuedCertificates.filter(
      (c) => c.serialNumber.toUpperCase() !== record.serialNumber
    );
    onUpdateCertificates([record, ...filtered]);
    appendLog(
      'اعتماد وحفظ شهادة نسب',
      `الوثيقة ${record.serialNumber} باسم: ${record.arabicName} (رقم القيد: ${record.memberReferenceId})`
    );
    setStatusBanner({
      type: 'success',
      message: `تم حفظ واعتماد الوثيقة رقم (${record.serialNumber}) في السجل العام للتحقق الفوري عبر الرابط (https://elsaidy.org/verify/${record.serialNumber}).`,
    });
  };

  const handleToggleArchiveCertificate = (serial: string) => {
    const updated = issuedCertificates.map((c) => {
      if (c.serialNumber.toUpperCase() === serial.toUpperCase()) {
        const nextArchived = !c.archived;
        appendLog(
          nextArchived ? 'أرشفة شهادة' : 'استعادة شهادة من الأرشيف',
          `الوثيقة ${c.serialNumber} (${c.arabicName})`
        );
        return { ...c, archived: nextArchived };
      }
      return c;
    });
    onUpdateCertificates(updated);
    setStatusBanner({
      type: 'info',
      message: `تم تحديث حالة أرشفة الوثيقة (${serial}) مع الحفاظ على سجلها الكامل دون فقدان البيانات.`,
    });
  };

  const handleDeleteCertificate = (serial: string) => {
    const filtered = issuedCertificates.filter(
      (c) => c.serialNumber.toUpperCase() !== serial.toUpperCase()
    );
    onUpdateCertificates(filtered);
    appendLog('حذف شهادة من السجل المحلي', `تم حذف الوثيقة رقم ${serial}`);
    setStatusBanner({
      type: 'info',
      message: `تم حذف الوثيقة (${serial}) من السجل المخصص.`,
    });
  };

  // --- MODULE 6 HANDLERS: DYNAMIC TREE BUILDER, SEO NAMES & GITHUB SYNC ---
  const [editingTreeNodeId, setEditingTreeNodeId] = useState<string | null>(null);
  const [treeNodeSearch, setTreeNodeSearch] = useState<string>('');
  const [treeNodeForm, setTreeNodeForm] = useState<{
    name: string;
    title: string;
    parentId: string;
    branchName: string;
    generation: string;
    serialNumber: string;
    location: string;
  }>({
    name: '',
    title: '',
    parentId: 'node-ahmed-ali-eg',
    branchName: 'فرع مصر (الغربية وطنطا والصعيد والقاهرة)',
    generation: 'الجيل السابع المعاصر',
    serialNumber: '',
    location: 'محافظة الغربية — مدينة طنطا / القاهرة',
  });

  const handleSaveTreeNode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = treeNodeForm.name.trim();
    if (!cleanName) {
      setStatusBanner({
        type: 'error',
        message: 'يرجى إدخال الاسم الكامل للعضو أو العلم لإضافته في الشجرة التفاعلية.',
      });
      return;
    }

    const resolvedParentId =
      treeNodeForm.parentId && treeNodeForm.parentId !== 'ROOT' ? treeNodeForm.parentId : null;

    if (editingTreeNodeId && resolvedParentId === editingTreeNodeId) {
      setStatusBanner({
        type: 'error',
        message: 'لا يمكن ربط العضو بنفسه كأب مباشر. يرجى اختيار الأب أو الجد الأعلى الصحيح.',
      });
      return;
    }

    const updatedNode: FamilyTreeNode = {
      id: editingTreeNodeId || `node-cms-${Date.now()}`,
      name: cleanName,
      title: treeNodeForm.title.trim() || 'عضو موثق في شجرة عائلات الصعيدي',
      parentId: resolvedParentId,
      branchName: treeNodeForm.branchName.trim() || 'فرع مصر (الغربية وطنطا والصعيد والقاهرة)',
      generation: treeNodeForm.generation.trim() || 'الجيل المعاصر',
      ...(treeNodeForm.serialNumber.trim()
        ? { serialNumber: treeNodeForm.serialNumber.trim().toUpperCase() }
        : {}),
      location: treeNodeForm.location.trim() || 'جمهورية مصر العربية / الوطن العربي',
    };

    const nextNodes = editingTreeNodeId
      ? treeNodes.map((n) => (n.id === editingTreeNodeId ? updatedNode : n))
      : [...treeNodes, updatedNode];

    if (onUpdateTreeNodes) {
      onUpdateTreeNodes(nextNodes);
    }

    if (!customNames.some((cn) => cn.includes(cleanName))) {
      onUpdateCustomNames([cleanName, ...customNames]);
    }

    const parentObj = treeNodes.find((p) => p.id === resolvedParentId);
    appendLog(
      editingTreeNodeId ? 'تحديث عضو في الشجرة التفاعلية' : 'إضافة عضو جديد للشجرة التفاعلية',
      `${cleanName} (${updatedNode.branchName}) — الأب/الجد: ${parentObj ? parentObj.name : 'جذر رئيسي'}`
    );

    setStatusBanner({
      type: 'success',
      message: editingTreeNodeId
        ? `تم تحديث بيانات "${cleanName}" في الشجرة التفاعلية بنجاح. يمكنك الآن الضغط على زر (نشر التعديلات إلى GitHub) لمزامنتها في cms-db.json.`
        : `تمت إضافة "${cleanName}" وربطه بـ (${parentObj ? parentObj.name : 'الجذر الرئيسي'}) في الشجرة التفاعلية وفهرس الأسماء بنجاح!`,
    });

    setEditingTreeNodeId(null);
    setTreeNodeForm({
      name: '',
      title: '',
      parentId: resolvedParentId || 'node-ibrahim-root',
      branchName: treeNodeForm.branchName,
      generation: treeNodeForm.generation,
      serialNumber: '',
      location: treeNodeForm.location,
    });
  };

  const handleEditTreeNodeClick = (node: FamilyTreeNode) => {
    setEditingTreeNodeId(node.id);
    setTreeNodeForm({
      name: node.name,
      title: node.title,
      parentId: node.parentId || 'ROOT',
      branchName: node.branchName,
      generation: node.generation,
      serialNumber: node.serialNumber || '',
      location: node.location,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTreeNode = (nodeId: string) => {
    const target = treeNodes.find((n) => n.id === nodeId);
    if (!target) return;
    const fallbackParentId = target.parentId;
    const nextNodes = treeNodes
      .filter((n) => n.id !== nodeId)
      .map((n) => (n.parentId === nodeId ? { ...n, parentId: fallbackParentId } : n));
    if (onUpdateTreeNodes) {
      onUpdateTreeNodes(nextNodes);
    }
    if (editingTreeNodeId === nodeId) {
      setEditingTreeNodeId(null);
    }
    appendLog('حذف عضو من الشجرة التفاعلية', target.name);
    setStatusBanner({
      type: 'info',
      message: `تم حذف "${target.name}" من الشجرة التفاعلية مع الحفاظ على ربط الأبناء الفرعيين بأمان.`,
    });
  };

  const handleAddCompoundName = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newNameInput.trim();
    if (!cleaned) return;
    if (!customNames.includes(cleaned)) {
      onUpdateCustomNames([cleaned, ...customNames]);
      appendLog('إضافة اسم مركب للموسوعة', cleaned);
      setStatusBanner({
        type: 'success',
        message: `تمت إضافة "${cleaned}" إلى موسوعة الأسماء ومحركات البحث (SEO).`,
      });
    }
    setNewNameInput('');
  };

  const handleRemoveCompoundName = (nameToRemove: string) => {
    onUpdateCustomNames(customNames.filter((n) => n !== nameToRemove));
    appendLog('إزالة اسم مركب', nameToRemove);
  };

  // --- ENCYCLOPEDIA BRANCH SUBMISSIONS REVIEW QUEUE ---
  const [branchSubmissions, setBranchSubmissions] = useState<EncyclopediaBranchSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(ENCYCLOPEDIA_STORAGE_SUBMISSIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const handleApproveBranchSubmission = (sub: EncyclopediaBranchSubmission) => {
    const updatedList = branchSubmissions.map((item) =>
      item.id === sub.id ? { ...item, status: 'approved' as const } : item
    );
    setBranchSubmissions(updatedList);
    try {
      localStorage.setItem(ENCYCLOPEDIA_STORAGE_SUBMISSIONS_KEY, JSON.stringify(updatedList));
    } catch {
      // ignore
    }

    // Also add a node into the Interactive Family Tree & Custom SEO Names so it syncs to GitHub
    const newNode: FamilyTreeNode = {
      id: `node-enc-${Date.now()}`,
      name: sub.branchOrHouseName || sub.fullName,
      title:
        sub.historicalNotes ||
        `فرع موثق في ${sub.centerOrVillage} (${sub.countryOrGovernorate}) — مسجل بواسطة ${sub.fullName}`,
      parentId: 'node-morsi-hagag-eg',
      branchName: `${sub.countryOrGovernorate} — ${sub.centerOrVillage}`,
      generation: 'فرع عائلي معتمد',
      location: `${sub.countryOrGovernorate} · ${sub.centerOrVillage}`,
    };

    if (onUpdateTreeNodes) {
      onUpdateTreeNodes([...treeNodes, newNode]);
    }
    const seoLabel = `${sub.branchOrHouseName} — ${sub.centerOrVillage} (${sub.countryOrGovernorate})`;
    if (!customNames.includes(seoLabel)) {
      onUpdateCustomNames([seoLabel, ...customNames]);
    }

    appendLog('اعتماد فرع جديد في الموسوعة والشجرة', seoLabel);
    setStatusBanner({
      type: 'success',
      message: `تم اعتماد فرع (${sub.branchOrHouseName} — ${sub.centerOrVillage}) وإدراجه في الموسوعة والشجرة التفاعلية بنجاح!`,
    });
  };

  const handleDeleteBranchSubmission = (id: string) => {
    const updatedList = branchSubmissions.filter((item) => item.id !== id);
    setBranchSubmissions(updatedList);
    try {
      localStorage.setItem(ENCYCLOPEDIA_STORAGE_SUBMISSIONS_KEY, JSON.stringify(updatedList));
    } catch {
      // ignore
    }
    appendLog('حذف طلب فرع من قائمة المراجعة', id);
  };

  const handleSaveGitHubConfig = () => {
    try {
      // Strictly store ONLY owner, repo, and branch; NEVER store token in localStorage (SEC-002)
      localStorage.setItem(
        GITHUB_REPO_COORDS_STORAGE_KEY,
        JSON.stringify({
          owner: githubConfig.owner.trim(),
          repo: githubConfig.repo.trim(),
          branch: githubConfig.branch.trim() || 'main',
        })
      );
      setStatusBanner({
        type: 'success',
        message:
          'تم حفظ إحداثيات المستودع (Owner / Repo / Branch) فقط. لا يتم تخزين رمز الوصول الشخصي (Token) في المتصفح مطلقاً لحماية الأمان.',
      });
    } catch {
      // ignore
    }
  };

  const handleSyncToGitHub = async () => {
    setIsSyncingGitHub(true);
    setStatusBanner({
      type: 'info',
      message:
        'جاري مزامنة قاعدة البيانات الشاملة والشجرة التفاعلية (public/data/cms-db.json)...',
    });

    try {
      localStorage.setItem(
        GITHUB_REPO_COORDS_STORAGE_KEY,
        JSON.stringify({
          owner: githubConfig.owner.trim(),
          repo: githubConfig.repo.trim(),
          branch: githubConfig.branch.trim() || 'main',
        })
      );

      const dbPayload = {
        visitorCount,
        lastUpdated: new Date().toISOString(),
        siteConfig,
        customNames,
        treeNodes,
        certificates: issuedCertificates,
        articles,
      };

      const filePath = 'public/data/cms-db.json';
      const branch = githubConfig.branch.trim() || 'main';
      const jsonString = JSON.stringify(dbPayload, null, 2);
      const base64Content = encodeUtf8ToBase64(jsonString);
      const commitMessage = `Sync ELSAIDY Site Config, Interactive Tree & CMS DB (${new Date().toISOString().slice(0, 10)})`;

      // Path 1: Try Server-Side Cloudflare Pages Function (/api/cms-sync) first if no in-memory token is entered
      if (!githubConfig.token.trim()) {
        const fnRes = await fetch('/api/cms-sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(serverSyncSecret.trim()
              ? { 'X-Elsaidy-Admin-Secret': serverSyncSecret.trim() }
              : {}),
          },
          body: JSON.stringify({
            filePath,
            contentBase64: base64Content,
            commitMessage,
            owner: githubConfig.owner.trim(),
            repo: githubConfig.repo.trim(),
            branch,
          }),
        });

        if (fnRes.ok) {
          appendLog('مزامنة سحابية عبر الخادم', 'تم تحديث public/data/cms-db.json عبر /api/cms-sync');
          setStatusBanner({
            type: 'success',
            message:
              'تمت المزامنة السحابية الآمنة عبر خادم Cloudflare Pages (/api/cms-sync) بنجاح!',
          });
          return;
        }

        const fnErr = await fnRes.json().catch(() => ({}));
        throw new Error(
          fnErr.error ||
            'يرجى ضبط متغير البيئة GITHUB_PAT في Cloudflare Pages أو إدخال رمز الجلسة المؤقت (In-Memory Token) أدناه للمزامنة المباشرة.'
        );
      }

      // Path 2: In-Memory Session Token Direct GitHub API Sync (Never persisted to localStorage)
      if (!githubConfig.owner.trim() || !githubConfig.repo.trim()) {
        throw new Error('يرجى إدخال اسم المالك (Owner) واسم المستودع (Repository).');
      }

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

      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${githubConfig.token.trim()}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: commitMessage,
          content: base64Content,
          branch,
          ...(existingSha ? { sha: existingSha } : {}),
        }),
      });

      if (!putRes.ok) {
        const errBody = await putRes.json().catch(() => ({}));
        throw new Error(errBody.message || `HTTP ${putRes.status}`);
      }

      appendLog('مزامنة سحابية مباشرة', 'تم تحديث public/data/cms-db.json في GitHub');
      setStatusBanner({
        type: 'success',
        message:
          'تمت المزامنة السحابية بنجاح! تم تحديث ملف (public/data/cms-db.json) شاملاً الشجرة التفاعلية والهوية واللوجو والبانر والبوابات والمقالات والشهادات في GitHub.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطأ غير معروف';
      setStatusBanner({
        type: 'error',
        message: `تعذرت المزامنة مع GitHub: ${msg}`,
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
      treeNodes,
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
    appendLog('تصدير نسخة احتياطية', 'تم تنزيل ملف cms-db.json الكامل');
  };

  const handleImportJsonBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (typeof parsed.visitorCount === 'number') {
          onUpdateVisitorCount(parsed.visitorCount);
        }
        if (parsed.siteConfig && typeof parsed.siteConfig === 'object') {
          onUpdateSiteConfig({
            ...DEFAULT_SITE_CONFIG,
            ...parsed.siteConfig,
          });
        }
        if (Array.isArray(parsed.customNames)) {
          onUpdateCustomNames(parsed.customNames);
        }
        if (Array.isArray(parsed.treeNodes) && onUpdateTreeNodes) {
          onUpdateTreeNodes(parsed.treeNodes);
        }
        if (Array.isArray(parsed.certificates)) {
          onUpdateCertificates(parsed.certificates);
        }
        if (Array.isArray(parsed.articles)) {
          onUpdateArticles(parsed.articles);
        }
        appendLog('استيراد قاعدة بيانات JSON', `تم استيراد ملف ${file.name} بنجاح`);
        setStatusBanner({
          type: 'success',
          message: `تم استيراد وتفعيل قاعدة البيانات (${file.name}) بنجاح بكافة عقد الشجرة التفاعلية والشهادات والمقالات والإعدادات!`,
        });
      } catch {
        setStatusBanner({
          type: 'error',
          message: 'ملف JSON غير صالح. يرجى التأكد من اختيار ملف cms-db.json الصحيح.',
        });
      }
    };
    reader.readAsText(file);
  };

  // --- LOCKED GATEWAY VIEW (Zero Hardcoded Passcodes — SEC-001) ---
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
            تعمل هذه اللوحة بنظام الجلسات المعزولة في الذاكرة (Zero Client-Side Secret Storage)
            لتحرير وتخصيص الموقع وتصدير/استيراد قاعدة البيانات أو المزامنة السحابية عبر خادم
            Cloudflare Pages (<span className="font-mono font-bold text-[#0F291E]">/api/cms-sync</span>).
          </p>

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="cms-server-secret"
                className="block text-xs font-bold text-[#141413] mb-2"
              >
                مفتاح مزامنة الخادم الاختياري (Server Sync Secret — يُحفظ في الذاكرة فقط):
              </label>
              <input
                id="cms-server-secret"
                type="password"
                dir="ltr"
                value={serverSyncSecret}
                onChange={(e) => setServerSyncSecret(e.target.value)}
                placeholder="اتركه فارغاً للتحرير المحلي أو أدخل مفتاح الخادم"
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
                لوحة التحكم الشاملة وبناء الشجرة التفاعلية (elsaidy.org)
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
              onClick={() => onNavigate('tree')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
            >
              <GitBranch className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>معاينة الشجرة</span>
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

        {/* 6-Module Navigation Tabs (Tab 1: الشجرة والأسماء ومزامنة GitHub) */}
        <div className="flex overflow-x-auto pb-2 gap-2.5 no-scrollbar">
          {[
            {
              id: 'github' as const,
              label: `١. الشجرة والأسماء (${treeNodes.length} علم)`,
              sub: 'Dynamic Tree Builder & GitHub Sync',
              icon: GitBranch,
            },
            {
              id: 'brand' as const,
              label: '٢. الهوية واللوجو والمظهر',
              sub: 'Logo, Seal & Theme Studio',
              icon: Palette,
            },
            {
              id: 'hero' as const,
              label: '٣. شريط الأخبار والبانر الرئيسي',
              sub: 'Ticker & Hero Editor',
              icon: Megaphone,
            },
            {
              id: 'portals' as const,
              label: `٤. البوابات الرقمية (${(siteConfig.digitalPortals || []).length})`,
              sub: 'Portals & Links Manager',
              icon: Building2,
            },
            {
              id: 'posts' as const,
              label: `٥. الديوان والمقالات (${articles.length})`,
              sub: 'Blogger-Style Posts CMS',
              icon: FileText,
            },
            {
              id: 'certificates' as const,
              label: `٦. شهادات النسب والعضوية (${issuedCertificates.length})`,
              sub: 'A4 Certificate & VIP ID',
              icon: Award,
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

            {/* 4 Hero Quick Navigation Cards Toggle & Editor */}
            <div className="pt-4 border-t border-[#E6E2D8] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-extrabold text-[#0F291E]">
                  البطاقات الأربع المختصرة في البانر الرئيسي (4 Hero Quick Cards):
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={siteConfig.heroSection.showQuickCards !== false}
                    onChange={(e) =>
                      onUpdateSiteConfig({
                        ...siteConfig,
                        heroSection: {
                          ...siteConfig.heroSection,
                          showQuickCards: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 accent-[#0F291E]"
                  />
                  <span className="text-xs font-extrabold text-[#0F291E]">
                    إظهار البطاقات الأربع المختصرة في البانر الرئيسي
                  </span>
                </label>
              </div>

              {siteConfig.heroSection.showQuickCards !== false && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(
                    siteConfig.heroSection.quickCards ||
                    DEFAULT_SITE_CONFIG.heroSection.quickCards ||
                    []
                  ).map((card, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] space-y-2"
                    >
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-600 mb-0.5">
                          الشارة العلوية للبطاقة ({idx + 1}):
                        </label>
                        <input
                          type="text"
                          value={card.kicker}
                          onChange={(e) => {
                            const baseCards = [
                              ...(siteConfig.heroSection.quickCards ||
                                DEFAULT_SITE_CONFIG.heroSection.quickCards ||
                                []),
                            ];
                            baseCards[idx] = { ...baseCards[idx], kicker: e.target.value };
                            onUpdateSiteConfig({
                              ...siteConfig,
                              heroSection: { ...siteConfig.heroSection, quickCards: baseCards },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white border border-[#E6E2D8]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-600 mb-0.5">
                          عنوان البطاقة:
                        </label>
                        <input
                          type="text"
                          value={card.title}
                          onChange={(e) => {
                            const baseCards = [
                              ...(siteConfig.heroSection.quickCards ||
                                DEFAULT_SITE_CONFIG.heroSection.quickCards ||
                                []),
                            ];
                            baseCards[idx] = { ...baseCards[idx], title: e.target.value };
                            onUpdateSiteConfig({
                              ...siteConfig,
                              heroSection: { ...siteConfig.heroSection, quickCards: baseCards },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg bg-white border border-[#E6E2D8]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-600 mb-0.5">
                          الوصف المختصر:
                        </label>
                        <input
                          type="text"
                          value={card.description}
                          onChange={(e) => {
                            const baseCards = [
                              ...(siteConfig.heroSection.quickCards ||
                                DEFAULT_SITE_CONFIG.heroSection.quickCards ||
                                []),
                            ];
                            baseCards[idx] = { ...baseCards[idx], description: e.target.value };
                            onUpdateSiteConfig({
                              ...siteConfig,
                              heroSection: { ...siteConfig.heroSection, quickCards: baseCards },
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white border border-[#E6E2D8]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
          MODULE 4: BLOGGER-STYLE POSTS & ARTICLES CMS (MULTI-SECTION SUPPORT)
      ==================================================================== */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Post Editor Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between gap-2 pb-4 mb-6 border-b border-[#E6E2D8]">
              <div>
                <div className="text-xs font-bold text-[#695022]">
                  {editingArticleId ? 'تعديل مقال قائم في الديوان (مع حفظ كافة الأقسام)' : 'إضافة مقال أو دراسة جديدة'}
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
                      sections: [{ heading: 'المتن التوثيقي والتاريخي', body: '' }],
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

              {/* Multi-Section Editor (Fixes BUG-006 Data Loss) */}
              <div className="space-y-4 pt-2 border-t border-[#E6E2D8]">
                <div className="flex items-center justify-between gap-2">
                  <label className="block text-xs font-extrabold text-[#0F291E]">
                    أقسام وفصول الدراسة الوثائقية ({postForm.sections.length}):
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setPostForm((prev) => ({
                        ...prev,
                        sections: [
                          ...prev.sections,
                          { heading: `القسم ${prev.sections.length + 1}`, body: '' },
                        ],
                      }))
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#F7F6F2] border border-[#E6E2D8] hover:border-[#695022] text-xs font-bold text-[#0F291E] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#695022]" />
                    <span>إضافة قسم جديد للمقال</span>
                  </button>
                </div>

                {postForm.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-[#695022]">
                        القسم #{idx + 1}
                      </span>
                      {postForm.sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setPostForm((prev) => ({
                              ...prev,
                              sections: prev.sections.filter((_, i) => i !== idx),
                            }))
                          }
                          className="text-xs font-bold text-red-700 hover:underline cursor-pointer"
                        >
                          حذف هذا القسم
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={section.heading}
                      onChange={(e) => {
                        const updated = [...postForm.sections];
                        updated[idx] = { ...updated[idx], heading: e.target.value };
                        setPostForm({ ...postForm, sections: updated });
                      }}
                      placeholder="عنوان القسم الفرعي..."
                      className="w-full px-3.5 py-2 text-xs font-bold rounded-lg bg-white border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#0F291E]"
                    />
                    <textarea
                      rows={4}
                      value={section.body}
                      onChange={(e) => {
                        const updated = [...postForm.sections];
                        updated[idx] = { ...updated[idx], body: e.target.value };
                        setPostForm({ ...postForm, sections: updated });
                      }}
                      placeholder="النص التاريخي أو الوثائقي لهذا القسم..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-white border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#0F291E] leading-relaxed"
                    />
                  </div>
                ))}
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
                  <div className="text-[11px] font-mono text-zinc-500" dir="ltr">
                    /diwan/{art.slug || art.id} ({art.sections?.length || 1} أقسام)
                  </div>
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
          MODULE 5: CERTIFICATE & VIP ID STUDIO (WITH ANTI-COLLISION IDENTITY)
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

              {/* Anti-Collision Identity Verification Fields (Name Similarity Disambiguation) */}
              <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#C5A059]/40 space-y-3">
                <div className="text-xs font-extrabold text-[#0F291E]">
                  بيانات منع تشابه الأسماء وتوثيق الهوية الفردية (Anti-Collision Identity Fields):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#141413] mb-1">
                      كود العضوية العائلي (Member Ref ID):
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={certForm.memberReferenceId}
                      onChange={(e) =>
                        setCertForm({ ...certForm, memberReferenceId: e.target.value })
                      }
                      placeholder="ELS-ID-EG-1990-001"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-white border border-[#E6E2D8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#141413] mb-1">
                      الجد الجامع / البيت الفرعي:
                    </label>
                    <input
                      type="text"
                      value={certForm.ancestralRoot}
                      onChange={(e) => setCertForm({ ...certForm, ancestralRoot: e.target.value })}
                      placeholder="فرع الحاج علي الصعيدي"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#E6E2D8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#141413] mb-1">
                      محل الإقامة الحالي / المركز:
                    </label>
                    <input
                      type="text"
                      value={certForm.currentResidence}
                      onChange={(e) =>
                        setCertForm({ ...certForm, currentResidence: e.target.value })
                      }
                      placeholder="طنطا - محافظة الغربية"
                      className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#E6E2D8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#141413] mb-1">
                    الصورة الشخصية الرسمية لصاحب الوثيقة (اختياري — لمنع تطابق الأسماء):
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      dir="ltr"
                      value={certForm.personalPhotoUrl}
                      onChange={(e) =>
                        setCertForm({ ...certForm, personalPhotoUrl: e.target.value })
                      }
                      placeholder="https://... أو ارفع صورة شخصية"
                      className="flex-1 min-w-[180px] px-3 py-1.5 text-xs font-mono rounded-lg bg-white border border-[#E6E2D8]"
                    />
                    <label className="px-3 py-1.5 rounded-lg bg-[#0F291E] text-white text-xs font-bold hover:bg-[#141E28] flex items-center gap-1.5 cursor-pointer">
                      <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>
                        {uploadingAssetKey === 'cert-photo' ? 'جاري الرفع...' : 'رفع صورة شخصية'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            uploadAssetFile(file, 'cert-photo', (url) =>
                              setCertForm((prev) => ({ ...prev, personalPhotoUrl: url }))
                            );
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    {certForm.personalPhotoUrl && (
                      <button
                        type="button"
                        onClick={() => setCertForm({ ...certForm, personalPhotoUrl: '' })}
                        className="text-xs font-bold text-red-700 hover:underline cursor-pointer"
                      >
                        مسح الصورة
                      </button>
                    )}
                  </div>
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
                    <span>طباعة / تصدير PDF (صفحة A4 مستقلة)</span>
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

              <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                {issuedCertificates.map((c) => (
                  <div
                    key={c.serialNumber}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                      c.archived
                        ? 'bg-zinc-100 border-zinc-300 opacity-75'
                        : 'bg-[#F7F6F2] border-[#E6E2D8]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-mono text-xs font-extrabold text-[#0F291E] flex flex-wrap items-center gap-1.5">
                        <span>{c.serialNumber}</span>
                        <span className="px-2 py-0.5 rounded bg-[#0F291E]/10 text-[10px] font-sans font-bold text-[#0F291E]">
                          آل {c.familyTitle || 'الصعيدي'}
                        </span>
                        {c.archived && (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-[10px] font-sans font-bold text-amber-900">
                            مؤرشف
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-bold text-[#141413] truncate">{c.arabicName}</div>
                      <div className="text-[10px] font-mono text-[#695022] truncate" dir="ltr">
                        {c.memberReferenceId ? `${c.memberReferenceId} · ` : ''}
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
                            personalPhotoUrl: c.personalPhotoUrl || '',
                            memberReferenceId: c.memberReferenceId || '',
                            ancestralRoot: c.ancestralRoot || '',
                            currentResidence: c.currentResidence || '',
                          })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E6E2D8] text-xs font-bold text-[#0F291E] cursor-pointer"
                      >
                        عرض
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleArchiveCertificate(c.serialNumber)}
                        title={c.archived ? 'إلغاء الأرشفة' : 'أرشفة السجل بدلاً من الحذف'}
                        className="px-2 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-900 cursor-pointer"
                      >
                        {c.archived ? 'استعادة' : 'أرشفة'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCertificate(c.serialNumber)}
                        title="حذف السجل"
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
          <div className="print-certificate-wrapper bg-white rounded-2xl border border-[#E6E2D8] p-4 sm:p-8 shadow-sm">
            <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-[#695022]">
                معاينة حية للوثيقة الجاهزة للطباعة كصفحة A4 مستقلة (الرابط داخل رمز QR:{' '}
                <span className="font-mono text-[#0F291E]" dir="ltr">
                  https://elsaidy.org/verify/{certForm.serialNumber}
                </span>
                ):
              </span>
            </div>
            <Suspense
              fallback={
                <div className="p-8 text-center text-xs font-bold text-[#0F291E] bg-[#F7F6F2] rounded-xl border border-[#E6E2D8]">
                  جاري تجهيز معاينة الشهادة...
                </div>
              }
            >
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
                  personalPhotoUrl: certForm.personalPhotoUrl || undefined,
                  memberReferenceId: certForm.memberReferenceId || undefined,
                  ancestralRoot: certForm.ancestralRoot || undefined,
                  currentResidence: certForm.currentResidence || undefined,
                }}
                familyTitle={certForm.familyTitle || 'الصعيدي'}
                includeFamilyTreeStamp={certForm.includeFamilyTreeStamp}
                customLogoUrl={siteConfig.branding.logoUrl}
                customSealImageUrl={siteConfig.branding.sealImageUrl}
                customTreeImageUrl={siteConfig.familyTreeConfig.treeImageUrl}
                siteTitle={siteConfig.branding.siteTitle}
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 1: DYNAMIC INTERACTIVE TREE BUILDER, SEO NAMES, COUNTER & GITHUB SYNC
      ==================================================================== */}
      {activeTab === 'github' && (
        <div className="space-y-8">
          {/* FULL INTERACTIVE DYNAMIC FAMILY TREE BUILDER */}
          <div className="bg-white rounded-2xl border-2 border-[#695022] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-[#E6E2D8] pb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-[#695022]">
                  INTERACTIVE HIERARCHICAL FAMILY TREE BUILDER · ({treeNodes.length} عضو وعَلَم مسجل)
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#141413] mt-0.5">
                  إدارة وبناء الشجرة التفاعلية (Dynamic Tree Nodes)
                </h2>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  أضف أو عدّل أفراد وأعلام العائلة، واختر الأب أو الجد الأعلى المباشر (<span className="font-mono font-bold text-[#0F291E]">parentId</span>) من القائمة ليتم رسمهم وتوليد تفرعاتهم تلقائياً في المخطط التفاعلي بصفحة الشجرة (<span className="font-mono font-bold text-[#0F291E]">/tree</span>) ومزامنتهم مع GitHub (<span className="font-mono font-bold text-[#0F291E]">cms-db.json</span>).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSyncToGitHub}
                  disabled={isSyncingGitHub}
                  className="px-4 py-2 rounded-xl bg-[#0F291E] text-white text-xs font-extrabold hover:bg-[#141E28] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <CloudUpload className="w-4 h-4 text-[#D4AF37]" />
                  <span>{isSyncingGitHub ? 'جاري المزامنة...' : 'حفظ ومزامنة الشجرة مع GitHub'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateTreeNodes) {
                      onUpdateTreeNodes(DEFAULT_FAMILY_TREE_NODES);
                    }
                    setEditingTreeNodeId(null);
                    setStatusBanner({
                      type: 'info',
                      message: 'تمت استعادة الهيكلة الافتراضية المعتمدة لشجرة عائلة الصعيدي.',
                    });
                  }}
                  className="px-3 py-2 rounded-xl border border-[#E6E2D8] text-xs font-bold text-zinc-700 hover:border-[#695022] flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>استعادة الشجرة الافتراضية</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Add / Edit Member Node Form */}
              <form
                onSubmit={handleSaveTreeNode}
                className="lg:col-span-5 bg-[#F7F6F2] rounded-xl border border-[#E6E2D8] p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#E6E2D8] pb-3">
                  <span className="text-sm font-extrabold text-[#0F291E]">
                    {editingTreeNodeId
                      ? 'تعديل بيانات العضو / العلم في الشجرة'
                      : 'إضافة عضو أو فرع جديد إلى الشجرة التفاعلية'}
                  </span>
                  {editingTreeNodeId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTreeNodeId(null);
                        setTreeNodeForm({
                          name: '',
                          title: '',
                          parentId: 'node-ahmed-ali-eg',
                          branchName: 'فرع مصر (الغربية وطنطا والصعيد والقاهرة)',
                          generation: 'الجيل السابع المعاصر',
                          serialNumber: '',
                          location: 'محافظة الغربية — مدينة طنطا / القاهرة',
                        });
                      }}
                      className="text-xs font-bold text-red-700 hover:underline cursor-pointer"
                    >
                      إلغاء التعديل
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1">
                    الاسم الكامل للعضو أو العلم (Name):
                  </label>
                  <input
                    type="text"
                    required
                    value={treeNodeForm.name}
                    onChange={(e) => setTreeNodeForm({ ...treeNodeForm, name: e.target.value })}
                    placeholder="مثال: محمد علي أحمد الصعيدي"
                    className="w-full px-3.5 py-2.5 text-sm font-bold rounded-xl bg-white border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#0F291E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1">
                    الأب / الجد الأعلى المباشر في الشجرة (Parent Node):
                  </label>
                  <select
                    value={treeNodeForm.parentId}
                    onChange={(e) => setTreeNodeForm({ ...treeNodeForm, parentId: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl bg-white border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#0F291E]"
                  >
                    <option value="ROOT">جذر رئيسي أعلى (بدون أب مباشر — Root Node)</option>
                    {treeNodes
                      .filter((n) => n.id !== editingTreeNodeId)
                      .map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.name} — ({n.branchName} · {n.generation})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#141413] mb-1">
                      الفرع العائلي (Branch):
                    </label>
                    <input
                      type="text"
                      list="elsaidy-branches-list"
                      value={treeNodeForm.branchName}
                      onChange={(e) =>
                        setTreeNodeForm({ ...treeNodeForm, branchName: e.target.value })
                      }
                      placeholder="فرع مصر (الغربية وطنطا والصعيد والقاهرة)"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6E2D8]"
                    />
                    <datalist id="elsaidy-branches-list">
                      <option value="العمود الجامع — قبيلة جهينة (ينبع النخل)" />
                      <option value="فرع مصر (الغربية وطنطا والصعيد والقاهرة)" />
                      <option value="١. فرع عبد الله (تيماء)" />
                      <option value="٢. فرع سلامة (الشام)" />
                      <option value="٣. فرع صالح (حائل والرياض والخليج)" />
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#141413] mb-1">
                      الجيل / الطبقة (Generation):
                    </label>
                    <input
                      type="text"
                      list="elsaidy-generations-list"
                      value={treeNodeForm.generation}
                      onChange={(e) =>
                        setTreeNodeForm({ ...treeNodeForm, generation: e.target.value })
                      }
                      placeholder="الجيل السابع المعاصر"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6E2D8]"
                    />
                    <datalist id="elsaidy-generations-list">
                      <option value="الجد السابع الجامع" />
                      <option value="الجيل الثاني" />
                      <option value="الجيل الثالث" />
                      <option value="الجيل الرابع" />
                      <option value="الجيل الخامس" />
                      <option value="الجيل السادس" />
                      <option value="الجيل السابع المعاصر" />
                      <option value="الجيل الثامن المعاصر" />
                    </datalist>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1">
                    الصفة أو اللقب أو النبذة التوثيقية (Title):
                  </label>
                  <input
                    type="text"
                    value={treeNodeForm.title}
                    onChange={(e) => setTreeNodeForm({ ...treeNodeForm, title: e.target.value })}
                    placeholder="مثال: من أعلام وأبناء عائلة الصعيدي في الغربية وطنطا"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-white border border-[#E6E2D8]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#141413] mb-1">
                      الموقع الجغرافي / الحاضرة (Location):
                    </label>
                    <input
                      type="text"
                      value={treeNodeForm.location}
                      onChange={(e) =>
                        setTreeNodeForm({ ...treeNodeForm, location: e.target.value })
                      }
                      placeholder="محافظة الغربية (طنطا) / القاهرة"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6E2D8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#141413] mb-1">
                      رقم شهادة النسب (اختياري):
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      list="elsaidy-certs-serial-list"
                      value={treeNodeForm.serialNumber}
                      onChange={(e) =>
                        setTreeNodeForm({ ...treeNodeForm, serialNumber: e.target.value })
                      }
                      placeholder="ELS-2026-EG-002"
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-white border border-[#E6E2D8]"
                    />
                    <datalist id="elsaidy-certs-serial-list">
                      {issuedCertificates.map((c) => (
                        <option key={c.serialNumber} value={c.serialNumber}>
                          {c.arabicName}
                        </option>
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#0F291E] text-white text-xs font-extrabold hover:bg-[#141E28] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-[#D4AF37]" />
                    <span>
                      {editingTreeNodeId
                        ? 'حفظ تعديلات العضو في الشجرة'
                        : 'إضافة العضو وربطه بالشجرة التفاعلية'}
                    </span>
                  </button>
                </div>
              </form>

              {/* Existing Tree Nodes Directory & Hierarchy Table */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-extrabold text-[#141413]">
                      قائمة الأعضاء والأعلام في الشجرة التفاعلية ({treeNodes.length})
                    </h3>
                    <p className="text-xs text-zinc-500">
                      انقر على «تعديل» لتغيير الأب المباشر أو الفرع، أو «إضافة ابن» لتفريع ذرية جديدة تحت أي علم.
                    </p>
                  </div>

                  <input
                    type="text"
                    value={treeNodeSearch}
                    onChange={(e) => setTreeNodeSearch(e.target.value)}
                    placeholder="ابحث في أعضاء الشجرة..."
                    className="w-full sm:w-64 px-3.5 py-2 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] outline-none focus:border-[#695022]"
                  />
                </div>

                <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                  {treeNodes
                    .filter((node) => {
                      const q = treeNodeSearch.trim().toLowerCase();
                      if (!q) return true;
                      return (
                        node.name.toLowerCase().includes(q) ||
                        node.branchName.toLowerCase().includes(q) ||
                        node.location.toLowerCase().includes(q) ||
                        (node.serialNumber || '').toLowerCase().includes(q)
                      );
                    })
                    .map((node) => {
                      const parentNode = treeNodes.find((p) => p.id === node.parentId);
                      const childrenCount = treeNodes.filter((c) => c.parentId === node.id).length;
                      return (
                        <div
                          key={node.id}
                          className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] hover:border-[#695022] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-extrabold text-[#141413]">
                                {node.name}
                              </span>
                              <span className="text-[11px] font-bold text-[#695022]">
                                · {node.generation}
                              </span>
                              {node.serialNumber && (
                                <span
                                  dir="ltr"
                                  className="font-mono text-[10px] font-bold text-[#0F291E] bg-white px-2 py-0.5 rounded border border-[#E6E2D8]"
                                >
                                  {node.serialNumber}
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-zinc-600 truncate">{node.title}</div>

                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
                              <span>
                                <strong className="text-[#0F291E]">الأب / الجد:</strong>{' '}
                                {parentNode ? parentNode.name : 'جذر رئيسي أعلى (Root)'}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>
                                <strong className="text-[#695022]">الفرع:</strong> {node.branchName}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>
                                <strong className="text-[#141413]">الأبناء المسجلون:</strong>{' '}
                                {childrenCount}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingTreeNodeId(null);
                                setTreeNodeForm({
                                  name: '',
                                  title: '',
                                  parentId: node.id,
                                  branchName: node.branchName,
                                  generation: 'الجيل التالي',
                                  serialNumber: '',
                                  location: node.location,
                                });
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-[#0F291E] text-white text-[11px] font-bold hover:bg-[#141E28] cursor-pointer flex items-center gap-1"
                              title="إضافة ابن مباشر لهذا العلم"
                            >
                              <Plus className="w-3 h-3 text-[#D4AF37]" />
                              <span>إضافة ابن</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleEditTreeNodeClick(node)}
                              className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E6E2D8] text-xs font-bold text-[#0F291E] hover:border-[#695022] cursor-pointer flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>تعديل</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteTreeNode(node.id)}
                              className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 cursor-pointer"
                              title="حذف العضو"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

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

            {/* Encyclopedia Branch Submissions Approval Queue */}
            <div className="bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-8 shadow-sm space-y-4">
              <div className="border-b border-[#E6E2D8] pb-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#695022]">
                    ENCYCLOPEDIA BRANCH SUBMISSIONS ({branchSubmissions.length})
                  </div>
                  <h3 className="text-lg font-extrabold text-[#141413]">
                    طلبات تسجيل فروع وقرى العائلة في الموسوعة الشاملة
                  </h3>
                </div>
              </div>

              {branchSubmissions.length === 0 ? (
                <p className="text-xs text-zinc-500 leading-relaxed">
                  لا توجد طلبات تسجيل فروع جديدة قيد المراجعة حالياً. عندما يقوم أي زائر بتعبئة نموذج
                  «سجّل فرع عائلتك في الموسوعة» في صفحة الشجرة أو التاريخ، ستظهر بياناته هنا لمراجعتها
                  واعتمادها بضغطة زر.
                </p>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {branchSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] space-y-2 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-extrabold text-[#0F291E] text-sm">
                          {sub.branchOrHouseName} — {sub.centerOrVillage}
                        </span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded ${
                            sub.status === 'approved'
                              ? 'bg-[#0F291E]/10 text-[#0F291E]'
                              : 'bg-[#695022]/15 text-[#695022]'
                          }`}
                        >
                          {sub.status === 'approved' ? 'معتمد في الموسوعة' : 'قيد المراجعة'}
                        </span>
                      </div>
                      <div className="text-zinc-700">
                        <strong>المحافظة / الدولة:</strong> {sub.countryOrGovernorate} ·{' '}
                        <strong>مقدم الطلب:</strong> {sub.fullName}
                      </div>
                      {sub.ancestorOrParentName && (
                        <div className="text-zinc-600">
                          <strong>الجد الأعلى المذكور:</strong> {sub.ancestorOrParentName}
                        </div>
                      )}
                      {sub.historicalNotes && (
                        <p className="text-zinc-600 leading-relaxed bg-white p-2.5 rounded-lg border border-[#E6E2D8]">
                          {sub.historicalNotes}
                        </p>
                      )}
                      <div className="flex items-center justify-end gap-2 pt-1">
                        {sub.status !== 'approved' && (
                          <button
                            type="button"
                            onClick={() => handleApproveBranchSubmission(sub)}
                            className="px-3 py-1.5 rounded-lg bg-[#0F291E] text-white font-bold hover:bg-[#141E28] cursor-pointer"
                          >
                            اعتماد وإدراج في الموسوعة والشجرة
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteBranchSubmission(sub.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 font-bold hover:bg-red-100 cursor-pointer"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Visitor Counter & Live Online Telemetry Control */}
            <div className="bg-white rounded-2xl border border-[#E6E2D8] p-6 sm:p-8 shadow-sm space-y-4">
              <div className="border-b border-[#E6E2D8] pb-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#695022]">
                    PORTAL TELEMETRY & LIVE ONLINE COUNTER
                  </div>
                  <h3 className="text-lg font-extrabold text-[#141413]">
                    إدارة عداد زيارات البوابة الوثائقية ومؤشر المتصلين الآن
                  </h3>
                </div>
                <Users className="w-5 h-5 text-[#0F291E]" />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#141413]">
                  الرقم الأساسي لإجمالي الزيارات (Base Visitor Count):
                </label>
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
                        appendLog('تحديث عداد الزيارات الأساسي', String(parsed));
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#E6E2D8]">
                <div>
                  <label className="block text-[11px] font-bold text-[#141413] mb-1">
                    الزيادة لكل زيارة جديدة (+N):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    dir="ltr"
                    value={siteConfig.telemetryConfig?.incrementPerVisit ?? 2}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value, 10) || 2);
                      onUpdateSiteConfig({
                        ...siteConfig,
                        telemetryConfig: {
                          ...(siteConfig.telemetryConfig || DEFAULT_SITE_CONFIG.telemetryConfig!),
                          incrementPerVisit: val,
                        },
                      });
                    }}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#141413] mb-1">
                    الحد الأدنى للمتصلين حالياً:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    dir="ltr"
                    value={siteConfig.telemetryConfig?.onlineUsersMin ?? 5}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value, 10) || 5);
                      onUpdateSiteConfig({
                        ...siteConfig,
                        telemetryConfig: {
                          ...(siteConfig.telemetryConfig || DEFAULT_SITE_CONFIG.telemetryConfig!),
                          onlineUsersMin: val,
                        },
                      });
                    }}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#141413] mb-1">
                    الحد الأعلى للمتصلين حالياً:
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={1000}
                    dir="ltr"
                    value={siteConfig.telemetryConfig?.onlineUsersMax ?? 24}
                    onChange={(e) => {
                      const val = Math.max(2, parseInt(e.target.value, 10) || 24);
                      onUpdateSiteConfig({
                        ...siteConfig,
                        telemetryConfig: {
                          ...(siteConfig.telemetryConfig || DEFAULT_SITE_CONFIG.telemetryConfig!),
                          onlineUsersMax: val,
                        },
                      });
                    }}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Server-Side / In-Memory GitHub Sync + JSON Import/Export + Audit Log */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-8 shadow-sm space-y-5">
              <div className="border-b border-[#E6E2D8] pb-4">
                <div className="text-xs font-bold text-[#695022]">
                  CLOUDFLARE PAGES FUNCTION & GITHUB API SYNC
                </div>
                <h2 className="text-xl font-extrabold text-[#141413] mt-0.5">
                  المزامنة السحابية المباشرة والنسخ الاحتياطي (cms-db.json)
                </h2>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  يدعم النظام المزامنة الآمنة عبر نقطة النهاية الخلفية{' '}
                  <span className="font-mono font-bold text-[#0F291E]">/api/cms-sync</span> على
                  Cloudflare Pages، أو عبر إدخال رمز GitHub PAT مؤقتاً في ذاكرة الجلسة (لا يُحفظ
                  أبداً في المتصفح أو localStorage)، بالإضافة إلى التصدير والاستيراد المباشر لملف{' '}
                  <span className="font-mono font-bold text-[#0F291E]">cms-db.json</span>.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1">
                    رمز GitHub PAT المؤقت في الذاكرة فقط (اختياري في حال عدم تفعيل متغير الخادم):
                  </label>
                  <input
                    type="password"
                    dir="ltr"
                    autoComplete="off"
                    value={githubConfig.token}
                    onChange={(e) => setGithubConfig({ ...githubConfig, token: e.target.value })}
                    placeholder="ghp_... (يبقى في ذاكرة RAM فقط ويُمسح فور إغلاق الصفحة)"
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
                    className="px-5 py-3 rounded-xl bg-[#0F291E] text-white text-xs font-extrabold hover:bg-[#141E28] transition-colors flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-4 h-4 text-[#D4AF37] ${isSyncingGitHub ? 'animate-spin' : ''}`}
                    />
                    <span>
                      {isSyncingGitHub
                        ? 'جاري المزامنة السحابية...'
                        : 'مزامنة ونشر التحديثات إلى GitHub'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveGitHubConfig}
                    className="px-4 py-3 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-xs font-bold text-[#141413] hover:border-[#695022] cursor-pointer"
                  >
                    حفظ اسم المستودع والفرع
                  </button>
                </div>

                {/* JSON Backup Export & Import */}
                <div className="pt-4 border-t border-[#E6E2D8] flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadJsonBackup}
                    className="px-4 py-2.5 rounded-xl bg-white border border-[#E6E2D8] text-xs font-bold text-[#695022] hover:border-[#695022] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تصدير قاعدة البيانات (cms-db.json)</span>
                  </button>

                  <label className="px-4 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] hover:border-[#0F291E] text-xs font-bold text-[#0F291E] flex items-center gap-1.5 cursor-pointer">
                    <FileText className="w-3.5 h-3.5 text-[#695022]" />
                    <span>استيراد ملف قاعدة بيانات (JSON)</span>
                    <input
                      type="file"
                      accept="application/json,.json"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImportJsonBackup(file);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Audit ChangeLog Viewer */}
            <div className="bg-white rounded-2xl border border-[#E6E2D8] p-6 sm:p-8 shadow-sm space-y-4">
              <div className="border-b border-[#E6E2D8] pb-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#695022]">
                    ADMIN AUDIT LOG ({changeLog.length})
                  </div>
                  <h3 className="text-lg font-extrabold text-[#141413]">
                    سجل العمليات والتعديلات الإدارية (Audit Trail)
                  </h3>
                </div>
              </div>

              {changeLog.length === 0 ? (
                <p className="text-xs text-zinc-500">
                  لم يتم تسجيل عمليات تعديل جديدة في هذه الجلسة بعد.
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {changeLog.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] flex items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-extrabold text-[#0F291E]">{entry.action}: </span>
                        <span className="font-semibold text-[#141413]">{entry.details}</span>
                      </div>
                      <span className="font-mono text-[10px] text-zinc-500 shrink-0" dir="ltr">
                        {entry.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCmsPage;

