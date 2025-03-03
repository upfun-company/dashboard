/**
 * Définition de type pour le composant Skeleton
 */

import * as React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Classes CSS additionnelles */
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps>;
