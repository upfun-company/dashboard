import type { Meta, StoryObj } from "@storybook/react";
import { AmountDisplay } from "./AmountDisplay";

const meta: Meta<typeof AmountDisplay> = {
  title: "Atoms/AmountDisplay",
  component: AmountDisplay,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AmountDisplay>;

export const PositiveAmount: Story = {
  args: {
    amount: 1250.75,
  },
};

export const NegativeAmount: Story = {
  args: {
    amount: -450.25,
  },
};

export const ZeroAmount: Story = {
  args: {
    amount: 0,
  },
};

export const WithPlusSign: Story = {
  args: {
    amount: 1250.75,
    showPlusSign: true,
  },
};

export const WithColorBySign: Story = {
  args: {
    amount: 1250.75,
    colorBySign: true,
  },
};

export const NegativeWithColorBySign: Story = {
  args: {
    amount: -450.25,
    colorBySign: true,
  },
};

export const WithDifferentCurrency: Story = {
  args: {
    amount: 1250.75,
    currency: "USD",
  },
};

export const WithCustomClass: Story = {
  args: {
    amount: 1250.75,
    className: "text-xl font-bold",
  },
};

export const AllOptions: Story = {
  args: {
    amount: 1250.75,
    currency: "USD",
    showPlusSign: true,
    colorBySign: true,
    className: "text-xl font-bold",
  },
};
