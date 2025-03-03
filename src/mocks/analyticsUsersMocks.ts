/**
 * Mocks pour l'analyse des utilisateurs
 */

import { KPI } from "@/components/_organisms/AnalyticsKPICards/AnalyticsKPICards";
import { MetricsComparisonData } from "@/components/_organisms/MetricsComparison/MetricsComparison";
import {
  TimeSeriesData,
  PieChartData,
} from "@/components/_organisms/AdvancedAnalyticsChart/AdvancedAnalyticsChart";
import { AnalyticsColumn } from "@/components/_organisms/AnalyticsDataTable/AnalyticsDataTable";

/**
 * Type pour les données du tableau d'utilisateurs
 */
export interface UserTableItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationDate: string;
  lastActivity: string;
  reservationsCount: number;
  totalSpent: number;
  status: string;
  location: string;
}

/**
 * KPIs pour l'analyse des utilisateurs
 */
export const userKPIs: KPI[] = [
  {
    id: "total-users",
    title: "Utilisateurs totaux",
    value: 8750,
    change: 5.2,
    previousValue: 8317,
    unit: "",
    format: "compact",
    icon: "users",
    color: "blue",
    info: "Nombre total d'utilisateurs sur la période sélectionnée",
  },
  {
    id: "active-users",
    title: "Utilisateurs actifs",
    value: 3250,
    change: 8.3,
    previousValue: 3000,
    unit: "",
    format: "compact",
    icon: "users",
    color: "green",
    info: "Nombre d'utilisateurs actifs sur la période",
  },
  {
    id: "avg-spent",
    title: "Dépense moyenne",
    value: 185.5,
    change: 3.2,
    previousValue: 179.7,
    unit: "€",
    format: "currency",
    icon: "money",
    color: "amber",
    info: "Dépense moyenne par utilisateur",
  },
  {
    id: "new-users",
    title: "Nouveaux utilisateurs",
    value: 450,
    change: 12.5,
    previousValue: 400,
    unit: "",
    format: "standard",
    icon: "users",
    color: "purple",
    info: "Nombre de nouveaux utilisateurs sur la période",
  },
  {
    id: "retention-rate",
    title: "Taux de rétention",
    value: 68.5,
    change: 2.5,
    previousValue: 66.0,
    unit: "%",
    format: "percent",
    icon: "percent",
    color: "pink",
    info: "Pourcentage d'utilisateurs qui reviennent",
  },
  {
    id: "conversion-rate",
    title: "Taux de conversion",
    value: 4.2,
    change: 0.5,
    previousValue: 3.7,
    unit: "%",
    format: "percent",
    icon: "percent",
    color: "red",
    info: "Pourcentage de visiteurs qui deviennent des utilisateurs",
  },
];

/**
 * Données de séries temporelles pour l'évolution des utilisateurs
 */
export const usersTimeSeriesData: TimeSeriesData[] = [
  { label: "Jan", "Utilisateurs actifs": 2800, "Nouveaux utilisateurs": 350 },
  { label: "Fév", "Utilisateurs actifs": 2900, "Nouveaux utilisateurs": 380 },
  { label: "Mar", "Utilisateurs actifs": 3050, "Nouveaux utilisateurs": 420 },
  { label: "Avr", "Utilisateurs actifs": 3150, "Nouveaux utilisateurs": 450 },
  { label: "Mai", "Utilisateurs actifs": 3250, "Nouveaux utilisateurs": 480 },
  { label: "Juin", "Utilisateurs actifs": 3400, "Nouveaux utilisateurs": 520 },
  { label: "Juil", "Utilisateurs actifs": 3550, "Nouveaux utilisateurs": 550 },
  { label: "Août", "Utilisateurs actifs": 3650, "Nouveaux utilisateurs": 520 },
  { label: "Sep", "Utilisateurs actifs": 3500, "Nouveaux utilisateurs": 480 },
  { label: "Oct", "Utilisateurs actifs": 3400, "Nouveaux utilisateurs": 450 },
  { label: "Nov", "Utilisateurs actifs": 3300, "Nouveaux utilisateurs": 420 },
  { label: "Déc", "Utilisateurs actifs": 3250, "Nouveaux utilisateurs": 400 },
];

/**
 * Données pour la répartition par âge
 */
export const ageDistributionData: PieChartData[] = [
  { name: "18-24 ans", value: 1250, color: "#3b82f6" },
  { name: "25-34 ans", value: 2800, color: "#10b981" },
  { name: "35-44 ans", value: 2200, color: "#f59e0b" },
  { name: "45-54 ans", value: 1500, color: "#8b5cf6" },
  { name: "55-64 ans", value: 750, color: "#ec4899" },
  { name: "65+ ans", value: 250, color: "#94a3b8" },
];

