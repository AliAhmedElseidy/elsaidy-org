/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FAMILY_BRANCHES,
  HISTORICAL_REFERENCES,
  INFRASTRUCTURE_SERVICES,
  BLOG_ARTICLES,
  FamilyBranch,
  HistoricalReference,
  InfrastructureService,
  BlogArticlePreview
} from './data/familyData';
import { HeritageAndInfraVisual } from './components/HeritageAndInfraVisual';
import {
  Sun,
  Moon,
  ArrowUpLeft,
  BookOpen,
  Copy,
  Check,
  Search,
  Globe,
  Mail,
  ShieldCheck,
  Building2,
  FileText,
  X,
  ChevronLeft
} from 'lucide-react';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [activeBranchId, setActiveBranchId] = useState<string>(FAMILY_BRANCHES[1].id); // Default highlight on Taima/Tabuk or Yanbu
  const [refCategory, setRefCategory] = useState<string>('all');
  const [refSearch, setRefSearch] = useState<string>('');
  const [selectedReference, setSelectedReference] = useState<HistoricalReference>(
    HISTORICAL_REFERENCES[0]
  );
  const [serviceCategory, setServiceCategory] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [inspectedService, setInspectedService] = useState<InfrastructureService | null>(null);
  const [activeArticle, setActiveArticle] = useState<BlogArticlePreview | null>(null);

  // Contact / Request Form State
  const [formData, setFormData] = useState({
    fullName: '',
    branch: 'فرع صالح وعلي — حائل والرياض',
    email: '',
    requestType: 'طلب بريد رسمي (@elsaidy.org)',
    message: ''
  });
  const [formError, setFormError] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const activeBranch: FamilyBranch =
    FAMILY_BRANCHES.find((b) => b.id === activeBranchId) || FAMILY_BRANCHES[0];

  const filteredReferences = HISTORICAL_REFERENCES.filter((ref) => {
    const matchesCat = refCategory === 'all' || ref.category === refCategory;
    const q = refSearch.trim();
    const matchesQuery =
      !q ||
      ref.title.includes(q) ||
      ref.author.includes(q) ||
      ref.regionFocus.includes(q) ||
      ref.summary.includes(q);
    return matchesCat && matchesQuery;
  });

  const filteredServices = INFRASTRUCTURE_SERVICES.filter(
    (srv) => serviceCategory === 'all' || srv.category === serviceCategory
  );

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2000);
  };

  const handleSelectServiceFromMap = (serviceId: string) => {
    const found = INFRASTRUCTURE_SERVICES.find((s) => s.id === serviceId);
    if (found) {
      setInspectedService(found);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      setFormError('يرجى إدخال الاسم الثلاثي الكامل بشكل صحيح.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setFormError('يرجى إدخال عنوان بريد إلكتروني صحيح للتواصل.');
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setFormError('يرجى كتابة تفاصيل الطلب أو المراسلة التاريخية/التقنية (10 أحرف على الأقل).');
      return;
    }
    setFormError('');
    setFormSubmitted(true);
  };

  return (
    <div
      dir="rtl"
      className={`min-h-screen transition-colors duration-200 ${
        isDark
          ? 'bg-[#090E17] text-slate-100 selection:bg-[#C59B27]/30 selection:text-amber-100'
          : 'bg-[#FAF8F5] text-slate-900 selection:bg-[#C59B27]/20 selection:text-slate-900'
      }`}
    >
      {/* Top Navigation Bar — Strict 3-Zone Contract */}
      <header
        id="top"
        className={`sticky top-0 z-40 flex items-center justify-between gap-8 px-6 lg:px-12 py-4 border-b backdrop-blur-md transition-colors duration-200 ${
          isDark
            ? 'bg-[#090E17]/90 border-slate-800/80'
            : 'bg-[#FAF8F5]/90 border-slate-200/90'
        }`}
      >
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className={`text-xl font-bold font-display tracking-tight whitespace-nowrap shrink-0 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          عائلة الصعيدي
        </a>

        {/* Zone 2: 4–5 concise single-line text navigation links */}
        <nav
          aria-label="التنقل الرئيسي"
          className={`hidden md:flex items-center gap-7 text-sm font-medium ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          <a
            href="#lineage"
            className="hover:text-[#C59B27] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
          >
            الجذور والتاريخ
          </a>
          <a
            href="#branches"
            className="hover:text-[#C59B27] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
          >
            فروع العائلة
          </a>
          <a
            href="#references"
            className="hover:text-[#C59B27] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
          >
            المصادر التاريخية
          </a>
          <a
            href="#infrastructure"
            className="hover:text-[#C59B27] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
          >
            البنية الرقمية
          </a>
          <a
            href="#contact"
            className="hover:text-[#C59B27] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
          >
            تواصل معنا
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#infrastructure"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#C59B27] text-slate-950 hover:bg-[#d4ab32] transition-colors whitespace-nowrap shrink-0"
          >
            بوابة الأنظمة
          </a>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-[1280px] mx-auto px-6 lg:px-12">
        {/* Hero Section */}
        <section className="pt-8 pb-16 lg:pt-12 lg:pb-20 border-b border-slate-200 dark:border-slate-800/80">
          {/* Secondary Workspace & Theme Utility Bar (Placed in Hero below Header per Top Bar Contract) */}
          <div
            className={`flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b text-xs ${
              isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200/80 text-slate-600'
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-[#C59B27]">البوابة الرسمية المعتمدة</span>
              <span aria-hidden="true">·</span>
              <span>قبيلة جهينة القضاعية</span>
              <span aria-hidden="true">·</span>
              <span>ينبع · تيماء · حائل · الرياض · تبوك · الشام · الخليج</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleCopy('https://elsaidy.org', 'domain-root')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <span className="font-mono text-[11px]">elsaidy.org</span>
                {copiedKey === 'domain-root' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 opacity-70" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsDark(!isDark)}
                aria-label={isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 text-amber-200 hover:bg-slate-800'
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

          {/* 2-Column Hero Split with Equal Visual Weight */}
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
                  <span className="font-mono">ELSAIDY FAMILY PORTAL</span>
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
                  className={`text-base lg:text-lg leading-[1.8] mb-6 max-w-[65ch] ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  من جذورنا الضاربة في <strong className="font-semibold text-[#C59B27]">قبيلة جهينة</strong>{' '}
                  وموطن الأجداد في <strong className="font-semibold">ينبع النخل وينبع البحر</strong>،
                  وامتداد الفروع الكريمة في <strong className="font-semibold">تيماء وتبوك وحائل والرياض وبلاد الشام والإمارات وسلطنة عُمان</strong>،
                  تجمع هذه البوابة بين توثيق التاريخ العائلي المعتمد ومنظومة الخدمات السحابية والمؤسسية الحديثة.
                </p>

                {/* Unboxed Heritage & Tech Metadata Summary */}
                <div
                  className={`text-xs leading-relaxed pb-6 mb-6 border-b ${
                    isDark
                      ? 'text-slate-400 border-slate-800/80'
                      : 'text-slate-600 border-slate-200'
                  }`}
                >
                  <span>النسب: جهينة من قضاعة</span>
                  <span className="mx-2" aria-hidden="true">·</span>
                  <span>الفروع الموثقة: عبد الله (تيماء) · سلامة (الشام) · صالح وعلي (حائل والرياض) · الخليج العربي</span>
                  <span className="mx-2" aria-hidden="true">·</span>
                  <span className="font-mono">ERPNext &amp; Mailcow Stack</span>
                </div>
              </div>

              {/* Action Row */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#infrastructure"
                  className="px-6 py-3.5 rounded-xl bg-[#C59B27] text-slate-950 font-semibold text-sm hover:bg-[#d4ab32] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <span>الدخول إلى بوابة الخدمات الرقمية</span>
                  <ArrowUpLeft className="w-4 h-4" />
                </a>

                <a
                  href="#branches"
                  className={`px-5 py-3.5 rounded-xl border text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isDark
                      ? 'border-slate-700 text-slate-200 hover:bg-slate-800/70'
                      : 'border-slate-300 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  استكشاف الجذور والفروع التاريخية
                </a>

                <a
                  href="https://blog.elsaidy.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-3.5 text-sm font-medium underline underline-offset-8 transition-colors whitespace-nowrap shrink-0 ${
                    isDark
                      ? 'text-amber-300/90 hover:text-amber-200'
                      : 'text-[#9A741C] hover:text-slate-900'
                  }`}
                >
                  تصفح المدونة (blog.elsaidy.org)
                </a>
              </div>
            </div>

            {/* Left Column (RTL): Interactive Cartographic & Sovereign Architecture Canvas */}
            <div className="lg:col-span-6 flex">
              <HeritageAndInfraVisual
                activeBranchId={activeBranchId}
                onSelectBranch={(id) => setActiveBranchId(id)}
                onSelectService={handleSelectServiceFromMap}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Full-Width 4-Column Heritage & Infrastructure Fact Strip below Hero Split */}
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
                5 أقاليم رئيسية
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                الحجاز · تيماء وتبوك · حائل والرياض · بلاد الشام · الإمارات وعُمان
              </p>
            </div>

            <div>
              <div className="text-xs text-[#C59B27] font-medium mb-1">منظومة الأنظمة المؤسسية</div>
              <div
                className={`text-2xl font-bold font-mono tabular-nums ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                6 أنظمة سيادية
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                ERPNext · Mailcow · المدونة المعرفية · الأرشيف السحابي · الهوية الموحدة
              </p>
            </div>

            <div>
              <div className="text-xs text-[#C59B27] font-medium mb-1">النطاق الرسمي الموحد</div>
              <div
                className={`text-2xl font-bold font-mono tabular-nums ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                elsaidy.org
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                بنية مشفرة ومستضافة ذاتياً بمعايير أمان مؤسسية عالية
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Historical Background, Roots & Branches (الجذور والتاريخ وفروع العائلة) */}
        <section
          id="lineage"
          className={`py-16 lg:py-24 border-b ${
            isDark ? 'border-slate-800/80' : 'border-slate-200'
          }`}
        >
          {/* Section Header */}
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-medium text-[#C59B27] mb-2">
              01. التاريخ والأنساب والانتشار الجغرافي
            </div>
            <h2
              className={`font-display text-3xl lg:text-4xl font-bold tracking-tight mb-4 ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
              style={{ textWrap: 'balance' }}
            >
              نبذة تاريخية شاملة عن عائلة الصعيدي وجذورها وفروعها
            </h2>
            <p
              className={`text-base leading-[1.8] ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              تُعد عائلة الصعيدي (آل صعيدي) من الأسر العربية الأصيلة التي يعود نسبها إلى{' '}
              <strong>قبيلة جهينة بن زيد بن ليث بن سود بن أسلم بن الحاف بن قضاعة</strong>. وقد
              ارتبط تاريخ العائلة منذ القدم بحاضرة <strong>ينبع النخل وينبع البحر</strong> في إقليم
              الحجاز، قبل أن تمتد فروعها الكريمة عبر قرون متعاقبة إلى شمال غرب الجزيرة العربية في{' '}
              <strong>تيماء وتبوك</strong>، وإلى <strong>حائل والرياض</strong> في نجد، وإلى{' '}
              <strong>بلاد الشام</strong>، وصولاً إلى <strong>دولة الإمارات العربية المتحدة وسلطنة عُمان</strong>.
            </p>
          </div>

          {/* Foundational Narrative Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div
              className={`lg:col-span-7 p-6 lg:p-8 rounded-2xl border ${
                isDark
                  ? 'bg-[#0E1624] border-slate-800/90'
                  : 'bg-white border-slate-200/90'
              }`}
            >
              <h3
                className={`font-display text-xl lg:text-2xl font-bold mb-4 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                المنطلق الحجازي في ينبع النخل وامتداد الحواضر
              </h3>
              <p
                className={`text-sm lg:text-base leading-[1.85] mb-4 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                استوطنت قبيلة جهينة ديارها التاريخية الممتدة من ساحل البحر الأحمر في ينبع البحر إلى
                أودية وعيون ينبع النخل والعيص ويثرب. وفي هذه البيئة التي جمعت بين الزراعة في العيون
                الجارية والتجارة على طرق القوافل البحرية والبرية، نشأت أسرة الصعيدي وحملت اسمها
                المعروف في الوثائق والمشجرات الحجازية والنجدية والشامية.
              </p>
              <p
                className={`text-sm lg:text-base leading-[1.85] ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                ومع حركة الحواضر العربية والتجارة الإقليمية بين الحجاز ونجد والشام والخليج، تفرّعت
                الأسرة إلى أعقاب وأغصان رئيسية؛ فاستقر <strong>فرع عبد الله</strong> في واحة تيماء
                وتبوك، واتجه <strong>فرع سلامة</strong> إلى بلاد الشام، بينما استقر{' '}
                <strong>فرع صالح وعلي</strong> في حائل ثم الرياض، وامتدت فروع أخرى إلى حواضر الخليج
                العربي في <strong>الإمارات وسلطنة عُمان</strong>.
              </p>
            </div>

            <div
              className={`lg:col-span-5 p-6 lg:p-8 rounded-2xl border flex flex-col justify-between ${
                isDark
                  ? 'bg-[#0E1624] border-slate-800/90'
                  : 'bg-white border-slate-200/90'
              }`}
            >
              <div>
                <div className="text-xs font-medium text-[#C59B27] mb-2">
                  الثوابت التاريخية الموثقة
                </div>
                <h3
                  className={`font-display text-xl font-bold mb-4 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  مرتكزات الهوية والتوثيق العائلي
                </h3>
                <ul className="space-y-3.5 text-sm leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono text-xs text-[#C59B27] font-semibold mt-0.5">01.</span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      <strong>وحدة الأصل والنسب:</strong> التقاء كافة الفروع في الموروث الجهني الأصيل
                      المنطلق من ينبع النخل وينبع البحر.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono text-xs text-[#C59B27] font-semibold mt-0.5">02.</span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      <strong>التوثيق بالمصادر والوثائق:</strong> الاعتماد على حجج الاستحكام،
                      الوثائق الوقفية، ومعاجم الأنساب المعتمدة في المملكة والشام والخليج.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="font-mono text-xs text-[#C59B27] font-semibold mt-0.5">03.</span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      <strong>التكامل المؤسسي المعاصر:</strong> توظيف البنية الرقمية الحديثة لربط
                      أبناء العمومة وحفظ الأرشيف العائلي للأجيال القادمة.
                    </span>
                  </li>
                </ul>
              </div>

              <div
                className={`mt-6 pt-4 border-t text-xs flex items-center justify-between ${
                  isDark
                    ? 'border-slate-800 text-slate-400'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <span>إشراف: لجنة التوثيق والأنساب — عائلة الصعيدي</span>
                <span className="font-mono tabular-nums">1448 هـ / 2026 م</span>
              </div>
            </div>
          </div>

          {/* Interactive Branches Explorer (#branches) */}
          <div id="branches" className="scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <div className="text-xs font-medium text-[#C59B27] mb-1">
                  الفروع التاريخية الخمسة
                </div>
                <h3
                  className={`font-display text-2xl lg:text-3xl font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  استعراض تفصيلي لفروع عائلة الصعيدي وديارها
                </h3>
              </div>

              {/* Interactive Branch Selector Tabs */}
              <div
                className={`flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl border ${
                  isDark
                    ? 'bg-[#0E1624] border-slate-800'
                    : 'bg-slate-100 border-slate-200/80'
                }`}
                role="tablist"
                aria-label="فروع عائلة الصعيدي"
              >
                {FAMILY_BRANCHES.map((branch) => {
                  const active = branch.id === activeBranch.id;
                  return (
                    <button
                      key={branch.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveBranchId(branch.id)}
                      className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-[#C59B27] text-slate-950 font-semibold'
                          : isDark
                          ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                          : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
                      }`}
                    >
                      {branch.index}. {branch.coordinates.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Branch Detailed View + All Branches Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Detailed Dossier of Selected Branch */}
              <div
                className={`lg:col-span-7 p-6 lg:p-8 rounded-2xl border flex flex-col justify-between ${
                  isDark
                    ? 'bg-[#0E1624] border-[#C59B27]/40'
                    : 'bg-white border-[#C59B27]/50'
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#C59B27] mb-3">
                    <span className="font-mono font-semibold">فرع رقم {activeBranch.index}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeBranch.patriarch}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeBranch.era}</span>
                  </div>

                  <h4
                    className={`font-display text-2xl lg:text-3xl font-bold mb-3 ${
                      isDark ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {activeBranch.title}
                  </h4>

                  <div
                    className={`text-xs mb-5 pb-4 border-b ${
                      isDark
                        ? 'text-slate-400 border-slate-800'
                        : 'text-slate-600 border-slate-200'
                    }`}
                  >
                    <span>النطاق الجغرافي: {activeBranch.region}</span>
                    <span className="mx-2" aria-hidden="true">·</span>
                    <span>الحواضر والمدن: {activeBranch.cities.join(' ، ')}</span>
                  </div>

                  <p
                    className={`text-sm lg:text-base leading-[1.85] mb-6 ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    {activeBranch.detailedHistory}
                  </p>

                  <div className="mb-6">
                    <div
                      className={`text-xs font-semibold mb-3 ${
                        isDark ? 'text-amber-200' : 'text-slate-900'
                      }`}
                    >
                      أبرز المعالم والإسهامات التاريخية والاجتماعية:
                    </div>
                    <ul className="space-y-2.5 text-sm">
                      {activeBranch.notableContributions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="font-mono text-xs text-[#C59B27] mt-0.5 tabular-nums">
                            0{idx + 1}.
                          </span>
                          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div
                  className={`pt-4 border-t text-xs ${
                    isDark
                      ? 'border-slate-800 text-slate-400'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <strong className="font-semibold text-[#C59B27]">التوثيق الأرشيفي: </strong>
                  {activeBranch.archivalNotes}
                </div>
              </div>

              {/* Quick Interactive List of All 5 Branches */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-3">
                {FAMILY_BRANCHES.map((branch) => {
                  const isSelected = branch.id === activeBranch.id;
                  return (
                    <button
                      key={branch.id}
                      type="button"
                      onClick={() => setActiveBranchId(branch.id)}
                      className={`w-full text-right p-4 rounded-xl border transition-colors cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'bg-slate-900 border-[#C59B27] text-white'
                            : 'bg-amber-50/50 border-[#C59B27] text-slate-950'
                          : isDark
                          ? 'bg-[#0E1624]/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                          : 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-mono text-[#C59B27] font-semibold">
                          {branch.index}. {branch.patriarch}
                        </span>
                        <span
                          className={`text-xs ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          {branch.cities.slice(0, 2).join(' · ')}
                        </span>
                      </div>
                      <div className="text-base font-bold font-display mb-1">
                        {branch.title}
                      </div>
                      <p
                        className={`text-xs line-clamp-2 leading-relaxed ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        {branch.summary}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Historical References & Archival Sources (#references) */}
        <section
          id="references"
          className={`py-16 lg:py-24 border-b ${
            isDark ? 'border-slate-800/80' : 'border-slate-200'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <div className="text-xs font-medium text-[#C59B27] mb-2">
                02. المراجع والوثائق والمصادر التاريخية
              </div>
              <h2
                className={`font-display text-3xl lg:text-4xl font-bold tracking-tight mb-3 ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                المصادر التاريخية والمخطوطات الموثقة للنسب والديار
              </h2>
              <p
                className={`text-sm lg:text-base leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                تستند شجرة وتاريخ عائلة الصعيدي إلى أمهات كتب الأنساب والتاريخ الجغرافي للجزيرة
                العربية وبلاد الشام، إضافةً إلى الوثائق الشرعية والوقفية المحفوظة في أرشيف العائلة.
              </p>
            </div>

            {/* Search & Category Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={refSearch}
                  onChange={(e) => setRefSearch(e.target.value)}
                  placeholder="ابحث في المراجع أو الحواضر..."
                  aria-label="ابحث في المراجع التاريخية"
                  className={`w-full sm:w-64 pr-10 pl-4 py-2 text-xs rounded-xl border outline-none transition-colors ${
                    isDark
                      ? 'bg-[#0E1624] border-slate-800 text-slate-100 focus:border-[#C59B27]'
                      : 'bg-white border-slate-200 text-slate-900 focus:border-[#C59B27]'
                  }`}
                />
              </div>

              <div
                className={`flex flex-wrap items-center gap-1 p-1 rounded-xl border ${
                  isDark
                    ? 'bg-[#0E1624] border-slate-800'
                    : 'bg-slate-100 border-slate-200'
                }`}
              >
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'genealogy', label: 'الأنساب' },
                  { id: 'geography', label: 'البلدان' },
                  { id: 'manuscripts', label: 'الوثائق' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setRefCategory(tab.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      refCategory === tab.id
                        ? 'bg-[#C59B27] text-slate-950 font-semibold'
                        : isDark
                        ? 'text-slate-300 hover:text-white'
                        : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* List of References */}
            <div className="lg:col-span-7 space-y-3">
              {filteredReferences.length === 0 ? (
                <div
                  className={`p-8 rounded-2xl border text-center ${
                    isDark
                      ? 'bg-[#0E1624] border-slate-800 text-slate-400'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  لا توجد مراجع مطابقة لعبارة البحث الحالية. يمكنك مسح التصفية لعرض جميع المصادر.
                </div>
              ) : (
                filteredReferences.map((ref) => {
                  const isSelected = selectedReference.id === ref.id;
                  return (
                    <div
                      key={ref.id}
                      onClick={() => setSelectedReference(ref)}
                      className={`p-5 rounded-xl border transition-colors cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'bg-[#0E1624] border-[#C59B27]'
                            : 'bg-white border-[#C59B27]'
                          : isDark
                          ? 'bg-[#0E1624]/60 border-slate-800/80 hover:border-slate-700'
                          : 'bg-white border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
                        <div className="flex items-center gap-2 text-[#C59B27]">
                          <span className="font-mono font-semibold">{ref.index}.</span>
                          <span>{ref.categoryLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span>{ref.regionFocus}</span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                          {ref.archivalCode}
                        </span>
                      </div>

                      <h3
                        className={`font-display text-lg lg:text-xl font-bold mb-1 ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {ref.title}
                      </h3>

                      <div
                        className={`text-xs mb-2.5 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        <span>المؤلف / الجهة: {ref.author}</span>
                        <span className="mx-2" aria-hidden="true">·</span>
                        <span>{ref.publicationPeriod}</span>
                      </div>

                      <p
                        className={`text-xs lg:text-sm leading-relaxed ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        {ref.summary}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Archival Excerpt Reader Card */}
            <div
              className={`lg:col-span-5 p-6 lg:p-8 rounded-2xl border sticky top-24 ${
                isDark
                  ? 'bg-[#0E1624] border-slate-800'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-xs text-[#C59B27] mb-3">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>بطاقة المستند والاقتباس المرجعي</span>
                </div>
                <span className="font-mono text-[11px] tabular-nums">
                  {selectedReference.archivalCode}
                </span>
              </div>

              <h3
                className={`font-display text-2xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                {selectedReference.title}
              </h3>

              <div
                className={`text-xs pb-4 mb-5 border-b ${
                  isDark
                    ? 'text-slate-400 border-slate-800'
                    : 'text-slate-600 border-slate-200'
                }`}
              >
                <span>{selectedReference.author}</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>{selectedReference.regionFocus}</span>
              </div>

              <div
                className={`p-5 rounded-xl border mb-6 font-display text-base lg:text-lg leading-[1.9] ${
                  isDark
                    ? 'bg-[#090E17] border-slate-800/90 text-amber-100/95'
                    : 'bg-[#FAF8F5] border-slate-200 text-slate-900'
                }`}
              >
                {selectedReference.excerpt}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `${selectedReference.title} — ${selectedReference.author}: ${selectedReference.excerpt}`,
                      `ref-${selectedReference.id}`
                    )
                  }
                  className={`px-4 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                      : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  {copiedKey === `ref-${selectedReference.id}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>تم نسخ الاقتباس المرجعي</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ التوثيق المرجعي</span>
                    </>
                  )}
                </button>

                <a
                  href="#contact"
                  className="text-xs font-medium text-[#C59B27] hover:underline underline-offset-4 whitespace-nowrap shrink-0"
                >
                  إرسال وثيقة أو مخطوطة للجنة ←
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Services & Digital Infrastructure Portal (#infrastructure) */}
        <section
          id="infrastructure"
          className={`py-16 lg:py-24 border-b ${
            isDark ? 'border-slate-800/80' : 'border-slate-200'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <div className="text-xs font-medium text-[#C59B27] mb-2">
                03. بوابة الخدمات والبنية التحتية الرقمية — elsaidy.org
              </div>
              <h2
                className={`font-display text-3xl lg:text-4xl font-bold tracking-tight mb-3 ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                المنظومة الرقمية والأنظمة المؤسسية لعائلة الصعيدي
              </h2>
              <p
                className={`text-sm lg:text-base leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                بنية سحابية سيادية متكاملة تخدم أعمال العائلة، الأوقاف، الاتصالات الرسمية المشفرة،
                والنشر المعرفي عبر حزمة متطورة من الأنظمة المؤسسية المفتوحة المصدر والمؤمّنة بالكامل.
              </p>
            </div>

            {/* Interactive Category Filter */}
            <div
              className={`flex flex-wrap items-center gap-1 p-1.5 rounded-xl border self-start lg:self-end ${
                isDark
                  ? 'bg-[#0E1624] border-slate-800'
                  : 'bg-slate-100 border-slate-200'
              }`}
              role="tablist"
              aria-label="تصفية الأنظمة الرقمية"
            >
              {[
                { id: 'all', label: 'جميع الأنظمة' },
                { id: 'enterprise', label: 'الأنظمة الإدارية (ERPNext)' },
                { id: 'communication', label: 'البريد والاتصال (Mailcow)' },
                { id: 'publishing', label: 'المدونة والنشر' },
                { id: 'security', label: 'الهوية والشبكات' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={serviceCategory === cat.id}
                  onClick={() => setServiceCategory(cat.id)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    serviceCategory === cat.id
                      ? 'bg-[#C59B27] text-slate-950 font-semibold'
                      : isDark
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Asymmetric Bento Grid of Infrastructure Systems */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {filteredServices.map((service, idx) => {
              // Give marquee prominence (col-span-6 or col-span-8/4 asymmetric rhythm)
              const spanClass =
                filteredServices.length >= 3 && idx < 2
                  ? 'lg:col-span-6'
                  : 'lg:col-span-4';

              return (
                <div
                  key={service.id}
                  className={`${spanClass} p-6 lg:p-7 rounded-2xl border flex flex-col justify-between transition-colors ${
                    isDark
                      ? 'bg-[#0E1624] border-slate-800/90 hover:border-[#C59B27]/60'
                      : 'bg-white border-slate-200/90 hover:border-[#C59B27]/60'
                  }`}
                >
                  <div>
                    {/* Unboxed Metadata Kicker */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-3">
                      <div className="flex items-center gap-2 text-[#C59B27]">
                        <span className="font-mono font-semibold">{service.index}.</span>
                        <span>{service.categoryLabel}</span>
                      </div>
                      <span className="font-mono text-xs text-emerald-500 font-medium">
                        {service.domain}
                      </span>
                    </div>

                    <h3
                      className={`font-display text-xl lg:text-2xl font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-slate-950'
                      }`}
                    >
                      {service.arabicTitle}
                    </h3>

                    <div
                      className={`text-xs font-mono mb-4 pb-3 border-b ${
                        isDark
                          ? 'text-slate-400 border-slate-800'
                          : 'text-slate-500 border-slate-200'
                      }`}
                    >
                      {service.name} · {service.protocol}
                    </div>

                    <p
                      className={`text-sm leading-[1.75] mb-5 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      {service.description}
                    </p>

                    <ul className="space-y-2 mb-6 text-xs">
                      {service.capabilities.map((cap, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-2">
                          <span className="font-mono text-[#C59B27] font-semibold">·</span>
                          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                            {cap}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Footer Actions */}
                  <div
                    className={`pt-4 border-t flex flex-wrap items-center justify-between gap-3 ${
                      isDark ? 'border-slate-800' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <a
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-[#C59B27] text-slate-950 text-xs font-semibold hover:bg-[#d4ab32] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                      >
                        <span>فتح النظام</span>
                        <ArrowUpLeft className="w-3.5 h-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={() => setInspectedService(service)}
                        className={`px-3.5 py-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          isDark
                            ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                            : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        المواصفات والصلاحيات
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(service.url, `srv-${service.id}`)}
                      title="نسخ رابط النظام"
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        isDark
                          ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                          : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {copiedKey === `srv-${service.id}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 5: Knowledge & Heritage Blog Highlights (blog.elsaidy.org) */}
        <section
          id="blog-highlights"
          className={`py-16 lg:py-24 border-b ${
            isDark ? 'border-slate-800/80' : 'border-slate-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-medium text-[#C59B27] mb-2">
                04. المدونة والأرشيف المعرفي — blog.elsaidy.org
              </div>
              <h2
                className={`font-display text-3xl lg:text-4xl font-bold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                أحدث الدراسات التاريخية والمقالات التقنية
              </h2>
            </div>

            <a
              href="https://blog.elsaidy.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl border border-[#C59B27]/50 text-[#C59B27] text-xs font-semibold hover:bg-[#C59B27] hover:text-slate-950 transition-colors flex items-center gap-2 self-start sm:self-end whitespace-nowrap shrink-0"
            >
              <span>زيارة المدونة الرسمية (blog.elsaidy.org)</span>
              <ArrowUpLeft className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLOG_ARTICLES.map((post, index) => (
              <article
                key={post.id}
                className={`p-6 rounded-2xl border flex flex-col justify-between transition-colors ${
                  isDark
                    ? 'bg-[#0E1624] border-slate-800/90 hover:border-slate-700'
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Clean Unboxed Metadata */}
                  <div
                    className={`flex flex-wrap items-center gap-2 text-xs mb-3 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    <span className="text-[#C59B27] font-medium">0{index + 1}. {post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.publishDate}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3
                    className={`font-display text-xl font-bold leading-snug mb-3 ${
                      isDark ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {post.title}
                  </h3>

                  <p
                    className={`text-sm leading-relaxed mb-6 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {post.excerpt}
                  </p>
                </div>

                <div
                  className={`pt-4 border-t flex items-center justify-between gap-2 text-xs ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveArticle(post)}
                    className="font-semibold text-[#C59B27] hover:underline underline-offset-4 cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0"
                  >
                    <span>قراءة الملخص الكامل</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-mono text-[11px] hover:underline ${
                      isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    blog.elsaidy.org ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Section 6: Interactive Contact & Access Request Portal (#contact) */}
        <section id="contact" className="py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <div className="text-xs font-medium text-[#C59B27] mb-2">
                05. التواصل وطلبات الحسابات والتوثيق
              </div>
              <h2
                className={`font-display text-3xl lg:text-4xl font-bold tracking-tight mb-4 ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                تواصل مع مجلس العائلة وفريق البنية الرقمية
              </h2>
              <p
                className={`text-sm lg:text-base leading-relaxed mb-8 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                سواء كنت من أبناء عائلة الصعيدي الراغبين في إصدار بريد إلكتروني رسمي على النطاق{' '}
                <span className="font-mono text-[#C59B27]">@elsaidy.org</span>، أو تفعيل صلاحيات
                الدخول إلى نظام <span className="font-mono">ERPNext</span>، أو لديك وثائق ومشجرات
                تاريخية تود إضافتها إلى الأرشيف الرقمي، يسعدنا استقبال مراسلتك.
              </p>

              <div
                className={`p-6 rounded-2xl border space-y-4 ${
                  isDark ? 'bg-[#0E1624] border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-[#C59B27] mt-1 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-[#C59B27]">النطاق الرسمي والمدونة</div>
                    <div className="text-sm font-mono mt-0.5">elsaidy.org · blog.elsaidy.org</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#C59B27] mt-1 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-[#C59B27]">البريد الرسمي والاتصال الموحد</div>
                    <div className="text-sm font-mono mt-0.5">info@elsaidy.org · mail.elsaidy.org</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-[#C59B27] mt-1 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-[#C59B27]">الحواضر والفروع الممثلة</div>
                    <div className={`text-xs mt-0.5 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      ينبع · تيماء · تبوك · حائل · الرياض · بلاد الشام · الإمارات · سلطنة عُمان
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Validated Interactive Form */}
            <div
              className={`lg:col-span-7 p-6 lg:p-8 rounded-2xl border ${
                isDark ? 'bg-[#0E1624] border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              {formSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3
                    className={`font-display text-2xl font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    تم استلام طلبك بنجاح في بوابة عائلة الصعيدي
                  </h3>
                  <p
                    className={`text-sm max-w-md mx-auto leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    شكراً لك <strong>{formData.fullName}</strong> ({formData.branch}). سيقوم فريق
                    التوثيق والبنية الرقمية بمراجعة طلبك ({formData.requestType}) والتواصل معك عبر{' '}
                    <span className="font-mono">{formData.email}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        ...formData,
                        message: ''
                      });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#C59B27] text-slate-950 text-xs font-semibold hover:bg-[#d4ab32] transition-colors cursor-pointer"
                  >
                    إرسال طلب آخر
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="fullName"
                        className={`block text-xs font-medium mb-2 ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        الاسم الكامل (الثلاثي أو الرباعي)
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="مثال: علي بن أحمد الصعيدي"
                        className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-colors ${
                          isDark
                            ? 'bg-[#090E17] border-slate-800 text-white focus:border-[#C59B27]'
                            : 'bg-[#FAF8F5] border-slate-300 text-slate-900 focus:border-[#C59B27]'
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="branch"
                        className={`block text-xs font-medium mb-2 ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        الفرع العائلي / المنطقة
                      </label>
                      <select
                        id="branch"
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-colors ${
                          isDark
                            ? 'bg-[#090E17] border-slate-800 text-white focus:border-[#C59B27]'
                            : 'bg-[#FAF8F5] border-slate-300 text-slate-900 focus:border-[#C59B27]'
                        }`}
                      >
                        <option value="الموطن الأول — ينبع النخل وينبع البحر">
                          الموطن الأول — ينبع النخل وينبع البحر
                        </option>
                        <option value="فرع عبد الله — تيماء وتبوك">
                          فرع عبد الله — تيماء وتبوك
                        </option>
                        <option value="فرع سلامة — بلاد الشام">
                          فرع سلامة — بلاد الشام
                        </option>
                        <option value="فرع صالح وعلي — حائل والرياض">
                          فرع صالح وعلي — حائل والرياض
                        </option>
                        <option value="فرع الخليج العربي — الإمارات وسلطنة عُمان">
                          فرع الخليج العربي — الإمارات وسلطنة عُمان
                        </option>
                        <option value="باحث تاريخي / جهة خارجية">
                          باحث تاريخي / جهة خارجية
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="email"
                        className={`block text-xs font-medium mb-2 ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        البريد الإلكتروني للتواصل
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        dir="ltr"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className={`w-full px-4 py-2.5 text-sm text-right rounded-xl border outline-none transition-colors font-mono ${
                          isDark
                            ? 'bg-[#090E17] border-slate-800 text-white focus:border-[#C59B27]'
                            : 'bg-[#FAF8F5] border-slate-300 text-slate-900 focus:border-[#C59B27]'
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="requestType"
                        className={`block text-xs font-medium mb-2 ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        نوع الطلب أو المراسلة
                      </label>
                      <select
                        id="requestType"
                        value={formData.requestType}
                        onChange={(e) =>
                          setFormData({ ...formData, requestType: e.target.value })
                        }
                        className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-colors ${
                          isDark
                            ? 'bg-[#090E17] border-slate-800 text-white focus:border-[#C59B27]'
                            : 'bg-[#FAF8F5] border-slate-300 text-slate-900 focus:border-[#C59B27]'
                        }`}
                      >
                        <option value="طلب بريد رسمي (@elsaidy.org)">
                          طلب بريد رسمي (@elsaidy.org — Mailcow)
                        </option>
                        <option value="طلب صلاحية نظام الموارد (ERPNext)">
                          طلب صلاحية نظام الموارد (ERPNext)
                        </option>
                        <option value="توثيق شجرة العائلة أو إرسال وثيقة تاريخية">
                          توثيق شجرة العائلة أو إرسال وثيقة تاريخية
                        </option>
                        <option value="المساهمة بمقال في مدونة العائلة (blog.elsaidy.org)">
                          المساهمة بمقال في مدونة العائلة (blog.elsaidy.org)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className={`block text-xs font-medium mb-2 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      تفاصيل الرسالة أو البيانات التوثيقية
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="اكتب تفاصيل طلبك أو معلومات الوثيقة / الفرع العائلي..."
                      className={`w-full px-4 py-3 text-sm rounded-xl border outline-none transition-colors ${
                        isDark
                          ? 'bg-[#090E17] border-slate-800 text-white focus:border-[#C59B27]'
                          : 'bg-[#FAF8F5] border-slate-300 text-slate-900 focus:border-[#C59B27]'
                      }`}
                    />
                  </div>

                  {formError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                      {formError}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      تُحفظ كافة البيانات بسريّة تامة ضمن خوادم العائلة المشفرة.
                    </span>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-[#C59B27] text-slate-950 text-xs font-semibold hover:bg-[#d4ab32] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      إرسال الطلب والمراسلة
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Corporate & Heritage Footer */}
      <footer
        className={`border-t py-12 px-6 lg:px-12 text-xs ${
          isDark
            ? 'bg-[#070B12] border-slate-800/80 text-slate-400'
            : 'bg-[#F3EFEA] border-slate-200 text-slate-600'
        }`}
      >
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div
              className={`font-display text-lg font-bold mb-1 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              عائلة الصعيدي — البوابة الرسمية والبنية الرقمية (Elsaidy Family)
            </div>
            <p className="leading-relaxed">
              من قبيلة جهينة القضاعية · ينبع النخل · تيماء · حائل · الرياض · تبوك · بلاد الشام ·
              الإمارات · سلطنة عُمان
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#lineage" className="hover:text-[#C59B27] transition-colors">
              الجذور والتاريخ
            </a>
            <a href="#branches" className="hover:text-[#C59B27] transition-colors">
              فروع العائلة
            </a>
            <a href="#references" className="hover:text-[#C59B27] transition-colors">
              المصادر التاريخية
            </a>
            <a href="#infrastructure" className="hover:text-[#C59B27] transition-colors">
              منظومة ERPNext &amp; Mailcow
            </a>
            <a
              href="https://blog.elsaidy.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C59B27] transition-colors font-mono"
            >
              blog.elsaidy.org
            </a>
          </div>
        </div>

        <div
          className={`max-w-[1280px] mx-auto mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isDark ? 'border-slate-800/60' : 'border-slate-300/70'
          }`}
        >
          <div>
            © {new Date().getFullYear()} عائلة الصعيدي (Elsaidy Family). جميع الحقوق محفوظة.
          </div>
          <div className="font-mono text-[11px]">
            elsaidy.org · erp.elsaidy.org · mail.elsaidy.org · blog.elsaidy.org
          </div>
        </div>
      </footer>

      {/* Interactive Service Specifications Modal */}
      {inspectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setInspectedService(null)}
        >
          <div
            className={`w-full max-w-xl rounded-2xl border p-6 lg:p-8 ${
              isDark
                ? 'bg-[#0E1624] border-slate-700 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-700/40">
              <div>
                <div className="text-xs text-[#C59B27] font-mono">
                  {inspectedService.domain} · {inspectedService.categoryLabel}
                </div>
                <h3 className="font-display text-2xl font-bold mt-1">
                  {inspectedService.arabicTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedService(null)}
                className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <p className={isDark ? 'text-slate-300 leading-relaxed' : 'text-slate-700 leading-relaxed'}>
                {inspectedService.description}
              </p>

              <div
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  isDark ? 'bg-[#090E17] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">النطاق المعتمد:</span>
                  <span className="font-mono text-[#C59B27]">{inspectedService.domain}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">بروتوكول الأمان:</span>
                  <span className="font-mono">{inspectedService.protocol}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">مستوى الصلاحية:</span>
                  <span>{inspectedService.accessLevel}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">المعمارية:</span>
                  <span>{inspectedService.architectureNote}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    const srvTitle = inspectedService.arabicTitle;
                    setInspectedService(null);
                    setFormData((prev) => ({
                      ...prev,
                      requestType: `طلب صلاحية: ${srvTitle}`
                    }));
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-medium cursor-pointer ${
                    isDark
                      ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                      : 'border-slate-300 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  طلب حساب أو صلاحية دخول
                </button>
                <a
                  href={inspectedService.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#C59B27] text-slate-950 text-xs font-semibold hover:bg-[#d4ab32] transition-colors flex items-center gap-1.5"
                >
                  <span>الانتقال إلى {inspectedService.domain}</span>
                  <ArrowUpLeft className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Blog Article Reader Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className={`w-full max-w-2xl rounded-2xl border p-6 lg:p-8 ${
              isDark
                ? 'bg-[#0E1624] border-slate-700 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-slate-700/40">
              <div>
                <div className="text-xs text-[#C59B27] mb-1">
                  {activeArticle.category} · {activeArticle.publishDate} · {activeArticle.readTime}
                </div>
                <h3 className="font-display text-2xl font-bold leading-snug">
                  {activeArticle.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer shrink-0"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p
              className={`text-base leading-[1.95] mb-6 ${
                isDark ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              {activeArticle.fullText}
            </p>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-700/40 text-xs">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                إعداد: {activeArticle.author}
              </span>
              <a
                href={activeArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#C59B27] text-slate-950 font-semibold hover:bg-[#d4ab32] transition-colors flex items-center gap-1.5"
              >
                <span>متابعة القراءة في blog.elsaidy.org</span>
                <ArrowUpLeft className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
