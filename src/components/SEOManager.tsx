import React, { useEffect } from 'react';
import {
  PageRoute,
  SEO_KEYWORD_CLUSTERS,
  ENCYCLOPEDIC_FAQS,
  DIWAN_ARTICLES,
  COMPOUND_NAMES_INDEX,
  DiwanArticle,
} from '../data/familyData';

interface SEOManagerProps {
  currentPage: PageRoute;
  customNames?: string[];
  activeArticleSlug?: string;
  activeCertificateSerial?: string;
  articles?: DiwanArticle[];
}

const ARTICLE_ISO_DATES: Record<string, string> = {
  'diwan-1': '2026-10-20',
  'diwan-2': '2026-10-15',
  'diwan-3': '2026-10-02',
  'diwan-4': '2026-09-19',
  'diwan-5': '2026-09-05',
  'diwan-6': '2026-10-21',
  'diwan-7': '2026-10-22',
};

const toValidIsoDate = (article: DiwanArticle): string => {
  if (article.isoDate && /^\d{4}-\d{2}-\d{2}$/.test(article.isoDate)) {
    return article.isoDate;
  }
  if (ARTICLE_ISO_DATES[article.id]) {
    return ARTICLE_ISO_DATES[article.id];
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(article.publishDate)) {
    return article.publishDate.slice(0, 10);
  }
  return '2026-10-22';
};

const PAGE_SEO_CONFIG: Record<
  PageRoute,
  {
    title: string;
    description: string;
    canonicalPath: string;
    breadcrumbName: string;
  }
> = {
  home: {
    title:
      'الموقع الرسمي لعائلات الصعيدي في الوطن العربي ومجموعة الصعيدي | شجرة ونسب وتاريخ آل الصعيدي (الصعيد - حجازي - حجاج) ومشاريع ELSAIDY',
    description:
      'البوابة الرسمية والمرجع التاريخي والوثائقي الشامل لـ عائلة الصعيدي (آل الصعيدي / قبيلة الصعيدي)، وتاريخ إقليم الصعيد (صعيد مصر) والامتداد الحجازي (حجازي / حجاج / مرسي الحجاج / حجاج الصعيدي / حجازي الصعيدي / علي أحمد علي الصعيدي) في مصر والسعودية والشام والخليج العربي، ومشاريع مجموعة الصعيدي (ELSAIDY GROUP).',
    canonicalPath: '/',
    breadcrumbName: 'الرئيسية',
  },
  about: {
    title:
      'من نحن وتاريخ عائلة الصعيدي | إقليم الصعيد والامتداد الحجازي (حجازي - حجاج - الصعيدي) والمراجع التاريخية',
    description:
      'النص الوثائقي الكامل لمن نحن (عائلة الصعيدي)، سبب التسمية بـ الصعيدي، وتاريخ إقليم الصعيد (صعيد مصر) والامتداد الحجازي (حجازي / حجاج / مرسي الحجاج / حجاج الصعيدي / حجازي الصعيدي)، والمراجع التاريخية الموثقة.',
    canonicalPath: '/about',
    breadcrumbName: 'التاريخ والوثائق',
  },
  tree: {
    title:
      'شجرة وموسوعة عائلات الصعيدي وحجازي وحجاج | فروع مصر والسعودية والشام والخليج وفهرس الأسماء المركبة',
    description:
      'الموسوعة الجغرافية والتاريخية الشاملة لشجرة عائلات الصعيدي والامتداد الحجازي (حجازي / حجاج / مرسي الحجاج) في مصر (الغربية، طنطا، الصعيد، الدلتا، القاهرة) والسعودية (ينبع، حائل، تيماء، الرياض) والشام والخليج، وفهرس الأسماء المركبة.',
    canonicalPath: '/tree',
    breadcrumbName: 'شجرة وموسوعة العائلة',
  },
  verify: {
    title:
      'بوابة التحقق من شهادات النسب والعضوية | عائلة الصعيدي (ELSAIDY Verification Portal)',
    description:
      'النظام الرقمي المعتمد لفحص والتحقق الفوري من صحة شهادات النسب وبطاقات العضوية الرسمية الصادرة عن الأرشيف التاريخي ومؤسسة عائلة الصعيدي (ELSAIDY Official Registry).',
    canonicalPath: '/verify',
    breadcrumbName: 'التحقق من الشهادات',
  },
  diwan: {
    title:
      'ديوان وأخبار عائلة الصعيدي | المقالات التاريخية والوثائق والأبحاث (الصعيد - حجازي - حجاج - الصعيدي)',
    description:
      'الديوان الرسمي والمركز الإعلامي لعائلة الصعيدي: دراسات تاريخية في أصول آل الصعيدي، إقليم الصعيد (صعيد مصر)، والامتداد الحجازي (حجازي - حجاج - مرسي الحجاج)، وتراجم أعلام الصعيدي وأخبار مجموعة الصعيدي.',
    canonicalPath: '/diwan',
    breadcrumbName: 'ديوان وأخبار العائلة',
  },
  portals: {
    title:
      'مجموعة ومشاريع الصعيدي | ELSAIDY GROUP & Digital Infrastructure | بوابات الأعمال والأنظمة السحابية',
    description:
      'الذراع المؤسسي والتقني والخدمي لعائلة الصعيدي (ELSAIDY GROUP): الأرشيف الرقمي، بوابة الإدارة والموارد المركزية، منظومة البريد المؤسسي المشفر، وبوابة الأعمال والمشاريع المستقبلية.',
    canonicalPath: '/portals',
    breadcrumbName: 'مجموعة ومشاريع الصعيدي',
  },
  'admin-elsaidy': {
    title: 'لوحة القيادة والإدارة المركزية | ELSAIDY Cloud CMS',
    description: 'لوحة التحكم المركزية لإدارة الديوان والشهادات والموسوعة والربط السحابي.',
    canonicalPath: '/admin-elsaidy',
    breadcrumbName: 'لوحة القيادة المركزية',
  },
};

