/**
 * Reducer pour la gestion des catégories
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@/types";

/**
 * Interface pour l'état du reducer categories
 */
interface CategoriesState {
  /** Liste des catégories */
  categories: Category[];
  /** Catégorie sélectionnée */
  selectedCategory: Category | null;
  /** Indique si les données sont en cours de chargement */
  isLoading: boolean;
  /** Indique si une erreur s'est produite */
  error: string | null;
}

/**
 * État initial du reducer categories
 */
const initialState: CategoriesState = {
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
};

/**
 * Slice Redux pour la gestion des catégories
 */
const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    /**
     * Action pour définir la liste des catégories
     */
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    /**
     * Action pour définir une catégorie sélectionnée
     */
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
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
     * Action pour ajouter une catégorie
     */
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    /**
     * Action pour mettre à jour une catégorie
     */
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(
        (category) => category.id === action.payload.id
      );
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
      if (
        state.selectedCategory &&
        state.selectedCategory.id === action.payload.id
      ) {
        state.selectedCategory = action.payload;
      }
    },
    /**
     * Action pour supprimer une catégorie
     */
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload
      );
      if (
        state.selectedCategory &&
        state.selectedCategory.id === action.payload
      ) {
        state.selectedCategory = null;
      }
    },
  },
});

// Export des actions
export const {
  setCategories,
  setSelectedCategory,
  setLoading,
  setError,
  addCategory,
  updateCategory,
  deleteCategory,
} = categoriesSlice.actions;

// Export du reducer
export default categoriesSlice.reducer;
