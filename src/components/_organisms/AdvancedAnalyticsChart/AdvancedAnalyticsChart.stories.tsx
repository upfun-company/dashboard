import type { Meta, StoryObj } from "@storybook/react";
import AdvancedAnalyticsChart from "./AdvancedAnalyticsChart";
import { TimeSeriesData, VisualizationOptions } from "./AdvancedAnalyticsChart";

const meta: Meta<typeof AdvancedAnalyticsChart> = {
  title: "Organisms/AdvancedAnalyticsChart",
  component: AdvancedAnalyticsChart,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AdvancedAnalyticsChart>;

// Données de séries temporelles de démonstration
const demoTimeSeriesData: TimeSeriesData = {
  title: "Réservations mensuelles",
  xAxisLabel: "Mois",
  yAxisLabel: "Nombre de réservations",
  series: [
    {
      id: "currentPeriod",
      name: "Période actuelle",
      data: [
        { x: "Jan", y: 120 },
        { x: "Fév", y: 150 },
        { x: "Mar", y: 180 },
        { x: "Avr", y: 220 },
        { x: "Mai", y: 250 },
        { x: "Juin", y: 280 },
        { x: "Juil", y: 310 },
        { x: "Août", y: 290 },
        { x: "Sept", y: 260 },
        { x: "Oct", y: 230 },
        { x: "Nov", y: 200 },
        { x: "Déc", y: 170 },
      ],
      color: "#4f46e5",
    },
    {
      id: "previousPeriod",
      name: "Période précédente",
      data: [
        { x: "Jan", y: 100 },
        { x: "Fév", y: 130 },
        { x: "Mar", y: 160 },
        { x: "Avr", y: 190 },
        { x: "Mai", y: 220 },
        { x: "Juin", y: 250 },
        { x: "Juil", y: 280 },
        { x: "Août", y: 260 },
        { x: "Sept", y: 230 },
        { x: "Oct", y: 200 },
        { x: "Nov", y: 170 },
        { x: "Déc", y: 140 },
      ],
      color: "#94a3b8",
    },
  ],
};

// Options de visualisation par défaut
const defaultVisualizationOptions: VisualizationOptions = {
  chartType: "line",
  stacked: false,
  showLegend: true,
  showGrid: true,
  showTooltip: true,
  showDataLabels: false,
  colorScheme: "default",
};

export const LineChart: Story = {
  args: {
    data: demoTimeSeriesData,
    visualizationOptions: {
      ...defaultVisualizationOptions,
      chartType: "line",
    },
    onVisualizationOptionsChange: (options) =>
      console.log("Options changed:", options),
    className: "w-full max-w-7xl h-[400px]",
  },
};

export const BarChart: Story = {
  args: {
    data: demoTimeSeriesData,
    visualizationOptions: {
      ...defaultVisualizationOptions,
      chartType: "bar",
    },
    onVisualizationOptionsChange: (options) =>
      console.log("Options changed:", options),
    className: "w-full max-w-7xl h-[400px]",
  },
};

export const AreaChart: Story = {
  args: {
    data: demoTimeSeriesData,
    visualizationOptions: {
      ...defaultVisualizationOptions,
      chartType: "area",
    },
    onVisualizationOptionsChange: (options) =>
      console.log("Options changed:", options),
    className: "w-full max-w-7xl h-[400px]",
  },
};

export const StackedBarChart: Story = {
  args: {
    data: {
      ...demoTimeSeriesData,
      series: [
        ...demoTimeSeriesData.series,
        {
          id: "target",
          name: "Objectif",
          data: [
            { x: "Jan", y: 130 },
            { x: "Fév", y: 160 },
            { x: "Mar", y: 190 },
            { x: "Avr", y: 220 },
            { x: "Mai", y: 250 },
            { x: "Juin", y: 280 },
            { x: "Juil", y: 310 },
            { x: "Août", y: 290 },
            { x: "Sept", y: 270 },
            { x: "Oct", y: 240 },
            { x: "Nov", y: 210 },
            { x: "Déc", y: 180 },
          ],
          color: "#10b981",
        },
      ],
    },
    visualizationOptions: {
      ...defaultVisualizationOptions,
      chartType: "bar",
      stacked: true,
    },
    onVisualizationOptionsChange: (options) =>
      console.log("Options changed:", options),
    className: "w-full max-w-7xl h-[400px]",
  },
};

export const WithDataLabels: Story = {
  args: {
    data: demoTimeSeriesData,
    visualizationOptions: {
      ...defaultVisualizationOptions,
      chartType: "line",
      showDataLabels: true,
    },
    onVisualizationOptionsChange: (options) =>
      console.log("Options changed:", options),
    className: "w-full max-w-7xl h-[400px]",
  },
};

export const WithCustomColorScheme: Story = {
  args: {
    data: demoTimeSeriesData,
    visualizationOptions: {
      ...defaultVisualizationOptions,
      chartType: "line",
      colorScheme: "vibrant",
    },
    onVisualizationOptionsChange: (options) =>
      console.log("Options changed:", options),
    className: "w-full max-w-7xl h-[400px]",
  },
};
