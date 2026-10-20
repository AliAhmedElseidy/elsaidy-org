import React, { useState } from 'react';
import {
  BLOG_ARTICLES,
  BlogArticlePreview,
  PageRoute
} from '../data/familyData';
import {
  Sun,
  Moon,
  Search,
  ArrowUpLeft,
  ArrowRight,
  ChevronLeft,
  BookOpen,
  PenTool,
  Check
} from 'lucide-react';

interface BlogPageProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigate: (route: PageRoute) => void;
  onReadArticle: (article: BlogArticlePreview) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  isDark,
  onToggleTheme,
  onNavigate,
  onReadArticle
}) => {
  const [articles, setArticles] = useState<BlogArticlePreview[]>(BLOG_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPublishForm, setShowPublishForm] = useState<boolean>(false);

  // New Article Draft State
  const [draft, setDraft] = useState({
    title: '',
    author: '',
    authorRole: 'باحث / كاتب من عائلة الصعيدي',
    category: 'history' as 'history' | 'engineering' | 'manuscripts' | 'initiatives',
    excerpt: '',
    body: ''
  });
  const [draftError, setDraftError] = useState<string>('');
  const [draftSuccess, setDraftSuccess] = useState<boolean>(false);

  const categoryLabels: Record<string, string> = {
    history: 'التاريخ والأنساب',
    engineering: 'البنية الرقمية والهندسة',
    manuscripts: 'المخطوطات والأرشيف',
    initiatives: 'أخبار ومبادرات العائلة'
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
  const gridArticles =
    filteredArticles.length > 1 ? filteredArticles.slice(1) : filteredArticles;

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

    const newPost: BlogArticlePreview = {
      id: `post-custom-${Date.now()}`,
      index: `0${articles.length + 1}`,
      title: draft.title.trim(),
      category: draft.category,
      categoryLabel: categoryLabels[draft.category],
      publishDate: '20 أكتوبر 2026',
      readTime: '5 دقائق للقراءة',
      author: draft.author.trim(),
      authorRole: draft.authorRole.trim(),
      url: 'https://blog.elsaidy.org',
      excerpt: draft.excerpt.trim(),
      sections: [
        {
          heading: 'محور الدراسة والمقال',
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
      authorRole: 'باحث / كاتب من عائلة الصعيدي',
      category: 'history',
      excerpt: '',
      body: ''
    });
  };

  return (
    <div>
      {/* Editorial Blog Header */}
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
            <span className="font-mono text-[#C59B27]">elsaidy.org/blog</span>
            <span aria-hidden="true">·</span>
            <span>منصة النشر المعرفي والتاريخي والتقني</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://blog.elsaidy.org"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-3 py-1.5 rounded-lg border font-mono text-[11px] flex items-center gap-1.5 transition-colors ${
                isDark
                  ? 'bg-[#0E1624] border-slate-800 text-[#C59B27] hover:border-[#C59B27]'
                  : 'bg-white border-slate-200 text-[#9A741C] hover:border-[#C59B27]'
              }`}
            >
              <span>blog.elsaidy.org</span>
              <ArrowUpLeft className="w-3.5 h-3.5" />
            </a>

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
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="text-xs font-medium text-[#C59B27] mb-3">
              المدونة الرسمية والأرشيف المعرفي · blog.elsaidy.org
            </div>
            <h1
              className={`font-display font-bold tracking-tight leading-[1.2] mb-4 ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
              style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', textWrap: 'balance' }}
            >
              دراسات التاريخ والأنساب، تحقيق المخطوطات، ومقالات الهندسة الرقمية
            </h1>
            <p
              className={`text-base lg:text-lg leading-[1.85] ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              منبر معرفي محكّم يجمع بين البحوث التاريخية المتعلقة بجذور وفروع عائلة الصعيدي في
              ينبع وتيماء وحائل والرياض والشام والخليج، وبين المقالات الهندسية لفريق البنية الرقمية.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowPublishForm(!showPublishForm);
              setDraftSuccess(false);
            }}
            className="px-5 py-3 rounded-xl bg-[#C59B27] text-slate-950 text-xs font-semibold hover:bg-[#d4ab32] transition-colors flex items-center gap-2 self-start lg:self-end cursor-pointer whitespace-nowrap shrink-0"
          >
            <PenTool className="w-4 h-4" />
            <span>{showPublishForm ? 'إغلاق نموذج النشر' : 'إضافة مقال أو دراسة جديدة'}</span>
          </button>
        </div>

        {/* Interactive Publish Form Drawer */}
        {showPublishForm && (
          <div
            className={`mt-8 p-6 lg:p-8 rounded-2xl border ${
              isDark ? 'bg-[#0E1624] border-[#C59B27]/50' : 'bg-white border-[#C59B27]/60'
            }`}
          >
            {draftSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="font-display text-2xl font-bold">
                  تم نشر المقال وإضافته إلى أرشيف المدونة بنجاح
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  يمكنك الآن استعراض المقال مباشرة في قائمة المنشورات أدناه.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePublishSubmit} className="space-y-4" noValidate>
                <div className="text-xs font-semibold text-[#C59B27] mb-2">
                  نشر مقال أو دراسة توثيقية في مدونة العائلة (blog.elsaidy.org)
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium mb-1.5">عنوان المقال أو البحث</label>
                    <input
                      type="text"
                      value={draft.title}
                      onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                      placeholder="مثال: قراءة في وثائق تيماء وينبع النخل خلال القرن الثالث عشر الهجري"
                      className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none ${
                        isDark
                          ? 'bg-[#090E17] border-slate-800 text-white focus:border-[#C59B27]'
                          : 'bg-[#FAF8F5] border-slate-300 text-slate-900 focus:border-[#C59B27]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5">التصنيف الموضوعي</label>
                    <select
                      value={draft.category}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          category: e.target.value as
                            | 'history'
                            | 'engineering'
                            | 'manuscripts'
                            | 'initiatives'
                        })
                      }
                      className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none ${
                        isDark
                          ? 'bg-[#090E17] border-slate-800 text-white focus:border-[#C59B27]'
                          : 'bg-[#FAF8F5] border-slate-300 text-slate-900 focus:border-[#C59B27]'
                      }`}
                    >
                      <option value="history">التاريخ والأنساب</option>
                      <option value="engineering">البنية الرقمية والهندسة</option>
                      <option value="manuscripts">المخطوطات والأرشيف</option>
                      <option value="initiatives">أخبار ومبادرات العائلة</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5">اسم الكاتب / الباحث</label>
                    <input
                      type="text"
                      value={draft.author}
                      onChange={(e) => setDraft({ ...draft, author: e.target.value })}
                      placeholder="الاسم الكامل"
                      className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none ${
                        isDark
                          ? 'bg-[#090E17] border-slate-800 text-white focus:border-[#C59B27]'
                          : 'bg-[#FAF8F5] border-slate-300 text-slate-900 focus:border-[#C59B27]'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5">الصفة أو اللجنة</label>
                    <input
                      type="text"
                      value={draft.authorRole}
                      onChange={(e) => setDraft({ ...draft, authorRole: e.target.value })}
                      className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none ${
                        isDark
                          ? 'bg-[#090E17] border-slate-800 text-white focus:border-[#C59B27]'
                          : 'bg-[#FAF8F5] border-slate-300 text-slate-900 focus:border-[#C59B27]'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5">ملخص المقال (مقدمة مختصرة)</label>
                  <input
                    type="text"
                    value={draft.excerpt}
                    onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
                    placeholder="ملخص من سطرين يظهر في بطاقة العرض..."
                    className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none ${
                      isDark
                        ? 'bg-[#090E17] border-slate-800 text-white focus:border-[#C59B27]'
                        : 'bg-[#FAF8F5] border-slate-300 text-slate-900 focus:border-[#C59B27]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5">النص الكامل للمقال أو الدراسة</label>
                  <textarea
                    rows={4}
                    value={draft.body}
                    onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                    placeholder="اكتب محتوى المقال التفصيلي هنا..."
                    className={`w-full px-4 py-3 text-sm rounded-xl border outline-none ${
                      isDark
                        ? 'bg-[#090E17] border-slate-800 text-white focus:border-[#C59B27]'
                        : 'bg-[#FAF8F5] border-slate-300 text-slate-900 focus:border-[#C59B27]'
                    }`}
                  />
                </div>

                {draftError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                    {draftError}
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPublishForm(false)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-medium cursor-pointer ${
                      isDark ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-700'
                    }`}
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#C59B27] text-slate-950 text-xs font-semibold hover:bg-[#d4ab32] transition-colors cursor-pointer"
                  >
                    اعتماد ونشر المقال
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </section>

      {/* Filter & Search Toolbar */}
      <section className="py-8 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div
            className={`flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl border ${
              isDark ? 'bg-[#0E1624] border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
            role="tablist"
          >
            {[
              { id: 'all', label: 'جميع المقالات' },
              { id: 'history', label: 'التاريخ والأنساب' },
              { id: 'engineering', label: 'البنية الرقمية والهندسة' },
              { id: 'manuscripts', label: 'المخطوطات والأرشيف' },
              { id: 'initiatives', label: 'أخبار ومبادرات العائلة' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selectedCategory === tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === tab.id
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

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في عناوين ومحتوى المدونة..."
              aria-label="ابحث في المدونة"
              className={`w-full md:w-72 pr-10 pl-4 py-2 text-xs rounded-xl border outline-none transition-colors ${
                isDark
                  ? 'bg-[#0E1624] border-slate-800 text-slate-100 focus:border-[#C59B27]'
                  : 'bg-white border-slate-200 text-slate-900 focus:border-[#C59B27]'
              }`}
            />
          </div>
        </div>
      </section>

      {/* Tier 1: Lead Featured Story */}
      {leadArticle && (
        <section
          className={`py-12 lg:py-16 border-b ${
            isDark ? 'border-slate-800/80' : 'border-slate-200'
          }`}
        >
          <div
            className={`p-7 lg:p-10 rounded-2xl border grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
              isDark ? 'bg-[#0E1624] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
                <span className="text-[#C59B27] font-semibold">الدراسة الرئيسية المميزة</span>
                <span aria-hidden="true">·</span>
                <span>{leadArticle.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{leadArticle.publishDate}</span>
                <span aria-hidden="true">·</span>
                <span>{leadArticle.readTime}</span>
              </div>

              <h2
                className={`font-display text-2xl lg:text-4xl font-bold leading-snug mb-4 ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                {leadArticle.title}
              </h2>

              <p
                className={`text-sm lg:text-base leading-[1.85] mb-6 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {leadArticle.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onReadArticle(leadArticle)}
                  className="px-5 py-3 rounded-xl bg-[#C59B27] text-slate-950 text-xs font-semibold hover:bg-[#d4ab32] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>قراءة الدراسة كاملة</span>
                </button>

                <a
                  href={leadArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xs font-mono hover:underline ${
                    isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  فتح في blog.elsaidy.org ↗
                </a>
              </div>
            </div>

            <div
              className={`lg:col-span-4 p-6 rounded-xl border space-y-4 ${
                isDark ? 'bg-[#090E17] border-slate-800' : 'bg-[#FAF8F5] border-slate-200'
              }`}
            >
              <div className="text-xs font-semibold text-[#C59B27]">محاور الدراسة المنشورة:</div>
              <ul className="space-y-3 text-xs">
                {leadArticle.sections.map((sec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-mono text-[#C59B27] font-semibold">0{idx + 1}.</span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      {sec.heading}
                    </span>
                  </li>
                ))}
              </ul>
              <div
                className={`pt-3 border-t text-[11px] ${
                  isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}
              >
                إعداد: {leadArticle.author} · {leadArticle.authorRole}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tier 2: Sleek Articles Grid */}
      <section className="py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((post) => (
            <article
              key={post.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between transition-colors ${
                isDark
                  ? 'bg-[#0E1624] border-slate-800/90 hover:border-[#C59B27]/60'
                  : 'bg-white border-slate-200/90 hover:border-[#C59B27]/60'
              }`}
            >
              <div>
                <div
                  className={`flex flex-wrap items-center gap-2 text-xs mb-3 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  <span className="text-[#C59B27] font-semibold">
                    {post.index}. {post.categoryLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{post.publishDate}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                </div>

                <h3
                  className={`font-display text-xl font-bold leading-snug mb-3 ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  {post.title}
                </h3>

                <p
                  className={`text-sm leading-relaxed mb-6 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  {post.excerpt}
                </p>
              </div>

              <div>
                <div
                  className={`text-xs pb-3 mb-3 border-b ${
                    isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                  }`}
                >
                  {post.author}
                </div>

                <div className="flex items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => onReadArticle(post)}
                    className="font-semibold text-[#C59B27] hover:underline underline-offset-4 cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0"
                  >
                    <span>قراءة المقال الكامل</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-mono text-[11px] hover:underline ${
                      isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    blog.elsaidy.org ↗
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
