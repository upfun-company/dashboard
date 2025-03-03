import type { Meta, StoryObj } from "@storybook/react";
import EventCard from "./EventCard";

const meta: Meta<typeof EventCard> = {
  title: "Molecules/EventCard",
  component: EventCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: [
        "reservation",
        "user",
        "provider",
        "payment",
        "message",
        "review",
        "system",
      ],
    },
    title: { control: "text" },
    description: { control: "text" },
    date: { control: "text" },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof EventCard>;

export const Reservation: Story = {
  args: {
    type: "reservation",
    title: "Nouvelle réservation #12345",
    description: "Une nouvelle réservation a été effectuée par Jean Dupont",
    date: "Aujourd'hui à 14:30",
  },
};

export const User: Story = {
  args: {
    type: "user",
    title: "Nouvel utilisateur inscrit",
    description: "Marie Martin vient de créer un compte",
    date: "Hier à 09:15",
  },
};

export const Payment: Story = {
  args: {
    type: "payment",
    title: "Paiement reçu",
    description: "Un paiement de 120€ a été reçu pour la réservation #12345",
    date: "Lundi à 16:45",
  },
};

export const Message: Story = {
  args: {
    type: "message",
    title: "Nouveau message",
    description:
      "Vous avez reçu un message de support de la part d'un utilisateur",
    date: "12 Juin à 10:20",
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="space-y-2 max-w-md">
      <EventCard
        type="reservation"
        title="Nouvelle réservation #12345"
        description="Une nouvelle réservation a été effectuée par Jean Dupont"
        date="Aujourd'hui à 14:30"
      />
      <EventCard
        type="user"
        title="Nouvel utilisateur inscrit"
        description="Marie Martin vient de créer un compte"
        date="Hier à 09:15"
      />
      <EventCard
        type="provider"
        title="Nouveau prestataire"
        description="Pierre Durand s'est inscrit comme prestataire"
        date="Lundi à 16:45"
      />
      <EventCard
        type="payment"
        title="Paiement reçu"
        description="Un paiement de 120€ a été reçu pour la réservation #12345"
        date="12 Juin à 10:20"
      />
      <EventCard
        type="message"
        title="Nouveau message"
        description="Vous avez reçu un message de support"
        date="10 Juin à 08:30"
      />
      <EventCard
        type="review"
        title="Nouvel avis"
        description="Un client a laissé un avis 5 étoiles"
        date="5 Juin à 19:45"
      />
      <EventCard
        type="system"
        title="Maintenance système"
        description="Une maintenance est prévue demain à 22:00"
        date="1 Juin à 11:15"
      />
    </div>
  ),
};
