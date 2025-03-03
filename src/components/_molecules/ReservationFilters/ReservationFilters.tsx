"use client";

import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Composants UI
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Icônes
import { Search, Calendar as CalendarIcon, RefreshCw } from "lucide-react";

// Utilitaires
import { cn } from "@/lib/utils";

// Types pour les réservations
export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "refunded"
  | "all";

export type PaymentStatus = "pending" | "paid" | "refunded" | "failed" | "all";

// Type pour les filtres
export interface ReservationFiltersState {
  search: string;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  dateFrom: Date | null;
  dateTo: Date | null;
  providerId: string;
  customerId: string;
  sortBy: "date" | "amount" | "status";
  sortDirection: "asc" | "desc";
}

export interface ReservationFiltersProps {
  /** État des filtres */
  filters: ReservationFiltersState;
  /** Fonction appelée lors du changement des filtres */
  onFiltersChange: (filters: ReservationFiltersState) => void;
  /** Fonction appelée lors de la réinitialisation des filtres */
  onResetFilters: () => void;
}

/**
 * Composant pour les filtres de réservations
 */
export function ReservationFilters({
  filters,
  onFiltersChange,
  onResetFilters,
}: ReservationFiltersProps) {
  // Gestionnaire pour le changement de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value,
    });
  };

  // Gestionnaire pour le changement de statut
  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value as ReservationStatus,
    });
  };

  // Gestionnaire pour le changement de statut de paiement
  const handlePaymentStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      paymentStatus: value as PaymentStatus,
    });
  };

  // Gestionnaire pour le changement de date
  const handleDateChange = (
    field: "dateFrom" | "dateTo",
    date: Date | undefined
  ) => {
    onFiltersChange({
      ...filters,
      [field]: date || null,
    });
  };

  // Gestionnaire pour le changement de tri
  const handleSortChange = (
    field: "sortBy" | "sortDirection",
    value: string
  ) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Recherche */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          value={filters.search}
          onChange={handleSearchChange}
          className="flex-1"
        />
      </div>

      {/* Filtre par statut */}
      <div>
        <Select value={filters.status} onValueChange={handleStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="confirmed">Confirmée</SelectItem>
            <SelectItem value="completed">Terminée</SelectItem>
            <SelectItem value="cancelled">Annulée</SelectItem>
            <SelectItem value="refunded">Remboursée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filtre par statut de paiement */}
      <div>
        <Select
          value={filters.paymentStatus}
          onValueChange={handlePaymentStatusChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Statut de paiement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="paid">Payé</SelectItem>
            <SelectItem value="refunded">Remboursé</SelectItem>
            <SelectItem value="failed">Échoué</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filtre par date (début) */}
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !filters.dateFrom && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateFrom ? (
                format(filters.dateFrom, "dd/MM/yyyy", { locale: fr })
              ) : (
                <span>Date de début</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.dateFrom || undefined}
              onSelect={(date) => handleDateChange("dateFrom", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Filtre par date (fin) */}
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !filters.dateTo && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateTo ? (
                format(filters.dateTo, "dd/MM/yyyy", { locale: fr })
              ) : (
                <span>Date de fin</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.dateTo || undefined}
              onSelect={(date) => handleDateChange("dateTo", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Tri */}
      <div>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => handleSortChange("sortBy", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="amount">Montant</SelectItem>
            <SelectItem value="status">Statut</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Direction du tri */}
      <div>
        <Select
          value={filters.sortDirection}
          onValueChange={(value) => handleSortChange("sortDirection", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Ordre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Croissant</SelectItem>
            <SelectItem value="desc">Décroissant</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bouton de réinitialisation */}
      <div className="flex items-center">
        <Button variant="outline" onClick={onResetFilters} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Réinitialiser
        </Button>
      </div>
    </div>
  );
}

export default ReservationFilters;
