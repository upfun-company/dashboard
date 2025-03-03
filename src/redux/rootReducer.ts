/**
 * Combinaison de tous les reducers de l'application
 */

import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import loadingReducer from "./reducers/loadingReducer";
import errorReducer from "./reducers/errorReducer";
import successReducer from "./reducers/successReducer";
import customersReducer from "./reducers/customersReducer";
import providersReducer from "./reducers/providersReducer";
import activitiesReducer from "./reducers/activitiesReducer";
import reservationsReducer from "./reducers/reservationsReducer";
/**
 * Root reducer combinant tous les reducers de l'application
 */
const rootReducer = combineReducers({
  auth: authReducer,
  loading: loadingReducer,
  error: errorReducer,
  success: successReducer,
  customers: customersReducer,
  providers: providersReducer,
  activities: activitiesReducer,
  reservations: reservationsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
