import React, { ReactNode } from "react";
import { Separator } from "./separator";

interface PageTitleProps {
  /**
   * Titre principal de la page
   */
  title: string;

  /**
   * Description optionnelle de la page
   */
  description?: string;

  /**
   * Icône optionnelle à afficher à côté du titre
   */
  icon?: ReactNode;

  /**
   * Actions optionnelles à afficher à droite du titre
   */
  actions?: ReactNode;

  /**
   * Classes CSS additionnelles
   */
  className?: string;
}

/**
 * Composant pour afficher le titre d'une page avec une description optionnelle et des actions
 */
export function PageTitle({
  title,
  description,
  icon,
  actions,
  className = "",
}: PageTitleProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && <div className="text-primary">{icon}</div>}
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <Separator />
    </div>
  );
}
