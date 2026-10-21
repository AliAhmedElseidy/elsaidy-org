import React from 'react';
import {
  PAN_ARAB_REGIONS,
  VERBATIM_ABOUT_PARAGRAPH_1,
  VERBATIM_ABOUT_PARAGRAPH_2,
  VERBATIM_TITLE_REASON_HEADING,
  VERBATIM_TITLE_REASON,
  EGYPT_HISTORICAL_EXTENSION_TEXT,
  DOCUMENTED_REFERENCES,
  MARGINALIA_NOTES,
  PageRoute
} from '../data/familyData';
import { Copy, Check, ArrowRight, GitBranch, Globe2 } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate,
  copiedKey,
  onCopy
}) => {
  const allReferencesVerbatim = DOCUMENTED_REFERENCES.map((r) => r.verbatimText).join('\n');

  return (
    <div className="space-y-14 lg:space-y-20 py-8 lg:py-12">
      {/* Institutional Breadcrumb & Chapter Header */}
      <section className="bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#9A7B3E] p-6 sm:p-10 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-[#E6E2D8] text-xs text-zinc-600">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hover:text-[#9A7B3E] font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </button>
            <span aria-hidden="true">/</span>
            <span className="font-bold text-[#0F291E]">من نحن والتاريخ</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-zinc-500">الأرشيف التاريخي والتجمع العربي</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-zinc-700">
            <a href="#doc-who-we-are" className="hover:text-[#9A7B3E] transition-colors">
              ١. من نحن؟
            </a>
            <a href="#doc-title-origin" className="hover:text-[#9A7B3E] transition-colors">
              ٢. سبب التسمية بـ الصعيدي . !
            </a>
            <a href="#doc-pan-arab" className="hover:text-[#9A7B3E] transition-colors">
              ٣. التجمع العربي في ٥ أقاليم
            </a>
            <a href="#doc-references" className="hover:text-[#9A7B3E] transition-colors">
              ٤. المراجع التاريخية الموثقة
            </a>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-4xl">
            <div className="text-xs font-bold text-[#9A7B3E] mb-2">
              الأرشيف التاريخي المعتمد · الموقع الرسمي لعائلات الصعيدي في الوطن العربي (elsaidy.org)
            </div>
            <h1
              className="font-extrabold text-[#141413] tracking-tight leading-[1.25] mb-4"
              style={{ fontSize: 'clamp(1.85rem, 3.5vw, 2.85rem)', textWrap: 'balance' }}
            >
              من نحن والتاريخ — الوثيقة الكاملة لنسب العائلة وسبب التسمية والتجمع العربي والمراجع
            </h1>
            <p className="text-sm sm:text-base text-zinc-700 leading-[1.85] max-w-[75ch]">
              صفحة وثائقية ومؤسسية تعرض النص التاريخي المعتمد لعائلات الصعيدي (آل الصعيدي — Elsaidy /
              Elseidy / Alsaidi)، مع تحقيق سبب التسمية بـ «الصعيدي»، وتوثيق التجمع العربي الشامل في
              جمهورية مصر العربية والمملكة العربية السعودية وبلاد الشام والعراق ودول الخليج العربي
              والمغرب العربي والسودان.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('tree')}
            className="px-6 py-3.5 rounded-xl bg-[#0F291E] text-white text-xs font-bold hover:bg-[#141E28] shadow-sm transition-all flex items-center gap-2 cursor-pointer self-start lg:self-end whitespace-nowrap shrink-0"
          >
            <GitBranch className="w-4 h-4 text-[#C5A059]" />
            <span>استعراض وثيقة شجرة العائلة المصوّرة</span>
          </button>
        </div>
      </section>

      {/* Section 1: Exact Verbatim Main Narrative ("بسم الله الرحمن الرحيم / من نحن؟") */}
      <section id="doc-who-we-are" className="scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Primary Classical Document Card (8 Columns) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#9A7B3E] p-7 sm:p-10 lg:p-12 shadow-sm">
            {/* Ornamental Heritage Header in Amiri */}
            <div className="text-center pb-8 mb-8 border-b border-[#E6E2D8]">
              <div className="font-display text-2xl sm:text-3xl font-bold text-[#0F291E] mb-3">
                بسم الله الرحمن الرحيم
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#141413]">
                من نحن؟
              </h2>
            </div>

            {/* Verbatim Historical Narrative in Amiri */}
            <div className="space-y-8 font-display text-xl lg:text-[22px] text-[#141413] leading-[2.1] text-justify">
              <p>{VERBATIM_ABOUT_PARAGRAPH_1}</p>

              <div className="w-24 h-0.5 bg-[#9A7B3E] mx-auto my-4" />

              <p>{VERBATIM_ABOUT_PARAGRAPH_2}</p>
            </div>

            {/* Document Footer Metadata & Copy Action */}
            <div className="mt-10 pt-6 border-t border-[#E6E2D8] flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-600">
              <div className="font-bold text-[#0F291E]">
                الوثيقة التاريخية الرسمية لعائلة الصعيدي · قبيلة جهينة (ينبع النخل)
              </div>

              <button
                type="button"
                onClick={() =>
                  onCopy(
                    `بسم الله الرحمن الرحيم\nمن نحن؟\n${VERBATIM_ABOUT_PARAGRAPH_1}\n\n${VERBATIM_ABOUT_PARAGRAPH_2}`,
                    'copy-verbatim-about'
                  )
                }
                className="px-4 py-2 rounded-lg bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413] font-bold hover:border-[#9A7B3E] transition-colors flex items-center gap-2 cursor-pointer"
              >
                {copiedKey === 'copy-verbatim-about' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#0F291E]" />
                    <span>تم نسخ النص الكامل</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#9A7B3E]" />
                    <span>نسخ نص الوثيقة</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Marginalia / Side-Notes Column (4 Columns) */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#0F291E] to-[#141E28] text-white border border-[#9A7B3E]/40 shadow-sm">
              <div className="text-xs font-bold text-[#C5A059] mb-1">
                الحواشي والفهرس الهامشي للوثيقة
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed">
                بيان توضيحي للأعلام، الأجداد، والمنازل الجغرافية المذكورة في متن الوثيقة الرسمية:
              </p>
            </div>

            {MARGINALIA_NOTES.map((note) => (
              <div
                key={note.id}
                className="p-5 rounded-xl bg-white border border-[#E6E2D8] border-t-4 border-t-[#9A7B3E] shadow-sm space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#9A7B3E]">{note.index}</span>
                  <span className="text-[#0F291E] font-bold">{note.category}</span>
                </div>
                <h3 className="text-base font-extrabold text-[#141413]">
                  {note.term}
                </h3>
                <p className="text-xs text-zinc-700 leading-[1.85]">
                  {note.explanation}
                </p>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* Section 2: Dedicated Section for "سبب التسمية بـ الصعيدي . !" */}
      <section id="doc-title-origin" className="scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-4 flex flex-col justify-between p-7 rounded-2xl bg-white border border-[#E6E2D8] border-t-4 border-t-[#9A7B3E] shadow-sm">
            <div>
              <div className="text-xs font-bold text-[#9A7B3E] mb-2">
                تحقيق اللقب التاريخي · قبيلة جهينة ومصر والحجاز
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#141413] mb-4">
                {VERBATIM_TITLE_REASON_HEADING}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-700 leading-[1.85]">
                يوثق هذا المبحث الجذور التاريخية للقب «الصعيدي» وارتباطه بنزوح بعض بطون قبيلة جهينة
                من شمال غرب الجزيرة العربية إلى صعيد مصر للرعي في فصول الربيع، ودور قبيلة جهينة
                الديني والسياسي منذ الفتوحات الإسلامية وتحرير مصر من الاستعمار الفرنسي.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#E6E2D8] text-xs font-semibold text-zinc-700 space-y-2">
              <div>· القبيلة الأم: قبيلة جهينة القضاعية</div>
              <div>· المنازل الأصلية: ينبع النخل وشمال غرب الجزيرة العربية</div>
              <div>· الحاضرة التاريخية الكبرى: صعيد مصر، الغربية وطنطا، الدلتا، والقاهرة</div>
            </div>
          </div>

          <div className="lg:col-span-8 p-7 sm:p-10 lg:p-12 rounded-2xl bg-white border border-[#E6E2D8] border-t-4 border-t-[#9A7B3E] shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-[#9A7B3E] mb-4">
                {VERBATIM_TITLE_REASON_HEADING}
              </div>
              <p className="font-display text-xl lg:text-[23px] text-[#141413] leading-[2.1] text-justify">
                {VERBATIM_TITLE_REASON}
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-[#E6E2D8] flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-600">
              <span className="font-bold text-[#0F291E]">
                النص الحرفي المعتمد في الوثيقة التاريخية لعائلة الصعيدي
              </span>
              <button
                type="button"
                onClick={() =>
                  onCopy(
                    `${VERBATIM_TITLE_REASON_HEADING}\n${VERBATIM_TITLE_REASON}`,
                    'copy-title-reason'
                  )
                }
                className="px-4 py-2 rounded-lg bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413] font-bold hover:border-[#9A7B3E] transition-colors flex items-center gap-2 cursor-pointer"
              >
                {copiedKey === 'copy-title-reason' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#0F291E]" />
                    <span>تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#9A7B3E]" />
                    <span>نسخ نص سبب التسمية</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Pan-Arab Umbrella Regions (Ordered: Egypt First, Saudi Arabia, Levant/Iraq, Gulf, Maghreb/Sudan) */}
      <section id="doc-pan-arab" className="scroll-mt-24">
        <div className="bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#9A7B3E] p-7 sm:p-10 lg:p-12 shadow-sm">
          <div className="max-w-4xl mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#9A7B3E] mb-2">
              <Globe2 className="w-4 h-4 text-[#0F291E]" />
              <span>التوثيق الجغرافي والتاريخي الشامل · تجمع عائلات الصعيدي في الوطن العربي</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#141413] mb-4">
              الامتداد العربي لعائلات الصعيدي في مصر والسعودية والشام والخليج والمغرب العربي
            </h2>
            <p className="font-display text-xl lg:text-[21px] text-[#141413] leading-[2.05] text-justify bg-[#F7F6F2] p-6 sm:p-8 rounded-xl border border-[#E6E2D8]">
              {EGYPT_HISTORICAL_EXTENSION_TEXT}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PAN_ARAB_REGIONS.map((region, idx) => (
              <div
                key={region.id}
                className={`p-6 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] border-t-4 border-t-[#9A7B3E] flex flex-col justify-between ${
                  idx === 0 ? 'md:col-span-2 lg:col-span-2 bg-white shadow-sm' : ''
                }`}
              >
                <div>
                  <div className="text-xs font-extrabold text-[#9A7B3E] mb-1.5">
                    الإقليم {region.orderIndex} · {region.historicalRole}
                  </div>
                  <h3 className="text-xl font-extrabold text-[#141413] mb-2">
                    {region.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-700 leading-[1.85] mb-4 text-justify">
                    {region.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E6E2D8] flex flex-wrap gap-1.5">
                  {region.keyHubs.map((hub, hIdx) => (
                    <span
                      key={hIdx}
                      className="px-2.5 py-1 rounded-md bg-white border border-[#E6E2D8] text-[11px] font-bold text-[#0F291E]"
                    >
                      {hub}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Archival Citation Box for "المراجع التاريخية الموثقة" */}
      <section id="doc-references" className="scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-[#9A7B3E] mb-2">
              الفهرس المرجعي المعتمد · المصادر والمطبوعات التاريخية
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#141413]">
              المراجع التاريخية الموثقة
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              onCopy(`المراجع التاريخية الموثقة:\n${allReferencesVerbatim}`, 'copy-all-refs')
            }
            className="px-5 py-2.5 rounded-xl bg-[#0F291E] text-white text-xs font-bold hover:bg-[#141E28] transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-end"
          >
            {copiedKey === 'copy-all-refs' ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>تم نسخ قائمة المراجع</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>نسخ قائمة المراجع كاملة</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {DOCUMENTED_REFERENCES.map((ref) => (
            <div
              key={ref.id}
              className="bg-white rounded-xl border border-[#E6E2D8] border-t-4 border-t-[#9A7B3E] p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs pb-3 mb-4 border-b border-[#E6E2D8]">
                  <span className="font-bold text-[#0F291E]">
                    المرجع التاريخي ({ref.number})
                  </span>
                  <span className="font-mono text-[11px] text-[#9A7B3E] font-bold tabular-nums">
                    {ref.catalogNumber}
                  </span>
                </div>

                {/* Exact Verbatim Citation Text in Amiri */}
                <div className="font-display text-xl font-bold text-[#141413] leading-[1.8] mb-4">
                  {ref.verbatimText}
                </div>

                <p className="text-xs text-zinc-600 leading-[1.85] mb-5">
                  {ref.scopeNote}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E6E2D8] space-y-1.5 text-xs text-zinc-600">
                <div>
                  <strong className="text-[#141413]">المؤلف: </strong>
                  {ref.author}
                </div>
                <div>
                  <strong className="text-[#141413]">الطبعة والنشر: </strong>
                  {ref.editionDetails}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
