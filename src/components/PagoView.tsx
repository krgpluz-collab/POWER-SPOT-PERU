import { useEffect, useState } from 'react';
import {
  BatteryCharging,
  Check,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Plus,
  QrCode,
  ShieldCheck,
  X,
  Zap,
} from 'lucide-react';
import { COPY, TARIFF_PLANS } from '../data/powerspotData';
import {
  Language,
  PaymentMethod,
  Station,
  TariffId,
  TariffPlan,
} from '../types/powerspot';

interface PagoViewProps {
  language: Language;
  stations: Station[];
  selectedStationId: string;
  onSelectStation: (stationId: string) => void;
  selectedTariffId: TariffId;
  onSelectTariff: (tariffId: TariffId) => void;
  paymentMethods: PaymentMethod[];
  selectedPaymentId: string;
  onSelectPayment: (paymentId: string) => void;
  onAddPaymentMethod: (method: PaymentMethod) => void;
  onCompletePayment: (
    station: Station,
    tariff: TariffPlan,
    method: PaymentMethod
  ) => void;
}

export function PagoView({
  language,
  stations,
  selectedStationId,
  onSelectStation,
  selectedTariffId,
  onSelectTariff,
  paymentMethods,
  selectedPaymentId,
  onSelectPayment,
  onAddPaymentMethod,
  onCompletePayment,
}: PagoViewProps) {
  const t = COPY[language];
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [newCardLabel, setNewCardLabel] = useState('');
  const [newCardDigits, setNewCardDigits] = useState('');

  // Interactive payment & solar charging flow modal
  const [checkoutStep, setCheckoutStep] = useState<
    'idle' | 'confirm' | 'charging' | 'done'
  >('idle');
  const [chargeProgress, setChargeProgress] = useState(0);

  const activeStation =
    stations.find((s) => s.id === selectedStationId) ?? stations[0];
  const activeTariff =
    TARIFF_PLANS.find((p) => p.id === selectedTariffId) ?? TARIFF_PLANS[0];
  const activeMethod =
    paymentMethods.find((m) => m.id === selectedPaymentId) ?? paymentMethods[0];

  useEffect(() => {
    if (checkoutStep !== 'charging') return;
    setChargeProgress(15);
    const interval = window.setInterval(() => {
      setChargeProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(interval);
          onCompletePayment(activeStation, activeTariff, activeMethod);
          setCheckoutStep('done');
          return 100;
        }
        return prev + 17;
      });
    }, 350);
    return () => window.clearInterval(interval);
  }, [checkoutStep, activeStation, activeTariff, activeMethod, onCompletePayment]);

  const handleFinishNow = () => {
    setChargeProgress(100);
    onCompletePayment(activeStation, activeTariff, activeMethod);
    setCheckoutStep('done');
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedDigits = newCardDigits.replace(/\D/g, '').slice(-4) || '8899';
    const brandName = newCardLabel.trim() || 'Tarjeta Débito';
    const newMethod: PaymentMethod = {
      id: `custom-${Date.now()}`,
      name: brandName,
      subtitleEs: `Tarjeta •••• ${cleanedDigits}`,
      subtitleEn: `Card •••• ${cleanedDigits}`,
      type: 'card',
      brandColor: '#3B5978',
      badgeText: brandName.slice(0, 2).toUpperCase(),
    };
    onAddPaymentMethod(newMethod);
    onSelectPayment(newMethod.id);
    setNewCardLabel('');
    setNewCardDigits('');
    setShowAddMethodModal(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          {t.paymentTitle}
        </h1>
        <p className="text-sm text-slate-700">
          {language === 'es'
            ? 'Elige tu tarifa de carga solar y tu método de pago preferido'
            : 'Choose your solar charging rate and preferred payment method'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Current Tariffs & Station Selector */}
        <div className="lg:col-span-5 space-y-5">
          {/* Selected Station Selector */}
          <section className="bg-[#E9EEF4] border border-slate-300 rounded-2xl p-5 shadow-xs">
            <label
              htmlFor="station-select"
              className="block text-xs font-semibold text-slate-600 mb-2"
            >
              {t.selectedStation}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#5B7A96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="station-select"
                value={activeStation.id}
                onChange={(e) => onSelectStation(e.target.value)}
                className="w-full min-h-[44px] pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
              >
                {stations.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.landmark} ({s.distanceKm} km)
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Tarifas actuales */}
          <section className="bg-[#E9EEF4] border border-slate-300 rounded-2xl p-5 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-slate-900">
              {t.currentTariffs}
            </h2>

            <div className="space-y-2.5">
              {TARIFF_PLANS.map((plan) => {
                const isSelected = plan.id === activeTariff.id;

                const themeByTariff: Record<
                  TariffId,
                  {
                    cardIdle: string;
                    cardActive: string;
                    iconIdle: string;
                    iconActive: string;
                    switchActive: string;
                  }
                > = {
                  std: {
                    cardIdle:
                      'bg-emerald-50/75 border-emerald-200 hover:bg-emerald-50',
                    cardActive:
                      'bg-emerald-100/90 border-emerald-600 ring-1 ring-emerald-600/20',
                    iconIdle: 'bg-white text-emerald-700 border border-emerald-200',
                    iconActive: 'bg-emerald-700 text-white',
                    switchActive: 'bg-emerald-700',
                  },
                  med: {
                    cardIdle:
                      'bg-sky-50/80 border-sky-200 hover:bg-sky-50',
                    cardActive:
                      'bg-[#DCE7F2] border-[#3B5978] ring-1 ring-[#3B5978]/20',
                    iconIdle: 'bg-white text-[#3B5978] border border-sky-200',
                    iconActive: 'bg-[#3B5978] text-white',
                    switchActive: 'bg-[#3B5978]',
                  },
                  fast: {
                    cardIdle:
                      'bg-amber-50/85 border-amber-200 hover:bg-amber-50',
                    cardActive:
                      'bg-amber-100 border-amber-500 ring-1 ring-amber-500/25',
                    iconIdle: 'bg-white text-amber-600 border border-amber-200',
                    iconActive: 'bg-[#FACC15] text-slate-950',
                    switchActive: 'bg-amber-600',
                  },
                };

                const theme = themeByTariff[plan.id];

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => onSelectTariff(plan.id)}
                    className={`w-full min-h-[72px] p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      isSelected ? theme.cardActive : theme.cardIdle
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? theme.iconActive : theme.iconIdle
                        }`}
                      >
                        <Zap className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-950 tabular-nums">
                          S/ {plan.price.toFixed(2)}{' '}
                          {plan.id === 'fast'
                            ? `— ${plan.watts}W`
                            : `× ${plan.durationMin} min`}
                        </p>
                        <p className="text-xs text-slate-700 mt-0.5">
                          {language === 'es' ? plan.nameEs : plan.nameEn} ·{' '}
                          {plan.watts}W
                        </p>
                      </div>
                    </div>

                    {/* Visual toggle indicator matching Screen 4 */}
                    <div
                      aria-hidden="true"
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 ${
                        isSelected ? theme.switchActive : 'bg-slate-300/90'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                          isSelected ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right column: Métodos de pago + Pagar ahora CTA */}
        <div className="lg:col-span-7 space-y-5">
          <section className="bg-[#E9EEF4] border border-slate-300 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-bold text-slate-900">
                {t.paymentMethods}
              </h2>
              <button
                type="button"
                onClick={() => setShowAddMethodModal(true)}
                className="min-h-[38px] px-3 py-1.5 rounded-xl bg-[#CFD8E3] hover:bg-[#BFCAD7] border border-slate-400/60 text-xs font-semibold text-slate-900 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addMethod}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {paymentMethods.map((method) => {
                const isSelected = method.id === activeMethod.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => onSelectPayment(method.id)}
                    className={`min-h-[60px] px-4 py-3 rounded-2xl border flex items-center justify-between gap-3 text-left transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      isSelected
                        ? 'bg-white border-slate-900 ring-1 ring-slate-900/20 shadow-xs'
                        : 'bg-[#DCE4EE]/85 hover:bg-white border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-9 h-9 rounded-xl text-white text-xs font-bold flex items-center justify-center shrink-0"
                        style={{ backgroundColor: method.brandColor }}
                      >
                        {method.badgeText}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-950 truncate">
                          {method.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {language === 'es'
                            ? method.subtitleEs
                            : method.subtitleEn}
                        </p>
                      </div>
                    </div>

                    {isSelected ? (
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Checkout Summary + Pagar ahora button */}
          <section className="bg-[#E9EEF4] border border-slate-300 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-300/70">
              <div>
                <p className="text-xs text-slate-500">
                  {activeStation.name} ·{' '}
                  {language === 'es'
                    ? activeTariff.nameEs
                    : activeTariff.nameEn}
                </p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">
                  {activeMethod.name} (
                  {language === 'es'
                    ? activeMethod.subtitleEs
                    : activeMethod.subtitleEn}
                  )
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs text-slate-500">
                  {language === 'es' ? 'Total a pagar' : 'Total due'}
                </p>
                <p className="text-2xl font-bold text-slate-950 tabular-nums">
                  S/ {activeTariff.price.toFixed(2)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCheckoutStep('confirm')}
              className="w-full min-h-[48px] px-5 py-3.5 rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] active:scale-[0.99] text-slate-950 font-bold text-base inline-flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            >
              <span>{t.payNow}</span>
              <span className="tabular-nums">
                · S/ {activeTariff.price.toFixed(2)}
              </span>
            </button>
          </section>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddMethodModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowAddMethodModal(false)}
        >
          <form
            onSubmit={handleAddCardSubmit}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-950">
                {t.addMethod}
              </h2>
              <button
                type="button"
                onClick={() => setShowAddMethodModal(false)}
                className="min-w-[40px] min-h-[40px] rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label
                htmlFor="card-label"
                className="block text-xs font-semibold text-slate-600 mb-1.5"
              >
                {language === 'es'
                  ? 'Banco o billetera'
                  : 'Bank or wallet name'}
              </label>
              <input
                id="card-label"
                type="text"
                required
                value={newCardLabel}
                onChange={(e) => setNewCardLabel(e.target.value)}
                placeholder="BCP Visa / Interbank / BBVA"
                className="w-full min-h-[44px] px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label
                htmlFor="card-digits"
                className="block text-xs font-semibold text-slate-600 mb-1.5"
              >
                {language === 'es' ? 'Últimos 4 dígitos' : 'Last 4 digits'}
              </label>
              <input
                id="card-digits"
                type="text"
                maxLength={4}
                required
                value={newCardDigits}
                onChange={(e) =>
                  setNewCardDigits(e.target.value.replace(/\D/g, ''))
                }
                placeholder="9012"
                className="w-full min-h-[44px] px-3.5 py-2 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowAddMethodModal(false)}
                className="flex-1 min-h-[44px] rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-semibold text-slate-700 cursor-pointer"
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex-1 min-h-[44px] rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-sm font-bold text-slate-950 cursor-pointer"
              >
                {language === 'es' ? 'Guardar' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Checkout Confirmation & Live Charging Flow Modal */}
      {checkoutStep !== 'idle' && (
        <div className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5">
            {checkoutStep === 'confirm' && (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-950">
                      {language === 'es'
                        ? 'Confirmar pago solar'
                        : 'Confirm solar payment'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {activeStation.name} · {activeTariff.durationMin} min (
                      {activeTariff.watts}W)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('idle')}
                    className="min-w-[40px] min-h-[40px] rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {activeMethod.type === 'mobile' && (
                  <div className="bg-[#F6F8FA] rounded-2xl p-4 flex flex-col items-center text-center gap-2">
                    <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-slate-900" />
                    </div>
                    <p className="text-xs font-medium text-slate-600">
                      {language === 'es'
                        ? `Autoriza el cobro desde ${activeMethod.name}`
                        : `Approve payment with ${activeMethod.name}`}
                    </p>
                  </div>
                )}

                <div className="bg-[#EDF2F7]/70 rounded-2xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      {language === 'es' ? 'Método' : 'Method'}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {activeMethod.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      {language === 'es' ? 'Energía estimada' : 'Estimated energy'}
                    </span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      +{activeTariff.kwhEstimate} kWh
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="text-lg font-bold text-slate-950 tabular-nums">
                      S/ {activeTariff.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {language === 'es'
                      ? 'Conexión cifrada · Activación automática del puerto solar'
                      : 'Encrypted payment · Automatic solar port activation'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setCheckoutStep('charging')}
                  className="w-full min-h-[48px] rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] text-slate-950 font-bold text-sm cursor-pointer transition-colors"
                >
                  {language === 'es'
                    ? `Confirmar y cargar (S/ ${activeTariff.price.toFixed(2)})`
                    : `Confirm & charge (S/ ${activeTariff.price.toFixed(2)})`}
                </button>
              </>
            )}

            {checkoutStep === 'charging' && (
              <div className="py-4 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#EDF2F7] text-[#3B5978] flex items-center justify-center mx-auto">
                  <BatteryCharging className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    {language === 'es'
                      ? 'Carga solar en progreso'
                      : 'Solar charging active'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeStation.name} · {activeTariff.watts}W
                  </p>
                </div>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FACC15] transition-all duration-300"
                    style={{ width: `${chargeProgress}%` }}
                  />
                </div>
                <p className="text-sm font-mono font-bold text-slate-900 tabular-nums">
                  {chargeProgress}%
                </p>

                <button
                  type="button"
                  onClick={handleFinishNow}
                  className="min-h-[40px] px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  {language === 'es'
                    ? 'Completar registro ahora'
                    : 'Complete session now'}
                </button>
              </div>
            )}

            {checkoutStep === 'done' && (
              <div className="py-2 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    {language === 'es'
                      ? '¡Carga completada con éxito!'
                      : 'Charging completed!'}
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    {activeStation.name} ·{' '}
                    <span className="font-semibold tabular-nums">
                      S/ {activeTariff.price.toFixed(2)}
                    </span>
                  </p>
                  <p className="text-xs text-emerald-700 font-medium mt-1 tabular-nums">
                    +{activeTariff.kwhEstimate} kWh · +{activeTariff.co2SavedKg}{' '}
                    kg CO₂ {language === 'es' ? 'ahorrado' : 'saved'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCheckoutStep('idle')}
                  className="w-full min-h-[46px] rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] text-slate-950 font-bold text-sm cursor-pointer"
                >
                  {language === 'es' ? 'Listo' : 'Done'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
