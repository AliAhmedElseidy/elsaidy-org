import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  DEFAULT_VERIFIED_CERTIFICATES,
  IssuedCertificateRecord,
  PageRoute,
  SiteConfig,
  DEFAULT_SITE_CONFIG,
  sanitizeSafeUrl,
} from '../data/familyData';

const CertificateDocumentView = lazy(() =>
  import('../components/CertificateDocumentView').then((m) => ({
    default: m.CertificateDocumentView,
  }))
);
import {
  ShieldCheck,
  Search,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Copy,
  Check,
  Printer,
  Share2,
  ExternalLink,
  Lock,
} from 'lucide-react';

interface VerifyPageProps {
  onNavigate: (route: PageRoute) => void;
  issuedCertificates?: IssuedCertificateRecord[];
  siteConfig?: SiteConfig;
  initialSerial?: string;
}

const getSerialFromUrl = (): string => {
  if (typeof window === 'undefined') return '';
  const pathMatch = window.location.pathname.match(/^\/verify\/([^/]+)/i);
  if (pathMatch && pathMatch[1]) {
    try {
      return decodeURIComponent(pathMatch[1]).trim().toUpperCase();
    } catch {
      return pathMatch[1].trim().toUpperCase();
    }
  }
  const params = new URLSearchParams(window.location.search);
  const q = params.get('serial') || params.get('ref') || params.get('id');
  if (q && q.trim()) {
    return q.trim().toUpperCase();
  }
  return '';
};

