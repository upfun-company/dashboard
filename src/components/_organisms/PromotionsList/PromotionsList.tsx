import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Promotion } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import {
  Eye,
  Edit,
  Trash,
  MoreVertical,
  Filter,
  Search,
  Plus,
  Power,
  PowerOff,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface PromotionsListProps {
  /**
   * Liste des promotions à afficher
   */
  promotions: Promotion[];
  /**
   * Informations de pagination
   */
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  /**
   * Indique si les données sont en cours de chargement
   */
  isLoading?: boolean;
  /**
   * Classes CSS additionnelles
   */
  className?: string;
  /**
   * Fonction appelée lors du changement de page
   */
  onPageChange?: (page: number) => void;
  /**
   * Fonction appelée lors du changement de limite par page
   */
  onLimitChange?: (limit: number) => void;
  /**
   * Fonction appelée lors de la recherche
   */
  onSearch?: (search: string) => void;
  /**
   * Fonction appelée lors du filtrage par statut
   */
  onStatusFilter?: (status: boolean | "all") => void;
  /**
   * Fonction appelée lors du filtrage par type de remise
   */
  onDiscountTypeFilter?: (type: "percentage" | "fixed_amount" | "all") => void;
  /**
   * Fonction appelée lors du tri
   */
  onSort?: (field: string, direction: "asc" | "desc") => void;
  /**
   * Fonction appelée pour voir les détails d'une promotion
   */
  onViewDetails?: (promotionId: string) => void;
  /**
   * Fonction appelée pour éditer une promotion
   */
  onEdit?: (promotionId: string) => void;
  /**
   * Fonction appelée pour supprimer une promotion
   */
  onDelete?: (promotionId: string) => void;
  /**
   * Fonction appelée pour activer une promotion
   */
  onActivate?: (promotionId: string) => void;
  /**
   * Fonction appelée pour désactiver une promotion
   */
  onDeactivate?: (promotionId: string) => void;
  /**
   * Fonction appelée pour créer une nouvelle promotion
   */
  onCreatePromotion?: () => void;
}

/**
 * Composant pour afficher la liste des promotions avec options de filtrage et actions
 */
export const PromotionsList: React.FC<PromotionsListProps> = ({
  promotions,
  pagination,
  isLoading = false,
  className,
  onPageChange,
  onLimitChange,
  onSearch,
  onStatusFilter,
  onDiscountTypeFilter,
  onSort,
  onViewDetails,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  onCreatePromotion,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Fonction pour formater le montant
  const formatAmount = (value: number, currency: string = "EUR") => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
    }).format(value);
  };

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Fonction pour formater la remise
  const formatDiscount = (
    type: "percentage" | "fixed_amount",
    value: number
  ) => {
    if (type === "percentage") {
      return `${value}%`;
    } else {
      return formatAmount(value);
    }
  };

  // Gestionnaire de recherche
  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  // Gestionnaire de touche Entrée pour la recherche
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Vérifier si une promotion est expirée
  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  // Vérifier si une promotion a atteint son nombre maximum d'utilisations
  const isMaxUsageReached = (promotion: Promotion) => {
    return (
      promotion.maxUsageCount !== undefined &&
      promotion.currentUsageCount >= promotion.maxUsageCount
    );
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl">Gestion des promotions</CardTitle>
            <CardDescription>
              Gérez les codes promo et offres spéciales
            </CardDescription>
          </div>
          <Button onClick={onCreatePromotion} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle promotion
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Barre de recherche et filtres */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un code promo..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="shrink-0"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtres
            </Button>
            <Button onClick={handleSearch} className="shrink-0">
              Rechercher
            </Button>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Statut</label>
                <Select
                  onValueChange={(value) =>
                    onStatusFilter?.(
                      value === "all" ? "all" : value === "active"
                    )
                  }
                  defaultValue="all"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actives</SelectItem>
                    <SelectItem value="inactive">Inactives</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type de remise</label>
                <Select
                  onValueChange={(value) =>
                    onDiscountTypeFilter?.(
                      value as "percentage" | "fixed_amount" | "all"
                    )
                  }
                  defaultValue="all"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="percentage">Pourcentage</SelectItem>
                    <SelectItem value="fixed_amount">Montant fixe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Trier par</label>
                <Select
                  onValueChange={(value) => {
                    const [field, direction] = value.split(":");
                    onSort?.(field, direction as "asc" | "desc");
                  }}
                  defaultValue="createdAt:desc"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt:desc">
                      Plus récentes
                    </SelectItem>
                    <SelectItem value="createdAt:asc">
                      Plus anciennes
                    </SelectItem>
                    <SelectItem value="endDate:asc">
                      Date d&apos;expiration (croissant)
                    </SelectItem>
                    <SelectItem value="endDate:desc">
                      Date d&apos;expiration (décroissant)
                    </SelectItem>
                    <SelectItem value="code:asc">Code (A-Z)</SelectItem>
                    <SelectItem value="code:desc">Code (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Tableau des promotions */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Remise</TableHead>
                <TableHead>Validité</TableHead>
                <TableHead>Utilisations</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    Chargement des promotions...
                  </TableCell>
                </TableRow>
              ) : promotions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    Aucune promotion trouvée
                  </TableCell>
                </TableRow>
              ) : (
                promotions.map((promotion) => {
                  const expired = isExpired(promotion.endDate);
                  const maxUsageReached = isMaxUsageReached(promotion);
                  const isActive =
                    promotion.isActive && !expired && !maxUsageReached;

                  return (
                    <TableRow key={promotion.id}>
                      <TableCell className="font-medium">
                        {promotion.code}
                      </TableCell>
                      <TableCell>{promotion.description}</TableCell>
                      <TableCell>
                        {formatDiscount(
                          promotion.discountType,
                          promotion.discountValue
                        )}
                      </TableCell>
                      <TableCell>
                        {formatDate(promotion.startDate)} -{" "}
                        {formatDate(promotion.endDate)}
                        {expired && (
                          <Badge variant="outline" className="ml-2">
                            Expirée
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {promotion.currentUsageCount}
                        {promotion.maxUsageCount
                          ? ` / ${promotion.maxUsageCount}`
                          : " / ∞"}
                        {maxUsageReached && (
                          <Badge variant="outline" className="ml-2">
                            Limite atteinte
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={isActive}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                onActivate?.(promotion.id);
                              } else {
                                onDeactivate?.(promotion.id);
                              }
                            }}
                            disabled={expired || maxUsageReached}
                          />
                          <Label>{isActive ? "Active" : "Inactive"}</Label>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => onViewDetails?.(promotion.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onEdit?.(promotion.id)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {!isActive && !expired && !maxUsageReached && (
                              <DropdownMenuItem
                                onClick={() => onActivate?.(promotion.id)}
                              >
                                <Power className="mr-2 h-4 w-4 text-green-500" />
                                Activer
                              </DropdownMenuItem>
                            )}
                            {isActive && (
                              <DropdownMenuItem
                                onClick={() => onDeactivate?.(promotion.id)}
                              >
                                <PowerOff className="mr-2 h-4 w-4 text-amber-500" />
                                Désactiver
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onDelete?.(promotion.id)}
                              className="text-red-500"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Affichage de{" "}
            <strong>
              {promotions.length > 0
                ? (pagination.page - 1) * pagination.limit + 1
                : 0}
            </strong>{" "}
            à{" "}
            <strong>
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </strong>{" "}
            sur <strong>{pagination.total}</strong> promotions
          </div>
          <div className="flex items-center space-x-6">
            <Select
              value={pagination.limit.toString()}
              onValueChange={(value) => onLimitChange?.(Number(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="10 par page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 par page</SelectItem>
                <SelectItem value="20">20 par page</SelectItem>
                <SelectItem value="50">50 par page</SelectItem>
                <SelectItem value="100">100 par page</SelectItem>
              </SelectContent>
            </Select>

            <Pagination
              currentPage={pagination.page}
              totalPages={Math.ceil(pagination.total / pagination.limit)}
              onPageChange={(page) => {
                if (onPageChange) {
                  onPageChange(page);
                }
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromotionsList;
