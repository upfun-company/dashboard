import type { Meta, StoryObj } from "@storybook/react";
import { ReservationDetails } from "./ReservationDetails";
import { generateMockReservationNew as generateMockReservation } from "@/mocks/reservationsMocks";
import { generateMockUsers, generateMockProviders } from "@/mocks/usersMocks";

// Générer des données de test
const users = generateMockUsers(5);
const providers = generateMockProviders(5);
const mockReservation = generateMockReservation(1, users, providers, [
  {
    id: "service-001",
    providerId: providers[0].id,
    name: "Cours de yoga",
    description: "Séance de yoga pour débutants",
    price: 45,
    duration: 60,
    category: "Bien-être",
    subCategory: "Yoga",
    maxParticipants: 10,
    location: {
      type: "provider",
    },
    availability: {
      monday: { start: "09:00", end: "18:00" },
      tuesday: { start: "09:00", end: "18:00" },
      wednesday: { start: "09:00", end: "18:00" },
      thursday: { start: "09:00", end: "18:00" },
      friday: { start: "09:00", end: "18:00" },
      saturday: null,
      sunday: null,
    },
    images: ["https://source.unsplash.com/random/300x200?yoga"],
    rating: 4.8,
    reviewsCount: 24,
    createdAt: new Date().toISOString(),
    status: "active",
  },
]);

// Créer des réservations avec différents statuts
const pendingReservation = {
  ...mockReservation,
  id: "reservation-001",
  status: "pending",
  paymentStatus: "pending",
};

const confirmedReservation = {
  ...mockReservation,
  id: "reservation-002",
  status: "confirmed",
  paymentStatus: "paid",
};

const completedReservation = {
  ...mockReservation,
  id: "reservation-003",
  status: "completed",
  paymentStatus: "paid",
};

const cancelledReservation = {
  ...mockReservation,
  id: "reservation-004",
  status: "cancelled",
  paymentStatus: "refunded",
  cancellationReason: "Annulation à la demande du client",
  refundAmount: mockReservation.amount,
};

const meta: Meta<typeof ReservationDetails> = {
  title: "Organisms/ReservationDetails",
  component: ReservationDetails,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    onCancel: { action: "cancelled" },
    onRefund: { action: "refunded" },
    onConfirm: { action: "confirmed" },
    onComplete: { action: "completed" },
    onSendMessage: { action: "message sent" },
    onDownloadInvoice: { action: "invoice downloaded" },
    onPrintInvoice: { action: "invoice printed" },
  },
};

export default meta;
type Story = StoryObj<typeof ReservationDetails>;

export const Pending: Story = {
  args: {
    reservation: pendingReservation,
  },
};

export const Confirmed: Story = {
  args: {
    reservation: confirmedReservation,
  },
};

export const Completed: Story = {
  args: {
    reservation: completedReservation,
  },
};

export const Cancelled: Story = {
  args: {
    reservation: cancelledReservation,
  },
};
