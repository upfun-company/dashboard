"use client";

/**
 * Composant ProviderDetails - Affiche les détails d'un prestataire
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProviderExtended } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Import des icônes Lucide
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Tag,
  Star,
  CheckCircle,
  XCircle,
  FileText,
  Edit,
  Trash2,
  Clock,
  ExternalLink,
} from "lucide-react";

// Import des composants Shadcn/UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/**
 * Props pour le composant ProviderDetails
 */
interface ProviderDetailsProps {
  /** Le prestataire à afficher */
  provider: ProviderExtended;
  /** Fonction appelée pour revenir à la liste */
  onBack?: () => void;
  /** Fonction appelée pour éditer le prestataire */
  onEdit?: (provider: ProviderExtended) => void;
  /** Fonction appelée pour supprimer le prestataire */
  onDelete?: (providerId: string) => void;
  /** Fonction appelée pour approuver le prestataire */
  onApprove?: (provider: ProviderExtended) => void;
  /** Fonction appelée pour rejeter le prestataire */
  onReject?: (provider: ProviderExtended) => void;
  /** Fonction appelée pour voir les documents du prestataire */
  onViewDocuments?: (provider: ProviderExtended) => void;
}

/**
 * Composant ProviderDetails - Affiche les détails d'un prestataire
 */
