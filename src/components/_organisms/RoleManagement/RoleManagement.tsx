"use client";

import React, { useState, useMemo } from "react";
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MoreVertical,
  Plus,
  Edit,
  Trash,
  Shield,
  Info,
} from "lucide-react";
import { Action, Resource, RoleDefinition, Role } from "@/types/security";
import { cn } from "@/lib/utils";

export interface RoleManagementProps {
  /** Liste des rôles disponibles */
  roles: RoleDefinition[];
  /** Callback appelé lors de la création d'un nouveau rôle */
  onCreateRole?: (
    role: Omit<RoleDefinition, "id" | "createdAt" | "updatedAt">
  ) => void;
  /** Callback appelé lors de la mise à jour d'un rôle */
  onUpdateRole?: (roleId: string, updates: Partial<RoleDefinition>) => void;
  /** Callback appelé lors de la suppression d'un rôle */
  onDeleteRole?: (roleId: string) => void;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant de gestion des rôles et permissions
 */
export const RoleManagement = ({
  roles,
  onCreateRole,
  onUpdateRole,
  onDeleteRole,
  className,
}: RoleManagementProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [editedPermissions, setEditedPermissions] = useState<
    Record<Resource, Action[]>
  >({} as Record<Resource, Action[]>);

  // Filtrer les rôles en fonction de la recherche
  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return roles;

    const query = searchQuery.toLowerCase();
    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(query) ||
        role.description.toLowerCase().includes(query)
    );
  }, [roles, searchQuery]);

  // Récupérer le rôle sélectionné
  const selectedRole = useMemo(() => {
    return roles.find((role) => role.id === selectedRoleId) || null;
  }, [roles, selectedRoleId]);

  // Initialiser les permissions éditées lorsqu'un rôle est sélectionné
  React.useEffect(() => {
    if (selectedRole) {
      const permissionsMap = {} as Record<Resource, Action[]>;

      // Initialiser toutes les ressources avec un tableau vide
      Object.values(Resource).forEach((resource) => {
        permissionsMap[resource] = [];
      });

      // Remplir avec les permissions existantes
      selectedRole.permissions.forEach((permission) => {
        permissionsMap[permission.resource] = [...permission.actions];
      });

      setEditedPermissions(permissionsMap);
    }
  }, [selectedRole]);

  // Gérer la sélection/désélection d'une action pour une ressource
  const handleActionToggle = (
    resource: Resource,
    action: Action,
    checked: boolean
  ) => {
    setEditedPermissions((prev) => {
      const updatedActions = checked
        ? [...prev[resource], action]
        : prev[resource].filter((a) => a !== action);

      return {
        ...prev,
        [resource]: updatedActions,
      };
    });
  };

  // Gérer la sélection/désélection de toutes les actions pour une ressource
  const handleResourceToggle = (resource: Resource, checked: boolean) => {
    setEditedPermissions((prev) => {
      return {
        ...prev,
        [resource]: checked ? [...Object.values(Action)] : [],
      };
    });
  };

  // Vérifier si toutes les actions sont sélectionnées pour une ressource
  const areAllActionsSelected = (resource: Resource) => {
    return editedPermissions[resource]?.length === Object.values(Action).length;
  };

  // Vérifier si certaines actions sont sélectionnées pour une ressource
  const areSomeActionsSelected = (resource: Resource) => {
    return (
      editedPermissions[resource]?.length > 0 &&
      editedPermissions[resource]?.length < Object.values(Action).length
    );
  };

  // Vérifier si une action spécifique est sélectionnée pour une ressource
  const isActionSelected = (resource: Resource, action: Action) => {
    return editedPermissions[resource]?.includes(action);
  };

  // Sauvegarder les modifications d'un rôle
  const handleSaveRole = () => {
    if (!selectedRole || !onUpdateRole) return;

    // Convertir les permissions du format Map au format attendu par l'API
    const permissions = Object.entries(editedPermissions)
      .filter(([, actions]) => actions.length > 0)
      .map(([resource, actions]) => ({
        resource: resource as Resource,
        actions,
      }));

    onUpdateRole(selectedRole.id, { permissions });
    setIsEditDialogOpen(false);
  };

  // Créer un nouveau rôle
  const handleCreateRole = () => {
    if (!onCreateRole) return;

    // Convertir les permissions du format Map au format attendu par l'API
    const permissions = Object.entries(editedPermissions)
      .filter(([, actions]) => actions.length > 0)
      .map(([resource, actions]) => ({
        resource: resource as Resource,
        actions,
      }));

    onCreateRole({
      name: newRoleName as Role,
      description: newRoleDescription,
      permissions,
      isSystem: false,
    });

    // Réinitialiser le formulaire
    setNewRoleName("");
    setNewRoleDescription("");
    setEditedPermissions({} as Record<Resource, Action[]>);
    setIsCreateDialogOpen(false);
  };

  // Supprimer un rôle
  const handleDeleteRole = () => {
    if (!selectedRole || !onDeleteRole) return;

    onDeleteRole(selectedRole.id);
    setIsDeleteDialogOpen(false);
    setSelectedRoleId(null);
  };

  // Formater le nom d'un rôle pour l'affichage
  const formatRoleName = (name: string) => {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Formater le nom d'une action pour l'affichage
  const formatActionName = (action: Action) => {
    switch (action) {
      case Action.CREATE:
        return "Créer";
      case Action.READ:
        return "Lire";
      case Action.UPDATE:
        return "Modifier";
      case Action.DELETE:
        return "Supprimer";
      case Action.APPROVE:
        return "Approuver";
      case Action.REJECT:
        return "Rejeter";
      case Action.EXPORT:
        return "Exporter";
      case Action.IMPERSONATE:
        return "Usurper";
      default:
        return action;
    }
  };

  // Formater le nom d'une ressource pour l'affichage
  const formatResourceName = (resource: Resource) => {
    const resourceNames: Record<Resource, string> = {
      [Resource.USERS]: "Utilisateurs",
      [Resource.PROVIDERS]: "Prestataires",
      [Resource.RESERVATIONS]: "Réservations",
      [Resource.TRANSACTIONS]: "Transactions",
      [Resource.PAYOUTS]: "Versements",
      [Resource.COMMISSIONS]: "Commissions",
      [Resource.ACTIVITIES]: "Activités",
      [Resource.SUPPORT_TICKETS]: "Tickets support",
      [Resource.REVIEWS]: "Avis",
      [Resource.PROMOTIONS]: "Promotions",
      [Resource.SETTINGS]: "Paramètres",
      [Resource.AUDIT_LOGS]: "Logs d'audit",
    };

    return resourceNames[resource] || resource;
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Gestion des rôles</CardTitle>
        <CardDescription>
          Définissez les rôles et les permissions pour les utilisateurs
          administrateurs
        </CardDescription>
        <div className="flex items-center justify-between mt-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un rôle..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau rôle
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom du rôle</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  Aucun rôle trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    {formatRoleName(role.name)}
                  </TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permission) => (
                        <Badge
                          key={`${permission.resource}-badge`}
                          variant="outline"
                          className="text-xs"
                        >
                          {formatResourceName(permission.resource)}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={role.isSystem ? "secondary" : "default"}
                      className="text-xs"
                    >
                      {role.isSystem ? "Système" : "Personnalisé"}
                    </Badge>
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
                            setSelectedRoleId(role.id);
                            setIsEditDialogOpen(true);
                          }}
                          disabled={role.isSystem}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedRoleId(role.id);
                            setIsDeleteDialogOpen(true);
                          }}
                          disabled={role.isSystem}
                          className="text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedRoleId(role.id);
                            // Ouvrir une boîte de dialogue de détails (à implémenter)
                          }}
                        >
                          <Info className="mr-2 h-4 w-4" />
                          Détails
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

      {/* Boîte de dialogue de modification d'un rôle */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Modifier le rôle :{" "}
              {selectedRole && formatRoleName(selectedRole.name)}
            </DialogTitle>
            <DialogDescription>
              Modifiez les permissions accordées à ce rôle
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 max-h-[60vh] pr-4">
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Permissions</h3>
                <p className="text-sm text-muted-foreground">
                  Sélectionnez les actions autorisées pour chaque ressource
                </p>

                <div className="space-y-6">
                  {Object.values(Resource).map((resource) => (
                    <div key={resource} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`resource-${resource}`}
                          checked={areAllActionsSelected(resource)}
                          onCheckedChange={(checked) =>
                            handleResourceToggle(resource, checked === true)
                          }
                          className={
                            areSomeActionsSelected(resource) ? "opacity-50" : ""
                          }
                        />
                        <Label
                          htmlFor={`resource-${resource}`}
                          className="text-base font-medium"
                        >
                          {formatResourceName(resource)}
                        </Label>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 ml-6 mt-2">
                        {Object.values(Action).map((action) => (
                          <div
                            key={`${resource}-${action}`}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`${resource}-${action}`}
                              checked={isActionSelected(resource, action)}
                              onCheckedChange={(checked) =>
                                handleActionToggle(
                                  resource,
                                  action,
                                  checked === true
                                )
                              }
                            />
                            <Label
                              htmlFor={`${resource}-${action}`}
                              className="text-sm"
                            >
                              {formatActionName(action)}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleSaveRole}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue de création d'un rôle */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Créer un nouveau rôle
            </DialogTitle>
            <DialogDescription>
              Définissez un nouveau rôle avec ses permissions
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role-name">Nom du rôle</Label>
                  <Input
                    id="role-name"
                    placeholder="Ex: Gestionnaire de contenu"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role-description">Description</Label>
                  <Input
                    id="role-description"
                    placeholder="Ex: Gère le contenu des activités et des avis"
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="py-4">
              <ScrollArea className="h-[50vh] pr-4">
                <div className="space-y-6">
                  {Object.values(Resource).map((resource) => (
                    <div key={resource} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`new-resource-${resource}`}
                          checked={areAllActionsSelected(resource)}
                          onCheckedChange={(checked) =>
                            handleResourceToggle(resource, checked === true)
                          }
                          className={
                            areSomeActionsSelected(resource) ? "opacity-50" : ""
                          }
                        />
                        <Label
                          htmlFor={`new-resource-${resource}`}
                          className="text-base font-medium"
                        >
                          {formatResourceName(resource)}
                        </Label>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 ml-6 mt-2">
                        {Object.values(Action).map((action) => (
                          <div
                            key={`new-${resource}-${action}`}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`new-${resource}-${action}`}
                              checked={isActionSelected(resource, action)}
                              onCheckedChange={(checked) =>
                                handleActionToggle(
                                  resource,
                                  action,
                                  checked === true
                                )
                              }
                            />
                            <Label
                              htmlFor={`new-${resource}-${action}`}
                              className="text-sm"
                            >
                              {formatActionName(action)}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleCreateRole}
              disabled={!newRoleName.trim() || !newRoleDescription.trim()}
            >
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue de suppression d'un rôle */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Supprimer le rôle
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce rôle ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>

          {selectedRole && (
            <div className="py-4">
              <p className="font-medium">{formatRoleName(selectedRole.name)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedRole.description}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteRole}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RoleManagement;
