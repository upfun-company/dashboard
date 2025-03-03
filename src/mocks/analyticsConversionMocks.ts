/**
 * Mocks pour l'analyse des conversions
 */

import { MetricsComparisonData } from "@/components/_organisms/MetricsComparison/MetricsComparison";
import {
  TimeSeriesData,
  PieChartData,
} from "@/components/_organisms/AdvancedAnalyticsChart/AdvancedAnalyticsChart";
import { AnalyticsKPI } from "@/types/analytics";

/**
 * Type pour les données du tableau de conversions
 */
export interface ConversionTableItem {
  id: string;
  date: string;
  source: string;
  channel: string;
  device: string;
  category: string;
  value: string;
}

/**
 * KPIs pour l'analyse des conversions
 */
export const conversionKPIs: AnalyticsKPI[] = [
  {
    id: "conversion-rate",
    title: "Taux de conversion",
    value: 3.8,
    previousValue: 3.2,
    change: 18.75,
    trend: "up",
    format: "percent",
    description: "Pourcentage de visiteurs qui effectuent une conversion",
  },
  {
    id: "total-conversions",
    title: "Conversions totales",
    value: 1245,
    previousValue: 1050,
    change: 18.57,
    trend: "up",
    format: "standard",
    description: "Nombre total de conversions sur la période",
  },
  {
    id: "cost-per-conversion",
    title: "Coût par conversion",
    value: 12.5,
    previousValue: 14.2,
    change: -11.97,
    trend: "down",
    format: "currency",
    description: "Coût moyen pour acquérir une conversion",
  },
  {
    id: "average-order-value",
    title: "Valeur moyenne",
    value: 85.3,
    previousValue: 78.9,
    change: 8.11,
    trend: "up",
    format: "currency",
    description: "Valeur moyenne des commandes après conversion",
  },
];

/**
 * Données de série temporelle pour l'évolution du taux de conversion
 */
export const conversionRateTimeSeriesData: TimeSeriesData[] = [
  { label: "Jan", "Taux de conversion (%)": 2.8 },
  { label: "Fév", "Taux de conversion (%)": 3.1 },
  { label: "Mar", "Taux de conversion (%)": 3.3 },
  { label: "Avr", "Taux de conversion (%)": 3.0 },
  { label: "Mai", "Taux de conversion (%)": 3.2 },
  { label: "Juin", "Taux de conversion (%)": 3.5 },
  { label: "Juil", "Taux de conversion (%)": 3.4 },
  { label: "Août", "Taux de conversion (%)": 3.6 },
  { label: "Sep", "Taux de conversion (%)": 3.7 },
  { label: "Oct", "Taux de conversion (%)": 3.5 },
  { label: "Nov", "Taux de conversion (%)": 3.8 },
  { label: "Déc", "Taux de conversion (%)": 4.0 },
];

/**
 * Données pour la répartition des conversions par source
 */
export const conversionsBySourceData: PieChartData[] = [
  { name: "Recherche organique", value: 35, color: "#3b82f6" },
  { name: "Réseaux sociaux", value: 25, color: "#10b981" },
  { name: "Trafic direct", value: 20, color: "#f59e0b" },
  { name: "Email marketing", value: 12, color: "#8b5cf6" },
  { name: "Référencement payant", value: 8, color: "#ec4899" },
];

/**
 * Données pour la répartition des conversions par appareil
 */
export const conversionsByDeviceData: PieChartData[] = [
  { name: "Mobile", value: 58, color: "#3b82f6" },
  { name: "Desktop", value: 35, color: "#10b981" },
  { name: "Tablette", value: 7, color: "#f59e0b" },
];

/**
 * Données pour la répartition des conversions par canal
 */
export const conversionsByChannelData: TimeSeriesData[] = [
  { label: "Site web", Conversions: 720 },
  { label: "Application mobile", Conversions: 380 },
  { label: "Téléphone", Conversions: 95 },
  { label: "Partenaires", Conversions: 50 },
];

/**
 * Données pour l'évolution du coût par conversion
 */
export const costPerConversionTrendData: TimeSeriesData[] = [
  { label: "Jan", "Coût par conversion (€)": 15.2 },
  { label: "Fév", "Coût par conversion (€)": 14.8 },
  { label: "Mar", "Coût par conversion (€)": 14.5 },
  { label: "Avr", "Coût par conversion (€)": 14.2 },
  { label: "Mai", "Coût par conversion (€)": 13.9 },
  { label: "Juin", "Coût par conversion (€)": 13.5 },
  { label: "Juil", "Coût par conversion (€)": 13.2 },
  { label: "Août", "Coût par conversion (€)": 13.0 },
  { label: "Sep", "Coût par conversion (€)": 12.8 },
  { label: "Oct", "Coût par conversion (€)": 12.6 },
  { label: "Nov", "Coût par conversion (€)": 12.5 },
  { label: "Déc", "Coût par conversion (€)": 12.3 },
];

/**
 * Données pour l'évolution du ROI marketing
 */