/**
 * Données pour la répartition par localisation
 */
export const locationDistributionData: PieChartData[] = [
  { name: "Paris", value: 3200, color: "#3b82f6" },
  { name: "Lyon", value: 1200, color: "#10b981" },
  { name: "Marseille", value: 950, color: "#f59e0b" },
  { name: "Bordeaux", value: 750, color: "#8b5cf6" },
  { name: "Lille", value: 650, color: "#ec4899" },
  { name: "Autres", value: 2000, color: "#94a3b8" },
];

/**
 * Données pour les utilisateurs par fréquence de réservation
 */
export const bookingFrequencyData: TimeSeriesData[] = [
  { label: "0", Utilisateurs: 3500 },
  { label: "1", Utilisateurs: 2200 },
  { label: "2-3", Utilisateurs: 1800 },
  { label: "4-5", Utilisateurs: 850 },
  { label: "6-10", Utilisateurs: 320 },
  { label: "11+", Utilisateurs: 80 },
];

/**
 * Données pour les utilisateurs par dépense totale
 */
export const spendingDistributionData: TimeSeriesData[] = [
  { label: "0€", Utilisateurs: 2500 },
  { label: "1-50€", Utilisateurs: 1200 },
  { label: "51-100€", Utilisateurs: 1500 },
  { label: "101-200€", Utilisateurs: 1800 },
  { label: "201-500€", Utilisateurs: 1200 },
  { label: "501-1000€", Utilisateurs: 450 },
  { label: "1000€+", Utilisateurs: 100 },
];

/**
 * Données pour la comparaison des cohortes d'utilisateurs
 */
export const userCohortsData: MetricsComparisonData = {
  title: "Rétention par cohorte",
  description:
    "Comparaison de la rétention des utilisateurs par cohorte d'inscription",
  currentPeriod: "2023",
  previousPeriod: "2022",
  metrics: [
    {
      id: "jan-cohort",
      name: "Janvier",
      currentValue: 72,
      previousValue: 65,
      changePercentage: 10.8,
      target: 75,
      format: "percent",
      color: "#4f46e5",
    },
    {
      id: "feb-cohort",
      name: "Février",
      currentValue: 70,
      previousValue: 63,
      changePercentage: 11.1,
      target: 75,
      format: "percent",
      color: "#06b6d4",
    },
    {
      id: "mar-cohort",
      name: "Mars",
      currentValue: 68,
      previousValue: 62,
      changePercentage: 9.7,
      target: 75,
      format: "percent",
      color: "#10b981",
    },
    {
      id: "apr-cohort",
      name: "Avril",
      currentValue: 71,
      previousValue: 64,
      changePercentage: 10.9,
      target: 75,
      format: "percent",
      color: "#f59e0b",
    },
    {
      id: "may-cohort",
      name: "Mai",
      currentValue: 69,
      previousValue: 61,
      changePercentage: 13.1,
      target: 75,
      format: "percent",
      color: "#ef4444",
    },
    {
      id: "jun-cohort",
      name: "Juin",
      currentValue: 67,
      previousValue: 60,
      changePercentage: 11.7,
      target: 75,
      format: "percent",
      color: "#8b5cf6",
    },
  ],
};

/**
 * Données pour le tableau d'utilisateurs
 */
