/**
 * Types liés aux utilisateurs et prestataires
 */

/**
 * Statut d'un compte utilisateur ou prestataire
 */
export type AccountStatus = "active" | "pending" | "blocked" | "deleted";

/**
 * Type de base pour un utilisateur
 */
export interface BaseUser {
  /** Identifiant unique */
  id: string;
  /** Adresse email */
  email: string;
  /** Prénom */
  firstName: string;
  /** Nom de famille */
  lastName: string;
  /** Numéro de téléphone */
  phone?: string;
  /** URL de la photo de profil */
  profilePicture?: string;
  /** Date de création du compte */
  createdAt: string;
  /** Date de dernière mise à jour du compte */
  updatedAt: string;
  /** Statut du compte */
  status: AccountStatus;
}

/**
 * Type pour un client
 */
export interface Customer extends BaseUser {
  /** Nombre total de réservations */
  totalReservations: number;
  /** Montant total dépensé */
  totalSpent: number;
  /** Note moyenne donnée */
  averageRating?: number;
}

/**
 * Type pour un document de vérification
 */
export interface VerificationDocument {
  /** Identifiant unique */
  id: string;
  /** Type de document */
  type: "id" | "business" | "insurance" | "other";
  /** URL du document */
  url: string;
  /** Statut de vérification */
  status: "pending" | "approved" | "rejected";
  /** Raison du rejet si applicable */
  rejectionReason?: string;
  /** Date de soumission */
  submittedAt: string;
  /** Date de vérification */
  verifiedAt?: string;
}

/**
 * Type pour un prestataire
 */
export interface Provider extends BaseUser {
  /** Nom de l'entreprise */
  companyName: string;
  /** Numéro SIRET */
  siret: string;
  /** Numéro de TVA */
  vatNumber?: string;
  /** Adresse */
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  /** Catégories de services proposés */
  categories: string[];
  /** Documents de vérification */
  verificationDocuments: VerificationDocument[];
  /** Nombre total de réservations */
  totalReservations: number;
  /** Chiffre d'affaires total généré */
  totalRevenue: number;
  /** Commission totale générée */
  totalCommission: number;
  /** Note moyenne reçue */
  averageRating?: number;
  /** Taux de commission personnalisé (si différent du taux standard) */
  customCommissionRate?: number;
}

/**
 * Type pour un administrateur
 */
export interface Admin extends BaseUser {
  /** Rôle de l'administrateur */
  role: "super_admin" | "support" | "finance" | "moderator";
  /** Permissions spécifiques */
  permissions: string[];
}
