/**
 * Stories pour le composant AnalyticsReportContent
 */

import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import AnalyticsReportContent from "./AnalyticsReportContent";
import {
  revenueChartData,
  revenueByCategoryTableData,
  financialSummaryData,
  userChartData,
} from "@/mocks/analyticsReportsMocks";

const meta = {
  title: "Organisms/AnalyticsReportContent",
  component: AnalyticsReportContent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[1000px] p-6 border rounded-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AnalyticsReportContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Exemple de rapport avec graphique linéaire
 */
export const ChartReport: Story = {
  args: {
    reportData: {
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
      chartData: revenueChartData,
    },
  },
};

/**
 * Exemple de rapport avec tableau
 */
export const TableReport: Story = {
  args: {
    reportData: {
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
  },
};

/**
 * Exemple de rapport avec résumé
 */
export const SummaryReport: Story = {
  args: {
    reportData: {
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
  },
};

/**
 * Exemple de rapport mixte
 */
export const MixedReport: Story = {
  args: {
    reportData: {
      id: "user-overview",
      title: "Vue d'ensemble utilisateurs",
      description: "Analyse complète des utilisateurs",
      lastUpdated: "15 juin 2023, 14:30",
      period: "Janvier - Juin 2023",
      category: "user",
      type: "mixed",
      filters: [
        { name: "Période", value: "6 derniers mois" },
        { name: "Segmentation", value: "Par statut" },
      ],
      exportFormats: ["pdf", "csv", "excel", "image"],
      summaryData: {
        utilisateurs_totaux: 5000,
        nouveaux_utilisateurs: 250,
        taux_croissance: "+5%",
        taux_rétention: "78%",
      },
      chartData: userChartData,
      tableData: [
        {
          segment: "Nouveaux",
          nombre: 250,
          pourcentage: "5%",
          évolution: "+12%",
        },
        {
          segment: "Actifs",
          nombre: 3900,
          pourcentage: "78%",
          évolution: "+3%",
        },
        {
          segment: "Inactifs",
          nombre: 1100,
          pourcentage: "22%",
          évolution: "-2%",
        },
      ],
    },
  },
};
