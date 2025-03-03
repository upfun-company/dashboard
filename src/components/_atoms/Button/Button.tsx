/**
 * Composant Button - Bouton d'action
 */

import React from "react";
import { Button as ShadcnButton, buttonVariants } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";

/**
 * Props pour le composant Button
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Contenu du bouton */
  children: React.ReactNode;
  /** Indique si le bouton est en cours de chargement */
  loading?: boolean;
  /** Indique si le bouton doit prendre toute la largeur disponible */
  fullWidth?: boolean;
  /** Fonction appelée lors du clic sur le bouton */
  onClick?: () => void;
}

/**
 * Composant Button - Bouton d'action
 */
const Button = ({
  children,
  variant = "default",
  size = "default",
  loading = false,
  fullWidth = false,
  className,
  disabled,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <ShadcnButton
      variant={variant}
      size={size}
      className={`${fullWidth ? "w-full" : ""} ${className || ""}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </ShadcnButton>
  );
};

export default Button;
