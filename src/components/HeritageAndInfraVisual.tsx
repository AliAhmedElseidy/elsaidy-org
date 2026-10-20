import React, { useState } from 'react';
import { GEOGRAPHICAL_PRESENCE } from '../data/familyData';
import { Compass, GitBranch, MapPin } from 'lucide-react';

interface HeritageAndInfraVisualProps {
  activeBranchId: string;
  onSelectBranch: (id: string) => void;
}

export const HeritageAndInfraVisual: React.FC<HeritageAndInfraVisualProps> = ({
  activeBranchId,
  onSelectBranch
}) => {
  const [plateMode, setPlateMode] = useState<'genealogy' | 'atlas'>('genealogy');

  const selectedRegion =
    GEOGRAPHICAL_PRESENCE.find((b) => b.id === activeBranchId) ||
    GEOGRAPHICAL_PRESENCE[0];

  return (
    <div className="w-full h-full bg-[#F3F1EC] border border-[#E2DFD7] flex flex-col justify-between">
      {/* Top Archival Plate Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 border-b border-[#E2DFD7] bg-[#F9F8F6]">
        <div className="flex items-center gap-2 text-xs text-[#18181B]">
          <Compass className="w-4 h-4 text-[#8C6D32] shrink-0" />
          <span className="font-semibold">اللوحة الوثائقية والنسبية</span>
          <span aria-hidden="true" className="text-[#8C6D32]">·</span>
          <span className="text-zinc-600">قبيلة جهينة — ينبع النخل</span>
        </div>

        {/* Interactive Segmented Plate Switcher */}
        <div
          className="flex items-center border border-[#E2DFD7] bg-[#F3F1EC] p-0.5"
          role="tablist"
          aria-label="تبديل اللوحة الوثائقية"
        >
          <button
            type="button"
            role="tab"
            aria-selected={plateMode === 'genealogy'}
            onClick={() => setPlateMode('genealogy')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              plateMode === 'genealogy'
                ? 'bg-[#18181B] text-[#F9F8F6]'
                : 'text-zinc-700 hover:text-[#18181B]'
            }`}
          >
            مشجرة النسب والتفرع
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={plateMode === 'atlas'}
            onClick={() => setPlateMode('atlas')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              plateMode === 'atlas'
                ? 'bg-[#18181B] text-[#F9F8F6]'
                : 'text-zinc-700 hover:text-[#18181B]'
            }`}
          >
            خارطة المنازل والحواضر
          </button>
        </div>
      </div>

      {/* Main Plate Body */}
      <div className="p-5 flex-1 flex flex-col justify-center">
        {plateMode === 'genealogy' ? (
          /* Archival Genealogical Chart from 7th Grandfather Ibrahim Elsaidy */
          <div className="space-y-4 text-center">
            {/* Root Patriarch */}
            <div className="inline-block border border-[#8C6D32] bg-[#F9F8F6] px-5 py-2.5">
              <div className="text-[11px] text-[#8C6D32] font-medium">
                الجد السابع الجامع · قبيلة جهينة (ينبع النخل)
              </div>
              <div className="font-display text-lg font-bold text-[#18181B]">
                إبراهيم الصعيدي
              </div>
            </div>

            <div className="w-px h-3 bg-[#8C6D32] mx-auto" />

            {/* Son: Awad Al-Brahim */}
            <div>
              <div className="inline-block border border-[#E2DFD7] bg-[#F9F8F6] px-5 py-2">
                <div className="text-[11px] text-zinc-500">الفرع الجامع</div>
                <div className="font-display text-base font-bold text-[#18181B]">
                  عوض البراهيم
                </div>
              </div>
            </div>

            <div className="w-px h-3 bg-[#8C6D32] mx-auto" />

            {/* Three Sons of Awad Al-Brahim */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-right pt-1 border-t border-[#8C6D32]/40">
              {/* Branch 1: Abdullah (Taima) */}
              <button
                type="button"
                onClick={() => onSelectBranch('taima')}
                className={`p-3 border text-right transition-colors cursor-pointer ${
                  activeBranchId === 'taima'
                    ? 'bg-[#F9F8F6] border-[#8C6D32]'
                    : 'bg-[#F9F8F6]/70 border-[#E2DFD7] hover:border-[#8C6D32]/60'
                }`}
              >
                <div className="text-[11px] text-[#8C6D32] font-semibold mb-0.5">
                  ١. فرع محافظة تيماء
                </div>
                <div className="font-display text-base font-bold text-[#18181B] mb-1">
                  عبد الله بن عوض
                </div>
                <p className="text-[11px] text-zinc-600 leading-relaxed">
                  استقر بتيماء مع أبنائه الأربعة: <strong>عوض، وحامد، وحمدان، وبشير</strong>.
                </p>
              </button>

              {/* Branch 2: Salama (Jabal Al-Arab - Syria) */}
              <button
                type="button"
                onClick={() => onSelectBranch('levant-jabal-alarab')}
                className={`p-3 border text-right transition-colors cursor-pointer ${
                  activeBranchId === 'levant-jabal-alarab'
                    ? 'bg-[#F9F8F6] border-[#8C6D32]'
                    : 'bg-[#F9F8F6]/70 border-[#E2DFD7] hover:border-[#8C6D32]/60'
                }`}
              >
                <div className="text-[11px] text-[#8C6D32] font-semibold mb-0.5">
                  ٢. فرع بلاد الشام
                </div>
                <div className="font-display text-base font-bold text-[#18181B] mb-1">
                  سلامة بن عوض
                </div>
                <p className="text-[11px] text-zinc-600 leading-relaxed">
                  سكن <strong>جبل العرب بقرية أم ولد</strong> في بلاد الشام (سوريا).
                </p>
              </button>

              {/* Branch 3: Saleh (Hail, Riyadh, UAE, Oman) */}
              <button
                type="button"
                onClick={() => onSelectBranch('hail-zubarah')}
                className={`p-3 border text-right transition-colors cursor-pointer ${
                  ['hail-zubarah', 'riyadh', 'uae-ajman', 'oman-khaburah'].includes(activeBranchId)
                    ? 'bg-[#F9F8F6] border-[#8C6D32]'
                    : 'bg-[#F9F8F6]/70 border-[#E2DFD7] hover:border-[#8C6D32]/60'
                }`}
              >
                <div className="text-[11px] text-[#8C6D32] font-semibold mb-0.5">
                  ٣. فرع حائل والرياض والخليج
                </div>
                <div className="font-display text-base font-bold text-[#18181B] mb-1">
                  صالح بن عوض ← عبد الله
                </div>
                <p className="text-[11px] text-zinc-600 leading-relaxed">
                  أبناء عبد الله بن صالح الثلاثة: <strong>إبراهيم</strong> (حائل)،{' '}
                  <strong>وناصر</strong> (الرياض)، <strong>وعلي</strong> (الإمارات وعُمان).
                </p>
              </button>
            </div>

            {/* Sub-branches of Abdullah bin Saleh */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-right pt-2 border-t border-[#E2DFD7]">
              <button
                type="button"
                onClick={() => onSelectBranch('hail-zubarah')}
                className="p-2.5 bg-[#F9F8F6] border border-[#E2DFD7] hover:border-[#8C6D32] text-right transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-[#18181B]">
                  أبناء إبراهيم بن عبد الله
                </div>
                <div className="text-[11px] text-zinc-600 mt-0.5">
                  مدينة حائل — حي الزبارة
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSelectBranch('riyadh')}
                className="p-2.5 bg-[#F9F8F6] border border-[#E2DFD7] hover:border-[#8C6D32] text-right transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-[#18181B]">
                  أبناء ناصر (وحمود شؤون البادية)
                </div>
                <div className="text-[11px] text-zinc-600 mt-0.5">
                  مدينة الرياض — نجد
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSelectBranch('uae-ajman')}
                className="p-2.5 bg-[#F9F8F6] border border-[#E2DFD7] hover:border-[#8C6D32] text-right transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-[#18181B]">
                  أبناء علي (عبد الله وعمر ومحمد وخليفة)
                </div>
                <div className="text-[11px] text-zinc-600 mt-0.5">
                  عجمان (مشرف والجرف) · عُمان (الخابورة)
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Engraved Archival Atlas View on Warm Alabaster Paper */
          <div className="w-full">
            <svg
              viewBox="0 0 680 370"
              className="w-full h-auto max-h-[290px] select-none bg-[#F9F8F6] border border-[#E2DFD7]"
              role="img"
              aria-label="خارطة منازل وفروع عائلة الصعيدي في الجزيرة العربية وبلاد الشام والخليج العربي"
            >
              {/* Archival Grid Lines */}
              <line x1="0" y1="90" x2="680" y2="90" stroke="#E2DFD7" strokeDasharray="3 3" />
              <line x1="0" y1="180" x2="680" y2="180" stroke="#E2DFD7" strokeDasharray="3 3" />
              <line x1="0" y1="270" x2="680" y2="270" stroke="#E2DFD7" strokeDasharray="3 3" />
              <line x1="170" y1="0" x2="170" y2="370" stroke="#E2DFD7" strokeDasharray="3 3" />
              <line x1="340" y1="0" x2="340" y2="370" stroke="#E2DFD7" strokeDasharray="3 3" />
              <line x1="510" y1="0" x2="510" y2="370" stroke="#E2DFD7" strokeDasharray="3 3" />

              {/* Arabian Peninsula Classical Cartographic Contour */}
              <path
                d="M140,75 L260,65 L350,110 L450,180 L585,245 L620,315 L550,355 L330,360 L230,345 L180,250 L145,170 Z"
                fill="#F3F1EC"
                stroke="#C5BFA8"
                strokeWidth="1.5"
              />

              {/* Historical Lineage Routes from Yanbu Al-Nakhl (235, 300) */}
              <path
                d="M235,300 L255,205 L210,180 L225,110"
                fill="none"
                stroke="#8C6D32"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <path
                d="M235,300 L335,215 L390,270 L520,280 L565,325"
                fill="none"
                stroke="#8C6D32"
                strokeWidth="1.5"
              />

              {/* Interactive Location Markers */}
              {GEOGRAPHICAL_PRESENCE.map((loc) => {
                const isSelected = loc.id === selectedRegion.id;
                return (
                  <g
                    key={loc.id}
                    onClick={() => onSelectBranch(loc.id)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={loc.coordinates.x}
                      cy={loc.coordinates.y}
                      r={isSelected ? '7.5' : '5'}
                      fill={isSelected ? '#8C6D32' : '#F9F8F6'}
                      stroke="#18181B"
                      strokeWidth="1.75"
                    />
                    <rect
                      x={loc.coordinates.x - 54}
                      y={loc.coordinates.y - 30}
                      width="108"
                      height="19"
                      fill={isSelected ? '#18181B' : '#F9F8F6'}
                      stroke={isSelected ? '#18181B' : '#CFCBC0'}
                      strokeWidth="1"
                    />
                    <text
                      x={loc.coordinates.x}
                      y={loc.coordinates.y - 17}
                      textAnchor="middle"
                      fill={isSelected ? '#F9F8F6' : '#18181B'}
                      fontSize="10"
                      fontWeight={isSelected ? '700' : '500'}
                    >
                      {loc.coordinates.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>

      {/* Bottom Selected Station Caption Footer */}
      <div className="px-5 py-3.5 border-t border-[#E2DFD7] bg-[#F9F8F6]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#8C6D32]">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold">
                {selectedRegion.index} · {selectedRegion.regionName}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-zinc-600">{selectedRegion.keyFigures}</span>
            </div>
            <p className="text-xs text-[#18181B] mt-1 leading-relaxed">
              {selectedRegion.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
