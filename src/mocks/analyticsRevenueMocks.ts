/**
 * Mocks pour l'analyse des revenus
 */

import { MetricsComparisonData } from "@/components/_organisms/MetricsComparison/MetricsComparison";
import {
  TimeSeriesData,
  PieChartData,
} from "@/components/_organisms/AdvancedAnalyticsChart/AdvancedAnalyticsChart";
import { AnalyticsKPI } from "@/types/analytics";

/**
 * Type pour les données du tableau de revenus
 */
export interface RevenueTableItem {
  id: string;
  date: string;
  source: string;
  category: string;
  amount: number;
  fees: number;
  netAmount: number;
  paymentMethod: string;
  status: string;
  location: string;
}

/**
 * KPIs pour l'analyse des revenus
 */
export const revenueKPIs: AnalyticsKPI[] = [
  {
    id: "total-revenue",
    title: "Revenu total",
    value: 125680,
    previousValue: 108450,
    change: 15.89,
    trend: "up",
    format: "currency",
    description: "Revenu total généré sur la période",
  },
  {
    id: "average-order-value",
    title: "Panier moyen",
    value: 85.3,
    previousValue: 78.9,
    change: 8.11,
    trend: "up",
    format: "currency",
    description: "Valeur moyenne des commandes",
  },
  {
    id: "commission-revenue",
    title: "Commissions",
    value: 18852,
    previousValue: 16267.5,
    change: 15.89,
    trend: "up",
    format: "currency",
    description: "Revenus issus des commissions (15%)",
  },
  {
    id: "transactions",
    title: "Transactions",
    value: 1473,
    previousValue: 1375,
    change: 7.13,
    trend: "up",
    format: "standard",
    description: "Nombre total de transactions",
  },
];

/**
 * Données de série temporelle pour l'évolution des revenus
 */
export const revenueTimeSeriesData: TimeSeriesData[] = [
  {
    label: "Jan",
    "Chiffre d'affaires": 85000,
    "Revenus nets": 72250,
    Commissions: 12750,
  },
  {
    label: "Fév",
    "Chiffre d'affaires": 92000,
    "Revenus nets": 78200,
    Commissions: 13800,
  },
  {
    label: "Mar",
    "Chiffre d'affaires": 98000,
    "Revenus nets": 83300,
    Commissions: 14700,
  },
  {
    label: "Avr",
    "Chiffre d'affaires": 105000,
    "Revenus nets": 89250,
    Commissions: 15750,
  },
  {
    label: "Mai",
    "Chiffre d'affaires": 115000,
    "Revenus nets": 97750,
    Commissions: 17250,
  },
  {
    label: "Juin",
    "Chiffre d'affaires": 125000,
    "Revenus nets": 106250,
    Commissions: 18750,
  },
  {
    label: "Juil",
    "Chiffre d'affaires": 135000,
    "Revenus nets": 114750,
    Commissions: 20250,
  },
  {
    label: "Août",
    "Chiffre d'affaires": 128000,
    "Revenus nets": 108800,
    Commissions: 19200,
  },
  {
    label: "Sep",
    "Chiffre d'affaires": 118000,
    "Revenus nets": 100300,
    Commissions: 17700,
  },
  {
    label: "Oct",
    "Chiffre d'affaires": 110000,
    "Revenus nets": 93500,
    Commissions: 16500,
  },
  {
    label: "Nov",
    "Chiffre d'affaires": 120000,
    "Revenus nets": 102000,
    Commissions: 18000,
  },
  {
    label: "Déc",
    "Chiffre d'affaires": 145000,
    "Revenus nets": 123250,
    Commissions: 21750,
  },
];

/**
 * Données pour la répartition des revenus par catégorie
 */
export const revenueByCategoryData: PieChartData[] = [
  { name: "Sport", value: 35000, color: "#3b82f6" },
  { name: "Culture", value: 25000, color: "#10b981" },
  { name: "Bien-être", value: 20000, color: "#f59e0b" },
  { name: "Gastronomie", value: 18000, color: "#8b5cf6" },
  { name: "Divertissement", value: 15000, color: "#ec4899" },
  { name: "Art", value: 12000, color: "#ef4444" },
];

/**
 * Données pour la répartition des revenus par localisation
 */
export const revenueByLocationData: PieChartData[] = [
  { name: "Paris", value: 45000, color: "#3b82f6" },
  { name: "Lyon", value: 22000, color: "#10b981" },
  { name: "Marseille", value: 18000, color: "#f59e0b" },
  { name: "Bordeaux", value: 15000, color: "#8b5cf6" },
  { name: "Lille", value: 13000, color: "#ec4899" },
  { name: "Autres", value: 12000, color: "#ef4444" },
];

