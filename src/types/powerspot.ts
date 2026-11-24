export type TabId = 'inicio' | 'mapa' | 'historial' | 'pago' | 'perfil';

export type Language = 'es' | 'en';

export type TariffId = 'std' | 'med' | 'fast';

export interface Station {
  id: string;
  name: string;
  landmark: string;
  zone: string;
  distanceKm: number;
  walkMinutes: number;
  maxWatts: 30 | 60 | 120;
  supportedWatts: (30 | 60 | 120)[];
  solarReservePct: number;
  solarGenerationW: number;
  availablePorts: number;
  totalPorts: number;
  status: 'disponible' | 'ocupado';
  mapX: number; // Percentage 0-100 on SVG viewBox (0-600)
  mapY: number; // Percentage 0-100 on SVG viewBox (0-520)
  zoneRadius: number;
  altitudeM: number;
}

export interface TariffPlan {
  id: TariffId;
  price: number;
  durationMin: number;
  watts: 30 | 60 | 120;
  nameEs: string;
  nameEn: string;
  descEs: string;
  descEn: string;
  kwhEstimate: number;
  co2SavedKg: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  subtitleEs: string;
  subtitleEn: string;
  type: 'mobile' | 'card' | 'wallet';
  brandColor: string;
  badgeText: string;
}

export interface ChargeSession {
  id: string;
  stationId: string;
  stationName: string;
  tariffId: TariffId;
  chargeLabelEs: string;
  chargeLabelEn: string;
  durationMin: number;
  watts: 30 | 60 | 120;
  amount: number;
  status: 'Completado' | 'Pendiente';
  dateLabel: string;
  isCurrentMonth: boolean;
  paymentMethodName: string;
  kwhAdded: number;
  co2SavedKg: number;
}

export interface UserProfile {
  initials: string;
  name: string;
  email: string;
  memberSinceEs: string;
  memberSinceEn: string;
  totalKwh: number;
  totalCo2Kg: number;
  notificationsEnabled: boolean;
  ecoSaverMode: boolean;
}
