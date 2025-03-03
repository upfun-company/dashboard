/**
 * Reducer pour la gestion des analytics
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DashboardStats, StatsChanges } from "@/types";

/**
 * Interface pour les données de graphique
 */
interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
  }>;
}

/**
 * Interface pour l'état du reducer analytics
 */
interface AnalyticsState {
  /** Statistiques du dashboard */
  dashboardStats: DashboardStats;
  /** Changements des statistiques (pourcentage) */
  statsChanges: StatsChanges;
  /** Données pour le graphique des réservations */
  reservationsChart: ChartData;
  /** Données pour le graphique des revenus */
  revenueChart: ChartData;
  /** Données pour le graphique des utilisateurs */
  usersChart: ChartData;
  /** Données pour le graphique des activités */
  activitiesChart: ChartData;
  /** Période sélectionnée */
  period: "day" | "week" | "month" | "year";
  /** Date de début pour les filtres */
  startDate: string | null;
  /** Date de fin pour les filtres */
  endDate: string | null;
  /** Indique si les données sont en cours de chargement */
  isLoading: boolean;
  /** Indique si une erreur s'est produite */
  error: string | null;
}

/**
 * État initial du reducer analytics
 */
const initialState: AnalyticsState = {
  dashboardStats: {
    totalReservations: 0,
    conversionRate: 0,
    totalRevenue: 0,
    averageResponseRate: 0,
    pendingTransactions: 0,
    totalCommissions: 0,
  },
  statsChanges: {},
  reservationsChart: {
    labels: [],
    datasets: [],
  },
  revenueChart: {
    labels: [],
    datasets: [],
  },
  usersChart: {
    labels: [],
    datasets: [],
  },
  activitiesChart: {
    labels: [],
    datasets: [],
  },
  period: "month",
  startDate: null,
  endDate: null,
  isLoading: false,
  error: null,
};

/**
 * Slice Redux pour la gestion des analytics
 */
const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    /**
     * Action pour définir les statistiques du dashboard
     */
    setDashboardStats: (state, action: PayloadAction<DashboardStats>) => {
      state.dashboardStats = action.payload;
    },
    /**
     * Action pour définir les changements des statistiques
     */
    setStatsChanges: (state, action: PayloadAction<StatsChanges>) => {
      state.statsChanges = action.payload;
    },
    /**
     * Action pour définir les données du graphique des réservations
     */
    setReservationsChart: (state, action: PayloadAction<ChartData>) => {
      state.reservationsChart = action.payload;
    },
    /**
     * Action pour définir les données du graphique des revenus
     */
    setRevenueChart: (state, action: PayloadAction<ChartData>) => {
      state.revenueChart = action.payload;
    },
    /**
     * Action pour définir les données du graphique des utilisateurs
     */
    setUsersChart: (state, action: PayloadAction<ChartData>) => {
      state.usersChart = action.payload;
    },
    /**
     * Action pour définir les données du graphique des activités
     */
    setActivitiesChart: (state, action: PayloadAction<ChartData>) => {
      state.activitiesChart = action.payload;
    },
    /**
     * Action pour définir la période
     */
    setPeriod: (
      state,
      action: PayloadAction<"day" | "week" | "month" | "year">
    ) => {
      state.period = action.payload;
    },
    /**
     * Action pour définir la date de début
     */
    setStartDate: (state, action: PayloadAction<string | null>) => {
      state.startDate = action.payload;
    },
    /**
     * Action pour définir la date de fin
     */
    setEndDate: (state, action: PayloadAction<string | null>) => {
      state.endDate = action.payload;
    },
    /**
     * Action pour définir l'état de chargement
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    /**
     * Action pour définir une erreur
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Export des actions
export const {
  setDashboardStats,
  setStatsChanges,
  setReservationsChart,
  setRevenueChart,
  setUsersChart,
  setActivitiesChart,
  setPeriod,
  setStartDate,
  setEndDate,
  setLoading,
  setError,
} = analyticsSlice.actions;

// Export du reducer
export default analyticsSlice.reducer;
