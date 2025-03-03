/**
 * Mocks pour les transactions
 */
import { ReservationNew } from "./reservationsMocks";

/**
 * Type pour une transaction
 */
export type Transaction = {
  id: string;
  reservationId: string;
  userId: string;
  providerId: string;
  amount: number;
  commission: number;
  netAmount: number;
  type: "payment" | "refund" | "payout" | "fee";
  status: "pending" | "completed" | "failed" | "cancelled";
  paymentMethod:
    | "card"
    | "paypal"
    | "apple_pay"
    | "google_pay"
    | "bank_transfer";
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
  // Relations
  reservation?: ReservationNew;
};

/**
 * Génère un mock de transaction
 */
export const generateMockTransaction = (
  id: number,
  reservation: ReservationNew
): Transaction => {
  // Déterminer le type de transaction en fonction du statut de la réservation
  let type: "payment" | "refund" | "payout" | "fee";
  if (
    reservation.status === "refunded" ||
    (reservation.status === "cancelled" &&
      reservation.paymentStatus === "refunded")
  ) {
    type = Math.random() > 0.5 ? "refund" : "fee";
  } else if (reservation.status === "completed" && Math.random() > 0.7) {
    type = "payout";
  } else {
    type = "payment";
  }

  // Déterminer le statut de la transaction en fonction du statut de paiement de la réservation
  let status: "pending" | "completed" | "failed" | "cancelled";
  if (type === "payment") {
    if (reservation.paymentStatus === "paid") {
      status = "completed";
    } else if (reservation.paymentStatus === "pending") {
      status = "pending";
    } else if (reservation.paymentStatus === "failed") {
      status = "failed";
    } else {
      status = "cancelled";
    }
  } else if (type === "refund") {
    status = Math.random() > 0.2 ? "completed" : "pending";
  } else if (type === "payout") {
    status = Math.random() > 0.3 ? "completed" : "pending";
  } else {
    status = "completed";
  }

  // Calculer le montant et la commission
  let amount: number;
  let commission: number;
  if (type === "payment") {
    amount = reservation.amount;
    commission = reservation.commission;
  } else if (type === "refund") {
    amount = -reservation.amount;
    commission = -reservation.commission;
  } else if (type === "payout") {
    amount = -(reservation.amount - reservation.commission);
    commission = 0;
  } else {
    // fee
    amount = reservation.commission;
    commission = 0;
  }

  const netAmount = amount - commission;

  const createdAt = new Date(
    new Date(reservation.date).getTime() +
      (type === "payment" ? 0 : Math.floor(Math.random() * 86400000 * 5))
  ).toISOString();
  const updatedAt = new Date(
    new Date(createdAt).getTime() + Math.floor(Math.random() * 3600000)
  ).toISOString();

  return {
    id: `transaction-${id.toString().padStart(3, "0")}`,
    reservationId: reservation.id,
    userId: reservation.userId,
    providerId: reservation.providerId,
    amount,
    commission,
    netAmount,
    type,
    status,
    paymentMethod: reservation.paymentMethod,
    paymentId: `payment-${Math.floor(Math.random() * 1000000)}`,
    createdAt,
    updatedAt,
    metadata:
      type === "payment"
        ? {
            cardLast4: Math.floor(Math.random() * 10000)
              .toString()
              .padStart(4, "0"),
            cardBrand: ["visa", "mastercard", "amex", "discover"][
              Math.floor(Math.random() * 4)
            ],
          }
        : undefined,
    reservation,
  };
};

/**
 * Génère des mocks de transactions pour un ensemble de réservations
 */
export const generateMockTransactions = (
  reservations: ReservationNew[]
): Transaction[] => {
  const transactions: Transaction[] = [];

  reservations.forEach((reservation) => {
    // Chaque réservation a au moins une transaction de paiement
    transactions.push(
      generateMockTransaction(transactions.length + 1, reservation)
    );

    // Certaines réservations ont des transactions supplémentaires
    if (
      reservation.status === "refunded" ||
      (reservation.status === "cancelled" &&
        reservation.paymentStatus === "refunded")
    ) {
      // Transaction de remboursement
      transactions.push(
        generateMockTransaction(transactions.length + 1, reservation)
      );
    }

    if (reservation.status === "completed" && Math.random() > 0.7) {
      // Transaction de versement au prestataire
      transactions.push(
        generateMockTransaction(transactions.length + 1, reservation)
      );
    }
  });

  return transactions;
};
