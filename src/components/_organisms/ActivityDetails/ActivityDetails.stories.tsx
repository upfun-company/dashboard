import type { Meta, StoryObj } from "@storybook/react";
import { ActivityDetails } from "./ActivityDetails";
import { Activity, ActivityStatus } from "@/types";
import { addDays } from "date-fns";

// Fonction pour créer une date ISO à partir de la date actuelle + un nombre de jours
const createDate = (daysToAdd: number = 0): string => {
  const date = addDays(new Date(), daysToAdd);
  return date.toISOString();
};

// Activité de test avec tous les détails
const mockActivity: Activity = {
  id: "act-123",
  title: "Cours de cuisine française",
  description: "Apprenez à cuisiner comme un chef français",
  shortDescription: "Cuisine française pour tous",
  fullDescription:
    "Rejoignez notre chef étoilé pour un cours de cuisine française authentique. Vous apprendrez à préparer un menu complet, de l'entrée au dessert, en utilisant des techniques professionnelles et des ingrédients de saison. À la fin du cours, vous dégusterez vos créations accompagnées d'un verre de vin français.",
  price: 75,
  currency: "EUR",
  durationMinutes: 180,
  category: "Cuisine",
  location: {
    address: "25 rue du Faubourg Saint-Honoré",
    postalCode: "75008",
    city: "Paris",
    country: "France",
    latitude: 48.8704,
    longitude: 2.3098,
  },
  providerId: "provider-456",
  providerName: "École de Cuisine Parisienne",
  maxParticipants: 12,
  minParticipants: 4,
  status: "published" as ActivityStatus,
  createdAt: createDate(-30),
  updatedAt: createDate(-2),
  images: [
    {
      id: "img-1",
      url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d",
      isMain: true,
      alt: "Chef préparant un plat",
    },
    {
      id: "img-2",
      url: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf",
      isMain: false,
      alt: "Ingrédients de cuisine",
    },
    {
      id: "img-3",
      url: "https://images.unsplash.com/photo-1495521821757-a1efb6729352",
      isMain: false,
      alt: "Plat terminé",
    },
  ],
  averageRating: 4.7,
  reviewCount: 32,
  bookingCount: 128,
};

// Activité en attente de modération
const pendingActivity: Activity = {
  ...mockActivity,
  id: "act-456",
  status: "pending_review" as ActivityStatus,
  title: "Atelier de poterie",
  description: "Créez votre propre céramique",
  shortDescription: "Initiation à la poterie",
  fullDescription:
    "Découvrez l'art de la poterie dans cet atelier pratique. Vous apprendrez les techniques de base pour façonner l'argile et créer vos propres pièces. Notre potier expérimenté vous guidera à chaque étape, de la préparation de l'argile à la décoration finale.",
  category: "Art",
  providerName: "Atelier Terre & Feu",
  images: [
    {
      id: "img-4",
      url: "https://images.unsplash.com/photo-1565539383096-8905a1c5e8a6",
      isMain: true,
      alt: "Atelier de poterie",
    },
  ],
  reviewCount: 0,
  averageRating: 0,
};

// Activité rejetée
const rejectedActivity: Activity = {
  ...mockActivity,
  id: "act-789",
  status: "rejected" as ActivityStatus,
  title: "Cours de parachutisme",
  description: "Sautez en parachute avec des instructeurs certifiés",
  shortDescription: "Saut en parachute pour débutants",
  category: "Sport extrême",
  providerName: "Sky Dive Paris",
  reviewCount: 0,
  averageRating: 0,
};

const meta = {
  title: "Organisms/ActivityDetails",
  component: ActivityDetails,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    onBack: { action: "back" },
    onEdit: { action: "edit" },
    onDelete: { action: "delete" },
    onApprove: { action: "approve" },
    onReject: { action: "reject" },
  },
} satisfies Meta<typeof ActivityDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Published: Story = {
  args: {
    activity: mockActivity,
  },
};

export const PendingReview: Story = {
  args: {
    activity: pendingActivity,
  },
};

export const Rejected: Story = {
  args: {
    activity: rejectedActivity,
  },
};

export const WithModeration: Story = {
  args: {
    activity: pendingActivity,
    onApprove: undefined, // Sera remplacé par l'action définie dans argTypes
    onReject: undefined, // Sera remplacé par l'action définie dans argTypes
  },
};

// Pour les stories suivantes, nous utilisons des types qui ne correspondent pas exactement
// à la définition de l'interface Activity, mais qui sont valides pour le composant
export const WithStringLocation: Story = {
  args: {
    activity: {
      ...mockActivity,
      location:
        "Salle Pleyel, 252 Rue du Faubourg Saint-Honoré, 75008 Paris" as unknown as Activity["location"],
    },
  },
};

export const WithStringImages: Story = {
  args: {
    activity: {
      ...mockActivity,
      images: [
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d",
        "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf",
        "https://images.unsplash.com/photo-1495521821757-a1efb6729352",
      ] as unknown as Activity["images"],
    },
  },
};

export const NoImages: Story = {
  args: {
    activity: {
      ...mockActivity,
      images: [],
    },
  },
};
