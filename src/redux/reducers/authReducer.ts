/**
 * Reducer pour la gestion de l'authentification
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Interface pour un utilisateur authentifié
 */
export interface AuthUser {
  /** Identifiant de l'utilisateur */
  id: string;
  /** Nom de l'utilisateur */
  name: string;
  /** Email de l'utilisateur */
  email: string;
  /** Rôle de l'utilisateur */
  role: "admin" | "manager" | "support";
  /** URL de l'avatar */
  avatar?: string;
  /** Permissions de l'utilisateur */
  permissions?: string[];
}

/**
 * Interface pour l'état du reducer auth
 */
interface AuthState {
  /** Utilisateur authentifié */
  user: AuthUser | null;
  /** Token d'authentification */
  token: string | null;
  /** Indique si l'utilisateur est authentifié */
  isAuthenticated: boolean;
  /** Indique si l'authentification est en cours */
  isLoading: boolean;
  /** Erreur d'authentification */
  error: string | null;
}

/**
 * État initial du reducer auth
 */
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Slice Redux pour la gestion de l'authentification
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Action pour démarrer le processus d'authentification
     */
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    /**
     * Action pour définir l'utilisateur authentifié
     */
    loginSuccess: (
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>
    ) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    /**
     * Action pour définir une erreur d'authentification
     */
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },
    /**
     * Action pour déconnecter l'utilisateur
     */
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    /**
     * Action pour mettre à jour les informations de l'utilisateur
     */
    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    /**
     * Action pour effacer l'erreur d'authentification
     */
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export des actions
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  clearError,
} = authSlice.actions;

// Export du reducer
export default authSlice.reducer;
