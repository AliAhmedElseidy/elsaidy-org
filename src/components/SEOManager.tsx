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
      'الموقع الرسمي لعائلة الصعيدي | شجرة ونسب وتاريخ عائلة الصعيدي — Elsaidy & Elseidy Family (elsaidy.org)',
    description:
      'البوابة الرسمية والموسوعة التاريخية لعائلة الصعيدي (آل الصعيدي — Elsaidy / Elseidy / Alsaidi) من قبيلة جهينة في ينبع النخل وتيماء وحائل والرياض وتبوك ومصر (الغربية وطنطا والدلتا والقاهرة والصعيد) والشام والإمارات وعمان.',
    canonicalPath: '/',
    breadcrumbName: 'الرئيسية'
  },
  about: {
    title:
      'من نحن والتاريخ وسبب التسمية بـ الصعيدي | أصل ونسب عائلة الصعيدي في السعودية ومصر والشام والخليج — elsaidy.org',
    description:
      'الوثيقة التاريخية الكاملة لنسب عائلة الصعيدي (الجد السابع إبراهيم الصعيدي من قبيلة جهينة)، تحقيق سبب التسمية بـ الصعيدي، الامتداد في مصر (الغربية وطنطا والدلتا والقاهرة والصعيد)، والمراجع الموثقة.',
    canonicalPath: '/about',
    breadcrumbName: 'من نحن والتاريخ'
  },
  tree: {
    title:
      'شجرة عائلة الصعيدي وفروعها وأعلامها | وثيقة النسب المصورة وفهرس الأسماء — Elsaidy / Elseidy Family Tree',
    description:
      'استعرض وثيقة شجرة عائلة الصعيدي الرسمية بالتكبير التفاعلي، مع الدليل الهيكلي لأعقاب إبراهيم الصعيدي وعوض البراهيم وفهرس أعلام وأسماء عائلة الصعيدي (علي أحمد علي الصعيدي، إبراهيم الصعيدي، عوض الصعيدي) في السعودية ومصر والشام والخليج.',
    canonicalPath: '/tree',
    breadcrumbName: 'شجرة وفروع العائلة'
  },
  diwan: {
    title:
      'ديوان عائلة الصعيدي والمقالات التاريخية | الأبحاث والوثائق وأخبار آل الصعيدي — elsaidy.org/diwan',
    description:
      'الأرشيف الوثائقي والمنصة المعرفية لديوان عائلة الصعيدي: دراسات تاريخية في نسب جهينة وينبع النخل، تاريخ عائلة الصعيدي في مصر (الغربية وطنطا والدلتا والقاهرة والصعيد)، وبيانات الأمانة العامة.',
    canonicalPath: '/diwan',
    breadcrumbName: 'الديوان والمقالات'
  },
  portals: {
    title:
      'البوابات والأنظمة الرقمية الرسمية لعائلة الصعيدي | الإدارة والبريد الرسمي (@elsaidy.org) والأرشيف الوثائقي',
    description:
      'الدليل التنفيذي للبوابات الرقمية الرسمية المعتمدة لعائلة الصعيدي: منظومة الإدارة والموارد المركزية، نظام المراسلات والبريد الرسمي (@elsaidy.org)، الأرشيف الوثائقي، وبوابة الخدمات التقنية والسحابية.',
    canonicalPath: '/portals',
    breadcrumbName: 'البوابات والأنظمة الرقمية'
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
      let el = document.querySelector(selector) as HTMLMetaElement | null;
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

    // Inject / Update dynamic route JSON-LD Schema
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
              name: 'الموقع الرسمي لعائلة الصعيدي (elsaidy.org)',
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
