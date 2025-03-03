/**
 * Types liés aux activités et offres
 */

/**
 * Statut d'une activité
 */
export type ActivityStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "rejected"
  | "archived";

/**
 * Type pour une catégorie d'activité
 */
export interface Category {
  /** Identifiant unique */
  id: string;
  /** Nom de la catégorie */
  name: string;
  /** Description */
  description?: string;
  /** URL de l'icône */
  iconUrl?: string;
  /** Ordre d'affichage */
  displayOrder: number;
  /** Catégorie parente (si sous-catégorie) */
  parentCategoryId?: string;
}

/**
 * Type de récurrence pour une activité
 */
export type RecurrenceType =
  | "none" // Pas de récurrence
  | "daily" // Tous les jours
  | "weekly" // Toutes les semaines
  | "biweekly" // Toutes les deux semaines
  | "monthly" // Tous les mois
  | "custom"; // Récurrence personnalisée

/**
 * Configuration de récurrence pour une activité
 */
export interface RecurrenceConfig {
  /** Type de récurrence */
  type: RecurrenceType;
  /** Jours de la semaine (pour récurrence hebdomadaire) */
  daysOfWeek?: number[]; // 0 = dimanche, 1 = lundi, etc.
  /** Date de début de la récurrence */
  startDate: string;
  /** Heure de début (format HH:MM) */
  startTime?: string;
  /** Heure de fin (format HH:MM) */
  endTime?: string;
  /** Date de fin de la récurrence (optionnel) */
  endDate?: string;
  /** Nombre d'occurrences (alternative à endDate) */
  occurrences?: number;
  /** Intervalle (ex: toutes les 2 semaines) */
  interval?: number;
  /** Exceptions - dates où l'activité n'a pas lieu malgré la récurrence */
  exceptions?: string[];
  /** Type de récurrence mensuelle (jour du mois ou jour de la semaine) */
  monthlyType?: "dayOfMonth" | "dayOfWeek";
  /** Occurrences modifiées (horaires différents, annulations, etc.) */
  modifiedOccurrences?: Array<{
    /** Date originale de l'occurrence (YYYY-MM-DD) */
    originalDate: string;
    /** Nouvelle date et heure de début (si modifiée) */
    newStartDateTime?: string;
    /** Nouvelle date et heure de fin (si modifiée) */
    newEndDateTime?: string;
    /** Indique si l'occurrence est annulée */
    isCancelled?: boolean;
    /** Raison de l'annulation ou de la modification */
    reason?: string;
  }>;
}

/**
 * Occurrence d'une activité (instance spécifique d'une activité récurrente)
 */
export interface ActivityOccurrence {
  /** Identifiant unique */
  id: string;
  /** ID de l'activité parente */
  activityId: string;
  /** Date et heure de début */
  startDateTime: string;
  /** Date et heure de fin */
  endDateTime: string;
  /** Places disponibles */
  availableSpots: number;
  /** Places totales */
  totalSpots: number;
  /** Prix spécifique pour cette occurrence (si différent de l'activité parente) */
  specificPrice?: number;
  /** Indique si cette occurrence a une promotion */
  hasPromotion: boolean;
  /** Pourcentage de promotion (si applicable) */
  promotionPercentage?: number;
  /** Statut spécifique pour cette occurrence */
  status: "available" | "full" | "cancelled" | "completed";
  /** Indique si cette occurrence est une exception à la règle de récurrence */
  isException?: boolean;
  /** Raison de l'exception (si applicable) */
  exceptionReason?: string;
}

/**
 * Type pour une activité
 */
export interface Activity {
  id: string;
  title: string;
  name?: string;
  description: string;
  shortDescription?: string;
  fullDescription?: string;
  price: number;
  currency?: string;
  duration?: number;
  durationMinutes?: number;
  category: string;
  categoryIds?: string[];
  location:
    | string
    | {
        address: string;
        postalCode: string;
        city: string;
        country: string;
        latitude?: number;
        longitude?: number;
      };
  providerId: string;
  providerName?: string;
  maxParticipants?: number;
  minParticipants?: number;
  status: ActivityStatus;
  createdAt: string;
  updatedAt: string;
  images?:
    | string[]
    | {
        id: string;
        url: string;
        isMain: boolean;
        alt: string;
      }[];
  rating?: number;
  averageRating?: number;
  reviewsCount?: number;
  reviewCount?: number;
  bookingCount?: number;
  /** Configuration de récurrence */
  recurrence?: RecurrenceConfig;
  /** Liste des occurrences (pour les activités récurrentes) */
  occurrences?: ActivityOccurrence[];
}

/**
 * Type pour une promotion
 */
export interface Promotion {
  /** Identifiant unique */
  id: string;
  /** Code de la promotion */
  code: string;
  /** Description */
  description: string;
  /** Type de remise */
  discountType: "percentage" | "fixed_amount";
  /** Valeur de la remise */
  discountValue: number;
  /** Date de début */
  startDate: string;
  /** Date de fin */
  endDate: string;
  /** Nombre maximum d'utilisations */
  maxUsageCount?: number;
  /** Nombre d'utilisations actuel */
  currentUsageCount: number;
  /** Montant minimum d'achat */
  minimumPurchaseAmount?: number;
  /** Limité à certaines catégories */
  limitedToCategoryIds?: string[];
  /** Limité à certains prestataires */
  limitedToProviderIds?: string[];
  /** Limité à certaines activités */
  limitedToActivityIds?: string[];
  /** Statut */
  isActive: boolean;
  /** Créé par (ID admin) */
  createdById: string;
}

export interface ActivityFilters {
  status: ActivityStatus | null;
  category: string | null;
  search: string;
  dateRange: {
    start: string;
    end: string;
  } | null;
  providerId?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}
