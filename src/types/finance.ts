/**
 * Types pour la gestion financière
 */

/**
 * Interface pour une transaction financière détaillée
 */
export interface FinancialTransaction {
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
  customerName?: string;
  providerName?: string;
  activityName?: string;
}

/**
 * Interface pour un paiement à un prestataire
 */
export interface ProviderPayout {
  id: string;
  providerId: string;
  providerName: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  method: "bank_transfer" | "paypal" | "other";
  createdAt: string;
  processedAt?: string;
  reference?: string;
  transactions: string[]; // IDs des transactions liées
  notes?: string;
}

/**
 * Interface pour la configuration des commissions
 */
export interface CommissionConfig {
  id: string;
  name: string;
  type: "percentage" | "fixed";
  value: number; // Pourcentage ou montant fixe
  minAmount?: number; // Montant minimum de commission
  maxAmount?: number; // Montant maximum de commission
  applicableTo: "all" | "category" | "provider";
  categoryId?: string;
  categoryName?: string;
  providerId?: string;
  providerName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface pour un rapport financier
 */
export interface FinancialReport {
  id: string;
  period: "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "custom";
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalCommissions: number;
  totalPayouts: number;
  netProfit: number;
  transactionCount: number;
  reservationCount: number;
  createdAt: string;
  generatedBy: string;
  status: "draft" | "final";
}

/**
 * Interface pour les filtres de transactions
 */
export interface TransactionFilters {
  search: string;
  dateRange?: {
    start: string;
    end: string;
  };
  status?: ("pending" | "completed" | "failed" | "cancelled")[];
  type?: ("payment" | "refund" | "payout" | "fee")[];
  providerId?: string;
  userId?: string;
  minAmount?: number;
  maxAmount?: number;
  paymentMethod?: string[];
  sortBy: string;
  sortDirection: "asc" | "desc";
}

/**
 * Interface pour les filtres de paiements aux prestataires
 */
export interface PayoutFilters {
  search: string;
  dateRange?: {
    start: string;
    end: string;
  };
  status?: ("pending" | "processing" | "completed" | "failed")[];
  providerId?: string;
  minAmount?: number;
  maxAmount?: number;
  method?: string[];
  sortBy: string;
  sortDirection: "asc" | "desc";
}

/**
 * Interface pour les statistiques financières
 */
export interface FinancialStats {
  totalRevenue: number;
  totalCommissions: number;
  pendingPayouts: number;
  completedPayouts: number;
  failedTransactions: number;
  averageTransactionValue: number;
  revenueByDay: {
    date: string;
    amount: number;
  }[];
  commissionsByDay: {
    date: string;
    amount: number;
  }[];
}