export const usersTableData = {
  columns: [
    {
      id: "name",
      header: "Nom",
      accessorFn: (row: UserTableItem) => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },
    {
      id: "email",
      header: "Email",
      accessorFn: (row: UserTableItem) => row.email,
      sortable: true,
    },
    {
      id: "registrationDate",
      header: "Date d'inscription",
      accessorFn: (row: UserTableItem) => row.registrationDate,
      sortable: true,
    },
    {
      id: "lastActivity",
      header: "Dernière activité",
      accessorFn: (row: UserTableItem) => row.lastActivity,
      sortable: true,
    },
    {
      id: "reservationsCount",
      header: "Réservations",
      accessorFn: (row: UserTableItem) => row.reservationsCount,
      sortable: true,
    },
    {
      id: "totalSpent",
      header: "Dépenses totales",
      accessorFn: (row: UserTableItem) => row.totalSpent,
      sortable: true,
      format: "currency",
    },
    {
      id: "status",
      header: "Statut",
      accessorFn: (row: UserTableItem) => row.status,
      sortable: true,
    },
    {
      id: "location",
      header: "Localisation",
      accessorFn: (row: UserTableItem) => row.location,
      sortable: true,
    },
  ] as AnalyticsColumn<UserTableItem>[],
  data: [
    {
      id: "1",
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@example.com",
      registrationDate: "2023-01-15",
      lastActivity: "2023-10-18",
      reservationsCount: 12,
      totalSpent: 850,
      status: "Actif",
      location: "Paris",
    },
    {
      id: "2",
      firstName: "Marie",
      lastName: "Martin",
      email: "marie.martin@example.com",
      registrationDate: "2023-02-20",
      lastActivity: "2023-10-15",
      reservationsCount: 8,
      totalSpent: 620,
      status: "Actif",
      location: "Lyon",
    },
    {
      id: "3",
      firstName: "Pierre",
      lastName: "Durand",
      email: "pierre.durand@example.com",
      registrationDate: "2023-03-10",
      lastActivity: "2023-10-10",
      reservationsCount: 5,
      totalSpent: 350,
      status: "Actif",
      location: "Marseille",
    },
    {
      id: "4",
      firstName: "Sophie",
      lastName: "Leroy",
      email: "sophie.leroy@example.com",
      registrationDate: "2023-04-05",
      lastActivity: "2023-09-28",
      reservationsCount: 3,
      totalSpent: 180,
      status: "Inactif",
      location: "Bordeaux",
    },
    {
      id: "5",
      firstName: "Thomas",
      lastName: "Moreau",
      email: "thomas.moreau@example.com",
      registrationDate: "2023-05-12",
      lastActivity: "2023-10-17",
      reservationsCount: 7,
      totalSpent: 520,
      status: "Actif",
      location: "Paris",
    },
    {
      id: "6",
      firstName: "Camille",
      lastName: "Simon",
      email: "camille.simon@example.com",
      registrationDate: "2023-06-18",
      lastActivity: "2023-10-05",
      reservationsCount: 4,
      totalSpent: 280,
      status: "Actif",
      location: "Lille",
    },
    {
      id: "7",
      firstName: "Nicolas",
      lastName: "Laurent",
      email: "nicolas.laurent@example.com",
      registrationDate: "2023-07-22",
      lastActivity: "2023-09-15",
      reservationsCount: 2,
      totalSpent: 150,
      status: "Inactif",
      location: "Toulouse",
    },
    {
      id: "8",
      firstName: "Julie",
      lastName: "Michel",
      email: "julie.michel@example.com",
      registrationDate: "2023-08-30",
      lastActivity: "2023-10-12",
      reservationsCount: 1,
      totalSpent: 75,
      status: "Actif",
      location: "Nantes",
    },
    {
      id: "9",
      firstName: "David",
      lastName: "Lefebvre",
      email: "david.lefebvre@example.com",
      registrationDate: "2023-09-05",
      lastActivity: "2023-10-16",
      reservationsCount: 2,
      totalSpent: 120,
      status: "Actif",
      location: "Strasbourg",
    },
    {
      id: "10",
      firstName: "Émilie",
      lastName: "Garcia",
      email: "emilie.garcia@example.com",
      registrationDate: "2023-10-01",
      lastActivity: "2023-10-18",
      reservationsCount: 1,
      totalSpent: 60,
      status: "Actif",
      location: "Lyon",
    },
  ],
};

/**
 * Données pour les catégories préférées des utilisateurs
 */
export const userPreferredCategoriesData: TimeSeriesData[] = [
  { label: "Sport", Utilisateurs: 2800 },
  { label: "Culture", Utilisateurs: 2200 },
  { label: "Bien-être", Utilisateurs: 1800 },
  { label: "Gastronomie", Utilisateurs: 1500 },
  { label: "Divertissement", Utilisateurs: 1200 },
  { label: "Autres", Utilisateurs: 800 },
];

/**
 * Données pour l'évolution des dépenses moyennes
 */
export const avgSpendingTrendData: TimeSeriesData[] = [
  { label: "Jan", "Dépense moyenne (€)": 165 },
  { label: "Fév", "Dépense moyenne (€)": 170 },
  { label: "Mar", "Dépense moyenne (€)": 175 },
  { label: "Avr", "Dépense moyenne (€)": 180 },
  { label: "Mai", "Dépense moyenne (€)": 182 },
  { label: "Juin", "Dépense moyenne (€)": 185 },
  { label: "Juil", "Dépense moyenne (€)": 190 },
  { label: "Août", "Dépense moyenne (€)": 188 },
  { label: "Sep", "Dépense moyenne (€)": 185 },
  { label: "Oct", "Dépense moyenne (€)": 183 },
  { label: "Nov", "Dépense moyenne (€)": 180 },
  { label: "Déc", "Dépense moyenne (€)": 185 },
];
