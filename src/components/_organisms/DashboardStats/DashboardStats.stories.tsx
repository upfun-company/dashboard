/**
 * Stories pour le composant DashboardStats
 */

import type { Meta, StoryObj } from "@storybook/react";
import DashboardStats from "./DashboardStats";
import { dashboardMocks } from "@/mocks";

/**
 * Métadonnées pour les stories du composant DashboardStats
 */
const meta: Meta<typeof DashboardStats> = {
  title: "_Organisms/DashboardStats",
  component: DashboardStats,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Utilisation des mocks centralisés
const { stats, changes } = dashboardMocks;

/**
 * Story par défaut
 */
export const Default: Story = {
  args: {
    stats: stats,
  },
};

/**
 * Story avec pourcentages de changement
 */
export const WithChanges: Story = {
  args: {
    stats: stats,
    changes: changes,
  },
};

/**
 * Story avec période de comparaison personnalisée
 */
export const CustomPeriod: Story = {
  args: {
    stats: stats,
    changes: changes,
    comparisonPeriod: "Depuis la semaine dernière",
  },
};

/**
 * Story avec tous les changements positifs
 */
export const AllPositiveChanges: Story = {
  args: {
    stats: stats,
    changes: {
      totalReservations: 12.3,
      conversionRate: 5.2,
      totalRevenue: 8.7,
      averageResponseRate: 3.1,
      pendingTransactionsVolume: 2.5,
      totalCommissions: 15.8,
    },
  },
};

/**
 * Story avec tous les changements négatifs
 */
export const AllNegativeChanges: Story = {
  args: {
    stats: stats,
    changes: {
      totalReservations: -12.3,
      conversionRate: -5.2,
      totalRevenue: -8.7,
      averageResponseRate: -3.1,
      pendingTransactionsVolume: -4.5,
      totalCommissions: -15.8,
    },
  },
};
