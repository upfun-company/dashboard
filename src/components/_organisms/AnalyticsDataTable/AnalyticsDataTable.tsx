"use client";

/**
 * Composant AnalyticsDataTable - Tableau de données analytiques avancé
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  Download,
  Filter,
  MoreHorizontal,
  Search,
  SortAsc,
  SortDesc,
  Eye,
  Copy,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

/**
 * Type pour une colonne du tableau
 */
export interface AnalyticsColumn<T> {
  /** Identifiant de la colonne */
  id: string;
  /** En-tête de la colonne */
  header: string;
  /** Fonction d'accès à la valeur */
  accessorFn: (row: T) => string | number | boolean | null | undefined;
  /** Fonction de rendu de la cellule */
  cell?: (
    value: string | number | boolean | null | undefined,
    row: T
  ) => React.ReactNode;
  /** Alignement du contenu */
  align?: "left" | "center" | "right";
  /** Largeur de la colonne */
  width?: string;
  /** Indique si la colonne est triable */
  sortable?: boolean;
  /** Indique si la colonne est filtrable */
  filterable?: boolean;
  /** Format des nombres */
  format?: "standard" | "compact" | "currency" | "percent";
  /** Indique si la colonne est visible par défaut */
  defaultVisible?: boolean;
}

/**
 * Type pour les options de tri
 */
export interface SortOption {
  /** Identifiant de la colonne */
  id: string;
  /** Direction du tri */
  desc: boolean;
}

/**
 * Props pour le composant AnalyticsDataTable
 */
export interface AnalyticsDataTableProps<T> {
  /** Données à afficher */
  data: T[];
  /** Définition des colonnes */
  columns: AnalyticsColumn<T>[];
  /** Titre du tableau */
  title?: string;
  /** Indique si le tableau est en cours de chargement */
  isLoading?: boolean;
  /** Fonction appelée lors du clic sur une ligne */
  onRowClick?: (row: T) => void;
  /** Fonction appelée lors du changement de tri */
  onSortChange?: (sortOptions: SortOption[]) => void;
  /** Fonction appelée lors du changement de page */
  onPageChange?: (page: number) => void;
  /** Fonction appelée lors du changement de taille de page */
  onPageSizeChange?: (pageSize: number) => void;
  /** Page actuelle */
  currentPage?: number;
  /** Nombre total de pages */
  totalPages?: number;
  /** Taille de page */
  pageSize?: number;
  /** Options de taille de page */
  pageSizeOptions?: number[];
  /** Nombre total d'éléments */
  totalItems?: number;
  /** Indique si la sélection multiple est activée */
  enableSelection?: boolean;
  /** Fonction appelée lors du changement de sélection */
  onSelectionChange?: (selectedRows: T[]) => void;
  /** Fonction appelée lors de l'export des données */
  onExport?: (format: "csv" | "excel" | "pdf") => void;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant AnalyticsDataTable - Tableau de données analytiques avancé
 */
function AnalyticsDataTable<T extends { id: string | number }>({
  data,
  columns,
  title,
  isLoading = false,
  onRowClick,
  onSortChange,
  onPageChange,
  onPageSizeChange,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  totalItems = 0,
  enableSelection = false,
  onSelectionChange,
  onExport,
  className,
}: AnalyticsDataTableProps<T>) {
  // État pour les colonnes visibles
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.filter((col) => col.defaultVisible !== false).map((col) => col.id)
  );

  // État pour le tri
  const [sorting, setSorting] = useState<SortOption[]>([]);

  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState("");

