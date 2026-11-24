import {
  Award,
  BatteryCharging,
  ChevronRight,
  Leaf,
  MapPin,
  Pause,
  Play,
  Sun,
  Zap,
} from 'lucide-react';
import { COPY } from '../data/powerspotData';
import {
  ChargeSession,
  Language,
  Station,
  TabId,
  UserProfile,
} from '../types/powerspot';

interface InicioViewProps {
  language: Language;
  user: UserProfile;
  batteryPct: number;
  isSolarCharging: boolean;
  onToggleSolarCharging: () => void;
  stations: Station[];
  recentSessions: ChargeSession[];
  onNavigateTab: (tab: TabId) => void;
  onInspectStation: (stationId: string) => void;
  onStartChargeAtStation: (stationId: string) => void;
  onOpenEcoModal: () => void;
}

export function InicioView({
  language,
  user,
  batteryPct,
  isSolarCharging,
  onToggleSolarCharging,
  stations,
  recentSessions,
  onNavigateTab,
  onInspectStation,
  onStartChargeAtStation,
  onOpenEcoModal,
}: InicioViewProps) {
  const t = COPY[language];
  const nearestStation = stations[0];
  const ecoTierName =
    user.totalCo2Kg >= 100 ? t.platinumLevel : t.goldLevel;
  const activeWatts = user.ecoSaverMode ? 8 : 12;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left primary column: Brand welcome, Live Battery, Primary CTA, Nearest station */}
      <div className="lg:col-span-5 space-y-4">
        {/* Brand & Welcome Hero Card */}
        <section className="bg-[#E9EEF4] border border-slate-300 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-300/70">
            <div className="w-11 h-11 rounded-xl bg-white border border-slate-300 text-[#3B5978] flex items-center justify-center shrink-0">
              <Sun className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-slate-950 truncate">
                PowerSpot Peru
              </h1>
              <p className="text-xs text-slate-500">{t.tagline}</p>
            </div>
          </div>

          <div className="pt-4">
            <h2 className="text-lg font-bold text-slate-900 text-balance">
              {t.welcomeTitle}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-[#5B7A96] shrink-0" />
              <span>{t.welcomeLocation}</span>
            </p>
          </div>
        </section>

        {/* Battery Card */}
        <section className="bg-[#E9EEF4] border border-slate-300 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  batteryPct <= 25
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'bg-white border-slate-300 text-[#3B5978]'
                }`}
              >
                <BatteryCharging className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600">
                  {t.batteryLabel}
                </p>
                <p
                  className={`text-2xl font-bold tabular-nums ${
                    batteryPct <= 25 ? 'text-red-600' : 'text-slate-950'
                  }`}
                >
                  {t.batteryLabel} {batteryPct}%
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleSolarCharging}
              className="min-h-[40px] px-3 py-2 rounded-xl bg-[#CFD8E3] hover:bg-[#BFCAD7] border border-slate-400/60 text-slate-900 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              {isSolarCharging ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>{t.pauseSolar}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>{t.resumeSolar}</span>
                </>
              )}
            </button>
          </div>

          <div
            className={`mt-4 w-full h-3 rounded-full overflow-hidden ${
              batteryPct <= 25 ? 'bg-red-100' : 'bg-slate-100'
            }`}
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                batteryPct <= 25
                  ? 'bg-red-600'
                  : batteryPct <= 50
                  ? 'bg-amber-500'
                  : 'bg-[#5B7A96]'
              }`}
              style={{ width: `${batteryPct}%` }}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>
              {isSolarCharging
                ? `${t.chargingSolar} · ${activeWatts}W solar`
                : t.chargingPaused}
            </span>
            {user.ecoSaverMode && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-emerald-700">
                  {t.ecoModeActive}
                </span>
              </>
            )}
          </div>
        </section>

        {/* Primary Yellow CTA: Estaciones cercanas */}
        <button
          type="button"
          onClick={() => onNavigateTab('mapa')}
          className="w-full min-h-[48px] px-5 py-3.5 rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] active:scale-[0.99] text-slate-950 font-bold text-base inline-flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        >
          <Zap className="w-5 h-5 fill-slate-950" />
          <span>{t.nearbyStationsBtn}</span>
        </button>

        {/* Nearest Station Row */}
        <button
          type="button"
          onClick={() => onInspectStation(nearestStation.id)}
          className="w-full min-h-[56px] bg-[#E9EEF4] hover:bg-[#DCE4EE] border border-slate-300 rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3 text-left shadow-xs transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-300 text-[#3B5978] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {t.nearestStationPrefix}:{' '}
                <span className="tabular-nums">{nearestStation.distanceKm} km</span>{' '}
                · {nearestStation.landmark.replace('Cataratas de ', '')}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {nearestStation.availablePorts}/{nearestStation.totalPorts}{' '}
                {t.availablePorts.toLowerCase()} · {nearestStation.maxWatts}W max
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
        </button>
      </div>

      {/* Right column: Ecological Impact + Quick Station & Activity Overview */}
      <div className="lg:col-span-7 space-y-6">
        {/* Ecological Impact Section */}
        <section className="bg-[#E9EEF4] border border-slate-300 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {t.ecoImpactTitle}
            </h2>
            <button
              type="button"
              onClick={onOpenEcoModal}
              className="text-xs font-semibold text-slate-800 bg-[#CFD8E3] hover:bg-[#BFCAD7] border border-slate-400/50 rounded-xl px-3 py-1.5 cursor-pointer min-h-[36px] transition-colors"
            >
              {t.ecoBadgeLabel}: {ecoTierName}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white/95 border border-slate-300/90 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#DCE4EE] text-[#3B5978] flex items-center justify-center mb-3">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-slate-950 tabular-nums">
                  {user.totalKwh.toFixed(1)}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  kWh · {t.consumedLabel}
                </p>
              </div>
            </div>

            <div className="bg-white/95 border border-slate-300/90 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#DCE4EE] text-[#3B5978] flex items-center justify-center mb-3">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-slate-950 tabular-nums">
                  {user.totalCo2Kg.toFixed(1)} kg
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {t.co2SavedLabel}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenEcoModal}
              className="bg-white/95 hover:bg-amber-50 border border-slate-300/90 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between text-left transition-colors shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-slate-950">
                  {ecoTierName}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">{t.levelLabel}</p>
              </div>
            </button>
          </div>
        </section>

        {/* Active Solar Stations Grid */}
        <section className="bg-[#E9EEF4] border border-slate-300 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {language === 'es'
                ? 'Red solar en Arequipa'
                : 'Arequipa solar network'}
            </h2>
            <button
              type="button"
              onClick={() => onNavigateTab('mapa')}
              className="text-xs font-semibold text-[#3B5978] hover:text-slate-950 inline-flex items-center gap-1 cursor-pointer min-h-[36px]"
            >
              <span>{t.navMapa}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-300/70">
            {stations.map((station) => (
              <div
                key={station.id}
                className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <button
                  type="button"
                  onClick={() => onInspectStation(station.id)}
                  className="text-left group cursor-pointer focus:outline-none"
                >
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-[#3B5978] transition-colors">
                    {station.name}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5 tabular-nums">
                    {station.landmark} · {station.distanceKm} km ·{' '}
                    {station.solarReservePct}% {t.solarReserve.toLowerCase()}
                  </p>
                </button>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onInspectStation(station.id)}
                    className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#CFD8E3] hover:bg-[#BFCAD7] border border-slate-400/60 text-xs font-semibold text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {t.navMapa}
                  </button>
                  <button
                    type="button"
                    onClick={() => onStartChargeAtStation(station.id)}
                    className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] border border-amber-500/50 text-xs font-semibold text-slate-950 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {t.ctaChargeNow}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Latest Session Quick Link */}
        {recentSessions.length > 0 && (
          <section className="bg-[#E9EEF4] border border-slate-300 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-xs">
            <div className="min-w-0">
              <p className="text-xs text-slate-600">
                {language === 'es' ? 'Última carga' : 'Latest session'} ·{' '}
                {recentSessions[0].dateLabel}
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5 truncate">
                {recentSessions[0].stationName} —{' '}
                <span className="tabular-nums">
                  S/ {recentSessions[0].amount.toFixed(2)}
                </span>{' '}
                · {recentSessions[0].durationMin} min
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('historial')}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#CFD8E3] hover:bg-[#BFCAD7] border border-slate-400/60 text-xs font-semibold text-slate-900 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
            >
              {t.navHistorial}
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
