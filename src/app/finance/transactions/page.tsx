"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import TransactionsList from "@/components/_organisms/TransactionsList/TransactionsList";
import { generateMockFinancialTransactions } from "@/mocks/financeMocks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FinancialTransaction, TransactionFilters } from "@/types/finance";

/**
 * Page des transactions financières
 */
export default function TransactionsPage() {
  const router = useRouter();

  // Générer des données de test une seule fois au chargement du composant
  const allTransactions = React.useMemo(
    () => generateMockFinancialTransactions(50),
    []
  );

  // État pour les transactions filtrées
  const [filteredTransactions, setFilteredTransactions] =
    useState<FinancialTransaction[]>(allTransactions);

  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // État initial des filtres
  const [filters, setFilters] = useState<TransactionFilters>({
    search: "",
    sortBy: "createdAt",
    sortDirection: "desc" as "asc" | "desc",
    status: undefined,
    type: undefined,
    dateRange: undefined,
    minAmount: undefined,
    maxAmount: undefined,
  });

  // Fonction pour appliquer les filtres
  const applyFilters = useCallback(() => {
    let result = [...allTransactions];

    // Filtre par recherche (sur ID, nom du prestataire, nom du client)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (transaction) =>
          transaction.id.toLowerCase().includes(searchLower) ||
          (transaction.providerName &&
            transaction.providerName.toLowerCase().includes(searchLower)) ||
          (transaction.customerName &&
            transaction.customerName.toLowerCase().includes(searchLower))
      );
    }

    // Filtre par statut
    if (filters.status && filters.status.length > 0) {
      result = result.filter((transaction) =>
        filters.status?.includes(transaction.status)
      );
    }

    // Filtre par type
    if (filters.type && filters.type.length > 0) {
      result = result.filter((transaction) =>
        filters.type?.includes(transaction.type)
      );
    }

    // Filtre par plage de dates
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      if (start) {
        result = result.filter(
          (transaction) => new Date(transaction.createdAt) >= new Date(start)
        );
      }
      if (end) {
        result = result.filter(
          (transaction) => new Date(transaction.createdAt) <= new Date(end)
        );
      }
    }

    // Filtre par montant minimum
    if (filters.minAmount !== undefined) {
      result = result.filter(
        (transaction) => transaction.amount >= filters.minAmount!
      );
    }

    // Filtre par montant maximum
    if (filters.maxAmount !== undefined) {
      result = result.filter(
        (transaction) => transaction.amount <= filters.maxAmount!
      );
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

      if (sortField === "type") {
        return direction * a.type.localeCompare(b.type);
      }

      // Par défaut, trier par date de création
      return (
        direction *
        (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      );
    });

    setFilteredTransactions(result);
  }, [filters, allTransactions]);

  // Appliquer les filtres lorsqu'ils changent
  useEffect(() => {
    applyFilters();
    setCurrentPage(1); // Réinitialiser à la première page après filtrage
  }, [filters, applyFilters]);

  // Fonction pour naviguer vers la page de détail d'une transaction
  const handleTransactionClick = useCallback(
    (transaction: FinancialTransaction) => {
      console.log("Transaction clicked in page:", transaction.id);
      router.push(`/finance/transactions/${transaction.id}`);
    },
    [router]
  );

  // Fonction pour gérer le changement de page
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Fonction pour gérer le changement de filtres
  const handleFiltersChange = useCallback(
    (newFilters: TransactionFilters) => {
      // Vérifier si les filtres ont réellement changé pour éviter les boucles infinies
      if (
        newFilters.search === filters.search &&
        newFilters.sortBy === filters.sortBy &&
        newFilters.sortDirection === filters.sortDirection &&
        JSON.stringify(newFilters.status) === JSON.stringify(filters.status) &&
        JSON.stringify(newFilters.type) === JSON.stringify(filters.type) &&
        JSON.stringify(newFilters.dateRange) ===
          JSON.stringify(filters.dateRange) &&
        newFilters.minAmount === filters.minAmount &&
        newFilters.maxAmount === filters.maxAmount
      ) {
        return; // Ne rien faire si les filtres n'ont pas changé
      }

      setFilters(newFilters);
    },
    [filters]
  );

  // Calcul des transactions à afficher pour la page actuelle
  const paginatedTransactions = React.useMemo(() => {
    return filteredTransactions.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filteredTransactions, currentPage, pageSize]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/finance">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Transactions</h1>
      </div>

      <TransactionsList
        transactions={paginatedTransactions}
        totalCount={filteredTransactions.length}
        currentPage={currentPage}
        pageSize={pageSize}
        filters={filters}
        onPageChange={handlePageChange}
        onFiltersChange={handleFiltersChange}
        onTransactionClick={handleTransactionClick}
        onExportTransactions={() => console.log("Export transactions")}
      />
    </div>
  );
}
