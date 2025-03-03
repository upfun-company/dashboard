/**
 * Composant GlobalLoader - Affiche un indicateur de chargement global
 */

import React from "react";
import { useAppSelector } from "@/redux/hooks";
import { Loader2 } from "lucide-react";

/**
 * Props pour le composant GlobalLoader
 */
interface GlobalLoaderProps {
  /** Message à afficher pendant le chargement */
  message?: string;
}

/**
 * Composant GlobalLoader - Affiche un indicateur de chargement global
 */
const GlobalLoader = ({
  message = "Chargement en cours...",
}: GlobalLoaderProps) => {
  // Récupérer l'état de chargement global depuis Redux
  const { isGlobalLoading } = useAppSelector((state) => state.loading);

  if (!isGlobalLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center rounded-lg bg-white/15 p-6 backdrop-blur">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-center text-xl font-semibold text-white">
          {message}
        </p>
      </div>
    </div>
  );
};

export default GlobalLoader;
