"use client";
import React from "react";
import {
  CreditCard,
  Banknote,
  CreditCardIcon,
  AppleIcon,
  SmartphoneIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Types de méthode de paiement
 */
export type PaymentMethodType =
  | "card"
  | "paypal"
  | "apple_pay"
  | "google_pay"
  | "bank_transfer";

/**
 * Props du composant PaymentMethodIcon
 */
export interface PaymentMethodIconProps {
  /** Méthode de paiement à afficher */
  method: PaymentMethodType;
  /** Taille de l'icône */
  size?: number;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant pour afficher une icône de méthode de paiement
 */
export const PaymentMethodIcon: React.FC<PaymentMethodIconProps> = ({
  method,
  size = 16,
  className,
}) => {
  // Sélectionner l'icône en fonction de la méthode
  const renderIcon = () => {
    switch (method) {
      case "card":
        return <CreditCard size={size} />;
      case "paypal":
        return <CreditCardIcon size={size} />;
      case "apple_pay":
        return <AppleIcon size={size} />;
      case "google_pay":
        return <SmartphoneIcon size={size} />;
      case "bank_transfer":
        return <Banknote size={size} />;
      default:
        return <CreditCard size={size} />;
    }
  };

  // Obtenir le texte de la méthode
  const getMethodText = () => {
    switch (method) {
      case "card":
        return "Carte bancaire";
      case "paypal":
        return "PayPal";
      case "apple_pay":
        return "Apple Pay";
      case "google_pay":
        return "Google Pay";
      case "bank_transfer":
        return "Virement bancaire";
      default:
        return method;
    }
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {renderIcon()}
      <span className="text-sm">{getMethodText()}</span>
    </div>
  );
};

export default PaymentMethodIcon;
