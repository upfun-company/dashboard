import type { Meta, StoryObj } from "@storybook/react";
import MetricsComparison from "./MetricsComparison";
import { MetricsComparisonData } from "./MetricsComparison";

const meta: Meta<typeof MetricsComparison> = {
  title: "Organisms/MetricsComparison",
  component: MetricsComparison,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MetricsComparison>;

// Données de démonstration pour la comparaison de métriques
const demoComparisonData: MetricsComparisonData = {
  title: "Comparaison des réservations par jour de la semaine",
  description:
    "Analyse des réservations quotidiennes et comparaison avec la période précédente",
  currentPeriod: "Cette semaine",
  previousPeriod: "Semaine précédente",
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

export const BarsChart: Story = {
  args: {
    data: demoComparisonData,
    visualizationType: "bars",
  },
};

export const LinesChart: Story = {
  args: {
    data: demoComparisonData,
    visualizationType: "lines",
  },
};

export const PieChart: Story = {
  args: {
    data: demoComparisonData,
    visualizationType: "pie",
  },
};

export const ProgressChart: Story = {
  args: {
    data: demoComparisonData,
    visualizationType: "progress",
  },
};

export const WithCustomClass: Story = {
  args: {
    data: demoComparisonData,
    visualizationType: "bars",
    className: "max-w-4xl",
  },
};

export const WithCustomColors: Story = {
  args: {
    data: {
      ...demoComparisonData,
      metrics: demoComparisonData.metrics.map((metric, index) => ({
        ...metric,
        color: [
          "#ff6b6b",
          "#48dbfb",
          "#1dd1a1",
          "#feca57",
          "#ff9ff3",
          "#54a0ff",
          "#5f27cd",
        ][index],
      })),
    },
    visualizationType: "bars",
  },
};
