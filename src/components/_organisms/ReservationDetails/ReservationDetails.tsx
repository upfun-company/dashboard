"use client";

import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Composants UI
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Icônes
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CreditCard,
  FileText,
  MessageSquare,
  CheckCircle,
  XCircle,
  Printer,
  Download,
} from "lucide-react";

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

// Props pour le composant ReservationDetails
interface ReservationDetailsProps {
  /** Réservation à afficher */
  reservation: Reservation;
  /** Fonction appelée lors de l'annulation d'une réservation */
  onCancel?: (reservationId: string, reason: string) => void;
  /** Fonction appelée lors du remboursement d'une réservation */
  onRefund?: (reservationId: string, amount: number, reason: string) => void;
  /** Fonction appelée lors de la confirmation d'une réservation */
  onConfirm?: (reservationId: string) => void;
  /** Fonction appelée lors de la complétion d'une réservation */
  onComplete?: (reservationId: string) => void;
  /** Fonction appelée lors de l'envoi d'un message */
  onSendMessage?: (reservationId: string, message: string) => void;
  /** Fonction appelée lors du téléchargement de la facture */
  onDownloadInvoice?: (reservationId: string) => void;
  /** Fonction appelée lors de l'impression de la facture */
  onPrintInvoice?: (reservationId: string) => void;
}

/**
 * Composant pour afficher les détails d'une réservation
 */
