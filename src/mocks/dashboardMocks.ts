/**
 * Mocks pour les données du dashboard
 */

/**
 * Statistiques du dashboard
 */
export const stats = {
  totalReservations: 1234,
  conversionRate: 24.8,
  totalRevenue: 45678,
  averageResponseRate: 85.2,
  pendingTransactionsVolume: 12500,
  totalCommissions: 9135,
};

/**
 * Changements pour les statistiques
 */
export const changes = {
  totalReservations: 12,
  conversionRate: -2.5,
  totalRevenue: 15,
  averageResponseRate: 5.7,
  pendingTransactionsVolume: -3.2,
  totalCommissions: 15,
};

/**
 * Données pour le graphique des réservations
 */
export const reservationsChartData = [
  { name: "Jan", value: 40 },
  { name: "Fév", value: 30 },
  { name: "Mar", value: 50 },
  { name: "Avr", value: 27 },
  { name: "Mai", value: 48 },
  { name: "Juin", value: 65 },
];

/**
 * Données pour le graphique du chiffre d'affaires
 */
export const revenueChartData = [
  { name: "Jan", revenue: 2500, commission: 500 },
  { name: "Fév", revenue: 1500, commission: 300 },
  { name: "Mar", revenue: 10000, commission: 2000 },
  { name: "Avr", revenue: 4000, commission: 800 },
  { name: "Mai", revenue: 5000, commission: 1000 },
  { name: "Juin", revenue: 3500, commission: 700 },
];

/**
 * Données pour le graphique des utilisateurs
 */
export const usersChartData = [
  { name: "Jan", nouveaux: 45, actifs: 120 },
  { name: "Fév", nouveaux: 52, actifs: 125 },
  { name: "Mar", nouveaux: 60, actifs: 130 },
  { name: "Avr", nouveaux: 65, actifs: 135 },
  { name: "Mai", nouveaux: 70, actifs: 140 },
  { name: "Juin", nouveaux: 75, actifs: 145 },
];

/**
 * Données pour les dernières réservations
 */
export const latestReservations = [
  {
    id: "res-001",
    customerName: "Jean Dupont",
    customerEmail: "jean.dupont@example.com",
    serviceName: "Cours de yoga",
    providerName: "Yoga Studio",
    date: "2023-12-15",
    time: "14:00",
    status: "confirmed",
    amount: 45.0,
  },
  {
    id: "res-002",
    customerName: "Marie Martin",
    customerEmail: "marie.martin@example.com",
    serviceName: "Massage relaxant",
    providerName: "Spa Détente",
    date: "2023-12-16",
    time: "10:30",
    status: "pending",
    amount: 75.0,
  },
  {
    id: "res-003",
    customerName: "Pierre Durand",
    customerEmail: "pierre.durand@example.com",
    serviceName: "Cours de cuisine",
    providerName: "Atelier Gourmand",
    date: "2023-12-17",
    time: "18:00",
    status: "confirmed",
    amount: 60.0,
  },
  {
    id: "res-004",
    customerName: "Sophie Leroy",
    customerEmail: "sophie.leroy@example.com",
    serviceName: "Randonnée guidée",
    providerName: "Aventure Nature",
    date: "2023-12-18",
    time: "09:00",
    status: "cancelled",
    amount: 35.0,
  },
  {
    id: "res-005",
    customerName: "Thomas Bernard",
    customerEmail: "thomas.bernard@example.com",
    serviceName: "Cours de photographie",
    providerName: "Studio Photo",
    date: "2023-12-19",
    time: "15:30",
    status: "confirmed",
    amount: 50.0,
  },
];

/**
 * Données pour les nouveaux prestataires
 */
export const newProviders = [
  {
    id: "prov-001",
    name: "Yoga Studio",
    email: "contact@yogastudio.com",
    category: "Bien-être",
    registrationDate: "2023-12-10",
    status: "pending",
  },
  {
    id: "prov-002",
    name: "Aventure Nature",
    email: "info@aventurenature.com",
    category: "Sport & Aventure",
    registrationDate: "2023-12-11",
    status: "approved",
  },
  {
    id: "prov-003",
    name: "Atelier Gourmand",
    email: "contact@ateliergourmand.com",
    category: "Gastronomie",
    registrationDate: "2023-12-12",
    status: "pending",
  },
];

/**
 * Données pour les alertes
 */
export const alerts = [
  {
    id: "alert-1",
    type: "success",
    title: "Nouvelle réservation",
    message: "5 nouvelles réservations ont été effectuées aujourd'hui",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    isRead: false,
  },
  {
    id: "alert-2",
    type: "warning",
    title: "Prestataires en attente",
    message: "3 prestataires sont en attente de validation depuis plus de 48h",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isRead: true,
  },
  {
    id: "alert-3",
    type: "error",
    title: "Échec de paiement",
    message: "Un paiement de 120€ a échoué pour la réservation #45678",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    isRead: false,
  },
  {
    id: "alert-4",
    type: "info",
    title: "Maintenance système",
    message:
      "Une maintenance système est prévue demain à 03:00 (durée estimée: 2h)",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    isRead: true,
  },
  {
    id: "alert-5",
    type: "warning",
    title: "Activité signalée",
    message: "L'activité 'Cours de cuisine italienne' a reçu 3 signalements",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isRead: false,
  },
  {
    id: "alert-6",
    type: "error",
    title: "Problème de paiement",
    message:
      "Le remboursement #34521 est bloqué en attente de validation manuelle",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 36 hours ago
    isRead: false,
  },
  {
    id: "alert-7",
    type: "success",
    title: "Nouveau prestataire",
    message:
      "Le prestataire 'Aventures en Montagne' a été validé automatiquement",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    isRead: true,
  },
  {
    id: "alert-8",
    type: "info",
    title: "Mise à jour de la plateforme",
    message: "La version 2.5.0 a été déployée avec succès",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    isRead: true,
  },
];

/**
 * Exporter toutes les données du dashboard
 */
export const dashboardMocks = {
  stats,
  changes,
  reservationsChartData,
  revenueChartData,
  usersChartData,
  latestReservations,
  newProviders,
  alerts,
};
