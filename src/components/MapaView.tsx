import { useState } from 'react';
import {
  Crosshair,
  MapPin,
  Minus,
  Navigation,
  Plus,
  Search,
  Sun,
  X,
  Zap,
} from 'lucide-react';
import { COPY } from '../data/powerspotData';
import { Language, Station } from '../types/powerspot';

interface MapaViewProps {
  language: Language;
  stations: Station[];
  selectedStationId: string;
  onSelectStation: (stationId: string) => void;
  onChargeAtStation: (stationId: string) => void;
}

export function MapaView({
  language,
  stations,
  selectedStationId,
  onSelectStation,
  onChargeAtStation,
}: MapaViewProps) {
  const t = COPY[language];
  const [searchQuery, setSearchQuery] = useState('Arequipa');
  const [zoom, setZoom] = useState(1);
  const [showRoute, setShowRoute] = useState(false);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredStations =
    normalizedQuery === '' || normalizedQuery === 'arequipa'
      ? stations
      : stations.filter(
          (s) =>
            s.name.toLowerCase().includes(normalizedQuery) ||
            s.landmark.toLowerCase().includes(normalizedQuery) ||
            s.zone.toLowerCase().includes(normalizedQuery)
        );

  const activeStation =
    stations.find((s) => s.id === selectedStationId) ?? stations[0];

  const handleZoomIn = () => setZoom((z) => Math.min(1.6, +(z + 0.2).toFixed(1)));
  const handleZoomOut = () => setZoom((z) => Math.max(0.8, +(z - 0.2).toFixed(1)));
  const handleRecenter = () => {
    setZoom(1);
    onSelectStation('sogay');
    setSearchQuery('Arequipa');
  };

  // Scale bar distance adapts with zoom
  const scaleKm = (2 / zoom).toFixed(1).replace('.0', '');

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            {t.mapTitle}
          </h1>
          <p className="text-sm text-slate-700">
            {language === 'es'
              ? 'Selecciona una estación solar en Arequipa para iniciar tu carga'
              : 'Select a solar station in Arequipa to start charging'}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="w-full min-h-[44px] pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label={t.clearSearch}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Interactive Topographic SVG Map */}
        <div className="lg:col-span-7 bg-[#E9EEF4] border border-slate-300 rounded-2xl overflow-hidden shadow-xs relative min-h-[420px] sm:min-h-[480px] flex flex-col">
          <div className="relative flex-1 bg-[#E4EAF1] overflow-hidden">
            <div
              className="w-full h-full transition-transform duration-300 ease-out origin-center"
              style={{ transform: `scale(${zoom})` }}
            >
              <svg
                viewBox="0 0 600 500"
                className="w-full h-full min-h-[420px] select-none"
                role="img"
                aria-label="Mapa topográfico de estaciones PowerSpot en Arequipa"
              >
                {/* Topographic contour lines */}
                <g
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="1.3"
                  opacity="0.95"
                >
                  <path d="M-20,90 C120,60 240,140 390,95 C490,65 560,110 620,85" />
                  <path d="M-20,145 C110,120 220,195 370,150 C480,115 545,165 620,140" />
                  <path d="M-20,210 C130,185 210,255 360,215 C470,185 535,230 620,205" />
                  <path d="M-20,280 C140,250 250,330 390,275 C495,235 550,295 620,275" />
                  <path d="M-20,355 C125,325 235,405 385,360 C490,330 555,380 620,355" />
                  <path d="M-20,430 C135,405 260,460 405,425 C500,405 560,445 620,425" />
                  {/* Subtle elevation rings */}
                  <ellipse cx="165" cy="195" rx="95" ry="70" />
                  <ellipse cx="165" cy="195" rx="135" ry="105" />
                  <ellipse cx="410" cy="295" rx="100" ry="85" />
                </g>

                {/* User current reference at Santuario de Chapi */}
                {showRoute && (
                  <path
                    d={`M 300 415 Q ${(300 + activeStation.mapX) / 2 - 20} ${
                      (415 + activeStation.mapY) / 2 - 25
                    } ${activeStation.mapX} ${activeStation.mapY}`}
                    fill="none"
                    stroke="#EAB308"
                    strokeWidth="3.5"
                    strokeDasharray="7 5"
                    strokeLinecap="round"
                  />
                )}

                {/* Station coverage zones & interactive pins */}
                {filteredStations.map((station) => {
                  const isSelected = station.id === activeStation.id;
                  return (
                    <g
                      key={station.id}
                      className="cursor-pointer group"
                      onClick={() => onSelectStation(station.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${station.name} - ${station.landmark}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectStation(station.id);
                        }
                      }}
                    >
                      {/* Solar coverage zone */}
                      <circle
                        cx={station.mapX}
                        cy={station.mapY}
                        r={station.zoneRadius}
                        fill={isSelected ? '#CBD5E1' : '#DCE4EC'}
                        fillOpacity={isSelected ? 0.72 : 0.52}
                        stroke={isSelected ? '#5B7A96' : 'transparent'}
                        strokeWidth={isSelected ? 1.5 : 0}
                      />

                      {/* Label */}
                      <text
                        x={station.mapX}
                        y={station.mapY - 26}
                        textAnchor="middle"
                        className="text-[11px] font-bold fill-slate-800"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                      >
                        {station.landmark}
                      </text>

                      {/* Pin outer ring */}
                      {isSelected && (
                        <circle
                          cx={station.mapX}
                          cy={station.mapY}
                          r="20"
                          fill="#FACC15"
                          fillOpacity="0.4"
                        />
                      )}

                      {/* Pin circle */}
                      <circle
                        cx={station.mapX}
                        cy={station.mapY}
                        r="14"
                        fill={isSelected ? '#FACC15' : '#5B7A96'}
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                      />

                      {/* Bolt icon inside pin */}
                      <path
                        d={`M ${station.mapX + 1} ${station.mapY - 6} L ${
                          station.mapX - 4
                        } ${station.mapY + 1} L ${station.mapX} ${
                          station.mapY + 1
                        } L ${station.mapX - 1} ${station.mapY + 6} L ${
                          station.mapX + 4
                        } ${station.mapY - 1} L ${station.mapX} ${
                          station.mapY - 1
                        } Z`}
                        fill={isSelected ? '#0F172A' : '#FFFFFF'}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Empty search state overlay */}
            {filteredStations.length === 0 && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
                <p className="text-sm font-semibold text-slate-800">
                  {t.noStationsFound}
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-3 min-h-[40px] px-4 py-2 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-xs font-semibold text-slate-950 cursor-pointer"
                >
                  {t.clearSearch}
                </button>
              </div>
            )}

            {/* Map scale bar (bottom-left) */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-lg px-2.5 py-1.5 flex items-center gap-2 pointer-events-none">
              <div className="w-8 h-0.5 bg-slate-800" />
              <span className="text-xs font-mono font-medium text-slate-700 tabular-nums">
                {scaleKm} km
              </span>
            </div>

            {/* Map Zoom & Recenter controls (bottom-right) */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  aria-label="Acercar mapa"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-700 hover:bg-slate-100 border-b border-slate-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  aria-label="Alejar mapa"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleRecenter}
                aria-label="Recentrar en Sogay"
                className="min-w-[44px] min-h-[44px] rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-slate-950 flex items-center justify-center shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              >
                <Crosshair className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Station Inspector & Station Selector List */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Selected Station Card */}
          <section className="bg-[#E9EEF4] border border-slate-300 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-600">
                  {activeStation.zone} · {activeStation.altitudeM} m s.n.m.
                </p>
                <h2 className="text-xl font-bold text-slate-950 mt-0.5">
                  {activeStation.name}
                </h2>
                <p className="text-sm text-slate-700">{activeStation.landmark}</p>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg whitespace-nowrap">
                {activeStation.availablePorts}/{activeStation.totalPorts}{' '}
                {t.availablePorts}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="bg-white/95 border border-slate-300/80 rounded-xl p-3">
                <p className="text-xs text-slate-600">
                  {language === 'es' ? 'Distancia' : 'Distance'}
                </p>
                <p className="text-base font-bold text-slate-900 tabular-nums mt-0.5">
                  {activeStation.distanceKm} km
                </p>
              </div>
              <div className="bg-white/95 border border-slate-300/80 rounded-xl p-3">
                <p className="text-xs text-slate-600">{t.solarReserve}</p>
                <p className="text-base font-bold text-slate-900 tabular-nums mt-0.5">
                  {activeStation.solarReservePct}%
                </p>
              </div>
              <div className="bg-white/95 border border-slate-300/80 rounded-xl p-3">
                <p className="text-xs text-slate-600">
                  {language === 'es' ? 'Potencia max' : 'Max output'}
                </p>
                <p className="text-base font-bold text-slate-900 tabular-nums mt-0.5">
                  {activeStation.maxWatts}W
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Sun className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                {language === 'es'
                  ? `Generación solar activa: ${activeStation.solarGenerationW}W · Soporta ${activeStation.supportedWatts.join('W / ')}W`
                  : `Active solar array: ${activeStation.solarGenerationW}W · Supports ${activeStation.supportedWatts.join('W / ')}W`}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => onChargeAtStation(activeStation.id)}
                className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-slate-950 font-bold text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>{t.chargeHere}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowRoute((prev) => !prev)}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#CFD8E3] hover:bg-[#BFCAD7] border border-slate-400/60 text-slate-900 font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
              >
                <Navigation className="w-4 h-4" />
                <span>
                  {showRoute
                    ? t.hideRoute
                    : `${t.showRoute} (${activeStation.walkMinutes} min)`}
                </span>
              </button>
            </div>
          </section>

          {/* Station Quick List */}
          <section className="bg-[#E9EEF4] border border-slate-300 rounded-2xl p-4 shadow-xs flex-1">
            <h3 className="text-xs font-semibold text-slate-600 mb-2.5 px-1">
              {language === 'es'
                ? 'Estaciones disponibles'
                : 'Available stations'}{' '}
              ({filteredStations.length})
            </h3>
            <div className="space-y-2">
              {filteredStations.map((station) => {
                const isSelected = station.id === activeStation.id;
                return (
                  <button
                    key={station.id}
                    type="button"
                    onClick={() => onSelectStation(station.id)}
                    className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-xl border flex items-center justify-between gap-3 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#3B5978] text-slate-950 shadow-xs'
                        : 'bg-[#DCE4EE] hover:bg-[#CFD9E6] border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MapPin
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? 'text-[#3B5978]' : 'text-slate-600'
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {station.name}
                        </p>
                        <p className="text-xs text-slate-600 truncate">
                          {station.landmark}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-700 tabular-nums shrink-0">
                      {station.distanceKm} km
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
