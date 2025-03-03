import type { Meta, StoryObj } from "@storybook/react";
import { ReservationsList } from "./ReservationsList";
import { generateMockReservationsNew as generateMockReservations } from "@/mocks/reservationsMocks";

// Générer des données de test
const mockReservations = generateMockReservations(10);

// Créer des réservations avec différents statuts
const pendingReservations = mockReservations.map((reservation, index) => ({
  ...reservation,
  id: `reservation-pending-${index + 1}`,
  status: "pending",
  paymentStatus: "pending",
}));

const confirmedReservations = mockReservations.map((reservation, index) => ({
  ...reservation,
  id: `reservation-confirmed-${index + 1}`,
  status: "confirmed",
  paymentStatus: "paid",
}));

const completedReservations = mockReservations.map((reservation, index) => ({
  ...reservation,
  id: `reservation-completed-${index + 1}`,
  status: "completed",
  paymentStatus: "paid",
}));

const cancelledReservations = mockReservations.map((reservation, index) => ({
  ...reservation,
  id: `reservation-cancelled-${index + 1}`,
  status: "cancelled",
  paymentStatus: "refunded",
  cancellationReason: "Annulation à la demande du client",
  refundAmount: reservation.amount,
}));

const meta: Meta<typeof ReservationsList> = {
  title: "Organisms/ReservationsList",
  component: ReservationsList,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    onViewReservation: { action: "viewed" },
  },
};

export default meta;
type Story = StoryObj<typeof ReservationsList>;

export const Default: Story = {
  args: {
    reservations: mockReservations,
  },
};

export const Pending: Story = {
  args: {
    reservations: pendingReservations,
  },
};

export const Confirmed: Story = {
  args: {
    reservations: confirmedReservations,
  },
};

export const Completed: Story = {
  args: {
    reservations: completedReservations,
  },
};

export const Cancelled: Story = {
  args: {
    reservations: cancelledReservations,
  },
};

export const Loading: Story = {
  args: {
    reservations: [],
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    reservations: [],
  },
};
