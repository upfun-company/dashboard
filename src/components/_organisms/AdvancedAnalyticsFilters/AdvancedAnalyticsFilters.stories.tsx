import type { Meta, StoryObj } from "@storybook/react";
import { AdvancedAnalyticsFilters } from "./AdvancedAnalyticsFilters";
import { FilterOption } from "./AdvancedAnalyticsFilters";

const meta: Meta<typeof AdvancedAnalyticsFilters> = {
  title: "Organisms/AdvancedAnalyticsFilters",
  component: AdvancedAnalyticsFilters,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AdvancedAnalyticsFilters>;

// Options de filtres de démonstration
const demoFilterOptions: FilterOption[] = [
  {
    id: "dateRange",
    label: "Période",
    type: "dateRange",
    defaultValue: {
      from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      to: new Date(),
    },
  },
  {
    id: "compareWith",
    label: "Comparer avec",
    type: "select",
    options: [
      { value: "previousPeriod", label: "Période précédente" },
      { value: "previousYear", label: "Année précédente" },
      { value: "custom", label: "Période personnalisée" },
    ],
    defaultValue: "previousPeriod",
  },
  {
    id: "categories",
    label: "Catégories",
    type: "multiSelect",
    options: [
      { value: "sport", label: "Sport" },
      { value: "culture", label: "Culture" },
      { value: "gastronomie", label: "Gastronomie" },
      { value: "bien-etre", label: "Bien-être" },
      { value: "aventure", label: "Aventure" },
    ],
    defaultValue: [],
  },
  {
    id: "locations",
    label: "Lieux",
    type: "multiSelect",
    options: [
      { value: "paris", label: "Paris" },
      { value: "lyon", label: "Lyon" },
      { value: "marseille", label: "Marseille" },
      { value: "bordeaux", label: "Bordeaux" },
      { value: "lille", label: "Lille" },
    ],
    defaultValue: [],
  },
  {
    id: "providers",
    label: "Prestataires",
    type: "multiSelect",
    options: [
      { value: "provider1", label: "Prestataire 1" },
      { value: "provider2", label: "Prestataire 2" },
      { value: "provider3", label: "Prestataire 3" },
      { value: "provider4", label: "Prestataire 4" },
      { value: "provider5", label: "Prestataire 5" },
    ],
    defaultValue: [],
  },
  {
    id: "minPrice",
    label: "Prix minimum",
    type: "number",
    defaultValue: 0,
  },
  {
    id: "maxPrice",
    label: "Prix maximum",
    type: "number",
    defaultValue: 500,
  },
  {
    id: "status",
    label: "Statut",
    type: "select",
    options: [
      { value: "all", label: "Tous" },
      { value: "completed", label: "Complété" },
      { value: "cancelled", label: "Annulé" },
      { value: "pending", label: "En attente" },
    ],
    defaultValue: "all",
  },
];

export const Default: Story = {
  args: {
    filterOptions: demoFilterOptions,
    onFilterChange: (filters) => console.log("Filters changed:", filters),
    className: "w-full max-w-7xl",
  },
};

export const WithInitialValues: Story = {
  args: {
    filterOptions: demoFilterOptions,
    initialValues: {
      dateRange: {
        from: new Date(2023, 0, 1),
        to: new Date(2023, 11, 31),
      },
      categories: ["sport", "culture"],
      locations: ["paris"],
      status: "completed",
    },
    onFilterChange: (filters) => console.log("Filters changed:", filters),
    className: "w-full max-w-7xl",
  },
};

export const WithLimitedOptions: Story = {
  args: {
    filterOptions: demoFilterOptions.slice(0, 4),
    onFilterChange: (filters) => console.log("Filters changed:", filters),
    className: "w-full max-w-7xl",
  },
};

export const WithCustomClass: Story = {
  args: {
    filterOptions: demoFilterOptions,
    onFilterChange: (filters) => console.log("Filters changed:", filters),
    className: "w-full max-w-7xl bg-muted p-4 rounded-lg",
  },
};
