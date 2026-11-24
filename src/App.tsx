import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Sun, Zap } from 'lucide-react';
import { EcoLevelModal } from './components/EcoLevelModal';
import { HistorialView } from './components/HistorialView';
import { InicioView } from './components/InicioView';
import { MapaView } from './components/MapaView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PagoView } from './components/PagoView';
import { PerfilView } from './components/PerfilView';
import { TopNav } from './components/TopNav';
import {
  INITIAL_PAYMENT_METHODS,
  INITIAL_SESSIONS,
  INITIAL_STATIONS,
  INITIAL_USER,
} from './data/powerspotData';
import {
  ChargeSession,
  Language,
  PaymentMethod,
  Station,
  TabId,
  TariffId,
  TariffPlan,
  UserProfile,
} from './types/powerspot';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('inicio');
  const [language, setLanguage] = useState<Language>('es');
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [loginEmail, setLoginEmail] = useState(INITIAL_USER.email);

  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [batteryPct, setBatteryPct] = useState(20);
  const [isSolarCharging, setIsSolarCharging] = useState(true);

  const [stations] = useState<Station[]>(INITIAL_STATIONS);
  const [selectedStationId, setSelectedStationId] = useState<string>('sogay');
  const [selectedTariffId, setSelectedTariffId] = useState<TariffId>('std');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    INITIAL_PAYMENT_METHODS
  );
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('yape');
  const [sessions, setSessions] = useState<ChargeSession[]>(INITIAL_SESSIONS);

  const [showEcoModal, setShowEcoModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  // Subtle live solar trickle charge when active on Inicio
  useEffect(() => {
    if (!isSolarCharging || !isSignedIn) return;
    const interval = window.setInterval(() => {
      setBatteryPct((prev) => (prev < 99 ? prev + 1 : 99));
    }, 12000);
    return () => window.clearInterval(interval);
  }, [isSolarCharging, isSignedIn]);

  const handleInspectStation = (stationId: string) => {
    setSelectedStationId(stationId);
    setActiveTab('mapa');
  };

  const handleStartChargeAtStation = (stationId: string) => {
    setSelectedStationId(stationId);
    setActiveTab('pago');
  };

  const handleRepeatCharge = (stationId: string, tariffId: TariffId) => {
    setSelectedStationId(stationId);
    setSelectedTariffId(tariffId);
    setActiveTab('pago');
  };

  const handleCompletePayment = useCallback(
    (station: Station, tariff: TariffPlan, method: PaymentMethod) => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const newSession: ChargeSession = {
        id: `PS-${now.getFullYear()}-${String(now.getTime()).slice(-4)}`,
        stationId: station.id,
        stationName: station.name,
        tariffId: tariff.id,
        chargeLabelEs: tariff.nameEs,
        chargeLabelEn: tariff.nameEn,
        durationMin: tariff.durationMin,
        watts: tariff.watts,
        amount: tariff.price,
        status: 'Completado',
        dateLabel: `Hoy ${timeStr}`,
        isCurrentMonth: true,
        paymentMethodName: method.name,
        kwhAdded: tariff.kwhEstimate,
        co2SavedKg: tariff.co2SavedKg,
      };

      setSessions((prev) => [newSession, ...prev]);
      setUser((prev) => ({
        ...prev,
        totalKwh: +(prev.totalKwh + tariff.kwhEstimate).toFixed(1),
        totalCo2Kg: +(prev.totalCo2Kg + tariff.co2SavedKg).toFixed(1),
      }));
      setBatteryPct((prev) => Math.min(100, prev + 12));
      showToast(
        language === 'es'
          ? `Carga registrada en ${station.name}`
          : `Charge recorded at ${station.name}`
      );
    },
    [language, showToast]
  );

  const handleToggleSolarCharging = () => {
    setIsSolarCharging((prev) => {
      const next = !prev;
      showToast(
        language === 'es'
          ? next
            ? 'Carga solar reanudada'
            : 'Carga solar en pausa'
          : next
          ? 'Solar charging resumed'
          : 'Solar charging paused'
      );
      return next;
    });
  };

  const handleToggleNotifications = () => {
    setUser((prev) => {
      const next = !prev.notificationsEnabled;
      showToast(
        language === 'es'
          ? next
            ? 'Notificaciones activadas'
            : 'Notificaciones desactivadas'
          : next
          ? 'Notifications enabled'
          : 'Notifications disabled'
      );
      return { ...prev, notificationsEnabled: next };
    });
  };

  const handleToggleEcoSaver = () => {
    setUser((prev) => {
      const next = !prev.ecoSaverMode;
      showToast(
        language === 'es'
          ? next
            ? 'Modo ahorro energético activado'
            : 'Modo ahorro energético desactivado'
          : next
          ? 'Power saving mode enabled'
          : 'Power saving mode disabled'
      );
      return { ...prev, ecoSaverMode: next };
    });
  };

  const handleToggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'es' ? 'en' : 'es';
      showToast(
        next === 'es' ? 'Idioma cambiado a Español' : 'Language set to English'
      );
      return next;
    });
  };

  const handleUpdateProfile = (name: string, email: string) => {
    const parts = name.trim().split(/\s+/);
    const initials =
      parts.length >= 2
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : name.slice(0, 2).toUpperCase();
    setUser((prev) => ({ ...prev, name, email, initials }));
    showToast(
      language === 'es' ? 'Perfil actualizado' : 'Profile updated'
    );
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      email: loginEmail.trim() || INITIAL_USER.email,
    }));
    setIsSignedIn(true);
    setActiveTab('inicio');
    showToast(
      language === 'es'
        ? 'Sesión iniciada correctamente'
        : 'Signed in successfully'
    );
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen powerspot-marble-bg flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-7 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#5B7A96] text-white flex items-center justify-center">
              <Sun className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-950">
                PowerSpot Peru
              </h1>
              <p className="text-xs text-slate-500">
                {language === 'es'
                  ? 'Energía Solar Inteligente · Arequipa'
                  : 'Smart Solar Energy · Arequipa'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-slate-600 mb-1.5"
              >
                {language === 'es' ? 'Correo electrónico' : 'Email address'}
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] text-slate-950 font-bold text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>
                {language === 'es'
                  ? 'Iniciar sesión en PowerSpot'
                  : 'Sign in to PowerSpot'}
              </span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen powerspot-marble-bg text-slate-900 flex flex-col pb-20 md:pb-10">
      <TopNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onQuickCharge={() => setActiveTab('pago')}
        language={language}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'inicio' && (
          <InicioView
            language={language}
            user={user}
            batteryPct={batteryPct}
            isSolarCharging={isSolarCharging}
            onToggleSolarCharging={handleToggleSolarCharging}
            stations={stations}
            recentSessions={sessions}
            onNavigateTab={setActiveTab}
            onInspectStation={handleInspectStation}
            onStartChargeAtStation={handleStartChargeAtStation}
            onOpenEcoModal={() => setShowEcoModal(true)}
          />
        )}

        {activeTab === 'mapa' && (
          <MapaView
            language={language}
            stations={stations}
            selectedStationId={selectedStationId}
            onSelectStation={setSelectedStationId}
            onChargeAtStation={handleStartChargeAtStation}
          />
        )}

        {activeTab === 'historial' && (
          <HistorialView
            language={language}
            sessions={sessions}
            onRepeatCharge={handleRepeatCharge}
          />
        )}

        {activeTab === 'pago' && (
          <PagoView
            language={language}
            stations={stations}
            selectedStationId={selectedStationId}
            onSelectStation={setSelectedStationId}
            selectedTariffId={selectedTariffId}
            onSelectTariff={setSelectedTariffId}
            paymentMethods={paymentMethods}
            selectedPaymentId={selectedPaymentId}
            onSelectPayment={setSelectedPaymentId}
            onAddPaymentMethod={(method) => {
              setPaymentMethods((prev) => [...prev, method]);
              showToast(
                language === 'es'
                  ? `Método ${method.name} agregado`
                  : `${method.name} added`
              );
            }}
            onCompletePayment={handleCompletePayment}
          />
        )}

        {activeTab === 'perfil' && (
          <PerfilView
            language={language}
            onToggleLanguage={handleToggleLanguage}
            user={user}
            onToggleNotifications={handleToggleNotifications}
            onToggleEcoSaver={handleToggleEcoSaver}
            onUpdateProfile={handleUpdateProfile}
            onSignOut={() => setIsSignedIn(false)}
            onOpenEcoModal={() => setShowEcoModal(true)}
          />
        )}
      </main>

      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        language={language}
      />

      {showEcoModal && (
        <EcoLevelModal
          language={language}
          co2SavedKg={user.totalCo2Kg}
          totalKwh={user.totalKwh}
          onClose={() => setShowEcoModal(false)}
        />
      )}

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg text-xs sm:text-sm font-medium inline-flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
