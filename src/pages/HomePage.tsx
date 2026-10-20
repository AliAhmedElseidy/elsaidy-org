import React from 'react';
import {
  GEOGRAPHICAL_PRESENCE,
  WHITE_LABELED_PORTALS,
  DIWAN_ARTICLES,
  PageRoute,
  WhiteLabeledPortal,
  DiwanArticle
} from '../data/familyData';
import { HeritageAndInfraVisual } from '../components/HeritageAndInfraVisual';
import { ArrowUpLeft, ChevronLeft, BookOpen, Shield, Landmark } from 'lucide-react';

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
  return (
    <div>
      {/* Institutional Archival Ribbon */}
      <div className="py-3 border-b border-[#E2DFD7] flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-600">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-[#8C6D32]">الأمانة العامة والتوثيق التاريخي</span>
          <span aria-hidden="true">·</span>
          <span>النسب: قبيلة جهينة (ينبع النخل)</span>
          <span aria-hidden="true">·</span>
          <span>الجد السابع الجامع: إبراهيم الصعيدي ← ابنه عوض البراهيم</span>
        </div>
        <div className="font-mono text-[11px] text-zinc-500 tabular-nums">
          ELSAIDY.ORG · ARCHIVAL EDITION
        </div>
      </div>

      {/* Authoritative Hero Section */}
      <section className="py-12 lg:py-16 border-b border-[#E2DFD7]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Right Column: Broadsheet Editorial Statement */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-medium text-[#8C6D32] mb-3">
                بسم الله الرحمن الرحيم · البوابة الوثائقية والمؤسسية المعتمدة
              </div>

              <h1
                className="font-display font-bold text-[#18181B] tracking-tight leading-[1.2] mb-6"
                style={{ fontSize: 'clamp(2.35rem, 4.2vw, 3.65rem)', textWrap: 'balance' }}
              >
                الموقع الرسمي لعائلة الصعيدي — أصالة النسب الجهني وامتداد الحواضر العربية
              </h1>

              <p className="font-display text-lg lg:text-xl text-zinc-800 leading-[1.85] mb-6">
                يرجع نسب عائلة الصعيدي في محافظة تيماء ومنطقة حائل والرياض وتبوك والخليج العربي
                وجبل العرب ببلاد الشام إلى <strong className="text-[#8C6D32]">الجد السابع إبراهيم الصعيدي</strong>{' '}
                من <strong className="text-[#18181B]">قبيلة جهينة</strong> من{' '}
                <strong className="text-[#18181B]">ينبع النخل</strong> بالساحل الغربي لشبه الجزيرة
                العربية، حيث تفرعت العائلة من ابنه <strong className="text-[#18181B]">عوض البراهيم</strong>{' '}
                من خلال أبنائه الثلاثة: <strong>عبد الله، وسلامة، وصالح</strong>.
              </p>

              <p className="text-sm text-zinc-600 leading-[1.8] pb-6 mb-6 border-b border-[#E2DFD7]">
                تجمع هذه المنصة الرسمية بين حفظ الإرث التاريخي والمشجرات الوثائقية الموروثة عن
                الآباء والأجداد، وبين توفير البوابات الرقمية المركزية لخدمة التواصل ولمّ الشمل بين
                أبناء العائلة في كافة الأقطار.
              </p>
            </div>

            {/* Institutional Quick-Access Links */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="px-6 py-3 bg-[#18181B] text-[#F9F8F6] text-xs font-semibold hover:bg-[#8C6D32] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>قراءة الوثيقة التاريخية الكاملة (من نحن)</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('portals')}
                  className="px-5 py-3 bg-[#F3F1EC] border border-[#E2DFD7] text-[#18181B] text-xs font-semibold hover:border-[#8C6D32] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  البوابات الرقمية والخدمات الرسمية
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('diwan')}
                  className="px-4 py-3 text-xs font-semibold text-[#8C6D32] hover:text-[#18181B] underline underline-offset-8 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  الديوان والأخبار
                </button>
              </div>
            </div>
          </div>

          {/* Left Column: Archival Genealogy & Atlas Plate */}
          <div className="lg:col-span-6 flex">
            <HeritageAndInfraVisual
              activeBranchId={activeBranchId}
              onSelectBranch={onSelectBranch}
            />
          </div>
        </div>

        {/* Full-Width 4-Column Institutional Key Facts Strip */}
        <div className="mt-12 pt-8 border-t border-[#E2DFD7] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="pl-4 border-l border-[#E2DFD7] last:border-l-0">
            <div className="text-xs text-[#8C6D32] font-semibold mb-1">عمود النسب الجامع</div>
            <div className="font-display text-2xl font-bold text-[#18181B]">
              الجد السابع إبراهيم الصعيدي
            </div>
            <p className="text-xs text-zinc-600 mt-1">
              من قبيلة جهينة من ينبع النخل بالساحل الغربي لشبه الجزيرة العربية
            </p>
          </div>

          <div className="pl-4 border-l border-[#E2DFD7] last:border-l-0">
            <div className="text-xs text-[#8C6D32] font-semibold mb-1">أبناء عوض البراهيم الثلاثة</div>
            <div className="font-display text-2xl font-bold text-[#18181B]">
              عبد الله · سلامة · صالح
            </div>
            <p className="text-xs text-zinc-600 mt-1">
              الأغصان الثلاثة الكبرى التي تفرعت منها العائلة في الحواضر العربية
            </p>
          </div>

          <div className="pl-4 border-l border-[#E2DFD7] last:border-l-0">
            <div className="text-xs text-[#8C6D32] font-semibold mb-1">النطاق الجغرافي الموثق</div>
            <div className="font-display text-2xl font-bold text-[#18181B] tabular-nums">
              ٨ حواضر ومنازل رئيسية
            </div>
            <p className="text-xs text-zinc-600 mt-1">
              ينبع النخل · تيماء · حائل · الرياض · تبوك · جبل العرب · عجمان · الخابورة
            </p>
          </div>

          <div>
            <div className="text-xs text-[#8C6D32] font-semibold mb-1">المنظومة المؤسسية</div>
            <div className="font-display text-2xl font-bold text-[#18181B] tabular-nums">
              ٣ بوابات رقمية رسمية
            </div>
            <p className="text-xs text-zinc-600 mt-1">
              الإدارة والموارد المركزية · المراسلات والبريد الرسمي · الأرشيف الوثائقي
            </p>
          </div>
        </div>
      </section>

      {/* Geographical Presence Grid (شبكة الحضور الجغرافي ومنازل العائلة) */}
      <section className="py-16 lg:py-20 border-b border-[#E2DFD7]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-semibold text-[#8C6D32] mb-2">
              ٠١ · التوزيع الجغرافي والتاريخي الموثق
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#18181B]">
              حواضر ومنازل عائلة الصعيدي في الجزيرة العربية والشام والخليج
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="text-xs font-semibold text-[#8C6D32] hover:text-[#18181B] underline underline-offset-8 cursor-pointer whitespace-nowrap shrink-0 self-start md:self-end"
          >
            استعراض السرد التاريخي الكامل والمراجع ←
          </button>
        </div>

        {/* Crisp 1px Structural Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-r border-[#E2DFD7]">
          {GEOGRAPHICAL_PRESENCE.map((branch) => {
            const isSelected = branch.id === activeBranchId;
            return (
              <div
                key={branch.id}
                onClick={() => onSelectBranch(branch.id)}
                className={`p-6 border-b border-l border-[#E2DFD7] flex flex-col justify-between transition-colors cursor-pointer ${
                  isSelected ? 'bg-[#F3F1EC]' : 'bg-[#F9F8F6] hover:bg-[#F3F1EC]/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs mb-3">
                    <span className="font-mono font-semibold text-[#8C6D32]">
                      محطة {branch.index}
                    </span>
                    <span className="text-[11px] text-zinc-500">{branch.subLocation.split('—')[0]}</span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[#18181B] mb-2">
                    {branch.regionName}
                  </h3>

                  <div className="text-xs font-semibold text-[#8C6D32] mb-3 pb-2.5 border-b border-[#E2DFD7]">
                    {branch.keyFigures}
                  </div>

                  <p className="text-xs text-zinc-700 leading-[1.8] mb-4">
                    {branch.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E2DFD7] text-[11px] text-zinc-500">
                  {branch.lineagePath}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Executive Summary of the Digital Portals (المنظومة الرقمية والبوابات الرسمية) */}
      <section className="py-16 lg:py-20 border-b border-[#E2DFD7]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold text-[#8C6D32] mb-2">
              ٠٢ · البنية الرقمية الرسمية المعتمدة
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#18181B] mb-2">
              البوابات الرقمية والخدمات المؤسسية لعائلة الصعيدي
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              منظومة مؤسسية خاصة ومؤمّنة بالكامل لخدمة إدارة الموارد المركزية، المراسلات الرسمية
              باسم النطاق المعتمد (<span className="font-mono">@elsaidy.org</span>)، وحفظ الأرشيف
              الوثائقي والمعرفي للعائلة.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('portals')}
            className="px-5 py-2.5 bg-[#18181B] text-[#F9F8F6] text-xs font-semibold hover:bg-[#8C6D32] transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start md:self-end"
          >
            الدخول إلى دليل البوابات الرقمية ←
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 border-t border-r border-[#E2DFD7]">
          {WHITE_LABELED_PORTALS.map((portal) => (
            <div
              key={portal.id}
              className="p-7 lg:p-8 border-b border-l border-[#E2DFD7] bg-[#F9F8F6] hover:bg-[#F3F1EC]/50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs mb-3">
                  <span className="font-semibold text-[#8C6D32]">
                    {portal.index} · {portal.portalSubTitle}
                  </span>
                  <span className="font-mono text-[11px] text-zinc-500">{portal.domain}</span>
                </div>

                <h3 className="font-display text-2xl font-bold text-[#18181B] mb-1">
                  {portal.officialName}
                </h3>

                <div className="text-xs font-mono text-zinc-500 mb-4 pb-3 border-b border-[#E2DFD7]">
                  {portal.englishSubtitle}
                </div>

                <p className="text-sm text-zinc-700 leading-[1.8] mb-5">
                  {portal.summary}
                </p>

                <ul className="space-y-2 mb-6 text-xs text-zinc-700">
                  {portal.departments.map((dep, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#8C6D32] font-bold">·</span>
                      <span>{dep}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#E2DFD7] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onInspectPortal(portal)}
                  className="px-4 py-2 bg-[#18181B] text-[#F9F8F6] text-xs font-semibold hover:bg-[#8C6D32] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>بوابة الدخول والصلاحيات</span>
                  <ArrowUpLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('portals')}
                  className="text-xs font-medium text-[#8C6D32] hover:text-[#18181B] underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
                >
                  دليل الخدمة
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest from Diwan & Publications (مختارات من الديوان والأخبار) */}
      <section className="py-16 lg:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-semibold text-[#8C6D32] mb-2">
              ٠٣ · الديوان والأبحاث التاريخية
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#18181B]">
              أحدث الإصدارات والدراسات من ديوان العائلة
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('diwan')}
            className="text-xs font-semibold text-[#8C6D32] hover:text-[#18181B] underline underline-offset-8 cursor-pointer whitespace-nowrap shrink-0 self-start md:self-end"
          >
            تصفح كافة مقالات وأخبار الديوان ←
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DIWAN_ARTICLES.slice(0, 2).map((article) => (
            <article
              key={article.id}
              className="p-7 border border-[#E2DFD7] bg-[#F9F8F6] flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mb-3">
                  <span className="font-semibold text-[#8C6D32]">
                    {article.index} · {article.categoryLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{article.hijriDate}</span>
                  <span aria-hidden="true">·</span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="font-display text-2xl font-bold text-[#18181B] leading-snug mb-3">
                  {article.title}
                </h3>

                <p className="text-sm text-zinc-700 leading-[1.85] mb-6">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E2DFD7] flex items-center justify-between text-xs">
                <span className="text-zinc-500">{article.author}</span>
                <button
                  type="button"
                  onClick={() => onReadArticle(article)}
                  className="font-semibold text-[#8C6D32] hover:text-[#18181B] flex items-center gap-1 cursor-pointer"
                >
                  <span>قراءة الدراسة كاملة</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
