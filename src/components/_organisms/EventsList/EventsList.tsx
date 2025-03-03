"use client";

/**
 * Composant EventsList - Affiche une liste d'événements récents
 */

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import EventCard from "@/components/_molecules/EventCard";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

/**
 * Interface pour un événement
 */
export interface Event {
  /** Identifiant unique de l'événement */
  id: string;
  /** Type d'événement */
  type:
    | "reservation"
    | "user"
    | "provider"
    | "payment"
    | "message"
    | "review"
    | "system";
  /** Titre de l'événement */
  title: string;
  /** Description de l'événement (optionnel) */
  description?: string;
  /** Date de l'événement */
  date: string;
  /** Lien associé à l'événement (optionnel) */
  link?: string;
}

/**
 * Props pour le composant EventsList
 */
interface EventsListProps {
  /** Liste des événements à afficher */
  events: Event[];
  /** Titre de la section */
  title?: string;
  /** Nombre maximum d'événements à afficher */
  maxEvents?: number;
  /** Classes CSS additionnelles */
  className?: string;
  /** Fonction appelée lors du clic sur un événement */
  onEventClick?: (event: Event) => void;
}

/**
 * Composant EventsList - Affiche une liste d'événements récents
 */
const EventsList: React.FC<EventsListProps> = ({
  events,
  title = "Événements récents",
  maxEvents = 5,
  className,
  onEventClick,
}: EventsListProps) => {
  // Limite le nombre d'événements affichés
  const displayedEvents = events.slice(0, maxEvents);

  // Formate la date pour l'affichage
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInDays = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffInDays === 0) {
        return "Aujourd'hui";
      } else if (diffInDays === 1) {
        return "Hier";
      } else if (diffInDays < 7) {
        return format(date, "EEEE", { locale: fr });
      } else {
        return format(date, "d MMMM", { locale: fr });
      }
    } catch {
      return dateString;
    }
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayedEvents.length > 0 ? (
          <>
            {displayedEvents.map((event) => (
              <EventCard
                key={event.id}
                type={event.type}
                title={event.title}
                description={event.description}
                date={formatDate(event.date)}
                onClick={() => onEventClick && onEventClick(event)}
              />
            ))}
            {events.length > maxEvents && (
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={() => onEventClick && onEventClick(events[0])}
              >
                Voir tous les événements ({events.length})
              </Button>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Aucun événement récent
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventsList;
