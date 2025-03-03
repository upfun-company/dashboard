import type { Meta, StoryObj } from "@storybook/react";
import { ReservationFilters } from "./ReservationFilters";

const meta: Meta<typeof ReservationFilters> = {
  title: "Molecules/ReservationFilters",
  component: ReservationFilters,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onFiltersChange: { action: "filters changed" },
    onResetFilters: { action: "filters reset" },
  },
};

export default meta;
type Story = StoryObj<typeof ReservationFilters>;

export const Default: Story = {
  args: {
    filters: {
      search: "",
      status: "all",
      paymentStatus: "all",
      dateFrom: null,
      dateTo: null,
      providerId: "",
      customerId: "",
      sortBy: "date",
      sortDirection: "desc",
    },
  },
};

export const WithValues: Story = {
  args: {
    filters: {
      search: "Yoga",
      status: "confirmed",
      paymentStatus: "paid",
      dateFrom: new Date(2023, 0, 1),
      dateTo: new Date(2023, 11, 31),
      providerId: "",
      customerId: "",
      sortBy: "amount",
      sortDirection: "desc",
    },
  },
};
