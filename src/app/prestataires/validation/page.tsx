"use client";

import React from "react";
import PendingProvidersList from "@/components/_organisms/PendingProvidersList/PendingProvidersList";
import { PageHeader } from "@/components/_molecules/PageHeader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { generateMockPendingProviders } from "@/mocks/providersMocks";

export default function ProviderValidationPage() {
  // Génération de données fictives pour la démonstration
  const mockPendingProviders = generateMockPendingProviders(5);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/prestataires">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <PageHeader
          title="Validation des prestataires"
          description="Examinez et validez les prestataires en attente d'approbation"
        />
      </div>

      <PendingProvidersList
        providers={mockPendingProviders}
        title="Prestataires en attente de validation"
        maxProviders={10}
        onApprove={(id) => console.log(`Approuver le prestataire: ${id}`)}
        onReject={(id) => console.log(`Rejeter le prestataire: ${id}`)}
        onViewDetails={(id) =>
          console.log(`Voir les détails du prestataire: ${id}`)
        }
      />
    </div>
  );
}
