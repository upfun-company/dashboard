/**
 * Types pour les mocks du dashboard
 */

// Type pour les statistiques
export interface DashboardStats {
  totalReservations: number;
  conversionRate: number;
  totalRevenue: number;
  averageResponseRate: number;
  pendingTransactionsVolume: number;
  totalCommissions: number;
}

// Type pour les changements
export interface DashboardChanges {
  totalReservations: number;
  conversionRate: number;
  totalRevenue: number;
  averageResponseRate: number;
  pendingTransactionsVolume: number;
  totalCommissions: number;
}

// Type pour les données du graphique des réservations
export type ReservationsChartData = Array<{
  name: string;
  value: number;
}>;

// Type pour les données du graphique des revenus
export type RevenueChartData = Array<{
  name: string;
  revenue: number;
  commission: number;
}>;

// Type pour les données du graphique des utilisateurs
export type UsersChartData = Array<{
  name: string;
  nouveaux: number;
  actifs: number;
}>;

// Type pour les réservations
export interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  providerName: string;
  date: string;
  time: string;
  status: string;
  amount: number;
}

// Type pour les prestataires
export interface Provider {
  id: string;
  name: string;
  email: string;
  category: string;
  registrationDate: string;
  status: string;
}

// Type pour les alertes
export interface Alert {
  id: string;
  type: string;
  message: string;
  severity: string;
  date: string;
}

// Type pour les mocks du dashboard
export interface DashboardMocks {
  stats: DashboardStats;
  changes: DashboardChanges;
  reservationsChartData: ReservationsChartData;
  revenueChartData: RevenueChartData;
  usersChartData: UsersChartData;
  latestReservations: Reservation[];
  newProviders: Provider[];
  alerts: Alert[];
}
