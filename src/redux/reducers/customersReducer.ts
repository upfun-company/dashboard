/**
 * Reducer pour la gestion des clients
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Customer } from "@/types";

/**
 * Interface pour la pagination
 */
interface Pagination {
  page: number;
  limit: number;
  total: number;
}

/**
 * Interface pour les filtres
 */
interface Filters {
  search: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
  status?: "all" | "active" | "inactive";
}

/**
 * Interface pour l'état des clients
 */
interface CustomersState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  pagination: Pagination;
  filters: Filters;
  isLoading: boolean;
}

/**
 * Interface pour la mise à jour des clients avec pagination
 */
interface CustomersWithPagination {
  data: Customer[];
  pagination: Pagination;
}

/**
 * État initial
 */
const initialState: CustomersState = {
  customers: [],
  selectedCustomer: null,
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
  },
  isLoading: false,
};

/**
 * Slice pour la gestion des clients
 */
const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    /**
     * Définir la liste des clients
     */
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.customers = action.payload;
    },

    /**
     * Définir la liste des clients avec pagination
     */
    setCustomersWithPagination: (
      state,
      action: PayloadAction<CustomersWithPagination>
    ) => {
      state.customers = action.payload.data;
      state.pagination = action.payload.pagination;
    },

    /**
     * Définir le client sélectionné
     */
    setSelectedCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.selectedCustomer = action.payload;
    },

    /**
     * Définir la page courante
     */
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },

    /**
     * Définir le nombre d'éléments par page
     */
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1; // Réinitialiser la page lors du changement de limite
    },

    /**
     * Mettre à jour les filtres
     */
    updateFilters: (state, action: PayloadAction<Partial<Filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Réinitialiser la page lors du changement de filtres
    },

    /**
     * Réinitialiser les filtres
     */
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },

    /**
     * Définir l'état de chargement
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * Ajouter un client
     */
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.customers.unshift(action.payload);
      state.pagination.total += 1;
    },

    /**
     * Mettre à jour un client
     */
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.customers.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index !== -1) {
        state.customers[index] = action.payload;
      }

      // Mettre à jour le client sélectionné si c'est le même
      if (
        state.selectedCustomer &&
        state.selectedCustomer.id === action.payload.id
      ) {
        state.selectedCustomer = action.payload;
      }
    },

    /**
     * Supprimer un client
     */
    deleteCustomer: (state, action: PayloadAction<string>) => {
      state.customers = state.customers.filter((c) => c.id !== action.payload);
      state.pagination.total -= 1;

      // Désélectionner le client s'il est supprimé
      if (
        state.selectedCustomer &&
        state.selectedCustomer.id === action.payload
      ) {
        state.selectedCustomer = null;
      }
    },
  },
});

export const {
  setCustomers,
  setCustomersWithPagination,
  setSelectedCustomer,
  setPage,
  setLimit,
  updateFilters,
  resetFilters,
  setLoading,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} = customersSlice.actions;

export default customersSlice.reducer;