const ProviderDetails = ({
  provider,
  onBack,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onViewDocuments,
}: ProviderDetailsProps) => {
  // État local pour l'onglet actif
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();

  /**
   * Formater la date
   */
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
    } catch {
      return "Date invalide";
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
      maximumFractionDigits: 0,
    }).format(amount);
  };

  /**
   * Obtenir la couleur du badge de statut
   */
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  /**
   * Traduire le statut en français
   */
  const translateStatus = (status: string) => {
    switch (status) {
      case "approved":
        return "Approuvé";
      case "pending":
        return "En attente";
      case "rejected":
        return "Rejeté";
      default:
        return status;
    }
  };

  /**
   * Générer les initiales à partir du nom
   */
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Fonction pour voir les documents du prestataire
  const handleViewDocuments = () => {
    if (onViewDocuments) {
      onViewDocuments(provider);
    }
    // Redirection vers la page des documents du prestataire
    router.push(`/prestataires/${provider.id}/documents`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-2xl font-bold">Détails du prestataire</h1>
        </div>

        <div className="flex gap-2">
          {provider.status === "pending" && onApprove && (
            <Button
              variant="outline"
              className="gap-2 text-emerald-600"
              onClick={() => onApprove(provider)}
            >
              <CheckCircle className="h-4 w-4" />
              Approuver
            </Button>
          )}

          {provider.status === "pending" && onReject && (
            <Button
              variant="outline"
              className="gap-2 text-rose-600"
              onClick={() => onReject(provider)}
            >
              <XCircle className="h-4 w-4" />
              Rejeter
            </Button>
          )}

          {onViewDocuments && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleViewDocuments}
            >
              <FileText className="h-4 w-4" />
              Documents
            </Button>
          )}

          {onEdit && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => onEdit(provider)}
            >
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
          )}

          {onDelete && (
            <Button
              variant="destructive"
              className="gap-2"
              onClick={() => onDelete(provider.id)}
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-background shadow-md">
                    {provider.avatarUrl ? (
                      <Image
                        src={provider.avatarUrl}
                        alt={`Avatar de ${provider.name}`}
                        width={128}
                        height={128}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <span className="text-3xl font-bold text-muted-foreground">
                          {provider.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div
                      className={cn(
                        "absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-background",
                        provider.isActive ? "bg-green-500" : "bg-red-500"
                      )}
                    ></div>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{provider.name}</h2>
                  <Badge
                    variant={getStatusBadgeVariant(provider.status)}
                    className="mt-2"
                  >
                    {translateStatus(provider.status)}
                  </Badge>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm">{provider.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Téléphone</div>
                    <div className="text-sm">
                      {provider.phone || "Non renseigné"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Localisation</div>
                    <div className="text-sm">{provider.location}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Tag className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Catégorie</div>
                    <div className="text-sm">{provider.category}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">
                      Date d&apos;inscription
                    </div>
                    <div className="text-sm">
                      {formatDate(provider.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Star className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Note moyenne</div>
                    <div className="text-sm flex items-center">
                      {provider.rating ? (
                        <>
                          <span className="font-medium">
                            {provider.rating.toFixed(1)}
                          </span>
                          <span className="text-yellow-500 ml-1">★</span>
                          <span className="text-muted-foreground ml-1">
                            ({provider.reviewsCount || 0} avis)
                          </span>
                        </>
                      ) : (
                        "Aucun avis"
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {provider.website && (
                <>
                  <Separator className="my-4" />
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => window.open(provider.website, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visiter le site web
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle>Tableau de bord</CardTitle>
                <TabsList>
                  <TabsTrigger value="overview">Aperçu</TabsTrigger>
                  <TabsTrigger value="activities">Activités</TabsTrigger>
                  <TabsTrigger value="reservations">Réservations</TabsTrigger>
                  <TabsTrigger value="reviews">Avis</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Réservations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {provider.reservationsCount || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {provider.reservationsLastMonth || 0} le mois dernier
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Chiffre d&apos;affaires
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatAmount(provider.revenue)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatAmount(provider.revenueLastMonth)} le mois
                        dernier
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Commission
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatAmount(provider.commission)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {provider.commissionRate || 15}% du CA
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Taux de conversion
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {provider.conversionRate || 0}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {provider.viewsCount || 0} vues totales
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Répartition des avis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {provider.reviewsDistribution ? (
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count =
                            provider.reviewsDistribution?.[rating] || 0;
                          const percentage =
                            provider.reviewsCount && provider.reviewsCount > 0
                              ? Math.round(
                                  (count / provider.reviewsCount) * 100
                                )
                              : 0;
                          return (
                            <div
                              key={rating}
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center w-10">
                                <span>{rating}</span>
                                <Star className="h-3 w-3 text-yellow-500 ml-1" />
                              </div>
                              <Progress value={percentage} className="h-2" />
                              <div className="w-10 text-right text-xs text-muted-foreground">
                                {percentage}%
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        Aucun avis disponible
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Activités récentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {provider.recentActivities &&
                    provider.recentActivities.length > 0 ? (
                      <div className="space-y-4">
                        {provider.recentActivities.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 text-sm"
                          >
                            <div className="rounded-full bg-muted p-1">
                              <Clock className="h-3 w-3" />
                            </div>
                            <div>
                              <p>{activity.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(activity.date)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        Aucune activité récente
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activities" className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Activités proposées
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {provider.activities && provider.activities.length > 0 ? (
                      <div className="space-y-4">
                        {provider.activities.map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-3 border rounded-lg"
                          >
                            <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
                              <Image
                                src={activity.imageUrl || "/placeholder.png"}
                                alt={activity.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover rounded-md"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{activity.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {activity.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <Badge variant="outline">
                                  {formatAmount(activity.price)}
                                </Badge>
                                <div className="text-xs text-muted-foreground">
                                  {activity.duration} min
                                </div>
                                <div className="text-xs flex items-center">
                                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                  {activity.rating?.toFixed(1) || "N/A"}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        Aucune activité proposée
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reservations" className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Dernières réservations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {provider.reservations &&
                    provider.reservations.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Activité</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">
                              Montant
                            </TableHead>
                            <TableHead className="text-center">
                              Statut
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {provider.reservations.map((reservation, index) => (
                            <TableRow key={index}>
                              <TableCell>{reservation.customerName}</TableCell>
                              <TableCell>{reservation.activityTitle}</TableCell>
                              <TableCell>
                                {formatDate(reservation.date)}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatAmount(reservation.amount)}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  variant={
                                    reservation.status === "completed"
                                      ? "success"
                                      : reservation.status === "cancelled"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                >
                                  {reservation.status === "completed"
                                    ? "Terminée"
                                    : reservation.status === "cancelled"
                                    ? "Annulée"
                                    : reservation.status === "pending"
                                    ? "En attente"
                                    : reservation.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        Aucune réservation
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Derniers avis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {provider.reviews && provider.reviews.length > 0 ? (
                      <div className="space-y-4">
                        {provider.reviews.map((review, index) => (
                          <div
                            key={index}
                            className="p-4 border rounded-lg space-y-2"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {getInitials(review.customerName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {review.customerName}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatDate(review.date)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm">{review.comment}</p>
                            {review.activityTitle && (
                              <div className="text-xs text-muted-foreground">
                                Activité : {review.activityTitle}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        Aucun avis
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ProviderDetails;