export const VerifyPage: React.FC<VerifyPageProps> = ({
  onNavigate,
  issuedCertificates = DEFAULT_VERIFIED_CERTIFICATES,
  siteConfig = DEFAULT_SITE_CONFIG,
  initialSerial,
}) => {
  const [serialQuery, setSerialQuery] = useState<string>(() => {
    if (initialSerial && initialSerial.trim()) {
      return initialSerial.trim().toUpperCase();
    }
    return getSerialFromUrl();
  });

  const [searchedSerial, setSearchedSerial] = useState<string>(() => {
    if (initialSerial && initialSerial.trim()) {
      return initialSerial.trim().toUpperCase();
    }
    return getSerialFromUrl();
  });

  const [copiedSerial, setCopiedSerial] = useState<boolean>(false);
  const [copiedDirectUrl, setCopiedDirectUrl] = useState<boolean>(false);

  // Sync state whenever URL or initialSerial prop changes (Fixes BUG-007)
  useEffect(() => {
    const nextSerial =
      initialSerial && initialSerial.trim()
        ? initialSerial.trim().toUpperCase()
        : getSerialFromUrl();
    setSerialQuery(nextSerial);
    setSearchedSerial(nextSerial);
  }, [initialSerial]);

  useEffect(() => {
    const handlePopState = () => {
      const next = getSerialFromUrl();
      setSerialQuery(next);
      setSearchedSerial(next);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Merge CMS-issued certificates with default verified records (excluding archived records from public lookup)
  const allCertificates = React.useMemo(() => {
    const map = new Map<string, IssuedCertificateRecord>();
    DEFAULT_VERIFIED_CERTIFICATES.forEach((c) => {
      if (!c.archived) {
        map.set(c.serialNumber.toUpperCase(), c);
      }
    });
    issuedCertificates.forEach((c) => {
      if (c.archived) {
        map.delete(c.serialNumber.toUpperCase());
      } else {
        map.set(c.serialNumber.toUpperCase(), c);
      }
    });
    return Array.from(map.values());
  }, [issuedCertificates]);

  const matchedRecord = React.useMemo(() => {
    const normalized = searchedSerial.trim().toUpperCase();
    if (!normalized) return null;
    return allCertificates.find((c) => c.serialNumber.toUpperCase() === normalized) || null;
  }, [allCertificates, searchedSerial]);

  // Dynamically update document title when a standalone certificate is viewed
  useEffect(() => {
    if (matchedRecord) {
      const title = matchedRecord.familyTitle || 'الصعيدي';
      document.title = `وثيقة نسب معتمدة: ${matchedRecord.arabicName} (${matchedRecord.serialNumber}) | عائلات ${title} — elsaidy.org`;
    }
  }, [matchedRecord]);

  const navigateToCertificateUrl = (serial: string) => {
    const cleaned = serial.trim().toUpperCase();
    setSerialQuery(cleaned);
    setSearchedSerial(cleaned);
    if (typeof window !== 'undefined') {
      const targetPath = cleaned ? `/verify/${encodeURIComponent(cleaned)}` : '/verify';
      if (window.location.pathname !== targetPath) {
        try {
          window.history.pushState({ page: 'verify', serial: cleaned }, '', targetPath);
        } catch {
          // Ignore pushState restrictions in sandboxed environments
        }
      }
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateToCertificateUrl(serialQuery);
  };

  const handleCopySerial = (serial: string) => {
    navigator.clipboard?.writeText(serial);
    setCopiedSerial(true);
    setTimeout(() => setCopiedSerial(false), 2000);
  };

  const handleCopyDirectLink = (serial: string) => {
    const directUrl = `https://elsaidy.org/verify/${serial}`;
    navigator.clipboard?.writeText(directUrl);
    setCopiedDirectUrl(true);
    setTimeout(() => setCopiedDirectUrl(false), 2500);
  };

  const handlePrintStandaloneCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-10 sm:space-y-12 lg:space-y-16 py-6 sm:py-8 lg:py-12">
      {/* Page Breadcrumb & Institutional Header (Hidden when printing standalone certificate) */}
      <section className="no-print bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-5 sm:p-10 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-5 border-b border-[#E6E2D8] text-xs text-zinc-600">
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
            <button
              type="button"
              onClick={() => navigateToCertificateUrl('')}
              className="font-bold text-[#0F291E] hover:underline cursor-pointer"
            >
              بوابة التحقق وتوثيق الشهادات
            </button>
            {matchedRecord && (
              <>
                <span aria-hidden="true">/</span>
                <span className="font-mono font-bold text-[#695022]" dir="ltr">
                  {matchedRecord.serialNumber}
                </span>
              </>
            )}
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F291E]/10 text-[#0F291E] font-bold">
            <ShieldCheck className="w-4 h-4 text-[#695022]" />
            <span>السجل الرقمي العام للوثائق الصادرة — elsaidy.org</span>
          </div>
        </div>

        <div className="max-w-4xl">
          <div className="text-xs font-bold text-[#695022] mb-2">
            الأمانة العامة ولجنة التوثيق والأنساب · الموقع الرسمي لعائلات الصعيدي (elsaidy.org)
          </div>
          <h1
            className="font-extrabold text-[#141413] tracking-tight leading-[1.25] mb-3"
            style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.75rem)', textWrap: 'balance' }}
          >
            {matchedRecord
              ? `الصفحة الرسمية للوثيقة المرجعية (${matchedRecord.serialNumber}) — ${matchedRecord.arabicName}`
              : 'بوابة التحقق الرقمي الفوري من شهادات النسب وبطاقات العضوية الرسمية'}
          </h1>
          <p className="text-sm sm:text-base text-zinc-700 leading-[1.85] max-w-[75ch]">
            تتيح هذه البوابة الرسمية الفحص الفوري للتحقق من صحة ومطابقة شهادات النسب وبطاقات
            العضوية الصادرة عن الأمانة العامة لعائلات الصعيدي (آل الصعيدي) عبر الرقم المرجعي للوثيقة
            أو مسح رمز الاستجابة السريعة (QR Code).
          </p>
        </div>
      </section>

      {/* Search & Verification Bar (Strict Privacy: Zero Serial Chips Exposed) */}
      <section className="no-print bg-white rounded-2xl border border-[#E6E2D8] p-5 sm:p-8 shadow-sm space-y-5">
        <form onSubmit={handleVerifySubmit} className="max-w-3xl space-y-3">
          <label
            htmlFor="cert-serial-search"
            className="block text-xs sm:text-sm font-extrabold text-[#141413]"
          >
            أدخل الرقم المرجعي للشهادة أو البطاقة للتحقق الفوري وفتح صفحتها المستقلة:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="cert-serial-search"
                type="text"
                dir="ltr"
                value={serialQuery}
                onChange={(e) => setSerialQuery(e.target.value)}
                placeholder="ELS-2026-XX-XXX"
                className="w-full pr-11 pl-4 py-3.5 rounded-xl bg-[#F7F6F2] border-2 border-[#E6E2D8] text-sm font-mono font-bold text-[#141413] uppercase tracking-wider outline-none focus:border-[#0F291E] focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-7 py-3.5 rounded-xl bg-[#0F291E] text-white text-xs sm:text-sm font-extrabold hover:bg-[#141E28] transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>فحص ومطابقة الوثيقة</span>
            </button>
          </div>
        </form>

        {/* Formal Privacy Protection Notice (Replaces Quick Serial Chips — Fixes BUG-002) */}
        <div className="pt-4 border-t border-[#E6E2D8] flex items-start gap-2.5 text-xs text-zinc-600">
          <Lock className="w-4 h-4 text-[#695022] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#141413]">حماية خصوصية السجلات العائلية: </strong>
            حفاظاً على سرية بيانات الأعضاء ومنع التصفح العشوائي للوثائق، لا يتم عرض قائمة بأرقام
            الشهادات علناً. يُرجى إدخال الرقم المرجعي المدون أعلى الشهادة مباشرةً أو مسح رمز
            الاستجابة السريعة (QR Code) المطبوع على الوثيقة الأصلية.
          </p>
        </div>
      </section>

      {/* Verification Result & Standalone Official Document View */}
      <section className="print-certificate-wrapper">
        {!searchedSerial ? (
          <div className="no-print bg-white rounded-2xl border border-[#E6E2D8] p-6 sm:p-10 text-center max-w-2xl mx-auto space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#0F291E]/10 text-[#0F291E] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6 text-[#695022]" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#141413]">
              أدخل الرقم المرجعي للوثيقة لبدء الفحص الفوري
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              عند إدخال الرقم المرجعي الصحيح أو مسح رمز (QR Code) من كاميرا الهاتف، ستظهر هنا
              البطاقة الرسمية للوثيقة بكامل بيانات القيد العائلي والنسخة الجاهزة للطباعة بحجم A4.
            </p>
          </div>
        ) : matchedRecord ? (
          <div className="space-y-8">
            {/* Official Verification Status Card (Hidden on Print so ONLY the A4 Certificate prints) */}
            <div className="no-print bg-white rounded-2xl border-2 border-[#0F291E] p-5 sm:p-8 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-[#E6E2D8]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#0F291E] text-[#D4AF37] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0F291E]">
                      <span>سجل الأمان الرسمي: وثيقة أصلية مسجلة ومطابقة</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#0F291E] text-[10px]">
                        VERIFIED 100%
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-2xl font-extrabold text-[#141413]">
                      {matchedRecord.status}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyDirectLink(matchedRecord.serialNumber)}
                    className="px-3.5 py-2 rounded-xl bg-[#0F291E] text-white text-xs font-bold hover:bg-[#141E28] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedDirectUrl ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>تم نسخ رابط صفحة الشهادة!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>نسخ الرابط المباشر للشهادة</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopySerial(matchedRecord.serialNumber)}
                    className="px-3.5 py-2 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-xs font-mono font-bold text-[#0F291E] hover:border-[#695022] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{matchedRecord.serialNumber}</span>
                    {copiedSerial ? (
                      <Check className="w-3.5 h-3.5 text-[#0F291E]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#695022]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handlePrintStandaloneCertificate}
                    className="px-4 py-2 rounded-xl bg-[#695022] text-white text-xs font-bold hover:bg-[#533f1b] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>طباعة الوثيقة المستقلة (A4)</span>
                  </button>
                </div>
              </div>

              {/* Direct Standalone URL Banner */}
              <div className="mb-6 p-3.5 rounded-xl bg-[#F4F1E8] border border-[#695022]/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#0F291E]">
                  <ExternalLink className="w-4 h-4 text-[#695022] shrink-0" />
                  <span>الرابط الرسمي المستقل لهذه الوثيقة (المدمج في رمز QR):</span>
                </div>
                <span
                  className="font-mono font-bold text-[#695022] select-all break-all"
                  dir="ltr"
                >
                  https://elsaidy.org/verify/{matchedRecord.serialNumber}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] flex items-center gap-3">
                  {sanitizeSafeUrl(matchedRecord.personalPhotoUrl) && (
                    <img
                      src={sanitizeSafeUrl(matchedRecord.personalPhotoUrl)}
                      alt={matchedRecord.arabicName}
                      className="w-12 h-12 rounded-lg object-cover border border-[#695022] shrink-0"
                    />
                  )}
                  <div>
                    <span className="text-zinc-600 block mb-1">اسم صاحب الوثيقة المعتمد:</span>
                    <strong className="text-base font-extrabold text-[#141413] block">
                      {matchedRecord.arabicName}
                    </strong>
                    <span className="font-mono text-[11px] text-[#695022]" dir="ltr">
                      {matchedRecord.englishName}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]">
                  <span className="text-zinc-600 block mb-1">اللقب العائلي ورقم القيد المميز:</span>
                  <strong className="text-sm font-extrabold text-[#0F291E] block">
                    عائلات {matchedRecord.familyTitle || 'الصعيدي'} (آل{' '}
                    {matchedRecord.familyTitle || 'الصعيدي'})
                  </strong>
                  <span className="font-mono text-[11px] font-bold text-[#695022] block mt-1" dir="ltr">
                    ID:{' '}
                    {matchedRecord.memberReferenceId ||
                      `REG-${matchedRecord.serialNumber.replace(/^ELS-\d+-/, '')}`}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]">
                  <span className="text-zinc-600 block mb-1">الجد الجامع / الفخذ والحاضرة:</span>
                  <strong className="text-xs font-bold text-[#141413] block">
                    {matchedRecord.ancestralRoot || matchedRecord.regionBranch}
                  </strong>
                  <span className="text-[11px] text-[#0F291E] font-semibold block mt-1">
                    {matchedRecord.currentResidence ||
                      `${matchedRecord.country} — ${matchedRecord.regionBranch}`}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]">
                  <span className="text-zinc-600 block mb-1">تاريخ الإصدار والقيد:</span>
                  <strong className="text-sm font-bold text-[#141413] block">
                    {matchedRecord.issueDateHijri}
                  </strong>
                  <span className="font-mono text-[11px] text-zinc-600" dir="ltr">
                    Gregorian: {matchedRecord.issueDateGregorian}
                  </span>
                </div>
              </div>
            </div>

            {/* Full Visual Rendering of the Verified Certificate (Prints Standalone on 1 A4 Page) */}
            <div className="bg-white rounded-2xl border border-[#E6E2D8] p-3 sm:p-8 shadow-sm print-certificate-wrapper">
              <div className="no-print flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#E6E2D8]">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#0F291E]">
                  <Award className="w-4 h-4 text-[#695022]" />
                  <span>النسخة الإلكترونية المطابقة للأصل للوثيقة ({matchedRecord.serialNumber})</span>
                </div>
                <span className="text-[11px] text-zinc-600">
                  شاملة الختم الرسمي ورمز التحقق السريع (QR) الموجه لصفحة الشهادة
                </span>
              </div>

              <Suspense
                fallback={
                  <div className="p-8 text-center text-xs font-bold text-[#0F291E] bg-[#F7F6F2] rounded-xl border border-[#E6E2D8]">
                    جاري تجهيز الوثيقة الرسمية للعرض...
                  </div>
                }
              >
                <CertificateDocumentView
                  record={matchedRecord}
                  includeFamilyTreeStamp={true}
                  customLogoUrl={siteConfig.branding.logoUrl}
                  customSealImageUrl={siteConfig.branding.sealImageUrl}
                  customTreeImageUrl={siteConfig.familyTreeConfig.treeImageUrl}
                  siteTitle={siteConfig.branding.siteTitle}
                />
              </Suspense>
            </div>
          </div>
        ) : (
          <div className="no-print bg-white rounded-2xl border-2 border-red-300 p-6 sm:p-8 shadow-sm flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-red-100 text-red-800 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <div className="text-xs font-bold text-red-800">نتيجة الفحص الرقمي</div>
              <h2 className="text-lg font-extrabold text-[#141413]">
                لم يتم العثور على وثيقة مسجلة بالرقم المرجعي ({searchedSerial})
              </h2>
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                يرجى التأكد من كتابة الرقم المرجعي بشكل صحيح كما هو مدون أعلى الشهادة، أو التواصل مع
                الأمانة العامة للموقع الرسمي لعائلات الصعيدي للتحقق من القيد.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default VerifyPage;
