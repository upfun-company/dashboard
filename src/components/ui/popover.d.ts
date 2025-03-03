/**
 * Définition de type pour les composants Popover
 */

import * as React from "react";

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Classes CSS additionnelles */
  className?: string;
  /** Si le popover est ouvert */
  open?: boolean;
  /** Fonction appelée lorsque l'état ouvert/fermé change */
  onOpenChange?: (open: boolean) => void;
}

export interface PopoverTriggerProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  /** Classes CSS additionnelles */
  className?: string;
  /** Si le trigger est désactivé */
  disabled?: boolean;
  /** Si le trigger est actif */
  asChild?: boolean;
}

export interface PopoverContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Classes CSS additionnelles */
  className?: string;
  /** Alignement du popover */
  align?: "start" | "center" | "end";
  /** Position du popover */
  side?: "top" | "right" | "bottom" | "left";
  /** Si le contenu doit être rendu comme un enfant */
  asChild?: boolean;
}

export const Popover: React.FC<PopoverProps>;
export const PopoverTrigger: React.FC<PopoverTriggerProps>;
export const PopoverContent: React.FC<PopoverContentProps>;