export function ReservationDetails({
  reservation,
  onCancel,
  onRefund,
  onConfirm,
  onComplete,
  onSendMessage,
  onDownloadInvoice,
  onPrintInvoice,
}: ReservationDetailsProps) {
  const [cancelReason, setCancelReason] = React.useState("");
  const [refundAmount, setRefundAmount] = React.useState(reservation.amount);
  const [refundReason, setRefundReason] = React.useState("");
  const [message, setMessage] = React.useState("");

  // Formatage de la date et de l'heure
  const formattedDate = format(new Date(reservation.date), "EEEE d MMMM yyyy", {
    locale: fr,
  });
  const formattedTime = `${reservation.startTime} - ${reservation.endTime}`;
  const formattedDuration = `${reservation.service?.duration || 60} minutes`;

  // Calcul du montant total et de la commission
  const totalAmount = formatAmount(reservation.amount);
  const commissionAmount = formatAmount(reservation.commission);
  const netAmount = formatAmount(reservation.amount - reservation.commission);

  // Gestion de l'annulation
  const handleCancel = () => {
    if (onCancel && cancelReason.trim()) {
      onCancel(reservation.id, cancelReason);
    }
  };

  // Gestion du remboursement
  const handleRefund = () => {
    if (onRefund && refundReason.trim() && refundAmount > 0) {
      onRefund(reservation.id, refundAmount, refundReason);
    }
  };

  // Gestion de l'envoi de message
  const handleSendMessage = () => {
    if (onSendMessage && message.trim()) {
      onSendMessage(reservation.id, message);
      setMessage("");
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec les informations principales */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Réservation #{reservation.id.substring(0, 8)}
          </h1>
          <p className="text-muted-foreground">
            Créée le{" "}
            {format(new Date(reservation.date), "dd/MM/yyyy à HH:mm", {
              locale: fr,
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={getStatusBadgeVariant(
              reservation.status as ReservationStatus
            )}
            className="text-sm"
          >
            {translateStatus(reservation.status as ReservationStatus)}
          </Badge>
          <Badge
            variant={getPaymentStatusBadgeVariant(
              reservation.paymentStatus as PaymentStatus
            )}
            className="text-sm"
          >
            {translatePaymentStatus(reservation.paymentStatus as PaymentStatus)}
          </Badge>
        </div>
      </div>

      {/* Actions principales */}
      <div className="flex flex-wrap gap-2">
        {/* Bouton d'annulation */}
        {reservation.status === "pending" ||
        reservation.status === "confirmed" ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                <XCircle className="mr-2 h-4 w-4" />
                Annuler
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Annuler la réservation</DialogTitle>
                <DialogDescription>
                  Veuillez indiquer la raison de l&apos;annulation. Cette
                  information sera communiquée au client et au prestataire.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="cancel-reason">
                  Raison de l&apos;annulation
                </Label>
                <Textarea
                  id="cancel-reason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Veuillez indiquer la raison de l'annulation..."
                  className="mt-2"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={!cancelReason.trim()}
                >
                  Confirmer l&apos;annulation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : null}

        {/* Bouton de remboursement */}
        {(reservation.status === "cancelled" ||
          reservation.status === "completed") &&
        reservation.paymentStatus === "paid" ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                <CreditCard className="mr-2 h-4 w-4" />
                Rembourser
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Rembourser la réservation</DialogTitle>
                <DialogDescription>
                  Veuillez indiquer le montant et la raison du remboursement.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div>
                  <Label htmlFor="refund-amount">Montant à rembourser</Label>
                  <Input
                    id="refund-amount"
                    type="number"
                    value={refundAmount}
                    onChange={(e) =>
                      setRefundAmount(parseFloat(e.target.value))
                    }
                    min={0}
                    max={reservation.amount}
                    step={0.01}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Montant maximum: {totalAmount}
                  </p>
                </div>
                <div>
                  <Label htmlFor="refund-reason">Raison du remboursement</Label>
                  <Textarea
                    id="refund-reason"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="Veuillez indiquer la raison du remboursement..."
                    className="mt-2"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={handleRefund}
                  disabled={!refundReason.trim() || refundAmount <= 0}
                >
                  Confirmer le remboursement
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : null}

        {/* Bouton de confirmation */}
        {reservation.status === "pending" ? (
          <Button
            variant="default"
            onClick={() => onConfirm && onConfirm(reservation.id)}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Confirmer
          </Button>
        ) : null}

        {/* Bouton de complétion */}
        {reservation.status === "confirmed" ? (
          <Button
            variant="default"
            onClick={() => onComplete && onComplete(reservation.id)}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Marquer comme terminée
          </Button>
        ) : null}

        {/* Boutons pour la facture */}
        <Button
          variant="outline"
          onClick={() => onDownloadInvoice && onDownloadInvoice(reservation.id)}
        >
          <Download className="mr-2 h-4 w-4" />
          Télécharger la facture
        </Button>
        <Button
          variant="outline"
          onClick={() => onPrintInvoice && onPrintInvoice(reservation.id)}
        >
          <Printer className="mr-2 h-4 w-4" />
          Imprimer la facture
        </Button>
      </div>

      {/* Contenu principal */}
      <Tabs defaultValue="details">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="payment">Paiement</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        {/* Onglet Détails */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations sur la réservation */}
            <Card>
              <CardHeader>
                <CardTitle>Informations sur la réservation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-muted-foreground">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Heure</p>
                    <p className="text-muted-foreground">{formattedTime}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Durée</p>
                    <p className="text-muted-foreground">{formattedDuration}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Participants</p>
                    <p className="text-muted-foreground">
                      {reservation.service?.maxParticipants || 1} personne(s)
                    </p>
                  </div>
                </div>
                {reservation.service?.description && (
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Notes</p>
                      <p className="text-muted-foreground">
                        {reservation.service.description}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations sur le service */}
            <Card>
              <CardHeader>
                <CardTitle>Service réservé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reservation.service ? (
                  <>
                    <p className="font-medium text-lg">
                      {reservation.service.name}
                    </p>
                    <p className="text-muted-foreground">
                      {reservation.service.description}
                    </p>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Lieu</p>
                        <p className="text-muted-foreground">
                          {reservation.service?.type === "provider"
                            ? "Chez le prestataire"
                            : reservation.service?.type === "client"
                            ? "Chez le client"
                            : reservation.service?.type === "online"
                            ? "En ligne"
                            : "Lieu spécifique"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Prix</p>
                        <p className="text-muted-foreground">
                          {formatAmount(reservation.service.price)}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    Informations sur le service non disponibles
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Informations sur le client */}
            <Card>
              <CardHeader>
                <CardTitle>Client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reservation.user ? (
                  <>
                    <div className="flex items-center">
                      <div
                        className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3"
                        style={{
                          backgroundImage: reservation.user.avatar
                            ? `url(${reservation.user.avatar})`
                            : "none",
                          backgroundSize: "cover",
                        }}
                      >
                        {!reservation.user.avatar && (
                          <span className="text-muted-foreground">
                            {reservation.user.firstName.charAt(0)}
                            {reservation.user.lastName.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {reservation.user.firstName}{" "}
                          {reservation.user.lastName}
                        </p>
                        <p className="text-muted-foreground">
                          {reservation.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div>
                        <p className="font-medium">Téléphone</p>
                        <p className="text-muted-foreground">
                          {reservation.user.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div>
                        <p className="font-medium">Réservations</p>
                        <p className="text-muted-foreground">
                          {reservation.user.reservationsCount} réservation(s)
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    Informations sur le client non disponibles
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Informations sur le prestataire */}
            <Card>
              <CardHeader>
                <CardTitle>Prestataire</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reservation.provider ? (
                  <>
                    <div className="flex items-center">
                      <div
                        className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3"
                        style={{
                          backgroundImage: reservation.provider?.avatarUrl
                            ? `url(${reservation.provider.avatarUrl})`
                            : "none",
                          backgroundSize: "cover",
                        }}
                      >
                        {!reservation.provider?.avatarUrl && (
                          <span className="text-muted-foreground">
                            {reservation.provider?.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {reservation.provider?.name}
                        </p>
                        <p className="text-muted-foreground">
                          {reservation.provider?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div>
                        <p className="font-medium">Contact</p>
                        <p className="text-muted-foreground">
                          {reservation.provider?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div>
                        <p className="font-medium">Téléphone</p>
                        <p className="text-muted-foreground">
                          {reservation.provider?.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div>
                        <p className="font-medium">Catégorie</p>
                        <p className="text-muted-foreground">
                          {reservation.provider?.category}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    Informations sur le prestataire non disponibles
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Historique des modifications */}
          <Card>
            <CardHeader>
              <CardTitle>Historique</CardTitle>
              <CardDescription>
                Historique des modifications de la réservation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-2 mr-2"></div>
                  <div className="flex-1">
                    <p className="font-medium">Réservation créée</p>
                    <p className="text-muted-foreground">
                      {format(
                        new Date(reservation.date),
                        "dd/MM/yyyy à HH:mm",
                        { locale: fr }
                      )}
                    </p>
                  </div>
                </div>
                {reservation.status === "cancelled" && (
                  <div className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-red-500 mt-2 mr-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">Réservation annulée</p>
                      <p className="text-muted-foreground">
                        {format(
                          new Date(reservation.date),
                          "dd/MM/yyyy à HH:mm",
                          { locale: fr }
                        )}
                      </p>
                      {reservation.cancellationReason && (
                        <p className="text-muted-foreground mt-1">
                          Raison: {reservation.cancellationReason}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {reservation.status === "refunded" && (
                  <div className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-red-500 mt-2 mr-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">Réservation remboursée</p>
                      <p className="text-muted-foreground">
                        {format(
                          new Date(reservation.date),
                          "dd/MM/yyyy à HH:mm",
                          { locale: fr }
                        )}
                      </p>
                      {reservation.refundAmount && (
                        <p className="text-muted-foreground mt-1">
                          Montant: {formatAmount(reservation.refundAmount)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Paiement */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Détails du paiement</CardTitle>
              <CardDescription>
                Informations sur le paiement de la réservation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Statut</TableCell>
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
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Méthode</TableCell>
                    <TableCell>
                      {reservation.paymentMethod === "card"
                        ? "Carte bancaire"
                        : reservation.paymentMethod === "paypal"
                        ? "PayPal"
                        : reservation.paymentMethod === "apple_pay"
                        ? "Apple Pay"
                        : reservation.paymentMethod === "google_pay"
                        ? "Google Pay"
                        : "Virement bancaire"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Date</TableCell>
                    <TableCell>
                      {format(
                        new Date(reservation.date),
                        "dd/MM/yyyy à HH:mm",
                        { locale: fr }
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Montant total</TableCell>
                    <TableCell>{totalAmount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Commission</TableCell>
                    <TableCell>{commissionAmount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Montant net (prestataire)
                    </TableCell>
                    <TableCell>{netAmount}</TableCell>
                  </TableRow>
                  {reservation.refundAmount && (
                    <TableRow>
                      <TableCell className="font-medium">
                        Montant remboursé
                      </TableCell>
                      <TableCell>
                        {formatAmount(reservation.refundAmount)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Communication */}
        <TabsContent value="communication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Envoyer un message</CardTitle>
              <CardDescription>
                Envoyer un message au client et au prestataire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Votre message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Envoyer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historique des messages</CardTitle>
              <CardDescription>
                Historique des communications liées à cette réservation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <p className="mt-2 text-muted-foreground">
                  Aucun message pour cette réservation
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ReservationDetails;
