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
  const [plateMode, setPlateMode] = useState<'atlas' | 'genealogy'>('atlas');

  const selectedRegion =
    GEOGRAPHICAL_PRESENCE.find((b) => b.id === activeBranchId) ||
    GEOGRAPHICAL_PRESENCE[0];

  return (
    <div className="w-full h-full bg-white rounded-xl border border-[#E6E2D8] border-t-4 border-t-[#9A7B3E] shadow-md flex flex-col justify-between overflow-hidden">
      {/* Top Luxury Plate Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-[#E6E2D8] bg-[#F7F6F2]">
        <div className="flex items-center gap-2 text-xs text-[#141413]">
          <Compass className="w-4 h-4 text-[#9A7B3E] shrink-0" />
          <span className="font-bold text-[#0F291E]">اللوحة الجغرافية والنسبية التفاعلية</span>
          <span aria-hidden="true" className="text-[#9A7B3E]">·</span>
          <span className="text-zinc-600">مصر · السعودية · الشام · الخليج · المغرب العربي</span>
        </div>

        {/* Interactive Segmented Plate Switcher */}
        <div
          className="flex items-center rounded-lg border border-[#E2DDD3] bg-white p-1"
          role="tablist"
          aria-label="تبديل اللوحة التفاعلية"
        >
          <button
            type="button"
            role="tab"
            aria-selected={plateMode === 'atlas'}
            onClick={() => setPlateMode('atlas')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              plateMode === 'atlas'
                ? 'bg-[#0F291E] text-white shadow-sm'
                : 'text-zinc-700 hover:text-[#141413]'
            }`}
          >
            خارطة الانتشار العربي
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={plateMode === 'genealogy'}
            onClick={() => setPlateMode('genealogy')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              plateMode === 'genealogy'
                ? 'bg-[#0F291E] text-white shadow-sm'
                : 'text-zinc-700 hover:text-[#141413]'
            }`}
          >
            عمود النسب والتفرع
          </button>
        </div>
      </div>

      {/* Main Plate Body */}
      <div className="p-6 flex-1 flex flex-col justify-center bg-white">
        {plateMode === 'atlas' ? (
          /* Sleek Pan-Arab Interactive Atlas (Egypt, Arabia, Levant, Gulf, Maghreb) */
          <div className="w-full space-y-4">
            <div className="rounded-xl overflow-hidden border border-[#E6E2D8] bg-[#F7F6F2] p-2">
              <svg
                viewBox="0 0 680 370"
                className="w-full h-auto max-h-[290px] select-none"
                role="img"
                aria-label="خارطة انتشار عائلات الصعيدي في مصر والسعودية والشام والخليج والمغرب العربي"
              >
                {/* Subtle Coordinate Grid Lines */}
                <line x1="0" y1="90" x2="680" y2="90" stroke="#E2DDD3" strokeDasharray="3 3" />
                <line x1="0" y1="180" x2="680" y2="180" stroke="#E2DDD3" strokeDasharray="3 3" />
                <line x1="0" y1="270" x2="680" y2="270" stroke="#E2DDD3" strokeDasharray="3 3" />
                <line x1="170" y1="0" x2="170" y2="370" stroke="#E2DDD3" strokeDasharray="3 3" />
                <line x1="340" y1="0" x2="340" y2="370" stroke="#E2DDD3" strokeDasharray="3 3" />
                <line x1="510" y1="0" x2="510" y2="370" stroke="#E2DDD3" strokeDasharray="3 3" />

                {/* North Africa, Egypt & Sudan Contour */}
                <path
                  d="M25,145 L168,135 L182,300 L155,350 L30,350 Z"
                  fill="#EFECE4"
                  stroke="#C5A059"
                  strokeWidth="1.2"
                />

                {/* Arabian Peninsula, Levant & Iraq Contour */}
                <path
                  d="M190,72 L285,62 L365,110 L460,180 L590,245 L625,315 L550,355 L330,360 L230,345 L195,250 L185,170 Z"
                  fill="#EFECE4"
                  stroke="#C5A059"
                  strokeWidth="1.2"
                />

                {/* Historical & Regional Connection Routes */}
                <path
                  d="M235,300 L135,255 L125,182 L118,155 L75,230"
                  fill="none"
                  stroke="#9A7B3E"
                  strokeWidth="1.75"
                  strokeDasharray="4 3"
                />
                <path
                  d="M235,300 L255,205 L205,132 L225,110"
                  fill="none"
                  stroke="#9A7B3E"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <path
                  d="M235,300 L335,215 L390,270 L520,280 L565,325"
                  fill="none"
                  stroke="#0F291E"
                  strokeWidth="1.75"
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
                      {isSelected && (
                        <circle
                          cx={loc.coordinates.x}
                          cy={loc.coordinates.y}
                          r="13"
                          fill="#9A7B3E"
                          fillOpacity="0.18"
                          stroke="#9A7B3E"
                          strokeWidth="1.5"
                        />
                      )}
                      <circle
                        cx={loc.coordinates.x}
                        cy={loc.coordinates.y}
                        r={isSelected ? '6' : '4.5'}
                        fill={isSelected ? '#0F291E' : '#9A7B3E'}
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                      <text
                        x={loc.coordinates.x}
                        y={loc.coordinates.y - 11}
                        textAnchor="middle"
                        fill={isSelected ? '#0F291E' : '#3F3F46'}
                        fontSize={isSelected ? '11' : '9.5'}
                        fontWeight={isSelected ? '800' : '600'}
                      >
                        {loc.coordinates.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Quick Country Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'egypt-gharbia-tanta', label: '١. مصر (الغربية وطنطا والصعيد)' },
                { id: 'yanbu-alnakhl', label: '٢. السعودية (ينبع وتيماء وحائل والرياض)' },
                { id: 'levant-jabal-alarab', label: '٣. الشام والعراق' },
                { id: 'uae-ajman', label: '٤. الخليج العربي' },
                { id: 'maghreb-sudan', label: '٥. المغرب العربي والسودان' }
              ].map((item) => {
                const isActive = activeBranchId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectBranch(item.id)}
                    className={`px-2.5 py-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer truncate ${
                      isActive
                        ? 'bg-[#0F291E] text-white border-[#0F291E]'
                        : 'bg-[#F7F6F2] text-[#141413] border-[#E6E2D8] hover:border-[#9A7B3E]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Genealogical Chart from 7th Grandfather Ibrahim Elsaidy + Pan-Arab Hubs */
          <div className="space-y-3.5 text-center">
            <div className="inline-block rounded-xl border border-[#0F291E] bg-gradient-to-l from-[#0F291E] to-[#141E28] text-white px-6 py-3 shadow-sm">
              <div className="text-[11px] text-[#C5A059] font-semibold">
                الجد السابع الجامع · قبيلة جهينة (ينبع النخل)
              </div>
              <div className="font-display text-xl font-bold mt-0.5">
                إبراهيم الصعيدي
              </div>
            </div>

            <div className="w-px h-3 bg-[#9A7B3E] mx-auto" />

            <div>
              <div className="inline-block rounded-xl border-2 border-[#9A7B3E] bg-[#F7F6F2] px-6 py-2">
                <div className="text-[11px] text-[#9A7B3E] font-bold">عمود التفرع الجامع</div>
                <div className="font-display text-lg font-bold text-[#141413]">
                  عوض البراهيم
                </div>
              </div>
            </div>

            <div className="w-px h-3 bg-[#9A7B3E] mx-auto" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-right pt-2 border-t border-[#E6E2D8]">
              <button
                type="button"
                onClick={() => onSelectBranch('taima')}
                className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
                  activeBranchId === 'taima'
                    ? 'bg-[#F7F6F2] border-[#9A7B3E] shadow-sm'
                    : 'bg-white border-[#E6E2D8] hover:border-[#9A7B3E]'
                }`}
              >
                <div className="text-[11px] text-[#9A7B3E] font-bold mb-0.5">
                  ١. فرع تيماء وتبوك
                </div>
                <div className="font-display text-base font-bold text-[#141413] mb-1">
                  عبد الله بن عوض
                </div>
                <p className="text-[11px] text-zinc-600 leading-relaxed">
                  أبناؤه بتيماء: <strong>عوض، حامد، حمدان، بشير</strong>.
                </p>
              </button>

              <button
                type="button"
                onClick={() => onSelectBranch('levant-jabal-alarab')}
                className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
                  activeBranchId === 'levant-jabal-alarab'
                    ? 'bg-[#F7F6F2] border-[#9A7B3E] shadow-sm'
                    : 'bg-white border-[#E6E2D8] hover:border-[#9A7B3E]'
                }`}
              >
                <div className="text-[11px] text-[#9A7B3E] font-bold mb-0.5">
                  ٢. فرع بلاد الشام
                </div>
                <div className="font-display text-base font-bold text-[#141413] mb-1">
                  سلامة بن عوض
                </div>
                <p className="text-[11px] text-zinc-600 leading-relaxed">
                  سكن <strong>جبل العرب (قرية أم ولد)</strong> وامتد في الشام.
                </p>
              </button>

              <button
                type="button"
                onClick={() => onSelectBranch('hail-zubarah')}
                className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
                  ['hail-zubarah', 'riyadh', 'uae-ajman', 'oman-khaburah-gulf'].includes(
                    activeBranchId
                  )
                    ? 'bg-[#F7F6F2] border-[#9A7B3E] shadow-sm'
                    : 'bg-white border-[#E6E2D8] hover:border-[#9A7B3E]'
                }`}
              >
                <div className="text-[11px] text-[#9A7B3E] font-bold mb-0.5">
                  ٣. فرع حائل والرياض والخليج
                </div>
                <div className="font-display text-base font-bold text-[#141413] mb-1">
                  صالح ← عبد الله
                </div>
                <p className="text-[11px] text-zinc-600 leading-relaxed">
                  أبناؤه: <strong>إبراهيم</strong> (حائل)، <strong>ناصر</strong> (الرياض)،{' '}
                  <strong>علي</strong> (الإمارات وعُمان).
                </p>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Selected Node Inspector */}
      <div className="px-6 py-4 border-t border-[#E6E2D8] bg-[#F7F6F2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#9A7B3E]">
            <MapPin className="w-3.5 h-3.5 text-[#0F291E]" />
            <span>
              الحاضرة المحددة ({selectedRegion.index}): {selectedRegion.regionName}
            </span>
          </div>
          <p className="text-xs text-zinc-700 mt-1">
            <strong className="text-[#141413]">{selectedRegion.keyFigures}</strong> —{' '}
            {selectedRegion.subLocation}
          </p>
        </div>
        <span className="text-[11px] font-semibold text-[#0F291E] shrink-0">
          {selectedRegion.countryLabel}
        </span>
      </div>
    </div>
  );
};
