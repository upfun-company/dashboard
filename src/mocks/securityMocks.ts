import { faker } from "@faker-js/faker/locale/fr";
import {
  Action,
  AuditEventType,
  AuditLog,
  LoginSession,
  Permission,
  Resource,
  Role,
  RoleDefinition,
} from "@/types/security";

// Type local pour le mock d'AdminUser
type MockAdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
  twoFactorEnabled: boolean;
  twoFactorMethod?: "app" | "sms" | "email";
  status: "active" | "inactive";
};

/**
 * Génère un ensemble de permissions pour un rôle donné
 */
const generatePermissionsForRole = (role: Role): Permission[] => {
  // Permissions de base pour tous les rôles (lecture seule)
  const basePermissions: Permission[] = [
    { resource: Resource.USERS, actions: [Action.READ] },
    { resource: Resource.PROVIDERS, actions: [Action.READ] },
    { resource: Resource.RESERVATIONS, actions: [Action.READ] },
    { resource: Resource.ACTIVITIES, actions: [Action.READ] },
  ];

  // Permissions spécifiques par rôle
  switch (role) {
    case Role.SUPER_ADMIN:
      // Super Admin a toutes les permissions sur toutes les ressources
      return Object.values(Resource).map((resource) => ({
        resource,
        actions: Object.values(Action),
      }));

    case Role.ADMIN:
      // Admin a presque toutes les permissions sauf certaines actions sensibles
      return Object.values(Resource).map((resource) => ({
        resource,
        actions: Object.values(Action).filter(
          (action) => action !== Action.IMPERSONATE
        ),
      }));

    case Role.FINANCE:
      return [
        ...basePermissions,
        {
          resource: Resource.TRANSACTIONS,
          actions: [Action.READ, Action.UPDATE, Action.EXPORT],
        },
        {
          resource: Resource.PAYOUTS,
          actions: [Action.READ, Action.CREATE, Action.UPDATE, Action.EXPORT],
        },
        {
          resource: Resource.COMMISSIONS,
          actions: [Action.READ, Action.UPDATE, Action.EXPORT],
        },
      ];

    case Role.SUPPORT:
      return [
        ...basePermissions,
        {
          resource: Resource.SUPPORT_TICKETS,
          actions: [
            Action.READ,
            Action.CREATE,
            Action.UPDATE,
            Action.DELETE,
            Action.EXPORT,
          ],
        },
        {
          resource: Resource.REVIEWS,
          actions: [Action.READ, Action.UPDATE, Action.DELETE],
        },
        {
          resource: Resource.USERS,
          actions: [Action.READ, Action.UPDATE],
        },
        {
          resource: Resource.PROVIDERS,
          actions: [Action.READ, Action.UPDATE],
        },
        {
          resource: Resource.RESERVATIONS,
          actions: [Action.READ, Action.UPDATE],
        },
      ];

    case Role.MARKETING:
      return [
        ...basePermissions,
        {
          resource: Resource.PROMOTIONS,
          actions: [
            Action.READ,
            Action.CREATE,
            Action.UPDATE,
            Action.DELETE,
            Action.EXPORT,
          ],
        },
        {
          resource: Resource.ACTIVITIES,
          actions: [Action.READ, Action.UPDATE, Action.EXPORT],
        },
      ];

    case Role.CONTENT_MANAGER:
      return [
        ...basePermissions,
        {
          resource: Resource.ACTIVITIES,
          actions: [
            Action.READ,
            Action.CREATE,
            Action.UPDATE,
            Action.DELETE,
            Action.APPROVE,
            Action.REJECT,
          ],
        },
        {
          resource: Resource.REVIEWS,
          actions: [
            Action.READ,
            Action.UPDATE,
            Action.DELETE,
            Action.APPROVE,
            Action.REJECT,
          ],
        },
      ];

    case Role.VIEWER:
    default:
      // Viewer a uniquement des permissions en lecture
      return Object.values(Resource).map((resource) => ({
        resource,
        actions: [Action.READ],
      }));
  }
};

/**
 * Génère des définitions de rôles prédéfinies
 */
export const generateRoleDefinitions = (): RoleDefinition[] => {
  const roleDescriptions: Record<Role, string> = {
    [Role.SUPER_ADMIN]:
      "Accès complet à toutes les fonctionnalités et données du système",
    [Role.ADMIN]:
      "Accès à la plupart des fonctionnalités administratives avec quelques restrictions",
    [Role.FINANCE]:
      "Gestion des transactions, paiements, reversements et commissions",
    [Role.SUPPORT]:
      "Gestion du support client, des tickets et modération des avis",
    [Role.MARKETING]:
      "Gestion des promotions, codes promo et campagnes marketing",
    [Role.CONTENT_MANAGER]:
      "Modération et gestion du contenu des activités et des avis",
    [Role.VIEWER]:
      "Accès en lecture seule à toutes les données pour analyse et reporting",
  };

  return Object.values(Role).map((role) => ({
    id: faker.string.uuid(),
    name: role,
    description: roleDescriptions[role],
    permissions: generatePermissionsForRole(role),
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    updatedAt: faker.date.recent({ days: 30 }).toISOString(),
    isSystem: true, // Tous les rôles prédéfinis sont des rôles système
  }));
};