/**
 * Données pour la répartition des revenus par méthode de paiement
 */
export const revenueByPaymentMethodData: PieChartData[] = [
  { name: "Carte bancaire", value: 85000, color: "#3b82f6" },
  { name: "PayPal", value: 25000, color: "#10b981" },
  { name: "Virement", value: 10000, color: "#f59e0b" },
  { name: "Apple Pay", value: 3000, color: "#8b5cf6" },
  { name: "Google Pay", value: 2000, color: "#ec4899" },
];

/**
 * Données pour l'évolution du panier moyen
 */
export const avgOrderValueTrendData: TimeSeriesData[] = [
  { label: "Jan", "Panier moyen (€)": 75 },
  { label: "Fév", "Panier moyen (€)": 78 },
  { label: "Mar", "Panier moyen (€)": 77 },
  { label: "Avr", "Panier moyen (€)": 80 },
  { label: "Mai", "Panier moyen (€)": 82 },
  { label: "Juin", "Panier moyen (€)": 85 },
  { label: "Juil", "Panier moyen (€)": 88 },
  { label: "Août", "Panier moyen (€)": 87 },
  { label: "Sep", "Panier moyen (€)": 86 },
  { label: "Oct", "Panier moyen (€)": 84 },
  { label: "Nov", "Panier moyen (€)": 85 },
  { label: "Déc", "Panier moyen (€)": 90 },
];

/**
 * Données pour l'évolution du taux de commission
 */
export const commissionRateTrendData: TimeSeriesData[] = [
  { label: "Jan", "Taux de commission (%)": 14.5 },
  { label: "Fév", "Taux de commission (%)": 14.8 },
  { label: "Mar", "Taux de commission (%)": 14.9 },
  { label: "Avr", "Taux de commission (%)": 15.0 },
  { label: "Mai", "Taux de commission (%)": 15.0 },
  { label: "Juin", "Taux de commission (%)": 15.0 },
  { label: "Juil", "Taux de commission (%)": 15.2 },
  { label: "Août", "Taux de commission (%)": 15.3 },
  { label: "Sep", "Taux de commission (%)": 15.0 },
  { label: "Oct", "Taux de commission (%)": 15.0 },
  { label: "Nov", "Taux de commission (%)": 15.0 },
  { label: "Déc", "Taux de commission (%)": 15.5 },
];

/**
 * Données pour les revenus par prestataire (top 10)
 */
export const revenueByProviderData: TimeSeriesData[] = [
  { label: "Aventure Sport", "Chiffre d'affaires (€)": 12500 },
  { label: "Spa Zen", "Chiffre d'affaires (€)": 10800 },
  { label: "Musée National", "Chiffre d'affaires (€)": 9500 },
  { label: "Chef à domicile", "Chiffre d'affaires (€)": 8200 },
  { label: "Escape Game Pro", "Chiffre d'affaires (€)": 7500 },
  { label: "Atelier Peinture", "Chiffre d'affaires (€)": 6800 },
  { label: "Yoga Bien-être", "Chiffre d'affaires (€)": 6200 },
  { label: "Théâtre Central", "Chiffre d'affaires (€)": 5900 },
  { label: "Cours de Cuisine", "Chiffre d'affaires (€)": 5500 },
  { label: "Salle d'escalade", "Chiffre d'affaires (€)": 5100 },
];

/**
 * Données pour la comparaison des revenus par catégorie
 */
export const categoryRevenueComparisonData: MetricsComparisonData = {
  title: "Comparaison des revenus par catégorie",
  description:
    "Comparaison des revenus entre la période actuelle et précédente",
  metrics: [
    {
      id: "sport",
      name: "Sport",
      currentValue: 35000,
      previousValue: 32000,
      changePercentage: 9.38,
      unit: "€",
    },
    {
      id: "culture",
      name: "Culture",
      currentValue: 25000,
      previousValue: 23000,
      changePercentage: 8.7,
      unit: "€",
    },
    {
      id: "bien-etre",
      name: "Bien-être",
      currentValue: 20000,
      previousValue: 18500,
      changePercentage: 8.11,
      unit: "€",
    },
    {
      id: "gastronomie",
      name: "Gastronomie",
      currentValue: 18000,
      previousValue: 16000,
      changePercentage: 12.5,
      unit: "€",
    },
    {
      id: "divertissement",
      name: "Divertissement",
      currentValue: 15000,
      previousValue: 14000,
      changePercentage: 7.14,
      unit: "€",
    },
    {
      id: "art",
      name: "Art",
      currentValue: 12000,
      previousValue: 10000,
      changePercentage: 20.0,
      unit: "€",
    },
  ],
  currentPeriod: "Ce mois",
  previousPeriod: "Mois précédent",
};

