/**
 * Mocks pour l'analyse des prestataires
 */

import { KPI } from "@/components/_organisms/AnalyticsKPICards/AnalyticsKPICards";
import {
  MetricsComparisonData,
} from "@/components/_organisms/MetricsComparison/MetricsComparison";
import {
  TimeSeriesData,
  PieChartData,
} from "@/components/_organisms/AdvancedAnalyticsChart/AdvancedAnalyticsChart";
import { AnalyticsColumn } from "@/components/_organisms/AnalyticsDataTable/AnalyticsDataTable";

/**
 * Type pour les données du tableau de prestataires
 */
export interface ProviderTableItem {
  id: string;
  companyName: string;
  contactName: string;
  category: string;
  registrationDate: string;
  lastActivity: string;
  reservationsCount: number;
  totalRevenue: number;
  commissionRate: number;
  rating: number;
  status: string;
  location: string;
}

/**
 * KPIs pour l'analyse des prestataires
 */
export const providerKPIs: KPI[] = [
  {
    id: "total-providers",
    title: "Prestataires totaux",
    value: 450,
    change: 8.4,
    previousValue: 415,
    unit: "",
    format: "standard",
    icon: "users",
    color: "blue",
    info: "Nombre total de prestataires sur la période sélectionnée",
  },
  {
    id: "active-providers",
    title: "Prestataires actifs",
    value: 320,
    change: 12.3,
    previousValue: 285,
    unit: "",
    format: "standard",
    icon: "users",
    color: "green",
    info: "Nombre de prestataires actifs sur la période",
  },
  {
    id: "avg-revenue",
    title: "Revenu moyen",
    value: 4250,
    change: 5.2,
    previousValue: 4040,
    unit: "€",
    format: "currency",
    icon: "money",
    color: "amber",
    info: "Revenu moyen par prestataire",
  },
  {
    id: "new-providers",
    title: "Nouveaux prestataires",
    value: 35,
    change: 16.7,
    previousValue: 30,
    unit: "",
    format: "standard",
    icon: "users",
    color: "purple",
    info: "Nombre de nouveaux prestataires sur la période",
  },
  {
    id: "avg-rating",
    title: "Note moyenne",
    value: 4.2,
    change: 0.5,
    previousValue: 4.18,
    unit: "",
    format: "standard",
    icon: "star",
    color: "pink",
    info: "Note moyenne des prestataires",
  },
  {
    id: "commission-revenue",
    title: "Revenus commission",
    value: 85000,
    change: 12.5,
    previousValue: 75500,
    unit: "€",
    format: "currency",
    icon: "money",
    color: "red",
    info: "Revenus générés par les commissions",
  },
];

/**
 * Données de séries temporelles pour l'évolution des prestataires
 */
export const providersTimeSeriesData: TimeSeriesData[] = [
  { label: "Jan", "Prestataires actifs": 280, "Nouveaux prestataires": 15 },
  { label: "Fév", "Prestataires actifs": 290, "Nouveaux prestataires": 18 },
  { label: "Mar", "Prestataires actifs": 300, "Nouveaux prestataires": 20 },
  { label: "Avr", "Prestataires actifs": 310, "Nouveaux prestataires": 22 },
  { label: "Mai", "Prestataires actifs": 320, "Nouveaux prestataires": 25 },
  { label: "Juin", "Prestataires actifs": 335, "Nouveaux prestataires": 28 },
  { label: "Juil", "Prestataires actifs": 350, "Nouveaux prestataires": 30 },
  { label: "Août", "Prestataires actifs": 365, "Nouveaux prestataires": 28 },
  { label: "Sep", "Prestataires actifs": 350, "Nouveaux prestataires": 25 },
  { label: "Oct", "Prestataires actifs": 340, "Nouveaux prestataires": 22 },
  { label: "Nov", "Prestataires actifs": 330, "Nouveaux prestataires": 20 },
  { label: "Déc", "Prestataires actifs": 320, "Nouveaux prestataires": 18 },
];

