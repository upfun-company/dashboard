/**
 * Mocks pour la gestion financière
 */
import { faker } from "@faker-js/faker";
import {
  FinancialTransaction,
  ProviderPayout,
  CommissionConfig,
  FinancialReport,
  FinancialStats,
} from "../types/finance";
import { ReservationNew } from "./reservationsMocks";

// Ajouter un type pour étendre ReservationNew avec les propriétés nécessaires
type ExtendedReservation = ReservationNew & {
  customerName?: string;
  providerName?: string;
  activityName?: string;
};

/**
 * Génère un mock de transaction financière
 */
export const generateMockFinancialTransaction = (
  id: number,
  reservation?: ReservationNew
): FinancialTransaction => {
  const hasReservation = !!reservation;
  const extendedReservation = reservation as ExtendedReservation;

  const type = faker.helpers.arrayElement([
    "payment",
    "payment",
    "payment",
    "payment", // Plus de chance d'être un paiement
    "refund",
    "payout",
    "fee",
  ]);

  // Montant de la transaction
  const amount = hasReservation
    ? type === "refund"
      ? Math.round(reservation.amount * (Math.random() * 0.5 + 0.5))
      : reservation.amount
    : faker.number.int({ min: 1000, max: 50000 }) / 100;

  // Commission (pour les paiements et les remboursements)
  const commission =
    type === "payment" || type === "refund"
      ? hasReservation
        ? reservation.commission
        : Math.round(amount * 0.1)
      : 0;

  // Montant net
  const netAmount =
    type === "payment"
      ? amount - commission
      : type === "refund"
      ? -(amount - commission)
      : type === "payout"
      ? -amount
      : type === "fee"
      ? -amount
      : 0;

  // Statut de la transaction
  const status = faker.helpers.arrayElement([
    "completed",
    "completed",
    "completed", // Plus de chance d'être complétée
    "pending",
    "failed",
  ]);

  const createdAt = hasReservation
    ? reservation.date // Utiliser la date de réservation comme approximation
    : faker.date.recent({ days: 30 }).toISOString();

  const updatedAt = new Date(
    new Date(createdAt).getTime() + Math.floor(Math.random() * 3600000)
  ).toISOString();

  const paymentMethod = faker.helpers.arrayElement([
    "card",
    "card",
    "card", // Plus de chance d'être une carte
    "paypal",
    "apple_pay",
    "google_pay",
    "bank_transfer",
  ]);

  return {
    id: `transaction-${id.toString().padStart(5, "0")}`,
    reservationId: hasReservation
      ? reservation.id
      : `reservation-${faker.string.uuid().slice(0, 8)}`,
    userId: hasReservation
      ? reservation.userId
      : `user-${faker.string.uuid().slice(0, 8)}`,
    providerId: hasReservation
      ? reservation.providerId
      : `provider-${faker.string.uuid().slice(0, 8)}`,
    amount,
    commission,
    netAmount,
    type,
    status,
    paymentMethod,
    paymentId: `payment-${faker.string.uuid().slice(0, 8)}`,
    createdAt,
    updatedAt,
    metadata:
      type === "payment" && paymentMethod === "card"
        ? {
            cardLast4: faker.finance.creditCardNumber("####"),
            cardBrand: faker.helpers.arrayElement([
              "visa",
              "mastercard",
              "amex",
              "discover",
            ]),
            cardExpiry: `${faker.number
              .int({ min: 1, max: 12 })
              .toString()
              .padStart(2, "0")}/${faker.number.int({ min: 23, max: 28 })}`,
          }
        : undefined,
    customerName: hasReservation
      ? extendedReservation.customerName || faker.person.fullName()
      : faker.person.fullName(),
    providerName: hasReservation
      ? extendedReservation.providerName || faker.company.name()
      : faker.company.name(),
    activityName: hasReservation
      ? extendedReservation.activityName || faker.commerce.productName()
      : faker.commerce.productName(),
  };
};

/**
 * Génère des mocks de transactions financières
 */
