import React, { useState } from 'react';
import { DIWAN_ARTICLES, DiwanArticle, PageRoute } from '../data/familyData';
import { Search, ArrowRight, ChevronLeft, BookOpen, PenTool, Check } from 'lucide-react';

interface BlogPageProps {
  onNavigate: (route: PageRoute) => void;
  onReadArticle: (article: DiwanArticle) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, onReadArticle }) => {
  const [articles, setArticles] = useState<DiwanArticle[]>(DIWAN_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPublishForm, setShowPublishForm] = useState<boolean>(false);

  const [draft, setDraft] = useState({
    title: '',
    author: '',
    authorTitle: 'باحث / كاتب من عائلة الصعيدي',
    category: 'heritage' as 'heritage' | 'research' | 'documents' | 'news',
    excerpt: '',
    body: ''
  });
  const [draftError, setDraftError] = useState<string>('');
  const [draftSuccess, setDraftSuccess] = useState<boolean>(false);

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

  const leadArticle = filteredArticles[0] || articles[0];

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim() || draft.title.trim().length < 8) {
      setDraftError('يرجى إدخال عنوان واضح للمقال أو الدراسة (8 أحرف على الأقل).');
      return;
    }
    if (!draft.author.trim()) {
      setDraftError('يرجى إدخال اسم الكاتب أو الباحث.');
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
          heading: 'نص المقال والدراسة التوثيقية',
          body: draft.body.trim()
        }
      ]
    };

    setArticles([newPost, ...articles]);
    setDraftError('');
    setDraftSuccess(true);
    setDraft({
      title: '',
      author: '',
      authorTitle: 'باحث / كاتب من عائلة الصعيدي',
      category: 'heritage',
      excerpt: '',
      body: ''
    });
  };

  return (
    <div>
      {/* Institutional Diwan Header */}
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
            <span className="font-semibold text-[#8C6D32]">الديوان والأخبار</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-zinc-500">الأرشيف الوثائقي والمنصة المعرفية</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowPublishForm(!showPublishForm);
              setDraftSuccess(false);
            }}
            className="px-4 py-2 bg-[#18181B] text-[#F9F8F6] text-xs font-semibold hover:bg-[#8C6D32] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>{showPublishForm ? 'إغلاق نموذج الإيداع' : 'إيداع مقال أو خبر في الديوان'}</span>
          </button>
        </div>

        <div className="max-w-4xl">
          <div className="text-xs font-semibold text-[#8C6D32] mb-2">
            الأرشيف الوثائقي والمنصة المعرفية · ديوان عائلة الصعيدي
          </div>
          <h1
            className="font-display font-bold text-[#18181B] tracking-tight leading-[1.2] mb-4"
            style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', textWrap: 'balance' }}
          >
            الديوان والأخبار — الأبحاث التاريخية، تحقيق الوثائق، وبيانات العائلة
          </h1>
          <p className="text-base text-zinc-700 leading-[1.8] max-w-[70ch]">
            منبر النشر الرسمي المخصص لتوثيق الدراسات التاريخية المتعلقة بقبيلة جهينة وينبع النخل
            وتفرع عائلة الصعيدي في تيماء وحائل والرياض وتبوك وجبل العرب والإمارات وسلطنة عُمان، إلى
            جانب أخبار المناسبات والبيانات الصادرة عن الديوان.
          </p>
        </div>

        {/* Interactive Submission Drawer */}
        {showPublishForm && (
          <div className="mt-8 p-6 sm:p-8 bg-[#F3F1EC] border border-[#E2DFD7]">
            {draftSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-10 h-10 bg-[#18181B] text-[#F9F8F6] flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="font-display text-2xl font-bold text-[#18181B]">
                  تم إيداع المقال ونشره في سجل الديوان بنجاح
                </h3>
                <p className="text-xs text-zinc-600">
                  يمكنك الآن تصفح المقال المنشور مباشرة في قائمة إصدارات الديوان أدناه.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePublishSubmit} className="space-y-4" noValidate>
                <div className="text-xs font-semibold text-[#8C6D32] mb-2">
                  نموذج إيداع دراسة تاريخية أو خبر عائلي في الديوان
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                      عنوان المقال أو البيان
                    </label>
                    <input
                      type="text"
                      value={draft.title}
                      onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                      placeholder="مثال: قراءة في تاريخ منازل جهينة بينبع النخل وتيماء"
                      className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-[#E2DFD7] text-[#18181B] outline-none focus:border-[#8C6D32]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                      باب التصنيف في الديوان
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
                      className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-[#E2DFD7] text-[#18181B] outline-none focus:border-[#8C6D32]"
                    >
                      <option value="heritage">تحقيق الأنساب والتاريخ</option>
                      <option value="research">الدراسات التاريخية والمصادر</option>
                      <option value="documents">المراجع والوثائق المعتمدة</option>
                      <option value="news">أخبار وبيانات الديوان</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                      اسم الكاتب / الباحث
                    </label>
                    <input
                      type="text"
                      value={draft.author}
                      onChange={(e) => setDraft({ ...draft, author: e.target.value })}
                      placeholder="الاسم الثلاثي الكامل"
                      className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-[#E2DFD7] text-[#18181B] outline-none focus:border-[#8C6D32]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                      الصفة أو الفرع العائلي
                    </label>
                    <input
                      type="text"
                      value={draft.authorTitle}
                      onChange={(e) => setDraft({ ...draft, authorTitle: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-[#E2DFD7] text-[#18181B] outline-none focus:border-[#8C6D32]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                    ملخص المقال (مقدمة موجزة)
                  </label>
                  <input
                    type="text"
                    value={draft.excerpt}
                    onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
                    placeholder="خلاصة من سطرين للمقال..."
                    className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-[#E2DFD7] text-[#18181B] outline-none focus:border-[#8C6D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#18181B] mb-1.5">
                    النص الكامل للمقال أو الدراسة
                  </label>
                  <textarea
                    rows={4}
                    value={draft.body}
                    onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                    placeholder="اكتب النص الكامل هنا..."
                    className="w-full px-4 py-3 text-sm bg-[#F9F8F6] border border-[#E2DFD7] text-[#18181B] outline-none focus:border-[#8C6D32]"
                  />
                </div>

                {draftError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800">
                    {draftError}
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPublishForm(false)}
                    className="px-4 py-2 bg-[#F9F8F6] border border-[#E2DFD7] text-xs font-medium text-zinc-700 cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#18181B] text-[#F9F8F6] text-xs font-semibold hover:bg-[#8C6D32] transition-colors cursor-pointer"
                  >
                    اعتماد ونشر في الديوان
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </section>

      {/* Category Filter & Search Bar */}
      <section className="py-6 border-b border-[#E2DFD7]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div
            className="flex flex-wrap items-center gap-1 bg-[#F3F1EC] border border-[#E2DFD7] p-1"
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
                    ? 'bg-[#18181B] text-[#F9F8F6] font-semibold'
                    : 'text-zinc-700 hover:text-[#18181B]'
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
              placeholder="ابحث في أرشيف الديوان..."
              aria-label="ابحث في أرشيف الديوان"
              className="w-full md:w-72 pr-10 pl-4 py-2 text-xs bg-[#F9F8F6] border border-[#E2DFD7] text-[#18181B] outline-none focus:border-[#8C6D32]"
            />
          </div>
        </div>
      </section>

      {/* Lead Broadsheet Feature */}
      {leadArticle && (
        <section className="py-12 border-b border-[#E2DFD7]">
          <div className="bg-[#F3F1EC] border border-[#E2DFD7] p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600 mb-3">
                <span className="font-semibold text-[#8C6D32]">الإصدار الرئيسي المميّز</span>
                <span aria-hidden="true">·</span>
                <span>{leadArticle.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{leadArticle.hijriDate}</span>
                <span aria-hidden="true">·</span>
                <span>{leadArticle.readTime}</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#18181B] leading-snug mb-4">
                {leadArticle.title}
              </h2>

              <p className="text-sm sm:text-base text-zinc-700 leading-[1.85] mb-6">
                {leadArticle.excerpt}
              </p>

              <button
                type="button"
                onClick={() => onReadArticle(leadArticle)}
                className="px-6 py-3 bg-[#18181B] text-[#F9F8F6] text-xs font-semibold hover:bg-[#8C6D32] transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>مطالعة الدراسة الكاملة</span>
              </button>
            </div>

            <div className="lg:col-span-4 bg-[#F9F8F6] border border-[#E2DFD7] p-6 space-y-4">
              <div className="text-xs font-semibold text-[#8C6D32] pb-2 border-b border-[#E2DFD7]">
                فهرس مباحث الدراسة:
              </div>
              <ul className="space-y-3 text-xs text-zinc-700">
                {leadArticle.sections.map((sec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-semibold text-[#8C6D32]">٠{idx + 1}.</span>
                    <span>{sec.heading}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-3 border-t border-[#E2DFD7] text-[11px] text-zinc-500">
                إعداد: {leadArticle.author} · {leadArticle.authorTitle}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Editorial Grid of All Publications */}
      <section className="py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-r border-[#E2DFD7]">
          {filteredArticles.map((post) => (
            <article
              key={post.id}
              className="p-7 lg:p-8 border-b border-l border-[#E2DFD7] bg-[#F9F8F6] hover:bg-[#F3F1EC]/50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mb-3">
                  <span className="font-semibold text-[#8C6D32]">
                    {post.index} · {post.categoryLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{post.hijriDate}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.publishDate}</span>
                </div>

                <h3 className="font-display text-2xl font-bold text-[#18181B] leading-snug mb-3">
                  {post.title}
                </h3>

                <p className="text-sm text-zinc-700 leading-[1.85] mb-6">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E2DFD7] flex items-center justify-between text-xs">
                <div className="text-zinc-600">
                  <span className="font-semibold text-[#18181B]">{post.author}</span>
                  <span className="mx-1.5" aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onReadArticle(post)}
                  className="font-semibold text-[#8C6D32] hover:text-[#18181B] flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>مطالعة النص</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