/**
 * Données pour la répartition par catégorie
 */
export const categoryDistributionData: PieChartData[] = [
  { name: "Sport", value: 120, color: "#3b82f6" },
  { name: "Culture", value: 85, color: "#10b981" },
  { name: "Bien-être", value: 75, color: "#f59e0b" },
  { name: "Gastronomie", value: 65, color: "#8b5cf6" },
  { name: "Divertissement", value: 55, color: "#ec4899" },
  { name: "Autres", value: 50, color: "#94a3b8" },
];

/**
 * Données pour la répartition par localisation
 */
export const locationDistributionData: PieChartData[] = [
  { name: "Paris", value: 150, color: "#3b82f6" },
  { name: "Lyon", value: 75, color: "#10b981" },
  { name: "Marseille", value: 60, color: "#f59e0b" },
  { name: "Bordeaux", value: 45, color: "#8b5cf6" },
  { name: "Lille", value: 35, color: "#ec4899" },
  { name: "Autres", value: 85, color: "#94a3b8" },
];

/**
 * Données pour les prestataires par nombre de réservations
 */
export const bookingCountData: TimeSeriesData[] = [
  { label: "0", Prestataires: 50 },
  { label: "1-5", Prestataires: 120 },
  { label: "6-10", Prestataires: 95 },
  { label: "11-20", Prestataires: 75 },
  { label: "21-50", Prestataires: 60 },
  { label: "51+", Prestataires: 50 },
];

/**
 * Données pour les prestataires par revenu total
 */
export const revenueDistributionData: TimeSeriesData[] = [
  { label: "0€", Prestataires: 30 },
  { label: "1-1000€", Prestataires: 80 },
  { label: "1001-5000€", Prestataires: 120 },
  { label: "5001-10000€", Prestataires: 95 },
  { label: "10001-20000€", Prestataires: 75 },
  { label: "20001-50000€", Prestataires: 35 },
  { label: "50000€+", Prestataires: 15 },
];

/**
 * Données pour la comparaison des taux de commission
 */
export const commissionRatesData: MetricsComparisonData = {
  title: "Taux de commission par catégorie",
  description: "Comparaison des taux de commission moyens par catégorie",
  currentPeriod: "2023",
  previousPeriod: "2022",
  metrics: [
    {
      id: "sport",
      name: "Sport",
      currentValue: 12.5,
      previousValue: 12.0,
      changePercentage: 4.2,
      target: 13.0,
      format: "percent",
      color: "#4f46e5",
    },
    {
      id: "culture",
      name: "Culture",
      currentValue: 11.8,
      previousValue: 11.5,
      changePercentage: 2.6,
      target: 12.0,
      format: "percent",
      color: "#06b6d4",
    },
    {
      id: "bien-etre",
      name: "Bien-être",
      currentValue: 13.2,
      previousValue: 12.8,
      changePercentage: 3.1,
      target: 13.5,
      format: "percent",
      color: "#10b981",
    },
    {
      id: "gastronomie",
      name: "Gastronomie",
      currentValue: 14.5,
      previousValue: 14.0,
      changePercentage: 3.6,
      target: 15.0,
      format: "percent",
      color: "#f59e0b",
    },
    {
      id: "divertissement",
      name: "Divertissement",
      currentValue: 13.8,
      previousValue: 13.2,
      changePercentage: 4.5,
      target: 14.0,
      format: "percent",
      color: "#ef4444",
    },
    {
      id: "autres",
      name: "Autres",
      currentValue: 12.0,
      previousValue: 11.5,
      changePercentage: 4.3,
      target: 12.5,
      format: "percent",
      color: "#8b5cf6",
    },
  ],
};

/**
 * Données pour le tableau de prestataires
 */
