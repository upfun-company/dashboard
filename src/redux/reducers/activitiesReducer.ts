/**
 * Reducer pour la gestion des activités
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Activity, ActivityStatus } from "@/types/activities";
import {
  PaginatedResponse,
  PaginationData,
  FilterOptions,
} from "@/types/general";

/**
 * Interface pour l'état du reducer activities
 */
interface ActivitiesState {
  /** Liste des activités */
  activities: Activity[];
  /** Activité sélectionnée */
  selectedActivity: Activity | null;
  /** Informations de pagination */
  pagination: PaginationData & { totalPages: number };
  /** Options de filtrage */
  filters: {
    status: ActivityStatus | null;
    category: string | null;
    search?: string;
    startDate?: string;
    endDate?: string;
  };
  /** Indique si les données sont en cours de chargement */
  loading: boolean;
  /** Indique si une erreur s'est produite */
  error: string | null;
}

/**
 * État initial du reducer activities
 */
const initialState: ActivitiesState = {
  activities: [],
  selectedActivity: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    status: null,
    category: null,
    search: undefined,
    startDate: undefined,
    endDate: undefined,
  },
  loading: false,
  error: null,
};

/**
 * Slice Redux pour la gestion des activités
 */
const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    /**
     * Action pour définir la liste des activités
     */
    setActivities: (
      state,
      action: PayloadAction<PaginatedResponse<Activity>>
    ) => {
      const { data, pagination } = action.payload;
      state.activities = data;
      state.pagination = {
        ...pagination,
        totalPages: Math.ceil(pagination.total / pagination.limit),
      };
    },
    /**
     * Action pour définir les activités avec pagination
     */
    setActivitiesWithPagination: (
      state,
      action: PayloadAction<PaginatedResponse<Activity>>
    ) => {
      state.activities = action.payload.data;
      state.pagination = {
        ...action.payload.pagination,
        totalPages: Math.ceil(
          action.payload.pagination.total / action.payload.pagination.limit
        ),
      };
    },
    /**
     * Action pour définir une activité sélectionnée
     */
    setSelectedActivity: (state, action: PayloadAction<Activity | null>) => {
      state.selectedActivity = action.payload;
    },
    /**
     * Action pour mettre à jour les options de filtrage
     */
    setFilters: (state, action: PayloadAction<Partial<FilterOptions>>) => {
      state.filters = { ...state.filters, ...action.payload };
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
      state.loading = action.payload;
    },
    /**
     * Action pour définir une erreur
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    /**
     * Action pour ajouter une activité
     */
    addActivity: (state, action: PayloadAction<Activity>) => {
      state.activities.unshift(action.payload);
      state.pagination.total += 1;
    },
    /**
     * Action pour mettre à jour une activité
     */
    updateActivity: (state, action: PayloadAction<Activity>) => {
      const index = state.activities.findIndex(
        (activity) => activity.id === action.payload.id
      );
      if (index !== -1) {
        state.activities[index] = action.payload;
      }
      if (
        state.selectedActivity &&
        state.selectedActivity.id === action.payload.id
      ) {
        state.selectedActivity = action.payload;
      }
    },
    /**
     * Action pour supprimer une activité
     */
    deleteActivity: (state, action: PayloadAction<string>) => {
      state.activities = state.activities.filter(
        (activity) => activity.id !== action.payload
      );
      state.pagination.total -= 1;
      if (
        state.selectedActivity &&
        state.selectedActivity.id === action.payload
      ) {
        state.selectedActivity = null;
      }
    },
    /**
     * Action pour activer une activité
     */
    activateActivity: (state, action: PayloadAction<string>) => {
      const index = state.activities.findIndex(
        (activity) => activity.id === action.payload
      );
      if (index !== -1) {
        (state.activities[index] as Activity).status = "published";
      }
      if (
        state.selectedActivity &&
        state.selectedActivity.id === action.payload
      ) {
        (state.selectedActivity as Activity).status = "published";
      }
    },
    /**
     * Action pour désactiver une activité
     */
    deactivateActivity: (state, action: PayloadAction<string>) => {
      const index = state.activities.findIndex(
        (activity) => activity.id === action.payload
      );
      if (index !== -1) {
        (state.activities[index] as Activity).status = "archived";
      }
      if (
        state.selectedActivity &&
        state.selectedActivity.id === action.payload
      ) {
        (state.selectedActivity as Activity).status = "archived";
      }
    },
    /**
     * Action pour approuver une activité
     */
    approveActivity: (state, action: PayloadAction<string>) => {
      const index = state.activities.findIndex(
        (activity) => activity.id === action.payload
      );
      if (index !== -1) {
        (state.activities[index] as Activity).status = "published";
      }
      if (
        state.selectedActivity &&
        state.selectedActivity.id === action.payload
      ) {
        (state.selectedActivity as Activity).status = "published";
      }
    },
    /**
     * Action pour mettre à jour le statut d'une activité
     */
    updateActivityStatus: (
      state,
      action: PayloadAction<{ id: string; status: ActivityStatus }>
    ) => {
      const { id, status } = action.payload;
      const activity = state.activities.find((a) => a.id === id);
      if (activity) {
        activity.status = status;
      }
      if (state.selectedActivity?.id === id) {
        state.selectedActivity.status = status;
      }
    },
  },
});

// Export des actions
export const {
  setActivities,
  setActivitiesWithPagination,
  setSelectedActivity,
  setFilters,
  setPage,
  setLimit,
  setLoading,
  setError,
  addActivity,
  updateActivity,
  deleteActivity,
  activateActivity,
  deactivateActivity,
  approveActivity,
  updateActivityStatus,
} = activitiesSlice.actions;

// Export du reducer
export default activitiesSlice.reducer;
