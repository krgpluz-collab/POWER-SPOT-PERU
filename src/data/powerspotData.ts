import {
  ChargeSession,
  Language,
  PaymentMethod,
  Station,
  TariffPlan,
  UserProfile,
} from '../types/powerspot';

export const INITIAL_STATIONS: Station[] = [
  {
    id: 'sogay',
    name: 'Estación Sogay',
    landmark: 'Cataratas de Sogay',
    zone: 'Quequeña · Arequipa',
    distanceKm: 1.2,
    walkMinutes: 14,
    maxWatts: 120,
    supportedWatts: [30, 60, 120],
    solarReservePct: 94,
    solarGenerationW: 480,
    availablePorts: 4,
    totalPorts: 4,
    status: 'disponible',
    mapX: 410,
    mapY: 295,
    zoneRadius: 68,
    altitudeM: 2540,
  },
  {
    id: 'chapi',
    name: 'Estación Chapi',
    landmark: 'Santuario de Chapi',
    zone: 'Polobaya · Arequipa',
    distanceKm: 2.4,
    walkMinutes: 28,
    maxWatts: 60,
    supportedWatts: [30, 60],
    solarReservePct: 89,
    solarGenerationW: 360,
    availablePorts: 3,
    totalPorts: 4,
    status: 'disponible',
    mapX: 300,
    mapY: 415,
    zoneRadius: 46,
    altitudeM: 2420,
  },
  {
    id: 'misti',
    name: 'Estación Misti',
    landmark: 'Volcán Misti Base',
    zone: 'Miraflores · Arequipa',
    distanceKm: 6.8,
    walkMinutes: 75,
    maxWatts: 120,
    supportedWatts: [30, 60, 120],
    solarReservePct: 97,
    solarGenerationW: 620,
    availablePorts: 2,
    totalPorts: 4,
    status: 'disponible',
    mapX: 165,
    mapY: 195,
    zoneRadius: 64,
    altitudeM: 3320,
  },
  {
    id: 'colca',
    name: 'Estación Colca',
    landmark: 'Cañón del Colca',
    zone: 'Chivay · Arequipa',
    distanceKm: 12.4,
    walkMinutes: 135,
    maxWatts: 120,
    supportedWatts: [60, 120],
    solarReservePct: 91,
    solarGenerationW: 540,
    availablePorts: 5,
    totalPorts: 6,
    status: 'disponible',
    mapX: 435,
    mapY: 130,
    zoneRadius: 50,
    altitudeM: 3635,
  },
];

export const TARIFF_PLANS: TariffPlan[] = [
  {
    id: 'std',
    price: 3.0,
    durationMin: 15,
    watts: 30,
    nameEs: 'Carga estándar',
    nameEn: 'Standard charge',
    descEs: 'Ideal para celulares, cámaras y GPS de ruta',
    descEn: 'Ideal for phones, cameras and trail GPS',
    kwhEstimate: 0.45,
    co2SavedKg: 0.22,
  },
  {
    id: 'med',
    price: 7.0,
    durationMin: 30,
    watts: 60,
    nameEs: 'Carga media',
    nameEn: 'Medium charge',
    descEs: 'Óptima para tablets, drones y baterías externas',
    descEn: 'Optimal for tablets, drones and power banks',
    kwhEstimate: 1.2,
    co2SavedKg: 0.58,
  },
  {
    id: 'fast',
    price: 9.0,
    durationMin: 20,
    watts: 120,
    nameEs: 'Carga rápida 120W',
    nameEn: 'Fast charge 120W',
    descEs: 'Máxima potencia solar para laptops y e-bikes',
    descEn: 'Peak solar output for laptops and e-bikes',
    kwhEstimate: 2.1,
    co2SavedKg: 1.05,
  },
];

export const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'yape',
    name: 'Yape',
    subtitleEs: 'Pago móvil',
    subtitleEn: 'Mobile payment',
    type: 'mobile',
    brandColor: '#742284',
    badgeText: 'Y',
  },
  {
    id: 'plin',
    name: 'Plin',
    subtitleEs: 'Pago móvil',
    subtitleEn: 'Mobile payment',
    type: 'mobile',
    brandColor: '#00B2A9',
    badgeText: 'P',
  },
  {
    id: 'visa',
    name: 'Visa',
    subtitleEs: 'Tarjeta •••• 4287',
    subtitleEn: 'Card •••• 4287',
    type: 'card',
    brandColor: '#1A1F71',
    badgeText: 'VISA',
  },
  {
    id: 'mastercard',
    name: 'MasterCard',
    subtitleEs: 'Tarjeta •••• 1234',
    subtitleEn: 'Card •••• 1234',
    type: 'card',
    brandColor: '#EB001B',
    badgeText: 'MC',
  },
  {
    id: 'applepay',
    name: 'Apple Pay',
    subtitleEs: 'Pago con iPhone',
    subtitleEn: 'Pay with iPhone',
    type: 'wallet',
    brandColor: '#0F172A',
    badgeText: '',
  },
  {
    id: 'googlepay',
    name: 'Google Pay',
    subtitleEs: 'Pago con Android',
    subtitleEn: 'Pay with Android',
    type: 'wallet',
    brandColor: '#2563EB',
    badgeText: 'G',
  },
];

