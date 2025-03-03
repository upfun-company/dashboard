"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Search,
  MoreVertical,
  UserCog,
  Shield,
  UserPlus,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminUser, Role } from "@/types/security";

export interface UserRoleAssignmentProps {
  /** Liste des utilisateurs administrateurs */
  users: AdminUser[];
  /** Liste des rôles disponibles */
  availableRoles: Role[];
  /** Callback appelé lors de l'attribution d'un rôle à un utilisateur */
  onAssignRole?: (userId: string, role: Role) => Promise<boolean>;
  /** Callback appelé lors de l'invitation d'un nouvel utilisateur */
  onInviteUser?: (email: string, role: Role) => Promise<boolean>;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant pour attribuer des rôles aux utilisateurs
 */
export const UserRoleAssignment = ({
  users,
  availableRoles,
  onAssignRole,
  onInviteUser,
  className,
}: UserRoleAssignmentProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fonction pour obtenir le nom complet d'un utilisateur
  const getUserFullName = (user: AdminUser): string => {
    return `${user.firstName} ${user.lastName}`;
  };

  // Filtrer les utilisateurs en fonction de la recherche
  const filterUsers = (query: string) => {
    if (!query) return users;
    const lowercaseQuery = query.toLowerCase();
    return users.filter(
      (user) =>
        getUserFullName(user).toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery) ||
        formatRoleName(user.role).toLowerCase().includes(lowercaseQuery)
    );
  };

  // Récupérer l'utilisateur sélectionné
  const selectedUser = React.useMemo(() => {
    return users.find((user) => user.id === selectedUserId) || null;
  }, [users, selectedUserId]);

  // Réinitialiser les messages d'erreur et de succès après 5 secondes
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Gérer l'attribution d'un rôle à un utilisateur
  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole || !onAssignRole) {
      setError("Veuillez sélectionner un utilisateur et un rôle");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await onAssignRole(selectedUser.id, selectedRole);
      if (result) {
        setSuccess(
          `Le rôle ${formatRoleName(
            selectedRole
          )} a été attribué à ${getUserFullName(selectedUser)}`
        );
        setIsEditRoleDialogOpen(false);
        setSelectedUserId(null);
        setSelectedRole(null);
      } else {
        setError("Une erreur est survenue lors de l'attribution du rôle");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'attribution du rôle");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer l'invitation d'un nouvel utilisateur
  const handleInviteUser = async () => {
    if (!newUserEmail || !newUserRole || !onInviteUser) {
      setError("Veuillez saisir une adresse email et sélectionner un rôle");
      return;
    }

    // Validation simple de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUserEmail)) {
      setError("Veuillez saisir une adresse email valide");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await onInviteUser(newUserEmail, newUserRole);
      if (result) {
        setSuccess(
          `Une invitation a été envoyée à ${newUserEmail} avec le rôle ${formatRoleName(
            newUserRole
          )}`
        );
        setIsInviteDialogOpen(false);
        setNewUserEmail("");
        setNewUserRole(null);
      } else {
        setError("Une erreur est survenue lors de l'invitation");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'invitation");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Formater le nom d'un rôle pour l'affichage
  const formatRoleName = (role: Role) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Obtenir la variante du badge en fonction du rôle
  const getRoleBadgeVariant = (role: Role) => {
    switch (role) {
      case Role.SUPER_ADMIN:
        return "destructive";
      case Role.ADMIN:
        return "default";
      case Role.FINANCE:
        return "secondary";
      case Role.SUPPORT:
        return "outline";
      case Role.MARKETING:
        return "secondary";
      case Role.CONTENT_MANAGER:
        return "outline";
      case Role.VIEWER:
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <UserCog className="h-6 w-6" />
          Attribution des rôles
        </CardTitle>
        <CardDescription>
          Gérez les rôles des utilisateurs administrateurs et invitez de
          nouveaux utilisateurs
        </CardDescription>
        <div className="flex items-center justify-between mt-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un utilisateur..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Inviter un utilisateur
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-destructive/15 text-destructive rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-500/15 text-green-500 rounded-md">
            {success}
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Dernière connexion</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterUsers(searchQuery).length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            ) : (
              filterUsers(searchQuery).map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {getUserFullName(user)}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {formatRoleName(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Jamais connecté"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setSelectedRole(user.role);
                            setIsEditRoleDialogOpen(true);
                          }}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Modifier le rôle
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Boîte de dialogue pour modifier le rôle d'un utilisateur */}
      <Dialog
        open={isEditRoleDialogOpen}
        onOpenChange={setIsEditRoleDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <UserCog className="mr-2 h-5 w-5" />
              Modifier le rôle utilisateur
            </DialogTitle>
            <DialogDescription>
              Modifiez le rôle de l&apos;utilisateur pour changer ses
              permissions
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Utilisateur</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedUser?.email}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Sélectionnez un rôle</h3>
                <RadioGroup
                  value={selectedRole || undefined}
                  onValueChange={(value) => setSelectedRole(value as Role)}
                  className="space-y-2"
                >
                  {availableRoles.map((role) => (
                    <div
                      key={role}
                      className="flex items-center space-x-2 rounded-md border p-3"
                    >
                      <RadioGroupItem value={role} id={`role-${role}`} />
                      <Label
                        htmlFor={`role-${role}`}
                        className="flex flex-1 items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <Badge variant={getRoleBadgeVariant(role)}>
                            {formatRoleName(role)}
                          </Badge>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditRoleDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button
              onClick={handleAssignRole}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Chargement...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue pour inviter un nouvel utilisateur */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <UserPlus className="mr-2 h-5 w-5" />
              Inviter un nouvel utilisateur
            </DialogTitle>
            <DialogDescription>
              Envoyez une invitation à un nouvel utilisateur administrateur
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemple@domaine.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Sélectionnez un rôle</h3>
                <RadioGroup
                  value={newUserRole || undefined}
                  onValueChange={(value) => setNewUserRole(value as Role)}
                  className="space-y-2"
                >
                  {availableRoles.map((role) => (
                    <div
                      key={role}
                      className="flex items-center space-x-2 rounded-md border p-3"
                    >
                      <RadioGroupItem value={role} id={`new-role-${role}`} />
                      <Label
                        htmlFor={`new-role-${role}`}
                        className="flex flex-1 items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <Badge variant={getRoleBadgeVariant(role)}>
                            {formatRoleName(role)}
                          </Badge>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsInviteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button
              onClick={handleInviteUser}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Chargement...
                </>
              ) : (
                "Inviter"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserRoleAssignment;
