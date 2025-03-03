"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Types de transaction
 */
export type TransactionType = "payment" | "refund" | "payout" | "fee";

/**
 * Props du composant TransactionTypeBadge
 */
export interface TransactionTypeBadgeProps {
  /** Type de transaction à afficher */
  type: TransactionType;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant pour afficher un badge de type de transaction
 */
export const TransactionTypeBadge: React.FC<TransactionTypeBadgeProps> = ({
  type,
  className,
}) => {
  // Définir les styles en fonction du type
  const getTypeStyles = () => {
    switch (type) {
      case "payment":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "refund":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "payout":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "fee":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  // Définir le texte à afficher en fonction du type
  const getTypeText = () => {
    switch (type) {
      case "payment":
        return "Paiement";
      case "refund":
        return "Remboursement";
      case "payout":
        return "Versement";
      case "fee":
        return "Commission";
      default:
        return type;
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(getTypeStyles(), "font-medium", className)}
    >
      {getTypeText()}
    </Badge>
  );
};

export default TransactionTypeBadge;
