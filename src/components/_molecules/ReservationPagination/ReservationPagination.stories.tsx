import type { Meta, StoryObj } from "@storybook/react";
import { ReservationPagination } from "./ReservationPagination";

const meta: Meta<typeof ReservationPagination> = {
  title: "Molecules/ReservationPagination",
  component: ReservationPagination,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onPageChange: { action: "page changed" },
  },
};

export default meta;
type Story = StoryObj<typeof ReservationPagination>;

export const FirstPage: Story = {
  args: {
    pagination: {
      page: 1,
      limit: 10,
      total: 50,
    },
  },
};

export const MiddlePage: Story = {
  args: {
    pagination: {
      page: 3,
      limit: 10,
      total: 50,
    },
  },
};

export const LastPage: Story = {
  args: {
    pagination: {
      page: 5,
      limit: 10,
      total: 50,
    },
  },
};

export const Empty: Story = {
  args: {
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
    },
  },
};
