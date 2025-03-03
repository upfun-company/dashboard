/**
 * Utilitaires de formatage pour l'application
 */

import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Formate une date en format français
 * @param dateString - Chaîne de date à formater
 * @param formatString - Format de sortie (par défaut: dd MMM yyyy)
 * @returns Date formatée ou chaîne originale si invalide
 */
export const formatDate = (
  dateString: string,
  formatString: string = "dd MMM yyyy"
) => {
  try {
    // Vérifier si la date est déjà formatée
    if (dateString.includes("/") || dateString.includes(" ")) {
      return dateString;
    }
    return format(parseISO(dateString), formatString, { locale: fr });
  } catch {
    return dateString;
  }
};

/**
 * Formate un montant en euros
 * @param amount - Montant à formater
 * @returns Montant formaté en euros
 */
export const formatAmount = (amount?: number) => {
  if (amount === undefined) return "0 €";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Génère les initiales à partir d'un nom
 * @param name - Nom complet
 * @returns Initiales (max 2 caractères)
 */
export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Détermine la variante du badge de statut
 * @param status - Statut du prestataire
 * @returns Variante du badge
 */
export const getStatusBadgeVariant = (status: string) => {
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
 * Traduit le statut en français
 * @param status - Statut en anglais
 * @returns Statut traduit en français
 */
export const translateStatus = (status: string) => {
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
