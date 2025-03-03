/**
 * Composant StatCard - Carte affichant une statistique avec son évolution
 */

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

/**
 * Props pour le composant StatCard
 */
export interface StatCardProps {
  /**
   * Titre de la statistique
   */
  title: string;

  /**
   * Valeur de la statistique
   */
  value: string | number;

  /**
   * Pourcentage de changement (optionnel)
   */
  change?: number;

  /**
   * Période de comparaison (ex: "depuis le mois dernier")
   */
  period?: string;

  /**
   * Icône à afficher - peut être un ReactNode ou un composant Lucide
   */
  icon: React.ReactNode | LucideIcon;

  /**
   * Couleur de l'icône
   */
  iconColor?: "primary" | "success" | "warning" | "danger" | "info";

  /**
   * Classes CSS additionnelles
   */
  className?: string;

  /**
   * Fonction appelée lors du clic sur la carte
   */
  onClick?: () => void;
}

/**
 * Composant pour afficher une carte de statistique avec une icône, une valeur et un indicateur de changement
 */
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  period = "depuis le mois dernier",
  icon,
  iconColor = "primary",
  className,
  onClick,
}) => {
  // Détermine la couleur de l'icône
  const getIconColorClass = () => {
    switch (iconColor) {
      case "success":
        return "text-emerald-500 bg-emerald-100";
      case "warning":
        return "text-amber-500 bg-amber-100";
      case "danger":
        return "text-rose-500 bg-rose-100";
      case "info":
        return "text-sky-500 bg-sky-100";
      default:
        return "text-primary bg-primary/10";
    }
  };

  // Détermine la couleur du texte de changement
  const getChangeColorClass = () => {
    if (!change) return "text-gray-500";
    return change > 0 ? "text-emerald-500" : "text-rose-500";
  };

  // Formate le changement avec un signe + ou -
  const formatChange = () => {
    if (change === undefined) return null;
    const sign = change > 0 ? "+" : "";
    return `${sign}${change}%`;
  };

  // Rendu de l'icône
  const renderIcon = () => {
    // Si c'est un ReactNode, le retourner directement
    if (React.isValidElement(icon)) {
      return icon;
    }

    // Si c'est un composant Lucide, l'instancier
    const IconComponent = icon as LucideIcon;
    return <IconComponent className="h-6 w-6" />;
  };

  return (
    <Card
      className={cn("overflow-hidden", className)}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {change !== undefined && (
              <p className="flex items-center mt-1 text-sm">
                <span className={getChangeColorClass()}>{formatChange()}</span>
                <span className="text-gray-500 ml-1">{period}</span>
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-full", getIconColorClass())}>
            {renderIcon()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
