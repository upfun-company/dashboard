"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";

// Composants UI
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Composants personnalisés
import { ReservationsList } from "@/components/_organisms/ReservationsList";
import { ReservationFilters } from "@/components/_molecules/ReservationFilters";
import { ReservationTabs } from "@/components/_molecules/ReservationTabs";
import { ReservationPagination } from "@/components/_molecules/ReservationPagination";

// Types et mocks
import {
  generateMockReservationsNew as generateMockReservations,
  ReservationNew as Reservation,
} from "@/mocks/reservationsMocks";

// Types pour les filtres et la pagination
type ReservationTabValue =
  | "all"
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";
type ReservationFilterStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "refunded"
  | "all";
type ReservationFilterPaymentStatus =
  | "pending"
  | "paid"
  | "refunded"
  | "failed"
  | "all";

interface ReservationFiltersState {
  search: string;
  status: ReservationFilterStatus;
  paymentStatus: ReservationFilterPaymentStatus;
  dateFrom: Date | null;
  dateTo: Date | null;
  providerId: string;
  customerId: string;
  sortBy: "date" | "amount" | "status";
  sortDirection: "asc" | "desc";
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

/**
 * Page de gestion des réservations
 */
export default function ReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<
    Reservation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<ReservationTabValue>("all");

  // Référence pour suivre si le composant est monté
  const isMounted = useRef(true);
  // Référence pour suivre si le chargement initial a été effectué
  const initialLoadDone = useRef(false);
  // Identifiant unique pour cette instance du composant
  const instanceId = useRef(`reservations-${Date.now()}`);

  // État pour les filtres
  const [filters, setFilters] = useState<ReservationFiltersState>({
    search: "",
    status: "all",
    paymentStatus: "all",
    dateFrom: null,
    dateTo: null,
    providerId: "",
    customerId: "",
    sortBy: "date",
    sortDirection: "desc",
  });