export const SEOManager: React.FC<SEOManagerProps> = ({
  currentPage,
  customNames,
  activeArticleSlug,
  activeCertificateSerial,
  articles = DIWAN_ARTICLES,
}) => {
  const baseConfig = PAGE_SEO_CONFIG[currentPage] || PAGE_SEO_CONFIG.home;

  const matchedArticle =
    currentPage === 'diwan' && activeArticleSlug
      ? articles.find((a) => (a.slug || a.id) === activeArticleSlug)
      : undefined;

  const effectiveTitle = matchedArticle
    ? `${matchedArticle.title} | ديوان عائلات الصعيدي — elsaidy.org`
    : baseConfig.title;

  const effectiveDescription = matchedArticle
    ? matchedArticle.excerpt
    : baseConfig.description;

  const effectiveCanonicalPath =
    currentPage === 'diwan' && matchedArticle
      ? `/diwan/${encodeURIComponent(matchedArticle.slug || matchedArticle.id)}`
      : currentPage === 'verify' && activeCertificateSerial
      ? `/verify/${encodeURIComponent(activeCertificateSerial.toUpperCase())}`
      : baseConfig.canonicalPath;

  const compoundArabicList = COMPOUND_NAMES_INDEX.map((c) => c.arabicName);
  const mergedCompoundNames =
    customNames && customNames.length > 0
      ? Array.from(new Set([...customNames, ...compoundArabicList]))
      : compoundArabicList;

  const allKeywords = [
    ...SEO_KEYWORD_CLUSTERS.arabicCore,
    ...SEO_KEYWORD_CLUSTERS.upperEgyptAndSaid,
    ...SEO_KEYWORD_CLUSTERS.hijaziAndHagag,
    ...SEO_KEYWORD_CLUSTERS.arabicRegions,
    ...SEO_KEYWORD_CLUSTERS.englishVariations,
    ...mergedCompoundNames,
  ].join(', ');

  useEffect(() => {
    document.title = effectiveTitle;

    const updateMeta = (selector: string, attr: string, value: string) => {
      const el = document.querySelector(selector);
      if (el) {
        el.setAttribute(attr, value);
      }
    };

    updateMeta('meta[name="description"]', 'content', effectiveDescription);
    updateMeta('meta[name="keywords"]', 'content', allKeywords);
    updateMeta('meta[property="og:title"]', 'content', effectiveTitle);
    updateMeta('meta[property="og:description"]', 'content', effectiveDescription);
    updateMeta(
      'meta[property="og:url"]',
      'content',
      `https://elsaidy.org${effectiveCanonicalPath}`
    );
    updateMeta('meta[name="twitter:title"]', 'content', effectiveTitle);
    updateMeta('meta[name="twitter:description"]', 'content', effectiveDescription);

    // Dynamic robots tag: Stealth noindex on /admin-elsaidy (Fixes SEC-008)
    updateMeta(
      'meta[name="robots"]',
      'content',
      currentPage === 'admin-elsaidy'
        ? 'noindex, nofollow, noarchive'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) {
      canonicalEl.setAttribute('href', `https://elsaidy.org${effectiveCanonicalPath}`);
    }
  }, [currentPage, effectiveTitle, effectiveDescription, effectiveCanonicalPath, allKeywords]);

  if (currentPage === 'admin-elsaidy') {
    return null;
  }

  const graphEntities: Record<string, unknown>[] = [
    {
      '@type': 'WebSite',
      '@id': 'https://elsaidy.org/#website',
      url: 'https://elsaidy.org/',
      name: 'الموقع الرسمي لعائلات الصعيدي في الوطن العربي ومجموعة الصعيدي | ELSAIDY Official Portal',
      alternateName: [
        ...SEO_KEYWORD_CLUSTERS.arabicCore,
        ...SEO_KEYWORD_CLUSTERS.upperEgyptAndSaid,
        ...SEO_KEYWORD_CLUSTERS.hijaziAndHagag,
        ...SEO_KEYWORD_CLUSTERS.englishVariations,
      ],
      description: effectiveDescription,
      inLanguage: 'ar',
    },
    {
      '@type': ['Organization', 'Corporation'],
      '@id': 'https://elsaidy.org/#organization',
      name: 'الموقع الرسمي لعائلات الصعيدي ومجموعة الصعيدي | ELSAIDY GROUP',
      alternateName: [
        'عائلة الصعيدي',
        'آل الصعيدي',
        'ال الصعيدي',
        'قبيلة الصعيدي',
        'الصعيدي',
        'صعيدي',
        'صعيد',
        'الصعيد',
        'صعيد مصر',
        'تاريخ الصعيد',
        'قبائل الصعيد',
        'حجازي',
        'الحجازي',
        'حجاج',
        'الحجاج',
        'مرسي الحجاج',
        'حجاج الصعيدي',
        'حجازي الصعيدي',
        'علي أحمد علي الصعيدي',
        'مجموعة الصعيدي',
        'شركة الصعيدي',
        'مشاريع الصعيدي',
        'ELSAIDY GROUP',
        'Elsaidy Family',
        'Al-Saidy',
        'El-Saidy',
        'Upper Egypt',
        'Hijazi',
        'Hagag',
      ],
      url: 'https://elsaidy.org/',
      description:
        'البوابة الرسمية والمرجع التاريخي والوثائقي الشامل لعائلات الصعيدي وتاريخ الصعيد والامتداد الحجازي (حجازي / حجاج / مرسي الحجاج) في مصر (الغربية، طنطا، الصعيد، الدلتا، القاهرة) والمملكة العربية السعودية (ينبع، حائل، تيماء، الرياض) والشام والخليج العربي، والمنصة الرسمية لمجموعة ومشاريع الصعيدي (ELSAIDY GROUP).',
      keywords: allKeywords,
      knowsAbout: [
        ...SEO_KEYWORD_CLUSTERS.arabicCore,
        ...SEO_KEYWORD_CLUSTERS.upperEgyptAndSaid,
        ...SEO_KEYWORD_CLUSTERS.hijaziAndHagag,
        ...SEO_KEYWORD_CLUSTERS.arabicRegions,
        ...mergedCompoundNames,
      ],
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `https://elsaidy.org${effectiveCanonicalPath}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'الموقع الرسمي لعائلات الصعيدي ومجموعة الصعيدي',
          item: 'https://elsaidy.org/',
        },
        ...(currentPage !== 'home'
          ? [
              {
                '@type': 'ListItem',
                position: 2,
                name: baseConfig.breadcrumbName,
                item: `https://elsaidy.org${baseConfig.canonicalPath}`,
              },
            ]
          : []),
        ...(matchedArticle
          ? [
              {
                '@type': 'ListItem',
                position: 3,
                name: matchedArticle.title,
                item: `https://elsaidy.org${effectiveCanonicalPath}`,
              },
            ]
          : []),
      ],
    },
  ];

  // Scope FAQPage schema strictly to pages where FAQs are visibly rendered (Fixes BUG-005)
  if (currentPage === 'home' || currentPage === 'about') {
    graphEntities.push({
      '@type': 'FAQPage',
      '@id': `https://elsaidy.org${effectiveCanonicalPath}#faq`,
      mainEntity: ENCYCLOPEDIC_FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  // Scope Article schemas with valid ISO-8601 dates to diwan and home (Fixes BUG-005)
  if (currentPage === 'diwan' || currentPage === 'home') {
    const articlesToDescribe = matchedArticle ? [matchedArticle] : articles;
    articlesToDescribe.forEach((article) => {
      const slug = article.slug || article.id;
      const isoDate = toValidIsoDate(article);
      graphEntities.push({
        '@type': 'Article',
        '@id': `https://elsaidy.org/diwan/${slug}#article`,
        mainEntityOfPage: `https://elsaidy.org/diwan/${slug}`,
        headline: article.title,
        description: article.excerpt,
        datePublished: isoDate,
        dateModified: isoDate,
        author: {
          '@type': 'Organization',
          name: article.author,
        },
        publisher: {
          '@id': 'https://elsaidy.org/#organization',
        },
        inLanguage: 'ar',
      });
    });
  }

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': graphEntities,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
    />
  );
};
