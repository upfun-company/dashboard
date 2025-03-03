/**
 * Définition de type pour le composant Progress
 */

import * as React from "react";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Valeur actuelle de la progression (0-100) */
  value?: number;
  /** Classes CSS additionnelles */
  className?: string;
}

export const Progress: React.FC<ProgressProps>;
