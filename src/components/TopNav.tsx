import { Zap } from 'lucide-react';
import { COPY } from '../data/powerspotData';
import { Language, TabId } from '../types/powerspot';

interface TopNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onQuickCharge: () => void;
  language: Language;
}

export function TopNav({
  activeTab,
  onSelectTab,
  onQuickCharge,
  language,
}: TopNavProps) {
  const t = COPY[language];

  const navItems: { id: TabId; label: string }[] = [
    { id: 'inicio', label: t.navInicio },
    { id: 'mapa', label: t.navMapa },
    { id: 'historial', label: t.navHistorial },
    { id: 'pago', label: t.navPago },
    { id: 'perfil', label: t.navPerfil },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#E4E9F0]/95 backdrop-blur-md border-b border-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-13 md:h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element brand wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('inicio')}
          className="text-lg md:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-md cursor-pointer"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#5B7A96] text-white shrink-0">
            <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
          </span>
          <span>PowerSpot</span>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative py-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded ${
                  isActive
                    ? 'text-slate-950 font-semibold'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onQuickCharge}
            className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-[#FACC15] hover:bg-[#EAB308] active:scale-[0.98] rounded-xl transition-all whitespace-nowrap shrink-0 shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>{t.ctaChargeNow}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
