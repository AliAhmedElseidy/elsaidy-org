import React, { useEffect } from 'react';
import {
  PageRoute,
  SEO_KEYWORD_CLUSTERS,
  ENCYCLOPEDIC_FAQS,
  DIWAN_ARTICLES,
  COMPOUND_NAMES_INDEX,
} from '../data/familyData';

interface SEOManagerProps {
  currentPage: PageRoute;
  customNames?: string[];
}

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
    canonicalPath: '/projects',
    breadcrumbName: 'مجموعة ومشاريع الصعيدي',
  },
  'admin-elsaidy': {
    title: 'لوحة القيادة والإدارة المركزية | ELSAIDY Cloud CMS',
    description: 'لوحة التحكم المركزية لإدارة الديوان والشهادات والموسوعة والربط السحابي.',
    canonicalPath: '/admin-elsaidy',
    breadcrumbName: 'لوحة القيادة المركزية',
  },
};

export const SEOManager: React.FC<SEOManagerProps> = ({ currentPage, customNames }) => {
  const config = PAGE_SEO_CONFIG[currentPage] || PAGE_SEO_CONFIG.home;

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
    document.title = config.title;

    const updateMeta = (selector: string, attr: string, value: string) => {
      const el = document.querySelector(selector);
      if (el) {
        el.setAttribute(attr, value);
      }
    };

    updateMeta('meta[name="description"]', 'content', config.description);
    updateMeta('meta[name="keywords"]', 'content', allKeywords);
    updateMeta('meta[property="og:title"]', 'content', config.title);
    updateMeta('meta[property="og:description"]', 'content', config.description);
    updateMeta(
      'meta[property="og:url"]',
      'content',
      `https://elsaidy.org${config.canonicalPath}`
    );
    updateMeta('meta[name="twitter:title"]', 'content', config.title);
    updateMeta('meta[name="twitter:description"]', 'content', config.description);

    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) {
      canonicalEl.setAttribute('href', `https://elsaidy.org${config.canonicalPath}`);
    }
  }, [currentPage, config, allKeywords]);

  const jsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
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
        description: config.description,
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
        '@id': `https://elsaidy.org${config.canonicalPath}#breadcrumb`,
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
                  name: config.breadcrumbName,
                  item: `https://elsaidy.org${config.canonicalPath}`,
                },
              ]
            : []),
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `https://elsaidy.org${config.canonicalPath}#faq`,
        mainEntity: ENCYCLOPEDIC_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
      ...DIWAN_ARTICLES.map((article) => ({
        '@type': 'Article',
        '@id': `https://elsaidy.org/diwan#${article.id}`,
        headline: article.title,
        description: article.excerpt,
        datePublished: article.publishDate,
        author: {
          '@type': 'Organization',
          name: article.author,
        },
        publisher: {
          '@id': 'https://elsaidy.org/#organization',
        },
        inLanguage: 'ar',
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
    />
  );
};
