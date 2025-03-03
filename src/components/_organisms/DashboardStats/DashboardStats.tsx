/**
 * Composant DashboardStats - Affiche les statistiques principales du tableau de bord
 */

import React from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Percent,
  Wallet,
  Receipt,
} from "lucide-react";
import StatCard from "@/components/_molecules/StatCard";
import { GeneralProps } from "@/types";

/**
 * Props pour le composant DashboardStats
 */
interface DashboardStatsProps {
  /** Statistiques à afficher */
  stats: {
    /** Nombre total de réservations */
    totalReservations: number;
    /** Taux de conversion */
    conversionRate: number;
    /** Chiffre d'affaires total */
    totalRevenue: number;
    /** Taux de réponse moyen */
    averageResponseRate: number;
    /** Volume de transactions en attente */
    pendingTransactionsVolume: number;
    /** Commissions générées */
    totalCommissions: number;
  };
  /** Pourcentages de changement pour chaque statistique */
  changes?: {
    /** Changement pour le nombre total de réservations */
    totalReservations?: number;
    /** Changement pour le taux de conversion */
    conversionRate?: number;
    /** Changement pour le chiffre d'affaires total */
    totalRevenue?: number;
    /** Changement pour le taux de réponse moyen */
    averageResponseRate?: number;
    /** Changement pour le volume de transactions en attente */
    pendingTransactionsVolume?: number;
    /** Changement pour les commissions générées */
    totalCommissions?: number;
  };
  /** Période de comparaison */
  comparisonPeriod?: string;
}

/**
 * Composant DashboardStats - Affiche les statistiques principales du tableau de bord
 */
const DashboardStats = ({
  stats,
  changes = {},
  comparisonPeriod = "Depuis le mois dernier",
  className,
  ...rest
}: DashboardStatsProps & GeneralProps) => {
  // Formater les valeurs monétaires
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Formater les pourcentages
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className={className} {...rest}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Réservations"
          value={stats.totalReservations}
          icon={ShoppingCart}
          change={changes.totalReservations}
          period={comparisonPeriod}
        />
        <StatCard
          title="Chiffre d'affaires"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          change={changes.totalRevenue}
          period={comparisonPeriod}
        />
        <StatCard
          title="Commissions"
          value={formatCurrency(stats.totalCommissions)}
          icon={Wallet}
          change={changes.totalCommissions}
          period={comparisonPeriod}
        />
        <StatCard
          title="Taux de conversion"
          value={formatPercentage(stats.conversionRate)}
          icon={Percent}
          change={changes.conversionRate}
          period={comparisonPeriod}
        />
        <StatCard
          title="Taux de réponse"
          value={formatPercentage(stats.averageResponseRate)}
          icon={Users}
          change={changes.averageResponseRate}
          period={comparisonPeriod}
        />
        <StatCard
          title="Transactions en attente"
          value={formatCurrency(stats.pendingTransactionsVolume)}
          icon={Receipt}
          change={changes.pendingTransactionsVolume}
          period={comparisonPeriod}
        />
      </div>
    </div>
  );
};

export default DashboardStats;
