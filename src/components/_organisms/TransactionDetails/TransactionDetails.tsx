import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FinancialTransaction } from "@/types/finance";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ArrowUpRight,
  FileDown,
  Printer,
  RefreshCcw,
  XCircle,
} from "lucide-react";
import FinancialStatusBadge from "@/components/_atoms/FinancialStatusBadge/FinancialStatusBadge";
import TransactionTypeBadge from "@/components/_atoms/TransactionTypeBadge/TransactionTypeBadge";
import AmountDisplay from "@/components/_atoms/AmountDisplay/AmountDisplay";
import PaymentMethodIcon from "@/components/_atoms/PaymentMethodIcon/PaymentMethodIcon";

/**
 * Props du composant TransactionDetails
 */
export interface TransactionDetailsProps {
  /** Transaction à afficher */
  transaction: FinancialTransaction;
  /** Indique si le composant est affiché dans une modal */
  isModal?: boolean;
  /** Callback appelé pour fermer la modal */
  onClose?: () => void;
  /** Callback appelé pour télécharger la facture */
  onDownloadInvoice?: (transaction: FinancialTransaction) => void;
  /** Callback appelé pour imprimer la facture */
  onPrintInvoice?: (transaction: FinancialTransaction) => void;
  /** Callback appelé pour relancer une transaction échouée */
  onRetryTransaction?: (transaction: FinancialTransaction) => void;
  /** Callback appelé pour annuler une transaction */
  onCancelTransaction?: (transaction: FinancialTransaction) => void;
  /** Callback appelé pour voir la réservation associée */
  onViewReservation?: (reservationId: string) => void;
  /** Classes CSS additionnelles */
  className?: string;
}

// Type pour les métadonnées de carte
interface CardMetadata {
  cardLast4: string;
  cardBrand?: string;
  cardExpiry?: string;
}

// Fonction utilitaire pour vérifier si les métadonnées contiennent des informations de carte
function hasCardMetadata(
  metadata: Record<string, unknown>
): metadata is Record<string, unknown> & CardMetadata {
  return "cardLast4" in metadata;
}

/**
 * Composant pour afficher les détails d'une transaction financière
 */
