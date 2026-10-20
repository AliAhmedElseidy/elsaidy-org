import React, { useState } from 'react';
import {
  FAMILY_BRANCHES,
  ELSAIDY_TITLE_ORIGINS,
  HISTORICAL_TIMELINE,
  HISTORICAL_REFERENCES,
  FamilyBranch,
  HistoricalReference,
  PageRoute
} from '../data/familyData';
import {
  Sun,
  Moon,
  BookOpen,
  Search,
  Copy,
  Check,
  MapPin,
  FileText,
  ArrowRight
} from 'lucide-react';

interface AboutPageProps {
  isDark: boolean;
  onToggleTheme: () => void;
  activeBranchId: string;
  onSelectBranch: (id: string) => void;
  onNavigate: (route: PageRoute) => void;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  isDark,
  onToggleTheme,
  activeBranchId,
  onSelectBranch,
  onNavigate,
  copiedKey,
  onCopy
}) => {
  const [refCategory, setRefCategory] = useState<string>('all');
  const [refSearch, setRefSearch] = useState<string>('');
  const [selectedReference, setSelectedReference] = useState<HistoricalReference>(
    HISTORICAL_REFERENCES[0]
  );

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
      ref.summary.includes(q) ||
      ref.academicCitation.includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div>
      {/* Institutional Page Header & Chapter Navigation Rail */}
      <section
        className={`pt-8 pb-12 lg:pt-12 lg:pb-16 border-b ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}
      >
        <div
          className={`flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b text-xs ${
            isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200/80 text-slate-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hover:text-[#C59B27] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </button>
            <span aria-hidden="true">/</span>
            <span className="font-mono text-[#C59B27]">elsaidy.org/about</span>
            <span aria-hidden="true">·</span>
            <span>الموسوعة التاريخية والأنساب الموثقة</span>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
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

        <div className="max-w-4xl">
          <div className="text-xs font-medium text-[#C59B27] mb-3">
            السجل التاريخي المعتمد · لجنة التوثيق والأنساب — عائلة الصعيدي
          </div>
          <h1
            className={`font-display font-bold tracking-tight leading-[1.2] mb-5 ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}
            style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', textWrap: 'balance' }}
          >
            التاريخ، الجذور الجهنية، سبب التسمية بلقب «الصعيدي»، وفروع العائلة في الجزيرة والشام والخليج
          </h1>
          <p
            className={`text-base lg:text-lg leading-[1.85] max-w-[68ch] ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            توثيق تاريخي وأكاديمي شامل يستند إلى معاجم الأنساب المعتمدة، وكتب البلدان، والحجج
            الشرعية والوقفية المحفوظة في ينبع النخل وتيماء وحائل والرياض وتبوك وبلاد الشام والإمارات
            وسلطنة عُمان.
          </p>
        </div>

        {/* Chapter Index Rail */}
        <div
          className={`mt-10 pt-6 border-t flex flex-wrap items-center gap-6 text-xs font-medium ${
            isDark ? 'border-slate-800/80 text-slate-300' : 'border-slate-200 text-slate-700'
          }`}
        >
          <a href="#ch-origins" className="hover:text-[#C59B27] transition-colors">
            01. الأصول القبلية في ينبع
          </a>
          <a href="#ch-title-reason" className="hover:text-[#C59B27] transition-colors">
            02. سبب التسمية بلقب «الصعيدي»
          </a>
          <a href="#ch-branches" className="hover:text-[#C59B27] transition-colors">
            03. الفروع التاريخية الخمسة
          </a>
          <a href="#ch-timeline" className="hover:text-[#C59B27] transition-colors">
            04. التسلسل الزمني للهجرات
          </a>
          <a href="#ch-references" className="hover:text-[#C59B27] transition-colors">
            05. المراجع الأكاديمية والوثائق
          </a>
        </div>
      </section>

      {/* Chapter 01: Asymmetric Reading Canvas with Margin Notes (الأصول القبلية والموطن الأول) */}
      <section
        id="ch-origins"
        className={`py-16 lg:py-20 border-b scroll-mt-20 ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* 70% Main Editorial Reading Column */}
          <div className="lg:col-span-8">
            <div className="text-xs font-medium text-[#C59B27] mb-2">
              الفصل الأول · الجذور والنسب الأصيل
            </div>
            <h2
              className={`font-display text-3xl lg:text-4xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              النسب الجهني القضاعي والموطن التاريخي الأول في ينبع النخل وينبع البحر
            </h2>

            <div
              className={`space-y-5 text-base lg:text-[17px] leading-[1.9] max-w-[68ch] ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              <p>
                تنتسب عائلة الصعيدي (آل صعيدي) بالأصالة والتواتر والوثائق الشرعية إلى{' '}
                <strong className="font-semibold text-[#C59B27]">
                  قبيلة جهينة بن زيد بن ليث بن سود بن أسلم بن الحاف بن قضاعة
                </strong>
                ، وهي من أعرق القبائل العربية التي استوطنت إقليم الحجاز وساحل البحر الأحمر وأودية
                ينبع والعيص والمروة منذ العصور الإسلامية الأولى وحتى يومنا الحاضر.
              </p>
              <p>
                وقد شكّلت <strong>ينبع النخل</strong> بعيونها الجارية وقراها الزراعية الغنّاء، إلى
                جانب <strong>ينبع البحر</strong> بمرفئها التجاري الاستراتيجي على ساحل البحر الأحمر،
                الموطن التاريخي الأول لآل صعيدي. وفي هذه الحاضرة الحجازية العريقة، تأسست مكانة
                الأسرة في الزراعة والتجارة وتسيير القوافل بين الحرمين الشريفين وحواضر الشمال والشام
                ومصر.
              </p>

              {/* Editorial Pull Quote */}
              <blockquote
                className={`my-8 py-6 border-y font-display text-xl lg:text-2xl italic leading-relaxed ${
                  isDark
                    ? 'border-slate-800 text-amber-100/95'
                    : 'border-slate-200 text-slate-900'
                }`}
              >
                «ظلّت ينبع النخل وينبع البحر المنطلق التاريخي لأسرة الصعيدي من قبيلة جهينة، ومنها
                سارت فروع الأجداد نحو تيماء وتبوك وحائل والرياض وبلاد الشام والخليج العربي، محافظةً
                على وحدة النسب وأصالة الموروث.»
              </blockquote>

              <p>
                ومع اتساع النشاط التجاري والعمراني في القرون المتأخرة، انطلقت من ينبع هجرات متتابعة
                لأبناء الأسرة نحو المراكز الحضرية الكبرى على طرق التجارة والحج؛ فاستقر{' '}
                <strong>الجد عبد الله</strong> في واحة تيماء وتبوك، واتجه{' '}
                <strong>الجد سلامة</strong> شمالاً إلى بلاد الشام، بينما استقر{' '}
                <strong>الجدّان صالح وعلي</strong> في حاضرة حائل ومنها إلى العاصمة الرياض، وامتدت
                أغصان كريمة من العائلة إلى ساحل الخليج العربي في دولة الإمارات العربية المتحدة
                وسلطنة عُمان.
              </p>
            </div>
          </div>

          {/* 30% Archival Margin Sidebar (dl Metadata Card) */}
          <aside
            className={`lg:col-span-4 p-6 lg:p-7 rounded-2xl border ${
              isDark ? 'bg-[#0E1624] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="text-xs font-semibold text-[#C59B27] mb-4 pb-3 border-b border-slate-700/30">
              بطاقة التوثيق النسبي والجغرافي
            </div>

            <dl className="space-y-4 text-xs">
              <div className={`pb-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <dt className={isDark ? 'text-slate-400 mb-1' : 'text-slate-500 mb-1'}>
                  اسم الأسرة المعتمد
                </dt>
                <dd className={`text-sm font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  عائلة الصعيدي (آل صعيدي — Elsaidy)
                </dd>
              </div>

              <div className={`pb-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <dt className={isDark ? 'text-slate-400 mb-1' : 'text-slate-500 mb-1'}>
                  النسب القبلي الصريح
                </dt>
                <dd className={`font-medium leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  قبيلة جهينة بن زيد بن ليث بن سود بن أسلم بن الحاف بن قضاعة
                </dd>
              </div>

              <div className={`pb-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <dt className={isDark ? 'text-slate-400 mb-1' : 'text-slate-500 mb-1'}>
                  الموطن الأصلي والمنطلق
                </dt>
                <dd className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  ينبع النخل وينبع البحر — إقليم الحجاز
                </dd>
              </div>

              <div className={`pb-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <dt className={isDark ? 'text-slate-400 mb-1' : 'text-slate-500 mb-1'}>
                  الفروع التاريخية الموثقة
                </dt>
                <dd className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  فرع عبد الله (تيماء وتبوك) · فرع سلامة (بلاد الشام) · فرع صالح وعلي (حائل والرياض)
                  · فرع الخليج العربي (الإمارات وسلطنة عُمان)
                </dd>
              </div>

              <div>
                <dt className={isDark ? 'text-slate-400 mb-1' : 'text-slate-500 mb-1'}>
                  رقم القيد الأرشيفي الموحد
                </dt>
                <dd className="font-mono text-[#C59B27] tabular-nums">
                  ARCH-JH-ELS-1448H
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      {/* Chapter 02: سبب التسمية بلقب «الصعيدي» (Reason behind the "Elsaidy" Title) */}
      <section
        id="ch-title-reason"
        className={`py-16 lg:py-20 border-b scroll-mt-20 ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}
      >
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-medium text-[#C59B27] mb-2">
            الفصل الثاني · تحقيق اللقب التاريخي
          </div>
          <h2
            className={`font-display text-3xl lg:text-4xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}
          >
            سبب التسمية بلقب «الصعيدي» ودلالاته التاريخية واللغوية
          </h2>
          <p
            className={`text-sm lg:text-base leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            يرتبط لقب «الصعيدي» لدى فروع الأسرة المنتسبة إلى قبيلة جهينة بثلاثة مرتكزات تاريخية
            ولغوية وتوثيقية متكاملة حفظتها الوثائق الشرعية والروايات المتواترة لدى أعيان العائلة:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ELSAIDY_TITLE_ORIGINS.map((pillar) => (
            <div
              key={pillar.index}
              className={`p-6 lg:p-7 rounded-2xl border flex flex-col justify-between ${
                isDark ? 'bg-[#0E1624] border-slate-800/90' : 'bg-white border-slate-200/90'
              }`}
            >
              <div>
                <div className="text-xs font-mono text-[#C59B27] font-semibold mb-2">
                  المرتكز {pillar.index} · {pillar.subtitle}
                </div>
                <h3
                  className={`font-display text-xl lg:text-2xl font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  {pillar.title}
                </h3>
                <p
                  className={`text-sm leading-[1.85] mb-6 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  {pillar.description}
                </p>
              </div>

              <div
                className={`pt-4 border-t text-xs leading-relaxed ${
                  isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
                }`}
              >
                <strong className="text-[#C59B27]">الشاهد التوثيقي: </strong>
                {pillar.historicalEvidence}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chapter 03: الفروع التاريخية الخمسة (Interactive Branch Explorer) */}
      <section
        id="ch-branches"
        className={`py-16 lg:py-20 border-b scroll-mt-20 ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-medium text-[#C59B27] mb-2">
              الفصل الثالث · الفروع والانتشار الجغرافي
            </div>
            <h2
              className={`font-display text-3xl lg:text-4xl font-bold ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              فروع عائلة الصعيدي في ينبع وتيماء وحائل والرياض والشام والخليج
            </h2>
          </div>

          <div
            className={`flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl border ${
              isDark ? 'bg-[#0E1624] border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
            role="tablist"
          >
            {FAMILY_BRANCHES.map((branch) => {
              const active = branch.id === activeBranch.id;
              return (
                <button
                  key={branch.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onSelectBranch(branch.id)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#C59B27] text-slate-950 font-semibold'
                      : isDark
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  {branch.index}. {branch.coordinates.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Selected Branch Full Dossier */}
          <div
            className={`lg:col-span-7 p-6 lg:p-8 rounded-2xl border flex flex-col justify-between ${
              isDark
                ? 'bg-[#0E1624] border-[#C59B27]/50'
                : 'bg-white border-[#C59B27]/60'
            }`}
          >
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#C59B27] mb-3">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="font-mono font-semibold">فرع رقم {activeBranch.index}</span>
                <span aria-hidden="true">·</span>
                <span>{activeBranch.patriarch}</span>
                <span aria-hidden="true">·</span>
                <span>{activeBranch.era}</span>
              </div>

              <h3
                className={`font-display text-2xl lg:text-3xl font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                {activeBranch.title}
              </h3>

              <div
                className={`text-xs mb-5 pb-4 border-b ${
                  isDark ? 'text-slate-400 border-slate-800' : 'text-slate-600 border-slate-200'
                }`}
              >
                <span>النطاق الإقليمي: {activeBranch.region}</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>الحواضر والمدن: {activeBranch.cities.join(' ، ')}</span>
              </div>

              <p
                className={`text-sm lg:text-base leading-[1.9] mb-6 ${
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
                  أبرز المعالم والإسهامات التاريخية والاجتماعية للفرع:
                </div>
                <ul className="space-y-2.5 text-sm">
                  {activeBranch.notableContributions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="font-mono text-xs text-[#C59B27] mt-0.5 tabular-nums">
                        0{idx + 1}.
                      </span>
                      <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              className={`pt-4 border-t text-xs ${
                isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
              }`}
            >
              <strong className="font-semibold text-[#C59B27]">التوثيق الأرشيفي: </strong>
              {activeBranch.archivalNotes}
            </div>
          </div>

          {/* All Branches Selector Column */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3">
            {FAMILY_BRANCHES.map((branch) => {
              const isSelected = branch.id === activeBranch.id;
              return (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => onSelectBranch(branch.id)}
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
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {branch.cities.slice(0, 2).join(' · ')}
                    </span>
                  </div>
                  <div className="text-base font-bold font-display mb-1">{branch.title}</div>
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
      </section>

      {/* Chapter 04: التسلسل الزمني للهجرات والحواضر */}
      <section
        id="ch-timeline"
        className={`py-16 lg:py-20 border-b scroll-mt-20 ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}
      >
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-medium text-[#C59B27] mb-2">
            الفصل الرابع · المسار التاريخي والزمني
          </div>
          <h2
            className={`font-display text-3xl lg:text-4xl font-bold ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}
          >
            المحطات التاريخية الكبرى لانتشار عائلة الصعيدي
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {HISTORICAL_TIMELINE.map((item, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border flex flex-col justify-between ${
                isDark ? 'bg-[#0E1624] border-slate-800/90' : 'bg-white border-slate-200/90'
              }`}
            >
              <div>
                <div className="text-xs font-mono text-[#C59B27] font-semibold mb-2">
                  0{idx + 1} · {item.era}
                </div>
                <h3
                  className={`font-display text-lg font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-xs leading-relaxed mb-4 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {item.description}
                </p>
              </div>
              <div
                className={`pt-3 border-t text-[11px] ${
                  isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}
              >
                {item.location}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chapter 05: المراجع الأكاديمية والوثائق التاريخية المعتمدة */}
      <section id="ch-references" className="py-16 lg:py-20 scroll-mt-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <div className="text-xs font-medium text-[#C59B27] mb-2">
              الفصل الخامس · البيبليوغرافيا الأكاديمية والوثائق الشرعية
            </div>
            <h2
              className={`font-display text-3xl lg:text-4xl font-bold tracking-tight mb-3 ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              المراجع الأكاديمية والمصادر التاريخية الموثقة
            </h2>
            <p
              className={`text-sm lg:text-base leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              قائمة مفهرسة بأهم المراجع التاريخية ومعاجم الأنساب والوثائق الشرعية المحفوظة، مع
              صياغة الاقتباس الأكاديمي المباشر للباحثين والدارسين.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={refSearch}
                onChange={(e) => setRefSearch(e.target.value)}
                placeholder="ابحث في المراجع أو المؤلفين..."
                aria-label="ابحث في المراجع الأكاديمية"
                className={`w-full sm:w-64 pr-10 pl-4 py-2 text-xs rounded-xl border outline-none transition-colors ${
                  isDark
                    ? 'bg-[#0E1624] border-slate-800 text-slate-100 focus:border-[#C59B27]'
                    : 'bg-white border-slate-200 text-slate-900 focus:border-[#C59B27]'
                }`}
              />
            </div>

            <div
              className={`flex flex-wrap items-center gap-1 p-1 rounded-xl border ${
                isDark ? 'bg-[#0E1624] border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}
            >
              {[
                { id: 'all', label: 'الكل' },
                { id: 'genealogy', label: 'الأنساب' },
                { id: 'geography', label: 'البلدان' },
                { id: 'manuscripts', label: 'الوثائق' },
                { id: 'contemporary', label: 'الأرشيف الرقمي' }
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
          {/* Reference Cards List */}
          <div className="lg:col-span-7 space-y-3">
            {filteredReferences.map((ref) => {
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

                  <div className={`text-xs mb-2.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <span>المؤلف / المصدر: {ref.author}</span>
                    <span className="mx-2" aria-hidden="true">·</span>
                    <span>{ref.publicationPeriod}</span>
                  </div>

                  <p
                    className={`text-xs lg:text-sm leading-relaxed mb-3 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {ref.summary}
                  </p>

                  <div
                    className={`p-3 rounded-lg border text-xs font-mono ${
                      isDark
                        ? 'bg-[#090E17] border-slate-800/90 text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-[#C59B27] font-sans font-semibold ml-1">
                      الاقتباس الأكاديمي:
                    </span>{' '}
                    {ref.academicCitation}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Archival Excerpt & Citation Reader */}
          <div
            className={`lg:col-span-5 p-6 lg:p-8 rounded-2xl border sticky top-24 ${
              isDark ? 'bg-[#0E1624] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between gap-2 text-xs text-[#C59B27] mb-3">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>بطاقة النص المرجعي والاقتباس الأكاديمي</span>
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
                isDark ? 'text-slate-400 border-slate-800' : 'text-slate-600 border-slate-200'
              }`}
            >
              <span>{selectedReference.author}</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>{selectedReference.regionFocus}</span>
            </div>

            <div
              className={`p-5 rounded-xl border mb-5 font-display text-base lg:text-lg leading-[1.9] ${
                isDark
                  ? 'bg-[#090E17] border-slate-800/90 text-amber-100/95'
                  : 'bg-[#FAF8F5] border-slate-200 text-slate-900'
              }`}
            >
              {selectedReference.excerpt}
            </div>

            <div
              className={`p-4 rounded-xl border mb-6 text-xs leading-relaxed ${
                isDark
                  ? 'bg-[#090E17]/60 border-slate-800 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="font-semibold text-[#C59B27] mb-1">صيغة التوثيق الأكاديمي (APA / MLA):</div>
              <div>{selectedReference.academicCitation}</div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  onCopy(
                    `${selectedReference.academicCitation}\nالنص المقتبس: ${selectedReference.excerpt}`,
                    `acad-${selectedReference.id}`
                  )
                }
                className="px-4 py-2.5 rounded-xl bg-[#C59B27] text-slate-950 text-xs font-semibold flex items-center gap-2 hover:bg-[#d4ab32] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {copiedKey === `acad-${selectedReference.id}` ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>تم نسخ التوثيق الأكاديمي</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ التوثيق الأكاديمي</span>
                  </>
                )}
              </button>

              <a
                href="#contact-portal"
                className="text-xs font-medium text-[#C59B27] hover:underline underline-offset-4 whitespace-nowrap shrink-0"
              >
                إيداع وثيقة تاريخية جديدة ←
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
