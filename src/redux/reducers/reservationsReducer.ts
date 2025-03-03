/**
 * Reducer pour la gestion des réservations
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Reservation, PaginatedResponse, FilterOptions } from "@/types";

/**
 * Interface pour l'état du reducer reservations
 */
interface ReservationsState {
  /** Liste des réservations */
  reservations: Reservation[];
  /** Réservation sélectionnée */
  selectedReservation: Reservation | null;
  /** Informations de pagination */
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  /** Options de filtrage */
  filters: FilterOptions & {
    status?: "pending" | "confirmed" | "cancelled" | "completed" | "all";
    customerId?: string;
    providerId?: string;
    activityId?: string;
    startDate?: string;
    endDate?: string;
  };
  /** Indique si les données sont en cours de chargement */
  isLoading: boolean;
  /** Indique si une erreur s'est produite */
  error: string | null;
}

/**
 * État initial du reducer reservations
 */
const initialState: ReservationsState = {
  reservations: [],
  selectedReservation: null,
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
  error: null,
};

/**
 * Slice Redux pour la gestion des réservations
 */
const reservationsSlice = createSlice({
  name: "reservations",
  initialState,
  reducers: {
    /**
     * Action pour définir la liste des réservations
     */
    setReservations: (state, action: PayloadAction<Reservation[]>) => {
      state.reservations = action.payload;
    },
    /**
     * Action pour définir les réservations avec pagination
     */
    setReservationsWithPagination: (
      state,
      action: PayloadAction<PaginatedResponse<Reservation>>
    ) => {
      state.reservations = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    /**
     * Action pour définir une réservation sélectionnée
     */
    setSelectedReservation: (
      state,
      action: PayloadAction<Reservation | null>
    ) => {
      state.selectedReservation = action.payload;
    },
    /**
     * Action pour mettre à jour les options de filtrage
     */
    updateFilters: (
      state,
      action: PayloadAction<Partial<ReservationsState["filters"]>>
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
     * Action pour ajouter une réservation
     */
    addReservation: (state, action: PayloadAction<Reservation>) => {
      state.reservations.unshift(action.payload);
      state.pagination.total += 1;
    },
    /**
     * Action pour mettre à jour une réservation
     */
    updateReservation: (state, action: PayloadAction<Reservation>) => {
      const index = state.reservations.findIndex(
        (reservation) => reservation.id === action.payload.id
      );
      if (index !== -1) {
        state.reservations[index] = action.payload;
      }
      if (
        state.selectedReservation &&
        state.selectedReservation.id === action.payload.id
      ) {
        state.selectedReservation = action.payload;
      }
    },
    /**
     * Action pour supprimer une réservation
     */
    deleteReservation: (state, action: PayloadAction<string>) => {
      state.reservations = state.reservations.filter(
        (reservation) => reservation.id !== action.payload
      );
      state.pagination.total -= 1;
      if (
        state.selectedReservation &&
        state.selectedReservation.id === action.payload
      ) {
        state.selectedReservation = null;
      }
    },
    /**
     * Action pour confirmer une réservation
     */
    confirmReservation: (state, action: PayloadAction<string>) => {
      const index = state.reservations.findIndex(
        (reservation) => reservation.id === action.payload
      );
      if (index !== -1) {
        state.reservations[index].status = "confirmed";
      }
      if (
        state.selectedReservation &&
        state.selectedReservation.id === action.payload
      ) {
        state.selectedReservation.status = "confirmed";
      }
    },
    /**
     * Action pour annuler une réservation
     */
    cancelReservation: (state, action: PayloadAction<string>) => {
      const index = state.reservations.findIndex(
        (reservation) => reservation.id === action.payload
      );
      if (index !== -1) {
        state.reservations[index].status = "cancelled";
      }
      if (
        state.selectedReservation &&
        state.selectedReservation.id === action.payload
      ) {
        state.selectedReservation.status = "cancelled";
      }
    },
    /**
     * Action pour marquer une réservation comme terminée
     */
    completeReservation: (state, action: PayloadAction<string>) => {
      const index = state.reservations.findIndex(
        (reservation) => reservation.id === action.payload
      );
      if (index !== -1) {
        state.reservations[index].status = "completed";
      }
      if (
        state.selectedReservation &&
        state.selectedReservation.id === action.payload
      ) {
        state.selectedReservation.status = "completed";
      }
    },
  },
});

// Export des actions
export const {
  setReservations,
  setReservationsWithPagination,
  setSelectedReservation,
  updateFilters,
  setPage,
  setLimit,
  setLoading,
  setError,
  addReservation,
  updateReservation,
  deleteReservation,
  confirmReservation,
  cancelReservation,
  completeReservation,
} = reservationsSlice.actions;

// Export du reducer
export default reservationsSlice.reducer;
