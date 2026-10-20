import React, { useState } from 'react';
import {
  INFRASTRUCTURE_SERVICES,
  InfrastructureService,
  PageRoute
} from '../data/familyData';
import {
  Sun,
  Moon,
  ArrowUpLeft,
  ArrowRight,
  Copy,
  Check,
  Server,
  ShieldCheck,
  Mail,
  Database
} from 'lucide-react';

interface ProjectsPageProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigate: (route: PageRoute) => void;
  onInspectService: (service: InfrastructureService) => void;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  isDark,
  onToggleTheme,
  onNavigate,
  onInspectService,
  copiedKey,
  onCopy
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeConfigTab, setActiveConfigTab] = useState<'mailcow' | 'erpnext' | 'sso'>('mailcow');

  const filteredServices = INFRASTRUCTURE_SERVICES.filter(
    (srv) => selectedCategory === 'all' || srv.category === selectedCategory
  );

  return (
    <div>
      {/* Projects & Infrastructure Header */}
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
            <span className="font-mono text-[#C59B27]">elsaidy.org/projects</span>
            <span aria-hidden="true">·</span>
            <span>بوابة البنية الرقمية والأنظمة المؤسسية</span>
          </div>

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

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="text-xs font-medium text-[#C59B27] mb-3">
              معمارية السيادة الرقمية · السحابة الخاصة والأنظمة المؤسسية
            </div>
            <h1
              className={`font-display font-bold tracking-tight leading-[1.2] mb-4 ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
              style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', textWrap: 'balance' }}
            >
              بوابة الأنظمة المؤسسية، ERPNext، Mailcow، والحلول الرقمية لعائلة الصعيدي
            </h1>
            <p
              className={`text-base lg:text-lg leading-[1.85] ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              منظومة تقنية متكاملة مبنية على برمجيات مؤسسية مفتوحة المصدر ومستضافة ذاتياً بأعلى
              معايير التشفير والاعتمادية لخدمة إدارة الأوقاف، الأعمال، البريد الموحد، والأرشيف
              التاريخي للعائلة.
            </p>
          </div>

          {/* Interactive Category Filter */}
          <div
            className={`flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl border self-start lg:self-end ${
              isDark ? 'bg-[#0E1624] border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
            role="tablist"
          >
            {[
              { id: 'all', label: 'جميع الأنظمة' },
              { id: 'enterprise', label: 'ERPNext والأرشفة' },
              { id: 'communication', label: 'البريد (Mailcow)' },
              { id: 'publishing', label: 'المدونة والنشر' },
              { id: 'security', label: 'الهوية والشبكات' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#C59B27] text-slate-950 font-semibold'
                    : isDark
                    ? 'text-slate-300 hover:text-white'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Systems Grid */}
      <section
        className={`py-14 lg:py-20 border-b ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {filteredServices.map((service, idx) => {
            const spanClass =
              filteredServices.length >= 3 && idx < 2 ? 'lg:col-span-6' : 'lg:col-span-6';

            return (
              <div
                key={service.id}
                className={`${spanClass} p-6 lg:p-8 rounded-2xl border flex flex-col justify-between transition-colors ${
                  isDark
                    ? 'bg-[#0E1624] border-slate-800/90 hover:border-[#C59B27]/60'
                    : 'bg-white border-slate-200/90 hover:border-[#C59B27]/60'
                }`}
              >
                <div>
                  {/* Unboxed Metadata Kicker */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-3">
                    <div className="flex items-center gap-2 text-[#C59B27]">
                      <span className="font-mono font-semibold">{service.index}.</span>
                      <span>{service.categoryLabel}</span>
                    </div>
                    <span className="font-mono text-xs text-emerald-500 font-medium">
                      {service.domain}
                    </span>
                  </div>

                  <h2
                    className={`font-display text-2xl lg:text-3xl font-bold mb-2 ${
                      isDark ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {service.arabicTitle}
                  </h2>

                  <div
                    className={`text-xs font-mono mb-4 pb-3 border-b ${
                      isDark
                        ? 'text-slate-400 border-slate-800'
                        : 'text-slate-500 border-slate-200'
                    }`}
                  >
                    {service.name} · {service.protocol}
                  </div>

                  <p
                    className={`text-sm lg:text-base leading-[1.8] mb-5 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {service.description}
                  </p>

                  {/* Capabilities */}
                  <div className="mb-6">
                    <div
                      className={`text-xs font-semibold mb-2.5 ${
                        isDark ? 'text-amber-200' : 'text-slate-900'
                      }`}
                    >
                      القدرات والوظائف التشغيلية:
                    </div>
                    <ul className="space-y-2 text-xs lg:text-sm">
                      {service.capabilities.map((cap, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-2">
                          <span className="font-mono text-[#C59B27] font-semibold">·</span>
                          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                            {cap}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technical Specs Table */}
                  <div
                    className={`p-4 rounded-xl border mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs ${
                      isDark
                        ? 'bg-[#090E17] border-slate-800/90'
                        : 'bg-[#FAF8F5] border-slate-200'
                    }`}
                  >
                    {service.technicalSpecs.map((spec, sIdx) => (
                      <div key={sIdx}>
                        <div className={isDark ? 'text-slate-400 mb-0.5' : 'text-slate-500 mb-0.5'}>
                          {spec.label}
                        </div>
                        <div
                          className={`font-mono font-medium ${
                            isDark ? 'text-slate-200' : 'text-slate-800'
                          }`}
                        >
                          {spec.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div
                  className={`pt-4 border-t flex flex-wrap items-center justify-between gap-3 ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <a
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-[#C59B27] text-slate-950 text-xs font-semibold hover:bg-[#d4ab32] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      <span>الدخول إلى النظام</span>
                      <ArrowUpLeft className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => onInspectService(service)}
                      className={`px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isDark
                          ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      طلب صلاحية أو استعراض الهيكلة
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onCopy(service.url, `proj-${service.id}`)}
                    title="نسخ النطاق"
                    className={`px-3 py-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isDark
                        ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                        : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>{service.domain}</span>
                    {copiedKey === `proj-${service.id}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Connection & Client Configuration Reference (دليل الربط التقني السريع) */}
      <section className="py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <div className="text-xs font-medium text-[#C59B27] mb-2">
              دليل الإعدادات التقنية لأفراد العائلة والفريق الإداري
            </div>
            <h2
              className={`font-display text-2xl lg:text-3xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              إعدادات الربط القياسية للبريد الموحد (Mailcow) ونظام الموارد (ERPNext)
            </h2>
            <p
              className={`text-sm leading-relaxed mb-6 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              يمكن لأفراد عائلة الصعيدي ربط حسابات البريد الرسمي{' '}
              <span className="font-mono text-[#C59B27]">@elsaidy.org</span> مباشرة على تطبيقات
              الهاتف والحاسوب (Apple Mail, Outlook, Thunderbird) أو الدخول عبر واجهة الويب المشفرة.
            </p>

            <div className="flex flex-col gap-2">
              {[
                {
                  id: 'mailcow' as const,
                  title: 'إعدادات خادم البريد الموحد (Mailcow IMAP/SMTP)',
                  sub: 'mail.elsaidy.org · IMAPS 993 / SMTPS 465'
                },
                {
                  id: 'erpnext' as const,
                  title: 'وحدات نظام تخطيط الموارد والأوقاف (ERPNext)',
                  sub: 'erp.elsaidy.org · المالية، الأصول، والمشاريع'
                },
                {
                  id: 'sso' as const,
                  title: 'بوابة الهوية الموحدة ومفاتيح المرور (SSO & Passkeys)',
                  sub: 'id.elsaidy.org · OpenID Connect / WebAuthn'
                }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveConfigTab(item.id)}
                  className={`p-4 rounded-xl border text-right transition-colors cursor-pointer ${
                    activeConfigTab === item.id
                      ? isDark
                        ? 'bg-[#0E1624] border-[#C59B27] text-white'
                        : 'bg-white border-[#C59B27] text-slate-950'
                      : isDark
                      ? 'bg-[#0E1624]/50 border-slate-800 text-slate-300 hover:border-slate-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="text-sm font-bold mb-0.5">{item.title}</div>
                  <div className="text-xs font-mono text-[#C59B27]">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div
            className={`lg:col-span-7 p-6 lg:p-8 rounded-2xl border ${
              isDark ? 'bg-[#0E1624] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            {activeConfigTab === 'mailcow' && (
              <div>
                <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-700/30">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#C59B27]" />
                    <h3 className="font-display text-xl font-bold">
                      معلمات الاتصال بخادم البريد (mail.elsaidy.org)
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-emerald-500">TLS 1.3 Enforced</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
                  <div
                    className={`p-4 rounded-xl border ${
                      isDark ? 'bg-[#090E17] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="text-[#C59B27] font-semibold mb-2">
                      خادم الاستقبال (Incoming IMAP)
                    </div>
                    <div className="space-y-1.5 font-mono">
                      <div>Server: mail.elsaidy.org</div>
                      <div>Port: 993 (SSL/TLS)</div>
                      <div>Auth: Normal Password / App Token</div>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-xl border ${
                      isDark ? 'bg-[#090E17] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="text-[#C59B27] font-semibold mb-2">
                      خادم الإرسال (Outgoing SMTP)
                    </div>
                    <div className="space-y-1.5 font-mono">
                      <div>Server: mail.elsaidy.org</div>
                      <div>Port: 465 (SSL/TLS) or 587 (STARTTLS)</div>
                      <div>Auth: Required (Full @elsaidy.org email)</div>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-3 ${
                    isDark ? 'bg-[#090E17] border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <span className="font-semibold text-[#C59B27]">واجهة البريد السحابية (SOGo Webmail): </span>
                    <span className="font-mono">https://mail.elsaidy.org/SOGo</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCopy('mail.elsaidy.org', 'copy-mail-host')}
                    className="px-3 py-1.5 rounded-lg bg-[#C59B27] text-slate-950 font-semibold cursor-pointer"
                  >
                    {copiedKey === 'copy-mail-host' ? 'تم النسخ' : 'نسخ اسم الخادم'}
                  </button>
                </div>
              </div>
            )}

            {activeConfigTab === 'erpnext' && (
              <div>
                <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-700/30">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#C59B27]" />
                    <h3 className="font-display text-xl font-bold">
                      الهيكلة التشغيلية لنظام تخطيط الموارد (erp.elsaidy.org)
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-emerald-500">ERPNext v15</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-6">
                  <div
                    className={`p-4 rounded-xl border ${
                      isDark ? 'bg-[#090E17] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="font-semibold text-[#C59B27] mb-1">
                      01. إدارة الأوقاف والصناديق العائلية
                    </div>
                    <p className={isDark ? 'text-slate-300 leading-relaxed' : 'text-slate-600 leading-relaxed'}>
                      متابعة دقيقة للأعيان الوقفية، الإيرادات، المصارف الشرعية، والتقارير المالية
                      الربعية والسنوية المعتمدة.
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-xl border ${
                      isDark ? 'bg-[#090E17] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="font-semibold text-[#C59B27] mb-1">
                      02. إدارة المشاريع والأصول المشتركة
                    </div>
                    <p className={isDark ? 'text-slate-300 leading-relaxed' : 'text-slate-600 leading-relaxed'}>
                      تنظيم عقود الاستثمار، المشتريات، الموازنات التشغيلية، وسير الموافقات
                      الإلكترونية بين أعضاء المجلس.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <a
                    href="https://erp.elsaidy.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-[#C59B27] text-slate-950 text-xs font-semibold hover:bg-[#d4ab32] transition-colors flex items-center gap-1.5"
                  >
                    <span>فتح بوابة erp.elsaidy.org</span>
                    <ArrowUpLeft className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {activeConfigTab === 'sso' && (
              <div>
                <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-700/30">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#C59B27]" />
                    <h3 className="font-display text-xl font-bold">
                      بوابة الهوية الموحدة والأمن السيبراني (id.elsaidy.org)
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-emerald-500">FIDO2 / WebAuthn</span>
                </div>

                <p
                  className={`text-xs lg:text-sm leading-relaxed mb-4 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  تعتمد بوابة عائلة الصعيدي نظام الدخول الموحد (Single Sign-On) بحيث يمتلك كل عضو
                  حساباً مركزياً واحداً يتيح له الولوج الآمن إلى البريد الإلكتروني، المستودع السحابي،
                  ونظام ERPNext حسب الصلاحيات الممنوحة له.
                </p>

                <div
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    isDark ? 'bg-[#090E17] border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>· مصادقة ثنائية إلزامية (TOTP / YubiKey / Apple &amp; Android Passkeys)</div>
                  <div>· تشفير شامل للاتصالات عبر شهادات TLS 1.3 المجددة آلياً</div>
                  <div>· عزل شبكي كامل لقواعد البيانات عبر شبكة WireGuard الخاصة</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
