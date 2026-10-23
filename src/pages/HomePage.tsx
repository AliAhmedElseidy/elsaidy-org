import React, { useState } from 'react';
import {
  PAN_ARAB_REGIONS,
  GEOGRAPHICAL_PRESENCE,
  WHITE_LABELED_PORTALS,
  DIWAN_ARTICLES,
  ENCYCLOPEDIC_FAQS,
  SEO_KEYWORD_CLUSTERS,
  DEFAULT_SITE_CONFIG,
  PageRoute,
  WhiteLabeledPortal,
  DiwanArticle,
  SiteConfig
} from '../data/familyData';
import { HeritageAndInfraVisual } from '../components/HeritageAndInfraVisual';
import {
  ArrowUpLeft,
  ChevronLeft,
  FileText,
  GitBranch,
  Shield,
  Search,
  Building2,
  Globe2,
  Mail,
  Award
} from 'lucide-react';

interface HomePageProps {
  activeBranchId: string;
  onSelectBranch: (id: string) => void;
  onNavigate: (route: PageRoute) => void;
  onInspectPortal: (portal: WhiteLabeledPortal) => void;
  onReadArticle: (article: DiwanArticle) => void;
  onOpenCorporateInquiry: () => void;
  siteConfig?: SiteConfig;
  articles?: DiwanArticle[];
}

