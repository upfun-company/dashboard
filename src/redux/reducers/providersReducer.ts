/**
 * Reducer pour la gestion des prestataires
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProviderMock } from "@/mocks/providersMocks";

/**
 * Type pour le statut d'un prestataire
 */
export type ProviderStatus = "pending" | "approved" | "rejected";

/**
 * Interface pour l'état du reducer providers
 */
interface ProvidersState {
  /** Liste des prestataires */
  providers: ProviderMock[];
  /** Prestataire sélectionné */
  selectedProvider: ProviderMock | null;
  /** Informations de pagination */
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  /** Options de filtrage */
  filters: {
    search?: string;
    category?: string;
    location?: string;
    status?: ProviderStatus | "all";
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  };
  /** Indique si les données sont en cours de chargement */
  isLoading: boolean;
  /** Indique si une erreur s'est produite */
  error: string | null;
}

/**
 * État initial du reducer providers
 */
const initialState: ProvidersState = {
  providers: [],
  selectedProvider: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  filters: {
    search: "",
    category: "",
    location: "",
    status: "all",
    isActive: true,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  isLoading: false,
  error: null,
};

/**
 * Slice Redux pour la gestion des prestataires
 */
const providersSlice = createSlice({
  name: "providers",
  initialState,
  reducers: {
    /**
     * Action pour définir la liste des prestataires
     */
    setProviders: (state, action: PayloadAction<ProviderMock[]>) => {
      state.providers = action.payload;
    },
    /**
     * Action pour définir les prestataires avec pagination
     */
    setProvidersWithPagination: (
      state,
      action: PayloadAction<{
        data: ProviderMock[];
        pagination: { total: number };
      }>
    ) => {
      state.providers = action.payload.data;
      state.pagination.total = action.payload.pagination.total;
    },
    /**
     * Action pour définir un prestataire sélectionné
     */
    setSelectedProvider: (
      state,
      action: PayloadAction<ProviderMock | null>
    ) => {
      state.selectedProvider = action.payload;
    },
    /**
     * Action pour mettre à jour les options de filtrage
     */
    setFilters: (
      state,
      action: PayloadAction<Partial<ProvidersState["filters"]>>
    ) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
      // Réinitialiser la pagination lors du changement de filtres
      state.pagination.page = 1;
    },
    /**
     * Action pour réinitialiser les filtres
     */
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    /**
     * Action pour définir la page courante
     */
    setPagination: (
      state,
      action: PayloadAction<Partial<ProvidersState["pagination"]>>
    ) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
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
     * Action pour ajouter un prestataire
     */
    addProvider: (state, action: PayloadAction<ProviderMock>) => {
      state.providers.unshift(action.payload);
      state.pagination.total += 1;
    },
    /**
     * Action pour mettre à jour un prestataire
     */
    updateProvider: (state, action: PayloadAction<ProviderMock>) => {
      const index = state.providers.findIndex(
        (provider) => provider.id === action.payload.id
      );
      if (index !== -1) {
        state.providers[index] = action.payload;
      }
      if (
        state.selectedProvider &&
        state.selectedProvider.id === action.payload.id
      ) {
        state.selectedProvider = action.payload;
      }
    },
    /**
     * Action pour supprimer un prestataire
     */
    deleteProvider: (state, action: PayloadAction<string>) => {
      state.providers = state.providers.filter(
        (provider) => provider.id !== action.payload
      );
      state.pagination.total -= 1;
      if (
        state.selectedProvider &&
        state.selectedProvider.id === action.payload
      ) {
        state.selectedProvider = null;
      }
    },
    /**
     * Action pour approuver un prestataire
     */
    approveProvider: (state, action: PayloadAction<string>) => {
      const index = state.providers.findIndex(
        (provider) => provider.id === action.payload
      );
      if (index !== -1) {
        const updatedProvider: ProviderMock = {
          ...state.providers[index],
          status: "approved",
        };
        state.providers[index] = updatedProvider;

        if (
          state.selectedProvider &&
          state.selectedProvider.id === action.payload
        ) {
          state.selectedProvider = updatedProvider;
        }
      }
    },
    /**
     * Action pour rejeter un prestataire
     */
    rejectProvider: (state, action: PayloadAction<string>) => {
      const index = state.providers.findIndex(
        (provider) => provider.id === action.payload
      );
      if (index !== -1) {
        const updatedProvider: ProviderMock = {
          ...state.providers[index],
          status: "rejected",
        };
        state.providers[index] = updatedProvider;

        if (
          state.selectedProvider &&
          state.selectedProvider.id === action.payload
        ) {
          state.selectedProvider = updatedProvider;
        }
      }
    },
  },
});

// Export des actions
export const {
  setProviders,
  setProvidersWithPagination,
  setSelectedProvider,
  setFilters,
  resetFilters,
  setPagination,
  setLoading,
  setError,
  addProvider,
  updateProvider,
  deleteProvider,
  approveProvider,
  rejectProvider,
} = providersSlice.actions;

// Export du reducer
export default providersSlice.reducer;
