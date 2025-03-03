import type { Meta, StoryObj } from "@storybook/react";
import ActivitySummary from "@/components/_organisms/ActivitySummary";
import { Alert, Event } from "@/types";

const meta: Meta<typeof ActivitySummary> = {
  title: "Organisms/ActivitySummary",
  component: ActivitySummary,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ActivitySummary>;

// Données fictives pour les alertes
const mockAlerts: Alert[] = [
  {
    id: "alert-001",
    title: "Nouvelle activité en attente de modération",
    message:
      "L'activité 'Cours de cuisine française' a été soumise et est en attente de modération.",
    type: "info",
    createdAt: "2023-06-15T10:30:00Z",
    isRead: false,
  },
  {
    id: "alert-002",
    title: "Promotion expirée",
    message: "La promotion 'FAMILY25' a expiré aujourd'hui.",
    type: "warning",
    createdAt: "2023-05-31T23:59:59Z",
    isRead: true,
  },
  {
    id: "alert-003",
    title: "Limite d'utilisation atteinte",
    message: "La promotion 'FLASH50' a atteint sa limite d'utilisation.",
    type: "warning",
    createdAt: "2023-05-22T18:45:00Z",
    isRead: false,
  },
  {
    id: "alert-004",
    title: "Erreur de paiement",
    message: "Une erreur de paiement est survenue pour la réservation #12345.",
    type: "error",
    createdAt: "2023-06-14T14:20:00Z",
    isRead: false,
  },
  {
    id: "alert-005",
    title: "Nouvelle réservation",
    message:
      "Une nouvelle réservation a été effectuée pour l'activité 'Visite guidée du Louvre'.",
    type: "success",
    createdAt: "2023-06-14T09:15:00Z",
    isRead: true,
  },
];

// Données fictives pour les événements
const mockEvents: Event[] = [
  {
    id: "event-001",
    title: "Activité créée",
    description:
      "L'activité 'Cours de cuisine française' a été créée par Jean Dupont.",
    date: "2023-06-15T10:30:00Z",
    type: "activity_created",
    relatedId: "act-001",
    relatedType: "activity",
    user: {
      id: "user1",
      name: "Jean Dupont",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
  },
  {
    id: "event-002",
    title: "Promotion modifiée",
    description: "La promotion 'SUMMER2023' a été modifiée par Marie Martin.",
    date: "2023-06-14T14:20:00Z",
    type: "promotion_updated",
    relatedId: "promo-001",
    relatedType: "promotion",
    user: {
      id: "user2",
      name: "Marie Martin",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
  },
  {
    id: "event-003",
    title: "Activité approuvée",
    description:
      "L'activité 'Visite guidée du Louvre' a été approuvée par Pierre Durand.",
    date: "2023-06-14T11:45:00Z",
    type: "activity_approved",
    relatedId: "act-002",
    relatedType: "activity",
    user: {
      id: "user3",
      name: "Pierre Durand",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
  },
  {
    id: "event-004",
    title: "Activité rejetée",
    description:
      "L'activité 'Dégustation de vins' a été rejetée par Sophie Lefebvre.",
    date: "2023-06-13T16:30:00Z",
    type: "activity_rejected",
    relatedId: "act-003",
    relatedType: "activity",
    user: {
      id: "user4",
      name: "Sophie Lefebvre",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
  },
  {
    id: "event-005",
    title: "Promotion créée",
    description: "La promotion 'CULTURE15' a été créée par Lucas Moreau.",
    date: "2023-06-10T11:30:00Z",
    type: "promotion_created",
    relatedId: "promo-005",
    relatedType: "promotion",
    user: {
      id: "user5",
      name: "Lucas Moreau",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
  },
];

export const Default: Story = {
  args: {
    alerts: mockAlerts,
    events: mockEvents,
    title: "Activités récentes",
    defaultTab: "alerts",
  },
};

export const AlertsTab: Story = {
  args: {
    alerts: mockAlerts,
    events: mockEvents,
    title: "Alertes",
    defaultTab: "alerts",
  },
};

export const EventsTab: Story = {
  args: {
    alerts: mockAlerts,
    events: mockEvents,
    title: "Événements",
    defaultTab: "events",
  },
};

export const Empty: Story = {
  args: {
    alerts: [],
    events: [],
    title: "Activités récentes",
    defaultTab: "alerts",
  },
};
