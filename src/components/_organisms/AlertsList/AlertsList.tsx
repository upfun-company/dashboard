/**
 * Composant AlertsList - Affiche une liste d'alertes du dashboard
 */

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AlertCard from "@/components/_molecules/AlertCard";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

/**
 * Interface pour une alerte
 */
export interface Alert {
  /** Identifiant unique de l'alerte */
  id: string;
  /** Type d'alerte */
  type: "reservation" | "provider" | "payment" | "system";
  /** Message de l'alerte */
  message: string;
  /** Niveau de sévérité */
  severity: "info" | "warning" | "error" | "success";
  /** Date de l'alerte */
  date: string;
  /** Lien associé à l'alerte (optionnel) */
  link?: string;
}

/**
 * Props pour le composant AlertsList
 */
interface AlertsListProps {
  /** Liste des alertes à afficher */
  alerts: Alert[];
  /** Titre de la section */
  title?: string;
  /** Nombre maximum d'alertes à afficher */
  maxAlerts?: number;
  /** Classes CSS additionnelles */
  className?: string;
  /** Fonction appelée lors du clic sur une alerte */
  onAlertClick?: (alert: Alert) => void;
  /** Afficher les filtres */
  showFilters?: boolean;
}

/**
 * Composant AlertsList - Affiche une liste d'alertes du dashboard
 */
const AlertsList = ({
  alerts,
  title = "Alertes administratives",
  maxAlerts = 5,
  className,
  onAlertClick,
  showFilters = false,
}: AlertsListProps) => {
  // État pour le filtre de sévérité
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);
  // État pour le filtre de type
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  // État pour afficher/masquer les filtres
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  // État pour afficher toutes les alertes
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  // Filtre les alertes en fonction des critères sélectionnés
  const filteredAlerts = alerts.filter((alert) => {
    if (severityFilter && alert.severity !== severityFilter) return false;
    if (typeFilter && alert.type !== typeFilter) return false;
    return true;
  });

  // Limite le nombre d'alertes affichées, sauf si showAllAlerts est true
  const displayedAlerts = showAllAlerts
    ? filteredAlerts
    : filteredAlerts.slice(0, maxAlerts);

  // Fonction pour afficher toutes les alertes
  const handleShowAllAlerts = () => {
    setShowAllAlerts(true);
  };

  // Formate la date pour l'affichage
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "d MMM, HH:mm", { locale: fr });
    } catch (error: unknown) {
      console.error("Erreur lors du formatage de la date:", error);
      return dateString;
    }
  };

  // Détermine le type d'alerte en fonction du type et de la sévérité
  const getAlertType = (
    alert: Alert
  ): "info" | "warning" | "error" | "success" => {
    // Utiliser directement la sévérité de l'alerte
    return alert.severity;
  };

  // Génère un titre pour l'alerte en fonction de son type
  const getAlertTitle = (alert: Alert): string => {
    switch (alert.type) {
      case "reservation":
        return "Réservation";
      case "provider":
        return "Prestataire";
      case "payment":
        return "Paiement";
      case "system":
        return "Système";
      default:
        return "Information";
    }
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{title}</CardTitle>
        {showFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilterOptions(!showFilterOptions)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filtres
          </Button>
        )}
      </CardHeader>
      {showFilters && showFilterOptions && (
        <div className="px-6 pb-2 flex flex-wrap gap-2">
          <div className="space-y-1">
            <p className="text-xs font-medium">Sévérité</p>
            <div className="flex flex-wrap gap-1">
              <Badge
                variant={severityFilter === null ? "secondary" : "outline"}
                className="cursor-pointer"
                onClick={() => setSeverityFilter(null)}
              >
                Tous
              </Badge>
              <Badge
                variant={severityFilter === "info" ? "secondary" : "outline"}
                className="cursor-pointer"
                onClick={() => setSeverityFilter("info")}
              >
                Info
              </Badge>
              <Badge
                variant={severityFilter === "warning" ? "secondary" : "outline"}
                className="cursor-pointer"
                onClick={() => setSeverityFilter("warning")}
              >
                Avertissement
              </Badge>
              <Badge
                variant={severityFilter === "error" ? "secondary" : "outline"}
                className="cursor-pointer"
                onClick={() => setSeverityFilter("error")}
              >
                Erreur
              </Badge>
              <Badge
                variant={severityFilter === "success" ? "secondary" : "outline"}
                className="cursor-pointer"
                onClick={() => setSeverityFilter("success")}
              >
                Succès
              </Badge>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium">Type</p>
            <div className="flex flex-wrap gap-1">
              <Badge
                variant={typeFilter === null ? "secondary" : "outline"}
                className="cursor-pointer"
                onClick={() => setTypeFilter(null)}
              >
                Tous
              </Badge>
              <Badge
                variant={typeFilter === "reservation" ? "secondary" : "outline"}
                className="cursor-pointer"
                onClick={() => setTypeFilter("reservation")}
              >
                Réservation
              </Badge>
              <Badge
                variant={typeFilter === "provider" ? "secondary" : "outline"}
                className="cursor-pointer"
                onClick={() => setTypeFilter("provider")}
              >
                Prestataire
              </Badge>
              <Badge
                variant={typeFilter === "payment" ? "secondary" : "outline"}
                className="cursor-pointer"
                onClick={() => setTypeFilter("payment")}
              >
                Paiement
              </Badge>
              <Badge
                variant={typeFilter === "system" ? "secondary" : "outline"}
                className="cursor-pointer"
                onClick={() => setTypeFilter("system")}
              >
                Système
              </Badge>
            </div>
          </div>
        </div>
      )}
      <CardContent>
        <div className="space-y-4">
          {displayedAlerts.length > 0 ? (
            displayedAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                type={getAlertType(alert)}
                title={getAlertTitle(alert)}
                message={alert.message}
                date={formatDate(alert.date)}
                onClick={() => onAlertClick && onAlertClick(alert)}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Aucune alerte à afficher
            </p>
          )}
          {!showAllAlerts && filteredAlerts.length > maxAlerts && (
            <div className="text-center pt-2">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-accent px-3 py-1.5"
                onClick={handleShowAllAlerts}
              >
                +{filteredAlerts.length - maxAlerts} autres alertes
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsList;
