import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, ActivityOccurrence, RecurrenceConfig } from "@/types";
import { format, parseISO, isValid, addDays, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";

export interface ActivityCalendarProps {
  /**
   * Activité à afficher
   */
  activity: Activity & {
    recurrence?: RecurrenceConfig;
    occurrences?: ActivityOccurrence[];
  };
  /**
   * Classes CSS additionnelles
   */
  className?: string;
  /**
   * Fonction appelée lorsqu'une occurrence est modifiée
   */
  onOccurrenceEdit?: (occurrence: ActivityOccurrence) => void;
  /**
   * Fonction appelée lorsqu'une nouvelle occurrence est ajoutée
   */
  onOccurrenceAdd?: () => void;
}

/**
 * Composant pour afficher le calendrier des occurrences d'une activité
 */
export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
  activity,
  className,
  onOccurrenceEdit,
  onOccurrenceAdd,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [occurrencesForDate, setOccurrencesForDate] = useState<
    ActivityOccurrence[]
  >([]);

  // Fonction pour générer les occurrences basées sur la récurrence
  const generateOccurrences = (
    activity: ActivityCalendarProps["activity"]
  ): ActivityOccurrence[] => {
    if (!activity.recurrence || activity.recurrence.type === "none") {
      return activity.occurrences || [];
    }

    // Si nous avons déjà des occurrences définies, les utiliser
    if (activity.occurrences && activity.occurrences.length > 0) {
      return activity.occurrences;
    }

    // Sinon, générer des occurrences basées sur la configuration de récurrence
    const occurrences: ActivityOccurrence[] = [];
    const recurrence = activity.recurrence;

    // Date de début
    const startDate = recurrence.startDate
      ? parseISO(recurrence.startDate)
      : new Date();
    if (!isValid(startDate)) return [];

    // Date de fin (si définie)
    const endDate = recurrence.endDate
      ? parseISO(recurrence.endDate)
      : addDays(new Date(), 90); // Par défaut, générer pour 90 jours

    // Nombre d'occurrences à générer
    const maxOccurrences = recurrence.occurrences || 30; // Par défaut, générer 30 occurrences

    let currentDate = startDate;
    let count = 0;

    while (currentDate <= endDate && count < maxOccurrences) {
      // Vérifier si cette date doit être incluse selon le type de récurrence
      let shouldInclude = false;

      switch (recurrence.type) {
        case "daily":
          shouldInclude = true;
          break;
        case "weekly":
          // Vérifier si le jour de la semaine est inclus
          if (
            recurrence.daysOfWeek &&
            recurrence.daysOfWeek.includes(currentDate.getDay())
          ) {
            shouldInclude = true;
          }
          break;
        case "biweekly":
          // Vérifier si le jour de la semaine est inclus et si nous sommes dans la bonne semaine
          if (
            recurrence.daysOfWeek &&
            recurrence.daysOfWeek.includes(currentDate.getDay())
          ) {
            // Logique pour déterminer si nous sommes dans une semaine "active" pour la récurrence bi-hebdomadaire
            const weeksSinceStart = Math.floor(
              (currentDate.getTime() - startDate.getTime()) /
                (7 * 24 * 60 * 60 * 1000)
            );
            shouldInclude = weeksSinceStart % 2 === 0;
          }
          break;
        case "monthly":
          // Si c'est le même jour du mois que la date de début
          shouldInclude = currentDate.getDate() === startDate.getDate();
          break;
        default:
          break;
      }

      // Vérifier les exceptions
      if (shouldInclude && recurrence.exceptions) {
        const isException = recurrence.exceptions.some(
          (exceptionDate: string) => {
            const exception = parseISO(exceptionDate);
            return isValid(exception) && isSameDay(exception, currentDate);
          }
        );

        if (isException) {
          shouldInclude = false;
        }
      }

      // Si cette date doit être incluse, créer une occurrence
      if (shouldInclude) {
        const startDateTime = new Date(currentDate);
        startDateTime.setHours(9, 0, 0); // Par défaut à 9h

        const endDateTime = new Date(currentDate);
        endDateTime.setHours(
          9 + (activity.durationMinutes || 60) / 60,
          (activity.durationMinutes || 60) % 60,
          0
        );

        occurrences.push({
          id: `occ-${activity.id}-${count}`,
          activityId: activity.id,
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
          availableSpots: activity.maxParticipants || 10,
          totalSpots: activity.maxParticipants || 10,
          hasPromotion: false,
          status: "available",
        });

        count++;
      }

      // Passer au jour suivant
      currentDate = addDays(currentDate, 1);
    }

    return occurrences;
  };

  // Mettre à jour les occurrences pour la date sélectionnée
  useEffect(() => {
    if (!selectedDate) return;

    const allOccurrences = generateOccurrences(activity);
    const occurrencesForSelectedDate = allOccurrences.filter((occ) => {
      const occDate = parseISO(occ.startDateTime);
      return isValid(occDate) && isSameDay(occDate, selectedDate);
    });

    setOccurrencesForDate(occurrencesForSelectedDate);
  }, [selectedDate, activity]);

  // Fonction pour formater l'heure
  const formatTime = (dateString: string) => {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "HH:mm", { locale: fr }) : "--:--";
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Calendrier des séances</h3>
          <div className="border rounded-md p-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md"
              // Mettre en évidence les jours avec des occurrences
              modifiers={{
                hasOccurrence: generateOccurrences(activity).map((occ) =>
                  parseISO(occ.startDateTime)
                ),
              }}
              modifiersClassNames={{
                hasOccurrence: "bg-primary/20",
              }}
            />
          </div>

          {activity.recurrence && activity.recurrence.type !== "none" && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <h4 className="font-medium">Configuration de récurrence</h4>
              <div className="text-sm mt-1">
                <p>
                  <span className="font-medium">Type: </span>
                  {activity.recurrence.type === "daily" && "Quotidienne"}
                  {activity.recurrence.type === "weekly" && "Hebdomadaire"}
                  {activity.recurrence.type === "biweekly" && "Bi-hebdomadaire"}
                  {activity.recurrence.type === "monthly" && "Mensuelle"}
                </p>
                {activity.recurrence.startDate && (
                  <p>
                    <span className="font-medium">Début: </span>
                    {format(
                      parseISO(activity.recurrence.startDate),
                      "dd/MM/yyyy",
                      { locale: fr }
                    )}
                  </p>
                )}
                {activity.recurrence.endDate && (
                  <p>
                    <span className="font-medium">Fin: </span>
                    {format(
                      parseISO(activity.recurrence.endDate),
                      "dd/MM/yyyy",
                      { locale: fr }
                    )}
                  </p>
                )}
                {activity.recurrence.occurrences && (
                  <p>
                    <span className="font-medium">Occurrences: </span>
                    {activity.recurrence.occurrences}
                  </p>
                )}
                {activity.recurrence.daysOfWeek &&
                  activity.recurrence.daysOfWeek.length > 0 && (
                    <p>
                      <span className="font-medium">Jours: </span>
                      {activity.recurrence.daysOfWeek
                        .map(
                          (day: number) =>
                            ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"][
                              day
                            ]
                        )
                        .join(", ")}
                    </p>
                  )}
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">
            Séances du{" "}
            {selectedDate
              ? format(selectedDate, "d MMMM yyyy", { locale: fr })
              : "jour sélectionné"}
          </h3>

          {occurrencesForDate.length === 0 ? (
            <Card>
              <CardContent className="p-4">
                <p className="text-muted-foreground">
                  Aucune séance prévue pour cette date.
                </p>
                {onOccurrenceAdd && (
                  <Button
                    onClick={onOccurrenceAdd}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Ajouter une séance exceptionnelle
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {occurrencesForDate.map((occurrence) => (
                <Card key={occurrence.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {formatTime(occurrence.startDateTime)} -{" "}
                          {formatTime(occurrence.endDateTime)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {occurrence.availableSpots} places disponibles sur{" "}
                          {occurrence.totalSpots}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {occurrence.hasPromotion && (
                          <Badge variant="secondary" className="bg-green-100">
                            {occurrence.promotionPercentage
                              ? `-${occurrence.promotionPercentage}%`
                              : "Promo"}
                          </Badge>
                        )}
                        <Badge
                          variant={
                            occurrence.status === "available"
                              ? "outline"
                              : occurrence.status === "full"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {occurrence.status === "available" && "Disponible"}
                          {occurrence.status === "full" && "Complet"}
                          {occurrence.status === "cancelled" && "Annulé"}
                          {occurrence.status === "completed" && "Terminé"}
                        </Badge>
                      </div>
                    </div>
                    {onOccurrenceEdit && (
                      <Button
                        onClick={() => onOccurrenceEdit(occurrence)}
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                      >
                        Modifier
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
              {onOccurrenceAdd && (
                <Button
                  onClick={onOccurrenceAdd}
                  variant="outline"
                  className="w-full"
                >
                  Ajouter une séance exceptionnelle
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendar;
