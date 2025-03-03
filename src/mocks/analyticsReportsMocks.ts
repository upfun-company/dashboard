/**
 * Mocks pour les rapports analytiques
 */

import { ExportFormat } from "@/components/_organisms/AnalyticsReportCard/AnalyticsReportCard";

// Définir les types spécifiques pour les différents types de données
export interface ChartDataItem {
  date?: string; // Pour les données existantes qui utilisent 'date' au lieu de 'name'
  name?: string; // Optionnel pour être compatible avec les deux formats
  [key: string]: string | number | undefined;
}

export interface TableDataItem {
  [key: string]: string | number | boolean | Date;
}

export type SummaryDataType = Record<string, string | number | boolean | Date>;

/**
 * Interface pour les données de rapport
 */
export interface ReportData {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  period: string;
  category: "financial" | "performance" | "user" | "provider" | "marketing";
  type: "chart" | "table" | "summary" | "mixed";
  filters: Array<{
    name: string;
    value: string;
  }>;
  exportFormats: ExportFormat[];
  chartData?: ChartDataItem[];
  tableData?: TableDataItem[];
  summaryData?: SummaryDataType;
}

/**
 * Données de graphique pour les rapports de revenus
 */
export const reportsRevenueChartData: ChartDataItem[] = [
  { date: "2023-01-01", revenus: 12500, objectif: 10000 },
  { date: "2023-02-01", revenus: 14200, objectif: 12000 },
  { date: "2023-03-01", revenus: 15800, objectif: 14000 },
  { date: "2023-04-01", revenus: 16900, objectif: 16000 },
  { date: "2023-05-01", revenus: 18500, objectif: 18000 },
  { date: "2023-06-01", revenus: 21000, objectif: 20000 },
];

// Alias pour la compatibilité avec le code existant
export const revenueChartData = reportsRevenueChartData;

/**
 * Données de graphique pour les rapports d'utilisateurs
 */
export const userChartData: ChartDataItem[] = [
  { date: "2023-01-01", nouveaux: 120, actifs: 450, inactifs: 30 },
  { date: "2023-02-01", nouveaux: 145, actifs: 480, inactifs: 35 },
  { date: "2023-03-01", nouveaux: 165, actifs: 520, inactifs: 40 },
  { date: "2023-04-01", nouveaux: 190, actifs: 580, inactifs: 45 },
  { date: "2023-05-01", nouveaux: 210, actifs: 650, inactifs: 50 },
  { date: "2023-06-01", nouveaux: 250, actifs: 720, inactifs: 55 },
];

/**
 * Données de graphique pour les rapports de conversion
 */
export const conversionChartData: ChartDataItem[] = [
  { date: "2023-01-01", taux: 2.1, moyenne_secteur: 1.8 },
  { date: "2023-02-01", taux: 2.3, moyenne_secteur: 1.9 },
  { date: "2023-03-01", taux: 2.7, moyenne_secteur: 2.0 },
  { date: "2023-04-01", taux: 3.0, moyenne_secteur: 2.1 },
  { date: "2023-05-01", taux: 3.2, moyenne_secteur: 2.2 },
  { date: "2023-06-01", taux: 3.5, moyenne_secteur: 2.3 },
];

/**
 * Données de graphique pour les rapports de performance des prestataires
 */
export const providerPerformanceChartData: ChartDataItem[] = [
  { date: "2023-01-01", satisfaction: 4.2, réservations: 85 },
  { date: "2023-02-01", satisfaction: 4.3, réservations: 92 },
  { date: "2023-03-01", satisfaction: 4.4, réservations: 105 },
  { date: "2023-04-01", satisfaction: 4.5, réservations: 120 },
  { date: "2023-05-01", satisfaction: 4.6, réservations: 135 },
  { date: "2023-06-01", satisfaction: 4.7, réservations: 150 },
];

/**
 * Données de tableau pour le rapport de revenus par catégorie
 */
export const revenueByCategoryTableData: TableDataItem[] = [
  {
    id: 1,
    catégorie: "Bien-être",
    revenus: 45000,
    pourcentage: 30,
    évolution: "+12%",
  },
  {
    id: 2,
    catégorie: "Sport",
    revenus: 35000,
    pourcentage: 23.3,
    évolution: "+8%",
  },
  {
    id: 3,
    catégorie: "Loisirs",
    revenus: 30000,
    pourcentage: 20,
    évolution: "+15%",
  },
  {
    id: 4,
    catégorie: "Culture",
    revenus: 25000,
    pourcentage: 16.7,
    évolution: "+5%",
  },
  {
    id: 5,
    catégorie: "Gastronomie",
    revenus: 15000,
    pourcentage: 10,
    évolution: "+20%",
  },
];

/**
 * Données de tableau pour le rapport de performance des prestataires
 */
export const topProvidersTableData: TableDataItem[] = [
  {
    id: 1,
    nom: "Spa Zen",
    catégorie: "Bien-être",
    revenus: 12500,
    réservations: 250,
    satisfaction: 4.8,
  },
  {
    id: 2,
    nom: "FitClub",
    catégorie: "Sport",
    revenus: 10800,
    réservations: 180,
    satisfaction: 4.7,
  },
  {
    id: 3,
    nom: "Escape Game XYZ",
    catégorie: "Loisirs",
    revenus: 9500,
    réservations: 120,
    satisfaction: 4.9,
  },
  {
    id: 4,
    nom: "Musée d'Art Moderne",
    catégorie: "Culture",
    revenus: 8200,
    réservations: 410,
    satisfaction: 4.6,
  },
  {
    id: 5,
    nom: "Restaurant Gourmet",
    catégorie: "Gastronomie",
    revenus: 7800,
    réservations: 95,
    satisfaction: 4.8,
  },
];

