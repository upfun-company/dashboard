"use client";

/**
 * Composant CustomersList - Affiche la liste des clients avec filtres avancés
 */

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setPage,
  setLimit,
  updateFilters,
  resetFilters as resetReduxFilters,
} from "@/redux/reducers/customersReducer";
import { Customer, PaginationData, FilterOptions } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Import des icônes Lucide
import {
  Search,
  RefreshCw,
  Filter,
  Eye,
  Edit,
  Trash2,
  UserX,
  UserCheck,
} from "lucide-react";

// Import des composants Shadcn/UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

/**
 * Props pour le composant CustomersList
 */
interface CustomersListProps {
  /** Fonction appelée lorsqu'un client est sélectionné */
  onSelectCustomer?: (customer: Customer) => void;
  /** Fonction appelée lorsqu'un client est édité */
  onEditCustomer?: (customer: Customer) => void;
  /** Fonction appelée lorsqu'un client est supprimé */
  onDeleteCustomer?: (customerId: string) => void;
  /** Fonction appelée lorsqu'un client est bloqué/débloqué */
  onToggleCustomerStatus?: (customer: Customer, isActive: boolean) => void;
  /** Fonction pour charger les clients (fournie par le parent) */
  fetchCustomers?: () => void;
  /** Fonction pour rafraîchir manuellement les clients */
  onRefresh?: () => void;
  /** État de chargement */
  isLoading?: boolean;
  /** Liste des clients (optionnelle, sinon utilise le store) */
  customers?: Customer[];
  /** Fonction pour changer de page */
  onChangePage?: (page: number) => void;
  /** Fonction pour changer le nombre d'éléments par page */
  onChangeRowsPerPage?: (limit: number) => void;
  /** Fonction pour changer la recherche */
  onSearchChange?: (search: string) => void;
  /** Fonction pour changer le tri */
  onSortChange?: (sortBy: string, sortDirection: "asc" | "desc") => void;
  /** Fonction pour réinitialiser les filtres */
  onResetFilters?: () => void;
  /** Données de pagination */
  pagination?: PaginationData;
  /** Filtres */
  filters?: FilterOptions;
}

/**
 * Composant CustomersList - Affiche la liste des clients avec filtres avancés
 */
