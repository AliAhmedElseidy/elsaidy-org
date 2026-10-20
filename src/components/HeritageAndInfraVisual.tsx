import React, { useState } from 'react';
import { FAMILY_BRANCHES, INFRASTRUCTURE_SERVICES } from '../data/familyData';
import { Compass, Server, MapPin, ExternalLink, Layers } from 'lucide-react';

interface HeritageAndInfraVisualProps {
  activeBranchId: string;
  onSelectBranch: (id: string) => void;
  onSelectService: (serviceId: string) => void;
  isDark: boolean;
}

export const HeritageAndInfraVisual: React.FC<HeritageAndInfraVisualProps> = ({
  activeBranchId,
  onSelectBranch,
  onSelectService,
  isDark
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'architecture'>('map');
  const selectedBranch =
    FAMILY_BRANCHES.find((b) => b.id === activeBranchId) || FAMILY_BRANCHES[0];

  return (
    <div
      className={`relative w-full h-full min-h-[460px] rounded-2xl border overflow-hidden flex flex-col justify-between transition-colors duration-200 ${
        isDark
          ? 'bg-[#0B1320] border-slate-800/90 text-slate-100'
          : 'bg-[#101D2E] border-slate-800/20 text-slate-100'
      }`}
    >
      {/* Subtle Architectural Geometric Arabesque SVG Backdrop */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="arabesque-grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M40 0 L80 40 L40 80 L0 40 Z"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="0.75"
            />
            <circle
              cx="40"
              cy="40"
              r="18"
              fill="none"
              stroke="#10B981"
              strokeWidth="0.5"
            />
            <path
              d="M0 0 L80 80 M80 0 L0 80"
              stroke="#D4AF37"
              strokeWidth="0.35"
              strokeDasharray="2 4"
            />
          </pattern>
          <radialGradient id="gold-glow" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#C59B27" stopOpacity="0.24" />
            <stop offset="55%" stopColor="#0D9488" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0B1320" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="600" fill="url(#arabesque-grid)" />
        <rect width="800" height="600" fill="url(#gold-glow)" />
      </svg>

      {/* Top Interactive Mode Bar inside Canvas */}
      <div className="relative z-10 flex items-center justify-between gap-4 px-5 py-4 border-b border-white/10 bg-[#0B1320]/70 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs text-amber-200/90">
          <Compass className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <span>أطلس الجذور والسيادة الرقمية</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-[11px] text-slate-400">elsaidy.org</span>
        </div>

        {/* Interactive Segmented Control */}
        <div
          className="flex items-center gap-1 p-1 rounded-lg bg-slate-900/90 border border-white/10"
          role="tablist"
          aria-label="تبديل العرض التفاعلي"
        >
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'map'}
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === 'map'
                ? 'bg-[#C59B27] text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            خريطة الجذور والفروع
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'architecture'}
            onClick={() => setViewMode('architecture')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === 'architecture'
                ? 'bg-[#C59B27] text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            معمارية البنية الرقمية
          </button>
        </div>
      </div>

      {/* Main Interactive SVG Viewport */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 py-3">
        {viewMode === 'map' ? (
          <div className="w-full">
            <svg
              viewBox="0 0 680 390"
              className="w-full h-auto max-h-[300px] select-none"
              role="img"
              aria-label="خريطة تفاعلية لجذور وفروع عائلة الصعيدي في الجزيرة العربية وبلاد الشام والخليج"
            >
              <defs>
                <linearGradient id="route-line" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.75" />
                </linearGradient>
                <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Stylized Cartographic Outline of Arabian Peninsula, Red Sea, Levant & Arabian Gulf */}
              <path
                d="M140,85 L255,75 L340,115 L440,185 L565,245 L615,310 L555,365 L340,380 L235,360 L185,260 L150,180 Z"
                fill="#132238"
                stroke="#294060"
                strokeWidth="1.5"
              />
              {/* Red Sea Stylized Contour */}
              <path
                d="M150,185 L195,255 L240,365 L205,375 L155,270 L125,195 Z"
                fill="#091526"
                stroke="#1E3A5F"
                strokeWidth="1"
              />
              {/* Arabian Gulf Stylized Contour */}
              <path
                d="M445,190 L555,245 L580,275 L525,285 L435,220 Z"
                fill="#091526"
                stroke="#1E3A5F"
                strokeWidth="1"
              />

              {/* Subtle Latitude / Longitude Grid Lines */}
              <line x1="80" y1="130" x2="620" y2="130" stroke="#1E293B" strokeDasharray="3 3" />
              <line x1="80" y1="220" x2="620" y2="220" stroke="#1E293B" strokeDasharray="3 3" />
              <line x1="80" y1="310" x2="620" y2="310" stroke="#1E293B" strokeDasharray="3 3" />
              <line x1="240" y1="50" x2="240" y2="375" stroke="#1E293B" strokeDasharray="3 3" />
              <line x1="380" y1="50" x2="380" y2="375" stroke="#1E293B" strokeDasharray="3 3" />
              <line x1="520" y1="50" x2="520" y2="375" stroke="#1E293B" strokeDasharray="3 3" />

              {/* Historical Migration & Lineage Connection Arcs from Yanbu (240, 310) */}
              {/* Yanbu -> Taima/Tabuk (255, 205) */}
              <path
                d="M240,310 Q225,255 255,205"
                fill="none"
                stroke="url(#route-line)"
                strokeWidth="2.2"
                strokeDasharray="4 2"
              />
              {/* Taima -> Levant (215, 120) */}
              <path
                d="M255,205 Q235,160 215,120"
                fill="none"
                stroke="url(#route-line)"
                strokeWidth="2.2"
                strokeDasharray="4 2"
              />
              {/* Yanbu & Taima -> Hail & Riyadh (355, 245) */}
              <path
                d="M240,310 Q305,285 355,245"
                fill="none"
                stroke="url(#route-line)"
                strokeWidth="2.2"
              />
              <path
                d="M255,205 Q310,215 355,245"
                fill="none"
                stroke="url(#route-line)"
                strokeWidth="1.6"
                strokeDasharray="3 3"
              />
              {/* Hail/Riyadh -> UAE & Oman (525, 315) */}
              <path
                d="M355,245 Q445,270 525,315"
                fill="none"
                stroke="url(#route-line)"
                strokeWidth="2.2"
              />

              {/* Interactive Branch Nodes */}
              {FAMILY_BRANCHES.map((branch) => {
                const isSelected = branch.id === selectedBranch.id;
                return (
                  <g
                    key={branch.id}
                    className="cursor-pointer group"
                    onClick={() => onSelectBranch(branch.id)}
                  >
                    {isSelected && (
                      <circle
                        cx={branch.coordinates.x}
                        cy={branch.coordinates.y}
                        r="18"
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth="1.5"
                        strokeOpacity="0.6"
                      />
                    )}
                    <circle
                      cx={branch.coordinates.x}
                      cy={branch.coordinates.y}
                      r={isSelected ? '9' : '6.5'}
                      fill={isSelected ? '#D4AF37' : '#0F172A'}
                      stroke={isSelected ? '#FEF08A' : '#D4AF37'}
                      strokeWidth="2.2"
                      filter={isSelected ? 'url(#soft-glow)' : undefined}
                    />
                    <rect
                      x={branch.coordinates.x - 58}
                      y={branch.coordinates.y - 36}
                      width="116"
                      height="22"
                      rx="4"
                      fill={isSelected ? '#C59B27' : '#0F172A'}
                      fillOpacity={isSelected ? '0.96' : '0.88'}
                      stroke={isSelected ? '#FEF08A' : '#334155'}
                      strokeWidth="1"
                    />
                    <text
                      x={branch.coordinates.x}
                      y={branch.coordinates.y - 21}
                      textAnchor="middle"
                      fill={isSelected ? '#090D16' : '#F8FAFC'}
                      fontSize="11"
                      fontWeight={isSelected ? '700' : '500'}
                    >
                      {branch.coordinates.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          /* Sovereign Digital Architecture Diagram View */
          <div className="w-full py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INFRASTRUCTURE_SERVICES.slice(0, 4).map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => onSelectService(service.id)}
                  className="text-right p-3.5 rounded-xl bg-slate-900/90 border border-white/10 hover:border-[#D4AF37]/60 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs text-[#D4AF37] font-semibold">
                      {service.domain}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#D4AF37] transition-colors shrink-0" />
                  </div>
                  <div className="text-sm font-semibold text-white mb-1">
                    {service.arabicTitle}
                  </div>
                  <div className="text-xs text-slate-400 line-clamp-1">
                    {service.protocol}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between gap-4 text-xs text-emerald-200">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>بوابة الهوية الموحدة (SSO) تربط كافة أنظمة العائلة عبر النطاق الرسمي</span>
              </div>
              <span className="font-mono text-[11px] text-emerald-300 shrink-0">id.elsaidy.org</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Active Branch / Context Summary Bar inside Visual Canvas */}
      <div className="relative z-10 p-4 border-t border-white/10 bg-[#080F1A]/90 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#D4AF37] mb-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{selectedBranch.patriarch}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-300">{selectedBranch.cities.join(' ، ')}</span>
            </div>
            <h3 className="text-sm font-semibold text-white">
              {selectedBranch.index}. {selectedBranch.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              {selectedBranch.summary}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
            {FAMILY_BRANCHES.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => onSelectBranch(b.id)}
                className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  b.id === selectedBranch.id
                    ? 'bg-[#C59B27] text-slate-950 font-semibold'
                    : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
                }`}
                title={b.title}
              >
                {b.index}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
