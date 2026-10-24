import React, { useState, useMemo, useEffect } from 'react';
import {
  ELSAIDY_ENCYCLOPEDIA_ENTRIES,
  ENCYCLOPEDIA_FILTER_TABS,
  ENCYCLOPEDIA_STORAGE_SUBMISSIONS_KEY,
  EncyclopediaAtlasEntry,
  EncyclopediaBranchSubmission,
  EncyclopediaFilterCategory,
} from '../data/elsaidyEncyclopedia';
import { PageRoute } from '../data/familyData';
import {
  Search,
  MapPin,
  BookOpen,
  GitBranch,
  Copy,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Plus,
  ShieldCheck,
  Globe2,
  Building2,
  Send,
  Sparkles,
} from 'lucide-react';

interface ElsaidyEncyclopediaDirectoryProps {
  onNavigate?: (route: PageRoute) => void;
  defaultCategory?: EncyclopediaFilterCategory;
  compactHeader?: boolean;
}

export const ElsaidyEncyclopediaDirectory: React.FC<ElsaidyEncyclopediaDirectoryProps> = ({
  onNavigate,
  defaultCategory = 'all',
  compactHeader = false,
}) => {
  const [activeCategory, setActiveCategory] =
    useState<EncyclopediaFilterCategory>(defaultCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEntry, setSelectedEntry] = useState<EncyclopediaAtlasEntry | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Collapsible sections inside the Slide-Over Detail Drawer
  const [openSections, setOpenSections] = useState<{
    history: boolean;
    centers: boolean;
    branches: boolean;
    landmarks: boolean;
  }>({
    history: true,
    centers: true,
    branches: true,
    landmarks: true,
  });

  // "سجّل فرع عائلتك في الموسوعة" Form Modal / Drawer State
  const [isSubmitBranchOpen, setIsSubmitBranchOpen] = useState<boolean>(false);
  const [submissions, setSubmissions] = useState<EncyclopediaBranchSubmission[]>(() => {
    try {
      const raw = localStorage.getItem(ENCYCLOPEDIA_STORAGE_SUBMISSIONS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [branchForm, setBranchForm] = useState({
    fullName: '',
    countryOrGovernorate: 'محافظة الغربية — جمهورية مصر العربية',
    centerOrVillage: '',
    branchOrHouseName: '',
    ancestorOrParentName: '',
    lineageType: 'فرع موثق من عائلات الصعيدي (جهينة / الأشراف / الصعيد والدلتا)',
    contactInfo: '',
    historicalNotes: '',
  });
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string>('');

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedEntry) setSelectedEntry(null);
        if (isSubmitBranchOpen) setIsSubmitBranchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEntry, isSubmitBranchOpen]);

  // Merge static encyclopedia entries with any approved visitor/admin branch submissions
  const allEntries = useMemo(() => {
    const approvedCustomEntries: EncyclopediaAtlasEntry[] = submissions
      .filter((s) => s.status === 'approved')
      .map((s) => ({
        id: `custom-enc-${s.id}`,
        category: 'egypt-delta',
        categoryLabel: 'فرع موثق مضاف للموسوعة',
        region: s.countryOrGovernorate,
        governorate: `${s.countryOrGovernorate} — ${s.centerOrVillage}`,
        englishName: `${s.branchOrHouseName} (${s.countryOrGovernorate})`,
        badgeTag: 'فرع معتمد في السجل',
        lineageType: s.lineageType,
        shortPreview:
          s.historicalNotes.slice(0, 150) ||
          `فرع ${s.branchOrHouseName} في ${s.centerOrVillage} (${s.countryOrGovernorate}).`,
        historicalOverview:
          s.historicalNotes ||
          `تم توثيق وتسجيل فرع (${s.branchOrHouseName}) في ${s.centerOrVillage} التابعة لـ (${s.countryOrGovernorate}) ضمن السجل الموسوعي لعائلات الصعيدي، ويتصل بالجد أو العلم (${s.ancestorOrParentName || 'عمود النسب العام'}).`,
        keyCentersAndVillages: [s.centerOrVillage, s.countryOrGovernorate],
        knownBranches: [
          s.branchOrHouseName,
          s.ancestorOrParentName ? `ذرية وعقب: ${s.ancestorOrParentName}` : 'آل الصعيدي',
        ],
        landmarks: [`مقر الفرع في ${s.centerOrVillage} — مسجل بواسطة: ${s.fullName}`],
        relatedTreeBranch: 'فرع مصر (الغربية وطنطا والصعيد والقاهرة)',
      }));

    return [...approvedCustomEntries, ...ELSAIDY_ENCYCLOPEDIA_ENTRIES];
  }, [submissions]);

  // Count entries per category for filter buttons
  const categoryCounts = useMemo(() => {
    const counts: Record<EncyclopediaFilterCategory, number> = {
      all: allEntries.length,
      origins: 0,
      'egypt-delta': 0,
      'egypt-upper': 0,
      'cairo-canal': 0,
      'saudi-gulf': 0,
      'levant-arab': 0,
      scholars: 0,
    };
    allEntries.forEach((entry) => {
      counts[entry.category] = (counts[entry.category] || 0) + 1;
    });
    return counts;
  }, [allEntries]);

  // Filtered entries by category + search query
  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allEntries.filter((entry) => {
      const matchesCategory =
        activeCategory === 'all' || entry.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;

      const inGov = entry.governorate.toLowerCase().includes(q);
      const inRegion = entry.region.toLowerCase().includes(q);
      const inEng = entry.englishName.toLowerCase().includes(q);
      const inOverview = entry.historicalOverview.toLowerCase().includes(q);
      const inCenters = entry.keyCentersAndVillages.some((c) =>
        c.toLowerCase().includes(q)
      );
      const inBranches = entry.knownBranches.some((b) =>
        b.toLowerCase().includes(q)
      );

      return inGov || inRegion || inEng || inOverview || inCenters || inBranches;
    });
  }, [allEntries, activeCategory, searchQuery]);

  // Total documented centers/villages across all entries
  const totalDocumentedCentersCount = useMemo(() => {
    return allEntries.reduce(
      (acc, item) => acc + item.keyCentersAndVillages.length,
      0
    );
  }, [allEntries]);

  const handleCopyEntryCard = (entry: EncyclopediaAtlasEntry) => {
    const formattedText = [
      `موسوعة وأطلس عائلات الصعيدي (elsaidy.org)`,
      `العنوان: ${entry.governorate}`,
      `الإقليم: ${entry.region}`,
      `تصنيف النسب والامتداد: ${entry.lineageType}`,
      ``,
      `التاريخ ومسار الاستقرار:`,
      entry.historicalOverview,
      ``,
      `أهم المراكز والقرى والحواضر:`,
      ...entry.keyCentersAndVillages.map((c) => `- ${c}`),
      ``,
      `الفروع والبيوت والأعلام:`,
      ...entry.knownBranches.map((b) => `- ${b}`),
      ``,
      `المصدر الرسمي: الموقع الرسمي لعائلات الصعيدي ومجموعة الصعيدي (https://elsaidy.org)`,
    ].join('\n');

    navigator.clipboard.writeText(formattedText);
    setCopiedId(entry.id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === entry.id ? null : prev));
    }, 2200);
  };

  const handleBranchSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !branchForm.fullName.trim() ||
      !branchForm.centerOrVillage.trim() ||
      !branchForm.branchOrHouseName.trim()
    ) {
      return;
    }

    const newRecord: EncyclopediaBranchSubmission = {
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toLocaleDateString('ar-EG'),
      fullName: branchForm.fullName.trim(),
      countryOrGovernorate: branchForm.countryOrGovernorate.trim(),
      centerOrVillage: branchForm.centerOrVillage.trim(),
      branchOrHouseName: branchForm.branchOrHouseName.trim(),
      ancestorOrParentName: branchForm.ancestorOrParentName.trim(),
      lineageType: branchForm.lineageType.trim(),
      contactInfo: branchForm.contactInfo.trim(),
      historicalNotes: branchForm.historicalNotes.trim(),
      status: 'pending',
    };

    const nextList = [newRecord, ...submissions];
    setSubmissions(nextList);
    try {
      localStorage.setItem(
        ENCYCLOPEDIA_STORAGE_SUBMISSIONS_KEY,
        JSON.stringify(nextList)
      );
    } catch {
      // ignore
    }

    setSubmitSuccessMsg(
      `تم استلام وحفظ بيانات فرع (${newRecord.branchOrHouseName} — ${newRecord.centerOrVillage}) بنجاح، وتم إدراجه في قائمة مراجعة الأمانة العامة واعتماد الفروع في لوحة التحكم (/admin-elsaidy).`
    );

    setBranchForm({
      fullName: '',
      countryOrGovernorate: branchForm.countryOrGovernorate,
      centerOrVillage: '',
      branchOrHouseName: '',
      ancestorOrParentName: '',
      lineageType: 'فرع موثق من عائلات الصعيدي (جهينة / الأشراف / الصعيد والدلتا)',
      contactInfo: '',
      historicalNotes: '',
    });
  };

  return (
    <section
      id="elsaidy-pan-arab-encyclopedia"
      className="scroll-mt-24 space-y-6"
      aria-label="موسوعة وأطلس عائلات الصعيدي الشامل في مصر والوطن العربي"
    >
      {/* Main Encyclopedia Container */}
      <div className="bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#0F291E] shadow-sm overflow-hidden">
        {/* Top Masthead Banner */}
        <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-[#0F291E] to-[#141E28] text-white border-b border-[#695022]/40">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#D4AF37] font-bold">
                <Globe2 className="w-4 h-4 shrink-0" />
                <span>الموسوعة الجغرافية والتاريخية الكبرى · ٢٧ محافظة مصرية و١٤ دولة عربية</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-[11px] text-zinc-300">
                  PAN-ARAB ELSAIDY ATLAS
                </span>
              </div>

              <h2
                className={`font-extrabold text-white tracking-tight leading-snug ${
                  compactHeader
                    ? 'text-xl sm:text-2xl lg:text-3xl'
                    : 'text-2xl sm:text-3xl lg:text-4xl'
                }`}
              >
                موسوعة وأطلس عائلات الصعيدي الشامل في محافظات مصر والوطن العربي
              </h2>

              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed max-w-[72ch]">
                دليل تفاعلي منظم يوثق الأصول التاريخية الثلاثة (الأشراف الهاشميين، قبيلة جهينة
                القضاعية والجد الجامع إبراهيم الصعيدي، والنسبة الجغرافية لصعيد مصر)، مع مسح شامل
                للمراكز والقرى والبيوت وأعلام العائلة في الدلتا والصعيد والقاهرة والسعودية والشام
                والخليج والمغرب العربي.
              </p>
            </div>

            {/* Action Buttons: Submit Family Branch & Quick Metrics */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setSubmitSuccessMsg('');
                  setIsSubmitBranchOpen(true);
                }}
                className="px-5 py-3 rounded-xl bg-[#D4AF37] text-[#0D131A] text-xs font-extrabold hover:bg-[#e3be42] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>سجّل فرع عائلتك أو قريتك في الموسوعة</span>
              </button>

              <div className="flex items-center gap-3 text-[11px] text-zinc-300 px-1">
                <span>
                  <strong className="text-[#D4AF37] font-mono">{allEntries.length}</strong> مبحثاً
                  وإقليماً موثقاً
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <strong className="text-[#D4AF37] font-mono">
                    {totalDocumentedCentersCount}+
                  </strong>{' '}
                  مركزاً وحاضرة
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Smart Filter Bar (Search + Interactive Category Filter Controls) */}
        <div className="sticky top-[62px] z-30 bg-[#F7F6F2]/95 backdrop-blur-md border-b border-[#E6E2D8] p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            {/* Instant Search Input */}
            <div className="lg:col-span-7 relative">
              <label htmlFor="encyclopedia-atlas-search" className="sr-only">
                ابحث بالمحافظة أو المركز أو القرية أو الدولة أو اسم الفرع
              </label>
              <Search className="w-4 h-4 text-[#695022] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="encyclopedia-atlas-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالمحافظة أو المركز أو القرية أو الدولة (مثال: طنطا، قطور، سوهاج، جهينة، تيماء، حائل، غزة، العدوي)..."
                className="w-full pr-10 pl-20 py-2.5 rounded-xl bg-white border border-[#E6E2D8] text-xs sm:text-sm text-[#141413] shadow-2xs outline-none focus:border-[#0F291E]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#F7F6F2] text-[11px] font-bold text-zinc-700 hover:text-[#141413] cursor-pointer"
                >
                  مسح
                </button>
              )}
            </div>

            {/* Active Result Summary & Reset */}
            <div className="lg:col-span-5 flex flex-wrap items-center justify-between lg:justify-end gap-3 text-xs text-zinc-700">
              <span>
                النتائج المعروضة:{' '}
                <strong className="text-[#0F291E] font-mono">
                  {filteredEntries.length}
                </strong>{' '}
                من أصل {allEntries.length}
              </span>

              {(activeCategory !== 'all' || searchQuery.trim() !== '') && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#E6E2D8] text-xs font-bold text-[#695022] hover:border-[#695022] transition-colors cursor-pointer"
                >
                  عرض كامل الموسوعة
                </button>
              )}
            </div>
          </div>

          {/* Interactive Region Filter Buttons */}
          <div
            className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar"
            role="tablist"
            aria-label="تصفية أقسام موسوعة عائلات الصعيدي"
          >
            {ENCYCLOPEDIA_FILTER_TABS.map((tab) => {
              const isSelected = activeCategory === tab.id;
              const count = categoryCounts[tab.id] || 0;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#0F291E] text-white shadow-xs'
                      : 'bg-white border border-[#E6E2D8] text-zinc-700 hover:border-[#695022] hover:text-[#141413]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`font-mono text-[10px] ${
                      isSelected ? 'text-[#D4AF37]' : 'text-zinc-500'
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean Bento Grid Cards */}
        <div className="p-6 sm:p-8 lg:p-10 bg-[#FBF9F4]">
          {filteredEntries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E6E2D8] p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4">
              <div className="text-lg font-extrabold text-[#141413]">
                لم يتم العثور على نتائج مطابقة لـ «{searchQuery}» في هذا القسم
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                يمكنك البحث باسم المحافظة أو المركز أو الدولة، أو تسجيل فرع عائلتك وقريتك مباشرة
                ليتم إضافتها وتوثيقها في الموسوعة الرسمية.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#0F291E] text-white text-xs font-bold cursor-pointer"
                >
                  إظهار كافة المحافظات والأقاليم
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitSuccessMsg('');
                    setIsSubmitBranchOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#695022] text-[#695022] text-xs font-bold cursor-pointer"
                >
                  + سجّل فرعك أو قريتك الآن
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEntries.map((entry, idx) => {
                const isFeaturedCard =
                  activeCategory === 'all' &&
                  searchQuery.trim() === '' &&
                  (entry.id === 'eg-gharbia' || entry.id === 'origin-juhaynah-qadaah');

                return (
                  <article
                    key={entry.id}
                    onClick={() => {
                      setSelectedEntry(entry);
                      setOpenSections({
                        history: true,
                        centers: true,
                        branches: true,
                        landmarks: true,
                      });
                    }}
                    className={`group bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 shadow-xs hover:shadow-xl hover:border-[#0F291E] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                      isFeaturedCard ? 'md:col-span-2 lg:col-span-2 bg-gradient-to-br from-white to-[#F7F6F2]' : ''
                    }`}
                  >
                    <div>
                      {/* Quiet 1-line text metadata kicker (Zero-pill discipline) */}
                      <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-500 mb-2">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold text-[#695022]">
                            {String(idx + 1).padStart(2, '0')}. {entry.categoryLabel}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#0F291E] font-semibold truncate">
                            {entry.badgeTag}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-500 shrink-0">
                          {entry.keyCentersAndVillages.length} محاور/مراكز
                        </span>
                      </div>

                      {/* Card Title */}
                      <h3 className="text-lg sm:text-xl font-extrabold text-[#141413] group-hover:text-[#0F291E] transition-colors leading-snug mb-1.5">
                        {entry.governorate}
                      </h3>

                      {/* English Subtitle */}
                      <div
                        dir="ltr"
                        className="text-right font-mono text-[11px] text-[#695022] mb-3 truncate"
                      >
                        {entry.englishName}
                      </div>

                      {/* 2-Line Preview */}
                      <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed line-clamp-2 mb-4">
                        {entry.shortPreview}
                      </p>

                      {/* Preview of Key Centers / Villages */}
                      <div className="p-3 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]/80 text-xs text-zinc-700 mb-4">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-[#0F291E] mb-1">
                          <MapPin className="w-3 h-3 text-[#695022] shrink-0" />
                          <span>أبرز المراكز والحواضر المسجلة:</span>
                        </div>
                        <p className="text-[11px] text-zinc-600 line-clamp-1 leading-relaxed">
                          {entry.keyCentersAndVillages.join(' · ')}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer Action */}
                    <div className="pt-3 border-t border-[#E6E2D8] flex items-center justify-between gap-2 text-xs">
                      <span className="text-[11px] text-zinc-600 truncate max-w-[65%]">
                        {entry.lineageType}
                      </span>
                      <span className="font-extrabold text-[#0F291E] group-hover:text-[#695022] transition-colors shrink-0">
                        فتح البطاقة الكاملة ←
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Encyclopedia Bottom Bar */}
        <div className="px-6 py-4 bg-[#F7F6F2] border-t border-[#E6E2D8] flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-600">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#695022] shrink-0" />
            <span>
              هل ترغب في إضافة قريتك أو فرع عائلتك أو جدك المباشر إلى هذا الأطلس؟ يمكنك تسجيله
              مباشرة ليتم اعتماده في السجل العام.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSubmitSuccessMsg('');
              setIsSubmitBranchOpen(true);
            }}
            className="font-extrabold text-[#0F291E] hover:text-[#695022] underline underline-offset-4 cursor-pointer"
          >
            + فتح نموذج تسجيل فرع عائلي في الموسوعة
          </button>
        </div>
      </div>

      {/* ======================================================================
          SLIDE-OVER DETAIL MODAL / DRAWER FOR ANY SELECTED ENCYCLOPEDIA ENTRY
      ====================================================================== */}
      {selectedEntry && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`تفاصيل ${selectedEntry.governorate}`}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex justify-end"
          onClick={() => setSelectedEntry(null)}
        >
          <div
            className="bg-white w-full max-w-2xl h-full overflow-y-auto shadow-2xl border-r-4 border-r-[#695022] flex flex-col justify-between p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Drawer Top Header */}
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#E6E2D8]">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#695022] font-bold">
                    <span>{selectedEntry.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#0F291E]">{selectedEntry.badgeTag}</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#141413] leading-snug">
                    {selectedEntry.governorate}
                  </h3>
                  <div
                    dir="ltr"
                    className="text-right font-mono text-xs text-zinc-500"
                  >
                    {selectedEntry.englishName}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedEntry(null)}
                  aria-label="إغلاق البطاقة"
                  className="p-2 rounded-xl bg-[#F7F6F2] text-zinc-700 hover:bg-[#141413] hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lineage Classification Box */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#0F291E] to-[#141E28] text-white space-y-1.5">
                <div className="text-[11px] text-[#D4AF37] font-bold">
                  الإقليم الجغرافي وتصنيف الامتداد النسبي:
                </div>
                <div className="text-xs sm:text-sm font-bold text-white">
                  {selectedEntry.region}
                </div>
                <div className="text-xs text-zinc-300">{selectedEntry.lineageType}</div>
              </div>

              {/* Collapsible Section 1: التاريخ والجذور ومسار الاستقرار */}
              <div className="rounded-xl border border-[#E6E2D8] overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setOpenSections((prev) => ({ ...prev, history: !prev.history }))
                  }
                  className="w-full px-5 py-3.5 bg-[#F7F6F2] flex items-center justify-between text-right font-extrabold text-sm text-[#141413] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#695022]" />
                    <span>١. التاريخ والجذور ومسار الاستقرار</span>
                  </span>
                  {openSections.history ? (
                    <ChevronUp className="w-4 h-4 text-zinc-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-600" />
                  )}
                </button>
                {openSections.history && (
                  <div className="p-5 bg-white text-sm text-zinc-800 leading-[1.95] text-justify font-display text-lg">
                    {selectedEntry.historicalOverview}
                  </div>
                )}
              </div>

              {/* Collapsible Section 2: أهم المراكز والقرى والحواضر */}
              <div className="rounded-xl border border-[#E6E2D8] overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setOpenSections((prev) => ({ ...prev, centers: !prev.centers }))
                  }
                  className="w-full px-5 py-3.5 bg-[#F7F6F2] flex items-center justify-between text-right font-extrabold text-sm text-[#141413] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#695022]" />
                    <span>
                      ٢. أهم المراكز والمدن والقرى ({selectedEntry.keyCentersAndVillages.length})
                    </span>
                  </span>
                  {openSections.centers ? (
                    <ChevronUp className="w-4 h-4 text-zinc-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-600" />
                  )}
                </button>
                {openSections.centers && (
                  <div className="p-5 bg-white space-y-2.5">
                    {selectedEntry.keyCentersAndVillages.map((center, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-3 rounded-lg bg-[#FBF9F4] border border-[#E6E2D8] text-xs sm:text-sm font-semibold text-[#141413] flex items-start gap-2"
                      >
                        <span className="font-mono text-xs font-bold text-[#695022] shrink-0">
                          {String(cIdx + 1).padStart(2, '0')}.
                        </span>
                        <span>{center}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Collapsible Section 3: الفروع والبيوت والأعلام */}
              <div className="rounded-xl border border-[#E6E2D8] overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setOpenSections((prev) => ({ ...prev, branches: !prev.branches }))
                  }
                  className="w-full px-5 py-3.5 bg-[#F7F6F2] flex items-center justify-between text-right font-extrabold text-sm text-[#141413] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-[#695022]" />
                    <span>٣. البيوت والتفرعات والأعلام المرتبطة</span>
                  </span>
                  {openSections.branches ? (
                    <ChevronUp className="w-4 h-4 text-zinc-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-600" />
                  )}
                </button>
                {openSections.branches && (
                  <div className="p-5 bg-white space-y-2">
                    {selectedEntry.knownBranches.map((branch, bIdx) => (
                      <div
                        key={bIdx}
                        className="p-3 rounded-lg bg-white border border-[#E6E2D8] border-r-4 border-r-[#0F291E] text-xs sm:text-sm font-bold text-[#141413]"
                      >
                        {branch}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Collapsible Section 4: المعالم والوثائق وروابط شجرة النسب */}
              <div className="rounded-xl border border-[#E6E2D8] overflow-hidden">
                <button
                  type="button"
                  onClick={() =>
                    setOpenSections((prev) => ({ ...prev, landmarks: !prev.landmarks }))
                  }
                  className="w-full px-5 py-3.5 bg-[#F7F6F2] flex items-center justify-between text-right font-extrabold text-sm text-[#141413] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#695022]" />
                    <span>٤. المعالم التاريخية والوثائق المرجعية</span>
                  </span>
                  {openSections.landmarks ? (
                    <ChevronUp className="w-4 h-4 text-zinc-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-600" />
                  )}
                </button>
                {openSections.landmarks && (
                  <div className="p-5 bg-white space-y-2">
                    {selectedEntry.landmarks.map((lm, lIdx) => (
                      <div
                        key={lIdx}
                        className="text-xs sm:text-sm text-zinc-700 leading-relaxed flex items-start gap-2"
                      >
                        <span className="text-[#695022] font-bold">·</span>
                        <span>{lm}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer Actions: Copy Card + Related Links */}
            <div className="pt-5 border-t border-[#E6E2D8] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyEntryCard(selectedEntry)}
                  className="px-4 py-2.5 rounded-xl bg-[#0F291E] text-white text-xs font-extrabold hover:bg-[#141E28] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {copiedId === selectedEntry.id ? (
                    <>
                      <Check className="w-4 h-4 text-[#D4AF37]" />
                      <span>تم نسخ بطاقة المعلومات</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#D4AF37]" />
                      <span>نسخ بطاقة المعلومات</span>
                    </>
                  )}
                </button>

                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEntry(null);
                      onNavigate('verify');
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-xs font-bold text-[#0F291E] hover:border-[#695022] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#695022]" />
                    <span>التحقق من شهادة نسب</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2.5 rounded-xl bg-zinc-100 text-zinc-700 text-xs font-bold hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          INTERACTIVE FORM MODAL: "سجّل فرع عائلتك في الموسوعة"
      ====================================================================== */}
      {isSubmitBranchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="سجّل فرع عائلتك في الموسوعة الرسمية لعائلات الصعيدي"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsSubmitBranchOpen(false)}
        >
          <div
            className="bg-white rounded-2xl border-2 border-[#695022] max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#E6E2D8] pb-4">
              <div>
                <div className="text-xs font-bold text-[#695022] mb-1">
                  الأمانة العامة للتوثيق التاريخي والأنساب · elsaidy.org
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#141413]">
                  سجّل فرع عائلتك أو قريتك في موسوعة الصعيدي الشاملة
                </h3>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  يتيح هذا النموذج لأبناء عائلات الصعيدي في جميع محافظات مصر والدول العربية إرسال
                  بيانات فروعهم وقراهم وأجدادهم ليتم مراجعتها واعتمادها في الموسوعة والشجرة التفاعلية.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitBranchOpen(false)}
                aria-label="إغلاق"
                className="p-2 rounded-lg bg-[#F7F6F2] text-zinc-700 hover:bg-[#141413] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitSuccessMsg && (
              <div className="p-4 rounded-xl bg-[#0F291E]/10 border border-[#0F291E] text-xs font-bold text-[#0F291E] leading-relaxed">
                {submitSuccessMsg}
              </div>
            )}

            <form onSubmit={handleBranchSubmission} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1">
                    اسم مقدم الطلب (رباعياً): *
                  </label>
                  <input
                    type="text"
                    required
                    value={branchForm.fullName}
                    onChange={(e) =>
                      setBranchForm({ ...branchForm, fullName: e.target.value })
                    }
                    placeholder="مثال: أحمد محمد علي الصعيدي"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] outline-none focus:border-[#0F291E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1">
                    الدولة / المحافظة: *
                  </label>
                  <input
                    type="text"
                    required
                    value={branchForm.countryOrGovernorate}
                    onChange={(e) =>
                      setBranchForm({
                        ...branchForm,
                        countryOrGovernorate: e.target.value,
                      })
                    }
                    placeholder="مثال: محافظة الغربية / سوهاج / السعودية - تيماء"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] outline-none focus:border-[#0F291E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1">
                    المركز / المدينة / القرية / النجع: *
                  </label>
                  <input
                    type="text"
                    required
                    value={branchForm.centerOrVillage}
                    onChange={(e) =>
                      setBranchForm({
                        ...branchForm,
                        centerOrVillage: e.target.value,
                      })
                    }
                    placeholder="مثال: مدينة طنطا / مركز قطور / مركز جهينة"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] outline-none focus:border-[#0F291E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1">
                    اسم الفرع أو كبير العائلة / البيت: *
                  </label>
                  <input
                    type="text"
                    required
                    value={branchForm.branchOrHouseName}
                    onChange={(e) =>
                      setBranchForm({
                        ...branchForm,
                        branchOrHouseName: e.target.value,
                      })
                    }
                    placeholder="مثال: بيت الحاج علي الصعيدي / آل حجاج الصعيدي"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] outline-none focus:border-[#0F291E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1">
                    الجد الأعلى المتصل به الفرع (إن عُرف):
                  </label>
                  <input
                    type="text"
                    value={branchForm.ancestorOrParentName}
                    onChange={(e) =>
                      setBranchForm({
                        ...branchForm,
                        ancestorOrParentName: e.target.value,
                      })
                    }
                    placeholder="مثال: إبراهيم الصعيدي / عوض البراهيم / مرسي الحجاج"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] outline-none focus:border-[#0F291E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1">
                    وسيلة التواصل (بريد إلكتروني أو واتساب):
                  </label>
                  <input
                    type="text"
                    value={branchForm.contactInfo}
                    onChange={(e) =>
                      setBranchForm({
                        ...branchForm,
                        contactInfo: e.target.value,
                      })
                    }
                    placeholder="للتواصل عند اعتماد الفرع وإصدار الشهادة"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] outline-none focus:border-[#0F291E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1">
                  نبذة تاريخية عن الفرع وأبرز الأعلام والقرى التابعة له:
                </label>
                <textarea
                  rows={3}
                  value={branchForm.historicalNotes}
                  onChange={(e) =>
                    setBranchForm({
                      ...branchForm,
                      historicalNotes: e.target.value,
                    })
                  }
                  placeholder="اكتب نبذة مختصرة عن تاريخ استقرار الفرع في القرية أو المحافظة وأبرز رجالاته وأعلامه..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] outline-none focus:border-[#0F291E]"
                />
              </div>

              <div className="pt-3 border-t border-[#E6E2D8] flex flex-wrap items-center justify-between gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#0F291E] text-white text-xs font-extrabold hover:bg-[#141E28] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Send className="w-4 h-4 text-[#D4AF37]" />
                  <span>حفظ وإرسال طلب توثيق الفرع للموسوعة</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSubmitBranchOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-100 text-zinc-700 text-xs font-bold hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ElsaidyEncyclopediaDirectory;
