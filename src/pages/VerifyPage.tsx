import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Printer,
  FileCheck2,
  Award,
  Globe,
  MapPin,
  Calendar,
  Share2,
  Check,
  ExternalLink,
} from 'lucide-react';
import {
  PageRoute,
  DEFAULT_VERIFIED_CERTIFICATES,
  IssuedCertificateRecord,
  SiteConfig,
  DEFAULT_SITE_CONFIG,
} from '../data/familyData';
import { CertificateDocumentView } from '../components/CertificateDocumentView';

interface VerifyPageProps {
  onNavigate: (page: PageRoute) => void;
  issuedCertificates?: IssuedCertificateRecord[];
  siteConfig?: SiteConfig;
}

function getSerialFromUrl(): string {
  if (typeof window === 'undefined') return 'ELS-2026-EG-001';
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path.startsWith('/verify/')) {
    const seg = decodeURIComponent(path.slice('/verify/'.length)).trim();
    if (seg) return seg.toUpperCase();
  }
  const params = new URLSearchParams(window.location.search);
  const refParam = params.get('ref') || params.get('serial');
  if (refParam && refParam.trim()) {
    return refParam.trim().toUpperCase();
  }
  return 'ELS-2026-EG-001';
}

export const VerifyPage: React.FC<VerifyPageProps> = ({
  issuedCertificates = [],
  siteConfig = DEFAULT_SITE_CONFIG,
}) => {
  const [searchSerial, setSearchSerial] = useState<string>(getSerialFromUrl);
  const [queriedSerial, setQueriedSerial] = useState<string>(getSerialFromUrl);
  const [previewDocType, setPreviewDocType] = useState<'a4-certificate' | 'vip-id'>(
    'a4-certificate'
  );
  const [copiedDirectLink, setCopiedDirectLink] = useState<boolean>(false);

  const allCertificates = useMemo(() => {
    const map = new Map<string, IssuedCertificateRecord>();
    for (const item of DEFAULT_VERIFIED_CERTIFICATES) {
      map.set(item.serialNumber.toUpperCase(), item);
    }
    for (const item of issuedCertificates) {
      map.set(item.serialNumber.toUpperCase(), item);
    }
    return Array.from(map.values());
  }, [issuedCertificates]);

  const verifiedRecord = useMemo(() => {
    const normalized = queriedSerial.trim().toUpperCase();
    if (!normalized) return null;
    return (
      allCertificates.find((c) => c.serialNumber.toUpperCase() === normalized) ||
      null
    );
  }, [queriedSerial, allCertificates]);

  // Listen to browser back/forward on /verify/:serial
  useEffect(() => {
    const handlePopState = () => {
      const nextSerial = getSerialFromUrl();
      setSearchSerial(nextSerial);
      setQueriedSerial(nextSerial);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync documentType when a new verifiedRecord loads
  useEffect(() => {
    if (verifiedRecord?.documentType) {
      setPreviewDocType(verifiedRecord.documentType);
    }
  }, [verifiedRecord]);

  // Dynamic SEO Title for Dedicated Standalone Certificate Page
  useEffect(() => {
    if (verifiedRecord) {
      document.title = `وثيقة نسب معتمدة: ${verifiedRecord.arabicName} | بوابة الصعيدي`;
    } else if (queriedSerial.trim()) {
      document.title = `تحذير أمني: وثيقة غير مسجلة (${queriedSerial.trim()}) | بوابة الصعيدي`;
    }
  }, [verifiedRecord, queriedSerial]);

  const selectAndNavigateSerial = (serial: string) => {
    const cleaned = serial.trim().toUpperCase();
    if (!cleaned) return;
    setSearchSerial(cleaned);
    setQueriedSerial(cleaned);
    try {
      window.history.pushState({}, '', `/verify/${encodeURIComponent(cleaned)}`);
    } catch {
      // ignore in restricted environments
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    selectAndNavigateSerial(searchSerial);
  };

  const handlePrintVerified = () => {
    window.print();
  };

  const handleCopyCertificateUrl = (serial: string) => {
    const directUrl = `https://elsaidy.org/verify/${serial}`;
    navigator.clipboard.writeText(directUrl);
    setCopiedDirectLink(true);
    setTimeout(() => setCopiedDirectLink(false), 2500);
  };

  const directCertificateUrl = verifiedRecord
    ? `https://elsaidy.org/verify/${verifiedRecord.serialNumber}`
    : `https://elsaidy.org/verify/${queriedSerial.trim().toUpperCase()}`;

  const whatsappShareHref = verifiedRecord
    ? `https://wa.me/?text=${encodeURIComponent(
        `وثيقة نسب معتمدة: ${verifiedRecord.arabicName} — عائلات ${
          verifiedRecord.familyTitle || 'الصعيدي'
        } (رقم المرجع: ${verifiedRecord.serialNumber})\nرابط التحقق الرسمي المباشر:\n${directCertificateUrl}`
      )}`
    : '#';

  return (
    <article className="pb-20">
      {/* Hero Header (Hidden in Print) */}
      <header className="no-print relative bg-gradient-to-b from-[#0A141D] via-[#0F291E] to-[#141413] text-white border-b border-[#695022]/40 overflow-hidden rounded-b-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10 text-xs text-[#E6DFD3]">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-bold tracking-wide text-[#D4AF37]">
                منظومة التحقق الرقمي والسجل العام لشهادات النسب والعضوية
              </span>
            </div>
            <div className="font-mono text-[#E6DFD3]" dir="ltr">
              {verifiedRecord
                ? `elsaidy.org/verify/${verifiedRecord.serialNumber}`
                : 'ELSAIDY OFFICIAL VERIFICATION PORTAL — elsaidy.org/verify'}
            </div>
          </div>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#D4AF37]/40 mb-4">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-bold text-[#D4AF37]">
                السجل العام المعتمد للأمانة العامة ولجنة التوثيق والأنساب
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight text-white mb-4">
              {verifiedRecord
                ? `وثيقة نسب معتمدة: ${verifiedRecord.arabicName}`
                : 'بوابة التحقق الرقمي الفوري من شهادات النسب والعضوية'}
            </h1>
            <p className="text-base sm:text-lg text-[#E6DFD3] leading-relaxed">
              تتيح هذه البوابة الرسمية الفحص الفوري والتأكد من صحة شهادات النسب وبطاقات
              العضوية الشرفية الصادرة عن الأمانة العامة لعائلات الصعيدي في الوطن العربي
              ومجموعة الصعيدي عبر مسح رمز (QR Code) أو إدخال الرقم المرجعي للوثيقة.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Public Verification Search Box */}
        <section
          aria-labelledby="public-verify-heading"
          className="no-print bg-white border border-[#E6E2D8] rounded-2xl p-5 sm:p-10 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-[#E6E2D8]">
            <div>
              <span className="text-xs font-bold text-[#695022] uppercase tracking-wider block mb-1">
                السجل العام للتحقق الرقمي المباشر (PUBLIC VERIFICATION REGISTRY)
              </span>
              <h2
                id="public-verify-heading"
                className="font-serif text-2xl sm:text-3xl font-bold text-[#141413]"
              >
                فحص ومطابقة الرقم المرجعي للوثيقة (Serial Number)
              </h2>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F291E]/10 text-[#0F291E] text-xs font-bold">
              <FileCheck2 className="w-4 h-4 text-[#0F291E]" />
              <span>إجمالي الوثائق المسجلة بالسجل العام: {allCertificates.length}</span>
            </div>
          </div>

          <form
            onSubmit={handleVerifySubmit}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end mb-6"
          >
            <div className="md:col-span-9">
              <label
                htmlFor="certificate-serial-input"
                className="block text-xs font-bold text-[#141413] mb-2"
              >
                أدخل الرقم المرجعي للشهادة أو البطاقة (مثال: ELS-2026-EG-001 أو ELS-2026-EG-014):
              </label>
              <div className="relative">
                <Search className="w-5 h-5 text-[#695022] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="certificate-serial-input"
                  type="text"
                  value={searchSerial}
                  onChange={(e) => setSearchSerial(e.target.value)}
                  placeholder="ELS-2026-EG-001"
                  dir="ltr"
                  className="w-full pr-12 pl-4 py-3.5 bg-[#F7F6F2] border border-[#D5D0C5] rounded-xl text-left font-mono text-base font-bold text-[#141413] focus:outline-none focus:border-[#0F291E] focus:bg-white transition-colors"
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-[#0F291E] hover:bg-[#163d2c] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>تحقق من الوثيقة الآن</span>
              </button>
            </div>
          </form>

          {/* Quick Sample Serials */}
          <div className="flex flex-wrap items-center gap-2 mb-8 text-xs">
            <span className="font-bold text-[#4A4946]">صفحات وثائق معتمدة للفحص السريع:</span>
            {allCertificates.slice(0, 8).map((cert) => (
              <button
                key={cert.serialNumber}
                type="button"
                onClick={() => selectAndNavigateSerial(cert.serialNumber)}
                className={`px-3 py-1.5 rounded-lg font-mono font-bold border transition-colors cursor-pointer ${
                  queriedSerial.toUpperCase() === cert.serialNumber.toUpperCase()
                    ? 'bg-[#0F291E] text-[#D4AF37] border-[#0F291E]'
                    : 'bg-[#F7F6F2] text-[#141413] border-[#E6E2D8] hover:border-[#695022]'
                }`}
                dir="ltr"
              >
                {cert.serialNumber}
              </button>
            ))}
          </div>

          {/* Dedicated Certificate Verification Result Card */}
          {verifiedRecord ? (
            <div className="bg-[#F4F8F5] border-2 border-[#0F291E] rounded-2xl p-5 sm:p-8 transition-all space-y-6">
              {/* Green Official Verification Header Banner */}
              <div className="p-4 rounded-xl bg-[#0F291E] text-white border border-[#D4AF37]/40 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#0F291E] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-[#D4AF37]">
                      وثيقة أصلية ومعتمدة في السجل العام لعائلات الصعيدي - مطابقة 100%
                    </div>
                    <div className="text-[11px] text-zinc-200 mt-0.5">
                      الرابط الرسمي الدائم للوثيقة:{' '}
                      <span className="font-mono text-[#D4AF37]" dir="ltr">
                        {directCertificateUrl}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className="px-3 py-1 rounded-lg bg-white/10 border border-[#D4AF37]/40 font-mono text-xs font-extrabold text-[#D4AF37]"
                  dir="ltr"
                >
                  {verifiedRecord.serialNumber}
                </span>
              </div>

              {/* Person Header & Primary Actions (Print & Share via WhatsApp / Copy Link) */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#0F291E]/15">
                <div>
                  <span className="text-xs font-bold text-[#695022] block">
                    صاحب الوثيقة المسجل بالأرشيف الرسمي:
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#141413] mt-0.5">
                    {verifiedRecord.arabicName}
                  </h3>
                  {verifiedRecord.englishName && (
                    <div className="font-mono text-xs font-bold text-[#4A4946] mt-0.5" dir="ltr">
                      {verifiedRecord.englishName}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handlePrintVerified}
                    className="py-2.5 px-4 rounded-xl bg-[#0F291E] hover:bg-[#163d2c] text-[#D4AF37] font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة الوثيقة الرسمية</span>
                  </button>

                  <a
                    href={whatsappShareHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-xl bg-[#695022] hover:bg-[#533f1a] text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>مشاركة رابط الوثيقة (واتساب)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopyCertificateUrl(verifiedRecord.serialNumber)}
                    className="py-2.5 px-3.5 rounded-xl bg-white border border-[#D5D0C5] hover:border-[#695022] text-[#141413] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedDirectLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>تم نسخ الرابط</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-[#695022]" />
                        <span>نسخ رابط الصفحة</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Official Summary Verification Table */}
              <div className="bg-white rounded-xl border border-[#E6E2D8] overflow-hidden">
                <div className="px-4 py-3 bg-[#F7F6F2] border-b border-[#E6E2D8] text-xs font-extrabold text-[#0F291E] flex items-center justify-between">
                  <span>جدول بيانات المطابقة والتوثيق المرجعي</span>
                  <span className="font-mono text-[11px] text-[#695022]" dir="ltr">
                    STATUS: 100% VERIFIED
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs sm:text-sm border-collapse">
                    <tbody className="divide-y divide-[#E6E2D8]">
                      <tr>
                        <th className="py-3 px-4 bg-[#F7F6F2]/60 font-bold text-[#695022] w-1/3 sm:w-1/4">
                          الرقم المرجعي للوثيقة
                        </th>
                        <td className="py-3 px-4 font-mono font-bold text-[#0F291E]" dir="ltr">
                          {verifiedRecord.serialNumber}
                        </td>
                      </tr>
                      <tr>
                        <th className="py-3 px-4 bg-[#F7F6F2]/60 font-bold text-[#695022]">
                          الاسم الكامل الموثق
                        </th>
                        <td className="py-3 px-4 font-bold text-[#141413]">
                          {verifiedRecord.arabicName}{' '}
                          {verifiedRecord.englishName ? `(${verifiedRecord.englishName})` : ''}
                        </td>
                      </tr>
                      <tr>
                        <th className="py-3 px-4 bg-[#F7F6F2]/60 font-bold text-[#695022]">
                          اللقب / العائلة المعتمدة
                        </th>
                        <td className="py-3 px-4 font-extrabold text-[#0F291E]">
                          عائلات {verifiedRecord.familyTitle || 'الصعيدي'} (آل{' '}
                          {verifiedRecord.familyTitle || 'الصعيدي'})
                        </td>
                      </tr>
                      <tr>
                        <th className="py-3 px-4 bg-[#F7F6F2]/60 font-bold text-[#695022]">
                          الدولة والإقليم والحاضرة
                        </th>
                        <td className="py-3 px-4 font-semibold text-[#141413]">
                          {verifiedRecord.country} — {verifiedRecord.regionBranch}
                        </td>
                      </tr>
                      <tr>
                        <th className="py-3 px-4 bg-[#F7F6F2]/60 font-bold text-[#695022]">
                          تاريخ الإصدار والاعتماد
                        </th>
                        <td className="py-3 px-4 font-semibold text-[#141413]">
                          {verifiedRecord.issueDateGregorian} م ({verifiedRecord.issueDateHijri})
                        </td>
                      </tr>
                      <tr>
                        <th className="py-3 px-4 bg-[#F7F6F2]/60 font-bold text-[#695022]">
                          ملخص عمود النسب والتوثيق
                        </th>
                        <td className="py-3 px-4 font-serif text-base text-[#141413] leading-relaxed">
                          {verifiedRecord.lineageNarrative}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#E6E2D8]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#695022] mb-1">
                    <Globe className="w-3.5 h-3.5" />
                    <span>الدولة والإقليم المعتمد</span>
                  </div>
                  <div className="text-sm font-bold text-[#141413]">
                    {verifiedRecord.country}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#E6E2D8]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#695022] mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>الفرع الجغرافي والحاضرة</span>
                  </div>
                  <div className="text-sm font-bold text-[#141413]">
                    {verifiedRecord.regionBranch}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#E6E2D8]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#695022] mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>تاريخ القيد والتوثيق</span>
                  </div>
                  <div className="text-sm font-bold text-[#141413]">
                    {verifiedRecord.issueDateGregorian} ({verifiedRecord.issueDateHijri})
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs font-bold text-[#4A4946]">
                  اختر نمط عرض الوثيقة الموثقة للطباعة أو المعاينة:
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewDocType('a4-certificate')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      previewDocType === 'a4-certificate'
                        ? 'bg-[#0F291E] text-white border-[#0F291E]'
                        : 'bg-white text-[#141413] border-[#D5D0C5]'
                    }`}
                  >
                    شهادة نسب ملكية (A4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDocType('vip-id')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      previewDocType === 'vip-id'
                        ? 'bg-[#0F291E] text-white border-[#0F291E]'
                        : 'bg-white text-[#141413] border-[#D5D0C5]'
                    }`}
                  >
                    بطاقة عضوية شرفية (VIP ID)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              role="alert"
              className="bg-[#FDF4F4] border-2 border-[#991B1B] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-[#991B1B] text-white flex items-center justify-center shrink-0">
                <XCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <div className="inline-block px-2.5 py-0.5 rounded bg-[#991B1B]/10 text-[#991B1B] font-mono text-xs font-extrabold">
                  SECURITY ALERT · UNREGISTERED SERIAL ({queriedSerial})
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-[#991B1B]">
                  تحذير أمني: هذه الوثيقة غير مسجلة في الأرشيف الرسمي لبوابة الصعيدي ولا يُعتد بها
                </h3>
                <p className="text-xs sm:text-sm text-[#4A4946] leading-relaxed">
                  لم يتم العثور على أي سجل مطابق للرقم المرجعي المدخل ({queriedSerial}) في قاعدة
                  بيانات السجل العام للأمانة العامة لعائلات الصعيدي (elsaidy.org). يرجى التأكد من
                  صحة الرقم المرجعي أو مسح رمز (QR Code) الأصلي المطبوع على الشهادة المعتمدة.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Printable / Previewable Certificate View for the Verified Record */}
        {verifiedRecord && (
          <section aria-label="معاينة الشهادة الرسمية الموثقة" className="pt-2">
            <div className="no-print flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-bold text-[#695022] block">
                  نسخة إلكترونية مطابقة للأصل المعتمد · صفحة الوثيقة المستقلة
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#141413]">
                  معاينة وطباعة الوثيقة الرسمية ({verifiedRecord.serialNumber})
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handlePrintVerified}
                  className="py-2.5 px-5 rounded-xl bg-[#0F291E] hover:bg-[#163d2c] text-[#D4AF37] font-bold text-xs flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الوثيقة الرسمية (Print / Save PDF)</span>
                </button>
                <a
                  href={whatsappShareHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-[#695022] hover:bg-[#533f1a] text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة رابط الوثيقة</span>
                </a>
              </div>
            </div>

            <CertificateDocumentView
              record={verifiedRecord}
              serialNumber={verifiedRecord.serialNumber}
              arabicName={verifiedRecord.arabicName}
              englishName={verifiedRecord.englishName}
              familyTitle={verifiedRecord.familyTitle || 'الصعيدي'}
              country={verifiedRecord.country}
              regionBranch={verifiedRecord.regionBranch}
              lineageNarrative={verifiedRecord.lineageNarrative}
              documentType={previewDocType}
              issueDateGregorian={verifiedRecord.issueDateGregorian}
              issueDateHijri={verifiedRecord.issueDateHijri}
              includeFamilyTreeStamp={true}
              customLogoUrl={siteConfig.branding.logoUrl}
              customSealImageUrl={siteConfig.branding.sealImageUrl}
              customTreeImageUrl={siteConfig.familyTreeConfig.treeImageUrl}
              siteTitle={siteConfig.branding.siteTitle}
            />
          </section>
        )}
      </div>
    </article>
  );
};
