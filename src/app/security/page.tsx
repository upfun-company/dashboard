"use client";

import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTitle } from "@/components/ui/page-title";
import RoleManagement from "@/components/_organisms/RoleManagement/RoleManagement";
import AuditLogs from "@/components/_organisms/AuditLogs/AuditLogs";
import LoginSessions from "@/components/_organisms/LoginSessions/LoginSessions";
import TwoFactorSettings from "@/components/_organisms/TwoFactorSettings/TwoFactorSettings";
import UserRoleAssignment from "@/components/_organisms/UserRoleAssignment/UserRoleAssignment";
import { Shield, FileText, Users, Lock, LogOut } from "lucide-react";
import {
  generateRoleDefinitions,
  generateMockAdminUser,
  generateMockAuditLogs,
  generateMockLoginSessions,
  generateMockAdminUsers,
} from "@/mocks/securityMocks";
import {
  AuditLogFilters,
  LoginSessionFilters,
  RoleDefinition,
  AuditLog,
  Role,
  AdminUser,
} from "@/types/security";

/**
 * Page de gestion de la sécurité et des paramètres
 */
export default function SecurityPage() {
  // Générer des données fictives pour l'exemple
  const roles = useMemo(() => generateRoleDefinitions(), []);
  const currentUser = useMemo(() => {
    const user = generateMockAdminUser();
    // Convertir le statut pour correspondre au type AccountStatus
    return {
      ...user,
      status: user.status === "inactive" ? "blocked" : "active",
    } as AdminUser;
  }, []);
  const auditLogs = useMemo(() => generateMockAuditLogs(50), []);
  const loginSessions = useMemo(() => generateMockLoginSessions(20), []);

  // État pour les filtres des logs d'audit
  const [auditLogFilters, setAuditLogFilters] = useState<AuditLogFilters>({
    sortBy: "timestamp",
    sortDirection: "desc",
  });

  // État pour les filtres des sessions de connexion
  const [loginSessionFilters, setLoginSessionFilters] =
    useState<LoginSessionFilters>({
      sortBy: "startedAt",
      sortDirection: "desc",
    });

  // État pour la pagination des logs d'audit
  const [auditLogPage, setAuditLogPage] = useState(1);
  const auditLogPageSize = 10;

  // État pour la pagination des sessions de connexion
  const [loginSessionPage, setLoginSessionPage] = useState(1);
  const loginSessionPageSize = 10;

  // Générer des données de test pour les utilisateurs administrateurs
  const adminUsers = useMemo(() => {
    const users = generateMockAdminUsers(15);
    // Convertir le statut pour correspondre au type AccountStatus
    return users.map((user) => ({
      ...user,
      status: user.status === "inactive" ? "blocked" : "active",
    })) as AdminUser[];
  }, []);

  // Filtrer les logs d'audit en fonction des filtres
  const filteredAuditLogs = useMemo(() => {
    let filtered = [...auditLogs];

    // Appliquer les filtres
    if (auditLogFilters.search) {
      const search = auditLogFilters.search.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.userName.toLowerCase().includes(search) ||
          log.description.toLowerCase().includes(search) ||
          log.resource.toLowerCase().includes(search) ||
          log.ipAddress.includes(search)
      );
    }

    if (auditLogFilters.eventTypes && auditLogFilters.eventTypes.length > 0) {
      filtered = filtered.filter((log) =>
        auditLogFilters.eventTypes?.includes(log.eventType)
      );
    }

    if (auditLogFilters.resources && auditLogFilters.resources.length > 0) {
      filtered = filtered.filter((log) =>
        auditLogFilters.resources?.includes(log.resource)
      );
    }

    if (auditLogFilters.status) {
      filtered = filtered.filter(
        (log) => log.status === auditLogFilters.status
      );
    }

    if (auditLogFilters.dateRange) {
      if (auditLogFilters.dateRange.start) {
        const startDate = new Date(auditLogFilters.dateRange.start);
        filtered = filtered.filter(
          (log) => new Date(log.timestamp) >= startDate
        );
      }

      if (auditLogFilters.dateRange.end) {
        const endDate = new Date(auditLogFilters.dateRange.end);
        filtered = filtered.filter((log) => new Date(log.timestamp) <= endDate);
      }
    }

    // Trier les logs
    if (auditLogFilters.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[auditLogFilters.sortBy as keyof typeof a];
        const bValue = b[auditLogFilters.sortBy as keyof typeof b];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return auditLogFilters.sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });
    }

    return filtered;
  }, [auditLogs, auditLogFilters]);

  // Filtrer les sessions de connexion en fonction des filtres
  const filteredLoginSessions = useMemo(() => {
    let filtered = [...loginSessions];

    // Appliquer les filtres
    if (loginSessionFilters.search) {
      const search = loginSessionFilters.search.toLowerCase();
      filtered = filtered.filter(
        (session) =>
          session.userName.toLowerCase().includes(search) ||
          session.ipAddress.includes(search) ||
          (session.location && session.location.toLowerCase().includes(search))
      );
    }

    if (loginSessionFilters.status) {
      filtered = filtered.filter(
        (session) => session.status === loginSessionFilters.status
      );
    }

    if (loginSessionFilters.dateRange) {
      if (loginSessionFilters.dateRange.start) {
        const startDate = new Date(loginSessionFilters.dateRange.start);
        filtered = filtered.filter(
          (session) => new Date(session.startedAt) >= startDate
        );
      }

      if (loginSessionFilters.dateRange.end) {
        const endDate = new Date(loginSessionFilters.dateRange.end);
        filtered = filtered.filter(
          (session) => new Date(session.startedAt) <= endDate
        );
      }
    }

    // Trier les sessions
    if (loginSessionFilters.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[loginSessionFilters.sortBy as keyof typeof a];
        const bValue = b[loginSessionFilters.sortBy as keyof typeof b];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return loginSessionFilters.sortDirection === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });
    }

    return filtered;
  }, [loginSessions, loginSessionFilters]);

  // Paginer les logs d'audit
  const paginatedAuditLogs = useMemo(() => {
    const start = (auditLogPage - 1) * auditLogPageSize;
    const end = start + auditLogPageSize;
    return filteredAuditLogs.slice(start, end);
  }, [filteredAuditLogs, auditLogPage, auditLogPageSize]);

  // Paginer les sessions de connexion
  const paginatedLoginSessions = useMemo(() => {
    const start = (loginSessionPage - 1) * loginSessionPageSize;
    const end = start + loginSessionPageSize;
    return filteredLoginSessions.slice(start, end);
  }, [filteredLoginSessions, loginSessionPage, loginSessionPageSize]);

  // Gérer la création d'un nouveau rôle
  const handleCreateRole = (
    role: Omit<RoleDefinition, "id" | "createdAt" | "updatedAt">
  ) => {
    console.log("Création d'un nouveau rôle :", role);
    // Dans une application réelle, on appellerait une API pour créer le rôle
  };

  // Gérer la mise à jour d'un rôle
  const handleUpdateRole = (
    roleId: string,
    updates: Partial<RoleDefinition>
  ) => {
    console.log("Mise à jour du rôle :", roleId, updates);
    // Dans une application réelle, on appellerait une API pour mettre à jour le rôle
  };

  // Gérer la suppression d'un rôle
  const handleDeleteRole = (roleId: string) => {
    console.log("Suppression du rôle :", roleId);
    // Dans une application réelle, on appellerait une API pour supprimer le rôle
  };

  // Gérer le clic sur un log d'audit
  const handleAuditLogClick = (log: AuditLog) => {
    console.log("Détails du log d'audit :", log);
    // Dans une application réelle, on afficherait une boîte de dialogue avec les détails du log
  };

  // Gérer l'exportation des logs d'audit
  const handleExportAuditLogs = () => {
    console.log("Exportation des logs d'audit");
    // Dans une application réelle, on générerait un fichier CSV ou Excel avec les logs
  };

  // Gérer la terminaison d'une session
  const handleTerminateSession = (sessionId: string) => {
    console.log("Terminaison de la session :", sessionId);
    // Dans une application réelle, on appellerait une API pour terminer la session
  };

  // Gérer la terminaison de toutes les sessions
  const handleTerminateAllSessions = () => {
    console.log("Terminaison de toutes les sessions");
    // Dans une application réelle, on appellerait une API pour terminer toutes les sessions
  };

  // Gérer l'activation/désactivation de l'authentification à deux facteurs
  const handleToggle2FA = async (enabled: boolean) => {
    console.log(
      "Activation/désactivation de l'authentification à deux facteurs :",
      enabled
    );
    // Dans une application réelle, on appellerait une API pour activer/désactiver l'authentification à deux facteurs
    return true;
  };

  // Gérer le changement de méthode d'authentification à deux facteurs
  const handleChange2FAMethod = async (method: "app" | "sms" | "email") => {
    console.log(
      "Changement de méthode d'authentification à deux facteurs :",
      method
    );
    // Dans une application réelle, on appellerait une API pour changer la méthode d'authentification
    return true;
  };

  // Gérer la vérification d'un code 2FA
  const handleVerifyCode = async (code: string) => {
    console.log("Vérification du code 2FA :", code);
    // Dans une application réelle, on appellerait une API pour vérifier le code
    return true;
  };

  // Gérer la régénération des codes de secours
  const handleRegenerateBackupCodes = async () => {
    console.log("Régénération des codes de secours");
    // Dans une application réelle, on appellerait une API pour régénérer les codes
    return [
      "ABCD-EFGH-IJKL",
      "MNOP-QRST-UVWX",
      "1234-5678-9012",
      "3456-7890-1234",
      "5678-9012-3456",
      "7890-1234-5678",
      "9012-3456-7890",
      "2345-6789-0123",
    ];
  };

  // Gérer l'attribution d'un rôle à un utilisateur
  const handleAssignRole = async (userId: string, role: Role) => {
    console.log(`Attribution du rôle ${role} à l'utilisateur ${userId}`);
    // Simuler une requête API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  };

  // Gérer l'invitation d'un nouvel utilisateur
  const handleInviteUser = async (email: string, role: Role) => {
    console.log(`Invitation de l'utilisateur ${email} avec le rôle ${role}`);
    // Simuler une requête API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageTitle
        title="Sécurité & Paramètres"
        description="Gérez les rôles, les permissions et les paramètres de sécurité"
        icon={<Shield className="h-6 w-6" />}
      />

      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Rôles</span>
            <span className="sm:hidden">Rôles</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Utilisateurs</span>
            <span className="sm:hidden">Users</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Logs d&apos;audit</span>
            <span className="sm:hidden">Logs</span>
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sessions</span>
            <span className="sm:hidden">Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="2fa" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Authentification</span>
            <span className="sm:hidden">2FA</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="mt-6">
          <RoleManagement
            roles={roles}
            onCreateRole={handleCreateRole}
            onUpdateRole={handleUpdateRole}
            onDeleteRole={handleDeleteRole}
          />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <UserRoleAssignment
            users={adminUsers}
            availableRoles={Object.values(Role)}
            onAssignRole={handleAssignRole}
            onInviteUser={handleInviteUser}
          />
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <AuditLogs
            logs={paginatedAuditLogs}
            filters={auditLogFilters}
            onFiltersChange={setAuditLogFilters}
            totalLogs={filteredAuditLogs.length}
            currentPage={auditLogPage}
            pageSize={auditLogPageSize}
            onPageChange={setAuditLogPage}
            onLogClick={handleAuditLogClick}
            onExportLogs={handleExportAuditLogs}
          />
        </TabsContent>

        <TabsContent value="sessions" className="mt-6">
          <LoginSessions
            sessions={paginatedLoginSessions}
            filters={loginSessionFilters}
            onFiltersChange={setLoginSessionFilters}
            totalSessions={filteredLoginSessions.length}
            currentPage={loginSessionPage}
            pageSize={loginSessionPageSize}
            onPageChange={setLoginSessionPage}
            onTerminateSession={handleTerminateSession}
            onTerminateAllSessions={handleTerminateAllSessions}
            currentSessionId={loginSessions[0]?.id} // Simuler la session courante
          />
        </TabsContent>

        <TabsContent value="2fa" className="mt-6">
          <TwoFactorSettings
            user={currentUser}
            onToggle2FA={handleToggle2FA}
            onChange2FAMethod={handleChange2FAMethod}
            onVerifyCode={handleVerifyCode}
            onRegenerateBackupCodes={handleRegenerateBackupCodes}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
