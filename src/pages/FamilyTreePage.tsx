import React, { useState, useMemo, Suspense, lazy } from 'react';
import {
  OFFICIAL_FAMILY_TREE_IMAGE_URL,
  COMPOUND_NAMES_INDEX,
  DEFAULT_FAMILY_TREE_NODES,
  FamilyTreeNode,
  PageRoute,
  SiteConfig,
  DEFAULT_SITE_CONFIG,
} from '../data/familyData';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  ExternalLink,
  ArrowRight,
  X,
  Search,
  GitBranch,
  ChevronDown,
  ChevronUp,
  MapPin,
  ShieldCheck,
  Users,
  Sparkles,
  Globe2,
} from 'lucide-react';

const ElsaidyEncyclopediaDirectory = lazy(() =>
  import('../components/ElsaidyEncyclopediaDirectory').then((m) => ({
    default: m.ElsaidyEncyclopediaDirectory,
  }))
);

interface FamilyTreePageProps {
  onNavigate: (route: PageRoute, slugOrSerial?: string) => void;
  customNames?: string[];
  treeNodes?: FamilyTreeNode[];
  siteConfig?: SiteConfig;
}

export const FamilyTreePage: React.FC<FamilyTreePageProps> = ({
  onNavigate,
  customNames = [],
  treeNodes = DEFAULT_FAMILY_TREE_NODES,
  siteConfig = DEFAULT_SITE_CONFIG,
}) => {
  const activeTreeImageUrl =
    siteConfig.familyTreeConfig?.treeImageUrl || OFFICIAL_FAMILY_TREE_IMAGE_URL;
  const activeDocumentCode =
    siteConfig.familyTreeConfig?.documentCode || 'ARCH-TREE-01';
  const activeDocumentTitle =
    siteConfig.familyTreeConfig?.documentTitle ||
    'وثيقة شجرة عائلة الصعيدي الرسمية';
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxZoom, setLightboxZoom] = useState<number>(1.35);
  const [imageError, setImageError] = useState<boolean>(false);
  const [highlightedBranch, setHighlightedBranch] = useState<'all' | 'b1' | 'b2' | 'b3'>('all');
  const [nameSearchQuery, setNameSearchQuery] = useState<string>('');

  // Interactive Hierarchical Tree State
  const effectiveNodes = useMemo(
    () => (treeNodes && treeNodes.length > 0 ? treeNodes : DEFAULT_FAMILY_TREE_NODES),
    [treeNodes]
  );

  const [treeSearchQuery, setTreeSearchQuery] = useState<string>('');
  const [selectedTreeBranch, setSelectedTreeBranch] = useState<string>('all');
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<Set<string>>(new Set());
  const [selectedMemberNode, setSelectedMemberNode] = useState<FamilyTreeNode | null>(null);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  // Extract unique branches for the interactive tree filter
  const availableTreeBranches = useMemo(() => {
    const set = new Set<string>();
    effectiveNodes.forEach((n) => {
      if (n.branchName && n.branchName.trim()) {
        set.add(n.branchName.trim());
      }
    });
    return Array.from(set);
  }, [effectiveNodes]);

  // Map nodes by ID and group children by parentId
  const { nodeById, childrenByParentId, rootNodes } = useMemo(() => {
    const map = new Map<string, FamilyTreeNode>();
    effectiveNodes.forEach((n) => map.set(n.id, n));

    const childrenMap = new Map<string, FamilyTreeNode[]>();
    const roots: FamilyTreeNode[] = [];

    effectiveNodes.forEach((node) => {
      if (!node.parentId || !map.has(node.parentId)) {
        roots.push(node);
      } else {
        const list = childrenMap.get(node.parentId) || [];
        list.push(node);
        childrenMap.set(node.parentId, list);
      }
    });

    return {
      nodeById: map,
      childrenByParentId: childrenMap,
      rootNodes: roots,
    };
  }, [effectiveNodes]);

  // Compute full ancestral lineage chain from node up to root
  const getAncestralChain = (node: FamilyTreeNode): FamilyTreeNode[] => {
    const chain: FamilyTreeNode[] = [];
    const visited = new Set<string>();
    let current: FamilyTreeNode | undefined = node;
    while (current && !visited.has(current.id)) {
      visited.add(current.id);
      chain.push(current);
      current = current.parentId ? nodeById.get(current.parentId) : undefined;
    }
    return chain;
  };

  // Determine which nodes match the current search/branch filter and their ancestor IDs
  const { matchingNodeIds, visibleNodeIds, isFilteringTree } = useMemo(() => {
    const q = treeSearchQuery.trim().toLowerCase();
    const hasBranchFilter = selectedTreeBranch !== 'all';
    const activeFilter = Boolean(q) || hasBranchFilter;

    if (!activeFilter) {
      return {
        matchingNodeIds: new Set<string>(),
        visibleNodeIds: new Set<string>(effectiveNodes.map((n) => n.id)),
        isFilteringTree: false,
      };
    }

    const matched = new Set<string>();
    const visible = new Set<string>();

    effectiveNodes.forEach((node) => {
      const matchesQuery =
        !q ||
        node.name.toLowerCase().includes(q) ||
        node.title.toLowerCase().includes(q) ||
        node.branchName.toLowerCase().includes(q) ||
        node.location.toLowerCase().includes(q) ||
        (node.serialNumber && node.serialNumber.toLowerCase().includes(q));

      const matchesBranch =
        !hasBranchFilter || node.branchName.trim() === selectedTreeBranch;

      if (matchesQuery && matchesBranch) {
        matched.add(node.id);
        // Include all ancestors up to the root so the hierarchy path remains connected
        let curr: FamilyTreeNode | undefined = node;
        const guard = new Set<string>();
        while (curr && !guard.has(curr.id)) {
          guard.add(curr.id);
          visible.add(curr.id);
          curr = curr.parentId ? nodeById.get(curr.parentId) : undefined;
        }
        // Also include direct children of matched node so context is clear
        const directKids = childrenByParentId.get(node.id) || [];
        directKids.forEach((k) => visible.add(k.id));
      }
    });

    return {
      matchingNodeIds: matched,
      visibleNodeIds: visible,
      isFilteringTree: true,
    };
  }, [effectiveNodes, treeSearchQuery, selectedTreeBranch, nodeById, childrenByParentId]);

  const toggleCollapseNode = (id: string) => {
    setCollapsedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAllNodes = () => {
    setCollapsedNodeIds(new Set());
  };

  const handleCollapseSubBranches = () => {
    // Keep root and second level expanded, collapse deeper nodes that have children
    const rootIds = new Set(rootNodes.map((r) => r.id));
    const toCollapse = new Set<string>();
    effectiveNodes.forEach((n) => {
      const hasKids = (childrenByParentId.get(n.id) || []).length > 0;
      if (hasKids && !rootIds.has(n.id)) {
        toCollapse.add(n.id);
      }
    });
    setCollapsedNodeIds(toCollapse);
  };

  const mergedCompoundEntries = useMemo(() => {
    const existingSet = new Set(COMPOUND_NAMES_INDEX.map((e) => e.arabicName));
    const extraEntries = customNames
      .filter((n) => !existingSet.has(n))
      .map((n) => ({
        arabicName: n,
        englishElsaidy: n,
        englishElseidy: 'Elsaidy / Elseidy / Hijazi / Hagag',
        englishAlsaidi: 'Alsaidi / Al-Saidy',
        category: 'سجل الأعلام والفروع الموثقة (CMS)',
        regions: 'مصر (الصعيد، الغربية، طنطا، القاهرة) · الحجاز · الوطن العربي',
      }));
    return [...extraEntries, ...COMPOUND_NAMES_INDEX];
  }, [customNames]);

  const filteredNames = mergedCompoundEntries.filter((entry) => {
    const q = nameSearchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      entry.arabicName.toLowerCase().includes(q) ||
      entry.englishElsaidy.toLowerCase().includes(q) ||
      entry.englishElseidy.toLowerCase().includes(q) ||
      entry.englishAlsaidi.toLowerCase().includes(q) ||
      entry.regions.toLowerCase().includes(q)
    );
  });

  // Recursive Tree Node Renderer
  const renderInteractiveTreeNode = (node: FamilyTreeNode, depth = 0): React.ReactNode => {
    if (isFilteringTree && !visibleNodeIds.has(node.id)) {
      return null;
    }

    const allChildren = childrenByParentId.get(node.id) || [];
    const visibleChildren = isFilteringTree
      ? allChildren.filter((c) => visibleNodeIds.has(c.id))
      : allChildren;

    const hasChildren = visibleChildren.length > 0;
    const isCollapsed = !isFilteringTree && collapsedNodeIds.has(node.id);
    const isHighlighted = isFilteringTree && matchingNodeIds.has(node.id);
    const isRoot = depth === 0;

    return (
      <div
        key={node.id}
        className="flex flex-col items-center relative px-2 sm:px-3"
      >
        {/* Node Card */}
        <div
          className={`relative z-10 w-60 sm:w-68 rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md ${
            isRoot
              ? 'bg-gradient-to-br from-[#0F291E] to-[#141E28] text-white border-[#C5A059] ring-2 ring-[#C5A059]/30'
              : isHighlighted
              ? 'bg-[#FBF9F4] border-2 border-[#0F291E] ring-4 ring-[#C5A059]/30 text-[#141413]'
              : depth === 1
              ? 'bg-[#F7F6F2] border-2 border-[#695022] text-[#141413]'
              : 'bg-white border-[#E6E2D8] hover:border-[#695022] text-[#141413]'
          }`}
        >
          <button
            type="button"
            onClick={() => setSelectedMemberNode(node)}
            className="w-full text-right p-4 cursor-pointer focus:outline-none"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  isRoot
                    ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40'
                    : 'bg-[#0F291E]/8 text-[#0F291E]'
                }`}
              >
                {node.generation || 'علم موثق'}
              </span>
              {node.serialNumber && (
                <span
                  dir="ltr"
                  className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isRoot
                      ? 'bg-white/10 text-zinc-200'
                      : 'bg-[#695022]/10 text-[#695022]'
                  }`}
                >
                  {node.serialNumber}
                </span>
              )}
            </div>

            <div
              className={`font-display text-lg sm:text-xl font-bold leading-snug mb-1 ${
                isRoot ? 'text-white' : 'text-[#141413]'
              }`}
            >
              {node.name}
            </div>

            {node.title && (
              <div
                className={`text-[11px] font-bold leading-relaxed mb-2 ${
                  isRoot ? 'text-[#C5A059]' : 'text-[#695022]'
                }`}
              >
                {node.title}
              </div>
            )}

            <div
              className={`pt-2 border-t flex flex-wrap items-center justify-between gap-1 text-[10px] ${
                isRoot
                  ? 'border-white/15 text-zinc-300'
                  : 'border-[#E6E2D8] text-zinc-600'
              }`}
            >
              <span className="font-bold truncate max-w-[135px]" title={node.branchName}>
                {node.branchName}
              </span>
              {node.location && (
                <span className="flex items-center gap-0.5 truncate max-w-[105px]" title={node.location}>
                  <MapPin className="w-2.5 h-2.5 shrink-0 text-[#695022]" />
                  <span className="truncate">{node.location}</span>
                </span>
              )}
            </div>
          </button>

          {/* Collapse / Expand Children Toggle Pill */}
          {allChildren.length > 0 && (
            <div className="px-4 pb-2.5 flex items-center justify-between border-t border-[#E6E2D8]/50 pt-2">
              <span
                className={`text-[10px] font-bold ${
                  isRoot ? 'text-zinc-300' : 'text-zinc-500'
                }`}
              >
                الأبناء والفروع المباشرة: {allChildren.length}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCollapseNode(node.id);
                }}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                  isRoot
                    ? 'bg-[#C5A059] text-[#141413] hover:bg-[#d4b26c]'
                    : 'bg-[#F7F6F2] text-[#0F291E] border border-[#E6E2D8] hover:border-[#695022]'
                }`}
              >
                {isCollapsed ? (
                  <>
                    <span>عرض الأبناء ({allChildren.length})</span>
                    <ChevronDown className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    <span>طي الفرع</span>
                    <ChevronUp className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Connector & Children Row */}
        {hasChildren && !isCollapsed && (
          <div className="flex flex-col items-center w-full">
            {/* Vertical stem down from parent */}
            <div className="w-0.5 h-6 bg-[#695022]" />

            {/* Children container */}
            <div className="relative flex flex-col lg:flex-row items-center lg:items-start justify-center gap-5 lg:gap-4 pt-4 border-t-2 border-[#695022]/70 rounded-t-sm">
              {visibleChildren.map((child) => (
                <div key={child.id} className="flex flex-col items-center">
                  {/* Small vertical connector to child card */}
                  <div className="hidden lg:block w-0.5 h-4 bg-[#695022] -mt-4 mb-0" />
                  {renderInteractiveTreeNode(child, depth + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const selectedMemberChain = useMemo(
    () => (selectedMemberNode ? getAncestralChain(selectedMemberNode) : []),
    [selectedMemberNode, nodeById]
  );

  const selectedMemberChildren = useMemo(
    () => (selectedMemberNode ? childrenByParentId.get(selectedMemberNode.id) || [] : []),
    [selectedMemberNode, childrenByParentId]
  );

  return (
    <div className="space-y-14 lg:space-y-20 py-8 lg:py-12">
      {/* Page Breadcrumb & Institutional Header */}
      <section className="bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-10 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-[#E6E2D8] text-xs text-zinc-600">
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
            <span className="font-bold text-[#0F291E]">شجرة وفروع العائلة التفاعلية</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-zinc-500">
              الأرشيف النسبي المصوّر والمشجرة الرقمية الحية
            </span>
          </div>

          <div className="text-xs text-zinc-600">
            <span>الجد السابع الجامع: </span>
            <strong className="text-[#141413]">إبراهيم الصعيدي (قبيلة جهينة — ينبع النخل)</strong>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-4xl">
            <div className="text-xs font-bold text-[#695022] mb-2">
              سجل المشجرات الوثائقية · الموقع الرسمي لعائلات الصعيدي في الوطن العربي (elsaidy.org)
            </div>
            <h1
              className="font-extrabold text-[#141413] tracking-tight leading-[1.25] mb-4"
              style={{ fontSize: 'clamp(1.85rem, 3.5vw, 2.85rem)', textWrap: 'balance' }}
            >
              الشجرة التفاعلية الحية ووثيقة شجرة عائلة الصعيدي وموسوعة المحافظات
            </h1>
            <p className="text-sm sm:text-base text-zinc-700 leading-[1.85] max-w-[75ch]">
              تضم هذه الصفحة المشجرة الرقمية التفاعلية لعائلات الصعيدي (المرتبطة مباشرة بقاعدة
              البيانات السحابية لتوليد سلاسل النسب والربط بين الأبناء والآباء والأجداد تلقائياً)،
              بالإضافة إلى موسوعة وأطلس عائلات الصعيدي في جميع محافظات مصر والدول العربية والوثيقة
              المصوّرة المعتمدة لشجرة العائلة.
            </p>
          </div>

          <a
            href="#elsaidy-pan-arab-encyclopedia"
            className="px-5 py-3 rounded-xl bg-[#0F291E] text-white text-xs font-extrabold hover:bg-[#141E28] transition-all flex items-center gap-2 self-start lg:self-end shrink-0 shadow-sm"
          >
            <Globe2 className="w-4 h-4 text-[#C5A059]" />
            <span>موسوعة المحافظات والوطن العربي ←</span>
          </a>
        </div>
      </section>

      {/* Section 1: Interactive Hierarchical Family Tree Diagram (Dynamic Parent/Child Tree) */}
      <section id="interactive-family-tree">
        <div className="bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#0F291E] shadow-sm overflow-hidden">
          {/* Header & Controls */}
          <div className="p-6 sm:p-8 bg-[#F7F6F2] border-b border-[#E6E2D8] space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F291E] mb-1">
                  <GitBranch className="w-4 h-4 text-[#695022]" />
                  <span>المشجرة الرقمية التفاعلية · تتمدد تلقائياً مع كل عضو يُضاف في السجل</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#141413]">
                  شجرة النسب التفاعلية لأعقاب وفروع عائلات الصعيدي ({effectiveNodes.length} عَلَم وعقدة موثقة)
                </h2>
                <p className="text-xs text-zinc-600 mt-1">
                  انقر على أي بطاقة عضو في الشجرة لعرض عمود نسبه الكامل المتصل بالجد الجامع وأبنائه ورابط التحقق من شهادته.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleExpandAllNodes}
                  className="px-3.5 py-2 rounded-lg bg-white border border-[#E6E2D8] text-[#141413] text-xs font-bold hover:border-[#695022] transition-colors cursor-pointer"
                >
                  توسيع جميع الفروع
                </button>
                <button
                  type="button"
                  onClick={handleCollapseSubBranches}
                  className="px-3.5 py-2 rounded-lg bg-white border border-[#E6E2D8] text-zinc-700 text-xs font-bold hover:border-[#695022] transition-colors cursor-pointer"
                >
                  طي الفروع الفرعية
                </button>
              </div>
            </div>

            {/* Search & Branch Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
              <div className="md:col-span-6 relative">
                <label htmlFor="interactive-tree-search" className="sr-only">
                  ابحث عن اسم أو فرع أو رقم توثيق في الشجرة التفاعلية
                </label>
                <Search className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="interactive-tree-search"
                  type="text"
                  value={treeSearchQuery}
                  onChange={(e) => setTreeSearchQuery(e.target.value)}
                  placeholder="ابحث في الشجرة بالاسم أو اللقب أو المحافظة (مثال: علي أحمد، مرسي الحجاج، تيماء)..."
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-white border border-[#E6E2D8] text-xs text-[#141413] outline-none focus:border-[#0F291E]"
                />
              </div>

              <div className="md:col-span-4">
                <label htmlFor="interactive-tree-branch" className="sr-only">
                  تصفية حسب الفرع الجغرافي
                </label>
                <select
                  id="interactive-tree-branch"
                  value={selectedTreeBranch}
                  onChange={(e) => setSelectedTreeBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E6E2D8] text-xs font-bold text-[#141413] outline-none focus:border-[#0F291E]"
                >
                  <option value="all">جميع الفروع والحواضر ({availableTreeBranches.length} فروع)</option>
                  {availableTreeBranches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex items-center justify-end">
                {(treeSearchQuery || selectedTreeBranch !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setTreeSearchQuery('');
                      setSelectedTreeBranch('all');
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#695022] text-white text-xs font-bold hover:bg-[#0F291E] transition-colors cursor-pointer"
                  >
                    إعادة ضبط التصفية
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Tree Canvas */}
          <div className="p-6 sm:p-10 overflow-x-auto bg-gradient-to-b from-[#FBF9F4] to-white">
            <div className="min-w-max mx-auto flex flex-col items-center gap-10">
              {rootNodes.map((root) => renderInteractiveTreeNode(root, 0))}
            </div>
          </div>

          {/* Tree Footer */}
          <div className="px-6 py-4 bg-[#F7F6F2] border-t border-[#E6E2D8] flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-600">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#695022]" />
              <span>
                يتم تحديث هذه الشجرة التفاعلية فورياً عند إضافة أو ربط أي عضو جديد بأبيه أو جده من لوحة التحكم.
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('verify')}
              className="font-bold text-[#0F291E] hover:text-[#695022] flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#695022]" />
              <span>فحص رقم شهادة نسب في السجل الرقمي</span>
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Official Family Tree Document Viewer (100% Mobile Responsive) */}
      <section>
        <div className="bg-white rounded-2xl border border-[#E6E2D8] border-t-4 border-t-[#695022] shadow-sm overflow-hidden">
          {/* Archival Frame Top Bar & Interactive Controls */}
          <div className="px-6 py-5 bg-[#F7F6F2] border-b border-[#E6E2D8] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-[#695022] mb-1">
                الوثيقة المصوّرة المعتمدة · رقم القيد: {activeDocumentCode}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#141413]">
                {activeDocumentTitle}
              </h2>
            </div>

            {/* Interactive Zoom / Pan / Fullscreen Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleZoomIn}
                className="px-3.5 py-2 rounded-lg bg-white border border-[#E6E2D8] text-[#141413] text-xs font-bold hover:border-[#695022] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <ZoomIn className="w-3.5 h-3.5 text-[#695022]" />
                <span>تكبير +</span>
              </button>

              <button
                type="button"
                onClick={handleZoomOut}
                className="px-3.5 py-2 rounded-lg bg-white border border-[#E6E2D8] text-[#141413] text-xs font-bold hover:border-[#695022] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <ZoomOut className="w-3.5 h-3.5 text-[#695022]" />
                <span>تصغير -</span>
              </button>

              <button
                type="button"
                onClick={handleResetZoom}
                className="px-3 py-2 rounded-lg bg-white border border-[#E6E2D8] text-zinc-700 text-xs font-bold hover:border-[#695022] transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                title="إعادة ضبط الحجم"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="font-mono tabular-nums">{Math.round(zoomLevel * 100)}%</span>
              </button>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="px-4 py-2 rounded-lg bg-[#0F291E] text-white text-xs font-bold hover:bg-[#141E28] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>عرض بملء الشاشة</span>
              </button>

              <a
                href={activeTreeImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-[#695022] text-white text-xs font-bold hover:bg-[#826631] transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <span>فتح الوثيقة الأصلية</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Archival Image Viewport Container (Safe Mobile Scroll) */}
          <div className="p-4 sm:p-8 overflow-auto max-h-[720px] max-w-full bg-[#F7F6F2] flex flex-col items-center justify-center">
            <div
              className="bg-white rounded-xl border-2 border-[#695022]/50 p-3 sm:p-5 shadow-md transition-transform duration-150 origin-top max-w-full"
              style={{
                transform: `scale(${zoomLevel})`,
                marginBottom: zoomLevel > 1 ? `${(zoomLevel - 1) * 320}px` : '0px',
              }}
            >
              <img
                src={activeTreeImageUrl}
                alt="وثيقة شجرة عائلة الصعيدي الرسمية — Elsaidy Family Tree"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onClick={() => setIsLightboxOpen(true)}
                onError={() => setImageError(true)}
                className="max-w-full h-auto mx-auto block cursor-zoom-in rounded-lg border border-[#E6E2D8]"
              />

              {imageError && (
                <div className="p-8 text-center bg-white rounded-xl border border-[#E6E2D8] mt-3 space-y-3 max-w-xl mx-auto">
                  <div className="text-xl font-extrabold text-[#141413]">
                    معاينة وثيقة شجرة عائلة الصعيدي المصوّرة
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    في حال تعذر تحميل الصورة من الخادم الخارجي بسبب قيود المتصفح، يمكنك فتح الوثيقة
                    الأصلية مباشرة بالحجم الكامل عبر الرابط المعتمد أدناه أو مطالعة المشجرة
                    التفصيلية الكاملة في القسم التالي.
                  </p>
                  <a
                    href={activeTreeImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0F291E] text-white text-xs font-bold hover:bg-[#695022] transition-colors"
                  >
                    <span>فتح الوثيقة الأصلية بالحجم الكامل</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Archival Plate Footer Caption */}
          <div className="px-6 py-4 bg-white border-t border-[#E6E2D8] flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-600">
            <div>
              <span>انقر على صورة الوثيقة أو زر «عرض بملء الشاشة» لتفحص الأسماء والتفرعات بدقة عالية.</span>
            </div>
            <a
              href={activeTreeImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#695022] hover:text-[#0F291E] underline underline-offset-4 flex items-center gap-1"
            >
              <span>رابط المصدر المصوّر المباشر</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* Section 3: Structured Lineage Directory */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-bold text-[#695022] mb-2">
              الدليل الهيكلي الموثق · تسلسل الأجداد والفروع
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#141413]">
              المشجرة التفصيلية لأعقاب الجد السابع إبراهيم الصعيدي وابنه عوض البراهيم
            </h2>
          </div>

          {/* Interactive Branch Filter */}
          <div
            className="flex flex-wrap items-center gap-1.5 bg-white border border-[#E6E2D8] rounded-xl p-1.5 shadow-sm"
            role="tablist"
            aria-label="تصفية فروع الشجرة"
          >
            {[
              { id: 'all' as const, label: 'كامل المشجرة' },
              { id: 'b1' as const, label: '١. فرع عبد الله (تيماء)' },
              { id: 'b2' as const, label: '٢. فرع سلامة (الشام)' },
              { id: 'b3' as const, label: '٣. فرع صالح (حائل والرياض والخليج)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={highlightedBranch === tab.id}
                onClick={() => setHighlightedBranch(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  highlightedBranch === tab.id
                    ? 'bg-[#0F291E] text-white shadow-sm'
                    : 'text-zinc-700 hover:text-[#141413]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Hierarchy Container */}
        <div className="bg-white rounded-2xl border border-[#E6E2D8] p-6 sm:p-10 shadow-sm">
          {/* Root & Trunk: 7th Grandfather Ibrahim Elsaidy -> Awad Al-Brahim */}
          <div className="max-w-xl mx-auto text-center">
            <div className="rounded-xl bg-gradient-to-br from-[#0F291E] to-[#141E28] text-white border border-[#695022]/40 p-6 shadow-md">
              <div className="text-xs text-[#C5A059] font-bold mb-1">
                الجد السابع الجامع للعائلة · قبيلة جهينة
              </div>
              <div className="font-display text-2xl sm:text-3xl font-bold">
                إبراهيم الصعيدي
              </div>
              <div className="text-xs text-zinc-300 mt-1.5">
                من قبيلة جهينة من ينبع النخل بالساحل الغربي لشبه الجزيرة العربية
              </div>
            </div>

            <div className="w-0.5 h-6 bg-[#695022] mx-auto" />

            <div className="rounded-xl bg-[#F7F6F2] border-2 border-[#695022] p-6 shadow-sm">
              <div className="text-xs text-[#695022] font-bold mb-1">
                عمود التفرع الجامع
              </div>
              <div className="font-display text-2xl font-bold text-[#141413]">
                عوض البراهيم
              </div>
              <div className="text-xs text-zinc-600 mt-1.5">
                تفرعت العائلة من ابنه عوض البراهيم من خلال أبنائه الثلاثة: عبد الله، وسلامة، وصالح
              </div>
            </div>

            <div className="w-0.5 h-6 bg-[#695022] mx-auto" />
          </div>

          {/* Horizontal Connector Bar */}
          <div className="border-t-2 border-[#695022] pt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {/* Branch 1: Abdullah (Taima) */}
            {(highlightedBranch === 'all' || highlightedBranch === 'b1') && (
              <div className="bg-[#F7F6F2] rounded-xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs pb-3 mb-4 border-b border-[#E6E2D8]">
                    <span className="font-bold text-[#695022]">الفرع الأول</span>
                    <span className="text-[#0F291E] font-bold">محافظة تيماء</span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[#141413] mb-2">
                    عبد الله بن عوض البراهيم
                  </h3>

                  <p className="text-xs text-zinc-700 leading-[1.8] mb-5">
                    استقر عبد الله بتيماء مع أبنائه الأربعة، ومنهم امتد فرع العائلة في محافظة تيماء
                    وشمال غرب المملكة:
                  </p>

                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-[#695022] mb-1">
                      أبناء عبد الله بن عوض الأربعة في تيماء:
                    </div>
                    {[
                      '١. عوض بن عبد الله',
                      '٢. حامد بن عبد الله',
                      '٣. حمدان بن عبد الله',
                      '٤. بشير بن عبد الله',
                    ].map((son, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg bg-white border border-[#E6E2D8] font-display text-lg font-bold text-[#141413] flex items-center justify-between"
                      >
                        <span>{son}</span>
                        <span className="font-sans text-[11px] font-bold text-[#0F291E]">
                          تيماء
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#E6E2D8] text-xs text-zinc-500">
                  المقر التاريخي: محافظة تيماء — شمال غرب الجزيرة العربية
                </div>
              </div>
            )}

            {/* Branch 2: Salama (Jabal Al-Arab - Umm Walad) */}
            {(highlightedBranch === 'all' || highlightedBranch === 'b2') && (
              <div className="bg-[#F7F6F2] rounded-xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs pb-3 mb-4 border-b border-[#E6E2D8]">
                    <span className="font-bold text-[#695022]">الفرع الثاني</span>
                    <span className="text-[#0F291E] font-bold">بلاد الشام — جبل العرب</span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[#141413] mb-2">
                    سلامة بن عوض البراهيم
                  </h3>

                  <p className="text-xs text-zinc-700 leading-[1.8] mb-5">
                    اتجه شمالاً واستقر في بلاد الشام، حيث سكن جبل العرب بقرية أم ولد في سوريا:
                  </p>

                  <div className="p-5 rounded-xl bg-white border border-[#E6E2D8] space-y-2">
                    <div className="text-xs font-bold text-[#695022]">
                      مقر الاستقرار والامتداد العائلي:
                    </div>
                    <div className="font-display text-xl font-bold text-[#141413]">
                      قرية أم ولد — جبل العرب (بلاد الشام / سوريا)
                    </div>
                    <p className="text-xs text-zinc-700 leading-relaxed">
                      يمثل ذرية سلامة بن عوض البراهيم الامتداد التاريخي الأصيل لعائلة الصعيدي في
                      بلاد الشام، محافظين على نسبهم الجهني وروابطهم مع أبناء عمومتهم في الجزيرة
                      العربية ومصر والخليج.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#E6E2D8] text-xs text-zinc-500">
                  المقر التاريخي: بلاد الشام (سوريا) — جبل العرب — قرية أم ولد
                </div>
              </div>
            )}

            {/* Branch 3: Saleh -> Abdullah (Hail, Riyadh, UAE, Oman) */}
            {(highlightedBranch === 'all' || highlightedBranch === 'b3') && (
              <div className="bg-[#F7F6F2] rounded-xl border border-[#E6E2D8] border-t-4 border-t-[#695022] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs pb-3 mb-4 border-b border-[#E6E2D8]">
                    <span className="font-bold text-[#695022]">الفرع الثالث</span>
                    <span className="text-[#0F291E] font-bold">
                      حائل · الرياض · الإمارات · عُمان
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[#141413] mb-1">
                    صالح بن عوض البراهيم
                  </h3>
                  <div className="text-xs font-bold text-[#695022] mb-3">
                    ↓ ابنه: عبد الله بن صالح (استقر داخل مدينة حائل)
                  </div>

                  <p className="text-xs text-zinc-700 leading-[1.8] mb-4">
                    سكن صالح ضواحي حائل حتى استقر ابنه <strong>عبد الله</strong> داخل مدينة حائل، وله
                    من الأبناء ثلاثة (<strong>إبراهيم، وناصر، وعلي</strong>):
                  </p>

                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-white border border-[#E6E2D8]">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-[#0F291E]">
                          أ. إبراهيم بن عبد الله بن صالح
                        </span>
                        <span className="text-[#695022] font-bold">حائل — حي الزبارة</span>
                      </div>
                      <p className="text-xs text-zinc-700 leading-relaxed">
                        استقر إبراهيم وأحفاده بمدينة حائل وتحديداً في <strong>حي الزبارة</strong>.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-[#E6E2D8]">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-[#0F291E]">
                          ب. ناصر بن عبد الله بن صالح
                        </span>
                        <span className="text-[#695022] font-bold">مدينة الرياض</span>
                      </div>
                      <p className="text-xs text-zinc-700 leading-relaxed">
                        انتقل أبناؤه وأحفاده إلى <strong>مدينة الرياض</strong> بعد أن تولى ابنه{' '}
                        <strong>حمود</strong> شئون البادية في بداية حكم الملك عبد العزيز يرحمه الله.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-[#E6E2D8]">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-[#0F291E]">ج. علي بن عبد الله بن صالح</span>
                        <span className="text-[#695022] font-bold">الإمارات وسلطنة عُمان</span>
                      </div>
                      <p className="text-xs text-zinc-700 leading-relaxed mb-2">
                        تنقل بين نجد وساحل الخليج العربي حتى استقر بالإمارات، وله من الأبناء أربعة:
                      </p>
                      <ul className="space-y-1 text-xs text-[#141413] pr-2 border-r-2 border-[#695022]">
                        <li>
                          · <strong>عبد الله بن علي</strong>: المعروف بـ (النجدي القصيمي).
                        </li>
                        <li>
                          · <strong>عمر ومحمد أبناء علي</strong>: استقرا بـ{' '}
                          <strong>عجمان بحي مشرف والجرف</strong>.
                        </li>
                        <li>
                          · <strong>خليفة بن علي</strong>: استقر بـ{' '}
                          <strong>سلطنة عُمان في الباطنة - الخابورة</strong>.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#E6E2D8] text-xs text-zinc-500">
                  المقار التاريخية: حائل (حي الزبارة) · الرياض · عجمان (مشرف والجرف) · الباطنة
                  (الخابورة)
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 3.5: Pan-Arab Elsaidy Encyclopedia & Governorate Atlas (Lazy-Loaded) */}
      <Suspense
        fallback={
          <div className="p-8 rounded-2xl bg-white border border-[#E6E2D8] text-xs font-bold text-zinc-600 text-center">
            جاري تحميل موسوعة وأطلس عائلات الصعيدي الشامل في مصر والوطن العربي...
          </div>
        }
      >
        <ElsaidyEncyclopediaDirectory onNavigate={onNavigate} />
      </Suspense>

      {/* Section 4: Encyclopedic Searchable Compound Name & Transliteration Directory */}
      <section>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-3xl">
            <div className="text-xs font-bold text-[#695022] mb-2">
              الفهرس المعجمي للأعلام والأسماء المركبة · مطابقة البحث بالعربية والإنجليزية
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#141413]">
              دليل أعلام وأسماء عائلات الصعيدي (Elsaidy / Elseidy / Alsaidi)
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
              يوفر هذا الفهرس المرجعي توثيقاً للأسماء المركبة المتداولة لأجداد وأعلام وأبناء عائلات
              الصعيدي في جمهورية مصر العربية (الغربية، طنطا، الدلتا، القاهرة، الصعيد) والمملكة
              العربية السعودية وبلاد الشام والخليج العربي والمغرب العربي، مع صيغ كتابتها المعتمدة
              باللغة الإنجليزية.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <label htmlFor="compound-name-search" className="sr-only">
              ابحث بالاسم في فهرس أعلام عائلات الصعيدي
            </label>
            <Search className="w-4 h-4 text-zinc-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="compound-name-search"
              type="text"
              value={nameSearchQuery}
              onChange={(e) => setNameSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم (مثال: علي الصعيدي / Aly Elsaidy)..."
              className="w-full pr-10 pl-4 py-3 rounded-xl bg-white border border-[#E6E2D8] text-xs text-[#141413] shadow-sm outline-none focus:border-[#695022]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNames.map((entry, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-white border border-[#E6E2D8] border-t-4 border-t-[#695022] shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-[11px] text-[#695022] font-bold mb-1.5">
                  <span>{entry.category}</span>
                </div>
                <h3 className="text-xl font-extrabold text-[#141413] mb-3">
                  {entry.arabicName}
                </h3>
                <div
                  dir="ltr"
                  className="text-left font-mono text-[11px] text-zinc-700 bg-[#F7F6F2] p-3 rounded-lg border border-[#E6E2D8] space-y-1 mb-3"
                >
                  <div>
                    <strong className="text-[#0F291E]">Elsaidy:</strong> {entry.englishElsaidy}
                  </div>
                  <div>
                    <strong className="text-[#695022]">Elseidy:</strong> {entry.englishElseidy}
                  </div>
                  <div>
                    <strong className="text-zinc-600">Alsaidi:</strong> {entry.englishAlsaidi}
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-[#E6E2D8] text-xs text-zinc-600">
                <strong className="text-[#141413]">النطاق الجغرافي: </strong>
                {entry.regions}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Member Details Modal (Computed Lineage Chain & Verification Link) */}
      {selectedMemberNode && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`بطاقة تفصيلية للعضو ${selectedMemberNode.name}`}
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setSelectedMemberNode(null)}
        >
          <div
            className="bg-white rounded-2xl border-2 border-[#695022] max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#E6E2D8] pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#695022] mb-1">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>بطاقة توثيق نسبي · السجل التفاعلي لعائلات الصعيدي</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#141413]">
                  {selectedMemberNode.name}
                </h3>
                {selectedMemberNode.title && (
                  <p className="text-xs sm:text-sm font-bold text-[#0F291E] mt-1">
                    {selectedMemberNode.title}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedMemberNode(null)}
                className="p-2 rounded-lg bg-[#F7F6F2] text-zinc-700 hover:bg-[#141413] hover:text-white transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]">
                <div className="text-zinc-500 mb-1">الفرع العائلي المعتمد:</div>
                <div className="font-bold text-[#141413]">{selectedMemberNode.branchName}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]">
                <div className="text-zinc-500 mb-1">الطبقة / الجيل:</div>
                <div className="font-bold text-[#0F291E]">{selectedMemberNode.generation}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]">
                <div className="text-zinc-500 mb-1">المقر الجغرافي والتاريخي:</div>
                <div className="font-bold text-[#141413]">{selectedMemberNode.location || 'الوطن العربي'}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8]">
                <div className="text-zinc-500 mb-1">الرقم المرجعي / التوثيق:</div>
                <div dir="ltr" className="font-mono font-bold text-[#695022] text-right">
                  {selectedMemberNode.serialNumber || 'غير مقيد بشهادة منفردة'}
                </div>
              </div>
            </div>

            {/* Computed Full Lineage Chain up to Root Ancestor */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#0F291E] to-[#141E28] text-white space-y-3">
              <div className="text-xs font-bold text-[#C5A059]">
                عمود النسب المتصل في المشجرة (من الفرع حتى الجد الجامع):
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs leading-relaxed">
                {selectedMemberChain.map((ancestor, idx) => (
                  <React.Fragment key={ancestor.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedMemberNode(ancestor)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                        idx === 0
                          ? 'bg-[#C5A059] text-[#141413]'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {ancestor.name}
                    </button>
                    {idx < selectedMemberChain.length - 1 && (
                      <span className="text-[#C5A059] font-bold">← ابن / من أعقاب ←</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Direct Children / Branches */}
            {selectedMemberChildren.length > 0 && (
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-[#695022] flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>الأبناء والفروع المتفرعة مباشرة من {selectedMemberNode.name}:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedMemberChildren.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => setSelectedMemberNode(child)}
                      className="p-3 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] hover:border-[#695022] text-right transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs text-[#141413]">{child.name}</div>
                        <div className="text-[10px] text-zinc-500">{child.location}</div>
                      </div>
                      <span className="text-[10px] font-bold text-[#0F291E]">عرض الفرع ←</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#E6E2D8] flex flex-wrap items-center justify-between gap-3">
              {selectedMemberNode.serialNumber &&
              selectedMemberNode.serialNumber.startsWith('ELS-') ? (
                <button
                  type="button"
                  onClick={() => {
                    const serial = selectedMemberNode.serialNumber;
                    setSelectedMemberNode(null);
                    onNavigate('verify', serial);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#0F291E] text-white text-xs font-bold hover:bg-[#695022] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>استعراض وتحقق من شهادة النسب الرسمية ({selectedMemberNode.serialNumber})</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMemberNode(null);
                    onNavigate('verify');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#F7F6F2] border border-[#E6E2D8] text-[#0F291E] text-xs font-bold hover:border-[#695022] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#695022]" />
                  <span>الانتقال إلى بوابة التحقق من الشهادات</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedMemberNode(null)}
                className="px-5 py-2.5 rounded-xl bg-zinc-100 text-zinc-700 text-xs font-bold hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                إغلاق البطاقة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Zoom/Pan Lightbox Modal for Family Tree Image */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="فحص وثيقة شجرة عائلة الصعيدي بالحجم المكبّر"
          className="fixed inset-0 z-50 bg-black/85 flex flex-col justify-between p-4 sm:p-6"
          onClick={() => setIsLightboxOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsLightboxOpen(false);
          }}
          tabIndex={-1}
        >
          {/* Lightbox Top Bar */}
          <div
            className="bg-white rounded-xl border border-[#E6E2D8] px-5 py-3.5 flex flex-wrap items-center justify-between gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="text-base sm:text-lg font-extrabold text-[#141413]">
                فحص وثيقة شجرة عائلة الصعيدي بالحجم المكبّر
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setLightboxZoom((z) => Math.min(z + 0.3, 3.5))}
                className="px-3 py-1.5 rounded-lg bg-[#F7F6F2] border border-[#E6E2D8] text-xs font-bold text-[#141413] hover:border-[#695022] cursor-pointer"
              >
                تكبير +
              </button>
              <button
                type="button"
                onClick={() => setLightboxZoom((z) => Math.max(z - 0.3, 0.75))}
                className="px-3 py-1.5 rounded-lg bg-[#F7F6F2] border border-[#E6E2D8] text-xs font-bold text-[#141413] hover:border-[#695022] cursor-pointer"
              >
                تصغير -
              </button>
              <button
                type="button"
                onClick={() => setLightboxZoom(1)}
                className="px-3 py-1.5 rounded-lg bg-[#F7F6F2] border border-[#E6E2D8] text-xs font-mono text-zinc-700 cursor-pointer"
              >
                {Math.round(lightboxZoom * 100)}%
              </button>
              <a
                href={activeTreeImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-[#0F291E] text-white text-xs font-bold flex items-center gap-1"
              >
                <span>فتح الأصل في نافذة جديدة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-1.5 rounded-lg bg-[#141413] text-white hover:bg-[#695022] cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Zoom Viewport */}
          <div
            className="flex-1 overflow-auto my-4 rounded-xl bg-[#0D131A]/70 border border-white/15 p-4 sm:p-6 flex items-start justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeTreeImageUrl}
              alt="وثيقة شجرة عائلة الصعيدي بالحجم الكامل"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              style={{
                transform: `scale(${lightboxZoom})`,
                transformOrigin: 'top center',
              }}
              className="max-w-full h-auto bg-white p-2 rounded-lg border border-[#695022] transition-transform duration-150"
            />
          </div>

          <div
            className="bg-white rounded-xl border border-[#E6E2D8] px-5 py-3 text-xs text-zinc-600 flex items-center justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <span>يمكنك التمرير أفقياً وعمودياً لقراءة تفاصيل الأسماء والفروع داخل الوثيقة.</span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="font-bold text-[#695022] hover:text-[#141413] cursor-pointer"
            >
              إغلاق العرض المكبّر
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyTreePage;