/**
 * Génère un utilisateur administrateur fictif
 */
export const generateMockAdminUser = (): MockAdminUser => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const roles = Object.values(Role);

  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    phone: faker.phone.number(),
    avatar: faker.image.avatar(),
    role: roles[Math.floor(Math.random() * roles.length)],
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    updatedAt: faker.date.recent({ days: 30 }).toISOString(),
    lastLoginAt: faker.date.recent({ days: 7 }).toISOString(),
    lastLoginIp: faker.internet.ipv4(),
    twoFactorEnabled: faker.datatype.boolean(),
    twoFactorMethod: faker.helpers.arrayElement(["app", "sms", "email"]) as
      | "app"
      | "sms"
      | "email",
    status: faker.helpers.arrayElement(["active", "inactive"]),
  };
};

/**
 * Génère une liste d'utilisateurs administrateurs fictifs
 */
export const generateMockAdminUsers = (count: number = 10): MockAdminUser[] => {
  return Array.from({ length: count }, () => generateMockAdminUser());
};

/**
 * Génère un log d'audit fictif
 */
export const generateMockAuditLog = (): AuditLog => {
  const eventType = faker.helpers.arrayElement(Object.values(AuditEventType));
  const resource = faker.helpers.arrayElement(Object.values(Resource));
  const status = faker.helpers.arrayElement(["success", "failure"]) as
    | "success"
    | "failure";
  const userName = `${faker.person.firstName()} ${faker.person.lastName()}`;

  // Générer une description basée sur le type d'événement
  let description = "";
  switch (eventType) {
    case AuditEventType.LOGIN:
      description = `Connexion de l'utilisateur ${userName}`;
      break;
    case AuditEventType.LOGOUT:
      description = `Déconnexion de l'utilisateur ${userName}`;
      break;
    case AuditEventType.FAILED_LOGIN:
      description = `Tentative de connexion échouée pour ${userName}`;
      break;
    case AuditEventType.PASSWORD_CHANGE:
      description = `Changement de mot de passe pour ${userName}`;
      break;
    default:
      // Pour les autres types d'événements, générer une description générique
      const action = eventType.split("_")[1]?.toLowerCase() || "modification";
      description = `${
        action.charAt(0).toUpperCase() + action.slice(1)
      } de ${resource.toLowerCase()} par ${userName}`;
  }

  return {
    id: faker.string.uuid(),
    eventType,
    userId: faker.string.uuid(),
    userName,
    ipAddress: faker.internet.ipv4(),
    resource,
    resourceId: faker.string.uuid(),
    description,
    previousData: eventType.includes("UPDATE")
      ? { status: "old_value" }
      : undefined,
    newData: eventType.includes("UPDATE") ? { status: "new_value" } : undefined,
    status,
    errorMessage:
      status === "failure"
        ? "Une erreur est survenue lors de l'opération"
        : undefined,
    timestamp: faker.date.recent({ days: 30 }).toISOString(),
    userAgent: faker.internet.userAgent(),
  };
};

/**
 * Génère une liste de logs d'audit fictifs
 */
export const generateMockAuditLogs = (count: number = 50): AuditLog[] => {
  return Array.from({ length: count }, () => generateMockAuditLog());
};

/**
 * Génère une session de connexion fictive
 */
export const generateMockLoginSession = (): LoginSession => {
  const userName = `${faker.person.firstName()} ${faker.person.lastName()}`;
  const startedAt = faker.date.recent({ days: 7 });
  const status = faker.helpers.arrayElement([
    "active",
    "expired",
    "terminated",
  ]) as "active" | "expired" | "terminated";

  // Si la session n'est pas active, générer une date de fin
  const endedAt =
    status !== "active"
      ? new Date(
          startedAt.getTime() +
            faker.number.int({ min: 1000 * 60, max: 1000 * 60 * 60 * 3 })
        )
      : undefined;

  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    userName,
    ipAddress: faker.internet.ipv4(),
    userAgent: faker.internet.userAgent(),
    location: `${faker.location.city()}, ${faker.location.country()}`,
    startedAt: startedAt.toISOString(),
    endedAt: endedAt?.toISOString(),
    status,
    authMethod: faker.helpers.arrayElement(["password", "2fa", "sso"]) as
      | "password"
      | "2fa"
      | "sso",
  };
};

/**
 * Génère une liste de sessions de connexion fictives
 */
export const generateMockLoginSessions = (
  count: number = 30
): LoginSession[] => {
  return Array.from({ length: count }, () => generateMockLoginSession());
};
