/**
 * Types liés aux KPIs et statistiques
 */

/**
 * Période de temps pour les statistiques
 */
export type TimePeriod =
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year"
  | "custom";

/**
 * Type pour les statistiques générales
 */
export interface GeneralStats {
  /** Nombre total de réservations */
  totalReservations: number;
  /** Taux de conversion des demandes en réservations */
  conversionRate: number;
  /** Chiffre d'affaires total */
  totalRevenue: number;
  /** Chiffre d'affaires par catégorie */
  revenueByCategory: Record<string, number>;
  /** Taux de réponse moyen des prestataires */
  averageResponseRate: number;
  /** Volume de transactions en attente */
  pendingTransactionsVolume: number;
  /** Commissions générées */
  totalCommissions: number;
}

/**
 * Type pour les statistiques d'utilisateurs
 */
export interface UserStats {
  /** Nombre total d'utilisateurs */
  totalUsers: number;
  /** Nombre de nouveaux utilisateurs */
  newUsers: number;
  /** Taux de croissance */
  growthRate: number;
  /** Utilisateurs actifs */
  activeUsers: number;
  /** Taux de rétention */
  retentionRate: number;
}

/**
 * Type pour les statistiques de prestataires
 */
export interface ProviderStats {
  /** Nombre total de prestataires */
  totalProviders: number;
  /** Nombre de nouveaux prestataires */
  newProviders: number;
  /** Prestataires en attente de validation */
  pendingProviders: number;
  /** Taux d'approbation */
  approvalRate: number;
  /** Prestataires actifs */
  activeProviders: number;
  /** Taux de rétention */
  retentionRate: number;
}

/**
 * Type pour les statistiques de réservations
 */
export interface ReservationStats {
  /** Nombre total de réservations */
  totalReservations: number;
  /** Réservations par statut */
  reservationsByStatus: Record<string, number>;
  /** Taux d'annulation */
  cancellationRate: number;
  /** Taux de litiges */
  disputeRate: number;
  /** Valeur moyenne des réservations */
  averageReservationValue: number;
  /** Réservations par catégorie */
  reservationsByCategory: Record<string, number>;
}

/**
 * Type pour les statistiques financières
 */
export interface FinancialStats {
  /** Chiffre d'affaires total */
  totalRevenue: number;
  /** Commissions totales */
  totalCommissions: number;
  /** Taux de commission moyen */
  averageCommissionRate: number;
  /** Montant des remboursements */
  totalRefunds: number;
  /** Taux de remboursement */
  refundRate: number;
  /** Montant des paiements en attente */
  pendingPayments: number;
  /** Montant des reversements en attente */
  pendingPayouts: number;
}

/**
 * Type pour les données de série temporelle
 */
export interface TimeSeriesData {
  /** Étiquette de temps (date) */
  label: string;
  /** Valeur */
  value: number;
}

/**
 * Type pour les données de graphique
 */
export interface ChartData {
  /** Titre du graphique */
  title: string;
  /** Description */
  description?: string;
  /** Données */
  data: TimeSeriesData[] | Record<string, number>;
  /** Type de graphique */
  chartType: "line" | "bar" | "pie" | "area" | "radar";
  /** Unité */
  unit?: string;
  /** Pourcentage de changement par rapport à la période précédente */
  changePercentage?: number;
}

export interface AnalyticsKPI {
  id: string;
  title: string;
  value: number;
  previousValue: number;
  change: number;
  trend: "up" | "down";
  format: "percent" | "currency" | "compact" | "standard";
  description: string;
}
