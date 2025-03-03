"use client";

import React from "react";
import { cn } from "@/lib/utils";
import StatsList, { Stat } from "@/components/_organisms/StatsList";
import DashboardCharts, {
  ReservationChartData,
  RevenueChartData,
  UsersChartData,
} from "@/components/_organisms/DashboardCharts";
import AlertsList, { Alert } from "@/components/_organisms/AlertsList";
import EventsList, { Event } from "@/components/_organisms/EventsList";
import PendingProvidersList, {
  PendingProvider,
} from "@/components/_organisms/PendingProvidersList";

/**
 * Props pour le composant DashboardSummary
 */
export interface DashboardSummaryProps {
  /**
   * Liste des statistiques à afficher
   */
  stats: Stat[];

  /**
   * Données des réservations pour les graphiques
   */
  reservationData: ReservationChartData[];

  /**
   * Données des revenus pour les graphiques
   */
  revenueData: RevenueChartData[];

  /**
   * Données des utilisateurs pour les graphiques
   */
  userData: UsersChartData[];

  /**
   * Liste des alertes à afficher
   */
  alerts: Alert[];

  /**
   * Liste des événements à afficher
   */
  events: Event[];

  /**
   * Liste des prestataires en attente de validation
   */
  pendingProviders: PendingProvider[];

  /**
   * Classes CSS additionnelles
   */
  className?: string;

  /**
   * Fonction appelée lors du clic sur une statistique
   */
  onStatClick?: (statId: string) => void;

  /**
   * Fonction appelée lors du clic sur une alerte
   */
  onAlertClick?: (alert: Alert) => void;

  /**
   * Fonction appelée lors du clic sur un événement
   */
  onEventClick?: (event: Event) => void;

  /**
   * Fonction appelée pour approuver un prestataire
   */
  onProviderApprove?: (providerId: string) => void;

  /**
   * Fonction appelée pour rejeter un prestataire
   */
  onProviderReject?: (providerId: string) => void;

  /**
   * Fonction appelée pour voir les détails d'un prestataire
   */
  onProviderDetails?: (providerId: string) => void;
}

/**
 * Composant DashboardSummary - Affiche un résumé du tableau de bord
 */
const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  stats,
  reservationData,
  revenueData,
  userData,
  alerts,
  events,
  pendingProviders,
  className,
  onStatClick,
  onAlertClick,
  onEventClick,
  onProviderApprove,
  onProviderReject,
  onProviderDetails,
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Statistiques */}
      <StatsList stats={stats} onStatClick={onStatClick} />

      {/* Graphiques */}
      <DashboardCharts
        reservationsData={reservationData}
        revenueData={revenueData}
        usersData={userData}
      />

      {/* Alertes, événements et prestataires en attente */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AlertsList
          alerts={alerts}
          onAlertClick={onAlertClick}
          className="lg:col-span-1"
        />
        <EventsList
          events={events}
          onEventClick={onEventClick}
          className="lg:col-span-1"
        />
        <PendingProvidersList
          providers={pendingProviders}
          onApprove={onProviderApprove}
          onReject={onProviderReject}
          onViewDetails={onProviderDetails}
          className="md:col-span-2 lg:col-span-1"
        />
      </div>
    </div>
  );
};

export default DashboardSummary;
