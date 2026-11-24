import { Clock, CreditCard, Home, MapPin, User } from 'lucide-react';
import { COPY } from '../data/powerspotData';
import { Language, TabId } from '../types/powerspot';

interface MobileBottomNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  language: Language;
}

export function MobileBottomNav({
  activeTab,
  onSelectTab,
  language,
}: MobileBottomNavProps) {
  const t = COPY[language];

  const tabs: {
    id: TabId;
    label: string;
    icon: typeof Home;
  }[] = [
    { id: 'inicio', label: t.navInicio, icon: Home },
    { id: 'mapa', label: t.navMapa, icon: MapPin },
    { id: 'historial', label: t.navHistorial, icon: Clock },
    { id: 'pago', label: t.navPago, icon: CreditCard },
    { id: 'perfil', label: t.navPerfil, icon: User },
  ];

  return (
    <nav
      aria-label="Menú inferior móvil"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#E4E9F0]/95 backdrop-blur-md border-t border-slate-300"
    >
      <div className="grid grid-cols-5 items-center h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`min-h-[44px] flex flex-col items-center justify-center gap-1 rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                isActive
                  ? 'text-slate-950 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-[#5B7A96] stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1.5 w-1.5 h-1.5 rounded-full bg-amber-400"
                  />
                )}
              </div>
              <span className="text-[11px] leading-none whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
