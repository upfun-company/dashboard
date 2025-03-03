import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AlertsList, {
  Alert as AlertListItem,
} from "@/components/_organisms/AlertsList";
import EventsList, {
  Event as EventListItem,
} from "@/components/_organisms/EventsList";
import { Alert, Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

export interface ActivitySummaryProps {
  /**
   * Liste des alertes à afficher
   */
  alerts: Alert[];

  /**
   * Liste des événements à afficher
   */
  events: Event[];

  /**
   * Titre du composant
   */
  title?: string;

  /**
   * Onglet actif par défaut
   */
  defaultTab?: "alerts" | "events";

  /**
   * Classes CSS additionnelles
   */
  className?: string;

  /**
   * Fonction appelée lors du clic sur une alerte
   */
  onAlertClick?: (alert: Alert) => void;

  /**
   * Fonction appelée lors du clic sur un événement
   */
  onEventClick?: (event: Event) => void;
}

/**
 * Composant affichant un résumé des activités récentes (alertes et événements)
 */
const ActivitySummary: React.FC<ActivitySummaryProps> = ({
  alerts,
  events,
  title = "Activités récentes",
  defaultTab = "alerts",
  className,
  onAlertClick,
  onEventClick,
}) => {
  // État pour afficher/masquer les filtres
  const [showFilters, setShowFilters] = useState(false);

  // Conversion des alertes au format attendu par AlertsList
  const formattedAlerts: AlertListItem[] = alerts.map((alert) => {
    // Déterminer le type d'alerte en fonction du message ou du titre
    let alertType: "reservation" | "provider" | "payment" | "system" = "system";

    const title = alert.title ? alert.title.toLowerCase() : "";
    const message = alert.message ? alert.message.toLowerCase() : "";

    if (title.includes("réservation") || message.includes("réservation")) {
      alertType = "reservation";
    } else if (
      title.includes("prestataire") ||
      message.includes("prestataire")
    ) {
      alertType = "provider";
    } else if (title.includes("paiement") || message.includes("paiement")) {
      alertType = "payment";
    }

    return {
      id: alert.id,
      type: alertType,
      message: alert.message,
      severity: alert.type as "info" | "warning" | "error" | "success",
      date: alert.createdAt,
      link: undefined,
    };
  });

  // Conversion des événements au format attendu par EventsList
  const formattedEvents: EventListItem[] = events.map((event) => ({
    id: event.id,
    type:
      event.type === "reservation" ||
      event.type === "user" ||
      event.type === "provider" ||
      event.type === "payment" ||
      event.type === "message" ||
      event.type === "review" ||
      event.type === "system"
        ? (event.type as
            | "reservation"
            | "user"
            | "provider"
            | "payment"
            | "message"
            | "review"
            | "system")
        : "system",
    title: event.title,
    description: event.description,
    date: event.date,
    link: undefined,
  }));

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{title}</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? (
            <X className="h-4 w-4 mr-1" />
          ) : (
            <Filter className="h-4 w-4 mr-1" />
          )}
          {showFilters ? "Masquer filtres" : "Filtres"}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="alerts">
              Alertes
              {alerts.filter((alert) => !alert.isRead).length > 0 && (
                <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {alerts.filter((alert) => !alert.isRead).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="events">Événements</TabsTrigger>
          </TabsList>
          <TabsContent value="alerts">
            <AlertsList
              alerts={formattedAlerts}
              maxAlerts={5}
              onAlertClick={(alertFromList) => {
                // Retrouver l'alerte originale correspondante
                const originalAlert = alerts.find(
                  (a) => a.id === alertFromList.id
                );
                if (originalAlert && onAlertClick) {
                  onAlertClick(originalAlert);
                }
              }}
              className="border-none shadow-none"
              showFilters={showFilters}
            />
          </TabsContent>
          <TabsContent value="events">
            <EventsList
              events={formattedEvents}
              maxEvents={5}
              onEventClick={(eventFromList) => {
                // Retrouver l'événement original correspondant
                const originalEvent = events.find(
                  (e) => e.id === eventFromList.id
                );
                if (originalEvent && onEventClick) {
                  onEventClick(originalEvent);
                }
              }}
              className="border-none shadow-none"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ActivitySummary;
