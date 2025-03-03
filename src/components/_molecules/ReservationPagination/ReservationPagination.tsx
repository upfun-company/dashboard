"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export interface ReservationPaginationProps {
  /** État de la pagination */
  pagination: PaginationState;
  /** Fonction appelée lors du changement de page */
  onPageChange: (page: number) => void;
}

/**
 * Composant pour la pagination des réservations
 */
export function ReservationPagination({
  pagination,
  onPageChange,
}: ReservationPaginationProps) {
  const { page, limit, total } = pagination;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Affichage de {total > 0 ? startIndex + 1 : 0} à {endIndex} sur {total}{" "}
        réservations
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}

export default ReservationPagination;
