import React from 'react';
import { WHITE_LABELED_PORTALS, WhiteLabeledPortal, PageRoute } from '../data/familyData';
import {
  ArrowUpLeft,
  ArrowRight,
  Copy,
  Check,
  Lock,
  Building2,
  Mail
} from 'lucide-react';

interface ProjectsPageProps {
  onNavigate: (route: PageRoute) => void;
  onInspectPortal: (portal: WhiteLabeledPortal) => void;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
  onOpenCorporateInquiry: () => void;
  portals?: WhiteLabeledPortal[];
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  onNavigate,
  onInspectPortal,
  copiedKey,
  onCopy,
  onOpenCorporateInquiry,
  portals = WHITE_LABELED_PORTALS
}) => {
  return (
    <div className="space-y-14 lg:space-y-20 py-8 lg:py-12">
      {/* Institutional & Brand Hub Header */}
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
            <span className="font-bold text-[#0F291E]">
              الأنظمة الرقمية ومشاريع الصعيدي (ELSAIDY Brand, Ventures & Digital Portals)
            </span>
          </div>

          <div className="text-xs text-zinc-600">
            <span>النطاق الرسمي الموحد: </span>
            <span className="font-mono text-[#695022] font-bold">elsaidy.org</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#695022] mb-2">
              <Building2 className="w-4 h-4 text-[#0F291E]" />
              <span>مجموعة وبراند الصعيدي · ELSAIDY GROUP & DIGITAL INFRASTRUCTURE</span>
            </div>
            <h1
              className="font-extrabold text-[#141413] tracking-tight leading-[1.25] mb-4"
              style={{ fontSize: 'clamp(1.85rem, 3.5vw, 2.85rem)', textWrap: 'balance' }}
            >
              الأنظمة الرقمية ومشاريع الصعيدي (ELSAIDY Brand, Ventures & Digital Portals)
            </h1>
            <p className="text-sm sm:text-base text-zinc-700 leading-[1.85] max-w-[75ch]">
              الواجهة التنفيذية والمؤسسية لمجموعة وبراند الصعيدي: تجمع بين تطوير الأعمال والمشروعات
              الحديثة باسم العائلة، ومنظومات الإدارة المركزية، وخدمة البريد الرسمي الموثق (
              <span className="font-mono text-sm font-bold text-[#0F291E]">@elsaidy.org</span>)،
              والأرشيف الوثائقي، والخدمات السحابية والهندسية.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCorporateInquiry}
            className="px-6 py-3.5 rounded-xl bg-[#695022] text-white text-xs font-extrabold hover:bg-[#826631] shadow-md transition-all flex items-center gap-2 cursor-pointer self-start lg:self-end shrink-0"
          >
            <Mail className="w-4 h-4" />
            <span>طلب بريد رسمي باسم العائلة (@elsaidy.org) أو تواصل للأعمال والمشاريع</span>
          </button>
        </div>
      </section>

      {/* The 5 Official Brand Pillars & Digital Portals Grid */}
      <section>
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-[#695022] mb-1">
              الركائز المؤسسية الخمس المعتمدة · انقر على أي منظومة للدخول أو التوجيه المباشر
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141413]">
              مجموعة وبراند الصعيدي والمنظومات الرقمية المعتمدة
            </h2>
          </div>
          <span className="px-3.5 py-1.5 rounded-lg bg-[#0F291E]/10 text-xs text-[#0F291E] font-extrabold">
            حوكمة مؤسسية · تحقق موحد للهوية (100%)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {portals.map((portal, idx) => (
            <div
              key={portal.id}
              onClick={() => onInspectPortal(portal)}
              className={`rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] bg-white p-6 sm:p-9 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between cursor-pointer group ${
                idx === 0 ? 'lg:col-span-2 bg-gradient-to-br from-white to-[#F7F6F2]' : ''
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-4 mb-5 border-b border-[#E6E2D8]">
                  <span className="font-extrabold text-[#695022]">
                    الركيزة {portal.index} · {portal.accessClassification}
                  </span>
                  <span className="font-mono text-xs px-3 py-1 rounded-md bg-[#F7F6F2] border border-[#E6E2D8] text-[#0F291E] font-bold">
                    {portal.domain}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-[#141413] mb-2 leading-snug">
                  {portal.officialName}
                </h3>

                <div className="text-xs sm:text-sm font-bold text-[#0F291E] mb-4">
                  {portal.portalSubTitle}
                </div>

                <p className="text-sm text-zinc-700 leading-[1.9] mb-6 text-justify">
                  {portal.summary}
                </p>

                {portal.departments && portal.departments.length > 0 && (
                  <div className="mb-6">
                    <div className="text-xs font-extrabold text-[#141413] mb-3">
                      الاختصاصات والوحدات التابعة للمنظومة:
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-zinc-700">
                      {portal.departments.map((dep, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2">
                          <span className="text-[#695022] font-extrabold">·</span>
                          <span>{dep}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Operational Specifications Box */}
                {portal.operationalGuidelines && portal.operationalGuidelines.length > 0 && (
                  <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] space-y-2.5 text-xs mb-6">
                    {portal.operationalGuidelines.map((spec, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E6E2D8] last:border-b-0 last:pb-0"
                      >
                        <span className="text-zinc-600 font-medium">{spec.label}:</span>
                        <span className="font-bold text-[#141413]">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                className="pt-4 border-t border-[#E6E2D8] flex flex-wrap items-center justify-between gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onInspectPortal(portal)}
                    className="px-5 py-2.5 rounded-xl bg-[#0F291E] text-white text-xs font-bold hover:bg-[#141E28] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>تسجيل الدخول / التوجيه للبوابة</span>
                    <ArrowUpLeft className="w-3.5 h-3.5 text-[#C5A059]" />
                  </button>

                  {portal.url && (
                    <a
                      href={portal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2.5 rounded-xl bg-[#695022]/10 border border-[#695022]/30 text-[#695022] hover:bg-[#695022] hover:text-white transition-colors text-xs font-bold flex items-center gap-1"
                    >
                      <span>رابط مباشر</span>
                      <ArrowUpLeft className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onCopy(portal.domain, `portal-copy-${portal.id}`)}
                  title="نسخ النطاق"
                  className="px-3.5 py-2 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-xs font-mono font-bold text-zinc-700 hover:border-[#695022] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{portal.domain}</span>
                  {copiedKey === `portal-copy-${portal.id}` ? (
                    <Check className="w-3.5 h-3.5 text-[#0F291E]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-[#695022]" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Corporate & Official Email Request Banner */}
      <section>
        <div className="rounded-2xl bg-gradient-to-br from-[#0F291E] via-[#112323] to-[#141E28] text-white border border-[#695022]/40 p-7 sm:p-10 lg:p-12 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <div className="text-xs font-bold text-[#C5A059] mb-2">
              خدمات الهوية الرقمية والأعمال · ELSAIDY BRAND & CORPORATE HUB
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              إصدار البريد الرسمي (@elsaidy.org) والتواصل للمشروعات والأعمال
            </h3>
            <p className="text-sm text-zinc-200 leading-[1.85]">
              تتيح مجموعة الصعيدي وأمانة البوابة الرسمية لأبناء وأعلام العائلة في مصر والسعودية
              والشام والخليج والمغرب العربي الحصول على حساب بريد إلكتروني رسمي موثق حاملاً اسم
              العائلة (<span className="font-mono text-[#C5A059]">@elsaidy.org</span>)، كما تستقبل
              طلبات الشراكات وتطوير المشروعات ضمن مظلة براند الصعيدي للأعمال والحلول المتكاملة.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={onOpenCorporateInquiry}
              className="w-full py-3.5 px-5 rounded-xl bg-[#C5A059] text-[#0D131A] text-xs font-extrabold hover:bg-[#d4b26e] transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>طلب بريد رسمي (@elsaidy.org) أو تواصل للأعمال</span>
              <ArrowUpLeft className="w-4 h-4" />
            </button>
            {portals.length > 0 && (
              <button
                type="button"
                onClick={() => onInspectPortal(portals[1] || portals[0])}
                className="w-full py-3 px-5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold hover:bg-white/20 transition-colors text-center cursor-pointer"
              >
                الدخول إلى منظومة الإدارة المركزية
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
