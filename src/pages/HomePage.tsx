import React from 'react';
import {
  FAMILY_BRANCHES,
  INFRASTRUCTURE_SERVICES,
  BLOG_ARTICLES,
  PageRoute,
  InfrastructureService,
  BlogArticlePreview
} from '../data/familyData';
import { HeritageAndInfraVisual } from '../components/HeritageAndInfraVisual';
import {
  Sun,
  Moon,
  ArrowUpLeft,
  Copy,
  Check,
  ChevronLeft,
  Compass,
  BookOpen,
  Server,
  ShieldCheck
} from 'lucide-react';

interface HomePageProps {
  isDark: boolean;
  onToggleTheme: () => void;
  activeBranchId: string;
  onSelectBranch: (id: string) => void;
  onNavigate: (route: PageRoute) => void;
  onInspectService: (service: InfrastructureService) => void;
  onReadArticle: (article: BlogArticlePreview) => void;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  isDark,
  onToggleTheme,
  activeBranchId,
  onSelectBranch,
  onNavigate,
  onInspectService,
  onReadArticle,
  copiedKey,
  onCopy
}) => {
  const handleSelectServiceFromMap = (serviceId: string) => {
    const found = INFRASTRUCTURE_SERVICES.find((s) => s.id === serviceId);
    if (found) {
      onInspectService(found);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        className={`pt-8 pb-16 lg:pt-12 lg:pb-20 border-b ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}
      >
        {/* Operational & Workspace Utility Bar */}
        <div
          className={`flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b text-xs ${
            isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200/80 text-slate-600'
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-[#C59B27]">البوابة الرسمية المعتمدة</span>
            <span aria-hidden="true">·</span>
            <span>قبيلة جهينة القضاعية</span>
            <span aria-hidden="true">·</span>
            <span>ينبع · تيماء · حائل · الرياض · تبوك · الشام · الإمارات · عُمان</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onCopy('https://elsaidy.org', 'home-domain')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isDark
                  ? 'bg-[#0E1624] border-slate-800 text-slate-300 hover:border-slate-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <span className="font-mono text-[11px]">elsaidy.org</span>
              {copiedKey === 'home-domain' ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-70" />
              )}
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isDark
                  ? 'bg-[#0E1624] border-slate-800 text-amber-200 hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
              }`}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>الوضع النهاري</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span>الوضع الليلي</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2-Column Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Right Column (RTL): Editorial Headline, Narrative & Primary CTA */}
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div>
              <div
                className={`text-xs font-medium mb-4 flex items-center gap-2 ${
                  isDark ? 'text-amber-300/90' : 'text-[#9A741C]'
                }`}
              >
                <span>الأصالة التاريخية والسيادة التقنية</span>
                <span aria-hidden="true">/</span>
                <span className="font-mono">ELSAIDY FAMILY &amp; DIGITAL INFRASTRUCTURE</span>
              </div>

              <h1
                className={`font-display font-bold tracking-tight leading-[1.22] mb-6 ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
                style={{ fontSize: 'clamp(2.35rem, 4.2vw, 3.75rem)', textWrap: 'balance' }}
              >
                عائلة الصعيدي — إرثٌ عريقٌ في الجزيرة العربية وبنية رقمية سيادية
              </h1>

              <p
                className={`text-base lg:text-lg leading-[1.85] mb-6 max-w-[65ch] ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                من جذورنا الضاربة في <strong className="font-semibold text-[#C59B27]">قبيلة جهينة</strong>{' '}
                وموطن الأجداد في <strong className="font-semibold">ينبع النخل وينبع البحر</strong>،
                وامتداد الفروع الكريمة في{' '}
                <strong className="font-semibold">
                  تيماء وتبوك وحائل والرياض وبلاد الشام والإمارات وسلطنة عُمان
                </strong>
                ، تجمع منصة <span className="font-mono text-sm">elsaidy.org</span> بين الموسوعة
                التاريخية الموثقة ومنظومة الأنظمة المؤسسية السحابية (<span className="font-mono text-sm">ERPNext</span> و{' '}
                <span className="font-mono text-sm">Mailcow</span>).
              </p>

              {/* Unboxed Metadata Line */}
              <div
                className={`text-xs leading-relaxed pb-6 mb-6 border-b ${
                  isDark
                    ? 'text-slate-400 border-slate-800/80'
                    : 'text-slate-600 border-slate-200'
                }`}
              >
                <span>النسب: جهينة من قضاعة</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>
                  الفروع: عبد الله (تيماء) · سلامة (الشام) · صالح وعلي (حائل والرياض) · الخليج العربي
                </span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span className="font-mono">Sovereign IT Stack</span>
              </div>
            </div>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="px-6 py-3.5 rounded-xl bg-[#C59B27] text-slate-950 font-semibold text-sm hover:bg-[#d4ab32] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>بوابة البنية الرقمية والأنظمة</span>
                <ArrowUpLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('about')}
                className={`px-5 py-3.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isDark
                    ? 'border-slate-700 text-slate-200 hover:bg-slate-800/70'
                    : 'border-slate-300 text-slate-800 hover:bg-slate-100'
                }`}
              >
                الموسوعة التاريخية وفروع العائلة
              </button>

              <button
                type="button"
                onClick={() => onNavigate('blog')}
                className={`px-3 py-3.5 text-sm font-medium underline underline-offset-8 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isDark
                    ? 'text-amber-300/90 hover:text-amber-200'
                    : 'text-[#9A741C] hover:text-slate-900'
                }`}
              >
                مدونة العائلة (elsaidy.org/blog)
              </button>
            </div>
          </div>

          {/* Left Column (RTL): Interactive Cartographic & Sovereign Architecture Canvas */}
          <div className="lg:col-span-6 flex">
            <HeritageAndInfraVisual
              activeBranchId={activeBranchId}
              onSelectBranch={onSelectBranch}
              onSelectService={handleSelectServiceFromMap}
              isDark={isDark}
            />
          </div>
        </div>

        {/* Full-Width 4-Column Heritage & Infrastructure Fact Strip */}
        <div
          className={`mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t ${
            isDark ? 'border-slate-800/80' : 'border-slate-200'
          }`}
        >
          <div>
            <div className="text-xs text-[#C59B27] font-medium mb-1">العمق التاريخي والنسب</div>
            <div
              className={`text-2xl font-bold font-display tabular-nums ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              قبيلة جهينة القضاعية
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              جذور راسخة في ينبع النخل وينبع البحر وامتداد في حواضر الجزيرة
            </p>
          </div>

          <div>
            <div className="text-xs text-[#C59B27] font-medium mb-1">الانتشار الجغرافي الموثق</div>
            <div
              className={`text-2xl font-bold tabular-nums ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              5 فروع وأقاليم رئيسية
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              ينبع · تيماء وتبوك · حائل والرياض · بلاد الشام · الإمارات وعُمان
            </p>
          </div>

          <div>
            <div className="text-xs text-[#C59B27] font-medium mb-1">منظومة الأنظمة المؤسسية</div>
            <div
              className={`text-2xl font-bold font-mono tabular-nums ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              6 أنظمة سحابية سيادية
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              ERPNext · Mailcow · المدونة المعرفية · الأرشيف السحابي · الهوية الموحدة
            </p>
          </div>

          <div>
            <div className="text-xs text-[#C59B27] font-medium mb-1">المراجع والوثائق المحفوظة</div>
            <div
              className={`text-2xl font-bold font-mono tabular-nums ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              +180 وثيقة ومخطوطة
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              حجج شرعية، وثائق أوقاف، ومشجرات موثقة في المستودع الرقمي
            </p>
          </div>
        </div>
      </section>

      {/* Quick Navigation Portal Cards Section (البوابات الرئيسية للمنصة) */}
      <section
        className={`py-16 lg:py-24 border-b ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="text-xs font-medium text-[#C59B27] mb-2">
              01. البوابات الرئيسية لمنظومة عائلة الصعيدي
            </div>
            <h2
              className={`font-display text-3xl lg:text-4xl font-bold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              دليل الوصول السريع لأقسام البوابة والأنظمة المعتمدة
            </h2>
          </div>
          <p className={`text-sm max-w-md ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            اختر البوابة المطلوبة للانتقال المباشر إلى الموسوعة التاريخية، مدونة الأبحاث، أو منصة
            الخدمات السحابية والمؤسسية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: About & History Page */}
          <div
            onClick={() => onNavigate('about')}
            className={`p-7 lg:p-8 rounded-2xl border flex flex-col justify-between transition-colors cursor-pointer group ${
              isDark
                ? 'bg-[#0E1624] border-slate-800/90 hover:border-[#C59B27]'
                : 'bg-white border-slate-200/90 hover:border-[#C59B27]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-xs mb-4">
                <div className="flex items-center gap-2 text-[#C59B27] font-medium">
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>01. الموسوعة التاريخية والأنساب</span>
                </div>
                <span className="font-mono text-slate-400">elsaidy.org/about</span>
              </div>

              <h3
                className={`font-display text-2xl lg:text-3xl font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                التاريخ، الجذور، سبب التسمية، وفروع العائلة
              </h3>

              <p
                className={`text-sm lg:text-base leading-relaxed mb-6 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                توثيق شامل لجذور عائلة الصعيدي في قبيلة جهينة بينبع النخل وينبع البحر، وتفصيل سبب
                التسمية بلقب «الصعيدي»، مع استعراض الفروع الخمسة (عبد الله في تيماء وتبوك، سلامة في
                بلاد الشام، صالح وعلي في حائل والرياض، وفروع الإمارات وسلطنة عُمان) والمراجع الأكاديمية.
              </p>
            </div>

            <div
              className={`pt-4 border-t flex items-center justify-between text-xs font-semibold ${
                isDark ? 'border-slate-800 text-[#C59B27]' : 'border-slate-200 text-[#9A741C]'
              }`}
            >
              <span>الانتقال إلى صفحة التاريخ والأنساب الكاملة</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Infrastructure & Projects Portal */}
          <div
            onClick={() => onNavigate('projects')}
            className={`p-7 lg:p-8 rounded-2xl border flex flex-col justify-between transition-colors cursor-pointer group ${
              isDark
                ? 'bg-[#0E1624] border-slate-800/90 hover:border-[#C59B27]'
                : 'bg-white border-slate-200/90 hover:border-[#C59B27]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-xs mb-4">
                <div className="flex items-center gap-2 text-[#C59B27] font-medium">
                  <Server className="w-4 h-4 shrink-0" />
                  <span>02. البنية التحتية والأنظمة المؤسسية</span>
                </div>
                <span className="font-mono text-slate-400">elsaidy.org/projects</span>
              </div>

              <h3
                className={`font-display text-2xl lg:text-3xl font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                بوابة الأنظمة السحابية (ERPNext &amp; Mailcow)
              </h3>

              <p
                className={`text-sm lg:text-base leading-relaxed mb-6 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                الوصول المباشر إلى منظومة تخطيط موارد المؤسسة والأوقاف (ERPNext)، خوادم البريد
                الإلكتروني المشفر والاتصال الموحد (Mailcow)، المستودع السحابي للوثائق التاريخية،
                وبوابة الهوية الموحدة (SSO) مع المواصفات التقنية وطلب الصلاحيات.
              </p>
            </div>

            <div
              className={`pt-4 border-t flex items-center justify-between text-xs font-semibold ${
                isDark ? 'border-slate-800 text-[#C59B27]' : 'border-slate-200 text-[#9A741C]'
              }`}
            >
              <span>استعراض بوابة المشاريع والأنظمة الرقمية</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Blog & Articles Page */}
          <div
            onClick={() => onNavigate('blog')}
            className={`p-7 lg:p-8 rounded-2xl border flex flex-col justify-between transition-colors cursor-pointer group ${
              isDark
                ? 'bg-[#0E1624] border-slate-800/90 hover:border-[#C59B27]'
                : 'bg-white border-slate-200/90 hover:border-[#C59B27]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-xs mb-4">
                <div className="flex items-center gap-2 text-[#C59B27] font-medium">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>03. المدونة والأرشيف المعرفي</span>
                </div>
                <span className="font-mono text-slate-400">elsaidy.org/blog</span>
              </div>

              <h3
                className={`font-display text-2xl lg:text-3xl font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                الدراسات التاريخية والمقالات التقنية وأخبار العائلة
              </h3>

              <p
                className={`text-sm lg:text-base leading-relaxed mb-6 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                منصة النشر المعرفي المرتبطة بـ <span className="font-mono">blog.elsaidy.org</span>؛
                تضم أبحاثاً محكمة في تاريخ الحواضر والأنساب، شروحات هندسية للبنية الرقمية السيادية،
                وقراءات في المخطوطات والحجج الوقفية المحفوظة.
              </p>
            </div>

            <div
              className={`pt-4 border-t flex items-center justify-between text-xs font-semibold ${
                isDark ? 'border-slate-800 text-[#C59B27]' : 'border-slate-200 text-[#9A741C]'
              }`}
            >
              <span>تصفح جميع المقالات والدراسات المنشورة</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Direct Enterprise Portals & Self-Service */}
          <div
            className={`p-7 lg:p-8 rounded-2xl border flex flex-col justify-between ${
              isDark
                ? 'bg-[#0E1624] border-slate-800/90'
                : 'bg-white border-slate-200/90'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-xs mb-4">
                <div className="flex items-center gap-2 text-[#C59B27] font-medium">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>04. الروابط المباشرة للأنظمة السحابية</span>
                </div>
                <span className="font-mono text-emerald-500">TLS 1.3 · SSO</span>
              </div>

              <h3
                className={`font-display text-2xl lg:text-3xl font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                الوصول الفوري لمنصات العمل والبريد والمدونة
              </h3>

              <p
                className={`text-sm leading-relaxed mb-5 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                روابط مباشرة للأنظمة التشغيلية المعتمدة لأفراد ومؤسسات عائلة الصعيدي:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                {INFRASTRUCTURE_SERVICES.slice(0, 4).map((srv) => (
                  <a
                    key={srv.id}
                    href={srv.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                      isDark
                        ? 'bg-[#090E17] border-slate-800 hover:border-[#C59B27] text-slate-200'
                        : 'bg-[#FAF8F5] border-slate-200 hover:border-[#C59B27] text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{srv.name.split(' ')[0]}</div>
                      <div className="font-mono text-[11px] text-[#C59B27]">{srv.domain}</div>
                    </div>
                    <ArrowUpLeft className="w-3.5 h-3.5 opacity-70" />
                  </a>
                ))}
              </div>
            </div>

            <div
              className={`pt-4 border-t flex items-center justify-between text-xs ${
                isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
              }`}
            >
              <span>جميع الأنظمة محمية ببوابة الهوية الموحدة</span>
              <a
                href="#contact-portal"
                className="font-semibold text-[#C59B27] hover:underline underline-offset-4"
              >
                طلب حساب رسمي ←
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Summary of Family Branches & Latest Blog Articles */}
      <section className="py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Branches Summary Column */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <div className="text-xs font-medium text-[#C59B27] mb-1">
                  02. لمحة عن الجذور والانتشار الجغرافي
                </div>
                <h2
                  className={`font-display text-2xl lg:text-3xl font-bold ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  فروع عائلة الصعيدي في الجزيرة العربية والشام والخليج
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="text-xs font-semibold text-[#C59B27] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
              >
                عرض التفاصيل والمراجع ←
              </button>
            </div>

            <div className="space-y-3">
              {FAMILY_BRANCHES.map((branch) => (
                <div
                  key={branch.id}
                  onClick={() => {
                    onSelectBranch(branch.id);
                    onNavigate('about');
                  }}
                  className={`p-5 rounded-xl border transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-[#0E1624] border-slate-800/90 hover:border-[#C59B27]/60'
                      : 'bg-white border-slate-200/90 hover:border-[#C59B27]/60'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-1.5">
                    <span className="font-mono text-[#C59B27] font-semibold">
                      {branch.index}. {branch.patriarch}
                    </span>
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                      {branch.cities.join(' · ')}
                    </span>
                  </div>
                  <h3
                    className={`font-display text-lg font-bold mb-1 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {branch.title}
                  </h3>
                  <p
                    className={`text-xs lg:text-sm leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {branch.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Articles Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <div className="text-xs font-medium text-[#C59B27] mb-1">
                    03. أحدث منشورات المدونة
                  </div>
                  <h2
                    className={`font-display text-2xl lg:text-3xl font-bold ${
                      isDark ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    مختارات من blog.elsaidy.org
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('blog')}
                  className="text-xs font-semibold text-[#C59B27] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
                >
                  كل المقالات ←
                </button>
              </div>

              <div className="space-y-4">
                {BLOG_ARTICLES.slice(0, 3).map((post) => (
                  <article
                    key={post.id}
                    className={`p-5 rounded-xl border transition-colors ${
                      isDark
                        ? 'bg-[#0E1624] border-slate-800/90 hover:border-slate-700'
                        : 'bg-white border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`text-xs mb-2 flex items-center gap-2 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      <span className="text-[#C59B27] font-medium">{post.categoryLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.publishDate}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3
                      className={`font-display text-lg font-bold leading-snug mb-2 ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {post.title}
                    </h3>

                    <p
                      className={`text-xs leading-relaxed mb-3 line-clamp-2 ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {post.excerpt}
                    </p>

                    <button
                      type="button"
                      onClick={() => onReadArticle(post)}
                      className="text-xs font-semibold text-[#C59B27] hover:underline underline-offset-4 cursor-pointer"
                    >
                      قراءة المقال الكامل ←
                    </button>
                  </article>
                ))}
              </div>
            </div>

            <div
              className={`mt-6 p-5 rounded-xl border text-xs leading-relaxed ${
                isDark
                  ? 'bg-[#0E1624]/60 border-slate-800 text-slate-300'
                  : 'bg-amber-50/40 border-amber-200/80 text-slate-700'
              }`}
            >
              <strong className="text-[#C59B27] block mb-1">
                الأرشيف الرقمي المفتوح للباحثين وأبناء العائلة
              </strong>
              تصدر مدونة عائلة الصعيدي دراسات دورية في تحقيق المخطوطات والأنساب والهندسة الرقمية
              المؤسسية عبر النطاق الرسمي <span className="font-mono">blog.elsaidy.org</span>.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
