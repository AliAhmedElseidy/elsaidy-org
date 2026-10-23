/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import {
  GEOGRAPHICAL_PRESENCE,
  DIWAN_ARTICLES,
  DEFAULT_VERIFIED_CERTIFICATES,
  DEFAULT_SITE_CONFIG,
  DEFAULT_FAMILY_TREE_NODES,
  PageRoute,
  WhiteLabeledPortal,
  DiwanArticle,
  IssuedCertificateRecord,
  SiteConfig,
  FamilyTreeNode,
} from './data/familyData';
import { HomePage } from './pages/HomePage';
import { SEOManager } from './components/SEOManager';

const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const FamilyTreePage = lazy(() =>
  import('./pages/FamilyTreePage').then((m) => ({ default: m.FamilyTreePage }))
);
const VerifyPage = lazy(() =>
  import('./pages/VerifyPage').then((m) => ({ default: m.VerifyPage }))
);
const BlogPage = lazy(() =>
  import('./pages/BlogPage').then((m) => ({ default: m.BlogPage }))
);
const ProjectsPage = lazy(() =>
  import('./pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage }))
);
const AdminCmsPage = lazy(() =>
  import('./pages/AdminCmsPage').then((m) => ({ default: m.AdminCmsPage }))
);
import {
  ArrowUpLeft,
  ArrowUp,
  Lock,
  X,
  Share2,
  Check,
  Mail,
  Users,
  Globe2,
  ShieldCheck,
  Activity,
  Home,
  BookOpen,
  GitBranch,
  Award,
  FileText,
  Building2,
  Megaphone,
  ChevronLeft,
} from 'lucide-react';

const VISITOR_STORAGE_KEY = 'elsaidy_official_portal_visits_v3';
const CMS_ARTICLES_STORAGE_KEY = 'elsaidy_cms_articles_v1';
const CMS_CERTS_STORAGE_KEY = 'elsaidy_cms_certificates_v1';
const CMS_NAMES_STORAGE_KEY = 'elsaidy_cms_custom_names_v1';
const CMS_TREE_NODES_STORAGE_KEY = 'elsaidy_cms_tree_nodes_v1';
const CMS_SITE_CONFIG_STORAGE_KEY = 'elsaidy_cms_site_config_v1';
const CMS_LAST_UPDATED_STORAGE_KEY = 'elsaidy_cms_last_updated_v1';

const DEFAULT_CUSTOM_NAMES = [
  'علي أحمد علي الصعيدي (Ali Ahmed Ali Elsaidy)',
  'مرسي الحجاج / مرسي حجاج الصعيدي (Morsi Hagag / Elsaidy)',
  'حجاج الصعيدي (Hagag Elsaidy)',
  'حجازي الصعيدي (Hijazi Elsaidy)',
  'أحمد حجازي الصعيدي (Ahmed Hijazi Elsaidy)',
  'محمد حجاج الصعيدي (Mohamed Hagag Elsaidy)',
  'إبراهيم الصعيدي الحجازي (Ibrahim Elsaidy Al-Hijazi)',
  'عبد الله الصعيدي (Abdullah Elsaidy)',
  'محمود الصعيدي (Mahmoud Elsaidy)',
  'مصطفى الصعيدي (Mostafa Elsaidy)',
];

function getInitialRoute(): PageRoute {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path === '/about') return 'about';
  if (path === '/tree') return 'tree';
  if (path === '/verify' || path.startsWith('/verify/')) return 'verify';
  if (path === '/diwan' || path.startsWith('/diwan/') || path === '/blog') return 'diwan';
  if (path === '/portals' || path === '/projects') return 'portals';
  if (path === '/admin-elsaidy') return 'admin-elsaidy';
  return 'home';
}

