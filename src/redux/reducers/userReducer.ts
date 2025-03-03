/**
 * Reducer pour la gestion de l'utilisateur connecté
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Admin } from "@/types";

/**
 * Interface pour l'état du reducer user
 */
interface UserState {
  /** Utilisateur connecté */
  currentUser: Admin | null;
  /** Token d'authentification */
  token: string | null;
  /** Indique si l'utilisateur est authentifié */
  isAuthenticated: boolean;
  /** Indique si l'authentification est en cours */
  isLoading: boolean;
}

/**
 * État initial du reducer user
 */
const initialState: UserState = {
  currentUser: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

/**
 * Slice Redux pour la gestion de l'utilisateur
 */
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /**
     * Action pour définir l'utilisateur connecté
     */
    setUser: (state, action: PayloadAction<Admin>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    /**
     * Action pour définir le token d'authentification
     */
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    /**
     * Action pour définir l'état de chargement
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    /**
     * Action pour déconnecter l'utilisateur
     */
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

// Export des actions
export const { setUser, setToken, setLoading, logout } = userSlice.actions;

// Export du reducer
export default userSlice.reducer;
