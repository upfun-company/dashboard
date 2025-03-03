/**
 * Composant PendingProvidersList - Affiche la liste des prestataires en attente de validation
 */

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ProviderCard from "@/components/_molecules/ProviderCard";
import { cn } from "@/lib/utils";
import { Provider } from "@/types";

/**
 * Props pour le composant PendingProvidersList
 */
interface PendingProvidersListProps {
  /** Liste des prestataires */
  providers: Provider[];
  /** Titre de la section */
  title?: string;
  /** Nombre maximum de prestataires à afficher */
  maxProviders?: number;
  /** Classes CSS additionnelles */
  className?: string;
  /** Fonction appelée lors de l'approbation d'un prestataire */
  onApprove?: (id: string) => void;
  /** Fonction appelée lors du rejet d'un prestataire */
  onReject?: (id: string) => void;
  /** Fonction appelée pour voir les détails d'un prestataire */
  onViewDetails?: (id: string) => void;
}

/**
 * Composant PendingProvidersList - Affiche la liste des prestataires en attente de validation
 */
const PendingProvidersList = ({
  providers,
  title = "Prestataires en attente",
  maxProviders = 3,
  className,
  onApprove,
  onReject,
  onViewDetails,
}: PendingProvidersListProps) => {
  // Filtre les prestataires en attente et limite leur nombre
  const pendingProviders = providers
    .filter((provider) => provider.status === "pending")
    .slice(0, maxProviders);

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingProviders.length > 0 ? (
            pendingProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                id={provider.id}
                name={provider.name}
                email={provider.email}
                category={provider.category}
                registrationDate={provider.createdAt}
                status={provider.status}
                avatarUrl={provider.avatarUrl}
                onApprove={onApprove}
                onReject={onReject}
                onViewDetails={onViewDetails}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Aucun prestataire en attente
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingProvidersList;
