/**
 * Layout pour la section clients
 */

import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestion des clients | UpFun Dashboard",
  description:
    "Gérez vos clients, consultez leurs informations et leurs réservations.",
};

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
