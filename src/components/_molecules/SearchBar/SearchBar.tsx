"use client";

/**
 * Composant SearchBar - Barre de recherche avec bouton
 */

import React, { useState } from "react";
import Input from "@/components/_atoms/Input/Input";
import Button from "@/components/_atoms/Button/Button";
import { cn } from "@/lib/utils";

/**
 * Props pour le composant SearchBar
 */
export interface SearchBarProps {
  /** Placeholder du champ de recherche */
  placeholder?: string;
  /** Fonction appelée lors de la soumission de la recherche */
  onSearch: (query: string) => void;
  /** Valeur initiale du champ de recherche */
  initialValue?: string;
  /** Classes CSS additionnelles */
  className?: string;
  /** Indique si la barre de recherche doit prendre toute la largeur disponible */
  fullWidth?: boolean;
  /** Indique si la barre de recherche est en cours de chargement */
  loading?: boolean;
}

/**
 * Composant SearchBar - Barre de recherche avec bouton
 */
const SearchBar = ({
  placeholder = "Rechercher...",
  onSearch,
  initialValue = "",
  className,
  fullWidth = false,
  loading = false,
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-center gap-2",
        fullWidth && "w-full",
        className
      )}
    >
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        startIcon={
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
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        }
        containerClassName={cn(fullWidth && "flex-1")}
      />
      <Button type="submit" loading={loading} size="default">
        Rechercher
      </Button>
    </form>
  );
};

export default SearchBar;
