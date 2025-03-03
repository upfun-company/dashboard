"use client";

/**
 * Composant AdvancedAnalyticsFilters - Filtres avancés pour la page d'analyse
 */

import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Search,
  X,
  Plus,
  SlidersHorizontal,
} from "lucide-react";

/**
 * Type pour la plage de dates
 */
export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

/**
 * Type pour les périodes prédéfinies
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
 * Type pour un filtre
 */
export interface AnalyticsFilter {
  /** Identifiant unique du filtre */
  id: string;
  /** Type de filtre (catégorie, statut, etc.) */
  type: string;
  /** Valeur du filtre */
  value: string;
  /** Libellé à afficher */
  label: string;
}

/**
 * Type pour les options de filtre
 */
export interface FilterOption {
  /** Identifiant de l'option */
  id: string;
  /** Libellé de l'option */
  label: string;
  /** Options de valeurs disponibles */
  options: {
    /** Valeur */
    value: string;
    /** Libellé */
    label: string;
  }[];
}

/**
 * Type pour les filtres d'analyse
 */
export interface AnalyticsFilterState {
  /** Terme de recherche */
  search: string;
  /** Période sélectionnée */
  period: FilterPeriod;
  /** Plage de dates personnalisée */
  dateRange: DateRange;
  /** Filtres actifs */
  activeFilters: AnalyticsFilter[];
  /** Granularité temporelle (jour, semaine, mois, etc.) */
  timeGranularity: "day" | "week" | "month" | "quarter" | "year";
  /** Comparaison avec période précédente */
  compareWithPrevious: boolean;
  /** Tri */
  sortBy: string;
  /** Direction du tri */
  sortDirection: "asc" | "desc";
}

/**
 * Props pour le composant AdvancedAnalyticsFilters
 */
export interface AdvancedAnalyticsFiltersProps {
  /** État initial des filtres */
  initialFilters?: Partial<AnalyticsFilterState>;
  /** Options de filtres disponibles */
  filterOptions: FilterOption[];
  /** Options de tri disponibles */
  sortOptions?: { value: string; label: string }[];
  /** Fonction appelée lors du changement de filtres */
  onFiltersChange: (filters: AnalyticsFilterState) => void;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Valeurs par défaut pour les filtres
 */
const defaultFilters: AnalyticsFilterState = {
  search: "",
  period: "last30days",
  dateRange: {
    from: undefined,
    to: undefined,
  },
  activeFilters: [],
  timeGranularity: "month",
  compareWithPrevious: false,
  sortBy: "date",
  sortDirection: "desc",
};

/**
 * Options de tri par défaut
 */
const defaultSortOptions = [
  { value: "date", label: "Date" },
  { value: "revenue", label: "Chiffre d'affaires" },
  { value: "reservations", label: "Nombre de réservations" },
  { value: "avgValue", label: "Valeur moyenne" },
];

/**
 * Composant AdvancedAnalyticsFilters - Filtres avancés pour la page d'analyse
 */
const AdvancedAnalyticsFilters: React.FC<AdvancedAnalyticsFiltersProps> = ({
  initialFilters = {},
  filterOptions,
  sortOptions = defaultSortOptions,
  onFiltersChange,
  className,
}) => {
  // État des filtres
  const [filters, setFilters] = useState<AnalyticsFilterState>({
    ...defaultFilters,
    ...initialFilters,
  });

  // État pour le popover de période
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);

  // État pour le popover de filtres avancés
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // État pour le filtre en cours d'ajout
  const [selectedFilterType, setSelectedFilterType] = useState<string>("");
  const [selectedFilterValue, setSelectedFilterValue] = useState<string>("");

