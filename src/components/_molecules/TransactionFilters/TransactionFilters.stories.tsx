import type { Meta, StoryObj } from "@storybook/react";
import { TransactionFilters } from "./TransactionFilters";

const meta: Meta<typeof TransactionFilters> = {
  title: "Molecules/TransactionFilters",
  component: TransactionFilters,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onFiltersChange: { action: "onFiltersChange" },
  },
};

export default meta;
type Story = StoryObj<typeof TransactionFilters>;

export const Default: Story = {
  args: {
    filters: {
      search: "",
      sortBy: "createdAt",
      sortDirection: "desc",
    },
  },
};

export const WithSearch: Story = {
  args: {
    filters: {
      search: "test search",
      sortBy: "createdAt",
      sortDirection: "desc",
    },
  },
};

export const WithStatusFilters: Story = {
  args: {
    filters: {
      search: "",
      status: ["pending", "completed"],
      sortBy: "createdAt",
      sortDirection: "desc",
    },
  },
};

export const WithTypeFilters: Story = {
  args: {
    filters: {
      search: "",
      type: ["payment", "refund"],
      sortBy: "createdAt",
      sortDirection: "desc",
    },
  },
};

export const WithPaymentMethodFilters: Story = {
  args: {
    filters: {
      search: "",
      paymentMethod: ["card", "bank_transfer"],
      sortBy: "createdAt",
      sortDirection: "desc",
    },
  },
};

export const WithDateRange: Story = {
  args: {
    filters: {
      search: "",
      dateRange: {
        start: "2023-01-01",
        end: "2023-01-31",
      },
      sortBy: "createdAt",
      sortDirection: "desc",
    },
  },
};

export const WithAllFilters: Story = {
  args: {
    filters: {
      search: "test",
      status: ["pending", "completed"],
      type: ["payment", "refund"],
      paymentMethod: ["card", "bank_transfer"],
      dateRange: {
        start: "2023-01-01",
        end: "2023-01-31",
      },
      minAmount: 100,
      maxAmount: 1000,
      sortBy: "amount",
      sortDirection: "asc",
    },
  },
};
