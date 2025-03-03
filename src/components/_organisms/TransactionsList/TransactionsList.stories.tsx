import type { Meta, StoryObj } from "@storybook/react";
import { TransactionsList } from "./TransactionsList";
import { generateMockFinancialTransactions } from "@/mocks/financeMocks";

const meta: Meta<typeof TransactionsList> = {
  title: "Organisms/TransactionsList",
  component: TransactionsList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onPageChange: { action: "onPageChange" },
    onFiltersChange: { action: "onFiltersChange" },
    onTransactionClick: { action: "onTransactionClick" },
    onExportTransactions: { action: "onExportTransactions" },
  },
};

export default meta;
type Story = StoryObj<typeof TransactionsList>;

// Générer des données de test
const mockTransactions = generateMockFinancialTransactions(30);

export const Default: Story = {
  args: {
    transactions: mockTransactions.slice(0, 10),
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
    transactions: mockTransactions.slice(0, 10),
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
    transactions: [],
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
    transactions: mockTransactions.slice(0, 5),
    totalCount: 5,
    currentPage: 1,
    pageSize: 10,
    filters: {
      search: "test",
      status: ["pending", "completed"],
      type: ["payment", "refund"],
      sortBy: "amount",
      sortDirection: "asc",
    },
    isLoading: false,
  },
};
