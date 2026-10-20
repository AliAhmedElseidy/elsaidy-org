import React from 'react';
import { WHITE_LABELED_PORTALS, WhiteLabeledPortal, PageRoute } from '../data/familyData';
import {
  ArrowUpLeft,
  ArrowRight,
  Copy,
  Check,
  Lock,
  Shield
} from 'lucide-react';

interface ProjectsPageProps {
  onNavigate: (route: PageRoute) => void;
  onInspectPortal: (portal: WhiteLabeledPortal) => void;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  onNavigate,
  onInspectPortal,
  copiedKey,
  onCopy
}) => {
  return (
    <div>
      {/* Institutional Header */}
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
            <span className="font-semibold text-[#1B3B2B]">البوابات والأنظمة الرقمية</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-zinc-500">الدليل التنفيذي للأنظمة الرسمية</span>
          </div>

          <div className="text-xs text-zinc-600">
            <span>النطاق الرسمي الموحد: </span>
            <span className="font-mono text-[#8C6D32] font-semibold">elsaidy.org</span>
          </div>
        </div>

        <div className="max-w-4xl">
          <div className="text-xs font-semibold text-[#8C6D32] mb-2">
            الأمانة العامة للموقع الرسمي · منظومة الخدمات الرقمية المعتمدة
          </div>
          <h1
            className="font-display font-bold text-[#141413] tracking-tight leading-[1.2] mb-4"
            style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', textWrap: 'balance' }}
          >
            البوابات والأنظمة الرقمية — منظومات الإدارة، البريد الرسمي، والأرشيف الوثائقي
          </h1>
          <p className="text-base text-zinc-700 leading-[1.85] max-w-[72ch]">
            بوابة الوصول التنفيذية المخصصة للأعضاء المخولين، اللجان الإدارية والتاريخية، وأبناء
            عائلة الصعيدي للدخول الموحد إلى الأنظمة الرسمية الأربعة المعتمدة تحت نطاق{' '}
            <span className="font-mono text-sm">elsaidy.org</span>.
          </p>
        </div>
      </section>

      {/* The 4 Official Digital Portals Grid */}
      <section className="py-14 lg:py-20 border-b border-[#DCD9D0]">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-[#8C6D32] mb-1">
              الدليل الرسمي · انقر على أي بوابة لفتح نافذة الدخول والتوجيه المباشر
            </div>
            <h2 className="font-display text-3xl font-bold text-[#141413]">
              المنظومات والبوابات الرقمية الأربع المعتمدة
            </h2>
          </div>
          <span className="text-xs text-[#1B3B2B] font-semibold">
            حماية مؤسسية · تحقق موحد للهوية
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-r border-[#DCD9D0]">
          {WHITE_LABELED_PORTALS.map((portal) => (
            <div
              key={portal.id}
              onClick={() => onInspectPortal(portal)}
              className="p-7 sm:p-9 border-b border-l border-[#DCD9D0] bg-[#F8F7F4] hover:bg-[#F1EFEA]/70 transition-colors flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs pb-3 mb-4 border-b border-[#DCD9D0]">
                  <span className="font-semibold text-[#8C6D32]">
                    المنظومة {portal.index} · {portal.accessClassification}
                  </span>
                  <span className="font-mono text-[11px] text-zinc-500">{portal.domain}</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#141413] mb-1.5">
                  {portal.officialName}
                </h3>

                <div className="text-xs font-semibold text-[#1B3B2B] mb-4">
                  {portal.portalSubTitle}
                </div>

                <p className="text-sm text-zinc-700 leading-[1.85] mb-6">
                  {portal.summary}
                </p>

                <div className="mb-6">
                  <div className="text-xs font-semibold text-[#141413] mb-2.5">
                    الاختصاصات والوحدات التابعة للمنظومة:
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-700">
                    {portal.departments.map((dep, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#8C6D32] font-bold">·</span>
                        <span>{dep}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Operational Specifications Box */}
                <div className="p-4 bg-[#F1EFEA] border border-[#DCD9D0] space-y-2 text-xs mb-6">
                  {portal.operationalGuidelines.map((spec, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-center justify-between gap-2 pb-2 border-b border-[#DCD9D0] last:border-b-0 last:pb-0"
                    >
                      <span className="text-zinc-600">{spec.label}:</span>
                      <span className="font-medium text-[#141413]">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="pt-4 border-t border-[#DCD9D0] flex flex-wrap items-center justify-between gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => onInspectPortal(portal)}
                  className="px-5 py-2.5 bg-[#1B3B2B] text-[#F8F7F4] text-xs font-semibold hover:bg-[#141413] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>تسجيل الدخول / التوجيه للبوابة</span>
                  <ArrowUpLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onCopy(portal.domain, `portal-copy-${portal.id}`)}
                  title="نسخ النطاق"
                  className="px-3 py-2 bg-[#F1EFEA] border border-[#DCD9D0] text-xs font-mono text-zinc-700 hover:border-[#8C6D32] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{portal.domain}</span>
                  {copiedKey === `portal-copy-${portal.id}` ? (
                    <Check className="w-3.5 h-3.5 text-[#1B3B2B]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-[#8C6D32]" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Governance & Security Notice */}
      <section className="py-12 lg:py-16">
        <div className="bg-[#F1EFEA] border border-[#DCD9D0] p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <div className="text-xs font-semibold text-[#8C6D32] mb-2">
              ضوابط الحوكمة الرقمية وحماية الخصوصية
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#141413] mb-3">
              إرشادات استخدام البوابات الرقمية الرسمية لعائلة الصعيدي
            </h3>
            <p className="text-sm text-zinc-700 leading-[1.85]">
              تخضع كافة المنظومات الرقمية لإشراف الأمانة العامة للموقع الرسمي لعائلة الصعيدي؛ حيث
              يُشترط للوصول إلى منظومة الإدارة والموارد المركزية وبوابة الخدمات التقنية والسحابية
              امتلاك تصريح دخول ساري المفعول، بينما تُتاح خدمات البريد الرسمي (
              <span className="font-mono">@elsaidy.org</span>) والأرشيف الوثائقي لأبناء العائلة
              المسجلين في فروع ينبع النخل وتيماء وحائل والرياض وتبوك وجبل العرب والإمارات وسلطنة
              عُمان.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => onInspectPortal(WHITE_LABELED_PORTALS[0])}
              className="w-full py-3 px-5 bg-[#141413] text-[#F8F7F4] text-xs font-semibold hover:bg-[#1B3B2B] transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>فتح نافذة الدخول الموحد للأنظمة</span>
              <ArrowUpLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('tree')}
              className="w-full py-3 px-5 bg-[#F8F7F4] border border-[#DCD9D0] text-[#141413] text-xs font-semibold hover:border-[#8C6D32] transition-colors text-center cursor-pointer"
            >
              العودة إلى وثيقة شجرة العائلة
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
