"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinancialStats as FinancialStatsData } from "@/types/finance";

/**
 * Type pour les statistiques financières
 */
export interface FinancialStatsType {
  /** Chiffre d'affaires total */
  totalRevenue: number;
  /** Commissions totales */
  totalCommissions: number;
  /** Paiements en attente */
  pendingPayouts: number;
  /** Paiements complétés */
  completedPayouts: number;
  /** Transactions échouées */
  failedTransactions: number;
  /** Valeur moyenne des transactions */
  averageTransactionValue: number;
  /** Données de chiffre d'affaires par jour */
  revenueByDay: Array<{
    date: string;
    amount: number;
  }>;
  /** Données de commissions par jour */
  commissionsByDay: Array<{
    date: string;
    amount: number;
  }>;
}

/**
 * Props pour le composant FinancialStats
 */
export interface FinancialStatsProps {
  /** Statistiques financières à afficher */
  stats: FinancialStatsData;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant FinancialStats - Affiche les statistiques financières
 */
const FinancialStats: React.FC<FinancialStatsProps> = ({
  stats,
  className,
}) => {
  // Formater les montants en euros
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Formater les pourcentages
  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value}%`;
  };

  // Calculer les variations (fictives pour l'exemple)
  const revenueGrowth = 12.5; // Pourcentage de variation
  const commissionsGrowth = 8.3;
  const transactionCount = 1250;
  const transactionGrowth = 5.2;
  const averageTransactionGrowth = 3.7;

  // Préparer les données pour les graphiques
  const chartData = stats.revenueByDay.map((day, index) => ({
    date: day.date,
    revenue: day.amount,
    commission: stats.commissionsByDay[index]?.amount || 0,
  }));

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chiffre d&apos;affaires
            </CardTitle>
            <div
              className={cn(
                "flex items-center rounded-full px-2 py-1 text-xs font-medium",
                revenueGrowth > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}
            >
              {revenueGrowth > 0 ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3" />
              )}
              {formatPercentage(revenueGrowth)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Période précédente:{" "}
              {formatCurrency(stats.totalRevenue * (1 - revenueGrowth / 100))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commissions</CardTitle>
            <div
              className={cn(
                "flex items-center rounded-full px-2 py-1 text-xs font-medium",
                commissionsGrowth > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}
            >
              {commissionsGrowth > 0 ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3" />
              )}
              {formatPercentage(commissionsGrowth)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalCommissions)}
            </div>
            <p className="text-xs text-muted-foreground">
              Taux moyen:{" "}
              {((stats.totalCommissions / stats.totalRevenue) * 100).toFixed(1)}
              %
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <div
              className={cn(
                "flex items-center rounded-full px-2 py-1 text-xs font-medium",
                transactionGrowth > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}
            >
              {transactionGrowth > 0 ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3" />
              )}
              {formatPercentage(transactionGrowth)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactionCount.toLocaleString("fr-FR")}
            </div>
            <p className="text-xs text-muted-foreground">
              Période précédente:{" "}
              {Math.round(
                transactionCount * (1 - transactionGrowth / 100)
              ).toLocaleString("fr-FR")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valeur moyenne
            </CardTitle>
            <div
              className={cn(
                "flex items-center rounded-full px-2 py-1 text-xs font-medium",
                averageTransactionGrowth > 0
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}
            >
              {averageTransactionGrowth > 0 ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3" />
              )}
              {formatPercentage(averageTransactionGrowth)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.averageTransactionValue)}
            </div>
            <p className="text-xs text-muted-foreground">Par transaction</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Évolution du chiffre d&apos;affaires</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="revenue">
            <TabsList className="mb-4">
              <TabsTrigger value="revenue">Chiffre d&apos;affaires</TabsTrigger>
              <TabsTrigger value="commission">Commissions</TabsTrigger>
              <TabsTrigger value="combined">Combiné</TabsTrigger>
            </TabsList>
            <TabsContent value="revenue">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [
                        formatCurrency(value),
                        "Chiffre d'affaires",
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      name="Chiffre d'affaires"
                      fill="#3b82f6"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="commission">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [
                        formatCurrency(value),
                        "Commissions",
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="commission"
                      name="Commissions"
                      fill="#8b5cf6"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="combined">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        formatCurrency(value),
                        name === "revenue"
                          ? "Chiffre d'affaires"
                          : "Commissions",
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Chiffre d'affaires"
                      stroke="#3b82f6"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="commission"
                      name="Commissions"
                      stroke="#8b5cf6"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialStats;