  // État pour la pagination
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
  });

  // Fonction pour charger les réservations
  const fetchReservations = useCallback(() => {
    // Éviter de recharger si déjà en cours de chargement ou si le composant est démonté
    if (!isMounted.current) return;

    console.log(`[${instanceId.current}] Chargement des réservations...`);
    setLoading(true);

    // Utiliser setTimeout au lieu de Promise pour simplifier
    setTimeout(() => {
      // Vérifier si le composant est toujours monté
      if (!isMounted.current) {
        console.log(
          `[${instanceId.current}] Composant démonté, annulation du chargement`
        );
        return;
      }

      try {
        // Utiliser les mocks pour générer des données de test
        const mockReservations = generateMockReservations(50);

        // S'assurer que les dates sont des chaînes ISO pour éviter les problèmes d'hydratation
        const formattedReservations = mockReservations.map((reservation) => ({
          ...reservation,
          date:
            typeof reservation.date === "string"
              ? reservation.date
              : (reservation.date as Date).toISOString(),
        }));

        console.log(
          `[${instanceId.current}] ${formattedReservations.length} réservations chargées`
        );

        if (isMounted.current) {
          setReservations(formattedReservations);
          setFilteredReservations(formattedReservations);
          setPagination((prev) => ({
            ...prev,
            total: formattedReservations.length,
          }));
          setLoading(false);
          initialLoadDone.current = true;
        }
      } catch (error) {
        console.error(
          `[${instanceId.current}] Erreur lors du chargement des réservations:`,
          error
        );
        if (isMounted.current) {
          setLoading(false);
        }
      }
    }, 100);
  }, []);

  // Effet pour nettoyer lors du démontage du composant
  useEffect(() => {
    console.log(`[${instanceId.current}] Composant monté`);

    // Réinitialiser l'état au montage
    initialLoadDone.current = false;
    isMounted.current = true;

    // Charger les données
    fetchReservations();

    return () => {
      isMounted.current = false;
    };
  }, [fetchReservations]);

  // Filtrer les réservations lorsque les filtres changent
  useEffect(() => {
    // Ne pas filtrer si les réservations ne sont pas encore chargées
    if (
      reservations.length === 0 ||
      !initialLoadDone.current ||
      !isMounted.current
    )
      return;

    console.log(`[${instanceId.current}] Application des filtres`);

    const applyFilters = () => {
      let result = [...reservations];

      // Filtre par recherche (nom du client, prestataire, ou ID de réservation)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(
          (reservation) =>
            reservation.id.toLowerCase().includes(searchLower) ||
            (reservation.user
              ? `${reservation.user.firstName} ${reservation.user.lastName}`
              : ""
            )
              .toLowerCase()
              .includes(searchLower) ||
            (reservation.provider ? reservation.provider.name : "")
              .toLowerCase()
              .includes(searchLower) ||
            (reservation.service?.name || "")
              .toLowerCase()
              .includes(searchLower)
        );
      }

      // Filtre par statut
      if (filters.status !== "all") {
        result = result.filter(
          (reservation) => reservation.status === filters.status
        );
      }

      // Filtre par statut de paiement
      if (filters.paymentStatus !== "all") {
        result = result.filter(
          (reservation) => reservation.paymentStatus === filters.paymentStatus
        );
      }

      // Filtre par date
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom).getTime();
        result = result.filter(
          (reservation) => new Date(reservation.date).getTime() >= fromDate
        );
      }

      if (filters.dateTo) {
        const endDate = new Date(filters.dateTo);
        endDate.setHours(23, 59, 59, 999);
        const toDate = endDate.getTime();
        result = result.filter(
          (reservation) => new Date(reservation.date).getTime() <= toDate
        );
      }

      // Filtre par prestataire
      if (filters.providerId) {
        result = result.filter(
          (reservation) => reservation.providerId === filters.providerId
        );
      }

      // Filtre par client
      if (filters.customerId) {
        result = result.filter(
          (reservation) => reservation.userId === filters.customerId
        );
      }

      // Tri
      result.sort((a, b) => {
        if (filters.sortBy === "date") {
          return filters.sortDirection === "asc"
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        } else if (filters.sortBy === "amount") {
          return filters.sortDirection === "asc"
            ? a.amount - b.amount
            : b.amount - a.amount;
        } else {
          // Tri par statut
          return filters.sortDirection === "asc"
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status);
        }
      });

      if (isMounted.current) {
        setFilteredReservations(result);
        setPagination((prev) => ({
          ...prev,
          total: result.length,
        }));
      }
    };

    applyFilters();
  }, [filters, reservations]);

  // Filtrer par onglet
  useEffect(() => {
    if (!initialLoadDone.current || !isMounted.current) return;

    console.log(`[${instanceId.current}] Changement d'onglet: ${currentTab}`);

    setFilters((prev) => ({
      ...prev,
      status: currentTab === "all" ? "all" : currentTab,
    }));
  }, [currentTab]);

  // Effet pour mettre à jour la pagination lorsque la page ou la limite change
  useEffect(() => {
    if (
      !initialLoadDone.current ||
      filteredReservations.length === 0 ||
      !isMounted.current
    )
      return;

    console.log(
      `[${instanceId.current}] Changement de pagination: page=${pagination.page}, limit=${pagination.limit}`
    );

    // Recalculer les réservations paginées sans recharger toutes les données
    setPagination((prev) => ({
      ...prev,
      page: pagination.page,
      limit: pagination.limit,
    }));
  }, [pagination.page, pagination.limit, filteredReservations.length]);

  // Gestionnaire pour le changement des filtres
  const handleFiltersChange = (newFilters: ReservationFiltersState) => {
    if (!isMounted.current) return;

    console.log(`[${instanceId.current}] Changement des filtres`);

    setFilters(newFilters);
    // Réinitialiser la pagination lors du changement de filtres
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  // Gestionnaire pour la réinitialisation des filtres
  const handleResetFilters = () => {
    if (!isMounted.current) return;

    console.log(`[${instanceId.current}] Réinitialisation des filtres`);

    setFilters({
      search: "",
      status: "all",
      paymentStatus: "all",
      dateFrom: null,
      dateTo: null,
      providerId: "",
      customerId: "",
      sortBy: "date",
      sortDirection: "desc",
    });
    setCurrentTab("all");
    // Réinitialiser la pagination
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  // Gestionnaire pour voir les détails d'une réservation
  const handleViewReservation = (reservationId: string) => {
    router.push(`/reservations/${reservationId}`);
  };

  // Gestionnaire pour le changement de page
  const handlePageChange = (newPage: number) => {
    if (!isMounted.current) return;

    console.log(`[${instanceId.current}] Changement de page: ${newPage}`);

    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  // Pagination
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;
  const paginatedReservations = filteredReservations.slice(
    startIndex,
    endIndex
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Réservations</h1>
        <Button onClick={() => router.push("/reservations/export")}>
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>

      <ReservationTabs value={currentTab} onValueChange={setCurrentTab} />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtres avancés</CardTitle>
          <CardDescription>
            Filtrez les réservations selon différents critères
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReservationFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onResetFilters={handleResetFilters}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des réservations</CardTitle>
          <CardDescription>
            {filteredReservations.length} réservation(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReservationsList
            reservations={paginatedReservations}
            onViewReservation={handleViewReservation}
            loading={loading}
          />

          {!loading && filteredReservations.length > 0 && (
            <ReservationPagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
