import type { Meta, StoryObj } from "@storybook/react";
import ProviderCard from "./ProviderCard";
import { format } from "date-fns";

/**
 * Le composant ProviderCard affiche les informations d'un prestataire en attente
 * avec des boutons d'action pour l'approuver, le rejeter ou voir ses détails.
 */
const meta: Meta<typeof ProviderCard> = {
  title: "Molecules/ProviderCard",
  component: ProviderCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Carte affichant les informations d'un prestataire avec des actions contextuelles selon son statut.",
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
type Story = StoryObj<typeof ProviderCard>;

export const Pending: Story = {
  args: {
    id: "p1",
    name: "Aventure Outdoor",
    email: "contact@aventure-outdoor.fr",
    category: "Sport & Aventure",
    registrationDate: format(new Date(2023, 8, 10), "yyyy-MM-dd"),
    status: "pending",
  },
};

export const Approved: Story = {
  args: {
    id: "p2",
    name: "Yoga Zen Studio",
    email: "contact@yogazenstudio.fr",
    category: "Bien-être",
    registrationDate: format(new Date(2023, 7, 15), "yyyy-MM-dd"),
    status: "approved",
  },
};

export const Rejected: Story = {
  args: {
    id: "p3",
    name: "Tour Historique",
    email: "info@tourhistorique.fr",
    category: "Art & Culture",
    registrationDate: format(new Date(2023, 7, 20), "yyyy-MM-dd"),
    status: "rejected",
  },
};

export const WithLongText: Story = {
  args: {
    id: "p4",
    name: "Centre de Formation Professionnelle et de Développement des Compétences",
    email:
      "contact-service-administratif-principal@centredeformationprofessionnelle.fr",
    category: "Éducation et Formation Professionnelle Continue",
    registrationDate: format(new Date(2023, 8, 5), "yyyy-MM-dd"),
    status: "pending",
  },
};

export const WithCallbacks: Story = {
  args: {
    id: "p5",
    name: "Cuisine Créative",
    email: "info@cuisinecreative.fr",
    category: "Gastronomie",
    registrationDate: format(new Date(2023, 8, 8), "yyyy-MM-dd"),
    status: "pending",
    onApprove: (id) => console.log(`Prestataire approuvé: ${id}`),
    onReject: (id) => console.log(`Prestataire rejeté: ${id}`),
    onViewDetails: (id) => console.log(`Voir détails du prestataire: ${id}`),
  },
};
