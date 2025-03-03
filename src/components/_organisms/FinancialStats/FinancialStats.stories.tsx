import type { Meta, StoryObj } from "@storybook/react";
import { FinancialStats } from "./FinancialStats";
import { generateMockFinancialStats } from "@/mocks/financeMocks";

const meta: Meta<typeof FinancialStats> = {
  title: "Organisms/FinancialStats",
  component: FinancialStats,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FinancialStats>;

// Générer des données de test
const mockStats = generateMockFinancialStats();

export const Default: Story = {
  args: {
    stats: mockStats,
    period: "month",
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    stats: mockStats,
    period: "month",
    isLoading: true,
  },
};

export const DailyView: Story = {
  args: {
    stats: mockStats,
    period: "day",
    isLoading: false,
  },
};

export const WeeklyView: Story = {
  args: {
    stats: mockStats,
    period: "week",
    isLoading: false,
  },
};

export const YearlyView: Story = {
  args: {
    stats: mockStats,
    period: "year",
    isLoading: false,
  },
};
