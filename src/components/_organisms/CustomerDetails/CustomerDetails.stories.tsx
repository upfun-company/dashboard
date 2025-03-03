/**
 * Stories pour le composant CustomerDetails
 */

import type { Meta, StoryObj } from "@storybook/react";
import CustomerDetails from "./CustomerDetails";
import { Customer } from "@/types";
import {
  generateMockReservationsNew,
  type ReservationNew,
} from "@/mocks/reservationsMocks";

// Création d'un client mocké directement dans le fichier
const mockCustomer: Customer = {
  id: "cust-001",
  name: "Jean Dupont",
  email: "jean.dupont@example.com",
  phone: "+33 6 12 34 56 78",
  createdAt: new Date(2023, 5, 15).toISOString(),
  lastActive: new Date(2023, 11, 20).toISOString(),
  totalSpent: 1250.75,
  reservationsCount: 8,
  status: "active",
  avatarUrl: "https://i.pravatar.cc/150?u=cust-001",
};

// Création des réservations mockées
const mockReservations = generateMockReservationsNew(5).map(
  (res: ReservationNew, index: number) => ({
    id: res.id,
    date: res.date,
    createdAt: res.date,
    activityName: res.service?.name || "Activité",
    totalPrice: res.amount,
    status: ["pending", "confirmed", "completed", "cancelled"][index % 4],
    participants: Math.floor(Math.random() * 5) + 1,
    amount: res.amount,
    paymentStatus: res.paymentStatus,
  })
);

// Dernière réservation
const lastReservation = mockReservations[0];

/**
 * Métadonnées pour les stories du composant CustomerDetails
 */
const meta: Meta<typeof CustomerDetails> = {
  title: "_Organisms/CustomerDetails",
  component: CustomerDetails,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Story par défaut
 */
export const Default: Story = {
  args: {
    customer: mockCustomer,
    mockReservations,
    lastReservation,
  },
};

/**
 * Story avec un client sans réservations
 */
export const NoReservations: Story = {
  args: {
    customer: {
      ...mockCustomer,
      reservationsCount: 0,
    },
    mockReservations: [],
    lastReservation: undefined,
  },
};

/**
 * Story avec actions
 */
export const WithActions: Story = {
  args: {
    customer: mockCustomer,
    onBack: () => console.log("Back clicked"),
    onEdit: (customer) => console.log("Edit clicked", customer),
    onDelete: (customerId) => console.log("Delete clicked", customerId),
    onToggleStatus: (customer, isActive) =>
      console.log("Toggle status clicked", customer, isActive),
  },
};

/**
 * Story avec client inactif
 */
export const InactiveCustomer: Story = {
  args: {
    customer: {
      ...mockCustomer,
      status: "inactive",
    },
    mockReservations,
    lastReservation,
    onBack: () => console.log("Back clicked"),
    onEdit: (customer) => console.log("Edit clicked", customer),
    onDelete: (customerId) => console.log("Delete clicked", customerId),
    onToggleStatus: (customer, isActive) =>
      console.log("Toggle status clicked", customer, isActive),
  },
};
