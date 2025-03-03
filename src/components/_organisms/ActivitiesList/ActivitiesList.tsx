import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Activity, ActivityStatus } from "@/types";
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
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Plus,
} from "lucide-react";

export interface ActivitiesListProps {
  /**
   * Liste des activités à afficher
   */
  activities: Activity[];
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
  onStatusFilter?: (status: ActivityStatus | "all") => void;
  /**
   * Fonction appelée lors du filtrage par catégorie
   */
  onCategoryFilter?: (category: string) => void;
  /**
   * Fonction appelée lors du tri
   */
  onSort?: (field: string, direction: "asc" | "desc") => void;
  /**
   * Fonction appelée pour voir les détails d'une activité
   */
  onViewDetails?: (activityId: string) => void;
  /**
   * Fonction appelée pour éditer une activité
   */
  onEdit?: (activityId: string) => void;
  /**
   * Fonction appelée pour supprimer une activité
   */
  onDelete?: (activityId: string) => void;
  /**
   * Fonction appelée pour approuver une activité
   */
  onApprove?: (activityId: string) => void;
  /**
   * Fonction appelée pour rejeter une activité
   */
  onReject?: (activityId: string) => void;
  /**
   * Fonction appelée pour créer une nouvelle activité
   */
  onCreateActivity?: () => void;
  /**
   * Liste des catégories disponibles pour le filtrage
   */
  availableCategories?: string[];
}

/**
 * Composant pour afficher la liste des activités avec options de filtrage et actions
 */
export const ActivitiesList: React.FC<ActivitiesListProps> = ({
  activities,
  pagination,
  isLoading = false,
  className,
  onPageChange,
  onLimitChange,
  onSearch,
  onStatusFilter,
  onCategoryFilter,
  onSort,
  onViewDetails,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onCreateActivity,
  availableCategories = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Fonction pour formater le prix
  const formatPrice = (price: number, currency: string = "EUR") => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
    }).format(price);
  };

  // Fonction pour obtenir la variante du badge en fonction du statut
  const getStatusBadgeVariant = (
    status: ActivityStatus
  ): "default" | "secondary" | "destructive" | "outline" | "success" => {
    switch (status) {
      case "published":
        return "success";
      case "pending_review":
        return "secondary";
      case "draft":
        return "outline";
      case "rejected":
        return "destructive";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

  // Fonction pour traduire le statut
  const translateStatus = (status: ActivityStatus): string => {
    switch (status) {
      case "published":
        return "Publiée";
      case "pending_review":
        return "En attente";
      case "draft":
        return "Brouillon";
      case "rejected":
        return "Rejetée";
      case "archived":
        return "Archivée";
      default:
        return status;
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

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl">Catalogue des offres</CardTitle>
            <CardDescription>
              Gérez les activités proposées sur la plateforme
            </CardDescription>
          </div>
          <Button onClick={onCreateActivity} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle activité
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
                placeholder="Rechercher une activité..."
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
                    onStatusFilter?.(value as ActivityStatus | "all")
                  }
                  defaultValue="all"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="published">Publiée</SelectItem>
                    <SelectItem value="pending_review">En attente</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="rejected">Rejetée</SelectItem>
                    <SelectItem value="archived">Archivée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie</label>
                <Select
                  onValueChange={(value) => onCategoryFilter?.(value)}
                  defaultValue="all"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
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
                    <SelectItem value="price:asc">Prix croissant</SelectItem>
                    <SelectItem value="price:desc">Prix décroissant</SelectItem>
                    <SelectItem value="title:asc">Titre A-Z</SelectItem>
                    <SelectItem value="title:desc">Titre Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Tableau des activités */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Prestataire</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    Chargement des activités...
                  </TableCell>
                </TableRow>
              ) : activities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    Aucune activité trouvée
                  </TableCell>
                </TableRow>
              ) : (
                activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      {activity.title}
                    </TableCell>
                    <TableCell>{activity.providerId}</TableCell>
                    <TableCell>
                      {activity.categoryIds && activity.categoryIds.length > 0
                        ? activity.categoryIds.join(", ")
                        : "Non catégorisée"}
                    </TableCell>
                    <TableCell>
                      {formatPrice(activity.price, activity.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(activity.status)}>
                        {translateStatus(activity.status)}
                      </Badge>
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
                            onClick={() => onViewDetails?.(activity.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onEdit?.(activity.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {activity.status === "pending_review" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => onApprove?.(activity.id)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                Approuver
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onReject?.(activity.id)}
                              >
                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                Rejeter
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem
                            onClick={() => onDelete?.(activity.id)}
                            className="text-red-500"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Supprimer
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
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Affichage de{" "}
            <strong>
              {activities.length > 0
                ? (pagination.page - 1) * pagination.limit + 1
                : 0}
            </strong>{" "}
            à{" "}
            <strong>
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </strong>{" "}
            sur <strong>{pagination.total}</strong> activités
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

export default ActivitiesList;
