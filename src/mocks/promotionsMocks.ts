/**
 * Mocks pour les promotions
 * @module mocks/promotionsMocks
 */

import { Promotion } from "@/types";

/**
 * Données mockées pour les promotions
 */
export const promotionsMocks = {
  promotions: [
    {
      id: "promo-001",
      code: "BIENVENUE10",
      description: "10% de réduction sur votre première réservation",
      discountType: "percentage",
      discountValue: 10,
      startDate: "2023-01-01T00:00:00Z",
      endDate: "2023-12-31T23:59:59Z",
      isActive: true,
      currentUsageCount: 45,
      maxUsageCount: 100,
      maxUsagePerUser: 1,
      minOrderAmount: null,
      applicableActivities: [],
      excludedActivities: [],
      createdAt: "2023-01-01T10:00:00Z",
      updatedAt: "2023-01-01T10:00:00Z",
    },
    {
      id: "promo-002",
      code: "ETE2023",
      description: "15% de réduction sur les activités d'été",
      discountType: "percentage",
      discountValue: 15,
      startDate: "2023-06-01T00:00:00Z",
      endDate: "2023-08-31T23:59:59Z",
      isActive: true,
      currentUsageCount: 78,
      maxUsageCount: 200,
      maxUsagePerUser: 2,
      minOrderAmount: 50,
      applicableActivities: ["act-001", "act-002", "act-003"],
      excludedActivities: [],
      createdAt: "2023-05-15T14:30:00Z",
      updatedAt: "2023-05-15T14:30:00Z",
    },
    {
      id: "promo-003",
      code: "WEEKEND25",
      description: "25€ de réduction sur les activités du weekend",
      discountType: "fixed_amount",
      discountValue: 25,
      startDate: "2023-03-01T00:00:00Z",
      endDate: "2023-12-31T23:59:59Z",
      isActive: true,
      currentUsageCount: 120,
      maxUsageCount: 150,
      maxUsagePerUser: 3,
      minOrderAmount: 100,
      applicableActivities: [],
      excludedActivities: ["act-004", "act-005"],
      createdAt: "2023-02-20T09:15:00Z",
      updatedAt: "2023-02-20T09:15:00Z",
    },
    {
      id: "promo-004",
      code: "NOEL2022",
      description: "20% de réduction pour les fêtes de fin d'année",
      discountType: "percentage",
      discountValue: 20,
      startDate: "2022-12-01T00:00:00Z",
      endDate: "2022-12-31T23:59:59Z",
      isActive: false,
      currentUsageCount: 95,
      maxUsageCount: 100,
      maxUsagePerUser: 1,
      minOrderAmount: null,
      applicableActivities: [],
      excludedActivities: [],
      createdAt: "2022-11-15T11:00:00Z",
      updatedAt: "2022-12-31T23:59:59Z",
    },
    {
      id: "promo-005",
      code: "FAMILLE",
      description: "10% de réduction sur les activités familiales",
      discountType: "percentage",
      discountValue: 10,
      startDate: "2023-01-01T00:00:00Z",
      endDate: "2023-12-31T23:59:59Z",
      isActive: true,
      currentUsageCount: 65,
      maxUsageCount: null,
      maxUsagePerUser: null,
      minOrderAmount: null,
      applicableActivities: ["act-006", "act-007", "act-008"],
      excludedActivities: [],
      createdAt: "2023-01-05T16:45:00Z",
      updatedAt: "2023-01-05T16:45:00Z",
    },
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 5,
  },
};

/**
 * Génère une promotion mockée
 * @param id - Identifiant de la promotion
 * @returns Promotion mockée
 */
export const generateMockPromotion = (id: string): Promotion => {
  return {
    id,
    code: `PROMO${Math.floor(Math.random() * 1000)}`,
    description: `Promotion ${id}`,
    discountType: Math.random() > 0.5 ? "percentage" : "fixed_amount",
    discountValue:
      Math.random() > 0.5
        ? Math.floor(Math.random() * 50) + 5
        : Math.floor(Math.random() * 100) + 10,
    startDate: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    ).toISOString(),
    endDate: new Date(
      Date.now() + Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000
    ).toISOString(),
    isActive: Math.random() > 0.3,
    currentUsageCount: Math.floor(Math.random() * 100),
    maxUsageCount:
      Math.random() > 0.3 ? Math.floor(Math.random() * 200) + 100 : undefined,
    maxUsagePerUser:
      Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : undefined,
    minOrderAmount:
      Math.random() > 0.7 ? Math.floor(Math.random() * 100) + 50 : undefined,
    applicableActivities:
      Math.random() > 0.5
        ? []
        : Array.from(
            { length: Math.floor(Math.random() * 5) + 1 },
            (_, i) => `act-${String(i + 1).padStart(3, "0")}`
          ),
    excludedActivities:
      Math.random() > 0.7
        ? []
        : Array.from(
            { length: Math.floor(Math.random() * 3) + 1 },
            (_, i) => `act-${String(i + 10).padStart(3, "0")}`
          ),
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000
    ).toISOString(),
    updatedAt: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    ).toISOString(),
  };
};

/**
 * Génère plusieurs promotions mockées
 * @param count - Nombre de promotions à générer
 * @returns Liste de promotions mockées
 */
export const generateMockPromotions = (count: number): Promotion[] => {
  return Array.from({ length: count }, (_, i) =>
    generateMockPromotion(`promo-${String(i + 1).padStart(3, "0")}`)
  );
};
