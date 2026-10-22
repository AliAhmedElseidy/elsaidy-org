import React, { useState } from 'react';
import { DIWAN_ARTICLES, DiwanArticle, PageRoute } from '../data/familyData';
import {
  Search,
  ArrowRight,
  ChevronLeft,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';

interface BlogPageProps {
  onNavigate: (route: PageRoute) => void;
  articles?: DiwanArticle[];
}

export const BlogPage: React.FC<BlogPageProps> = ({
  onNavigate,
  articles = DIWAN_ARTICLES,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dedicatedReadingArticle, setDedicatedReadingArticle] =
    useState<DiwanArticle | null>(null);

  const filteredArticles = articles.filter((art) => {
    const matchesCat =
      selectedCategory === 'all' || art.category === selectedCategory;
    const q = searchQuery.trim();
    const matchesSearch =
      !q ||
      art.title.includes(q) ||
      art.excerpt.includes(q) ||
      art.author.includes(q) ||
      art.categoryLabel.includes(q);
    return matchesCat && matchesSearch;
  });

  if (dedicatedReadingArticle) {
    return (
      <div className="py-10 lg:py-16 space-y-8">
        <div className="pb-6 border-b border-[#E6E2D8] flex flex-wrap items-center justify-between gap-4 text-xs">
          <button
            type="button"
            onClick={() => setDedicatedReadingArticle(null)}
            className="px-5 py-2.5 rounded-xl bg-[#0F291E] text-white font-bold hover:bg-[#141E28] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة إلى فهرس الديوان والمقالات</span>
          </button>

          <div className="text-zinc-600">
            <span className="font-bold text-[#695022]">
              {dedicatedReadingArticle.categoryLabel}
            </span>
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            <span>{dedicatedReadingArticle.hijriDate}</span>
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            <span>{dedicatedReadingArticle.publishDate}</span>
          </div>
        </div>

        <article className="max-w-4xl mx-auto bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-7 sm:p-12 lg:p-16 shadow-md">
          <div className="border-b border-[#E6E2D8] pb-8 mb-8">
            <div className="text-xs font-bold text-[#695022] mb-3">
              إصدار رقم {dedicatedReadingArticle.index} ·{' '}
              {dedicatedReadingArticle.categoryLabel} ·{' '}
              {dedicatedReadingArticle.readTime}
            </div>

            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#141413] leading-[1.35] mb-6"
              style={{ textWrap: 'balance' }}
            >
              {dedicatedReadingArticle.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-600 pt-4 border-t border-[#E6E2D8]">
              <div>
                <strong className="text-[#141413]">إعداد وتحقيق: </strong>
                {dedicatedReadingArticle.author} ({dedicatedReadingArticle.authorTitle})
              </div>
              <div>
                تاريخ النشر: {dedicatedReadingArticle.hijriDate} الموافق{' '}
                {dedicatedReadingArticle.publishDate}
              </div>
            </div>
          </div>

          {dedicatedReadingArticle.coverImage && (
            <div className="mb-8 rounded-xl overflow-hidden border border-[#E6E2D8] bg-[#F7F6F2]">
              <img
                src={dedicatedReadingArticle.coverImage}
                alt={dedicatedReadingArticle.title}
                width="900"
                height="480"
                loading="lazy"
                className="w-full max-h-[440px] object-cover"
              />
            </div>
          )}

          <div className="p-6 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] mb-10 font-display text-xl lg:text-2xl text-[#141413] leading-[1.95] text-justify">
            {dedicatedReadingArticle.excerpt}
          </div>

          <div className="space-y-8">
            {dedicatedReadingArticle.sections.map((sec, idx) => (
              <div key={idx} className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F291E]">
                  {sec.heading}
                </h2>
                <p className="font-display text-xl text-[#141413] leading-[2.05] text-justify whitespace-pre-line">
                  {sec.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-[#E6E2D8] flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-zinc-500">
              الموقع الرسمي لعائلات الصعيدي في الوطن العربي — الأرشيف الوثائقي والمنصة
              المعرفية
            </span>
            <button
              type="button"
              onClick={() => setDedicatedReadingArticle(null)}
              className="px-6 py-2.5 rounded-xl bg-[#0F291E] text-white text-xs font-bold hover:bg-[#141E28] transition-colors cursor-pointer"
            >
              العودة إلى قائمة المقالات
            </button>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-12 lg:space-y-16 py-8 lg:py-12">
      <section className="bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-10 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-[#E6E2D8] text-xs text-zinc-600">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hover:text-[#695022] font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </button>
            <span aria-hidden="true">/</span>
            <span className="font-bold text-[#0F291E]">الديوان والمقالات</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-zinc-500">
              ELSAIDY Knowledge &amp; Heritage Cloud
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#0F291E] font-bold">
            <ShieldCheck className="w-4 h-4 text-[#695022]" />
            <span>إصدارات موثقة من الأمانة العامة ولجنة الأنساب</span>
          </div>
        </div>

        <div className="max-w-4xl">
          <div className="text-xs font-bold text-[#695022] mb-2">
            الأرشيف الوثائقي والمنصة المعرفية · ديوان عائلات الصعيدي في الوطن العربي
          </div>
          <h1
            className="font-extrabold text-[#141413] tracking-tight leading-[1.25] mb-4"
            style={{
              fontSize: 'clamp(1.85rem, 3.5vw, 2.85rem)',
              textWrap: 'balance',
            }}
          >
            الديوان والمقالات — الأبحاث التاريخية، تحقيق الوثائق، وبيانات العائلة
            والبراند
          </h1>
          <p className="text-sm sm:text-base text-zinc-700 leading-[1.85] max-w-[75ch]">
            منبر النشر الرسمي المخصص لتوثيق الدراسات التاريخية المتعلقة بعائلات
            الصعيدي وإقليم الصعيد (صعيد مصر) والامتداد الحجازي (حجازي — حجاج —
            مرسي الحجاج — الصعيدي) في مصر والسعودية والشام والخليج والمغرب العربي،
            إلى جانب البيانات الصادرة عن الديوان ومجموعة الصعيدي.
          </p>
        </div>
      </section>

      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div
          className="flex flex-wrap items-center gap-1.5 bg-white border border-[#E6E2D8] rounded-xl p-1.5 shadow-sm"
          role="tablist"
          aria-label="تصفية مقالات الديوان"
        >
          {[
            { id: 'all', label: `كافة الإصدارات (${articles.length})` },
            { id: 'heritage', label: 'تحقيق الأنساب والتاريخ' },
            { id: 'research', label: 'الدراسات التاريخية والمصادر' },
            { id: 'documents', label: 'المراجع والوثائق المعتمدة' },
            { id: 'news', label: 'أخبار وبيانات الديوان والبراند' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selectedCategory === tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCategory === tab.id
                  ? 'bg-[#0F291E] text-white shadow-sm'
                  : 'text-zinc-700 hover:text-[#141413]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في مقالات ووثائق الديوان..."
            className="w-full pr-10 pl-4 py-3 rounded-xl bg-white border border-[#E6E2D8] text-xs text-[#141413] shadow-sm outline-none focus:border-[#695022]"
          />
        </div>
      </section>

      <section>
        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#E6E2D8] space-y-3 shadow-sm">
            <div className="text-xl font-extrabold text-[#141413]">
              لا توجد مقالات مطابقة لعبارة البحث
            </div>
            <p className="text-xs text-zinc-600">
              يمكنك إعادة ضبط الفلتر لعرض كافة المقالات والبيانات المنشورة في الديوان.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#0F291E] text-white text-xs font-bold cursor-pointer"
            >
              عرض كافة المقالات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => setDedicatedReadingArticle(article)}
                className="p-7 sm:p-9 rounded-xl bg-white border border-[#E6E2D8] border-t-4 border-t-[#695022] shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-3 mb-4 border-b border-[#E6E2D8]">
                    <span className="font-bold text-[#695022]">
                      إصدار {article.index} · {article.categoryLabel}
                    </span>
                    <span className="text-zinc-500">
                      {article.hijriDate} ({article.publishDate})
                    </span>
                  </div>

                  {article.coverImage && (
                    <div className="mb-4 rounded-lg overflow-hidden border border-[#E6E2D8] bg-[#F7F6F2] h-44">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        width="600"
                        height="260"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                  )}

                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#141413] leading-snug mb-3 group-hover:text-[#0F291E] transition-colors">
                    {article.title}
                  </h2>

                  <p className="font-display text-lg text-zinc-700 leading-[1.9] mb-6 text-justify">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E6E2D8] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-zinc-600">
                    <span className="font-bold text-[#141413]">{article.author}</span>
                    <span className="mx-1.5" aria-hidden="true">
                      ·
                    </span>
                    <span>{article.readTime}</span>
                  </div>

                  <span className="font-extrabold text-[#0F291E] flex items-center gap-1.5 group-hover:text-[#695022] transition-colors">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>قراءة المقال كاملاً</span>
                    <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
