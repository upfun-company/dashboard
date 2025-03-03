import type { Meta, StoryObj } from "@storybook/react";
import { ProvidersList } from "./ProvidersList";

// Import des mocks
import { mockProviders } from "@/mocks/providersMocks";

// Mock du store Redux pour Storybook
import { Provider as ReduxProvider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import providersReducer from "@/redux/reducers/providersReducer";

// Import pour le mock de next/navigation
import * as nextNavigation from "next/navigation";

// Création d'un store mock pour Storybook
const mockStore = configureStore({
  reducer: {
    providers: providersReducer,
  },
  preloadedState: {
    providers: {
      providers: mockProviders,
      pagination: {
        page: 1,
        limit: 10,
        total: mockProviders.length,
      },
      filters: {
        search: "",
        sortBy: "createdAt",
        sortDirection: "desc" as const,
        status: "all" as const,
      },
      isLoading: false,
      selectedProvider: null,
      error: null,
    },
  },
});

// Mock du router Next.js
const mockRouter = {
  push: () => {},
  replace: () => {},
  prefetch: () => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
};

// Mocking next/navigation
Object.defineProperty(nextNavigation, "useRouter", {
  configurable: true,
  value: () => mockRouter,
});

/**
 * Le composant ProvidersList affiche une liste de prestataires avec des filtres avancés
 * et des options pour les gérer (voir détails, éditer, supprimer, approuver, rejeter).
 */
const meta: Meta<typeof ProvidersList> = {
  title: "Organisms/ProvidersList",
  component: ProvidersList,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Liste des prestataires avec filtres avancés et options de gestion.",
      },
    },
    nextjs: {
      router: mockRouter,
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      return (
        <ReduxProvider store={mockStore}>
          <div className="p-6 max-w-7xl mx-auto">
            <Story />
          </div>
        </ReduxProvider>
      );
    },
  ],
  argTypes: {
    onSelect: { action: "sélectionner" },
    onEdit: { action: "éditer" },
    onDelete: { action: "supprimer" },
    onApprove: { action: "approuver" },
    onReject: { action: "rejeter" },
  },
};

export default meta;
type Story = StoryObj<typeof ProvidersList>;

export const Default: Story = {
  args: {},
};

export const WithCallbacks: Story = {
  args: {
    onSelect: (id) => console.log(`Prestataire sélectionné: ${id}`),
    onEdit: (id) => console.log(`Éditer le prestataire: ${id}`),
    onDelete: (id) => console.log(`Supprimer le prestataire: ${id}`),
    onApprove: (id) => console.log(`Approuver le prestataire: ${id}`),
    onReject: (id) => console.log(`Rejeter le prestataire: ${id}`),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Exemple avec toutes les fonctions de callback définies pour les actions sur les prestataires.",
      },
    },
  },
};
