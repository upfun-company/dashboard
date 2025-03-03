"use client";

/**
 * Composant ProvidersList - Affiche la liste des prestataires avec filtres avancés
 */

import React, { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setProvidersWithPagination,
  setPagination,
  setFilters,
  setLoading,
  setSelectedProvider,
} from "@/redux/reducers/providersReducer";
import {
  ProviderMock,
  generateMockProviders,
  mockProviders,
} from "@/mocks/providersMocks";
import { useRouter } from "next/navigation";

// Import des icônes Lucide
import {
  Search,
  RefreshCw,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Tag,
} from "lucide-react";

// Import des fonctions utilitaires
import {
  formatDate,
  formatAmount,
  getInitials,
  getStatusBadgeVariant,
  translateStatus,
} from "@/utils/formatters";

// Import des composants UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Props pour le composant ProvidersList
 */
interface ProvidersListProps {
  /** Fonction appelée lorsqu'un prestataire est sélectionné */
  onSelect?: (providerId: string) => void;
  /** Fonction appelée lorsqu'un prestataire est édité */
  onEdit?: (providerId: string) => void;
  /** Fonction appelée lorsqu'un prestataire est supprimé */
  onDelete?: (providerId: string) => void;
  /** Fonction appelée lorsqu'un prestataire est approuvé */
  onApprove?: (providerId: string) => void;
  /** Fonction appelée lorsqu'un prestataire est rejeté */
  onReject?: (providerId: string) => void;
}

/**
 * Composant ProvidersList - Affiche la liste des prestataires avec filtres avancés
 */
