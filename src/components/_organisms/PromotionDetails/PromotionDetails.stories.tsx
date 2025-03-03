import type { Meta, StoryObj } from "@storybook/react";
import PromotionDetails from "./PromotionDetails";
import { promotionsMocks } from "@/mocks";
import { Promotion } from "@/types";

const meta: Meta<typeof PromotionDetails> = {
  title: "Organisms/PromotionDetails",
  component: PromotionDetails,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PromotionDetails>;

// Statistiques d'utilisation fictives pour les promotions
const usageStats = {
  totalRevenue: 12500,
  totalDiscountAmount: 2350,
  usageByDay: [
    {
      date: "2023-06-01",
      count: 5,
      discountAmount: 125,
    },
    {
      date: "2023-06-02",
      count: 8,
      discountAmount: 200,
    },
    {
      date: "2023-06-03",
      count: 12,
      discountAmount: 300,
    },
    {
      date: "2023-06-04",
      count: 15,
      discountAmount: 375,
    },
    {
      date: "2023-06-05",
      count: 10,
      discountAmount: 250,
    },
    {
      date: "2023-06-06",
      count: 18,
      discountAmount: 450,
    },
    {
      date: "2023-06-07",
      count: 22,
      discountAmount: 550,
    },
  ],
  usageByUser: [
    {
      userId: "user-001",
      userName: "Jean Dupont",
      usageCount: 2,
      lastUsed: "2023-06-07T14:30:00Z",
    },
    {
      userId: "user-002",
      userName: "Marie Martin",
      usageCount: 1,
      lastUsed: "2023-06-06T10:15:00Z",
    },
    {
      userId: "user-003",
      userName: "Pierre Durand",
      usageCount: 3,
      lastUsed: "2023-06-07T16:45:00Z",
    },
    {
      userId: "user-004",
      userName: "Sophie Lefebvre",
      usageCount: 1,
      lastUsed: "2023-06-05T09:20:00Z",
    },
    {
      userId: "user-005",
      userName: "Thomas Bernard",
      usageCount: 2,
      lastUsed: "2023-06-07T11:30:00Z",
    },
  ],
};

export const Default: Story = {
  args: {
    promotion: promotionsMocks.promotions[0] as Promotion,
    usageStats,
    onBack: () => console.log("Back button clicked"),
    onEdit: () => console.log("Edit button clicked"),
    onDelete: () => console.log("Delete button clicked"),
    onActivate: () => console.log("Activate button clicked"),
    onDeactivate: () => console.log("Deactivate button clicked"),
  },
};

export const Inactive: Story = {
  args: {
    promotion: promotionsMocks.promotions[2] as Promotion,
    usageStats: {
      ...usageStats,
      totalRevenue: 8750,
      totalDiscountAmount: 1650,
    },
    onBack: () => console.log("Back button clicked"),
    onEdit: () => console.log("Edit button clicked"),
    onDelete: () => console.log("Delete button clicked"),
    onActivate: () => console.log("Activate button clicked"),
    onDeactivate: () => console.log("Deactivate button clicked"),
  },
};

export const FixedAmount: Story = {
  args: {
    promotion: promotionsMocks.promotions[3] as Promotion,
    usageStats: {
      ...usageStats,
      totalRevenue: 15000,
      totalDiscountAmount: 5000,
    },
    onBack: () => console.log("Back button clicked"),
    onEdit: () => console.log("Edit button clicked"),
    onDelete: () => console.log("Delete button clicked"),
    onActivate: () => console.log("Activate button clicked"),
    onDeactivate: () => console.log("Deactivate button clicked"),
  },
};

export const NoStats: Story = {
  args: {
    promotion: promotionsMocks.promotions[4] as Promotion,
    onBack: () => console.log("Back button clicked"),
    onEdit: () => console.log("Edit button clicked"),
    onDelete: () => console.log("Delete button clicked"),
    onActivate: () => console.log("Activate button clicked"),
    onDeactivate: () => console.log("Deactivate button clicked"),
  },
};
