import React, { useState } from 'react';
import { WHITE_LABELED_PORTALS, WhiteLabeledPortal, PageRoute } from '../data/familyData';
import {
  ArrowUpLeft,
  ArrowRight,
  Copy,
  Check,
  Lock,
  Mail,
  Landmark,
  BookOpen,
  ShieldCheck
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
  const [selectedPortalId, setSelectedPortalId] = useState<string>(WHITE_LABELED_PORTALS[0].id);
  const [memberEmail, setMemberEmail] = useState<string>('');
  const [memberBranch, setMemberBranch] = useState<string>('فرع محافظة تيماء (عبد الله بن عوض)');
  const [authNotice, setAuthNotice] = useState<string>('');

  const selectedPortal =
    WHITE_LABELED_PORTALS.find((p) => p.id === selectedPortalId) || WHITE_LABELED_PORTALS[0];

  const handlePortalRedirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberEmail.trim() || !memberEmail.includes('@')) {
      setAuthNotice('يرجى إدخال المعرّف الرسمي (@elsaidy.org) أو البريد المسجل للمتابعة.');
      return;
    }
    setAuthNotice(
      `تم التحقق من النطاق المبدئي لـ (${memberEmail}) ضمن (${memberBranch}). يمكنك الآن المتابعة عبر الرابط المباشر لـ «${selectedPortal.officialName}» أو استكمال طلب التفعيل من نموذج الأمانة العامة أدناه.`
    );
  };

  return (
    <div>
      {/* Institutional Header */}
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
            <span className="font-semibold text-[#8C6D32]">البوابات الرقمية والخدمات</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-zinc-500">elsaidy.org/portals</span>
          </div>

          <div className="text-xs text-zinc-600">
            <span>النطاق الرسمي الموحد: </span>
            <span className="font-mono text-[#8C6D32] font-semibold">@elsaidy.org</span>
          </div>
        </div>

        <div className="max-w-4xl">
          <div className="text-xs font-semibold text-[#8C6D32] mb-2">
            دليل الخدمات الرقمية المعتمدة · الأمانة العامة لعائلة الصعيدي
          </div>
          <h1
            className="font-display font-bold text-[#18181B] tracking-tight leading-[1.2] mb-4"
            style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', textWrap: 'balance' }}
          >
            البوابات الرقمية والخدمات — الإدارة المركزية، البريد الرسمي، والأرشيف الوثائقي
          </h1>
          <p className="text-base text-zinc-700 leading-[1.8] max-w-[70ch]">
            بوابة الوصول الموحد المخصصة لأفراد عائلة الصعيدي واللجان التنظيمية والتاريخية للدخول إلى
            الأنظمة الإدارية المركزية، نظام المراسلات والبريد الرسمي (
            <span className="font-mono text-sm">@elsaidy.org</span>)، والمكتبة الوثائقية الرقمية.
          </p>
        </div>
      </section>

      {/* Main 3 White-Labeled Portals Directory */}
      <section className="py-14 lg:py-20 border-b border-[#E2DFD7]">
        <div className="mb-8">
          <div className="text-xs font-semibold text-[#8C6D32] mb-1">
            ٠١ · المنظومات الرسمية الثلاث
          </div>
          <h2 className="font-display text-3xl font-bold text-[#18181B]">
            دليل البوابات الرقمية المعتمدة لعائلة الصعيدي
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 border-t border-r border-[#E2DFD7]">
          {WHITE_LABELED_PORTALS.map((portal) => (
            <div
              key={portal.id}
              className="p-7 lg:p-8 border-b border-l border-[#E2DFD7] bg-[#F9F8F6] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs pb-3 mb-4 border-b border-[#E2DFD7]">
                  <span className="font-semibold text-[#8C6D32]">
                    البوابة {portal.index} · {portal.portalSubTitle}
                  </span>
                  <span className="font-mono text-[11px] text-zinc-500">{portal.domain}</span>
                </div>

                <h3 className="font-display text-2xl lg:text-3xl font-bold text-[#18181B] mb-1">
                  {portal.officialName}
                </h3>

                <div className="text-xs font-mono text-zinc-500 mb-4">
                  {portal.englishSubtitle}
                </div>

                <p className="text-sm text-zinc-700 leading-[1.85] mb-6">
                  {portal.summary}
                </p>

                <div className="mb-6">
                  <div className="text-xs font-semibold text-[#18181B] mb-2.5">
                    الأقسام والاختصاصات المعتمدة:
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

                {/* Operational Specifications Grid */}
                <div className="p-4 bg-[#F3F1EC] border border-[#E2DFD7] space-y-2.5 text-xs mb-6">
                  {portal.operationalGuidelines.map((spec, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-center justify-between gap-2 pb-2 border-b border-[#E2DFD7] last:border-b-0 last:pb-0"
                    >
                      <span className="text-zinc-600">{spec.label}:</span>
                      <span className="font-medium text-[#18181B]">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2DFD7] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-[#18181B] text-[#F9F8F6] text-xs font-semibold hover:bg-[#8C6D32] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <span>الانتقال إلى البوابة</span>
                    <ArrowUpLeft className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => onInspectPortal(portal)}
                    className="px-3.5 py-2.5 bg-[#F3F1EC] border border-[#E2DFD7] text-[#18181B] text-xs font-medium hover:border-[#8C6D32] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    بطاقة الصلاحيات
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onCopy(portal.domain, `portal-copy-${portal.id}`)}
                  title="نسخ النطاق"
                  className="p-2 bg-[#F3F1EC] border border-[#E2DFD7] text-zinc-700 hover:border-[#8C6D32] transition-colors cursor-pointer"
                >
                  {copiedKey === `portal-copy-${portal.id}` ? (
                    <Check className="w-3.5 h-3.5 text-[#8C6D32]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Corporate Login / Redirect Directory Panel (بوابة التوجيه والتحقق لأفراد العائلة) */}
      <section className="py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <div className="text-xs font-semibold text-[#8C6D32] mb-2">
              ٠٢ · التوجيه المباشر والتحقق من العضوية
            </div>
            <h2 className="font-display text-3xl font-bold text-[#18181B] mb-4">
              بوابة الدخول الموحد للمخولين وأفراد العائلة
            </h2>
            <p className="text-sm text-zinc-700 leading-[1.85] mb-6">
              للوصول المباشر إلى إحدى البوابات الثلاث، اختر المنظومة المطلوبة وأدخل عنوان بريدك
              الرسمي المعتمد على نطاق العائلة (<span className="font-mono">@elsaidy.org</span>). وفي
              حال عدم امتلاكك لحساب مفعّل، يمكنك تقديم طلب إصدار حساب رسمي من قسم التواصل أدناه.
            </p>

            <div className="p-6 bg-[#F3F1EC] border border-[#E2DFD7] space-y-3 text-xs text-zinc-700">
              <div className="font-semibold text-[#18181B] pb-2 border-b border-[#E2DFD7]">
                ضوابط الاستخدام والأمان المؤسسي:
              </div>
              <div>· يقتصر الدخول لبوابة الإدارة والأعمال المركزية على الأعضاء المخولين ولجان الفروع.</div>
              <div>· تُمنح عناوين البريد الرسمي (@elsaidy.org) لأبناء العائلة بعد توثيق الفرع العائلي.</div>
              <div>· الأرشيف الوثائقي والمكتبة الرقمية متاحة للباحثين وأبناء العائلة للاطلاع والتوثيق.</div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#F9F8F6] border border-[#E2DFD7] p-7 sm:p-10">
            <div className="flex items-center justify-between gap-2 pb-4 mb-6 border-b border-[#E2DFD7]">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#8C6D32]" />
                <h3 className="font-display text-2xl font-bold text-[#18181B]">
                  نموذج التوجيه السريع للبوابات الرقمية
                </h3>
              </div>
              <span className="font-mono text-xs text-[#8C6D32]">SSO DIRECTORY</span>
            </div>

            <form onSubmit={handlePortalRedirectSubmit} className="space-y-5" noValidate>
              <div>
                <label className="block text-xs font-semibold text-[#18181B] mb-2">
                  ١. اختر البوابة الرقمية المراد التوجه إليها:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {WHITE_LABELED_PORTALS.map((portal) => {
                    const active = portal.id === selectedPortalId;
                    return (
                      <button
                        key={portal.id}
                        type="button"
                        onClick={() => {
                          setSelectedPortalId(portal.id);
                          setAuthNotice('');
                        }}
                        className={`p-3.5 border text-right transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#18181B] text-[#F9F8F6] border-[#18181B]'
                            : 'bg-[#F3F1EC] text-[#18181B] border-[#E2DFD7] hover:border-[#8C6D32]'
                        }`}
                      >
                        <div
                          className={`text-[11px] font-mono mb-1 ${
                            active ? 'text-[#D6C295]' : 'text-[#8C6D32]'
                          }`}
                        >
                          {portal.domain}
                        </div>
                        <div className="text-xs font-bold leading-snug">{portal.portalSubTitle}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-2">
                    ٢. البريد الرسمي أو المعرّف (@elsaidy.org):
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="member@elsaidy.org"
                    className="w-full px-4 py-2.5 text-sm text-right font-mono bg-[#F3F1EC] border border-[#E2DFD7] text-[#18181B] outline-none focus:border-[#8C6D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18181B] mb-2">
                    ٣. الفرع العائلي المعتمد:
                  </label>
                  <select
                    value={memberBranch}
                    onChange={(e) => setMemberBranch(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-[#F3F1EC] border border-[#E2DFD7] text-[#18181B] outline-none focus:border-[#8C6D32]"
                  >
                    <option value="الموطن الأول — ينبع النخل">الموطن الأول — ينبع النخل</option>
                    <option value="فرع محافظة تيماء (عبد الله بن عوض)">
                      فرع محافظة تيماء (عبد الله بن عوض)
                    </option>
                    <option value="فرع بلاد الشام — جبل العرب، قرية أم ولد (سلامة بن عوض)">
                      فرع بلاد الشام — جبل العرب، قرية أم ولد (سلامة بن عوض)
                    </option>
                    <option value="فرع حائل — حي الزبارة (إبراهيم بن عبد الله بن صالح)">
                      فرع حائل — حي الزبارة (إبراهيم بن عبد الله بن صالح)
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

              {authNotice && (
                <div className="p-4 bg-[#F3F1EC] border border-[#8C6D32] text-xs text-[#18181B] leading-relaxed">
                  {authNotice}
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <a
                  href="#contact-portal"
                  className="text-xs font-semibold text-[#8C6D32] hover:text-[#18181B] underline underline-offset-4"
                >
                  ليس لديك حساب؟ اطلب إصدار بريد أو صلاحية جديدة ←
                </a>

                <div className="flex items-center gap-2.5">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#F3F1EC] border border-[#E2DFD7] text-[#18181B] text-xs font-semibold hover:border-[#8C6D32] transition-colors cursor-pointer"
                  >
                    التحقق من المعرّف
                  </button>

                  <a
                    href={selectedPortal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-[#18181B] text-[#F9F8F6] text-xs font-semibold hover:bg-[#8C6D32] transition-colors flex items-center gap-1.5"
                  >
                    <span>فتح {selectedPortal.portalSubTitle}</span>
                    <ArrowUpLeft className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
