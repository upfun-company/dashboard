import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Promotion } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  ArrowLeft,
  Edit,
  Trash,
  Power,
  PowerOff,
  BarChart3,
  Calendar,
  Tag,
  Users,
  Percent,
  CreditCard,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export interface PromotionDetailsProps {
  /**
   * Promotion à afficher
   */
  promotion: Promotion;
  /**
   * Statistiques d'utilisation de la promotion
   */
  usageStats?: {
    totalRevenue: number;
    totalDiscountAmount: number;
    usageByDay: Array<{
      date: string;
      count: number;
      discountAmount: number;
    }>;
    usageByUser?: Array<{
      userId: string;
      userName: string;
      usageCount: number;
      lastUsed: string;
    }>;
  };
  /**
   * Classes CSS additionnelles
   */
  className?: string;
  /**
   * Fonction appelée pour revenir à la liste
   */
  onBack?: () => void;
  /**
   * Fonction appelée pour éditer la promotion
   */
  onEdit?: () => void;
  /**
   * Fonction appelée pour supprimer la promotion
   */
  onDelete?: () => void;
  /**
   * Fonction appelée pour activer la promotion
   */
  onActivate?: () => void;
  /**
   * Fonction appelée pour désactiver la promotion
   */
  onDeactivate?: () => void;
}

/**
 * Composant pour afficher les détails d'une promotion avec options de gestion
 */
