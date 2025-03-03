"use client";
import React from "react";
import { ProvidersList } from "@/components/_organisms/ProvidersList/ProvidersList";
import { PageHeader } from "@/components/_molecules/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, CheckSquare } from "lucide-react";
import Link from "next/link";

export default function ProvidersPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Gestion des prestataires"
          description="Consultez et gérez les prestataires de la plateforme"
        />
        <div className="flex gap-3">
          <Link href="/prestataires/validation">
            <Button variant="outline" className="flex items-center gap-2">
              <CheckSquare size={16} />
              <span>Validation des prestataires</span>
            </Button>
          </Link>
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            <span>Ajouter un prestataire</span>
          </Button>
        </div>
      </div>

      <ProvidersList
        onSelect={(id) => console.log(`Prestataire sélectionné: ${id}`)}
        onEdit={(id) => console.log(`Éditer le prestataire: ${id}`)}
        onDelete={(id) => console.log(`Supprimer le prestataire: ${id}`)}
        onApprove={(id) => console.log(`Approuver le prestataire: ${id}`)}
        onReject={(id) => console.log(`Rejeter le prestataire: ${id}`)}
      />
    </div>
  );
}
