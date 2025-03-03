"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FinancialTransaction, TransactionFilters } from "@/types/finance";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Eye, FileDown } from "lucide-react";
import TransactionFiltersComponent from "@/components/_molecules/TransactionFilters/TransactionFilters";
import FinancialStatusBadge from "@/components/_atoms/FinancialStatusBadge/FinancialStatusBadge";
import TransactionTypeBadge from "@/components/_atoms/TransactionTypeBadge/TransactionTypeBadge";
import AmountDisplay from "@/components/_atoms/AmountDisplay/AmountDisplay";
import PaymentMethodIcon from "@/components/_atoms/PaymentMethodIcon/PaymentMethodIcon";
import { CustomPagination } from "@/components/ui/custom-pagination";

/**
 * Props du composant TransactionsList
 */
export interface TransactionsListProps {
  /** Transactions à afficher */
  transactions: FinancialTransaction[];
  /** Nombre total de transactions (pour la pagination) */
  totalCount: number;
  /** Page actuelle */
  currentPage: number;
  /** Nombre de transactions par page */
  pageSize: number;
  /** Filtres actuels */
  filters: TransactionFilters;
  /** Callback appelé lors du changement de page */
  onPageChange: (page: number) => void;
  /** Callback appelé lors du changement de filtres */
  onFiltersChange: (filters: TransactionFilters) => void;
  /** Callback appelé lors du clic sur une transaction */
  onTransactionClick?: (transaction: FinancialTransaction) => void;
  /** Callback appelé lors de l'export des transactions */
  onExportTransactions?: () => void;
  /** Indique si les données sont en cours de chargement */
  isLoading?: boolean;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant pour afficher une liste de transactions financières
 */
export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  totalCount,
  currentPage,
  pageSize,
  filters,
  onPageChange,
  onFiltersChange,
  onTransactionClick,
  onExportTransactions,
  isLoading = false,
  className,
}) => {
  // Calculer le nombre total de pages
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <Button
          variant="outline"
          onClick={onExportTransactions}
          className="gap-2"
        >
          <FileDown className="h-4 w-4" />
          Exporter en CSV
        </Button>
      </div>

      <TransactionFiltersComponent
        filters={filters}
        onFiltersChange={onFiltersChange}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Prestataire</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead className="text-right">Commission</TableHead>
              <TableHead className="text-right">Net</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Afficher des lignes de chargement
              Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell
                    colSpan={11}
                    className="h-12 animate-pulse bg-gray-100"
                  ></TableCell>
                </TableRow>
              ))
            ) : transactions.length === 0 ? (
              // Afficher un message si aucune transaction
              <TableRow>
                <TableCell colSpan={11} className="h-24 text-center">
                  Aucune transaction trouvée
                </TableCell>
              </TableRow>
            ) : (
              // Afficher les transactions
              transactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    console.log("Row clicked:", transaction.id);
                    onTransactionClick?.(transaction);
                  }}
                >
                  <TableCell className="font-mono text-xs">
                    {transaction.id.split("-")[1]}
                  </TableCell>
                  <TableCell>
                    {format(new Date(transaction.createdAt), "dd/MM/yyyy", {
                      locale: fr,
                    })}
                  </TableCell>
                  <TableCell>
                    <TransactionTypeBadge type={transaction.type} />
                  </TableCell>
                  <TableCell>
                    <FinancialStatusBadge status={transaction.status} />
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {transaction.customerName || "-"}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {transaction.providerName || "-"}
                  </TableCell>
                  <TableCell>
                    <PaymentMethodIcon method={transaction.paymentMethod} />
                  </TableCell>
                  <TableCell className="text-right">
                    <AmountDisplay
                      amount={transaction.amount}
                      colorBySign={true}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <AmountDisplay
                      amount={transaction.commission}
                      colorBySign={false}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <AmountDisplay
                      amount={transaction.netAmount}
                      colorBySign={true}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTransactionClick?.(transaction);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
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
    </div>
  );
};

export default TransactionsList;