  // État pour les lignes sélectionnées
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  // Formater les valeurs numériques selon les options
  const formatValue = (
    value: string | number | boolean | null | undefined,
    format?: string
  ): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "boolean") return value ? "Oui" : "Non";
    if (typeof value !== "number") return String(value);

    switch (format) {
      case "compact":
        return new Intl.NumberFormat("fr-FR", {
          notation: "compact",
          compactDisplay: "short",
        }).format(value);
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
        return new Intl.NumberFormat("fr-FR").format(value);
    }
  };

  // Gérer le changement de tri
  const handleSort = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column?.sortable) return;

    let newSorting: SortOption[];

    // Vérifier si la colonne est déjà triée
    const currentSort = sorting.find((sort) => sort.id === columnId);

    if (!currentSort) {
      // Ajouter un nouveau tri
      newSorting = [...sorting, { id: columnId, desc: false }];
    } else if (!currentSort.desc) {
      // Changer la direction du tri
      newSorting = sorting.map((sort) =>
        sort.id === columnId ? { ...sort, desc: true } : sort
      );
    } else {
      // Supprimer le tri
      newSorting = sorting.filter((sort) => sort.id !== columnId);
    }

    setSorting(newSorting);
    onSortChange?.(newSorting);
  };

  // Gérer la visibilité des colonnes
  const toggleColumnVisibility = (columnId: string) => {
    setVisibleColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  // Gérer la sélection d'une ligne
  const toggleRowSelection = (row: T) => {
    if (!enableSelection) return;

    setSelectedRows((prev) => {
      const isSelected = prev.some((r) => r.id === row.id);
      const newSelection = isSelected
        ? prev.filter((r) => r.id !== row.id)
        : [...prev, row];

      onSelectionChange?.(newSelection);
      return newSelection;
    });
  };

  // Gérer la sélection de toutes les lignes
  const toggleSelectAll = () => {
    if (!enableSelection) return;

    const newSelection = selectedRows.length === data.length ? [] : [...data];
    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  // Exporter les données
  const exportData = (format: "csv" | "excel" | "pdf") => {
    onExport?.(format);

    // Si aucune fonction d'export n'est fournie, implémenter l'export CSV par défaut
    if (!onExport && format === "csv") {
      const visibleCols = columns.filter((col) =>
        visibleColumns.includes(col.id)
      );

      // Créer l'en-tête
      const headers = visibleCols.map((col) => col.header);
      let csvContent = headers.join(",") + "\n";

      // Ajouter les données
      data.forEach((row) => {
        const values = visibleCols.map((col) => {
          const value = col.accessorFn(row);
          // Échapper les virgules et les guillemets
          return typeof value === "string"
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        });
        csvContent += values.join(",") + "\n";
      });

      // Créer un blob et télécharger
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${title || "export"}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Calculer les indices de début et de fin pour la pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  // Générer les pages à afficher
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages = [];

    if (totalPages <= maxPagesToShow) {
      // Afficher toutes les pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Afficher un sous-ensemble de pages
      if (currentPage <= 3) {
        // Début
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Fin
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Milieu
        pages.push(1);
        pages.push(-1); // Ellipsis
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* En-tête du tableau */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {title && <h3 className="text-lg font-medium">{title}</h3>}

        <div className="flex flex-wrap items-center gap-2 ml-auto">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-8 w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sélection des colonnes */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                Colonnes
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {columns.map((column) => (
                <DropdownMenuItem
                  key={column.id}
                  className="flex items-center gap-2"
                  onSelect={(e) => {
                    e.preventDefault();
                    toggleColumnVisibility(column.id);
                  }}
                >
                  <Checkbox
                    id={`column-${column.id}`}
                    checked={visibleColumns.includes(column.id)}
                    onCheckedChange={() => toggleColumnVisibility(column.id)}
                  />
                  <label
                    htmlFor={`column-${column.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    {column.header}
                  </label>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportData("csv")}>
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportData("excel")}>
                Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportData("pdf")}>
                PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Informations sur la sélection */}
      {enableSelection && selectedRows.length > 0 && (
        <div className="bg-muted/50 p-2 rounded-md flex items-center justify-between">
          <span>
            {selectedRows.length} élément{selectedRows.length > 1 ? "s" : ""}{" "}
            sélectionné{selectedRows.length > 1 ? "s" : ""}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedRows([]);
              onSelectionChange?.([]);
            }}
          >
            Désélectionner tout
          </Button>
        </div>
      )}

      {/* Tableau */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Case à cocher pour sélectionner toutes les lignes */}
              {enableSelection && (
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={
                      data.length > 0 && selectedRows.length === data.length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
              )}

              {/* En-têtes des colonnes */}
              {columns
                .filter((column) => visibleColumns.includes(column.id))
                .map((column) => (
                  <TableHead
                    key={column.id}
                    className={cn(
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                      column.sortable && "cursor-pointer select-none"
                    )}
                    style={column.width ? { width: column.width } : undefined}
                    onClick={() => column.sortable && handleSort(column.id)}
                  >
                    <div className="flex items-center gap-1">
                      {column.header}
                      {column.sortable && (
                        <div className="flex flex-col">
                          {sorting.find((sort) => sort.id === column.id)
                            ?.desc ? (
                            <SortDesc className="h-3 w-3" />
                          ) : sorting.find((sort) => sort.id === column.id) ? (
                            <SortAsc className="h-3 w-3" />
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}

              {/* Actions */}
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Affichage pendant le chargement
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {enableSelection && (
                    <TableCell>
                      <div className="h-4 w-4 rounded-sm bg-muted animate-pulse" />
                    </TableCell>
                  )}
                  {columns
                    .filter((column) => visibleColumns.includes(column.id))
                    .map((column) => (
                      <TableCell
                        key={`skeleton-${index}-${column.id}`}
                        className={cn(
                          column.align === "center" && "text-center",
                          column.align === "right" && "text-right"
                        )}
                      >
                        <div className="h-4 bg-muted rounded animate-pulse" />
                      </TableCell>
                    ))}
                  <TableCell>
                    <div className="h-8 w-8 rounded-md bg-muted animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              // Aucune donnée
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length + (enableSelection ? 2 : 1)}
                  className="h-24 text-center"
                >
                  Aucune donnée disponible
                </TableCell>
              </TableRow>
            ) : (
              // Données
              data.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    onRowClick && "cursor-pointer hover:bg-muted/50",
                    selectedRows.some((r) => r.id === row.id) && "bg-muted/50"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {/* Case à cocher pour sélectionner la ligne */}
                  {enableSelection && (
                    <TableCell
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRowSelection(row);
                      }}
                    >
                      <Checkbox
                        checked={selectedRows.some((r) => r.id === row.id)}
                        onCheckedChange={() => toggleRowSelection(row)}
                      />
                    </TableCell>
                  )}

                  {/* Cellules */}
                  {columns
                    .filter((column) => visibleColumns.includes(column.id))
                    .map((column) => {
                      const value = column.accessorFn(row);
                      return (
                        <TableCell
                          key={`${row.id}-${column.id}`}
                          className={cn(
                            column.align === "center" && "text-center",
                            column.align === "right" && "text-right"
                          )}
                        >
                          {column.cell
                            ? column.cell(value, row)
                            : formatValue(value, column.format)}
                        </TableCell>
                      );
                    })}

                  {/* Actions */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onRowClick?.(row);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            // Copier l'ID dans le presse-papier
                            navigator.clipboard.writeText(String(row.id));
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copier l&apos;ID
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Affichage de {startIndex + 1} à {endIndex} sur {totalItems} éléments
          </div>

          <div className="flex items-center gap-2">
            {/* Taille de page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Afficher</span>
              <select
                className="h-8 w-[70px] rounded-md border border-input bg-background px-2 py-1 text-sm"
                value={pageSize}
                onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="text-sm text-muted-foreground">par page</span>
            </div>

            {/* Boutons de pagination */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange?.(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {getPageNumbers().map((page, index) =>
                page === -1 ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-muted-foreground"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange?.(page)}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange?.(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsDataTable;
