/**
 * Configuration du store Redux
 */

import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userReducer from "../redux/reducers/userReducer";
import errorReducer from "../redux/reducers/errorReducer";
import loadingReducer from "../redux/reducers/loadingReducer";
import successReducer from "../redux/reducers/successReducer";
import customersReducer from "../redux/reducers/customersReducer";
import providersReducer from "../redux/reducers/providersReducer";
import reservationsReducer from "../redux/reducers/reservationsReducer";
import activitiesReducer from "../redux/reducers/activitiesReducer";
import categoriesReducer from "../redux/reducers/categoriesReducer";
import disputesReducer from "../redux/reducers/disputesReducer";
import ticketsReducer from "../redux/reducers/ticketsReducer";
import analyticsReducer from "../redux/reducers/analyticsReducer";
import transactionsReducer from "../redux/reducers/transactionsReducer";
import promotionsReducer from "../redux/reducers/promotionsReducer";

/**
 * Configuration du store Redux avec tous les reducers
 */
export const store = configureStore({
  reducer: {
    user: userReducer,
    error: errorReducer,
    success: successReducer,
    loading: loadingReducer,
    customers: customersReducer,
    providers: providersReducer,
    reservations: reservationsReducer,
    activities: activitiesReducer,
    categories: categoriesReducer,
    disputes: disputesReducer,
    tickets: ticketsReducer,
    analytics: analyticsReducer,
    transactions: transactionsReducer,
    promotions: promotionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

/**
 * Types pour le store Redux
 */
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
