"use client";

import React, { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { default as FinancialStats } from "@/components/_organisms/FinancialStats/FinancialStats";
import TransactionsList from "@/components/_organisms/TransactionsList/TransactionsList";
import {
  generateMockFinancialStats,
  generateMockFinancialTransactions,
} from "@/mocks/financeMocks";
import Link from "next/link";
import { TransactionFilters, FinancialTransaction } from "@/types/finance";

/**
 * Page principale de la section financière
 */
export default function FinancePage() {
  // Générer des données de test une seule fois au chargement du composant
  const stats = React.useMemo(() => generateMockFinancialStats(), []);
  const allTransactions = React.useMemo(
    () => generateMockFinancialTransactions(20),
    []
  );

  // État pour les transactions récentes (5 dernières)
  const [recentTransactions, setRecentTransactions] = useState<
    FinancialTransaction[]
  >(allTransactions.slice(0, 5));

  // État initial des filtres
  const [filters, setFilters] = useState<TransactionFilters>({
    search: "",
    sortBy: "createdAt",
    sortDirection: "desc" as "asc" | "desc",
  });

  // Fonction pour gérer le changement de filtres (mémorisée pour éviter les re-rendus inutiles)
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

      // Appliquer les filtres aux transactions
      let filtered = [...allTransactions];

      // Filtre par recherche
      if (newFilters.search) {
        const searchLower = newFilters.search.toLowerCase();
        filtered = filtered.filter(
          (transaction) =>
            transaction.id.toLowerCase().includes(searchLower) ||
            (transaction.providerName &&
              transaction.providerName.toLowerCase().includes(searchLower)) ||
            (transaction.customerName &&
              transaction.customerName.toLowerCase().includes(searchLower))
        );
      }

      // Tri des résultats
      filtered.sort((a, b) => {
        const sortField = newFilters.sortBy || "createdAt";
        const direction = newFilters.sortDirection === "asc" ? 1 : -1;

        if (sortField === "createdAt") {
          return (
            direction *
            (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          );
        }

        if (sortField === "amount") {
          return direction * (a.amount - b.amount);
        }

        return 0;
      });

      // Prendre les 5 premières transactions filtrées
      setRecentTransactions(filtered.slice(0, 5));
    },
    [filters, allTransactions]
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Finance</h1>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Paiements aux prestataires</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <FinancialStats stats={stats} className="mb-6" />

          <Card>
            <CardHeader>
              <CardTitle>Transactions récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionsList
                transactions={recentTransactions}
                totalCount={recentTransactions.length}
                currentPage={1}
                pageSize={5}
                filters={filters}
                onPageChange={() => {}}
                onFiltersChange={handleFiltersChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <div className="p-8 text-center">
            <p className="text-gray-500">
              Accédez à la page des transactions pour voir la liste complète et
              gérer les transactions.
            </p>
            <Link
              href="/finance/transactions"
              className="text-blue-500 hover:underline mt-2 inline-block"
            >
              Voir toutes les transactions
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="payouts">
          <div className="p-8 text-center">
            <p className="text-gray-500">
              Accédez à la page des paiements aux prestataires pour voir la
              liste complète et gérer les paiements.
            </p>
            <Link
              href="/finance/payouts"
              className="text-blue-500 hover:underline mt-2 inline-block"
            >
              Voir tous les paiements aux prestataires
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="commissions">
          <div className="p-8 text-center">
            <p className="text-gray-500">
              Accédez à la page de gestion des commissions pour configurer les
              commissions.
            </p>
            <Link
              href="/finance/commissions"
              className="text-blue-500 hover:underline mt-2 inline-block"
            >
              Gérer les commissions
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
