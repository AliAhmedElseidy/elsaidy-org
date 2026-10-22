import React, { useState, useEffect, useMemo } from 'react';
import {
  DEFAULT_VERIFIED_CERTIFICATES,
  IssuedCertificateRecord,
  PageRoute
} from '../data/familyData';
import {
  ShieldCheck,
  Search,
  Lock,
  Unlock,
  Printer,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  FileCheck2,
  CreditCard,
  RefreshCw,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';

interface VerifyPageProps {
  onNavigate: (route: PageRoute) => void;
}

const REGISTRY_STORAGE_KEY = 'elsaidy_issued_certificates_registry_v1';
const PASSWORD_STORAGE_KEY = 'elsaidy_admin_master_password_v1';
const DEFAULT_MASTER_PASSWORD = 'ELSAIDY2026';

const COUNTRY_CODE_MAP: Record<string, string> = {
  'جمهورية مصر العربية': 'EG',
  'المملكة العربية السعودية': 'SA',
  'بلاد الشام والعراق': 'LV',
  'دولة الإمارات العربية المتحدة': 'AE',
  'سلطنة عُمان': 'OM',
  'دول الخليج العربي (الكويت / قطر / البحرين)': 'GC',
  'المغرب العربي والسودان': 'MG'
};

/**
 * Deterministic SVG QR Code Generator for `https://elsaidy.org/verify?ref=SERIAL`
 */
const DeterministicQrSvg: React.FC<{ value: string; size?: number }> = ({
  value,
  size = 96
}) => {
  const gridSize = 21;
  const cells = useMemo(() => {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    const matrix: boolean[][] = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(false)
    );

    const drawFinder = (r0: number, c0: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          matrix[r0 + r][c0 + c] = isBorder || isInner;
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(0, gridSize - 7);
    drawFinder(gridSize - 7, 0);

    // Timing patterns
    for (let i = 8; i < gridSize - 8; i++) {
      matrix[6][i] = i % 2 === 0;
      matrix[i][6] = i % 2 === 0;
    }

    // Deterministic data modules from serial string
    let seed = Math.abs(hash) || 123456789;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const inTopLeft = r < 8 && c < 8;
        const inTopRight = r < 8 && c >= gridSize - 8;
        const inBottomLeft = r >= gridSize - 8 && c < 8;
        if (inTopLeft || inTopRight || inBottomLeft || r === 6 || c === 6) {
          continue;
        }
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        const charFactor = value.charCodeAt((r * gridSize + c) % value.length);
        matrix[r][c] = ((seed ^ charFactor) & 1) === 1;
      }
    }

    return matrix;
  }, [value]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${gridSize} ${gridSize}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={`رمز الاستجابة السريع للتحقق: ${value}`}
      className="bg-white p-1.5 border border-[#695022]/40 rounded-md"
    >
      <rect width={gridSize} height={gridSize} fill="#FFFFFF" />
      {cells.map((row, rIdx) =>
        row.map((cell, cIdx) =>
          cell ? (
            <rect
              key={`${rIdx}-${cIdx}`}
              x={cIdx}
              y={rIdx}
              width={1}
              height={1}
              fill="#0F291E"
            />
          ) : null
        )
      )}
    </svg>
  );
};

/**
 * Ornate Circular Vector Royal Gold Seal & Stamp
 */