/**
 * Données pour le tableau des revenus
 */
export const revenueTableData = [
  {
    id: "rev-001",
    date: "2023-06-15",
    source: "Réservation #12345",
    category: "Sport",
    amount: 120,
    fees: 18,
    netAmount: 102,
    paymentMethod: "Carte bancaire",
    status: "Complété",
    location: "Paris",
  },
  {
    id: "rev-002",
    date: "2023-06-15",
    source: "Réservation #12346",
    category: "Culture",
    amount: 85,
    fees: 12.75,
    netAmount: 72.25,
    paymentMethod: "PayPal",
    status: "Complété",
    location: "Lyon",
  },
  {
    id: "rev-003",
    date: "2023-06-14",
    source: "Réservation #12347",
    category: "Bien-être",
    amount: 150,
    fees: 22.5,
    netAmount: 127.5,
    paymentMethod: "Carte bancaire",
    status: "Complété",
    location: "Marseille",
  },
  {
    id: "rev-004",
    date: "2023-06-14",
    source: "Réservation #12348",
    category: "Gastronomie",
    amount: 95,
    fees: 14.25,
    netAmount: 80.75,
    paymentMethod: "Apple Pay",
    status: "Complété",
    location: "Bordeaux",
  },
  {
    id: "rev-005",
    date: "2023-06-13",
    source: "Réservation #12349",
    category: "Divertissement",
    amount: 65,
    fees: 9.75,
    netAmount: 55.25,
    paymentMethod: "Carte bancaire",
    status: "Complété",
    location: "Lille",
  },
  {
    id: "rev-006",
    date: "2023-06-13",
    source: "Réservation #12350",
    category: "Art",
    amount: 75,
    fees: 11.25,
    netAmount: 63.75,
    paymentMethod: "Virement",
    status: "En attente",
    location: "Paris",
  },
  {
    id: "rev-007",
    date: "2023-06-12",
    source: "Réservation #12351",
    category: "Sport",
    amount: 110,
    fees: 16.5,
    netAmount: 93.5,
    paymentMethod: "Carte bancaire",
    status: "Complété",
    location: "Lyon",
  },
  {
    id: "rev-008",
    date: "2023-06-12",
    source: "Réservation #12352",
    category: "Culture",
    amount: 90,
    fees: 13.5,
    netAmount: 76.5,
    paymentMethod: "Google Pay",
    status: "Complété",
    location: "Paris",
  },
  {
    id: "rev-009",
    date: "2023-06-11",
    source: "Réservation #12353",
    category: "Bien-être",
    amount: 130,
    fees: 19.5,
    netAmount: 110.5,
    paymentMethod: "Carte bancaire",
    status: "Remboursé",
    location: "Marseille",
  },
  {
    id: "rev-010",
    date: "2023-06-11",
    source: "Réservation #12354",
    category: "Gastronomie",
    amount: 105,
    fees: 15.75,
    netAmount: 89.25,
    paymentMethod: "PayPal",
    status: "Complété",
    location: "Bordeaux",
  },
  {
    id: "rev-011",
    date: "2023-06-10",
    source: "Réservation #12355",
    category: "Divertissement",
    amount: 70,
    fees: 10.5,
    netAmount: 59.5,
    paymentMethod: "Carte bancaire",
    status: "Complété",
    location: "Lille",
  },
  {
    id: "rev-012",
    date: "2023-06-10",
    source: "Réservation #12356",
    category: "Art",
    amount: 80,
    fees: 12,
    netAmount: 68,
    paymentMethod: "Virement",
    status: "Complété",
    location: "Paris",
  },
  {
    id: "rev-013",
    date: "2023-06-09",
    source: "Réservation #12357",
    category: "Sport",
    amount: 115,
    fees: 17.25,
    netAmount: 97.75,
    paymentMethod: "Carte bancaire",
    status: "Complété",
    location: "Lyon",
  },
  {
    id: "rev-014",
    date: "2023-06-09",
    source: "Réservation #12358",
    category: "Culture",
    amount: 95,
    fees: 14.25,
    netAmount: 80.75,
    paymentMethod: "Apple Pay",
    status: "En attente",
    location: "Paris",
  },
  {
    id: "rev-015",
    date: "2023-06-08",
    source: "Réservation #12359",
    category: "Bien-être",
    amount: 140,
    fees: 21,
    netAmount: 119,
    paymentMethod: "Carte bancaire",
    status: "Complété",
    location: "Marseille",
  },
];
