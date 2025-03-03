"use client";

import React, { useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import ProviderDocumentViewer, {
  ProviderDocument,
} from "@/components/_organisms/ProviderDocumentViewer/ProviderDocumentViewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Cette fonction serait remplacée par un appel API réel
function getProviderDocuments(
  providerId: string
): Promise<{ name: string; documents: ProviderDocument[] }> {
  return new Promise((resolve) => {
    // Simulation d'un délai d'API
    setTimeout(() => {
      // Utilisation du providerId pour simuler une requête API
      console.log(
        `Récupération des documents pour le prestataire ${providerId}`
      );

      // Données fictives pour la démonstration
      resolve({
        name: "Aventure Outdoor",
        documents: [
          {
            id: "doc1",
            name: "Carte d'identité.jpg",
            type: "identity",
            fileType: "image",
            url: "https://images.unsplash.com/photo-1633265486064-086b219458ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            uploadDate: new Date(2023, 8, 10).toISOString(),
            status: "pending",
          },
          {
            id: "doc2",
            name: "Certification professionnelle.pdf",
            type: "certification",
            fileType: "pdf",
            url: "https://example.com/certification.pdf",
            uploadDate: new Date(2023, 8, 9).toISOString(),
            status: "pending",
          },
          {
            id: "doc3",
            name: "Attestation d'assurance.pdf",
            type: "insurance",
            fileType: "pdf",
            url: "https://example.com/insurance.pdf",
            uploadDate: new Date(2023, 8, 8).toISOString(),
            status: "pending",
          },
          {
            id: "doc4",
            name: "Diplôme.jpg",
            type: "certification",
            fileType: "image",
            url: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            uploadDate: new Date(2023, 8, 7).toISOString(),
            status: "approved",
          },
          {
            id: "doc5",
            name: "Justificatif de domicile.pdf",
            type: "other",
            fileType: "pdf",
            url: "https://example.com/address.pdf",
            uploadDate: new Date(2023, 8, 6).toISOString(),
            status: "rejected",
            comment:
              "Document trop ancien (plus de 3 mois). Veuillez fournir un justificatif plus récent.",
          },
        ],
      });
    }, 500);
  });
}

export default function ProviderDocumentsPage() {
  const params = useParams();
  const id = params.id as string;
  const [providerData, setProviderData] = useState<{
    name: string;
    documents: ProviderDocument[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getProviderDocuments(id);
        setProviderData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Une erreur est survenue")
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (isLoading) {
    return <div>Chargement des documents...</div>;
  }

  if (error) {
    return notFound();
  }

  if (!providerData) {
    return notFound();
  }

  const { name, documents } = providerData;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Link href={`/prestataires/${params.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Documents du prestataire</h1>
      </div>

      <ProviderDocumentViewer
        providerId={id}
        providerName={name}
        documents={documents}
        onBack={() => {}}
        onApproveDocument={(docId) =>
          console.log(`Document approuvé: ${docId}`)
        }
        onRejectDocument={(docId, reason) =>
          console.log(`Document rejeté: ${docId}, Raison: ${reason}`)
        }
        onApproveAll={() => console.log("Tous les documents approuvés")}
        onDownload={(docId) => console.log(`Document téléchargé: ${docId}`)}
      />
    </div>
  );
}
