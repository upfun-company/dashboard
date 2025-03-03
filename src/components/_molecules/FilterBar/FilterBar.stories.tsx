import type { Meta, StoryObj } from "@storybook/react";
import FilterBar from "./FilterBar";

const meta: Meta<typeof FilterBar> = {
  title: "_Molecules/FilterBar",
  component: FilterBar,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    onAddFilter: { action: "filter added" },
    onRemoveFilter: { action: "filter removed" },
    onResetFilters: { action: "filters reset" },
  },
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

// Options de filtres pour les exemples
const mockFilterOptions = [
  {
    id: "status",
    label: "Statut",
    options: [
      { value: "active", label: "Actif" },
      { value: "pending", label: "En attente" },
      { value: "cancelled", label: "Annulé" },
      { value: "completed", label: "Terminé" },
    ],
  },
  {
    id: "date",
    label: "Date",
    options: [
      { value: "today", label: "Aujourd'hui" },
      { value: "yesterday", label: "Hier" },
      { value: "last7days", label: "7 derniers jours" },
      { value: "last30days", label: "30 derniers jours" },
      { value: "thisMonth", label: "Ce mois-ci" },
      { value: "lastMonth", label: "Mois dernier" },
    ],
  },
  {
    id: "category",
    label: "Catégorie",
    options: [
      { value: "sport", label: "Sport" },
      { value: "culture", label: "Culture" },
      { value: "food", label: "Gastronomie" },
      { value: "wellness", label: "Bien-être" },
      { value: "adventure", label: "Aventure" },
    ],
  },
];

export const Default: Story = {
  args: {
    activeFilters: [],
    filterOptions: mockFilterOptions,
  },
};

export const WithActiveFilters: Story = {
  args: {
    activeFilters: [
      {
        id: "status-active",
        label: "Statut: Actif",
        value: "active",
      },
      {
        id: "date-last7days",
        label: "Date: 7 derniers jours",
        value: "last7days",
      },
    ],
    filterOptions: mockFilterOptions,
  },
};

export const WithManyFilters: Story = {
  args: {
    activeFilters: [
      {
        id: "status-active",
        label: "Statut: Actif",
        value: "active",
      },
      {
        id: "date-last30days",
        label: "Date: 30 derniers jours",
        value: "last30days",
      },
      {
        id: "category-sport",
        label: "Catégorie: Sport",
        value: "sport",
      },
      {
        id: "category-culture",
        label: "Catégorie: Culture",
        value: "culture",
      },
    ],
    filterOptions: mockFilterOptions,
  },
};
