import type { Meta, StoryObj } from "@storybook/react";
import { PaymentMethodIcon } from "./PaymentMethodIcon";

const meta: Meta<typeof PaymentMethodIcon> = {
  title: "Atoms/PaymentMethodIcon",
  component: PaymentMethodIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PaymentMethodIcon>;

export const Card: Story = {
  args: {
    method: "card",
  },
};

export const PayPal: Story = {
  args: {
    method: "paypal",
  },
};

export const ApplePay: Story = {
  args: {
    method: "apple_pay",
  },
};

export const GooglePay: Story = {
  args: {
    method: "google_pay",
  },
};

export const BankTransfer: Story = {
  args: {
    method: "bank_transfer",
  },
};

export const LargeSize: Story = {
  args: {
    method: "card",
    size: 32,
  },
};

export const WithCustomClass: Story = {
  args: {
    method: "card",
    className: "p-2 bg-gray-100 rounded",
  },
};
