"use client";

/**
 * Composant DataTable - Tableau de données avec pagination et tri
 */

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Button from "@/components/_atoms/Button/Button";
import { cn } from "@/lib/utils";

/**
 * Type pour une colonne du tableau
 */
export type Column<T> = {
  id: string;
  header: React.ReactNode;
  cell: (item: T) => React.ReactNode;
  sortable?: boolean;
};

/**
 * Props pour le composant DataTable
 */
export interface DataTableProps<T> {
  /** Données à afficher */
  data: T[];
  /** Définition des colonnes */
  columns: Column<T>[];
  /** Clé unique pour chaque ligne */
  getRowId: (item: T) => string;
  /** Nombre d'éléments par page */
  pageSize?: number;
  /** Fonction appelée lors du clic sur une ligne */
  onRowClick?: (item: T) => void;
  /** Classes CSS additionnelles */
  className?: string;
  /** Indique si le tableau est en cours de chargement */
  loading?: boolean;
  /** Message à afficher si aucune donnée n'est disponible */
  emptyMessage?: string;
}

/**
 * Composant DataTable - Tableau de données avec pagination et tri
 */
function DataTable<T>({
  data,
  columns,
  getRowId,
  pageSize = 10,
  onRowClick,
  className,
  loading = false,
  emptyMessage = "Aucune donnée disponible",
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Calcul du nombre total de pages
  const totalPages = Math.ceil(data.length / pageSize);

  // Fonction pour changer de page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Fonction pour trier les données
  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  // Tri des données
  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;

    const column = columns.find((col) => col.id === sortColumn);
    if (!column) return 0;

    const aValue = String(column.cell(a));
    const bValue = String(column.cell(b));

    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  // Pagination des données
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Rendu du tableau vide
  if (data.length === 0 && !loading) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border bg-card p-4 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn(
                    column.sortable && "cursor-pointer hover:bg-accent/50",
                    sortColumn === column.id && "bg-accent/50"
                  )}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && sortColumn === column.id && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: pageSize }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {columns.map((column) => (
                      <TableCell key={`skeleton-${index}-${column.id}`}>
                        <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : paginatedData.map((item) => (
                  <TableRow
                    key={getRowId(item)}
                    className={cn(
                      onRowClick && "cursor-pointer hover:bg-accent/50"
                    )}
                    onClick={() => onRowClick && onRowClick(item)}
                  >
                    {columns.map((column) => (
                      <TableCell key={`${getRowId(item)}-${column.id}`}>
                        {column.cell(item)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} sur {totalPages}
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || loading}
            >
              {"<<"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              {"<"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
            >
              {">"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || loading}
            >
              {">>"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