export const generateMockFinancialTransactions = (
  count: number = 50,
  reservations?: ReservationNew[]
): FinancialTransaction[] => {
  const transactions: FinancialTransaction[] = [];

  if (reservations && reservations.length > 0) {
    reservations.forEach((reservation) => {
      // Chaque réservation a au moins une transaction de paiement
      transactions.push(
        generateMockFinancialTransaction(transactions.length + 1, reservation)
      );

      // Certaines réservations ont des transactions supplémentaires
      if (
        reservation.status === "refunded" ||
        (reservation.status === "cancelled" &&
          reservation.paymentStatus === "refunded")
      ) {
        // Transaction de remboursement
        transactions.push(
          generateMockFinancialTransaction(transactions.length + 1, reservation)
        );
      }

      if (reservation.status === "completed" && Math.random() > 0.7) {
        // Transaction de versement au prestataire
        transactions.push(
          generateMockFinancialTransaction(transactions.length + 1, reservation)
        );
      }
    });
  }

  // Ajouter des transactions supplémentaires si nécessaire
  const remainingCount = count - transactions.length;
  if (remainingCount > 0) {
    for (let i = 0; i < remainingCount; i++) {
      transactions.push(
        generateMockFinancialTransaction(transactions.length + 1)
      );
    }
  }

  return transactions;
};

/**
 * Génère un mock de paiement à un prestataire
 */
export const generateMockProviderPayout = (
  id: number,
  providerId?: string,
  providerName?: string
): ProviderPayout => {
  const status = faker.helpers.arrayElement([
    "pending",
    "pending", // Plus de chance d'être en attente
    "processing",
    "completed",
    "completed", // Plus de chance d'être complété
    "failed",
  ]);

  const createdAt = faker.date.recent({ days: 30 }).toISOString();
  const processedAt =
    status === "completed" || status === "failed"
      ? new Date(
          new Date(createdAt).getTime() +
            Math.floor(Math.random() * 86400000 * 3)
        ).toISOString()
      : undefined;

  return {
    id: `payout-${id.toString().padStart(5, "0")}`,
    providerId: providerId || `provider-${faker.string.uuid().slice(0, 8)}`,
    providerName: providerName || faker.company.name(),
    amount: faker.number.int({ min: 10000, max: 500000 }) / 100,
    status,
    method: faker.helpers.arrayElement(["bank_transfer", "paypal", "other"]),
    createdAt,
    processedAt,
    reference: `REF-${faker.string.alphanumeric(8).toUpperCase()}`,
    transactions: Array.from(
      { length: faker.number.int({ min: 1, max: 5 }) },
      () => `transaction-${faker.string.uuid().slice(0, 8)}`
    ),
    notes: Math.random() > 0.7 ? faker.lorem.sentence() : undefined,
  };
};

/**
 * Génère des mocks de paiements aux prestataires
 */
export const generateMockProviderPayouts = (
  count: number = 30
): ProviderPayout[] => {
  return Array.from({ length: count }, (_, index) =>
    generateMockProviderPayout(index + 1)
  );
};

/**
 * Génère un mock de configuration de commission
 */
export const generateMockCommissionConfig = (id: number): CommissionConfig => {
  const applicableTo = faker.helpers.arrayElement([
    "all",
    "category",
    "provider",
  ]);
  const type = faker.helpers.arrayElement([
    "percentage",
    "percentage",
    "fixed",
  ]);

  return {
    id: `commission-${id.toString().padStart(3, "0")}`,
    name: faker.helpers.arrayElement([
      "Commission standard",
      "Commission premium",
      "Commission réduite",
      `Commission ${faker.commerce.department()}`,
      `Commission prestataire spécial`,
    ]),
    type,
    value:
      type === "percentage"
        ? faker.number.int({ min: 5, max: 25 })
        : faker.number.int({ min: 100, max: 5000 }) / 100,
    minAmount:
      Math.random() > 0.5
        ? faker.number.int({ min: 100, max: 500 }) / 100
        : undefined,
    maxAmount:
      Math.random() > 0.5
        ? faker.number.int({ min: 5000, max: 20000 }) / 100
        : undefined,
    applicableTo,
    categoryId:
      applicableTo === "category"
        ? `category-${faker.string.uuid().slice(0, 8)}`
        : undefined,
    categoryName:
      applicableTo === "category" ? faker.commerce.department() : undefined,
    providerId:
      applicableTo === "provider"
        ? `provider-${faker.string.uuid().slice(0, 8)}`
        : undefined,
    providerName:
      applicableTo === "provider" ? faker.company.name() : undefined,
    isActive: faker.datatype.boolean(0.8), // 80% de chance d'être actif
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    updatedAt: faker.date.recent({ days: 60 }).toISOString(),
  };
};

