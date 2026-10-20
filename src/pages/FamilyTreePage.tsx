import React, { useState } from 'react';
import {
  OFFICIAL_FAMILY_TREE_IMAGE_URL,
  COMPOUND_NAMES_INDEX,
  PageRoute
} from '../data/familyData';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  ExternalLink,
  ArrowRight,
  X,
  Search
} from 'lucide-react';

interface FamilyTreePageProps {
  onNavigate: (route: PageRoute) => void;
}

export const FamilyTreePage: React.FC<FamilyTreePageProps> = ({ onNavigate }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxZoom, setLightboxZoom] = useState<number>(1.35);
  const [imageError, setImageError] = useState<boolean>(false);
  const [highlightedBranch, setHighlightedBranch] = useState<'all' | 'b1' | 'b2' | 'b3'>('all');
  const [nameSearchQuery, setNameSearchQuery] = useState<string>('');

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  const filteredNames = COMPOUND_NAMES_INDEX.filter((entry) => {
    const q = nameSearchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      entry.arabicName.includes(q) ||
      entry.englishElsaidy.toLowerCase().includes(q) ||
      entry.englishElseidy.toLowerCase().includes(q) ||
      entry.englishAlsaidi.toLowerCase().includes(q) ||
      entry.regions.includes(q)
    );
  });

  return (
    <div>
      {/* Page Breadcrumb & Institutional Header */}
      <section className="pt-8 pb-10 border-b border-[#DCD9D0]">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#DCD9D0] text-xs text-zinc-600">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hover:text-[#8C6D32] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </button>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-[#1B3B2B]">شجرة وفروع العائلة</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-zinc-500">الأرشيف النسبي المصوّر وفهرس الأعلام</span>
          </div>

          <div className="text-xs text-zinc-600">
            <span>الجد السابع الجامع: </span>
            <strong className="text-[#141413]">إبراهيم الصعيدي (قبيلة جهينة — ينبع النخل)</strong>
          </div>
        </div>

        <div className="max-w-4xl">
          <div className="text-xs font-semibold text-[#8C6D32] mb-2">
            سجل المشجرات الوثائقية · الأمانة العامة لعائلة الصعيدي (elsaidy.org)
          </div>
          <h1
            className="font-display font-bold text-[#141413] tracking-tight leading-[1.2] mb-4"
            style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', textWrap: 'balance' }}
          >
            وثيقة شجرة عائلة الصعيدي ودليل تفرع الأبناء والحواضر وفهرس الأعلام
          </h1>
          <p className="text-base text-zinc-700 leading-[1.85] max-w-[72ch]">
            تضم هذه الصفحة الوثيقة المصوّرة المعتمدة لشجرة عائلة الصعيدي مع أدوات التكبير والفحص
            المباشر، متبوعةً بالدليل الهيكلي المفصّل لتفرع العائلة من الجد السابع إبراهيم الصعيدي
            وابنه عوض البراهيم، والفهرس الموسوعي لأسماء وأعلام العائلة باللغتين العربية والإنجليزية.
          </p>
        </div>
      </section>

      {/* Section 1: Official Family Tree Document Viewer (Top Section) */}
      <section className="py-12 lg:py-16 border-b border-[#DCD9D0]">
        <div className="bg-[#F1EFEA] border border-[#DCD9D0]">
          {/* Archival Frame Top Bar & Interactive Controls */}
          <div className="px-6 py-4 bg-[#F8F7F4] border-b border-[#DCD9D0] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#8C6D32] mb-0.5">
                الوثيقة المصوّرة المعتمدة · رقم القيد: ARCH-TREE-01
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#141413]">
                وثيقة شجرة عائلة الصعيدي
              </h2>
            </div>

            {/* Interactive Zoom / Pan / Fullscreen Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleZoomIn}
                className="px-3.5 py-2 bg-[#F1EFEA] border border-[#DCD9D0] text-[#141413] text-xs font-semibold hover:border-[#8C6D32] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <ZoomIn className="w-3.5 h-3.5 text-[#8C6D32]" />
                <span>تكبير الوثيقة +</span>
              </button>

              <button
                type="button"
                onClick={handleZoomOut}
                className="px-3.5 py-2 bg-[#F1EFEA] border border-[#DCD9D0] text-[#141413] text-xs font-semibold hover:border-[#8C6D32] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <ZoomOut className="w-3.5 h-3.5 text-[#8C6D32]" />
                <span>تصغير -</span>
              </button>

              <button
                type="button"
                onClick={handleResetZoom}
                className="px-3 py-2 bg-[#F1EFEA] border border-[#DCD9D0] text-zinc-700 text-xs font-medium hover:border-[#8C6D32] transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                title="إعادة ضبط الحجم"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="font-mono tabular-nums">{Math.round(zoomLevel * 100)}%</span>
              </button>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="px-4 py-2 bg-[#1B3B2B] text-[#F8F7F4] text-xs font-semibold hover:bg-[#141413] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>عرض بملء الشاشة</span>
              </button>

              <a
                href={OFFICIAL_FAMILY_TREE_IMAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#141413] text-[#F8F7F4] text-xs font-semibold hover:bg-[#8C6D32] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <span>فتح الوثيقة الأصلية بالحجم الكامل</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Archival Image Viewport Container */}
          <div className="p-4 sm:p-8 overflow-auto max-h-[720px] bg-[#F1EFEA] flex flex-col items-center justify-center">
            <div
              className="bg-[#F8F7F4] border-2 border-[#8C6D32]/60 p-3 sm:p-5 transition-transform duration-150 origin-top"
              style={{
                transform: `scale(${zoomLevel})`,
                marginBottom: zoomLevel > 1 ? `${(zoomLevel - 1) * 360}px` : '0px'
              }}
            >
              <img
                src={OFFICIAL_FAMILY_TREE_IMAGE_URL}
                alt="وثيقة شجرة عائلة الصعيدي الرسمية — Elsaidy Family Tree"
                referrerPolicy="no-referrer"
                onClick={() => setIsLightboxOpen(true)}
                onError={() => setImageError(true)}
                className="max-w-full h-auto mx-auto block cursor-zoom-in border border-[#DCD9D0]"
              />

              {imageError && (
                <div className="p-8 text-center bg-[#F8F7F4] border border-[#DCD9D0] mt-3 space-y-3 max-w-xl mx-auto">
                  <div className="font-display text-xl font-bold text-[#141413]">
                    معاينة وثيقة شجرة عائلة الصعيدي المصوّرة
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    في حال تعذر تحميل الصورة من الخادم الخارجي بسبب قيود المتصفح، يمكنك فتح الوثيقة
                    الأصلية مباشرة بالحجم الكامل عبر الرابط المعتمد أدناه أو مطالعة المشجرة
                    التفصيلية الكاملة في القسم التالي.
                  </p>
                  <a
                    href={OFFICIAL_FAMILY_TREE_IMAGE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#141413] text-[#F8F7F4] text-xs font-semibold hover:bg-[#8C6D32] transition-colors"
                  >
                    <span>فتح الوثيقة الأصلية بالحجم الكامل</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Archival Plate Footer Caption */}
          <div className="px-6 py-3.5 bg-[#F8F7F4] border-t border-[#DCD9D0] flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-600">
            <div>
              <span>انقر على صورة الوثيقة أو زر «عرض بملء الشاشة» لتفحص الأسماء والتفرعات بدقة عالية.</span>
            </div>
            <a
              href={OFFICIAL_FAMILY_TREE_IMAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#8C6D32] hover:text-[#141413] underline underline-offset-4 flex items-center gap-1"
            >
              <span>رابط المصدر المصوّر المباشر</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* Section 2: Structured Lineage Directory (Middle Section) */}
      <section className="py-14 lg:py-20 border-b border-[#DCD9D0]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-semibold text-[#8C6D32] mb-2">
              الدليل الهيكلي الموثق · تسلسل الأجداد والفروع
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#141413]">
              المشجرة التفصيلية لأعقاب الجد السابع إبراهيم الصعيدي وابنه عوض البراهيم
            </h2>
          </div>

          {/* Interactive Branch Filter */}
          <div
            className="flex flex-wrap items-center gap-1 bg-[#F1EFEA] border border-[#DCD9D0] p-1"
            role="tablist"
            aria-label="تصفية فروع الشجرة"
          >
            {[
              { id: 'all' as const, label: 'كامل المشجرة' },
              { id: 'b1' as const, label: '١. فرع عبد الله (تيماء)' },
              { id: 'b2' as const, label: '٢. فرع سلامة (الشام)' },
              { id: 'b3' as const, label: '٣. فرع صالح (حائل والرياض والخليج)' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={highlightedBranch === tab.id}
                onClick={() => setHighlightedBranch(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  highlightedBranch === tab.id
                    ? 'bg-[#1B3B2B] text-[#F8F7F4] font-semibold'
                    : 'text-zinc-700 hover:text-[#141413]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Hierarchy Container */}
        <div className="bg-[#F1EFEA] border border-[#DCD9D0] p-6 sm:p-10">
          {/* Root & Trunk: 7th Grandfather Ibrahim Elsaidy -> Awad Al-Brahim */}
          <div className="max-w-xl mx-auto text-center">
            <div className="bg-[#1B3B2B] text-[#F8F7F4] border border-[#141413] p-5">
              <div className="text-xs text-[#D6C295] font-medium mb-1">
                الجد السابع الجامع للعائلة · قبيلة جهينة
              </div>
              <div className="font-display text-2xl sm:text-3xl font-bold">
                إبراهيم الصعيدي
              </div>
              <div className="text-xs text-zinc-300 mt-1">
                من قبيلة جهينة من ينبع النخل بالساحل الغربي لشبه الجزيرة العربية
              </div>
            </div>

            <div className="w-px h-6 bg-[#8C6D32] mx-auto" />

            <div className="bg-[#F8F7F4] border-2 border-[#8C6D32] p-5">
              <div className="text-xs text-[#8C6D32] font-semibold mb-1">
                عمود التفرع الجامع
              </div>
              <div className="font-display text-2xl font-bold text-[#141413]">
                عوض البراهيم
              </div>
              <div className="text-xs text-zinc-600 mt-1">
                تفرعت العائلة من ابنه عوض البراهيم من خلال أبنائه الثلاثة: عبد الله، وسلامة، وصالح
              </div>
            </div>

            <div className="w-px h-6 bg-[#8C6D32] mx-auto" />
          </div>

          {/* Horizontal Connector Bar */}
          <div className="border-t-2 border-[#8C6D32] pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Branch 1: Abdullah (Taima) */}
            {(highlightedBranch === 'all' || highlightedBranch === 'b1') && (
              <div className="bg-[#F8F7F4] border border-[#DCD9D0] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs pb-3 mb-4 border-b border-[#DCD9D0]">
                    <span className="font-semibold text-[#8C6D32]">الفرع الأول</span>
                    <span className="text-[#1B3B2B] font-semibold">محافظة تيماء</span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[#141413] mb-2">
                    عبد الله بن عوض البراهيم
                  </h3>

                  <p className="text-xs text-zinc-700 leading-[1.8] mb-5">
                    استقر عبد الله بتيماء مع أبنائه الأربعة، ومنهم امتد فرع العائلة في محافظة تيماء
                    وشمال غرب المملكة:
                  </p>

                  <div className="space-y-2.5">
                    <div className="text-xs font-semibold text-[#8C6D32] mb-1">
                      أبناء عبد الله بن عوض الأربعة في تيماء:
                    </div>
                    {[
                      '١. عوض بن عبد الله',
                      '٢. حامد بن عبد الله',
                      '٣. حمدان بن عبد الله',
                      '٤. بشير بن عبد الله'
                    ].map((son, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-[#F1EFEA] border border-[#DCD9D0] font-display text-lg font-bold text-[#141413] flex items-center justify-between"
                      >
                        <span>{son}</span>
                        <span className="font-sans text-[11px] font-normal text-zinc-600">
                          تيماء
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#DCD9D0] text-xs text-zinc-500">
                  المقر التاريخي: محافظة تيماء — شمال غرب الجزيرة العربية
                </div>
              </div>
            )}

            {/* Branch 2: Salama (Jabal Al-Arab - Umm Walad) */}
            {(highlightedBranch === 'all' || highlightedBranch === 'b2') && (
              <div className="bg-[#F8F7F4] border border-[#DCD9D0] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs pb-3 mb-4 border-b border-[#DCD9D0]">
                    <span className="font-semibold text-[#8C6D32]">الفرع الثاني</span>
                    <span className="text-[#1B3B2B] font-semibold">بلاد الشام — جبل العرب</span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[#141413] mb-2">
                    سلامة بن عوض البراهيم
                  </h3>

                  <p className="text-xs text-zinc-700 leading-[1.8] mb-5">
                    اتجه شمالاً واستقر في بلاد الشام، حيث سكن جبل العرب بقرية أم ولد في سوريا:
                  </p>

                  <div className="p-4 bg-[#F1EFEA] border border-[#DCD9D0] space-y-2">
                    <div className="text-xs font-semibold text-[#8C6D32]">
                      مقر الاستقرار والامتداد العائلي:
                    </div>
                    <div className="font-display text-xl font-bold text-[#141413]">
                      قرية أم ولد — جبل العرب (بلاد الشام / سوريا)
                    </div>
                    <p className="text-xs text-zinc-700 leading-relaxed">
                      يمثل ذرية سلامة بن عوض البراهيم الامتداد التاريخي الأصيل لعائلة الصعيدي في
                      بلاد الشام، محافظين على نسبهم الجهني وروابطهم مع أبناء عمومتهم في الجزيرة
                      العربية والخليج.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#DCD9D0] text-xs text-zinc-500">
                  المقر التاريخي: بلاد الشام (سوريا) — جبل العرب — قرية أم ولد
                </div>
              </div>
            )}

            {/* Branch 3: Saleh -> Abdullah (Hail, Riyadh, UAE, Oman) */}
            {(highlightedBranch === 'all' || highlightedBranch === 'b3') && (
              <div className="bg-[#F8F7F4] border border-[#DCD9D0] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs pb-3 mb-4 border-b border-[#DCD9D0]">
                    <span className="font-semibold text-[#8C6D32]">الفرع الثالث</span>
                    <span className="text-[#1B3B2B] font-semibold">
                      حائل · الرياض · الإمارات · عُمان
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[#141413] mb-1">
                    صالح بن عوض البراهيم
                  </h3>
                  <div className="text-xs font-semibold text-[#8C6D32] mb-3">
                    ↓ ابنه: عبد الله بن صالح (استقر داخل مدينة حائل)
                  </div>

                  <p className="text-xs text-zinc-700 leading-[1.8] mb-4">
                    سكن صالح ضواحي حائل حتى استقر ابنه <strong>عبد الله</strong> داخل مدينة حائل، وله
                    من الأبناء ثلاثة (<strong>إبراهيم، وناصر، وعلي</strong>):
                  </p>

                  {/* The 3 Sons of Abdullah bin Saleh */}
                  <div className="space-y-3">
                    {/* Sub-branch A: Ibrahim */}
                    <div className="p-3.5 bg-[#F1EFEA] border border-[#DCD9D0]">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-[#1B3B2B]">
                          أ. إبراهيم بن عبد الله بن صالح
                        </span>
                        <span className="text-[#8C6D32] font-semibold">حائل — حي الزبارة</span>
                      </div>
                      <p className="text-xs text-zinc-700 leading-relaxed">
                        استقر إبراهيم وأحفاده بمدينة حائل وتحديداً في <strong>حي الزبارة</strong>.
                      </p>
                    </div>

                    {/* Sub-branch B: Nasser -> Hamoud */}
                    <div className="p-3.5 bg-[#F1EFEA] border border-[#DCD9D0]">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-[#1B3B2B]">
                          ب. ناصر بن عبد الله بن صالح
                        </span>
                        <span className="text-[#8C6D32] font-semibold">مدينة الرياض</span>
                      </div>
                      <p className="text-xs text-zinc-700 leading-relaxed">
                        انتقل أبناؤه وأحفاده إلى <strong>مدينة الرياض</strong> بعد أن تولى ابنه{' '}
                        <strong>حمود</strong> شئون البادية في بداية حكم الملك عبد العزيز يرحمه الله.
                      </p>
                    </div>

                    {/* Sub-branch C: Ali -> Abdullah, Omar, Mohammed, Khalifa */}
                    <div className="p-3.5 bg-[#F1EFEA] border border-[#DCD9D0]">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-[#1B3B2B]">ج. علي بن عبد الله بن صالح</span>
                        <span className="text-[#8C6D32] font-semibold">الإمارات وسلطنة عُمان</span>
                      </div>
                      <p className="text-xs text-zinc-700 leading-relaxed mb-2">
                        تنقل بين نجد وساحل الخليج العربي حتى استقر بالإمارات، وله من الأبناء أربعة:
                      </p>
                      <ul className="space-y-1 text-xs text-[#141413] pr-2 border-r-2 border-[#8C6D32]">
                        <li>
                          · <strong>عبد الله بن علي</strong>: المعروف بـ (النجدي القصيمي).
                        </li>
                        <li>
                          · <strong>عمر ومحمد أبناء علي</strong>: استقرا بـ{' '}
                          <strong>عجمان بحي مشرف والجرف</strong>.
                        </li>
                        <li>
                          · <strong>خليفة بن علي</strong>: استقر بـ{' '}
                          <strong>سلطنة عُمان في الباطنة - الخابورة</strong>.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#DCD9D0] text-xs text-zinc-500">
                  المقار التاريخية: حائل (حي الزبارة) · الرياض · عجمان (مشرف والجرف) · الباطنة
                  (الخابورة)
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 3: Encyclopedic Searchable Compound Name & Transliteration Directory */}
      <section className="py-14 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold text-[#8C6D32] mb-2">
              الفهرس المعجمي للأعلام والأسماء المركبة · مطابقة البحث بالعربية والإنجليزية
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#141413]">
              دليل أعلام وأسماء عائلة الصعيدي (Elsaidy / Elseidy / Alsaidi)
            </h2>
            <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
              يوفر هذا الفهرس المرجعي توثيقاً للأسماء المركبة المتداولة لأجداد وأعلام وأبناء عائلة
              الصعيدي في المملكة العربية السعودية وجمهورية مصر العربية (الغربية، طنطا، الدلتا،
              القاهرة، الصعيد) وبلاد الشام والخليج العربي، مع صيغ كتابتها المعتمدة باللغة
              الإنجليزية.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={nameSearchQuery}
              onChange={(e) => setNameSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم (مثال: علي الصعيدي / Aly Elsaidy)..."
              className="w-full pr-10 pl-4 py-2.5 bg-[#F8F7F4] border border-[#DCD9D0] text-xs text-[#141413] outline-none focus:border-[#8C6D32]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-r border-[#DCD9D0]">
          {filteredNames.map((entry, idx) => (
            <div
              key={idx}
              className="p-5 border-b border-l border-[#DCD9D0] bg-[#F8F7F4] hover:bg-[#F1EFEA]/60 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-[11px] text-[#8C6D32] font-semibold mb-1.5">
                  <span>{entry.category}</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-[#141413] mb-2">
                  {entry.arabicName}
                </h3>
                <div
                  dir="ltr"
                  className="text-left font-mono text-[11px] text-zinc-700 bg-[#F1EFEA] p-2.5 border border-[#DCD9D0] space-y-0.5 mb-3"
                >
                  <div>
                    <strong className="text-[#1B3B2B]">Elsaidy:</strong> {entry.englishElsaidy}
                  </div>
                  <div>
                    <strong className="text-[#8C6D32]">Elseidy:</strong> {entry.englishElseidy}
                  </div>
                  <div>
                    <strong className="text-zinc-600">Alsaidi:</strong> {entry.englishAlsaidi}
                  </div>
                </div>
              </div>
              <div className="pt-2.5 border-t border-[#DCD9D0] text-[11px] text-zinc-600">
                <strong className="text-[#141413]">النطاق الجغرافي: </strong>
                {entry.regions}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fullscreen Zoom/Pan Lightbox Modal for Family Tree Image */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex flex-col justify-between p-4 sm:p-6"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Top Bar */}
          <div
            className="bg-[#F8F7F4] border border-[#DCD9D0] px-5 py-3 flex flex-wrap items-center justify-between gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="font-display text-lg font-bold text-[#141413]">
                فحص وثيقة شجرة عائلة الصعيدي بالحجم المكبّر
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setLightboxZoom((z) => Math.min(z + 0.3, 3.5))}
                className="px-3 py-1.5 bg-[#F1EFEA] border border-[#DCD9D0] text-xs font-semibold text-[#141413] hover:border-[#8C6D32] cursor-pointer"
              >
                تكبير +
              </button>
              <button
                type="button"
                onClick={() => setLightboxZoom((z) => Math.max(z - 0.3, 0.75))}
                className="px-3 py-1.5 bg-[#F1EFEA] border border-[#DCD9D0] text-xs font-semibold text-[#141413] hover:border-[#8C6D32] cursor-pointer"
              >
                تصغير -
              </button>
              <button
                type="button"
                onClick={() => setLightboxZoom(1)}
                className="px-3 py-1.5 bg-[#F1EFEA] border border-[#DCD9D0] text-xs font-mono text-zinc-700 cursor-pointer"
              >
                {Math.round(lightboxZoom * 100)}%
              </button>
              <a
                href={OFFICIAL_FAMILY_TREE_IMAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-[#1B3B2B] text-[#F8F7F4] text-xs font-semibold flex items-center gap-1"
              >
                <span>فتح الأصل في نافذة جديدة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-1.5 bg-[#141413] text-[#F8F7F4] hover:bg-[#8C6D32] cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Zoom Viewport */}
          <div
            className="flex-1 overflow-auto my-4 bg-[#141413]/50 border border-[#DCD9D0]/30 p-6 flex items-start justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={OFFICIAL_FAMILY_TREE_IMAGE_URL}
              alt="وثيقة شجرة عائلة الصعيدي بالحجم الكامل"
              referrerPolicy="no-referrer"
              style={{
                transform: `scale(${lightboxZoom})`,
                transformOrigin: 'top center'
              }}
              className="max-w-full h-auto bg-[#F8F7F4] p-2 border border-[#8C6D32] transition-transform duration-150"
            />
          </div>

          <div
            className="bg-[#F8F7F4] border border-[#DCD9D0] px-5 py-2.5 text-xs text-zinc-600 flex items-center justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <span>يمكنك التمرير أفقياً وعمودياً لقراءة تفاصيل الأسماء والفروع داخل الوثيقة.</span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="font-semibold text-[#8C6D32] hover:text-[#141413] cursor-pointer"
            >
              إغلاق العرض المكبّر
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
