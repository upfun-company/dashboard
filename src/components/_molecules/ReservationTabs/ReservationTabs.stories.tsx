import type { Meta, StoryObj } from "@storybook/react";
import { ReservationTabs } from "./ReservationTabs";

const meta: Meta<typeof ReservationTabs> = {
  title: "Molecules/ReservationTabs",
  component: ReservationTabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onValueChange: { action: "tab changed" },
  },
};

export default meta;
type Story = StoryObj<typeof ReservationTabs>;

export const All: Story = {
  args: {
    value: "all",
  },
};

export const Pending: Story = {
  args: {
    value: "pending",
  },
};

export const Confirmed: Story = {
  args: {
    value: "confirmed",
  },
};

export const Completed: Story = {
  args: {
    value: "completed",
  },
};

export const Cancelled: Story = {
  args: {
    value: "cancelled",
  },
};
