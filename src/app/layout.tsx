/**
 * Layout principal de l'application
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/provider";
import ClientMainLayout from "@/components/_templates/ClientMainLayout";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

/**
 * Métadonnées de l'application
 */
export const metadata: Metadata = {
  title: "Upfun Dashboard",
  description: "Tableau de bord d'administration pour la plateforme Upfun",
};

/**
 * Layout principal de l'application
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ReduxProvider>
          <ClientMainLayout>{children}</ClientMainLayout>
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
