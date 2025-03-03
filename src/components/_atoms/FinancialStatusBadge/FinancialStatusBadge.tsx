"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Types de statut financier
 */
export type FinancialStatusType =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

/**
 * Props du composant FinancialStatusBadge
 */
export interface FinancialStatusBadgeProps {
  /** Statut à afficher */
  status: FinancialStatusType;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant pour afficher un badge de statut financier
 */
export const FinancialStatusBadge: React.FC<FinancialStatusBadgeProps> = ({
  status,
  className,
}) => {
  // Définir les styles en fonction du statut
  const getStatusStyles = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "processing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "failed":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "cancelled":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  // Définir le texte à afficher en fonction du statut
  const getStatusText = () => {
    switch (status) {
      case "pending":
        return "En attente";
      case "processing":
        return "En cours";
      case "completed":
        return "Terminé";
      case "failed":
        return "Échoué";
      case "cancelled":
        return "Annulé";
      default:
        return status;
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(getStatusStyles(), "font-medium", className)}
    >
      {getStatusText()}
    </Badge>
  );
};

export default FinancialStatusBadge;
