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
import { FamilyTreePage } from './pages/FamilyTreePage';
import { BlogPage } from './pages/BlogPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ArrowUpLeft, Lock, X, Check } from 'lucide-react';

function getInitialRoute(): PageRoute {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path === '/about') return 'about';
  if (path === '/tree') return 'tree';
  if (path === '/diwan' || path === '/blog') return 'diwan';
  if (path === '/portals' || path === '/projects') return 'portals';
  return 'home';
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(getInitialRoute);
  const [activeBranchId, setActiveBranchId] = useState<string>(GEOGRAPHICAL_PRESENCE[0].id);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [inspectedPortal, setInspectedPortal] = useState<WhiteLabeledPortal | null>(null);
  const [activeArticleModal, setActiveArticleModal] = useState<DiwanArticle | null>(null);

  // Formal Portal Login / Redirect Modal State
  const [loginIdentifier, setLoginIdentifier] = useState<string>('');
  const [loginPasscode, setLoginPasscode] = useState<string>('');
  const [loginStatus, setLoginStatus] = useState<string>('');

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
      // Fallback in restricted iframe environments
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

  const handleOpenPortalModal = (portal: WhiteLabeledPortal) => {
    setLoginStatus('');
    setInspectedPortal(portal);
  };

  const handlePortalLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginIdentifier.includes('@')) {
      setLoginStatus('يرجى إدخال المعرّف الرسمي المعتمد (@elsaidy.org) بشكل صحيح.');
      return;
    }
    if (!loginPasscode.trim() || loginPasscode.trim().length < 4) {
      setLoginStatus('يرجى إدخال رمز التحقق أو كلمة المرور المؤسسية.');
      return;
    }
    setLoginStatus(
      `تم التحقق من بيانات المعرّف (${loginIdentifier}). جاري التوجيه الآمن إلى «${inspectedPortal?.officialName}» (${inspectedPortal?.domain})...`
    );
  };

  const navItems: { id: PageRoute; label: string; path: string }[] = [
    { id: 'home', label: 'الرئيسية', path: '/' },
    { id: 'about', label: 'من نحن والتاريخ', path: '/about' },
    { id: 'tree', label: 'شجرة وفروع العائلة', path: '/tree' },
    { id: 'diwan', label: 'الديوان والمقالات', path: '/diwan' },
    { id: 'portals', label: 'البوابات والأنظمة الرقمية', path: '/portals' }
  ];

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col justify-between bg-[#F8F7F4] text-[#141413] selection:bg-[#8C6D32]/20 selection:text-[#141413]"
    >
      <div>
        {/* Official Top Institutional Header — Strict 3-Zone Contract */}
        <header
          id="top"
          className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 lg:px-12 py-4 bg-[#F8F7F4] border-b border-[#DCD9D0]"
        >
          {/* Zone 1: Single text element wordmark */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('home');
            }}
            className="text-xl lg:text-2xl font-bold font-display tracking-tight text-[#141413] whitespace-nowrap shrink-0"
          >
            الموقع الرسمي لعائلة الصعيدي
          </a>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav
            aria-label="التنقل الرئيسي"
            className="hidden lg:flex items-center gap-7 text-sm font-medium text-zinc-700"
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(item.id);
                }}
                className={`hover:text-[#8C6D32] transition-colors whitespace-nowrap shrink-0 ${
                  currentRoute === item.id
                    ? 'text-[#1B3B2B] underline underline-offset-8 font-bold'
                    : ''
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigateTo('portals')}
              className="px-4 py-2 text-xs font-semibold bg-[#1B3B2B] text-[#F8F7F4] hover:bg-[#141413] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              البوابات الرقمية
            </button>
          </div>
        </header>

        {/* Institutional Operational & Hijri/Gregorian Date Ribbon */}
        <div className="bg-[#F1EFEA] border-b border-[#DCD9D0] px-6 lg:px-12 py-2.5">
          <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-600">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-[#1B3B2B]">الأمانة العامة والتوثيق التاريخي</span>
              <span aria-hidden="true">·</span>
              <span>الأربعاء ٩ ربيع الآخر ١٤٤٨ هـ الموافق ٢٠ أكتوبر ٢٠٢٦ م</span>
            </div>
            <div className="flex items-center gap-2">
              <span>النسب: قبيلة جهينة (ينبع النخل)</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[11px] text-[#8C6D32]">elsaidy.org</span>
            </div>
          </div>
        </div>

        {/* Responsive Mobile / Tablet Navigation Bar */}
        <div className="lg:hidden bg-[#F8F7F4] border-b border-[#DCD9D0] px-6 py-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateTo(item.id)}
                className={`px-3 py-1.5 border whitespace-nowrap shrink-0 cursor-pointer ${
                  currentRoute === item.id
                    ? 'bg-[#1B3B2B] border-[#1B3B2B] text-[#F8F7F4] font-semibold'
                    : 'bg-[#F1EFEA] border-[#DCD9D0] text-[#141413]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Standalone Page Container */}
        <main className="max-w-[1280px] mx-auto px-6 lg:px-12">
          {currentRoute === 'home' && (
            <HomePage
              activeBranchId={activeBranchId}
              onSelectBranch={(id) => setActiveBranchId(id)}
              onNavigate={navigateTo}
              onInspectPortal={handleOpenPortalModal}
              onReadArticle={(art) => setActiveArticleModal(art)}
            />
          )}

          {currentRoute === 'about' && (
            <AboutPage
              onNavigate={navigateTo}
              copiedKey={copiedKey}
              onCopy={handleCopy}
            />
          )}

          {currentRoute === 'tree' && (
            <FamilyTreePage onNavigate={navigateTo} />
          )}

          {currentRoute === 'diwan' && (
            <BlogPage onNavigate={navigateTo} />
          )}

          {currentRoute === 'portals' && (
            <ProjectsPage
              onNavigate={navigateTo}
              onInspectPortal={handleOpenPortalModal}
              copiedKey={copiedKey}
              onCopy={handleCopy}
            />
          )}
        </main>
      </div>

      {/* Formal Institutional Footer Across All Pages */}
      <footer className="border-t border-[#DCD9D0] bg-[#F1EFEA] py-12 px-6 lg:px-12 text-xs text-zinc-600 mt-12">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="font-display text-xl font-bold text-[#141413] mb-1">
              الموقع الرسمي لعائلة الصعيدي - elsaidy.org
            </div>
            <p className="leading-relaxed text-zinc-700">
              الجد السابع إبراهيم الصعيدي · قبيلة جهينة · ينبع النخل · تيماء · حائل (حي الزبارة) ·
              الرياض · تبوك · بلاد الشام (جبل العرب - أم ولد) · الإمارات (عجمان - مشرف والجرف) ·
              سلطنة عمان (الباطنة - الخابورة)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 font-medium text-[#141413]">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateTo(item.id)}
                className={`hover:text-[#8C6D32] transition-colors cursor-pointer ${
                  currentRoute === item.id ? 'text-[#8C6D32] font-bold' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto mt-8 pt-6 border-t border-[#DCD9D0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} الموقع الرسمي لعائلة الصعيدي - elsaidy.org. جميع الحقوق
            محفوظة للأمانة العامة ولجنة التوثيق التاريخي.
          </div>
          <div className="text-[11px] text-zinc-500">
            منظومة الإدارة والموارد المركزية · نظام البريد والمراسلات الرسمية · الأرشيف الوثائقي والمنصة المعرفية · بوابة الخدمات التقنية والسحابية
          </div>
        </div>
      </footer>

      {/* Formal Login / Redirect Modal for Official Digital Portals */}
      {inspectedPortal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65"
          onClick={() => setInspectedPortal(null)}
        >
          <div
            className="w-full max-w-xl bg-[#F8F7F4] border border-[#DCD9D0] p-6 sm:p-8 text-[#141413]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-[#DCD9D0]">
              <div>
                <div className="text-xs text-[#8C6D32] font-semibold">
                  بوابة الدخول والتوجيه الرسمي · {inspectedPortal.domain}
                </div>
                <h3 className="font-display text-2xl font-bold text-[#141413] mt-1">
                  {inspectedPortal.officialName}
                </h3>
                <div className="text-xs text-[#1B3B2B] font-medium mt-0.5">
                  {inspectedPortal.portalSubTitle}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectedPortal(null)}
                className="p-1.5 border border-[#DCD9D0] hover:border-[#8C6D32] transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePortalLoginSubmit} className="space-y-4" noValidate>
              <p className="text-xs text-zinc-700 leading-relaxed">
                {inspectedPortal.summary}
              </p>

              <div className="p-4 bg-[#F1EFEA] border border-[#DCD9D0] space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                    المعرّف الرسمي أو البريد المعتمد (@elsaidy.org):
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="user@elsaidy.org"
                    className="w-full px-3.5 py-2 text-sm text-right font-mono bg-[#F8F7F4] border border-[#DCD9D0] text-[#141413] outline-none focus:border-[#8C6D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                    رمز التحقق أو كلمة المرور المؤسسية:
                  </label>
                  <input
                    type="password"
                    dir="ltr"
                    value={loginPasscode}
                    onChange={(e) => setLoginPasscode(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 text-sm text-right font-mono bg-[#F8F7F4] border border-[#DCD9D0] text-[#141413] outline-none focus:border-[#8C6D32]"
                  />
                </div>
              </div>

              {loginStatus && (
                <div className="p-3.5 bg-[#F1EFEA] border border-[#8C6D32] text-xs text-[#141413] leading-relaxed">
                  {loginStatus}
                </div>
              )}

              <div className="pt-3 border-t border-[#DCD9D0] flex flex-wrap items-center justify-between gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1B3B2B] text-[#F8F7F4] text-xs font-semibold hover:bg-[#141413] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>التحقق وتسجيل الدخول</span>
                </button>

                <a
                  href={inspectedPortal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#141413] text-[#F8F7F4] text-xs font-semibold hover:bg-[#8C6D32] transition-colors flex items-center gap-1.5"
                >
                  <span>التوجيه المباشر ({inspectedPortal.domain})</span>
                  <ArrowUpLeft className="w-3.5 h-3.5" />
                </a>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Article Reader Modal (Triggered from HomePage previews) */}
      {activeArticleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 overflow-y-auto"
          onClick={() => setActiveArticleModal(null)}
        >
          <div
            className="w-full max-w-3xl bg-[#F8F7F4] border border-[#DCD9D0] p-6 sm:p-10 my-8 text-[#141413]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-5 mb-6 border-b border-[#DCD9D0]">
              <div>
                <div className="text-xs text-[#8C6D32] font-semibold mb-1.5">
                  {activeArticleModal.categoryLabel} · {activeArticleModal.hijriDate} (
                  {activeArticleModal.publishDate})
                </div>
                <h3 className="font-display text-2xl lg:text-3xl font-bold leading-snug">
                  {activeArticleModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticleModal(null)}
                className="p-1.5 border border-[#DCD9D0] hover:border-[#8C6D32] transition-colors cursor-pointer shrink-0"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6 mb-8">
              <p className="font-display text-lg lg:text-xl text-[#141413] leading-[1.95] bg-[#F1EFEA] p-5 border border-[#DCD9D0]">
                {activeArticleModal.excerpt}
              </p>

              {activeArticleModal.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="font-display text-xl font-bold text-[#1B3B2B]">
                    {sec.heading}
                  </h4>
                  <p className="text-base text-zinc-800 leading-[2.0] text-justify">
                    {sec.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-[#DCD9D0] text-xs text-zinc-600">
              <div>
                <span className="font-semibold text-[#141413]">
                  المصدر: {activeArticleModal.author}
                </span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>{activeArticleModal.authorTitle}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticleModal(null)}
                className="px-5 py-2 bg-[#141413] text-[#F8F7F4] font-semibold hover:bg-[#1B3B2B] transition-colors cursor-pointer"
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
