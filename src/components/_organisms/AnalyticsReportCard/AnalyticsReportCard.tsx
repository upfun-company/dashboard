"use client";

/**
 * Composant AnalyticsReportCard - Carte de rapport analytique avec options de filtrage et d'exportation
 */

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Download,
  Share2,
  FileText,
  Image as ImageIcon,
  FileJson,
  RefreshCw,
  Calendar,
  ChevronDown,
  Info,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Type pour les formats d'exportation
 */
export type ExportFormat = "pdf" | "csv" | "excel" | "image" | "json";

/**
 * Props pour le composant AnalyticsReportCard
 */
export interface AnalyticsReportCardProps {
  /** Titre du rapport */
  title: string;
  /** Description du rapport */
  description?: string;
  /** Date de dernière mise à jour */
  lastUpdated?: string;
  /** Période du rapport */
  period?: string;
  /** Filtres appliqués */
  filters?: Array<{
    name: string;
    value: string;
  }>;
  /** Formats d'exportation disponibles */
  exportFormats?: ExportFormat[];
  /** Fonction appelée lors de l'exportation */
  onExport?: (format: ExportFormat) => void;
  /** Fonction appelée lors du partage */
  onShare?: () => void;
  /** Fonction appelée lors du rafraîchissement */
  onRefresh?: () => void;
  /** Fonction appelée lors du clic sur le bouton de filtrage */
  onFilterClick?: () => void;
  /** Indique si le rapport est en cours de chargement */
  isLoading?: boolean;
  /** Classes CSS additionnelles */
  className?: string;
  /** Contenu du rapport */
  children: React.ReactNode;
}

/**
 * Composant AnalyticsReportCard - Carte de rapport analytique avec options de filtrage et d'exportation
 */
const AnalyticsReportCard: React.FC<AnalyticsReportCardProps> = ({
  title,
  description,
  lastUpdated,
  period,
  filters = [],
  exportFormats = ["pdf", "csv", "excel", "image", "json"],
  onExport,
  onShare,
  onRefresh,
  onFilterClick,
  isLoading = false,
  className,
  children,
}) => {
  // Obtenir l'icône correspondant au format d'exportation
  const getExportIcon = (format: ExportFormat) => {
    switch (format) {
      case "pdf":
        return <FileText className="mr-2 h-4 w-4" />;
      case "csv":
      case "excel":
        return <FileText className="mr-2 h-4 w-4" />;
      case "image":
        return <ImageIcon className="mr-2 h-4 w-4" />;
      case "json":
        return <FileJson className="mr-2 h-4 w-4" />;
      default:
        return <Download className="mr-2 h-4 w-4" />;
    }
  };

  // Obtenir le libellé correspondant au format d'exportation
  const getExportLabel = (format: ExportFormat) => {
    switch (format) {
      case "pdf":
        return "Exporter en PDF";
      case "csv":
        return "Exporter en CSV";
      case "excel":
        return "Exporter en Excel";
      case "image":
        return "Exporter en image";
      case "json":
        return "Exporter en JSON";
      default:
        return "Exporter";
    }
  };

  // Formater la date de dernière mise à jour
  const formattedLastUpdated = lastUpdated
    ? format(new Date(lastUpdated), "d MMMM yyyy, HH:mm", { locale: fr })
    : undefined;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
            <div className="flex flex-wrap gap-2 mt-2">
              {period && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {period}
                </Badge>
              )}
              {filters.map((filter, index) => (
                <Badge key={index} variant="outline">
                  {filter.name}: {filter.value}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            {onRefresh && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={onRefresh}
                      disabled={isLoading}
                    >
                      <RefreshCw
                        className={cn("h-4 w-4", isLoading && "animate-spin")}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Rafraîchir</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {onShare && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={onShare}
                      disabled={isLoading}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Partager</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {onExport && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-1"
                    disabled={isLoading}
                  >
                    <Download className="h-4 w-4" />
                    Exporter
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {exportFormats.map((format) => (
                    <DropdownMenuItem
                      key={format}
                      onClick={() => onExport(format)}
                    >
                      {getExportIcon(format)}
                      {getExportLabel(format)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {(formattedLastUpdated || onFilterClick) && (
        <CardFooter className="flex justify-between border-t px-6 py-3">
          {formattedLastUpdated && (
            <div className="flex items-center text-xs text-muted-foreground">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-1 cursor-help">
                    <Info className="h-3 w-3" />
                    Dernière mise à jour: {formattedLastUpdated}
                  </TooltipTrigger>
                  <TooltipContent>
                    Les données ont été mises à jour le {formattedLastUpdated}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          {onFilterClick && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-xs"
              onClick={onFilterClick}
            >
              Modifier les filtres
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default AnalyticsReportCard;
