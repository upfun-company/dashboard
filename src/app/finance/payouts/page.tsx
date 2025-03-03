"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProviderPayoutsList from "@/components/_organisms/ProviderPayoutsList/ProviderPayoutsList";
import { generateMockProviderPayouts } from "@/mocks/financeMocks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProviderPayout, PayoutFilters } from "@/types/finance";

/**
 * Page des paiements aux prestataires
 */
export default function PayoutsPage() {
  const router = useRouter();

  // Générer des données de test une seule fois au chargement du composant
  const allPayouts = React.useMemo(() => generateMockProviderPayouts(30), []);

  // État pour les paiements filtrés
  const [filteredPayouts, setFilteredPayouts] =
    useState<ProviderPayout[]>(allPayouts);

  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // État initial des filtres
  const [filters, setFilters] = useState<PayoutFilters>({
    search: "",
    sortBy: "createdAt",
    sortDirection: "desc" as "asc" | "desc",
    status: undefined,
    dateRange: undefined,
    minAmount: undefined,
    maxAmount: undefined,
    method: undefined,
  });

  // Fonction pour appliquer les filtres
  const applyFilters = useCallback(() => {
    let result = [...allPayouts];

    // Filtre par recherche (sur ID, nom du prestataire, référence)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (payout) =>
          payout.id.toLowerCase().includes(searchLower) ||
          payout.providerName.toLowerCase().includes(searchLower) ||
          (payout.reference &&
            payout.reference.toLowerCase().includes(searchLower))
      );
    }

    // Filtre par statut
    if (filters.status && filters.status.length > 0) {
      result = result.filter((payout) =>
        filters.status?.includes(payout.status)
      );
    }

    // Filtre par méthode de paiement
    if (filters.method && filters.method.length > 0) {
      result = result.filter((payout) =>
        filters.method?.includes(payout.method)
      );
    }

    // Filtre par plage de dates
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      if (start) {
        result = result.filter(
          (payout) => new Date(payout.createdAt) >= new Date(start)
        );
      }
      if (end) {
        result = result.filter(
          (payout) => new Date(payout.createdAt) <= new Date(end)
        );
      }
    }

    // Filtre par montant minimum
    if (filters.minAmount !== undefined) {
      result = result.filter((payout) => payout.amount >= filters.minAmount!);
    }

    // Filtre par montant maximum
    if (filters.maxAmount !== undefined) {
      result = result.filter((payout) => payout.amount <= filters.maxAmount!);
    }

    // Tri des résultats
    result.sort((a, b) => {
      const sortField = filters.sortBy || "createdAt";
      const direction = filters.sortDirection === "asc" ? 1 : -1;

      if (sortField === "createdAt") {
        return (
          direction *
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        );
      }

      if (sortField === "amount") {
        return direction * (a.amount - b.amount);
      }

      if (sortField === "id") {
        return direction * a.id.localeCompare(b.id);
      }

      if (sortField === "status") {
        return direction * a.status.localeCompare(b.status);
      }

      if (sortField === "providerName") {
        return direction * a.providerName.localeCompare(b.providerName);
      }

      // Par défaut, trier par date de création
      return (
        direction *
        (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      );
    });

    setFilteredPayouts(result);
  }, [filters, allPayouts]);

  // Appliquer les filtres lorsqu'ils changent
  useEffect(() => {
    applyFilters();
    setCurrentPage(1); // Réinitialiser à la première page après filtrage
  }, [filters, applyFilters]);

  // Fonction pour naviguer vers la page de détail d'un paiement
  const handlePayoutClick = useCallback(
    (payout: ProviderPayout) => {
      router.push(`/finance/payouts/${payout.id}`);
    },
    [router]
  );

  // Fonction pour gérer le changement de page
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Fonction pour gérer le changement de filtres
  const handleFiltersChange = useCallback(
    (newFilters: PayoutFilters) => {
      // Vérifier si les filtres ont réellement changé pour éviter les boucles infinies
      if (
        newFilters.search === filters.search &&
        newFilters.sortBy === filters.sortBy &&
        newFilters.sortDirection === filters.sortDirection &&
        JSON.stringify(newFilters.status) === JSON.stringify(filters.status) &&
        JSON.stringify(newFilters.dateRange) ===
          JSON.stringify(filters.dateRange) &&
        newFilters.minAmount === filters.minAmount &&
        newFilters.maxAmount === filters.maxAmount &&
        JSON.stringify(newFilters.method) === JSON.stringify(filters.method)
      ) {
        return; // Ne rien faire si les filtres n'ont pas changé
      }

      setFilters(newFilters);
    },
    [filters]
  );

  // Fonction pour créer un nouveau paiement
  const handleCreatePayout = useCallback(
    (
      payout: Omit<
        ProviderPayout,
        "id" | "createdAt" | "status" | "transactions"
      >
    ) => {
      console.log("Création d'un nouveau paiement:", payout);
      // Ici, vous appelleriez votre API pour créer un nouveau paiement
      // Puis vous rechargeriez les données
    },
    []
  );

  // Fonction pour traiter un paiement
  const handleProcessPayout = useCallback((payoutId: string) => {
    console.log("Traitement du paiement:", payoutId);
    // Ici, vous appelleriez votre API pour traiter le paiement
    // Puis vous rechargeriez les données
  }, []);

  // Calcul des paiements à afficher pour la page actuelle
  const paginatedPayouts = React.useMemo(() => {
    return filteredPayouts.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filteredPayouts, currentPage, pageSize]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/finance">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Paiements aux prestataires</h1>
      </div>

      <ProviderPayoutsList
        payouts={paginatedPayouts}
        totalCount={filteredPayouts.length}
        currentPage={currentPage}
        pageSize={pageSize}
        filters={filters}
        onPageChange={handlePageChange}
        onFiltersChange={handleFiltersChange}
        onPayoutClick={handlePayoutClick}
        onExportPayouts={() => console.log("Export payouts")}
        onCreatePayout={handleCreatePayout}
        onProcessPayout={handleProcessPayout}
      />
    </div>
  );
}
