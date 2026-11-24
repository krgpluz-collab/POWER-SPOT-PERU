import { Award, CheckCircle2, Leaf, X } from 'lucide-react';
import { Language } from '../types/powerspot';

interface EcoLevelModalProps {
  language: Language;
  co2SavedKg: number;
  totalKwh: number;
  onClose: () => void;
}

export function EcoLevelModal({
  language,
  co2SavedKg,
  totalKwh,
  onClose,
}: EcoLevelModalProps) {
  const tiers = [
    {
      nameEs: 'Bronce',
      nameEn: 'Bronze',
      thresholdKg: 0,
      benefitEs: 'Acceso a red solar en Arequipa',
      benefitEn: 'Access to Arequipa solar network',
    },
    {
      nameEs: 'Plata',
      nameEn: 'Silver',
      thresholdKg: 25,
      benefitEs: '5% de descuento en carga media 60W',
      benefitEn: '5% off 60W medium charging',
    },
    {
      nameEs: 'Oro',
      nameEn: 'Gold',
      thresholdKg: 50,
      benefitEs: 'Prioridad en puertos rápidos 120W',
      benefitEn: 'Priority access to 120W fast ports',
    },
    {
      nameEs: 'Platino',
      nameEn: 'Platinum',
      thresholdKg: 100,
      benefitEs: '15 min de carga estándar gratis al mes',
      benefitEn: '15 min free standard charge monthly',
    },
  ];

  const progressToPlatinum = Math.min(100, Math.round((co2SavedKg / 100) * 100));

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                {language === 'es'
                  ? 'Nivel Ecológico PowerSpot'
                  : 'PowerSpot Eco Level'}
              </h2>
              <p className="text-xs text-slate-500 tabular-nums">
                {co2SavedKg.toFixed(1)} kg CO₂ · {totalKwh.toFixed(1)} kWh
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="min-w-[40px] min-h-[40px] rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-[#F6F8FA] rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="inline-flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-600" />
              {language === 'es'
                ? 'Progreso hacia Platino (100 kg)'
                : 'Progress to Platinum (100 kg)'}
            </span>
            <span className="tabular-nums">{progressToPlatinum}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FACC15] rounded-full transition-all"
              style={{ width: `${progressToPlatinum}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          {tiers.map((tier) => {
            const unlocked = co2SavedKg >= tier.thresholdKg;
            return (
              <div
                key={tier.nameEs}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                  unlocked
                    ? 'bg-[#EDF2F7]/70 border-slate-300'
                    : 'bg-white border-slate-200 opacity-75'
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {language === 'es' ? tier.nameEs : tier.nameEn}{' '}
                    <span className="text-xs font-normal text-slate-500 tabular-nums">
                      ({tier.thresholdKg}+ kg CO₂)
                    </span>
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {language === 'es' ? tier.benefitEs : tier.benefitEn}
                  </p>
                </div>
                {unlocked && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full min-h-[44px] rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] text-slate-950 font-bold text-sm cursor-pointer"
        >
          {language === 'es' ? 'Entendido' : 'Got it'}
        </button>
      </div>
    </div>
  );
}
