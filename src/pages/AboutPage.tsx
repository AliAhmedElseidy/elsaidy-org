import React from 'react';
import {
  VERBATIM_ABOUT_PARAGRAPH_1,
  VERBATIM_ABOUT_PARAGRAPH_2,
  VERBATIM_TITLE_REASON,
  DOCUMENTED_REFERENCES,
  MARGINALIA_NOTES,
  GEOGRAPHICAL_PRESENCE,
  PageRoute
} from '../data/familyData';
import { BookOpen, Copy, Check, ArrowRight, FileText, Landmark } from 'lucide-react';

interface AboutPageProps {
  activeBranchId: string;
  onSelectBranch: (id: string) => void;
  onNavigate: (route: PageRoute) => void;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  activeBranchId,
  onSelectBranch,
  onNavigate,
  copiedKey,
  onCopy
}) => {
  const allReferencesVerbatim = DOCUMENTED_REFERENCES.map((r) => r.verbatimText).join('\n');

  return (
    <div>
      {/* Institutional Archival Breadcrumb & Chapter Bar */}
      <section className="pt-8 pb-10 border-b border-[#E2DFD7]">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E2DFD7] text-xs text-zinc-600">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hover:text-[#8C6D32] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>الصفحة الرئيسية</span>
            </button>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-[#8C6D32]">من نحن والتاريخ</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-zinc-500">elsaidy.org/about</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-zinc-700">
            <a href="#doc-who-we-are" className="hover:text-[#8C6D32] transition-colors">
              ١. من نحن؟ (النص الوثائقي)
            </a>
            <a href="#doc-title-origin" className="hover:text-[#8C6D32] transition-colors">
              ٢. سبب التسمية بـ الصعيدي
            </a>
            <a href="#doc-references" className="hover:text-[#8C6D32] transition-colors">
              ٣. المراجع التاريخية الموثقة
            </a>
            <a href="#doc-branches-table" className="hover:text-[#8C6D32] transition-colors">
              ٤. سجل الفروع والمنازل
            </a>
          </div>
        </div>

        <div className="max-w-4xl">
          <div className="text-xs font-semibold text-[#8C6D32] mb-2">
            الوثيقة التاريخية المعتمدة · الأرشيف العام لعائلة الصعيدي
          </div>
          <h1
            className="font-display font-bold text-[#18181B] tracking-tight leading-[1.2] mb-4"
            style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', textWrap: 'balance' }}
          >
            من نحن والتاريخ — الجذور الجهنية، تفرع الأبناء، وسبب التسمية بـ الصعيدي
          </h1>
          <p className="text-base text-zinc-700 leading-[1.8] max-w-[70ch]">
            توثيق رسمي لنسب وتاريخ عائلة الصعيدي المنتسبة إلى الجد السابع إبراهيم الصعيدي من قبيلة
            جهينة من ينبع النخل، وتفرع ذرية ابنه عوض البراهيم في حواضر الجزيرة العربية وبلاد الشام
            والخليج العربي.
          </p>
        </div>
      </section>

      {/* Section 1: Exact Historical Narrative with Marginalia Side-Notes */}
      <section
        id="doc-who-we-are"
        className="py-14 lg:py-20 border-b border-[#E2DFD7] scroll-mt-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Primary Editorial Broadsheet Column (8 Columns) */}
          <div className="lg:col-span-8 bg-[#F9F8F6] border border-[#E2DFD7] p-7 sm:p-10 lg:p-12">
            {/* Basmala & Document Header */}
            <div className="text-center pb-8 mb-8 border-b border-[#E2DFD7]">
              <div className="font-display text-2xl sm:text-3xl font-bold text-[#8C6D32] mb-3">
                بسم الله الرحمن الرحيم
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#18181B]">
                من نحن؟
              </h2>
            </div>

            {/* Verbatim Historical Text Formatted in Classic Editorial Typography */}
            <div className="space-y-8 font-display text-xl lg:text-[22px] text-[#18181B] leading-[2.05] text-justify">
              <p>{VERBATIM_ABOUT_PARAGRAPH_1}</p>

              <div className="w-24 h-px bg-[#8C6D32] mx-auto my-4" />

              <p>{VERBATIM_ABOUT_PARAGRAPH_2}</p>
            </div>

            {/* Document Footer Metadata & Copy Action */}
            <div className="mt-10 pt-6 border-t border-[#E2DFD7] flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-600 font-sans">
              <div>
                <span>المصدر: الوثيقة التعريفية الرسمية لعائلة الصعيدي</span>
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
                className="px-4 py-2 bg-[#F3F1EC] border border-[#E2DFD7] text-[#18181B] font-medium hover:border-[#8C6D32] transition-colors flex items-center gap-2 cursor-pointer"
              >
                {copiedKey === 'copy-verbatim-about' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#8C6D32]" />
                    <span>تم نسخ النص الوثائقي</span>
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
            <div className="p-5 bg-[#F3F1EC] border border-[#E2DFD7]">
              <div className="text-xs font-semibold text-[#8C6D32] mb-1">
                الحواشي والفهرس الهامشي للوثيقة
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                إضاءات توثيقية للأعلام، الأجداد، والمنازل الجغرافية الواردة في متن الوثيقة الرسمية:
              </p>
            </div>

            {MARGINALIA_NOTES.map((note) => (
              <div
                key={note.id}
                className="p-5 bg-[#F9F8F6] border border-[#E2DFD7] space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#8C6D32]">{note.index}</span>
                  <span className="text-zinc-500">{note.category}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#18181B]">
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

      {/* Section 2: Dedicated Section for "سبب التسمية بـ الصعيدي" */}
      <section
        id="doc-title-origin"
        className="py-14 lg:py-20 border-b border-[#E2DFD7] scroll-mt-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-4 flex flex-col justify-between p-7 bg-[#F3F1EC] border border-[#E2DFD7]">
            <div>
              <div className="text-xs font-semibold text-[#8C6D32] mb-2">
                تحقيق اللقب التاريخي · قبيلة جهينة
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#18181B] mb-4">
                سبب التسمية بـ «الصعيدي»
              </h2>
              <p className="text-xs text-zinc-700 leading-[1.85]">
                يفسّر هذا المبحث التاريخي نشأة لقب «الصعيدي» وارتباطه بمسيرة قبيلة جهينة بين منازلها
                الأصلية في شمال غرب الجزيرة العربية وصعيد مصر، ودورها التاريخي منذ الفتوحات
                الإسلامية ومقاومة الاستعمار الفرنسي.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#E2DFD7] text-xs text-zinc-600 space-y-1.5">
              <div>· القبيلة الأم: قبيلة جهينة القضاعية</div>
              <div>· الموطن الأصلي: ينبع النخل وشمال غرب الجزيرة العربية</div>
              <div>· دلالة اللقب: نسبةً إلى مناطق الارتياع في صعيد مصر لمن عاد إلى منازله الأصلية</div>
            </div>
          </div>

          <div className="lg:col-span-8 p-7 sm:p-10 lg:p-12 bg-[#F9F8F6] border border-[#E2DFD7] flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-[#8C6D32] mb-4">
                النص التاريخي المعتمد لسبب التسمية:
              </div>
              <p className="font-display text-xl lg:text-[23px] text-[#18181B] leading-[2.05] text-justify">
                {VERBATIM_TITLE_REASON}
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-[#E2DFD7] flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-600">
              <span>توثيق تاريخي مستند إلى مراجع تاريخ جهينة وبلاد ينبع والرحلة الحجازية</span>
              <button
                type="button"
                onClick={() =>
                  onCopy(`سبب التسمية بـ الصعيدي:\n${VERBATIM_TITLE_REASON}`, 'copy-title-reason')
                }
                className="px-4 py-2 bg-[#F3F1EC] border border-[#E2DFD7] text-[#18181B] font-medium hover:border-[#8C6D32] transition-colors flex items-center gap-2 cursor-pointer"
              >
                {copiedKey === 'copy-title-reason' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#8C6D32]" />
                    <span>تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#8C6D32]" />
                    <span>نسخ فقرة سبب التسمية</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Academic & Historical References Box (المراجع التاريخية الموثقة) */}
      <section
        id="doc-references"
        className="py-14 lg:py-20 border-b border-[#E2DFD7] scroll-mt-20"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold text-[#8C6D32] mb-2">
              الفهرس المرجعي المعتمد · المصادر والمطبوعات التاريخية
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#18181B]">
              المراجع التاريخية الموثقة
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              onCopy(`المراجع التاريخية الموثقة:\n${allReferencesVerbatim}`, 'copy-all-refs')
            }
            className="px-4 py-2.5 bg-[#18181B] text-[#F9F8F6] text-xs font-semibold hover:bg-[#8C6D32] transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-end"
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
        <div className="bg-[#F3F1EC] border border-[#E2DFD7] p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {DOCUMENTED_REFERENCES.map((ref) => (
              <div
                key={ref.id}
                className="bg-[#F9F8F6] border border-[#E2DFD7] p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs pb-3 mb-4 border-b border-[#E2DFD7]">
                    <span className="font-semibold text-[#8C6D32]">
                      المرجع التاريخي رقم ({ref.number})
                    </span>
                    <span className="font-mono text-[11px] text-zinc-500 tabular-nums">
                      {ref.catalogNumber}
                    </span>
                  </div>

                  {/* Exact Verbatim Citation String */}
                  <div className="font-display text-xl font-bold text-[#18181B] leading-[1.75] mb-4">
                    {ref.verbatimText}
                  </div>

                  <p className="text-xs text-zinc-600 leading-[1.8] mb-5">
                    {ref.scopeNote}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2DFD7] space-y-1 text-xs text-zinc-600">
                  <div>
                    <strong className="text-[#18181B]">المؤلف: </strong>
                    {ref.author}
                  </div>
                  <div>
                    <strong className="text-[#18181B]">بيانات النشر: </strong>
                    {ref.editionDetails}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Structured Register of Branches & Lineage (سجل تفرع الأبناء والمنازل) */}
      <section id="doc-branches-table" className="py-14 lg:py-20 scroll-mt-20">
        <div className="mb-8">
          <div className="text-xs font-semibold text-[#8C6D32] mb-2">
            البيان التفصيلي للفروع والمنازل الثمانية
          </div>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#18181B]">
            سجل تفرع عائلة الصعيدي من الجد السابع إبراهيم الصعيدي وابنه عوض البراهيم
          </h2>
        </div>

        <div className="border-t border-r border-[#E2DFD7] grid grid-cols-1 md:grid-cols-2">
          {GEOGRAPHICAL_PRESENCE.map((branch) => (
            <div
              key={branch.id}
              onClick={() => onSelectBranch(branch.id)}
              className={`p-6 lg:p-7 border-b border-l border-[#E2DFD7] transition-colors cursor-pointer ${
                activeBranchId === branch.id ? 'bg-[#F3F1EC]' : 'bg-[#F9F8F6] hover:bg-[#F3F1EC]/50'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
                <span className="font-semibold text-[#8C6D32]">
                  {branch.index} · {branch.subLocation}
                </span>
                <span className="text-zinc-500">{branch.lineagePath}</span>
              </div>

              <h3 className="font-display text-2xl font-bold text-[#18181B] mb-2">
                {branch.regionName}
              </h3>

              <div className="text-xs font-semibold text-zinc-800 mb-2">
                الأعلام والاستقرار: {branch.keyFigures}
              </div>

              <p className="text-sm text-zinc-700 leading-[1.8]">
                {branch.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