export const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transaction,
  isModal = false,
  onClose,
  onDownloadInvoice,
  onPrintInvoice,
  onRetryTransaction,
  onCancelTransaction,
  onViewReservation,
  className,
}) => {
  // Formater les dates
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMMM yyyy 'à' HH:mm", {
      locale: fr,
    });
  };

  // Déterminer si des actions sont disponibles en fonction du statut
  const canRetry = transaction.status === "failed";
  const canCancel = transaction.status === "pending";
  const canDownload =
    transaction.status === "completed" && transaction.type !== "fee";

  // Contenu principal
  const content = (
    <div className={cn("space-y-6", className)}>
      {/* En-tête avec informations principales */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Transaction {transaction.id}
            <TransactionTypeBadge type={transaction.type} className="ml-2" />
          </h2>
          <p className="text-gray-500 mt-1">
            Créée le {formatDate(transaction.createdAt)}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-gray-500">Statut:</span>
            <FinancialStatusBadge status={transaction.status} />
          </div>
          <AmountDisplay
            amount={transaction.amount}
            colorBySign={true}
            className="text-2xl font-bold"
          />
        </div>
      </div>

      <Separator />

      {/* Détails de la transaction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-500">Type</div>
              <div>
                <TransactionTypeBadge type={transaction.type} />
              </div>

              <div className="text-gray-500">Statut</div>
              <div>
                <FinancialStatusBadge status={transaction.status} />
              </div>

              <div className="text-gray-500">Date de création</div>
              <div>{formatDate(transaction.createdAt)}</div>

              <div className="text-gray-500">Dernière mise à jour</div>
              <div>{formatDate(transaction.updatedAt)}</div>

              <div className="text-gray-500">ID de paiement</div>
              <div className="font-mono text-xs">
                {transaction.paymentId || "-"}
              </div>

              <div className="text-gray-500">Méthode de paiement</div>
              <div>
                <PaymentMethodIcon method={transaction.paymentMethod} />
              </div>

              {/* Affichage des détails de la carte si disponibles */}
              {transaction.metadata &&
                typeof transaction.metadata === "object" &&
                hasCardMetadata(transaction.metadata) && (
                  <>
                    <div className="text-gray-500">Carte</div>
                    <div>
                      {transaction.metadata.cardBrand
                        ? String(transaction.metadata.cardBrand).toUpperCase()
                        : ""}{" "}
                      •••• {transaction.metadata.cardLast4}
                      {transaction.metadata.cardExpiry &&
                        ` (${transaction.metadata.cardExpiry})`}
                    </div>
                  </>
                )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Détails financiers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-500">Montant</div>
              <div className="text-right">
                <AmountDisplay amount={transaction.amount} colorBySign={true} />
              </div>

              <div className="text-gray-500">Commission</div>
              <div className="text-right">
                <AmountDisplay amount={transaction.commission} />
              </div>

              <div className="text-gray-500">Montant net</div>
              <div className="text-right font-medium">
                <AmountDisplay
                  amount={transaction.netAmount}
                  colorBySign={true}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Réservation</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={() => onViewReservation?.(transaction.reservationId)}
                >
                  Voir <ArrowUpRight className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Client</span>
                <span>{transaction.customerName || "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Prestataire</span>
                <span>{transaction.providerName || "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Activité</span>
                <span>{transaction.activityName || "-"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions disponibles */}
      <div className="flex flex-wrap gap-3 justify-end">
        {canDownload && (
          <>
            <Button
              variant="outline"
              onClick={() => onDownloadInvoice?.(transaction)}
              className="gap-2"
            >
              <FileDown className="h-4 w-4" />
              Télécharger la facture
            </Button>
            <Button
              variant="outline"
              onClick={() => onPrintInvoice?.(transaction)}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              Imprimer
            </Button>
          </>
        )}

        {canRetry && (
          <Button
            variant="default"
            onClick={() => onRetryTransaction?.(transaction)}
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Réessayer
          </Button>
        )}

        {canCancel && (
          <Button
            variant="destructive"
            onClick={() => onCancelTransaction?.(transaction)}
            className="gap-2"
          >
            <XCircle className="h-4 w-4" />
            Annuler
          </Button>
        )}

        {isModal && (
          <Button variant="ghost" onClick={onClose}>
            Fermer
          </Button>
        )}
      </div>
    </div>
  );

  // Si c'est une modal, envelopper dans DialogContent
  if (isModal) {
    return (
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Détails de la transaction</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    );
  }

  // Sinon, retourner le contenu directement
  return content;
};

/**
 * Composant modal pour afficher les détails d'une transaction
 */
export const TransactionDetailsModal: React.FC<{
  transaction: FinancialTransaction;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDownloadInvoice?: (transaction: FinancialTransaction) => void;
  onPrintInvoice?: (transaction: FinancialTransaction) => void;
  onRetryTransaction?: (transaction: FinancialTransaction) => void;
  onCancelTransaction?: (transaction: FinancialTransaction) => void;
  onViewReservation?: (reservationId: string) => void;
}> = ({
  transaction,
  isOpen,
  onOpenChange,
  onDownloadInvoice,
  onPrintInvoice,
  onRetryTransaction,
  onCancelTransaction,
  onViewReservation,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <TransactionDetails
        transaction={transaction}
        isModal={true}
        onClose={() => onOpenChange(false)}
        onDownloadInvoice={onDownloadInvoice}
        onPrintInvoice={onPrintInvoice}
        onRetryTransaction={onRetryTransaction}
        onCancelTransaction={onCancelTransaction}
        onViewReservation={onViewReservation}
      />
    </Dialog>
  );
};

export default TransactionDetails;
