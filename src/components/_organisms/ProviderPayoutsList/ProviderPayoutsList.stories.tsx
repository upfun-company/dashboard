import type { Meta, StoryObj } from "@storybook/react";
import { ProviderPayoutsList } from "./ProviderPayoutsList";
import { generateMockProviderPayouts } from "@/mocks/financeMocks";

const meta: Meta<typeof ProviderPayoutsList> = {
  title: "Organisms/ProviderPayoutsList",
  component: ProviderPayoutsList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onPageChange: { action: "onPageChange" },
    onFiltersChange: { action: "onFiltersChange" },
    onPayoutClick: { action: "onPayoutClick" },
    onExportPayouts: { action: "onExportPayouts" },
    onCreatePayout: { action: "onCreatePayout" },
    onProcessPayout: { action: "onProcessPayout" },
  },
};

export default meta;
type Story = StoryObj<typeof ProviderPayoutsList>;

// Générer des données de test
const mockPayouts = generateMockProviderPayouts(30);

export const Default: Story = {
  args: {
    payouts: mockPayouts.slice(0, 10),
    totalCount: 30,
    currentPage: 1,
    pageSize: 10,
    filters: {
      search: "",
      sortBy: "createdAt",
      sortDirection: "desc",
    },
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    payouts: mockPayouts.slice(0, 10),
    totalCount: 30,
    currentPage: 1,
    pageSize: 10,
    filters: {
      search: "",
      sortBy: "createdAt",
      sortDirection: "desc",
    },
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    payouts: [],
    totalCount: 0,
    currentPage: 1,
    pageSize: 10,
    filters: {
      search: "",
      sortBy: "createdAt",
      sortDirection: "desc",
    },
    isLoading: false,
  },
};

export const WithFilters: Story = {
  args: {
    payouts: mockPayouts.slice(0, 5),
    totalCount: 5,
    currentPage: 1,
    pageSize: 10,
    filters: {
      search: "test",
      status: ["pending", "completed"],
      sortBy: "amount",
      sortDirection: "asc",
    },
    isLoading: false,
  },
};
