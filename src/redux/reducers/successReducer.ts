/**
 * Reducer pour la gestion des messages de succès
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Interface pour un message de succès
 */
export interface SuccessData {
  /** Message de succès */
  message: string;
  /** Contexte du message */
  context?: string;
  /** Identifiant unique du message */
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
 * Interface pour l'état du reducer success
 */
interface SuccessState {
  /** Message de succès actuel */
  success: SuccessData | null;
  /** Indique si un message de succès est présent */
  hasSuccess: boolean;
  /** Historique des messages de succès */
  history: SuccessData[];
}

/**
 * État initial du reducer success
 */
const initialState: SuccessState = {
  success: null,
  hasSuccess: false,
  history: [],
};

/**
 * Slice Redux pour la gestion des messages de succès
 */
const successSlice = createSlice({
  name: "success",
  initialState,
  reducers: {
    /**
     * Action pour définir un message de succès
     */
    setSuccess: (state, action: PayloadAction<SuccessData>) => {
      const successData = {
        ...action.payload,
        id: action.payload.id || `success-${Date.now()}`,
      };

      state.success = successData;
      state.hasSuccess = true;

      // Ajouter le message à l'historique (limité à 10 entrées)
      state.history = [successData, ...state.history.slice(0, 9)];
    },
    /**
     * Action pour effacer le message de succès
     */
    clearSuccess: (state) => {
      state.success = null;
      state.hasSuccess = false;
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
export const { setSuccess, clearSuccess, clearHistory } = successSlice.actions;

// Export du reducer
export default successSlice.reducer;
