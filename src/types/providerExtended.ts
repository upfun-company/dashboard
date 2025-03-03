/**
 * Extension du type Provider pour inclure les propriétés supplémentaires
 * utilisées dans les composants ProviderDetails et ProvidersList
 */

import { Provider as BaseProvider } from "./index";

/**
 * Type Provider étendu avec des propriétés supplémentaires
 */
export interface ProviderExtended extends BaseProvider {
  /** Nombre d'avis */
  reviewsCount?: number;
  /** Répartition des avis par note */
  reviewsDistribution?: Record<number, number>;
  /** Nombre de réservations du mois dernier */
  reservationsLastMonth?: number;
  /** Chiffre d'affaires du mois dernier */
  revenueLastMonth?: number;
  /** Commission totale */
  commission?: number;
  /** Taux de commission */
  commissionRate?: number;
  /** Taux de conversion */
  conversionRate?: number;
  /** Nombre de vues */
  viewsCount?: number;
  /** Activités récentes */
  recentActivities?: Array<{
    id: string;
    type: string;
    date: string;
    description: string;
    icon?: string;
  }>;
  /** Activités proposées */
  activities?: Array<{
    id: string;
    title: string;
    description: string;
    price: number;
    duration: string;
    category: string;
    imageUrl?: string;
    isActive: boolean;
    bookingsCount: number;
    rating?: number;
  }>;
  /** Réservations */
  reservations?: Array<{
    id: string;
    customerName: string;
    activityTitle: string;
    date: string;
    participants: number;
    amount: number;
    status: "pending" | "confirmed" | "completed" | "cancelled";
  }>;
  /** Avis */
  reviews?: Array<{
    id: string;
    customerName: string;
    rating: number;
    comment: string;
    date: string;
    activityTitle?: string;
  }>;
}

/**
 * Type guard pour vérifier si un Provider est un ProviderExtended
 */
export function isProviderExtended(
  provider: BaseProvider
): provider is ProviderExtended {
  return (
    "reviewsCount" in provider ||
    "reviewsDistribution" in provider ||
    "reservationsLastMonth" in provider ||
    "revenueLastMonth" in provider ||
    "commission" in provider ||
    "commissionRate" in provider ||
    "conversionRate" in provider ||
    "viewsCount" in provider ||
    "recentActivities" in provider ||
    "activities" in provider ||
    "reservations" in provider ||
    "reviews" in provider
  );
}

/**
 * Fonction pour convertir un Provider en ProviderExtended
 */
export function extendProvider(provider: BaseProvider): ProviderExtended {
  return {
    ...provider,
    reviewsCount: 0,
    reviewsDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    reservationsLastMonth: 0,
    revenueLastMonth: 0,
    commission: 0,
    commissionRate: 15,
    conversionRate: 0,
    viewsCount: 0,
    recentActivities: [],
    activities: [],
    reservations: [],
    reviews: [],
  };
}
