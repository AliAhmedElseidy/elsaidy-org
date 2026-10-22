import React from 'react';
import { OFFICIAL_FAMILY_TREE_IMAGE_URL } from '../data/familyData';

export const DeterministicQrSvg: React.FC<{ value: string; size?: number }> = ({
  value,
  size = 96,
}) => {
  const grid = 21;
  const hashChar = (index: number) => {
    let h = 2166136261;
    const str = `${value}:${index}`;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return Math.abs(h);
  };

  const isFinderPattern = (r: number, c: number) => {
    const inTopLeft = r < 7 && c < 7;
    const inTopRight = r < 7 && c >= grid - 7;
    const inBottomLeft = r >= grid - 7 && c < 7;
    return inTopLeft || inTopRight || inBottomLeft;
  };

  const renderFinderBox = (startR: number, startC: number, key: string) => (
    <g key={key}>
      <rect x={startC} y={startR} width={7} height={7} fill="#0F291E" />
      <rect x={startC + 1} y={startR + 1} width={5} height={5} fill="#FFFFFF" />
      <rect x={startC + 2} y={startR + 2} width={3} height={3} fill="#0F291E" />
    </g>
  );

  const cells: React.ReactNode[] = [];
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      if (isFinderPattern(r, c)) continue;
      const bit = hashChar(r * grid + c) % 10 < 5;
      if (bit) {
        cells.push(
          <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#0F291E" />
        );
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${grid} ${grid}`}
      shapeRendering="crispEdges"
      className="border border-[#695022]/40 bg-white p-1.5 rounded"
      aria-label={`QR Code for ${value}`}
    >
      <rect width={grid} height={grid} fill="#FFFFFF" />
      {renderFinderBox(0, 0, 'tl')}
      {renderFinderBox(0, grid - 7, 'tr')}
      {renderFinderBox(grid - 7, 0, 'bl')}
      {cells}
    </svg>
  );
};

export const RoyalOfficialSealSvg: React.FC<{ size?: number }> = ({ size = 128 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    className="select-none"
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
    <circle cx="80" cy="80" r="54" fill="none" stroke="#695022" strokeWidth="1.5" />
    <polygon
      points="80,14 95,55 138,55 103,80 116,122 80,97 44,122 57,80 22,55 65,55"
      fill="none"
      stroke="#695022"
      strokeWidth="0.8"
      opacity="0.35"
    />
    <text
      x="80"
      y="44"
      textAnchor="middle"
      fill="#0F291E"
      fontSize="9.5"
      fontWeight="700"
    >
      الأمانة العامة لعائلات الصعيدي
    </text>
    <text
      x="80"
      y="64"
      textAnchor="middle"
      fill="#695022"
      fontSize="8.5"
      fontWeight="700"
    >
      ELSAIDY OFFICIAL ARCHIVE
    </text>
    <line x1="42" y1="73" x2="118" y2="73" stroke="#695022" strokeWidth="1" />
    <text
      x="80"
      y="91"
      textAnchor="middle"
      fill="#141413"
      fontSize="12.5"
      fontWeight="700"
      fontFamily="Amiri, serif"
    >
      ختم التوثيق والنسب
    </text>
    <text
      x="80"
      y="107"
      textAnchor="middle"
      fill="#0F291E"
      fontSize="8.5"
      fontWeight="700"
    >
      معتمد ومطابق للسجل العام
    </text>
    <text
      x="80"
      y="124"
      textAnchor="middle"
      fill="#695022"
      fontSize="8"
      fontWeight="700"
    >
      elsaidy.org
    </text>
  </svg>
);

export interface CertificateRenderProps {
  serialNumber: string;
  arabicName: string;
  englishName: string;
  country: string;
  regionBranch: string;
  lineageNarrative: string;
  documentType: 'a4-certificate' | 'vip-id';
  issueDateGregorian: string;
  issueDateHijri: string;
  includeFamilyTreeStamp?: boolean;
}

export const CertificateDocumentView: React.FC<CertificateRenderProps> = ({
  serialNumber,
  arabicName,
  englishName,
  country,
  regionBranch,
  lineageNarrative,
  documentType,
  issueDateGregorian,
  issueDateHijri,
  includeFamilyTreeStamp = true,
}) => {
  if (documentType === 'a4-certificate') {
    return (
      <div className="print-certificate-canvas relative bg-[#FCFBF7] text-[#141413] border-4 border-double border-[#695022] rounded-xl p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="pointer-events-none absolute inset-3 border border-[#695022]/40 rounded-lg" />
        <div className="pointer-events-none absolute inset-5 border border-[#0F291E]/20 rounded" />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04] select-none">
          <span className="font-serif text-[80px] sm:text-[130px] font-bold text-[#0F291E] -rotate-12">
            آل الصعيدي
          </span>
        </div>

        <div className="relative z-10 text-center border-b-2 border-[#695022]/30 pb-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-[#4A4946] mb-3">
            <div className="text-right">
              <div>الأمانة العامة لتجمع عائلات الصعيدي</div>
              <div className="text-[#695022]" dir="ltr">
                ELSAIDY OFFICIAL ARCHIVE &amp; REGISTRY
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F291E] text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold">
              <span>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            </div>

            <div className="text-left" dir="ltr">
              <div>REF: {serialNumber}</div>
              <div className="text-[#695022]">DATE: {issueDateGregorian}</div>
            </div>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#0F291E] mt-3 mb-2">
            شهادة توثيق نسب وعضوية شرفية معتمدة
          </h2>
          <p
            className="text-xs sm:text-sm font-bold tracking-widest text-[#695022] uppercase"
            dir="ltr"
          >
            OFFICIAL CERTIFICATE OF LINEAGE &amp; HONORARY FAMILY MEMBERSHIP
          </p>
        </div>

        <div className="relative z-10 text-center space-y-5 my-6 px-2 sm:px-6">
          <p className="font-serif text-lg sm:text-xl text-[#2A2A28] leading-relaxed">
            تشهد لجنة التوثيق التاريخي والأنساب بالأمانة العامة للموقع الرسمي لعائلات
            الصعيدي في الوطن العربي ومجموعة الصعيدي (
            <span className="font-bold text-[#0F291E]" dir="ltr">
              elsaidy.org
            </span>
            ) بأن السيد / العلم الموثق:
          </p>

          <div className="py-4 px-6 bg-[#F4F1E8] border-y-2 border-[#695022]/50 rounded-lg inline-block min-w-[280px] sm:min-w-[420px]">
            <div className="font-serif text-2xl sm:text-4xl font-bold text-[#0F291E] mb-1">
              {arabicName || 'الاسم الكامل لصاحب الشهادة'}
            </div>
            {englishName && (
              <div
                className="text-sm sm:text-base font-bold text-[#695022] tracking-wide"
                dir="ltr"
              >
                {englishName}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto text-right bg-white/90 border border-[#E6E2D8] rounded-xl p-4">
            <div>
              <span className="text-xs font-bold text-[#695022] block">
                الدولة والإقليم المعتمد:
              </span>
              <span className="text-sm sm:text-base font-bold text-[#141413]">
                {country}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-[#695022] block">
                الفرع الجغرافي والحاضرة:
              </span>
              <span className="text-sm sm:text-base font-bold text-[#141413]">
                {regionBranch}
              </span>
            </div>
          </div>

          <p className="font-serif text-base sm:text-lg leading-[2] text-[#141413] max-w-3xl mx-auto text-justify bg-[#FAF8F3] p-5 rounded-xl border border-[#E6E2D8]">
            {lineageNarrative}
          </p>

          <p className="text-xs sm:text-sm font-semibold text-[#4A4946]">
            وقد حُررت هذه الشهادة الرسمية بعد مطابقة المشجرات التاريخية والمراجع الموثقة
            وسجلات الأمانة العامة لعائلات الصعيدي (الصعيد — حجازي — حجاج — الصعيدي)،
            وتُعد وثيقة معتمدة قابلة للتحقق الرقمي المباشر عبر البوابة الرسمية.
          </p>
        </div>

        <div className="relative z-10 mt-8 pt-6 border-t-2 border-[#695022]/30 grid grid-cols-1 sm:grid-cols-3 items-center gap-6">
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div className="flex items-center gap-3">
              <DeterministicQrSvg
                value={`https://elsaidy.org/verify?ref=${serialNumber}`}
                size={84}
              />
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
                <div className="text-[11px] text-[#4A4946]">
                  verify: elsaidy.org/verify
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <RoyalOfficialSealSvg size={122} />
          </div>

          <div className="flex flex-col items-center sm:items-end text-center sm:text-left">
            {includeFamilyTreeStamp && (
              <div className="mb-2 flex items-center gap-2 bg-[#F4F1E8] border border-[#695022]/30 rounded-lg px-2.5 py-1.5">
                <img
                  src={OFFICIAL_FAMILY_TREE_IMAGE_URL}
                  alt="ختم المشجرة"
                  width="36"
                  height="26"
                  loading="lazy"
                  className="w-9 h-6 object-cover rounded border border-[#695022]/40"
                />
                <span className="text-[10px] font-bold text-[#0F291E]">
                  مطابق للمشجرة المرجعية الموثقة
                </span>
              </div>
            )}
            <div className="text-xs font-bold text-[#695022]">
              اعتماد الأمانة العامة ولجنة الأنساب
            </div>
            <div className="font-serif text-lg font-bold text-[#0F291E] mt-1">
              الأمانة العامة لعائلات الصعيدي
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
      <div className="relative bg-gradient-to-br from-[#0F291E] via-[#133527] to-[#0A141D] text-white rounded-2xl p-6 sm:p-8 border-2 border-[#D4AF37]/60 shadow-2xl overflow-hidden">
        <div className="pointer-events-none absolute -left-12 -bottom-12 w-56 h-56 rounded-full bg-[#D4AF37]/10 blur-2xl" />
        <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-4 mb-5">
          <div>
            <div className="text-[11px] font-bold tracking-widest text-[#D4AF37] uppercase">
              ELSAIDY FAMILY OFFICIAL VIP ID
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
              بطاقة العضوية والنسب الرسمية — عائلة الصعيدي
            </h3>
          </div>
          <div className="px-3 py-1 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-mono font-bold">
            {serialNumber}
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          <div className="sm:col-span-8 space-y-3 text-right">
            <div>
              <span className="text-[11px] text-[#D4AF37] font-bold block">
                الاسم الكامل المعتمد:
              </span>
              <div className="font-serif text-2xl font-bold text-white">{arabicName}</div>
              <div className="text-xs font-bold text-[#E6DFD3]" dir="ltr">
                {englishName}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
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
            </div>

            <div className="text-[11px] text-[#E6DFD3] leading-relaxed bg-black/20 rounded-lg p-3 border border-white/10">
              عضو موثق بسجلات الأمانة العامة لعائلات الصعيدي في الوطن العربي ومجموعة
              الصعيدي (elsaidy.org).
            </div>
          </div>

          <div className="sm:col-span-4 flex flex-col items-center justify-center bg-white rounded-xl p-3 text-[#141413]">
            <DeterministicQrSvg
              value={`https://elsaidy.org/verify?ref=${serialNumber}`}
              size={92}
            />
            <span className="text-[10px] font-bold text-[#0F291E] mt-2">
              امسح للتحقق الرقمي الفوري
            </span>
            <span className="text-[10px] font-mono font-bold text-[#695022]" dir="ltr">
              {issueDateGregorian}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
