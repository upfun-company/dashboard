/**
 * Reducer pour la gestion du chargement global
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Interface pour l'état du reducer loading
 */
interface LoadingState {
  /** Indique si un chargement global est en cours */
  isGlobalLoading: boolean;
  /** Indique les chargements spécifiques en cours */
  loadingStates: Record<string, boolean>;
  /** Compteur de chargements actifs */
  activeLoadingsCount: number;
}

/**
 * État initial du reducer loading
 */
const initialState: LoadingState = {
  isGlobalLoading: false,
  loadingStates: {},
  activeLoadingsCount: 0,
};

/**
 * Slice Redux pour la gestion du chargement
 */
const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    /**
     * Action pour définir l'état de chargement global
     */
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.isGlobalLoading = action.payload;
    },
    /**
     * Action pour définir l'état de chargement d'une ressource spécifique
     */
    setLoading: (
      state,
      action: PayloadAction<{ key: string; isLoading: boolean }>
    ) => {
      const { key, isLoading } = action.payload;
      const wasLoading = state.loadingStates[key] || false;

      // Mettre à jour l'état de chargement spécifique
      state.loadingStates[key] = isLoading;

      // Mettre à jour le compteur de chargements actifs
      if (isLoading && !wasLoading) {
        state.activeLoadingsCount += 1;
      } else if (!isLoading && wasLoading) {
        state.activeLoadingsCount = Math.max(0, state.activeLoadingsCount - 1);
      }

      // Mettre à jour l'état de chargement global si nécessaire
      if (state.activeLoadingsCount > 0 && !state.isGlobalLoading) {
        state.isGlobalLoading = true;
      } else if (state.activeLoadingsCount === 0 && state.isGlobalLoading) {
        state.isGlobalLoading = false;
      }
    },
    /**
     * Action pour réinitialiser tous les états de chargement
     */
    resetLoading: (state) => {
      state.isGlobalLoading = false;
      state.loadingStates = {};
      state.activeLoadingsCount = 0;
    },
  },
});

// Export des actions
export const { setGlobalLoading, setLoading, resetLoading } =
  loadingSlice.actions;

// Export du reducer
export default loadingSlice.reducer;
