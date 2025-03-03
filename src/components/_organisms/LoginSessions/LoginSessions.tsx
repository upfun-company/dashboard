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
import { Pagination } from "@/components/ui/pagination";
import {
  Search,
  Filter,
  MoreVertical,
  Calendar as CalendarIcon,
  LogOut,
  Shield,
  MapPin,
  Smartphone,
  Laptop,
  AlertTriangle,
  X,
} from "lucide-react";
import { LoginSession, LoginSessionFilters } from "@/types/security";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export interface LoginSessionsProps {
  /** Liste des sessions de connexion */
  sessions: LoginSession[];
  /** Filtres actuels */
  filters: LoginSessionFilters;
  /** Callback appelé lorsque les filtres changent */
  onFiltersChange: (filters: LoginSessionFilters) => void;
  /** Nombre total de sessions (pour la pagination) */
  totalSessions: number;
  /** Page actuelle */
  currentPage: number;
  /** Nombre de sessions par page */
  pageSize: number;
  /** Callback appelé lors du changement de page */
  onPageChange: (page: number) => void;
  /** Callback appelé pour terminer une session */
  onTerminateSession?: (sessionId: string) => void;
  /** Callback appelé pour terminer toutes les sessions sauf la session courante */
  onTerminateAllSessions?: () => void;
  /** ID de la session courante (celle de l'utilisateur connecté) */
  currentSessionId?: string;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant d'affichage des sessions de connexion
 */
export const LoginSessions = ({
  sessions,
  filters,
  onFiltersChange,
  totalSessions,
  currentPage,
  pageSize,
  onPageChange,
  onTerminateSession,
  onTerminateAllSessions,
  currentSessionId,
  className,
}: LoginSessionsProps) => {
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
    return Math.ceil(totalSessions / pageSize);
  }, [totalSessions, pageSize]);

  // Nombre de sessions actives
  const activeSessions = useMemo(() => {
    return sessions.filter((session) => session.status === "active").length;
  }, [sessions]);

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
      "startedAt" | "endedAt" | "userName" | "ipAddress",
      "asc" | "desc"
    ];

    onFiltersChange({
      ...filters,
      sortBy,
      sortDirection,
    });
  };

  // Gérer le changement de statut
  const handleStatusChange = (
    status: "active" | "expired" | "terminated" | undefined
  ) => {
    onFiltersChange({
      ...filters,
      status,
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
      sortBy: "startedAt",
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
      filters.search || filters.dateRange || filters.status || filters.userId
    );
  };

  // Formater la durée de la session
  const formatSessionDuration = (session: LoginSession) => {
    if (session.status !== "active" && session.endedAt) {
      const start = new Date(session.startedAt);
      const end = new Date(session.endedAt);
      const durationMs = end.getTime() - start.getTime();

      // Formater la durée en heures, minutes, secondes
      const hours = Math.floor(durationMs / (1000 * 60 * 60));
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        return `${hours}h ${minutes}min`;
      } else {
        return `${minutes}min`;
      }
    } else {
      // Pour les sessions actives, afficher la durée depuis le début
      return formatDistanceToNow(new Date(session.startedAt), {
        addSuffix: false,
        locale: fr,
      });
    }
  };

  // Obtenir l'icône pour la méthode d'authentification
  const getAuthMethodIcon = (method: "password" | "2fa" | "sso") => {
    switch (method) {
      case "2fa":
        return <Smartphone className="h-4 w-4" />;
      case "sso":
        return <Shield className="h-4 w-4" />;
      case "password":
      default:
        return <Laptop className="h-4 w-4" />;
    }
  };

  // Formater le nom de la méthode d'authentification
  const formatAuthMethod = (method: "password" | "2fa" | "sso") => {
    switch (method) {
      case "2fa":
        return "Double authentification";
      case "sso":
        return "SSO";
      case "password":
      default:
        return "Mot de passe";
    }
  };

  // Formater le statut de la session
  const formatSessionStatus = (status: "active" | "expired" | "terminated") => {
    switch (status) {
      case "active":
        return "Active";
      case "expired":
        return "Expirée";
      case "terminated":
        return "Terminée";
      default:
        return status;
    }
  };

  // Obtenir la variante de badge pour le statut
  const getStatusBadgeVariant = (
    status: "active" | "expired" | "terminated"
  ) => {
    switch (status) {
      case "active":
        return "success";
      case "expired":
        return "secondary";
      case "terminated":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Sessions de connexion
        </CardTitle>
        <CardDescription>
          Consultez et gérez les sessions de connexion des utilisateurs
        </CardDescription>
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher par utilisateur ou IP..."
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
                    <Select
                      value={filters.status || ""}
                      onValueChange={(value) =>
                        handleStatusChange(
                          value
                            ? (value as "active" | "expired" | "terminated")
                            : undefined
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tous les statuts</SelectItem>
                        <SelectItem value="active">Actives</SelectItem>
                        <SelectItem value="expired">Expirées</SelectItem>
                        <SelectItem value="terminated">Terminées</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Tri</h4>
                    <Select
                      value={`${filters.sortBy || "startedAt"}-${
                        filters.sortDirection || "desc"
                      }`}
                      onValueChange={handleSortChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un tri" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="startedAt-desc">
                          Date de début (récent → ancien)
                        </SelectItem>
                        <SelectItem value="startedAt-asc">
                          Date de début (ancien → récent)
                        </SelectItem>
                        <SelectItem value="endedAt-desc">
                          Date de fin (récent → ancien)
                        </SelectItem>
                        <SelectItem value="endedAt-asc">
                          Date de fin (ancien → récent)
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

            {onTerminateAllSessions && (
              <Button
                variant="destructive"
                onClick={onTerminateAllSessions}
                disabled={activeSessions <= 1}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Terminer toutes</span>
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
                <TableHead className="w-[180px]">Date de connexion</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead className="hidden md:table-cell">
                  Localisation
                </TableHead>
                <TableHead className="hidden md:table-cell">Appareil</TableHead>
                <TableHead className="hidden md:table-cell">Durée</TableHead>
                <TableHead className="w-[100px]">Statut</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Aucune session de connexion trouvée
                  </TableCell>
                </TableRow>
              ) : (
                sessions.map((session) => (
                  <TableRow
                    key={session.id}
                    className={cn(
                      session.id === currentSessionId && "bg-muted/50"
                    )}
                  >
                    <TableCell className="font-medium">
                      {format(new Date(session.startedAt), "dd/MM/yyyy HH:mm", {
                        locale: fr,
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{session.userName}</span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {session.ipAddress}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {session.location ? (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{session.location}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Inconnue</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {getAuthMethodIcon(session.authMethod)}
                        </span>
                        <span>{formatAuthMethod(session.authMethod)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatSessionDuration(session)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(session.status)}
                        className="capitalize"
                      >
                        {formatSessionStatus(session.status)}
                      </Badge>
                      {session.id === currentSessionId && (
                        <Badge variant="outline" className="ml-2">
                          Actuelle
                        </Badge>
                      )}
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
                          {session.status === "active" &&
                            onTerminateSession && (
                              <DropdownMenuItem
                                onClick={() => onTerminateSession(session.id)}
                                disabled={session.id === currentSessionId}
                                className="text-destructive"
                              >
                                <LogOut className="mr-2 h-4 w-4" />
                                Terminer la session
                              </DropdownMenuItem>
                            )}
                          {session.id === currentSessionId && (
                            <DropdownMenuItem disabled>
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              Session actuelle
                            </DropdownMenuItem>
                          )}
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
              {Math.min(currentPage * pageSize, totalSessions)} sur{" "}
              {totalSessions} sessions
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

export default LoginSessions;