const CustomersList = ({
  onSelectCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onToggleCustomerStatus,
  fetchCustomers,
  onRefresh,
  isLoading: externalLoading,
  customers: externalCustomers,
  onChangePage,
  onChangeRowsPerPage,
  onSearchChange,
  onSortChange,
  onResetFilters,
  pagination: externalPagination,
  filters: externalFilters,
}: CustomersListProps) => {
  const dispatch = useAppDispatch();

  // Récupérer les données depuis Redux
  const {
    customers: storeCustomers,
    pagination: storePagination,
    filters: storeFilters,
    isLoading: storeLoading,
  } = useAppSelector((state) => state.customers);

  // Utiliser les données externes si fournies, sinon utiliser le store
  const customers = externalCustomers || storeCustomers;
  const isLoading =
    externalLoading !== undefined ? externalLoading : storeLoading;
  const pagination = externalPagination || storePagination;
  const filters = externalFilters || storeFilters;

  // État local pour les filtres avancés
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    search: filters.search || "",
    sortBy: filters.sortBy || "createdAt",
    sortDirection: filters.sortDirection || "desc",
    status: "all",
    minSpent: "",
    maxSpent: "",
    minReservations: "",
    maxReservations: "",
    registrationDateFrom: "",
    registrationDateTo: "",
  });

  // Mettre à jour les filtres locaux lorsque les filtres externes changent
  useEffect(() => {
    setLocalFilters((prev) => ({
      ...prev,
      search: filters.search || "",
      sortBy: filters.sortBy || "createdAt",
      sortDirection: filters.sortDirection || "desc",
      status: filters.status || "all",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.sortBy, filters.sortDirection, filters.status]);

  // Charger les données au chargement du composant
  useEffect(() => {
    if (fetchCustomers) {
      fetchCustomers();
    }
  }, [fetchCustomers]); // Ne charger qu'une seule fois au montage

  /**
   * Gérer le changement de page
   */
  const handleChangePage = (newPage: number) => {
    console.log("CustomersList - Changement de page:", newPage);
    if (onChangePage) {
      onChangePage(newPage);
    } else {
      dispatch(setPage(newPage));
    }
  };

  /**
   * Gérer le changement de nombre d'éléments par page
   */
  const handleChangeRowsPerPage = (value: string) => {
    const numValue = parseInt(value, 10);
    console.log(
      "CustomersList - Changement de nombre d'éléments par page:",
      numValue
    );
    if (onChangeRowsPerPage) {
      onChangeRowsPerPage(numValue);
    } else {
      dispatch(setLimit(numValue));
    }
  };

  /**
   * Gérer le changement de recherche
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setLocalFilters({
      ...localFilters,
      search: newValue,
    });
  };

  // Effet pour appliquer la recherche après un délai
  useEffect(() => {
    if (onSearchChange) {
      const timeoutId = setTimeout(() => {
        onSearchChange(localFilters.search);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localFilters.search]);

  /**
   * Appliquer les filtres
   */
  const applyFilters = () => {
    console.log("Appliquant les filtres:", localFilters);

    const updatedFilters = {
      search: localFilters.search,
      sortBy: localFilters.sortBy,
      sortDirection: localFilters.sortDirection as "asc" | "desc",
      status: localFilters.status as "all" | "active" | "inactive",
    };

    if (onSearchChange) {
      onSearchChange(localFilters.search);
    }

    if (onSortChange) {
      onSortChange(
        localFilters.sortBy,
        localFilters.sortDirection as "asc" | "desc"
      );
    }

    // Appliquer tous les filtres en une seule fois
    dispatch(updateFilters(updatedFilters));
  };

  /**
   * Réinitialiser les filtres
   */
  const resetFilters = () => {
    console.log("Réinitialisation des filtres");

    setLocalFilters({
      search: "",
      sortBy: "createdAt",
      sortDirection: "desc",
      status: "all",
      minSpent: "",
      maxSpent: "",
      minReservations: "",
      maxReservations: "",
      registrationDateFrom: "",
      registrationDateTo: "",
    });

    if (onResetFilters) {
      onResetFilters();
    } else {
      dispatch(resetReduxFilters());
    }
  };

  /**
   * Gérer la sélection d'un client
   */
  const handleSelectCustomer = (customer: Customer) => {
    if (onSelectCustomer) {
      onSelectCustomer(customer);
    }
  };

  /**
   * Formater la date
   */
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
    } catch {
      return "Date invalide";
    }
  };

  /**
   * Formater le montant
   */
  const formatAmount = (amount?: number) => {
    if (amount === undefined) return "N/A";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Chargement des clients...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="px-6 py-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <CardTitle>Clients</CardTitle>
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un client..."
                className="pl-8 w-[250px]"
                value={localFilters.search}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    applyFilters();
                  }
                }}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="whitespace-nowrap"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
            <Button
              variant="outline"
              onClick={fetchCustomers ? fetchCustomers : onRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Actualiser
            </Button>
          </div>
        </div>
      </CardHeader>

      {showFilters && (
        <div className="px-6 py-4 bg-muted/30 border-t border-b">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Trier par</label>
              <Select
                value={localFilters.sortBy}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    sortBy: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nom</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="createdAt">
                    Date d&apos;inscription
                  </SelectItem>
                  <SelectItem value="reservationsCount">
                    Réservations
                  </SelectItem>
                  <SelectItem value="totalSpent">Montant dépensé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ordre</label>
              <Select
                value={localFilters.sortDirection}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    sortDirection: value as "asc" | "desc",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ordre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Croissant</SelectItem>
                  <SelectItem value="desc">Décroissant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Statut</label>
              <Select
                value={localFilters.status}
                onValueChange={(value) => {
                  setLocalFilters({
                    ...localFilters,
                    status: value,
                  });

                  // Appliquer immédiatement le filtre de statut
                  dispatch(
                    updateFilters({
                      status: value as "all" | "active" | "inactive",
                    })
                  );
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="inactive">Inactifs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Réservations min</label>
              <Input
                type="number"
                value={localFilters.minReservations}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    minReservations: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Réservations max</label>
              <Input
                type="number"
                value={localFilters.maxReservations}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    maxReservations: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Montant min (€)</label>
              <Input
                type="number"
                value={localFilters.minSpent}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    minSpent: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Montant max (€)</label>
              <Input
                type="number"
                value={localFilters.maxSpent}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    maxSpent: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Inscription depuis</label>
              <Input
                type="date"
                value={localFilters.registrationDateFrom}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    registrationDateFrom: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Inscription jusqu&apos;à
              </label>
              <Input
                type="date"
                value={localFilters.registrationDateTo}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    registrationDateTo: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={resetFilters}>
              Réinitialiser
            </Button>
            <Button onClick={applyFilters}>Appliquer</Button>
          </div>
        </div>
      )}

      <Separator />

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Inscription</TableHead>
                <TableHead className="text-right">Réservations</TableHead>
                <TableHead className="text-right">Montant dépensé</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p>Chargement des clients...</p>
                  </TableCell>
                </TableRow>
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <p className="text-muted-foreground">Aucun client trouvé</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={resetFilters}
                    >
                      Réinitialiser les filtres
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {customer.avatarUrl && (
                          <Image
                            src={customer.avatarUrl}
                            alt={customer.name}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        {customer.name}
                      </div>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone || "Non renseigné"}</TableCell>
                    <TableCell>{formatDate(customer.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      {customer.reservationsCount || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatAmount(customer.totalSpent)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          customer.status === "active"
                            ? "success"
                            : "destructive"
                        }
                        className="capitalize"
                      >
                        {customer.status === "active" ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSelectCustomer(customer)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Voir détails</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {onEditCustomer && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onEditCustomer(customer)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Modifier</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}

                        {onToggleCustomerStatus && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    onToggleCustomerStatus(
                                      customer,
                                      customer.status === "inactive"
                                    )
                                  }
                                >
                                  {customer.status === "active" ? (
                                    <UserX className="h-4 w-4" />
                                  ) : (
                                    <UserCheck className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {customer.status === "active"
                                  ? "Désactiver"
                                  : "Activer"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}

                        {onDeleteCustomer && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                  onClick={() => onDeleteCustomer(customer.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Supprimer</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <div className="flex items-center justify-between px-6 py-4 border-t">
        <div className="text-sm text-muted-foreground">
          Affichage de{" "}
          {pagination.total > 0
            ? (pagination.page - 1) * pagination.limit + 1
            : 0}{" "}
          à {Math.min(pagination.page * pagination.limit, pagination.total)} sur{" "}
          {pagination.total} entrées
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={pagination.limit.toString()}
            onValueChange={handleChangeRowsPerPage}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Lignes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 lignes</SelectItem>
              <SelectItem value="10">10 lignes</SelectItem>
              <SelectItem value="25">25 lignes</SelectItem>
              <SelectItem value="50">50 lignes</SelectItem>
            </SelectContent>
          </Select>

          <Pagination
            currentPage={pagination.page}
            totalPages={Math.max(
              1,
              Math.ceil(pagination.total / pagination.limit)
            )}
            onPageChange={handleChangePage}
          />
        </div>
      </div>
    </Card>
  );
};

export default CustomersList;