/**
 * Données de résumé pour le rapport financier
 */
export const financialSummaryData: SummaryDataType = {
  revenus_totaux: 150000,
  évolution_revenus: "+15%",
  panier_moyen: 85,
  évolution_panier: "+5%",
  commission_moyenne: "12.5%",
  évolution_commission: "+0.5%",
  revenus_par_utilisateur: 35,
  évolution_revenus_utilisateur: "+8%",
};

/**
 * Données de résumé pour le rapport utilisateurs
 */
export const userSummaryData: SummaryDataType = {
  utilisateurs_totaux: 5000,
  nouveaux_utilisateurs: 250,
  taux_croissance: "+5%",
  taux_rétention: "78%",
  utilisateurs_actifs: 3900,
  taux_activité: "78%",
  utilisateurs_inactifs: 1100,
  taux_inactivité: "22%",
};

/**
 * Liste des rapports disponibles
 */
export const availableReports: ReportData[] = [
  {
    id: "revenue-trend",
    title: "Évolution des revenus",
    description: "Analyse de l'évolution des revenus sur les 6 derniers mois",
    lastUpdated: "15 juin 2023, 14:30",
    period: "Janvier - Juin 2023",
    category: "financial",
    type: "chart",
    filters: [
      { name: "Période", value: "6 derniers mois" },
      { name: "Comparaison", value: "Objectifs" },
    ],
    exportFormats: ["pdf", "csv", "excel", "image"],
    chartData: reportsRevenueChartData,
  },
  {
    id: "revenue-by-category",
    title: "Revenus par catégorie",
    description: "Répartition des revenus par catégorie d'activité",
    lastUpdated: "15 juin 2023, 14:30",
    period: "Juin 2023",
    category: "financial",
    type: "table",
    filters: [{ name: "Période", value: "Juin 2023" }],
    exportFormats: ["pdf", "csv", "excel"],
    tableData: revenueByCategoryTableData,
  },
  {
    id: "financial-summary",
    title: "Résumé financier",
    description: "Indicateurs financiers clés",
    lastUpdated: "15 juin 2023, 14:30",
    period: "Juin 2023",
    category: "financial",
    type: "summary",
    filters: [
      { name: "Période", value: "Juin 2023" },
      { name: "Comparaison", value: "Mai 2023" },
    ],
    exportFormats: ["pdf", "csv"],
    summaryData: financialSummaryData,
  },
  {
    id: "user-growth",
    title: "Croissance utilisateurs",
    description: "Évolution du nombre d'utilisateurs",
    lastUpdated: "15 juin 2023, 14:30",
    period: "Janvier - Juin 2023",
    category: "user",
    type: "chart",
    filters: [
      { name: "Période", value: "6 derniers mois" },
      { name: "Segmentation", value: "Par statut" },
    ],
    exportFormats: ["pdf", "csv", "excel", "image"],
    chartData: userChartData,
  },
  {
    id: "user-summary",
    title: "Résumé utilisateurs",
    description: "Indicateurs clés sur les utilisateurs",
    lastUpdated: "15 juin 2023, 14:30",
    period: "Juin 2023",
    category: "user",
    type: "summary",
    filters: [
      { name: "Période", value: "Juin 2023" },
      { name: "Comparaison", value: "Mai 2023" },
    ],
    exportFormats: ["pdf", "csv"],
    summaryData: userSummaryData,
  },
  {
    id: "conversion-rate",
    title: "Taux de conversion",
    description: "Évolution du taux de conversion",
    lastUpdated: "15 juin 2023, 14:30",
    period: "Janvier - Juin 2023",
    category: "marketing",
    type: "chart",
    filters: [
      { name: "Période", value: "6 derniers mois" },
      { name: "Comparaison", value: "Moyenne du secteur" },
    ],
    exportFormats: ["pdf", "csv", "excel", "image"],
    chartData: conversionChartData,
  },
  {
    id: "provider-performance",
    title: "Performance prestataires",
    description: "Analyse de la performance des prestataires",
    lastUpdated: "15 juin 2023, 14:30",
    period: "Janvier - Juin 2023",
    category: "provider",
    type: "chart",
    filters: [
      { name: "Période", value: "6 derniers mois" },
      { name: "Indicateurs", value: "Satisfaction et réservations" },
    ],
    exportFormats: ["pdf", "csv", "excel", "image"],
    chartData: providerPerformanceChartData,
  },
  {
    id: "top-providers",
    title: "Top prestataires",
    description: "Classement des meilleurs prestataires",
    lastUpdated: "15 juin 2023, 14:30",
    period: "Juin 2023",
    category: "provider",
    type: "table",
    filters: [
      { name: "Période", value: "Juin 2023" },
      { name: "Tri", value: "Par revenus" },
    ],
    exportFormats: ["pdf", "csv", "excel"],
    tableData: topProvidersTableData,
  },
];

/**
 * Fonction pour obtenir un rapport par son ID
 */
export const getReportById = (id: string): ReportData | undefined => {
  return availableReports.find((report) => report.id === id);
};

/**
 * Fonction pour obtenir les rapports par catégorie
 */
export const getReportsByCategory = (
  category: ReportData["category"]
): ReportData[] => {
  return availableReports.filter((report) => report.category === category);
};