const RoyalPageSkeleton: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    className="py-12 lg:py-20 space-y-6 animate-pulse"
  >
    <div className="bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-10 shadow-sm space-y-4">
      <div className="h-4 w-48 bg-[#E6E2D8] rounded" />
      <div className="h-8 w-3/4 bg-[#0F291E]/15 rounded-lg" />
      <div className="h-4 w-full bg-[#F7F6F2] rounded" />
      <div className="h-4 w-2/3 bg-[#F7F6F2] rounded" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-48 bg-white rounded-2xl border border-[#E6E2D8]" />
      <div className="h-48 bg-white rounded-2xl border border-[#E6E2D8]" />
      <div className="h-48 bg-white rounded-2xl border border-[#E6E2D8]" />
    </div>
  </div>
);

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(getInitialRoute);
  const [activeBranchId, setActiveBranchId] = useState<string>(GEOGRAPHICAL_PRESENCE[0].id);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [inspectedPortal, setInspectedPortal] = useState<WhiteLabeledPortal | null>(null);
  const [activeArticleModal, setActiveArticleModal] = useState<DiwanArticle | null>(null);
  const [isCorporateModalOpen, setIsCorporateModalOpen] = useState<boolean>(false);
  const [shareToastMessage, setShareToastMessage] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Portal Visit Counter & Archive Telemetry State
  const [totalVisits, setTotalVisits] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(VISITOR_STORAGE_KEY);
      const parsed = saved ? parseInt(saved, 10) : 148923;
      return !isNaN(parsed) && parsed >= 148923 ? parsed : 148923;
    } catch {
      return 148923;
    }
  });
  const [isCounterPulsing, setIsCounterPulsing] = useState<boolean>(false);

  // Secret 5-click trigger counter for Footer copyright seal
  const secretClickCountRef = useRef<number>(0);

  // Global Site Customizer Configuration State
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(CMS_SITE_CONFIG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            branding: { ...DEFAULT_SITE_CONFIG.branding, ...(parsed.branding || {}) },
            announcementBar: {
              ...DEFAULT_SITE_CONFIG.announcementBar,
              ...(parsed.announcementBar || {}),
            },
            heroSection: { ...DEFAULT_SITE_CONFIG.heroSection, ...(parsed.heroSection || {}) },
            familyTreeConfig: {
              ...DEFAULT_SITE_CONFIG.familyTreeConfig,
              ...(parsed.familyTreeConfig || {}),
            },
            digitalPortals:
              Array.isArray(parsed.digitalPortals) && parsed.digitalPortals.length > 0
                ? parsed.digitalPortals
                : DEFAULT_SITE_CONFIG.digitalPortals,
            contactAndFooter: {
              ...DEFAULT_SITE_CONFIG.contactAndFooter,
              ...(parsed.contactAndFooter || {}),
            },
          };
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_SITE_CONFIG;
  });

  // Shared CMS State (Articles, Certificates, Custom SEO Names, Dynamic Family Tree Nodes)
  const [cmsArticles, setCmsArticles] = useState<DiwanArticle[]>(() => {
    try {
      const saved = localStorage.getItem(CMS_ARTICLES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DIWAN_ARTICLES;
  });

  const [cmsCertificates, setCmsCertificates] = useState<IssuedCertificateRecord[]>(() => {
    try {
      const saved = localStorage.getItem(CMS_CERTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_VERIFIED_CERTIFICATES;
  });

  const [cmsCustomNames, setCmsCustomNames] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(CMS_NAMES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_CUSTOM_NAMES;
  });

  const [cmsTreeNodes, setCmsTreeNodes] = useState<FamilyTreeNode[]>(() => {
    try {
      const saved = localStorage.getItem(CMS_TREE_NODES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_FAMILY_TREE_NODES;
  });

  // Corporate & Official Email Request Form State
  const [inquiryForm, setInquiryForm] = useState({
    fullName: '',
    countryRegion: 'جمهورية مصر العربية',
    requestType: 'official-email',
    preferredEmailPrefix: '',
    contactInfo: '',
    details: '',
  });
  const [inquiryStatus, setInquiryStatus] = useState<string>('');

  const recordPortalVisit = () => {
    setTotalVisits((prev) => {
      const next = Math.max(148923, prev) + 1;
      try {
        localStorage.setItem(VISITOR_STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
    setIsCounterPulsing(true);
    setTimeout(() => setIsCounterPulsing(false), 700);
  };

  // Dynamically update <link rel="icon"> when siteConfig.branding.faviconUrl changes
  useEffect(() => {
    if (!siteConfig.branding.faviconUrl) return;
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = siteConfig.branding.faviconUrl;
  }, [siteConfig.branding.faviconUrl]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global Escape key listener for all modals (A11Y-002, A11Y-004)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isCorporateModalOpen) setIsCorporateModalOpen(false);
        if (inspectedPortal) setInspectedPortal(null);
        if (activeArticleModal) setActiveArticleModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCorporateModalOpen, inspectedPortal, activeArticleModal]);

  // Scroll listener for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 320);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync remote /data/cms-db.json with timestamp comparison (Fixes BUG-001 stale cache)
  useEffect(() => {
    recordPortalVisit();

    fetch('/data/cms-db.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : null))
      .then((db) => {
        if (!db || typeof db !== 'object') return;

        const remoteTimestamp = typeof db.lastUpdated === 'string' ? db.lastUpdated : '';
        const localTimestamp = localStorage.getItem(CMS_LAST_UPDATED_STORAGE_KEY) || '';
        const isRemoteNewer =
          !localTimestamp || (remoteTimestamp && remoteTimestamp >= localTimestamp);

        if (typeof db.visitorCount === 'number' && db.visitorCount > 148923) {
          setTotalVisits((prev) => {
            const highest = Math.max(prev, db.visitorCount);
            try {
              localStorage.setItem(VISITOR_STORAGE_KEY, String(highest));
            } catch {
              // ignore
            }
            return highest;
          });
        }

        if (
          db.siteConfig &&
          typeof db.siteConfig === 'object' &&
          (isRemoteNewer || !localStorage.getItem(CMS_SITE_CONFIG_STORAGE_KEY))
        ) {
          const mergedConfig: SiteConfig = {
            branding: { ...DEFAULT_SITE_CONFIG.branding, ...(db.siteConfig.branding || {}) },
            announcementBar: {
              ...DEFAULT_SITE_CONFIG.announcementBar,
              ...(db.siteConfig.announcementBar || {}),
            },
            heroSection: {
              ...DEFAULT_SITE_CONFIG.heroSection,
              ...(db.siteConfig.heroSection || {}),
            },
            familyTreeConfig: {
              ...DEFAULT_SITE_CONFIG.familyTreeConfig,
              ...(db.siteConfig.familyTreeConfig || {}),
            },
            digitalPortals:
              Array.isArray(db.siteConfig.digitalPortals) &&
              db.siteConfig.digitalPortals.length > 0
                ? db.siteConfig.digitalPortals
                : DEFAULT_SITE_CONFIG.digitalPortals,
            contactAndFooter: {
              ...DEFAULT_SITE_CONFIG.contactAndFooter,
              ...(db.siteConfig.contactAndFooter || {}),
            },
          };
          setSiteConfig(mergedConfig);
          try {
            localStorage.setItem(CMS_SITE_CONFIG_STORAGE_KEY, JSON.stringify(mergedConfig));
          } catch {
            // ignore
          }
        }

        if (
          Array.isArray(db.articles) &&
          db.articles.length > 0 &&
          (isRemoteNewer || !localStorage.getItem(CMS_ARTICLES_STORAGE_KEY))
        ) {
          setCmsArticles(db.articles);
          try {
            localStorage.setItem(CMS_ARTICLES_STORAGE_KEY, JSON.stringify(db.articles));
          } catch {
            // ignore
          }
        }

        if (Array.isArray(db.certificates) && db.certificates.length > 0) {
          // Merge remote certificates with local certificates so no issued certificate is ever lost
          setCmsCertificates((prevLocal) => {
            const bySerial = new Map<string, IssuedCertificateRecord>();
            for (const c of DEFAULT_VERIFIED_CERTIFICATES) {
              bySerial.set(c.serialNumber, c);
            }
            for (const c of prevLocal) {
              bySerial.set(c.serialNumber, c);
            }
            for (const c of db.certificates as IssuedCertificateRecord[]) {
              if (c && c.serialNumber) {
                bySerial.set(c.serialNumber, c);
              }
            }
            const merged = Array.from(bySerial.values());
            try {
              localStorage.setItem(CMS_CERTS_STORAGE_KEY, JSON.stringify(merged));
            } catch {
              // ignore
            }
            return merged;
          });
        }

        if (
          Array.isArray(db.customNames) &&
          db.customNames.length > 0 &&
          (isRemoteNewer || !localStorage.getItem(CMS_NAMES_STORAGE_KEY))
        ) {
          setCmsCustomNames(db.customNames);
          try {
            localStorage.setItem(CMS_NAMES_STORAGE_KEY, JSON.stringify(db.customNames));
          } catch {
            // ignore
          }
        }

        if (
          Array.isArray(db.treeNodes) &&
          db.treeNodes.length > 0 &&
          (isRemoteNewer || !localStorage.getItem(CMS_TREE_NODES_STORAGE_KEY))
        ) {
          setCmsTreeNodes(db.treeNodes);
          try {
            localStorage.setItem(CMS_TREE_NODES_STORAGE_KEY, JSON.stringify(db.treeNodes));
          } catch {
            // ignore
          }
        }

        if (remoteTimestamp && isRemoteNewer) {
          try {
            localStorage.setItem(CMS_LAST_UPDATED_STORAGE_KEY, remoteTimestamp);
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        // ignore fetch errors
      });
  }, []);

  const touchLocalTimestamp = () => {
    try {
      localStorage.setItem(CMS_LAST_UPDATED_STORAGE_KEY, new Date().toISOString());
    } catch {
      // ignore
    }
  };

  const handleUpdateSiteConfig = (nextConfig: SiteConfig) => {
    setSiteConfig(nextConfig);
    touchLocalTimestamp();
    try {
      localStorage.setItem(CMS_SITE_CONFIG_STORAGE_KEY, JSON.stringify(nextConfig));
    } catch {
      // ignore
    }
  };

  const handleUpdateArticles = (nextArticles: DiwanArticle[]) => {
    setCmsArticles(nextArticles);
    touchLocalTimestamp();
    try {
      localStorage.setItem(CMS_ARTICLES_STORAGE_KEY, JSON.stringify(nextArticles));
    } catch {
      // ignore
    }
  };

  const handleUpdateCertificates = (nextCerts: IssuedCertificateRecord[]) => {
    setCmsCertificates(nextCerts);
    touchLocalTimestamp();
    try {
      localStorage.setItem(CMS_CERTS_STORAGE_KEY, JSON.stringify(nextCerts));
    } catch {
      // ignore
    }
  };

  const handleUpdateCustomNames = (nextNames: string[]) => {
    setCmsCustomNames(nextNames);
    touchLocalTimestamp();
    try {
      localStorage.setItem(CMS_NAMES_STORAGE_KEY, JSON.stringify(nextNames));
    } catch {
      // ignore
    }
  };

  const handleUpdateTreeNodes = (nextNodes: FamilyTreeNode[]) => {
    setCmsTreeNodes(nextNodes);
    touchLocalTimestamp();
    try {
      localStorage.setItem(CMS_TREE_NODES_STORAGE_KEY, JSON.stringify(nextNodes));
    } catch {
      // ignore
    }
  };

  const handleUpdateVisitorCount = (nextCount: number) => {
    setTotalVisits(nextCount);
    touchLocalTimestamp();
    try {
      localStorage.setItem(VISITOR_STORAGE_KEY, String(nextCount));
    } catch {
      // ignore
    }
  };

  const navigateTo = (route: PageRoute) => {
    setCurrentRoute(route);
    recordPortalVisit();
    const targetPath = route === 'home' ? '/' : `/${route}`;
    try {
      window.history.pushState({}, '', targetPath);
    } catch {
      // Fallback in restricted iframe environments
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSecretCopyrightClick = () => {
    secretClickCountRef.current += 1;
    if (secretClickCountRef.current >= 5) {
      secretClickCountRef.current = 0;
      navigateTo('admin-elsaidy');
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2000);
  };

  const handleSharePortalLink = () => {
    const officialUrl = 'https://elsaidy.org';
    navigator.clipboard.writeText(officialUrl);
    setShareToastMessage('تم نسخ الرابط الرسمي للبوابة بنجاح (elsaidy.org)');
    setTimeout(() => {
      setShareToastMessage(null);
    }, 3200);
  };

  const handleOpenPortalModal = (portal: WhiteLabeledPortal) => {
    setInspectedPortal(portal);
  };

  const handleCorporateInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.fullName.trim() || !inquiryForm.contactInfo.trim()) {
      setInquiryStatus('يرجى إدخال الاسم الكامل وبيانات التواصل لإتمام الطلب.');
      return;
    }
    const targetMail = siteConfig.contactAndFooter.officialEmail || 'info@elsaidy.org';
    const subject = encodeURIComponent(
      `طلب رسمي عبر بوابة الصعيدي (${inquiryForm.requestType}) — ${inquiryForm.fullName}`
    );
    const body = encodeURIComponent(
      `الاسم الكامل: ${inquiryForm.fullName}\n` +
        `الإقليم / الدولة: ${inquiryForm.countryRegion}\n` +
        `نوع الطلب: ${inquiryForm.requestType}\n` +
        `المعرف المقترح: ${inquiryForm.preferredEmailPrefix || 'غير محدد'}\n` +
        `وسيلة التواصل: ${inquiryForm.contactInfo}\n\n` +
        `التفاصيل:\n${inquiryForm.details}`
    );
    window.location.href = `mailto:${targetMail}?subject=${subject}&body=${body}`;
    setInquiryStatus(
      `تم تجهيز رسالتكم الرسمية باسم (${inquiryForm.fullName}) وتوجيهها إلى البريد المعتمد (${targetMail}).`
    );
  };

  const navItems: {
    id: PageRoute;
    label: string;
    mobileLabel: string;
    path: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'home', label: 'الرئيسية', mobileLabel: 'الرئيسية', path: '/', icon: Home },
    {
      id: 'about',
      label: 'من نحن والتاريخ',
      mobileLabel: 'التاريخ',
      path: '/about',
      icon: BookOpen,
    },
    {
      id: 'tree',
      label: 'شجرة وفروع العائلة',
      mobileLabel: 'الشجرة',
      path: '/tree',
      icon: GitBranch,
    },
    {
      id: 'verify',
      label: 'التوثيق وشهادات النسب',
      mobileLabel: 'التوثيق',
      path: '/verify',
      icon: Award,
    },
    {
      id: 'diwan',
      label: 'الديوان والمقالات',
      mobileLabel: 'الديوان',
      path: '/diwan',
      icon: FileText,
    },
    {
      id: 'portals',
      label: 'الأنظمة الرقمية ومشاريع الصعيدي',
      mobileLabel: 'البوابات',
      path: '/portals',
      icon: Building2,
    },
  ];

  const handleAnnouncementLinkClick = () => {
    const link = siteConfig.announcementBar.linkUrl?.trim() || '/verify';
    if (link.startsWith('/')) {
      const cleaned = link.replace(/^\/+/, '') as PageRoute;
      if (['home', 'about', 'tree', 'verify', 'diwan', 'portals'].includes(cleaned)) {
        navigateTo(cleaned);
      } else {
        navigateTo('verify');
      }
    } else if (link.startsWith('http://') || link.startsWith('https://')) {
      window.location.href = link;
    } else {
      navigateTo('verify');
    }
  };

  // Normalize copyright text so "© 2026" is never duplicated (Fixes BUG-012)
  const rawCopyrightText = (siteConfig.contactAndFooter.copyrightText || '').replace(
    /^©\s*\d{4}\s*/u,
    ''
  );

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col justify-between bg-[#F7F6F2] text-[#141413] selection:bg-[#695022]/20 selection:text-[#141413] overflow-x-hidden pb-20 md:pb-0"
    >
      {/* Dynamic SEO & JSON-LD Structured Data Engine */}
      <SEOManager
        currentPage={currentRoute}
        customNames={cmsCustomNames}
        articles={cmsArticles}
      />

      <div>
        {/* Dynamic Top Announcement Ticker Bar (Controlled from /admin-elsaidy) */}
        {siteConfig.announcementBar.enabled && (
          <div
            className="no-print text-white border-b border-[#D4AF37]/30 px-3 sm:px-6 lg:px-12 py-2"
            style={{ backgroundColor: siteConfig.branding.primaryColor || '#0F291E' }}
          >
            <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2 py-0.5 rounded-md bg-[#D4AF37] text-[#0D131A] text-[10px] sm:text-[11px] font-extrabold shrink-0 flex items-center gap-1">
                  <Megaphone className="w-3 h-3" />
                  <span>{siteConfig.announcementBar.badgeText}</span>
                </span>
                <span className="text-zinc-100 font-semibold truncate sm:whitespace-normal">
                  {siteConfig.announcementBar.message}
                </span>
              </div>

              {siteConfig.announcementBar.linkText && (
                <button
                  type="button"
                  onClick={handleAnnouncementLinkClick}
                  className="text-[11px] font-extrabold text-[#D4AF37] hover:text-white flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <span>{siteConfig.announcementBar.linkText}</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Regal Sticky Header with Dynamic Logo or Official Geometric Crest/Monogram */}
        <header
          id="top"
          className="no-print sticky top-0 z-50 backdrop-blur-md bg-[#F7F6F2]/95 border-b border-[#E2DDD3] px-3.5 sm:px-6 lg:px-12 py-3 shadow-xs"
        >
          <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-3">
            {/* Zone 1: Dynamic Custom Logo OR Geometric Crest/Monogram + Official Wordmark */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('home');
              }}
              className="flex items-center gap-3 min-w-0 group"
            >
              {siteConfig.branding.logoUrl ? (
                <img
                  src={siteConfig.branding.logoUrl}
                  alt={siteConfig.branding.siteTitle}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-contain bg-white border-2 border-[#D4AF37] p-0.5 shadow-sm shrink-0"
                />
              ) : (
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#0F291E] to-[#141E28] border-2 border-[#D4AF37] flex flex-col items-center justify-center text-white shadow-sm shrink-0"
                  style={{
                    backgroundColor: siteConfig.branding.primaryColor || '#0F291E',
                  }}
                >
                  <span className="font-mono text-[8px] sm:text-[9px] font-bold tracking-widest text-[#D4AF37] leading-none">
                    ELSAIDY
                  </span>
                  <span className="font-display text-xs font-bold text-white leading-tight mt-0.5">
                    الصعيدي
                  </span>
                </div>
              )}

              <div className="min-w-0">
                <div className="text-sm sm:text-base lg:text-xl font-extrabold text-[#141413] tracking-tight leading-snug group-hover:text-[#0F291E] transition-colors truncate">
                  {siteConfig.branding.siteTitle}
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-[#695022] truncate">
                  {siteConfig.branding.siteSubtitle} · elsaidy.org
                </div>
              </div>
            </a>

            {/* Zone 2: Desktop Navigation Links */}
            <nav
              aria-label="التنقل الرئيسي"
              className="hidden xl:flex items-center gap-5 text-sm font-bold text-zinc-800"
            >
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(item.id);
                  }}
                  className={`py-1.5 transition-all whitespace-nowrap shrink-0 ${
                    currentRoute === item.id
                      ? 'text-[#0F291E] border-b-2 border-[#695022] font-extrabold'
                      : 'hover:text-[#695022]'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Zone 3: Share Official Link & Brand Portal Action */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSharePortalLink}
                title="مشاركة البوابة / نسخ الرابط الرسمي (elsaidy.org)"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white border border-[#E6E2D8] text-xs font-bold text-[#141413] hover:border-[#695022] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Share2 className="w-3.5 h-3.5 text-[#695022]" />
                <span className="hidden md:inline">مشاركة البوابة</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setInquiryStatus('');
                  setIsCorporateModalOpen(true);
                }}
                style={{ backgroundColor: siteConfig.branding.primaryColor || '#0F291E' }}
                className="px-3 sm:px-4 py-2 rounded-xl bg-[#0F291E] text-white text-xs font-bold hover:bg-[#141E28] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm whitespace-nowrap shrink-0"
              >
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">بريد وأعمال الصعيدي</span>
                <span className="sm:hidden">بريد رسمي</span>
              </button>
            </div>
          </div>
        </header>

        {/* Institutional Operational & Pan-Arab Ribbon */}
        <div className="no-print bg-white border-b border-[#E6E2D8] px-4 sm:px-6 lg:px-12 py-2 hidden sm:block">
          <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-700">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-[#0F291E]">
                المظلة الرسمية لتجمع عائلات الصعيدي في الوطن العربي
              </span>
              <span aria-hidden="true" className="text-[#695022]">·</span>
              <span>مصر · السعودية · الشام والعراق · الخليج العربي · المغرب العربي والسودان</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#695022] font-bold">
              <span>elsaidy.org</span>
              <span aria-hidden="true">·</span>
              <span>{siteConfig.branding.siteSubtitle}</span>
            </div>
          </div>
        </div>

        {/* Tablet Navigation Bar (Visible on md/lg tablets; Mobile uses the Bottom Dock) */}
        <div className="no-print hidden md:block xl:hidden bg-[#F7F6F2] border-b border-[#E2DDD3] px-4 sm:px-6 py-2.5">
          <div className="flex items-center gap-2 overflow-x-auto text-xs pb-0.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateTo(item.id)}
                className={`px-3.5 py-2 rounded-xl border whitespace-nowrap shrink-0 cursor-pointer font-bold transition-all ${
                  currentRoute === item.id
                    ? 'bg-[#0F291E] border-[#0F291E] text-white shadow-xs'
                    : 'bg-white border-[#E6E2D8] text-[#141413]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Standalone Page Container */}
        <main className="max-w-[1280px] mx-auto px-3.5 sm:px-6 lg:px-12">
          {currentRoute === 'home' && (
            <HomePage
              activeBranchId={activeBranchId}
              onSelectBranch={(id) => setActiveBranchId(id)}
              onNavigate={navigateTo}
              onInspectPortal={handleOpenPortalModal}
              onReadArticle={(art) => setActiveArticleModal(art)}
              onOpenCorporateInquiry={() => {
                setInquiryStatus('');
                setIsCorporateModalOpen(true);
              }}
              siteConfig={siteConfig}
              articles={cmsArticles}
            />
          )}

          <Suspense fallback={<RoyalPageSkeleton />}>
            {currentRoute === 'about' && (
              <AboutPage
                onNavigate={navigateTo}
                copiedKey={copiedKey}
                onCopy={handleCopy}
              />
            )}

            {currentRoute === 'tree' && (
              <FamilyTreePage
                onNavigate={navigateTo}
                customNames={cmsCustomNames}
                siteConfig={siteConfig}
                treeNodes={cmsTreeNodes}
              />
            )}

            {currentRoute === 'verify' && (
              <VerifyPage
                onNavigate={navigateTo}
                issuedCertificates={cmsCertificates}
                siteConfig={siteConfig}
              />
            )}

            {currentRoute === 'diwan' && (
              <BlogPage
                onNavigate={navigateTo}
                articles={cmsArticles}
              />
            )}

            {currentRoute === 'portals' && (
              <ProjectsPage
                onNavigate={navigateTo}
                onInspectPortal={handleOpenPortalModal}
                copiedKey={copiedKey}
                onCopy={handleCopy}
                onOpenCorporateInquiry={() => {
                  setInquiryStatus('');
                  setIsCorporateModalOpen(true);
                }}
                portals={siteConfig.digitalPortals}
              />
            )}

            {currentRoute === 'admin-elsaidy' && (
              <AdminCmsPage
                onNavigate={navigateTo}
                visitorCount={totalVisits}
                onUpdateVisitorCount={handleUpdateVisitorCount}
                articles={cmsArticles}
                onUpdateArticles={handleUpdateArticles}
                issuedCertificates={cmsCertificates}
                onUpdateCertificates={handleUpdateCertificates}
                customNames={cmsCustomNames}
                onUpdateCustomNames={handleUpdateCustomNames}
                treeNodes={cmsTreeNodes}
                onUpdateTreeNodes={handleUpdateTreeNodes}
                siteConfig={siteConfig}
                onUpdateSiteConfig={handleUpdateSiteConfig}
              />
            )}
          </Suspense>
        </main>
      </div>

      {/* Luxury Dark Institutional Footer (#0D131A with #D4AF37 Gold Accents & Official Archive Telemetry) */}
      <footer className="no-print bg-[#0D131A] text-zinc-200 border-t-4 border-[#695022] mt-12 sm:mt-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-12 lg:py-16">
          {/* Top Footer Row: Identity, Pan-Arab Scope & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3.5">
                {siteConfig.branding.logoUrl ? (
                  <img
                    src={siteConfig.branding.logoUrl}
                    alt={siteConfig.branding.siteTitle}
                    onClick={handleSecretCopyrightClick}
                    className="w-12 h-12 rounded-xl object-contain bg-white border-2 border-[#D4AF37] p-0.5 shrink-0 select-none"
                  />
                ) : (
                  <div
                    onClick={handleSecretCopyrightClick}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0F291E] to-[#141E28] border-2 border-[#D4AF37] flex flex-col items-center justify-center text-white shrink-0 select-none"
                  >
                    <span className="font-mono text-[9px] font-bold tracking-widest text-[#D4AF37] leading-none">
                      ELSAIDY
                    </span>
                    <span className="font-display text-xs font-bold text-white leading-tight mt-0.5">
                      الصعيدي
                    </span>
                  </div>
                )}
                <div>
                  <div className="text-lg sm:text-xl font-extrabold text-white">
                    {siteConfig.branding.siteTitle}
                  </div>
                  <div className="text-xs font-mono text-[#D4AF37]">
                    {siteConfig.branding.siteSubtitle} — elsaidy.org
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-[1.9] max-w-3xl text-justify">
                المظلة الرسمية لتجمع عائلات الصعيدي (آل الصعيدي — Elsaidy / Elseidy / Alsaidi)
                وتاريخ إقليم الصعيد (صعيد مصر) والامتداد الحجازي (حجازي · حجاج · مرسي الحجاج ·
                حجاج الصعيدي · حجازي الصعيدي): ١. جمهورية مصر العربية (صعيد مصر، محافظة الغربية
                وطنطا، الدلتا، القاهرة الكبرى، الإسكندرية، ومدن القناة) · ٢. المملكة العربية
                السعودية (ينبع النخل، تيماء، حائل - حي الزبارة، الرياض، تبوك، الحجاز، والمنطقة
                الشرقية) · ٣. بلاد الشام والعراق (سوريا - جبل العرب، الأردن، فلسطين، ولبنان) ·
                ٤. دول الخليج العربي (الإمارات - عجمان وأبوظبي ودبي، سلطنة عُمان - الباطنة
                والخابورة، الكويت، قطر، والبحرين) · ٥. المغرب العربي والسودان.
              </p>

              {/* Contact Row: Only render separator dot if whatsappOrPhone is non-empty (Fixes BUG-009) */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-300 pt-1">
                <span>
                  البريد الرسمي:{' '}
                  <a
                    href={`mailto:${siteConfig.contactAndFooter.officialEmail || 'info@elsaidy.org'}`}
                    className="font-mono font-bold text-[#D4AF37] hover:underline"
                  >
                    {siteConfig.contactAndFooter.officialEmail || 'info@elsaidy.org'}
                  </a>
                </span>
                {siteConfig.contactAndFooter.whatsappOrPhone &&
                  siteConfig.contactAndFooter.whatsappOrPhone.trim().length > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{siteConfig.contactAndFooter.whatsappOrPhone}</span>
                    </>
                  )}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              <div>
                <div className="text-xs font-bold text-[#D4AF37] mb-3">
                  أقسام البوابة الرسمية ومجموعة الصعيدي:
                </div>
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigateTo(item.id)}
                      className={`px-3.5 py-2 rounded-lg border transition-all cursor-pointer ${
                        currentRoute === item.id
                          ? 'bg-[#D4AF37] text-[#0D131A] border-[#D4AF37] font-extrabold'
                          : 'bg-white/5 text-white border-white/15 hover:border-[#D4AF37]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSharePortalLink}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-[#D4AF37]/40 text-xs font-bold text-white flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>مشاركة البوابة / نسخ الرابط الرسمي (elsaidy.org)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInquiryStatus('');
                    setIsCorporateModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#0D131A] text-xs font-extrabold hover:bg-[#e0bd42] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>طلب بريد (@elsaidy.org)</span>
                </button>
              </div>
            </div>
          </div>

          {/* OFFICIAL ARCHIVE TELEMETRY & VISITOR COUNTER RIBBON IN FOOTER */}
          <div className="py-8 border-b border-white/10">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="text-xs font-bold text-[#D4AF37] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#D4AF37]" />
                <span>
                  شريط إحصائيات البوابة والأرشيف الرسمي (Official Portal &amp; Archive Statistics)
                </span>
              </div>
              <span className="font-mono text-[11px] text-zinc-300 hidden sm:inline">
                ELSAIDY ARCHIVE REGISTRY · VERIFIED METRICS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Badge 1: Total Portal Visits */}
              <div
                className={`p-4 rounded-xl bg-gradient-to-br from-[#141E28] to-[#0D131A] border transition-all duration-500 flex items-center justify-between ${
                  isCounterPulsing
                    ? 'border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                    : 'border-[#D4AF37]/35'
                }`}
              >
                <div>
                  <div className="text-[11px] text-zinc-300 font-semibold mb-1">
                    إجمالي زيارات البوابة الوثائقية
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="font-mono text-2xl font-extrabold text-[#D4AF37] tabular-nums">
                      {totalVisits.toLocaleString('en-US')}
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              {/* Badge 2: Verified Lineage Documents & Studies */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#141E28] to-[#0D131A] border border-[#D4AF37]/35 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-zinc-300 font-semibold mb-1">
                    الدراسات والوثائق المعتمدة بالديوان
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="font-mono text-2xl font-extrabold text-white tabular-nums">
                      {cmsArticles.length + cmsCertificates.filter((c) => !c.archived).length}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">وثيقة ودراسة</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FileText className="w-5 h-5" />
                </div>
              </div>

              {/* Badge 3: Registered Arab Countries */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#141E28] to-[#0D131A] border border-[#D4AF37]/35 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-zinc-300 font-semibold mb-1">
                    الأقطار والدول المسجلة
                  </div>
                  <div className="text-xl font-extrabold text-[#D4AF37]">
                    14+ دولة عربية
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                  <Globe2 className="w-5 h-5" />
                </div>
              </div>

              {/* Badge 4: System & Brand Status */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#141E28] to-[#0D131A] border border-[#D4AF37]/35 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-zinc-300 font-semibold mb-1">
                    حالة المنظومة والبراند
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-emerald-400">
                    متصل ومؤرشف رسمياً (100%)
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Row (Single © Year — Fixes BUG-012) */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-300">
            <div
              onClick={handleSecretCopyrightClick}
              className="select-none cursor-default text-center sm:text-right"
            >
              © {new Date().getFullYear()} {rawCopyrightText}
            </div>
            <div className="text-[11px] text-zinc-400 text-center sm:text-left">
              ELSAIDY Enterprise &amp; Brand Solutions · Core Management · @elsaidy.org Official Mail ·
              Knowledge Cloud
            </div>
          </div>
        </div>
      </footer>

      {/* Sleek Mobile Bottom Navigation Dock (md:hidden) */}
      <nav
        aria-label="التنقل السريع للهاتف"
        className="no-print md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0D131A]/95 backdrop-blur-md border-t border-[#C5A059]/30 px-1.5 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.35)]"
      >
        <div className="grid grid-cols-6 gap-1 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateTo(item.id)}
                className={`py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-extrabold'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-zinc-400'}`} />
                <span className="text-[10px] leading-none tracking-tight whitespace-nowrap">
                  {item.mobileLabel}
                </span>
                {isActive && (
                  <span className="w-4 h-0.5 rounded-full bg-[#D4AF37] mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Floating "العودة للأعلى" (Back to Top) Button at Bottom-Left */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="العودة للأعلى"
          className="no-print fixed left-4 sm:left-6 bottom-20 md:bottom-6 z-40 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-[#0F291E] text-white border-2 border-[#D4AF37] shadow-xl hover:bg-[#141E28] hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer text-xs font-extrabold"
        >
          <ArrowUp className="w-4 h-4 text-[#D4AF37]" />
          <span className="hidden sm:inline">العودة للأعلى</span>
        </button>
      )}

      {/* Sleek Toast Notification when Official Portal Link is Copied */}
      {shareToastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="no-print fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 px-5 py-3.5 rounded-xl bg-[#0D131A] text-white border-2 border-[#D4AF37] shadow-2xl flex items-center gap-2.5 text-xs font-bold"
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{shareToastMessage}</span>
        </div>
      )}

      {/* Corporate Inquiry & Official @elsaidy.org Email Request Modal */}
      {isCorporateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="corporate-modal-title"
          className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 overflow-y-auto"
          onClick={() => setIsCorporateModalOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-8 text-[#141413] shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-[#E6E2D8]">
              <div>
                <div className="text-xs text-[#695022] font-bold">
                  ELSAIDY BRAND &amp; OFFICIAL MAIL HUB · elsaidy.org
                </div>
                <h3
                  id="corporate-modal-title"
                  className="text-xl sm:text-2xl font-extrabold text-[#141413] mt-1"
                >
                  طلب بريد رسمي (@elsaidy.org) أو تواصل للأعمال والمشاريع
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCorporateModalOpen(false)}
                className="p-1.5 rounded-lg border border-[#E6E2D8] hover:border-[#695022] transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCorporateInquirySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1.5">
                    الاسم الكامل:
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryForm.fullName}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, fullName: e.target.value })}
                    placeholder="مثال: علي أحمد الصعيدي"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#695022]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1.5">
                    الدولة / الإقليم:
                  </label>
                  <select
                    value={inquiryForm.countryRegion}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, countryRegion: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#695022]"
                  >
                    <option value="جمهورية مصر العربية">١. جمهورية مصر العربية</option>
                    <option value="المملكة العربية السعودية">٢. المملكة العربية السعودية</option>
                    <option value="بلاد الشام والعراق">٣. بلاد الشام والعراق</option>
                    <option value="دول الخليج العربي">٤. دول الخليج العربي</option>
                    <option value="المغرب العربي والسودان">٥. المغرب العربي والسودان</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1.5">
                    نوع الطلب:
                  </label>
                  <select
                    value={inquiryForm.requestType}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, requestType: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#695022]"
                  >
                    <option value="official-email">إصدار بريد رسمي (@elsaidy.org)</option>
                    <option value="enterprise-project">تعاون تجاري / مشاريع مجموعة الصعيدي</option>
                    <option value="genealogy-archive">توثيق فرع عائلي في الأرشيف الرسمي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1.5">
                    المعرف المقترح للبريد (اختياري):
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={inquiryForm.preferredEmailPrefix}
                    onChange={(e) =>
                      setInquiryForm({ ...inquiryForm, preferredEmailPrefix: e.target.value })
                    }
                    placeholder="name@elsaidy.org"
                    className="w-full px-3.5 py-2.5 text-sm font-mono text-right rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#695022]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1.5">
                  رقم الهاتف أو البريد الحالي للتواصل:
                </label>
                <input
                  type="text"
                  required
                  value={inquiryForm.contactInfo}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, contactInfo: e.target.value })}
                  placeholder="أدخل وسيلة التواصل المباشرة..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#695022]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1.5">
                  تفاصيل الطلب أو المشروع:
                </label>
                <textarea
                  rows={3}
                  value={inquiryForm.details}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, details: e.target.value })}
                  placeholder="اكتب نبذة مختصرة عن طلبك أو مقترح المشروع..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#695022]"
                />
              </div>

              {inquiryStatus && (
                <div
                  role="status"
                  className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#695022] text-xs font-bold text-[#0F291E] leading-relaxed"
                >
                  {inquiryStatus}
                </div>
              )}

              <div className="pt-3 border-t border-[#E6E2D8] flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`mailto:${siteConfig.contactAndFooter.officialEmail || 'info@elsaidy.org'}`}
                  className="text-xs font-mono font-bold text-[#695022] hover:underline"
                >
                  {siteConfig.contactAndFooter.officialEmail || 'info@elsaidy.org'}
                </a>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCorporateModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#E6E2D8] text-xs font-bold text-zinc-700 cursor-pointer"
                  >
                    إغلاق
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#0F291E] text-white text-xs font-bold hover:bg-[#141E28] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>إرسال عبر البريد الرسمي</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Subdomain Gateway & Redirect Modal for Digital Portals (Fixes SEC-005) */}
      {inspectedPortal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="portal-gateway-modal-title"
          className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={() => setInspectedPortal(null)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-8 text-[#141413] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-[#E6E2D8]">
              <div>
                <div className="text-xs text-[#695022] font-bold">
                  بوابة التوجيه المؤسسي المباشر · {inspectedPortal.domain}
                </div>
                <h3
                  id="portal-gateway-modal-title"
                  className="text-xl sm:text-2xl font-extrabold text-[#141413] mt-1"
                >
                  {inspectedPortal.officialName}
                </h3>
                <div className="text-xs text-[#0F291E] font-bold mt-0.5">
                  {inspectedPortal.portalSubTitle}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectedPortal(null)}
                className="p-1.5 rounded-lg border border-[#E6E2D8] hover:border-[#695022] transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                {inspectedPortal.summary}
              </p>

              <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#0F291E]">
                  <Lock className="w-4 h-4 text-[#695022]" />
                  <span>نطاق المصادقة المستقل ({inspectedPortal.domain})</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  حفاظاً على أمن البيانات المؤسسية، تتم عملية تسجيل الدخول والمصادقة (SSO) حصرياً
                  على النطاق الفرعي المستقل للخدمة{' '}
                  <span className="font-mono font-bold text-[#0F291E]" dir="ltr">
                    {inspectedPortal.url}
                  </span>{' '}
                  وليس داخل البوابة الوثائقية العامة.
                </p>
              </div>

              <div className="pt-3 border-t border-[#E6E2D8] flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setInspectedPortal(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E6E2D8] text-xs font-bold text-zinc-700 cursor-pointer"
                >
                  إغلاق
                </button>

                <a
                  href={inspectedPortal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#0F291E] text-white text-xs font-extrabold hover:bg-[#141E28] transition-colors flex items-center gap-2"
                >
                  <span>الانتقال الآمن إلى {inspectedPortal.domain}</span>
                  <ArrowUpLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Reader Modal (Triggered from HomePage previews) */}
      {activeArticleModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="article-reader-modal-title"
          className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 overflow-y-auto"
          onClick={() => setActiveArticleModal(null)}
        >
          <div
            className="w-full max-w-3xl bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-10 my-8 text-[#141413] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-5 mb-6 border-b border-[#E6E2D8]">
              <div>
                <div className="text-xs text-[#695022] font-bold mb-1.5">
                  {activeArticleModal.categoryLabel} · {activeArticleModal.hijriDate} (
                  {activeArticleModal.publishDate})
                </div>
                <h3
                  id="article-reader-modal-title"
                  className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-snug"
                >
                  {activeArticleModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticleModal(null)}
                className="p-1.5 rounded-lg border border-[#E6E2D8] hover:border-[#695022] transition-colors cursor-pointer shrink-0"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6 mb-8">
              <p className="font-display text-lg lg:text-xl text-[#141413] leading-[1.95] bg-[#F7F6F2] p-5 rounded-xl border border-[#E6E2D8]">
                {activeArticleModal.excerpt}
              </p>

              {activeArticleModal.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="text-lg sm:text-xl font-extrabold text-[#0F291E]">
                    {sec.heading}
                  </h4>
                  <p className="font-display text-lg sm:text-xl text-zinc-800 leading-[2.0] text-justify">
                    {sec.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-[#E6E2D8] text-xs text-zinc-600">
              <div>
                <span className="font-bold text-[#141413]">
                  المصدر: {activeArticleModal.author}
                </span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>{activeArticleModal.authorTitle}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticleModal(null)}
                className="px-5 py-2.5 rounded-xl bg-[#0F291E] text-white font-bold hover:bg-[#141E28] transition-colors cursor-pointer"
              >
                إغلاق المطالعة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

