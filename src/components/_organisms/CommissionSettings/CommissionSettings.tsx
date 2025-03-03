"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CommissionConfig } from "@/types/finance";
import { cn } from "@/lib/utils";
import { Edit, Plus, Trash } from "lucide-react";
import { AmountDisplay } from "@/components/_atoms/AmountDisplay/AmountDisplay";

/**
 * Props du composant CommissionSettings
 */
export interface CommissionSettingsProps {
  /** Configurations de commission à afficher */
  commissions: CommissionConfig[];
  /** Callback appelé lors de l'ajout d'une commission */
  onAddCommission?: (
    commission: Omit<CommissionConfig, "id" | "createdAt" | "updatedAt">
  ) => void;
  /** Callback appelé lors de la modification d'une commission */
  onUpdateCommission?: (id: string, updates: Partial<CommissionConfig>) => void;
  /** Callback appelé lors de la suppression d'une commission */
  onDeleteCommission?: (id: string) => void;
  /** Indique si les données sont en cours de chargement */
  isLoading?: boolean;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant pour gérer les configurations de commission
 */
const CommissionSettings: React.FC<CommissionSettingsProps> = ({
  commissions = [],
  onAddCommission,
  onUpdateCommission,
  onDeleteCommission,
  isLoading = false,
  className,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCommission, setEditingCommission] =
    useState<CommissionConfig | null>(null);
  const [formData, setFormData] = useState<Partial<CommissionConfig>>({
    name: "",
    type: "percentage",
    value: 0,
    minAmount: undefined,
    maxAmount: undefined,
    applicableTo: "all",
    categoryId: undefined,
    categoryName: undefined,
    providerId: undefined,
    providerName: undefined,
    isActive: true,
  });

  // Ouvrir le dialogue pour ajouter une nouvelle commission
  const handleAddCommission = () => {
    setEditingCommission(null);
    setFormData({
      name: "",
      type: "percentage",
      value: 0,
      minAmount: undefined,
      maxAmount: undefined,
      applicableTo: "all",
      categoryId: undefined,
      categoryName: undefined,
      providerId: undefined,
      providerName: undefined,
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  // Ouvrir le dialogue pour modifier une commission existante
  const handleEditCommission = (commission: CommissionConfig) => {
    setEditingCommission(commission);
    setFormData({
      name: commission.name,
      type: commission.type,
      value: commission.value,
      minAmount: commission.minAmount,
      maxAmount: commission.maxAmount,
      applicableTo: commission.applicableTo,
      categoryId: commission.categoryId,
      categoryName: commission.categoryName,
      providerId: commission.providerId,
      providerName: commission.providerName,
      isActive: commission.isActive,
    });
    setIsDialogOpen(true);
  };

  // Gérer les changements dans le formulaire
  const handleFormChange = (field: string, value: unknown) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Soumettre le formulaire
  const handleSubmit = () => {
    if (editingCommission) {
      onUpdateCommission?.(editingCommission.id, formData);
    } else {
      onAddCommission?.(
        formData as Omit<CommissionConfig, "id" | "createdAt" | "updatedAt">
      );
    }
    setIsDialogOpen(false);
  };

  // Formater la valeur de la commission pour l'affichage
  const formatCommissionValue = (commission: CommissionConfig) => {
    if (commission.type === "percentage") {
      return `${commission.value}%`;
    } else {
      return <AmountDisplay amount={commission.value} />;
    }
  };

  // Formater le champ d'application pour l'affichage
  const formatApplicableTo = (commission: CommissionConfig) => {
    switch (commission.applicableTo) {
      case "all":
        return "Toutes les activités";
      case "category":
        return `Catégorie: ${commission.categoryName || "-"}`;
      case "provider":
        return `Prestataire: ${commission.providerName || "-"}`;
      default:
        return commission.applicableTo;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Configuration des commissions</h2>
        <Button onClick={handleAddCommission} className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter une commission
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Valeur</TableHead>
              <TableHead>Min/Max</TableHead>
              <TableHead>Applicable à</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Afficher des lignes de chargement
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell
                    colSpan={7}
                    className="h-12 animate-pulse bg-gray-100"
                  ></TableCell>
                </TableRow>
              ))
            ) : commissions.length === 0 ? (
              // Afficher un message si aucune commission
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Aucune configuration de commission trouvée
                </TableCell>
              </TableRow>
            ) : (
              // Afficher les commissions
              commissions.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell className="font-medium">
                    {commission.name}
                  </TableCell>
                  <TableCell>
                    {commission.type === "percentage"
                      ? "Pourcentage"
                      : "Montant fixe"}
                  </TableCell>
                  <TableCell>{formatCommissionValue(commission)}</TableCell>
                  <TableCell>
                    {commission.minAmount ? (
                      <span>
                        Min: <AmountDisplay amount={commission.minAmount} />
                      </span>
                    ) : null}
                    {commission.minAmount && commission.maxAmount ? (
                      <br />
                    ) : null}
                    {commission.maxAmount ? (
                      <span>
                        Max: <AmountDisplay amount={commission.maxAmount} />
                      </span>
                    ) : null}
                    {!commission.minAmount && !commission.maxAmount
                      ? "-"
                      : null}
                  </TableCell>
                  <TableCell>{formatApplicableTo(commission)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "h-2.5 w-2.5 rounded-full mr-2",
                          commission.isActive ? "bg-green-500" : "bg-gray-400"
                        )}
                      />
                      <span>{commission.isActive ? "Actif" : "Inactif"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditCommission(commission)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => onDeleteCommission?.(commission.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogue pour ajouter/modifier une commission */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCommission
                ? "Modifier la commission"
                : "Ajouter une commission"}
            </DialogTitle>
            <DialogDescription>
              {editingCommission
                ? "Modifiez les détails de la configuration de commission"
                : "Ajoutez une nouvelle configuration de commission"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                placeholder="Commission standard"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleFormChange("type", value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Pourcentage</SelectItem>
                    <SelectItem value="fixed">Montant fixe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="value">
                  {formData.type === "percentage"
                    ? "Pourcentage (%)"
                    : "Montant (€)"}
                </Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) =>
                    handleFormChange("value", parseFloat(e.target.value) || 0)
                  }
                  min={0}
                  step={formData.type === "percentage" ? 0.1 : 0.01}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="minAmount">Montant minimum (€)</Label>
                <Input
                  id="minAmount"
                  type="number"
                  value={formData.minAmount || ""}
                  onChange={(e) =>
                    handleFormChange(
                      "minAmount",
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                  min={0}
                  step={0.01}
                  placeholder="Optionnel"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="maxAmount">Montant maximum (€)</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  value={formData.maxAmount || ""}
                  onChange={(e) =>
                    handleFormChange(
                      "maxAmount",
                      e.target.value ? parseFloat(e.target.value) : undefined
                    )
                  }
                  min={0}
                  step={0.01}
                  placeholder="Optionnel"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="applicableTo">Applicable à</Label>
              <Select
                value={formData.applicableTo}
                onValueChange={(value) =>
                  handleFormChange("applicableTo", value)
                }
              >
                <SelectTrigger id="applicableTo">
                  <SelectValue placeholder="Sélectionner une portée" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les activités</SelectItem>
                  <SelectItem value="category">Catégorie spécifique</SelectItem>
                  <SelectItem value="provider">
                    Prestataire spécifique
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.applicableTo === "category" && (
              <div className="grid gap-2">
                <Label htmlFor="categoryName">Nom de la catégorie</Label>
                <Input
                  id="categoryName"
                  value={formData.categoryName || ""}
                  onChange={(e) =>
                    handleFormChange("categoryName", e.target.value)
                  }
                  placeholder="Nom de la catégorie"
                />
              </div>
            )}

            {formData.applicableTo === "provider" && (
              <div className="grid gap-2">
                <Label htmlFor="providerName">Nom du prestataire</Label>
                <Input
                  id="providerName"
                  value={formData.providerName || ""}
                  onChange={(e) =>
                    handleFormChange("providerName", e.target.value)
                  }
                  placeholder="Nom du prestataire"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked: boolean) =>
                  handleFormChange("isActive", checked)
                }
              />
              <Label htmlFor="isActive">Actif</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {editingCommission ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommissionSettings;
