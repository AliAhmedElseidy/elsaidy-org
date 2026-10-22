import React, { useEffect } from 'react';
import {
  PageRoute,
  SEO_KEYWORD_CLUSTERS,
  COMPOUND_NAMES_INDEX,
  ENCYCLOPEDIC_FAQS,
  DOCUMENTED_REFERENCES
} from '../data/familyData';

interface SEOManagerProps {
  currentRoute: PageRoute;
}

const ROUTE_SEO_META: Record<
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
      'الموقع الرسمي لعائلات الصعيدي في الوطن العربي ومجموعة الصعيدي | ELSAIDY OFFICIAL PORTAL & BRAND HUB',
    description:
      'المظلة الرسمية لتجمع عائلات الصعيدي في الوطن العربي (مصر، السعودية، الشام والعراق، الخليج، والمغرب العربي والسودان) وواجهة مجموعة وبراند الصعيدي للأعمال والأنظمة الرقمية (elsaidy.org).',
    canonicalPath: '/',
    breadcrumbName: 'الرئيسية'
  },
  about: {
    title:
      'من نحن والتاريخ وسبب التسمية بـ الصعيدي | تجمع عائلات الصعيدي في مصر والسعودية والوطن العربي — elsaidy.org',
    description:
      'الوثيقة التاريخية الكاملة لنسب عائلة الصعيدي (الجد السابع إبراهيم الصعيدي من قبيلة جهينة)، تحقيق سبب التسمية بـ الصعيدي، الامتداد العربي في مصر والسعودية والشام والخليج والمغرب العربي، والمراجع الموثقة.',
    canonicalPath: '/about',
    breadcrumbName: 'من نحن والتاريخ'
  },
  tree: {
    title:
      'شجرة عائلة الصعيدي وفروعها وأعلامها | وثيقة النسب المصورة وفهرس الأسماء — ELSAIDY Family Tree',
    description:
      'استعرض وثيقة شجرة عائلة الصعيدي الرسمية بالتكبير التفاعلي، مع الدليل الهيكلي لأعقاب إبراهيم الصعيدي وعوض البراهيم وفهرس أعلام وأسماء عائلات الصعيدي في مصر والسعودية والوطن العربي.',
    canonicalPath: '/tree',
    breadcrumbName: 'شجرة وفروع العائلة'
  },
  verify: {
    title:
      'ديوان التوثيق وإصدار شهادات النسب وبطاقات العضوية | التحقق الرسمي من وثائق عائلات الصعيدي — elsaidy.org/verify',
    description:
      'بوابة التحقق العام من صحة شهادات النسب ومنظومة الإصدار الرسمية لشهادات الانتساب التاريخية وبطاقات الهوية والعضوية لعائلات الصعيدي في الوطن العربي (ELSAIDY Lineage Verification & ID Suite).',
    canonicalPath: '/verify',
    breadcrumbName: 'التوثيق وشهادات النسب'
  },
  diwan: {
    title:
      'ديوان عائلات الصعيدي والمقالات التاريخية | الأبحاث والوثائق وأخبار مجموعة الصعيدي — elsaidy.org/diwan',
    description:
      'الأرشيف الوثائقي والمنصة المعرفية لديوان عائلات الصعيدي: دراسات تاريخية في مصر (الغربية وطنطا والدلتا والقاهرة والصعيد) والسعودية (ينبع وتيماء وحائل والرياض) والشام والخليج.',
    canonicalPath: '/diwan',
    breadcrumbName: 'الديوان والمقالات'
  },
  portals: {
    title:
      'الأنظمة الرقمية ومشاريع الصعيدي | ELSAIDY Brand, Ventures & Digital Portals (elsaidy.org)',
    description:
      'الواجهة المؤسسية لمجموعة وبراند الصعيدي للأعمال والحلول المتكاملة، منظومة الإدارة والموارد المركزية، نظام البريد الرسمي (@elsaidy.org)، الأرشيف الوثائقي، وبوابة الخدمات التقنية والسحابية.',
    canonicalPath: '/portals',
    breadcrumbName: 'الأنظمة الرقمية ومشاريع الصعيدي'
  }
};

export const SEOManager: React.FC<SEOManagerProps> = ({ currentRoute }) => {
  useEffect(() => {
    const meta = ROUTE_SEO_META[currentRoute] || ROUTE_SEO_META.home;
    document.title = meta.title;

    const allKeywords = [
      ...SEO_KEYWORD_CLUSTERS.arabicCore,
      ...SEO_KEYWORD_CLUSTERS.arabicRegions,
      ...SEO_KEYWORD_CLUSTERS.englishVariations,
      ...COMPOUND_NAMES_INDEX.map((n) => n.arabicName),
      ...COMPOUND_NAMES_INDEX.map((n) => n.englishElsaidy),
      ...COMPOUND_NAMES_INDEX.map((n) => n.englishElseidy)
    ].join(', ');

    const setMetaTag = (selector: string, attribute: string, value: string) => {
      const el = document.querySelector(selector) as HTMLMetaElement | null;
      if (el) {
        el.setAttribute(attribute, value);
      }
    };

    setMetaTag('meta[name="description"]', 'content', meta.description);
    setMetaTag('meta[name="keywords"]', 'content', allKeywords);
    setMetaTag('meta[property="og:title"]', 'content', meta.title);
    setMetaTag('meta[property="og:description"]', 'content', meta.description);
    setMetaTag('meta[name="twitter:title"]', 'content', meta.title);
    setMetaTag('meta[name="twitter:description"]', 'content', meta.description);

    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'https://elsaidy.org';
    const fullUrl = `${origin}${meta.canonicalPath}`;

    setMetaTag('meta[property="og:url"]', 'content', fullUrl);
    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonicalLink) {
      canonicalLink.setAttribute('href', fullUrl);
    }

    const schemaScriptId = 'dynamic-elsaidy-jsonld';
    let scriptEl = document.getElementById(schemaScriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = schemaScriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const jsonLdData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${fullUrl}#webpage`,
          url: fullUrl,
          name: meta.title,
          description: meta.description,
          inLanguage: 'ar',
          isPartOf: { '@id': 'https://elsaidy.org/#website' },
          about: { '@id': 'https://elsaidy.org/#organization' }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'الموقع الرسمي لعائلات الصعيدي في الوطن العربي ومجموعة الصعيدي (elsaidy.org)',
              item: origin
            },
            ...(currentRoute !== 'home'
              ? [
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: meta.breadcrumbName,
                    item: fullUrl
                  }
                ]
              : [])
          ]
        },
        {
          '@type': 'FAQPage',
          mainEntity: ENCYCLOPEDIC_FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer
            }
          }))
        },
        {
          '@type': 'ItemList',
          name: 'المراجع التاريخية الموثقة لعائلة الصعيدي',
          itemListElement: DOCUMENTED_REFERENCES.map((ref, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: ref.verbatimText
          }))
        }
      ]
    };

    scriptEl.textContent = JSON.stringify(jsonLdData);
  }, [currentRoute]);

  return null;
};
