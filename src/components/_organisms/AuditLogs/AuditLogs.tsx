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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import {
  Search,
  Filter,
  MoreVertical,
  Calendar as CalendarIcon,
  Download,
  Eye,
  CheckCircle,
  User,
  FileText,
  X,
  Plus,
  Edit,
  Trash,
} from "lucide-react";
import {
  AuditEventType,
  AuditLog,
  AuditLogFilters,
  Resource,
} from "@/types/security";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export interface AuditLogsProps {
  /** Liste des logs d'audit */
  logs: AuditLog[];
  /** Filtres actuels */
  filters: AuditLogFilters;
  /** Callback appelé lorsque les filtres changent */
  onFiltersChange: (filters: AuditLogFilters) => void;
  /** Nombre total de logs (pour la pagination) */
  totalLogs: number;
  /** Page actuelle */
  currentPage: number;
  /** Nombre de logs par page */
  pageSize: number;
  /** Callback appelé lors du changement de page */
  onPageChange: (page: number) => void;
  /** Callback appelé lors du clic sur un log */
  onLogClick?: (log: AuditLog) => void;
  /** Callback appelé pour exporter les logs */
  onExportLogs?: () => void;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant d'affichage des logs d'audit
 */
export const AuditLogs = ({
  logs,
  filters,
  onFiltersChange,
  totalLogs,
  currentPage,
  pageSize,
  onPageChange,
  onLogClick,
  onExportLogs,
  className,
}: AuditLogsProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(
    filters.dateRange?.start ? new Date(filters.dateRange.start) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    filters.dateRange?.end ? new Date(filters.dateRange.end) : undefined
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Nombre total de pages
  const totalPages = useMemo(() => {
    return Math.ceil(totalLogs / pageSize);
  }, [totalLogs, pageSize]);

  // Gérer le changement de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value,
    });
  };

  // Gérer le changement de tri
  const handleSortChange = (value: string) => {
    const [sortBy, sortDirection] = value.split("-") as [
      "timestamp" | "eventType" | "userName" | "resource",
      "asc" | "desc"
    ];

    onFiltersChange({
      ...filters,
      sortBy,
      sortDirection,
    });
  };

  // Gérer le changement de statut
  const handleStatusChange = (status: "success" | "failure" | undefined) => {
    onFiltersChange({
      ...filters,
      status,
    });
  };

  // Gérer le changement de type d'événement
  const handleEventTypeToggle = (
    eventType: AuditEventType,
    checked: boolean
  ) => {
    let newEventTypes = filters.eventTypes ? [...filters.eventTypes] : [];

    if (checked) {
      newEventTypes.push(eventType);
    } else {
      newEventTypes = newEventTypes.filter((type) => type !== eventType);
    }

    onFiltersChange({
      ...filters,
      eventTypes: newEventTypes.length > 0 ? newEventTypes : undefined,
    });
  };

  // Gérer le changement de ressource
  const handleResourceToggle = (resource: Resource, checked: boolean) => {
    let newResources = filters.resources ? [...filters.resources] : [];

    if (checked) {
      newResources.push(resource);
    } else {
      newResources = newResources.filter((res) => res !== resource);
    }

    onFiltersChange({
      ...filters,
      resources: newResources.length > 0 ? newResources : undefined,
    });
  };

  // Appliquer la plage de dates
  const applyDateRange = () => {
    onFiltersChange({
      ...filters,
      dateRange:
        startDate || endDate
          ? {
              start: startDate ? startDate.toISOString() : "",
              end: endDate ? endDate.toISOString() : "",
            }
          : undefined,
    });

    setIsCalendarOpen(false);
  };

  // Effacer la plage de dates
  const clearDateRange = () => {
    setStartDate(undefined);
    setEndDate(undefined);

    onFiltersChange({
      ...filters,
      dateRange: undefined,
    });

    setIsCalendarOpen(false);
  };

  // Réinitialiser tous les filtres
  const resetAllFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);

    onFiltersChange({
      search: "",
      sortBy: "timestamp",
      sortDirection: "desc",
    });

    setIsFilterOpen(false);
  };

  // Formater la plage de dates pour l'affichage
  const formatDateRange = () => {
    if (!filters.dateRange) return "Toutes les dates";

    const start = filters.dateRange.start
      ? format(new Date(filters.dateRange.start), "dd/MM/yyyy", { locale: fr })
      : "";
    const end = filters.dateRange.end
      ? format(new Date(filters.dateRange.end), "dd/MM/yyyy", { locale: fr })
      : "";

    return start && end ? `${start} - ${end}` : start || end;
  };

  // Vérifier si des filtres sont actifs
  const hasActiveFilters = () => {
    return (
      filters.search ||
      filters.dateRange ||
      filters.status ||
      (filters.eventTypes && filters.eventTypes.length > 0) ||
      (filters.resources && filters.resources.length > 0)
    );
  };

  // Formater le type d'événement pour l'affichage
  const formatEventType = (eventType: AuditEventType) => {
    const eventTypeNames: Record<AuditEventType, string> = {
      [AuditEventType.LOGIN]: "Connexion",
      [AuditEventType.LOGOUT]: "Déconnexion",
      [AuditEventType.FAILED_LOGIN]: "Échec de connexion",
      [AuditEventType.PASSWORD_CHANGE]: "Changement de mot de passe",
      [AuditEventType.USER_CREATE]: "Création d'utilisateur",
      [AuditEventType.USER_UPDATE]: "Mise à jour d'utilisateur",
      [AuditEventType.USER_DELETE]: "Suppression d'utilisateur",
      [AuditEventType.PROVIDER_CREATE]: "Création de prestataire",
      [AuditEventType.PROVIDER_UPDATE]: "Mise à jour de prestataire",
      [AuditEventType.PROVIDER_DELETE]: "Suppression de prestataire",
      [AuditEventType.PROVIDER_APPROVE]: "Approbation de prestataire",
      [AuditEventType.PROVIDER_REJECT]: "Rejet de prestataire",
      [AuditEventType.RESERVATION_CREATE]: "Création de réservation",
      [AuditEventType.RESERVATION_UPDATE]: "Mise à jour de réservation",
      [AuditEventType.RESERVATION_CANCEL]: "Annulation de réservation",
      [AuditEventType.TRANSACTION_CREATE]: "Création de transaction",
      [AuditEventType.TRANSACTION_UPDATE]: "Mise à jour de transaction",
      [AuditEventType.PAYOUT_CREATE]: "Création de versement",
      [AuditEventType.PAYOUT_UPDATE]: "Mise à jour de versement",
      [AuditEventType.COMMISSION_UPDATE]: "Mise à jour de commission",
      [AuditEventType.SETTINGS_UPDATE]: "Mise à jour des paramètres",
      [AuditEventType.ROLE_CREATE]: "Création de rôle",
      [AuditEventType.ROLE_UPDATE]: "Mise à jour de rôle",
      [AuditEventType.ROLE_DELETE]: "Suppression de rôle",
      [AuditEventType.PERMISSION_UPDATE]: "Mise à jour de permission",
    };

    return eventTypeNames[eventType] || eventType;
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

  // Obtenir l'icône pour un type d'événement
  const getEventTypeIcon = (eventType: AuditEventType) => {
    if (eventType.includes("LOGIN") || eventType.includes("LOGOUT")) {
      return <User className="h-4 w-4" />;
    } else if (eventType.includes("CREATE")) {
      return <Plus className="h-4 w-4" />;
    } else if (eventType.includes("UPDATE")) {
      return <Edit className="h-4 w-4" />;
    } else if (eventType.includes("DELETE")) {
      return <Trash className="h-4 w-4" />;
    } else if (eventType.includes("APPROVE")) {
      return <CheckCircle className="h-4 w-4" />;
    } else if (eventType.includes("REJECT")) {
      return <X className="h-4 w-4" />;
    } else {
      return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Logs d&apos;audit</CardTitle>
        <CardDescription>
          Consultez l&apos;historique des actions effectuées sur la plateforme
        </CardDescription>
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher dans les logs..."
              className="pl-8"
              value={filters.search || ""}
              onChange={handleSearchChange}
            />
          </div>

          <div className="flex gap-2">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal w-[180px]",
                    filters.dateRange && "text-primary"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="truncate">{formatDateRange()}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex flex-col sm:flex-row max-h-[400px] overflow-auto">
                  <div className="p-3">
                    <div className="space-y-2 pb-2">
                      <h4 className="font-medium text-sm">Date de début</h4>
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        locale={fr}
                        className="rounded-md border shadow"
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Date de fin</h4>
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        locale={fr}
                        className="rounded-md border shadow"
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearDateRange}
                      >
                        Effacer
                      </Button>
                      <Button size="sm" onClick={applyDateRange}>
                        Appliquer
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filtres</span>
                  {hasActiveFilters() && (
                    <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-4" align="end">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Statut</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="status-success"
                          checked={filters.status === "success"}
                          onCheckedChange={(checked) =>
                            handleStatusChange(checked ? "success" : undefined)
                          }
                        />
                        <Label htmlFor="status-success">Succès</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="status-failure"
                          checked={filters.status === "failure"}
                          onCheckedChange={(checked) =>
                            handleStatusChange(checked ? "failure" : undefined)
                          }
                        />
                        <Label htmlFor="status-failure">Échec</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">
                      Types d&apos;événements
                    </h4>
                    <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                      {Object.values(AuditEventType)
                        .filter((type) =>
                          [
                            AuditEventType.LOGIN,
                            AuditEventType.LOGOUT,
                            AuditEventType.FAILED_LOGIN,
                            AuditEventType.USER_CREATE,
                            AuditEventType.USER_UPDATE,
                            AuditEventType.USER_DELETE,
                            AuditEventType.PROVIDER_APPROVE,
                            AuditEventType.RESERVATION_CREATE,
                            AuditEventType.TRANSACTION_CREATE,
                            AuditEventType.SETTINGS_UPDATE,
                          ].includes(type)
                        )
                        .map((eventType) => (
                          <div
                            key={eventType}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`event-${eventType}`}
                              checked={filters.eventTypes?.includes(eventType)}
                              onCheckedChange={(checked) =>
                                handleEventTypeToggle(
                                  eventType,
                                  checked === true
                                )
                              }
                            />
                            <Label
                              htmlFor={`event-${eventType}`}
                              className="text-sm truncate"
                            >
                              {formatEventType(eventType)}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Ressources</h4>
                    <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                      {Object.values(Resource).map((resource) => (
                        <div
                          key={resource}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`resource-${resource}`}
                            checked={filters.resources?.includes(resource)}
                            onCheckedChange={(checked) =>
                              handleResourceToggle(resource, checked === true)
                            }
                          />
                          <Label
                            htmlFor={`resource-${resource}`}
                            className="text-sm truncate"
                          >
                            {formatResourceName(resource)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Tri</h4>
                    <Select
                      value={`${filters.sortBy || "timestamp"}-${
                        filters.sortDirection || "desc"
                      }`}
                      onValueChange={handleSortChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un tri" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="timestamp-desc">
                          Date (récent → ancien)
                        </SelectItem>
                        <SelectItem value="timestamp-asc">
                          Date (ancien → récent)
                        </SelectItem>
                        <SelectItem value="eventType-asc">
                          Type d&apos;événement (A → Z)
                        </SelectItem>
                        <SelectItem value="eventType-desc">
                          Type d&apos;événement (Z → A)
                        </SelectItem>
                        <SelectItem value="userName-asc">
                          Utilisateur (A → Z)
                        </SelectItem>
                        <SelectItem value="userName-desc">
                          Utilisateur (Z → A)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetAllFilters}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Réinitialiser les filtres
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {onExportLogs && (
              <Button variant="outline" onClick={onExportLogs}>
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Exporter</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Date et heure</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Événement</TableHead>
                <TableHead className="hidden md:table-cell">
                  Ressource
                </TableHead>
                <TableHead className="hidden md:table-cell">IP</TableHead>
                <TableHead className="w-[100px]">Statut</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Aucun log d&apos;audit trouvé
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow
                    key={log.id}
                    className={cn(
                      "cursor-pointer hover:bg-muted/50",
                      onLogClick && "cursor-pointer"
                    )}
                    onClick={() => onLogClick && onLogClick(log)}
                  >
                    <TableCell className="font-medium">
                      {format(new Date(log.timestamp), "dd/MM/yyyy HH:mm:ss", {
                        locale: fr,
                      })}
                    </TableCell>
                    <TableCell>{log.userName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {getEventTypeIcon(log.eventType)}
                        </span>
                        <span>{formatEventType(log.eventType)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatResourceName(log.resource)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-mono text-xs">
                      {log.ipAddress}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          log.status === "success" ? "success" : "destructive"
                        }
                        className="capitalize"
                      >
                        {log.status === "success" ? "Succès" : "Échec"}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onLogClick) {
                                onLogClick(log);
                              }
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Voir les détails
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Affichage de {(currentPage - 1) * pageSize + 1} à{" "}
              {Math.min(currentPage * pageSize, totalLogs)} sur {totalLogs} logs
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditLogs;
