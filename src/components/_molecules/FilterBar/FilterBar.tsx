"use client";

/**
 * Composant FilterBar - Barre de filtres avancés
 */

import React, { useState } from "react";
import Button from "@/components/_atoms/Button/Button";
import Badge from "@/components/_atoms/Badge/Badge";
import { cn } from "@/lib/utils";

/**
 * Type pour un filtre
 */
export type Filter = {
  id: string;
  label: string;
  value: string;
};

/**
 * Props pour le composant FilterBar
 */
export interface FilterBarProps {
  /** Filtres actifs */
  activeFilters: Filter[];
  /** Fonction appelée lors de l'ajout d'un filtre */
  onAddFilter: (filter: Filter) => void;
  /** Fonction appelée lors de la suppression d'un filtre */
  onRemoveFilter: (filterId: string) => void;
  /** Fonction appelée lors de la réinitialisation des filtres */
  onResetFilters: () => void;
  /** Options de filtres disponibles */
  filterOptions?: {
    id: string;
    label: string;
    options: { value: string; label: string }[];
  }[];
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant FilterBar - Barre de filtres avancés
 */
const FilterBar = ({
  activeFilters,
  onAddFilter,
  onRemoveFilter,
  onResetFilters,
  filterOptions = [],
  className,
}: FilterBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFilterId, setSelectedFilterId] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");

  const handleAddFilter = () => {
    if (!selectedFilterId || !filterValue) return;

    const filterOption = filterOptions.find(
      (option) => option.id === selectedFilterId
    );
    if (!filterOption) return;

    const valueOption = filterOption.options.find(
      (option) => option.value === filterValue
    );
    if (!valueOption) return;

    onAddFilter({
      id: `${selectedFilterId}-${filterValue}`,
      label: `${filterOption.label}: ${valueOption.label}`,
      value: filterValue,
    });

    setSelectedFilterId("");
    setFilterValue("");
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {activeFilters.map((filter) => (
          <Badge
            key={filter.id}
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1"
            clickable
            onClick={() => onRemoveFilter(filter.id)}
          >
            {filter.label}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </Badge>
        ))}

        {activeFilters.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onResetFilters}>
            Réinitialiser
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto"
        >
          {isExpanded ? "Masquer les filtres" : "Filtres avancés"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-2"
          >
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
          </svg>
        </Button>
      </div>

      {isExpanded && (
        <div className="flex flex-wrap items-end gap-4 rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1">
              Type de filtre
            </label>
            <select
              value={selectedFilterId}
              onChange={(e) => {
                setSelectedFilterId(e.target.value);
                setFilterValue("");
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="">Sélectionner un filtre</option>
              {filterOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {selectedFilterId && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-1">Valeur</label>
              <select
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="">Sélectionner une valeur</option>
                {filterOptions
                  .find((option) => option.id === selectedFilterId)
                  ?.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <Button
            onClick={handleAddFilter}
            disabled={!selectedFilterId || !filterValue}
          >
            Ajouter le filtre
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
