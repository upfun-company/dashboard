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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ProviderPayout,
  PayoutFilters,
  TransactionFilters,
} from "@/types/finance";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Eye, FileDown, Play, Plus, RefreshCcw } from "lucide-react";
import FinancialStatusBadge from "@/components/_atoms/FinancialStatusBadge/FinancialStatusBadge";
import AmountDisplay from "@/components/_atoms/AmountDisplay/AmountDisplay";
import TransactionFiltersComponent from "@/components/_molecules/TransactionFilters/TransactionFilters";
import { CustomPagination } from "@/components/ui/custom-pagination";

/**
 * Props du composant ProviderPayoutsList
 */
export interface ProviderPayoutsListProps {
  /** Paiements aux prestataires à afficher */
  payouts: ProviderPayout[];
  /** Nombre total de paiements (pour la pagination) */
  totalCount: number;
  /** Page actuelle */
  currentPage: number;
  /** Nombre de paiements par page */
  pageSize: number;
  /** Filtres actuels */
  filters: PayoutFilters;
  /** Callback appelé lors du changement de page */
  onPageChange: (page: number) => void;
  /** Callback appelé lors du changement de filtres */
  onFiltersChange: (filters: PayoutFilters) => void;
  /** Callback appelé lors du clic sur un paiement */
  onPayoutClick?: (payout: ProviderPayout) => void;
  /** Callback appelé lors de l'export des paiements */
  onExportPayouts?: () => void;
  /** Callback appelé pour créer un nouveau paiement */
  onCreatePayout?: (
    payout: Omit<ProviderPayout, "id" | "createdAt" | "status" | "transactions">
  ) => void;
  /** Callback appelé pour traiter un paiement */
  onProcessPayout?: (payoutId: string) => void;
  /** Indique si les données sont en cours de chargement */
  isLoading?: boolean;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant pour afficher une liste de paiements aux prestataires
 */
export const ProviderPayoutsList: React.FC<ProviderPayoutsListProps> = ({
  payouts,
  totalCount,
  currentPage,
  pageSize,
  filters,
  onPageChange,
  onFiltersChange,
  onPayoutClick,
  onExportPayouts,
  onCreatePayout,
  onProcessPayout,
  isLoading = false,
  className,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<{
    providerId: string;
    providerName: string;
    amount: number;
    method: "bank_transfer" | "paypal" | "other";
    notes?: string;
  }>({
    providerId: "",
    providerName: "",
    amount: 0,
    method: "bank_transfer",
    notes: "",
  });

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(totalCount / pageSize);

  // Gérer les changements dans le formulaire
  const handleFormChange = (field: string, value: string | number) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Soumettre le formulaire
  const handleSubmit = () => {
    onCreatePayout?.(formData);
    setIsDialogOpen(false);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Paiements aux prestataires</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onExportPayouts} className="gap-2">
            <FileDown className="h-4 w-4" />
            Exporter en CSV
          </Button>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau paiement
          </Button>
        </div>
      </div>

      <TransactionFiltersComponent
        filters={filters as unknown as TransactionFilters}
        onFiltersChange={
          onFiltersChange as unknown as (filters: TransactionFilters) => void
        }
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Prestataire</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead>Référence</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Afficher des lignes de chargement
              Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell
                    colSpan={8}
                    className="h-12 animate-pulse bg-gray-100"
                  ></TableCell>
                </TableRow>
              ))
            ) : payouts.length === 0 ? (
              // Afficher un message si aucun paiement
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Aucun paiement trouvé
                </TableCell>
              </TableRow>
            ) : (
              // Afficher les paiements
              payouts.map((payout) => (
                <TableRow
                  key={payout.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onPayoutClick?.(payout)}
                >
                  <TableCell className="font-mono text-xs">
                    {payout.id.split("-")[1]}
                  </TableCell>
                  <TableCell>
                    {format(new Date(payout.createdAt), "dd/MM/yyyy", {
                      locale: fr,
                    })}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {payout.providerName}
                  </TableCell>
                  <TableCell>
                    {payout.method === "bank_transfer"
                      ? "Virement bancaire"
                      : payout.method === "paypal"
                      ? "PayPal"
                      : "Autre"}
                  </TableCell>
                  <TableCell>
                    <FinancialStatusBadge status={payout.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <AmountDisplay amount={payout.amount} />
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {payout.reference || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPayoutClick?.(payout);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {payout.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-green-600 hover:text-green-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            onProcessPayout?.(payout.id);
                          }}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      {payout.status === "failed" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-amber-600 hover:text-amber-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            onProcessPayout?.(payout.id);
                          }}
                        >
                          <RefreshCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {/* Dialogue pour créer un nouveau paiement */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Créer un nouveau paiement</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour effectuer un paiement à un
              prestataire
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="providerName">Nom du prestataire</Label>
              <Input
                id="providerName"
                value={formData.providerName}
                onChange={(e) =>
                  handleFormChange("providerName", e.target.value)
                }
                placeholder="Nom du prestataire"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="providerId">ID du prestataire</Label>
              <Input
                id="providerId"
                value={formData.providerId}
                onChange={(e) => handleFormChange("providerId", e.target.value)}
                placeholder="ID du prestataire"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Montant (€)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  handleFormChange("amount", parseFloat(e.target.value) || 0)
                }
                min={0}
                step={0.01}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="method">Méthode de paiement</Label>
              <Select
                value={formData.method}
                onValueChange={(value: "bank_transfer" | "paypal" | "other") =>
                  handleFormChange("method", value)
                }
              >
                <SelectTrigger id="method">
                  <SelectValue placeholder="Sélectionner une méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">
                    Virement bancaire
                  </SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => handleFormChange("notes", e.target.value)}
                placeholder="Notes additionnelles"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>Créer le paiement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProviderPayoutsList;
