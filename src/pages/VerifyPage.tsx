import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import {
  PageRoute,
  DEFAULT_VERIFIED_CERTIFICATES,
  IssuedCertificateRecord,
} from '../data/familyData';
import { CertificateDocumentView } from '../components/CertificateDocumentView';

interface VerifyPageProps {
  onNavigate: (page: PageRoute) => void;
  issuedCertificates?: IssuedCertificateRecord[];
}

export const VerifyPage: React.FC<VerifyPageProps> = ({
  onNavigate,
  issuedCertificates = [],
}) => {
  const [searchSerial, setSearchSerial] = useState<string>('ELS-2026-EG-001');
  const [queriedSerial, setQueriedSerial] = useState<string>('ELS-2026-EG-001');
  const [previewDocType, setPreviewDocType] = useState<'a4-certificate' | 'vip-id'>(
    'a4-certificate'
  );

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

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQueriedSerial(searchSerial);
  };

  const handlePrintVerified = () => {
    window.print();
  };

  return (
    <article className="pb-20">
      {/* Hero Header (Hidden in Print) */}
      <header className="no-print relative bg-gradient-to-b from-[#0A141D] via-[#0F291E] to-[#141413] text-white border-b border-[#695022]/40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10 text-xs text-[#E6DFD3]">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-bold tracking-wide text-[#D4AF37]">
                منظومة التحقق الرقمي والسجل العام لشهادات النسب والعضوية
              </span>
            </div>
            <div className="font-mono text-[#E6DFD3]" dir="ltr">
              ELSAIDY OFFICIAL VERIFICATION PORTAL — elsaidy.org/verify
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
              بوابة التحقق الرقمي الفوري من شهادات النسب والعضوية
            </h1>
            <p className="text-base sm:text-lg text-[#E6DFD3] leading-relaxed">
              تتيح هذه البوابة الرسمية الفحص الفوري والتأكد من صحة شهادات النسب وبطاقات
              العضوية الشرفية الصادرة عن الأمانة العامة لعائلات الصعيدي في الوطن العربي
              ومجموعة الصعيدي عبر إدخال الرقم المرجعي للوثيقة (Serial Number).
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {/* Public Verification Search Box */}
        <section
          aria-labelledby="public-verify-heading"
          className="no-print bg-white border border-[#E6E2D8] rounded-2xl p-6 sm:p-10 shadow-sm"
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
                أدخل الرقم المرجعي للشهادة أو البطاقة (مثال: ELS-2026-EG-001 أو ELS-2026-EG-002):
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
            <span className="font-bold text-[#4A4946]">أرقام مرجعية مسجلة للفحص السريع:</span>
            {allCertificates.slice(0, 6).map((cert) => (
              <button
                key={cert.serialNumber}
                type="button"
                onClick={() => {
                  setSearchSerial(cert.serialNumber);
                  setQueriedSerial(cert.serialNumber);
                }}
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

          {/* Verification Result Card */}
          {verifiedRecord ? (
            <div className="bg-[#F4F8F5] border-2 border-[#0F291E] rounded-2xl p-6 sm:p-8 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-5 border-b border-[#0F291E]/15">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#0F291E] text-[#D4AF37] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F291E]">
                      <span>حالة التحقق الرسمي:</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#0F291E] text-white">
                        {verifiedRecord.status}
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-[#141413] mt-1">
                      {verifiedRecord.arabicName}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-left font-mono" dir="ltr">
                    <span className="text-[11px] font-bold text-[#695022] block">
                      VERIFIED SERIAL NO.
                    </span>
                    <span className="text-base font-bold text-[#0F291E]">
                      {verifiedRecord.serialNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handlePrintVerified}
                    className="py-2.5 px-4 rounded-xl bg-[#695022] hover:bg-[#533f1a] text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة الوثيقة المعتمدة</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
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

              <div className="bg-white p-4 rounded-xl border border-[#E6E2D8] mb-4">
                <span className="text-xs font-bold text-[#695022] block mb-1">
                  ملخص عمود النسب والتوثيق:
                </span>
                <p className="font-serif text-base text-[#141413] leading-relaxed">
                  {verifiedRecord.lineageNarrative}
                </p>
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
            <div className="bg-[#FDF4F4] border-2 border-[#991B1B]/30 rounded-2xl p-6 flex items-center gap-4">
              <XCircle className="w-8 h-8 text-[#991B1B] shrink-0" />
              <div>
                <h3 className="text-base font-bold text-[#991B1B]">
                  لم يتم العثور على وثيقة مطابقة للرقم المرجعي ({queriedSerial})
                </h3>
                <p className="text-xs text-[#4A4946] mt-1">
                  يرجى التأكد من كتابة الرقم المرجعي بشكل صحيح كما هو مدون أعلى الشهادة
                  أو أسفل رمز التحقق (QR Code)، مثل: ELS-2026-EG-001.
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
                  نسخة إلكترونية مطابقة للأصل المعتمد
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#141413]">
                  معاينة وطباعة الوثيقة الرسمية ({verifiedRecord.serialNumber})
                </h3>
              </div>
              <button
                type="button"
                onClick={handlePrintVerified}
                className="py-2.5 px-5 rounded-xl bg-[#0F291E] hover:bg-[#163d2c] text-[#D4AF37] font-bold text-xs flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الشهادة بحجم كامل (Print / Save PDF)</span>
              </button>
            </div>

            <CertificateDocumentView
              serialNumber={verifiedRecord.serialNumber}
              arabicName={verifiedRecord.arabicName}
              englishName={verifiedRecord.englishName}
              country={verifiedRecord.country}
              regionBranch={verifiedRecord.regionBranch}
              lineageNarrative={verifiedRecord.lineageNarrative}
              documentType={previewDocType}
              issueDateGregorian={verifiedRecord.issueDateGregorian}
              issueDateHijri={verifiedRecord.issueDateHijri}
              includeFamilyTreeStamp={true}
            />
          </section>
        )}
      </div>
    </article>
  );
};
