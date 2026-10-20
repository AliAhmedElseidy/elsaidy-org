import React, { useState } from 'react';
import { GEOGRAPHICAL_PRESENCE } from '../data/familyData';
import { Compass, MapPin } from 'lucide-react';

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
    <div className="w-full h-full bg-[#F1EFEA] border border-[#DCD9D0] flex flex-col justify-between">
      {/* Top Archival Plate Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 border-b border-[#DCD9D0] bg-[#F8F7F4]">
        <div className="flex items-center gap-2 text-xs text-[#141413]">
          <Compass className="w-4 h-4 text-[#8C6D32] shrink-0" />
          <span className="font-semibold text-[#1B3B2B]">اللوحة الوثائقية والنسبية</span>
          <span aria-hidden="true" className="text-[#8C6D32]">·</span>
          <span className="text-zinc-600">قبيلة جهينة — ينبع النخل</span>
        </div>

        {/* Interactive Segmented Plate Switcher */}
        <div
          className="flex items-center border border-[#DCD9D0] bg-[#F1EFEA] p-0.5"
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
                ? 'bg-[#1B3B2B] text-[#F8F7F4]'
                : 'text-zinc-700 hover:text-[#141413]'
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
                ? 'bg-[#1B3B2B] text-[#F8F7F4]'
                : 'text-zinc-700 hover:text-[#141413]'
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
            <div className="inline-block border border-[#1B3B2B] bg-[#1B3B2B] text-[#F8F7F4] px-5 py-2.5">
              <div className="text-[11px] text-[#D6C295] font-medium">
                الجد السابع الجامع · قبيلة جهينة (ينبع النخل)
              </div>
              <div className="font-display text-lg font-bold">
                إبراهيم الصعيدي
              </div>
            </div>

            <div className="w-px h-3 bg-[#8C6D32] mx-auto" />

            {/* Son: Awad Al-Brahim */}
            <div>
              <div className="inline-block border border-[#8C6D32] bg-[#F8F7F4] px-5 py-2">
                <div className="text-[11px] text-[#8C6D32] font-semibold">عمود التفرع</div>
                <div className="font-display text-base font-bold text-[#141413]">
                  عوض البراهيم
                </div>
              </div>
            </div>

            <div className="w-px h-3 bg-[#8C6D32] mx-auto" />

            {/* Three Sons of Awad Al-Brahim */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-right pt-2 border-t border-[#8C6D32]/50">
              {/* Branch 1: Abdullah (Taima) */}
              <button
                type="button"
                onClick={() => onSelectBranch('taima')}
                className={`p-3 border text-right transition-colors cursor-pointer ${
                  activeBranchId === 'taima'
                    ? 'bg-[#F8F7F4] border-[#8C6D32]'
                    : 'bg-[#F8F7F4]/80 border-[#DCD9D0] hover:border-[#8C6D32]/60'
                }`}
              >
                <div className="text-[11px] text-[#8C6D32] font-semibold mb-0.5">
                  ١. فرع تيماء
                </div>
                <div className="font-display text-base font-bold text-[#141413] mb-1">
                  عبد الله بن عوض
                </div>
                <p className="text-[11px] text-zinc-600 leading-relaxed">
                  استقر بتيماء مع أبنائه: <strong>عوض، حامد، حمدان، بشير</strong>.
                </p>
              </button>

              {/* Branch 2: Salama (Jabal Al-Arab - Syria) */}
              <button
                type="button"
                onClick={() => onSelectBranch('levant-jabal-alarab')}
                className={`p-3 border text-right transition-colors cursor-pointer ${
                  activeBranchId === 'levant-jabal-alarab'
                    ? 'bg-[#F8F7F4] border-[#8C6D32]'
                    : 'bg-[#F8F7F4]/80 border-[#DCD9D0] hover:border-[#8C6D32]/60'
                }`}
              >
                <div className="text-[11px] text-[#8C6D32] font-semibold mb-0.5">
                  ٢. فرع بلاد الشام
                </div>
                <div className="font-display text-base font-bold text-[#141413] mb-1">
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
                    ? 'bg-[#F8F7F4] border-[#8C6D32]'
                    : 'bg-[#F8F7F4]/80 border-[#DCD9D0] hover:border-[#8C6D32]/60'
                }`}
              >
                <div className="text-[11px] text-[#8C6D32] font-semibold mb-0.5">
                  ٣. فرع حائل والرياض والخليج
                </div>
                <div className="font-display text-base font-bold text-[#141413] mb-1">
                  صالح ← عبد الله
                </div>
                <p className="text-[11px] text-zinc-600 leading-relaxed">
                  أبناء عبد الله الثلاثة: <strong>إبراهيم</strong> (حائل)، <strong>ناصر</strong>{' '}
                  (الرياض)، <strong>علي</strong> (الإمارات وعُمان).
                </p>
              </button>
            </div>

            {/* Sub-branches of Abdullah bin Saleh */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-right pt-2 border-t border-[#DCD9D0]">
              <button
                type="button"
                onClick={() => onSelectBranch('hail-zubarah')}
                className="p-2.5 bg-[#F8F7F4] border border-[#DCD9D0] hover:border-[#8C6D32] text-right transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-[#1B3B2B]">
                  إبراهيم بن عبد الله
                </div>
                <div className="text-[11px] text-zinc-600 mt-0.5">
                  مدينة حائل — حي الزبارة
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSelectBranch('riyadh')}
                className="p-2.5 bg-[#F8F7F4] border border-[#DCD9D0] hover:border-[#8C6D32] text-right transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-[#1B3B2B]">
                  ناصر (وابنه حمود شئون البادية)
                </div>
                <div className="text-[11px] text-zinc-600 mt-0.5">
                  مدينة الرياض — نجد
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSelectBranch('uae-ajman')}
                className="p-2.5 bg-[#F8F7F4] border border-[#DCD9D0] hover:border-[#8C6D32] text-right transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-[#1B3B2B]">
                  علي (عبد الله وعمر ومحمد وخليفة)
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
              className="w-full h-auto max-h-[290px] select-none bg-[#F8F7F4] border border-[#DCD9D0]"
              role="img"
              aria-label="خارطة منازل وفروع عائلة الصعيدي في الجزيرة العربية وبلاد الشام والخليج العربي"
            >
              {/* Archival Grid Lines */}
              <line x1="0" y1="90" x2="680" y2="90" stroke="#DCD9D0" strokeDasharray="3 3" />
              <line x1="0" y1="180" x2="680" y2="180" stroke="#DCD9D0" strokeDasharray="3 3" />
              <line x1="0" y1="270" x2="680" y2="270" stroke="#DCD9D0" strokeDasharray="3 3" />
              <line x1="170" y1="0" x2="170" y2="370" stroke="#DCD9D0" strokeDasharray="3 3" />
              <line x1="340" y1="0" x2="340" y2="370" stroke="#DCD9D0" strokeDasharray="3 3" />
              <line x1="510" y1="0" x2="510" y2="370" stroke="#DCD9D0" strokeDasharray="3 3" />

              {/* Arabian Peninsula Classical Cartographic Contour */}
              <path
                d="M140,75 L260,65 L350,110 L450,180 L585,245 L620,315 L550,355 L330,360 L230,345 L180,250 L145,170 Z"
                fill="#F1EFEA"
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
                stroke="#1B3B2B"
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
                      fill={isSelected ? '#8C6D32' : '#F8F7F4'}
                      stroke="#1B3B2B"
                      strokeWidth="1.75"
                    />
                    <rect
                      x={loc.coordinates.x - 54}
                      y={loc.coordinates.y - 30}
                      width="108"
                      height="19"
                      fill={isSelected ? '#1B3B2B' : '#F8F7F4'}
                      stroke={isSelected ? '#1B3B2B' : '#CFCBC0'}
                      strokeWidth="1"
                    />
                    <text
                      x={loc.coordinates.x}
                      y={loc.coordinates.y - 17}
                      textAnchor="middle"
                      fill={isSelected ? '#F8F7F4' : '#141413'}
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
      <div className="px-5 py-3.5 border-t border-[#DCD9D0] bg-[#F8F7F4]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#8C6D32]">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold text-[#1B3B2B]">
                {selectedRegion.index} · {selectedRegion.regionName}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-zinc-600">{selectedRegion.keyFigures}</span>
            </div>
            <p className="text-xs text-[#141413] mt-1 leading-relaxed">
              {selectedRegion.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
