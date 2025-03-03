"use client";

/**
 * Composant CustomerDetails - Affiche les détails d'un client
 */

import React, { useState } from "react";
import { Customer } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Import des icônes Lucide
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Pencil,
  Trash2,
  Ban,
  FileText,
  Receipt,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";

// Import des composants Shadcn/UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * Type pour une réservation mockée
 */
interface MockReservation {
  id: string;
  date: string;
  createdAt: string;
  activityName: string;
  totalPrice: number;
  status: string;
  participants: number;
  service?: {
    name: string;
  };
  amount: number;
  paymentStatus: string;
  [key: string]: string | number | boolean | { name: string } | undefined;
}

/**
 * Props pour le composant CustomerDetails
 */
interface CustomerDetailsProps {
  /** Le client à afficher */
  customer: Customer;
  /** Fonction appelée lorsque l'utilisateur souhaite revenir à la liste */
  onBack?: () => void;
  /** Fonction appelée lorsque l'utilisateur souhaite éditer le client */
  onEdit?: (customer: Customer) => void;
  /** Fonction appelée lorsque l'utilisateur souhaite supprimer le client */
  onDelete?: (customerId: string) => void;
  /** Fonction appelée lorsque l'utilisateur souhaite bloquer/débloquer le client */
  onToggleStatus?: (customer: Customer, isActive: boolean) => void;
  /** Réservations mockées du client */
  mockReservations: MockReservation[];
  /** Dernière réservation du client */
  lastReservation?: MockReservation;
}

/**
 * Composant CustomerDetails - Affiche les détails d'un client
 */
const CustomerDetails = ({
  customer,
  onBack,
  onEdit,
  onDelete,
  onToggleStatus,
  mockReservations,
  lastReservation,
}: CustomerDetailsProps) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  /**
   * Formater la date
   */
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMMM yyyy", { locale: fr });
    } catch {
      return "Date inconnue";
    }
  };

  /**
   * Formater le montant
   */
  const formatAmount = (amount?: number) => {
    if (amount === undefined) return "N/A";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  /**
   * Obtenir la variante du badge pour le statut de réservation
   */
  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "pending":
        return "outline";
      case "confirmed":
        return "secondary";
      case "completed":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  /**
   * Obtenir le libellé du statut de réservation
   */
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "confirmed":
        return "Confirmée";
      case "completed":
        return "Terminée";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  /**
   * Obtenir la variante du badge pour le statut de paiement
   */
  const getPaymentStatusVariant = (
    status: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "pending":
        return "outline";
      case "paid":
        return "default";
      case "refunded":
        return "destructive";
      default:
        return "outline";
    }
  };

  /**
   * Obtenir le libellé du statut de paiement
   */
  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "paid":
        return "Payé";
      case "refunded":
        return "Remboursé";
      default:
        return status;
    }
  };

  /**
   * Gérer la suppression du client
   */
  const handleDelete = () => {
    setDeleteDialogOpen(false);
    if (onDelete && customer?.id) {
      onDelete(customer.id);
    }
  };

  return (
    <Card className="w-full overflow-hidden">
      <div className="flex justify-between items-center p-6 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <CardTitle>Détails du client</CardTitle>
        </div>
        <div className="flex gap-2 flex-wrap">
          {onToggleStatus && (
            <Button
              variant="outline"
              onClick={() => onToggleStatus(customer, false)}
            >
              <Ban className="h-4 w-4 mr-2" />
              Bloquer
            </Button>
          )}
          {onEdit && (
            <Button variant="outline" onClick={() => onEdit(customer)}>
              <Pencil className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              className="text-destructive border-destructive hover:bg-destructive/10"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          )}
        </div>
      </div>

      <Separator />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-14 w-14 bg-primary text-primary-foreground">
                  {customer.avatarUrl && (
                    <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                  )}
                  <AvatarFallback>
                    {customer?.name ? customer.name.charAt(0) : "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{customer?.name || "Client inconnu"}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Client depuis {formatDate(customer?.createdAt || "")}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        {customer.email}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Téléphone</p>
                      <p className="text-sm text-muted-foreground">
                        {customer.phone || "Non renseigné"}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Adresse</p>
                      <p className="text-sm text-muted-foreground">
                        Non renseignée
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Date d&apos;inscription</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(customer.createdAt)}
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-8">
            <Tabs
              defaultValue="summary"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Résumé</TabsTrigger>
                <TabsTrigger value="reservations">Réservations</TabsTrigger>
                <TabsTrigger value="history">Historique</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-1">
                        Réservations totales
                      </p>
                      <p className="text-3xl font-bold">
                        {customer?.reservationsCount || 0}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-1">
                        Montant total dépensé
                      </p>
                      <p className="text-3xl font-bold">
                        {formatAmount(customer?.totalSpent)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-1">
                        Dernière réservation
                      </p>
                      <p className="text-lg font-medium">
                        {lastReservation
                          ? formatDate(lastReservation.date)
                          : "Jamais"}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">
                    Dernières réservations
                  </h3>
                  <div className="space-y-4">
                    {mockReservations.slice(0, 3).map((reservation) => (
                      <div
                        key={reservation.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-medium">
                              {reservation.activityName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(reservation.date)} -{" "}
                              {formatAmount(reservation.totalPrice)}
                            </p>
                          </div>
                        </div>
                        <Badge variant={getStatusVariant(reservation.status)}>
                          {getStatusLabel(reservation.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reservations" className="pt-6">
                <div className="space-y-4">
                  {mockReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-medium">
                            {reservation.activityName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Réservation #{reservation.id}
                          </p>
                          <p className="text-sm mt-2">
                            Date: {formatDate(reservation.date)}
                          </p>
                          <p className="text-sm">
                            Participants: {reservation.participants}
                          </p>
                        </div>
                        <div className="flex flex-col items-end justify-center sm:justify-end gap-2">
                          <p className="text-xl font-bold">
                            {formatAmount(reservation.totalPrice)}
                          </p>
                          <div className="flex gap-2">
                            <Badge
                              variant={getPaymentStatusVariant(
                                reservation.paymentStatus || "pending"
                              )}
                            >
                              {getPaymentStatusLabel(
                                reservation.paymentStatus || "pending"
                              )}
                            </Badge>
                            <Badge
                              variant={getStatusVariant(reservation.status)}
                            >
                              {getStatusLabel(reservation.status)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="history" className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 border-b">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Création du compte</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(customer?.createdAt || "")}
                      </p>
                    </div>
                  </div>

                  {mockReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="flex items-start gap-3 p-4 border-b"
                    >
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">
                          Réservation de {reservation.activityName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(reservation.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-start gap-3 p-4 border-b">
                    <Receipt className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Paiement effectué</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(
                          new Date(
                            Date.now() -
                              Math.floor(
                                Math.random() * 30 * 24 * 60 * 60 * 1000
                              )
                          ).toISOString()
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 border-b">
                    <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Message de support envoyé</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(
                          new Date(
                            Date.now() -
                              Math.floor(
                                Math.random() * 15 * 24 * 60 * 60 * 1000
                              )
                          ).toISOString()
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le client{" "}
              {customer?.name || "sélectionné"} ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CustomerDetails;
