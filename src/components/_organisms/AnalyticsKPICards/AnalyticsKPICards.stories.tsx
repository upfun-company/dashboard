import type { Meta, StoryObj } from "@storybook/react";
import AnalyticsKPICards from "./AnalyticsKPICards";
import {
  LucideBarChart,
  LucideUsers,
  LucideCalendarCheck,
  LucidePercent,
  LucideDollarSign,
  LucideCheckCircle,
} from "lucide-react";

const meta: Meta<typeof AnalyticsKPICards> = {
  title: "Organisms/AnalyticsKPICards",
  component: AnalyticsKPICards,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AnalyticsKPICards>;

// Données de démonstration pour les KPIs
const demoKPIs = [
  {
    id: "total-reservations",
    title: "Réservations totales",
    value: 1248,
    previousValue: 1100,
    changePercentage: 13.45,
    format: "standard",
    icon: LucideCalendarCheck,
    color: "blue",
    tooltip: "Nombre total de réservations sur la période sélectionnée",
  },
  {
    id: "avg-booking-value",
    title: "Valeur moyenne",
    value: 89.5,
    previousValue: 75.8,
    changePercentage: 18.07,
    format: "currency",
    icon: LucideDollarSign,
    color: "green",
    tooltip: "Valeur moyenne des réservations sur la période sélectionnée",
  },
  {
    id: "completion-rate",
    title: "Taux de complétion",
    value: 0.89,
    previousValue: 0.82,
    changePercentage: 8.54,
    format: "percent",
    icon: LucideCheckCircle,
    color: "green",
    tooltip: "Pourcentage de réservations complétées avec succès",
  },
  {
    id: "cancellation-rate",
    title: "Taux d'annulation",
    value: 0.07,
    previousValue: 0.09,
    changePercentage: -22.22,
    format: "percent",
    icon: LucidePercent,
    color: "yellow",
    tooltip: "Pourcentage de réservations annulées",
  },
  {
    id: "avg-group-size",
    title: "Taille moyenne groupe",
    value: 3.2,
    previousValue: 2.8,
    changePercentage: 14.29,
    format: "standard",
    icon: LucideUsers,
    color: "blue",
    tooltip: "Nombre moyen de participants par réservation",
  },
  {
    id: "repeat-bookings",
    title: "Réservations répétées",
    value: 428,
    previousValue: 350,
    changePercentage: 22.29,
    format: "standard",
    icon: LucideBarChart,
    color: "green",
    tooltip: "Nombre de clients ayant effectué plus d'une réservation",
  },
];

export const Default: Story = {
  args: {
    kpis: demoKPIs,
  },
};

export const WithClickHandler: Story = {
  args: {
    kpis: demoKPIs,
    onKPIClick: (kpiId) => {
      console.log(`KPI clicked: ${kpiId}`);
    },
  },
};

export const WithCustomClass: Story = {
  args: {
    kpis: demoKPIs,
    className: "gap-6",
  },
};

export const TwoKPIs: Story = {
  args: {
    kpis: demoKPIs.slice(0, 2),
  },
};

export const FourKPIs: Story = {
  args: {
    kpis: demoKPIs.slice(0, 4),
  },
};
