import React, { useMemo } from 'react';
import QRCode from 'qrcode';
import { sanitizeSafeUrl } from '../data/familyData';

export const DeterministicQrSvg: React.FC<{ value: string; size?: number }> = ({
  value,
  size = 96,
}) => {
  const qrData = useMemo(() => {
    try {
      const qr = QRCode.create(value || 'https://elsaidy.org/verify', {
        errorCorrectionLevel: 'M',
      });
      const matrixSize = qr.modules.size;
      const quietZone = 2;
      const totalSize = matrixSize + quietZone * 2;
      const modules: { r: number; c: number }[] = [];

      for (let r = 0; r < matrixSize; r++) {
        for (let c = 0; c < matrixSize; c++) {
          if (qr.modules.get(r, c)) {
            modules.push({ r: r + quietZone, c: c + quietZone });
          }
        }
      }

      return { totalSize, modules };
    } catch {
      return null;
    }
  }, [value]);

  if (!qrData) {
    return (
      <div
        style={{ width: size, height: size }}
        className="border border-[#695022]/40 bg-white p-1 rounded flex items-center justify-center text-[9px] font-mono text-[#0F291E] text-center"
      >
        QR VERIFIED
      </div>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${qrData.totalSize} ${qrData.totalSize}`}
      shapeRendering="crispEdges"
      className="border border-[#695022]/40 bg-white p-1 rounded shrink-0"
      role="img"
      aria-label={`QR Code for ${value}`}
    >
      <rect width={qrData.totalSize} height={qrData.totalSize} fill="#FFFFFF" />
      {qrData.modules.map(({ r, c }) => (
        <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#0F291E" />
      ))}
    </svg>
  );
};

export const RoyalOfficialSealSvg: React.FC<{ size?: number }> = ({ size = 128 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    className="select-none shrink-0"
    aria-label="الختم الرسمي المعتمد لعائلات الصعيدي"
  >
    <defs>
      <radialGradient id="sealGoldGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FDFBF7" />
        <stop offset="72%" stopColor="#F5EFE0" />
        <stop offset="100%" stopColor="#E6D7B8" />
      </radialGradient>
    </defs>
    <circle
      cx="80"
      cy="80"
      r="74"
      fill="url(#sealGoldGrad)"
      stroke="#695022"
      strokeWidth="3"
    />
    <circle
      cx="80"
      cy="80"
      r="67"
      fill="none"
      stroke="#0F291E"
      strokeWidth="1.5"
      strokeDasharray="4 3"
    />
    <circle cx="80" cy="80" r="60" fill="none" stroke="#695022" strokeWidth="1.2" />
    <polygon
      points="80,22 93,57 130,57 100,79 111,115 80,93 49,115 60,79 30,57 67,57"
      fill="none"
      stroke="#695022"
      strokeWidth="0.7"
      opacity="0.28"
    />
    <text
      x="80"
      y="52"
      textAnchor="middle"
      fill="#0F291E"
      fontSize="8.2"
      fontWeight="700"
    >
      الأمانة العامة لعائلات الصعيدي
    </text>
    <text
      x="80"
      y="66"
      textAnchor="middle"
      fill="#695022"
      fontSize="7.2"
      fontWeight="700"
    >
      ELSAIDY OFFICIAL ARCHIVE
    </text>
    <line x1="44" y1="73" x2="116" y2="73" stroke="#695022" strokeWidth="1" />
    <text
      x="80"
      y="90"
      textAnchor="middle"
      fill="#141413"
      fontSize="11.5"
      fontWeight="700"
      fontFamily="Amiri, serif"
    >
      ختم التوثيق والنسب
    </text>
    <text
      x="80"
      y="105"
      textAnchor="middle"
      fill="#0F291E"
      fontSize="7.8"
      fontWeight="700"
    >
      معتمد ومطابق للسجل العام
    </text>
    <text
      x="80"
      y="119"
      textAnchor="middle"
      fill="#695022"
      fontSize="7.5"
      fontWeight="700"
    >
      elsaidy.org
    </text>
  </svg>
);

export const RoyalTreeEmblemSvg: React.FC = () => (
  <svg
    viewBox="0 0 36 26"
    className="w-9 h-6 rounded border border-[#695022]/40 bg-[#0F291E] shrink-0"
    aria-hidden="true"
  >
    <rect width="36" height="26" fill="#0F291E" />
    <path
      d="M18 4 L23 11 L20 11 L25 18 L11 18 L16 11 L13 11 Z"
      fill="#D4AF37"
      opacity="0.9"
    />
    <rect x="16.5" y="18" width="3" height="5" fill="#C5A059" />
  </svg>
);

export interface CertificateRenderProps {
  record?: {
    serialNumber: string;
    arabicName: string;
    englishName: string;
    familyTitle?: string;
    country: string;
    countryCode?: string;
    regionBranch: string;
    lineageNarrative: string;
    documentType: 'a4-certificate' | 'vip-id';
    issueDateGregorian: string;
    issueDateHijri: string;
    status?: string;
    personalPhotoUrl?: string;
    memberReferenceId?: string;
    ancestralRoot?: string;
    currentResidence?: string;
  };
  serialNumber?: string;
  arabicName?: string;
  englishName?: string;
  familyTitle?: string;
  country?: string;
  regionBranch?: string;
  lineageNarrative?: string;
  documentType?: 'a4-certificate' | 'vip-id';
  issueDateGregorian?: string;
  issueDateHijri?: string;
  personalPhotoUrl?: string;
  memberReferenceId?: string;
  ancestralRoot?: string;
  currentResidence?: string;
  includeFamilyTreeStamp?: boolean;
  customLogoUrl?: string;
  customSealImageUrl?: string;
  customTreeImageUrl?: string;
  siteTitle?: string;
}

export const CertificateDocumentView: React.FC<CertificateRenderProps> = ({
  record,
  serialNumber: propSerial,
  arabicName: propArabicName,
  englishName: propEnglishName,
  familyTitle: propFamilyTitle,
  country: propCountry,
  regionBranch: propRegionBranch,
  lineageNarrative: propNarrative,
  documentType: propDocType,
  issueDateGregorian: propGregorian,
  issueDateHijri: propHijri,
  personalPhotoUrl: propPhotoUrl,
  memberReferenceId: propMemberRefId,
  ancestralRoot: propAncestralRoot,
  currentResidence: propCurrentResidence,
  includeFamilyTreeStamp = true,
  customLogoUrl,
  customSealImageUrl,
  siteTitle,
}) => {
  const serialNumber = record?.serialNumber ?? propSerial ?? 'ELS-2026-EG-001';
  const arabicName = record?.arabicName ?? propArabicName ?? 'علي أحمد علي الصعيدي';
  const englishName = record?.englishName ?? propEnglishName ?? 'Ali Ahmed Ali Elsaidy';
  const effectiveFamilyTitle =
    (record?.familyTitle ?? propFamilyTitle ?? 'الصعيدي').trim() || 'الصعيدي';
  const country = record?.country ?? propCountry ?? 'جمهورية مصر العربية';
  const regionBranch =
    record?.regionBranch ?? propRegionBranch ?? 'محافظة الغربية - مدينة طنطا / القاهرة الكبرى';
  const lineageNarrative =
    record?.lineageNarrative ??
    propNarrative ??
    `ينتسب إلى الذرية الموثقة لعائلات ${effectiveFamilyTitle} (آل ${effectiveFamilyTitle}) ذات الجذور العربية الأصيلة المتصلة بقبيلة جهينة القضاعية وامتدادها التاريخي العريق في الديار المصرية والأقطار العربية.`;
  const documentType = record?.documentType ?? propDocType ?? 'a4-certificate';
  const issueDateGregorian = record?.issueDateGregorian ?? propGregorian ?? '2026-10-22';
  const issueDateHijri = record?.issueDateHijri ?? propHijri ?? '١١ ربيع الآخر ١٤٤٨ هـ';

  const safePhotoUrl = sanitizeSafeUrl(record?.personalPhotoUrl ?? propPhotoUrl);
  const safeLogoUrl = sanitizeSafeUrl(customLogoUrl);
  const safeSealUrl = sanitizeSafeUrl(customSealImageUrl);

  const memberReferenceId =
    (record?.memberReferenceId ?? propMemberRefId ?? '').trim() ||
    `REG-${serialNumber.replace(/^ELS-\d+-/, '')}`;
  const ancestralRoot =
    (record?.ancestralRoot ?? propAncestralRoot ?? '').trim() ||
    'الجد السابع إبراهيم الصعيدي الجهني — عمود النسب الموثق';
  const currentResidence =
    (record?.currentResidence ?? propCurrentResidence ?? '').trim() ||
    `${country} — ${regionBranch}`;

  const directVerifyUrl = `https://elsaidy.org/verify/${serialNumber}`;
  const displayVerifyLink = `elsaidy.org/verify/${serialNumber}`;

  if (documentType === 'a4-certificate') {
    return (
      <div className="print-certificate-canvas relative bg-[#FCFBF7] text-[#141413] border-4 border-double border-[#695022] rounded-xl p-5 sm:p-9 shadow-2xl overflow-hidden">
        <div className="pointer-events-none absolute inset-3 border border-[#695022]/40 rounded-lg" />
        <div className="pointer-events-none absolute inset-5 border border-[#0F291E]/20 rounded" />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04] select-none">
          <span className="font-serif text-[72px] sm:text-[130px] font-bold text-[#0F291E] -rotate-12">
            آل {effectiveFamilyTitle}
          </span>
        </div>

        <div className="relative z-10 text-center border-b-2 border-[#695022]/30 pb-5 mb-5">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-[#4A4946] mb-3">
            <div className="flex items-center gap-2.5 text-right">
              {safeLogoUrl ? (
                <img
                  src={safeLogoUrl}
                  alt="شعار البوابة"
                  loading="lazy"
                  decoding="async"
                  className="w-10 h-10 object-contain rounded-lg border border-[#695022]/40 bg-white p-0.5"
                />
              ) : null}
              <div>
                <div>{siteTitle || `الأمانة العامة لتجمع عائلات ${effectiveFamilyTitle}`}</div>
                <div className="text-[#695022]" dir="ltr">
                  ELSAIDY OFFICIAL ARCHIVE &amp; REGISTRY
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F291E] text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold">
              <span>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            </div>

            <div className="text-left" dir="ltr">
              <div>REF: {serialNumber}</div>
              <div className="text-[#0F291E]">ID: {memberReferenceId}</div>
              <div className="text-[#695022]">DATE: {issueDateGregorian}</div>
            </div>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#0F291E] mt-2 mb-1.5">
            شهادة توثيق نسب وعضوية شرفية معتمدة
          </h2>
          <p
            className="text-xs sm:text-sm font-bold tracking-widest text-[#695022] uppercase"
            dir="ltr"
          >
            OFFICIAL CERTIFICATE OF LINEAGE &amp; HONORARY FAMILY MEMBERSHIP
          </p>
        </div>

        <div className="relative z-10 text-center space-y-4 my-5 px-2 sm:px-6">
          <p className="font-serif text-base sm:text-xl text-[#2A2A28] leading-relaxed">
            تشهد لجنة التوثيق التاريخي والأنساب بالأمانة العامة للموقع الرسمي لعائلات{' '}
            {effectiveFamilyTitle} في الوطن العربي ومجموعة الصعيدي (
            <span className="font-bold text-[#0F291E]" dir="ltr">
              elsaidy.org
            </span>
            ) بأن السيد / العلم الموثق:
          </p>

          <div className="py-3.5 px-5 sm:px-7 bg-[#F4F1E8] border-y-2 border-[#695022]/50 rounded-xl inline-flex flex-col sm:flex-row items-center justify-center gap-4 max-w-full sm:min-w-[440px]">
            {safePhotoUrl && (
              <img
                src={safePhotoUrl}
                alt={arabicName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-[#695022] bg-white shadow-sm shrink-0"
              />
            )}
            <div className="text-center">
              <div className="inline-flex items-center justify-center gap-2">
                <span className="font-serif text-2xl sm:text-4xl font-bold text-[#0F291E]">
                  {arabicName || 'الاسم الكامل لصاحب الشهادة'}
                </span>
                <span
                  title="هوية موثقة ومطابقة للسجل العام"
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#0F291E] text-[#D4AF37] text-xs font-bold shrink-0"
                >
                  ✓
                </span>
              </div>
              {englishName && (
                <div
                  className="text-sm sm:text-base font-bold text-[#695022] tracking-wide mt-0.5"
                  dir="ltr"
                >
                  {englishName}
                </div>
              )}
            </div>
          </div>

          {/* Primary & Anti-Collision Identity Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-3xl mx-auto text-right bg-white/95 border border-[#E6E2D8] rounded-xl p-3.5">
            <div>
              <span className="text-[11px] font-bold text-[#695022] block">
                اللقب / العائلة المعتمدة:
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[#0F291E]">
                عائلات {effectiveFamilyTitle} (آل {effectiveFamilyTitle})
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#695022] block">
                الدولة والإقليم المعتمد:
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#141413]">{country}</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#695022] block">
                الفرع الجغرافي والحاضرة:
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#141413]">{regionBranch}</span>
            </div>
            <div className="pt-2 border-t border-[#E6E2D8]/80">
              <span className="text-[11px] font-bold text-[#695022] block">
                رقم القيد العائلي المميز (لمنع تشابه الأسماء):
              </span>
              <span className="text-xs sm:text-sm font-mono font-extrabold text-[#0F291E]" dir="ltr">
                {memberReferenceId}
              </span>
            </div>
            <div className="pt-2 border-t border-[#E6E2D8]/80">
              <span className="text-[11px] font-bold text-[#695022] block">
                الجد الجامع / الفخذ التفصيلي:
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#141413]">{ancestralRoot}</span>
            </div>
            <div className="pt-2 border-t border-[#E6E2D8]/80">
              <span className="text-[11px] font-bold text-[#695022] block">
                محل الإقامة الموثق:
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#141413]">
                {currentResidence}
              </span>
            </div>
          </div>

          <p className="font-serif text-base sm:text-lg leading-[1.95] text-[#141413] max-w-3xl mx-auto text-justify bg-[#FAF8F3] p-4 rounded-xl border border-[#E6E2D8]">
            {lineageNarrative}
          </p>

          <p className="text-xs font-semibold text-[#4A4946]">
            وقد حُررت هذه الشهادة الرسمية بعد مطابقة المشجرات التاريخية والمراجع الموثقة
            وسجلات الأمانة العامة لعائلات {effectiveFamilyTitle} (آل {effectiveFamilyTitle})،
            وتُعد وثيقة معتمدة قابلة للتحقق الرقمي المباشر عبر البوابة الرسمية.
          </p>
        </div>

        <div className="relative z-10 mt-6 pt-5 border-t-2 border-[#695022]/30 grid grid-cols-1 sm:grid-cols-3 items-center gap-6">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div className="flex items-center gap-3">
              <DeterministicQrSvg value={directVerifyUrl} size={84} />
              <div className="text-right">
                <div className="text-[11px] font-bold text-[#0F291E]">
                  رمز التحقق الرقمي (QR)
                </div>
                <div className="text-xs font-mono font-bold text-[#695022]" dir="ltr">
                  {serialNumber}
                </div>
                <div className="text-[11px] text-[#4A4946] mt-0.5">
                  التاريخ الهجري: {issueDateHijri}
                </div>
                <div className="text-[10px] font-mono font-bold text-[#0F291E] mt-0.5" dir="ltr">
                  {displayVerifyLink}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            {safeSealUrl ? (
              <img
                src={safeSealUrl}
                alt="الختم الرسمي المعتمد"
                loading="lazy"
                decoding="async"
                className="w-28 h-28 object-contain"
              />
            ) : (
              <RoyalOfficialSealSvg size={122} />
            )}
          </div>

          <div className="flex flex-col items-center sm:items-end text-center sm:text-left">
            {includeFamilyTreeStamp && (
              <div className="mb-2 flex items-center gap-2 bg-[#F4F1E8] border border-[#695022]/40 rounded-lg px-2.5 py-1.5 shadow-2xs">
                <RoyalTreeEmblemSvg />
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#0F291E] text-[#D4AF37] shrink-0">
                  <svg
                    viewBox="0 0 20 20"
                    className="w-3 h-3 fill-current"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="text-[10px] font-bold text-[#0F291E]">
                  مطابق للمشجرة المرجعية الموثقة
                </span>
              </div>
            )}
            <div className="text-xs font-bold text-[#695022]">
              اعتماد الأمانة العامة ولجنة الأنساب
            </div>
            <div className="font-serif text-lg font-bold text-[#0F291E] mt-1">
              الأمانة العامة لعائلات {effectiveFamilyTitle}
            </div>
            <div className="text-[11px] font-semibold text-[#4A4946]">
              الموقع الرسمي ومجموعة الصعيدي — elsaidy.org
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="print-certificate-canvas max-w-2xl mx-auto">
      <div className="relative bg-gradient-to-br from-[#0F291E] via-[#133527] to-[#0A141D] text-white rounded-2xl p-5 sm:p-8 border-2 border-[#D4AF37]/60 shadow-2xl overflow-hidden">
        <div className="pointer-events-none absolute -left-12 -bottom-12 w-56 h-56 rounded-full bg-[#D4AF37]/10 blur-2xl" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4 mb-5">
          <div className="flex items-center gap-3">
            {safeLogoUrl ? (
              <img
                src={safeLogoUrl}
                alt="شعار البوابة"
                loading="lazy"
                decoding="async"
                className="w-10 h-10 object-contain rounded-lg border border-[#D4AF37]/50 bg-white/10 p-0.5"
              />
            ) : null}
            <div>
              <div className="text-[11px] font-bold tracking-widest text-[#D4AF37] uppercase">
                ELSAIDY FAMILY OFFICIAL VIP ID
              </div>
              <h3 className="font-serif text-lg sm:text-2xl font-bold text-white mt-0.5">
                بطاقة العضوية والنسب الرسمية — عائلات {effectiveFamilyTitle} (آل {effectiveFamilyTitle})
              </h3>
            </div>
          </div>
          <div className="px-3 py-1 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-mono font-bold">
            {serialNumber}
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          <div className="sm:col-span-8 space-y-3 text-right">
            <div className="flex items-center gap-3.5">
              {safePhotoUrl && (
                <img
                  src={safePhotoUrl}
                  alt={arabicName}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-[#D4AF37] bg-white shrink-0"
                />
              )}
              <div>
                <span className="text-[11px] text-[#D4AF37] font-bold block">
                  الاسم الكامل المعتمد:
                </span>
                <div className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                  <span>{arabicName}</span>
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#D4AF37] text-[#0F291E] text-[10px] font-bold">
                    ✓
                  </span>
                </div>
                <div className="text-xs font-bold text-[#E6DFD3]" dir="ltr">
                  {englishName}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <div className="bg-white/5 border border-white/10 rounded-lg p-2.5">
                <span className="text-[10px] text-[#D4AF37] font-bold block">
                  الدولة / الإقليم:
                </span>
                <span className="text-xs font-bold text-white">{country}</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-2.5">
                <span className="text-[10px] text-[#D4AF37] font-bold block">
                  الفرع والحاضرة:
                </span>
                <span className="text-xs font-bold text-white">{regionBranch}</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-2.5">
                <span className="text-[10px] text-[#D4AF37] font-bold block">
                  رقم القيد العائلي:
                </span>
                <span className="text-xs font-mono font-bold text-white" dir="ltr">
                  {memberReferenceId}
                </span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-2.5">
                <span className="text-[10px] text-[#D4AF37] font-bold block">
                  محل الإقامة الموثق:
                </span>
                <span className="text-xs font-bold text-white">{currentResidence}</span>
              </div>
            </div>

            <div className="text-[11px] text-[#E6DFD3] leading-relaxed bg-black/20 rounded-lg p-3 border border-white/10 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#D4AF37] text-[#0F291E] shrink-0">
                <svg viewBox="0 0 20 20" className="w-3 h-3 fill-current" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span>
                عضو موثق بسجلات الأمانة العامة لعائلات {effectiveFamilyTitle} (آل {effectiveFamilyTitle}) — elsaidy.org
              </span>
            </div>
          </div>

          <div className="sm:col-span-4 flex flex-col items-center justify-center bg-white rounded-xl p-3 text-[#141413]">
            <DeterministicQrSvg value={directVerifyUrl} size={92} />
            <span className="text-[10px] font-bold text-[#0F291E] mt-1.5">
              امسح للتحقق الرقمي الفوري
            </span>
            <span
              className="text-[9px] font-mono font-bold text-[#695022] break-all text-center"
              dir="ltr"
            >
              {displayVerifyLink}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