export const providersTableData = {
  columns: [
    {
      id: "companyName",
      header: "Entreprise",
      accessorFn: (row: ProviderTableItem) => row.companyName,
      sortable: true,
    },
    {
      id: "contactName",
      header: "Contact",
      accessorFn: (row: ProviderTableItem) => row.contactName,
      sortable: true,
    },
    {
      id: "category",
      header: "Catégorie",
      accessorFn: (row: ProviderTableItem) => row.category,
      sortable: true,
    },
    {
      id: "registrationDate",
      header: "Date d'inscription",
      accessorFn: (row: ProviderTableItem) => row.registrationDate,
      sortable: true,
    },
    {
      id: "lastActivity",
      header: "Dernière activité",
      accessorFn: (row: ProviderTableItem) => row.lastActivity,
      sortable: true,
    },
    {
      id: "reservationsCount",
      header: "Réservations",
      accessorFn: (row: ProviderTableItem) => row.reservationsCount,
      sortable: true,
    },
    {
      id: "totalRevenue",
      header: "Revenus totaux",
      accessorFn: (row: ProviderTableItem) => row.totalRevenue,
      sortable: true,
      format: "currency",
    },
    {
      id: "commissionRate",
      header: "Taux de commission",
      accessorFn: (row: ProviderTableItem) => row.commissionRate,
      sortable: true,
      format: "percent",
    },
    {
      id: "rating",
      header: "Note",
      accessorFn: (row: ProviderTableItem) => row.rating,
      sortable: true,
    },
    {
      id: "status",
      header: "Statut",
      accessorFn: (row: ProviderTableItem) => row.status,
      sortable: true,
    },
    {
      id: "location",
      header: "Localisation",
      accessorFn: (row: ProviderTableItem) => row.location,
      sortable: true,
    },
  ] as AnalyticsColumn<ProviderTableItem>[],
  data: [
    {
      id: "1",
      companyName: "Yoga Studio",
      contactName: "Jean Dupont",
      category: "Bien-être",
      registrationDate: "2023-01-15",
      lastActivity: "2023-10-18",
      reservationsCount: 85,
      totalRevenue: 12500,
      commissionRate: 12.5,
      rating: 4.8,
      status: "Actif",
      location: "Paris",
    },
    {
      id: "2",
      companyName: "Aventure Nature",
      contactName: "Marie Martin",
      category: "Sport",
      registrationDate: "2023-02-20",
      lastActivity: "2023-10-15",
      reservationsCount: 65,
      totalRevenue: 9800,
      commissionRate: 11.8,
      rating: 4.5,
      status: "Actif",
      location: "Lyon",
    },
    {
      id: "3",
      companyName: "Atelier Gourmand",
      contactName: "Pierre Durand",
      category: "Gastronomie",
      registrationDate: "2023-03-10",
      lastActivity: "2023-10-10",
      reservationsCount: 45,
      totalRevenue: 7500,
      commissionRate: 14.2,
      rating: 4.6,
      status: "Actif",
      location: "Marseille",
    },
    {
      id: "4",
      companyName: "Musée d'Art Moderne",
      contactName: "Sophie Leroy",
      category: "Culture",
      registrationDate: "2023-04-05",
      lastActivity: "2023-09-28",
      reservationsCount: 120,
      totalRevenue: 15000,
      commissionRate: 11.5,
      rating: 4.3,
      status: "Actif",
      location: "Paris",
    },
    {
      id: "5",
      companyName: "Escape Game",
      contactName: "Thomas Moreau",
      category: "Divertissement",
      registrationDate: "2023-05-12",
      lastActivity: "2023-10-17",
      reservationsCount: 95,
      totalRevenue: 11200,
      commissionRate: 13.5,
      rating: 4.7,
      status: "Actif",
      location: "Bordeaux",
    },
    {
      id: "6",
      companyName: "Centre Équestre",
      contactName: "Camille Simon",
      category: "Sport",
      registrationDate: "2023-06-18",
      lastActivity: "2023-10-05",
      reservationsCount: 55,
      totalRevenue: 8500,
      commissionRate: 12.0,
      rating: 4.4,
      status: "Actif",
      location: "Lille",
    },
    {
      id: "7",
      companyName: "Studio Photo",
      contactName: "Nicolas Laurent",
      category: "Art",
      registrationDate: "2023-07-22",
      lastActivity: "2023-09-15",
      reservationsCount: 35,
      totalRevenue: 5200,
      commissionRate: 11.8,
      rating: 4.2,
      status: "Inactif",
      location: "Toulouse",
    },
    {
      id: "8",
      companyName: "Spa Détente",
      contactName: "Julie Michel",
      category: "Bien-être",
      registrationDate: "2023-08-30",
      lastActivity: "2023-10-12",
      reservationsCount: 75,
      totalRevenue: 9800,
      commissionRate: 13.0,
      rating: 4.9,
      status: "Actif",
      location: "Cannes",
    },
    {
      id: "9",
      companyName: "École de Danse",
      contactName: "David Lefebvre",
      category: "Art",
      registrationDate: "2023-09-05",
      lastActivity: "2023-10-16",
      reservationsCount: 60,
      totalRevenue: 7200,
      commissionRate: 12.2,
      rating: 4.5,
      status: "Actif",
      location: "Lyon",
    },
    {
      id: "10",
      companyName: "Cours de Cuisine",
      contactName: "Émilie Garcia",
      category: "Gastronomie",
      registrationDate: "2023-10-01",
      lastActivity: "2023-10-18",
      reservationsCount: 25,
      totalRevenue: 3800,
      commissionRate: 14.0,
      rating: 4.6,
      status: "Actif",
      location: "Nantes",
    },
  ],
};

