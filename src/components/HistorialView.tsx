import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Download,
  FileText,
  RotateCcw,
  X,
  Zap,
} from 'lucide-react';
import { COPY } from '../data/powerspotData';
import { ChargeSession, Language, TariffId } from '../types/powerspot';

interface HistorialViewProps {
  language: Language;
  sessions: ChargeSession[];
  onRepeatCharge: (stationId: string, tariffId: TariffId) => void;
}

export function HistorialView({
  language,
  sessions,
  onRepeatCharge,
}: HistorialViewProps) {
  const t = COPY[language];
  const [onlyThisMonth, setOnlyThisMonth] = useState(true);
  const [stationFilter, setStationFilter] = useState<string>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<ChargeSession | null>(
    null
  );

  const monthSessions = sessions.filter((s) => s.isCurrentMonth);
  const monthTotalAmount = monthSessions.reduce((sum, s) => sum + s.amount, 0);
  const monthTotalMinutes = monthSessions.reduce(
    (sum, s) => sum + s.durationMin,
    0
  );

  const visibleSessions = sessions.filter((s) => {
    if (onlyThisMonth && !s.isCurrentMonth) return false;
    if (stationFilter !== 'all' && s.stationId !== stationFilter) return false;
    return true;
  });

  const handleDownloadCsv = () => {
    const header =
      'ID,Estacion,Tipo,Duracion_min,Potencia_W,Monto_PEN,Estado,Fecha,Metodo_Pago\n';
    const rows = visibleSessions
      .map(
        (s) =>
          `${s.id},"${s.stationName}","${
            language === 'es' ? s.chargeLabelEs : s.chargeLabelEn
          }",${s.durationMin},${s.watts},${s.amount.toFixed(2)},${s.status},"${
            s.dateLabel
          }","${s.paymentMethodName}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'powerspot-historial-peru.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadReceipt = (session: ChargeSession) => {
    const content = [
      'POWERSPOT PERU — COMPROBANTE DE CARGA SOLAR',
      '==========================================',
      `ID: ${session.id}`,
      `Estación: ${session.stationName}`,
      `Servicio: ${language === 'es' ? session.chargeLabelEs : session.chargeLabelEn}`,
      `Potencia: ${session.watts}W · Duración: ${session.durationMin} min`,
      `Energía entregada: ${session.kwhAdded.toFixed(2)} kWh`,
      `CO₂ ahorrado: ${session.co2SavedKg.toFixed(2)} kg`,
      `Método de pago: ${session.paymentMethodName}`,
      `Total pagado: S/ ${session.amount.toFixed(2)}`,
      `Fecha: ${session.dateLabel}`,
      `Estado: ${session.status}`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `recibo-${session.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filterButtons = [
    { id: 'all', label: language === 'es' ? 'Todas' : 'All' },
    { id: 'sogay', label: 'Sogay' },
    { id: 'misti', label: 'Misti' },
    { id: 'colca', label: 'Colca' },
    { id: 'chapi', label: 'Chapi' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            {t.historyTitle}
          </h1>
          <p className="text-sm text-slate-700">
            {language === 'es'
              ? 'Revisa tus recargas solares y descarga tus comprobantes'
              : 'Review your solar charging sessions and download receipts'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadCsv}
          className="min-h-[42px] px-4 py-2 rounded-xl bg-[#E9EEF4] hover:bg-[#DCE4EE] border border-slate-400/60 text-xs sm:text-sm font-semibold text-slate-900 inline-flex items-center justify-center gap-2 self-start sm:self-auto shadow-xs cursor-pointer transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>{t.downloadCsv}</span>
        </button>
      </div>

      {/* Monthly Total Banner matching Screen 3 */}
      <section className="bg-[#E9EEF4] border border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-600">
            {t.totalThisMonth}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-950 tabular-nums mt-0.5">
            S/ {monthTotalAmount.toFixed(2)}{' '}
            <span className="text-slate-400 font-normal">·</span>{' '}
            {monthTotalMinutes} min
          </p>
        </div>

        {/* Working Month Filter Toggle */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <span className="text-xs font-medium text-slate-700">
            {onlyThisMonth ? t.onlyThisMonth : t.allSessions}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={onlyThisMonth}
            aria-label={t.onlyThisMonth}
            onClick={() => setOnlyThisMonth((prev) => !prev)}
            className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              onlyThisMonth ? 'bg-slate-800' : 'bg-slate-300'
            }`}
          >
            <span
              className={`block w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${
                onlyThisMonth ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Station Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#DCE4EE] border border-slate-300 rounded-xl w-fit overflow-x-auto max-w-full">
        {filterButtons.map((btn) => {
          const active = stationFilter === btn.id;
          return (
            <button
              key={btn.id}
              type="button"
              onClick={() => setStationFilter(btn.id)}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-700 hover:bg-white/50 hover:text-slate-950'
              }`}
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* Session List */}
      {visibleSessions.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-10 text-center">
          <p className="text-sm font-medium text-slate-600">
            {language === 'es'
              ? 'No hay cargas registradas para este filtro.'
              : 'No charging sessions found for this filter.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setOnlyThisMonth(false);
              setStationFilter('all');
            }}
            className="mt-3 min-h-[40px] px-4 py-2 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-xs font-semibold text-slate-950 cursor-pointer"
          >
            {t.allSessions}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleSessions.map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() => setSelectedReceipt(session)}
              className="bg-[#E9EEF4] hover:bg-white border border-slate-300 rounded-2xl p-4 sm:p-5 text-left transition-colors shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#EDF2F7] text-[#5B7A96] flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-950 truncate">
                      {session.stationName}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {language === 'es'
                        ? session.chargeLabelEs
                        : session.chargeLabelEn}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-base font-bold text-slate-950 tabular-nums">
                    S/ {session.amount.toFixed(2)}
                  </p>
                  <p className="text-xs font-semibold text-amber-700 mt-0.5 inline-flex items-center gap-1 justify-end">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.completed}</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5 tabular-nums">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {session.durationMin} min · {session.watts}W
                </span>
                <span className="tabular-nums">{session.dateLabel}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Interactive Receipt Modal */}
      {selectedReceipt && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedReceipt(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EDF2F7] text-[#3B5978] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    {selectedReceipt.stationName}
                  </h2>
                  <p className="text-xs font-mono text-slate-500">
                    {selectedReceipt.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                aria-label="Cerrar"
                className="min-w-[40px] min-h-[40px] rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#F6F8FA] rounded-2xl p-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">
                  {language === 'es' ? 'Servicio' : 'Service'}
                </span>
                <span className="font-semibold text-slate-900">
                  {language === 'es'
                    ? selectedReceipt.chargeLabelEs
                    : selectedReceipt.chargeLabelEn}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">
                  {language === 'es' ? 'Duración y potencia' : 'Duration & power'}
                </span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {selectedReceipt.durationMin} min · {selectedReceipt.watts}W
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">
                  {language === 'es' ? 'Energía entregada' : 'Energy delivered'}
                </span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {selectedReceipt.kwhAdded.toFixed(2)} kWh
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">
                  {language === 'es' ? 'CO₂ ahorrado' : 'CO₂ saved'}
                </span>
                <span className="font-semibold text-emerald-700 tabular-nums">
                  +{selectedReceipt.co2SavedKg.toFixed(2)} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">
                  {language === 'es' ? 'Método de pago' : 'Payment method'}
                </span>
                <span className="font-semibold text-slate-900">
                  {selectedReceipt.paymentMethodName}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-semibold text-slate-700">Total</span>
                <span className="text-xl font-bold text-slate-950 tabular-nums">
                  S/ {selectedReceipt.amount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const s = selectedReceipt;
                  setSelectedReceipt(null);
                  onRepeatCharge(s.stationId, s.tariffId);
                }}
                className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-slate-950 font-bold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.repeatCharge}</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadReceipt(selectedReceipt)}
                className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{t.downloadReceipt}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