export const roiTrendData: TimeSeriesData[] = [
  { label: "Jan", "ROI (%)": 120 },
  { label: "Fév", "ROI (%)": 125 },
  { label: "Mar", "ROI (%)": 130 },
  { label: "Avr", "ROI (%)": 135 },
  { label: "Mai", "ROI (%)": 140 },
  { label: "Juin", "ROI (%)": 145 },
  { label: "Juil", "ROI (%)": 150 },
  { label: "Août", "ROI (%)": 155 },
  { label: "Sep", "ROI (%)": 160 },
  { label: "Oct", "ROI (%)": 165 },
  { label: "Nov", "ROI (%)": 170 },
  { label: "Déc", "ROI (%)": 175 },
];

/**
 * Données pour le taux de conversion par catégorie
 */
export const conversionRateByCategoryData: TimeSeriesData[] = [
  { label: "Sports nautiques", "Taux de conversion (%)": 4.5 },
  { label: "Randonnée", "Taux de conversion (%)": 4.2 },
  { label: "Bien-être", "Taux de conversion (%)": 3.9 },
  { label: "Gastronomie", "Taux de conversion (%)": 3.7 },
  { label: "Culture", "Taux de conversion (%)": 3.5 },
  { label: "Aventure", "Taux de conversion (%)": 3.3 },
];

/**
 * Données pour l'entonnoir de conversion
 */
export const conversionFunnelData: TimeSeriesData[] = [
  { label: "Visiteurs", Nombre: 32500 },
  { label: "Vues produit", Nombre: 18200 },
  { label: "Ajouts au panier", Nombre: 4800 },
  { label: "Début checkout", Nombre: 2100 },
  { label: "Conversions", Nombre: 1245 },
];

/**
 * Données pour la comparaison des taux de conversion par canal
 */
export const channelConversionComparisonData: MetricsComparisonData = {
  title: "Comparaison des taux de conversion par canal",
  description:
    "Comparaison des taux de conversion entre la période actuelle et précédente",
  metrics: [
    {
      id: "site-web",
      name: "Site web",
      currentValue: 3.8,
      previousValue: 3.2,
      changePercentage: 18.75,
      unit: "%",
    },
    {
      id: "application-mobile",
      name: "Application mobile",
      currentValue: 4.2,
      previousValue: 3.9,
      changePercentage: 7.69,
      unit: "%",
    },
    {
      id: "telephone",
      name: "Téléphone",
      currentValue: 8.5,
      previousValue: 8.2,
      changePercentage: 3.66,
      unit: "%",
    },
    {
      id: "partenaires",
      name: "Partenaires",
      currentValue: 2.8,
      previousValue: 3.1,
      changePercentage: -9.68,
      unit: "%",
    },
  ],
  currentPeriod: "Ce mois",
  previousPeriod: "Mois précédent",
};

/**
 * Données pour le tableau des conversions
 */
export const conversionTableData = [
  {
    id: "CONV-001",
    date: "2023-12-01",
    source: "Recherche organique",
    channel: "Site web",
    device: "Desktop",
    category: "Sports nautiques",
    value: "95,00 €",
  },
  {
    id: "CONV-002",
    date: "2023-12-01",
    source: "Réseaux sociaux",
    channel: "Application mobile",
    device: "Mobile",
    category: "Bien-être",
    value: "75,00 €",
  },
  {
    id: "CONV-003",
    date: "2023-12-02",
    source: "Email marketing",
    channel: "Site web",
    device: "Desktop",
    category: "Gastronomie",
    value: "120,00 €",
  },
  {
    id: "CONV-004",
    date: "2023-12-02",
    source: "Trafic direct",
    channel: "Application mobile",
    device: "Mobile",
    category: "Randonnée",
    value: "85,00 €",
  },
  {
    id: "CONV-005",
    date: "2023-12-03",
    source: "Référencement payant",
    channel: "Site web",
    device: "Tablette",
    category: "Culture",
    value: "65,00 €",
  },
  {
    id: "CONV-006",
    date: "2023-12-03",
    source: "Recherche organique",
    channel: "Application mobile",
    device: "Mobile",
    category: "Aventure",
    value: "110,00 €",
  },
  {
    id: "CONV-007",
    date: "2023-12-04",
    source: "Réseaux sociaux",
    channel: "Site web",
    device: "Desktop",
    category: "Sports nautiques",
    value: "90,00 €",
  },
  {
    id: "CONV-008",
    date: "2023-12-04",
    source: "Trafic direct",
    channel: "Téléphone",
    device: "Mobile",
    category: "Bien-être",
    value: "80,00 €",
  },
  {
    id: "CONV-009",
    date: "2023-12-05",
    source: "Email marketing",
    channel: "Site web",
    device: "Desktop",
    category: "Gastronomie",
    value: "130,00 €",
  },
  {
    id: "CONV-010",
    date: "2023-12-05",
    source: "Partenaires",
    channel: "Partenaires",
    device: "Mobile",
    category: "Randonnée",
    value: "95,00 €",
  },
];
