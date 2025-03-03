"use client";

/**
 * Composant AnalyticsKPICards - Affiche les indicateurs clés de performance sous forme de cartes
 */

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Info,
  Users,
  Calendar,
  DollarSign,
  Percent,
  Clock,
  ShoppingCart,
  Award,
  Star,
} from "lucide-react";

/**
 * Type pour un KPI
 */
export interface KPI {
  /** Identifiant unique */
  id: string;
  /** Titre du KPI */
  title: string;
  /** Valeur actuelle */
  value: number | string;
  /** Pourcentage de changement */
  change?: number;
  /** Unité (€, %, etc.) */
  unit?: string;
  /** Format des nombres */
  format?: "standard" | "compact" | "currency" | "percent";
  /** Icône à afficher */
  icon?:
    | "users"
    | "calendar"
    | "money"
    | "percent"
    | "clock"
    | "cart"
    | "award"
    | "star";
  /** Couleur de la carte */
  color?: "default" | "blue" | "green" | "amber" | "red" | "purple" | "pink";
  /** Informations supplémentaires */
  info?: string;
  /** Comparaison avec la période précédente */
  previousValue?: number | string;
}

/**
 * Props pour le composant AnalyticsKPICards
 */
export interface AnalyticsKPICardsProps {
  /** Liste des KPIs à afficher */
  kpis: KPI[];
  /** Fonction appelée lors du clic sur un KPI */
  onKPIClick?: (kpi: KPI) => void;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant AnalyticsKPICards - Affiche les indicateurs clés de performance sous forme de cartes
 */
const AnalyticsKPICards: React.FC<AnalyticsKPICardsProps> = ({
  kpis,
  onKPIClick,
  className,
}) => {
  // Formater les valeurs numériques selon les options
  const formatValue = (
    value: number | string,
    format?: string,
    unit?: string
  ): string => {
    if (typeof value === "string") return value;

    switch (format) {
      case "compact":
        return (
          new Intl.NumberFormat("fr-FR", {
            notation: "compact",
            compactDisplay: "short",
          }).format(value) + (unit ? ` ${unit}` : "")
        );
      case "currency":
        return new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        }).format(value);
      case "percent":
        return new Intl.NumberFormat("fr-FR", {
          style: "percent",
          maximumFractionDigits: 1,
        }).format(value / 100);
      default:
        return (
          new Intl.NumberFormat("fr-FR").format(value) +
          (unit ? ` ${unit}` : "")
        );
    }
  };

  // Obtenir l'icône correspondante
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case "users":
        return <Users className="h-5 w-5" />;
      case "calendar":
        return <Calendar className="h-5 w-5" />;
      case "money":
        return <DollarSign className="h-5 w-5" />;
      case "percent":
        return <Percent className="h-5 w-5" />;
      case "clock":
        return <Clock className="h-5 w-5" />;
      case "cart":
        return <ShoppingCart className="h-5 w-5" />;
      case "award":
        return <Award className="h-5 w-5" />;
      case "star":
        return <Star className="h-5 w-5" />;
      default:
        return null;
    }
  };

  // Obtenir la couleur de fond de la carte
  const getCardClass = (color?: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-50 dark:bg-blue-950";
      case "green":
        return "bg-green-50 dark:bg-green-950";
      case "amber":
        return "bg-amber-50 dark:bg-amber-950";
      case "red":
        return "bg-red-50 dark:bg-red-950";
      case "purple":
        return "bg-purple-50 dark:bg-purple-950";
      case "pink":
        return "bg-pink-50 dark:bg-pink-950";
      default:
        return "bg-card";
    }
  };

  // Obtenir la couleur de l'icône
  const getIconClass = (color?: string) => {
    switch (color) {
      case "blue":
        return "text-blue-500 dark:text-blue-400";
      case "green":
        return "text-green-500 dark:text-green-400";
      case "amber":
        return "text-amber-500 dark:text-amber-400";
      case "red":
        return "text-red-500 dark:text-red-400";
      case "purple":
        return "text-purple-500 dark:text-purple-400";
      case "pink":
        return "text-pink-500 dark:text-pink-400";
      default:
        return "text-primary";
    }
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
        className
      )}
    >
      {kpis.map((kpi) => (
        <Card
          key={kpi.id}
          className={cn(
            "overflow-hidden transition-all hover:shadow-md cursor-pointer",
            getCardClass(kpi.color)
          )}
          onClick={() => onKPIClick?.(kpi)}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </p>
                  {kpi.info && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{kpi.info}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">
                    {formatValue(kpi.value, kpi.format, kpi.unit)}
                  </h3>
                  {kpi.change !== undefined && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "flex items-center gap-0.5 font-medium",
                        kpi.change > 0
                          ? "text-green-600 dark:text-green-400"
                          : kpi.change < 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-muted-foreground"
                      )}
                    >
                      {kpi.change > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : kpi.change < 0 ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : null}
                      {Math.abs(kpi.change).toFixed(1)}%
                    </Badge>
                  )}
                </div>
                {kpi.previousValue !== undefined && (
                  <p className="text-xs text-muted-foreground">
                    Période précédente:{" "}
                    {formatValue(kpi.previousValue, kpi.format, kpi.unit)}
                  </p>
                )}
              </div>
              {kpi.icon && (
                <div
                  className={cn(
                    "p-2 rounded-full",
                    getIconClass(kpi.color),
                    kpi.color
                      ? `bg-${kpi.color}-100 dark:bg-${kpi.color}-900`
                      : "bg-primary/10"
                  )}
                >
                  {getIcon(kpi.icon)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticsKPICards;
