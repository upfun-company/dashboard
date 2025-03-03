import type { Meta, StoryObj } from "@storybook/react";
import AuditLogs from "./AuditLogs";
import { generateMockAuditLogs } from "@/mocks/securityMocks";
import { AuditLogFilters } from "@/types/security";

const meta: Meta<typeof AuditLogs> = {
  title: "Organisms/AuditLogs",
  component: AuditLogs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    logs: {
      description: "Liste des logs d'audit à afficher",
    },
    filters: {
      description: "Filtres appliqués aux logs",
    },
    onFiltersChange: {
      description: "Fonction appelée lors du changement des filtres",
      action: "filtersChanged",
    },
    totalLogs: {
      description: "Nombre total de logs (pour la pagination)",
      control: { type: "number" },
    },
    currentPage: {
      description: "Page actuelle",
      control: { type: "number" },
    },
    pageSize: {
      description: "Nombre de logs par page",
      control: { type: "number" },
    },
    onPageChange: {
      description: "Fonction appelée lors du changement de page",
      action: "pageChanged",
    },
    onLogClick: {
      description: "Fonction appelée lors du clic sur un log",
      action: "logClicked",
    },
    onExportLogs: {
      description: "Fonction appelée lors de l'exportation des logs",
      action: "exportLogs",
    },
    className: {
      description: "Classes CSS additionnelles",
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AuditLogs>;

const mockLogs = generateMockAuditLogs(20);
const defaultFilters: AuditLogFilters = {
  sortBy: "timestamp",
  sortDirection: "desc",
};

export const Default: Story = {
  args: {
    logs: mockLogs,
    filters: defaultFilters,
    totalLogs: mockLogs.length,
    currentPage: 1,
    pageSize: 10,
  },
};

export const WithActiveFilters: Story = {
  args: {
    logs: mockLogs.slice(0, 5),
    filters: {
      ...defaultFilters,
      search: "admin",
      eventTypes: ["LOGIN", "USER_CREATE"],
      status: "SUCCESS",
    },
    totalLogs: 5,
    currentPage: 1,
    pageSize: 10,
  },
};

export const Empty: Story = {
  args: {
    logs: [],
    filters: defaultFilters,
    totalLogs: 0,
    currentPage: 1,
    pageSize: 10,
  },
};
