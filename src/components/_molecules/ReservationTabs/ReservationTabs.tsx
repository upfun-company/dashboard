"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ReservationTabValue =
  | "all"
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface ReservationTabsProps {
  /** Valeur de l'onglet actif */
  value: ReservationTabValue;
  /** Fonction appelée lors du changement d'onglet */
  onValueChange: (value: ReservationTabValue) => void;
}

/**
 * Composant pour les onglets de réservations
 */
export function ReservationTabs({
  value,
  onValueChange,
}: ReservationTabsProps) {
  return (
    <Tabs
      defaultValue="all"
      value={value}
      onValueChange={(val) => onValueChange(val as ReservationTabValue)}
      className="mb-6"
    >
      <TabsList className="grid grid-cols-5 w-full">
        <TabsTrigger value="all">Toutes</TabsTrigger>
        <TabsTrigger value="pending">En attente</TabsTrigger>
        <TabsTrigger value="confirmed">Confirmées</TabsTrigger>
        <TabsTrigger value="completed">Terminées</TabsTrigger>
        <TabsTrigger value="cancelled">Annulées</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export default ReservationTabs;
