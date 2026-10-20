/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FAMILY_BRANCHES,
  PageRoute,
  InfrastructureService,
  BlogArticlePreview
} from './data/familyData';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { ProjectsPage } from './pages/ProjectsPage';
import {
  ArrowUpLeft,
  Check,
  Globe,
  Mail,
  Building2,
  X
} from 'lucide-react';

function getInitialRoute(): PageRoute {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path === '/about') return 'about';
  if (path === '/blog') return 'blog';
  if (path === '/projects') return 'projects';
  return 'home';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(getInitialRoute);
  const [isDark, setIsDark] = useState<boolean>(true);
  const [activeBranchId, setActiveBranchId] = useState<string>(FAMILY_BRANCHES[1].id);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [inspectedService, setInspectedService] = useState<InfrastructureService | null>(null);
  const [activeArticle, setActiveArticle] = useState<BlogArticlePreview | null>(null);

  // Contact / Provisioning Request Form State
  const [formData, setFormData] = useState({
    fullName: '',
    branch: 'فرع صالح وعلي — حائل والرياض',
    email: '',
    requestType: 'طلب بريد رسمي (@elsaidy.org)',
    message: ''
  });
  const [formError, setFormError] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route: PageRoute) => {
    setCurrentRoute(route);
    const targetPath = route === 'home' ? '/' : `/${route}`;
    try {
      window.history.pushState({}, '', targetPath);
    } catch {
      // Fallback if pushState is restricted in sandboxed iframe
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      setFormError('يرجى إدخال الاسم الثلاثي الكامل بشكل صحيح.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setFormError('يرجى إدخال عنوان بريد إلكتروني صحيح للتواصل.');
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setFormError('يرجى كتابة تفاصيل الطلب أو المراسلة التاريخية/التقنية (10 أحرف على الأقل).');
      return;
    }
    setFormError('');
    setFormSubmitted(true);
  };

  return (
    <div
      dir="rtl"
      className={`min-h-screen transition-colors duration-200 ${
        isDark
          ? 'bg-[#090E17] text-slate-100 selection:bg-[#C59B27]/30 selection:text-amber-100'
          : 'bg-[#FAF8F5] text-slate-900 selection:bg-[#C59B27]/20 selection:text-slate-900'
      }`}
    >
      {/* Top Navigation Bar — Strict 3-Zone Contract */}
      <header
        id="top"
        className={`sticky top-0 z-40 flex items-center justify-between gap-8 px-6 lg:px-12 py-4 border-b backdrop-blur-md transition-colors duration-200 ${
          isDark
            ? 'bg-[#090E17]/95 border-slate-800/80'
            : 'bg-[#FAF8F5]/95 border-slate-200/90'
        }`}
      >
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('home');
          }}
          className={`text-xl font-bold font-display tracking-tight whitespace-nowrap shrink-0 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          عائلة الصعيدي
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="التنقل الرئيسي"
          className={`hidden md:flex items-center gap-7 text-sm font-medium ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('home');
            }}
            className={`hover:text-[#C59B27] transition-colors whitespace-nowrap shrink-0 ${
              currentRoute === 'home'
                ? 'text-[#C59B27] underline underline-offset-8 font-semibold'
                : ''
            }`}
          >
            الرئيسية
          </a>
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('about');
            }}
            className={`hover:text-[#C59B27] transition-colors whitespace-nowrap shrink-0 ${
              currentRoute === 'about'
                ? 'text-[#C59B27] underline underline-offset-8 font-semibold'
                : ''
            }`}
          >
            التاريخ والأنساب
          </a>
          <a
            href="/blog"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('blog');
            }}
            className={`hover:text-[#C59B27] transition-colors whitespace-nowrap shrink-0 ${
              currentRoute === 'blog'
                ? 'text-[#C59B27] underline underline-offset-8 font-semibold'
                : ''
            }`}
          >
            المدونة والمقالات
          </a>
          <a
            href="/projects"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('projects');
            }}
            className={`hover:text-[#C59B27] transition-colors whitespace-nowrap shrink-0 ${
              currentRoute === 'projects'
                ? 'text-[#C59B27] underline underline-offset-8 font-semibold'
                : ''
            }`}
          >
            البنية الرقمية
          </a>
          <a
            href="#contact-portal"
            className="hover:text-[#C59B27] transition-colors whitespace-nowrap shrink-0"
          >
            تواصل معنا
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => navigateTo('projects')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#C59B27] text-slate-950 hover:bg-[#d4ab32] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            بوابة الأنظمة
          </button>
        </div>
      </header>

      {/* Main Multi-Page Content Container */}
      <main className="max-w-[1280px] mx-auto px-6 lg:px-12">
        {/* Mobile Route Switcher Strip (Visible only on small viewports below header) */}
        <div
          className={`flex md:hidden items-center gap-1.5 pt-4 overflow-x-auto text-xs ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          {[
            { id: 'home' as PageRoute, label: 'الرئيسية' },
            { id: 'about' as PageRoute, label: 'التاريخ والأنساب' },
            { id: 'blog' as PageRoute, label: 'المدونة' },
            { id: 'projects' as PageRoute, label: 'البنية الرقمية' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigateTo(item.id)}
              className={`px-3 py-1.5 rounded-lg border whitespace-nowrap shrink-0 ${
                currentRoute === item.id
                  ? 'bg-[#C59B27] border-[#C59B27] text-slate-950 font-semibold'
                  : isDark
                  ? 'bg-[#0E1624] border-slate-800'
                  : 'bg-white border-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Render Active Independent Page View */}
        {currentRoute === 'home' && (
          <HomePage
            isDark={isDark}
            onToggleTheme={() => setIsDark(!isDark)}
            activeBranchId={activeBranchId}
            onSelectBranch={(id) => setActiveBranchId(id)}
            onNavigate={navigateTo}
            onInspectService={(srv) => setInspectedService(srv)}
            onReadArticle={(art) => setActiveArticle(art)}
            copiedKey={copiedKey}
            onCopy={handleCopy}
          />
        )}

        {currentRoute === 'about' && (
          <AboutPage
            isDark={isDark}
            onToggleTheme={() => setIsDark(!isDark)}
            activeBranchId={activeBranchId}
            onSelectBranch={(id) => setActiveBranchId(id)}
            onNavigate={navigateTo}
            copiedKey={copiedKey}
            onCopy={handleCopy}
          />
        )}

        {currentRoute === 'blog' && (
          <BlogPage
            isDark={isDark}
            onToggleTheme={() => setIsDark(!isDark)}
            onNavigate={navigateTo}
            onReadArticle={(art) => setActiveArticle(art)}
          />
        )}

        {currentRoute === 'projects' && (
          <ProjectsPage
            isDark={isDark}
            onToggleTheme={() => setIsDark(!isDark)}
            onNavigate={navigateTo}
            onInspectService={(srv) => setInspectedService(srv)}
            copiedKey={copiedKey}
            onCopy={handleCopy}
          />
        )}

        {/* Shared Interactive Contact & Account Provisioning Section (#contact-portal) */}
        <section
          id="contact-portal"
          className={`py-16 lg:py-24 border-t scroll-mt-20 ${
            isDark ? 'border-slate-800/80' : 'border-slate-200'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <div className="text-xs font-medium text-[#C59B27] mb-2">
                بوابة التواصل والخدمات الذاتية — elsaidy.org
              </div>
              <h2
                className={`font-display text-3xl lg:text-4xl font-bold tracking-tight mb-4 ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                تواصل مع مجلس العائلة وفريق البنية الرقمية
              </h2>
              <p
                className={`text-sm lg:text-base leading-relaxed mb-8 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                سواء كنت من أبناء عائلة الصعيدي الراغبين في إصدار بريد إلكتروني رسمي على النطاق{' '}
                <span className="font-mono text-[#C59B27]">@elsaidy.org</span>، أو تفعيل صلاحيات
                الدخول إلى نظام <span className="font-mono">ERPNext</span>، أو لديك وثائق ومشجرات
                تاريخية تود إضافتها إلى الأرشيف الرقمي، يسعدنا استقبال مراسلتك.
              </p>

              <div
                className={`p-6 rounded-2xl border space-y-4 ${
                  isDark ? 'bg-[#0E1624] border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-[#C59B27] mt-1 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-[#C59B27]">
                      صفحات المنصة والنطاقات الرسمية
                    </div>
                    <div className="text-xs font-mono mt-0.5">
                      elsaidy.org · /about · /blog · /projects
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#C59B27] mt-1 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-[#C59B27]">
                      البريد الرسمي والاتصال الموحد
                    </div>
                    <div className="text-xs font-mono mt-0.5">
                      info@elsaidy.org · mail.elsaidy.org · erp.elsaidy.org
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-[#C59B27] mt-1 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-[#C59B27]">
                      الحواضر والفروع الممثلة
                    </div>
                    <div
                      className={`text-xs mt-0.5 leading-relaxed ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      ينبع النخل وينبع البحر · تيماء وتبوك · حائل والرياض · بلاد الشام · الإمارات ·
                      سلطنة عُمان
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Validated Interactive Form */}
            <div
              className={`lg:col-span-7 p-6 lg:p-8 rounded-2xl border ${
                isDark ? 'bg-[#0E1624] border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              {formSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3
                    className={`font-display text-2xl font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    تم استلام طلبك بنجاح في بوابة عائلة الصعيدي
                  </h3>
                  <p
                    className={`text-sm max-w-md mx-auto leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    شكراً لك <strong>{formData.fullName}</strong> ({formData.branch}). سيقوم فريق
                    التوثيق والبنية الرقمية بمراجعة طلبك ({formData.requestType}) والتواصل معك عبر{' '}
                    <span className="font-mono">{formData.email}</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        ...formData,
                        message: ''
                      });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#C59B27] text-slate-950 text-xs font-semibold hover:bg-[#d4ab32] transition-colors cursor-pointer"
                  >
                    إرسال طلب آخر
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="fullName"
                        className={`block text-xs font-medium mb-2 ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        الاسم الكامل (الثلاثي أو الرباعي)
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="مثال: علي بن أحمد الصعيدي"
                        className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-colors ${
                          isDark
                            ? 'bg-[#090E17] border-slate-800 text-white focus:border-[#C59B27]'
                            : 'bg-[#FAF8F5] border-slate-300 text-slate-900 focus:border-[#C59B27]'
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="branch"
                        className={`block text-xs font-medium mb-2 ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        الفرع العائلي / المنطقة
                      </label>
                      <select
                        id="branch"
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-colors ${
                          isDark
                            ? 'bg-[#090E17] border-slate-800 text-white focus:border-[#C59B27]'
                            : 'bg-[#FAF8F5] border-slate-300 text-slate-900 focus:border-[#C59B27]'
                        }`}
                      >
                        <option value="الموطن الأول — ينبع النخل وينبع البحر">
                          الموطن الأول — ينبع النخل وينبع البحر
                        </option>
                        <option value="فرع عبد الله — تيماء وتبوك">
                          فرع عبد الله — تيماء وتبوك
                        </option>
                        <option value="فرع سلامة — بلاد الشام">
                          فرع سلامة — بلاد الشام
                        </option>
                        <option value="فرع صالح وعلي — حائل والرياض">
                          فرع صالح وعلي — حائل والرياض
                        </option>
                        <option value="فرع الخليج العربي — الإمارات وسلطنة عُمان">
                          فرع الخليج العربي — الإمارات وسلطنة عُمان
                        </option>
                        <option value="باحث تاريخي / جهة خارجية">
                          باحث تاريخي / جهة خارجية
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="email"
                        className={`block text-xs font-medium mb-2 ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        البريد الإلكتروني للتواصل
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        dir="ltr"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className={`w-full px-4 py-2.5 text-sm text-right rounded-xl border outline-none transition-colors font-mono ${
                          isDark
                            ? 'bg-[#090E17] border-slate-800 text-white focus:border-[#C59B27]'
                            : 'bg-[#FAF8F5] border-slate-300 text-slate-900 focus:border-[#C59B27]'
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="requestType"
                        className={`block text-xs font-medium mb-2 ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        نوع الطلب أو المراسلة
                      </label>
                      <select
                        id="requestType"
                        value={formData.requestType}
                        onChange={(e) =>
                          setFormData({ ...formData, requestType: e.target.value })
                        }
                        className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-colors ${
                          isDark
                            ? 'bg-[#090E17] border-slate-800 text-white focus:border-[#C59B27]'
                            : 'bg-[#FAF8F5] border-slate-300 text-slate-900 focus:border-[#C59B27]'
                        }`}
                      >
                        <option value="طلب بريد رسمي (@elsaidy.org)">
                          طلب بريد رسمي (@elsaidy.org — Mailcow)
                        </option>
                        <option value="طلب صلاحية نظام الموارد (ERPNext)">
                          طلب صلاحية نظام الموارد (ERPNext)
                        </option>
                        <option value="توثيق شجرة العائلة أو إرسال وثيقة تاريخية">
                          توثيق شجرة العائلة أو إرسال وثيقة تاريخية
                        </option>
                        <option value="المساهمة بمقال في مدونة العائلة (blog.elsaidy.org)">
                          المساهمة بمقال في مدونة العائلة (blog.elsaidy.org)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className={`block text-xs font-medium mb-2 ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      تفاصيل الرسالة أو البيانات التوثيقية
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="اكتب تفاصيل طلبك أو معلومات الوثيقة / الفرع العائلي..."
                      className={`w-full px-4 py-3 text-sm rounded-xl border outline-none transition-colors ${
                        isDark
                          ? 'bg-[#090E17] border-slate-800 text-white focus:border-[#C59B27]'
                          : 'bg-[#FAF8F5] border-slate-300 text-slate-900 focus:border-[#C59B27]'
                      }`}
                    />
                  </div>

                  {formError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                      {formError}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      تُحفظ كافة البيانات بسريّة تامة ضمن خوادم العائلة المشفرة.
                    </span>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-[#C59B27] text-slate-950 text-xs font-semibold hover:bg-[#d4ab32] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      إرسال الطلب والمراسلة
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Corporate & Heritage Footer */}
      <footer
        className={`border-t py-12 px-6 lg:px-12 text-xs ${
          isDark
            ? 'bg-[#070B12] border-slate-800/80 text-slate-400'
            : 'bg-[#F3EFEA] border-slate-200 text-slate-600'
        }`}
      >
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div
              className={`font-display text-lg font-bold mb-1 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              عائلة الصعيدي — البوابة الرسمية والبنية الرقمية (Elsaidy Family)
            </div>
            <p className="leading-relaxed">
              من قبيلة جهينة القضاعية · ينبع النخل · تيماء · حائل · الرياض · تبوك · بلاد الشام ·
              الإمارات · سلطنة عُمان
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="hover:text-[#C59B27] transition-colors cursor-pointer"
            >
              الرئيسية (elsaidy.org)
            </button>
            <button
              type="button"
              onClick={() => navigateTo('about')}
              className="hover:text-[#C59B27] transition-colors cursor-pointer"
            >
              التاريخ والأنساب (/about)
            </button>
            <button
              type="button"
              onClick={() => navigateTo('blog')}
              className="hover:text-[#C59B27] transition-colors cursor-pointer"
            >
              المدونة والمقالات (/blog)
            </button>
            <button
              type="button"
              onClick={() => navigateTo('projects')}
              className="hover:text-[#C59B27] transition-colors cursor-pointer"
            >
              البنية الرقمية (/projects)
            </button>
            <a
              href="https://blog.elsaidy.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C59B27] transition-colors font-mono"
            >
              blog.elsaidy.org ↗
            </a>
          </div>
        </div>

        <div
          className={`max-w-[1280px] mx-auto mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isDark ? 'border-slate-800/60' : 'border-slate-300/70'
          }`}
        >
          <div>
            © {new Date().getFullYear()} عائلة الصعيدي (Elsaidy Family). جميع الحقوق محفوظة.
          </div>
          <div className="font-mono text-[11px]">
            elsaidy.org · erp.elsaidy.org · mail.elsaidy.org · blog.elsaidy.org
          </div>
        </div>
      </footer>

      {/* Interactive Service Specifications Modal */}
      {inspectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setInspectedService(null)}
        >
          <div
            className={`w-full max-w-xl rounded-2xl border p-6 lg:p-8 ${
              isDark
                ? 'bg-[#0E1624] border-slate-700 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-700/40">
              <div>
                <div className="text-xs text-[#C59B27] font-mono">
                  {inspectedService.domain} · {inspectedService.categoryLabel}
                </div>
                <h3 className="font-display text-2xl font-bold mt-1">
                  {inspectedService.arabicTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedService(null)}
                className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <p
                className={
                  isDark ? 'text-slate-300 leading-relaxed' : 'text-slate-700 leading-relaxed'
                }
              >
                {inspectedService.description}
              </p>

              <div
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  isDark ? 'bg-[#090E17] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">النطاق المعتمد:</span>
                  <span className="font-mono text-[#C59B27]">{inspectedService.domain}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">بروتوكول الأمان:</span>
                  <span className="font-mono">{inspectedService.protocol}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">مستوى الصلاحية:</span>
                  <span>{inspectedService.accessLevel}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-400">المعمارية:</span>
                  <span>{inspectedService.architectureNote}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    const srvTitle = inspectedService.arabicTitle;
                    setInspectedService(null);
                    setFormData((prev) => ({
                      ...prev,
                      requestType: `طلب صلاحية: ${srvTitle}`
                    }));
                    document
                      .getElementById('contact-portal')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-medium cursor-pointer ${
                    isDark
                      ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                      : 'border-slate-300 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  طلب حساب أو صلاحية دخول
                </button>
                <a
                  href={inspectedService.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#C59B27] text-slate-950 text-xs font-semibold hover:bg-[#d4ab32] transition-colors flex items-center gap-1.5"
                >
                  <span>الانتقال إلى {inspectedService.domain}</span>
                  <ArrowUpLeft className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Full Article Reader Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className={`w-full max-w-3xl rounded-2xl border p-6 lg:p-10 my-8 ${
              isDark
                ? 'bg-[#0E1624] border-slate-700 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-5 mb-6 border-b border-slate-700/40">
              <div>
                <div className="text-xs text-[#C59B27] mb-1.5">
                  {activeArticle.categoryLabel} · {activeArticle.publishDate} ·{' '}
                  {activeArticle.readTime}
                </div>
                <h3 className="font-display text-2xl lg:text-3xl font-bold leading-snug">
                  {activeArticle.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer shrink-0"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 mb-8">
              <p
                className={`text-base lg:text-lg font-medium leading-[1.9] ${
                  isDark ? 'text-amber-100/90' : 'text-slate-900'
                }`}
              >
                {activeArticle.excerpt}
              </p>

              {activeArticle.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h4
                    className={`font-display text-xl font-bold ${
                      isDark ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {sec.heading}
                  </h4>
                  <p
                    className={`text-sm lg:text-base leading-[1.95] ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {sec.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-slate-700/40 text-xs">
              <div className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                <span>إعداد: {activeArticle.author}</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>{activeArticle.authorRole}</span>
              </div>
              <a
                href={activeArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#C59B27] text-slate-950 font-semibold hover:bg-[#d4ab32] transition-colors flex items-center gap-1.5"
              >
                <span>فتح في المدونة الرسمية (blog.elsaidy.org)</span>
                <ArrowUpLeft className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
