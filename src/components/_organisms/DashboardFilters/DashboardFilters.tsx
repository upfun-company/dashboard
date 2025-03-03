"use client";

/**
 * Composant DashboardFilters - Filtres pour le tableau de bord
 */

import React, { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DateRange as CalendarDateRange } from "react-day-picker";

/**
 * Type pour la plage de dates
 */
export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

/**
 * Type pour la période de filtrage
 */
export type FilterPeriod =
  | "today"
  | "yesterday"
  | "last7days"
  | "last30days"
  | "thisMonth"
  | "lastMonth"
  | "thisYear"
  | "custom";

/**
 * Props pour le composant DashboardFilters
 */
export interface DashboardFiltersProps {
  /**
   * Fonction appelée lorsque les filtres sont appliqués
   */
  onFilterChange: (period: FilterPeriod, dateRange?: DateRange) => void;

  /**
   * Classes CSS additionnelles
   */
  className?: string;
}

/**
 * Composant DashboardFilters - Filtres pour le tableau de bord
 */
const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  onFilterChange,
  className,
}) => {
  // État pour la période sélectionnée
  const [period, setPeriod] = useState<FilterPeriod>("last30days");
  // État pour la plage de dates personnalisée
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  // État pour les filtres supplémentaires
  const [filters, setFilters] = useState({
    category: "all",
    provider: "all",
  });

  /**
   * Obtenir le libellé de la période
   */
  const getPeriodLabel = (period: FilterPeriod): string => {
    switch (period) {
      case "today":
        return "Aujourd'hui";
      case "yesterday":
        return "Hier";
      case "last7days":
        return "7 derniers jours";
      case "last30days":
        return "30 derniers jours";
      case "thisMonth":
        return "Ce mois-ci";
      case "lastMonth":
        return "Mois dernier";
      case "thisYear":
        return "Cette année";
      case "custom":
        if (dateRange.from && dateRange.to) {
          return `${format(dateRange.from, "dd/MM/yyyy")} - ${format(
            dateRange.to,
            "dd/MM/yyyy"
          )}`;
        }
        return "Personnalisé";
      default:
        return "Période";
    }
  };

  /**
   * Appliquer les filtres
   */
  const applyFilters = () => {
    onFilterChange(period, period === "custom" ? dateRange : undefined);
  };

  /**
   * Réinitialiser les filtres
   */
  const resetFilters = () => {
    setPeriod("last30days");
    setDateRange({ from: undefined, to: undefined });
    setFilters({ category: "all", provider: "all" });
    onFilterChange("last30days");
  };

  /**
   * Sélectionner une période
   */
  const selectPeriod = (period: FilterPeriod) => {
    setPeriod(period);
    if (period !== "custom") {
      onFilterChange(period);
    }
  };

  /**
   * Gérer le changement de filtre
   */
  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtres
            <Badge variant="secondary" className="ml-1 rounded-full px-1">
              {period !== "last30days" ||
              filters.category !== "all" ||
              filters.provider !== "all"
                ? "•"
                : ""}
            </Badge>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Période</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={period === "today" ? "default" : "outline"}
                  size="sm"
                  onClick={() => selectPeriod("today")}
                >
                  Aujourd&apos;hui
                </Button>
                <Button
                  variant={period === "yesterday" ? "default" : "outline"}
                  size="sm"
                  onClick={() => selectPeriod("yesterday")}
                >
                  Hier
                </Button>
                <Button
                  variant={period === "last7days" ? "default" : "outline"}
                  size="sm"
                  onClick={() => selectPeriod("last7days")}
                >
                  7 derniers jours
                </Button>
                <Button
                  variant={period === "last30days" ? "default" : "outline"}
                  size="sm"
                  onClick={() => selectPeriod("last30days")}
                >
                  30 derniers jours
                </Button>
                <Button
                  variant={period === "thisMonth" ? "default" : "outline"}
                  size="sm"
                  onClick={() => selectPeriod("thisMonth")}
                >
                  Ce mois-ci
                </Button>
                <Button
                  variant={period === "lastMonth" ? "default" : "outline"}
                  size="sm"
                  onClick={() => selectPeriod("lastMonth")}
                >
                  Mois dernier
                </Button>
                <Button
                  variant={period === "thisYear" ? "default" : "outline"}
                  size="sm"
                  onClick={() => selectPeriod("thisYear")}
                >
                  Cette année
                </Button>
                <Button
                  variant={period === "custom" ? "default" : "outline"}
                  size="sm"
                  onClick={() => selectPeriod("custom")}
                >
                  Personnalisé
                </Button>
              </div>
            </div>

            {period === "custom" && (
              <div className="space-y-2">
                <h4 className="font-medium">Plage de dates</h4>
                <div className="border rounded-md p-2">
                  <Calendar
                    mode="range"
                    selected={dateRange as CalendarDateRange}
                    onSelect={(range) => {
                      if (range) {
                        setDateRange({
                          from: range.from,
                          to: range.to,
                        });
                      } else {
                        setDateRange({ from: undefined, to: undefined });
                      }
                    }}
                    locale={fr}
                    className="rounded-md"
                  />
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-1">
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="wellness">Bien-être</SelectItem>
                  <SelectItem value="sport">Sport</SelectItem>
                  <SelectItem value="leisure">Loisirs</SelectItem>
                  <SelectItem value="culture">Culture</SelectItem>
                  <SelectItem value="gastronomy">Gastronomie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="provider">Prestataire</Label>
              <Select
                value={filters.provider}
                onValueChange={(value) => handleFilterChange("provider", value)}
              >
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Tous les prestataires" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les prestataires</SelectItem>
                  <SelectItem value="provider1">Spa Zen</SelectItem>
                  <SelectItem value="provider2">FitClub</SelectItem>
                  <SelectItem value="provider3">Escape Game XYZ</SelectItem>
                  <SelectItem value="provider4">
                    Musée d&apos;Art Moderne
                  </SelectItem>
                  <SelectItem value="provider5">Restaurant Gourmet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Réinitialiser
              </Button>
              <Button size="sm" onClick={applyFilters}>
                Appliquer
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Badge variant="outline" className="gap-1">
        Période: {getPeriodLabel(period)}
      </Badge>

      {filters.category !== "all" && (
        <Badge variant="outline" className="gap-1">
          Catégorie:{" "}
          {
            {
              wellness: "Bien-être",
              sport: "Sport",
              leisure: "Loisirs",
              culture: "Culture",
              gastronomy: "Gastronomie",
            }[filters.category]
          }
        </Badge>
      )}

      {filters.provider !== "all" && (
        <Badge variant="outline" className="gap-1">
          Prestataire:{" "}
          {
            {
              provider1: "Spa Zen",
              provider2: "FitClub",
              provider3: "Escape Game XYZ",
              provider4: "Musée d'Art Moderne",
              provider5: "Restaurant Gourmet",
            }[filters.provider]
          }
        </Badge>
      )}
    </div>
  );
};

export default DashboardFilters;
