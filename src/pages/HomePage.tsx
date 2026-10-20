import React, { useState } from 'react';
import {
  GEOGRAPHICAL_PRESENCE,
  WHITE_LABELED_PORTALS,
  DIWAN_ARTICLES,
  ENCYCLOPEDIC_FAQS,
  SEO_KEYWORD_CLUSTERS,
  PageRoute,
  WhiteLabeledPortal,
  DiwanArticle
} from '../data/familyData';
import { HeritageAndInfraVisual } from '../components/HeritageAndInfraVisual';
import { ArrowUpLeft, ChevronLeft, FileText, GitBranch, Shield, Search } from 'lucide-react';

interface HomePageProps {
  activeBranchId: string;
  onSelectBranch: (id: string) => void;
  onNavigate: (route: PageRoute) => void;
  onInspectPortal: (portal: WhiteLabeledPortal) => void;
  onReadArticle: (article: DiwanArticle) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  activeBranchId,
  onSelectBranch,
  onNavigate,
  onInspectPortal,
  onReadArticle
}) => {
  const [regionFilter, setRegionFilter] = useState<'all' | 'saudi' | 'egypt' | 'levant-gulf'>('all');

  const filteredPresence = GEOGRAPHICAL_PRESENCE.filter((b) =>
    regionFilter === 'all' ? true : b.countryGroup === regionFilter
  );

  return (
    <div>
      {/* Authoritative Hero Banner */}
      <section className="py-12 lg:py-16 border-b border-[#DCD9D0]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Right Column: Royal/National Archive Editorial Statement */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-[#1B3B2B] mb-3 flex flex-wrap items-center gap-2">
                <span>بسم الله الرحمن الرحيم</span>
                <span aria-hidden="true" className="text-[#8C6D32]">·</span>
                <span className="text-[#8C6D32]">
                  البوابة الوثائقية والتاريخية الرسمية (Elsaidy / Elseidy / Alsaidi Family)
                </span>
              </div>

              <h1
                className="font-display font-bold text-[#141413] tracking-tight leading-[1.2] mb-6"
                style={{ fontSize: 'clamp(2.35rem, 4.2vw, 3.65rem)', textWrap: 'balance' }}
              >
                الموقع الرسمي لعائلة الصعيدي — إرثٌ راسخٌ في الجزيرة العربية ومصر وبلاد الشام والخليج
              </h1>

              <p className="font-display text-lg lg:text-xl text-zinc-800 leading-[1.9] mb-5 text-justify">
                مرحباً بكم في البوابة الرسمية والموسوعة الوثائقية لـ{' '}
                <strong className="text-[#1B3B2B]">عائلة الصعيدي (آل الصعيدي)</strong> بمحافظة تيماء
                ومنطقة حائل والرياض وتبوك والخليج العربي (الإمارات وسلطنة عُمان) وجبل العرب ببلاد
                الشام وجمهورية مصر العربية (محافظة الغربية وطنطا والدلتا والقاهرة والصعيد)، التي
                ترجع في عمود نسبها إلى{' '}
                <strong className="text-[#8C6D32]">الجد السابع إبراهيم الصعيدي</strong> من{' '}
                <strong className="text-[#141413]">قبيلة جهينة</strong> من{' '}
                <strong className="text-[#141413]">ينبع النخل</strong> بالساحل الغربي لشبه الجزيرة
                العربية، وتفرعت من ابنه <strong className="text-[#141413]">عوض البراهيم</strong> عبر
                أبنائه الثلاثة: <strong>عبد الله، وسلامة، وصالح</strong>.
              </p>

              <p className="text-sm text-zinc-600 leading-[1.8] pb-6 mb-6 border-b border-[#DCD9D0]">
                أُنشئت هذه المنصة المؤسسية (<span className="font-mono text-[#8C6D32]">elsaidy.org</span>)
                لاستغلال الوسائل الحديثة التي تلمّ الشمل وتزيد من حبل التواصل وتزرع المحبة بين أبناء
                العائلة في كافة الأقطار، ونقل إرث الآباء والأجداد الذين كانوا مضرباً للمثل بالشهامة
                والمروءة والوفاء للأجيال الحالية والقادمة.
              </p>
            </div>

            {/* Primary Hero Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="px-6 py-3 bg-[#1B3B2B] text-[#F8F7F4] text-xs font-semibold hover:bg-[#141413] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>مطالعة الوثيقة التاريخية الكاملة</span>
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('tree')}
                className="px-5 py-3 bg-[#F1EFEA] border border-[#DCD9D0] text-[#141413] text-xs font-semibold hover:border-[#8C6D32] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                وثيقة شجرة وفروع العائلة
              </button>

              <button
                type="button"
                onClick={() => onNavigate('portals')}
                className="px-4 py-3 text-xs font-semibold text-[#8C6D32] hover:text-[#141413] underline underline-offset-8 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                البوابات والأنظمة الرقمية
              </button>
            </div>
          </div>

          {/* Left Column: Interactive Archival Genealogy & Map Plate */}
          <div className="lg:col-span-6 flex">
            <HeritageAndInfraVisual
              activeBranchId={activeBranchId}
              onSelectBranch={onSelectBranch}
            />
          </div>
        </div>

        {/* Executive Quick-Access Bar (Leading to Historical Document, Family Tree, and Official Digital Portals) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 border-t border-r border-[#DCD9D0] bg-[#F1EFEA]">
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="p-6 border-b border-l border-[#DCD9D0] text-right hover:bg-[#F8F7F4] transition-colors flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#8C6D32] font-semibold mb-2">
                <span>٠١ · الوثيقة التاريخية والمراجع</span>
                <FileText className="w-4 h-4 text-[#1B3B2B]" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#141413] mb-1">
                من نحن والتاريخ وسبب التسمية
              </h2>
              <p className="text-xs text-zinc-600 leading-relaxed">
                النص التوثيقي الكامل لنسب العائلة، سبب التسمية بـ «الصعيدي»، الامتداد في مصر
                والحجاز والشام والخليج، والمراجع التاريخية الموثقة للخطيب والجاسر والبتنوني.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#DCD9D0] text-xs font-semibold text-[#1B3B2B] flex items-center justify-between">
              <span>الانتقال إلى صفحة الوثيقة التاريخية</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('tree')}
            className="p-6 border-b border-l border-[#DCD9D0] text-right hover:bg-[#F8F7F4] transition-colors flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#8C6D32] font-semibold mb-2">
                <span>٠٢ · المشجرة الوثائقية وفهرس الأعلام</span>
                <GitBranch className="w-4 h-4 text-[#1B3B2B]" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#141413] mb-1">
                شجرة وفروع وأعلام عائلة الصعيدي
              </h2>
              <p className="text-xs text-zinc-600 leading-relaxed">
                مستعرض وثيقة شجرة العائلة الرسمية بالتكبير التفاعلي، الدليل الهيكلي لأعقاب إبراهيم
                الصعيدي، والفهرس الشامل لأسماء وأعلام العائلة بالعربية والإنجليزية.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#DCD9D0] text-xs font-semibold text-[#1B3B2B] flex items-center justify-between">
              <span>الانتقال إلى شجرة وفروع العائلة</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('portals')}
            className="p-6 border-b border-l border-[#DCD9D0] text-right hover:bg-[#F8F7F4] transition-colors flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#8C6D32] font-semibold mb-2">
                <span>٠٣ · المنظومة الرقمية والخدمات</span>
                <Shield className="w-4 h-4 text-[#1B3B2B]" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#141413] mb-1">
                البوابات والأنظمة الرقمية الرسمية
              </h2>
              <p className="text-xs text-zinc-600 leading-relaxed">
                الدخول الموحد إلى منظومة الإدارة والموارد المركزية، نظام البريد الرسمي
                (@elsaidy.org)، الأرشيف الوثائقي، والخدمات السحابية.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#DCD9D0] text-xs font-semibold text-[#1B3B2B] flex items-center justify-between">
              <span>الانتقال إلى دليل البوابات الرقمية</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </section>

      {/* Structured Geographical Distribution Grid (شبكة الانتشار الجغرافي ومنازل العائلة) */}
      <section className="py-16 lg:py-20 border-b border-[#DCD9D0]">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-semibold text-[#8C6D32] mb-2">
              الأطلس الجغرافي الموسوعي الموثق · الحواضر والمنازل العربية
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#141413]">
              الانتشار الجغرافي لعائلة الصعيدي في السعودية ومصر وبلاد الشام والخليج
            </h2>
          </div>

          {/* Regional Filter Tabs */}
          <div
            className="flex flex-wrap items-center gap-1 bg-[#F1EFEA] border border-[#DCD9D0] p-1"
            role="tablist"
            aria-label="تصفية الأقاليم الجغرافية"
          >
            {[
              { id: 'all' as const, label: 'كافة الأقطار (١١ حاضرة)' },
              { id: 'saudi' as const, label: 'السعودية (ينبع وتيماء وحائل والرياض وتبوك)' },
              { id: 'egypt' as const, label: 'مصر (الغربية وطنطا والدلتا والقاهرة والصعيد)' },
              { id: 'levant-gulf' as const, label: 'الشام والإمارات وعُمان' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={regionFilter === tab.id}
                onClick={() => setRegionFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  regionFilter === tab.id
                    ? 'bg-[#1B3B2B] text-[#F8F7F4] font-semibold'
                    : 'text-zinc-700 hover:text-[#141413]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Crisp 1px Structural Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-r border-[#DCD9D0]">
          {filteredPresence.map((branch) => {
            const isSelected = branch.id === activeBranchId;
            return (
              <div
                key={branch.id}
                onClick={() => onSelectBranch(branch.id)}
                className={`p-6 border-b border-l border-[#DCD9D0] flex flex-col justify-between transition-colors cursor-pointer ${
                  isSelected ? 'bg-[#F1EFEA]' : 'bg-[#F8F7F4] hover:bg-[#F1EFEA]/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs mb-3">
                    <span className="font-mono font-semibold text-[#8C6D32]">
                      المقر {branch.index} · {branch.countryLabel}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[#141413] mb-2">
                    {branch.regionName}
                  </h3>

                  <div className="text-xs font-semibold text-[#1B3B2B] mb-3 pb-2.5 border-b border-[#DCD9D0]">
                    {branch.keyFigures}
                  </div>

                  <p className="text-xs text-zinc-700 leading-[1.85] mb-4">
                    {branch.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#DCD9D0] text-[11px] text-zinc-500">
                  {branch.lineagePath}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Executive Summary of the 4 Official Digital Portals */}
      <section className="py-16 lg:py-20 border-b border-[#DCD9D0]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-[#8C6D32] mb-2">
              البنية المؤسسية الرقمية · نطاق elsaidy.org الموحد
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#141413]">
              المنظومات والبوابات الرقمية الرسمية المعتمدة
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('portals')}
            className="px-5 py-2.5 bg-[#141413] text-[#F8F7F4] text-xs font-semibold hover:bg-[#1B3B2B] transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start md:self-end"
          >
            استعراض الدليل الكامل للبوابات الرقمية
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-r border-[#DCD9D0] mb-16">
          {WHITE_LABELED_PORTALS.map((portal) => (
            <div
              key={portal.id}
              onClick={() => onInspectPortal(portal)}
              className="p-7 border-b border-l border-[#DCD9D0] bg-[#F8F7F4] hover:bg-[#F1EFEA]/70 transition-colors flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-[#8C6D32] font-semibold mb-2">
                  <span>المنظومة {portal.index} · {portal.accessClassification}</span>
                  <span className="font-mono text-[11px] text-zinc-500">{portal.domain}</span>
                </div>

                <h3 className="font-display text-2xl font-bold text-[#141413] mb-1">
                  {portal.officialName}
                </h3>

                <div className="text-xs font-medium text-[#1B3B2B] mb-3">
                  {portal.portalSubTitle}
                </div>

                <p className="text-xs text-zinc-700 leading-[1.85] mb-5">
                  {portal.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#DCD9D0] flex items-center justify-between text-xs font-semibold text-[#1B3B2B]">
                <span>فتح نافذة الدخول والتوجيه المباشر</span>
                <ArrowUpLeft className="w-4 h-4 text-[#8C6D32]" />
              </div>
            </div>
          ))}
        </div>

        {/* Latest Diwan Articles Strip */}
        <div className="bg-[#F1EFEA] border border-[#DCD9D0] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-[#DCD9D0]">
            <div>
              <div className="text-xs font-semibold text-[#8C6D32]">
                الأرشيف الوثائقي والمنصة المعرفية
              </div>
              <h3 className="font-display text-2xl font-bold text-[#141413] mt-0.5">
                أحدث الدراسات والبيانات في ديوان العائلة
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('diwan')}
              className="text-xs font-semibold text-[#1B3B2B] hover:text-[#8C6D32] underline underline-offset-8 cursor-pointer"
            >
              تصفح كافة مقالات الديوان ({DIWAN_ARTICLES.length} دراسات) ←
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DIWAN_ARTICLES.slice(0, 3).map((art) => (
              <article
                key={art.id}
                onClick={() => onReadArticle(art)}
                className="p-5 bg-[#F8F7F4] border border-[#DCD9D0] hover:border-[#8C6D32] transition-colors flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="text-[11px] text-[#8C6D32] font-semibold mb-2">
                    {art.categoryLabel} · {art.hijriDate}
                  </div>
                  <h4 className="font-display text-lg font-bold text-[#141413] leading-snug mb-2">
                    {art.title}
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#DCD9D0] text-xs font-semibold text-[#1B3B2B] flex items-center justify-between">
                  <span>مطالعة الدراسة</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Encyclopedic Reference FAQ & Search Index Section */}
      <section className="py-16 lg:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold text-[#8C6D32] mb-2 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#1B3B2B]" />
              <span>الدليل المرجعي والموسوعي الشامل · فهرس البحث المعتمد</span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#141413]">
              الأسئلة المرجعية الشائعة حول تاريخ ونسب وحواضر عائلة الصعيدي
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('tree')}
            className="text-xs font-semibold text-[#1B3B2B] hover:text-[#8C6D32] underline underline-offset-8 cursor-pointer whitespace-nowrap shrink-0"
          >
            الانتقال إلى فهرس الأعلام والأسماء المركبة ←
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-r border-[#DCD9D0] mb-10">
          {ENCYCLOPEDIC_FAQS.map((faq, idx) => (
            <div
              key={faq.id}
              className="p-7 border-b border-l border-[#DCD9D0] bg-[#F8F7F4] flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-mono font-semibold text-[#8C6D32] mb-2">
                  مسألة مرجعية ٠{idx + 1}
                </div>
                <h3 className="font-display text-2xl font-bold text-[#141413] mb-3">
                  {faq.question}
                </h3>
                <p className="text-sm text-zinc-700 leading-[1.9] text-justify">
                  {faq.answer}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#DCD9D0] flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
                <span className="font-semibold text-[#1B3B2B]">الكلمات الدلالية:</span>
                <span>{faq.keywords.join(' · ')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Orthographic & Linguistic Index Box (Arabic & English Variations) */}
        <div className="bg-[#F1EFEA] border border-[#DCD9D0] p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DCD9D0] pb-3">
            <h3 className="font-display text-xl font-bold text-[#141413]">
              فهرس المطابقة اللغوية والجغرافية المعتمد في محركات البحث والأرشيف الدولي
            </h3>
            <span className="font-mono text-xs text-[#8C6D32]">
              Official Orthographic & Regional Index — elsaidy.org
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs leading-relaxed">
            <div className="p-4 bg-[#F8F7F4] border border-[#DCD9D0]">
              <div className="font-semibold text-[#1B3B2B] mb-1.5">
                ١. الصيغ والمسميات العربية المعتمدة:
              </div>
              <p className="text-zinc-700">
                {SEO_KEYWORD_CLUSTERS.arabicCore.join(' · ')}
              </p>
            </div>

            <div className="p-4 bg-[#F8F7F4] border border-[#DCD9D0]">
              <div className="font-semibold text-[#1B3B2B] mb-1.5">
                ٢. النطاق الجغرافي والحواضر الموثقة:
              </div>
              <p className="text-zinc-700">
                {SEO_KEYWORD_CLUSTERS.arabicRegions.join(' · ')}
              </p>
            </div>

            <div className="p-4 bg-[#F8F7F4] border border-[#DCD9D0]" dir="ltr">
              <div className="font-semibold text-[#1B3B2B] mb-1.5 text-right" dir="rtl">
                ٣. الصيغ الإنجليزية المعتمدة (English Transliterations):
              </div>
              <p className="font-mono text-[11px] text-zinc-700 leading-relaxed">
                {SEO_KEYWORD_CLUSTERS.englishVariations.join(' · ')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
