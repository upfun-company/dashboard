"use client";
import React from "react";
import { cn } from "@/lib/utils";

/**
 * Props du composant AmountDisplay
 */
export interface AmountDisplayProps {
  /** Montant à afficher */
  amount: number;
  /** Devise (par défaut EUR) */
  currency?: string;
  /** Afficher le signe + pour les montants positifs */
  showPlusSign?: boolean;
  /** Afficher en rouge/vert selon le signe */
  colorBySign?: boolean;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant pour afficher un montant financier formaté
 */
export const AmountDisplay: React.FC<AmountDisplayProps> = ({
  amount,
  currency = "EUR",
  showPlusSign = false,
  colorBySign = false,
  className,
}) => {
  // Formater le montant avec la devise
  const formattedAmount = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  // Ajouter le signe + si demandé et si le montant est positif
  const displayAmount =
    amount > 0 && showPlusSign ? `+${formattedAmount}` : formattedAmount;

  // Déterminer la couleur en fonction du signe
  const getColorClass = () => {
    if (!colorBySign) return "";

    if (amount > 0) return "text-green-600";
    if (amount < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <span className={cn("font-medium", getColorClass(), className)}>
      {displayAmount}
    </span>
  );
};

export default AmountDisplay;
