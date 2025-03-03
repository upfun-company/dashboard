"use client";
import React, { useState, useCallback, memo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionFilters as TransactionFiltersType } from "@/types/finance";
import { CalendarIcon, FilterIcon, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Props du composant TransactionFilters
 */
export interface TransactionFiltersProps {
  /** Filtres actuels */
  filters: TransactionFiltersType;
  /** Callback appelé lorsque les filtres changent */
  onFiltersChange: (filters: TransactionFiltersType) => void;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant pour les filtres de transactions
 */
export const TransactionFilters = memo(
  ({ filters, onFiltersChange, className }: TransactionFiltersProps) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [startDate, setStartDate] = useState<Date | undefined>(
      filters.dateRange?.start ? new Date(filters.dateRange.start) : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
      filters.dateRange?.end ? new Date(filters.dateRange.end) : undefined
    );

    // Optimiser les fonctions de changement avec useCallback
    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFilters = {
          ...filters,
          search: e.target.value,
        };
        onFiltersChange(newFilters);
      },
      [filters, onFiltersChange]
    );

    const handleSortChange = useCallback(
      (value: string) => {
        const [sortBy, sortDirection] = value.split("-");
        const newFilters = {
          ...filters,
          sortBy,
          sortDirection: sortDirection as "asc" | "desc",
        };
        onFiltersChange(newFilters);
      },
      [filters, onFiltersChange]
    );

    const handleStatusChange = useCallback(
      (status: string, checked: boolean) => {
        let newStatus = filters.status ? [...filters.status] : [];

        if (checked) {
          newStatus.push(
            status as "pending" | "completed" | "failed" | "cancelled"
          );
        } else {
          newStatus = newStatus.filter((s) => s !== status);
        }

        const newFilters = {
          ...filters,
          status: newStatus.length > 0 ? newStatus : undefined,
        };

        onFiltersChange(newFilters);
      },
      [filters, onFiltersChange]
    );

    const handleTypeChange = useCallback(
      (type: string, checked: boolean) => {
        let newType = filters.type ? [...filters.type] : [];

        if (checked) {
          newType.push(type as "payment" | "refund" | "payout" | "fee");
        } else {
          newType = newType.filter((t) => t !== type);
        }

        const newFilters = {
          ...filters,
          type: newType.length > 0 ? newType : undefined,
        };

        onFiltersChange(newFilters);
      },
      [filters, onFiltersChange]
    );

    // Appliquer la plage de dates
    const applyDateRange = useCallback(() => {
      const newFilters = {
        ...filters,
        dateRange:
          startDate || endDate
            ? {
                start: startDate ? startDate.toISOString() : "",
                end: endDate ? endDate.toISOString() : "",
              }
            : undefined,
      };

      onFiltersChange(newFilters);
      setIsCalendarOpen(false);
    }, [filters, startDate, endDate, onFiltersChange]);

    // Effacer la plage de dates
    const clearDateRange = useCallback(() => {
      setStartDate(undefined);
      setEndDate(undefined);

      const newFilters = {
        ...filters,
        dateRange: undefined,
      };

      onFiltersChange(newFilters);
      setIsCalendarOpen(false);
    }, [filters, onFiltersChange]);

    // Réinitialiser tous les filtres
    const resetAllFilters = useCallback(() => {
      setStartDate(undefined);
      setEndDate(undefined);

      onFiltersChange({
        search: "",
        sortBy: "createdAt",
        sortDirection: "desc",
      });
    }, [onFiltersChange]);

    // Formater la plage de dates pour l'affichage
    const formatDateRange = useCallback(() => {
      if (!filters.dateRange) return "Toutes les dates";

      const start = filters.dateRange.start
        ? format(new Date(filters.dateRange.start), "dd/MM/yyyy", {
            locale: fr,
          })
        : "";
      const end = filters.dateRange.end
        ? format(new Date(filters.dateRange.end), "dd/MM/yyyy", { locale: fr })
        : "";

      return start && end ? `${start} - ${end}` : start || end;
    }, [filters.dateRange]);

    // Vérifier si des filtres sont actifs
    const hasActiveFilters = useCallback(() => {
      return (
        filters.search ||
        filters.dateRange ||
        (filters.status && filters.status.length > 0) ||
        (filters.type && filters.type.length > 0) ||
        (filters.paymentMethod && filters.paymentMethod.length > 0) ||
        filters.minAmount !== undefined ||
        filters.maxAmount !== undefined
      );
    }, [filters]);

    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={filters.search}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>

          <div className="flex gap-2">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal w-[180px]",
                    filters.dateRange && "text-primary"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="truncate">{formatDateRange()}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex flex-col sm:flex-row max-h-[400px] overflow-auto">
                  <div className="p-3">
                    <div className="space-y-2 pb-2">
                      <h4 className="font-medium text-sm">Date de début</h4>
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        locale={fr}
                        className="rounded-md border shadow"
                      />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Date de fin</h4>
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        locale={fr}
                        className="rounded-md border shadow"
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearDateRange}
                      >
                        Effacer
                      </Button>
                      <Button size="sm" onClick={applyDateRange}>
                        Appliquer
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <FilterIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Filtres</span>
                  {hasActiveFilters() && (
                    <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-4" align="end">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Statut</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="status-pending"
                          checked={filters.status?.includes("pending")}
                          onCheckedChange={(checked) =>
                            handleStatusChange("pending", checked === true)
                          }
                        />
                        <Label htmlFor="status-pending">En attente</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="status-completed"
                          checked={filters.status?.includes("completed")}
                          onCheckedChange={(checked) =>
                            handleStatusChange("completed", checked === true)
                          }
                        />
                        <Label htmlFor="status-completed">Terminé</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="status-failed"
                          checked={filters.status?.includes("failed")}
                          onCheckedChange={(checked) =>
                            handleStatusChange("failed", checked === true)
                          }
                        />
                        <Label htmlFor="status-failed">Échoué</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="status-cancelled"
                          checked={filters.status?.includes("cancelled")}
                          onCheckedChange={(checked) =>
                            handleStatusChange("cancelled", checked === true)
                          }
                        />
                        <Label htmlFor="status-cancelled">Annulé</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Type</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="type-payment"
                          checked={filters.type?.includes("payment")}
                          onCheckedChange={(checked) =>
                            handleTypeChange("payment", checked === true)
                          }
                        />
                        <Label htmlFor="type-payment">Paiement</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="type-refund"
                          checked={filters.type?.includes("refund")}
                          onCheckedChange={(checked) =>
                            handleTypeChange("refund", checked === true)
                          }
                        />
                        <Label htmlFor="type-refund">Remboursement</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="type-payout"
                          checked={filters.type?.includes("payout")}
                          onCheckedChange={(checked) =>
                            handleTypeChange("payout", checked === true)
                          }
                        />
                        <Label htmlFor="type-payout">Versement</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="type-fee"
                          checked={filters.type?.includes("fee")}
                          onCheckedChange={(checked) =>
                            handleTypeChange("fee", checked === true)
                          }
                        />
                        <Label htmlFor="type-fee">Frais</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Tri</h4>
                    <Select
                      value={`${filters.sortBy}-${filters.sortDirection}`}
                      onValueChange={handleSortChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un tri" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt-desc">
                          Date (récent → ancien)
                        </SelectItem>
                        <SelectItem value="createdAt-asc">
                          Date (ancien → récent)
                        </SelectItem>
                        <SelectItem value="amount-desc">
                          Montant (élevé → bas)
                        </SelectItem>
                        <SelectItem value="amount-asc">
                          Montant (bas → élevé)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetAllFilters}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Réinitialiser les filtres
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    );
  }
);

// Ajouter un displayName pour faciliter le débogage
TransactionFilters.displayName = "TransactionFilters";

export default TransactionFilters;
