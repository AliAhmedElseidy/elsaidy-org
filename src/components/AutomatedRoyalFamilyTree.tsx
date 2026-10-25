import React, { useState, useMemo, useRef } from 'react';
import {
  HistoricalRootEntry,
  HistoricalRootFounder,
  CumulativeGenerationChain,
  IssuedCertificateRecord,
  DEFAULT_HISTORICAL_ROOTS,
  parseArabicLineageName,
} from '../data/familyData';
import {
  GitBranch,
  Plus,
  Trash2,
  Edit3,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Printer,
  X,
  Check,
  MapPin,
  Crown,
  Users,
  Sparkles,
  Award,
  Search,
} from 'lucide-react';

interface HistoricalRootsModalProps {
  isOpen: boolean;
  onClose: () => void;
  historicalRoots: HistoricalRootEntry[];
  cumulativeGenerations: CumulativeGenerationChain[];
  onUpdateRoots: (roots: HistoricalRootEntry[]) => void;
  onUpdateGenerations: (chains: CumulativeGenerationChain[]) => void;
}

export const HistoricalRootsModal: React.FC<HistoricalRootsModalProps> = ({
  isOpen,
  onClose,
  historicalRoots,
  cumulativeGenerations,
  onUpdateRoots,
  onUpdateGenerations,
}) => {
  const [editingRootId, setEditingRootId] = useState<string | null>(null);
  const [migrationTitle, setMigrationTitle] = useState<string>('');
  const [migrationStory, setMigrationStory] = useState<string>('');
  const [locationsText, setLocationsText] = useState<string>('');
  const [founders, setFounders] = useState<HistoricalRootFounder[]>([]);

  // New founder mini-form
  const [founderName, setFounderName] = useState<string>('');
  const [founderSubHouse, setFounderSubHouse] = useState<string>('');
  const [founderTemplate, setFounderTemplate] = useState<string>('');
  const [founderLocation, setFounderLocation] = useState<string>('');

  if (!isOpen) return null;

  const resetForm = () => {
    setEditingRootId(null);
    setMigrationTitle('');
    setMigrationStory('');
    setLocationsText('');
    setFounders([]);
    setFounderName('');
    setFounderSubHouse('');
    setFounderTemplate('');
    setFounderLocation('');
  };

  const handleEditRoot = (root: HistoricalRootEntry) => {
    setEditingRootId(root.id);
    setMigrationTitle(root.migrationTitle);
    setMigrationStory(root.migrationStory);
    setLocationsText(root.locations.join('، '));
    setFounders([...root.founders]);
  };

  const handleAddFounderToDraft = () => {
    if (!founderName.trim()) return;
    const cleanName = founderName.trim();
    const newFounder: HistoricalRootFounder = {
      id: `founder-${Date.now()}-${Math.floor(Math.random() * 999)}`,
      name: cleanName,
      subHouseTitle:
        founderSubHouse.trim() || `${cleanName} — عمود النسب الموثق`,
      lineageTemplate:
        founderTemplate.trim() ||
        `ينتسب إلى الذرية الموثقة لفرع (${cleanName}) ضمن الجذور التاريخية لعائلات الصعيدي (آل الصعيدي — Elsaidy) المتصلة بعمود النسب العائلي الأصيل.`,
      defaultLocation: founderLocation.trim() || undefined,
    };
    setFounders((prev) => [...prev, newFounder]);
    setFounderName('');
    setFounderSubHouse('');
    setFounderTemplate('');
    setFounderLocation('');
  };

  const handleRemoveFounderFromDraft = (id: string) => {
    setFounders((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSaveRootEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!migrationTitle.trim() || !migrationStory.trim()) return;

    const parsedLocations = locationsText
      .split(/[،,\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const finalFounders: HistoricalRootFounder[] =
      founders.length > 0
        ? founders
        : founderName.trim()
        ? [
            {
              id: `founder-${Date.now()}`,
              name: founderName.trim(),
              subHouseTitle:
                founderSubHouse.trim() || `${founderName.trim()} — عمود النسب الموثق`,
              lineageTemplate:
                founderTemplate.trim() || migrationStory.trim(),
              defaultLocation: founderLocation.trim() || parsedLocations[0] || '',
            },
          ]
        : [];

    if (editingRootId) {
      const updated = historicalRoots.map((r) =>
        r.id === editingRootId
          ? {
              ...r,
              migrationTitle: migrationTitle.trim(),
              migrationStory: migrationStory.trim(),
              locations: parsedLocations,
              founders: finalFounders,
            }
          : r
      );
      onUpdateRoots(updated);
    } else {
      const newEntry: HistoricalRootEntry = {
        id: `root-custom-${Date.now()}`,
        migrationTitle: migrationTitle.trim(),
        migrationStory: migrationStory.trim(),
        locations: parsedLocations,
        founders: finalFounders,
      };
      onUpdateRoots([newEntry, ...historicalRoots]);
    }
    resetForm();
  };

  const handleDeleteRoot = (id: string) => {
    onUpdateRoots(historicalRoots.filter((r) => r.id !== id));
    if (editingRootId === id) resetForm();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl border-2 border-[#695022] max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Royal Header */}
        <div className="bg-[#0F291E] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#D4AF37]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono font-bold text-[#D4AF37] tracking-wider">
                HISTORICAL ROOTS & CUMULATIVE GENERATIONS ENGINE
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                🌳 إدارة الجذور التاريخية والبلاد والأجداد المؤسسين وذاكرة الأجيال التراكمية
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-8 flex-1 bg-[#F7F6F2]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form to Add / Edit Historical Root */}
            <form
              onSubmit={handleSaveRootEntry}
              className="lg:col-span-6 bg-white rounded-2xl border border-[#E6E2D8] p-5 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#E6E2D8] pb-3">
                <h3 className="text-sm font-extrabold text-[#0F291E] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#695022]" />
                  <span>
                    {editingRootId
                      ? 'تعديل الأصل التاريخي والأجداد المؤسسين'
                      : 'إضافة أصل تاريخي / هجرة وأجداد مؤسسين جدد'}
                  </span>
                </h3>
                {editingRootId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs font-bold text-red-700 hover:underline cursor-pointer"
                  >
                    إلغاء التعديل
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1">
                  أ) عنوان الأصل التاريخي / الهجرة:
                </label>
                <input
                  type="text"
                  required
                  value={migrationTitle}
                  onChange={(e) => setMigrationTitle(e.target.value)}
                  placeholder="مثال: هجرة الأجداد المؤسسين من صعيد مصر إلى الغربية والدلتا"
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1">
                  القصة التاريخية الموثقة للهجرة (تُستخدم لتغذية الديباجة تلقائياً):
                </label>
                <textarea
                  rows={3}
                  required
                  value={migrationStory}
                  onChange={(e) => setMigrationStory(e.target.value)}
                  placeholder="مثال: أربعة إخوة قدموا من صعيد مصر في بداية القرن الـ 19 واستقروا في قرى ومراكز محافظة الغربية والدلتا..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#141413] mb-1">
                  ب) ربط البلاد والقرى والمحافظات (افصل بينها بفاصلة «،»):
                </label>
                <input
                  type="text"
                  required
                  value={locationsText}
                  onChange={(e) => setLocationsText(e.target.value)}
                  placeholder="مثال: طنطا، الغربية، كفر الزيات، المحلة الكبرى، زفتى، قطور"
                  className="w-full px-3.5 py-2 text-xs font-bold rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#0F291E]"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  بمجرد كتابة أو مسح أي بلد من هذه البلاد في الشهادة، سيتعرف النظام فوراً على هذا الأصل التاريخي.
                </p>
              </div>

              {/* Founding Ancestors Builder */}
              <div className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#C5A059]/40 space-y-3">
                <div className="text-xs font-extrabold text-[#0F291E]">
                  ج) تسجيل الأجداد المؤسسين (الإخوة المؤسسين) لهذا الأصل:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={founderName}
                    onChange={(e) => setFounderName(e.target.value)}
                    placeholder="اسم الجد المؤسس (مثال: الجد الأكبر مرسي الحجاج الصعيدي)"
                    className="px-3 py-2 text-xs rounded-lg bg-white border border-[#E6E2D8]"
                  />
                  <input
                    type="text"
                    value={founderSubHouse}
                    onChange={(e) => setFounderSubHouse(e.target.value)}
                    placeholder="مسمى البيت الفرعي (مثال: بيت مرسي الحجاج الصعيدي — طنطا)"
                    className="px-3 py-2 text-xs rounded-lg bg-white border border-[#E6E2D8]"
                  />
                </div>

                <input
                  type="text"
                  value={founderLocation}
                  onChange={(e) => setFounderLocation(e.target.value)}
                  placeholder="البلد أو المركز المرتبط بهذا الجد (مثال: طنطا - محافظة الغربية)"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#E6E2D8]"
                />

                <textarea
                  rows={2}
                  value={founderTemplate}
                  onChange={(e) => setFounderTemplate(e.target.value)}
                  placeholder="ديباجة عمود النسب الخاصة بهذا الجد المؤسس (تُعبأ تلقائياً عند اختياره)..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#E6E2D8]"
                />

                <button
                  type="button"
                  onClick={handleAddFounderToDraft}
                  className="w-full py-2 rounded-lg bg-[#695022] text-white text-xs font-bold hover:bg-[#533f1b] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إدراج هذا الجد المؤسس في القائمة أدناه</span>
                </button>

                {founders.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <div className="text-[11px] font-bold text-[#695022]">
                      الأجداد المؤسسون المدرجون ({founders.length}):
                    </div>
                    {founders.map((f) => (
                      <div
                        key={f.id}
                        className="p-2.5 rounded-lg bg-white border border-[#E6E2D8] flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <div className="font-extrabold text-[#0F291E] truncate">{f.name}</div>
                          <div className="text-[11px] text-zinc-600 truncate">{f.subHouseTitle}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFounderFromDraft(f.id)}
                          className="text-red-600 hover:text-red-800 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#0F291E] text-white text-xs font-extrabold hover:bg-[#141E28] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Check className="w-4 h-4 text-[#D4AF37]" />
                <span>
                  {editingRootId
                    ? 'حفظ التعديلات في موسوعة الجذور التاريخية'
                    : 'حفظ الأصل التاريخي والأجداد المؤسسين في الذاكرة'}
                </span>
              </button>
            </form>

            {/* Saved Historical Roots List + Cumulative Generations Memory */}
            <div className="lg:col-span-6 space-y-5">
              <div className="bg-white rounded-2xl border border-[#E6E2D8] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E6E2D8] pb-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#141413]">
                      الأصول التاريخية والهجرات المسجلة ({historicalRoots.length})
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      تُستخدم لتوليد الشجرة الملكية التفاعلية والتعرف الذكي على البلاد والأجداد
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdateRoots(DEFAULT_HISTORICAL_ROOTS)}
                    className="text-[11px] font-bold text-[#695022] hover:underline cursor-pointer"
                  >
                    استعادة الافتراضي
                  </button>
                </div>

                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {historicalRoots.map((root) => (
                    <div
                      key={root.id}
                      className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-extrabold text-xs text-[#0F291E]">
                          {root.migrationTitle}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEditRoot(root)}
                            className="px-2 py-1 rounded bg-white border border-[#E6E2D8] text-[11px] font-bold text-[#0F291E] hover:border-[#695022] cursor-pointer"
                          >
                            تعديل
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRoot(root.id)}
                            className="p-1 rounded bg-red-50 border border-red-200 text-red-700 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-600 leading-relaxed line-clamp-2">
                        {root.migrationStory}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {root.locations.map((loc, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-white border border-[#E6E2D8] text-[10px] font-bold text-[#695022]"
                          >
                            📍 {loc}
                          </span>
                        ))}
                      </div>
                      <div className="pt-1 border-t border-[#E6E2D8]/60 flex flex-wrap gap-1.5">
                        {root.founders.map((f) => (
                          <span
                            key={f.id}
                            className="px-2 py-0.5 rounded-md bg-[#0F291E] text-[#D4AF37] text-[10px] font-bold"
                          >
                            👑 {f.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cumulative Generations Memory Viewer */}
              <div className="bg-white rounded-2xl border border-[#E6E2D8] p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#E6E2D8] pb-2.5">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0F291E]">
                      🧠 سلاسل الأجيال التراكمية المتعلمة تلقائياً ({cumulativeGenerations.length})
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      يحلل النظام الأسماء الرباعية المحفوظة ويربط الأبناء وأبناء العمومة تلقائياً بنفس الجد المؤسس
                    </p>
                  </div>
                </div>

                {cumulativeGenerations.length === 0 ? (
                  <p className="text-xs text-zinc-500">
                    سيقوم النظام ببناء سلاسل الأجيال تلقائياً مع كل شهادة نسب يتم حفظها.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {cumulativeGenerations.map((chain) => (
                      <div
                        key={chain.id}
                        className="p-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0 space-y-0.5">
                          <div className="font-extrabold text-[#0F291E] truncate">
                            {chain.ancestorChain.join(' ⬅ ')}
                          </div>
                          <div className="text-[11px] text-[#695022] truncate">
                            👑 {chain.founderName} · 📍 {chain.locationKeyword}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateGenerations(
                              cumulativeGenerations.filter((c) => c.id !== chain.id)
                            )
                          }
                          className="p-1 rounded bg-red-50 text-red-700 border border-red-200 cursor-pointer shrink-0"
                          title="حذف السلسلة"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-[#E6E2D8] px-6 py-3.5 flex items-center justify-between">
          <span className="text-xs text-zinc-600 font-bold">
            جميع التعديلات تُحفظ تلقائياً في إعدادات البوابة وتُرفع مع مزامنة GitHub (cms-db.json).
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0F291E] text-white text-xs font-extrabold hover:bg-[#141E28] cursor-pointer"
          >
            إغلاق والعودة لإصدار الشهادات
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. AUTOMATED VISUAL ROYAL FAMILY TREE COMPONENT
// ============================================================================

interface AutomatedRoyalFamilyTreeProps {
  historicalRoots: HistoricalRootEntry[];
  cumulativeGenerations: CumulativeGenerationChain[];
  issuedCertificates: IssuedCertificateRecord[];
  onSelectCertificateForEdit: (cert: IssuedCertificateRecord) => void;
  onAddManualChain: (chain: CumulativeGenerationChain) => void;
  onOpenRootsModal: () => void;
}

interface VisualTreeNode {
  id: string;
  label: string;
  subLabel?: string;
  badge?: string;
  level: 'root' | 'founder' | 'ancestor' | 'member';
  x: number;
  y: number;
  parentId?: string;
  certificate?: IssuedCertificateRecord;
  photoUrl?: string;
  serialNumber?: string;
  location?: string;
}

export const AutomatedRoyalFamilyTree: React.FC<AutomatedRoyalFamilyTreeProps> = ({
  historicalRoots,
  cumulativeGenerations,
  issuedCertificates,
  onSelectCertificateForEdit,
  onAddManualChain,
  onOpenRootsModal,
}) => {
  const [zoom, setZoom] = useState<number>(0.92);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filters
  const [filterMode, setFilterMode] = useState<'all' | 'location' | 'founder'>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedFounderId, setSelectedFounderId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Manual intermediate ancestor mini-modal
  const [showManualAdd, setShowManualAdd] = useState<boolean>(false);
  const [manualFounderId, setManualFounderId] = useState<string>('');
  const [manualAncestorNames, setManualAncestorNames] = useState<string>('');
  const [manualLocation, setManualLocation] = useState<string>('طنطا - محافظة الغربية');

  // Export status
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activeRoots =
    historicalRoots && historicalRoots.length > 0
      ? historicalRoots
      : DEFAULT_HISTORICAL_ROOTS;

  const allLocations = useMemo(() => {
    const set = new Set<string>();
    activeRoots.forEach((r) => r.locations.forEach((l) => set.add(l)));
    issuedCertificates.forEach((c) => {
      if (c.regionBranch) set.add(c.regionBranch);
    });
    return Array.from(set);
  }, [activeRoots, issuedCertificates]);

  const allFounders = useMemo(() => {
    const list: { id: string; name: string; rootId: string; rootTitle: string; subHouseTitle: string; lineageTemplate: string }[] = [];
    activeRoots.forEach((r) => {
      r.founders.forEach((f) => {
        list.push({
          id: f.id,
          name: f.name,
          rootId: r.id,
          rootTitle: r.migrationTitle,
          subHouseTitle: f.subHouseTitle,
          lineageTemplate: f.lineageTemplate,
        });
      });
    });
    return list;
  }, [activeRoots]);

  // Build hierarchical tree structure with shared-ancestor merging from 4-part Arabic names
  const { nodes, edges, canvasWidth, canvasHeight } = useMemo(() => {
    const validCerts = issuedCertificates.filter((c) => !c.archived);

    // Filter certs according to selected filter
    const filteredCerts = validCerts.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const match =
          c.arabicName.toLowerCase().includes(q) ||
          c.serialNumber.toLowerCase().includes(q) ||
          (c.regionBranch || '').toLowerCase().includes(q) ||
          (c.currentResidence || '').toLowerCase().includes(q) ||
          (c.ancestralRoot || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      if (filterMode === 'location' && selectedLocation) {
        const locLower = selectedLocation.toLowerCase();
        return (
          (c.regionBranch || '').toLowerCase().includes(locLower) ||
          (c.currentResidence || '').toLowerCase().includes(locLower) ||
          (c.country || '').toLowerCase().includes(locLower)
        );
      }
      if (filterMode === 'founder' && selectedFounderId) {
        const founderObj = allFounders.find((f) => f.id === selectedFounderId);
        if (!founderObj) return true;
        return (
          c.founderId === selectedFounderId ||
          (c.ancestralRoot || '').includes(founderObj.name) ||
          (c.lineageNarrative || '').includes(founderObj.name)
        );
      }
      return true;
    });

    // Determine visible founders
    const visibleFounders = allFounders.filter((f) => {
      if (filterMode === 'founder' && selectedFounderId) {
        return f.id === selectedFounderId;
      }
      if (filterMode === 'location' && selectedLocation) {
        const parentRoot = activeRoots.find((r) => r.id === f.rootId);
        const rootHasLoc = parentRoot?.locations.some(
          (l) =>
            l.includes(selectedLocation) || selectedLocation.includes(l)
        );
        return Boolean(rootHasLoc);
      }
      return true;
    });

    const activeFoundersList =
      visibleFounders.length > 0 ? visibleFounders : allFounders.slice(0, 6);

    // Map each certificate to a founder (by explicit founderId, ancestralRoot match, or location match)
    const certsByFounder = new Map<string, IssuedCertificateRecord[]>();
    activeFoundersList.forEach((f) => certsByFounder.set(f.id, []));

    filteredCerts.forEach((cert) => {
      let matchedFounderId = cert.founderId;
      if (!matchedFounderId || !certsByFounder.has(matchedFounderId)) {
        const byAncestralText = activeFoundersList.find(
          (f) =>
            (cert.ancestralRoot && cert.ancestralRoot.includes(f.name)) ||
            (cert.founderName && cert.founderName.includes(f.name))
        );
        if (byAncestralText) {
          matchedFounderId = byAncestralText.id;
        }
      }
      if (!matchedFounderId || !certsByFounder.has(matchedFounderId)) {
        // Match by country / location
        if (cert.countryCode === 'SA') {
          const saFounder = activeFoundersList.find((f) => f.rootId.includes('hijaz') || f.name.includes('عبد الله') || f.name.includes('صالح'));
          matchedFounderId = saFounder?.id;
        } else if (cert.countryCode === 'LV') {
          const lvFounder = activeFoundersList.find((f) => f.name.includes('سلامة'));
          matchedFounderId = lvFounder?.id;
        } else {
          const egFounder = activeFoundersList.find(
            (f) =>
              (cert.arabicName.includes('مرسي') && f.name.includes('مرسي')) ||
              (cert.arabicName.includes('حجازي') && f.name.includes('حجازي')) ||
              f.rootId.includes('egypt')
          );
          matchedFounderId = egFounder?.id;
        }
      }
      const fallbackId = activeFoundersList[0]?.id;
      const targetId =
        matchedFounderId && certsByFounder.has(matchedFounderId)
          ? matchedFounderId
          : fallbackId;
      if (targetId) {
        certsByFounder.get(targetId)!.push(cert);
      }
    });

    // Now build columns per founder, merging shared grandfathers/fathers from 4-part Arabic names!
    interface AncestorGroup {
      id: string;
      ancestorLabel: string;
      fatherSubLabel?: string;
      members: IssuedCertificateRecord[];
    }

    const groupsByFounder = new Map<string, AncestorGroup[]>();
    let totalLeafColumns = 0;

    activeFoundersList.forEach((founder) => {
      const fCerts = certsByFounder.get(founder.id) || [];
      const ancestorMap = new Map<string, AncestorGroup>();

      // Also include any manual cumulative chains for this founder if no certs yet
      const manualChains = cumulativeGenerations.filter((c) => c.founderId === founder.id);

      fCerts.forEach((cert) => {
        const parsed =
          cert.parsedLineageChain && cert.parsedLineageChain.length >= 2
            ? cert.parsedLineageChain
            : parseArabicLineageName(cert.arabicName);

        // parsed = [member(0), father(1), grandfather(2), greatGrandfather(3)]
        const father = parsed[1] || 'الوالد';
        const grandfather = parsed[2] || '';
        const greatGrandfather = parsed[3] || '';

        // Shared ancestor key merges brothers & cousins who share father/grandfather/great-grandfather!
        const sharedAncestorKey =
          greatGrandfather || grandfather
            ? `${greatGrandfather}-${grandfather}-${father}`
            : father;

        const ancestorDisplay =
          grandfather && greatGrandfather
            ? `الجد: ${grandfather} بن ${greatGrandfather} الصعيدي`
            : grandfather
            ? `الجد: ${grandfather} الصعيدي`
            : `الوالد: ${father} الصعيدي`;

        const fatherDisplay =
          grandfather && father ? `فرع الوالد: ${father} بن ${grandfather}` : undefined;

        if (!ancestorMap.has(sharedAncestorKey)) {
          ancestorMap.set(sharedAncestorKey, {
            id: `anc-${founder.id}-${sharedAncestorKey}`,
            ancestorLabel: ancestorDisplay,
            fatherSubLabel: fatherDisplay,
            members: [],
          });
        }
        ancestorMap.get(sharedAncestorKey)!.members.push(cert);
      });

      if (ancestorMap.size === 0 && manualChains.length > 0) {
        manualChains.forEach((mc) => {
          ancestorMap.set(mc.id, {
            id: `anc-manual-${mc.id}`,
            ancestorLabel: mc.ancestorChain.slice(0, 2).join(' بن ') + ' الصعيدي',
            fatherSubLabel: `فرع موثق (${mc.locationKeyword})`,
            members: [],
          });
        });
      }

      const groups = Array.from(ancestorMap.values());
      groupsByFounder.set(founder.id, groups);

      if (groups.length === 0) {
        totalLeafColumns += 1;
      } else {
        groups.forEach((g) => {
          totalLeafColumns += Math.max(1, g.members.length);
        });
      }
    });

    const leafSpacingX = 270;
    const computedWidth = Math.max(1280, (totalLeafColumns + 1) * leafSpacingX);
    const computedHeight = 820;

    const visualNodes: VisualTreeNode[] = [];
    const visualEdges: { id: string; fromX: number; fromY: number; toX: number; toY: number; isGold?: boolean }[] = [];

    // 1. Main Trunk (Root Node) at top center
    const rootX = computedWidth / 2;
    const rootY = 95;
    const primaryRoot = activeRoots[0] || DEFAULT_HISTORICAL_ROOTS[0];

    visualNodes.push({
      id: 'tree-main-trunk',
      label: 'الجذر الجامع لعائلات الصعيدي (آل الصعيدي)',
      subLabel:
        filterMode === 'location' && selectedLocation
          ? `الأصل التاريخي وتفرعات حاضرة (${selectedLocation})`
          : primaryRoot.migrationTitle,
      badge: 'العمود الجامع الموثق',
      level: 'root',
      x: rootX,
      y: rootY,
    });

    // 2. Layout Founders, Shared Ancestors, and Verified Member Leaf Cards
    let currentLeafSlot = 0;

    activeFoundersList.forEach((founder) => {
      const groups = groupsByFounder.get(founder.id) || [];
      const founderStartSlot = currentLeafSlot;

      let founderSlotsCount = 0;
      if (groups.length === 0) {
        founderSlotsCount = 1;
      } else {
        groups.forEach((g) => {
          founderSlotsCount += Math.max(1, g.members.length);
        });
      }

      const founderCenterX =
        ((founderStartSlot + founderSlotsCount / 2) / Math.max(1, totalLeafColumns)) *
          (computedWidth - 180) +
        90;
      const founderY = 265;

      const founderNodeId = `founder-node-${founder.id}`;
      visualNodes.push({
        id: founderNodeId,
        label: founder.name,
        subLabel: founder.subHouseTitle,
        badge: 'جد مؤسس / فرع رئيسي',
        level: 'founder',
        x: founderCenterX,
        y: founderY,
        parentId: 'tree-main-trunk',
      });

      visualEdges.push({
        id: `edge-root-${founder.id}`,
        fromX: rootX,
        fromY: rootY + 46,
        toX: founderCenterX,
        toY: founderY - 42,
        isGold: true,
      });

      if (groups.length === 0) {
        currentLeafSlot += 1;
      } else {
        groups.forEach((group) => {
          const groupSlotCount = Math.max(1, group.members.length);
          const groupCenterX =
            ((currentLeafSlot + groupSlotCount / 2) / Math.max(1, totalLeafColumns)) *
              (computedWidth - 180) +
            90;
          const ancestorY = 455;

          visualNodes.push({
            id: group.id,
            label: group.ancestorLabel,
            subLabel: group.fatherSubLabel || 'عمود النسب المتصل بالجد المؤسس',
            badge:
              group.members.length > 1
                ? `جد مشترك (${group.members.length} أفراد)`
                : 'سلسلة الأجداد',
            level: 'ancestor',
            x: groupCenterX,
            y: ancestorY,
            parentId: founderNodeId,
          });

          visualEdges.push({
            id: `edge-${founderNodeId}-${group.id}`,
            fromX: founderCenterX,
            fromY: founderY + 42,
            toX: groupCenterX,
            toY: ancestorY - 38,
            isGold: false,
          });

          if (group.members.length === 0) {
            currentLeafSlot += 1;
          } else {
            group.members.forEach((memberCert) => {
              const leafX =
                ((currentLeafSlot + 0.5) / Math.max(1, totalLeafColumns)) *
                  (computedWidth - 180) +
                90;
              const leafY = 665;
              const leafNodeId = `leaf-${memberCert.serialNumber}`;

              visualNodes.push({
                id: leafNodeId,
                label: memberCert.arabicName,
                subLabel: memberCert.currentResidence || memberCert.regionBranch,
                badge: memberCert.serialNumber,
                level: 'member',
                x: leafX,
                y: leafY,
                parentId: group.id,
                certificate: memberCert,
                photoUrl: memberCert.personalPhotoUrl,
                serialNumber: memberCert.serialNumber,
                location: memberCert.regionBranch,
              });

              visualEdges.push({
                id: `edge-${group.id}-${leafNodeId}`,
                fromX: groupCenterX,
                fromY: ancestorY + 38,
                toX: leafX,
                toY: leafY - 52,
                isGold: true,
              });

              currentLeafSlot += 1;
            });
          }
        });
      }
    });

    return {
      nodes: visualNodes,
      edges: visualEdges,
      canvasWidth: computedWidth,
      canvasHeight: computedHeight,
    };
  }, [
    activeRoots,
    allFounders,
    issuedCertificates,
    cumulativeGenerations,
    filterMode,
    selectedLocation,
    selectedFounderId,
    searchQuery,
  ]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-tree-interactive]')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Export High-Resolution Royal Image (PNG) with Royal Background & Family Crest Watermark
  const handleExportHighResImage = async () => {
    if (!svgRef.current) return;
    setIsExporting(true);
    try {
      const scale = 2;
      const outW = canvasWidth * scale;
      const outH = (canvasHeight + 140) * scale;
      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Royal Ivory & Deep Green Frame Background
      ctx.fillStyle = '#F7F6F2';
      ctx.fillRect(0, 0, outW, outH);

      // Outer Royal Green Border
      ctx.strokeStyle = '#0F291E';
      ctx.lineWidth = 16 * scale;
      ctx.strokeRect(12 * scale, 12 * scale, outW - 24 * scale, outH - 24 * scale);

      // Inner Royal Gold Border
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 4 * scale;
      ctx.strokeRect(26 * scale, 26 * scale, outW - 52 * scale, outH - 52 * scale);

      // 2. Top Royal Banner Header
      ctx.fillStyle = '#0F291E';
      ctx.fillRect(26 * scale, 26 * scale, outW - 52 * scale, 88 * scale);

      ctx.fillStyle = '#D4AF37';
      ctx.font = `bold ${22 * scale}px Cairo, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(
        'شجرة عائلة الصعيدي التفاعلية الملكية — السجل العام للأنساب الموثقة (ELSAIDY.ORG)',
        outW / 2,
        66 * scale
      );

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${14 * scale}px Cairo, sans-serif`;
      ctx.fillText(
        `إصدار الأمانة العامة لتوثيق أنساب عائلات الصعيدي · عدد الوثائق المعتمدة: ${
          issuedCertificates.filter((c) => !c.archived).length
        } وثيقة`,
        outW / 2,
        96 * scale
      );

      // 3. Watermark in Center
      ctx.save();
      ctx.globalAlpha = 0.045;
      ctx.fillStyle = '#0F291E';
      ctx.font = `900 ${90 * scale}px Cairo, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('آل الصعيدي — ELSAIDY', outW / 2, outH / 2 + 40 * scale);
      ctx.restore();

      // 4. Serialize SVG and render onto Canvas
      const cloneSvg = svgRef.current.cloneNode(true) as SVGSVGElement;
      cloneSvg.setAttribute('width', String(canvasWidth));
      cloneSvg.setAttribute('height', String(canvasHeight));
      const gInner = cloneSvg.querySelector('#elsaidy-svg-pan-zoom-group');
      if (gInner) {
        gInner.setAttribute('transform', 'translate(0, 0) scale(1)');
      }

      const svgXml = new XMLSerializer().serializeToString(cloneSvg);
      const svgBlob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(
            img,
            0,
            115 * scale,
            canvasWidth * scale,
            canvasHeight * scale
          );
          URL.revokeObjectURL(url);
          resolve();
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        img.src = url;
      });

      const pngUrl = canvas.toDataURL('image/png', 1.0);
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `elsaidy-royal-family-tree-${new Date().toISOString().slice(0, 10)}.png`;
      a.click();
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveManualAncestor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualAncestorNames.trim()) return;
    const targetFounder =
      allFounders.find((f) => f.id === manualFounderId) || allFounders[0];
    if (!targetFounder) return;

    const parts = manualAncestorNames
      .split(/[،,-]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const newChain: CumulativeGenerationChain = {
      id: `chain-manual-${Date.now()}`,
      rootId: targetFounder.rootId,
      founderId: targetFounder.id,
      founderName: targetFounder.name,
      subHouseTitle: targetFounder.subHouseTitle,
      locationKeyword: manualLocation.trim() || 'طنطا - محافظة الغربية',
      ancestorChain: parts.length > 0 ? parts : [manualAncestorNames.trim()],
      lineageNarrative: targetFounder.lineageTemplate,
      updatedAt: new Date().toISOString(),
    };
    onAddManualChain(newChain);
    setManualAncestorNames('');
    setShowManualAdd(false);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-[#695022] shadow-md overflow-hidden">
      {/* Top Royal Control Bar */}
      <div className="bg-[#0F291E] text-white p-4 sm:p-5 border-b-2 border-[#D4AF37] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-[#D4AF37] tracking-wider">
              AUTOMATED VISUAL ROYAL FAMILY TREE GENERATOR
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              🌳 شجرة عائلة الصعيدي التفاعلية الملكية (توليد تلقائي ودمج ذكي للأجداد المشتركين)
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenRootsModal}
            className="px-3.5 py-2 rounded-xl bg-[#D4AF37] text-[#0F291E] text-xs font-extrabold hover:bg-[#e3be42] flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>إدارة الجذور والأجداد المؤسسين</span>
          </button>

          <button
            type="button"
            onClick={() => setShowManualAdd((prev) => !prev)}
            className="px-3.5 py-2 rounded-xl bg-white/10 text-white border border-white/20 text-xs font-bold hover:bg-white/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>إضافة جد وسيط يدوياً</span>
          </button>

          <button
            type="button"
            onClick={handleExportHighResImage}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-[#695022] text-white border border-[#D4AF37]/50 text-xs font-extrabold hover:bg-[#533f1b] flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>
              {isExporting
                ? 'جاري تصدير اللوحة الملكية...'
                : '🖼️ تصدير الشجرة كصورة عالية الجودة / PDF'}
            </span>
          </button>
        </div>
      </div>

      {/* Manual Intermediate Ancestor Override Drawer */}
      {showManualAdd && (
        <form
          onSubmit={handleSaveManualAncestor}
          className="bg-[#F7F6F2] border-b border-[#E6E2D8] p-4 flex flex-wrap items-end gap-3"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[11px] font-bold text-[#0F291E] mb-1">
              اختر الجد المؤسس الرئيسي:
            </label>
            <select
              value={manualFounderId || allFounders[0]?.id || ''}
              onChange={(e) => setManualFounderId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-white border border-[#E6E2D8]"
            >
              {allFounders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.subHouseTitle})
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[220px]">
            <label className="block text-[11px] font-bold text-[#0F291E] mb-1">
              اسم الجد الوسيط أو سلسلة الأجداد (افصل بفاصلة):
            </label>
            <input
              type="text"
              required
              value={manualAncestorNames}
              onChange={(e) => setManualAncestorNames(e.target.value)}
              placeholder="مثال: علي، أحمد، مرسي الحجاج"
              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6E2D8]"
            />
          </div>
          <div className="w-48">
            <label className="block text-[11px] font-bold text-[#0F291E] mb-1">
              البلد / الحاضرة:
            </label>
            <input
              type="text"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              placeholder="طنطا - الغربية"
              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6E2D8]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#0F291E] text-white text-xs font-extrabold hover:bg-[#141E28] cursor-pointer"
          >
            إضافة وربط بالشجرة
          </button>
        </form>
      )}

      {/* Filter & Zoom Toolbar */}
      <div className="bg-[#F7F6F2] px-4 py-3 border-b border-[#E6E2D8] flex flex-wrap items-center justify-between gap-3">
        {/* Filter Modes */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setFilterMode('all');
              setSelectedLocation('');
              setSelectedFounderId('');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-colors ${
              filterMode === 'all'
                ? 'bg-[#0F291E] text-[#D4AF37]'
                : 'bg-white text-zinc-700 border border-[#E6E2D8]'
            }`}
          >
            الشجرة الكاملة للعائلة
          </button>

          <select
            value={filterMode === 'location' ? selectedLocation : ''}
            onChange={(e) => {
              const val = e.target.value;
              if (!val) {
                setFilterMode('all');
                setSelectedLocation('');
              } else {
                setFilterMode('location');
                setSelectedLocation(val);
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
              filterMode === 'location'
                ? 'bg-[#0F291E] text-white border-[#0F291E]'
                : 'bg-white text-[#141413] border-[#E6E2D8]'
            }`}
          >
            <option value="">📍 فلترة: شجرة بلد / محافظة معينة...</option>
            {allLocations.map((loc) => (
              <option key={loc} value={loc} className="bg-white text-[#141413]">
                {loc}
              </option>
            ))}
          </select>

          <select
            value={filterMode === 'founder' ? selectedFounderId : ''}
            onChange={(e) => {
              const val = e.target.value;
              if (!val) {
                setFilterMode('all');
                setSelectedFounderId('');
              } else {
                setFilterMode('founder');
                setSelectedFounderId(val);
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
              filterMode === 'founder'
                ? 'bg-[#0F291E] text-white border-[#0F291E]'
                : 'bg-white text-[#141413] border-[#E6E2D8]'
            }`}
          >
            <option value="">👑 فلترة: شجرة جد مؤسس معين...</option>
            {allFounders.map((f) => (
              <option key={f.id} value={f.id} className="bg-white text-[#141413]">
                {f.name}
              </option>
            ))}
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن عضو أو رقم وثيقة..."
              className="pr-8 pl-3 py-1.5 text-xs rounded-xl bg-white border border-[#E6E2D8] w-48 focus:border-[#0F291E] outline-none"
            />
          </div>
        </div>

        {/* Zoom & Pan Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.6, Number((z + 0.12).toFixed(2))))}
            className="p-2 rounded-lg bg-white border border-[#E6E2D8] text-[#0F291E] hover:border-[#695022] cursor-pointer"
            title="تكبير الشجرة"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E6E2D8] font-mono text-xs font-bold text-[#0F291E]">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.45, Number((z - 0.12).toFixed(2))))}
            className="p-2 rounded-lg bg-white border border-[#E6E2D8] text-[#0F291E] hover:border-[#695022] cursor-pointer"
            title="تصغير الشجرة"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(0.92);
              setPan({ x: 0, y: 0 });
            }}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E6E2D8] text-xs font-bold text-[#695022] hover:border-[#695022] flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>توسيط</span>
          </button>
        </div>
      </div>

      {/* Interactive Royal SVG Tree Viewport */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full h-[560px] overflow-auto bg-gradient-to-b from-[#F7F6F2] via-[#FFFFFF] to-[#F4EFE4] select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          className="w-full h-full min-w-[980px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="royalGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F291E" />
              <stop offset="100%" stopColor="#183D2D" />
            </linearGradient>
            <linearGradient id="royalGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9A7532" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#695022" />
            </linearGradient>
            <filter id="royalShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0F291E" floodOpacity="0.16" />
            </filter>
          </defs>

          <g
            id="elsaidy-svg-pan-zoom-group"
            transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
            style={{ transformOrigin: 'center top' }}
          >
            {/* Curved Golden & Royal Green SVG Branches */}
            {edges.map((edge) => {
              const midY = (edge.fromY + edge.toY) / 2;
              const d = `M ${edge.fromX} ${edge.fromY} C ${edge.fromX} ${midY}, ${edge.toX} ${midY}, ${edge.toX} ${edge.toY}`;
              return (
                <g key={edge.id}>
                  <path
                    d={d}
                    fill="none"
                    stroke={edge.isGold ? '#D4AF37' : '#0F291E'}
                    strokeWidth={edge.isGold ? 3.2 : 2.5}
                    strokeOpacity={0.85}
                  />
                  <circle cx={edge.fromX} cy={edge.fromY} r={4} fill="#D4AF37" />
                  <circle cx={edge.toX} cy={edge.toY} r={4.5} fill="#0F291E" stroke="#D4AF37" strokeWidth={1.5} />
                </g>
              );
            })}

            {/* Visual Nodes (Root, Founders, Shared Ancestors, and Verified Member Leaf Cards) */}
            {nodes.map((node) => {
              if (node.level === 'root') {
                const w = 440;
                const h = 92;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x - w / 2}, ${node.y - h / 2})`}
                    filter="url(#royalShadow)"
                  >
                    <rect
                      width={w}
                      height={h}
                      rx={18}
                      fill="url(#royalGreenGrad)"
                      stroke="#D4AF37"
                      strokeWidth={3}
                    />
                    <rect
                      x={14}
                      y={10}
                      width={w - 28}
                      height={20}
                      rx={6}
                      fill="#D4AF37"
                      fillOpacity={0.18}
                    />
                    <text
                      x={w / 2}
                      y={24}
                      textAnchor="middle"
                      fill="#D4AF37"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="Cairo, sans-serif"
                    >
                      👑 {node.badge}
                    </text>
                    <text
                      x={w / 2}
                      y={52}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="15"
                      fontWeight="900"
                      fontFamily="Cairo, sans-serif"
                    >
                      {node.label}
                    </text>
                    <text
                      x={w / 2}
                      y={74}
                      textAnchor="middle"
                      fill="#E6E2D8"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="Cairo, sans-serif"
                    >
                      {(node.subLabel || '').slice(0, 62)}
                    </text>
                  </g>
                );
              }

              if (node.level === 'founder') {
                const w = 240;
                const h = 84;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x - w / 2}, ${node.y - h / 2})`}
                    filter="url(#royalShadow)"
                  >
                    <rect
                      width={w}
                      height={h}
                      rx={14}
                      fill="#FFFFFF"
                      stroke="#695022"
                      strokeWidth={2.5}
                    />
                    <rect
                      x={0}
                      y={0}
                      width={w}
                      height={24}
                      rx={12}
                      fill="#0F291E"
                    />
                    <text
                      x={w / 2}
                      y={16}
                      textAnchor="middle"
                      fill="#D4AF37"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="Cairo, sans-serif"
                    >
                      {node.badge}
                    </text>
                    <text
                      x={w / 2}
                      y={48}
                      textAnchor="middle"
                      fill="#0F291E"
                      fontSize="12.5"
                      fontWeight="900"
                      fontFamily="Cairo, sans-serif"
                    >
                      {node.label.slice(0, 32)}
                    </text>
                    <text
                      x={w / 2}
                      y={68}
                      textAnchor="middle"
                      fill="#695022"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="Cairo, sans-serif"
                    >
                      {(node.subLabel || '').slice(0, 36)}
                    </text>
                  </g>
                );
              }

              if (node.level === 'ancestor') {
                const w = 225;
                const h = 76;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x - w / 2}, ${node.y - h / 2})`}
                    filter="url(#royalShadow)"
                  >
                    <rect
                      width={w}
                      height={h}
                      rx={12}
                      fill="#F7F6F2"
                      stroke="#D4AF37"
                      strokeWidth={2}
                    />
                    <text
                      x={w / 2}
                      y={20}
                      textAnchor="middle"
                      fill="#695022"
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="Cairo, sans-serif"
                    >
                      🌿 {node.badge}
                    </text>
                    <text
                      x={w / 2}
                      y={43}
                      textAnchor="middle"
                      fill="#141413"
                      fontSize="12"
                      fontWeight="900"
                      fontFamily="Cairo, sans-serif"
                    >
                      {node.label.slice(0, 32)}
                    </text>
                    <text
                      x={w / 2}
                      y={62}
                      textAnchor="middle"
                      fill="#0F291E"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="Cairo, sans-serif"
                    >
                      {(node.subLabel || '').slice(0, 34)}
                    </text>
                  </g>
                );
              }

              // Leaf Node: Verified Member Royal Card (Click to View / Edit Certificate)
              const w = 236;
              const h = 104;
              return (
                <g
                  key={node.id}
                  data-tree-interactive="true"
                  onClick={() => {
                    if (node.certificate) {
                      onSelectCertificateForEdit(node.certificate);
                    }
                  }}
                  transform={`translate(${node.x - w / 2}, ${node.y - h / 2})`}
                  filter="url(#royalShadow)"
                  className="cursor-pointer group"
                >
                  <rect
                    width={w}
                    height={h}
                    rx={14}
                    fill="url(#royalGreenGrad)"
                    stroke="#D4AF37"
                    strokeWidth={2.5}
                  />
                  {/* Serial Badge at top */}
                  <rect
                    x={12}
                    y={10}
                    width={w - 24}
                    height={22}
                    rx={6}
                    fill="#FFFFFF"
                    fillOpacity={0.12}
                  />
                  <text
                    x={w / 2}
                    y={25}
                    textAnchor="middle"
                    fill="#D4AF37"
                    fontSize="10.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    ✓ {node.serialNumber}
                  </text>

                  {/* Member Name */}
                  <text
                    x={w / 2}
                    y={54}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="12.5"
                    fontWeight="900"
                    fontFamily="Cairo, sans-serif"
                  >
                    {node.label.slice(0, 30)}
                  </text>

                  {/* Location */}
                  <text
                    x={w / 2}
                    y={74}
                    textAnchor="middle"
                    fill="#E6E2D8"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="Cairo, sans-serif"
                  >
                    📍 {(node.subLabel || '').slice(0, 32)}
                  </text>

                  {/* Action Hint */}
                  <text
                    x={w / 2}
                    y={93}
                    textAnchor="middle"
                    fill="#D4AF37"
                    fontSize="9.5"
                    fontWeight="bold"
                    fontFamily="Cairo, sans-serif"
                  >
                    [انقر لعرض وتعديل وثيقة العضو]
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Bottom Legend */}
      <div className="bg-[#F7F6F2] px-5 py-3 border-t border-[#E6E2D8] flex flex-wrap items-center justify-between gap-3 text-[11px] font-bold text-zinc-600">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#0F291E] border border-[#D4AF37] inline-block" />
            <span>الجذر التاريخي والبطاقات الملكية للأعضاء المعتمدين</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-white border-2 border-[#695022] inline-block" />
            <span>الأجداد المؤسسون (الفروع الرئيسية)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#F7F6F2] border-2 border-[#D4AF37] inline-block" />
            <span>الأجداد والآباء المشتركون (دمج تلقائي لمنع تكرار الجد)</span>
          </span>
        </div>
        <span className="text-[#0F291E]">
          💡 اسحب بالماوس لتحريك الشجرة · انقر على بطاقة أي عضو لتحميل شهادته فوراً في المحرر أعلاه
        </span>
      </div>
    </div>
  );
};
