/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  GEOGRAPHICAL_PRESENCE,
  PageRoute,
  WhiteLabeledPortal,
  DiwanArticle
} from './data/familyData';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ArrowUpLeft, Check, Globe, Mail, Landmark, X } from 'lucide-react';

function getInitialRoute(): PageRoute {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path === '/about') return 'about';
  if (path === '/diwan' || path === '/blog') return 'diwan';
  if (path === '/portals' || path === '/projects') return 'portals';
  return 'home';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(getInitialRoute);
  const [activeBranchId, setActiveBranchId] = useState<string>(GEOGRAPHICAL_PRESENCE[0].id);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [inspectedPortal, setInspectedPortal] = useState<WhiteLabeledPortal | null>(null);
  const [activeArticle, setActiveArticle] = useState<DiwanArticle | null>(null);

  // Institutional Contact & Portal Access Form State
  const [formData, setFormData] = useState({
    fullName: '',
    branch: 'فرع محافظة تيماء (عبد الله بن عوض)',
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
      setFormError('يرجى كتابة تفاصيل الطلب أو المراسلة التوثيقية (10 أحرف على الأقل).');
      return;
    }
    setFormError('');
    setFormSubmitted(true);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#F9F8F6] text-[#18181B] selection:bg-[#8C6D32]/20 selection:text-[#18181B]"
    >
      {/* Formal Top Navigation Bar — Strict 3-Zone Contract */}
      <header
        id="top"
        className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 lg:px-12 py-4 bg-[#F9F8F6] border-b border-[#E2DFD7]"
      >
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('home');
          }}
          className="text-xl lg:text-2xl font-bold font-display tracking-tight text-[#18181B] whitespace-nowrap shrink-0"
        >
          الموقع الرسمي لعائلة الصعيدي
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="التنقل الرئيسي"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-700"
        >
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('home');
            }}
            className={`hover:text-[#8C6D32] transition-colors whitespace-nowrap shrink-0 ${
              currentRoute === 'home'
                ? 'text-[#8C6D32] underline underline-offset-8 font-semibold'
                : ''
            }`}
          >
            الصفحة الرئيسية
          </a>
          <a
            href="/about"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('about');
            }}
            className={`hover:text-[#8C6D32] transition-colors whitespace-nowrap shrink-0 ${
              currentRoute === 'about'
                ? 'text-[#8C6D32] underline underline-offset-8 font-semibold'
                : ''
            }`}
          >
            من نحن والتاريخ
          </a>
          <a
            href="/diwan"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('diwan');
            }}
            className={`hover:text-[#8C6D32] transition-colors whitespace-nowrap shrink-0 ${
              currentRoute === 'diwan'
                ? 'text-[#8C6D32] underline underline-offset-8 font-semibold'
                : ''
            }`}
          >
            الديوان والأخبار
          </a>
          <a
            href="/portals"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('portals');
            }}
            className={`hover:text-[#8C6D32] transition-colors whitespace-nowrap shrink-0 ${
              currentRoute === 'portals'
                ? 'text-[#8C6D32] underline underline-offset-8 font-semibold'
                : ''
            }`}
          >
            البوابات الرقمية والخدمات
          </a>
          <a
            href="#contact-portal"
            className="hover:text-[#8C6D32] transition-colors whitespace-nowrap shrink-0"
          >
            تواصل معنا
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => navigateTo('portals')}
            className="px-4 py-2 text-xs font-semibold bg-[#18181B] text-[#F9F8F6] hover:bg-[#8C6D32] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            البوابات الرقمية
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-[1280px] mx-auto px-6 lg:px-12">
        {/* Responsive Mobile Navigation Strip */}
        <div className="flex md:hidden items-center gap-1.5 pt-4 pb-2 overflow-x-auto text-xs border-b border-[#E2DFD7]">
          {[
            { id: 'home' as PageRoute, label: 'الصفحة الرئيسية' },
            { id: 'about' as PageRoute, label: 'من نحن والتاريخ' },
            { id: 'diwan' as PageRoute, label: 'الديوان والأخبار' },
            { id: 'portals' as PageRoute, label: 'البوابات الرقمية' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigateTo(item.id)}
              className={`px-3 py-1.5 border whitespace-nowrap shrink-0 ${
                currentRoute === item.id
                  ? 'bg-[#18181B] border-[#18181B] text-[#F9F8F6] font-semibold'
                  : 'bg-[#F3F1EC] border-[#E2DFD7] text-[#18181B]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Active Page View */}
        {currentRoute === 'home' && (
          <HomePage
            activeBranchId={activeBranchId}
            onSelectBranch={(id) => setActiveBranchId(id)}
            onNavigate={navigateTo}
            onInspectPortal={(portal) => setInspectedPortal(portal)}
            onReadArticle={(art) => setActiveArticle(art)}
          />
        )}

        {currentRoute === 'about' && (
          <AboutPage
            activeBranchId={activeBranchId}
            onSelectBranch={(id) => setActiveBranchId(id)}
            onNavigate={navigateTo}
            copiedKey={copiedKey}
            onCopy={handleCopy}
          />
        )}

        {currentRoute === 'diwan' && (
          <BlogPage
            onNavigate={navigateTo}
            onReadArticle={(art) => setActiveArticle(art)}
          />
        )}

        {currentRoute === 'portals' && (
          <ProjectsPage
            onNavigate={navigateTo}
            onInspectPortal={(portal) => setInspectedPortal(portal)}
            copiedKey={copiedKey}
            onCopy={handleCopy}
          />
        )}

        {/* Institutional Contact & Official Services Request Section */}
        <section
          id="contact-portal"
          className="py-16 lg:py-24 border-t border-[#E2DFD7] scroll-mt-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <div className="text-xs font-semibold text-[#8C6D32] mb-2">
                الأمانة العامة ولجنة التوثيق والتواصل
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#18181B] tracking-tight mb-4">
                المراسلات الرسمية وطلبات الحسابات والتوثيق
              </h2>
              <p className="text-sm lg:text-base text-zinc-700 leading-[1.85] mb-8">
                تستقبل الأمانة العامة للموقع الرسمي لعائلة الصعيدي طلبات إصدار البريد الرسمي (
                <span className="font-mono text-[#8C6D32]">@elsaidy.org</span>)، وطلبات الدخول إلى
                بوابة الإدارة والموارد المركزية، إضافةً إلى إيداع الوثائق والمشجرات التاريخية لدى
                الأرشيف الوثائقي.
              </p>

              <div className="p-6 bg-[#F3F1EC] border border-[#E2DFD7] space-y-4">
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-[#8C6D32] mt-1 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-[#8C6D32]">
                      النطاق الرسمي الموحد للعائلة
                    </div>
                    <div className="text-xs font-mono text-[#18181B] mt-0.5">
                      elsaidy.org · blog.elsaidy.org · mail.elsaidy.org
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#8C6D32] mt-1 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-[#8C6D32]">
                      نظام المراسلات والبريد الرسمي
                    </div>
                    <div className="text-xs font-mono text-[#18181B] mt-0.5">
                      info@elsaidy.org
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Landmark className="w-4 h-4 text-[#8C6D32] mt-1 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-[#8C6D32]">
                      منازل وحواضر العائلة الممثلة
                    </div>
                    <div className="text-xs text-zinc-700 mt-0.5 leading-relaxed">
                      ينبع النخل · محافظة تيماء · منطقة حائل (حي الزبارة) · مدينة الرياض · منطقة
                      تبوك · بلاد الشام (جبل العرب - أم ولد) · الإمارات (عجمان - مشرف والجرف) ·
                      سلطنة عُمان (الباطنة - الخابورة)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Validated Institutional Request Form */}
            <div className="lg:col-span-7 bg-[#F3F1EC] border border-[#E2DFD7] p-7 sm:p-10">
              {formSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 bg-[#18181B] text-[#F9F8F6] flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#18181B]">
                    تم قيد مراسلتكم بنجاح لدى الأمانة العامة للموقع الرسمي
                  </h3>
                  <p className="text-sm text-zinc-700 max-w-md mx-auto leading-relaxed">
                    شكراً لك <strong>{formData.fullName}</strong> ({formData.branch}). ستقوم اللجنة
                    المختصة بمراجعة طلبكم ({formData.requestType}) والتواصل معكم عبر{' '}
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
                    className="px-6 py-2.5 bg-[#18181B] text-[#F9F8F6] text-xs font-semibold hover:bg-[#8C6D32] transition-colors cursor-pointer"
                  >
                    إرسال مراسلة أخرى
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-xs font-semibold text-[#18181B] mb-2"
                      >
                        الاسم الكامل (الثلاثي أو الرباعي)
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="أدخل الاسم الكامل..."
                        className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-[#E2DFD7] text-[#18181B] outline-none focus:border-[#8C6D32]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="branch"
                        className="block text-xs font-semibold text-[#18181B] mb-2"
                      >
                        الفرع العائلي / الحاضرة
                      </label>
                      <select
                        id="branch"
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-[#E2DFD7] text-[#18181B] outline-none focus:border-[#8C6D32]"
                      >
                        <option value="الموطن الأول — ينبع النخل">الموطن الأول — ينبع النخل</option>
                        <option value="فرع محافظة تيماء (عبد الله بن عوض)">
                          فرع محافظة تيماء (عبد الله بن عوض)
                        </option>
                        <option value="فرع بلاد الشام — جبل العرب، أم ولد (سلامة بن عوض)">
                          فرع بلاد الشام — جبل العرب، أم ولد (سلامة بن عوض)
                        </option>
                        <option value="فرع منطقة حائل — حي الزبارة (إبراهيم بن عبد الله بن صالح)">
                          فرع منطقة حائل — حي الزبارة (إبراهيم بن عبد الله بن صالح)
                        </option>
                        <option value="فرع مدينة الرياض (ناصر وحمود بن عبد الله بن صالح)">
                          فرع مدينة الرياض (ناصر وحمود بن عبد الله بن صالح)
                        </option>
                        <option value="فرع الإمارات — عجمان، مشرف والجرف (علي بن عبد الله بن صالح)">
                          فرع الإمارات — عجمان، مشرف والجرف (علي بن عبد الله بن صالح)
                        </option>
                        <option value="فرع سلطنة عُمان — الباطنة، الخابورة (خليفة بن علي)">
                          فرع سلطنة عُمان — الباطنة، الخابورة (خليفة بن علي)
                        </option>
                        <option value="فرع منطقة تبوك">فرع منطقة تبوك</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-semibold text-[#18181B] mb-2"
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
                        className="w-full px-4 py-2.5 text-sm text-right font-mono bg-[#F9F8F6] border border-[#E2DFD7] text-[#18181B] outline-none focus:border-[#8C6D32]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="requestType"
                        className="block text-xs font-semibold text-[#18181B] mb-2"
                      >
                        موضوع الطلب أو المراسلة
                      </label>
                      <select
                        id="requestType"
                        value={formData.requestType}
                        onChange={(e) =>
                          setFormData({ ...formData, requestType: e.target.value })
                        }
                        className="w-full px-4 py-2.5 text-sm bg-[#F9F8F6] border border-[#E2DFD7] text-[#18181B] outline-none focus:border-[#8C6D32]"
                      >
                        <option value="طلب بريد رسمي (@elsaidy.org)">
                          طلب بريد رسمي (@elsaidy.org)
                        </option>
                        <option value="تصريح دخول: بوابة الإدارة والموارد المركزية">
                          تصريح دخول: بوابة الإدارة والموارد المركزية
                        </option>
                        <option value="إيداع وثيقة أو مخطوطة في الأرشيف الوثائقي">
                          إيداع وثيقة أو مخطوطة في الأرشيف الوثائقي
                        </option>
                        <option value="نشر دراسة أو خبر في ديوان العائلة">
                          نشر دراسة أو خبر في ديوان العائلة
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs font-semibold text-[#18181B] mb-2"
                    >
                      البيان التفصيلي للطلب أو الوثيقة
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="اكتب تفاصيل مراسلتك أو بيانات الفرع والوثيقة..."
                      className="w-full px-4 py-3 text-sm bg-[#F9F8F6] border border-[#E2DFD7] text-[#18181B] outline-none focus:border-[#8C6D32]"
                    />
                  </div>

                  {formError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-800">
                      {formError}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <span className="text-xs text-zinc-600">
                      تُحفظ جميع المراسلات والوثائق في السجل الرسمي للأمانة العامة.
                    </span>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#18181B] text-[#F9F8F6] text-xs font-semibold hover:bg-[#8C6D32] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      اعتماد وإرسال الطلب
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Formal Institutional Footer */}
      <footer className="border-t border-[#E2DFD7] bg-[#F3F1EC] py-12 px-6 lg:px-12 text-xs text-zinc-600">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="font-display text-xl font-bold text-[#18181B] mb-1">
              الموقع الرسمي لعائلة الصعيدي (elsaidy.org)
            </div>
            <p className="leading-relaxed text-zinc-700">
              الجد السابع إبراهيم الصعيدي · قبيلة جهينة · ينبع النخل · تيماء · حائل · الرياض · تبوك
              · جبل العرب (بلاد الشام) · الإمارات (عجمان) · سلطنة عُمان (الخابورة)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium text-[#18181B]">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="hover:text-[#8C6D32] transition-colors cursor-pointer"
            >
              الصفحة الرئيسية
            </button>
            <button
              type="button"
              onClick={() => navigateTo('about')}
              className="hover:text-[#8C6D32] transition-colors cursor-pointer"
            >
              من نحن والتاريخ
            </button>
            <button
              type="button"
              onClick={() => navigateTo('diwan')}
              className="hover:text-[#8C6D32] transition-colors cursor-pointer"
            >
              الديوان والأخبار
            </button>
            <button
              type="button"
              onClick={() => navigateTo('portals')}
              className="hover:text-[#8C6D32] transition-colors cursor-pointer"
            >
              البوابات الرقمية والخدمات
            </button>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto mt-8 pt-6 border-t border-[#E2DFD7] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} الموقع الرسمي لعائلة الصعيدي. جميع الحقوق محفوظة للأمانة
            العامة واللجنة التاريخية.
          </div>
          <div className="text-[11px] text-zinc-500">
            بوابة الإدارة والموارد المركزية · نظام المراسلات والبريد الرسمي · الأرشيف الوثائقي والمنصة المعرفية
          </div>
        </div>
      </footer>

      {/* White-Labeled Portal Inspection Modal */}
      {inspectedPortal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setInspectedPortal(null)}
        >
          <div
            className="w-full max-w-xl bg-[#F9F8F6] border border-[#E2DFD7] p-6 sm:p-8 text-[#18181B]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-[#E2DFD7]">
              <div>
                <div className="text-xs text-[#8C6D32] font-semibold">
                  {inspectedPortal.portalSubTitle} · {inspectedPortal.domain}
                </div>
                <h3 className="font-display text-2xl font-bold mt-1">
                  {inspectedPortal.officialName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedPortal(null)}
                className="p-1.5 border border-[#E2DFD7] hover:border-[#8C6D32] transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <p className="text-zinc-700 leading-[1.85]">{inspectedPortal.summary}</p>

              <div className="p-4 bg-[#F3F1EC] border border-[#E2DFD7] text-xs space-y-2">
                {inspectedPortal.operationalGuidelines.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between gap-2 pb-2 border-b border-[#E2DFD7] last:border-b-0 last:pb-0"
                  >
                    <span className="text-zinc-600">{item.label}:</span>
                    <span className="font-semibold text-[#18181B]">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    const pName = inspectedPortal.officialName;
                    setInspectedPortal(null);
                    setFormData((prev) => ({
                      ...prev,
                      requestType: `تصريح دخول: ${pName}`
                    }));
                    document
                      .getElementById('contact-portal')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2.5 bg-[#F3F1EC] border border-[#E2DFD7] text-[#18181B] text-xs font-semibold hover:border-[#8C6D32] cursor-pointer"
                >
                  طلب حساب أو تصريح دخول
                </button>

                <a
                  href={inspectedPortal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#18181B] text-[#F9F8F6] text-xs font-semibold hover:bg-[#8C6D32] transition-colors flex items-center gap-1.5"
                >
                  <span>الانتقال إلى البوابة</span>
                  <ArrowUpLeft className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="w-full max-w-3xl bg-[#F9F8F6] border border-[#E2DFD7] p-6 sm:p-10 my-8 text-[#18181B]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-5 mb-6 border-b border-[#E2DFD7]">
              <div>
                <div className="text-xs text-[#8C6D32] font-semibold mb-1.5">
                  {activeArticle.categoryLabel} · {activeArticle.hijriDate} ({activeArticle.publishDate})
                </div>
                <h3 className="font-display text-2xl lg:text-3xl font-bold leading-snug">
                  {activeArticle.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="p-1.5 border border-[#E2DFD7] hover:border-[#8C6D32] transition-colors cursor-pointer shrink-0"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6 mb-8">
              <p className="font-display text-lg lg:text-xl text-[#18181B] leading-[1.95] bg-[#F3F1EC] p-5 border border-[#E2DFD7]">
                {activeArticle.excerpt}
              </p>

              {activeArticle.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="font-display text-xl font-bold text-[#8C6D32]">
                    {sec.heading}
                  </h4>
                  <p className="text-base text-zinc-800 leading-[2.0] text-justify">
                    {sec.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-[#E2DFD7] text-xs text-zinc-600">
              <div>
                <span className="font-semibold text-[#18181B]">المصدر: {activeArticle.author}</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>{activeArticle.authorTitle}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 bg-[#18181B] text-[#F9F8F6] font-semibold hover:bg-[#8C6D32] transition-colors cursor-pointer"
              >
                إغلاق المطالعة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
