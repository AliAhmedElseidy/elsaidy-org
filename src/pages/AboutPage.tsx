import React from 'react';
import {
  VERBATIM_ABOUT_PARAGRAPH_1,
  VERBATIM_ABOUT_PARAGRAPH_2,
  VERBATIM_TITLE_REASON_HEADING,
  VERBATIM_TITLE_REASON,
  DOCUMENTED_REFERENCES,
  MARGINALIA_NOTES,
  PageRoute
} from '../data/familyData';
import { Copy, Check, ArrowRight, GitBranch } from 'lucide-react';

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
    <div>
      {/* Institutional Archival Breadcrumb & Chapter Bar */}
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
            <span className="font-semibold text-[#1B3B2B]">من نحن والتاريخ</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-zinc-500">الوثيقة التاريخية الرسمية</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-zinc-700">
            <a href="#doc-who-we-are" className="hover:text-[#8C6D32] transition-colors">
              ١. من نحن؟
            </a>
            <a href="#doc-title-origin" className="hover:text-[#8C6D32] transition-colors">
              ٢. سبب التسمية بـ الصعيدي . !
            </a>
            <a href="#doc-references" className="hover:text-[#8C6D32] transition-colors">
              ٣. المراجع التاريخية الموثقة
            </a>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-4xl">
            <div className="text-xs font-semibold text-[#8C6D32] mb-2">
              الأرشيف التاريخي المعتمد · الموقع الرسمي لعائلة الصعيدي
            </div>
            <h1
              className="font-display font-bold text-[#141413] tracking-tight leading-[1.2] mb-4"
              style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', textWrap: 'balance' }}
            >
              من نحن والتاريخ — الوثيقة الكاملة لنسب العائلة وسبب التسمية والمراجع الموثقة
            </h1>
            <p className="text-base text-zinc-700 leading-[1.85] max-w-[70ch]">
              صفحة وثائقية مستقلة تعرض النص التاريخي المعتمد لعائلة الصعيدي الراجعة إلى الجد السابع
              إبراهيم الصعيدي من قبيلة جهينة من ينبع النخل، مع تحقيق سبب التسمية والمصادر التاريخية.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('tree')}
            className="px-5 py-3 bg-[#1B3B2B] text-[#F8F7F4] text-xs font-semibold hover:bg-[#141413] transition-colors flex items-center gap-2 cursor-pointer self-start lg:self-end whitespace-nowrap shrink-0"
          >
            <GitBranch className="w-4 h-4" />
            <span>استعراض وثيقة شجرة العائلة المصوّرة</span>
          </button>
        </div>
      </section>

      {/* Section 1: Exact Verbatim Main Narrative ("بسم الله الرحمن الرحيم / من نحن؟") */}
      <section
        id="doc-who-we-are"
        className="py-14 lg:py-20 border-b border-[#DCD9D0] scroll-mt-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Primary Editorial Broadsheet Document (8 Columns) */}
          <div className="lg:col-span-8 bg-[#F8F7F4] border border-[#DCD9D0] p-7 sm:p-10 lg:p-12">
            {/* Basmala & Heading */}
            <div className="text-center pb-8 mb-8 border-b border-[#DCD9D0]">
              <div className="font-display text-2xl sm:text-3xl font-bold text-[#1B3B2B] mb-3">
                بسم الله الرحمن الرحيم
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#141413]">
                من نحن؟
              </h2>
            </div>

            {/* Verbatim Historical Narrative */}
            <div className="space-y-8 font-display text-xl lg:text-[22px] text-[#141413] leading-[2.1] text-justify">
              <p>{VERBATIM_ABOUT_PARAGRAPH_1}</p>

              <div className="w-24 h-px bg-[#8C6D32] mx-auto my-4" />

              <p>{VERBATIM_ABOUT_PARAGRAPH_2}</p>
            </div>

            {/* Document Footer Metadata & Copy Action */}
            <div className="mt-10 pt-6 border-t border-[#DCD9D0] flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-600 font-sans">
              <div>
                <span>الوثيقة التاريخية الرسمية لعائلة الصعيدي</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>قبيلة جهينة — ينبع النخل</span>
              </div>

              <button
                type="button"
                onClick={() =>
                  onCopy(
                    `بسم الله الرحمن الرحيم\nمن نحن؟\n${VERBATIM_ABOUT_PARAGRAPH_1}\n\n${VERBATIM_ABOUT_PARAGRAPH_2}`,
                    'copy-verbatim-about'
                  )
                }
                className="px-4 py-2 bg-[#F1EFEA] border border-[#DCD9D0] text-[#141413] font-medium hover:border-[#8C6D32] transition-colors flex items-center gap-2 cursor-pointer"
              >
                {copiedKey === 'copy-verbatim-about' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#1B3B2B]" />
                    <span>تم نسخ النص الكامل</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#8C6D32]" />
                    <span>نسخ نص الوثيقة</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Marginalia / Side-Notes Column (4 Columns) */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="p-5 bg-[#1B3B2B] text-[#F8F7F4] border border-[#141413]">
              <div className="text-xs font-semibold text-[#D6C295] mb-1">
                الحواشي والفهرس الهامشي للوثيقة
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed">
                بيان توضيحي للأعلام، الأجداد، والمنازل الجغرافية المذكورة في متن الوثيقة الرسمية:
              </p>
            </div>

            {MARGINALIA_NOTES.map((note) => (
              <div
                key={note.id}
                className="p-5 bg-[#F1EFEA] border border-[#DCD9D0] space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#8C6D32]">{note.index}</span>
                  <span className="text-[#1B3B2B] font-medium">{note.category}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#141413]">
                  {note.term}
                </h3>
                <p className="text-xs text-zinc-700 leading-[1.8]">
                  {note.explanation}
                </p>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* Section 2: Dedicated Section for "سبب التسمية بـ الصعيدي . !" */}
      <section
        id="doc-title-origin"
        className="py-14 lg:py-20 border-b border-[#DCD9D0] scroll-mt-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-4 flex flex-col justify-between p-7 bg-[#F1EFEA] border border-[#DCD9D0]">
            <div>
              <div className="text-xs font-semibold text-[#8C6D32] mb-2">
                تحقيق اللقب التاريخي · قبيلة جهينة
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#141413] mb-4">
                {VERBATIM_TITLE_REASON_HEADING}
              </h2>
              <p className="text-xs text-zinc-700 leading-[1.85]">
                يوثق هذا المبحث الجذور التاريخية للقب «الصعيدي» وارتباطه بنزوح بعض بطون قبيلة جهينة
                من شمال غرب الجزيرة العربية إلى صعيد مصر للرعي في فصول الربيع، ودور قبيلة جهينة
                الديني والسياسي منذ الفتوحات الإسلامية وتحرير مصر من الاستعمار الفرنسي.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#DCD9D0] text-xs text-zinc-600 space-y-1.5">
              <div>· القبيلة الأم: قبيلة جهينة</div>
              <div>· المنازل الأصلية: ينبع النخل وشمال غرب الجزيرة العربية</div>
              <div>· دلالة اللقب: ميّز من رجع منهم إلى مناطقهم الأصلية</div>
            </div>
          </div>

          <div className="lg:col-span-8 p-7 sm:p-10 lg:p-12 bg-[#F8F7F4] border border-[#DCD9D0] flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-[#8C6D32] mb-4">
                {VERBATIM_TITLE_REASON_HEADING}
              </div>
              <p className="font-display text-xl lg:text-[23px] text-[#141413] leading-[2.1] text-justify">
                {VERBATIM_TITLE_REASON}
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-[#DCD9D0] flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-600">
              <span>النص الحرفي المعتمد في الوثيقة التاريخية لعائلة الصعيدي</span>
              <button
                type="button"
                onClick={() =>
                  onCopy(
                    `${VERBATIM_TITLE_REASON_HEADING}\n${VERBATIM_TITLE_REASON}`,
                    'copy-title-reason'
                  )
                }
                className="px-4 py-2 bg-[#F1EFEA] border border-[#DCD9D0] text-[#141413] font-medium hover:border-[#8C6D32] transition-colors flex items-center gap-2 cursor-pointer"
              >
                {copiedKey === 'copy-title-reason' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#1B3B2B]" />
                    <span>تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#8C6D32]" />
                    <span>نسخ نص سبب التسمية</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Archival Citation Box for "المراجع التاريخية الموثقة" */}
      <section id="doc-references" className="py-14 lg:py-20 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-[#8C6D32] mb-2">
              الفهرس المرجعي المعتمد · المصادر والمطبوعات التاريخية
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#141413]">
              المراجع التاريخية الموثقة
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              onCopy(`المراجع التاريخية الموثقة:\n${allReferencesVerbatim}`, 'copy-all-refs')
            }
            className="px-4 py-2.5 bg-[#141413] text-[#F8F7F4] text-xs font-semibold hover:bg-[#1B3B2B] transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-end"
          >
            {copiedKey === 'copy-all-refs' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>تم نسخ قائمة المراجع</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ قائمة المراجع كاملة</span>
              </>
            )}
          </button>
        </div>

        {/* Archival Citation Index Box */}
        <div className="bg-[#F1EFEA] border border-[#DCD9D0] p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {DOCUMENTED_REFERENCES.map((ref) => (
              <div
                key={ref.id}
                className="bg-[#F8F7F4] border border-[#DCD9D0] p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs pb-3 mb-4 border-b border-[#DCD9D0]">
                    <span className="font-semibold text-[#1B3B2B]">
                      المرجع التاريخي ({ref.number})
                    </span>
                    <span className="font-mono text-[11px] text-[#8C6D32] tabular-nums">
                      {ref.catalogNumber}
                    </span>
                  </div>

                  {/* Exact Verbatim Citation Text */}
                  <div className="font-display text-xl font-bold text-[#141413] leading-[1.8] mb-4">
                    {ref.verbatimText}
                  </div>

                  <p className="text-xs text-zinc-600 leading-[1.8] mb-5">
                    {ref.scopeNote}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#DCD9D0] space-y-1 text-xs text-zinc-600">
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
        </div>
      </section>
    </div>
  );
};
