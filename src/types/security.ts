/**
 * Types pour la gestion de la sécurité, des rôles et des permissions
 */

import { BaseUser } from "./users";

/**
 * Énumération des rôles disponibles dans le système
 */
export enum Role {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  FINANCE = "finance",
  SUPPORT = "support",
  MARKETING = "marketing",
  CONTENT_MANAGER = "content_manager",
  VIEWER = "viewer",
}

/**
 * Énumération des ressources du système pouvant être soumises à des permissions
 */
export enum Resource {
  USERS = "users",
  PROVIDERS = "providers",
  RESERVATIONS = "reservations",
  TRANSACTIONS = "transactions",
  PAYOUTS = "payouts",
  COMMISSIONS = "commissions",
  ACTIVITIES = "activities",
  SUPPORT_TICKETS = "support_tickets",
  REVIEWS = "reviews",
  PROMOTIONS = "promotions",
  SETTINGS = "settings",
  AUDIT_LOGS = "audit_logs",
}

/**
 * Énumération des actions possibles sur les ressources
 */
export enum Action {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  APPROVE = "approve",
  REJECT = "reject",
  EXPORT = "export",
  IMPERSONATE = "impersonate",
}

/**
 * Type représentant une permission spécifique
 */
export interface Permission {
  /** Ressource concernée par la permission */
  resource: Resource;
  /** Actions autorisées sur cette ressource */
  actions: Action[];
}

/**
 * Type représentant un rôle avec ses permissions associées
 */
export interface RoleDefinition {
  /** Identifiant unique du rôle */
  id: string;
  /** Nom du rôle */
  name: Role;
  /** Description du rôle */
  description: string;
  /** Liste des permissions associées au rôle */
  permissions: Permission[];
  /** Date de création du rôle */
  createdAt: string;
  /** Date de dernière modification du rôle */
  updatedAt: string;
  /** Indique si le rôle est un rôle système (non modifiable) */
  isSystem: boolean;
}

/**
 * Type représentant un utilisateur administrateur avec son rôle
 */
export interface AdminUser extends BaseUser {
  /** Rôle de l'administrateur */
  role: Role;
  /** Date de dernière connexion */
  lastLoginAt?: string;
  /** Adresse IP de dernière connexion */
  lastLoginIp?: string;
  /** Indique si l'authentification 2FA est activée */
  twoFactorEnabled: boolean;
  /** Méthode d'authentification 2FA (app, sms, email) */
  twoFactorMethod?: "app" | "sms" | "email";
}

/**
 * Énumération des types d'événements d'audit
 */
export enum AuditEventType {
  LOGIN = "login",
  LOGOUT = "logout",
  FAILED_LOGIN = "failed_login",
  PASSWORD_CHANGE = "password_change",
  USER_CREATE = "user_create",
  USER_UPDATE = "user_update",
  USER_DELETE = "user_delete",
  PROVIDER_CREATE = "provider_create",
  PROVIDER_UPDATE = "provider_update",
  PROVIDER_DELETE = "provider_delete",
  PROVIDER_APPROVE = "provider_approve",
  PROVIDER_REJECT = "provider_reject",
  RESERVATION_CREATE = "reservation_create",
  RESERVATION_UPDATE = "reservation_update",
  RESERVATION_CANCEL = "reservation_cancel",
  TRANSACTION_CREATE = "transaction_create",
  TRANSACTION_UPDATE = "transaction_update",
  PAYOUT_CREATE = "payout_create",
  PAYOUT_UPDATE = "payout_update",
  COMMISSION_UPDATE = "commission_update",
  SETTINGS_UPDATE = "settings_update",
  ROLE_CREATE = "role_create",
  ROLE_UPDATE = "role_update",
  ROLE_DELETE = "role_delete",
  PERMISSION_UPDATE = "permission_update",
}

/**
 * Type représentant un log d'audit
 */
export interface AuditLog {
  /** Identifiant unique du log */
  id: string;
  /** Type d'événement */
  eventType: AuditEventType;
  /** Identifiant de l'utilisateur ayant effectué l'action */
  userId: string;
  /** Nom de l'utilisateur ayant effectué l'action */
  userName: string;
  /** Adresse IP de l'utilisateur */
  ipAddress: string;
  /** Ressource concernée par l'action */
  resource: Resource;
  /** Identifiant de la ressource concernée */
  resourceId?: string;
  /** Description détaillée de l'action */
  description: string;
  /** Données avant modification (pour les actions de mise à jour) */
  previousData?: Record<string, unknown>;
  /** Données après modification (pour les actions de mise à jour) */
  newData?: Record<string, unknown>;
  /** Statut de l'action (succès, échec) */
  status: "success" | "failure";
  /** Message d'erreur en cas d'échec */
  errorMessage?: string;
  /** Date et heure de l'événement */
  timestamp: string;
  /** User agent du navigateur */
  userAgent?: string;
}

/**
 * Type représentant une session de connexion
 */
export interface LoginSession {
  /** Identifiant unique de la session */
  id: string;
  /** Identifiant de l'utilisateur */
  userId: string;
  /** Nom de l'utilisateur */
  userName: string;
  /** Adresse IP */
  ipAddress: string;
  /** User agent du navigateur */
  userAgent: string;
  /** Localisation approximative (pays, ville) */
  location?: string;
  /** Date et heure de début de session */
  startedAt: string;
  /** Date et heure de fin de session (si déconnecté) */
  endedAt?: string;
  /** Statut de la session */
  status: "active" | "expired" | "terminated";
  /** Méthode d'authentification utilisée */
  authMethod: "password" | "2fa" | "sso";
}

/**
 * Filtres pour la recherche de logs d'audit
 */
export interface AuditLogFilters {
  /** Recherche textuelle */
  search?: string;
  /** Types d'événements à inclure */
  eventTypes?: AuditEventType[];
  /** Identifiant de l'utilisateur */
  userId?: string;
  /** Ressources concernées */
  resources?: Resource[];
  /** Plage de dates */
  dateRange?: {
    start: string;
    end: string;
  };
  /** Statut des actions */
  status?: "success" | "failure";
  /** Tri par champ */
  sortBy?: "timestamp" | "eventType" | "userName" | "resource";
  /** Direction du tri */
  sortDirection?: "asc" | "desc";
}

/**
 * Filtres pour la recherche de sessions de connexion
 */
export interface LoginSessionFilters {
  /** Recherche textuelle */
  search?: string;
  /** Identifiant de l'utilisateur */
  userId?: string;
  /** Statut des sessions */
  status?: "active" | "expired" | "terminated";
  /** Plage de dates */
  dateRange?: {
    start: string;
    end: string;
  };
  /** Tri par champ */
  sortBy?: "startedAt" | "endedAt" | "userName" | "ipAddress";
  /** Direction du tri */
  sortDirection?: "asc" | "desc";
}