  // Fonction pour obtenir le libellé de la période sélectionnée
  const getPeriodLabel = (
    period: FilterPeriod,
    dateRange: DateRange
  ): string => {
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
        return "Période personnalisée";
      default:
        return "Sélectionner une période";
    }
  };

  // Fonction pour obtenir les dates correspondant à une période
  const getDateRangeFromPeriod = (period: FilterPeriod): DateRange => {
    const today = new Date();

    switch (period) {
      case "today":
        return { from: today, to: today };
      case "yesterday":
        const yesterday = subDays(today, 1);
        return { from: yesterday, to: yesterday };
      case "last7days":
        return { from: subDays(today, 6), to: today };
      case "last30days":
        return { from: subDays(today, 29), to: today };
      case "thisMonth":
        return {
          from: startOfMonth(today),
          to: endOfMonth(today),
        };
      case "lastMonth":
        const lastMonth = subDays(startOfMonth(today), 1);
        return {
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth),
        };
      case "thisYear":
        return {
          from: startOfYear(today),
          to: endOfYear(today),
        };
      default:
        return { from: undefined, to: undefined };
    }
  };

  // Fonction pour mettre à jour les filtres
  const updateFilters = useCallback(
    (newFilters: Partial<AnalyticsFilterState>) => {
      // S'assurer que tous les champs requis sont présents
      const updatedFilters: AnalyticsFilterState = {
        ...filters,
        ...newFilters,
        // Garantir que les propriétés obligatoires sont définies
        search:
          newFilters.search !== undefined ? newFilters.search : filters.search,
        period: newFilters.period || filters.period,
        dateRange: newFilters.dateRange || filters.dateRange,
        activeFilters: newFilters.activeFilters || filters.activeFilters,
        timeGranularity: newFilters.timeGranularity || filters.timeGranularity,
        compareWithPrevious:
          newFilters.compareWithPrevious ?? filters.compareWithPrevious,
        sortBy: newFilters.sortBy || filters.sortBy,
        sortDirection: newFilters.sortDirection || filters.sortDirection,
      };

      setFilters(updatedFilters);
      console.log(
        "Filtres mis à jour dans AdvancedAnalyticsFilters:",
        updatedFilters
      );
      onFiltersChange(updatedFilters);
    },
    [filters, onFiltersChange]
  );

  // Fonction pour sélectionner une période
  const selectPeriod = useCallback(
    (period: FilterPeriod) => {
      if (period !== "custom") {
        const dateRange = getDateRangeFromPeriod(period);
        updateFilters({ period, dateRange });
      } else {
        updateFilters({ period });
      }
    },
    [updateFilters]
  );

  // Fonction pour appliquer les filtres de période
  const applyPeriodFilters = useCallback(() => {
    setIsPeriodOpen(false);
  }, []);

  // Fonction pour réinitialiser les filtres de période
  const resetPeriodFilters = useCallback(() => {
    updateFilters({
      period: "last30days",
      dateRange: getDateRangeFromPeriod("last30days"),
    });
    setIsPeriodOpen(false);
  }, [updateFilters]);

  // Fonction pour ajouter un filtre
  const addFilter = useCallback(() => {
    if (!selectedFilterType || !selectedFilterValue) return;

    const filterType = filterOptions.find(
      (option) => option.id === selectedFilterType
    );
    if (!filterType) return;

    const filterValue = filterType.options.find(
      (option) => option.value === selectedFilterValue
    );
    if (!filterValue) return;

    const newFilter: AnalyticsFilter = {
      id: `${selectedFilterType}-${selectedFilterValue}`,
      type: selectedFilterType,
      value: selectedFilterValue,
      label: `${filterType.label}: ${filterValue.label}`,
    };

    // Vérifier si le filtre existe déjà
    const filterExists = filters.activeFilters.some(
      (filter) => filter.id === newFilter.id
    );
    if (filterExists) return;

    updateFilters({
      activeFilters: [...filters.activeFilters, newFilter],
    });

    // Réinitialiser les sélections
    setSelectedFilterType("");
    setSelectedFilterValue("");
  }, [
    selectedFilterType,
    selectedFilterValue,
    filterOptions,
    filters.activeFilters,
    updateFilters,
  ]);

  // Fonction pour supprimer un filtre
  const removeFilter = useCallback(
    (filterId: string) => {
      updateFilters({
        activeFilters: filters.activeFilters.filter(
          (filter) => filter.id !== filterId
        ),
      });
    },
    [filters.activeFilters, updateFilters]
  );

  // Fonction pour réinitialiser tous les filtres
  const resetAllFilters = useCallback(() => {
    const defaultState = { ...defaultFilters };
    setFilters(defaultState);
    onFiltersChange(defaultState);
    setIsFiltersOpen(false);
  }, [onFiltersChange]);

  // Initialiser les filtres au montage du composant
  useEffect(() => {
    if (initialFilters) {
      // S'assurer que tous les champs requis sont présents
      const completeFilters: AnalyticsFilterState = {
        search: initialFilters.search || "",
        period: initialFilters.period || "last30days",
        dateRange: initialFilters.dateRange || {
          from: new Date(),
          to: new Date(),
        },
        activeFilters: initialFilters.activeFilters || [],
        timeGranularity: initialFilters.timeGranularity || "day",
        compareWithPrevious: initialFilters.compareWithPrevious ?? true,
        sortBy: initialFilters.sortBy || "date",
        sortDirection: initialFilters.sortDirection || "desc",
      };
      setFilters(completeFilters);
    }
  }, [initialFilters]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Barre de recherche et filtres principaux */}
      <div className="flex flex-wrap gap-3">
        {/* Recherche */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="pl-8"
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>

        {/* Sélecteur de période */}
        <Popover open={isPeriodOpen} onOpenChange={setIsPeriodOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="min-w-[180px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {getPeriodLabel(filters.period, filters.dateRange)}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Tabs defaultValue="predefined" className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="predefined">
                  Périodes prédéfinies
                </TabsTrigger>
                <TabsTrigger value="custom">Période personnalisée</TabsTrigger>
              </TabsList>
              <TabsContent value="predefined" className="p-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={filters.period === "today" ? "default" : "outline"}
                    onClick={() => selectPeriod("today")}
                    className="justify-start"
                  >
                    Aujourd&apos;hui
                  </Button>
                  <Button
                    variant={
                      filters.period === "yesterday" ? "default" : "outline"
                    }
                    onClick={() => selectPeriod("yesterday")}
                    className="justify-start"
                  >
                    Hier
                  </Button>
                  <Button
                    variant={
                      filters.period === "last7days" ? "default" : "outline"
                    }
                    onClick={() => selectPeriod("last7days")}
                    className="justify-start"
                  >
                    7 derniers jours
                  </Button>
                  <Button
                    variant={
                      filters.period === "last30days" ? "default" : "outline"
                    }
                    onClick={() => selectPeriod("last30days")}
                    className="justify-start"
                  >
                    30 derniers jours
                  </Button>
                  <Button
                    variant={
                      filters.period === "thisMonth" ? "default" : "outline"
                    }
                    onClick={() => selectPeriod("thisMonth")}
                    className="justify-start"
                  >
                    Ce mois-ci
                  </Button>
                  <Button
                    variant={
                      filters.period === "lastMonth" ? "default" : "outline"
                    }
                    onClick={() => selectPeriod("lastMonth")}
                    className="justify-start"
                  >
                    Mois dernier
                  </Button>
                  <Button
                    variant={
                      filters.period === "thisYear" ? "default" : "outline"
                    }
                    onClick={() => selectPeriod("thisYear")}
                    className="justify-start col-span-2"
                  >
                    Cette année
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="custom" className="p-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">
                      Sélectionnez une plage de dates
                    </p>
                    <div className="border rounded-md p-2">
                      <Calendar
                        mode="range"
                        selected={filters.dateRange}
                        onSelect={(range) => {
                          if (range) {
                            updateFilters({
                              period: "custom",
                              dateRange: {
                                from: range.from,
                                to: range.to || range.from,
                              },
                            });
                          }
                        }}
                        locale={fr}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                  {filters.dateRange.from && filters.dateRange.to && (
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">Du:</span>{" "}
                        {format(filters.dateRange.from, "dd MMMM yyyy", {
                          locale: fr,
                        })}
                      </div>
                      <div>
                        <span className="font-medium">Au:</span>{" "}
                        {format(filters.dateRange.to, "dd MMMM yyyy", {
                          locale: fr,
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              <Separator />
              <div className="flex items-center justify-between p-4">
                <Button variant="ghost" onClick={resetPeriodFilters}>
                  Réinitialiser
                </Button>
                <Button onClick={applyPeriodFilters}>Appliquer</Button>
              </div>
            </Tabs>
          </PopoverContent>
        </Popover>

        {/* Granularité temporelle */}
        <Select
          value={filters.timeGranularity}
          onValueChange={(value) =>
            updateFilters({
              timeGranularity: value as
                | "day"
                | "week"
                | "month"
                | "quarter"
                | "year",
            })
          }
        >
          <SelectTrigger className="min-w-[150px]">
            <SelectValue placeholder="Granularité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Jour</SelectItem>
            <SelectItem value="week">Semaine</SelectItem>
            <SelectItem value="month">Mois</SelectItem>
            <SelectItem value="quarter">Trimestre</SelectItem>
            <SelectItem value="year">Année</SelectItem>
          </SelectContent>
        </Select>

        {/* Tri */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) => updateFilters({ sortBy: value })}
        >
          <SelectTrigger className="min-w-[180px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Direction du tri */}
        <Select
          value={filters.sortDirection}
          onValueChange={(value) =>
            updateFilters({ sortDirection: value as "asc" | "desc" })
          }
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Ordre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Croissant</SelectItem>
            <SelectItem value="desc">Décroissant</SelectItem>
          </SelectContent>
        </Select>

        {/* Bouton de filtres avancés */}
        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filtres avancés
              {filters.activeFilters.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {filters.activeFilters.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-4" align="end">
            <div className="space-y-4">
              <h4 className="font-medium">Filtres avancés</h4>
              <Separator />

              {/* Filtres actifs */}
              {filters.activeFilters.length > 0 && (
                <div className="space-y-2">
                  <Label>Filtres actifs</Label>
                  <div className="flex flex-wrap gap-2">
                    {filters.activeFilters.map((filter) => (
                      <Badge
                        key={filter.id}
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-1"
                      >
                        {filter.label}
                        <X
                          className="h-3 w-3 ml-1 cursor-pointer"
                          onClick={() => removeFilter(filter.id)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Ajout de filtre */}
              <div className="space-y-2">
                <Label>Ajouter un filtre</Label>
                <div className="flex flex-col gap-2">
                  <Select
                    value={selectedFilterType}
                    onValueChange={setSelectedFilterType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type de filtre" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedFilterType && (
                    <Select
                      value={selectedFilterValue}
                      onValueChange={setSelectedFilterValue}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une valeur" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions
                          .find((option) => option.id === selectedFilterType)
                          ?.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}

                  <Button
                    onClick={addFilter}
                    disabled={!selectedFilterType || !selectedFilterValue}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter le filtre
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Options supplémentaires */}
              <div className="space-y-2">
                <Label>Options supplémentaires</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="compareWithPrevious"
                    checked={filters.compareWithPrevious}
                    onCheckedChange={(checked: boolean) =>
                      updateFilters({ compareWithPrevious: checked })
                    }
                  />
                  <label
                    htmlFor="compareWithPrevious"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Comparer avec la période précédente
                  </label>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="ghost" onClick={resetAllFilters}>
                  Réinitialiser tous les filtres
                </Button>
                <Button onClick={() => setIsFiltersOpen(false)}>
                  Appliquer
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Affichage des filtres actifs */}
      {filters.activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtres actifs:</span>
          {filters.activeFilters.map((filter) => (
            <Badge
              key={filter.id}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1"
            >
              {filter.label}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => removeFilter(filter.id)}
              />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => updateFilters({ activeFilters: [] })}
          >
            Effacer tous les filtres
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdvancedAnalyticsFilters;
