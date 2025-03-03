/**
 * Types liés au support et aux tickets
 */

/**
 * Statut d'un ticket
 */
export type TicketStatus =
  | "open"
  | "in_progress"
  | "waiting_for_customer"
  | "resolved"
  | "closed";

/**
 * Priorité d'un ticket
 */
export type TicketPriority = "low" | "medium" | "high" | "urgent";

/**
 * Type d'utilisateur
 */
export type UserType = "customer" | "provider" | "admin";

/**
 * Type pour un ticket de support
 */
export interface SupportTicket {
  /** Identifiant unique */
  id: string;
  /** Sujet du ticket */
  subject: string;
  /** ID de l'utilisateur ayant créé le ticket */
  createdById: string;
  /** Type d'utilisateur ayant créé le ticket */
  createdByType: UserType;
  /** ID de la réservation concernée (si applicable) */
  reservationId?: string;
  /** Statut du ticket */
  status: TicketStatus;
  /** Priorité du ticket */
  priority: TicketPriority;
  /** ID de l'administrateur assigné */
  assignedToId?: string;
  /** Catégorie du ticket */
  category: string;
  /** Date de création */
  createdAt: string;
  /** Date de dernière mise à jour */
  updatedAt: string;
  /** Date de résolution */
  resolvedAt?: string;
  /** Date de clôture */
  closedAt?: string;
  /** Tags */
  tags?: string[];
}

/**
 * Type pour un message de ticket
 */
export interface TicketMessage {
  /** Identifiant unique */
  id: string;
  /** ID du ticket */
  ticketId: string;
  /** ID de l'expéditeur */
  senderId: string;
  /** Type d'expéditeur */
  senderType: UserType;
  /** Contenu du message */
  content: string;
  /** Date d'envoi */
  sentAt: string;
  /** Pièces jointes */
  attachments?: Array<{
    id: string;
    url: string;
    filename: string;
    mimeType: string;
    size: number;
  }>;
  /** Lu par le destinataire */
  isRead: boolean;
}

/**
 * Type pour un avis
 */
export interface Review {
  /** Identifiant unique */
  id: string;
  /** ID de la réservation */
  reservationId: string;
  /** ID de l'auteur */
  authorId: string;
  /** ID du destinataire (prestataire) */
  targetId: string;
  /** Note (1-5) */
  rating: number;
  /** Commentaire */
  comment: string;
  /** Date de création */
  createdAt: string;
  /** Statut de modération */
  moderationStatus: "pending" | "approved" | "rejected";
  /** Raison du rejet (si applicable) */
  rejectionReason?: string;
  /** ID de l'administrateur ayant modéré */
  moderatedById?: string;
  /** Date de modération */
  moderatedAt?: string;
  /** Signalé */
  isReported: boolean;
  /** Raison du signalement */
  reportReason?: string;
}
