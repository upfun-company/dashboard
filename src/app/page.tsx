/**
 * Page d'accueil du dashboard
 */

"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { hasCookie, setCookie } from "@/utils/cookies";
import { useAppSelector } from "@/redux/hooks";
import { CalendarClock, DollarSign, TrendingUp, Tag, Gift } from "lucide-react";

// Import direct des mocks du dashboard
import {
  stats,
  changes,
  reservationsChartData,
  revenueChartData,
  usersChartData,
  latestReservations,
  newProviders,
  alerts as dashboardAlerts,
} from "@/mocks/dashboardMocks";

import { Alert as AlertUI, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Import des composants que nous avons créés
import DashboardSummary from "@/components/_organisms/DashboardSummary";
import DashboardFilters, {
  FilterPeriod,
  DateRange,
} from "@/components/_organisms/DashboardFilters";

// Imports commentés car utilisés uniquement dans la version 2 (commentée)
// import StatsList from "@/components/_organisms/StatsList";
// import DashboardCharts from "@/components/_organisms/DashboardCharts";
// import ActivitySummary from "@/components/_organisms/ActivitySummary";
// import PendingProvidersList from "@/components/_organisms/PendingProvidersList";

import type { Stat } from "@/components/_organisms/StatsList";
import type { Alert as AlertType } from "@/components/_organisms/AlertsList";
import type { Event as EventType } from "@/components/_organisms/EventsList";
import type { PendingProvider } from "@/components/_organisms/PendingProvidersList";

/**
 * Fonction pour formater les valeurs monétaires de manière cohérente
 * en utilisant un espace comme séparateur de milliers et € comme symbole
 */
const formatCurrency = (value: number): string => {
  // Utiliser un espace comme séparateur de milliers pour éviter les problèmes d'hydratation
  return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €`;
};

/**
 * Fonction pour calculer les dates de début et de fin en fonction de la période sélectionnée
 */
const getDateRangeFromPeriod = (period: FilterPeriod): DateRange => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const from = new Date(today);
  const to = new Date(today);

  switch (period) {
    case "today":
      // Aujourd'hui (déjà défini)
      break;
    case "yesterday":
      from.setDate(from.getDate() - 1);
      to.setDate(to.getDate() - 1);
      break;
    case "last7days":
      from.setDate(from.getDate() - 6); // 7 jours incluant aujourd'hui
      break;
    case "last30days":
      from.setDate(from.getDate() - 29); // 30 jours incluant aujourd'hui
      break;
    case "thisMonth":
      from.setDate(1); // Premier jour du mois en cours
      break;
    case "lastMonth":
      from.setMonth(from.getMonth() - 1, 1); // Premier jour du mois précédent
      to.setDate(0); // Dernier jour du mois précédent
      break;
    case "thisYear":
      from.setMonth(0, 1); // 1er janvier de l'année en cours
      break;
    default:
      // Par défaut, 7 derniers jours
      from.setDate(from.getDate() - 6);
  }

  return { from, to };
};

/**
 * Fonction pour vérifier si une date est dans une plage de dates
 */
const isDateInRange = (date: string, range: DateRange): boolean => {
  const dateObj = new Date(date);
  if (!range.from || !range.to) return true;

  // Ajuster la date de fin pour inclure toute la journée
  const adjustedTo = new Date(range.to);
  adjustedTo.setHours(23, 59, 59, 999);

  return dateObj >= range.from && dateObj <= adjustedTo;
};

/**
 * Page d'accueil du dashboard
 */
export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, token } = useAppSelector(
    (state) => state.auth
  );
  const [authStatus, setAuthStatus] = useState<string>(
    "Vérification de l'authentification..."
  );

  // État pour les filtres
  const [currentPeriod, setCurrentPeriod] = useState<FilterPeriod>("last7days");
  const [currentDateRange, setCurrentDateRange] = useState<DateRange>(
    getDateRangeFromPeriod("last7days")
  );

  // État pour les données filtrées
  const [filteredStats, setFilteredStats] = useState<Stat[]>([]);
  const [filteredReservationData, setFilteredReservationData] = useState(
    reservationsChartData
  );
  const [filteredRevenueData, setFilteredRevenueData] =
    useState(revenueChartData);
  const [filteredUserData, setFilteredUserData] = useState(usersChartData);
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>([]);
  const [filteredPendingProviders, setFilteredPendingProviders] = useState<
    PendingProvider[]
  >([]);

  // Préparation des données pour les statistiques
  const statsData: Stat[] = useMemo(
    () => [
      {
        id: "reservations",
        title: "Réservations totales",
        value: stats.totalReservations.toString(),
        change: changes.totalReservations,
        icon: CalendarClock,
        iconColor: "primary",
      },
      {
        id: "revenue",
        title: "Chiffre d'affaires",
        value: formatCurrency(stats.totalRevenue),
        change: changes.totalRevenue,
        icon: DollarSign,
        iconColor: "success",
      },
      {
        id: "commissions",
        title: "Commissions",
        value: formatCurrency(stats.totalCommissions),
        change: changes.totalCommissions,
        icon: DollarSign,
        iconColor: "warning",
      },
      {
        id: "conversion",
        title: "Taux de conversion",
        value: `${stats.conversionRate}%`,
        change: changes.conversionRate,
        icon: TrendingUp,
        iconColor: "info",
      },
    ],
    []
  );

  // Préparation des données pour les alertes
  const alertsData: AlertType[] = dashboardAlerts.map((alert) => ({
    id: alert.id,
    type: determineAlertType(alert),
    message: alert.message,
    severity: alert.type as "info" | "warning" | "error" | "success",
    date: alert.createdAt,
    link: undefined,
  }));

  // Fonction pour déterminer le type d'alerte en fonction du contenu
  function determineAlertType(
    alert: (typeof dashboardAlerts)[0]
  ): "reservation" | "provider" | "payment" | "system" {
    const title = alert.title.toLowerCase();
    const message = alert.message.toLowerCase();

    if (title.includes("réservation") || message.includes("réservation")) {
      return "reservation";
    } else if (
      title.includes("prestataire") ||
      message.includes("prestataire")
    ) {
      return "provider";
    } else if (title.includes("paiement") || message.includes("paiement")) {
      return "payment";
    } else {
      return "system";
    }
  }

  // Création d'événements à partir des réservations récentes
  const eventsData: EventType[] = useMemo(() => {
    return latestReservations.map((reservation) => ({
      id: reservation.id,
      type: "reservation" as
        | "reservation"
        | "user"
        | "provider"
        | "payment"
        | "message"
        | "review"
        | "system",
      title: `Réservation: ${reservation.serviceName}`,
      description: `${reservation.customerName} a réservé chez ${reservation.providerName}`,
      date: new Date(reservation.date).toISOString(),
    }));
  }, []);

  // Préparation des données pour les prestataires en attente
  const pendingProvidersData: PendingProvider[] = useMemo(() => {
    return newProviders.map((provider) => ({
      id: provider.id,
      name: provider.name,
      email: provider.email,
      category: provider.category,
      registrationDate: provider.registrationDate,
      status: provider.status as "pending" | "approved" | "rejected",
    }));
  }, []);

  // Fonction pour filtrer les données en fonction de la période sélectionnée
  const filterDataByPeriod = useCallback(
    (period: FilterPeriod, customDateRange?: DateRange) => {
      console.log(`Filtrage des données pour la période: ${period}`);

      // Utiliser la plage de dates personnalisée ou calculer à partir de la période
      const dateRange =
        period === "custom" && customDateRange
          ? customDateRange
          : getDateRangeFromPeriod(period);

      console.log("Plage de dates:", dateRange);

      // Mettre à jour les états de filtre
      setCurrentPeriod(period);
      setCurrentDateRange(dateRange);

      // Dans un cas réel, vous feriez un appel API avec ces dates
      // Pour cette démo, nous simulons des données filtrées

      // 1. Filtrer les statistiques
      const filteredStatsData = [...statsData].map((stat) => {
        // Simuler des changements de valeurs en fonction de la période
        const multiplier =
          period === "today"
            ? 0.1
            : period === "yesterday"
            ? 0.15
            : period === "last7days"
            ? 0.5
            : period === "last30days"
            ? 0.8
            : 1;

        if (stat.id === "reservations") {
          const newValue = Math.round(stats.totalReservations * multiplier);
          return { ...stat, value: newValue.toString() };
        } else if (stat.id === "revenue") {
          const newValue = Math.round(stats.totalRevenue * multiplier);
          return { ...stat, value: formatCurrency(newValue) };
        } else if (stat.id === "commissions") {
          const newValue = Math.round(stats.totalCommissions * multiplier);
          return { ...stat, value: formatCurrency(newValue) };
        }
        return stat;
      });
      setFilteredStats(filteredStatsData);

      // 2. Filtrer les données des graphiques
      if (period === "today" || period === "yesterday") {
        // Pour aujourd'hui ou hier, montrer seulement une journée de données
        const singleDayData = [
          {
            name: period === "today" ? "Aujourd'hui" : "Hier",
            value: Math.round(40 * Math.random()),
          },
        ];
        setFilteredReservationData(singleDayData);

        const singleDayRevenueData = [
          {
            name: period === "today" ? "Aujourd'hui" : "Hier",
            revenue: Math.round(5000 * Math.random()),
            commission: Math.round(1000 * Math.random()),
          },
        ];
        setFilteredRevenueData(singleDayRevenueData);

        const singleDayUserData = [
          {
            name: period === "today" ? "Aujourd'hui" : "Hier",
            nouveaux: Math.round(20 * Math.random()),
            actifs: Math.round(50 * Math.random()),
          },
        ];
        setFilteredUserData(singleDayUserData);
      } else {
        // Pour les autres périodes, simuler des données filtrées
        // Dans un cas réel, ces données viendraient de l'API
        setFilteredReservationData(reservationsChartData);
        setFilteredRevenueData(revenueChartData);
        setFilteredUserData(usersChartData);
      }

      // 3. Filtrer les événements par date
      const filteredEventsData = eventsData.filter((event) =>
        isDateInRange(event.date, dateRange)
      );
      setFilteredEvents(filteredEventsData);

      // 4. Filtrer les prestataires en attente par date d'inscription
      const filteredProvidersData = pendingProvidersData.filter((provider) =>
        isDateInRange(provider.registrationDate, dateRange)
      );
      setFilteredPendingProviders(filteredProvidersData);
    },
    [eventsData, pendingProvidersData, statsData]
  );

  // Initialiser les données filtrées au chargement
  useEffect(() => {
    // Appliquer les filtres par défaut (7 derniers jours)
    filterDataByPeriod("last7days");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dépendance vide pour n'exécuter qu'une seule fois au chargement

  // Gestionnaires d'événements
  const handleStatClick = (statId: string) => {
    console.log(`Statistique cliquée: ${statId}`);
  };

  const handleAlertClick = (alert: AlertType) => {
    console.log(`Alerte cliquée: ${alert.id} - ${alert.message}`);
  };

  const handleEventClick = (event: EventType) => {
    console.log(`Événement cliqué: ${event.id} - ${event.title}`);
  };

  const handleProviderApprove = (providerId: string) => {
    console.log(`Prestataire approuvé: ${providerId}`);
  };

  const handleProviderReject = (providerId: string) => {
    console.log(`Prestataire rejeté: ${providerId}`);
  };

  const handleProviderDetails = (providerId: string) => {
    console.log(`Détails du prestataire: ${providerId}`);
  };

  // Gestionnaire pour le changement de filtre
  const handleFilterChange = useCallback(
    (period: FilterPeriod, dateRange?: DateRange) => {
      filterDataByPeriod(period, dateRange);
    },
    [filterDataByPeriod]
  );

  // Fonction pour naviguer vers les pages
  const navigateTo = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    console.log("Page d'accueil - État d'authentification:", isAuthenticated);
    console.log("Page d'accueil - Utilisateur:", user);

    // Vérifier si le cookie auth_token existe
    const cookieExists = hasCookie("auth_token");
    console.log("Page d'accueil - Cookie auth_token présent:", cookieExists);

    // Si le token existe dans Redux mais pas dans les cookies, le définir
    if (isAuthenticated && token && !cookieExists) {
      console.log("Définition du cookie auth_token depuis le state Redux");
      setCookie("auth_token", token);
    }

    setAuthStatus(
      `Authentifié: ${isAuthenticated}, Cookie: ${cookieExists}, Utilisateur: ${
        user?.name || "Non connecté"
      }`
    );

    // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
    if (!isAuthenticated && !cookieExists) {
      console.log("Redirection vers /login depuis la page d'accueil");
      router.push("/login");
    }
  }, [isAuthenticated, user, token, router]);

  return (
    <>
      {!isAuthenticated && (
        <AlertUI variant="destructive" className="mb-4">
          <AlertDescription>{authStatus}</AlertDescription>
        </AlertUI>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenue sur votre tableau de bord administratif
          </p>
        </div>

        <DashboardFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Cartes d'accès rapide aux fonctionnalités */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Gestion des offres</CardTitle>
            <CardDescription>
              Gérez le catalogue d&apos;activités
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <Tag className="h-12 w-12 text-primary" />
          </CardContent>
          <CardFooter>
            <Button
              variant="default"
              className="w-full"
              onClick={() => navigateTo("/offres")}
            >
              Accéder
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Gestion des promotions</CardTitle>
            <CardDescription>Créez et gérez les codes promo</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <Gift className="h-12 w-12 text-primary" />
          </CardContent>
          <CardFooter>
            <Button
              variant="default"
              className="w-full"
              onClick={() => navigateTo("/promotions")}
            >
              Accéder
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Réservations</CardTitle>
            <CardDescription>Suivez les réservations clients</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <CalendarClock className="h-12 w-12 text-primary" />
          </CardContent>
          <CardFooter>
            <Button
              variant="default"
              className="w-full"
              onClick={() => navigateTo("/reservations")}
            >
              Accéder
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Finances</CardTitle>
            <CardDescription>Suivez les revenus et commissions</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <DollarSign className="h-12 w-12 text-primary" />
          </CardContent>
          <CardFooter>
            <Button
              variant="default"
              className="w-full"
              onClick={() => navigateTo("/finance")}
            >
              Accéder
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-2 text-sm text-gray-500">
        {currentPeriod === "custom" &&
        currentDateRange.from &&
        currentDateRange.to ? (
          <p>
            Période sélectionnée: du{" "}
            {currentDateRange.from.toLocaleDateString("fr-FR")} au{" "}
            {currentDateRange.to.toLocaleDateString("fr-FR")}
          </p>
        ) : (
          <p>
            Période sélectionnée:{" "}
            {currentPeriod === "today"
              ? "Aujourd'hui"
              : currentPeriod === "yesterday"
              ? "Hier"
              : currentPeriod === "last7days"
              ? "7 derniers jours"
              : currentPeriod === "last30days"
              ? "30 derniers jours"
              : currentPeriod === "thisMonth"
              ? "Ce mois-ci"
              : currentPeriod === "lastMonth"
              ? "Mois dernier"
              : currentPeriod === "thisYear"
              ? "Cette année"
              : ""}
          </p>
        )}
      </div>

      {/* Version 1: Utilisation du composant DashboardSummary qui regroupe tout */}
      <DashboardSummary
        stats={filteredStats.length > 0 ? filteredStats : statsData}
        reservationData={filteredReservationData}
        revenueData={filteredRevenueData}
        userData={filteredUserData}
        alerts={alertsData}
        events={filteredEvents.length > 0 ? filteredEvents : eventsData}
        pendingProviders={
          filteredPendingProviders.length > 0
            ? filteredPendingProviders
            : pendingProvidersData
        }
        onStatClick={handleStatClick}
        onAlertClick={handleAlertClick}
        onEventClick={handleEventClick}
        onProviderApprove={handleProviderApprove}
        onProviderReject={handleProviderReject}
        onProviderDetails={handleProviderDetails}
      />

      {/* Version 2: Utilisation des composants individuels (commentée pour l'instant) */}
      {/* 
      <div className="space-y-6">
        <StatsList 
          stats={statsData} 
          onStatClick={handleStatClick} 
        />
        
        <div className="grid gap-6 md:grid-cols-2">
          <ActivitySummary
            alerts={alertsData}
            events={eventsData}
            title="Activités récentes"
            onAlertClick={handleAlertClick}
            onEventClick={handleEventClick}
          />
          
          <PendingProvidersList
            providers={pendingProvidersData}
            title="Prestataires en attente"
            onApprove={handleProviderApprove}
            onReject={handleProviderReject}
            onViewDetails={handleProviderDetails}
          />
        </div>
        
        <DashboardCharts
          reservationsData={reservationsChartData}
          revenueData={revenueChartData}
          usersData={usersChartData}
          title="Analyse des performances"
        />
      </div>
      */}
    </>
  );
}
