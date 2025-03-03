/**
 * Reducer pour la gestion des promotions
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Promotion } from "@/types";

/**
 * Interface pour l'état du reducer promotions
 */
interface PromotionsState {
  /** Liste des promotions */
  promotions: Promotion[];
  /** Promotion sélectionnée */
  selectedPromotion: Promotion | null;
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
    isActive?: boolean | "all";
    discountType?: "percentage" | "fixed_amount" | "all";
    startDateFrom?: string;
    startDateTo?: string;
    endDateFrom?: string;
    endDateTo?: string;
  };
  /** Indique si les données sont en cours de chargement */
  isLoading: boolean;
  /** Indique si une erreur s'est produite */
  error: string | null;
}

/**
 * État initial du reducer promotions
 */
const initialState: PromotionsState = {
  promotions: [],
  selectedPromotion: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  filters: {
    search: "",
    sortBy: "createdAt",
    sortDirection: "desc",
    isActive: "all",
    discountType: "all",
  },
  isLoading: false,
  error: null,
};

/**
 * Slice Redux pour la gestion des promotions
 */
const promotionsSlice = createSlice({
  name: "promotions",
  initialState,
  reducers: {
    /**
     * Action pour définir la liste des promotions
     */
    setPromotions: (state, action: PayloadAction<Promotion[]>) => {
      state.promotions = action.payload;
    },
    /**
     * Action pour définir une promotion sélectionnée
     */
    setSelectedPromotion: (state, action: PayloadAction<Promotion | null>) => {
      state.selectedPromotion = action.payload;
    },
    /**
     * Action pour mettre à jour les options de filtrage
     */
    updateFilters: (
      state,
      action: PayloadAction<Partial<PromotionsState["filters"]>>
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
     * Action pour ajouter une promotion
     */
    addPromotion: (state, action: PayloadAction<Promotion>) => {
      state.promotions.unshift(action.payload);
      state.pagination.total += 1;
    },
    /**
     * Action pour mettre à jour une promotion
     */
    updatePromotion: (state, action: PayloadAction<Promotion>) => {
      const index = state.promotions.findIndex(
        (promotion) => promotion.id === action.payload.id
      );
      if (index !== -1) {
        state.promotions[index] = action.payload;
      }
      if (
        state.selectedPromotion &&
        state.selectedPromotion.id === action.payload.id
      ) {
        state.selectedPromotion = action.payload;
      }
    },
    /**
     * Action pour supprimer une promotion
     */
    deletePromotion: (state, action: PayloadAction<string>) => {
      state.promotions = state.promotions.filter(
        (promotion) => promotion.id !== action.payload
      );
      state.pagination.total -= 1;
      if (
        state.selectedPromotion &&
        state.selectedPromotion.id === action.payload
      ) {
        state.selectedPromotion = null;
      }
    },
    /**
     * Action pour activer une promotion
     */
    activatePromotion: (state, action: PayloadAction<string>) => {
      const index = state.promotions.findIndex(
        (promotion) => promotion.id === action.payload
      );
      if (index !== -1) {
        state.promotions[index].isActive = true;
      }
      if (
        state.selectedPromotion &&
        state.selectedPromotion.id === action.payload
      ) {
        state.selectedPromotion.isActive = true;
      }
    },
    /**
     * Action pour désactiver une promotion
     */
    deactivatePromotion: (state, action: PayloadAction<string>) => {
      const index = state.promotions.findIndex(
        (promotion) => promotion.id === action.payload
      );
      if (index !== -1) {
        state.promotions[index].isActive = false;
      }
      if (
        state.selectedPromotion &&
        state.selectedPromotion.id === action.payload
      ) {
        state.selectedPromotion.isActive = false;
      }
    },
    /**
     * Action pour incrémenter le nombre d'utilisations d'une promotion
     */
    incrementUsageCount: (state, action: PayloadAction<string>) => {
      const index = state.promotions.findIndex(
        (promotion) => promotion.id === action.payload
      );
      if (index !== -1) {
        state.promotions[index].currentUsageCount += 1;

        // Désactiver automatiquement si le nombre maximum d'utilisations est atteint
        if (
          state.promotions[index].maxUsageCount &&
          state.promotions[index].currentUsageCount >=
            state.promotions[index].maxUsageCount
        ) {
          state.promotions[index].isActive = false;
        }
      }
      if (
        state.selectedPromotion &&
        state.selectedPromotion.id === action.payload
      ) {
        state.selectedPromotion.currentUsageCount += 1;

        // Désactiver automatiquement si le nombre maximum d'utilisations est atteint
        if (
          state.selectedPromotion.maxUsageCount &&
          state.selectedPromotion.currentUsageCount >=
            state.selectedPromotion.maxUsageCount
        ) {
          state.selectedPromotion.isActive = false;
        }
      }
    },
    setPagination: (
      state,
      action: PayloadAction<{ page: number; limit: number; total: number }>
    ) => {
      state.pagination = action.payload;
    },
  },
});

// Export des actions
export const {
  setPromotions,
  setSelectedPromotion,
  updateFilters,
  setPage,
  setLimit,
  setLoading,
  setError,
  addPromotion,
  updatePromotion,
  deletePromotion,
  activatePromotion,
  deactivatePromotion,
  incrementUsageCount,
  setPagination,
} = promotionsSlice.actions;

// Export du reducer
export default promotionsSlice.reducer;
