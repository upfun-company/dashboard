import type { Meta, StoryObj } from "@storybook/react";
import { FinancialStatusBadge } from "./FinancialStatusBadge";

const meta: Meta<typeof FinancialStatusBadge> = {
  title: "Atoms/FinancialStatusBadge",
  component: FinancialStatusBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FinancialStatusBadge>;

export const Pending: Story = {
  args: {
    status: "pending",
  },
};

export const Processing: Story = {
  args: {
    status: "processing",
  },
};

export const Completed: Story = {
  args: {
    status: "completed",
  },
};

export const Failed: Story = {
  args: {
    status: "failed",
  },
};

export const Cancelled: Story = {
  args: {
    status: "cancelled",
  },
};

export const WithCustomClass: Story = {
  args: {
    status: "completed",
    className: "text-lg p-3",
  },
};