export const PromotionDetails: React.FC<PromotionDetailsProps> = ({
  promotion,
  usageStats,
  className,
  onBack,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Fonction pour formater le montant
  const formatAmount = (value: number, currency: string = "EUR") => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
    }).format(value);
  };

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Vérifier si une promotion est expirée
  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  // Vérifier si une promotion a atteint son nombre maximum d'utilisations
  const isMaxUsageReached = (promotion: Promotion) => {
    return (
      promotion.maxUsageCount !== undefined &&
      promotion.currentUsageCount >= promotion.maxUsageCount
    );
  };

  const expired = isExpired(promotion.endDate);
  const maxUsageReached = isMaxUsageReached(promotion);
  const isActive = promotion.isActive && !expired && !maxUsageReached;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-2xl">
                Promotion: {promotion.code}
              </CardTitle>
              <CardDescription>{promotion.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isActive ? (
              <Badge variant="success">Active</Badge>
            ) : (
              <Badge variant="secondary">Inactive</Badge>
            )}
            {expired && <Badge variant="outline">Expirée</Badge>}
            {maxUsageReached && (
              <Badge variant="outline">
                Limite d&apos;utilisation atteinte
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs
          defaultValue="details"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="statistics">Statistiques</TabsTrigger>
          </TabsList>

          {/* Onglet Détails */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations générales */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informations générales</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Tag className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Code</p>
                      <p className="text-sm text-muted-foreground">
                        {promotion.code}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Période de validité</p>
                      <p className="text-sm text-muted-foreground">
                        Du {formatDate(promotion.startDate)} au{" "}
                        {formatDate(promotion.endDate)}
                      </p>
                    </div>
                  </div>

                  {promotion.discountType === "percentage" ? (
                    <div className="flex items-start gap-2">
                      <Percent className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Remise en pourcentage</p>
                        <p className="text-sm text-muted-foreground">
                          {promotion.discountValue}%
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <CreditCard className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Remise en montant fixe</p>
                        <p className="text-sm text-muted-foreground">
                          {formatAmount(promotion.discountValue)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <Users className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Utilisations</p>
                      <p className="text-sm text-muted-foreground">
                        {promotion.currentUsageCount} utilisations
                        {promotion.maxUsageCount
                          ? ` sur ${promotion.maxUsageCount} maximum`
                          : " (illimité)"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conditions et restrictions */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Conditions et restrictions
                </h3>
                <div className="space-y-2">
                  {promotion.minOrderAmount && (
                    <div className="flex items-start gap-2">
                      <CreditCard className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          Montant minimum de commande
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatAmount(promotion.minOrderAmount)}
                        </p>
                      </div>
                    </div>
                  )}

                  {promotion.applicableActivities && (
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Applicable aux activités</p>
                        <p className="text-sm text-muted-foreground">
                          {promotion.applicableActivities.length === 0
                            ? "Toutes les activités"
                            : `${promotion.applicableActivities.length} activité(s) spécifique(s)`}
                        </p>
                      </div>
                    </div>
                  )}

                  {promotion.excludedActivities && (
                    <div className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Activités exclues</p>
                        <p className="text-sm text-muted-foreground">
                          {promotion.excludedActivities.length === 0
                            ? "Aucune exclusion"
                            : `${promotion.excludedActivities.length} activité(s) exclue(s)`}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <Users className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Restriction par utilisateur</p>
                      <p className="text-sm text-muted-foreground">
                        {promotion.maxUsagePerUser
                          ? `${promotion.maxUsagePerUser} utilisation(s) maximum par utilisateur`
                          : "Pas de limite par utilisateur"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description complète */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Description complète</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {promotion.description || "Aucune description détaillée"}
              </p>
            </div>

            {/* Statut actuel */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Statut actuel</h3>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isActive}
                  disabled={expired || maxUsageReached}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onActivate?.();
                    } else {
                      onDeactivate?.();
                    }
                  }}
                />
                <Label>
                  {isActive ? "Promotion active" : "Promotion inactive"}
                </Label>
              </div>
              {expired && (
                <p className="text-sm text-amber-500">
                  Cette promotion est expirée depuis le{" "}
                  {formatDate(promotion.endDate)}.
                </p>
              )}
              {maxUsageReached && (
                <p className="text-sm text-amber-500">
                  Cette promotion a atteint son nombre maximum
                  d&apos;utilisations.
                </p>
              )}
            </div>
          </TabsContent>

          {/* Onglet Statistiques */}
          <TabsContent value="statistics" className="space-y-6">
            {usageStats ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Utilisations totales
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {promotion.currentUsageCount}
                        {promotion.maxUsageCount
                          ? ` / ${promotion.maxUsageCount}`
                          : ""}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {promotion.maxUsageCount
                          ? `${Math.round(
                              (promotion.currentUsageCount /
                                promotion.maxUsageCount) *
                                100
                            )}% du maximum`
                          : "Pas de limite définie"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Montant total des remises
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatAmount(usageStats.totalDiscountAmount)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Sur {formatAmount(usageStats.totalRevenue)} de CA généré
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Remise moyenne
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatAmount(
                          usageStats.totalDiscountAmount /
                            (promotion.currentUsageCount || 1)
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Par utilisation
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Graphique d'utilisation par jour - à implémenter avec une bibliothèque de graphiques */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Utilisation par jour</h3>
                  <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Graphique d&apos;utilisation (à implémenter)
                    </span>
                  </div>
                </div>

                {/* Utilisateurs ayant utilisé la promotion */}
                {usageStats.usageByUser &&
                  usageStats.usageByUser.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Utilisateurs récents
                      </h3>
                      <div className="rounded-md border">
                        <table className="min-w-full divide-y divide-border">
                          <thead>
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Utilisateur
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Utilisations
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Dernière utilisation
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {usageStats.usageByUser.map((user) => (
                              <tr key={user.userId}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                  {user.userName}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                  {user.usageCount}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                  {formatDate(user.lastUsed)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Aucune statistique disponible
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Les statistiques d&apos;utilisation seront disponibles une
                  fois que cette promotion aura été utilisée.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div className="flex gap-2">
          {!isActive && !expired && !maxUsageReached && (
            <Button onClick={onActivate} variant="outline" className="gap-1">
              <Power className="h-4 w-4 text-green-500" />
              Activer
            </Button>
          )}
          {isActive && (
            <Button onClick={onDeactivate} variant="outline" className="gap-1">
              <PowerOff className="h-4 w-4 text-amber-500" />
              Désactiver
            </Button>
          )}
          <Button onClick={onEdit} variant="outline" className="gap-1">
            <Edit className="h-4 w-4" />
            Modifier
          </Button>
          <Button
            onClick={() => setIsDeleteDialogOpen(true)}
            variant="destructive"
            className="gap-1"
          >
            <Trash className="h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </CardFooter>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer définitivement la promotion{" "}
              <strong>{promotion.code}</strong> ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete?.();
                setIsDeleteDialogOpen(false);
              }}
            >
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PromotionDetails;
