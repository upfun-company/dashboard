/**
 * Mocks pour l'analyse des réservations
 */

import { KPI } from "@/components/_organisms/AnalyticsKPICards/AnalyticsKPICards";
import { MetricsComparisonData } from "@/components/_organisms/MetricsComparison/MetricsComparison";
import {
  TimeSeriesData,
  PieChartData,
} from "@/components/_organisms/AdvancedAnalyticsChart/AdvancedAnalyticsChart";
import { AnalyticsColumn } from "@/components/_organisms/AnalyticsDataTable/AnalyticsDataTable";

/**
 * Type pour les données du tableau de réservations
 */
export interface ReservationTableItem {
  id: string;
  date: string;
  activity: string;
  category: string;
  provider: string;
  location: string;
  participants: number;
  price: number;
  status: string;
}

/**
 * KPIs pour l'analyse des réservations
 */
export const reservationKPIs: KPI[] = [
  {
    id: "total-reservations",
    title: "Réservations totales",
    value: 1245,
    change: 12.5,
    previousValue: 1106,
    unit: "",
    format: "compact",
    icon: "calendar",
    color: "blue",
    info: "Nombre total de réservations sur la période sélectionnée",
  },
  {
    id: "avg-booking-value",
    title: "Valeur moyenne",
    value: 72.1,
    change: 2.3,
    previousValue: 70.5,
    unit: "€",
    format: "currency",
    icon: "money",
    color: "green",
    info: "Valeur moyenne d'une réservation",
  },
  {
    id: "completion-rate",
    title: "Taux de complétion",
    value: 87.5,
    change: 3.2,
    previousValue: 84.3,
    unit: "%",
    format: "percent",
    icon: "percent",
    color: "amber",
    info: "Pourcentage de réservations complétées avec succès",
  },
  {
    id: "cancellation-rate",
    title: "Taux d'annulation",
    value: 8.3,
    change: -1.5,
    previousValue: 9.8,
    unit: "%",
    format: "percent",
    icon: "percent",
    color: "red",
    info: "Pourcentage de réservations annulées",
  },
  {
    id: "avg-group-size",
    title: "Taille moyenne des groupes",
    value: 3.2,
    change: 0.5,
    previousValue: 2.7,
    unit: "",
    format: "standard",
    icon: "users",
    color: "purple",
    info: "Nombre moyen de personnes par réservation",
  },
  {
    id: "repeat-rate",
    title: "Taux de répétition",
    value: 42.5,
    change: 5.2,
    previousValue: 37.3,
    unit: "%",
    format: "percent",
    icon: "clock",
    color: "pink",
    info: "Pourcentage de clients qui réservent à nouveau",
  },
];

/**
 * Données de séries temporelles pour l'évolution des réservations
 */
export const reservationsTimeSeriesData: TimeSeriesData[] = [
  { label: "Jan", Réservations: 65, Annulations: 5 },
  { label: "Fév", Réservations: 78, Annulations: 6 },
  { label: "Mar", Réservations: 90, Annulations: 8 },
  { label: "Avr", Réservations: 105, Annulations: 9 },
  { label: "Mai", Réservations: 112, Annulations: 10 },
  { label: "Juin", Réservations: 120, Annulations: 11 },
  { label: "Juil", Réservations: 135, Annulations: 12 },
  { label: "Août", Réservations: 150, Annulations: 13 },
  { label: "Sep", Réservations: 142, Annulations: 12 },
  { label: "Oct", Réservations: 130, Annulations: 11 },
  { label: "Nov", Réservations: 125, Annulations: 10 },
  { label: "Déc", Réservations: 145, Annulations: 12 },
];

/**
 * Données pour la répartition par catégorie
 */
export const categoryDistributionData: PieChartData[] = [
  { name: "Sport", value: 350, color: "#3b82f6" },
  { name: "Culture", value: 275, color: "#10b981" },
  { name: "Bien-être", value: 180, color: "#f59e0b" },
  { name: "Gastronomie", value: 220, color: "#8b5cf6" },
  { name: "Divertissement", value: 120, color: "#ec4899" },
  { name: "Autres", value: 100, color: "#94a3b8" },
];

/**
 * Données pour la répartition par lieu
 */
export const locationDistributionData: PieChartData[] = [
  { name: "Paris", value: 450, color: "#3b82f6" },
  { name: "Lyon", value: 200, color: "#10b981" },
  { name: "Marseille", value: 180, color: "#f59e0b" },
  { name: "Bordeaux", value: 150, color: "#8b5cf6" },
  { name: "Lille", value: 120, color: "#ec4899" },
  { name: "Autres", value: 145, color: "#94a3b8" },
];

/**
 * Données pour les réservations par heure
 */
