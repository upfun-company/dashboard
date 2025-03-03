import React from "react";

export const metadata = {
  title: "Sécurité & Paramètres | UpFun Dashboard",
  description:
    "Gérez les rôles, les permissions et les paramètres de sécurité de votre plateforme",
};

export default function SecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
