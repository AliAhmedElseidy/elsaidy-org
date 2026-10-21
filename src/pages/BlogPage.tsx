import React, { useState } from 'react';
import { DIWAN_ARTICLES, DiwanArticle, PageRoute } from '../data/familyData';
import {
  Search,
  ArrowRight,
  ChevronLeft,
  BookOpen,
  PenTool,
  Check,
  X
} from 'lucide-react';

interface BlogPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const [articles, setArticles] = useState<DiwanArticle[]>(DIWAN_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dedicatedReadingArticle, setDedicatedReadingArticle] = useState<DiwanArticle | null>(null);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState<boolean>(false);

  const [draft, setDraft] = useState({
    title: '',
    author: '',
    authorTitle: 'الأمانة العامة / باحث من عائلة الصعيدي',
    category: 'heritage' as 'heritage' | 'research' | 'documents' | 'news',
    excerpt: '',
    body: ''
  });
  const [draftError, setDraftError] = useState<string>('');

  const categoryLabels: Record<string, string> = {
    heritage: 'تحقيق الأنساب والتاريخ',
    research: 'الدراسات التاريخية والمصادر',
    documents: 'المراجع والوثائق المعتمدة',
    news: 'أخبار وبيانات الديوان والبراند'
  };

  const filteredArticles = articles.filter((art) => {
    const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;
    const q = searchQuery.trim();
    const matchesSearch =
      !q ||
      art.title.includes(q) ||
      art.excerpt.includes(q) ||
      art.author.includes(q) ||
      art.categoryLabel.includes(q);
    return matchesCat && matchesSearch;
  });

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim() || draft.title.trim().length < 6) {
      setDraftError('يرجى إدخال عنوان واضح للمقال أو البيان.');
      return;
    }
    if (!draft.author.trim()) {
      setDraftError('يرجى إدخال اسم الكاتب أو الجهة المصدرة.');
      return;
    }
    if (!draft.excerpt.trim() || !draft.body.trim()) {
      setDraftError('يرجى كتابة ملخص المقال والنص التفصيلي.');
      return;
    }

    const newPost: DiwanArticle = {
      id: `diwan-custom-${Date.now()}`,
      index: `٠${articles.length + 1}`,
      title: draft.title.trim(),
      category: draft.category,
      categoryLabel: categoryLabels[draft.category],
      publishDate: '٢١ أكتوبر ٢٠٢٦ م',
      hijriDate: '١٠ ربيع الآخر ١٤٤٨ هـ',
      readTime: '٥ دقائق للقراءة',
      author: draft.author.trim(),
      authorTitle: draft.authorTitle.trim(),
      excerpt: draft.excerpt.trim(),
      sections: [
        {
          heading: 'متن المقال والبيان التوثيقي',
          body: draft.body.trim()
        }
      ]
    };

    setArticles([newPost, ...articles]);
    setDraftError('');
    setIsNewPostModalOpen(false);
    setDedicatedReadingArticle(newPost);
    setDraft({
      title: '',
      author: '',
      authorTitle: 'الأمانة العامة / باحث من عائلة الصعيدي',
      category: 'heritage',
      excerpt: '',
      body: ''
    });
  };

  // Dedicated Full Reading View when an article is clicked
  if (dedicatedReadingArticle) {
    return (
      <div className="py-10 lg:py-16 space-y-8">
        {/* Top Reading Navigation Bar */}
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
            <span className="font-bold text-[#9A7B3E]">
              {dedicatedReadingArticle.categoryLabel}
            </span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>{dedicatedReadingArticle.hijriDate}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>{dedicatedReadingArticle.publishDate}</span>
          </div>
        </div>

        {/* Dedicated Editorial Article Canvas */}
        <article className="max-w-4xl mx-auto bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#9A7B3E] p-7 sm:p-12 lg:p-16 shadow-md">
          <div className="border-b border-[#E6E2D8] pb-8 mb-8">
            <div className="text-xs font-bold text-[#9A7B3E] mb-3">
              إصدار رقم {dedicatedReadingArticle.index} · {dedicatedReadingArticle.categoryLabel} ·{' '}
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

          {/* Article Lead Summary in Amiri */}
          <div className="p-6 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] mb-10 font-display text-xl lg:text-2xl text-[#141413] leading-[1.95] text-justify">
            {dedicatedReadingArticle.excerpt}
          </div>

          {/* Article Sections */}
          <div className="space-y-8">
            {dedicatedReadingArticle.sections.map((sec, idx) => (
              <div key={idx} className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F291E]">
                  {sec.heading}
                </h2>
                <p className="font-display text-xl text-[#141413] leading-[2.05] text-justify">
                  {sec.body}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Return Action */}
          <div className="mt-12 pt-6 border-t border-[#E6E2D8] flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-zinc-500">
              الموقع الرسمي لعائلات الصعيدي في الوطن العربي — الأرشيف الوثائقي والمنصة المعرفية
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
      {/* Institutional Diwan Header */}
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
            <span className="font-bold text-[#0F291E]">الديوان والمقالات</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-zinc-500">ELSAIDY Knowledge & Heritage Cloud</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setDraftError('');
              setIsNewPostModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#0F291E] text-white text-xs font-bold hover:bg-[#141E28] shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <PenTool className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>إضافة مقال / بيان جديد</span>
          </button>
        </div>

        <div className="max-w-4xl">
          <div className="text-xs font-bold text-[#9A7B3E] mb-2">
            الأرشيف الوثائقي والمنصة المعرفية · ديوان عائلات الصعيدي في الوطن العربي
          </div>
          <h1
            className="font-extrabold text-[#141413] tracking-tight leading-[1.25] mb-4"
            style={{ fontSize: 'clamp(1.85rem, 3.5vw, 2.85rem)', textWrap: 'balance' }}
          >
            الديوان والمقالات — الأبحاث التاريخية، تحقيق الوثائق، وبيانات العائلة والبراند
          </h1>
          <p className="text-sm sm:text-base text-zinc-700 leading-[1.85] max-w-[75ch]">
            منبر النشر الرسمي المخصص لتوثيق الدراسات التاريخية المتعلقة بعائلات الصعيدي في مصر
            والسعودية والشام والخليج والمغرب العربي، إلى جانب أخبار المناسبات والبيانات الصادرة عن
            الديوان ومجموعة الصعيدي.
          </p>
        </div>
      </section>

      {/* Category Filter & Search Bar */}
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
            { id: 'news', label: 'أخبار وبيانات الديوان والبراند' }
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
            className="w-full pr-10 pl-4 py-3 rounded-xl bg-white border border-[#E6E2D8] text-xs text-[#141413] shadow-sm outline-none focus:border-[#9A7B3E]"
          />
        </div>
      </section>

      {/* Editorial Grid of Diwan Articles */}
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
                className="p-7 sm:p-9 rounded-xl bg-white border border-[#E6E2D8] border-t-4 border-t-[#9A7B3E] shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-3 mb-4 border-b border-[#E6E2D8]">
                    <span className="font-bold text-[#9A7B3E]">
                      إصدار {article.index} · {article.categoryLabel}
                    </span>
                    <span className="text-zinc-500">
                      {article.hijriDate} ({article.publishDate})
                    </span>
                  </div>

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
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span>{article.readTime}</span>
                  </div>

                  <span className="font-extrabold text-[#0F291E] flex items-center gap-1.5 group-hover:text-[#9A7B3E] transition-colors">
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

      {/* New Article / Statement Modal */}
      {isNewPostModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 overflow-y-auto"
          onClick={() => setIsNewPostModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#9A7B3E] p-6 sm:p-8 my-8 text-[#141413] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-[#E6E2D8]">
              <div>
                <div className="text-xs text-[#9A7B3E] font-bold">
                  النشر في ديوان عائلات الصعيدي
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#141413] mt-1">
                  إضافة مقال تاريخي أو بيان رسمي جديد
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPostModalOpen(false)}
                className="p-1.5 rounded-lg border border-[#E6E2D8] hover:border-[#9A7B3E] cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublishSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1.5">
                  عنوان المقال أو البيان:
                </label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  placeholder="مثال: دراسة توثيقية في تاريخ فرع..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#9A7B3E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1.5">
                    اسم الكاتب / الباحث:
                  </label>
                  <input
                    type="text"
                    value={draft.author}
                    onChange={(e) => setDraft({ ...draft, author: e.target.value })}
                    placeholder="الاسم الكامل"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#9A7B3E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#141413] mb-1.5">
                    تصنيف الإصدار:
                  </label>
                  <select
                    value={draft.category}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        category: e.target.value as 'heritage' | 'research' | 'documents' | 'news'
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#9A7B3E]"
                  >
                    <option value="heritage">تحقيق الأنساب والتاريخ</option>
                    <option value="research">الدراسات التاريخية والمصادر</option>
                    <option value="documents">المراجع والوثائق المعتمدة</option>
                    <option value="news">أخبار وبيانات الديوان والبراند</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1.5">
                  ملخص المقال (مقدمة موجزة):
                </label>
                <textarea
                  rows={2}
                  value={draft.excerpt}
                  onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
                  placeholder="اكتب ملخصاً موجزاً يظهر في بطاقة المقال..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#9A7B3E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1.5">
                  النص الكامل للمقال أو الوثيقة:
                </label>
                <textarea
                  rows={5}
                  value={draft.body}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                  placeholder="اكتب النص التفصيلي للمقال أو البيان..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#141413] outline-none focus:border-[#9A7B3E]"
                />
              </div>

              {draftError && (
                <div className="p-3 rounded-xl bg-[#F7F6F2] border border-[#9A7B3E] text-xs font-bold text-[#141413]">
                  {draftError}
                </div>
              )}

              <div className="pt-4 border-t border-[#E6E2D8] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E6E2D8] text-xs font-bold text-zinc-700 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0F291E] text-white text-xs font-bold hover:bg-[#141E28] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>نشر المقال وفتحه للمطالعة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
