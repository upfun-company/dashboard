/**
 * Export de tous les types de l'application
 */

// Types généraux
export * from "./general";

// Types utilisateurs
export * from "./users";

// Types réservations
export * from "./reservations";

// Types activités
export * from "./activities";

// Types support
export * from "./support";

// Types analytics
export * from "./analytics";

// Types étendus pour les prestataires
export * from "./providerExtended";

// Types pour la gestion financière
export type {
  FinancialTransaction,
  FinancialReport,
  FinancialStats,
} from "./finance";

/**
 * Types généraux pour l'application
 */

/**
 * Props générales pour les composants
 */
export interface GeneralProps {
  /** Classes CSS */
  className?: string;
}

/**
 * Options de filtrage
 */
export interface FilterOptions {
  /** Terme de recherche */
  search: string;
  /** Champ de tri */
  sortBy: string;
  /** Direction de tri */
  sortDirection: "asc" | "desc";
  /** Statut du client */
  status?: "all" | "active" | "inactive";
}

/**
 * Réponse paginée
 */
export interface PaginatedResponse<T> {
  /** Données */
  data: T[];
  /** Informations de pagination */
  pagination: {
    /** Page courante */
    page: number;
    /** Nombre d'éléments par page */
    limit: number;
    /** Nombre total d'éléments */
    total: number;
  };
}

/**
 * Types pour l'application dashboard
 */

/**
 * Interface pour une adresse
 */
export interface Address {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

/**
 * Interface pour un client
 */
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  lastActive?: string;
  totalSpent?: number;
  reservationsCount?: number;
  status: "active" | "inactive";
  avatarUrl?: string;
}

/**
 * Interface pour une réservation
 */
export interface Reservation {
  id: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  activityId: string;
  activityName: string;
  date: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  amount: number;
}

/**
 * Types pour les activités
 */
export type ActivityStatus =
  | "published"
  | "pending_review"
  | "draft"
  | "rejected"
  | "archived";

export interface Activity {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  fullDescription?: string;
  price: number;
  currency: string;
  durationMinutes: number;
  minParticipants: number;
  maxParticipants: number;
  providerId: string;
  providerName?: string;
  categoryIds?: string[];
  category?: string;
  status: ActivityStatus;
  createdAt: string;
  updatedAt: string;
  location: {
    address: string;
    postalCode: string;
    city: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  images?: Array<{
    id: string;
    url: string;
    isMain: boolean;
    alt?: string;
  }>;
  averageRating?: number;
  reviewCount?: number;
  bookingCount?: number;
  recurrence?: RecurrenceConfig;
  occurrences?: ActivityOccurrence[];
}

/**
 * Types pour les promotions
 */
export interface Promotion {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed_amount";
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  currentUsageCount: number;
  maxUsageCount?: number;
  maxUsagePerUser?: number;
  minOrderAmount?: number;
  applicableActivities?: string[];
  excludedActivities?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Types pour les alertes et événements
 */
export interface Alert {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  createdAt: string;
  isRead: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  relatedId?: string;
  relatedType?: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

/**
 * Types pour la pagination
 */
export interface PaginationData {
  page: number;
  limit: number;
  total: number;
}

/**
 * Interface pour un prestataire
 */
export interface Provider {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  category: string;
  location: string;
  status: "pending" | "approved" | "rejected";
  revenue?: number;
  rating?: number;
  reservationsCount?: number;
  description?: string;
  phone?: string;
  website?: string;
  avatarUrl?: string;
}

/**
 * Interface pour un utilisateur
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "support";
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

/**
 * Interface pour les statistiques du dashboard
 */
export interface DashboardStats {
  totalReservations: number;
  conversionRate: number;
  totalRevenue: number;
  averageResponseRate: number;
  pendingTransactions: number;
  totalCommissions: number;
}

/**
 * Interface pour les changements de statistiques
 */
export interface StatsChanges {
  totalReservations?: number;
  conversionRate?: number;
  totalRevenue?: number;
  averageResponseRate?: number;
  pendingTransactions?: number;
  totalCommissions?: number;
}

/**
 * Interface pour une notification
 */
export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

/**
 * Interface pour une transaction financière
 */
export interface Transaction {
  id: string;
  type: "payment" | "refund" | "commission";
  amount: number;
  status: "pending" | "completed" | "failed";
  date: string;
  customerId?: string;
  customerName?: string;
  providerId?: string;
  providerName?: string;
  reservationId?: string;
  description?: string;
}

/**
 * Interface pour un avis
 */
export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  activityId: string;
  activityName: string;
  rating: number;
  comment: string;
  date: string;
}

/**
 * Interface pour un message de support
 */
export interface SupportMessage {
  id: string;
  userId: string;
  userType: "customer" | "provider" | "admin";
  userName: string;
  subject: string;
  message: string;
  date: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  assignedTo?: string;
}

/**
 * Interface pour un document
 */
export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
  status: "pending" | "approved" | "rejected";
}

/**
 * Types pour la récurrence des activités
 */
export type RecurrenceType =
  | "none"
  | "daily"
  | "weekly"
  | "biweekly"
  | "monthly";

export interface RecurrenceConfig {
  type: RecurrenceType;
  startDate: string;
  endDate?: string;
  daysOfWeek?: number[];
  occurrences?: number;
  exceptions?: string[];
  interval?: number;
  startTime?: string;
  endTime?: string;
  monthlyType?: "dayOfMonth" | "dayOfWeek";
  monthlyDay?: number;
  monthlyWeek?: number;
  monthlyWeekday?: number;
  modifiedOccurrences?: Array<{
    originalDate: string;
    newStartDateTime?: string;
    newEndDateTime?: string;
    isCancelled?: boolean;
    reason?: string;
  }>;
}

export interface ActivityOccurrence {
  id: string;
  activityId: string;
  startDateTime: string;
  endDateTime: string;
  availableSpots: number;
  totalSpots: number;
  hasPromotion: boolean;
  promotionPercentage?: number;
  status: "available" | "full" | "cancelled" | "completed";
  isException?: boolean;
  exceptionReason?: string;
}
