/**
 * Reducer pour la gestion des litiges
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Interface pour un litige
 */
interface Dispute {
  id: string;
  reservationId: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolution?: string;
}

/**
 * Interface pour l'état du reducer disputes
 */
interface DisputesState {
  /** Liste des litiges */
  disputes: Dispute[];
  /** Litige sélectionné */
  selectedDispute: Dispute | null;
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
    status?: "open" | "in_progress" | "resolved" | "closed" | "all";
    priority?: "low" | "medium" | "high" | "all";
  };
  /** Indique si les données sont en cours de chargement */
  isLoading: boolean;
  /** Indique si une erreur s'est produite */
  error: string | null;
}

/**
 * État initial du reducer disputes
 */
const initialState: DisputesState = {
  disputes: [],
  selectedDispute: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  filters: {
    search: "",
    sortBy: "createdAt",
    sortDirection: "desc",
    status: "all",
    priority: "all",
  },
  isLoading: false,
  error: null,
};

/**
 * Slice Redux pour la gestion des litiges
 */
const disputesSlice = createSlice({
  name: "disputes",
  initialState,
  reducers: {
    /**
     * Action pour définir la liste des litiges
     */
    setDisputes: (state, action: PayloadAction<Dispute[]>) => {
      state.disputes = action.payload;
    },
    /**
     * Action pour définir un litige sélectionné
     */
    setSelectedDispute: (state, action: PayloadAction<Dispute | null>) => {
      state.selectedDispute = action.payload;
    },
    /**
     * Action pour mettre à jour les options de filtrage
     */
    updateFilters: (
      state,
      action: PayloadAction<Partial<DisputesState["filters"]>>
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
     * Action pour ajouter un litige
     */
    addDispute: (state, action: PayloadAction<Dispute>) => {
      state.disputes.unshift(action.payload);
      state.pagination.total += 1;
    },
    /**
     * Action pour mettre à jour un litige
     */
    updateDispute: (state, action: PayloadAction<Dispute>) => {
      const index = state.disputes.findIndex(
        (dispute) => dispute.id === action.payload.id
      );
      if (index !== -1) {
        state.disputes[index] = action.payload;
      }
      if (
        state.selectedDispute &&
        state.selectedDispute.id === action.payload.id
      ) {
        state.selectedDispute = action.payload;
      }
    },
    /**
     * Action pour supprimer un litige
     */
    deleteDispute: (state, action: PayloadAction<string>) => {
      state.disputes = state.disputes.filter(
        (dispute) => dispute.id !== action.payload
      );
      state.pagination.total -= 1;
      if (
        state.selectedDispute &&
        state.selectedDispute.id === action.payload
      ) {
        state.selectedDispute = null;
      }
    },
  },
});

// Export des actions
export const {
  setDisputes,
  setSelectedDispute,
  updateFilters,
  setPage,
  setLimit,
  setLoading,
  setError,
  addDispute,
  updateDispute,
  deleteDispute,
} = disputesSlice.actions;

// Export du reducer
export default disputesSlice.reducer;