/**
 * Génère des mocks de configurations de commission
 */
export const generateMockCommissions = (
  count: number = 10
): CommissionConfig[] => {
  return Array.from({ length: count }, (_, index) =>
    generateMockCommissionConfig(index + 1)
  );
};

/**
 * Génère un mock de rapport financier
 */
export const generateMockFinancialReport = (id: number): FinancialReport => {
  const period = faker.helpers.arrayElement([
    "daily",
    "weekly",
    "weekly",
    "monthly",
    "monthly",
    "monthly", // Plus de chance d'être mensuel
    "quarterly",
    "yearly",
    "custom",
  ]);

  const endDate = faker.date.recent({ days: 30 });
  let startDate: Date;

  switch (period) {
    case "daily":
      startDate = new Date(endDate);
      break;
    case "weekly":
      startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "monthly":
      startDate = new Date(endDate);
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case "quarterly":
      startDate = new Date(endDate);
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case "yearly":
      startDate = new Date(endDate);
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      startDate = new Date(endDate);
      startDate.setDate(
        startDate.getDate() - faker.number.int({ min: 1, max: 90 })
      );
  }

  const totalRevenue = faker.number.int({ min: 50000, max: 5000000 }) / 100;
  const totalCommissions =
    totalRevenue * (faker.number.int({ min: 10, max: 25 }) / 100);
  const totalPayouts = totalRevenue - totalCommissions;

  return {
    id: `report-${id.toString().padStart(5, "0")}`,
    period,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    totalRevenue,
    totalCommissions,
    totalPayouts,
    netProfit: totalCommissions,
    transactionCount: faker.number.int({ min: 50, max: 1000 }),
    reservationCount: faker.number.int({ min: 30, max: 500 }),
    createdAt: new Date(endDate.getTime() + 86400000).toISOString(), // Un jour après la fin de la période
    generatedBy: faker.helpers.arrayElement([
      "system",
      "admin",
      "finance-manager",
    ]),
    status: faker.helpers.arrayElement(["draft", "final", "final", "final"]), // Plus de chance d'être final
  };
};

/**
 * Génère des mocks de rapports financiers
 */
export const generateMockFinancialReports = (
  count: number = 12
): FinancialReport[] => {
  return Array.from({ length: count }, (_, index) =>
    generateMockFinancialReport(index + 1)
  );
};

/**
 * Génère un mock de statistiques financières
 */
export const generateMockFinancialStats = (): FinancialStats => {
  const totalRevenue = faker.number.int({ min: 100000, max: 10000000 }) / 100;
  const totalCommissions =
    totalRevenue * (faker.number.int({ min: 10, max: 25 }) / 100);

  // Générer des données pour les 30 derniers jours
  const today = new Date();
  const revenueByDay = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (29 - index));
    return {
      date: date.toISOString().split("T")[0],
      amount: faker.number.int({ min: 1000, max: 50000 }) / 100,
    };
  });

  const commissionsByDay = revenueByDay.map((day) => ({
    date: day.date,
    amount: day.amount * (faker.number.int({ min: 10, max: 25 }) / 100),
  }));

  return {
    totalRevenue,
    totalCommissions,
    pendingPayouts: faker.number.int({ min: 5000, max: 100000 }) / 100,
    completedPayouts: faker.number.int({ min: 50000, max: 1000000 }) / 100,
    failedTransactions: faker.number.int({ min: 1, max: 50 }),
    averageTransactionValue: faker.number.int({ min: 5000, max: 20000 }) / 100,
    revenueByDay,
    commissionsByDay,
  };
};
