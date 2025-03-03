import type { Meta, StoryObj } from "@storybook/react";
import LoginSessions from "./LoginSessions";
import { generateMockLoginSessions } from "@/mocks/securityMocks";
import { LoginSessionFilters } from "@/types/security";

const meta: Meta<typeof LoginSessions> = {
  title: "Organisms/LoginSessions",
  component: LoginSessions,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    sessions: {
      description: "Liste des sessions de connexion à afficher",
    },
    filters: {
      description: "Filtres appliqués aux sessions",
    },
    onFiltersChange: {
      description: "Fonction appelée lors du changement des filtres",
      action: "filtersChanged",
    },
    totalSessions: {
      description: "Nombre total de sessions (pour la pagination)",
      control: { type: "number" },
    },
    currentPage: {
      description: "Page actuelle",
      control: { type: "number" },
    },
    pageSize: {
      description: "Nombre de sessions par page",
      control: { type: "number" },
    },
    onPageChange: {
      description: "Fonction appelée lors du changement de page",
      action: "pageChanged",
    },
    onTerminateSession: {
      description: "Fonction appelée lors de la terminaison d'une session",
      action: "terminateSession",
    },
    onTerminateAllSessions: {
      description:
        "Fonction appelée lors de la terminaison de toutes les sessions",
      action: "terminateAllSessions",
    },
    currentSessionId: {
      description: "ID de la session courante de l'utilisateur",
      control: "text",
    },
    className: {
      description: "Classes CSS additionnelles",
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoginSessions>;

const mockSessions = generateMockLoginSessions(15);
const defaultFilters: LoginSessionFilters = {
  sortBy: "startedAt",
  sortDirection: "desc",
};

export const Default: Story = {
  args: {
    sessions: mockSessions,
    filters: defaultFilters,
    totalSessions: mockSessions.length,
    currentPage: 1,
    pageSize: 10,
    currentSessionId: mockSessions[0].id,
  },
};

export const WithActiveFilters: Story = {
  args: {
    sessions: mockSessions.slice(0, 5),
    filters: {
      ...defaultFilters,
      search: "Chrome",
      status: "ACTIVE",
    },
    totalSessions: 5,
    currentPage: 1,
    pageSize: 10,
    currentSessionId: mockSessions[0].id,
  },
};

export const Empty: Story = {
  args: {
    sessions: [],
    filters: defaultFilters,
    totalSessions: 0,
    currentPage: 1,
    pageSize: 10,
    currentSessionId: "",
  },
};