export const HomePage: React.FC<HomePageProps> = ({
  activeBranchId,
  onSelectBranch,
  onNavigate,
  onInspectPortal,
  onReadArticle,
  onOpenCorporateInquiry,
  siteConfig = DEFAULT_SITE_CONFIG,
  articles = DIWAN_ARTICLES
}) => {
  const [regionFilter, setRegionFilter] = useState<
    'all' | 'egypt' | 'saudi' | 'levant-iraq' | 'gulf' | 'maghreb-sudan'
  >('all');

  const filteredPresence = GEOGRAPHICAL_PRESENCE.filter((b) =>
    regionFilter === 'all' ? true : b.countryGroup === regionFilter
  );

  const hero = siteConfig?.heroSection || DEFAULT_SITE_CONFIG.heroSection;
  const activePortals =
    siteConfig?.digitalPortals && siteConfig.digitalPortals.length > 0
      ? siteConfig.digitalPortals
      : WHITE_LABELED_PORTALS;

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-24 py-6 sm:py-8 lg:py-12">
      {/* 1. Interactive Pan-Arab Atlas & Genealogy Plate (Complements the Static LCP Hero Masthead) */}
      <section className="rounded-2xl bg-white border border-[#E6E2D8] shadow-sm p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0F291E]/10 text-[#0F291E] text-xs font-extrabold">
              <Globe2 className="w-4 h-4 text-[#695022]" />
              <span>الأطلس الوثائقي التفاعلي · {hero.topBadge}</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#141413] leading-snug">
              خريطة انتشار وفروع عائلات الصعيدي والمنظومة الرقمية
            </h2>
            <p className="text-sm text-zinc-700 leading-relaxed text-justify">
              استعرض التوزيع الجغرافي الموثق لفروع عائلات الصعيدي (إبراهيم الصعيدي، عوض البراهيم، مرسي الحجاج، والامتداد الحجازي والمصري) عبر أقاليم الجمهورية والعالم العربي، مع إمكانية الوصول المباشر إلى سجل التوثيق والمشجرة التفاعلية.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('tree')}
                className="px-4 py-2.5 rounded-xl bg-[#0F291E] text-white text-xs font-extrabold hover:bg-[#141E28] transition-all flex items-center gap-2 cursor-pointer"
              >
                <GitBranch className="w-4 h-4 text-[#D4AF37]" />
                <span>{hero.primaryBtnText}</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('verify')}
                className="px-4 py-2.5 rounded-xl bg-[#F7F6F2] hover:bg-[#EFECE6] text-[#141413] border border-[#D4AF37]/60 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4 text-[#695022]" />
                <span>{hero.secondaryBtnText}</span>
              </button>
              <button
                type="button"
                onClick={onOpenCorporateInquiry}
                className="px-3 py-2 text-xs font-bold text-[#695022] hover:text-[#0F291E] underline underline-offset-8 transition-colors cursor-pointer"
              >
                طلب بريد رسمي (@elsaidy.org) ←
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 flex text-[#141413]">
            <HeritageAndInfraVisual
              activeBranchId={activeBranchId}
              onSelectBranch={onSelectBranch}
            />
          </div>
        </div>
      </section>

      {/* 2. PAN-ARAB EXPANSION: تجمع عائلات الصعيدي في الوطن العربي (Egypt First, then Saudi, Levant, Gulf, Maghreb) */}
      <section>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#695022] mb-2">
              <Globe2 className="w-4 h-4 text-[#0F291E]" />
              <span>المظلة العربية الكبرى · انتشار عائلات الصعيدي في ١٤+ دولة عربية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#141413] tracking-tight">
              تجمع عائلات الصعيدي في الوطن العربي
            </h2>
            <p className="text-sm sm:text-base text-zinc-700 mt-2 leading-relaxed">
              توثيق شامل للأقاليم الخمسة الكبرى لتجمع عائلات الصعيدي (آل الصعيدي — Elsaidy / Elseidy)
              مرتبةً حسب الثقل السكاني والركائز التاريخية في مصر والسعودية والشام والخليج والمغرب
              العربي والسودان.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="px-5 py-2.5 rounded-xl bg-[#0F291E] text-white text-xs font-bold hover:bg-[#141E28] transition-colors cursor-pointer self-start lg:self-end shrink-0"
          >
            مطالعة التاريخ التفصيلي للأقاليم ←
          </button>
        </div>

        {/* The 5 Pan-Arab Umbrella Regions (Luxury Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {PAN_ARAB_REGIONS.map((region, idx) => (
            <div
              key={region.id}
              className={`bg-white rounded-xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between ${
                idx === 0 ? 'md:col-span-2 lg:col-span-2 bg-gradient-to-br from-white to-[#F7F6F2]' : ''
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-md bg-[#0F291E]/10 text-[#0F291E] text-xs font-extrabold">
                    الإقليم {region.orderIndex}
                  </span>
                  <span className="font-mono text-[11px] text-[#695022] font-bold" dir="ltr">
                    {region.englishTitle.split('(')[0]}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-[#141413] mb-2">
                  {region.title}
                </h3>

                <div className="text-xs font-bold text-[#695022] mb-4">
                  {region.historicalRole}
                </div>

                <p className="text-sm text-zinc-700 leading-[1.85] mb-5 text-justify">
                  {region.summary}
                </p>

                <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]">
                  <div className="text-xs font-bold text-[#0F291E] mb-2">
                    أبرز الحواضر والمراكز المسجلة:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {region.keyHubs.map((hub, hIdx) => (
                      <span
                        key={hIdx}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#E6E2D8] text-xs font-semibold text-[#141413]"
                      >
                        {hub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Interactive Regional Hubs Filter & Cards */}
        <div className="bg-white rounded-2xl border border-[#E6E2D8] p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E6E2D8]">
            <div>
              <div className="text-xs font-bold text-[#695022] mb-1">
                الأطلس التفصيلي للحواضر والمقار التاريخية
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#141413]">
                دليل الحواضر والمنازل التفصيلية لعائلات الصعيدي
              </h3>
            </div>

            <div
              className="flex flex-wrap items-center gap-1.5 bg-[#F7F6F2] border border-[#E2DDD3] rounded-xl p-1.5"
              role="tablist"
              aria-label="تصفية الحواضر العربية"
            >
              {[
                { id: 'all' as const, label: 'جميع الأقطار (١٢)' },
                { id: 'egypt' as const, label: '١. مصر' },
                { id: 'saudi' as const, label: '٢. السعودية' },
                { id: 'levant-iraq' as const, label: '٣. الشام والعراق' },
                { id: 'gulf' as const, label: '٤. الخليج العربي' },
                { id: 'maghreb-sudan' as const, label: '٥. المغرب العربي والسودان' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={regionFilter === tab.id}
                  onClick={() => setRegionFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    regionFilter === tab.id
                      ? 'bg-[#0F291E] text-white shadow-sm'
                      : 'text-zinc-700 hover:text-[#141413]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPresence.map((branch) => {
              const isSelected = branch.id === activeBranchId;
              return (
                <div
                  key={branch.id}
                  onClick={() => onSelectBranch(branch.id)}
                  className={`rounded-xl border border-t-4 border-t-[#695022] p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-[#F7F6F2] border-[#695022] shadow-md'
                      : 'bg-white border-[#E6E2D8] shadow-sm hover:shadow-xl hover:-translate-y-0.5'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs mb-3">
                      <span className="font-bold text-[#695022]">
                        الحاضرة {branch.index} · {branch.countryLabel}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-extrabold text-[#141413] mb-2">
                      {branch.regionName}
                    </h4>

                    <div className="text-xs font-bold text-[#0F291E] mb-3 pb-2.5 border-b border-[#E6E2D8]">
                      {branch.keyFigures}
                    </div>

                    <p className="text-xs text-zinc-700 leading-[1.85] mb-4">
                      {branch.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E6E2D8] text-[11px] font-medium text-zinc-600">
                    {branch.lineagePath}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. ELSAIDY BRAND & ENTERPRISE VENTURES (مجموعة وبراند الصعيدي — ELSAIDY Group & Digital Infrastructure) */}
      <section>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#695022] mb-2">
              <Building2 className="w-4 h-4 text-[#0F291E]" />
              <span>مجموعة وبراند الصعيدي · ELSAIDY GROUP & DIGITAL INFRASTRUCTURE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#141413] tracking-tight">
              براند ومشاريع الصعيدي والمنظومات الرقمية المعتمدة
            </h2>
            <p className="text-sm sm:text-base text-zinc-700 mt-2 leading-relaxed">
              تعمل مجموعة وبراند الصعيدي (<span className="font-mono font-semibold">elsaidy.org</span>)
              كمظلة مؤسسية وتقنية حديثة تجمع بين واجهة المشروعات وتطوير الأعمال وبين الأنظمة الرقمية
              والبريد الرسمي الموحد والأرشيف المعرفي.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenCorporateInquiry}
              className="px-5 py-3 rounded-xl bg-[#695022] text-white text-xs font-extrabold hover:bg-[#533f1b] shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>طلب بريد رسمي (@elsaidy.org) أو تواصل للأعمال والمشاريع</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('portals')}
              className="px-5 py-3 rounded-xl bg-[#0F291E] text-white text-xs font-bold hover:bg-[#141E28] transition-all cursor-pointer"
            >
              الدليل الكامل للأنظمة والبراند ←
            </button>
          </div>
        </div>

        {/* 5 Official ELSAIDY Brand Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {activePortals.map((portal, idx) => (
            <div
              key={portal.id}
              onClick={() => onInspectPortal(portal)}
              className={`bg-white rounded-xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                idx === 0 ? 'md:col-span-2 lg:col-span-2 bg-gradient-to-br from-white to-[#F7F6F2]' : ''
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#695022] mb-3">
                  <span>الركيزة {portal.index} · {portal.accessClassification}</span>
                  <span className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-[#F7F6F2] border border-[#E6E2D8] text-[#0F291E]">
                    {portal.domain}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-[#141413] mb-2 leading-snug">
                  {portal.officialName}
                </h3>

                <div className="text-xs font-bold text-[#0F291E] mb-3">
                  {portal.portalSubTitle}
                </div>

                <p className="text-sm text-zinc-700 leading-[1.85] mb-6">
                  {portal.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E6E2D8] flex items-center justify-between text-xs font-extrabold text-[#0F291E] group-hover:text-[#695022] transition-colors">
                <span>الدخول للبوابة / استعراض البطاقة المؤسسية</span>
                <ArrowUpLeft className="w-4 h-4 text-[#695022]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Latest Diwan Studies & Encyclopedic FAQ Section */}
      <section className="space-y-12">
        {/* Latest Diwan Articles Card */}
        <div className="bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-10 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E6E2D8]">
            <div>
              <div className="text-xs font-bold text-[#695022] mb-1">
                الأرشيف الوثائقي والمنصة المعرفية (ELSAIDY Knowledge Cloud)
              </div>
              <h3 className="text-2xl font-extrabold text-[#141413]">
                أحدث الدراسات والبيانات في ديوان عائلات الصعيدي
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('diwan')}
              className="px-4 py-2 rounded-lg bg-[#F7F6F2] border border-[#E6E2D8] text-xs font-bold text-[#0F291E] hover:border-[#695022] transition-colors cursor-pointer"
            >
              تصفح كافة مقالات الديوان ({articles.length} دراسات) ←
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((art) => (
              <article
                key={art.id}
                onClick={() => onReadArticle(art)}
                className="p-6 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] hover:border-[#695022] hover:bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="text-[11px] text-[#695022] font-bold mb-2">
                    {art.categoryLabel} · {art.hijriDate}
                  </div>
                  <h4 className="text-base sm:text-lg font-extrabold text-[#141413] leading-snug mb-2.5">
                    {art.title}
                  </h4>
                  <p className="text-xs text-zinc-700 leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#E6E2D8] text-xs font-bold text-[#0F291E] flex items-center justify-between">
                  <span>مطالعة الدراسة الكاملة</span>
                  <ChevronLeft className="w-3.5 h-3.5 text-[#695022]" />
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Encyclopedic FAQ & Orthographic Index */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="max-w-3xl">
              <div className="text-xs font-bold text-[#695022] mb-2 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#0F291E]" />
                <span>الدليل المرجعي والموسوعي الشامل · فهرس البحث المعتمد</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141413]">
                الأسئلة المرجعية الشائعة حول تاريخ وتجمع عائلات وبراند الصعيدي
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('tree')}
              className="text-xs font-bold text-[#0F291E] hover:text-[#695022] underline underline-offset-8 cursor-pointer whitespace-nowrap shrink-0"
            >
              الانتقال إلى فهرس الأعلام والأسماء المركبة ←
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {ENCYCLOPEDIC_FAQS.map((faq, idx) => (
              <div
                key={faq.id}
                className="p-6 sm:p-8 rounded-xl bg-white border border-[#E6E2D8] border-t-4 border-t-[#695022] shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-[#695022] mb-2">
                    مسألة مرجعية ٠{idx + 1}
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#141413] mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-zinc-700 leading-[1.9] text-justify">
                    {faq.answer}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#E6E2D8] flex flex-wrap items-center gap-2 text-[11px] text-zinc-600">
                  <span className="font-bold text-[#0F291E]">الكلمات الدلالية:</span>
                  <span>{faq.keywords.join(' · ')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Clean Archival & Linguistic Reference Summary (Replaces Keyword Stuffing Dump — SEO-005) */}
          <div className="bg-white rounded-xl border border-[#E6E2D8] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-extrabold text-[#141413]">
                الفهرس الوثائقي الموحد لأعلام وفروع عائلات الصعيدي في الوطن العربي
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                يعتمد الأرشيف الرسمي مطابقة الأسماء الثلاثية والمركبة وصيغ كتابتها المعتمدة باللغتين العربية والإنجليزية (Elsaidy / Elseidy / Alsaidi) في كافة الأقاليم العربية.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('tree')}
              className="px-5 py-2.5 rounded-xl bg-[#0F291E] text-white text-xs font-bold hover:bg-[#141E28] transition-colors cursor-pointer shrink-0"
            >
              تصفح دليل الأعلام والشجرة ←
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
