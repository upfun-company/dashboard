import type { Meta, StoryObj } from "@storybook/react";
import StatsList from "./StatsList";
import {
  Users,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  Activity,
} from "lucide-react";

const meta: Meta<typeof StatsList> = {
  title: "Organisms/StatsList",
  component: StatsList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onStatClick: { action: "stat clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof StatsList>;

const mockStats = [
  {
    id: "users",
    title: "Utilisateurs",
    value: "1,234",
    change: 12.5,
    icon: Users,
    iconColor: "primary",
  },
  {
    id: "reservations",
    title: "Réservations",
    value: "856",
    change: 8.2,
    icon: ShoppingCart,
    iconColor: "success",
  },
  {
    id: "revenue",
    title: "Chiffre d'affaires",
    value: "45,678 €",
    change: -2.4,
    icon: CreditCard,
    iconColor: "warning",
  },
  {
    id: "growth",
    title: "Croissance",
    value: "15.3%",
    change: 5.1,
    icon: TrendingUp,
    iconColor: "info",
  },
];

export const Default: Story = {
  args: {
    stats: mockStats,
  },
};

export const WithClickHandler: Story = {
  args: {
    stats: mockStats,
    onStatClick: (statId) => console.log(`Stat clicked: ${statId}`),
  },
};

export const Empty: Story = {
  args: {
    stats: [],
  },
};

export const SingleStat: Story = {
  args: {
    stats: [
      {
        id: "activity",
        title: "Activité",
        value: "Élevée",
        icon: Activity,
        iconColor: "danger",
      },
    ],
  },
};
