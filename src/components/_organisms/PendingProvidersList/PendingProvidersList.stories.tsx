import type { Meta, StoryObj } from "@storybook/react";
import PendingProvidersList, { PendingProvider } from "./PendingProvidersList";
import { format } from "date-fns";

/**
 * Le composant PendingProvidersList affiche une liste de prestataires en attente de validation
 * avec des options pour les approuver, les rejeter ou voir leurs détails.
 */
const meta: Meta<typeof PendingProvidersList> = {
  title: "Organisms/PendingProvidersList",
  component: PendingProvidersList,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Affiche une liste de prestataires en attente de validation avec des actions pour les approuver ou les rejeter.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onApprove: { action: "approuver" },
    onReject: { action: "rejeter" },
    onViewDetails: { action: "voir détails" },
  },
};

export default meta;
type Story = StoryObj<typeof PendingProvidersList>;

// Données de test pour les prestataires en attente
const mockPendingProviders: PendingProvider[] = [
  {
    id: "p1",
    name: "Aventure Outdoor",
    email: "contact@aventure-outdoor.fr",
    category: "Sport & Aventure",
    registrationDate: format(new Date(2023, 8, 10), "yyyy-MM-dd"),
    status: "pending",
  },
  {
    id: "p2",
    name: "Cuisine Créative",
    email: "info@cuisinecreative.fr",
    category: "Gastronomie",
    registrationDate: format(new Date(2023, 8, 8), "yyyy-MM-dd"),
    status: "pending",
  },
  {
    id: "p3",
    name: "Atelier d'Art",
    email: "contact@atelierdart.fr",
    category: "Art & Culture",
    registrationDate: format(new Date(2023, 8, 5), "yyyy-MM-dd"),
    status: "pending",
  },
  {
    id: "p4",
    name: "Yoga Zen Studio",
    email: "contact@yogazenstudio.fr",
    category: "Bien-être",
    registrationDate: format(new Date(2023, 8, 3), "yyyy-MM-dd"),
    status: "pending",
  },
  {
    id: "p5",
    name: "École de Musique",
    email: "contact@ecolemusique.fr",
    category: "Éducation",
    registrationDate: format(new Date(2023, 8, 1), "yyyy-MM-dd"),
    status: "pending",
  },
];

// Mélange de prestataires avec différents statuts
const mockMixedProviders: PendingProvider[] = [
  ...mockPendingProviders.slice(0, 2),
  {
    id: "p6",
    name: "Spa Relaxation",
    email: "contact@sparelaxation.fr",
    category: "Bien-être",
    registrationDate: format(new Date(2023, 7, 25), "yyyy-MM-dd"),
    status: "approved",
  },
  {
    id: "p7",
    name: "Tour Historique",
    email: "info@tourhistorique.fr",
    category: "Art & Culture",
    registrationDate: format(new Date(2023, 7, 20), "yyyy-MM-dd"),
    status: "rejected",
  },
  mockPendingProviders[2],
];

export const Default: Story = {
  args: {
    providers: mockPendingProviders,
    title: "Prestataires en attente",
    maxProviders: 3,
  },
};

export const WithCustomTitle: Story = {
  args: {
    providers: mockPendingProviders,
    title: "Validation des prestataires",
    maxProviders: 3,
  },
};

export const ShowAll: Story = {
  args: {
    providers: mockPendingProviders,
    maxProviders: 10,
  },
};

export const MixedStatuses: Story = {
  args: {
    providers: mockMixedProviders,
    maxProviders: 5,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Affiche une liste mixte de prestataires avec différents statuts. Seuls les prestataires avec le statut 'pending' seront affichés.",
      },
    },
  },
};

export const Empty: Story = {
  args: {
    providers: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Affiche un message lorsqu'aucun prestataire en attente n'est disponible.",
      },
    },
  },
};

export const WithCallbacks: Story = {
  args: {
    providers: mockPendingProviders.slice(0, 3),
    onApprove: (id) => console.log(`Prestataire approuvé: ${id}`),
    onReject: (id) => console.log(`Prestataire rejeté: ${id}`),
    onViewDetails: (id) => console.log(`Voir détails du prestataire: ${id}`),
  },
};
