/**
 * Composant Card - Carte pour afficher du contenu
 */

import React from "react";
import {
  Card as ShadcnCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Props pour le composant Card
 */
export interface CardProps {
  /** Titre de la carte */
  title?: React.ReactNode;
  /** Description de la carte */
  description?: React.ReactNode;
  /** Contenu de la carte */
  children?: React.ReactNode;
  /** Contenu du pied de la carte */
  footer?: React.ReactNode;
  /** Classes CSS additionnelles */
  className?: string;
  /** Classes CSS additionnelles pour l'en-tête */
  headerClassName?: string;
  /** Classes CSS additionnelles pour le contenu */
  contentClassName?: string;
  /** Classes CSS additionnelles pour le pied */
  footerClassName?: string;
  /** Indique si la carte doit avoir une ombre */
  withShadow?: boolean;
  /** Indique si la carte doit avoir une bordure */
  withBorder?: boolean;
  /** Indique si la carte doit avoir un fond */
  withBackground?: boolean;
  /** Fonction appelée lors du clic sur la carte */
  onClick?: () => void;
}

/**
 * Composant Card - Carte pour afficher du contenu
 */
const Card = ({
  title,
  description,
  children,
  footer,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  withShadow = true,
  withBorder = true,
  withBackground = true,
  onClick,
}: CardProps) => {
  const cardClasses = cn(
    className,
    !withBorder && "border-0",
    !withBackground && "bg-transparent",
    !withShadow && "shadow-none",
    onClick && "cursor-pointer hover:opacity-90 transition-opacity"
  );

  return (
    <ShadcnCard className={cardClasses} onClick={onClick}>
      {(title || description) && (
        <CardHeader className={headerClassName}>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      {children && (
        <CardContent className={contentClassName}>{children}</CardContent>
      )}
      {footer && <CardFooter className={footerClassName}>{footer}</CardFooter>}
    </ShadcnCard>
  );
};

export default Card;
