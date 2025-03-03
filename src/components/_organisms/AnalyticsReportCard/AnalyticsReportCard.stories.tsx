import type { Meta, StoryObj } from "@storybook/react";
import AnalyticsReportCard from "./AnalyticsReportCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * Données d'exemple pour les graphiques
 */
const sampleData = [
  { name: "Jan", valeur: 4000, période_précédente: 2400 },
  { name: "Fév", valeur: 3000, période_précédente: 1398 },
  { name: "Mar", valeur: 2000, période_précédente: 9800 },
  { name: "Avr", valeur: 2780, période_précédente: 3908 },
  { name: "Mai", valeur: 1890, période_précédente: 4800 },
  { name: "Juin", valeur: 2390, période_précédente: 3800 },
];

/**
 * Composant de graphique d'exemple
 */
const SampleChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={sampleData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="valeur" fill="#8884d8" name="Période actuelle" />
      <Bar
        dataKey="période_précédente"
        fill="#82ca9d"
        name="Période précédente"
      />
    </BarChart>
  </ResponsiveContainer>
);

/**
 * Métadonnées du composant pour Storybook
 */
const meta: Meta<typeof AnalyticsReportCard> = {
  title: "Organisms/AnalyticsReportCard",
  component: AnalyticsReportCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onExport: { action: "export" },
    onShare: { action: "share" },
    onRefresh: { action: "refresh" },
    onFilterClick: { action: "filter click" },
  },
};

export default meta;
type Story = StoryObj<typeof AnalyticsReportCard>;

/**
 * Exemple de base
 */
export const Default: Story = {
  args: {
    title: "Rapport de ventes",
    description: "Analyse des ventes par mois",
    lastUpdated: "15 juin 2023, 14:30",
    period: "Juin 2023",
    filters: [
      { name: "Région", value: "Europe" },
      { name: "Catégorie", value: "Électronique" },
    ],
    exportFormats: ["pdf", "csv", "excel", "image"],
    children: <SampleChart />,
  },
};

/**
 * Exemple avec état de chargement
 */
export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};

/**
 * Exemple sans filtres
 */
export const NoFilters: Story = {
  args: {
    ...Default.args,
    filters: [],
  },
};

/**
 * Exemple sans options d'exportation
 */
export const NoExport: Story = {
  args: {
    ...Default.args,
    exportFormats: [],
  },
};

/**
 * Exemple avec contenu personnalisé
 */
export const CustomContent: Story = {
  args: {
    ...Default.args,
    title: "Rapport de performance",
    description: "Analyse des performances par équipe",
    children: (
      <div className="space-y-4">
        <div className="rounded-md bg-muted p-4">
          <h3 className="mb-2 text-sm font-medium">Points clés</h3>
          <ul className="list-inside list-disc space-y-1 text-sm">
            <li>
              Augmentation des ventes de 15% par rapport au mois précédent
            </li>
            <li>Nouveaux clients: 120 (+5%)</li>
            <li>Taux de conversion: 3.2% (+0.5%)</li>
            <li>Panier moyen: 85€ (+10€)</li>
          </ul>
        </div>
        <SampleChart />
      </div>
    ),
  },
};

/**
 * Exemple avec tous les boutons d'action
 */
export const AllActions: Story = {
  args: {
    ...Default.args,
    onFilterClick: () => console.log("Filter clicked"),
    onRefresh: () => console.log("Refresh clicked"),
    onShare: () => console.log("Share clicked"),
    onExport: (format) => console.log(`Export to ${format}`),
  },
};

/**
 * Exemple avec une mise en page large
 */
export const FullWidth: Story = {
  args: {
    ...Default.args,
    className: "max-w-none",
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      story: {
        inline: false,
        iframeHeight: 500,
      },
    },
  },
};