export const hourlyReservationsData: TimeSeriesData[] = [
  { label: "8h", Réservations: 45 },
  { label: "9h", Réservations: 65 },
  { label: "10h", Réservations: 85 },
  { label: "11h", Réservations: 95 },
  { label: "12h", Réservations: 75 },
  { label: "13h", Réservations: 65 },
  { label: "14h", Réservations: 85 },
  { label: "15h", Réservations: 95 },
  { label: "16h", Réservations: 110 },
  { label: "17h", Réservations: 120 },
  { label: "18h", Réservations: 130 },
  { label: "19h", Réservations: 115 },
  { label: "20h", Réservations: 95 },
  { label: "21h", Réservations: 75 },
];

/**
 * Données pour les réservations par mois
 */
export const monthlyReservationsData: TimeSeriesData[] = [
  { label: "Jan", Réservations: 320 },
  { label: "Fév", Réservations: 350 },
  { label: "Mar", Réservations: 420 },
  { label: "Avr", Réservations: 480 },
  { label: "Mai", Réservations: 520 },
  { label: "Juin", Réservations: 580 },
  { label: "Juil", Réservations: 620 },
  { label: "Août", Réservations: 650 },
  { label: "Sep", Réservations: 580 },
  { label: "Oct", Réservations: 510 },
  { label: "Nov", Réservations: 490 },
  { label: "Déc", Réservations: 530 },
];

/**
 * Données pour les réservations par ville
 */
export const cityReservationsData: TimeSeriesData[] = [
  { label: "Paris", Réservations: 450 },
  { label: "Lyon", Réservations: 280 },
  { label: "Marseille", Réservations: 230 },
  { label: "Bordeaux", Réservations: 180 },
  { label: "Lille", Réservations: 150 },
  { label: "Toulouse", Réservations: 140 },
  { label: "Nice", Réservations: 120 },
];

/**
 * Données pour les réservations par taille de groupe
 */
export const groupSizeReservationsData: TimeSeriesData[] = [
  { label: "1", Réservations: 280 },
  { label: "2", Réservations: 420 },
  { label: "3-4", Réservations: 350 },
  { label: "5-6", Réservations: 220 },
  { label: "7-10", Réservations: 150 },
  { label: "11-15", Réservations: 80 },
  { label: "16+", Réservations: 40 },
];

/**
 * Données pour les réservations par prix
 */
export const priceRangeReservationsData: TimeSeriesData[] = [
  { label: "0-50€", Réservations: 180 },
  { label: "51-100€", Réservations: 320 },
  { label: "101-150€", Réservations: 280 },
  { label: "151-200€", Réservations: 220 },
  { label: "201-300€", Réservations: 150 },
  { label: "301-500€", Réservations: 80 },
  { label: "500€+", Réservations: 40 },
];

/**
 * Données pour les raisons d'annulation
 */
export const cancellationReasonsData: PieChartData[] = [
  { name: "Changement de programme", value: 35, color: "#3b82f6" },
  { name: "Problème de disponibilité", value: 25, color: "#10b981" },
  { name: "Raisons personnelles", value: 20, color: "#f59e0b" },
  { name: "Problème de transport", value: 10, color: "#8b5cf6" },
  { name: "Météo défavorable", value: 5, color: "#ec4899" },
  { name: "Autres", value: 5, color: "#94a3b8" },
];

/**
 * Données pour la comparaison par jour de la semaine
 */
export const weekdayComparisonData: MetricsComparisonData = {
  title: "Réservations par jour de la semaine",
  description: "Comparaison des réservations selon les jours de la semaine",
  currentPeriod: "Octobre 2023",
  previousPeriod: "Septembre 2023",
  metrics: [
    {
      id: "monday",
      name: "Lundi",
      currentValue: 120,
      previousValue: 95,
      changePercentage: 26.3,
      target: 130,
      format: "standard",
      color: "#4f46e5",
    },
    {
      id: "tuesday",
      name: "Mardi",
      currentValue: 145,
      previousValue: 110,
      changePercentage: 31.8,
      target: 140,
      format: "standard",
      color: "#06b6d4",
    },
    {
      id: "wednesday",
      name: "Mercredi",
      currentValue: 165,
      previousValue: 140,
      changePercentage: 17.9,
      target: 150,
      format: "standard",
      color: "#10b981",
    },
    {
      id: "thursday",
      name: "Jeudi",
      currentValue: 190,
      previousValue: 160,
      changePercentage: 18.8,
      target: 170,
      format: "standard",
      color: "#f59e0b",
    },
    {
      id: "friday",
      name: "Vendredi",
      currentValue: 210,
      previousValue: 180,
      changePercentage: 16.7,
      target: 200,
      format: "standard",
      color: "#ef4444",
    },
    {
      id: "saturday",
      name: "Samedi",
      currentValue: 250,
      previousValue: 220,
      changePercentage: 13.6,
      target: 230,
      format: "standard",
      color: "#8b5cf6",
    },
    {
      id: "sunday",
      name: "Dimanche",
      currentValue: 180,
      previousValue: 150,
      changePercentage: 20.0,
      target: 170,
      format: "standard",
      color: "#ec4899",
    },
  ],
};