export const INITIAL_SESSIONS: ChargeSession[] = [
  {
    id: 'PS-2026-0918',
    stationId: 'sogay',
    stationName: 'Estación Sogay',
    tariffId: 'std',
    chargeLabelEs: 'Carga estándar',
    chargeLabelEn: 'Standard charge',
    durationMin: 15,
    watts: 30,
    amount: 3.0,
    status: 'Completado',
    dateLabel: '18 Sep 2026 10:32 AM',
    isCurrentMonth: true,
    paymentMethodName: 'Yape',
    kwhAdded: 0.45,
    co2SavedKg: 0.22,
  },
  {
    id: 'PS-2026-0915',
    stationId: 'misti',
    stationName: 'Estación Misti',
    tariffId: 'med',
    chargeLabelEs: 'Carga media',
    chargeLabelEn: 'Medium charge',
    durationMin: 30,
    watts: 60,
    amount: 7.0,
    status: 'Completado',
    dateLabel: '15 Sep 2026 02:15 PM',
    isCurrentMonth: true,
    paymentMethodName: 'Visa •••• 4287',
    kwhAdded: 1.2,
    co2SavedKg: 0.58,
  },
  {
    id: 'PS-2026-0910',
    stationId: 'colca',
    stationName: 'Estación Colca',
    tariffId: 'fast',
    chargeLabelEs: 'Carga rápida 120W',
    chargeLabelEn: 'Fast charge 120W',
    durationMin: 15,
    watts: 120,
    amount: 9.0,
    status: 'Completado',
    dateLabel: '10 Sep 2026 09:05 AM',
    isCurrentMonth: true,
    paymentMethodName: 'Plin',
    kwhAdded: 2.1,
    co2SavedKg: 1.05,
  },
  {
    id: 'PS-2026-0829',
    stationId: 'chapi',
    stationName: 'Estación Chapi',
    tariffId: 'std',
    chargeLabelEs: 'Carga estándar',
    chargeLabelEn: 'Standard charge',
    durationMin: 15,
    watts: 30,
    amount: 3.0,
    status: 'Completado',
    dateLabel: '29 Ago 2026 11:48 AM',
    isCurrentMonth: false,
    paymentMethodName: 'Yape',
    kwhAdded: 0.45,
    co2SavedKg: 0.22,
  },
];

export const INITIAL_USER: UserProfile = {
  initials: 'LR',
  name: 'Lucía Romero',
  email: 'lucia.romero@email.com',
  memberSinceEs: 'Feb 2024',
  memberSinceEn: 'Feb 2024',
  totalKwh: 124.6,
  totalCo2Kg: 58.3,
  notificationsEnabled: true,
  ecoSaverMode: false,
};

export const COPY: Record<
  Language,
  {
    tagline: string;
    navInicio: string;
    navMapa: string;
    navHistorial: string;
    navPago: string;
    navPerfil: string;
    ctaChargeNow: string;
    welcomeTitle: string;
    welcomeLocation: string;
    batteryLabel: string;
    chargingSolar: string;
    chargingPaused: string;
    ecoModeActive: string;
    pauseSolar: string;
    resumeSolar: string;
    nearbyStationsBtn: string;
    nearestStationPrefix: string;
    ecoImpactTitle: string;
    consumedLabel: string;
    co2SavedLabel: string;
    levelLabel: string;
    goldLevel: string;
    platinumLevel: string;
    mapTitle: string;
    searchPlaceholder: string;
    noStationsFound: string;
    clearSearch: string;
    chargeHere: string;
    showRoute: string;
    hideRoute: string;
    availablePorts: string;
    solarReserve: string;
    historyTitle: string;
    totalThisMonth: string;
    onlyThisMonth: string;
    allSessions: string;
    downloadCsv: string;
    completed: string;
    repeatCharge: string;
    downloadReceipt: string;
    paymentTitle: string;
    currentTariffs: string;
    paymentMethods: string;
    selectedStation: string;
    payNow: string;
    addMethod: string;
    profileTitle: string;
    profileSubtitle: string;
    totalConsumed: string;
    memberSince: string;
    notifications: string;
    powerSavingMode: string;
    languageLabel: string;
    languageValue: string;
    signOut: string;
    ecoBadgeLabel: string;
    editProfile: string;
  }
