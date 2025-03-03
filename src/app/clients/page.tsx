/**
 * Page de gestion des clients - Version simplifiée et optimisée
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import CustomersList from "@/components/_organisms/CustomersList";
import CustomerDetails from "@/components/_organisms/CustomerDetails";
import { Customer } from "@/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setSelectedCustomer,
  setCustomersWithPagination,
  setPage,
  setLimit,
  updateFilters,
  resetFilters,
  updateCustomer,
  deleteCustomer as deleteCustomerAction,
} from "@/redux/reducers/customersReducer";
import { setSuccess } from "@/redux/reducers/successReducer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Données statiques pour garantir le fonctionnement
const STATIC_CUSTOMERS: Customer[] = Array.from({ length: 50 }).map(
  (_, index) => ({
    id: `client-${(index + 1).toString().padStart(3, "0")}`,
    name: [
      "Jean Dupont",
      "Marie Martin",
      "Pierre Durand",
      "Sophie Leroy",
      "Thomas Moreau",
      "Camille Simon",
      "Nicolas Laurent",
      "Julie Bernard",
      "David Petit",
      "Émilie Dubois",
    ][index % 10],
    email: `client${index + 1}@example.com`,
    phone: `+336${Math.floor(Math.random() * 10000000)
      .toString()
      .padStart(8, "0")}`,
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
    ).toISOString(),
    lastActive: new Date(
      Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
    ).toISOString(),
    totalSpent: Math.floor(Math.random() * 2000) + 50,
    reservationsCount: Math.floor(Math.random() * 10) + 1,
    status:
      Math.random() > 0.2 ? "active" : ("inactive" as "active" | "inactive"),
    avatarUrl: `https://i.pravatar.cc/150?u=${index + 1}`,
  })
);

// Réservations statiques
const STATIC_RESERVATIONS = [
  {
    id: "res-001",
    date: "2023-02-15T10:00:00Z",
    createdAt: "2023-02-10T14:30:00Z",
    activityName: "Cours de cuisine",
    totalPrice: 75,
    status: "completed",
    participants: 2,
    amount: 75,
    paymentStatus: "paid",
  },
  {
    id: "res-002",
    date: "2023-03-05T14:00:00Z",
    createdAt: "2023-02-20T09:15:00Z",
    activityName: "Dégustation de vin",
    totalPrice: 120,
    status: "confirmed",
    participants: 4,
    amount: 120,
    paymentStatus: "paid",
  },
  {
    id: "res-003",
    date: "2023-03-20T16:30:00Z",
    createdAt: "2023-03-01T11:45:00Z",
    activityName: "Atelier peinture",
    totalPrice: 90,
    status: "pending",
    participants: 1,
    amount: 90,
    paymentStatus: "pending",
  },
];

/**
 * Page de gestion des clients
 */
