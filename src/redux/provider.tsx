/**
 * Provider Redux pour l'application
 */

"use client";

import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "./store";

/**
 * Props pour le composant ReduxProvider
 */
interface ReduxProviderProps {
  /** Contenu de l'application */
  children: ReactNode;
}

/**
 * Provider Redux pour l'application
 */
const ReduxProvider = ({ children }: ReduxProviderProps) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