export const ProvidersList = ({
  onSelect,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}: ProvidersListProps) => {
  // Récupération des données du store Redux
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { providers, pagination, filters, isLoading, selectedProvider } =
    useAppSelector((state) => state.providers);

  // État local pour les filtres avancés
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    search: filters.search,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    status: filters.status,
  });

  /**
   * Récupère les prestataires depuis l'API (simulé)
   */
  const fetchProviders = useCallback(async () => {
    try {
      dispatch(setLoading(true));

      // Simulation d'un appel API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Génération de données fictives ou utilisation des mocks prédéfinis
      const allProviders =
        mockProviders.length >= 50 ? mockProviders : generateMockProviders(50);

      // Filtrage des prestataires selon les critères de recherche
      let filteredProviders = [...allProviders];

      // Filtre par texte de recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProviders = filteredProviders.filter(
          (provider) =>
            provider.name.toLowerCase().includes(searchLower) ||
            provider.email.toLowerCase().includes(searchLower) ||
            provider.category.toLowerCase().includes(searchLower) ||
            provider.location.toLowerCase().includes(searchLower)
        );
      }

      // Filtre par statut
      if (filters.status !== "all") {
        filteredProviders = filteredProviders.filter(
          (provider) => provider.status === filters.status
        );
      }

      // Tri
      filteredProviders.sort((a, b) => {
        switch (filters.sortBy) {
          case "name":
            return filters.sortOrder === "asc"
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name);
          case "createdAt":
            return filters.sortOrder === "asc"
              ? new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              : new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime();
          case "revenue":
            const aRevenue = a.revenue || 0;
            const bRevenue = b.revenue || 0;
            return filters.sortOrder === "asc"
              ? aRevenue - bRevenue
              : bRevenue - aRevenue;
          default:
            return 0;
        }
      });

      // Pagination
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedProviders = filteredProviders.slice(startIndex, endIndex);

      // Mise à jour du store Redux
      dispatch(
        setProvidersWithPagination({
          data: paginatedProviders,
          pagination: {
            ...pagination,
            total: filteredProviders.length,
          },
        })
      );
    } catch (error) {
      console.error("Erreur lors de la récupération des prestataires:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, filters, pagination]);

  // Chargement initial des données
  useEffect(() => {
    fetchProviders();
  }, [pagination.page, pagination.limit, filters, fetchProviders]);

  /**
   * Gère le changement de page
   */
  const handleChangePage = (newPage: number) => {
    dispatch(setPagination({ page: newPage }));
  };

  /**
   * Gère le changement du nombre d'éléments par page
   */
  const handleChangeRowsPerPage = (value: string) => {
    dispatch(setPagination({ limit: parseInt(value) }));
    dispatch(setPagination({ page: 1 }));
  };

  /**
   * Gère le changement du champ de recherche
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({
      ...localFilters,
      search: event.target.value,
    });
  };

  /**
   * Applique les filtres
   */
  const applyFilters = () => {
    dispatch(setFilters(localFilters));
    setShowFilters(false);
  };

  /**
   * Réinitialise les filtres
   */
  const resetFilters = () => {
    const defaultFilters = {
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc" as "asc" | "desc",
      status: "all" as "all" | "pending" | "approved" | "rejected",
    };
    setLocalFilters(defaultFilters);
    dispatch(setFilters(defaultFilters));
    setShowFilters(false);
  };

  /**
   * Gère la sélection d'un prestataire
   */
  const handleSelectProvider = (
    provider: ProviderMock,
    event?: React.MouseEvent
  ) => {
    // Empêcher la propagation de l'événement si fourni
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    dispatch(setSelectedProvider(provider));
    if (onSelect) {
      onSelect(provider.id);
    }
    // Redirection vers la page de détail du prestataire
    router.push(`/prestataires/${provider.id}`);
  };

  /**
   * Génère les liens de pagination
   */
  const generatePaginationLinks = () => {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    const currentPage = pagination.page;
    const links = [];

    // Première page
    if (currentPage > 2) {
      links.push(
        <Button
          key="first"
          variant="outline"
          size="icon"
          onClick={() => handleChangePage(1)}
        >
          1
        </Button>
      );

      if (currentPage > 3) {
        links.push(
          <span key="ellipsis1" className="mx-1">
            ...
          </span>
        );
      }
    }

    // Pages autour de la page courante
    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(totalPages, currentPage + 1);
      i++
    ) {
      links.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="icon"
          onClick={() => handleChangePage(i)}
        >
          {i}
        </Button>
      );
    }

    // Dernière page
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        links.push(
          <span key="ellipsis2" className="mx-1">
            ...
          </span>
        );
      }

      links.push(
        <Button
          key="last"
          variant="outline"
          size="icon"
          onClick={() => handleChangePage(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return links;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Liste des prestataires</CardTitle>
            <CardDescription>
              {pagination.total} prestataire{pagination.total > 1 ? "s" : ""}{" "}
              trouvé{pagination.total > 1 ? "s" : ""}
            </CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-8 w-full sm:w-[250px]"
                value={localFilters.search}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    applyFilters();
                  }
                }}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => fetchProviders()}
                title="Rafraîchir"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>

              <Popover open={showFilters} onOpenChange={setShowFilters}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={showFilters ? "bg-accent" : ""}
                    title="Filtres avancés"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filtres avancés</h4>
                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="status">Statut</Label>
                      <Select
                        value={localFilters.status}
                        onValueChange={(value) =>
                          setLocalFilters({
                            ...localFilters,
                            status: value as
                              | "all"
                              | "approved"
                              | "pending"
                              | "rejected",
                          })
                        }
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="approved">Approuvés</SelectItem>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="rejected">Rejetés</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sortBy">Trier par</Label>
                      <Select
                        value={localFilters.sortBy}
                        onValueChange={(value) =>
                          setLocalFilters({
                            ...localFilters,
                            sortBy: value,
                          })
                        }
                      >
                        <SelectTrigger id="sortBy">
                          <SelectValue placeholder="Trier par" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Nom</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="category">Catégorie</SelectItem>
                          <SelectItem value="location">Localisation</SelectItem>
                          <SelectItem value="createdAt">
                            Date d&apos;inscription
                          </SelectItem>
                          <SelectItem value="revenue">
                            Chiffre d&apos;affaires
                          </SelectItem>
                          <SelectItem value="rating">Note</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sortOrder">Ordre</Label>
                      <Select
                        value={localFilters.sortOrder}
                        onValueChange={(value) =>
                          setLocalFilters({
                            ...localFilters,
                            sortOrder: value as "asc" | "desc",
                          })
                        }
                      >
                        <SelectTrigger id="sortOrder">
                          <SelectValue placeholder="Ordre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asc">Croissant</SelectItem>
                          <SelectItem value="desc">Décroissant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                      >
                        Réinitialiser
                      </Button>
                      <Button size="sm" onClick={applyFilters}>
                        Appliquer
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prestataire</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Inscription</TableHead>
                <TableHead className="text-right">Réservations</TableHead>
                <TableHead className="text-right">CA</TableHead>
                <TableHead className="text-center">Note</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Affichage des skeletons pendant le chargement
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-[150px]" />
                          <Skeleton className="h-3 w-[100px]" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[50px] ml-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[70px] ml-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[50px] mx-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[80px] mx-auto" />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : providers.length > 0 ? (
                // Affichage des prestataires
                providers.map((provider) => (
                  <TableRow
                    key={provider.id}
                    className={
                      selectedProvider?.id === provider.id
                        ? "bg-muted/50"
                        : "hover:bg-muted/50 cursor-pointer"
                    }
                    onClick={(e) => handleSelectProvider(provider, e)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {getInitials(provider.name)}
                        </div>
                        <div>
                          <div className="font-medium">{provider.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {provider.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 w-fit"
                      >
                        <Tag className="h-3 w-3" />
                        {provider.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 w-fit"
                      >
                        <MapPin className="h-3 w-3" />
                        {provider.location}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(provider.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      {provider.reservationsCount || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatAmount(provider.revenue)}
                    </TableCell>
                    <TableCell className="text-center">
                      {provider.rating ? (
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 hover:bg-amber-50 hover:text-amber-700"
                        >
                          {provider.rating.toFixed(1)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusBadgeVariant(provider.status)}>
                        {translateStatus(provider.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        {onSelect && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onSelect(provider.id);
                                    router.push(`/prestataires/${provider.id}`);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Voir détails</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}

                        {onEdit && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onEdit(provider.id);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Éditer</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}

                        {onDelete && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDelete(provider.id);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Supprimer</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}

                        {provider.status === "pending" && onApprove && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onApprove(provider.id);
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Approuver</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}

                        {provider.status === "pending" && onReject && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onReject(provider.id);
                                  }}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Rejeter</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // Aucun résultat
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6">
                    <AlertCircle className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Aucun prestataire trouvé
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Affichage de{" "}
            <strong>
              {providers.length > 0
                ? (pagination.page - 1) * pagination.limit + 1
                : 0}
            </strong>{" "}
            à{" "}
            <strong>
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </strong>{" "}
            sur <strong>{pagination.total}</strong> prestataires
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={pagination.limit.toString()}
              onValueChange={handleChangeRowsPerPage}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1">{generatePaginationLinks()}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
