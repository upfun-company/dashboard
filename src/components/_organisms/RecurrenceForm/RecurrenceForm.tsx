"use client";

/**
 * Composant RecurrenceForm - Formulaire pour configurer la récurrence d'une activité
 */

import React, { useState, useEffect, useCallback } from "react";
import { addDays, format, parseISO, isValid, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

// Modifier la définition des types pour inclure "yearly"
export type RecurrenceType =
  | "none"
  | "daily"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "yearly";

export interface RecurrenceConfig {
  type: RecurrenceType;
  startDate: string;
  endDate?: string;
  daysOfWeek?: number[];
  occurrences?: number;
  exceptions?: string[];
  interval?: number;
  startTime?: string;
  endTime?: string;
  monthlyType?: "dayOfMonth" | "dayOfWeek";
  monthlyDay?: number;
  monthlyWeek?: number;
  monthlyWeekday?: number;
  modifiedOccurrences?: Array<{
    originalDate: string;
    newStartDateTime?: string;
    newEndDateTime?: string;
    isCancelled?: boolean;
    reason?: string;
  }>;
}

export interface ActivityOccurrence {
  id: string;
  activityId?: string;
  startDateTime?: string;
  endDateTime?: string;
  availableSpots?: number;
  totalSpots?: number;
  hasPromotion?: boolean;
  promotionPercentage?: number;
  status?: "available" | "full" | "cancelled" | "completed";
  isException?: boolean;
  exceptionReason?: string;
  // Propriétés utilisées dans le composant
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  isAvailable: boolean;
}

/**
 * Props pour le composant RecurrenceForm
 */
export interface RecurrenceFormProps {
  /**
   * Configuration de récurrence initiale
   */
  initialConfig?: RecurrenceConfig;
  /**
   * Durée de l'activité en minutes
   */
  activityDuration: number;
  /**
   * Capacité maximale de l'activité
   */
  maxCapacity: number;
  /**
   * Fonction appelée lorsque la configuration est mise à jour
   */
  onChange: (
    config: RecurrenceConfig,
    occurrences: ActivityOccurrence[]
  ) => void;
  /**
   * ID de l'activité (pour générer des IDs uniques pour les occurrences)
   */
  activityId: string;
}

/**
 * Composant RecurrenceForm - Formulaire pour configurer la récurrence d'une activité
 */
export const RecurrenceForm: React.FC<RecurrenceFormProps> = ({
  initialConfig,
  maxCapacity,
  onChange,
  activityId,
}) => {
  // État pour la configuration de récurrence
  const [config, setConfig] = useState<RecurrenceConfig>(
    initialConfig || {
      type: "none",
      startDate: new Date().toISOString().split("T")[0],
      startTime: "09:00",
      endTime: "10:00",
    }
  );

  // État pour les occurrences générées
  const [generatedOccurrences, setGeneratedOccurrences] = useState<
    ActivityOccurrence[]
  >([]);

  // État pour les jours de la semaine (pour les récurrences hebdomadaires)
  const [selectedDays, setSelectedDays] = useState<number[]>(
    config.daysOfWeek || [1] // Lundi par défaut
  );

  // État pour le type de fin de récurrence
  const [endType, setEndType] = useState<"never" | "date" | "occurrences">(
    config.endDate ? "date" : config.occurrences ? "occurrences" : "never"
  );

  // État pour la date de fin (si endType === "date")
  const [endDate, setEndDate] = useState<Date | undefined>(
    config.endDate ? parseISO(config.endDate) : undefined
  );

  // État pour le nombre d'occurrences (si endType === "occurrences")
  const [occurrencesCount, setOccurrencesCount] = useState<number>(
    config.occurrences || 10
  );

  // État pour la date d'exception à ajouter
  const [exceptionDate, setExceptionDate] = useState<Date | undefined>(
    undefined
  );

  // État pour les exceptions (dates à exclure)
  const [exceptions, setExceptions] = useState<string[]>(
    config.exceptions || []
  );

  // Options pour les heures
  const hourOptions = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  // Jours de la semaine
  const weekdays = [
    { value: 1, label: "Lundi" },
    { value: 2, label: "Mardi" },
    { value: 3, label: "Mercredi" },
    { value: 4, label: "Jeudi" },
    { value: 5, label: "Vendredi" },
    { value: 6, label: "Samedi" },
    { value: 0, label: "Dimanche" },
  ];

  // Générer les occurrences en fonction de la configuration
  const generateOccurrences = useCallback(
    (config: RecurrenceConfig): ActivityOccurrence[] => {
      if (config.type === "none") {
        return [];
      }

      const occurrences: ActivityOccurrence[] = [];
      const startDate = parseISO(config.startDate);
      const endDateObj = config.endDate ? parseISO(config.endDate) : null;
      const maxOccurrences = config.occurrences || 100; // Limiter à 100 occurrences par défaut
      const interval = config.interval || 1;

      let currentDate = startDate;
      let count = 0;

      // Fonction pour vérifier si une date est une exception
      const isException = (date: Date) => {
        return exceptions.some((exceptionDate) => {
          const exception = parseISO(exceptionDate);
          return isSameDay(date, exception);
        });
      };

      // Générer les occurrences en fonction du type de récurrence
      while (
        count < maxOccurrences &&
        (!endDateObj || currentDate <= endDateObj)
      ) {
        let shouldAdd = false;

        switch (config.type) {
          case "daily":
            shouldAdd = true;
            break;
          case "weekly":
            // Vérifier si le jour de la semaine est sélectionné
            shouldAdd =
              config.daysOfWeek?.includes(currentDate.getDay()) || false;
            break;
          case "monthly":
            // Même jour du mois
            shouldAdd = currentDate.getDate() === startDate.getDate();
            break;
          case "yearly":
            // Même jour et même mois
            shouldAdd =
              currentDate.getDate() === startDate.getDate() &&
              currentDate.getMonth() === startDate.getMonth();
            break;
        }

        // Ajouter l'occurrence si ce n'est pas une exception
        if (shouldAdd && !isException(currentDate)) {
          const occurrence: ActivityOccurrence = {
            id: `${activityId}-${format(currentDate, "yyyyMMdd")}-${
              config.startTime
            }`,
            date: format(currentDate, "yyyy-MM-dd"),
            startTime: config.startTime || "",
            endTime: config.endTime || "",
            capacity: maxCapacity,
            isAvailable: true,
          };

          // Vérifier si cette occurrence a été modifiée
          const modifiedOccurrence = config.modifiedOccurrences?.find(
            (mod) => mod.originalDate === occurrence.date
          );

          if (modifiedOccurrence) {
            // Appliquer les modifications
            if (modifiedOccurrence.newStartDateTime) {
              occurrence.startTime = modifiedOccurrence.newStartDateTime
                .split("T")[1]
                .substring(0, 5);
            }
            if (modifiedOccurrence.newEndDateTime) {
              occurrence.endTime = modifiedOccurrence.newEndDateTime
                .split("T")[1]
                .substring(0, 5);
            }
            occurrence.isAvailable = !modifiedOccurrence.isCancelled;
          }

          occurrences.push(occurrence);
          count++;
        }

        // Avancer à la prochaine date en fonction du type de récurrence
        switch (config.type) {
          case "daily":
            currentDate = addDays(currentDate, interval);
            break;
          case "weekly":
            // Si tous les jours de la semaine sont sélectionnés, avancer d'une semaine
            if (
              config.daysOfWeek?.length === 7 ||
              currentDate.getDay() === 6 // Dimanche
            ) {
              currentDate = addDays(
                currentDate,
                interval * 7 - (currentDate.getDay() === 6 ? 6 : 0)
              );
            } else {
              // Sinon, avancer d'un jour
              currentDate = addDays(currentDate, 1);
            }
            break;
          case "monthly":
            // Avancer d'un mois
            const nextMonth = new Date(currentDate);
            nextMonth.setMonth(nextMonth.getMonth() + interval);
            // Ajuster le jour si nécessaire (ex: 31 janvier -> 28/29 février)
            if (nextMonth.getDate() !== startDate.getDate()) {
              nextMonth.setDate(0); // Dernier jour du mois précédent
            }
            currentDate = nextMonth;
            break;
          case "yearly":
            // Avancer d'un an
            const nextYear = new Date(currentDate);
            nextYear.setFullYear(nextYear.getFullYear() + interval);
            currentDate = nextYear;
            break;
          default:
            currentDate = addDays(currentDate, 1);
        }
      }

      return occurrences;
    },
    [activityId, exceptions, maxCapacity]
  );

  // Mettre à jour les occurrences lorsque la configuration change
  useEffect(() => {
    const newOccurrences = generateOccurrences(config);
    setGeneratedOccurrences(newOccurrences);
    onChange(config, newOccurrences);
  }, [config, onChange, generateOccurrences]);

  // Mettre à jour la configuration
  const updateConfig = (updates: Partial<RecurrenceConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
  };

  // Gérer le changement de type de récurrence
  const handleRecurrenceTypeChange = (value: string) => {
    if (value === "weekly" && !config.daysOfWeek) {
      updateConfig({
        type: value as RecurrenceConfig["type"],
        daysOfWeek: [1], // Lundi par défaut
        interval: 1,
      });
    } else {
      updateConfig({ type: value as RecurrenceConfig["type"], interval: 1 });
    }
  };

  // Gérer le changement d'heure de début
  const handleStartTimeChange = (value: string) => {
    updateConfig({ startTime: value });
  };

  // Gérer le changement d'heure de fin
  const handleEndTimeChange = (value: string) => {
    updateConfig({ endTime: value });
  };

  // Gérer le changement de date de début
  const handleStartDateChange = (date: Date | undefined) => {
    if (date && isValid(date)) {
      updateConfig({ startDate: format(date, "yyyy-MM-dd") });
    }
  };

  // Gérer le changement de type de fin
  const handleEndTypeChange = (value: string) => {
    const newEndType = value as "never" | "date" | "occurrences";
    setEndType(newEndType);

    // Mettre à jour la configuration en fonction du type de fin
    if (newEndType === "never") {
      // Utiliser la syntaxe de déstructuration avec underscore pour ignorer les propriétés
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { endDate: _endDate, occurrences: _occurrences, ...rest } = config;
      setConfig(rest);
      onChange(rest, generatedOccurrences);
    } else if (newEndType === "date" && endDate) {
      updateConfig({
        endDate: format(endDate, "yyyy-MM-dd"),
        occurrences: undefined,
      });
    } else if (newEndType === "occurrences") {
      updateConfig({
        endDate: undefined,
        occurrences: occurrencesCount,
      });
    }
  };

  // Gérer le changement de date de fin
  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    if (date && isValid(date)) {
      updateConfig({
        endDate: format(date, "yyyy-MM-dd"),
        occurrences: undefined,
      });
    }
  };

  // Gérer le changement du nombre d'occurrences
  const handleOccurrencesCountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setOccurrencesCount(value);
      updateConfig({
        occurrences: value,
        endDate: undefined,
      });
    }
  };

  // Gérer le changement d'intervalle
  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      updateConfig({ interval: value });
    }
  };

  // Gérer le changement de jour de la semaine
  const handleDayChange = (day: number) => {
    const newSelectedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];

    // S'assurer qu'au moins un jour est sélectionné
    if (newSelectedDays.length > 0) {
      setSelectedDays(newSelectedDays);
      updateConfig({ daysOfWeek: newSelectedDays });
    }
  };

  // Ajouter une exception
  const handleAddException = () => {
    if (exceptionDate && isValid(exceptionDate)) {
      const formattedDate = format(exceptionDate, "yyyy-MM-dd");
      if (!exceptions.includes(formattedDate)) {
        const newExceptions = [...exceptions, formattedDate];
        setExceptions(newExceptions);
        updateConfig({ exceptions: newExceptions });
        setExceptionDate(undefined);
      }
    }
  };

  // Supprimer une exception
  const handleRemoveException = (date: string) => {
    const newExceptions = exceptions.filter((d) => d !== date);
    setExceptions(newExceptions);
    updateConfig({ exceptions: newExceptions });
  };

  // Formater l'heure pour l'affichage
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}h${minutes}`;
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "dd MMMM yyyy", { locale: fr });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recurrence-type">Type de récurrence</Label>
            <Select
              value={config.type}
              onValueChange={handleRecurrenceTypeChange}
            >
              <SelectTrigger id="recurrence-type">
                <SelectValue placeholder="Sélectionner un type de récurrence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Pas de récurrence</SelectItem>
                <SelectItem value="daily">Quotidienne</SelectItem>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="monthly">Mensuelle</SelectItem>
                <SelectItem value="yearly">Annuelle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {config.type &&
            (config.type === "daily" ||
              config.type === "weekly" ||
              config.type === "biweekly" ||
              config.type === "monthly" ||
              config.type === "yearly") && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="start-date">Date de début</Label>
                  <div className="border rounded-md p-2">
                    <Calendar
                      mode="single"
                      selected={parseISO(config.startDate)}
                      onSelect={handleStartDateChange}
                      locale={fr}
                      className="rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Heure de début</Label>
                    <Select
                      value={
                        config.startTime ? config.startTime.split(":")[0] : "09"
                      }
                      onValueChange={(value) =>
                        handleStartTimeChange(`${value}:00`)
                      }
                    >
                      <SelectTrigger id="start-time">
                        <SelectValue placeholder="Heure de début" />
                      </SelectTrigger>
                      <SelectContent>
                        {hourOptions.map((hour) => (
                          <SelectItem key={hour} value={hour}>
                            {hour}h00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end-time">Heure de fin</Label>
                    <Select
                      value={
                        config.endTime ? config.endTime.split(":")[0] : "10"
                      }
                      onValueChange={(value) =>
                        handleEndTimeChange(`${value}:00`)
                      }
                    >
                      <SelectTrigger id="end-time">
                        <SelectValue placeholder="Heure de fin" />
                      </SelectTrigger>
                      <SelectContent>
                        {hourOptions.map((hour) => (
                          <SelectItem key={hour} value={hour}>
                            {hour}h00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {config.type &&
                  ["daily", "weekly", "biweekly", "monthly", "yearly"].includes(
                    config.type
                  ) && (
                    <div className="space-y-2">
                      <Label htmlFor="interval">
                        Intervalle (
                        {config.type === "daily"
                          ? "jours"
                          : config.type === "weekly"
                          ? "semaines"
                          : config.type === "monthly"
                          ? "mois"
                          : "années"}
                        )
                      </Label>
                      <Input
                        id="interval"
                        type="number"
                        min="1"
                        value={config.interval || 1}
                        onChange={handleIntervalChange}
                      />
                    </div>
                  )}

                {config.type === "weekly" && (
                  <div className="space-y-2">
                    <Label>Jours de la semaine</Label>
                    <div className="flex flex-wrap gap-2">
                      {weekdays.map((day) => (
                        <Badge
                          key={day.value}
                          variant={
                            selectedDays.includes(day.value)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => handleDayChange(day.value)}
                        >
                          {day.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="end-type">Fin de la récurrence</Label>
                  <Select value={endType} onValueChange={handleEndTypeChange}>
                    <SelectTrigger id="end-type">
                      <SelectValue placeholder="Sélectionner une fin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Jamais</SelectItem>
                      <SelectItem value="date">
                        À une date spécifique
                      </SelectItem>
                      <SelectItem value="occurrences">
                        Après un nombre d&apos;occurrences
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {endType === "date" && (
                  <div className="space-y-2">
                    <Label htmlFor="end-date">Date de fin</Label>
                    <div className="border rounded-md p-2">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={handleEndDateChange}
                        locale={fr}
                        className="rounded-md"
                        disabled={(date) => date < parseISO(config.startDate)}
                      />
                    </div>
                  </div>
                )}

                {endType === "occurrences" && (
                  <div className="space-y-2">
                    <Label htmlFor="occurrences-count">
                      Nombre d&apos;occurrences
                    </Label>
                    <Input
                      id="occurrences-count"
                      type="number"
                      min="1"
                      value={occurrencesCount}
                      onChange={handleOccurrencesCountChange}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Exceptions</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="border rounded-md p-2">
                        <Calendar
                          mode="single"
                          selected={exceptionDate}
                          onSelect={setExceptionDate}
                          locale={fr}
                          className="rounded-md"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleAddException}
                      disabled={!exceptionDate}
                      className="self-start"
                    >
                      Ajouter
                    </Button>
                  </div>

                  {exceptions.length > 0 && (
                    <div className="mt-2">
                      <Label>Dates exclues</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {exceptions.map((date) => (
                          <Badge
                            key={date}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {formatDate(date)}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0"
                              onClick={() => handleRemoveException(date)}
                            >
                              ×
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Aperçu des occurrences</h3>
          <Card>
            <CardContent className="p-0">
              {generatedOccurrences.length > 0 ? (
                <div className="overflow-auto max-h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Horaire</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {generatedOccurrences.map((occurrence) => (
                        <TableRow key={occurrence.id}>
                          <TableCell>{formatDate(occurrence.date)}</TableCell>
                          <TableCell>
                            {formatTime(occurrence.startTime)} -{" "}
                            {formatTime(occurrence.endTime)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  Aucune occurrence générée
                </div>
              )}
            </CardContent>
          </Card>

          {generatedOccurrences.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {generatedOccurrences.length} occurrence
              {generatedOccurrences.length > 1 ? "s" : ""} générée
              {generatedOccurrences.length > 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecurrenceForm;