/**
 * Données pour le tableau de réservations
 */
export const reservationsTableData = {
  columns: [
    {
      id: "date",
      header: "Date",
      accessorFn: (row: ReservationTableItem) => row.date,
      sortable: true,
    },
    {
      id: "activity",
      header: "Activité",
      accessorFn: (row: ReservationTableItem) => row.activity,
      sortable: true,
    },
    {
      id: "category",
      header: "Catégorie",
      accessorFn: (row: ReservationTableItem) => row.category,
      sortable: true,
    },
    {
      id: "provider",
      header: "Prestataire",
      accessorFn: (row: ReservationTableItem) => row.provider,
      sortable: true,
    },
    {
      id: "location",
      header: "Lieu",
      accessorFn: (row: ReservationTableItem) => row.location,
      sortable: true,
    },
    {
      id: "participants",
      header: "Participants",
      accessorFn: (row: ReservationTableItem) => row.participants,
      sortable: true,
    },
    {
      id: "price",
      header: "Prix",
      accessorFn: (row: ReservationTableItem) => row.price,
      sortable: true,
    },
    {
      id: "status",
      header: "Statut",
      accessorFn: (row: ReservationTableItem) => row.status,
      sortable: true,
    },
  ] as AnalyticsColumn<ReservationTableItem>[],
  data: [
    {
      id: "1",
      date: "2023-10-15",
      activity: "Yoga en plein air",
      category: "Bien-être",
      provider: "Zen Studio",
      location: "Paris",
      participants: 8,
      price: 160,
      status: "Complétée",
    },
    {
      id: "2",
      date: "2023-10-14",
      activity: "Dégustation de vin",
      category: "Gastronomie",
      provider: "Cave du Sommelier",
      location: "Bordeaux",
      participants: 12,
      price: 360,
      status: "Complétée",
    },
    {
      id: "3",
      date: "2023-10-14",
      activity: "Escalade en salle",
      category: "Sport",
      provider: "Vertical Climb",
      location: "Lyon",
      participants: 6,
      price: 120,
      status: "Complétée",
    },
    {
      id: "4",
      date: "2023-10-13",
      activity: "Visite musée",
      category: "Culture",
      provider: "Musée d&apos;Art Moderne",
      location: "Paris",
      participants: 4,
      price: 60,
      status: "Complétée",
    },
    {
      id: "5",
      date: "2023-10-13",
      activity: "Cours de cuisine",
      category: "Gastronomie",
      provider: "Atelier des Chefs",
      location: "Marseille",
      participants: 10,
      price: 450,
      status: "Complétée",
    },
    {
      id: "6",
      date: "2023-10-12",
      activity: "Escape game",
      category: "Divertissement",
      provider: "Mystery Room",
      location: "Lille",
      participants: 5,
      price: 125,
      status: "Annulée",
    },
    {
      id: "7",
      date: "2023-10-12",
      activity: "Paddle",
      category: "Sport",
      provider: "Ocean Ride",
      location: "Nice",
      participants: 3,
      price: 90,
      status: "Complétée",
    },
    {
      id: "8",
      date: "2023-10-11",
      activity: "Atelier peinture",
      category: "Art",
      provider: "Créa Studio",
      location: "Toulouse",
      participants: 8,
      price: 240,
      status: "Complétée",
    },
    {
      id: "9",
      date: "2023-10-11",
      activity: "Spa et massage",
      category: "Bien-être",
      provider: "Oasis Spa",
      location: "Cannes",
      participants: 2,
      price: 180,
      status: "En attente",
    },
    {
      id: "10",
      date: "2023-10-10",
      activity: "Randonnée guidée",
      category: "Aventure",
      provider: "Nature Trek",
      location: "Chamonix",
      participants: 15,
      price: 300,
      status: "Complétée",
    },
  ],
};

/**
 * Données pour la performance des prestataires
 */
export const providerPerformanceData: TimeSeriesData[] = [
  { label: "Prestataire A", Réservations: 120, Revenus: 9500 },
  { label: "Prestataire B", Réservations: 95, Revenus: 8200 },
  { label: "Prestataire C", Réservations: 85, Revenus: 7800 },
  { label: "Prestataire D", Réservations: 70, Revenus: 5600 },
  { label: "Prestataire E", Réservations: 65, Revenus: 4900 },
];

/**
 * Données pour la tendance mensuelle
 */
export const monthlyTrendData: TimeSeriesData[] = [
  { label: "Jan", Réservations: 120, "Revenus (k€)": 9.6 },
  { label: "Fév", Réservations: 150, "Revenus (k€)": 12 },
  { label: "Mar", Réservations: 180, "Revenus (k€)": 14.4 },
  { label: "Avr", Réservations: 220, "Revenus (k€)": 17.6 },
  { label: "Mai", Réservations: 270, "Revenus (k€)": 21.6 },
  { label: "Juin", Réservations: 250, "Revenus (k€)": 20 },
];
