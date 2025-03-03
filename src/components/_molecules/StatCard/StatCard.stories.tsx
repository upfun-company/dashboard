/**
 * Stories pour le composant StatCard
 */

import type { Meta, StoryObj } from "@storybook/react";
import StatCard from "./StatCard";
import {
  ShoppingCart,
  Users,
  CreditCard,
  TrendingUp,
  Activity,
} from "lucide-react";

/**
 * Métadonnées pour les stories du composant StatCard
 */
const meta: Meta<typeof StatCard> = {
  title: "Molecules/StatCard",
  component: StatCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    title: { control: "text" },
    value: { control: "text" },
    change: { control: "number" },
    period: { control: "text" },
    iconColor: {
      control: "select",
      options: ["primary", "success", "warning", "danger", "info"],
    },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Story par défaut
 */
export const Default: Story = {
  args: {
    title: "Utilisateurs",
    value: "1,234",
    change: 12.5,
    period: "depuis le mois dernier",
    icon: Users,
    iconColor: "primary",
  },
};

/**
 * Story sans changement
 */
export const WithoutChange: Story = {
  args: {
    title: "Réservations",
    value: "856",
    icon: ShoppingCart,
    iconColor: "success",
  },
};

/**
 * Story avec changement négatif
 */
export const NegativeChange: Story = {
  args: {
    title: "Chiffre d'affaires",
    value: "45,678 €",
    change: -2.4,
    icon: CreditCard,
    iconColor: "warning",
  },
};

/**
 * Story avec tous les variants
 */
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
      <StatCard
        title="Utilisateurs"
        value="1,234"
        change={12.5}
        icon={Users}
        iconColor="primary"
      />
      <StatCard
        title="Réservations"
        value="856"
        change={8.2}
        icon={ShoppingCart}
        iconColor="success"
      />
      <StatCard
        title="Chiffre d'affaires"
        value="45,678 €"
        change={-2.4}
        icon={CreditCard}
        iconColor="warning"
      />
      <StatCard
        title="Croissance"
        value="15.3%"
        change={5.1}
        icon={TrendingUp}
        iconColor="info"
      />
      <StatCard
        title="Activité"
        value="Élevée"
        icon={Activity}
        iconColor="danger"
      />
    </div>
  ),
};

/**
 * Story avec icône
 */
export const WithIcon: Story = {
  args: {
    title: "Nouveaux utilisateurs",
    value: "256",
    change: 8.7,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
};

/**
 * Story avec tendance positive
 */
export const WithPositiveChange: Story = {
  args: {
    title: "Chiffre d'affaires",
    value: "45,678 €",
    change: 12.5,
    period: "vs mois dernier",
  },
};

/**
 * Story avec tendance négative
 */
export const WithNegativeChange: Story = {
  args: {
    title: "Taux d'annulation",
    value: "4.2%",
    change: -2.3,
    period: "vs mois dernier",
  },
};

/**
 * Story avec infobulle
 */
export const WithTooltip: Story = {
  args: {
    title: "Réservations",
    value: "438",
    icon: <ShoppingCart size={24} />,
    iconColor: "#ff9800",
    changePercentage: 8.7,
    subtitle: "Ce mois-ci",
    tooltip: "Nombre total de réservations effectuées ce mois-ci",
  },
};

/**
 * Story avec couleur de fond personnalisée
 */
export const CustomBackground: Story = {
  args: {
    title: "Commissions",
    value: "3,456 €",
    change: 5.4,
    onClick: () => alert("Carte cliquée !"),
  },
};

export const Clickable: Story = {
  args: {
    title: "Commissions",
    value: "3,456 €",
    change: 5.4,
    onClick: () => alert("Carte cliquée !"),
  },
};
