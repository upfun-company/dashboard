/**
 * Composant Badge - Affiche un badge avec différentes variantes
 */

import React from "react";
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Props pour le composant Badge
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ShadcnBadge> {
  /** Contenu du badge */
  children: React.ReactNode;
  /** Variante du badge */
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
    | "info";
  /** Classes CSS additionnelles */
  className?: string;
  /** Indique si le badge est cliquable */
  clickable?: boolean;
  /** Fonction appelée lors du clic sur le badge */
  onClick?: () => void;
}

/**
 * Composant Badge - Affiche un badge avec différentes variantes
 */
const Badge = ({
  children,
  variant = "default",
  className,
  clickable = false,
  onClick,
  ...props
}: BadgeProps) => {
  const badgeClasses = cn(
    className,
    clickable && "cursor-pointer hover:opacity-80 transition-opacity"
  );

  return (
    <ShadcnBadge
      variant={variant}
      className={badgeClasses}
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      {children}
    </ShadcnBadge>
  );
};

export default Badge;