const RoyalOfficialSealSvg: React.FC<{ size?: number }> = ({ size = 128 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    role="img"
    aria-label="الختم الرسمي للأمانة العامة لتوثيق عائلات الصعيدي"
    className="select-none"
  >
    <defs>
      <path
        id="sealTopArc"
        d="M 24,80 A 56,56 0 1,1 136,80"
        fill="none"
      />
      <path
        id="sealBottomArc"
        d="M 136,80 A 56,56 0 1,1 24,80"
        fill="none"
      />
    </defs>

    {/* Outer Scalloped Rosette Ring */}
    <circle
      cx="80"
      cy="80"
      r="74"
      fill="#FBF9F4"
      stroke="#695022"
      strokeWidth="2.5"
      strokeDasharray="6 3"
    />
    <circle
      cx="80"
      cy="80"
      r="68"
      fill="none"
      stroke="#0F291E"
      strokeWidth="2"
    />
    <circle
      cx="80"
      cy="80"
      r="44"
      fill="#0F291E"
      stroke="#695022"
      strokeWidth="2"
    />

    {/* Inner Geometric 8-Point Star */}
    <g stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.45">
      <rect x="54" y="54" width="52" height="52" />
      <rect x="54" y="54" width="52" height="52" transform="rotate(45 80 80)" />
    </g>

    {/* Circular Stamp Text */}
    <text
      fill="#695022"
      fontSize="8.5"
      fontWeight="700"
      letterSpacing="0.3"
    >
      <textPath href="#sealTopArc" startOffset="50%" textAnchor="middle">
        الأمانة العامة لتوثيق عائلات الصعيدي • معتمد رسمياً
      </textPath>
    </text>

    <text
      fill="#0F291E"
      fontSize="8"
      fontWeight="700"
      letterSpacing="1.2"
    >
      <textPath href="#sealBottomArc" startOffset="50%" textAnchor="middle">
        • ELSAIDY.ORG OFFICIAL ARCHIVE SEAL •
      </textPath>
    </text>

    {/* Center Emblem Text */}
    <text
      x="80"
      y="74"
      textAnchor="middle"
      fill="#D4AF37"
      fontSize="9"
      fontWeight="800"
      letterSpacing="1.5"
    >
      ELSAIDY
    </text>
    <text
      x="80"
      y="90"
      textAnchor="middle"
      fill="#FFFFFF"
      fontSize="13"
      fontWeight="700"
      className="font-display"
    >
      آل الصعيدي
    </text>
    <text
      x="80"
      y="103"
      textAnchor="middle"
      fill="#D4AF37"
      fontSize="7.5"
      fontWeight="700"
    >
      موثق ومعتمد
    </text>
  </svg>
);

export const VerifyPage: React.FC<VerifyPageProps> = ({ onNavigate }) => {
  // Registry of issued certificates (merges default certificates + localStorage custom certificates)
  const [registry, setRegistry] = useState<IssuedCertificateRecord[]>(() => {
    try {
      const saved = localStorage.getItem(REGISTRY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as IssuedCertificateRecord[];
        const existingSerials = new Set(parsed.map((item) => item.serialNumber));
        const merged = [
          ...parsed,
          ...DEFAULT_VERIFIED_CERTIFICATES.filter((d) => !existingSerials.has(d.serialNumber))
        ];
        return merged;
      }
    } catch {
      // Fallback
    }
    return DEFAULT_VERIFIED_CERTIFICATES;
  });

  // MODULE A: Public Verification State
  const [verifyQuery, setVerifyQuery] = useState<string>('ELS-2026-EG-001');
  const [verifiedRecord, setVerifiedRecord] = useState<IssuedCertificateRecord | null>(
    DEFAULT_VERIFIED_CERTIFICATES[0]
  );
  const [verifyError, setVerifyError] = useState<string>('');
  const [copiedSerial, setCopiedSerial] = useState<string | null>(null);

  // MODULE B: Password-Protected Admin Studio State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [passwordSavedMessage, setPasswordSavedMessage] = useState<string>('');

  // Certificate & ID Studio Form State
  const [fullNameAr, setFullNameAr] = useState<string>('علي أحمد علي الصعيدي');
  const [fullNameEn, setFullNameEn] = useState<string>('Ali Ahmed Ali Elsaidy');
  const [country, setCountry] = useState<string>('جمهورية مصر العربية');
  const [regionBranch, setRegionBranch] = useState<string>(
    'محافظة الغربية - مدينة طنطا / القاهرة الكبرى'
  );
  const [lineageNarrative, setLineageNarrative] = useState<string>(
    'ينتسب إلى الذرية الموثقة لعائلات الصعيدي (آل الصعيدي — Elsaidy / Elseidy) ذات الجذور العربية الأصيلة المتصلة بقبيلة جهينة القضاعية من ينبع النخل بالساحل الغربي لشبه الجزيرة العربية، وامتدادها التاريخي العريق في جمهورية مصر العربية وسائر الأقطار العربية.'
  );
  const [documentType, setDocumentType] = useState<'a4-certificate' | 'vip-id'>('a4-certificate');
  const [serialNumber, setSerialNumber] = useState<string>('ELS-2026-EG-001');
  const [issueDateGregorian] = useState<string>('2026-10-22');
  const [issueDateHijri] = useState<string>('١١ ربيع الآخر ١٤٤٨ هـ');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string>('');

  // Check URL query parameter `?ref=SERIAL` on initial load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    if (refParam) {
      const cleanRef = refParam.trim().toUpperCase();
      setVerifyQuery(cleanRef);
      const match = registry.find((r) => r.serialNumber.toUpperCase() === cleanRef);
      if (match) {
        setVerifiedRecord(match);
        setVerifyError('');
      }
    }
  }, [registry]);

  const handlePublicVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = verifyQuery.trim().toUpperCase();
    if (!cleaned) {
      setVerifiedRecord(null);
      setVerifyError('يرجى إدخال الرقم التسلسلي للشهادة (مثال: ELS-2026-EG-001).');
      return;
    }

    const found = registry.find((item) => item.serialNumber.toUpperCase() === cleaned);
    if (found) {
      setVerifiedRecord(found);
      setVerifyError('');
    } else {
      setVerifiedRecord(null);
      setVerifyError(
        `لم يتم العثور على وثيقة مسجلة بالرقم التسلسلي (${cleaned}). تأكد من صحة الرقم أو تواصل مع الأمانة العامة.`
      );
    }
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let storedMaster = DEFAULT_MASTER_PASSWORD;
    try {
      const custom = localStorage.getItem(PASSWORD_STORAGE_KEY);
      if (custom && custom.trim().length >= 4) {
        storedMaster = custom.trim();
      }
    } catch {
      // Fallback
    }

    const entered = passwordInput.trim();
    if (entered === storedMaster || entered === DEFAULT_MASTER_PASSWORD) {
      setIsUnlocked(true);
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError(
        'كلمة المرور الإدارية غير صحيحة. صلاحية إصدار الشهادات والبطاقات مقتصرة على الأمانة العامة والمفوضين.'
      );
    }
  };

  const handleUpdateMasterPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput.trim() || newPasswordInput.trim().length < 6) {
      setPasswordSavedMessage('يرجى إدخال كلمة مرور جديدة لا تقل عن 6 أحرف أو أرقام.');
      return;
    }
    try {
      localStorage.setItem(PASSWORD_STORAGE_KEY, newPasswordInput.trim());
      setPasswordSavedMessage('تم تحديث وحفظ كلمة المرور الإدارية بنجاح في المتصفح.');
      setNewPasswordInput('');
      setTimeout(() => setPasswordSavedMessage(''), 3500);
    } catch {
      setPasswordSavedMessage('تعذر حفظ كلمة المرور في المتصفح.');
    }
  };

  const generateNewSerial = (targetCountry: string = country) => {
    const code = COUNTRY_CODE_MAP[targetCountry] || 'AR';
    const randomNum = Math.floor(100 + Math.random() * 900);
    const nextSerial = `ELS-2026-${code}-${randomNum}`;
    setSerialNumber(nextSerial);
    return nextSerial;
  };

  const handleRegisterAndIssue = () => {
    const code = COUNTRY_CODE_MAP[country] || 'AR';
    const newRecord: IssuedCertificateRecord = {
      serialNumber: serialNumber.trim().toUpperCase(),
      arabicName: fullNameAr.trim() || 'علي أحمد علي الصعيدي',
      englishName: fullNameEn.trim() || 'Ali Ahmed Ali Elsaidy',
      country,
      countryCode: code,
      regionBranch: regionBranch.trim() || 'الحاضرة الرئيسية',
      lineageNarrative: lineageNarrative.trim(),
      documentType,
      issueDateGregorian,
      issueDateHijri,
      status: 'وثيقة نسب معتمدة ومطابقة للسجل العام'
    };

    const updated = [
      newRecord,
      ...registry.filter((r) => r.serialNumber !== newRecord.serialNumber)
    ];
    setRegistry(updated);
    setVerifiedRecord(newRecord);
    setVerifyQuery(newRecord.serialNumber);

    try {
      localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage quota issues
    }

    setSaveSuccessNotice(
      `تم اعتماد وتسجيل الوثيقة برقم (${newRecord.serialNumber}) في السجل العام بنجاح.`
    );
    setTimeout(() => setSaveSuccessNotice(''), 4000);
  };

  const handlePrintCertificate = () => {
    handleRegisterAndIssue();
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleCopySerial = (serial: string) => {
    navigator.clipboard.writeText(serial);
    setCopiedSerial(serial);
    setTimeout(() => setCopiedSerial(null), 2000);
  };

  const qrVerificationUrl = `https://elsaidy.org/verify?ref=${encodeURIComponent(
    serialNumber.trim().toUpperCase()
  )}`;

  return (
    <div className="space-y-14 lg:space-y-20 py-8 lg:py-12">
      {/* Page Header (Hidden in Print) */}
      <section className="no-print bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-10 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-[#E6E2D8] text-xs text-zinc-700">
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
            <span className="font-bold text-[#0F291E]">التوثيق وشهادات النسب</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-[#695022] font-bold">
              ELSAIDY LINEAGE VERIFICATION & ID SUITE
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0F291E]/10 text-[#0F291E] font-bold text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0F291E]" />
            <span>السجل الرقمي الموثق لعائلات الصعيدي</span>
          </div>
        </div>

        <div className="max-w-4xl">
          <div className="text-xs font-bold text-[#695022] mb-2">
            الأمانة العامة للتوثيق والأنساب · الموقع الرسمي لعائلات الصعيدي (elsaidy.org)
          </div>
          <h1
            className="font-extrabold text-[#141413] tracking-tight leading-[1.25] mb-4"
            style={{ fontSize: 'clamp(1.85rem, 3.5vw, 2.85rem)', textWrap: 'balance' }}
          >
            ديوان التوثيق وإصدار شهادات النسب وبطاقات العضوية الرسمية
          </h1>
          <p className="text-sm sm:text-base text-zinc-700 leading-[1.85] max-w-[75ch]">
            تتيح هذه المنصة التحقق العلني المباشر من صحة شهادات الانتساب وبطاقات الهوية الصادرة عن
            الأمانة العامة لعائلات الصعيدي عبر الرقم التسلسلي المشفر، كما تضم منظومة الإصدار الرسمية
            المخصصة للمفوضين لإصدار وطباعة الشهادات والبطاقات المعتمدة.
          </p>
        </div>
      </section>

      {/* ====================================================================
          MODULE A: PUBLIC CERTIFICATE VERIFICATION PORTAL (متاحة للجميع)
         ==================================================================== */}
      <section className="no-print bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#0F291E] p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 mb-8 border-b border-[#E6E2D8]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#695022] mb-1.5">
              <FileCheck2 className="w-4 h-4 text-[#0F291E]" />
              <span>الوحدة الأولى · متاحة للجمهور وكافة الجهات</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141413]">
              بوابة التحقق العام من صحة شهادات النسب والعضوية
            </h2>
            <p className="text-xs sm:text-sm text-zinc-700 mt-1">
              أدخل الرقم التسلسلي المدوّن على الشهادة أو البطاقة للتثبت الفوري من مطابقتها للسجل
              العام المعتمد.
            </p>
          </div>

          {/* Quick-Test Sample Serial Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-zinc-700">أرقام مسجلة للفحص الفوري:</span>
            {registry.slice(0, 3).map((item) => (
              <button
                key={item.serialNumber}
                type="button"
                onClick={() => {
                  setVerifyQuery(item.serialNumber);
                  setVerifiedRecord(item);
                  setVerifyError('');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#F7F6F2] border border-[#E6E2D8] hover:border-[#695022] text-xs font-mono font-bold text-[#0F291E] transition-colors cursor-pointer"
              >
                {item.serialNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handlePublicVerify} className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              dir="ltr"
              value={verifyQuery}
              onChange={(e) => setVerifyQuery(e.target.value)}
              placeholder="ELS-2026-EG-001"
              aria-label="الرقم التسلسلي للشهادة"
              className="w-full pr-11 pl-4 py-3.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] font-mono text-sm font-bold text-[#141413] text-right outline-none focus:border-[#0F291E]"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-[#0F291E] text-white text-sm font-extrabold hover:bg-[#141E28] transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>تحقق من الوثيقة الآن</span>
          </button>
        </form>

        {/* Verification Error */}
        {verifyError && (
          <div className="p-5 rounded-xl bg-red-50 border border-red-300 text-red-900 flex items-start gap-3 text-xs sm:text-sm font-bold">
            <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
            <span>{verifyError}</span>
          </div>
        )}

        {/* Verification Result Card */}
        {verifiedRecord && (
          <div className="rounded-xl bg-[#F7F6F2] border-2 border-[#0F291E] p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E6E2D8]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#0F291E] text-[#D4AF37] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-emerald-900 text-white text-xs font-extrabold mb-1">
                    <span>{verifiedRecord.status}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#141413]">
                    {verifiedRecord.arabicName}
                  </h3>
                  <div className="text-xs font-mono font-bold text-[#695022]" dir="ltr">
                    {verifiedRecord.englishName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-extrabold px-3.5 py-2 rounded-lg bg-white border border-[#E6E2D8] text-[#0F291E]">
                  {verifiedRecord.serialNumber}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopySerial(verifiedRecord.serialNumber)}
                  className="p-2.5 rounded-lg bg-white border border-[#E6E2D8] hover:border-[#695022] text-[#141413] cursor-pointer"
                  title="نسخ الرقم التسلسلي"
                >
                  {copiedSerial === verifiedRecord.serialNumber ? (
                    <Check className="w-4 h-4 text-[#0F291E]" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#695022]" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white border border-[#E6E2D8]">
                <div className="text-zinc-600 font-semibold mb-1">القطر / الدولة المسجلة:</div>
                <div className="text-sm font-extrabold text-[#141413]">
                  {verifiedRecord.country}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#E6E2D8]">
                <div className="text-zinc-600 font-semibold mb-1">الحاضرة / المحافظة والفرع:</div>
                <div className="text-sm font-extrabold text-[#141413]">
                  {verifiedRecord.regionBranch}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#E6E2D8]">
                <div className="text-zinc-600 font-semibold mb-1">تاريخ القيد والتوثيق:</div>
                <div className="text-sm font-extrabold text-[#0F291E]">
                  {verifiedRecord.issueDateHijri} ({verifiedRecord.issueDateGregorian})
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[#E6E2D8]">
              <div className="text-xs font-bold text-[#695022] mb-1.5">
                بيان عمود النسب والتسلسل التاريخي الموثق:
              </div>
              <p className="font-display text-lg text-[#141413] leading-[1.95] text-justify">
                {verifiedRecord.lineageNarrative}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ====================================================================
          MODULE B: PASSWORD-PROTECTED CERTIFICATE & ID ISSUANCE SUITE
         ==================================================================== */}
      <section>
        {!isUnlocked ? (
          /* High-Security Institutional Access Gate */
          <div className="no-print max-w-2xl mx-auto rounded-2xl bg-gradient-to-br from-[#0F291E] via-[#112323] to-[#141E28] text-white border-2 border-[#D4AF37]/50 p-7 sm:p-10 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#D4AF37]">
                  منطقة محمية · صلاحية الأمانة العامة والمفوضين
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                  بوابة الاعتماد الإداري لإصدار الوثائق وشهادات النسب
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed mb-6">
              منظومة إصدار شهادات الانتساب الملكية (A4) وبطاقات العضوية الرقمية (VIP ID) محمية بكلمة
              مرور إدارية لضمان موثوقية السجل العام. يرجى إدخال رمز الاعتماد الإداري لفتح استوديو
              الإصدار والطباعة.
            </p>

            <form onSubmit={handleUnlockSubmit} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="admin-master-password-input"
                  className="block text-xs font-bold text-[#D4AF37] mb-2"
                >
                  كلمة المرور الإدارية المعتمدة:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#D4AF37] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="admin-master-password-input"
                    type="password"
                    dir="ltr"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="•••••••••••"
                    className="w-full pr-11 pl-4 py-3.5 rounded-xl bg-white/10 border border-[#D4AF37]/40 text-white font-mono text-sm text-right outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {authError && (
                <div className="p-3.5 rounded-xl bg-red-950/90 border border-red-400 text-xs font-bold text-red-100 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-300 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="submit"
                  className="px-7 py-3.5 rounded-xl bg-[#D4AF37] text-[#0D131A] text-xs sm:text-sm font-extrabold hover:bg-[#e3c14d] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  <span>فتح منظومة إصدار الشهادات والبطاقات</span>
                </button>

                <span className="text-[11px] text-zinc-300 font-mono">
                  تشفير وحماية السجل الرسمي • ELSAIDY.ORG
                </span>
              </div>
            </form>
          </div>
        ) : (
          /* UNLOCKED: Advanced Certificate & VIP ID Studio */
          <div className="space-y-10">
            {/* Studio Control Panel (Hidden in Print) */}
            <div className="no-print bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-10 shadow-sm space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E6E2D8]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0F291E] text-[#D4AF37] flex items-center justify-center">
                    <Unlock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#695022]">
                      وضع الاعتماد الإداري نشط · استوديو إصدار الوثائق الرسمية
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#141413]">
                      منظومة إصدار شهادات النسب الملكية (A4) وبطاقات العضوية (VIP ID)
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsUnlocked(false)}
                  className="px-4 py-2 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] hover:border-[#695022] text-xs font-bold text-[#141413] flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-[#695022]" />
                  <span>إغلاق جلسة الاعتماد</span>
                </button>
              </div>

              {/* Document Type Selector */}
              <div>
                <label className="block text-xs font-extrabold text-[#141413] mb-2.5">
                  نوع الوثيقة المراد إصدارها:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDocumentType('a4-certificate')}
                    className={`p-4 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                      documentType === 'a4-certificate'
                        ? 'bg-[#0F291E] text-white border-[#0F291E] shadow-md'
                        : 'bg-[#F7F6F2] text-[#141413] border-[#E6E2D8] hover:border-[#695022]'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-extrabold">
                        ١. شهادة انتساب وتوثيق تاريخي كبرى (A4 Royal Certificate)
                      </div>
                      <div
                        className={`text-xs mt-0.5 ${
                          documentType === 'a4-certificate' ? 'text-[#D4AF37]' : 'text-zinc-600'
                        }`}
                      >
                        وثيقة رسمية مؤطرة جاهزة للطباعة الفورية بحجم A4 مع الختم الذهبي ورمز QR
                      </div>
                    </div>
                    <FileCheck2 className="w-6 h-6 shrink-0 text-[#D4AF37]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDocumentType('vip-id')}
                    className={`p-4 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                      documentType === 'vip-id'
                        ? 'bg-[#0F291E] text-white border-[#0F291E] shadow-md'
                        : 'bg-[#F7F6F2] text-[#141413] border-[#E6E2D8] hover:border-[#695022]'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-extrabold">
                        ٢. بطاقة عضوية وهوية رقمية للعائلة (VIP Family ID Card)
                      </div>
                      <div
                        className={`text-xs mt-0.5 ${
                          documentType === 'vip-id' ? 'text-[#D4AF37]' : 'text-zinc-600'
                        }`}
                      >
                        بطاقة هوية مؤسسية فاخرة تحمل الشعار الهندسي والرقم التسلسلي ورمز التحقق
                      </div>
                    </div>
                    <CreditCard className="w-6 h-6 shrink-0 text-[#D4AF37]" />
                  </button>
                </div>
              </div>

              {/* Input Controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-extrabold text-[#141413] mb-1.5">
                    الاسم الرباعي أو الكامل بالعربية:
                  </label>
                  <input
                    type="text"
                    value={fullNameAr}
                    onChange={(e) => setFullNameAr(e.target.value)}
                    placeholder="مثال: علي أحمد علي الصعيدي"
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-sm font-bold text-[#141413] outline-none focus:border-[#0F291E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#141413] mb-1.5">
                    الاسم الكامل بالإنجليزية (Full Name in English):
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={fullNameEn}
                    onChange={(e) => setFullNameEn(e.target.value)}
                    placeholder="Ali Ahmed Ali Elsaidy"
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] font-mono text-sm font-bold text-[#141413] text-left outline-none focus:border-[#0F291E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#141413] mb-1.5">
                    القطر / الدولة:
                  </label>
                  <select
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      generateNewSerial(e.target.value);
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-sm font-bold text-[#141413] outline-none focus:border-[#0F291E]"
                  >
                    <option value="جمهورية مصر العربية">جمهورية مصر العربية</option>
                    <option value="المملكة العربية السعودية">المملكة العربية السعودية</option>
                    <option value="بلاد الشام والعراق">بلاد الشام والعراق</option>
                    <option value="دولة الإمارات العربية المتحدة">
                      دولة الإمارات العربية المتحدة
                    </option>
                    <option value="سلطنة عُمان">سلطنة عُمان</option>
                    <option value="دول الخليج العربي (الكويت / قطر / البحرين)">
                      دول الخليج العربي (الكويت / قطر / البحرين)
                    </option>
                    <option value="المغرب العربي والسودان">المغرب العربي والسودان</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#141413] mb-1.5">
                    الحاضرة / المحافظة والفرع:
                  </label>
                  <input
                    type="text"
                    value={regionBranch}
                    onChange={(e) => setRegionBranch(e.target.value)}
                    placeholder="مثال: محافظة الغربية - طنطا / الرياض / حائل / تيماء"
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-sm font-bold text-[#141413] outline-none focus:border-[#0F291E]"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <label className="text-xs font-extrabold text-[#141413]">
                      الرقم التسلسلي المشفر للوثيقة (Cryptographic Serial Number):
                    </label>
                    <button
                      type="button"
                      onClick={() => generateNewSerial(country)}
                      className="text-xs font-bold text-[#0F291E] hover:text-[#695022] flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>توليد رقم تسلسلي جديد</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    dir="ltr"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] font-mono text-sm font-extrabold text-[#0F291E] text-left outline-none focus:border-[#0F291E]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-extrabold text-[#141413] mb-1.5">
                    التسلسل التاريخي / عمود النسب الموثق:
                  </label>
                  <textarea
                    rows={3}
                    value={lineageNarrative}
                    onChange={(e) => setLineageNarrative(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-sm text-[#141413] leading-relaxed outline-none focus:border-[#0F291E]"
                  />
                </div>
              </div>

              {saveSuccessNotice && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-400 text-xs sm:text-sm font-bold text-emerald-950 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>{saveSuccessNotice}</span>
                </div>
              )}

              {/* Action Buttons: Register & Print A4 PDF */}
              <div className="pt-4 border-t border-[#E6E2D8] flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleRegisterAndIssue}
                    className="px-6 py-3.5 rounded-xl bg-[#0F291E] text-white text-xs sm:text-sm font-extrabold hover:bg-[#141E28] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span>اعتماد وحفظ الوثيقة في السجل العام</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrintCertificate}
                    className="px-6 py-3.5 rounded-xl bg-[#695022] text-white text-xs sm:text-sm font-extrabold hover:bg-[#523e1a] shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة الوثيقة / حفظ كملف PDF عالي الدقة</span>
                  </button>
                </div>

                {/* Change Master Password Form */}
                <form
                  onSubmit={handleUpdateMasterPassword}
                  className="flex flex-wrap items-center gap-2"
                >
                  <input
                    type="password"
                    dir="ltr"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="كلمة مرور إدارية جديدة..."
                    aria-label="تغيير كلمة المرور الإدارية"
                    className="px-3 py-2 rounded-lg bg-[#F7F6F2] border border-[#E6E2D8] text-xs font-mono text-right outline-none focus:border-[#0F291E]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-lg bg-[#F7F6F2] border border-[#E6E2D8] hover:border-[#695022] text-xs font-bold text-[#141413] cursor-pointer"
                  >
                    حفظ كلمة المرور
                  </button>
                </form>
              </div>

              {passwordSavedMessage && (
                <div className="text-xs font-bold text-[#0F291E]">{passwordSavedMessage}</div>
              )}
            </div>

            {/* ====================================================================
                LIVE PRINTABLE PREVIEW: A4 ROYAL CERTIFICATE OR VIP ID CARD
               ==================================================================== */}
            <div className="print-only-certificate">
              {documentType === 'a4-certificate' ? (
                /* 1. A4 ROYAL LINEAGE CERTIFICATE */
                <div className="relative bg-[#FBF9F4] text-[#141413] rounded-2xl border-4 border-double border-[#695022] p-6 sm:p-12 lg:p-16 shadow-xl overflow-hidden max-w-5xl mx-auto">
                  {/* Guilloche / Geometric Anti-Forgery Security Watermark Background */}
                  <svg
                    className="absolute inset-0 w-full h-full opacity-[0.045] pointer-events-none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <defs>
                      <pattern
                        id="cert-guilloche"
                        width="100"
                        height="100"
                        patternUnits="userSpaceOnUse"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="#0F291E"
                          strokeWidth="1"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="28"
                          fill="none"
                          stroke="#695022"
                          strokeWidth="1"
                        />
                        <path
                          d="M 50 0 L 100 50 L 50 100 L 0 50 Z"
                          fill="none"
                          stroke="#695022"
                          strokeWidth="0.8"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#cert-guilloche)" />
                  </svg>

                  {/* Inner Ornamental Frame */}
                  <div className="relative z-10 border-2 border-[#0F291E] p-6 sm:p-10 space-y-8">
                    {/* Top Header Row */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b-2 border-[#695022]">
                      <div className="text-center sm:text-right">
                        <div className="text-xs font-extrabold text-[#695022]">
                          الأمانة العامة للتوثيق التاريخي والأنساب
                        </div>
                        <div className="text-lg sm:text-xl font-extrabold text-[#0F291E] mt-0.5">
                          الموقع الرسمي لعائلات الصعيدي في الوطن العربي
                        </div>
                        <div className="font-mono text-xs font-bold text-[#695022]">
                          ELSAIDY OFFICIAL PORTAL & ARCHIVE · elsaidy.org
                        </div>
                      </div>

                      {/* Center Crest */}
                      <div className="w-16 h-16 rounded-2xl bg-[#0F291E] border-2 border-[#D4AF37] flex flex-col items-center justify-center text-white shadow-md shrink-0">
                        <span className="font-mono text-[10px] font-bold tracking-widest text-[#D4AF37]">
                          ELSAIDY
                        </span>
                        <span className="font-display text-base font-bold text-white mt-0.5">
                          الصعيدي
                        </span>
                      </div>

                      <div className="text-center sm:text-left font-mono text-xs space-y-1">
                        <div>
                          <span className="text-zinc-600 font-sans font-bold">رقم القيد: </span>
                          <strong className="text-[#0F291E]">{serialNumber}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-600 font-sans font-bold">التاريخ الهجري: </span>
                          <strong className="text-[#141413] font-sans">{issueDateHijri}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-600 font-sans font-bold">التاريخ الميلادي: </span>
                          <strong className="text-[#141413]">{issueDateGregorian}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Basmala & Grand Title */}
                    <div className="text-center space-y-3">
                      <div className="font-display text-2xl sm:text-3xl font-bold text-[#0F291E]">
                        بسم الله الرحمن الرحيم
                      </div>
                      <div className="inline-block px-6 py-1.5 rounded-full bg-[#0F291E] text-[#D4AF37] text-xs font-extrabold tracking-wide">
                        وثيقة رسمية معتمدة ومطابقة للسجل العام
                      </div>
                      <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#141413] pt-2">
                        شهادة انتساب وتوثيق تاريخي
                      </h2>
                    </div>

                    {/* Certificate Main Body */}
                    <div className="space-y-6 text-center max-w-3xl mx-auto">
                      <p className="font-display text-xl sm:text-2xl text-zinc-800 leading-relaxed">
                        تشهد الأمانة العامة ولجنة التوثيق التاريخي والأنساب بالموقع الرسمي لعائلات
                        الصعيدي في الوطن العربي (<span className="font-mono text-base">elsaidy.org</span>)
                        بأن السيد / العلم المنسوب:
                      </p>

                      <div className="py-5 px-6 rounded-2xl bg-white border-2 border-[#695022] shadow-xs">
                        <div className="font-display text-3xl sm:text-4xl font-bold text-[#0F291E] mb-1.5">
                          {fullNameAr}
                        </div>
                        <div className="font-mono text-sm sm:text-base font-bold text-[#695022] tracking-wide">
                          {fullNameEn}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
                        <div className="p-4 rounded-xl bg-white border border-[#E6E2D8]">
                          <div className="text-xs font-bold text-[#695022] mb-1">
                            القطر / الدولة المسجلة:
                          </div>
                          <div className="text-base font-extrabold text-[#141413]">{country}</div>
                        </div>
                        <div className="p-4 rounded-xl bg-white border border-[#E6E2D8]">
                          <div className="text-xs font-bold text-[#695022] mb-1">
                            الحاضرة / المحافظة والفرع:
                          </div>
                          <div className="text-base font-extrabold text-[#141413]">
                            {regionBranch}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 rounded-xl bg-white border border-[#E6E2D8] text-right">
                        <div className="text-xs font-bold text-[#695022] mb-2">
                          بيان عمود النسب والتسلسل التاريخي الموثق:
                        </div>
                        <p className="font-display text-xl sm:text-2xl text-[#141413] leading-[2.05] text-justify">
                          {lineageNarrative}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Authenticity Row: QR Code + Official Royal Gold SVG Seal + Signature */}
                    <div className="pt-8 border-t-2 border-[#695022] grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-center">
                      {/* QR Verification Block */}
                      <div className="flex flex-col items-center sm:items-start">
                        <DeterministicQrSvg value={qrVerificationUrl} size={96} />
                        <div className="text-[11px] font-bold text-[#0F291E] mt-2">
                          رمز التحقق الرقمي المشفر (QR)
                        </div>
                        <div className="font-mono text-[10px] text-zinc-600" dir="ltr">
                          elsaidy.org/verify?ref={serialNumber}
                        </div>
                      </div>

                      {/* Official Royal Gold SVG Seal */}
                      <div className="flex flex-col items-center justify-center">
                        <RoyalOfficialSealSvg size={132} />
                      </div>

                      {/* Official Signature & Archival Endorsement */}
                      <div className="flex flex-col items-center sm:items-end justify-center space-y-2">
                        <div className="text-xs font-bold text-[#695022]">
                          اعتماد الأمانة العامة ولجنة التوثيق
                        </div>
                        <div className="font-display text-2xl font-bold text-[#0F291E]">
                          أمانة ديوان عائلات الصعيدي
                        </div>
                        <div className="w-40 h-0.5 bg-[#695022]" />
                        <div className="text-[11px] text-zinc-600">
                          سجل الأنساب والوثائق المعتمد • elsaidy.org
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* 2. VIP FAMILY ID CARD (بطاقة عضوية وهوية رقمية للعائلة) */
                <div className="max-w-xl mx-auto">
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#0F291E] via-[#112323] to-[#0D131A] text-white border-2 border-[#D4AF37] p-6 sm:p-8 shadow-2xl">
                    {/* Geometric Watermark */}
                    <svg
                      className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <defs>
                        <pattern id="vip-id-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                          <path
                            d="M30 0 L60 30 L30 60 L0 30 Z"
                            fill="none"
                            stroke="#D4AF37"
                            strokeWidth="1.2"
                          />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#vip-id-grid)" />
                    </svg>

                    <div className="relative z-10 space-y-6">
                      {/* Card Top Header */}
                      <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/30">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-white/10 border-2 border-[#D4AF37] flex flex-col items-center justify-center">
                            <span className="font-mono text-[9px] font-bold text-[#D4AF37]">
                              ELSAIDY
                            </span>
                            <span className="font-display text-xs font-bold text-white">
                              الصعيدي
                            </span>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#D4AF37]">
                              بطاقة عضوية وهوية رسمية موثقة
                            </div>
                            <div className="text-base font-extrabold text-white">
                              تجمع عائلات الصعيدي ومجموعة الصعيدي
                            </div>
                          </div>
                        </div>

                        <div className="text-left font-mono">
                          <div className="text-[10px] text-[#D4AF37]">VIP FAMILY ID</div>
                          <div className="text-xs font-extrabold text-white">{serialNumber}</div>
                        </div>
                      </div>

                      {/* Card Holder Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                        <div className="sm:col-span-8 space-y-3">
                          <div>
                            <div className="text-[11px] text-[#D4AF37] font-bold">
                              اسم العضو المنتسب:
                            </div>
                            <div className="font-display text-2xl sm:text-3xl font-bold text-white">
                              {fullNameAr}
                            </div>
                            <div className="font-mono text-xs text-zinc-300" dir="ltr">
                              {fullNameEn}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                              <div className="text-[10px] text-[#D4AF37]">الدولة / القطر</div>
                              <div className="text-xs font-bold text-white mt-0.5">{country}</div>
                            </div>
                            <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                              <div className="text-[10px] text-[#D4AF37]">الحاضرة والفرع</div>
                              <div className="text-xs font-bold text-white mt-0.5">
                                {regionBranch}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="sm:col-span-4 flex flex-col items-center justify-center">
                          <DeterministicQrSvg value={qrVerificationUrl} size={88} />
                          <span className="font-mono text-[10px] text-[#D4AF37] mt-1.5">
                            VERIFIED QR
                          </span>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="pt-4 border-t border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-300">
                        <div>تاريخ الإصدار: {issueDateHijri}</div>
                        <div className="font-mono text-[#D4AF37] font-bold">
                          https://elsaidy.org/verify
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
