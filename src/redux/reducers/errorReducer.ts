/**
 * Reducer pour la gestion des messages d'erreur
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Interface pour un message d'erreur
 */
export interface ErrorData {
  /** Message d'erreur */
  message: string;
  /** Contexte de l'erreur */
  context?: string;
  /** Identifiant unique de l'erreur */
  id?: string;
  /** Durée d'affichage en ms (par défaut: 6000) */
  duration?: number;
  /** Action supplémentaire possible */
  action?: {
    /** Libellé de l'action */
    label: string;
    /** Identifiant de l'action pour le traitement */
    actionId: string;
  };
}

/**
 * Interface pour l'état du reducer error
 */
interface ErrorState {
  /** Message d'erreur actuel */
  error: ErrorData | null;
  /** Indique si un message d'erreur est présent */
  hasError: boolean;
  /** Historique des messages d'erreur */
  history: ErrorData[];
}

/**
 * État initial du reducer error
 */
const initialState: ErrorState = {
  error: null,
  hasError: false,
  history: [],
};

/**
 * Slice Redux pour la gestion des messages d'erreur
 */
const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    /**
     * Action pour définir un message d'erreur
     */
    setError: (state, action: PayloadAction<ErrorData>) => {
      const errorData = {
        ...action.payload,
        id: action.payload.id || `error-${Date.now()}`,
      };

      state.error = errorData;
      state.hasError = true;

      // Ajouter le message à l'historique (limité à 10 entrées)
      state.history = [errorData, ...state.history.slice(0, 9)];
    },
    /**
     * Action pour effacer le message d'erreur
     */
    clearError: (state) => {
      state.error = null;
      state.hasError = false;
    },
    /**
     * Action pour effacer l'historique des messages
     */
    clearHistory: (state) => {
      state.history = [];
    },
  },
});

// Export des actions
export const { setError, clearError, clearHistory } = errorSlice.actions;

// Export du reducer
export default errorSlice.reducer;
