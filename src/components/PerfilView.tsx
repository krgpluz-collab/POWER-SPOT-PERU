import { useState } from 'react';
import {
  Award,
  Battery,
  Bell,
  Calendar,
  Edit3,
  Globe,
  Leaf,
  LogOut,
  X,
  Zap,
} from 'lucide-react';
import { COPY } from '../data/powerspotData';
import { Language, UserProfile } from '../types/powerspot';

interface PerfilViewProps {
  language: Language;
  onToggleLanguage: () => void;
  user: UserProfile;
  onToggleNotifications: () => void;
  onToggleEcoSaver: () => void;
  onUpdateProfile: (name: string, email: string) => void;
  onSignOut: () => void;
  onOpenEcoModal: () => void;
}

export function PerfilView({
  language,
  onToggleLanguage,
  user,
  onToggleNotifications,
  onToggleEcoSaver,
  onUpdateProfile,
  onSignOut,
  onOpenEcoModal,
}: PerfilViewProps) {
  const t = COPY[language];
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const ecoTierName =
    user.totalCo2Kg >= 100 ? t.platinumLevel : t.goldLevel;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) return;
    onUpdateProfile(editName.trim(), editEmail.trim());
    setShowEditModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            {t.profileTitle}
          </h1>
          <p className="text-sm text-slate-700">{t.profileSubtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditName(user.name);
            setEditEmail(user.email);
            setShowEditModal(true);
          }}
          className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#E9EEF4] hover:bg-[#DCE4EE] border border-slate-400/60 text-xs sm:text-sm font-semibold text-slate-900 inline-flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          <span>{t.editProfile}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Avatar & Summary Stats */}
        <div className="lg:col-span-5 space-y-5">
          <section className="bg-[#E9EEF4] border border-slate-300 rounded-2xl p-6 shadow-xs text-center">
            <div className="w-20 h-20 rounded-full bg-[#CFD8E3] border border-slate-300 text-slate-900 font-display text-2xl font-bold flex items-center justify-center mx-auto">
              {user.initials}
            </div>
            <h2 className="text-xl font-bold text-slate-950 mt-4">
              {user.name}
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">{user.email}</p>

            <div className="grid grid-cols-3 gap-2.5 mt-6 text-left">
              <div className="bg-white/95 border border-slate-300/80 rounded-2xl p-3">
                <Zap className="w-4 h-4 text-[#3B5978] mb-1.5" />
                <p className="text-sm sm:text-base font-bold text-slate-950 tabular-nums">
                  {user.totalKwh.toFixed(1)} kWh
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {t.totalConsumed}
                </p>
              </div>
              <div className="bg-white/95 border border-slate-300/80 rounded-2xl p-3">
                <Leaf className="w-4 h-4 text-[#3B5978] mb-1.5" />
                <p className="text-sm sm:text-base font-bold text-slate-950 tabular-nums">
                  {user.totalCo2Kg.toFixed(1)} kg
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {t.co2SavedLabel}
                </p>
              </div>
              <div className="bg-white/95 border border-slate-300/80 rounded-2xl p-3">
                <Calendar className="w-4 h-4 text-[#3B5978] mb-1.5" />
                <p className="text-sm sm:text-base font-bold text-slate-950">
                  {language === 'es' ? user.memberSinceEs : user.memberSinceEn}
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {t.memberSince}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right column: Working Settings & Account Actions */}
        <div className="lg:col-span-7 space-y-4">
          <section className="bg-[#E9EEF4] border border-slate-300 rounded-2xl divide-y divide-slate-300/80 shadow-xs overflow-hidden">
            {/* Notificaciones toggle */}
            <div className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EDF2F7] text-[#5B7A96] flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {t.notifications}
                  </p>
                  <p className="text-xs text-slate-500">
                    {language === 'es'
                      ? 'Alertas de carga completa y estaciones cercanas'
                      : 'Charge completion & nearby station alerts'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={user.notificationsEnabled}
                aria-label={t.notifications}
                onClick={onToggleNotifications}
                className={`relative w-12 h-7 rounded-full transition-colors shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  user.notificationsEnabled ? 'bg-slate-900' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${
                    user.notificationsEnabled
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Modo ahorro energético toggle */}
            <div className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#EDF2F7] text-[#5B7A96] flex items-center justify-center shrink-0">
                  <Battery className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {t.powerSavingMode}
                  </p>
                  <p className="text-xs text-slate-500">
                    {language === 'es'
                      ? 'Optimiza la entrada solar a 8W para cuidar la batería'
                      : 'Optimizes solar draw to 8W to protect battery health'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={user.ecoSaverMode}
                aria-label={t.powerSavingMode}
                onClick={onToggleEcoSaver}
                className={`relative w-12 h-7 rounded-full transition-colors shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  user.ecoSaverMode ? 'bg-slate-900' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`block w-5 h-5 bg-white rounded-full shadow-xs transition-transform ${
                    user.ecoSaverMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Idioma selector */}
            <button
              type="button"
              onClick={onToggleLanguage}
              className="w-full px-5 py-4 flex items-center justify-between gap-4 hover:bg-[#DCE4EE] transition-colors text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-300 text-[#3B5978] flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {t.languageLabel}
                  </p>
                  <p className="text-xs text-slate-600">
                    {language === 'es'
                      ? 'Cambiar entre Español e English'
                      : 'Switch between English and Español'}
                  </p>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-900 bg-[#CFD8E3] border border-slate-400/60 px-3 py-1 rounded-lg">
                {t.languageValue}
              </span>
            </button>
          </section>

          {/* Action Buttons matching Screen 5 */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setConfirmSignOut(true)}
              className="w-full min-h-[48px] px-5 py-3 rounded-2xl bg-[#FACC15] hover:bg-[#EAB308] border border-amber-500/50 text-slate-950 font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.signOut}</span>
            </button>

            <button
              type="button"
              onClick={onOpenEcoModal}
              className="w-full min-h-[44px] px-5 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 border border-amber-400 text-slate-950 font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-700" />
              <span>
                {t.ecoBadgeLabel}: {ecoTierName}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowEditModal(false)}
        >
          <form
            onSubmit={handleSaveProfile}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-950">
                {t.editProfile}
              </h2>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="min-w-[40px] min-h-[40px] rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label
                htmlFor="profile-name"
                className="block text-xs font-semibold text-slate-600 mb-1.5"
              >
                {language === 'es' ? 'Nombre completo' : 'Full name'}
              </label>
              <input
                id="profile-name"
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="block text-xs font-semibold text-slate-600 mb-1.5"
              >
                {language === 'es' ? 'Correo electrónico' : 'Email'}
              </label>
              <input
                id="profile-email"
                type="email"
                required
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex-1 min-h-[44px] rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-semibold text-slate-700 cursor-pointer"
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="flex-1 min-h-[44px] rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-sm font-bold text-slate-950 cursor-pointer"
              >
                {language === 'es' ? 'Guardar cambios' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirm Sign Out Modal */}
      {confirmSignOut && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setConfirmSignOut(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4 text-center"
          >
            <h2 className="text-lg font-bold text-slate-950">
              {language === 'es'
                ? '¿Cerrar sesión en PowerSpot?'
                : 'Sign out of PowerSpot?'}
            </h2>
            <p className="text-sm text-slate-600">
              {language === 'es'
                ? 'Tu historial de cargas y nivel ecológico permanecerán guardados.'
                : 'Your charging history and eco level will remain saved.'}
            </p>
            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setConfirmSignOut(false)}
                className="flex-1 min-h-[44px] rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-semibold text-slate-700 cursor-pointer"
              >
                {language === 'es' ? 'Volver' : 'Back'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmSignOut(false);
                  onSignOut();
                }}
                className="flex-1 min-h-[44px] rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-sm font-bold text-slate-950 cursor-pointer"
              >
                {t.signOut}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
