/**
 * Types liés aux réservations et transactions
 */

/**
 * Statut d'une réservation
 */
export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled_by_customer"
  | "cancelled_by_provider"
  | "cancelled_by_admin"
  | "disputed";

/**
 * Statut d'un paiement
 */
export type PaymentStatus =
  | "pending"
  | "completed"
  | "failed"
  | "refunded"
  | "partially_refunded";

/**
 * Type pour une réservation
 */
export interface Reservation {
  /** Identifiant unique */
  id: string;
  /** ID du client */
  customerId: string;
  /** ID du prestataire */
  providerId: string;
  /** ID de l'activité */
  activityId: string;
  /** Date et heure de début */
  startDateTime: string;
  /** Date et heure de fin */
  endDateTime: string;
  /** Nombre de participants */
  participants: number;
  /** Montant total */
  totalAmount: number;
  /** Montant de la commission */
  commissionAmount: number;
  /** Statut de la réservation */
  status: ReservationStatus;
  /** Statut du paiement */
  paymentStatus: PaymentStatus;
  /** Date de création */
  createdAt: string;
  /** Date de dernière mise à jour */
  updatedAt: string;
  /** Notes spéciales */
  specialRequests?: string;
  /** Code de réservation */
  bookingCode: string;
}

/**
 * Type pour un litige
 */
export interface Dispute {
  /** Identifiant unique */
  id: string;
  /** ID de la réservation concernée */
  reservationId: string;
  /** ID de l'utilisateur ayant ouvert le litige */
  openedById: string;
  /** Type d'utilisateur ayant ouvert le litige */
  openedByType: "customer" | "provider" | "admin";
  /** Raison du litige */
  reason: string;
  /** Description détaillée */
  description: string;
  /** Statut du litige */
  status: "open" | "in_mediation" | "resolved" | "closed";
  /** Résolution du litige */
  resolution?: string;
  /** Montant remboursé (si applicable) */
  refundAmount?: number;
  /** Date d'ouverture */
  openedAt: string;
  /** Date de résolution */
  resolvedAt?: string;
  /** ID de l'administrateur en charge */
  assignedAdminId?: string;
  /** Pièces jointes */
  attachments?: Array<{
    id: string;
    url: string;
    type: string;
    uploadedAt: string;
  }>;
}

/**
 * Type pour une transaction
 */
export interface Transaction {
  /** Identifiant unique */
  id: string;
  /** ID de la réservation associée */
  reservationId: string;
  /** Type de transaction */
  type: "payment" | "refund" | "payout";
  /** Montant */
  amount: number;
  /** Devise */
  currency: string;
  /** Statut */
  status: "pending" | "completed" | "failed";
  /** ID de la transaction externe (Stripe, etc.) */
  externalTransactionId?: string;
  /** Date de la transaction */
  transactionDate: string;
  /** Méthode de paiement */
  paymentMethod?: string;
  /** Informations supplémentaires */
  metadata?: Record<string, unknown>;
}
