"use client";

/**
 * Composant ClientMainLayout - Wrapper client pour le MainLayout
 */

import React from "react";
import { usePathname } from "next/navigation";
import MainLayout from "@/components/_templates/MainLayout/MainLayout";
import type { Alert as AlertType } from "@/components/_organisms/AlertsList";
import { alerts as dashboardAlerts } from "@/mocks/dashboardMocks";

/**
 * Props pour le composant ClientMainLayout
 */
interface ClientMainLayoutProps {
  /** Contenu à afficher */
  children: React.ReactNode;
}

/**
 * Fonction pour déterminer le type d'alerte en fonction du contenu
 */
function determineAlertType(
  alert: (typeof dashboardAlerts)[0]
): "reservation" | "provider" | "payment" | "system" {
  const title = alert.title ? alert.title.toLowerCase() : "";
  const message = alert.message ? alert.message.toLowerCase() : "";

  if (title.includes("réservation") || message.includes("réservation")) {
    return "reservation";
  } else if (title.includes("prestataire") || message.includes("prestataire")) {
    return "provider";
  } else if (title.includes("paiement") || message.includes("paiement")) {
    return "payment";
  } else {
    return "system";
  }
}

/**
 * Composant ClientMainLayout - Wrapper client pour le MainLayout
 * Permet d'utiliser usePathname() pour déterminer si on est sur la page de login
 */
export default function ClientMainLayout({ children }: ClientMainLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // Déterminer le titre de la page en fonction du chemin
  const getPageTitle = () => {
    // Analyse du chemin pour déterminer le titre approprié
    if (pathname === "/") return "Tableau de bord";
    if (pathname === "/prestataires") return "Gestion des prestataires";
    if (pathname === "/clients") return "Gestion des clients";
    if (pathname === "/reservations") return "Gestion des réservations";
    if (pathname === "/analytics") return "Analyses et statistiques";
    if (pathname === "/offres") return "Gestion des offres";
    if (pathname.match(/\/offres\/[^\/]+$/)) return "Détail de l'offre";
    if (pathname === "/promotions") return "Gestion des promotions";
    if (pathname.match(/\/promotions\/[^\/]+$/))
      return "Détail de la promotion";
    if (pathname === "/finance") return "Gestion financière";
    if (pathname === "/finance/transactions") return "Transactions financières";
    if (pathname === "/finance/payouts") return "Paiements aux prestataires";
    if (pathname === "/finance/commissions") return "Gestion des commissions";
    if (pathname.match(/\/finance\/transactions\/[^\/]+$/))
      return "Détail de la transaction";
    if (pathname.match(/\/finance\/payouts\/[^\/]+$/))
      return "Détail du paiement";
    if (pathname === "/prestataires/validation")
      return "Validation des prestataires";
    if (pathname.match(/\/prestataires\/[^\/]+$/))
      return "Détails du prestataire";
    if (pathname.match(/\/prestataires\/[^\/]+\/documents$/))
      return "Documents du prestataire";

    return "Upfun Dashboard";
  };

  // Préparation des données pour les alertes
  const alertsData: AlertType[] = dashboardAlerts.map((alert) => ({
    id: alert.id,
    type: determineAlertType(alert),
    message: alert.message,
    severity: alert.type as "info" | "warning" | "error" | "success",
    date: alert.createdAt,
    link: undefined,
  }));

  // Si on est sur la page de login, on n'affiche pas le MainLayout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Pour toutes les autres pages, on utilise le MainLayout avec le titre approprié
  return (
    <MainLayout
      pageTitle={getPageTitle()}
      user={{ name: "Admin", role: "Administrateur" }}
      notificationCount={alertsData.length}
    >
      {children}
    </MainLayout>
  );
}