export default function CustomersPage() {
  const dispatch = useAppDispatch();
  const { selectedCustomer, pagination, filters } = useAppSelector(
    (state) => state.customers
  );
  const [tabValue, setTabValue] = useState("list");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  // Initialisation des données au montage du composant
  useEffect(() => {
    // Initialiser avec les données statiques
    setCustomers(STATIC_CUSTOMERS);

    // Mettre à jour le store Redux
    dispatch(
      setCustomersWithPagination({
        data: STATIC_CUSTOMERS.slice(0, pagination.limit),
        pagination: {
          ...pagination,
          total: STATIC_CUSTOMERS.length,
        },
      })
    );

    // Appliquer les filtres initiaux
    applyFilters(STATIC_CUSTOMERS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Appliquer les filtres lorsqu'ils changent
  useEffect(() => {
    applyFilters(customers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page, pagination.limit, customers]);

  /**
   * Fonction pour appliquer les filtres et la pagination
   */
  const applyFilters = useCallback(
    (customersData: Customer[]) => {
      console.log(
        "Début applyFilters - Page:",
        pagination.page,
        "Limit:",
        pagination.limit
      );
      setIsLoading(true);

      // Exécuter le filtrage immédiatement sans setTimeout pour éviter les violations
      try {
        // Filtrer les clients selon les filtres
        let filtered = [...customersData];

        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(
            (customer) =>
              customer.name.toLowerCase().includes(searchLower) ||
              customer.email.toLowerCase().includes(searchLower) ||
              (customer.phone && customer.phone.includes(searchLower))
          );
        }

        // Filtrer par statut si spécifié dans les filtres
        if (filters.status && filters.status !== "all") {
          filtered = filtered.filter(
            (customer) => customer.status === filters.status
          );
        }

        // Tri
        filtered.sort((a, b) => {
          const direction = filters.sortDirection === "asc" ? 1 : -1;
          switch (filters.sortBy) {
            case "name":
              return direction * a.name.localeCompare(b.name);
            case "email":
              return direction * a.email.localeCompare(b.email);
            case "createdAt":
              return (
                direction *
                (new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime())
              );
            case "totalSpent":
              const aSpent = a.totalSpent || 0;
              const bSpent = b.totalSpent || 0;
              return direction * (aSpent - bSpent);
            case "reservationsCount":
              const aRes = a.reservationsCount || 0;
              const bRes = b.reservationsCount || 0;
              return direction * (aRes - bRes);
            default:
              // Par défaut, trier par date de création (plus récent d'abord)
              return (
                -1 *
                (new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime())
              );
          }
        });

        // Vérifier que la page est valide
        const totalPages = Math.ceil(filtered.length / pagination.limit) || 1;
        let currentPage = pagination.page;

        // Si la page actuelle est supérieure au nombre total de pages, revenir à la dernière page
        if (currentPage > totalPages) {
          console.log("Page invalide, ajustement à:", totalPages);
          currentPage = totalPages;
          // Mettre à jour la page dans le store sans déclencher un nouveau rendu
          dispatch(setPage(currentPage));
        }

        // Pagination
        const startIndex = (currentPage - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        const paginatedCustomers = filtered.slice(startIndex, endIndex);

        console.log("Pagination calculée:", {
          startIndex,
          endIndex,
          currentPage,
          totalPages,
          totalItems: filtered.length,
          itemsPerPage: pagination.limit,
          itemsDisplayed: paginatedCustomers.length,
        });

        // Mise à jour du store et de l'état local
        dispatch(
          setCustomersWithPagination({
            data: paginatedCustomers,
            pagination: {
              page: currentPage,
              limit: pagination.limit,
              total: filtered.length,
            },
          })
        );

        setFilteredCustomers(paginatedCustomers);

        // Log pour le débogage
        console.log("Filtres appliqués:", {
          search: filters.search,
          sortBy: filters.sortBy,
          sortDirection: filters.sortDirection,
          status: filters.status,
          page: currentPage,
          limit: pagination.limit,
          totalFiltered: filtered.length,
          displayedCount: paginatedCustomers.length,
        });
      } catch (error) {
        console.error("Erreur lors du filtrage des clients:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, filters, pagination]
  );

  /**
   * Fonction pour recharger manuellement les clients
   */
  const handleRefreshCustomers = useCallback(() => {
    setIsLoading(true);

    // Simuler un délai de chargement
    setTimeout(() => {
      try {
        // Générer de nouvelles données aléatoires
        const newCustomers = Array.from({ length: 50 }).map((_, index) => ({
          id: `client-${(index + 1).toString().padStart(3, "0")}`,
          name: [
            "Jean Dupont",
            "Marie Martin",
            "Pierre Durand",
            "Sophie Leroy",
            "Thomas Moreau",
            "Camille Simon",
            "Nicolas Laurent",
            "Julie Bernard",
            "David Petit",
            "Émilie Dubois",
          ][index % 10],
          email: `client${index + 1}@example.com`,
          phone: `+336${Math.floor(Math.random() * 10000000)
            .toString()
            .padStart(8, "0")}`,
          createdAt: new Date(
            Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
          ).toISOString(),
          lastActive: new Date(
            Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
          ).toISOString(),
          totalSpent: Math.floor(Math.random() * 2000) + 50,
          reservationsCount: Math.floor(Math.random() * 10) + 1,
          status:
            Math.random() > 0.2
              ? "active"
              : ("inactive" as "active" | "inactive"),
          avatarUrl: `https://i.pravatar.cc/150?u=${index + 1}`,
        }));

        setCustomers(newCustomers);

        // Afficher un message de succès
        dispatch(
          setSuccess({
            message: "La liste des clients a été actualisée.",
            duration: 3000,
          })
        );
      } catch (error) {
        console.error("Erreur lors du rafraîchissement des clients:", error);
      }
    }, 300);
  }, [dispatch]);

  /**
   * Gérer le changement de page
   */
  const handleChangePage = useCallback(
    (newPage: number) => {
      console.log("Changement de page demandé:", newPage);
      dispatch(setPage(newPage));
    },
    [dispatch]
  );

  /**
   * Gérer le changement de nombre d'éléments par page
   */
  const handleChangeRowsPerPage = useCallback(
    (value: number) => {
      dispatch(setLimit(value));
    },
    [dispatch]
  );

  /**
   * Gérer le changement de recherche
   */
  const handleSearchChange = useCallback(
    (value: string) => {
      dispatch(updateFilters({ search: value }));
    },
    [dispatch]
  );

  /**
   * Gérer le changement de tri
   */
  const handleSortChange = useCallback(
    (sortBy: string, sortDirection: "asc" | "desc") => {
      dispatch(updateFilters({ sortBy, sortDirection }));
    },
    [dispatch]
  );

  /**
   * Réinitialiser les filtres
   */
  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  /**
   * Gérer la sélection d'un client
   */
  const handleSelectCustomer = useCallback(
    (customer: Customer) => {
      dispatch(setSelectedCustomer(customer));
      setTabValue("details"); // Passer à l'onglet détails
    },
    [dispatch]
  );

  /**
   * Gérer le retour à la liste
   */
  const handleBackToList = useCallback(() => {
    dispatch(setSelectedCustomer(null));
    setTabValue("list"); // Revenir à l'onglet liste
  }, [dispatch]);

  /**
   * Gérer l'édition d'un client
   */
  const handleEditCustomer = useCallback(
    (customer: Customer) => {
      // Mettre à jour le client dans la liste
      const updatedCustomers = customers.map((c) =>
        c.id === customer.id ? { ...c, ...customer } : c
      );
      setCustomers(updatedCustomers);

      // Mettre à jour le client dans le store
      dispatch(updateCustomer(customer));

      // Afficher un message de succès
      dispatch(
        setSuccess({
          message: `Le client ${customer.name} a été modifié avec succès.`,
          duration: 5000,
        })
      );
    },
    [customers, dispatch]
  );

  /**
   * Ouvrir la boîte de dialogue de confirmation de suppression
   */
  const handleOpenDeleteDialog = useCallback((customerId: string) => {
    setCustomerToDelete(customerId);
    setDeleteDialogOpen(true);
  }, []);

  /**
   * Gérer la suppression d'un client
   */
  const handleDeleteCustomer = useCallback(() => {
    if (customerToDelete) {
      // Supprimer le client de la liste
      const updatedCustomers = customers.filter(
        (c) => c.id !== customerToDelete
      );
      setCustomers(updatedCustomers);

      // Supprimer le client du store
      dispatch(deleteCustomerAction(customerToDelete));

      // Si le client supprimé est celui actuellement sélectionné, revenir à la liste
      if (selectedCustomer && selectedCustomer.id === customerToDelete) {
        dispatch(setSelectedCustomer(null));
        setTabValue("list");
      }

      dispatch(
        setSuccess({
          message: "Le client a été supprimé avec succès.",
          duration: 5000,
        })
      );
    }

    setDeleteDialogOpen(false);
    setCustomerToDelete(null);
  }, [customerToDelete, customers, dispatch, selectedCustomer]);

  /**
   * Gérer le changement de statut d'un client
   */
  const handleToggleCustomerStatus = useCallback(
    (customer: Customer, isActive: boolean) => {
      // Mettre à jour le statut du client dans la liste
      const updatedCustomer = {
        ...customer,
        status: isActive ? "active" : ("inactive" as "active" | "inactive"),
      };

      const updatedCustomers = customers.map((c) =>
        c.id === customer.id ? updatedCustomer : c
      );
      setCustomers(updatedCustomers);

      // Mettre à jour le client dans le store
      dispatch(updateCustomer(updatedCustomer));

      const statusText = isActive ? "activé" : "désactivé";
      dispatch(
        setSuccess({
          message: `Le client ${customer.name} a été ${statusText} avec succès.`,
          duration: 5000,
        })
      );
    },
    [customers, dispatch]
  );

  /**
   * Gérer l'ajout d'un nouveau client
   */
  const handleAddCustomer = useCallback(() => {
    // Créer un nouveau client
    const newCustomer: Customer = {
      id: `client-${(customers.length + 1).toString().padStart(3, "0")}`,
      name: "Nouveau Client",
      email: `nouveau.client${customers.length + 1}@example.com`,
      phone: "+33600000000",
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      totalSpent: 0,
      reservationsCount: 0,
      status: "active",
      avatarUrl: `https://i.pravatar.cc/150?u=${customers.length + 1}`,
    };

    // Ajouter le client à la liste
    setCustomers([newCustomer, ...customers]);

    // Afficher un message de succès
    dispatch(
      setSuccess({
        message: "Le nouveau client a été ajouté avec succès.",
        duration: 5000,
      })
    );
  }, [customers, dispatch]);

  return (
    <>
      <Card className="shadow-md">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b p-4">
            <h1 className="text-xl font-semibold">Gestion des clients</h1>
            <Button onClick={handleAddCustomer}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un client
            </Button>
          </div>

          <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
              <TabsTrigger value="list">Liste des clients</TabsTrigger>
              <TabsTrigger value="details" disabled={!selectedCustomer}>
                Détails du client
              </TabsTrigger>
            </TabsList>
            <TabsContent value="list" className="p-4">
              <CustomersList
                onSelectCustomer={handleSelectCustomer}
                onEditCustomer={handleEditCustomer}
                onDeleteCustomer={handleOpenDeleteDialog}
                onToggleCustomerStatus={handleToggleCustomerStatus}
                onRefresh={handleRefreshCustomers}
                isLoading={isLoading}
                customers={filteredCustomers}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                onSearchChange={handleSearchChange}
                onSortChange={handleSortChange}
                onResetFilters={handleResetFilters}
                pagination={pagination}
                filters={filters}
              />
            </TabsContent>
            <TabsContent value="details" className="p-4">
              {selectedCustomer && (
                <CustomerDetails
                  customer={selectedCustomer}
                  onBack={handleBackToList}
                  onEdit={handleEditCustomer}
                  onDelete={handleOpenDeleteDialog}
                  onToggleStatus={handleToggleCustomerStatus}
                  mockReservations={STATIC_RESERVATIONS}
                  lastReservation={STATIC_RESERVATIONS[0]}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce client ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
