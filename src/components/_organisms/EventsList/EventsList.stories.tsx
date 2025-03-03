import type { Meta, StoryObj } from "@storybook/react";
import EventsList from "./EventsList";
import { Event } from "./EventsList";

const meta: Meta<typeof EventsList> = {
  title: "Organisms/EventsList",
  component: EventsList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onEventClick: { action: "event clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof EventsList>;

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);

const mockEvents: Event[] = [
  {
    id: "1",
    type: "reservation",
    title: "Nouvelle réservation #12345",
    description: "Une nouvelle réservation a été effectuée par Jean Dupont",
    date: today.toISOString(),
  },
  {
    id: "2",
    type: "user",
    title: "Nouvel utilisateur inscrit",
    description: "Marie Martin vient de créer un compte",
    date: yesterday.toISOString(),
  },
  {
    id: "3",
    type: "provider",
    title: "Nouveau prestataire",
    description: "Pierre Durand s'est inscrit comme prestataire",
    date: yesterday.toISOString(),
  },
  {
    id: "4",
    type: "payment",
    title: "Paiement reçu",
    description: "Un paiement de 120€ a été reçu pour la réservation #12345",
    date: lastWeek.toISOString(),
  },
  {
    id: "5",
    type: "message",
    title: "Nouveau message",
    description: "Vous avez reçu un message de support",
    date: lastWeek.toISOString(),
  },
];

export const Default: Story = {
  args: {
    events: mockEvents,
    title: "Événements récents",
    maxEvents: 5,
  },
};

export const WithClickHandler: Story = {
  args: {
    events: mockEvents,
    title: "Événements récents",
    maxEvents: 5,
    onEventClick: (event) => console.log("Event clicked:", event),
  },
};

export const LimitedEvents: Story = {
  args: {
    events: mockEvents,
    title: "Derniers événements",
    maxEvents: 3,
  },
};

export const Empty: Story = {
  args: {
    events: [],
    title: "Événements récents",
  },
};
