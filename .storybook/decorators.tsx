import React from "react";
import { Decorator } from "@storybook/react";

// Décorateur pour envelopper les stories dans un contexte approprié
export const withThemeDecorator: Decorator = (Story) => {
  return (
    <div className="storybook-container">
      <div className="storybook-content">
        <Story />
      </div>
    </div>
  );
};

// Décorateur pour simuler le contexte Redux si nécessaire
export const withReduxDecorator: Decorator = (Story) => {
  // Simuler le contexte Redux si nécessaire
  return <Story />;
};

// Exporter tous les décorateurs
export const decorators = [
  withThemeDecorator,
  // Ajouter d'autres décorateurs si nécessaire
];
