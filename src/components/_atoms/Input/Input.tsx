/**
 * Composant Input - Champ de saisie de texte
 */

import React, { forwardRef } from "react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Props pour le composant Input
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label du champ */
  label?: string;
  /** Message d'erreur */
  error?: string;
  /** Message d'aide */
  helperText?: string;
  /** Classes CSS additionnelles pour le conteneur */
  containerClassName?: string;
  /** Classes CSS additionnelles pour le label */
  labelClassName?: string;
  /** Classes CSS additionnelles pour le champ */
  inputClassName?: string;
  /** Icône à afficher à gauche du champ */
  startIcon?: React.ReactNode;
  /** Icône à afficher à droite du champ */
  endIcon?: React.ReactNode;
}

/**
 * Composant Input - Champ de saisie de texte
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      containerClassName,
      labelClassName,
      inputClassName,
      startIcon,
      endIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    // Génère un ID unique si non fourni
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <Label
            htmlFor={inputId}
            className={cn(
              error && "text-destructive",
              disabled && "opacity-70",
              labelClassName
            )}
          >
            {label}
          </Label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {startIcon}
            </div>
          )}
          <ShadcnInput
            id={inputId}
            ref={ref}
            className={cn(
              startIcon && "pl-10",
              endIcon && "pr-10",
              error && "border-destructive focus-visible:ring-destructive",
              inputClassName
            )}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-description`
                : undefined
            }
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {endIcon}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm font-medium text-destructive"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${inputId}-description`}
            className="text-sm text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
