"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Eye } from "lucide-react";

// Composants UI
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

// Types
import { ReservationNew as Reservation } from "@/mocks/reservationsMocks";

// Types pour les réservations
type ReservationStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "refunded";

type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

// Fonction pour formater le montant
const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

// Fonction pour obtenir la couleur du badge en fonction du statut
const getStatusBadgeVariant = (
  status: ReservationStatus
): "default" | "secondary" | "destructive" | "outline" | "success" => {
  switch (status) {
    case "pending":
      return "secondary";
    case "confirmed":
      return "default";
    case "completed":
      return "success";
    case "cancelled":
    case "refunded":
      return "destructive";
    default:
      return "outline";
  }
};

// Fonction pour traduire le statut
const translateStatus = (status: ReservationStatus): string => {
  switch (status) {
    case "pending":
      return "En attente";
    case "confirmed":
      return "Confirmée";
    case "completed":
      return "Terminée";
    case "cancelled":
      return "Annulée";
    case "refunded":
      return "Remboursée";
    default:
      return status;
  }
};

// Fonction pour traduire le statut de paiement
const translatePaymentStatus = (status: PaymentStatus): string => {
  switch (status) {
    case "pending":
      return "En attente";
    case "paid":
      return "Payé";
    case "refunded":
      return "Remboursé";
    case "failed":
      return "Échoué";
    default:
      return status;
  }
};

// Fonction pour obtenir la couleur du badge en fonction du statut de paiement
const getPaymentStatusBadgeVariant = (
  status: PaymentStatus
): "default" | "secondary" | "destructive" | "outline" | "success" => {
  switch (status) {
    case "pending":
      return "secondary";
    case "paid":
      return "success";
    case "refunded":
      return "destructive";
    case "failed":
      return "destructive";
    default:
      return "outline";
  }
};

export interface ReservationsListProps {
  /** Liste des réservations à afficher */
  reservations: Reservation[];
  /** Fonction appelée lors du clic sur une réservation */
  onViewReservation?: (reservationId: string) => void;
  /** Indique si la liste est en cours de chargement */
  loading?: boolean;
}

/**
 * Composant pour afficher une liste de réservations
 */
export function ReservationsList({
  reservations,
  onViewReservation,
  loading = false,
}: ReservationsListProps) {
  const router = useRouter();

  // Gestionnaire pour voir les détails d'une réservation
  const handleViewReservation = (reservationId: string) => {
    if (onViewReservation) {
      onViewReservation(reservationId);
    } else {
      router.push(`/reservations/${reservationId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Chargement des réservations...</p>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Aucune réservation trouvée</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Prestataire</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Paiement</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell className="font-medium">
                {reservation.id.substring(0, 8)}
              </TableCell>
              <TableCell>
                {reservation.user
                  ? `${reservation.user.firstName} ${reservation.user.lastName}`
                  : "Client inconnu"}
              </TableCell>
              <TableCell>
                {reservation.provider
                  ? reservation.provider.name
                  : "Prestataire inconnu"}
              </TableCell>
              <TableCell>
                {reservation.service
                  ? reservation.service.name
                  : "Service inconnu"}
              </TableCell>
              <TableCell>
                {format(new Date(reservation.date), "dd/MM/yyyy", {
                  locale: fr,
                })}
                <br />
                <span className="text-xs text-muted-foreground">
                  {reservation.startTime} - {reservation.endTime}
                </span>
              </TableCell>
              <TableCell>{formatAmount(reservation.amount)}</TableCell>
              <TableCell>{formatAmount(reservation.commission)}</TableCell>
              <TableCell>
                <Badge
                  variant={getStatusBadgeVariant(
                    reservation.status as ReservationStatus
                  )}
                >
                  {translateStatus(reservation.status as ReservationStatus)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={getPaymentStatusBadgeVariant(
                    reservation.paymentStatus as PaymentStatus
                  )}
                >
                  {translatePaymentStatus(
                    reservation.paymentStatus as PaymentStatus
                  )}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleViewReservation(reservation.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ReservationsList;
