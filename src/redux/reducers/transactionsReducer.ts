/**
 * Reducer pour la gestion des transactions
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "@/types";

/**
 * Interface pour l'état du reducer transactions
 */
interface TransactionsState {
  /** Liste des transactions */
  transactions: Transaction[];
  /** Transaction sélectionnée */
  selectedTransaction: Transaction | null;
  /** Informations de pagination */
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  /** Options de filtrage */
  filters: {
    search: string;
    sortBy: string;
    sortDirection: "asc" | "desc";
    type?: "payment" | "refund" | "commission" | "all";
    status?: "pending" | "completed" | "failed" | "all";
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
  };
  /** Statistiques des transactions */
  stats: {
    totalAmount: number;
    pendingAmount: number;
    completedAmount: number;
    failedAmount: number;
    paymentsCount: number;
    refundsCount: number;
    commissionsCount: number;
  };
  /** Indique si les données sont en cours de chargement */
  isLoading: boolean;
  /** Indique si une erreur s'est produite */
  error: string | null;
}

/**
 * État initial du reducer transactions
 */
const initialState: TransactionsState = {
  transactions: [],
  selectedTransaction: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  filters: {
    search: "",
    sortBy: "date",
    sortDirection: "desc",
    type: "all",
    status: "all",
  },
  stats: {
    totalAmount: 0,
    pendingAmount: 0,
    completedAmount: 0,
    failedAmount: 0,
    paymentsCount: 0,
    refundsCount: 0,
    commissionsCount: 0,
  },
  isLoading: false,
  error: null,
};

/**
 * Slice Redux pour la gestion des transactions
 */
const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    /**
     * Action pour définir la liste des transactions
     */
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    /**
     * Action pour définir une transaction sélectionnée
     */
    setSelectedTransaction: (
      state,
      action: PayloadAction<Transaction | null>
    ) => {
      state.selectedTransaction = action.payload;
    },
    /**
     * Action pour mettre à jour les options de filtrage
     */
    updateFilters: (
      state,
      action: PayloadAction<Partial<TransactionsState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
      // Réinitialiser la pagination lors du changement de filtres
      state.pagination.page = 1;
    },
    /**
     * Action pour définir la page courante
     */
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    /**
     * Action pour définir le nombre d'éléments par page
     */
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1; // Réinitialiser la page lors du changement de limite
    },
    /**
     * Action pour définir les statistiques des transactions
     */
    setStats: (state, action: PayloadAction<TransactionsState["stats"]>) => {
      state.stats = action.payload;
    },
    /**
     * Action pour définir l'état de chargement
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    /**
     * Action pour définir une erreur
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    /**
     * Action pour ajouter une transaction
     */
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
      state.pagination.total += 1;

      // Mettre à jour les statistiques
      if (action.payload.type === "payment") {
        state.stats.paymentsCount += 1;
      } else if (action.payload.type === "refund") {
        state.stats.refundsCount += 1;
      } else if (action.payload.type === "commission") {
        state.stats.commissionsCount += 1;
      }

      if (action.payload.status === "pending") {
        state.stats.pendingAmount += action.payload.amount;
      } else if (action.payload.status === "completed") {
        state.stats.completedAmount += action.payload.amount;
      } else if (action.payload.status === "failed") {
        state.stats.failedAmount += action.payload.amount;
      }

      state.stats.totalAmount += action.payload.amount;
    },
    /**
     * Action pour mettre à jour une transaction
     */
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(
        (transaction) => transaction.id === action.payload.id
      );
      if (index !== -1) {
        // Mettre à jour les statistiques en fonction des changements
        const oldTransaction = state.transactions[index];

        // Soustraire les anciennes valeurs
        if (oldTransaction.type === "payment") {
          state.stats.paymentsCount -= 1;
        } else if (oldTransaction.type === "refund") {
          state.stats.refundsCount -= 1;
        } else if (oldTransaction.type === "commission") {
          state.stats.commissionsCount -= 1;
        }

        if (oldTransaction.status === "pending") {
          state.stats.pendingAmount -= oldTransaction.amount;
        } else if (oldTransaction.status === "completed") {
          state.stats.completedAmount -= oldTransaction.amount;
        } else if (oldTransaction.status === "failed") {
          state.stats.failedAmount -= oldTransaction.amount;
        }

        state.stats.totalAmount -= oldTransaction.amount;

        // Ajouter les nouvelles valeurs
        if (action.payload.type === "payment") {
          state.stats.paymentsCount += 1;
        } else if (action.payload.type === "refund") {
          state.stats.refundsCount += 1;
        } else if (action.payload.type === "commission") {
          state.stats.commissionsCount += 1;
        }

        if (action.payload.status === "pending") {
          state.stats.pendingAmount += action.payload.amount;
        } else if (action.payload.status === "completed") {
          state.stats.completedAmount += action.payload.amount;
        } else if (action.payload.status === "failed") {
          state.stats.failedAmount += action.payload.amount;
        }

        state.stats.totalAmount += action.payload.amount;

        // Mettre à jour la transaction
        state.transactions[index] = action.payload;
      }

      if (
        state.selectedTransaction &&
        state.selectedTransaction.id === action.payload.id
      ) {
        state.selectedTransaction = action.payload;
      }
    },
    /**
     * Action pour supprimer une transaction
     */
    deleteTransaction: (state, action: PayloadAction<string>) => {
      const transaction = state.transactions.find(
        (t) => t.id === action.payload
      );

      if (transaction) {
        // Mettre à jour les statistiques
        if (transaction.type === "payment") {
          state.stats.paymentsCount -= 1;
        } else if (transaction.type === "refund") {
          state.stats.refundsCount -= 1;
        } else if (transaction.type === "commission") {
          state.stats.commissionsCount -= 1;
        }

        if (transaction.status === "pending") {
          state.stats.pendingAmount -= transaction.amount;
        } else if (transaction.status === "completed") {
          state.stats.completedAmount -= transaction.amount;
        } else if (transaction.status === "failed") {
          state.stats.failedAmount -= transaction.amount;
        }

        state.stats.totalAmount -= transaction.amount;
      }

      state.transactions = state.transactions.filter(
        (t) => t.id !== action.payload
      );
      state.pagination.total -= 1;

      if (
        state.selectedTransaction &&
        state.selectedTransaction.id === action.payload
      ) {
        state.selectedTransaction = null;
      }
    },
  },
});

// Export des actions
export const {
  setTransactions,
  setSelectedTransaction,
  updateFilters,
  setPage,
  setLimit,
  setStats,
  setLoading,
  setError,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = transactionsSlice.actions;

// Export du reducer
export default transactionsSlice.reducer;