> = {
  es: {
    tagline: 'Energía Solar Inteligente',
    navInicio: 'Inicio',
    navMapa: 'Mapa',
    navHistorial: 'Historial',
    navPago: 'Pago',
    navPerfil: 'Perfil',
    ctaChargeNow: 'Cargar ahora',
    welcomeTitle: '¡Bienvenido al Santuario de Chapi!',
    welcomeLocation: 'Santuario de Chapi · Arequipa, Perú',
    batteryLabel: 'Batería',
    chargingSolar: 'Cargando con energía solar',
    chargingPaused: 'Carga solar en pausa',
    ecoModeActive: 'Modo ahorro activo',
    pauseSolar: 'Pausar carga',
    resumeSolar: 'Reanudar carga',
    nearbyStationsBtn: 'Estaciones cercanas',
    nearestStationPrefix: 'Estación más cercana',
    ecoImpactTitle: 'Tu impacto ecológico',
    consumedLabel: 'Consumido',
    co2SavedLabel: 'CO₂ ahorrado',
    levelLabel: 'Nivel',
    goldLevel: 'Oro',
    platinumLevel: 'Platino',
    mapTitle: 'Mapa de estaciones',
    searchPlaceholder: 'Buscar en Arequipa (ej. Sogay, Misti, Colca)',
    noStationsFound: 'No encontramos estaciones con ese nombre.',
    clearSearch: 'Limpiar búsqueda',
    chargeHere: 'Cargar en esta estación',
    showRoute: 'Ver ruta',
    hideRoute: 'Ocultar ruta',
    availablePorts: 'Puertos libres',
    solarReserve: 'Reserva solar',
    historyTitle: 'Historial de cargas',
    totalThisMonth: 'Total este mes',
    onlyThisMonth: 'Solo este mes',
    allSessions: 'Todas',
    downloadCsv: 'Exportar CSV',
    completed: 'Completado',
    repeatCharge: 'Repetir carga',
    downloadReceipt: 'Descargar recibo',
    paymentTitle: 'Método de pago',
    currentTariffs: 'Tarifas actuales',
    paymentMethods: 'Métodos de pago',
    selectedStation: 'Estación seleccionada',
    payNow: 'Pagar ahora',
    addMethod: 'Agregar método',
    profileTitle: 'Perfil',
    profileSubtitle: 'Tu cuenta PowerSpot',
    totalConsumed: 'Consumido total',
    memberSince: 'Miembro desde',
    notifications: 'Notificaciones',
    powerSavingMode: 'Modo ahorro energético',
    languageLabel: 'Idioma',
    languageValue: 'Español',
    signOut: 'Cerrar sesión',
    ecoBadgeLabel: 'Nivel Ecológico',
    editProfile: 'Editar perfil',
  },
  en: {
    tagline: 'Smart Solar Energy',
    navInicio: 'Home',
    navMapa: 'Map',
    navHistorial: 'History',
    navPago: 'Pay',
    navPerfil: 'Profile',
    ctaChargeNow: 'Charge now',
    welcomeTitle: 'Welcome to Santuario de Chapi!',
    welcomeLocation: 'Santuario de Chapi · Arequipa, Peru',
    batteryLabel: 'Battery',
    chargingSolar: 'Charging with solar power',
    chargingPaused: 'Solar charging paused',
    ecoModeActive: 'Power saver active',
    pauseSolar: 'Pause charge',
    resumeSolar: 'Resume charge',
    nearbyStationsBtn: 'Nearby stations',
    nearestStationPrefix: 'Nearest station',
    ecoImpactTitle: 'Your ecological impact',
    consumedLabel: 'Consumed',
    co2SavedLabel: 'CO₂ saved',
    levelLabel: 'Level',
    goldLevel: 'Gold',
    platinumLevel: 'Platinum',
    mapTitle: 'Station Map',
    searchPlaceholder: 'Search Arequipa (e.g. Sogay, Misti, Colca)',
    noStationsFound: 'No charging stations match your search.',
    clearSearch: 'Clear search',
    chargeHere: 'Charge at this station',
    showRoute: 'Show route',
    hideRoute: 'Hide route',
    availablePorts: 'Available ports',
    solarReserve: 'Solar reserve',
    historyTitle: 'Charging history',
    totalThisMonth: 'Total this month',
    onlyThisMonth: 'This month',
    allSessions: 'All sessions',
    downloadCsv: 'Export CSV',
    completed: 'Completed',
    repeatCharge: 'Repeat charge',
    downloadReceipt: 'Download receipt',
    paymentTitle: 'Payment method',
    currentTariffs: 'Current rates',
    paymentMethods: 'Payment methods',
    selectedStation: 'Selected station',
    payNow: 'Pay now',
    addMethod: 'Add method',
    profileTitle: 'Profile',
    profileSubtitle: 'Your PowerSpot account',
    totalConsumed: 'Total consumed',
    memberSince: 'Member since',
    notifications: 'Notifications',
    powerSavingMode: 'Power saving mode',
    languageLabel: 'Language',
    languageValue: 'English',
    signOut: 'Sign out',
    ecoBadgeLabel: 'Eco Level',
    editProfile: 'Edit profile',
  },
};
