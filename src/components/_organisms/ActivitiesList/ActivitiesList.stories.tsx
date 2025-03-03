import type { Meta, StoryObj } from "@storybook/react";
import ActivitiesList from "./ActivitiesList";
import { Activity } from "@/types";
import { generateMockActivities } from "@/mocks/activitiesMocks";
import { generateMockProviders } from "@/mocks/providersMocks";

// Créer des données mockées
const providers = generateMockProviders(5);
const mockActivities = generateMockActivities(20, providers);
const mockPagination = {
  page: 1,
  limit: 10,
  total: 20,
};

const meta: Meta<typeof ActivitiesList> = {
  title: "Organisms/ActivitiesList",
  component: ActivitiesList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ActivitiesList>;

export const Default: Story = {
  args: {
    activities: mockActivities as Activity[],
    pagination: mockPagination,
    isLoading: false,
    availableCategories: [
      "Cuisine",
      "Culture",
      "Gastronomie",
      "Loisirs",
      "Art",
    ],
    onPageChange: (page) => console.log(`Page changed to ${page}`),
    onLimitChange: (limit) => console.log(`Limit changed to ${limit}`),
    onSearch: (search) => console.log(`Search term: ${search}`),
    onStatusFilter: (status) => console.log(`Status filter: ${status}`),
    onCategoryFilter: (category) => console.log(`Category filter: ${category}`),
    onSort: (field, direction) => console.log(`Sort by ${field} ${direction}`),
    onViewDetails: (id) => console.log(`View details for ${id}`),
    onEdit: (id) => console.log(`Edit activity ${id}`),
    onDelete: (id) => console.log(`Delete activity ${id}`),
    onApprove: (id) => console.log(`Approve activity ${id}`),
    onReject: (id) => console.log(`Reject activity ${id}`),
    onCreateActivity: () => console.log("Create new activity"),
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    ...Default.args,
    activities: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
    },
  },
};

export const WithFilters: Story = {
  args: {
    ...Default.args,
    activities: mockActivities.filter(
      (activity: Activity) => activity.status === "pending_review"
    ) as Activity[],
    pagination: {
      page: 1,
      limit: 10,
      total: mockActivities.filter(
        (activity) => activity.status === "pending_review"
      ).length,
    },
  },
};
