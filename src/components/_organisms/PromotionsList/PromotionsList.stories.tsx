import type { Meta, StoryObj } from "@storybook/react";
import PromotionsList from "./PromotionsList";
import { promotionsMocks } from "@/mocks";
import { Promotion } from "@/types";

const meta: Meta<typeof PromotionsList> = {
  title: "Organisms/PromotionsList",
  component: PromotionsList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PromotionsList>;

export const Default: Story = {
  args: {
    promotions: promotionsMocks.promotions as Promotion[],
    pagination: promotionsMocks.pagination,
    isLoading: false,
    onPageChange: (page) => console.log(`Page changed to ${page}`),
    onLimitChange: (limit) => console.log(`Limit changed to ${limit}`),
    onSearch: (search) => console.log(`Search term: ${search}`),
    onStatusFilter: (status) => console.log(`Status filter: ${status}`),
    onDiscountTypeFilter: (type) =>
      console.log(`Discount type filter: ${type}`),
    onSort: (field, direction) => console.log(`Sort by ${field} ${direction}`),
    onViewDetails: (id) => console.log(`View details for ${id}`),
    onEdit: (id) => console.log(`Edit promotion ${id}`),
    onDelete: (id) => console.log(`Delete promotion ${id}`),
    onActivate: (id) => console.log(`Activate promotion ${id}`),
    onDeactivate: (id) => console.log(`Deactivate promotion ${id}`),
    onCreatePromotion: () => console.log("Create new promotion"),
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
    promotions: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
    },
  },
};

export const ActiveOnly: Story = {
  args: {
    ...Default.args,
    promotions: promotionsMocks.promotions.filter(
      (promotion) => promotion.isActive
    ) as Promotion[],
    pagination: {
      page: 1,
      limit: 10,
      total: 3,
    },
  },
};

export const InactiveOnly: Story = {
  args: {
    ...Default.args,
    promotions: promotionsMocks.promotions.filter(
      (promotion) => !promotion.isActive
    ) as Promotion[],
    pagination: {
      page: 1,
      limit: 10,
      total: 2,
    },
  },
};
