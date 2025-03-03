import type { Meta, StoryObj } from "@storybook/react";
import { TransactionTypeBadge } from "./TransactionTypeBadge";

const meta: Meta<typeof TransactionTypeBadge> = {
  title: "Atoms/TransactionTypeBadge",
  component: TransactionTypeBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TransactionTypeBadge>;

export const Payment: Story = {
  args: {
    type: "payment",
  },
};

export const Refund: Story = {
  args: {
    type: "refund",
  },
};

export const Payout: Story = {
  args: {
    type: "payout",
  },
};

export const Fee: Story = {
  args: {
    type: "fee",
  },
};

export const WithCustomClass: Story = {
  args: {
    type: "payment",
    className: "text-lg p-3",
  },
};
