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
    news: 'أخبار وبيانات الديوان'
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
      publishDate: '٢٠ أكتوبر ٢٠٢٦ م',
      hijriDate: '٩ ربيع الآخر ١٤٤٨ هـ',
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
      <div className="py-10 lg:py-16">
        {/* Top Reading Navigation Bar */}
        <div className="pb-6 mb-8 border-b border-[#DCD9D0] flex flex-wrap items-center justify-between gap-4 text-xs">
          <button
            type="button"
            onClick={() => setDedicatedReadingArticle(null)}
            className="px-4 py-2 bg-[#141413] text-[#F8F7F4] font-semibold hover:bg-[#1B3B2B] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة إلى فهرس الديوان والمقالات</span>
          </button>

          <div className="text-zinc-600">
            <span className="font-semibold text-[#8C6D32]">
              {dedicatedReadingArticle.categoryLabel}
            </span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>{dedicatedReadingArticle.hijriDate}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>{dedicatedReadingArticle.publishDate}</span>
          </div>
        </div>

        {/* Dedicated Editorial Article Canvas */}
        <article className="max-w-4xl mx-auto bg-[#F8F7F4] border border-[#DCD9D0] p-7 sm:p-12 lg:p-16">
          <div className="border-b border-[#DCD9D0] pb-8 mb-8">
            <div className="text-xs font-semibold text-[#8C6D32] mb-3">
              إصدار رقم {dedicatedReadingArticle.index} · {dedicatedReadingArticle.categoryLabel} ·{' '}
              {dedicatedReadingArticle.readTime}
            </div>

            <h1
              className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#141413] leading-[1.3] mb-6"
              style={{ textWrap: 'balance' }}
            >
              {dedicatedReadingArticle.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-600 pt-4 border-t border-[#DCD9D0]">
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

          {/* Article Lead Summary */}
          <div className="p-6 bg-[#F1EFEA] border border-[#DCD9D0] mb-10 font-display text-xl lg:text-2xl text-[#141413] leading-[1.95] text-justify">
            {dedicatedReadingArticle.excerpt}
          </div>

          {/* Article Sections */}
          <div className="space-y-8">
            {dedicatedReadingArticle.sections.map((sec, idx) => (
              <div key={idx} className="space-y-3">
                <h2 className="font-display text-2xl font-bold text-[#1B3B2B]">
                  {sec.heading}
                </h2>
                <p className="font-display text-xl text-[#141413] leading-[2.05] text-justify">
                  {sec.body}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Return Action */}
          <div className="mt-12 pt-6 border-t border-[#DCD9D0] flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              الموقع الرسمي لعائلة الصعيدي — الأرشيف الوثائقي والمنصة المعرفية
            </span>
            <button
              type="button"
              onClick={() => setDedicatedReadingArticle(null)}
              className="px-5 py-2.5 bg-[#1B3B2B] text-[#F8F7F4] text-xs font-semibold hover:bg-[#141413] transition-colors cursor-pointer"
            >
              العودة إلى قائمة المقالات
            </button>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div>
      {/* Institutional Diwan Header */}
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
            <span className="font-semibold text-[#1B3B2B]">الديوان والمقالات</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-zinc-500">الأرشيف الوثائقي والمنصة المعرفية</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setDraftError('');
              setIsNewPostModalOpen(true);
            }}
            className="px-4 py-2 bg-[#1B3B2B] text-[#F8F7F4] text-xs font-semibold hover:bg-[#141413] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>إضافة مقال / بيان جديد</span>
          </button>
        </div>

        <div className="max-w-4xl">
          <div className="text-xs font-semibold text-[#8C6D32] mb-2">
            الأرشيف الوثائقي والمنصة المعرفية · ديوان عائلة الصعيدي
          </div>
          <h1
            className="font-display font-bold text-[#141413] tracking-tight leading-[1.2] mb-4"
            style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', textWrap: 'balance' }}
          >
            الديوان والمقالات — الأبحاث التاريخية، تحقيق الوثائق، وبيانات العائلة
          </h1>
          <p className="text-base text-zinc-700 leading-[1.85] max-w-[70ch]">
            منبر النشر الرسمي المخصص لتوثيق الدراسات التاريخية المتعلقة بقبيلة جهينة وينبع النخل
            وتفرع عائلة الصعيدي في تيماء وحائل والرياض وتبوك وجبل العرب والإمارات وسلطنة عُمان، إلى
            جانب أخبار المناسبات والبيانات الصادرة عن الديوان.
          </p>
        </div>
      </section>

      {/* Category Filter & Search Bar */}
      <section className="py-6 border-b border-[#DCD9D0]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div
            className="flex flex-wrap items-center gap-1 bg-[#F1EFEA] border border-[#DCD9D0] p-1"
            role="tablist"
            aria-label="تصفية مقالات الديوان"
          >
            {[
              { id: 'all', label: 'كافة الأبواب' },
              { id: 'heritage', label: 'تحقيق الأنساب والتاريخ' },
              { id: 'research', label: 'الدراسات التاريخية' },
              { id: 'documents', label: 'المراجع والوثائق' },
              { id: 'news', label: 'أخبار وبيانات الديوان' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selectedCategory === tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === tab.id
                    ? 'bg-[#141413] text-[#F8F7F4] font-semibold'
                    : 'text-zinc-700 hover:text-[#141413]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في مقالات وبيانات الديوان..."
              aria-label="ابحث في مقالات الديوان"
              className="w-full md:w-72 pr-10 pl-4 py-2 text-xs bg-[#F8F7F4] border border-[#DCD9D0] text-[#141413] outline-none focus:border-[#8C6D32]"
            />
          </div>
        </div>
      </section>

      {/* Articles List & Broadsheet Grid */}
      <section className="py-12 lg:py-16">
        <div className="space-y-6">
          {filteredArticles.map((post) => (
            <article
              key={post.id}
              onClick={() => setDedicatedReadingArticle(post)}
              className="p-7 sm:p-9 border border-[#DCD9D0] bg-[#F8F7F4] hover:bg-[#F1EFEA]/60 transition-colors cursor-pointer"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600 mb-3 pb-3 border-b border-[#DCD9D0]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#8C6D32]">
                    إصدار {post.index} · {post.categoryLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{post.hijriDate}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.publishDate}</span>
                </div>
                <span className="text-[#1B3B2B] font-medium">{post.readTime}</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#141413] leading-snug mb-3">
                {post.title}
              </h2>

              <p className="text-sm sm:text-base text-zinc-700 leading-[1.85] mb-6">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#DCD9D0] text-xs">
                <div className="text-zinc-600">
                  <strong className="text-[#141413]">{post.author}</strong> · {post.authorTitle}
                </div>

                <span className="font-semibold text-[#1B3B2B] flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#8C6D32]" />
                  <span>فتح المقال في صفحة المطالعة الكاملة</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* "إضافة مقال / بيان جديد" (New Post) Modal */}
      {isNewPostModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 overflow-y-auto"
          onClick={() => setIsNewPostModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#F8F7F4] border border-[#DCD9D0] p-6 sm:p-8 my-8 text-[#141413]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-[#DCD9D0]">
              <div>
                <div className="text-xs font-semibold text-[#8C6D32]">
                  ديوان عائلة الصعيدي · النشر التوثيقي والإخباري
                </div>
                <h3 className="font-display text-2xl font-bold text-[#141413] mt-0.5">
                  إضافة مقال / بيان جديد
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPostModalOpen(false)}
                className="p-1.5 border border-[#DCD9D0] hover:border-[#8C6D32] cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublishSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                  عنوان المقال أو البيان الرسمي
                </label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  placeholder="أدخل عنوان المقال أو البيان..."
                  className="w-full px-4 py-2.5 text-sm bg-[#F1EFEA] border border-[#DCD9D0] text-[#141413] outline-none focus:border-[#8C6D32]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                    تصنيف المقال في الديوان
                  </label>
                  <select
                    value={draft.category}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        category: e.target.value as
                          | 'heritage'
                          | 'research'
                          | 'documents'
                          | 'news'
                      })
                    }
                    className="w-full px-4 py-2.5 text-sm bg-[#F1EFEA] border border-[#DCD9D0] text-[#141413] outline-none focus:border-[#8C6D32]"
                  >
                    <option value="heritage">تحقيق الأنساب والتاريخ</option>
                    <option value="research">الدراسات التاريخية والمصادر</option>
                    <option value="documents">المراجع والوثائق المعتمدة</option>
                    <option value="news">أخبار وبيانات الديوان</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                    اسم الكاتب أو اللجنة المصدرة
                  </label>
                  <input
                    type="text"
                    value={draft.author}
                    onChange={(e) => setDraft({ ...draft, author: e.target.value })}
                    placeholder="الاسم الكامل أو اللجنة"
                    className="w-full px-4 py-2.5 text-sm bg-[#F1EFEA] border border-[#DCD9D0] text-[#141413] outline-none focus:border-[#8C6D32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                  ملخص المقال (مقدمة موجزة)
                </label>
                <input
                  type="text"
                  value={draft.excerpt}
                  onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
                  placeholder="خلاصة من سطرين تظهر في فهرس الديوان..."
                  className="w-full px-4 py-2.5 text-sm bg-[#F1EFEA] border border-[#DCD9D0] text-[#141413] outline-none focus:border-[#8C6D32]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                  النص الكامل للمقال أو البيان
                </label>
                <textarea
                  rows={5}
                  value={draft.body}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                  placeholder="اكتب النص التفصيلي للمقال أو البيان هنا..."
                  className="w-full px-4 py-3 text-sm bg-[#F1EFEA] border border-[#DCD9D0] text-[#141413] outline-none focus:border-[#8C6D32]"
                />
              </div>

              {draftError && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800">
                  {draftError}
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#DCD9D0]">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2.5 bg-[#F1EFEA] border border-[#DCD9D0] text-xs font-medium text-zinc-700 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1B3B2B] text-[#F8F7F4] text-xs font-semibold hover:bg-[#141413] transition-colors cursor-pointer"
                >
                  اعتماد ومعاينة المقال
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
