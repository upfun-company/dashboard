import type { Meta, StoryObj } from "@storybook/react";
import DashboardCharts from "./DashboardCharts";
import {
  ReservationChartData,
  RevenueChartData,
  UsersChartData,
} from "./DashboardCharts";

const meta: Meta<typeof DashboardCharts> = {
  title: "Organisms/DashboardCharts",
  component: DashboardCharts,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DashboardCharts>;

const mockReservationData: ReservationChartData[] = [
  { name: "Jan", value: 65 },
  { name: "Fév", value: 59 },
  { name: "Mar", value: 80 },
  { name: "Avr", value: 81 },
  { name: "Mai", value: 56 },
  { name: "Juin", value: 95 },
  { name: "Juil", value: 120 },
];

const mockRevenueData: RevenueChartData[] = [
  { name: "Jan", revenue: 4000, commission: 400 },
  { name: "Fév", revenue: 3000, commission: 300 },
  { name: "Mar", revenue: 5000, commission: 500 },
  { name: "Avr", revenue: 4500, commission: 450 },
  { name: "Mai", revenue: 3500, commission: 350 },
  { name: "Juin", revenue: 6000, commission: 600 },
  { name: "Juil", revenue: 7500, commission: 750 },
];

const mockUsersData: UsersChartData[] = [
  { name: "Jan", nouveaux: 40, actifs: 240 },
  { name: "Fév", nouveaux: 30, actifs: 260 },
  { name: "Mar", nouveaux: 45, actifs: 290 },
  { name: "Avr", nouveaux: 50, actifs: 320 },
  { name: "Mai", nouveaux: 35, actifs: 340 },
  { name: "Juin", nouveaux: 60, actifs: 380 },
  { name: "Juil", nouveaux: 75, actifs: 420 },
];

export const Default: Story = {
  args: {
    reservationsData: mockReservationData,
    revenueData: mockRevenueData,
    usersData: mockUsersData,
    title: "Analyse graphique",
  },
};

export const CustomTitle: Story = {
  args: {
    reservationsData: mockReservationData,
    revenueData: mockRevenueData,
    usersData: mockUsersData,
    title: "Statistiques du tableau de bord",
  },
};