/**
 * Données pour les activités les plus populaires
 */
export const popularActivitiesData: TimeSeriesData[] = [
  { label: "Yoga", Réservations: 450 },
  { label: "Escalade", Réservations: 380 },
  { label: "Cuisine", Réservations: 320 },
  { label: "Musée", Réservations: 280 },
  { label: "Escape Game", Réservations: 250 },
  { label: "Spa", Réservations: 220 },
];

/**
 * Données pour l'évolution des revenus moyens
 */
export const avgRevenueTrendData: TimeSeriesData[] = [
  { label: "Jan", "Revenu moyen (€)": 3800 },
  { label: "Fév", "Revenu moyen (€)": 3900 },
  { label: "Mar", "Revenu moyen (€)": 4050 },
  { label: "Avr", "Revenu moyen (€)": 4150 },
  { label: "Mai", "Revenu moyen (€)": 4200 },
  { label: "Juin", "Revenu moyen (€)": 4300 },
  { label: "Juil", "Revenu moyen (€)": 4450 },
  { label: "Août", "Revenu moyen (€)": 4500 },
  { label: "Sep", "Revenu moyen (€)": 4350 },
  { label: "Oct", "Revenu moyen (€)": 4250 },
  { label: "Nov", "Revenu moyen (€)": 4150 },
  { label: "Déc", "Revenu moyen (€)": 4250 },
];

/**
 * Données pour l'évolution des notes moyennes
 */
export const ratingTrendData: TimeSeriesData[] = [
  { label: "Jan", "Note moyenne": 4.1 },
  { label: "Fév", "Note moyenne": 4.15 },
  { label: "Mar", "Note moyenne": 4.18 },
  { label: "Avr", "Note moyenne": 4.2 },
  { label: "Mai", "Note moyenne": 4.22 },
  { label: "Juin", "Note moyenne": 4.25 },
  { label: "Juil", "Note moyenne": 4.28 },
  { label: "Août", "Note moyenne": 4.3 },
  { label: "Sep", "Note moyenne": 4.25 },
  { label: "Oct", "Note moyenne": 4.22 },
  { label: "Nov", "Note moyenne": 4.2 },
  { label: "Déc", "Note moyenne": 4.18 },
];
