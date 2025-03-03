import type { Meta, StoryObj } from "@storybook/react";
import { CommissionSettings } from "./CommissionSettings";
import { generateMockCommissions } from "@/mocks/financeMocks";

const meta: Meta<typeof CommissionSettings> = {
  title: "Organisms/CommissionSettings",
  component: CommissionSettings,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onAddCommission: { action: "onAddCommission" },
    onUpdateCommission: { action: "onUpdateCommission" },
    onDeleteCommission: { action: "onDeleteCommission" },
  },
};

export default meta;
type Story = StoryObj<typeof CommissionSettings>;

// Générer des données de test
const mockCommissions = generateMockCommissions(10);

export const Default: Story = {
  args: {
    commissions: mockCommissions,
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    commissions: mockCommissions,
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    commissions: [],
    isLoading: false,
  },
};

export const WithFewCommissions: Story = {
  args: {
    commissions: mockCommissions.slice(0, 3),
    isLoading: false,
  },
};
