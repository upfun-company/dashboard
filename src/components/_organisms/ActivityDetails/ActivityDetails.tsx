import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Activity, ActivityStatus, ActivityOccurrence } from "@/types";
import ActivityCalendar from "@/components/_organisms/ActivityCalendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  XCircle,
  Edit,
  Trash,
  ArrowLeft,
  Clock,
  Users,
  MapPin,
  Tag,
  DollarSign,
  Star,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

export interface ActivityDetailsProps {
  /**
   * Activité à afficher
   */
  activity: Activity;
  /**
   * Classes CSS additionnelles
   */
  className?: string;
  /**
   * Fonction appelée pour retourner à la liste
   */
  onBack?: () => void;
  /**
   * Fonction appelée pour éditer l'activité
   */
  onEdit?: (activityId: string) => void;
  /**
   * Fonction appelée pour supprimer l'activité
   */
  onDelete?: (activityId: string) => void;
  /**
   * Fonction appelée pour approuver l'activité
   */
  onApprove?: (activityId: string) => void;
  /**
   * Fonction appelée pour rejeter l'activité
   */
  onReject?: (activityId: string, reason: string) => void;
}

/**
 * Composant pour afficher les détails d'une activité avec options de modération
 */
export const ActivityDetails: React.FC<ActivityDetailsProps> = ({
  activity,
  className,
  onBack,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Fonction pour formater le prix
  const formatPrice = (price: number, currency: string = "EUR") => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
    }).format(price);
  };

  // Fonction pour obtenir la variante du badge en fonction du statut
  const getStatusBadgeVariant = (
    status: ActivityStatus
  ): "default" | "secondary" | "destructive" | "outline" | "success" => {
    switch (status) {
      case "draft":
        return "outline";
      case "pending_review":
        return "secondary";
      case "published":
        return "success";
      case "rejected":
        return "destructive";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

  // Fonction pour traduire le statut en français
  const translateStatus = (status: ActivityStatus): string => {
    switch (status) {
      case "draft":
        return "Brouillon";
      case "pending_review":
        return "En attente";
      case "published":
        return "Publié";
      case "rejected":
        return "Rejeté";
      case "archived":
        return "Archivé";
      default:
        return status;
    }
  };

  // Gestionnaire pour la modification d'une occurrence
  const handleOccurrenceEdit = (occurrence: ActivityOccurrence) => {
    console.log("Modification de l'occurrence:", occurrence);
    // Ici, vous pourriez ouvrir une boîte de dialogue pour modifier l'occurrence
  };

  // Gestionnaire pour l'ajout d'une occurrence
  const handleOccurrenceAdd = () => {
    console.log(
      "Ajout d'une nouvelle occurrence pour l'activité:",
      activity.id
    );
    // Ici, vous pourriez ouvrir une boîte de dialogue pour ajouter une occurrence
  };

  // Gestionnaire pour le rejet d'une activité
  const handleReject = () => {
    if (onReject && rejectionReason.trim()) {
      onReject(activity.id, rejectionReason);
      setIsRejectDialogOpen(false);
      setRejectionReason("");
    }
  };

  // Gestionnaire pour la suppression d'une activité
  const handleDelete = () => {
    if (onDelete) {
      onDelete(activity.id);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-2xl">{activity.title}</CardTitle>
          <CardDescription>
            {activity.providerName && (
              <span className="font-medium">Par {activity.providerName}</span>
            )}
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={getStatusBadgeVariant(activity.status)}>
            {translateStatus(activity.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="calendar">Calendrier</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Description</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.shortDescription || activity.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Description complète</h3>
                  <ScrollArea className="h-[200px] rounded-md border p-4 mt-1">
                    <div className="text-sm text-muted-foreground">
                      {activity.fullDescription || activity.description}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium flex items-center gap-1">
                      <DollarSign className="h-4 w-4" /> Prix
                    </h3>
                    <p className="text-lg font-semibold">
                      {formatPrice(activity.price, activity.currency)}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium flex items-center gap-1">
                      <Clock className="h-4 w-4" /> Durée
                    </h3>
                    <p className="text-lg font-semibold">
                      {activity.durationMinutes
                        ? `${activity.durationMinutes} min`
                        : "Non spécifiée"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium flex items-center gap-1">
                      <Users className="h-4 w-4" /> Participants
                    </h3>
                    <p className="text-lg font-semibold">
                      {activity.minParticipants && activity.maxParticipants
                        ? `${activity.minParticipants} - ${activity.maxParticipants}`
                        : activity.maxParticipants
                        ? `Max ${activity.maxParticipants}`
                        : "Non spécifié"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium flex items-center gap-1">
                      <Star className="h-4 w-4" /> Note
                    </h3>
                    <p className="text-lg font-semibold">
                      {activity.averageRating
                        ? `${activity.averageRating}/5`
                        : "Aucune note"}
                      {activity.reviewCount ? ` (${activity.reviewCount})` : ""}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> Lieu
                  </h3>
                  <p className="text-sm mt-1">
                    {typeof activity.location === "string"
                      ? activity.location
                      : `${activity.location.address}, ${activity.location.postalCode} ${activity.location.city}, ${activity.location.country}`}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium flex items-center gap-1">
                    <Tag className="h-4 w-4" /> Catégorie
                  </h3>
                  <p className="text-sm mt-1">{activity.category}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <ActivityCalendar
              activity={activity}
              onOccurrenceEdit={handleOccurrenceEdit}
              onOccurrenceAdd={handleOccurrenceAdd}
            />
          </TabsContent>

          <TabsContent value="images" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                    {activity.images && activity.images.length > 0 ? (
                      <Image
                        src={activity.images[0].url}
                        alt={activity.images[0].alt || activity.title}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted">
                        <p className="text-muted-foreground">
                          Aucune image disponible
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Réservations
                    </h3>
                    <p className="text-3xl font-bold mt-2">
                      {activity.bookingCount || 0}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Avis
                    </h3>
                    <p className="text-3xl font-bold mt-2">
                      {activity.reviewCount || 0}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Note moyenne
                    </h3>
                    <p className="text-3xl font-bold mt-2">
                      {activity.averageRating || 0}/5
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">
                Statistiques avancées
              </h3>
              <p className="text-sm text-muted-foreground">
                Les statistiques avancées seront disponibles prochainement.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
        <div className="flex space-x-2">
          {activity.status === "pending_review" && onApprove && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-green-600"
              onClick={() => onApprove(activity.id)}
            >
              <CheckCircle className="h-4 w-4" /> Approuver
            </Button>
          )}
          {activity.status === "pending_review" && onReject && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-red-600"
              onClick={() => setIsRejectDialogOpen(true)}
            >
              <XCircle className="h-4 w-4" /> Rejeter
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => onEdit(activity.id)}
            >
              <Edit className="h-4 w-4" /> Modifier
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-red-600"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash className="h-4 w-4" /> Supprimer
            </Button>
          )}
        </div>
      </CardFooter>

      {/* Dialogue de rejet */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter l&apos;activité</DialogTitle>
            <DialogDescription>
              Veuillez indiquer la raison du rejet de cette activité.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Raison du rejet..."
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              Rejeter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l&apos;activité</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette activité ? Cette action
              est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
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

export default ActivityDetails;
